import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Luwah Technologies privacy policy. How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[720px] px-6">
          <h1
            className="mb-3 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Privacy Policy
          </h1>
          <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Last updated: March 2026
          </p>

          <div
            className="flex flex-col gap-8 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Information We Collect</h2>
              <p>When you use our consultation intake form, we collect: your name, email address, phone number (optional), business name, industry, current tools you use, your business challenges, budget range, scheduling preferences, and how you found us. We also collect your IP address (hashed for rate limiting) and Cloudflare Turnstile verification status for bot prevention.</p>
              <p className="mt-3"><strong style={{ color: "var(--color-text-primary)" }}>Progressive Form Data:</strong> Our consultation intake form utilizes progressive data capture. If you begin filling out our intake form, we may securely capture and store the information provided in the initial steps (such as your Name and Email) to facilitate follow-up communications, even if the final submission is not completed.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>How We Use Your Information</h2>
              <p>We use your information to: prepare for and schedule your consultation, communicate with you about our services, improve our website and services, and send you relevant follow-up communications. We do not sell, rent, or share your personal information with third parties.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Data Storage & Security</h2>
              <p>Your data is stored in a secure MySQL database and mirrored to Microsoft Excel via OneDrive for operational redundancy. All data is transmitted over encrypted connections (HTTPS/TLS). Our infrastructure uses Cloudflare for DNS, CDN, and DDoS protection. Transactional emails are processed through Resend, which processes but does not retain message content.</p>
              <p className="mt-3"><strong style={{ color: "var(--color-text-primary)" }}>Self-Hosted Infrastructure:</strong> To ensure the highest level of security and data sovereignty, Luwah Technologies processes operational data and webhook submissions on our private, self-hosted infrastructure (Proxmox) located in Aurora, Colorado, secured via Cloudflare zero-trust tunnels.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Third-Party Processing</h2>
              <p><strong style={{ color: "var(--color-text-primary)" }}>Data Enrichment:</strong> When you submit a business email, we may use secure third-party APIs (such as Clearbit or Hunter.io) to append publicly available professional context to your inquiry so we can better prepare for your consultation.</p>
              <p className="mt-3"><strong style={{ color: "var(--color-text-primary)" }}>Email Delivery:</strong> Transactional emails are sent via Resend. Resend processes the email content for delivery but does not store or analyze message content beyond what is necessary for delivery.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Data Retention</h2>
              <p>Consultation records are retained for 2 years from the date of submission. After this period, records are archived or deleted. You may request deletion of your data at any time by contacting us at hello@luwahtechnologies.com.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Cookies & Tracking</h2>
              <p>We use Plausible Analytics, a privacy-friendly analytics tool that does not use cookies and does not collect personal data. Cloudflare Turnstile is used for bot prevention and is cookieless. We do not use tracking cookies, retargeting pixels, or third-party advertising scripts.</p>
            </section>

            <section id="accessibility">
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Accessibility Preferences</h2>
              <p>Every page carries an Accessibility Center, a panel you open from the button in the lower left corner. It lets you change contrast, text size, spacing, motion, cursor, and other display settings. It is our own code. This site does not use a third-party accessibility overlay.</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li><strong>Where your choices are stored.</strong> In your own browser, in local storage, under the keys <code>a11y-prefs</code>, <code>a11y-interface-hidden</code>, and <code>a11y-lang</code>.</li>
                <li><strong>What we receive.</strong> Nothing. Your accessibility choices never reach our servers, are never attached to a lead record or an email, are never used to identify or profile you, and are never shared. We cannot see what you selected.</li>
                <li><strong>Why no cookie notice covers it.</strong> These values exist only to render the page the way you asked. They carry no identifier and they are not analytics.</li>
                <li><strong>How to clear them.</strong> Clear this site&apos;s browsing data in your browser. That also restores the accessibility button if you used Hide interface.</li>
              </ul>
              <p className="mt-3">If you report an accessibility problem through the form on our <a href="/accessibility-statement" className="underline underline-offset-2" style={{ color: "var(--color-copper)" }}>Accessibility Statement</a> page, we receive only what you type: your name, email, an optional phone number, the category you pick, and your description. It reaches us through the same intake as our contact form, is stored and retained the same way, and we use it to answer you and to fix the underlying issue.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Your Rights</h2>
              <p>You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and withdraw consent for communications at any time. To exercise any of these rights, contact us at hello@luwahtechnologies.com.</p>
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
