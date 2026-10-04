import { NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/lib/sanityWrite";
import { rateLimit, clientKey, clientIp } from "@/lib/rateLimit";
import { reportError } from "@/lib/report";

/**
 * POST /api/partial
 *
 * Captures an abandoned lead when the user completes an early step of the
 * intake form. Replaces the old browser-to-n8n call, which exposed an
 * unauthenticated public webhook. One document per email, updated in place as
 * the user advances, so the admin sees the furthest step reached, not duplicates.
 */
export async function POST(request: Request) {
  try {
    // Looser limit: this fires once per intake step as the user advances.
    const limit = rateLimit(clientKey(request, "partial"), 15, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.slice(0, 200) : "";
    const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";
    const step = Number.isInteger(body.step) ? body.step : 1;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (writeClient) {
      // Deterministic id keyed on email keeps one row per abandoning person.
      const id = `partial.${crypto.createHash("sha256").update(email).digest("hex").slice(0, 24)}`;
      try {
        await writeClient.createOrReplace({
          _id: id,
          _type: "submission",
          status: "new",
          formType: "partial",
          leadStatus: `partial-step-${step}`,
          fullName: name,
          email,
          submittedAt: new Date().toISOString(),
          ipHash: crypto
            .createHash("sha256")
            .update(clientIp(request))
            .digest("hex")
            .slice(0, 16),
          source: `intake-step-${step}`,
        });
      } catch (err) {
        reportError("api.partial.store", err);
      }
    }

    // Preserve the existing n8n partial automation, now called server-side so
    // the webhook URL and payload never leave the server.
    const base = process.env.NEXT_PUBLIC_N8N_PARTIAL_WEBHOOK_URL;
    if (base) {
      try {
        await fetch(`${base}/intake-step-${step}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, step, timestamp: new Date().toISOString() }),
          signal: AbortSignal.timeout(8000),
        });
      } catch (err) {
        reportError("api.partial.n8n", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    reportError("api.partial", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
