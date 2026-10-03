"use client";

import { useId } from "react";
import { Check } from "lucide-react";

// ── Field primitives ──────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--color-bg-input)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-body)",
};

export function Label({ text, hint, htmlFor, hintId, groupId }: {
  text: string; hint?: string; htmlFor?: string; hintId?: string; groupId?: string;
}) {
  const style = { color: "var(--color-text-primary)" };
  return (
    <div className="mb-1.5">
      {groupId
        ? <div id={groupId} className="block text-sm font-medium" style={style}>{text}</div>
        : <label htmlFor={htmlFor} className="block text-sm font-medium" style={style}>{text}</label>}
      {hint && <p id={hintId} className="text-xs" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
    </div>
  );
}

// Shown only after a failed Next or Submit. Linked to its control with aria-describedby.
const ERROR_COLOR = "#ef4444";
const errorBorder = (error?: string): React.CSSProperties =>
  error ? { ...inputStyle, border: `1px solid ${ERROR_COLOR}` } : inputStyle;
const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

function ErrorText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return <p id={id} className="mt-1 text-xs" style={{ color: ERROR_COLOR }}>{text}</p>;
}

export function Field({ label, hint, value, onChange, type = "text", autoComplete, error }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; error?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  return (
    <div>
      <Label text={label} hint={hint} htmlFor={id} hintId={hintId} />
      <input id={id} autoComplete={autoComplete} aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint && hintId, error && errId)} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="intake-focus w-full rounded-lg px-4 py-3 text-sm" style={errorBorder(error)} />
      <ErrorText id={errId} text={error} />
    </div>
  );
}

export function Area({ label, hint, value, onChange, error }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  return (
    <div>
      <Label text={label} hint={hint} htmlFor={id} hintId={hintId} />
      <textarea id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(hint && hintId, error && errId)}
        rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        className="intake-focus w-full rounded-lg px-4 py-3 text-sm" style={errorBorder(error)} />
      <ErrorText id={errId} text={error} />
    </div>
  );
}

export function Select({ label, options, value, onChange, error }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <Label text={label} htmlFor={id} />
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(error && errId)}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="intake-focus w-full rounded-lg px-4 py-3 text-sm" style={errorBorder(error)}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ErrorText id={errId} text={error} />
    </div>
  );
}

export function Radio({ label, options, value, onChange, error }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string;
}) {
  const labelId = useId();
  const errId = `${labelId}-err`;
  return (
    <div role="group" aria-labelledby={labelId} data-invalid={error ? true : undefined}>
      <Label text={label} groupId={labelId} />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} aria-describedby={describedBy(error && errId)} onClick={() => onChange(o)}
            className="intake-focus rounded-md px-3 py-2 text-sm transition-all"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: value === o ? "var(--color-copper)" : "var(--color-bg-input)",
              color: value === o ? "var(--color-bg-primary)" : "var(--color-text-secondary)",
            }}>
            {o}
          </button>
        ))}
      </div>
      <ErrorText id={errId} text={error} />
    </div>
  );
}

export function CheckGroup({ label, options, selected, onToggle, error }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void; error?: string;
}) {
  const labelId = useId();
  const errId = `${labelId}-err`;
  return (
    <div role="group" aria-labelledby={labelId} data-invalid={error ? true : undefined}>
      <Label text={label} groupId={labelId} />
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button key={o} type="button" aria-pressed={on} aria-describedby={describedBy(error && errId)} onClick={() => onToggle(o)}
              className="intake-focus flex min-h-11 items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-all"
              style={{
                border: `1px solid ${on ? "var(--color-copper-border)" : "var(--color-border)"}`,
                backgroundColor: "var(--color-bg-input)",
              }}>
              <span className="flex h-4 w-4 items-center justify-center rounded"
                style={{ border: "1px solid var(--color-border)", backgroundColor: on ? "var(--color-copper)" : "transparent" }}>
                {on && <Check size={11} color="var(--color-bg-primary)" />}
              </span>
              {o}
            </button>
          );
        })}
      </div>
      <ErrorText id={errId} text={error} />
    </div>
  );
}
