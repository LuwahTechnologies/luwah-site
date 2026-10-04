"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Turnstile } from "@/components/Turnstile";
import { Field, Area, Select, Radio, CheckGroup } from "@/components/intake/IntakeFields";
import { EMAIL_RE, TIMELINE_OPTIONS } from "@/lib/intakeOptions";

interface TierOption {
  key: string;
  name: string;
  priceLabel: string;
}

const PRIMARY_GOALS = [
  "Capture leads / contact requests",
  "Drive bookings or appointments",
  "Sell products or services online",
  "Establish credibility / brand presence",
  "Educate or inform visitors",
  "Other",
];
const LOGO_OPTIONS = ["Yes, I will send the file", "No, I need a logo designed", "In progress"];
const PAGE_OPTIONS = [
  "Home", "About / Our Story", "Services", "Pricing", "Portfolio / Gallery",
  "Testimonials / Reviews", "Blog / Articles", "FAQ", "Contact", "Book / Schedule",
  "Team / Staff", "Shop / Products",
];
const TESTIMONIAL_OPTIONS = ["Yes, I have them", "No, I will gather some", "No, I don't have any"];
const FORM_OPTIONS = [
  "General contact / inquiry form", "Lead capture form",
  "Appointment / booking request form", "Newsletter signup", "Custom form",
];
const BOOKING_OPTIONS = ["Calendly", "Acuity Scheduling", "Square Appointments", "Mindbody", "Other", "None, I need one set up"];
const PAYMENT_OPTIONS = ["Yes, I have a Stripe account", "Yes, I need help setting up payments", "No, not now"];
const AUTOMATION_OPTIONS = [
  "Free: Google Apps Script",
  "Paid: n8n Cloud workflow engine",
  "Self-Hosted n8n via Luwah",
  "Not sure, please advise",
];
const MEDIA_OPTIONS = [
  "Professional photos of team", "Product or service photos", "Logo file",
  "Brand guidelines document", "Video content", "None yet",
];
const DOMAIN_OPTIONS = ["Yes, I own it already", "No, I need help purchasing one", "Not sure what a domain is"];
const HOSTING_OPTIONS = ["Managed hosting via Luwah", "I'll host it myself", "Not sure, please advise"];

const CONTENT_OWNER_OPTIONS = ["I will write it", "Write it for me", "A mix of both"];
const SUPPORT_EMAIL = "info@luwahtechnologies.com";

const STEPS = ["Business", "Goals & Tier", "Brand", "Pages & Content", "Forms & Media", "Logistics"];

type FormState = {
  businessName: string; contactName: string; email: string; phone: string;
  industry: string; location: string; tagline: string; mission: string; elevatorPitch: string;
  primaryGoal: string; targetAudience: string; mainCta: string; problemSolved: string; tier: string;
  hasLogo: string; brandColors: string; fonts: string; vibe: string; referenceSites: string; avoid: string;
  pages: string[]; otherPages: string; homeSections: string; aboutContent: string; services: string;
  hasTestimonials: string; testimonials: string; otherCopy: string;
  forms: string[]; customForm: string; bookingTool: string; needsPayments: string;
  automationPreference: string; otherTools: string; media: string[]; mediaNotes: string;
  hasDomain: string; domainName: string; registrar: string; hostingPreference: string;
  timeline: string; budget: string; anythingElse: string; printedName: string; agreed: boolean;
  addons: string[]; currentSite: string; businessHours: string; address: string;
  socialLinks: string; keywords: string;
  contentOwner: string; assetsLink: string; decisionMaker: string;
};

