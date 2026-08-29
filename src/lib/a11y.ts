// Shared state for the custom accessibility widget (src/components/a11y).
// Plain functions, no React import, so both the widget and the hooks that
// other components (carousels, the reading/image overlays) use to read
// prefs can share one source of truth without pulling React into a module
// that also runs the localStorage read.
//
// This covers the accessiBe-equivalent feature set Daniel asked for
// (2026-08-16), grouped to match the widget panel's three cards: Content,
// Color, Orientation. Deliberately NOT implemented, both documented
// decisions, not gaps:
//   - Any AI/automated process over the page (alt-text generation,
//     spoken announcements). The accessibility statement says every
//     control here is a manual, user-initiated toggle.
//   - Any certification badge/claim: the accessibility statement is a
//     self-assessment. Claiming third-party certification we do not have
//     is both untrue and a legal liability, not just a style choice.

export type LargeTextState = "off" | "large" | "larger";
export type FontState = "default" | "serif" | "readable";
export type ContrastState = "off" | "high" | "inverted" | "dark" | "light";
export type SaturationState = "off" | "high" | "low" | "monochrome";
export type HighlightState = "off" | "links" | "headings" | "all";
export type CursorState = "off" | "black" | "white";
export type TextAlignState = "off" | "left" | "center" | "right";
export type StepLevel = 0 | 1 | 2 | 3;

// The widget's "Useful links" list. The keys are fixed because each one
// has a translated label in all 15 panel languages (a11y-i18n.ts); the
// hrefs are per site and live in that site's a11y-config. A site lists
// only the keys whose pages it actually has.
export type A11yUsefulLinkKey = "home" | "services" | "schedule" | "contact" | "patientInfo" | "statement";
export type A11yUsefulLink = { key: A11yUsefulLinkKey; href: string };

export const CONTENT_SCALE_STEPS = [90, 100, 110, 120, 130, 140, 150] as const;
export type ContentScale = (typeof CONTENT_SCALE_STEPS)[number];

export const LINE_HEIGHT_LABELS = ["Default", "1.5x", "1.75x", "2x"] as const;
export const LETTER_SPACING_LABELS = ["Default", "+1px", "+2px", "+3px"] as const;

