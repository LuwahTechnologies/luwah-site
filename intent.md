# Split /intake into website and automation paths

## Problem
/intake serves one form, the website build intake. A prospect who needs automation or operations work has no matching intake. Their only path is /consultation, which captures tools and a challenge but not process volume, triggers, destinations, current versus desired state, or hosting choice. The six form primitives live inside the website form file, so a second form cannot reuse them.

## Desired outcome
- /intake shows two cards, Website Build and Automation & Operations, and holds no form.
- /intake/website renders the current website form with identical fields, gating, and submit behavior.
- /intake/automation renders a four step form: Bottleneck, Stack, Current vs Desired State, Infrastructure and Budget.
- The current state step takes a link (Loom, Drive, diagram). It never takes a file.
- A valid automation submission creates an automationIntake document in Studio, sends the notify email, and returns success. It is rejected without Turnstile, over the rate limit, or with fields outside the whitelist.
- The automation form states three things in plain copy: discovery is paid and fixed, scope depends on systems not yet reviewed, budget does not set price.
- The order form and the web design section link to /intake/website. The sitemap lists /intake/website and /intake/automation.
- `npm run test:smoke` passes on a clean `.next`.

## Affected users and systems
- Prospects arriving from /order, /web-design, and search.
- The operator, who triages intakes in Sanity Studio and by email.
- Sanity dataset and Studio desk structure (new document type).
- Resend notify email, Cloudflare Turnstile, the in-process rate limiter.
- n8n web forms workflow, if the optional forward is enabled.

## Constraints
- Node 24+ per package.json engines. npm only.
- Branch intake-split-automation is stacked on PR #51. The PR base must be intake-addons-assets. Do not merge.
- Verify after stopping `next dev` and removing `.next`.
- The website form must not change behavior. The primitive extraction is a pure move.
- Origin is the operator's backlog, not a client. No discovery fee applies to this intent.
- The live n8n workflow is not verified from here. The repo copy routes on form_type with no fallback, so an unknown type is likely dropped silently.

## Out of scope
- Draft autosave, tooltips, framer-motion transitions, voice dictation.
- File uploads of any kind, and any AI diagram node.
- Changes to /consultation.
- A new n8n branch or database table for automation intakes.
- Any change to website form fields or copy.

## Decisions (accepted by the operator)
- Hosting: no prices on the form. One merged field with the options "Managed by Luwah", "Self-hosted n8n", "Not sure, please advise".
- Budget options: Under $1,000, $1,000 to $2,500, $2,500 to $5,000, $5,000+, Not sure. Optional.
- Timeline: reuse the website form's timeline list.
- Hours per week: whole numbers, 1 to 200.
- Required fields: contact name, email, phone, process description, trigger, destination, success description, hosting, printed name, agreement. The link and budget stay optional.
- Agreement step: yes. Reuse the printed name and agree pattern, with automation copy.
- Current tools: Airtable, HubSpot, QuickBooks, Shopify, Square, Mailchimp, Google Workspace, Slack, Zapier, Stripe, Other (free text).
- n8n forward: off until the workflow has a matching automation-intake branch. Do not edit the live workflow.
- /consultation: unchanged.
- Fork page: its own title and description.
- Smoke checks: add checks that /intake, /intake/website and /intake/automation return 200 with the expected headings.
- Studio: register the type in the schema index and add a list in sanity.config.ts so the notify email link resolves.
- Contact fields on the automation form: name, email, phone.

## Status
accepted
