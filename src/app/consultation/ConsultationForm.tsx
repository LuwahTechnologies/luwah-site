"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { capturePartialLead } from "@/lib/capturePartialLead";
import { submitIntakeForm } from "@/lib/intakePayload";
import { Turnstile } from "@/components/Turnstile";

const INDUSTRIES = [
  "Salon / Beauty / Barbershop",
  "Staffing / Recruiting",
  "Restaurant / Food & Beverage",
  "Brewery / Distillery / Winery",
  "Retail / Liquor Store",
  "Professional Services",
  "Healthcare / Wellness",
  "Real Estate / Property Management",
  "Nonprofit / Community Organization",
  "Other",
];

const HELP_AREAS = [
  "Automating repetitive tasks",
  "Getting my systems to talk to each other",
  "Understanding my business data better",
  "Bringing back lapsed customers",
  "Streamlining invoicing or payments",
  "Setting up professional email or online presence",
  "Something else",
];

const REFERRAL_SOURCES = [
  "Google Search",
  "Referral",
  "YouTube",
  "LinkedIn",
  "n8n Community",
  "Other",
];

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  industryOther: string;
  pos: string;
  booking: string;
  accounting: string;
  emailMarketing: string;
  otherTools: string;
  biggestChallenge: string;
  helpAreas: string[];
  urgency: string;
  preferredContact: string;
  availability: string[];
  referralSource: string;
  consent: boolean;
};

const INITIAL: FormData = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  industry: "",
  industryOther: "",
  pos: "",
  booking: "",
  accounting: "",
  emailMarketing: "",
  otherTools: "",
  biggestChallenge: "",
  helpAreas: [],
  urgency: "",
  preferredContact: "",
  availability: [],
  referralSource: "",
  consent: false,
};

const STEPS = ["About You", "Your Tools", "Your Challenges", "Budget & Scheduling"];

