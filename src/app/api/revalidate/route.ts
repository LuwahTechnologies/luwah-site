import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { isSanityDocType, sanityTag } from "@/lib/sanityTags";

/**
 * POST /api/revalidate
 *
 * Busts the Next.js cache so edits appear on the live site without a rebuild.
 * Two callers:
 *  1. A Sanity webhook on publish, sending a `{ _type }` projection (a `slug`
 *     is accepted and ignored). Every Sanity read is tagged with its document
 *     type, so this expires the tag and every page or route that read that
 *     type refreshes on its next request. No hand-kept type-to-path map.
 *  2. n8n or any tool sending an explicit `{ path }`.
 *
 * Security: requires x-revalidation-secret header matching REVALIDATION_SECRET.
 * Set the same value as a custom header on the Sanity webhook.
 */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // timingSafeEqual throws on length mismatch, so length-check first.
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidation-secret") || "";
  const expected = process.env.REVALIDATION_SECRET;

  // Constant-time compare avoids leaking the secret via response timing.
  if (!expected || !safeEqual(secret, expected)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  // Sanity webhook form: expire the tag for the document type.
  if (typeof body._type === "string") {
    // Other document types (form submissions, orders) also fire the webhook.
    // They render nowhere public, so answer 200 with nothing to do and the
    // webhook does not retry.
    const tags = isSanityDocType(body._type) ? [sanityTag(body._type)] : [];
    // "max" marks the entries stale rather than deleting them. The next visit
    // gets the old page while the new one renders in the background, and if
    // that render fails (Sanity down) the old page keeps being served. The
    // alternative, { expire: 0 }, deletes the entries, so the first visit
    // after a publish would return a 500 during an outage. The price is that
    // an editor sees the old page once, and the new one on the next refresh.
    tags.forEach((t) => revalidateTag(t, "max"));
    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  }

  // Explicit path form. Only accept an in-app absolute path.
  const path =
    typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/work";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, paths: [path], now: Date.now() });
}
