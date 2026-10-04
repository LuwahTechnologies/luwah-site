import "server-only";

/**
 * In-memory fixed-window rate limiter.
 *
 * Tradeoff: state lives in this process only. It resets on deploy and is not
 * shared across instances. That is acceptable here because the site runs as a
 * single Render instance, and this layer sits behind Cloudflare and Turnstile.
 * If the app scales to multiple instances, move this to Upstash Redis or
 * Cloudflare Rate Limiting and keep the same call signature.
 */
interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

// Periodic cleanup so abandoned keys do not grow the map without bound.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, win] of buckets) {
    if (win.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // seconds until the window resets
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const win = buckets.get(key);
  if (!win || win.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  win.count += 1;
  if (win.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((win.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Client IP for rate limiting. Prefers cf-connecting-ip, which Cloudflare sets
 * and overwrites. Otherwise takes the last x-forwarded-for entry, the one the
 * nearest proxy appended. The first entry is client supplied and spoofable.
 * Caveat: a request sent straight to the onrender.com origin can still forge
 * cf-connecting-ip. Lock the origin to Cloudflare to close that.
 */
export function clientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const parts = request.headers.get("x-forwarded-for")?.split(",") ?? [];
  return parts[parts.length - 1]?.trim() || "unknown";
}

/** Falls back to a constant so a missing header shares one bucket rather than bypassing the limit. */
export function clientKey(request: Request, scope: string): string {
  return `${scope}:${clientIp(request)}`;
}
