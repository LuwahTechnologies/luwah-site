"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/lib/sanity";

export function WorkContent({ projects }: { projects: ProjectSummary[] }) {

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our work
          </h1>
          <p
            className="mb-14 max-w-lg text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Real results from real businesses. Each project scoped, built, and
            delivered by Luwah Technologies.
          </p>

          {/* Featured project */}
          <Link href={`/work/${featured.slug}`} className="no-underline">
            <motion.article
              className="anim-fade card mb-6 grid overflow-hidden transition-colors duration-200 md:grid-cols-2"
              style={{ cursor: "pointer" }}
              whileHover={{ borderColor: "rgba(212, 146, 79, 0.3)" }}
            >
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <span
                  className="mb-3 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-copper)" }}
                >
                  {featured.category}
                </span>
                <h2
                  className="mb-3 text-xl font-bold md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {featured.title}
                </h2>
                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {featured.description}
                </p>
                <div className="flex gap-8">
                  {featured.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <div
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {m.value}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </Link>

          {/* Remaining projects */}
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((p, i) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="no-underline">
                <motion.article
                  className="anim-fade card h-full overflow-hidden transition-colors duration-200"
                  style={{ "--anim-delay": `${(i + 1) * 0.08}s`, cursor: "pointer" } as React.CSSProperties}
                  whileHover={{ borderColor: "rgba(212, 146, 79, 0.3)" }}
                >
                  <div className="relative h-48">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 550px"
                    />
                  </div>
                  <div className="p-6">
                    <span
                      className="mb-2 block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-copper)" }}
                    >
                      {p.category}
                    </span>
                    <h3
                      className="mb-2 text-base font-semibold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="mb-5 text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {p.description}
                    </p>
                    <div className="flex gap-8">
                      {p.metrics.slice(0, 2).map((m) => (
                        <div key={m.label}>
                          <div
                            className="text-xl font-bold"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {m.value}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/consultation" className="btn-primary">
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
