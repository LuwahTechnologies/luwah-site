"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Turnstile } from "@/components/Turnstile";
import { Field, Area, Select, CheckGroup } from "@/components/intake/IntakeFields";
import {
  AUTOMATION_BUDGET_OPTIONS,
  AUTOMATION_HOSTING_OPTIONS,
  AUTOMATION_TOOL_OPTIONS,
  EMAIL_RE,
  TIMELINE_OPTIONS,
  isValidHours,
  isValidLink,
} from "@/lib/intakeOptions";

const STEPS = ["Bottleneck", "Stack", "Current vs Desired State", "Infrastructure and Budget"];

type FormState = {
  contactName: string; email: string; phone: string;
  processDescription: string; hoursPerWeek: string;
  currentTools: string[]; otherTools: string; trigger: string; destination: string;
  currentStateLink: string; successDescription: string;
  hosting: string; timeline: string; budget: string;
  printedName: string; agreed: boolean;
};

const EMPTY: FormState = {
  contactName: "", email: "", phone: "",
  processDescription: "", hoursPerWeek: "",
  currentTools: [], otherTools: "", trigger: "", destination: "",
  currentStateLink: "", successDescription: "",
  hosting: "", timeline: "", budget: "",
  printedName: "", agreed: false,
};

export function AutomationIntakeForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showErrors, setShowErrors] = useState(false);
  const [focusSignal, setFocusSignal] = useState(0);
  const fieldsRef = useRef<HTMLDivElement>(null);

  const handleToken = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);
  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const toggle = (field: "currentTools", value: string) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));

  // Required fields per step. Messages show only after a blocked Next or Submit.
  const stepErrors = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.contactName.trim()) e.contactName = "Enter your name.";
      if (!form.email.trim()) e.email = "Enter your email address.";
      else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter an email address like name@example.com.";
      if (!form.phone.trim()) e.phone = "Enter a phone number.";
      if (!form.processDescription.trim()) e.processDescription = "Describe the process.";
      if (!isValidHours(form.hoursPerWeek)) e.hoursPerWeek = "Enter a whole number from 1 to 200, or leave this blank.";
    }
    if (step === 1) {
      if (!form.trigger.trim()) e.trigger = "Describe what starts the process.";
      if (!form.destination.trim()) e.destination = "Describe where the result should end up.";
    }
    if (step === 2) {
      if (!form.successDescription.trim()) e.successDescription = "Describe what success looks like.";
      if (!isValidLink(form.currentStateLink)) e.currentStateLink = "Enter a link that starts with http:// or https://, or leave this blank.";
    }
    if (step === 3) {
      if (!form.hosting) e.hosting = "Choose where the automation should run.";
      if (!form.printedName.trim()) e.printedName = "Enter your printed name.";
      if (!form.agreed) e.agreed = "Check the box to confirm.";
    }
    return e;
  };
  const errors = stepErrors();

  const canAdvance = () => Object.keys(errors).length === 0;
  const err = (k: string) => (showErrors ? errors[k] : undefined);

  // Move focus to the first invalid control after a blocked Next or Submit.
  useEffect(() => {
    if (focusSignal === 0) return;
    fieldsRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] button')?.focus();
  }, [focusSignal]);

  const blocked = () => { setShowErrors(true); setFocusSignal((n) => n + 1); };
  const goNext = () => { if (!canAdvance()) return blocked(); setShowErrors(false); setStep(step + 1); };
  const goBack = () => { setShowErrors(false); setStep(step - 1); };

  const handleSubmit = async () => {
    if (status === "sending") return;
    if (!canAdvance()) return blocked();
    if (!turnstileToken) return setShowErrors(true);
    setStatus("sending");
    try {
      const res = await fetch("/api/automation-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstile_token: turnstileToken }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setTurnstileToken(null);
      setResetSignal((n) => n + 1);
    }
  };

  const notice =
    status === "error"
      ? "Something went wrong. Please try again or email hello@luwahtechnologies.com"
      : showErrors && step === STEPS.length - 1 && canAdvance() && !turnstileToken
        ? "Complete the verification check above, then submit again."
        : "";

  if (status === "sent") {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Intake received
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Thank you. We will review your process and reply within 24 hours at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              backgroundColor: i === step ? "var(--color-copper)" : "var(--color-bg-input)",
              color: i === step ? "var(--color-bg-primary)" : "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div ref={fieldsRef} className="flex flex-col gap-5">
        {step === 0 && (
          <>
            <Field label="Your name *" error={err("contactName")} value={form.contactName} onChange={(v) => update({ contactName: v })} autoComplete="name" />
            <Field label="Email *" error={err("email")} value={form.email} onChange={(v) => update({ email: v })} type="email" autoComplete="email" />
            <Field label="Phone *" error={err("phone")} value={form.phone} onChange={(v) => update({ phone: v })} type="tel" autoComplete="tel" />
            <Area label="What process is slowing you down? *" error={err("processDescription")} hint="Describe the task step by step, who does it, and how often." value={form.processDescription} onChange={(v) => update({ processDescription: v })} />
            <Field label="Hours per week spent on it" error={err("hoursPerWeek")} hint="Whole hours, 1 to 200. Leave blank if you are not sure." value={form.hoursPerWeek} onChange={(v) => update({ hoursPerWeek: v })} type="number" />
          </>
        )}

        {step === 1 && (
          <>
            <CheckGroup label="Which tools do you use now?" options={AUTOMATION_TOOL_OPTIONS} selected={form.currentTools} onToggle={(v) => toggle("currentTools", v)} />
            <Field label="Other tools" hint="Name any tool not listed above." value={form.otherTools} onChange={(v) => update({ otherTools: v })} />
            <Area label="What starts the process? *" error={err("trigger")} hint="For example: a new form entry, a paid invoice, or an email from a client." value={form.trigger} onChange={(v) => update({ trigger: v })} />
            <Area label="Where should the result end up? *" error={err("destination")} hint="For example: a row in Airtable, a contact in HubSpot, or a Slack message." value={form.destination} onChange={(v) => update({ destination: v })} />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Link showing how it works today" error={err("currentStateLink")} hint="A Loom video, Google Drive file, or diagram. Turn sharing on. We do not take file uploads." value={form.currentStateLink} onChange={(v) => update({ currentStateLink: v })} type="url" />
            <Area label="What does success look like? *" error={err("successDescription")} hint="Describe the process once it runs without you." value={form.successDescription} onChange={(v) => update({ successDescription: v })} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="card p-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Before you submit</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Discovery is a paid, fixed-price step. It comes before any build.</li>
                <li>We cannot set the final scope until we have reviewed the systems you use.</li>
                <li>Your budget range helps us plan. It does not set the price.</li>
              </ul>
            </div>
            <Select label="Where should the automation run? *" error={err("hosting")} options={AUTOMATION_HOSTING_OPTIONS} value={form.hosting} onChange={(v) => update({ hosting: v })} />
            <Select label="When do you need it running?" options={TIMELINE_OPTIONS} value={form.timeline} onChange={(v) => update({ timeline: v })} />
            <Select label="Budget range" options={AUTOMATION_BUDGET_OPTIONS} value={form.budget} onChange={(v) => update({ budget: v })} />
            <Field label="Printed name *" error={err("printedName")} hint="Confirms the information is accurate." value={form.printedName} onChange={(v) => update({ printedName: v })} />
            <label className="flex items-start gap-3" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={form.agreed} aria-invalid={err("agreed") ? true : undefined} aria-describedby={err("agreed") ? "agreed-err" : undefined} onChange={(e) => update({ agreed: e.target.checked })}
                className="mt-1 h-4 w-4" style={{ accentColor: "var(--color-copper)" }} />
              <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                I confirm the information provided is accurate and that I am authorized to request this
                automation work. *
              </span>
            </label>
            {err("agreed") && <p id="agreed-err" className="-mt-3 text-xs" style={{ color: "#ef4444" }}>{err("agreed")}</p>}
            <Turnstile onToken={handleToken} onExpire={handleExpire} resetSignal={resetSignal} />
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={goBack} className="btn-secondary flex items-center gap-2" type="button">
            <ArrowLeft size={16} /> Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button onClick={goNext} aria-disabled={!canAdvance()}
            className="btn-primary flex items-center gap-2" type="button" style={{ opacity: canAdvance() ? 1 : 0.5 }}>
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} aria-disabled={!canAdvance() || !turnstileToken || status === "sending"}
            className="btn-primary flex items-center gap-2" type="button"
            style={{ opacity: canAdvance() && turnstileToken ? 1 : 0.5 }}>
            {status === "sending" ? "Submitting..." : "Submit intake"} {status !== "sending" && <Check size={16} />}
          </button>
        )}
      </div>

      {/* Always mounted so screen readers announce the text when it appears. */}
      <p role="alert" className={`text-center text-sm${notice ? " mt-4" : ""}`} style={{ color: "#ef4444" }}>
        {notice}
      </p>
    </div>
  );
}