export function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);

  const update = (fields: Partial<FormData>) => setForm((prev) => ({ ...prev, ...fields }));

  const toggleArray = (key: "helpAreas" | "availability", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const canAdvance = () => {
    if (step === 0) return form.fullName && form.email && form.businessName && form.industry;
    if (step === 1) return true;
    if (step === 2) return form.biggestChallenge.length >= 20;
    if (step === 3) return form.preferredContact && form.consent;
    return false;
  };

  const handleSubmit = async () => {
    if (!canAdvance() || !turnstileToken) return;
    setStatus("sending");
    try {
      await submitIntakeForm({
        lead_status: "complete",
        contact: {
          full_name: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          preferred_contact: form.preferredContact,
          availability: form.availability,
        },
        business: {
          name: form.businessName,
          industry: form.industry,
          industry_other: form.industry === "Other" ? form.industryOther : undefined,
          current_tools: {
            pos: form.pos,
            booking: form.booking,
            accounting: form.accounting,
            email_marketing: form.emailMarketing,
            other: form.otherTools,
          },
        },
        needs: {
          biggest_challenge: form.biggestChallenge,
          help_areas: form.helpAreas,
          urgency: form.urgency,
        },
        referral_source: form.referralSource,
        metadata: {
          submitted_at: new Date().toISOString(),
          source: "website",
          turnstile_token: turnstileToken,
        },
      });
      setStatus("sent");
      setTimeout(() => {
        setForm(INITIAL);
        setStep(0);
        setStatus("idle");
      }, 5000);
    } catch {
      setStatus("error");
    }
  };

  const next = () => {
    if (step < 3 && canAdvance()) {
      if (step === 0) capturePartialLead(form.fullName, form.email, 1);
      else if (step === 1) capturePartialLead(form.fullName, form.email, 2);
      else if (step === 2) capturePartialLead(form.fullName, form.email, 3);
      setStep(step + 1);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--color-bg-input)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-body)",
  };

  const labelStyle = {
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-display)" as const,
    fontWeight: 500 as const,
    fontSize: "0.875rem",
  };

  const chipStyle = (active: boolean) => ({
    backgroundColor: active ? "var(--color-copper-subtle)" : "var(--color-bg-elevated)",
    border: `1px solid ${active ? "var(--color-copper)" : "var(--color-border)"}`,
    color: active ? "var(--color-copper)" : "var(--color-text-secondary)",
    cursor: "pointer" as const,
  });

  if (status === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mx-6 max-w-lg p-12 text-center"
        >
          <Check size={32} className="mx-auto mb-6" style={{ color: "var(--color-copper)" }} />
          <h2
            className="mb-3 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Got it. We&apos;ll be in touch!
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Daniel will review your submission and reach out within 24 hours to
            schedule your free 30-minute consultation.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[640px] px-6">
          <h1
            className="mb-3 text-center text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Book a free consultation
          </h1>
          <p
            className="mx-auto mb-12 max-w-md text-center text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            30 minutes, focused entirely on your business. You&apos;ll hear
            from Daniel within 24 hours.
          </p>

          {/* Progress */}
          <div className="mb-10 flex items-center justify-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <button
                  onClick={() => i < step && setStep(i)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: i <= step ? "var(--color-copper)" : "var(--color-bg-elevated)",
                    color: i <= step ? "#09090b" : "var(--color-text-muted)",
                    border: "none",
                    cursor: i < step ? "pointer" : "default",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-px w-8"
                    style={{
                      backgroundColor: i < step ? "var(--color-copper)" : "var(--color-border)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <p
            className="mb-8 text-center text-sm font-medium"
            style={{ color: "var(--color-copper)" }}
          >
            {STEPS[step]}
          </p>

          {/* Form */}
          <div className="card p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Full Name *</label>
                      <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder="Jane Rodriguez" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Email *</label>
                      <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="jane@herbusiness.com" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Phone (optional)</label>
                      <input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(720) 555-1234" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Business Name *</label>
                      <input type="text" value={form.businessName} onChange={(e) => update({ businessName: e.target.value })} placeholder="Rodriguez Beauty Studio" className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Industry *</label>
                      <select value={form.industry} onChange={(e) => update({ industry: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle}>
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                      </select>
                    </div>
                    {form.industry === "Other" && (
                      <div>
                        <label className="mb-1.5 block" style={labelStyle}>Specify industry</label>
                        <input type="text" value={form.industryOther} onChange={(e) => update({ industryOther: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                      </div>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      Understanding your current tools helps us identify integration opportunities. All fields optional.
                    </p>
                    {[
                      { label: "POS System", key: "pos" as const, opts: ["Square", "Clover", "Toast", "Shopify POS", "None", "Other"] },
                      { label: "Booking Software", key: "booking" as const, opts: ["Vagaro", "GlossGenius", "Acuity", "Calendly", "None", "Other"] },
                      { label: "Accounting", key: "accounting" as const, opts: ["QuickBooks", "Wave", "FreshBooks", "Xero", "None", "Other"] },
                      { label: "Email Marketing", key: "emailMarketing" as const, opts: ["Mailchimp", "Constant Contact", "None", "Other"] },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="mb-1.5 block" style={labelStyle}>{field.label}</label>
                        <select value={form[field.key]} onChange={(e) => update({ [field.key]: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle}>
                          <option value="">Select or skip</option>
                          {field.opts.map((o) => (<option key={o} value={o}>{o}</option>))}
                        </select>
                      </div>
                    ))}
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>Other tools you use</label>
                      <textarea value={form.otherTools} onChange={(e) => update({ otherTools: e.target.value })} placeholder="Any other software or tools..." rows={2} className="w-full resize-y rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>What&apos;s your biggest challenge? *</label>
                      <p className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        Describe what&apos;s taking up too much time or what process frustrates you most. (Min 20 characters)
                      </p>
                      <textarea value={form.biggestChallenge} onChange={(e) => update({ biggestChallenge: e.target.value })} rows={4} className="w-full resize-y rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="mb-2 block" style={labelStyle}>What would help most?</label>
                      <div className="flex flex-wrap gap-2">
                        {HELP_AREAS.map((area) => (
                          <button key={area} type="button" onClick={() => toggleArray("helpAreas", area)}
                            className="chip-button rounded-md px-4 py-2 text-sm transition-all"
                            style={chipStyle(form.helpAreas.includes(area))}>
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block" style={labelStyle}>How urgent is this?</label>
                      <div className="flex flex-wrap gap-2">
                        {["Just exploring", "Planning for next quarter", "Need help now"].map((opt) => (
                          <button key={opt} type="button" onClick={() => update({ urgency: opt })}
                            className="chip-button rounded-md px-4 py-2 text-sm transition-all"
                            style={chipStyle(form.urgency === opt)}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-2 block" style={labelStyle}>Preferred contact method *</label>
                      <div className="flex gap-2">
                        {["Email", "Phone", "Either works"].map((opt) => (
                          <button key={opt} type="button" onClick={() => update({ preferredContact: opt })}
                            className="chip-button rounded-md px-4 py-2 text-sm transition-all"
                            style={chipStyle(form.preferredContact === opt)}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block" style={labelStyle}>Best days/times</label>
                      <div className="flex flex-wrap gap-2">
                        {["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends"].map((t) => (
                          <button key={t} type="button" onClick={() => toggleArray("availability", t)}
                            className="chip-button rounded-md px-4 py-2 text-sm transition-all"
                            style={chipStyle(form.availability.includes(t))}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block" style={labelStyle}>How did you find us?</label>
                      <select value={form.referralSource} onChange={(e) => update({ referralSource: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle}>
                        <option value="">Select or skip</option>
                        {REFERRAL_SOURCES.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                    <label className="mt-2 flex items-start gap-3" style={{ cursor: "pointer" }}>
                      <input type="checkbox" checked={form.consent} onChange={(e) => update({ consent: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded"
                        style={{ accentColor: "var(--color-copper)" }} />
                      <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        I agree that Luwah Technologies may store and use this information to contact me about my consultation request. My data will not be shared with third parties.
                      </span>
                    </label>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="btn-secondary flex items-center gap-2" type="button">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button onClick={next} disabled={!canAdvance()} className="btn-primary flex items-center gap-2" type="button"
                  style={{ opacity: canAdvance() ? 1 : 0.5 }}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Turnstile onToken={handleToken} onExpire={handleExpire} />
                  <button onClick={handleSubmit} disabled={!canAdvance() || !turnstileToken || status === "sending"} className="btn-primary flex items-center gap-2" type="button"
                    style={{ opacity: canAdvance() && turnstileToken ? 1 : 0.5 }}>
                    {status === "sending" ? "Submitting..." : "Submit"} {status !== "sending" && <Check size={16} />}
                  </button>
                </div>
              )}
            </div>

            {status === "error" && (
              <p className="mt-4 text-center text-sm" style={{ color: "#ef4444" }}>
                Something went wrong. Please try again or email us at hello@luwahtechnologies.com
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span>30-minute free call</span>
            <span>&middot;</span>
            <span>No sales pitch</span>
            <span>&middot;</span>
            <span>Response within 24 hours</span>
          </div>
        </div>
      </section>
    </div>
  );
}