const EMPTY: FormState = {
  businessName: "", contactName: "", email: "", phone: "", industry: "", location: "",
  tagline: "", mission: "", elevatorPitch: "", primaryGoal: "", targetAudience: "", mainCta: "",
  problemSolved: "", tier: "", hasLogo: "", brandColors: "", fonts: "", vibe: "", referenceSites: "",
  avoid: "", pages: [], otherPages: "", homeSections: "", aboutContent: "", services: "",
  hasTestimonials: "", testimonials: "", otherCopy: "", forms: [], customForm: "", bookingTool: "",
  needsPayments: "", automationPreference: "", otherTools: "", media: [], mediaNotes: "",
  hasDomain: "", domainName: "", registrar: "", hostingPreference: "", timeline: "", budget: "",
  anythingElse: "", printedName: "", agreed: false,
  addons: [], currentSite: "", businessHours: "", address: "",
  socialLinks: "", keywords: "", contentOwner: "", assetsLink: "", decisionMaker: "",
};

export function BuildIntakeForm({ tiers, addons }: { tiers: TierOption[]; addons: string[] }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showErrors, setShowErrors] = useState(false);
  const [verifyPrompt, setVerifyPrompt] = useState(false);
  const [focusSignal, setFocusSignal] = useState(0);
  const [backSignal, setBackSignal] = useState(0);
  const fieldsRef = useRef<HTMLDivElement>(null);

  const handleToken = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);
  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const toggle = (field: "pages" | "forms" | "media" | "addons", value: string) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));

  const tierOptions = [...tiers.map((t) => `${t.name} (${t.priceLabel})`), "Not sure, please advise"];

  // Same required fields as before. Messages show only after a blocked Next or Submit.
  const stepErrors = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.businessName.trim()) e.businessName = "Enter your business or brand name.";
      if (!form.contactName.trim()) e.contactName = "Enter your name.";
      if (!form.email.trim()) e.email = "Enter your email address.";
      else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter an email address like name@example.com.";
    }
    if (step === 1) {
      if (!form.primaryGoal) e.primaryGoal = "Choose a primary goal.";
      if (!form.targetAudience.trim()) e.targetAudience = "Describe your target audience.";
      if (!form.mainCta.trim()) e.mainCta = "Enter your main call to action.";
    }
    if (step === 3) {
      if (form.pages.length === 0) e.pages = "Choose at least one page.";
      if (!form.homeSections.trim()) e.homeSections = "Describe your home page sections.";
      if (!form.services.trim()) e.services = "List your services.";
    }
    if (step === 4 && form.forms.length === 0) e.forms = "Choose at least one form.";
    if (step === 5) {
      if (!form.hasDomain) e.hasDomain = "Choose an option.";
      if (!form.timeline) e.timeline = "Choose when you need the site live.";
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
  // The Back button unmounts on step 1, so hand focus to the fields container instead of body.
  useEffect(() => {
    if (backSignal === 0) return;
    fieldsRef.current?.focus();
  }, [backSignal]);

  const goBack = () => { setShowErrors(false); setStep(step - 1); if (step === 1) setBackSignal((n) => n + 1); };

  const handleSubmit = async () => {
    if (status === "sending") return;
    if (!canAdvance()) return blocked();
    if (!turnstileToken) return setVerifyPrompt(true);
    setStatus("sending");
    try {
      const res = await fetch("/api/build-intake", {
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
    verifyPrompt && !turnstileToken
      ? "Complete the verification check above, then submit again."
      : status === "error"
        ? "Something went wrong. Please try again or email hello@luwahtechnologies.com"
        : "";

  if (status === "sent") {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Intake received
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Thank you. We have everything we need to begin. Expect a confirmation and next steps within
          24 hours at the email you provided.
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

      <div ref={fieldsRef} tabIndex={-1} className="flex flex-col gap-5 focus:outline-none">
        {step === 0 && (
          <>
            <Field label="Business / brand name *" error={err("businessName")} value={form.businessName} onChange={(v) => update({ businessName: v })} autoComplete="organization" />
            <Field label="Your name (owner / contact) *" error={err("contactName")} value={form.contactName} onChange={(v) => update({ contactName: v })} autoComplete="name" />
            <Field label="Email *" error={err("email")} value={form.email} onChange={(v) => update({ email: v })} type="email" autoComplete="email" />
            <Field label="Phone" value={form.phone} onChange={(v) => update({ phone: v })} autoComplete="tel" />
            <Field label="Industry / niche" value={form.industry} onChange={(v) => update({ industry: v })} />
            <Field label="City / location" value={form.location} onChange={(v) => update({ location: v })} />
            <Field label="Current website address" hint="Leave blank if you do not have one. Choose the site migration add-on if we are moving it." value={form.currentSite} onChange={(v) => update({ currentSite: v })} />
            <Area label="Business address and service area" hint="Street address if customers visit you, and the areas you serve." value={form.address} onChange={(v) => update({ address: v })} />
            <Area label="Business hours" value={form.businessHours} onChange={(v) => update({ businessHours: v })} />
            <Area label="Social media and Google Business Profile links" hint="One per line." value={form.socialLinks} onChange={(v) => update({ socialLinks: v })} />
            <Field label="Tagline or slogan" value={form.tagline} onChange={(v) => update({ tagline: v })} />
            <Area label="Mission statement" hint="What is your business here to do? Who do you serve and how?" value={form.mission} onChange={(v) => update({ mission: v })} />
            <Area label="Elevator pitch" hint="What you do in 1-2 sentences." value={form.elevatorPitch} onChange={(v) => update({ elevatorPitch: v })} />
          </>
        )}

        {step === 1 && (
          <>
            <Radio label="Primary goal of this website *" error={err("primaryGoal")} options={PRIMARY_GOALS} value={form.primaryGoal} onChange={(v) => update({ primaryGoal: v })} />
            <Area label="Target audience *" error={err("targetAudience")} hint="Age, profession, pain points, location. Be specific." value={form.targetAudience} onChange={(v) => update({ targetAudience: v })} />
            <Field label="Main call to action *" error={err("mainCta")} hint='e.g. "Book a free consultation"' value={form.mainCta} onChange={(v) => update({ mainCta: v })} />
            <Area label="What problem does your site solve?" value={form.problemSolved} onChange={(v) => update({ problemSolved: v })} />
            <Select label="Which tier are you considering?" options={tierOptions} value={form.tier} onChange={(v) => update({ tier: v })} />
            <CheckGroup label="Add-ons you want included" options={addons} selected={form.addons} onToggle={(v) => toggle("addons", v)} />
          </>
        )}

        {step === 2 && (
          <>
            <Select label="Do you have an existing logo?" options={LOGO_OPTIONS} value={form.hasLogo} onChange={(v) => update({ hasLogo: v })} />
            <Field label="Brand colors" hint="Hex codes or a description." value={form.brandColors} onChange={(v) => update({ brandColors: v })} />
            <Field label="Font preferences" value={form.fonts} onChange={(v) => update({ fonts: v })} />
            <Field label="Overall vibe and aesthetic" hint="Luxury, minimal, bold, warm, earthy, etc." value={form.vibe} onChange={(v) => update({ vibe: v })} />
            <Area label="Reference websites you like" hint="URLs, one per line, with what you like." value={form.referenceSites} onChange={(v) => update({ referenceSites: v })} />
            <Area label="Anything you do NOT want" value={form.avoid} onChange={(v) => update({ avoid: v })} />
          </>
        )}

        {step === 3 && (
          <>
            <CheckGroup label="Which pages do you need? *" error={err("pages")} options={PAGE_OPTIONS} selected={form.pages} onToggle={(v) => toggle("pages", v)} />
            <Field label="Other pages not listed" value={form.otherPages} onChange={(v) => update({ otherPages: v })} />
            <Area label="Home page sections *" error={err("homeSections")} hint="List each section and describe it." value={form.homeSections} onChange={(v) => update({ homeSections: v })} />
            <Area label="About page content" value={form.aboutContent} onChange={(v) => update({ aboutContent: v })} />
            <Area label="Services (name, description, price) *" error={err("services")} value={form.services} onChange={(v) => update({ services: v })} />
            <Select label="Do you have testimonials?" options={TESTIMONIAL_OPTIONS} value={form.hasTestimonials} onChange={(v) => update({ hasTestimonials: v })} />
            <Area label="Testimonials, awards, certifications" value={form.testimonials} onChange={(v) => update({ testimonials: v })} />
            <Select label="Who writes the page copy?" options={CONTENT_OWNER_OPTIONS} value={form.contentOwner} onChange={(v) => update({ contentOwner: v })} />
            <Area label="Search terms you want to be found for" hint="For example: roofing contractor Aurora CO." value={form.keywords} onChange={(v) => update({ keywords: v })} />
            <Area label="Any other copy you have ready" value={form.otherCopy} onChange={(v) => update({ otherCopy: v })} />
          </>
        )}

        {step === 4 && (
          <>
            <CheckGroup label="Which forms do you need? *" error={err("forms")} options={FORM_OPTIONS} selected={form.forms} onToggle={(v) => toggle("forms", v)} />
            <Area label="Custom form details" value={form.customForm} onChange={(v) => update({ customForm: v })} />
            <Select label="Booking / scheduling tool" options={BOOKING_OPTIONS} value={form.bookingTool} onChange={(v) => update({ bookingTool: v })} />
            <Select label="Do you need to collect payments?" options={PAYMENT_OPTIONS} value={form.needsPayments} onChange={(v) => update({ needsPayments: v })} />
            <Select label="Automation preference for lead tracking" options={AUTOMATION_OPTIONS} value={form.automationPreference} onChange={(v) => update({ automationPreference: v })} />
            <Field label="Other tools to connect" hint="CRM, email marketing, POS, analytics." value={form.otherTools} onChange={(v) => update({ otherTools: v })} />
            <CheckGroup label="What media do you have ready?" options={MEDIA_OPTIONS} selected={form.media} onToggle={(v) => toggle("media", v)} />
            <Area label="Notes on media" value={form.mediaNotes} onChange={(v) => update({ mediaNotes: v })} />
            <Field label="Link to your shared folder of files" hint={`Google Drive, Dropbox or similar, with sharing turned on. No folder? Email files to ${SUPPORT_EMAIL} with your business name in the subject.`} value={form.assetsLink} onChange={(v) => update({ assetsLink: v })} />
          </>
        )}

        {step === 5 && (
          <>
            <Select label="Do you have a domain name? *" error={err("hasDomain")} options={DOMAIN_OPTIONS} value={form.hasDomain} onChange={(v) => update({ hasDomain: v })} />
            <Field label="Domain name (if you own one)" value={form.domainName} onChange={(v) => update({ domainName: v })} />
            <Field label="Where is it registered?" value={form.registrar} onChange={(v) => update({ registrar: v })} />
            <Select label="Hosting preference" options={HOSTING_OPTIONS} value={form.hostingPreference} onChange={(v) => update({ hostingPreference: v })} />
            <Select label="When do you need the site live? *" error={err("timeline")} options={TIMELINE_OPTIONS} value={form.timeline} onChange={(v) => update({ timeline: v })} />
            <Select label="Budget range" options={tierOptions} value={form.budget} onChange={(v) => update({ budget: v })} />
            <Field label="Who approves the final site?" hint="Name and email if it is not you." value={form.decisionMaker} onChange={(v) => update({ decisionMaker: v })} />
            <Area label="Anything else we should know?" value={form.anythingElse} onChange={(v) => update({ anythingElse: v })} />
            <Field label="Printed name *" error={err("printedName")} hint="Confirms the information is accurate." value={form.printedName} onChange={(v) => update({ printedName: v })} />
            <label className="flex items-start gap-3" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={form.agreed} aria-invalid={err("agreed") ? true : undefined} aria-describedby={err("agreed") ? "agreed-err" : undefined} onChange={(e) => update({ agreed: e.target.checked })}
                className="mt-1 h-4 w-4" style={{ accentColor: "var(--color-copper)" }} />
              <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                I confirm the information provided is accurate and that I am authorized to commission
                this website project. *
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