export type A11ySwatch = { name: string; hex: string };
export const A11Y_SWATCHES: A11ySwatch[] = [
  { name: "Blue", hex: "#0074e8" },
  { name: "Purple", hex: "#7b2ff7" },
  { name: "Red", hex: "#d7263d" },
  { name: "Orange", hex: "#e06c00" },
  { name: "Teal", hex: "#00808f" },
  { name: "Green", hex: "#1f8a4c" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#000000" },
];

export type A11yPrefs = {
  // Content
  contentScale: ContentScale;
  largeText: LargeTextState;
  lineHeight: StepLevel;
  letterSpacing: StepLevel;
  textAlign: TextAlignState;
  font: FontState;
  textMagnifier: boolean;
  highlight: HighlightState;
  // Color
  contrast: ContrastState;
  saturation: SaturationState;
  textColor: string | null;
  titleColor: string | null;
  backgroundColor: string | null;
  // Orientation
  muteSounds: boolean;
  hideImages: boolean;
  readMode: boolean;
  readingGuide: boolean;
  readingWindow: boolean;
  highlightHover: boolean;
  focusIndicator: boolean;
  cursor: CursorState;
  imageDescriptions: boolean;
  // null = follow the OS prefers-reduced-motion setting. true/false = explicit user choice, which wins.
  reduceMotion: boolean | null;
};

export const DEFAULT_A11Y_PREFS: A11yPrefs = {
  contentScale: 100,
  largeText: "off",
  lineHeight: 0,
  letterSpacing: 0,
  textAlign: "off",
  font: "default",
  textMagnifier: false,
  highlight: "off",
  contrast: "off",
  saturation: "off",
  textColor: null,
  titleColor: null,
  backgroundColor: null,
  muteSounds: false,
  hideImages: false,
  readMode: false,
  readingGuide: false,
  readingWindow: false,
  highlightHover: false,
  focusIndicator: false,
  cursor: "off",
  imageDescriptions: false,
  reduceMotion: null,
};

const STORAGE_KEY = "a11y-prefs";
export const A11Y_PREFS_EVENT = "a11y-prefs-change";
export const INTERFACE_HIDDEN_KEY = "a11y-interface-hidden";

// Every shape this key has ever stored, for migration. Fields are all
// optional/loosely typed here on purpose, this type exists only to read
// whatever an older build wrote to localStorage.
type StoredShape = {
  contentScale?: number;
  largeText?: boolean | LargeTextState;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: string;
  font?: string;
  readableFont?: boolean; // pre-font-cycle boolean
  textMagnifier?: boolean;
  highlight?: string;
  underlineLinks?: boolean; // pre-highlight-cycle boolean
  contrast?: string;
  highContrast?: boolean; // pre-contrast-cycle boolean
  saturation?: string;
  grayscale?: boolean; // pre-saturation-cycle boolean
  textColor?: string | null;
  titleColor?: string | null;
  backgroundColor?: string | null;
  muteSounds?: boolean;
  hideImages?: boolean;
  readMode?: boolean;
  readingGuide?: boolean;
  readingWindow?: boolean;
  highlightHover?: boolean;
  focusIndicator?: boolean;
  cursor?: string;
  cursorEnlarger?: boolean; // pre-cursor-cycle boolean
  imageDescriptions?: boolean;
  textSpacing?: boolean; // earliest single "Spacing" boolean
  spacing?: boolean; // pre-lineHeight/letterSpacing single "Spacing" boolean
  reduceMotion?: boolean | null;
};

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

function toBool(value: unknown): boolean {
  return value === true;
}

function toColor(value: unknown): string | null {
  return typeof value === "string" && HEX_COLOR_RE.test(value) ? value : null;
}

function toStepLevel(value: unknown): StepLevel | undefined {
  return value === 0 || value === 1 || value === 2 || value === 3 ? value : undefined;
}

function migrate(parsed: unknown): A11yPrefs {
  const raw = (parsed ?? {}) as StoredShape;

  const contentScale: ContentScale = (CONTENT_SCALE_STEPS as readonly number[]).includes(raw.contentScale ?? -1)
    ? (raw.contentScale as ContentScale)
    : 100;

  const largeText: LargeTextState =
    raw.largeText === true
      ? "large"
      : raw.largeText === "large" || raw.largeText === "larger"
        ? raw.largeText
        : "off";

  // The old single "Spacing" boolean maps to a line height + letter
  // spacing step, but only when the new step fields are not already
  // present, per the migration table: explicit lineHeight/letterSpacing
  // values win over the legacy spacing boolean.
  const storedLineHeight = toStepLevel(raw.lineHeight);
  const storedLetterSpacing = toStepLevel(raw.letterSpacing);
  const legacySpacing = raw.spacing ?? raw.textSpacing;
  const lineHeight: StepLevel = storedLineHeight ?? (legacySpacing === true ? 2 : 0);
  const letterSpacing: StepLevel = storedLetterSpacing ?? (legacySpacing === true ? 1 : 0);

  const textAlign: TextAlignState =
    raw.textAlign === "left" || raw.textAlign === "center" || raw.textAlign === "right" ? raw.textAlign : "off";

  const font: FontState =
    raw.font === "serif" || raw.font === "readable" ? raw.font : raw.readableFont === true ? "readable" : "default";

  const highlight: HighlightState =
    raw.highlight === "links" || raw.highlight === "headings" || raw.highlight === "all"
      ? raw.highlight
      : raw.underlineLinks === true
        ? "links"
        : "off";

  const contrast: ContrastState =
    raw.contrast === "high" || raw.contrast === "inverted" || raw.contrast === "dark" || raw.contrast === "light"
      ? raw.contrast
      : raw.highContrast === true
        ? "high"
        : "off";

  const saturation: SaturationState =
    raw.saturation === "high" || raw.saturation === "low" || raw.saturation === "monochrome"
      ? raw.saturation
      : raw.grayscale === true
        ? "monochrome"
        : "off";

  const cursor: CursorState =
    raw.cursor === "black" || raw.cursor === "white" ? raw.cursor : raw.cursorEnlarger === true ? "black" : "off";

  const reduceMotion: boolean | null = raw.reduceMotion === true || raw.reduceMotion === false ? raw.reduceMotion : null;

  return {
    contentScale,
    largeText,
    lineHeight,
    letterSpacing,
    textAlign,
    font,
    textMagnifier: toBool(raw.textMagnifier),
    highlight,
    contrast,
    saturation,
    textColor: toColor(raw.textColor),
    titleColor: toColor(raw.titleColor),
    backgroundColor: toColor(raw.backgroundColor),
    muteSounds: toBool(raw.muteSounds),
    hideImages: toBool(raw.hideImages),
    readMode: toBool(raw.readMode),
    readingGuide: toBool(raw.readingGuide),
    readingWindow: toBool(raw.readingWindow),
    highlightHover: toBool(raw.highlightHover),
    focusIndicator: toBool(raw.focusIndicator),
    cursor,
    imageDescriptions: toBool(raw.imageDescriptions),
    reduceMotion,
  };
}

export function readStoredPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULT_A11Y_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y_PREFS;
    return migrate(JSON.parse(raw));
  } catch {
    return DEFAULT_A11Y_PREFS;
  }
}

