import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveSubmission } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { signPayload } from "@/lib/signPayload";
import { notifyEmail } from "@/lib/notifyEmail";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { reportError } from "@/lib/report";

export async function POST(request: Request) {
  try {
    // Throttle per IP before doing any work. 5 submissions per minute.
    const limit = rateLimit(clientKey(request, "contact"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile. Required, not optional: a missing token is a
    // failed check, so a direct API call without the token cannot bypass it.
    if (!(await verifyTurnstile(body.turnstile_token))) {
      return NextResponse.json(
        { error: "Bot verification failed" },
        { status: 403 }
      );
    }

    // Forward to n8n webhook with HMAC signature
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("N8N webhook URL not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const payload = {
      form_type: "contact",
      submission_id: crypto.randomUUID(),
      lead_status: "complete",
      fullName: body.fullName,
      email: body.email,
      phone: "",
      preferred_contact: "Email",
      companyName: body.companyName || "",
      industry: "",
      pos: "",
      booking: "",
      accounting: "",
      message: body.message,
      help_areas: [],
      urgency: "",
      budget_range: "",
      referral_source: "",
      metadata: {
        submitted_at: new Date().toISOString(),
        ip_hash: crypto
          .createHash("sha256")
          .update(request.headers.get("x-forwarded-for") || "unknown")
          .digest("hex")
          .slice(0, 16),
        source: "contact-form",
      },
    };

    // Store the lead in Sanity so it shows in the admin Studio, independent of
    // n8n. Non-blocking: a Sanity failure is logged but does not drop the lead,
    // which still forwards to n8n below.
    const saved = await saveSubmission({
      formType: "contact",
      leadStatus: payload.lead_status,
      submissionId: payload.submission_id,
      fullName: payload.fullName,
      email: payload.email,
      companyName: payload.companyName,
      message: payload.message,
      submittedAt: payload.metadata.submitted_at,
      ipHash: payload.metadata.ip_hash,
      source: payload.metadata.source,
    });

    await notifyEmail({
      subject: `New Luwah Technologies Contact from ${payload.fullName}`,
      heading: `New contact message from ${payload.fullName}`,
      badge: "New Message",
      rows: [
        { label: "Name", value: payload.fullName },
        { label: "Email", value: payload.email },
        { label: "Company", value: payload.companyName },
      ],
      quote: payload.message,
      note: "Logged in Studio under Submissions, Contact Messages.",
      ctaUrl: "https://luwahtechnologies.com/studio/structure/submissions;contactMessages",
      ctaLabel: "View in Studio",
    });

    // The lead is already in Sanity, so a slow or failing n8n should not show
    // the visitor an error. Report it and succeed. If the Sanity write also
    // failed, only the notification email holds the lead, so the failure still
    // surfaces as a 500.
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signPayload(payload),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook responded with ${webhookResponse.status}`);
      }
    } catch (webhookError) {
      if (!saved) throw webhookError;
      reportError("api.contact.webhook", webhookError, {
        // Lets you find the lead in Studio and replay it to n8n.
        extra: { submission_id: payload.submission_id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    reportError("api.contact", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
