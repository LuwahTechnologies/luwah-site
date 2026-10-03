import { defineField, defineType } from "sanity";

const roStr = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "string", readOnly: true, group });
const roTxt = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "text", rows: 3, readOnly: true, group });
const roArr = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }], readOnly: true, group });

/**
 * A submitted build intake from the /intake wizard. Mirrors the 9 sections of
 * the PDF intake form. Captured fields are read-only; status and notes editable.
 */
export default defineType({
  name: "buildIntake",
  title: "Build Intake",
  type: "document",
  groups: [
    { name: "triage", title: "Triage" },
    { name: "business", title: "Business" },
    { name: "scope", title: "Scope" },
    { name: "brand", title: "Brand" },
    { name: "content", title: "Content" },
    { name: "tech", title: "Forms & Tech" },
    { name: "logistics", title: "Logistics" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "triage",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewing", value: "reviewing" },
          { title: "In progress", value: "in-progress" },
          { title: "Built", value: "built" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "adminNotes", title: "Admin Notes", type: "text", rows: 3, group: "triage" }),
    defineField({ name: "submissionId", title: "Submission ID", type: "string", readOnly: true, group: "triage" }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime", readOnly: true, group: "triage" }),
    defineField({ name: "ipHash", title: "IP Hash", type: "string", readOnly: true, group: "triage" }),

    // Section 1 — Business basics
    roStr("businessName", "Business / Brand", "business"),
    roStr("contactName", "Contact Name", "business"),
    roStr("email", "Email", "business"),
    roStr("phone", "Phone", "business"),
    roStr("industry", "Industry", "business"),
    roStr("location", "Location", "business"),
    roStr("tagline", "Tagline", "business"),
    roTxt("mission", "Mission", "business"),
    roTxt("elevatorPitch", "Elevator Pitch", "business"),

    // Section 2 + 3 — Goals + tier
    roStr("primaryGoal", "Primary Goal", "scope"),
    roTxt("targetAudience", "Target Audience", "scope"),
    roStr("mainCta", "Main Call To Action", "scope"),
    roTxt("problemSolved", "Problem Solved", "scope"),
    roStr("tier", "Tier Considering", "scope"),

    // Section 4 — Brand
    roStr("hasLogo", "Has Logo", "brand"),
    roTxt("brandColors", "Brand Colors", "brand"),
    roStr("fonts", "Fonts", "brand"),
    roStr("vibe", "Vibe / Aesthetic", "brand"),
    roTxt("referenceSites", "Reference Sites", "brand"),
    roTxt("avoid", "Do NOT want", "brand"),

    // Section 5 + 7 — Pages, content & media
    roArr("pages", "Pages Needed", "content"),
    roStr("otherPages", "Other Pages", "content"),
    roTxt("homeSections", "Home Page Sections", "content"),
    roTxt("aboutContent", "About Content", "content"),
    roTxt("services", "Services List", "content"),
    roStr("hasTestimonials", "Has Testimonials", "content"),
    roTxt("testimonials", "Testimonials / Credentials", "content"),
    roTxt("otherCopy", "Other Copy", "content"),
    roArr("media", "Media Ready", "content"),
    roTxt("mediaNotes", "Media Notes", "content"),

    roStr("currentSite", "Current Website", "business"),
    roStr("migration", "Migration", "business"),
    roTxt("address", "Address / Service Area", "business"),
    roTxt("businessHours", "Business Hours", "business"),
    roTxt("socialLinks", "Social / Google Profile Links", "business"),
    roStr("keywords", "Search Terms", "content"),
    roStr("contentOwner", "Who Writes Copy", "content"),
    roStr("assetsLink", "Shared Files Link", "content"),
    roStr("decisionMaker", "Approver", "logistics"),
    roArr("addons", "Add-ons Requested", "scope"),

    // Section 6 — Forms & integrations
    roArr("forms", "Forms Needed", "tech"),
    roTxt("customForm", "Custom Form Details", "tech"),
    roStr("bookingTool", "Booking Tool", "tech"),
    roStr("needsPayments", "Needs Payments", "tech"),
    roStr("automationPreference", "Automation Preference", "tech"),
    roTxt("otherTools", "Other Tools", "tech"),

    // Section 8 + 9 — Logistics + acknowledgment
    roStr("hasDomain", "Has Domain", "logistics"),
    roStr("domainName", "Domain Name", "logistics"),
    roStr("registrar", "Registrar", "logistics"),
    roStr("hostingPreference", "Hosting Preference", "logistics"),
    roStr("timeline", "Timeline", "logistics"),
    roStr("budget", "Budget", "logistics"),
    roTxt("anythingElse", "Anything Else", "logistics"),
    roStr("printedName", "Printed Name", "logistics"),
    defineField({ name: "agreed", title: "Acknowledged", type: "boolean", readOnly: true, group: "logistics" }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { name: "businessName", contact: "contactName", tier: "tier", date: "submittedAt", status: "status" },
    prepare({ name, contact, tier, date, status }) {
      const when = date ? new Date(date).toLocaleDateString() : "";
      const flag = status && status !== "new" ? ` [${status}]` : "";
      return {
        title: `${name || contact || "Unknown"}${flag}`,
        subtitle: `${tier || ""} · ${when}`,
      };
    },
  },
});
