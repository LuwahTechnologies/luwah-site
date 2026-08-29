import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Luwah Technologies terms and conditions for services and website use.",
};

export default function TermsPage() {
  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[720px] px-6">
          <h1
            className="mb-3 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Last updated: March 2026
          </p>

          <div
            className="flex flex-col gap-8 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>1. Services</h2>
              <p>Luwah Technologies LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) provides automation consulting, workflow development, technology advisory, and education services. All services are subject to a formal project proposal and mutual agreement before work begins.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>2. Free Consultation</h2>
              <p>The initial 30-minute discovery consultation is provided at no charge and carries no obligation. Additional consultation time beyond the initial session is billed at $30/hour.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>3. Project Engagement</h2>
              <p>All custom projects require a signed proposal before work begins. Projects follow a 50/50 payment structure: 50% deposit due before work begins, 50% balance due upon delivery. Payment is accepted via credit card, debit card, or ACH transfer.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>4. Deliverables & Ownership</h2>
              <p>Upon full payment, clients receive a perpetual, non-exclusive license to use all delivered work products. Luwah Technologies retains ownership of underlying workflow logic and methodologies. All access credentials and permissions are transferred to client ownership upon delivery.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>5. Testing & Maintenance</h2>
              <p>Each project includes a 7-day testing window following delivery, during which bugs and issues within the original scope are addressed at no additional charge. A 30-day maintenance window follows the testing period for issues arising from normal operation. Work outside the original project scope constitutes a new engagement.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>6. Limitation of Liability</h2>
              <p>Luwah Technologies LLC liability is limited to the total fees paid for the specific project. We are not liable for indirect, incidental, or consequential damages. We carry Errors &amp; Omissions (E&amp;O) and Cyber liability insurance through NEXT Insurance.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>7. Website Use</h2>
              <p>This website is provided for informational purposes. Content is owned by Luwah Technologies LLC and may not be reproduced without permission. We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of updated terms.</p>
            </section>

            <section id="accessibility">
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>8. Accessibility</h2>
              <p>We build and test this website against the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. Our <a href="/accessibility-statement" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>Accessibility Statement</a> describes what we test, what the Accessibility Center can adjust, and the limits we know about. That statement is a self-assessment. It is not a third-party audit, and nothing in it or in these terms is a certification of conformance with the Americans with Disabilities Act or any other law.</p>
              <p className="mt-3">The Accessibility Center is provided as a convenience. Every setting in it is one you turn on yourself, and it changes only how this website is presented to you. It does not change the meaning of any content, and it is not assistive technology or a substitute for the screen reader, magnifier, or other tool you already use. Your settings live in your own browser, so they do not follow you to another device or browser.</p>
              <p className="mt-3">Parts of this website embed third-party services, including scheduling, video, and bot protection. Their accessibility is controlled by those providers and not by us. This section covers this website only. Accessibility standards for work we deliver to a client are set in that project&apos;s proposal.</p>
              <p className="mt-3">If any part of this website is a barrier to you, tell us and we will help you right away and work to fix the underlying issue. Use the contact details below, or the report form on the Accessibility Statement page. We will also provide the same information or complete the same task another way while a fix is in progress. Nothing in this section limits the limitation of liability stated above.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>9. Governing Law</h2>
              <p>These terms are governed by the laws of the State of Colorado. Any disputes shall be resolved in the courts of Arapahoe County, Colorado.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Contact</h2>
              <p>Luwah Technologies LLC<br />Aurora, CO 80017<br />hello@luwahtechnologies.com<br />+1 (720) 421-7184</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
