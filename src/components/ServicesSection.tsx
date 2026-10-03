"use client";

import Link from "next/link";
import { Mail, BarChart3, Bot, Workflow, Link2, Globe } from "lucide-react";

const SERVICES = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Transform repetitive manual tasks into automated workflows that run reliably in the background.",
    showOnMobile: true,
  },
  {
    icon: Mail,
    title: "Lead Generation & Outreach",
    description:
      "Automate lead sourcing, email follow-ups, and engagement to grow your business effortlessly.",
    showOnMobile: false,
  },
  {
    icon: BarChart3,
    title: "Data Processing & Insight",
    description:
      "Sync data across platforms and generate reports automatically — no more spreadsheet wrangling.",
    showOnMobile: true,
  },
  {
    icon: Bot,
    title: "AI-Powered Chatbots",
    description:
      "Provide 24/7 customer support with intelligent chatbots trained on your business.",
    showOnMobile: false,
  },
  {
    icon: Link2,
    title: "System Integrations",
    description:
      "Connect your CRM, e-commerce, accounting, and communication tools into unified workflows.",
    showOnMobile: false,
  },
  {
    icon: Globe,
    title: "Website Design & Development",
    description:
      "Custom-built, fast-loading websites tailored to your brand — no templates, no monthly fees, full ownership.",
    showOnMobile: true,
  },
];

export function ServicesSection() {

  return (
    <section
      id="services"
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-14 text-center">
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What we build
          </h2>
          <p
            className="mx-auto max-w-lg text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Custom automation solutions scoped to your business.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className={`anim-fade card p-7${!service.showOnMobile ? " hidden sm:block" : ""}`}
              style={{ "--anim-delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <service.icon
                size={20}
                className="mb-5"
                style={{ color: "var(--color-copper)" }}
              />
              <h3
                className="mb-2 text-base font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="btn-secondary" scroll={true}>
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
