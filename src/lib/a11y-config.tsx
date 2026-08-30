"use client";

import type { A11yUsefulLink } from "@/lib/a11y";

import { Turnstile } from "@/components/Turnstile";

// Everything about the accessibility toolkit that is specific to this
// site lives here. The widget, the behaviour components and the report
// form are the same code on every site Luwah ships, so anything that
// names a route, an endpoint or a contact channel belongs in this file
// and nowhere else.

export const A11Y_LINKS = {
  statement: "/accessibility-statement",
  terms: "/terms",
  termsLabel: "Terms of Service",
  privacy: "/privacy",
  privacyLabel: "Privacy Policy",
};

export const A11Y_CONTACT_FALLBACK = (
  <>
    You can also reach us through the{" "}
    <a href="/contact" className="text-a11ybrand-700 underline underline-offset-2">
      contact page
    </a>
    .
  </>
);

export type A11yReportInput = {
  name: string;
  email: string;
  category: string;
  categoryLabel: string;
  message: string;
  phone: string;
};

// Reports go through the existing contact intake rather than a new
// endpoint. That route already has the per-IP throttle, the Turnstile
// check, the Sanity write and the email notification, so a report lands
// in the same inbox and the same Studio list as every other lead. A
// separate accessibility endpoint would be a second inbox nobody reads.
export async function submitAccessibilityReport(
  input: A11yReportInput,
  captchaToken: string | null
): Promise<{ ok: boolean; error?: string }> {
  const message = [
    `Category: ${input.categoryLabel}`,
    input.phone ? `Phone: ${input.phone}` : "Phone: not provided",
    "",
    input.message,
  ].join("\n");

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: input.name,
      email: input.email,
      companyName: "Accessibility report",
      message,
      turnstile_token: captchaToken,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: typeof data.error === "string" ? data.error : undefined };
  }
  return { ok: true };
}

// The contact route treats a missing token as a failed check, so the
// challenge is required, not optional.
export const A11Y_CAPTCHA_REQUIRED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export function A11yCaptcha({ onVerify }: { onVerify: (token: string | null) => void }) {
  if (!A11Y_CAPTCHA_REQUIRED) return null;
  return <Turnstile onToken={onVerify} onExpire={() => onVerify(null)} />;
}

// The widget's "Useful links" list. The keys are fixed (each has a
// translated label in all 15 panel languages); the routes are this
// site's. patientInfo is omitted: it is a medical-practice page and this
// site has no equivalent.
export const A11Y_USEFUL_LINKS: A11yUsefulLink[] = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "schedule", href: "/consultation" },
  { key: "contact", href: "/contact" },
  { key: "statement", href: "/accessibility-statement" },
];
