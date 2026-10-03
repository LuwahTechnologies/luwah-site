"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    slug: "eloquence-wax-skin",
    category: "Web Design & Infrastructure",
    title: "Full Digital Presence for a Premium Waxing & Skincare Studio",
    description:
      "Custom Next.js website, business email, self-hosted link hub, and Cloudflare infrastructure, delivered end-to-end for a beauty brand launching from scratch.",
    image: "/images/pexels-sejio402-6704970.jpg",
    metrics: [
      { value: "Sub-second", label: "Load time" },
      { value: "$0/mo", label: "Email cost" },
    ],
  },
  {
    slug: "denver-racquet-club-gmail-automation",
    category: "Operations",
    title: "Gmail to Google Sheets: A Racquet Club's Contact Forms on Autopilot",
    description:
      "A native Google Apps Script pipeline that monitors Gmail for Wix form submissions, parses contact fields, flags profanity, and analyzes sentiment, twice daily, zero dependencies.",
    image: "/images/pexels-brett-sayles-4520560.jpg",
    metrics: [
      { value: "2x/day", label: "Auto-runs" },
      { value: "0", label: "Manual entry" },
    ],
  },
  {
    slug: "automated-lead-generation-pipeline",
    category: "Sales & Marketing",
    title: "How I Turned Google Maps Into a Statewide Sales Machine",
    description:
      "An automated pipeline scrapes emails, pulls owner names from public records, and exports ready-to-contact leads, 90% faster.",
    image: "/images/geralt-ai-10171006_1920.jpg",
    metrics: [
      { value: "60%", label: "Hours saved" },
      { value: "Daily", label: "Automated outreach" },
    ],
  },
];

export function PortfolioSection() {

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recent work
        </h2>
        <p
          className="mb-14 max-w-lg text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Real results from businesses that grew with automation.
        </p>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((project, i) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className="no-underline">
            <motion.article
              className="anim-fade card group flex flex-col overflow-hidden transition-colors duration-200 md:flex-row"
              style={{ "--anim-delay": `${i * 0.08}s`, cursor: "pointer" } as React.CSSProperties}
              whileHover={{ borderColor: "rgba(212, 146, 79, 0.3)" }}
            >
              <div className="relative h-48 w-full shrink-0 md:h-auto md:w-56">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-6 p-7 md:flex-row md:items-start md:p-8">
                <div className="flex-1">
                  <span
                    className="mb-3 block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--color-copper)" }}
                  >
                    {project.category}
                  </span>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="max-w-xl text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {project.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-8 md:gap-10">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {metric.value}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/work"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View Full Portfolio
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
