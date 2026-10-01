import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/projects";

export function CaseStudyContent({ project }: { project: Project }) {
  return (
    <div className="pt-24">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          {/* Back link */}
          <Link
            href="/work"
            className="mb-10 inline-flex items-center gap-2 text-sm no-underline transition-colors duration-200"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={16} />
            Back to Work
          </Link>

          {/* Header */}
          {/* Title and image are the LCP candidates. No opacity: 0 start here,
              it would hide them until the JS bundle hydrates. */}
          <div className="anim-rise">
            <span
              className="mb-4 block text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-copper)" }}
            >
              {project.category}
            </span>
            <h1
              className="mb-6 max-w-3xl text-3xl font-bold md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h1>

            {/* Meta info */}
            {(project.client || project.location || project.industry) && (
              <div
                className="mb-8 flex flex-wrap gap-6 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {project.client && (
                  <div>
                    <span
                      className="block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Client
                    </span>
                    {project.client}
                  </div>
                )}
                {project.location && (
                  <div>
                    <span
                      className="block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Location
                    </span>
                    {project.location}
                  </div>
                )}
                {project.industry && (
                  <div>
                    <span
                      className="block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Industry
                    </span>
                    {project.industry}
                  </div>
                )}
                {project.completed && (
                  <div>
                    <span
                      className="block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Completed
                    </span>
                    {project.completed}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero image */}
          <div
            className="relative mb-16 h-64 overflow-hidden md:h-96"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
          </div>

          {/* Metrics bar */}
          <div
            className="card anim-fade mb-16 flex flex-wrap justify-center gap-10 p-8 md:gap-16"
            style={{ "--anim-delay": "0.2s" } as React.CSSProperties}
          >
            {project.metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div
                  className="text-3xl font-bold"
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

          {/* Content sections */}
          <div className="mx-auto max-w-3xl">
            {project.overview && (
              <div
                className="anim-fade mb-12"
                style={{ "--anim-delay": "0.3s" } as React.CSSProperties}
              >
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Overview
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {project.overview}
                </p>
              </div>
            )}

            {project.challenge && project.challenge.length > 0 && (
              <div
                className="anim-fade mb-12"
                style={{ "--anim-delay": "0.35s" } as React.CSSProperties}
              >
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  The Challenge
                </h2>
                <ul className="flex flex-col gap-3">
                  {project.challenge.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--color-copper)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.solution && project.solution.length > 0 && (
              <div
                className="anim-fade mb-12"
                style={{ "--anim-delay": "0.4s" } as React.CSSProperties}
              >
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What We Built
                </h2>
                <ul className="flex flex-col gap-3">
                  {project.solution.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--color-copper)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div
                className="anim-fade mb-12"
                style={{ "--anim-delay": "0.45s" } as React.CSSProperties}
              >
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full px-4 py-1.5 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
