# Accessibility Toolkit

How this site's accessibility features are built, how to verify them, and
what a scanner will and will not tell you. Ported from eldaifurology.com
on 2026-08-29.

## What the site ships

The site is built accessible at the HTML level and verified against WCAG
2.2 Level AA. On top of that, every page carries an Accessibility Center
widget (round launcher, lower left). It is our own code. No third-party
overlay, no accessiBe, no AudioEye.

Seven one-tap profiles, content adjustments (scaling, font size, line
height, letter spacing, alignment, readable font, magnifier, highlights),
colour adjustments (contrast, saturation, custom text/title/background
colours), and orientation adjustments (mute sounds, hide images, read
mode, reading guide/window, stop animations, highlight hover/focus, big
cursor, image descriptions, useful links, hide interface). The panel UI
translates into 15 languages. Site content is not translated, only the
panel.

## Architecture

- `src/lib/a11y.ts` is the preference engine. One `A11yPrefs` object in
  localStorage under `a11y-prefs`. `migrate()` upgrades every historical
  stored shape. `applyPrefs()` toggles root classes, sets the root font
  size inline, and composes `--a11y-page-filter`.
- `src/lib/a11y-profiles.ts` holds the profiles, which are presets over the same prefs.
- `src/lib/a11y-i18n.ts` holds the panel strings. Every language covers the
  same key set as en-US.
- `src/lib/a11y-config.tsx` is **the only file that is specific to this
  site.** Routes, the report-form endpoint, the captcha, and the useful
  links live here. Everything else is byte-identical across Luwah sites,
  so the toolkit is updated by copying files, not by hand-merging.
- `src/components/a11y/` holds the panel plus the render-null behaviour
  components (TextMagnifier, HiddenImageAltText, MuteSounds, ReadMode,
  ReadingOverlays, ImageDescriptions).
- Styling lives in `src/app/globals.css` under the accessibility section.

### The `#a11y-page-content` wrapper

The layout wraps everything except the widget and its overlays in
`#a11y-page-content`. The saturation and inverted-contrast filters are
scoped to that element so they never grey out or invert the widget's own
controls. Read mode and the magnifier sit outside for the same reason.
Do not move the widget inside the wrapper.

### Stacking

The launcher is `z-[10050]` and the panel `z-[10060]`, above the
four-digit z-indexes site chrome uses. This is not arbitrary: at the
original `z-30` a cookie banner at `z-index: 10000` covered the launcher
outright, so the person who most needed the panel could not open it until
they dismissed a consent notice.

## The high-contrast rule, and why it is short

`html.a11y-high-contrast` overrides design tokens so the mode reaches
page content the widget never renders. **Only override a token whose role
is unambiguous.** This palette is named by colour, not by role, so most
tokens are used as both text and background. Pushing one of those in
either direction fixes one usage and breaks the other, and the breakage
lands in the mode a person turned on *because* they needed more contrast.

Before adding a token to that rule, check its actual usage:

```bash
grep -rohE "\b(bg|text|border|from|via|to|ring|divide)-TOKEN\b" src/ | sort | uniq -c
```

If both `bg-` and `text-` appear, leave it alone and fix the specific
elements by name instead.

## Verifying

```bash
npm run build && npm run start    # or: npx vite preview
```

Then scan with axe-core against WCAG 2.2 AA, in **both** the default
state and with the panel open and a profile applied. Scanning only the
default state misses the widget's own markup, which is the part that is
new. Also compare the default state against high contrast: high contrast
must never make any element worse.

Warning: never rebuild while a server is running, and check the port is
actually free before starting one. A stale server keeps serving old HTML
that references deleted hashed assets, the page loads with no CSS, and
every check then reports nonsense.

## Accepted scanner exception

The panel header is a CSS gradient. axe cannot compute a gradient, so it
walks up to the nearest solid ancestor and reports the language button as
light-on-light (about 1.1:1). The header really renders the brand
gradient and the button text measures 12:1 or better against every stop.
Measured by hand. Re-measure if the header palette changes. This is the
only known exception, and it is the same class of limitation as text over
a photograph.

## The accessibility statement

The public statement is a self-assessment. It claims only what the code
actually does. Never add certification badges or compliance claims for
laws the site has not been audited against.

## Manual pass, 2026-08-30

Run alongside the rule-based scan: a keyboard walk of every template,
reflow at 200 and 400 percent zoom, the panel at 320 and 360 pixels wide,
and an accessibility-tree audit standing in for a screen reader. 311 of 323
checks passed across the four Luwah sites.

Verified working on every template here: the skip link is the first focus
stop and moves focus into the main landmark, every focus stop shows a
focus indicator, no positive tabindex, the launcher is reachable and opens
with Enter, the panel is non-modal, Escape closes it and returns focus to
the launcher, every panel control is named, one h1 per page with no
skipped levels, and no horizontal scrolling at 200 percent zoom.

Two things the toolkit itself got wrong and that are now fixed, worth
knowing if you port it somewhere new:

- The launcher's hover pill is `whitespace-nowrap` and sat in the
  launcher's flex row, so it widened the document past a 320px viewport.
  It is hidden below the `sm` breakpoint.
- Cloudflare renders Turnstile at a fixed ~300px, wider than a 320px
  viewport once padding is counted. Every Turnstile slot is wrapped in
  `max-w-full overflow-x-auto` so it scrolls in its own box instead of
  widening the page.

### Known gaps

- On /accessibility-statement and /contact, the Cloudflare Turnstile
  container elements take focus without a visible focus ring. That markup
  is Cloudflare's and cannot be styled from here. See
  `accessibility-report-form-captcha.md`, which is the open question about
  whether that form should carry a captcha at all.
- /contact still scrolls horizontally by about 4px at 400 percent zoom
  (a 320px viewport). 200 percent is clean.

A human screen-reader session (VoiceOver or JAWS) is still outstanding.
The audit above confirms every control HAS an accessible name and a
correct role. It cannot judge whether those names read well aloud.

### Update, 2026-08-30

All 328 manual-pass checks now pass on all four sites, and the WCAG 2.2 AA
scan is clean on every page in both the default and panel-open states.

The gaps recorded above are fixed:

- Third-party embeds now get a focus ring. This could not be done in CSS.
  Cloudflare puts Turnstile's controls in a closed shadow root and map
  frames are cross-origin, so the host element matches neither `:focus` nor
  `:focus-within` even while `document.activeElement` points at it, and
  Chrome fires no focus event in this document when Tab lands there.
  `EmbedFocusRing.tsx` watches for it and marks the host, which the
  stylesheet rings. The ring is two-tone, white inside and near-black
  outside, because these embeds sit on a white card on some pages and a
  dark background on others and no single colour clears 3:1 against both.
- Horizontal scrolling at 400 percent zoom is gone. The cause on three
  sites was the same: a grid or flex ancestor of a fixed-width embed keeps
  `min-width: auto`, so one ~300px widget held a whole column open. A
  `:has(.a11y-embed-slot) { min-width: 0 }` rule lets those ancestors
  shrink. Knotless also needed `minmax(0, 1fr)` on its booking grid.

The only remaining scanner output is the accepted gradient exception
described above.

A human screen-reader session (VoiceOver or JAWS) is still the one thing
not covered here.

