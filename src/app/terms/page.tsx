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
            Last updated: September 2026
          </p>

          <div
            className="flex flex-col gap-8 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>1. Services</h2>
              <p>Luwah Technologies LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) provides automation consulting, workflow development, technology advisory, and education services. All services are subject to a formal project proposal and mutual agreement before work begins. We use AI tools, including Anthropic Claude and Google Gemini, to build and manage client work. We review everything before delivery. Client credentials never go into those tools, and client data goes in only where the signed agreement provides for it, under terms that do not train on it. The signed agreement sets the exact terms.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>2. Free Consultation</h2>
              <p>The initial 30-minute discovery consultation is provided at no charge and carries no obligation. Additional consultation time beyond the initial session is billed at $30/hour.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>3. Project Engagement</h2>
              <p>Custom projects run under a signed Master Services Agreement and a Statement of Work, or a signed Work Made for Hire Agreement. Our standard forms are published on the <a href="/agreements" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>Client Agreements</a> page. Unless the signed document says otherwise, a fixed-fee project takes a 50% deposit before work begins, and work starts when it clears. Invoices are due within 14 days. Payment is accepted via ACH transfer, credit card, or debit card.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>4. Deliverables &amp; Ownership</h2>
              <p>Once a project is paid in full, the client owns the work product created for it. Luwah Technologies keeps its pre-existing tools, templates, and methods, and licenses any of them built into a deliverable so the client can use, change, and distribute the deliverable. The Luwah Accessibility Toolkit is licensed to the site it is delivered on and cannot be moved to another site or resold. Open source components keep their own licenses. Access credentials and permissions are transferred to client ownership upon delivery. The signed agreement sets the exact terms.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>5. Testing &amp; Warranty</h2>
              <p>Each deliverable has a 7 business day review window following delivery, during which issues within the original scope are addressed at no additional charge. A 30-day warranty follows acceptance for defects against the Statement of Work. Work outside the original project scope is handled by a written change order.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>6. Limitation of Liability</h2>
              <p>Luwah Technologies LLC liability is limited to the fees paid under the applicable Statement of Work in the 12 months before the claim, with the exceptions the signed agreement states. We are not liable for indirect, incidental, or consequential damages. We carry Errors &amp; Omissions (E&amp;O) and Cyber liability insurance through NEXT Insurance.</p>
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
