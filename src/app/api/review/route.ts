import { NextResponse } from "next/server";
import crypto from "crypto";
import { writeClient } from "@/lib/sanityWrite";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { signPayload } from "@/lib/signPayload";
import { rateLimit, clientKey, clientIp } from "@/lib/rateLimit";
import { notifyEmail } from "@/lib/notifyEmail";
import { RATING_CATEGORIES, computeOverall, type Ratings } from "@/lib/reviews";
import { reportError } from "@/lib/report";

/**
 * POST /api/review
 * Receives a client review. Verifies Turnstile, recomputes the overall score
 * server-side, and stores it UNAPPROVED. It only appears on the site after you
 * approve it in Studio. Optionally forwards to n8n.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "review"), 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();

    if (!body.reviewerName || !body.quote) {
      return NextResponse.json(
        { error: "Missing required fields: name and review" },
        { status: 400 }
      );
    }

    // Every category must be an integer 1 to 5.
    const ratings = {} as Ratings;
    for (const c of RATING_CATEGORIES) {
      const v = body.ratings?.[c.key];
      if (!Number.isInteger(v) || v < 1 || v > 5) {
        return NextResponse.json(
          { error: `Please rate every category (1 to 5): ${c.label}` },
          { status: 400 }
        );
      }
      ratings[c.key] = v;
    }

    if (!(await verifyTurnstile(body.turnstile_token))) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 });
    }

    const overall = computeOverall(ratings);
    const date = new Date().toISOString();
    const ipHash = crypto
      .createHash("sha256")
      .update(clientIp(request))
      .digest("hex")
      .slice(0, 16);

    let stored = false;
    if (writeClient) {
      try {
        await writeClient.create({
          _type: "review",
          approved: false, // never live until vetted
          featured: false,
          reviewerName: String(body.reviewerName).slice(0, 200),
          company: body.company ? String(body.company).slice(0, 200) : "",
          role: body.role ? String(body.role).slice(0, 200) : "",
          quote: String(body.quote).slice(0, 3000),
          ratings,
          overall,
          date,
          ipHash,
        });
        stored = true;
      } catch (err) {
        reportError("api.review.store", err);
      }
    }

    if (stored) {
      const name = String(body.reviewerName).slice(0, 200);
      await notifyEmail({
        subject: `New Luwah Technologies Review from ${name}`,
        heading: `${name} left a ${overall}/5 review`,
        badge: "Action Needed",
        rows: [
          { label: "Reviewer", value: name },
          { label: "Company", value: body.company ? String(body.company).slice(0, 200) : "" },
          { label: "Role", value: body.role ? String(body.role).slice(0, 200) : "" },
          { label: "Rating", value: `${overall} / 5` },
        ],
        quote: String(body.quote).slice(0, 1000),
        note: "Pending approval. Approve it in Studio under Reviews to show it on the site.",
        ctaUrl: "https://luwahtechnologies.com/studio/structure/reviews;pendingApproval",
        ctaLabel: "Approve in Studio",
      });
    }

    const webhookUrl = process.env.N8N_WEB_WEBHOOK_URL;
    if (webhookUrl) {
      const payload = {
        form_type: "review",
        reviewerName: body.reviewerName,
        company: body.company || "",
        role: body.role || "",
        quote: body.quote,
        ratings,
        overall,
        metadata: { submitted_at: date, ip_hash: ipHash },
      };
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signPayload(payload),
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });
      } catch (err) {
        reportError("api.review.n8n", err);
      }
    }

    if (!stored) {
      return NextResponse.json(
        { error: "Review could not be saved. Please email hello@luwahtechnologies.com" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    reportError("api.review", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
