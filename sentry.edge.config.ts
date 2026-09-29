import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, SENTRY_TAGS } from "./sentry.shared";

Sentry.init({
  dsn: SENTRY_DSN,
  initialScope: { tags: SENTRY_TAGS },
  tracesSampleRate: 1.0,
});
