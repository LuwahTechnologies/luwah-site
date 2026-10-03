"use client";


const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Tell us about your current processes and tools. We identify the automation opportunities with the highest ROI.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We design and implement custom workflows that connect your existing tools into reliable, AI-powered automations.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "You receive a documented system with hands-on training. Your team can maintain and expand automations independently.",
  },
];

export function ProcessSection() {

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <p
            className="mx-auto max-w-2xl text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Three steps from consultation to a fully automated workflow.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="anim-fade card p-8"
              style={{ "--anim-delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              <span
                className="mb-5 inline-block text-sm font-bold"
                style={{ color: "var(--color-copper)" }}
              >
                {step.number}
              </span>
              <h3
                className="mb-3 text-xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
