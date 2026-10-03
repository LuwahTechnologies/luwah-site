"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Check, Info, ArrowLeft, ArrowRight } from "lucide-react";
import { Turnstile } from "@/components/Turnstile";
import { type WebCatalog, computeOrderTotal } from "@/lib/webCatalog";

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg-input)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-body)",
};

const STEPS = ["Option", "Add-ons", "Support", "Your details"];

export function OrderForm({ catalog }: { catalog: WebCatalog }) {
  // Quote-only tiers (Custom Build) go through a consultation, not this form.
  const orderableTiers = catalog.tiers.filter((t) => !t.cta);
  const quoteTier = catalog.tiers.find((t) => t.cta);
  const firstTier = orderableTiers.find((t) => t.highlight) || orderableTiers[0];
  const [step, setStep] = useState(0);
  const [tierKey, setTierKey] = useState(firstTier?.key || "");
  const [addonKeys, setAddonKeys] = useState<string[]>([]);
  const [extraPages, setExtraPages] = useState(0);
  const [supportPlanKey, setSupportPlanKey] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", businessName: "", notes: "" });
  const [expanded, setExpanded] = useState<string[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleToken = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);

  const tier = catalog.tiers.find((t) => t.key === tierKey);
  const included = useMemo(() => new Set(tier?.includedAddons || []), [tier]);

  const totals = useMemo(
    () => computeOrderTotal(catalog, { tierKey, addonKeys, extraPages }),
    [catalog, tierKey, addonKeys, extraPages]
  );

  const toggleAddon = (key: string) => {
    if (included.has(key)) return;
    setAddonKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };
  const toggleInfo = (key: string) =>
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const canAdvance = () => {
    if (step === 0) return !!tierKey;
    if (step === 3) return form.fullName.trim() && form.email.trim() && !!turnstileToken;
    return true;
  };
  const last = STEPS.length - 1;

  const handleSubmit = async () => {
    if (!canAdvance() || status === "sending") return;
    setStatus("sending");
    try {
      const sendAddons = addonKeys.filter((k) => !included.has(k));
      const res = await fetch("/api/web-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tierKey,
          addonKeys: sendAddons,
          extraPages: tier?.perPage ? extraPages : 0,
          supportPlanKey,
          turnstile_token: turnstileToken,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Order received</h2>
        <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Thanks. We will send a quote within 24 to 48 hours. To speed up the build, complete the
          intake form next so we have your brand, pages, and content.
        </p>
        <Link href="/intake" className="btn-primary">Continue to build intake</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <span key={label} className="rounded-full px-3 py-1 text-xs"
            style={{
              backgroundColor: i === step ? "var(--color-copper)" : "var(--color-bg-input)",
              color: i === step ? "#fff" : "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {/* Step 0: tier */}
      {step === 0 && (
        <>
          <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Choose your option</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {orderableTiers.map((t) => {
              const active = t.key === tierKey;
              return (
                <button key={t.key} type="button" onClick={() => setTierKey(t.key)}
                  className="card p-5 text-left transition-all"
                  style={{ borderColor: active ? "var(--color-copper)" : "var(--color-border)" }}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>{t.name}</span>
                    <span className="text-lg font-bold" style={{ color: "var(--color-copper)" }}>{t.priceLabel}</span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{t.pages}</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>{t.summary}</p>
                </button>
              );
            })}
          </div>
          {quoteTier?.cta && (
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Need something custom? {quoteTier.name} starts at {fmt(quoteTier.price)} and is quoted after a discovery call.{" "}
              <Link href={quoteTier.cta.href} className="underline" style={{ color: "var(--color-copper)" }}>{quoteTier.cta.label}</Link>
            </p>
          )}
          {tier?.perPage && (
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium">
                Extra pages (beyond the 4 included): {fmt(catalog.perPagePrice)} each
              </label>
              <input type="number" min={0} max={50} value={extraPages}
                onChange={(e) => setExtraPages(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            </div>
          )}
        </>
      )}

      {/* Step 1: add-ons */}
      {step === 1 && (
        <>
          <h2 className="mb-1 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Add-ons</h2>
          <p className="mb-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Tap the i for a quick explanation of any add-on.
          </p>
          <div className="flex flex-col gap-2">
            {catalog.addons.filter((a) => a.orderable !== false).map((a) => {
              const isIncluded = included.has(a.key);
              const checked = isIncluded || addonKeys.includes(a.key);
              const open = expanded.includes(a.key);
              return (
                <div key={a.key} className="card overflow-hidden"
                  style={{ borderColor: checked ? "var(--color-copper-border)" : undefined, opacity: isIncluded ? 0.75 : 1 }}>
                  <div className="flex items-center justify-between p-4">
                    <button type="button" onClick={() => toggleAddon(a.key)} disabled={isIncluded}
                      className="flex flex-1 items-center gap-3 text-left"
                      style={{ background: "none", border: "none", cursor: isIncluded ? "default" : "pointer" }}>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                        style={{ border: "1px solid var(--color-border)", backgroundColor: checked ? "var(--color-copper)" : "transparent" }}>
                        {checked && <Check size={13} color="#fff" />}
                      </span>
                      <span className="text-sm">{a.name}</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {isIncluded ? "Included" : a.oneTimeLabel}{a.monthlyLabel ? ` · ${a.monthlyLabel}` : ""}
                      </span>
                      {a.description && (
                        <button type="button" onClick={() => toggleInfo(a.key)} aria-label={`About ${a.name}`}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}>
                          <Info size={16} style={{ color: open ? "var(--color-copper)" : "var(--color-text-muted)" }} />
                        </button>
                      )}
                    </div>
                  </div>
                  {open && a.description && (
                    <p className="border-t px-4 py-3 text-xs leading-relaxed"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                      {a.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Step 2: support */}
      {step === 2 && (
        <>
          <h2 className="mb-1 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Ongoing support</h2>
          <p className="mb-4 text-sm" style={{ color: "var(--color-text-muted)" }}>Optional. You can decide later.</p>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setSupportPlanKey("")}
              className="card flex items-center justify-between p-4 text-left"
              style={{ borderColor: supportPlanKey === "" ? "var(--color-copper)" : "var(--color-border)" }}>
              <span className="text-sm">No plan / decide later</span>
            </button>
            {catalog.supportPlans.map((p) => (
              <button key={p.key} type="button" onClick={() => setSupportPlanKey(p.key)}
                className="card flex flex-col p-4 text-left"
                style={{ borderColor: supportPlanKey === p.key ? "var(--color-copper)" : "var(--color-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="text-sm" style={{ color: "var(--color-copper)" }}>{p.priceLabel}</span>
                </div>
                <span className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{p.includes}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 3: details */}
      {step === 3 && (
        <>
          <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Your details</h2>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <input placeholder="Full name *" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            <input placeholder="Email *" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
            <input placeholder="Business name" value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
          </div>
          <textarea placeholder="Anything else about your project?" rows={3} value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mb-6 w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
          <Turnstile onToken={handleToken} onExpire={handleExpire} />
        </>
      )}

      {/* Running total */}
      <div className="card mt-8 flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            Estimated one-time total
          </p>
          {totals.hasVariableItems && (
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Plus quoted items.</p>
          )}
        </div>
        <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(totals.total)}</p>
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </button>
        ) : <div />}
        {step < last ? (
          <button type="button" onClick={() => canAdvance() && setStep(step + 1)} disabled={!canAdvance()}
            className="btn-primary flex items-center gap-2" style={{ opacity: canAdvance() ? 1 : 0.5 }}>
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={!canAdvance() || status === "sending"}
            className="btn-primary flex items-center gap-2" style={{ opacity: canAdvance() ? 1 : 0.5 }}>
            {status === "sending" ? "Submitting..." : "Submit order request"} {status !== "sending" && <Check size={16} />}
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="mt-4 text-center text-sm" style={{ color: "#ef4444" }}>
          Something went wrong. Please try again or email hello@luwahtechnologies.com
        </p>
      )}
      <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>{catalog.legal}</p>
    </div>
  );
}
