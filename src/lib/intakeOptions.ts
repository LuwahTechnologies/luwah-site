export const TIMELINE_OPTIONS = ["As soon as possible", "Within 2 weeks", "Within a month", "Flexible: quality over speed"];

export const AUTOMATION_TOOL_OPTIONS = ["Airtable", "HubSpot", "QuickBooks", "Shopify", "Square", "Mailchimp", "Google Workspace", "Slack", "Zapier", "Stripe", "Other"];
export const AUTOMATION_HOSTING_OPTIONS = ["Managed by Luwah", "Self-hosted n8n", "Not sure, please advise"];
export const AUTOMATION_BUDGET_OPTIONS = ["Under $1,000", "$1,000 to $2,500", "$2,500 to $5,000", "$5,000+", "Not sure"];
export const HOURS_MIN = 1;
export const HOURS_MAX = 200;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "" is valid (optional). Otherwise digits only, 1 to 200. */
export function isValidHours(v: string): boolean {
  const t = v.trim();
  if (t === "") return true;
  if (!/^\d+$/.test(t)) return false;
  const n = Number(t);
  return n >= HOURS_MIN && n <= HOURS_MAX;
}

/** "" is valid (optional). Otherwise must match /^https?:\/\/\S+$/i. */
export function isValidLink(v: string): boolean {
  return v === "" || /^https?:\/\/\S+$/i.test(v);
}
