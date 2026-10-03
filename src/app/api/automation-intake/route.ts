import { NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { notifyEmail } from "@/lib/notifyEmail";
import { reportError } from "@/lib/report";
import {
  AUTOMATION_BUDGET_OPTIONS,
  AUTOMATION_HOSTING_OPTIONS,
  AUTOMATION_TOOL_OPTIONS,
  EMAIL_RE,
  TIMELINE_OPTIONS,
  isValidHours,
  isValidLink,
} from "@/lib/intakeOptions";

// Whitelist of accepted string fields, mapped straight onto the automationIntake doc.
const STRING_FIELDS = [
  "contactName", "email", "phone", "processDescription", "otherTools", "trigger",
  "destination", "currentStateLink", "successDescription", "hosting", "timeline",
  "budget", "printedName",
];
const ARRAY_FIELDS = ["currentTools"];
const ALLOWED_KEYS = new Set([...STRING_FIELDS, ...ARRAY_FIELDS, "hoursPerWeek", "agreed", "turnstile_token"]);
const REQUIRED = [
  "contactName", "email", "phone", "processDescription", "trigger", "destination",
  "successDescription", "hosting", "printedName",
];

function cleanString(v: unknown): string {
  return typeof v === "string" ? v.slice(0, 5000) : "";
}
function cleanArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").map((x) => x.slice(0, 200)) : [];
}

/**
 * POST /api/automation-intake
 * Receives the automation intake from the /intake/automation wizard. Verifies
 * Turnstile and stores it as an `automationIntake` document for the admin Studio.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "automation-intake"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const parsed: unknown = await request.json().catch(() => null);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const body = parsed as Record<string, unknown>;

    const unexpected = Object.keys(body).find((k) => !ALLOWED_KEYS.has(k));
    if (unexpected !== undefined) {
      return NextResponse.json({ error: `Unexpected field: ${unexpected}` }, { status: 400 });
    }

    if (REQUIRED.some((f) => cleanString(body[f]).trim() === "") || body.agreed !== true) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_RE.test(cleanString(body.email))) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const timeline = cleanString(body.timeline);
    const budget = cleanString(body.budget);
    const tools = cleanArray(body.currentTools);
    const hoursRaw = body.hoursPerWeek;
    const hoursInvalid =
      hoursRaw !== undefined && (typeof hoursRaw !== "string" || !isValidHours(hoursRaw));
    if (
      !AUTOMATION_HOSTING_OPTIONS.includes(cleanString(body.hosting)) ||
      (timeline !== "" && !TIMELINE_OPTIONS.includes(timeline)) ||
      (budget !== "" && !AUTOMATION_BUDGET_OPTIONS.includes(budget)) ||
      tools.some((t) => !AUTOMATION_TOOL_OPTIONS.includes(t)) ||
      hoursInvalid ||
      !isValidLink(cleanString(body.currentStateLink))
    ) {
      return NextResponse.json({ error: "Invalid field value" }, { status: 400 });
    }

    if (!(await verifyTurnstile(body.turnstile_token as string | undefined))) {
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
      _type: "automationIntake",
      status: "new",
      submissionId,
      submittedAt,
      ipHash,
      agreed: true,
    };
    for (const f of STRING_FIELDS) doc[f] = cleanString(body[f]);
    for (const f of ARRAY_FIELDS) doc[f] = cleanArray(body[f]);
    const hoursTrimmed = typeof hoursRaw === "string" ? hoursRaw.trim() : "";
    if (hoursTrimmed !== "") doc.hoursPerWeek = Number(hoursTrimmed);

    let stored = false;
    if (writeClient) {
      try {
        await writeClient.create(doc as never);
        stored = true;
      } catch (err) {
        reportError("api.automation-intake.store", err);
      }
    }

    if (stored) {
      const contactName = cleanString(body.contactName);
      const otherTools = cleanString(body.otherTools);
      const toolsLabel = `${tools.join(", ")}${otherTools ? `${tools.length ? ", " : ""}Other: ${otherTools}` : ""}`;
      await notifyEmail({
        subject: `New Luwah Technologies Automation Intake from ${contactName}`,
        heading: `New automation intake from ${contactName}`,
        badge: "New Lead",
        rows: [
          { label: "Contact", value: contactName },
          { label: "Email", value: cleanString(body.email) },
          { label: "Phone", value: cleanString(body.phone) },
          { label: "Hosting", value: cleanString(body.hosting) },
          { label: "Hours per week", value: typeof doc.hoursPerWeek === "number" ? String(doc.hoursPerWeek) : "" },
          { label: "Tools", value: toolsLabel },
          { label: "Trigger", value: cleanString(body.trigger) },
          { label: "Destination", value: cleanString(body.destination) },
          { label: "Current state link", value: cleanString(body.currentStateLink) },
          { label: "Timeline", value: timeline },
          { label: "Budget", value: budget },
        ],
        quote: cleanString(body.processDescription),
        note: "Review the full intake in Studio under Automation Intakes.",
        ctaUrl: "https://luwahtechnologies.com/studio/structure/automationIntakes",
        ctaLabel: "View in Studio",
      });
    }

    // No n8n forward. The web forms workflow routes on form_type with no fallback, so an unknown type is dropped silently. Add the forward when the workflow has an automation-intake branch.

    if (!stored) {
      return NextResponse.json(
        { error: "Intake could not be saved. Please email hello@luwahtechnologies.com" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, submission_id: submissionId });
  } catch (error) {
    reportError("api.automation-intake", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
