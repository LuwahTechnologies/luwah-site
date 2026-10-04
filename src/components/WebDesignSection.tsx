import Link from "next/link";
import { Check } from "lucide-react";
import type { WebCatalog } from "@/lib/webCatalog";

/**
 * Web-build offering shown on the services page at #web-design. Reads the
 * Sanity-editable catalog. Server component, no client JS needed.
 */
export function WebDesignSection({ catalog }: { catalog: WebCatalog }) {
  return (
    <section id="web-design" className="py-24 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Website Design & Build
          </h2>
          <p className="mx-auto max-w-2xl text-base" style={{ color: "var(--color-text-secondary)" }}>
            {catalog.intro}
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {catalog.tiers.map((t) => (
            <div
              key={t.key}
              className="card flex flex-col p-6"
              style={t.highlight ? { borderColor: "var(--color-copper-border)" } : {}}
            >
              <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {t.name}
              </h3>
              <p className="mb-3 text-xs" style={{ color: "var(--color-text-muted)" }}>{t.pages}</p>
              <div className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {t.priceLabel}
              </div>
              <p className="mb-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>{t.summary}</p>
              <ul className="flex flex-col gap-2 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <Check size={13} className="mt-0.5 shrink-0" style={{ color: "var(--color-copper)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              {t.cta && (
                <Link href={t.cta.href} className="btn-secondary mt-5 text-center">
                  {t.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <h3 className="mt-16 mb-5 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Popular add-ons
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.addons.map((a) => (
            <div key={a.key} className="card flex flex-col p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{a.name}</span>
                <span className="shrink-0 pl-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {a.oneTimeLabel}
                  {a.monthlyLabel ? ` · ${a.monthlyLabel}` : ""}
                </span>
              </div>
              {a.description && (
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {a.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Support plans */}
        <h3 className="mt-16 mb-5 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Website Care
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {catalog.supportPlans.map((p) => (
            <div key={p.key} className="card p-5">
              <p className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>{p.name}</p>
              <p className="mb-2 text-sm" style={{ color: "var(--color-copper)" }}>{p.priceLabel}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{p.includes}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
            Ready to start? Build your order, then complete the intake so we can begin.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/order" className="btn-primary">Build your order</Link>
            <Link href="/intake/website" className="btn-secondary">Start the build intake</Link>
          </div>
          <p className="mt-2 max-w-2xl text-xs" style={{ color: "var(--color-text-muted)" }}>
            {catalog.legal}
          </p>
        </div>
      </div>
    </section>
  );
}
