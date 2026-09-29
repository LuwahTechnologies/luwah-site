import * as Sentry from "@sentry/nextjs";

/**
 * Report a failure that the code handles itself (returns a fallback, sends a
 * 500 JSON body, skips an email). Next only forwards UNHANDLED errors to
 * Sentry through onRequestError, so anything caught and turned into a response
 * is invisible there unless it goes through here.
 *
 * Logs the message only. The raw error objects from fetch and the Sanity
 * client carry long stacks that flood the build log. Never pass form data or
 * other personal details in `scope` or `extra`.
 */
export function reportError(
  scope: string,
  err: unknown,
  extra?: Record<string, string | number | boolean>
): void {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${scope}] ${message}`);

  // A build with Sanity unreachable is an expected fallback path, not an
  // incident. Do not page anyone from CI or a deploy.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  Sentry.captureException(err, { tags: { scope }, extra });
}

/**
 * True when a failed content read should throw so ISR keeps serving the last
 * good page. False at build time (the build must never fail on a Sanity outage,
 * the static fallbacks render instead) and in `next dev`.
 */
export function failClosedOnContentError(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}
