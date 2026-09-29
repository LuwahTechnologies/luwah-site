import Link from "next/link";
import { DeferredVideo } from "@/components/DeferredVideo";

interface HeroContent {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

// Built-in defaults. Used whenever the matching Sanity field is empty, so the
// hero always renders even before any content is entered in Studio.
const DEFAULTS = {
  eyebrow: "Workflow automation for small businesses",
  headline: "Automation Consulting",
  subhead:
    "We build automations across platforms — from cloud workflows to native scripts — so you can eliminate repetitive tasks, cut costs, and focus on work that matters.",
  primaryCtaLabel: "Book a Free Consultation",
  primaryCtaHref: "/consultation",
  secondaryCtaLabel: "See Our Work",
  secondaryCtaHref: "/work",
};

// Drop undefined/empty values so they do not override a non-empty default.
function stripEmpty(obj?: HeroContent): Partial<HeroContent> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim() !== "")
  );
}

export function HeroSection({ content }: { content?: HeroContent }) {
  const c = { ...DEFAULTS, ...stripEmpty(content) };
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden">
      {/* Video background. Loaded after first paint, see DeferredVideo. */}
      <DeferredVideo
        src="/videos/2792370-hd_1920_1080_30fps.mp4"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.12 }}
      />

      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,146,79,0.06) 0%, transparent 60%), linear-gradient(to top, var(--color-bg-primary), transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-6 py-20 text-center md:py-28">
        {/* No opacity animation here. This block holds the LCP element, and an
            opacity: 0 start in the server HTML hides it until hydration. */}
        <div className="anim-rise">
          {/* Eyebrow pill */}
          <div
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--color-text-secondary)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-copper)" }}
            />
            {c.eyebrow}
          </div>

          <h1
            className="mx-auto mb-6 text-4xl font-bold whitespace-nowrap md:text-7xl lg:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.headline}
          </h1>

          <p
            className="mx-auto mb-10 max-w-xl text-lg"
            style={{ color: "var(--color-text-secondary)", lineHeight: 1.7 }}
          >
            {c.subhead}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href={c.primaryCtaHref} className="btn-primary">
              {c.primaryCtaLabel}
            </Link>
            <Link href={c.secondaryCtaHref} className="btn-secondary">
              {c.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
