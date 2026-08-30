import type { Metadata } from "next";
import { AccessibilityReportForm } from "@/components/a11y/AccessibilityReportForm";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "How Luwah Technologies builds and tests this site for accessibility, what the Accessibility Center can adjust, and how to tell us about a barrier.",
};

const H2 = "mb-3 text-lg font-semibold";
const H2_STYLE = { color: "var(--color-text-primary)", fontFamily: "var(--font-display)" };
const H3 = "mb-2 mt-5 text-base font-semibold";

// A self-assessment. Every claim here maps to something the code actually
// does. No certification badges and no compliance claims for laws this
// site has not been audited against.
export default function AccessibilityStatementPage() {
  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[720px] px-6">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Accessibility Statement
          </h1>
          <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Last reviewed: August 2026
          </p>

          <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <section>
              <p>
                About one in four adults in the United States lives with a disability. Luwah Technologies wants every
                visitor to be able to use this website. That includes people who rely on assistive technology. We build
                accessible sites for our clients, so this one has to hold to the same standard.
              </p>
            </section>

            <section>
              <h2 className={H2} style={H2_STYLE}>Compliance status</h2>
              <p>
                We build and test this site against the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. These
                guidelines explain how to make web content usable for people with blindness, low vision, motor
                impairments, cognitive disabilities, and more. We check conformance with automated scanning against the
                WCAG 2.2 AA rule set, plus manual keyboard-only navigation passes and checks with a screen reader. This
                is a self-assessment. It is not a third-party audit or certification.
              </p>
            </section>

            <section>
              <h2 className={H2} style={H2_STYLE}>The Accessibility Center</h2>
              <p>
                Every page has a round accessibility button in the lower left corner. It opens the Accessibility Center,
                a panel where you can adjust the site to your needs. Your choices are saved in your own browser and stay
                in place as you move from page to page. They are never sent to us.
              </p>
              <p className="mt-3">
                You can also change the language of the panel itself from the globe button in its header. That changes
                the wording inside the Accessibility Center only. It does not translate the page you are reading.
              </p>
              <p className="mt-3">
                The panel is our own code. This site does not use a third-party accessibility overlay. Every setting is
                a control you turn on yourself. Nothing here runs an artificial intelligence process over the page,
                writes image descriptions for you, or speaks changes to your screen reader on its own.
              </p>

              <h3 className={H3} style={H2_STYLE}>Accessibility profiles</h3>
              <p>The panel offers one-tap profiles that combine several adjustments for a common need:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>Epilepsy Safe.</strong> Stops animations and removes color intensity.</li>
                <li><strong>Vision Impaired.</strong> Turns on larger text, a high-legibility font, wider line height, and wider letter spacing.</li>
                <li><strong>Older Adults.</strong> Turns on larger text, a high-legibility font, high contrast, and highlighted links.</li>
                <li><strong>Cognitive Disability.</strong> Highlights links and headings and adds a reading guide.</li>
                <li><strong>ADHD Friendly.</strong> Reduces distractions with a focused reading window and less motion.</li>
                <li><strong>Blind Users (Screen-reader).</strong> Surfaces our written image descriptions.</li>
                <li><strong>Keyboard Navigation (Motor).</strong> Turns on strong focus outlines and a large black cursor.</li>
              </ul>

              <h3 className={H3} style={H2_STYLE}>Content adjustments</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>Content scaling.</strong> Scales the whole page from 90 percent to 150 percent in 10 percent steps.</li>
                <li><strong>Font sizing.</strong> Steps text up two levels and back to normal.</li>
                <li><strong>Line height.</strong> Default, 1.5 times, 1.75 times, or 2 times.</li>
                <li><strong>Letter spacing.</strong> Default, plus 1 pixel, plus 2 pixels, or plus 3 pixels.</li>
                <li><strong>Text alignment.</strong> Aligns body text left, center, or right.</li>
                <li><strong>Readable font.</strong> Switches the site to a serif face or to Atkinson Hyperlegible.</li>
                <li><strong>Text magnifier.</strong> Shows an enlarged copy of the text under your pointer.</li>
                <li><strong>Highlight.</strong> Marks links, then headings, then buttons as well.</li>
              </ul>

              <h3 className={H3} style={H2_STYLE}>Color adjustments</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>Contrast.</strong> High contrast, inverted colors, a dark page, or a bright light page. This site is dark by default, so the light setting is the one to reach for if dark text on a bright background is easier for you.</li>
                <li><strong>Saturation.</strong> Higher color, lower color, or monochrome.</li>
                <li><strong>Text colors, title colors, and background colors.</strong> Pick one of eight preset colors for each. Cancel clears the choice and returns to the site colors.</li>
              </ul>

              <h3 className={H3} style={H2_STYLE}>Orientation adjustments</h3>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>Mute sounds.</strong> Mutes and pauses audio and video on this site.</li>
                <li><strong>Hide images.</strong> Hides images, video, and embedded media. Each image&apos;s text description shows in its place.</li>
                <li><strong>Read mode.</strong> Opens a plain reading view of the page text.</li>
                <li><strong>Reading guide.</strong> Draws a bar that follows your pointer.</li>
                <li><strong>Reading window.</strong> Dims the page except for a band around your pointer.</li>
                <li><strong>Stop animations.</strong> Turns off motion and transitions.</li>
                <li><strong>Highlight hover.</strong> Outlines whatever your pointer is over.</li>
                <li><strong>Highlight focus.</strong> Draws a strong outline around the focused item.</li>
                <li><strong>Big cursor.</strong> A large black cursor or a large white cursor.</li>
                <li><strong>Image descriptions.</strong> Shows the written description of each image on the page.</li>
                <li><strong>Useful links.</strong> Jumps to the pages people ask for most.</li>
                <li><strong>Hide interface.</strong> Hides the accessibility button on every page. The panel asks you to confirm first. To bring the button back, clear this site&apos;s browsing data in your browser and reload the page.</li>
              </ul>

              <h3 className={H3} style={H2_STYLE}>Page structure navigation</h3>
              <p>
                The panel can list the current page&apos;s landmarks, headings, and links. Selecting one moves you
                straight to it. Keyboard shortcuts for the panel&apos;s features are shown on each control and work
                while the panel is open. We scope shortcuts to the open panel on purpose. That keeps single-key
                shortcuts from interfering with screen reader and voice-input users elsewhere on the page, as WCAG
                requires.
              </p>
            </section>

            <section>
              <h2 className={H2} style={H2_STYLE}>Screen reader and keyboard support</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Every page works with a keyboard alone. A skip link at the top of each page jumps straight to the main content.</li>
                <li>Headings, landmarks, and ARIA labels are structured so screen readers can navigate the site.</li>
                <li>The page language is declared in the site&apos;s code so screen readers use the right pronunciation.</li>
                <li>Text and background colors meet WCAG contrast requirements.</li>
                <li>Images that carry meaning have text alternatives.</li>
                <li>Forms identify their fields, mark errors clearly, and explain how to fix them.</li>
                <li>The site works at 200 percent zoom and adapts to phone, tablet, and desktop screens.</li>
                <li>Pop-up dialogs keep keyboard focus inside them while open and return focus when closed. The Accessibility Center itself is a non-modal panel, so you can move between it and the page freely.</li>
              </ul>
              <p className="mt-3">
                We test with modern versions of Chrome, Firefox, Safari, and Edge. The site uses standard HTML and ARIA,
                which JAWS, NVDA, VoiceOver, and TalkBack understand.
              </p>
            </section>

            <section>
              <h2 className={H2} style={H2_STYLE}>Known limitations</h2>
              <p>
                Some content on this site comes from third parties. Embedded scheduling, video, and bot-protection
                frames follow their providers&apos; accessibility support, which we do not control. Automated
                accessibility scanners may report issues inside those embedded frames. Those elements belong to the
                provider&apos;s code and cannot be corrected from this site. Mute sounds cannot silence embedded
                players, so use their own controls. The dark and light contrast settings replace decorative background
                images with a solid color. If any of that is a barrier for you, contact us and we will provide the same
                information another way.
              </p>
            </section>

            <section id="report">
              <h2 className={H2} style={H2_STYLE}>Tell us about a problem</h2>
              <p>
                If any part of this site is hard for you to use, we want to know. Call{" "}
                <a href="tel:+17204217184" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>+1 (720) 421-7184</a> or email{" "}
                <a href="mailto:hello@luwahtechnologies.com" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>
                  hello@luwahtechnologies.com
                </a>{" "}
                and we will help you right away and work to fix the underlying issue. You can also send us the details
                from the Report Issue tab inside the Accessibility Center, or with the form below.
              </p>

              {/* The form is the widget's own component, so it carries the
                  widget's light palette rather than the site's dark one.
                  That is deliberate: a person who has just turned on high
                  contrast or inverted colours should not have the one form
                  they need re-themed underneath them. */}
              <div className="mt-8 rounded-2xl bg-white p-6" style={{ color: "var(--color-a11yink-900)" }}>
                <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--color-a11yink-900)" }}>
                  Send us the details
                </h3>
                <p className="mb-6" style={{ color: "var(--color-a11yink-700)" }}>
                  Prefer to write it out instead of calling? Use this form and we will follow up the same way we would a
                  phone call. Tell us the page and what went wrong, and we will take it from there.
                </p>
                <AccessibilityReportForm />
              </div>
            </section>

            <section>
              <p style={{ color: "var(--color-text-muted)" }}>
                This statement was last reviewed in August 2026. We review it whenever the site changes in a significant
                way.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
