"use client";

import { Check } from "lucide-react";

// ── Field primitives ──────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg-input)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-body)",
};

export function Label({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{text}</label>
      {hint && <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
    </div>
  );
}

export function Field({ label, hint, value, onChange, type = "text" }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <Label text={label} hint={hint} />
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
    </div>
  );
}

export function Area({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} hint={hint} />
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
    </div>
  );
}

export function Select({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} />
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function Radio({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className="rounded-md px-3 py-2 text-sm transition-all"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: value === o ? "var(--color-copper)" : "var(--color-bg-input)",
              color: value === o ? "#fff" : "var(--color-text-secondary)",
            }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CheckGroup({ label, options, selected, onToggle }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <Label text={label} />
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button key={o} type="button" onClick={() => onToggle(o)}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-all"
              style={{
                border: `1px solid ${on ? "var(--color-copper-border)" : "var(--color-border)"}`,
                backgroundColor: "var(--color-bg-input)",
              }}>
              <span className="flex h-4 w-4 items-center justify-center rounded"
                style={{ border: "1px solid var(--color-border)", backgroundColor: on ? "var(--color-copper)" : "transparent" }}>
                {on && <Check size={11} color="#fff" />}
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
