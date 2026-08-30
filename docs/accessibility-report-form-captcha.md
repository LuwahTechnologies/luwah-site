# Open decision: Turnstile on the accessibility report form

**Status:** undecided, raised 2026-08-29. Daniel is looking at it later.
**Owner:** Daniel.
**Blocking:** nothing. The form works today. This is a judgement call about
whether a bot check belongs on this particular form.

## The situation

`/accessibility-statement` carries a report form so a visitor can tell us
the site failed them. It posts to `/api/contact`, the same intake the
contact form uses, which means it inherits that route's Cloudflare
Turnstile check. `src/app/api/contact/route.ts` treats a missing token as
a failed check, so the challenge is required, not optional.

The tension: the people most likely to use this form are the people the
site has already failed. A CAPTCHA is a known barrier for screen-reader
users, for people with motor impairments, and for anyone on assistive
technology that interacts badly with an embedded challenge. Putting one in
front of "tell us this site does not work for you" can block the exact
report we need.

## What is already handled

The form does not dead-end when the check fails. If Turnstile will not
load or is not solved, the error tells the visitor so and points them at
the contact page instead. `A11Y_CONTACT_FALLBACK` in
`src/lib/a11y-config.tsx` is what renders that line, and the shared form
prints it under both the captcha error and any submit error. So the worst
case today is friction plus a signposted way around it, not a dead end.

Also worth knowing: Turnstile logs `TurnstileError: 110200` on localhost.
That is Cloudflare rejecting an unknown domain for the production site
key. It is not a fault in this code and does not happen on the real
domain.

## The options

**A. Leave it as is.** No work. The report form has the same spam
protection as every other form on the site, and the fallback line covers
people the challenge blocks.

**B. Drop the captcha on this form only.** Set `A11Y_CAPTCHA_REQUIRED` to
`false` in `src/lib/a11y-config.tsx` and have `A11yCaptcha` return `null`.
The shared form then relies on its honeypot and its three-second minimum
fill time, which are client-side filters only. That means `/api/contact`
would need to accept a tokenless submission for this one case, so it
needs a separate route or a flag the route trusts. Do not simply loosen
`/api/contact`, or the contact form loses its protection too.

**C. Keep the captcha but add a no-captcha escape.** Leave the form as is
and add a plain `mailto:` line next to it, so there is a route that
involves no JavaScript and no challenge at all. Cheapest of the three and
it removes the barrier without weakening the endpoint.

## Recommendation

C, then revisit. It costs one line, it cannot be spammed because it is not
an endpoint, and it means nobody is ever stuck behind a challenge to
report an accessibility barrier. B is the cleaner end state but it needs a
second rate-limited route to be done safely, which is more work than the
problem currently justifies.

## Where the code is

- `src/lib/a11y-config.tsx` holds `A11Y_CAPTCHA_REQUIRED`, `A11yCaptcha`,
  `A11Y_CONTACT_FALLBACK`, and `submitAccessibilityReport`. Everything
  site-specific about the form lives in this one file.
- `src/components/a11y/AccessibilityReportForm.tsx` is the shared form.
  **Do not edit this to change behaviour for one site.** It is
  byte-identical across the Luwah sites so the toolkit can be updated by
  copying files. Change the config instead.
- `src/app/api/contact/route.ts` is the endpoint and its Turnstile check.
