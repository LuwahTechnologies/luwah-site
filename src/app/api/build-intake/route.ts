import { NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { signPayload } from "@/lib/signPayload";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { notifyEmail } from "@/lib/notifyEmail";
import { reportError } from "@/lib/report";

// Whitelist of accepted string fields, mapped straight onto the buildIntake doc.
const STRING_FIELDS = [
  "businessName", "contactName", "email", "phone", "industry", "location",
  "tagline", "mission", "elevatorPitch", "primaryGoal", "targetAudience",
  "mainCta", "problemSolved", "tier", "hasLogo", "brandColors", "fonts",
  "vibe", "referenceSites", "avoid", "otherPages", "homeSections",
  "aboutContent", "services", "hasTestimonials", "testimonials", "otherCopy",
  "customForm", "bookingTool", "needsPayments", "automationPreference",
  "otherTools", "mediaNotes", "hasDomain", "domainName", "registrar",
  "hostingPreference", "timeline", "budget", "anythingElse", "printedName",
  "currentSite", "businessHours", "address", "socialLinks",
  "keywords", "contentOwner", "assetsLink", "decisionMaker",
];
const ARRAY_FIELDS = ["pages", "media", "forms", "addons"];

function cleanString(v: unknown): string {
  return typeof v === "string" ? v.slice(0, 5000) : "";
}
function cleanArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").map((x) => x.slice(0, 200)) : [];
}

/**
 * POST /api/build-intake
 * Receives the 9-section build intake from the /intake wizard. Verifies
 * Turnstile, stores it as a `buildIntake` document for the admin Studio, and
 * optionally forwards to n8n.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "build-intake"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();

    if (!body.businessName || !body.contactName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: business name, contact name, email" },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!(await verifyTurnstile(body.turnstile_token))) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 });
    }

    const submissionId = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    const ipHash = crypto
      .createHash("sha256")
      .update(request.headers.get("x-forwarded-for") || "unknown")
      .digest("hex")
      .slice(0, 16);

    const doc: Record<string, unknown> = {
      _type: "buildIntake",
      status: "new",
      submissionId,
      submittedAt,
      ipHash,
      agreed: body.agreed === true,
    };
    for (const f of STRING_FIELDS) doc[f] = cleanString(body[f]);
    for (const f of ARRAY_FIELDS) doc[f] = cleanArray(body[f]);

    let stored = false;
    if (writeClient) {
      try {
        await writeClient.create(doc as never);
        stored = true;
      } catch (err) {
        reportError("api.build-intake.store", err);
      }
    }

    if (stored) {
      const business = cleanString(body.businessName);
      await notifyEmail({
        subject: `New Luwah Technologies Build Intake from ${business}`,
        heading: `New website build intake from ${business}`,
        badge: "New Lead",
        rows: [
          { label: "Business", value: business },
          { label: "Contact", value: cleanString(body.contactName) },
          { label: "Email", value: cleanString(body.email) },
          { label: "Phone", value: cleanString(body.phone) },
          { label: "Tier", value: cleanString(body.tier) },
          { label: "Add-ons", value: cleanArray(body.addons).join(", ") },
          { label: "Current site", value: cleanString(body.currentSite) },
          { label: "Files", value: cleanString(body.assetsLink) },
          { label: "Timeline", value: cleanString(body.timeline) },
          { label: "Budget", value: cleanString(body.budget) },
        ],
        note: "Review the full intake in Studio under Build Intakes.",
        ctaUrl: "https://luwahtechnologies.com/studio/structure/buildIntakes",
        ctaLabel: "View in Studio",
      });
    }

    const webhookUrl = process.env.N8N_WEB_WEBHOOK_URL;
    let delivered = false;
    if (webhookUrl) {
      const payload = { form_type: "build-intake", ...doc, _type: undefined };
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signPayload(payload),
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });
        delivered = res.ok;
      } catch (err) {
        reportError("api.build-intake.n8n", err);
      }
    }

    if (!stored && !delivered) {
      return NextResponse.json(
        { error: "Intake could not be saved. Please email hello@luwahtechnologies.com" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, submission_id: submissionId });
  } catch (error) {
    reportError("api.build-intake", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
