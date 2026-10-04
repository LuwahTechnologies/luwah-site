import { NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { signPayload } from "@/lib/signPayload";
import { rateLimit, clientKey, clientIp } from "@/lib/rateLimit";
import { getWebCatalog } from "@/lib/getWebCatalog";
import { computeOrderTotal } from "@/lib/webCatalog";
import { notifyEmail } from "@/lib/notifyEmail";
import { reportError } from "@/lib/report";

/**
 * POST /api/web-order
 * Receives a web-build order from the /order configurator. Verifies Turnstile,
 * recomputes the total server-side from the catalog, stores it as a `webOrder`
 * document for the admin Studio, and optionally forwards to n8n.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "web-order"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();

    if (!body.fullName || !body.email || !body.tierKey) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, tier" },
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

    // Recompute the total from the catalog. The client value is never trusted.
    const catalog = await getWebCatalog({ failOpen: true });
    // Keep only add-ons a client may order. Hosting tiers are set by Luwah, and
    // an old tab or a hand-built request could still send them.
    const addonKeys: string[] = (Array.isArray(body.addonKeys) ? body.addonKeys : []).filter(
      (k: unknown) => catalog.addons.some((a) => a.key === k && a.orderable !== false)
    );
    const extraPages = Number.isInteger(body.extraPages) ? body.extraPages : 0;
    const totals = computeOrderTotal(catalog, {
      tierKey: body.tierKey,
      addonKeys,
      extraPages,
    });
    if (!totals.tierName) {
      return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
    }

    const submissionId = crypto.randomUUID();
    const ipHash = crypto
      .createHash("sha256")
      .update(clientIp(request))
      .digest("hex")
      .slice(0, 16);
    const submittedAt = new Date().toISOString();

    let stored = false;
    if (writeClient) {
      try {
        await writeClient.create({
          _type: "webOrder",
          status: "new",
          submissionId,
          fullName: String(body.fullName).slice(0, 200),
          email: String(body.email).slice(0, 200),
          phone: body.phone ? String(body.phone).slice(0, 50) : "",
          businessName: body.businessName ? String(body.businessName).slice(0, 200) : "",
          tierKey: body.tierKey,
          tierName: totals.tierName,
          extraPages,
          addonKeys,
          supportPlanKey: body.supportPlanKey || "",
          estimatedTotal: totals.total,
          hasVariableItems: totals.hasVariableItems,
          notes: body.notes ? String(body.notes).slice(0, 2000) : "",
          submittedAt,
          ipHash,
        });
        stored = true;
      } catch (err) {
        reportError("api.web-order.store", err);
      }
    }

    if (stored) {
      await notifyEmail({
        subject: `New Luwah Technologies Web Order from ${String(body.fullName).slice(0, 200)}`,
        heading: `New web order: ${totals.tierName}`,
        badge: "New Order",
        rows: [
          { label: "Name", value: String(body.fullName).slice(0, 200) },
          { label: "Email", value: String(body.email).slice(0, 200) },
          { label: "Phone", value: body.phone ? String(body.phone).slice(0, 50) : "" },
          { label: "Business", value: body.businessName ? String(body.businessName).slice(0, 200) : "" },
          { label: "Tier", value: totals.tierName },
          { label: "Add-ons", value: addonKeys.join(", ") },
          { label: "Support plan", value: body.supportPlanKey || "" },
          { label: "Estimated total", value: `$${totals.total.toLocaleString("en-US")}${totals.hasVariableItems ? " + quoted items" : ""}` },
        ],
        quote: body.notes ? String(body.notes).slice(0, 1000) : "",
        note: "Logged in Studio under Web Orders. Send a quote within 24 to 48 hours.",
        ctaUrl: "https://luwahtechnologies.com/studio/structure/webOrders",
        ctaLabel: "View in Studio",
      });
    }

    // Optional n8n forward. Off until the webhook env var is set.
    const webhookUrl = process.env.N8N_WEB_WEBHOOK_URL;
    let delivered = false;
    if (webhookUrl) {
      const payload = {
        form_type: "web-order",
        submission_id: submissionId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone || "",
        businessName: body.businessName || "",
        tierKey: body.tierKey,
        tierName: totals.tierName,
        addonKeys,
        extraPages,
        supportPlanKey: body.supportPlanKey || "",
        estimatedTotal: totals.total,
        hasVariableItems: totals.hasVariableItems,
        notes: body.notes || "",
        metadata: { submitted_at: submittedAt, ip_hash: ipHash },
      };
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
        reportError("api.web-order.n8n", err);
      }
    }

    if (!stored && !delivered) {
      return NextResponse.json(
        { error: "Order could not be saved. Please email hello@luwahtechnologies.com" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      submission_id: submissionId,
      estimatedTotal: totals.total,
    });
  } catch (error) {
    reportError("api.web-order", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
