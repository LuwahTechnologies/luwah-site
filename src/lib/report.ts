import * as Sentry from "@sentry/nextjs";

interface ReportOptions {
  /** Never put form data or other personal details in here. */
  extra?: Record<string, string | number | boolean>;
  /**
   * Send at most one event per scope in this many milliseconds. For failures
   * that repeat on every request during an outage. Without it, one failing
   * page becomes an event per visit and can use up the Sentry quota.
   */
  throttleMs?: number;
}

const lastReported = new Map<string, number>();

/** The message plus the underlying cause. fetch only says "fetch failed". */
function describe(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const cause = (err as { cause?: { code?: string; message?: string } }).cause;
  const detail = cause?.code ?? cause?.message;
  return detail ? `${err.message} (${detail})` : err.message;
}

/**
 * Report a failure that the code handles itself (returns a fallback, sends a
 * 500 JSON body, skips an email). Next only forwards UNHANDLED errors to
 * Sentry through onRequestError, so anything caught and turned into a response
 * is invisible there unless it goes through here.
 *
 * Logs the message only. The raw error objects from fetch and the Sanity
 * client carry long stacks that flood the build log.
 */
export function reportError(scope: string, err: unknown, options: ReportOptions = {}): void {
  const { extra, throttleMs } = options;

  if (throttleMs) {
    const now = Date.now();
    if (now - (lastReported.get(scope) ?? 0) < throttleMs) return;
    lastReported.set(scope, now);
  }

  console.error(`[${scope}] ${describe(err)}`);

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
