import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveSubmission } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { signPayload } from "@/lib/signPayload";
import { rateLimit, clientKey, clientIp } from "@/lib/rateLimit";
import { notifyEmail } from "@/lib/notifyEmail";
import { reportError } from "@/lib/report";

/**
 * POST /api/consultation
 *
 * Receives the intake form submission from the frontend.
 * 1. Validates required fields (server-side)
 * 2. Verifies Cloudflare Turnstile token
 * 3. Flattens payload and signs with HMAC for n8n verification
 * 4. Forwards to n8n webhook via Cloudflare Tunnel
 *
 * Confirmation email is sent by n8n after processing.
 */
export async function POST(request: Request) {
  try {
    // Throttle per IP before doing any work. 5 submissions per minute.
    const limit = rateLimit(clientKey(request, "consultation"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();

    // --- 1. Server-side validation ---
    if (!body.contact?.full_name || !body.contact?.email || !body.business?.name) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, business name" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contact.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // --- 2. Verify Cloudflare Turnstile (required, not optional) ---
    if (!(await verifyTurnstile(body.metadata?.turnstile_token))) {
      return NextResponse.json(
        { error: "Bot verification failed" },
        { status: 403 }
      );
    }

    // --- 3. Generate submission ID and flatten payload for n8n ---
    const submissionId = crypto.randomUUID();
    const payload = {
      form_type: "consultation",
      submission_id: submissionId,
      lead_status: "complete",
      fullName: body.contact?.full_name || "",
      email: body.contact?.email || "",
      phone: body.contact?.phone || "",
      preferred_contact: body.contact?.preferred_contact || "Email",
      companyName: body.business?.name || "",
      industry: body.business?.industry || "",
      pos: body.business?.current_tools?.pos || "",
      booking: body.business?.current_tools?.booking || "",
      accounting: body.business?.current_tools?.accounting || "",
      message: body.needs?.biggest_challenge || "",
      help_areas: body.needs?.help_areas || [],
      urgency: body.needs?.urgency || "",
      budget_range: body.budget_range || "",
      referral_source: body.referral_source || "",
      metadata: {
        submitted_at: new Date().toISOString(),
        ip_hash: crypto
          .createHash("sha256")
          .update(clientIp(request))
          .digest("hex")
          .slice(0, 16),
        turnstile_verified: true,
      },
    };

    // Store the lead in Sanity so it shows in the admin Studio, independent of
    // n8n. The return value is the durable record of whether the lead is safe.
    const stored = await saveSubmission({
      formType: "consultation",
      leadStatus: payload.lead_status,
      submissionId: payload.submission_id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      preferredContact: payload.preferred_contact,
      companyName: payload.companyName,
      industry: payload.industry,
      message: payload.message,
      helpAreas: payload.help_areas,
      urgency: payload.urgency,
      referralSource: payload.referral_source,
      pos: payload.pos,
      booking: payload.booking,
      accounting: payload.accounting,
      submittedAt: payload.metadata.submitted_at,
      ipHash: payload.metadata.ip_hash,
      source: "consultation-form",
    });

    if (stored) {
      await notifyEmail({
        subject: `New Luwah Technologies Consultation Request from ${payload.fullName}`,
        heading: `New consultation request from ${payload.fullName}`,
        badge: "New Lead",
        rows: [
          { label: "Name", value: payload.fullName },
          { label: "Email", value: payload.email },
          { label: "Phone", value: payload.phone },
          { label: "Company", value: payload.companyName },
          { label: "Industry", value: payload.industry },
          { label: "Urgency", value: payload.urgency },
          { label: "Help areas", value: (payload.help_areas || []).join(", ") },
        ],
        quote: payload.message,
        note: "Logged in Studio under Submissions, Consultations.",
        ctaUrl: "https://luwahtechnologies.com/studio/structure/submissions;consultations",
        ctaLabel: "View in Studio",
      });
    }

    // --- 4. Forward to n8n webhook (triggers the confirmation email) ---
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    let delivered = false;
    if (webhookUrl) {
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
      } catch (webhookError) {
        reportError("api.consultation.n8n", webhookError);
      }
    }

    // Only report failure when the lead is lost in BOTH stores. If Sanity has
    // it, the lead is safe even though the n8n email automation did not fire.
    if (!stored && !delivered) {
      return NextResponse.json(
        { error: "Submission could not be processed. Please email hello@luwahtechnologies.com" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      submission_id: submissionId,
    });
  } catch (error) {
    reportError("api.consultation", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
