import { AutomationIntakeForm } from "./AutomationIntakeForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Automation Intake",
  description:
    "Tell us about the manual process slowing your business down, the tools you use, and what done looks like. Luwah Technologies automation intake.",
  path: "/intake/automation",
});

export default function AutomationIntakePage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          Automation and operations intake
        </h1>
        <p className="mb-10 text-base" style={{ color: "var(--color-text-secondary)" }}>
          Describe one process you want to hand off. Fields marked with an asterisk are required.
          Takes about 10 minutes.
        </p>
        <AutomationIntakeForm />
      </div>
    </div>
  );
}
