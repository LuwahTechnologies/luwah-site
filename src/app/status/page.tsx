import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Status",
  description: "Which build of the Luwah Technologies site is live.",
  robots: { index: false, follow: false },
};

// Prerendered at build, so every value below describes the build that is
// serving this page. That is the point: after a deploy, or when Cloudflare might
// be caching an old copy, this says which build you actually reached. The same
// id is sent on every response as the X-Build-Id header and on /api/health.
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "unknown";
const BUILT_AT = process.env.NEXT_PUBLIC_BUILD_TIME;
const SANITY_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

function formatBuiltAt(iso: string | undefined): string {
  if (!iso) return "unknown";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toUTCString();
}

export default function StatusPage() {
  const rows: { label: string; value: string }[] = [
    { label: "Build", value: BUILD_ID },
    { label: "Built", value: formatBuiltAt(BUILT_AT) },
    {
      label: "Content source",
      value: SANITY_CONFIGURED
        ? "Sanity, with the bundled content as fallback"
        : "Bundled content only (Sanity is not configured)",
    },
  ];

  return (
    <div className="pt-24">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h1
            className="mb-3 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Status
          </h1>
          <p className="mb-10 text-base" style={{ color: "var(--color-text-secondary)" }}>
            The build serving this page.
          </p>

          <dl className="card divide-y p-2" style={{ borderColor: "var(--color-border)" }}>
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                style={{ borderColor: "var(--color-border)" }}
              >
                <dt
                  className="w-40 shrink-0 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {row.label}
                </dt>
                <dd
                  className="break-words text-base"
                  style={{ fontFamily: "var(--font-mono, monospace)" }}
                  data-testid={`status-${row.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Uptime monitors can use{" "}
            <Link href="/api/health" style={{ color: "var(--color-copper)" }}>
              /api/health
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
