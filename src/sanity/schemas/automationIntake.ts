import { defineField, defineType } from "sanity";

const roStr = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "string", readOnly: true, group });
const roTxt = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "text", rows: 3, readOnly: true, group });
const roArr = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }], readOnly: true, group });

/**
 * A submitted automation intake from the /intake/automation wizard. Captured fields are read-only; status and notes editable.
 */
export default defineType({
  name: "automationIntake",
  title: "Automation Intake",
  type: "document",
  groups: [
    { name: "triage", title: "Triage" },
    { name: "contact", title: "Contact" },
    { name: "process", title: "Bottleneck" },
    { name: "stack", title: "Stack" },
    { name: "outcome", title: "Current vs Desired" },
    { name: "logistics", title: "Infrastructure & Budget" },
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

    roStr("contactName", "Contact Name", "contact"),
    roStr("email", "Email", "contact"),
    roStr("phone", "Phone", "contact"),

    roTxt("processDescription", "Process Description", "process"),
    defineField({ name: "hoursPerWeek", title: "Hours Per Week", type: "number", readOnly: true, group: "process" }),

    roArr("currentTools", "Current Tools", "stack"),
    roStr("otherTools", "Other Tools", "stack"),
    roTxt("trigger", "Trigger", "stack"),
    roTxt("destination", "Destination", "stack"),

    roStr("currentStateLink", "Current State Link", "outcome"),
    roTxt("successDescription", "Success Description", "outcome"),

    roStr("hosting", "Hosting", "logistics"),
    roStr("timeline", "Timeline", "logistics"),
    roStr("budget", "Budget", "logistics"),
    roStr("printedName", "Printed Name", "logistics"),
    defineField({ name: "agreed", title: "Acknowledged", type: "boolean", readOnly: true, group: "logistics" }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { contact: "contactName", hosting: "hosting", date: "submittedAt", status: "status" },
    prepare({ contact, hosting, date, status }) {
      const when = date ? new Date(date).toLocaleDateString() : "";
      const flag = status && status !== "new" ? ` [${status}]` : "";
      return {
        title: `${contact || "Unknown"}${flag}`,
        subtitle: `${hosting || ""} · ${when}`,
      };
    },
  },
});
