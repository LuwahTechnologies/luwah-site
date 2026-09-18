import type { Metadata } from "next";
import version from "./version.json";

export const metadata: Metadata = {
  title: "Client Agreements",
  description:
    "The standard agreements Luwah Technologies signs with clients and contractors: Mutual Non-Disclosure Agreement, Master Services Agreement, Work Made for Hire Agreement, and Independent Contractor Agreement. PDF and Word downloads.",
};

// Written by scripts/build-agreements.py on every build, so the page and the
// documents cannot disagree about the version.
const TEMPLATE_VERSION = version.version;
const TEMPLATE_DATE = version.label;

type Agreement = {
  slug: string;
  name: string;
  whenUsed: string;
  terms: string[];
};

const AGREEMENTS: Agreement[] = [
  {
    slug: "NDA_Mutual_LuwahTech_Template_v1",
    name: "Mutual Non-Disclosure Agreement",
    whenUsed:
      "Signed before a discovery conversation where either side will share business detail, data, pricing or system access. It is mutual: the same obligations protect your information and ours.",
    terms: [
      "Covers anything a reasonable person would treat as confidential, including what is said in a meeting or shown on a shared screen, with no written follow-up required.",
      "Credentials and system access get their own rule: used only for the stated purpose, kept in a password manager, returned on request and in any case when the agreement ends.",
      "Protected health information is not shared under it. A business associate agreement comes first if the work needs one.",
      "Two-year term by default. Confidentiality lasts three years from each disclosure or from the end of the agreement, whichever is later, and for as long as a trade secret stays a trade secret.",
      "Neither side names the other, or describes the work, publicly without written consent. Either side keeps the general skills and know-how it gains.",
      "Colorado law. Negotiate, then mediate, then court, and either side can go straight to court for an injunction.",
      "AI tools such as Anthropic Claude and Google Gemini may touch confidential information only where they do not train on it. Never credentials, and never health, card or other regulated data without a written agreement.",
    ],
  },
  {
    slug: "MSA_LuwahTech_Template_v1",
    name: "Master Services Agreement",
    whenUsed:
      "Signed once per client. It carries the terms that do not change from project to project. Each project is then described in a short Statement of Work that references it.",
    terms: [
      "50% deposit on a fixed fee, work starts when it clears. Invoices are Net 14.",
      "You own the work we build for you once it is paid for. We keep our reusable tools and license them to you as part of your deliverable.",
      "Least-privilege access, credentials in a password manager, access revoked when the project ends.",
      "7 business days to review each deliverable. 30-day warranty after acceptance.",
      "Liability capped at the fees paid under the Statement of Work in the 12 months before the claim. Colorado law.",
      "We build and manage with AI tools, including Anthropic Claude and Google Gemini, under terms that do not train on your content. Your credentials never go into them. Your data goes in only where the signed Statement of Work provides for it.",
      "The Luwah Accessibility Toolkit and our other reusable tools stay ours. They are licensed to you as part of your deliverable and cannot be moved to another site or resold.",
      "Includes the Statement of Work, Background IP schedule and Change Order forms as exhibits.",
    ],
  },
  {
    slug: "Work_For_Hire_LuwahTech_Template_v1",
    name: "Work Made for Hire Agreement",
    whenUsed:
      "Signed when a client wants a standalone, project-specific transfer of ownership, or when no Master Services Agreement is in place.",
    terms: [
      "The work is a work made for hire for you, and to the extent the law does not treat it that way, we assign it to you on payment in full.",
      "Moral rights waived. We sign whatever is needed to record your ownership.",
      "Our pre-existing tools, including the Luwah Accessibility Toolkit, stay ours and are licensed to you as part of the work. They are listed in a schedule you can read before signing.",
      "Open source components keep their own licenses, and we identify them on request.",
      "Portfolio use only with your written consent.",
    ],
  },
  {
    slug: "Contractor_Agreement_LuwahTech_Template_v1",
    name: "Independent Contractor Agreement",
    whenUsed:
      "Signed with a subcontractor before they touch any client work. It is how we make the promises in the two agreements above hold when more than one person is on a project.",
    terms: [
      "Everything the contractor creates is owned by Luwah Technologies and flows through to the client.",
      "Client confidentiality, credential handling and security rules match what we promise you.",
      "Contractors report a suspected security incident within 24 hours.",
      "Contractors may not use what they learn on your project to work around us, and may not copy or keep Luwah tools such as the Accessibility Toolkit.",
      "AI tools only where the Work Order allows them, never with credentials or regulated data.",
      "Work Orders define each assignment, its rate and the access granted.",
    ],
  },
];

const headingStyle = {
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-display)",
} as const;

export default function AgreementsPage() {
  return (
    <div className="pt-24">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[720px] px-6">
          <h1
            className="mb-3 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Client Agreements
          </h1>
          <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Template {TEMPLATE_VERSION}, {TEMPLATE_DATE}
          </p>

          <div
            className="flex flex-col gap-10 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <section>
              <p>
                These are the agreements we sign before work starts. We publish them so you can
                read the terms before a proposal lands in your inbox, and so there are no
                surprises at signing. Each one is a template. The copy you sign has the blanks
                filled in, and that signed copy is the one that governs.
              </p>
              <p className="mt-3">
                Nothing on this page is legal advice. If you want a term changed, tell us and we
                will talk it through before you sign.
              </p>
            </section>

            {AGREEMENTS.map((agreement) => (
              <section key={agreement.slug} className="card p-6 md:p-8">
                <h2 className="mb-2 text-lg font-semibold" style={headingStyle}>
                  {agreement.name}
                </h2>
                <p className="mb-4">{agreement.whenUsed}</p>
                <h3
                  className="mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Key terms
                </h3>
                <ul className="mb-6 list-disc space-y-1.5 pl-5">
                  {agreement.terms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/agreements/${agreement.slug}.pdf`}
                    className="btn-primary"
                    aria-label={`Download PDF, ${agreement.name}`}
                    download
                  >
                    Download PDF
                  </a>
                  <a
                    href={`/agreements/${agreement.slug}.docx`}
                    className="btn-secondary"
                    aria-label={`Word version (.docx), ${agreement.name}`}
                    download
                  >
                    Word version (.docx)
                  </a>
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={headingStyle}>
                How they fit together
              </h2>
              <p>
                A first conversation about your business starts with the Mutual Non-Disclosure
                Agreement. A first project starts with the Master Services Agreement and a Statement of Work.
                A second project only needs a new Statement of Work. A client who wants a separate,
                signed record of ownership for one project adds the Work Made for Hire Agreement.
                Any subcontractor on your project has signed the Independent Contractor Agreement
                first. The website{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-2"
                  style={{ color: "var(--color-copper)" }}
                >
                  Terms &amp; Conditions
                </a>{" "}
                summarise the same project terms and cover use of this site. Where they and a signed
                agreement differ, the signed agreement controls.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold" style={headingStyle}>
                Contact
              </h2>
              <p>
                Luwah Technologies LLC
                <br />
                Aurora, CO 80017
                <br />
                hello@luwahtechnologies.com
                <br />
                +1 (720) 421-7184
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
