"use client";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  // Nothing approved yet: hide the section rather than show an empty marquee.
  if (!testimonials.length) return null;

  // Repeat to a minimum count, then duplicate once for a seamless loop.
  const base = Array.from(
    { length: Math.ceil(6 / testimonials.length) },
    () => testimonials
  ).flat();
  const items = [...base, ...base];

  return (
    <section
      className="overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto mb-14 max-w-[var(--container-max)] px-6 text-center">
        <h2
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What our clients say
        </h2>
        <p
          className="mx-auto max-w-md text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Real feedback from businesses we&apos;ve helped automate.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="testimonial-track flex gap-4 pl-6">
          {items.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="card w-[340px] flex-shrink-0 p-6"
              // Every pass after the first is a repeat for the loop. Hide it
              // from screen readers so each quote is read once.
              aria-hidden={i >= testimonials.length ? true : undefined}
            >
              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: "var(--color-text-primary)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
