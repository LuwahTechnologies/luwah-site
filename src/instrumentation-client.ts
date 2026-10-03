import * as Sentry from "@sentry/nextjs";
import { SENTRY_BROWSER_ENVIRONMENT, SENTRY_DSN, SENTRY_TAGS } from "../sentry.shared";

// Next 16 builds with Turbopack, which does not load sentry.client.config.ts,
// so the browser SDK was never initialised and client errors, including the
// Sentry.captureException call in global-error.tsx, went nowhere. This file is
// the supported entry point.
//
// Errors only. Session Replay and tracing were configured in the old file but
// never ran. Turning them on records visitors on a site with contact forms,
// so it is an owner decision, not something to enable by moving a file. To opt
// in, add the replay integration and the sample rates here.
Sentry.init({
  dsn: SENTRY_DSN,
  // Local dev and local builds should not write to the production project.
  enabled: process.env.NODE_ENV === "production",
  environment: SENTRY_BROWSER_ENVIRONMENT,
  initialScope: { tags: SENTRY_TAGS },
  // Sanity Studio is served from /studio in this same app, and its own errors
  // are not this site's to report.
  beforeSend(event) {
    return window.location.pathname.startsWith("/studio") ? null : event;
  },
});

// Next 16 calls this on every client navigation. Without it the SDK warns at
// build time. Tracing stays off, so this records nothing extra.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
