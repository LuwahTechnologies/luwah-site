import { DEFAULT_A11Y_PREFS, type A11yPrefs } from "@/lib/a11y";

// accessiBe-style disability profiles (Daniel's 2026-08-16 request,
// expanded to the full accessiBe profile set on 2026-08-16). Each profile
// is a PRESET over the existing individual adjustments, not a new engine:
// toggling one on merges its bundle into the current prefs, toggling it
// off returns just its bundle's keys to their defaults, and a profile
// shows as "on" when every pref in its bundle currently matches. That
// derivation keeps profiles free (no schema/storage change) and means a
// user's manual tweaks compose with them naturally.
//
// Deliberately NOT copied from accessiBe: their statement's claims of an
// AI background process, OCR alt-text generation, and automatic
// screen-reader announcements. These bundles only switch on capabilities
// this site actually implements. Names, descriptions, and display order
// (including the added Older Adults profile) match the accessiBe list;
// the underlying adjustments are still this site's own.

export type A11yProfile = {
  id: string;
  name: string;
  description: string;
  bundle: Partial<A11yPrefs>;
};

export const A11Y_PROFILES: A11yProfile[] = [
  {
    id: "epilepsy",
    name: "Epilepsy Safe",
    description: "Stops animations and removes color intensity to reduce seizure risk.",
    bundle: { reduceMotion: true, saturation: "monochrome" },
  },
  {
    id: "vision",
    name: "Vision Impaired",
    description: "Larger text in a high-legibility font with wider line height and letter spacing.",
    bundle: { largeText: "large", font: "readable", lineHeight: 2, letterSpacing: 1 },
  },
  {
    id: "older",
    name: "Older Adults",
    description: "Larger text, a high-legibility font, higher contrast, and highlighted links.",
    bundle: { largeText: "large", font: "readable", contrast: "high", highlight: "links" },
  },
  {
    id: "cognitive",
    name: "Cognitive Disability",
    description: "Highlights links and headings and adds a reading guide to aid focus.",
    // readingGuide and readingWindow are mutually exclusive in the widget;
    // the bundle sets both so activation resolves the conflict.
    bundle: { highlight: "all", readingGuide: true, readingWindow: false },
  },
  {
    id: "adhd",
    name: "ADHD Friendly",
    description: "Cuts distractions with a focused reading window and less motion.",
    bundle: { readingWindow: true, readingGuide: false, reduceMotion: true },
  },
  {
    id: "blind",
    name: "Blind Users (Screen-reader)",
    description: "Surfaces image descriptions for JAWS, NVDA, VoiceOver, and TalkBack users.",
    bundle: { imageDescriptions: true },
  },
  {
    id: "motor",
    name: "Keyboard Navigation (Motor)",
    description: "Strong focus outlines and a large black cursor for keyboard-first use.",
    bundle: { focusIndicator: true, cursor: "black" },
  },
];

export function isProfileActive(prefs: A11yPrefs, profile: A11yProfile): boolean {
  return (Object.keys(profile.bundle) as (keyof A11yPrefs)[]).every((key) => prefs[key] === profile.bundle[key]);
}

export function applyProfile(prefs: A11yPrefs, profile: A11yProfile): A11yPrefs {
  return { ...prefs, ...profile.bundle };
}

export function clearProfile(prefs: A11yPrefs, profile: A11yProfile): A11yPrefs {
  const next = { ...prefs };
  for (const key of Object.keys(profile.bundle) as (keyof A11yPrefs)[]) {
    (next as Record<string, unknown>)[key] = DEFAULT_A11Y_PREFS[key];
  }
  return next;
}
