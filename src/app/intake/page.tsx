import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Project Intake",
  description:
    "Choose your intake. Website build for a new or rebuilt site, or automation and operations for a manual process you want to hand off.",
  path: "/intake",
});

const PATHS = [
  {
    href: "/intake/website",
    title: "Website Build",
    body: "A new website or a rebuild of the one you have. Covers your brand, pages, content, and domain.",
    cta: "Start website intake",
  },
  {
    href: "/intake/automation",
    title: "Automation & Operations",
    body: "A manual process you want to hand off. Covers the task, your tools, what done looks like, and where it runs.",
    cta: "Start automation intake",
  },
];

export default function IntakeForkPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Start your intake
        </h1>
        <p className="mb-10 text-base" style={{ color: "var(--color-text-secondary)" }}>
          Pick the intake that matches your project. Fields marked with an asterisk are required.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {PATHS.map((p) => (
            <Link key={p.href} href={p.href} className="card block p-6">
              <h2 className="mb-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {p.title}
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {p.body}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--color-copper)" }}
              >
                {p.cta} <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
