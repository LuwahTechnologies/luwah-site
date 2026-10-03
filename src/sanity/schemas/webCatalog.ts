import { defineField, defineType } from "sanity";

/**
 * Singleton catalog for the web-build offering. Editing prices here updates the
 * /services web-design section and the /order configurator with no deploy.
 * Empty fields fall back to the code defaults in src/lib/webCatalog.ts.
 */
export default defineType({
  name: "webCatalog",
  title: "Web Services Catalog",
  type: "document",
  groups: [
    { name: "general", title: "General" },
    { name: "tiers", title: "Tiers" },
    { name: "addons", title: "Add-ons" },
    { name: "support", title: "Support Plans" },
  ],
  fields: [
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "general" }),
    defineField({
      name: "perPagePrice",
      title: "Extra page price (USD)",
      type: "number",
      group: "general",
    }),
    defineField({ name: "legal", title: "Legal / disclaimer", type: "text", rows: 3, group: "general" }),
    defineField({
      name: "tiers",
      title: "Tiers",
      type: "array",
      group: "tiers",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key (stable id)", type: "string", validation: (r) => r.required() },
            { name: "name", title: "Name", type: "string" },
            { name: "price", title: "Base price (USD number)", type: "number" },
            { name: "priceLabel", title: "Price label", type: "string" },
            { name: "pages", title: "Subtitle", type: "string" },
            { name: "summary", title: "Summary", type: "text", rows: 2 },
            { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
            { name: "perPage", title: "Charges per extra page", type: "boolean" },
            { name: "includedAddons", title: "Included add-on keys", type: "array", of: [{ type: "string" }] },
            { name: "highlight", title: "Highlight", type: "boolean" },
            {
              name: "cta",
              title: "Button (quote-only tiers)",
              description: "Fill this in for a tier quoted after a call. It adds a button and keeps the tier out of the order form.",
              type: "object",
              fields: [
                { name: "label", title: "Label", type: "string" },
                { name: "href", title: "Link", type: "string" },
              ],
            },
          ],
          preview: { select: { title: "name", subtitle: "priceLabel" } },
        },
      ],
    }),
    defineField({
      name: "addons",
      title: "Add-ons",
      type: "array",
      group: "addons",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key (stable id)", type: "string", validation: (r) => r.required() },
            { name: "name", title: "Name", type: "string" },
            { name: "description", title: "Short description (1-3 sentences)", type: "text", rows: 2 },
            { name: "oneTime", title: "One-time price (USD number)", type: "number" },
            { name: "oneTimeLabel", title: "One-time label", type: "string" },
            { name: "monthlyLabel", title: "Monthly label", type: "string" },
            { name: "includedIn", title: "Included in tier keys", type: "array", of: [{ type: "string" }] },
            { name: "variable", title: "Variable / quoted (excluded from total)", type: "boolean" },
          ],
          preview: { select: { title: "name", subtitle: "oneTimeLabel" } },
        },
      ],
    }),
    defineField({
      name: "supportPlans",
      title: "Support Plans",
      type: "array",
      group: "support",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key (stable id)", type: "string", validation: (r) => r.required() },
            { name: "name", title: "Name", type: "string" },
            { name: "priceLabel", title: "Price label", type: "string" },
            { name: "includes", title: "Includes", type: "text", rows: 2 },
          ],
          preview: { select: { title: "name", subtitle: "priceLabel" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Web Services Catalog" }) },
});
