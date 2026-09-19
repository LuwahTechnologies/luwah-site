"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What industries do you provide automation services for?",
    answer:
      "We work with small businesses across industries — salons, staffing firms, breweries, liquor stores, restaurants, healthcare practices, nonprofits, and professional services. If your business has repetitive processes that follow a pattern, automation can help regardless of industry.",
  },
  {
    question: "How long does it take to automate business processes?",
    answer:
      "It depends on complexity. Quick wins like email setup or basic reporting take 1–3 days. Core projects like reminder systems or dashboards typically take 1–2 weeks. Premium integrations involving multiple systems can take 2–4 weeks. Every project includes a clear timeline in the proposal.",
  },
  {
    question: "Is my business data secure with AI automation?",
    answer:
      "Yes. Unlike many agencies that rely entirely on shared public-cloud tools, Luwah Technologies operates its own private, self-hosted infrastructure. Your core automation logic and sensitive data triggers are processed on our dedicated Proxmox servers located in Aurora, CO, secured via Cloudflare zero-trust tunnels. When AI is involved, your data goes only to tools that do not train on it, never your credentials, and never regulated data without a written agreement.",
  },
  {
    question: "What AI and automation tools do you work with?",
    answer:
      "Our primary platform is n8n — an open-source workflow engine that connects to hundreds of services. We also work with Python, Apple Shortcuts, the Claude AI API, and integrations with Snowflake, Salesforce, and Microsoft 365. Tool selection depends on what fits your business best.",
  },
  {
    question: "Can I see a demo before committing?",
    answer:
      "The free 30-minute consultation is a live walkthrough of what's possible for your specific business. We'll discuss your challenges and show relevant examples. For custom projects, the proposal details exactly what you'll receive before you commit.",
  },
  {
    question: "How much does workflow automation cost?",
    answer:
      "Quick wins start at $150, core projects at $300, and premium integrations at $750+. Ongoing retainers start at $50/month. Every project gets a fixed-price quote — no surprises, no hourly billing that spirals. The consultation is free.",
  },
  {
    question: "Do I need to pay monthly fees for automation?",
    answer:
      "Not necessarily. Most projects are one-time builds you own outright. Some solutions benefit from ongoing hosting or maintenance ($50–$200/month), but that's optional. We'll always tell you upfront if a solution has recurring costs.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="faq"
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
      ref={ref}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <h2
          className="mb-12 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Frequently asked questions
        </h2>

        <div className="mx-auto max-w-3xl">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                }}
              >
                <span className="pr-4">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className="shrink-0 transition-transform duration-200"
                  style={{
                    color: "var(--color-text-muted)",
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pb-5 text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
