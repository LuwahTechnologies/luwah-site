/**
 * Catalog of web-build tiers, add-ons, and support plans.
 * The 2026 prices below are the seeded defaults. A Sanity `webCatalog`
 * singleton can override any of it without a deploy. The order form and the
 * services page both read getWebCatalog(), so editing one place updates both.
 */
export interface WebTier {
  key: string;
  name: string;
  price: number; // one-time base, used for the running total
  priceLabel: string;
  pages: string;
  summary: string;
  features: string[];
  perPage?: boolean; // charges +$50 per extra page
  includedAddons?: string[]; // addon keys already bundled, not charged again
  highlight?: boolean;
  cta?: { label: string; href: string }; // replaces the default order flow for quote-only tiers
}

export interface WebAddon {
  key: string;
  name: string;
  oneTime: number; // 0 when there is no fixed setup fee
  oneTimeLabel: string;
  monthlyLabel?: string;
  includedIn?: string[]; // tier keys that bundle this addon
  variable?: boolean; // priced per project/unit, excluded from the fixed total
  orderable?: boolean; // false keeps it off the order form, for items Luwah decides (hosting tier)
  description?: string; // 1-3 sentences shown behind an info toggle
}

export interface WebSupportPlan {
  key: string;
  name: string;
  priceLabel: string;
  includes: string;
}

export interface WebCatalog {
  intro: string;
  perPagePrice: number;
  tiers: WebTier[];
  addons: WebAddon[];
  supportPlans: WebSupportPlan[];
  legal: string;
}

export const DEFAULT_CATALOG: WebCatalog = {
  intro:
    "Five options, transparent pricing, and a working site in days. Every option includes build, deployment, and 30 days of support. Hosting is separate and you keep ownership of your code and data.",
  perPagePrice: 50,
  tiers: [
    {
      key: "realtor-landing",
      name: "Realtor Landing",
      price: 300,
      priceLabel: "$300",
      pages: "Single Page",
      summary: "Conversion landing page for realtors.",
      features: [
        "1 page, designed to convert",
        "Up to 4 lead capture forms",
        "Gmail lead delivery (free)",
        "Mobile-first design",
        "Custom branding",
        "Listings not included",
      ],
    },
    {
      key: "tier-1",
      name: "Tier 1",
      price: 600,
      priceLabel: "$600",
      pages: "Basic Static Site",
      summary: "Marketing website with contact forms.",
      perPage: true,
      features: [
        "4 pages included (+$50 each add'l)",
        "Responsive design, on-page SEO",
        "Contact form",
        "Deployment and SSL setup",
        "30 days of support",
      ],
    },
    {
      key: "tier-1b",
      name: "Tier 2",
      price: 1000,
      priceLabel: "$1,000",
      pages: "Website + Booking",
      summary: "Showcase site with embedded scheduling.",
      perPage: true,
      features: [
        "Everything in Tier 1",
        "Embeds Acuity, Calendly, Square, etc.",
        "Live availability",
        "Mobile friendly booking",
        "Keeps your existing tools",
      ],
    },
    {
      key: "tier-2",
      name: "Tier 3",
      price: 2000,
      priceLabel: "$2,000",
      pages: "Premium Web Service",
      summary: "Full custom booking and admin portal.",
      highlight: true,
      features: [
        "React app with Express and Supabase",
        "Custom admin dashboard",
        "Real time calendar sync",
        "Email automation and SMS alerts",
        "Google Analytics",
        "2FA, audit logs, rate limiting",
        "60 days of priority support",
      ],
    },
    {
      key: "custom",
      name: "Custom Build",
      price: 4000,
      priceLabel: "From $4,000",
      pages: "Quoted after a discovery call",
      summary: "For work the other tiers do not cover.",
      cta: { label: "Request a Quote", href: "/consultation" },
      features: [
        "Move off a locked platform",
        "Payments, a client portal or a CMS",
        "Review handling and monitoring",
        "$500 kickoff deposit before discovery",
        "90 days of priority support",
      ],
    },
  ],
  addons: [
    { key: "hosting-basic", name: "Website hosting, Basic", oneTime: 0, oneTimeLabel: "No setup fee", monthlyLabel: "$15/mo", orderable: false,
      description: "For most small sites. I host, monitor, and update your site so you do not have to. Includes uptime monitoring and security updates. I choose the tier once I know your pages and what the site needs." },
    { key: "hosting-established", name: "Website hosting, Established", oneTime: 0, oneTimeLabel: "No setup fee", monthlyLabel: "$30/mo", orderable: false,
      description: "For larger sites that need more Render resources: more cron jobs, more custom domains, and more bandwidth. Includes everything in Basic. I choose the tier once I know your pages and what the site needs." },
    { key: "spreadsheet-leads", name: "Spreadsheet lead capture", oneTime: 100, oneTimeLabel: "+$100 per sheet", variable: true,
      description: "Form submissions flow automatically into a Google Sheet you can sort, filter, and share. Priced per sheet." },
    { key: "local-seo", name: "Local SEO setup", oneTime: 0, oneTimeLabel: "Priced per project", variable: true,
      description: "Setup that helps you show up in local Google searches and the map pack. Scoped and priced per project." },
    { key: "stripe", name: "Stripe payments", oneTime: 400, oneTimeLabel: "+$400", monthlyLabel: "2.9% + $0.30/tx",
      description: "Accept card payments on your site through Stripe. The setup fee covers the integration; Stripe charges 2.9% plus $0.30 per transaction." },
    { key: "sanity-cms", name: "Sanity CMS / blog module", oneTime: 450, oneTimeLabel: "+$450",
      description: "A simple dashboard to edit your site's text, images, and blog yourself, with no code." },
    { key: "sentry", name: "Sentry error tracking", oneTime: 150, oneTimeLabel: "+$150",
      description: "Automatic error tracking so we catch and fix problems before they affect your customers." },
    { key: "resend", name: "Resend transactional email", oneTime: 250, oneTimeLabel: "+$250",
      description: "Reliable automated emails like confirmations and receipts, sent from your own domain." },
    { key: "slack", name: "Slack notifications", oneTime: 150, oneTimeLabel: "+$150",
      description: "Get a Slack message the moment a lead, order, or form submission comes in." },
    { key: "twilio", name: "Twilio SMS", oneTime: 300, oneTimeLabel: "+$300",
      description: "Send and receive text messages, such as appointment reminders or SMS alerts to customers." },
    { key: "admin-account", name: "Admin account", oneTime: 350, oneTimeLabel: "+$350",
      description: "A secure login to manage your site's content and data from one dashboard." },
    { key: "client-portal", name: "Client portal", oneTime: 600, oneTimeLabel: "+$600",
      description: "A private, login-protected area where your clients can view their info, bookings, documents, or order status." },
    { key: "review-moderation", name: "Review moderation workflow", oneTime: 150, oneTimeLabel: "+$150 to $250", variable: true,
      description: "Review requests, approval, and publishing so only the reviews you approve go live. Priced by how many sources you use." },
    { key: "site-migration", name: "Site migration from another platform", oneTime: 750, oneTimeLabel: "From $750", variable: true,
      description: "Move your site off a platform that locks you in, so you own your website, email, and data again. Priced after I review the current site." },
  ],
  supportPlans: [
    { key: "self-serve", name: "Self-Serve", priceLabel: "Free", includes: "Full documentation, best-effort email support, community forum." },
    { key: "light", name: "Website Care Light", priceLabel: "$110/mo", includes: "Uptime and error monitoring, security updates, email support (48-hr response), 1 hr/mo of changes." },
    { key: "standard", name: "Website Care Standard", priceLabel: "$200/mo", includes: "Everything in Light, plus priority email (24-hr response), 1.5 hrs/mo of changes, and a plain-language monthly report." },
    { key: "premium", name: "Website Care Premium", priceLabel: "$300/mo", includes: "Everything in Standard, plus same-day response, 2.5 hrs/mo of changes, accessibility checks, and a quarterly security and speed review. Extra hours are billed at the hourly rate." },
    { key: "payg", name: "Pay as you go", priceLabel: "$110/hr", includes: "No subscription. Help on specific issues, 1 hour minimum. The rate becomes $130/hr on January 1, 2027." },
  ],
  legal:
    "Standard rates shown. Custom quotes may differ based on scope and timeline. Colorado professional services are exempt from sales tax per §39-26-104, C.R.S. Pricing effective 2026-10-02, subject to change.",
};