export function persistPrefs(prefs: A11yPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Safari private mode throws on write. The session still works, the
    // choice just does not survive a reload.
  }
  window.dispatchEvent(new CustomEvent(A11Y_PREFS_EVENT, { detail: prefs }));
}

// Reads the stored prefs, merges one key, applies and persists. Used by
// components (ReadMode) that need to change a single pref from outside
// the widget while staying in sync with it via the same storage + event
// channel persistPrefs already dispatches to.
export function setPref<K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) {
  const next = { ...readStoredPrefs(), [key]: value };
  applyPrefs(next);
  persistPrefs(next);
}

export function readInterfaceHidden(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INTERFACE_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

// There is no unhide function. Clearing site data is the documented way
// back, and the accessibility statement says so.
export function hideInterface() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTERFACE_HIDDEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function systemPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveReduceMotion(prefs: A11yPrefs): boolean {
  return prefs.reduceMotion ?? systemPrefersReducedMotion();
}

export function nextLargeTextState(state: LargeTextState): LargeTextState {
  if (state === "off") return "large";
  if (state === "large") return "larger";
  return "off";
}

export function nextFontState(state: FontState): FontState {
  if (state === "default") return "serif";
  if (state === "serif") return "readable";
  return "default";
}

export function nextContrastState(state: ContrastState): ContrastState {
  if (state === "off") return "high";
  if (state === "high") return "inverted";
  if (state === "inverted") return "dark";
  if (state === "dark") return "light";
  return "off";
}

export function nextSaturationState(state: SaturationState): SaturationState {
  if (state === "off") return "high";
  if (state === "high") return "low";
  if (state === "low") return "monochrome";
  return "off";
}

export function nextHighlightState(state: HighlightState): HighlightState {
  if (state === "off") return "links";
  if (state === "links") return "headings";
  if (state === "headings") return "all";
  return "off";
}

export function nextCursorState(state: CursorState): CursorState {
  if (state === "off") return "black";
  if (state === "black") return "white";
  return "off";
}

export function nextTextAlignState(state: TextAlignState): TextAlignState {
  if (state === "off") return "left";
  if (state === "left") return "center";
  if (state === "center") return "right";
  return "off";
}

export function nextStepLevel(state: StepLevel): StepLevel {
  if (state === 0) return 1;
  if (state === 1) return 2;
  if (state === 2) return 3;
  return 0;
}

export function stepContentScale(state: ContentScale, dir: 1 | -1): ContentScale {
  const steps = CONTENT_SCALE_STEPS as readonly number[];
  const index = steps.indexOf(state);
  const nextIndex = Math.min(steps.length - 1, Math.max(0, index + dir));
  return steps[nextIndex] as ContentScale;
}

// Content scaling and font sizing are two independent controls that
// multiply, matching accessiBe, instead of one overriding the other.
export function rootFontSizePercent(prefs: A11yPrefs): number {
  const largeTextFactor = prefs.largeText === "large" ? 1.125 : prefs.largeText === "larger" ? 1.25 : 1;
  const pct = 100 * (prefs.contentScale / 100) * largeTextFactor;
  return Math.round(pct * 100) / 100;
}

export function applyPrefs(prefs: A11yPrefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Root font size is one authoritative inline value (percentage, so the
  // browser's own font-size preference is still respected) instead of a
  // CSS class, so content scaling and font sizing multiply instead of
  // fighting each other for the last class applied. See
  // rootFontSizePercent above.
  const pct = rootFontSizePercent(prefs);
  if (pct === 100) root.style.removeProperty("font-size");
  else root.style.fontSize = `${pct}%`;

  // ---- Content ----
  root.classList.toggle("a11y-text-large", prefs.largeText === "large");
  root.classList.toggle("a11y-text-larger", prefs.largeText === "larger");
  root.classList.toggle("a11y-line-height-1", prefs.lineHeight === 1);
  root.classList.toggle("a11y-line-height-2", prefs.lineHeight === 2);
  root.classList.toggle("a11y-line-height-3", prefs.lineHeight === 3);
  root.classList.toggle("a11y-letter-spacing-1", prefs.letterSpacing === 1);
  root.classList.toggle("a11y-letter-spacing-2", prefs.letterSpacing === 2);
  root.classList.toggle("a11y-letter-spacing-3", prefs.letterSpacing === 3);
  root.classList.toggle("a11y-align-left", prefs.textAlign === "left");
  root.classList.toggle("a11y-align-center", prefs.textAlign === "center");
  root.classList.toggle("a11y-align-right", prefs.textAlign === "right");
  root.classList.toggle("a11y-font-serif", prefs.font === "serif");
  root.classList.toggle("a11y-font-readable", prefs.font === "readable");
  root.classList.toggle("a11y-text-magnifier", prefs.textMagnifier);
  root.classList.toggle("a11y-highlight-links", prefs.highlight === "links" || prefs.highlight === "all");
  root.classList.toggle("a11y-highlight-headings", prefs.highlight === "headings" || prefs.highlight === "all");
  root.classList.toggle("a11y-highlight-buttons", prefs.highlight === "all");

  // ---- Color ----
  root.classList.toggle("a11y-high-contrast", prefs.contrast === "high");
  root.classList.toggle("a11y-contrast-inverted", prefs.contrast === "inverted");
  root.classList.toggle("a11y-contrast-dark", prefs.contrast === "dark");
  root.classList.toggle("a11y-contrast-light", prefs.contrast === "light");
  root.classList.toggle("a11y-saturation-high", prefs.saturation === "high");
  root.classList.toggle("a11y-saturation-low", prefs.saturation === "low");
  root.classList.toggle("a11y-saturation-mono", prefs.saturation === "monochrome");

  // Contrast (invert) and saturation both express as CSS filters on the
  // same #a11y-page-content element. Four contrast values times four
  // saturation values is sixteen combinations, which does not scale as
  // compound class selectors, so the filter is composed once here into a
  // single custom property instead. Must resolve to the literal "none"
  // when nothing is on: a non-"none" filter creates a containing block
  // for fixed-position descendants, "none" does not, so the default
  // state must never regress sticky/fixed layout inside the page content.
  const filters: string[] = [];
  if (prefs.saturation === "high") filters.push("saturate(1.8)");
  if (prefs.saturation === "low") filters.push("saturate(0.45)");
  if (prefs.saturation === "monochrome") filters.push("grayscale(1)");
  if (prefs.contrast === "inverted") filters.push("invert(1)", "hue-rotate(180deg)");
  root.style.setProperty("--a11y-page-filter", filters.length ? filters.join(" ") : "none");

  root.classList.toggle("a11y-custom-text", prefs.textColor !== null);
  if (prefs.textColor !== null) root.style.setProperty("--a11y-text-color", prefs.textColor);
  else root.style.removeProperty("--a11y-text-color");

  root.classList.toggle("a11y-custom-title", prefs.titleColor !== null);
  if (prefs.titleColor !== null) root.style.setProperty("--a11y-title-color", prefs.titleColor);
  else root.style.removeProperty("--a11y-title-color");

  root.classList.toggle("a11y-custom-bg", prefs.backgroundColor !== null);
  if (prefs.backgroundColor !== null) root.style.setProperty("--a11y-bg-color", prefs.backgroundColor);
  else root.style.removeProperty("--a11y-bg-color");

  // ---- Orientation ----
  root.classList.toggle("a11y-highlight-hover", prefs.highlightHover);
  root.classList.toggle("a11y-focus-strong", prefs.focusIndicator);
  root.classList.toggle("a11y-cursor-black", prefs.cursor === "black");
  root.classList.toggle("a11y-cursor-white", prefs.cursor === "white");

  // Reading guide and reading window are mutually exclusive, enforced by
  // the widget's setters, applied here defensively too so a hand-edited
  // localStorage value can't turn on both.
  root.classList.toggle("a11y-reading-guide", prefs.readingGuide && !prefs.readingWindow);
  root.classList.toggle("a11y-reading-window", prefs.readingWindow);
  root.classList.toggle("a11y-read-mode", prefs.readMode);
  root.classList.toggle("a11y-image-descriptions", prefs.imageDescriptions);
  root.classList.toggle("a11y-hide-images", prefs.hideImages);
  root.classList.toggle("a11y-mute-sounds", prefs.muteSounds);

  // ---- Motion ----
  root.classList.toggle("a11y-reduce-motion", resolveReduceMotion(prefs));
}
