import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, SENTRY_TAGS, tracesSampler } from "./sentry.shared";

Sentry.init({
  dsn: SENTRY_DSN,
  initialScope: { tags: SENTRY_TAGS },
  tracesSampler,
});