export interface OrderSelection {
  tierKey: string;
  addonKeys: string[];
  extraPages: number;
}

export interface OrderTotal {
  tierName: string;
  total: number; // one-time fixed total in USD
  hasVariableItems: boolean; // true when a quoted add-on was selected
  chargedAddonKeys: string[]; // add-ons that contributed to the total
}

/**
 * Single source of truth for the running total. Used by the order form to
 * display it and by the API route to recompute it server-side, so a tampered
 * client total is never trusted.
 */
export function computeOrderTotal(
  catalog: WebCatalog,
  sel: OrderSelection
): OrderTotal {
  const tier = catalog.tiers.find((t) => t.key === sel.tierKey);
  if (!tier) {
    return { tierName: "", total: 0, hasVariableItems: false, chargedAddonKeys: [] };
  }

  let total = tier.price;
  if (tier.perPage && sel.extraPages > 0) {
    total += sel.extraPages * catalog.perPagePrice;
  }

  const included = new Set(tier.includedAddons || []);
  const charged: string[] = [];
  let hasVariable = false;

  for (const key of sel.addonKeys) {
    const addon = catalog.addons.find((a) => a.key === key);
    if (!addon || included.has(key)) continue; // bundled add-ons are free
    if (addon.variable) {
      hasVariable = true; // quoted separately, not added to the fixed total
      continue;
    }
    total += addon.oneTime;
    charged.push(key);
  }

  // A quote-only tier (it carries its own button) is priced after discovery, so
  // its base is a floor, not a fixed total.
  if (tier.cta) hasVariable = true;

  return { tierName: tier.name, total, hasVariableItems: hasVariable, chargedAddonKeys: charged };
}
