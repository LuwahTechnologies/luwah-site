/**
 * Values shared by the client (src/instrumentation-client.ts), server and edge
 * Sentry configs.
 *
 * NEXT_PUBLIC_SENTRY_DSN overrides the DSN at build time. An empty string turns
 * reporting off (the smoke tests build that way so they never write to the real
 * project). Another project's DSN suits a staging or k3s deploy. Unset keeps
 * the production DSN. A DSN is a public write-only key, so it is safe to ship.
 */
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://712ae04cf13ec145d037ad08d546012a@o4511171159785472.ingest.us.sentry.io/4511177271803904";

/** Lets an issue be tied to the deploy that shipped it. */
export const SENTRY_TAGS = {
  build_id: process.env.NEXT_PUBLIC_BUILD_ID || "unknown",
};
