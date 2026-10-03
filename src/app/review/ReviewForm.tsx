"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, Check } from "lucide-react";
import { Turnstile } from "@/components/Turnstile";
import { RATING_CATEGORIES, computeOverall, type RatingKey, type Ratings } from "@/lib/reviews";

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg-input)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-body)",
};

function StarRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
          >
            <Star
              size={26}
              style={{ color: active ? "var(--color-copper)" : "var(--color-border)" }}
              fill={active ? "var(--color-copper)" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

const ZERO: Ratings = { communication: 0, expertise: 0, timeliness: 0, value: 0, recommend: 0 };

export function ReviewForm() {
  const [form, setForm] = useState({ reviewerName: "", company: "", role: "", quote: "" });
  const [ratings, setRatings] = useState<Ratings>(ZERO);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleToken = useCallback((t: string) => setTurnstileToken(t), []);
  const handleExpire = useCallback(() => setTurnstileToken(null), []);
  const setRating = (key: RatingKey, v: number) => setRatings((r) => ({ ...r, [key]: v }));

  // After a successful submission, reset the form to default after 10 seconds
  // so the next visitor on a shared device starts fresh.
  useEffect(() => {
    if (status !== "sent") return;
    const timer = setTimeout(() => {
      setForm({ reviewerName: "", company: "", role: "", quote: "" });
      setRatings(ZERO);
      setTurnstileToken(null);
      setStatus("idle");
    }, 10000);
    return () => clearTimeout(timer);
  }, [status]);

  const allRated = RATING_CATEGORIES.every((c) => ratings[c.key] >= 1);
  const overall = allRated ? computeOverall(ratings) : 0;
  const canSubmit = form.reviewerName.trim() && form.quote.trim() && allRated && turnstileToken && status !== "sending";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ratings, turnstile_token: turnstileToken }),
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
        <h2 className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Thank you
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your review was submitted. We review each one before it appears on the site.
          We appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex flex-col gap-4">
        <input placeholder="Your name *" value={form.reviewerName}
          onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
          className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input placeholder="Company" value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
          <input placeholder="Role / title" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      {/* Category ratings */}
      <div className="mb-8 flex flex-col gap-5">
        {RATING_CATEGORIES.map((c) => (
          <div key={c.key} className="flex items-center justify-between gap-4">
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.label}</span>
            <StarRow value={ratings[c.key]} onChange={(v) => setRating(c.key, v)} />
          </div>
        ))}
      </div>

      {/* Live overall */}
      <div className="card mb-8 flex items-center justify-between p-5">
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Overall</span>
        <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {allRated ? `${overall.toFixed(1)} / 5` : "Not rated"}
        </span>
      </div>

      <textarea placeholder="Tell us about your experience working with us *" rows={5} value={form.quote}
        onChange={(e) => setForm({ ...form, quote: e.target.value })}
        className="mb-6 w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />

      <Turnstile onToken={handleToken} onExpire={handleExpire} />
      <button type="button" onClick={handleSubmit} disabled={!canSubmit}
        className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
        style={{ opacity: canSubmit ? 1 : 0.5 }}>
        {status === "sending" ? "Submitting..." : "Submit review"} {status !== "sending" && <Check size={16} />}
      </button>
      {status === "error" && (
        <p className="mt-4 text-center text-sm" style={{ color: "#ef4444" }}>
          Something went wrong. Please try again or email hello@luwahtechnologies.com
        </p>
      )}
    </div>
  );
}
