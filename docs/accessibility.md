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
