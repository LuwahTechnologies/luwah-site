"use client";

import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  services: [
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/services#pricing", label: "Pricing" },
    { href: "/consultation", label: "Free Consultation" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "https://links.luwahtechnologies.com/@hub", label: "Links" },
  ],
  legal: [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/accessibility-statement", label: "Accessibility" },
    { href: "/#faq", label: "FAQ" },
  ],
};

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* CTA Block */}
      <section className="py-20 text-center">
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to automate?
        </h2>
        <p
          className="mx-auto mb-8 max-w-2xl text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Book a free consultation and we&apos;ll map out what to automate
          first.
        </p>
        <Link href="/consultation" className="btn-primary">
          Book a Free Consultation
        </Link>
      </section>

      {/* Footer Grid */}
      <section
        className="mx-auto max-w-[var(--container-max)] px-6 py-12"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="mb-10 flex items-center gap-3">
          <Image
            src="/images/logo-favicon.png"
            alt="Luwah Technologies"
            width={44}
            height={44}
            style={{ height: "auto" }}
          />
          <div>
            <div
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span style={{ color: "var(--color-copper)" }}>Luwah</span>{" "}
              <span style={{ color: "#4A90A4" }}>Technologies</span>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Where Simplicity Meets Innovation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16">

          {(
            [
              { title: "Services", links: FOOTER_LINKS.services },
              { title: "Company", links: FOOTER_LINKS.company },
              { title: "Legal", links: FOOTER_LINKS.legal },
            ] as const
          ).map((section) => (
            <div key={section.title}>
              <h3
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)" }}
              >
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="footer-link text-sm no-underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            &copy; {new Date().getFullYear()} Luwah Technologies LLC. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            {process.env.NEXT_PUBLIC_BUILD_ID && (
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {process.env.NEXT_PUBLIC_BUILD_ID}
              </p>
            )}
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Made by{" "}
              <Link href="/about" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>Daniel Cooke</Link>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
