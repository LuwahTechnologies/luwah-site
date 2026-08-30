"use client";

import { useState } from "react";
import {
  A11Y_CAPTCHA_REQUIRED,
  A11Y_CONTACT_FALLBACK,
  A11Y_LINKS,
  A11yCaptcha,
  submitAccessibilityReport,
} from "@/lib/a11y-config";

const GENERIC_ERROR = "We could not submit your report. Please try again, or contact us directly.";
const AGREEMENT_ERROR = "You must agree to the Terms of Service and the Privacy Policy to submit.";
const CAPTCHA_ERROR = "Please complete the verification above.";

// A report is a person telling us the site failed them. It has to work
// when everything else on the page has already failed, so: no motion, no
// custom controls, native inputs only, every field labelled, errors
// announced with role="alert" and tied to their input by aria-describedby.
export const A11Y_REPORT_CATEGORIES = [
  { value: "assistive_technology", label: "Assistive technology issue" },
  { value: "digital_accessibility", label: "Digital accessibility" },
  { value: "something_else", label: "Something else" },
] as const;

export type A11yReportCategory = (typeof A11Y_REPORT_CATEGORIES)[number]["value"];

// Bots fill hidden fields and submit instantly. Both checks are client
// side only, so they are a filter and not a control: each site's endpoint
// keeps its own server-side rate limiting and verification.
const MIN_ELAPSED_MS = 3000;

export function AccessibilityReportForm() {
  const [startedAt] = useState(() => Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<A11yReportCategory | "">("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [company, setCompany] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreementError, setAgreementError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agree) {
      setAgreementError(AGREEMENT_ERROR);
      return;
    }
    setAgreementError("");

    if (A11Y_CAPTCHA_REQUIRED && !captchaToken) {
      setCaptchaError(CAPTCHA_ERROR);
      return;
    }
    setCaptchaError("");

    // Honeypot and dwell time. Failing either returns the same generic
    // error a real failure returns, so a bot learns nothing from the
    // difference.
    if (company.trim() !== "" || Date.now() - startedAt < MIN_ELAPSED_MS) {
      setErrorMessage(GENERIC_ERROR);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const label = A11Y_REPORT_CATEGORIES.find((c) => c.value === category)?.label ?? category;
      const result = await submitAccessibilityReport(
        { name, email, category, categoryLabel: label, message, phone },
        captchaToken
      );
      if (!result.ok) {
        setErrorMessage(result.error || GENERIC_ERROR);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage(GENERIC_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status">
        <p className="rounded border border-a11yline bg-a11ysurface-alt px-4 py-3 font-medium text-a11yink-900">
          Thank you. We received your report and will follow up.
        </p>
        <p className="mt-2 text-a11yink-700">{A11Y_CONTACT_FALLBACK}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot. Positioned off-screen rather than display:none so a
          screen reader can still reach the aria-hidden note if it lands
          here, and never focusable by keyboard. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="a11y-report-company">Company (leave blank)</label>
        <input
          id="a11y-report-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="a11y-report-name" className="font-medium text-a11yink-900">
          Name<span aria-hidden="true"> *</span>
        </label>
        <input
          id="a11y-report-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-[44px] rounded border border-a11yline bg-white px-3 text-a11yink-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="a11y-report-email" className="font-medium text-a11yink-900">
          Email<span aria-hidden="true"> *</span>
        </label>
        <input
          id="a11y-report-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-[44px] rounded border border-a11yline bg-white px-3 text-a11yink-900"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium text-a11yink-900">
          Category<span aria-hidden="true"> *</span>
        </legend>
        {A11Y_REPORT_CATEGORIES.map((c) => (
          <label key={c.value} className="flex min-h-[44px] items-center gap-2 text-a11yink-900">
            <input
              type="radio"
              name="category"
              value={c.value}
              required
              checked={category === c.value}
              onChange={() => setCategory(c.value)}
              className="h-4 w-4"
            />
            {c.label}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="a11y-report-message" className="font-medium text-a11yink-900">
          Describe the issue<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id="a11y-report-message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-describedby="a11y-report-message-hint"
          className="rounded border border-a11yline bg-white px-3 py-2 text-a11yink-900"
        />
        <p id="a11y-report-message-hint" className="text-[14px] text-a11yink-500">
          Tell us the page, what you were trying to do, and what happened. Please do not include sensitive personal
          details here.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="a11y-report-phone" className="font-medium text-a11yink-900">
          Phone (optional)
        </label>
        <input
          id="a11y-report-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="min-h-[44px] rounded border border-a11yline bg-white px-3 text-a11yink-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="a11y-report-agree" className="flex min-h-[44px] items-start gap-2 text-a11yink-900">
          <input
            id="a11y-report-agree"
            name="agree"
            type="checkbox"
            required
            checked={agree}
            aria-describedby={agreementError ? "a11y-report-agree-error" : undefined}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (e.target.checked) setAgreementError("");
            }}
            className="mt-1 h-4 w-4"
          />
          {/* Underlined always, not only on hover. These are links inside a
              sentence, so colour alone is not a permitted distinction under
              WCAG 1.4.1. */}
          <span>
            I have read and agree with the{" "}
            <a href={A11Y_LINKS.terms} className="text-a11ybrand-700 underline underline-offset-2">
              {A11Y_LINKS.termsLabel}
            </a>{" "}
            and the{" "}
            <a href={A11Y_LINKS.privacy} className="text-a11ybrand-700 underline underline-offset-2">
              {A11Y_LINKS.privacyLabel}
            </a>
            .
          </span>
        </label>
        {agreementError ? (
          <p id="a11y-report-agree-error" role="alert" className="text-sm text-a11ydanger">
            {agreementError}
          </p>
        ) : null}
      </div>

      <div className="max-w-full overflow-x-auto">
        <A11yCaptcha onVerify={setCaptchaToken} />
      </div>
      {captchaError ? (
        <div role="alert" className="text-sm text-a11ydanger">
          <p>{captchaError}</p>
          <p className="mt-1 text-a11yink-700">
            If the check will not load, do not let it stop you. {A11Y_CONTACT_FALLBACK}
          </p>
        </div>
      ) : null}

      {status === "error" ? (
        <div role="alert" className="rounded border border-a11ydanger bg-white px-4 py-3">
          <p className="text-a11ydanger">{errorMessage}</p>
          <p className="mt-1 text-a11yink-700">{A11Y_CONTACT_FALLBACK}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex min-h-[44px] w-fit items-center rounded bg-a11ybrand-700 px-6 font-semibold text-white hover:bg-a11ybrand-900 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send report"}
      </button>
    </form>
  );
}
