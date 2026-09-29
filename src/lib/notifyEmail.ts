import "server-only";
import { reportError } from "@/lib/report";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface NotifyRow {
  label: string;
  value: string;
}

export interface NotifyOptions {
  subject: string;
  heading: string;
  badge?: string; // e.g. "Action Needed"
  rows?: NotifyRow[]; // key/value details
  quote?: string; // a highlighted block, e.g. the review text
  note?: string; // status / next-step line
  ctaUrl?: string;
  ctaLabel?: string;
}

// Brand palette.
const COPPER = "#D4924F";
const COPPER_DARK = "#B87333";
const BLUE = "#4A90A4";
const BG = "#0c0a14";
const CARD = "#13111d";
const BORDER = "#2a2735";
const TEXT = "#fafafa";
const MUTED = "#a1a1aa";

function renderHtml(o: NotifyOptions): string {
  const rows = (o.rows || [])
    .filter((r) => r.value && r.value.trim())
    .map(
      (r) => `
        <tr>
          <td style="padding:6px 0;color:${MUTED};font-size:13px;width:140px;vertical-align:top">${esc(r.label)}</td>
          <td style="padding:6px 0;color:${TEXT};font-size:14px;font-weight:600">${esc(r.value)}</td>
        </tr>`
    )
    .join("");

  const badge = o.badge
    ? `<span style="display:inline-block;background:${COPPER};color:${BG};font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:4px 10px;border-radius:999px">${esc(o.badge)}</span>`
    : "";

  const quote = o.quote
    ? `<div style="margin:18px 0;padding:14px 16px;background:rgba(74,144,164,0.08);border-left:3px solid ${BLUE};border-radius:6px;color:${TEXT};font-size:14px;line-height:1.6">${esc(o.quote)}</div>`
    : "";

  const note = o.note
    ? `<p style="margin:16px 0 0;color:${MUTED};font-size:13px;line-height:1.5">${esc(o.note)}</p>`
    : "";

  const cta = o.ctaUrl
    ? `<div style="margin:24px 0 4px">
         <a href="${esc(o.ctaUrl)}" style="display:inline-block;background:${COPPER};color:${BG};text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:10px">${esc(o.ctaLabel || "Open in Studio")}</a>
       </div>`
    : "";

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${BG}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:14px;overflow:hidden">
        <tr><td style="height:4px;background:${COPPER};line-height:4px;font-size:0">&nbsp;</td></tr>
        <tr><td style="padding:26px 28px 28px;font-family:Arial,Helvetica,sans-serif">
          <div style="color:${COPPER};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Luwah Technologies</div>
          <h1 style="margin:0 0 12px;color:${TEXT};font-size:21px;line-height:1.3">${esc(o.heading)}</h1>
          ${badge}
          ${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">${rows}</table>` : ""}
          ${quote}
          ${note}
          ${cta}
        </td></tr>
        <tr><td style="padding:14px 28px;border-top:1px solid ${BORDER};color:${MUTED};font-size:11px;font-family:Arial,Helvetica,sans-serif">
          Automated notification from luwahtechnologies.com
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Sends a branded notification email to the business via Resend. Never throws:
 * a failed notification must not break the form response.
 *
 * Env: RESEND_API_KEY (required), NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM.
 */
export async function notifyEmail(o: NotifyOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping email notification");
    return;
  }
  const to = process.env.NOTIFY_EMAIL_TO || "hello@luwahtechnologies.com";
  const from = process.env.NOTIFY_EMAIL_FROM || "Luwah Notifications <notify@luwahtechnologies.com>";

  const textLines = [
    o.heading,
    o.badge ? `[${o.badge}]` : "",
    ...(o.rows || []).filter((r) => r.value).map((r) => `${r.label}: ${r.value}`),
    o.quote ? `\n"${o.quote}"` : "",
    o.note || "",
    o.ctaUrl ? `\n${o.ctaLabel || "Open"}: ${o.ctaUrl}` : "",
  ].filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: o.subject, html: renderHtml(o), text: textLines.join("\n") }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      reportError("notify.resend", new Error(`Resend responded with ${res.status}`));
    }
  } catch (err) {
    reportError("notify.resend", err);
  }
}
