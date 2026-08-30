"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityReportForm } from "@/components/a11y/AccessibilityReportForm";
import { A11Y_LINKS, A11Y_USEFUL_LINKS as USEFUL_LINKS } from "@/lib/a11y-config";
import {
  A11Y_SWATCHES,
  CONTENT_SCALE_STEPS,
  DEFAULT_A11Y_PREFS,
  LETTER_SPACING_LABELS,
  LINE_HEIGHT_LABELS,
  applyPrefs,
  hideInterface,
  nextContrastState,
  nextCursorState,
  nextFontState,
  nextHighlightState,
  nextLargeTextState,
  nextSaturationState,
  nextStepLevel,
  nextTextAlignState,
  persistPrefs,
  readInterfaceHidden,
  readStoredPrefs,
  resolveReduceMotion,
  stepContentScale,
  type A11yPrefs,
  type TextAlignState,
} from "@/lib/a11y";
import { A11Y_PROFILES, applyProfile, clearProfile, isProfileActive, type A11yProfile } from "@/lib/a11y-profiles";
import {
  DEFAULT_LANG,
  LANGUAGES,
  getStrings,
  isRtlLang,
  persistLang,
  readStoredLang,
  swatchLabel,
  type A11yStrings,
  type LangCode,
} from "@/lib/a11y-i18n";

// Widget chrome redesigned 2026-08-16 (Daniel's call): the drawer is a
// custom-designed "Accessibility Center" -- gradient header, accessiBe
// style disability-profile presets (see lib/a11y-profiles.ts), card
// sections, and richer tiles. Palette runs on the site's own brand tokens
// (src/app/globals.css @theme: brand navy, accent gold, highlight blue),
// not a generic indigo/violet palette, per Daniel's 2026-08-16 amendment.
// Gold (accent-600/accent-400) is used only against the navy header/active
// gradients or as a decorative, non-essential ring, per the same
// amendment's contrast note (gold text/borders on white fail WCAG AA).
// Interface language is a separate concern from the visual adjustments:
// it only changes the strings this component renders, never site content,
// see src/lib/a11y-i18n.ts.
type BooleanPrefKey =
  | "textMagnifier"
  | "highlightHover"
  | "focusIndicator"
  | "imageDescriptions"
  | "hideImages"
  | "muteSounds";
type View = "tools" | "report" | "structure" | "language";

type StructureTarget = { label: string; el: Element | null };

const ACCENT_GRADIENT = "bg-gradient-to-r from-a11ybrand-900 via-a11ybrand-700 to-a11ybrand-500";



function profileStrings(t: A11yStrings, id: string) {
  switch (id) {
    case "epilepsy":
      return t.profiles.epilepsy;
    case "vision":
      return t.profiles.vision;
    case "older":
      return t.profiles.older;
    case "cognitive":
      return t.profiles.cognitive;
    case "adhd":
      return t.profiles.adhd;
    case "blind":
      return t.profiles.blind;
    case "motor":
      return t.profiles.motor;
    default:
      return t.profiles.epilepsy;
  }
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("tools");
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_A11Y_PREFS);
  const [hidden, setHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState(false);
  const [lang, setLang] = useState<LangCode>(DEFAULT_LANG);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const usefulLinksRef = useRef<HTMLSelectElement>(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const confirmHideRef = useRef(confirmHide);
  confirmHideRef.current = confirmHide;
  const viewRef = useRef(view);
  viewRef.current = view;

  const t = getStrings(lang);

  // Restore saved prefs, the hide-interface flag and the interface
  // language after mount. A brief flash of the default state is
  // acceptable here, see constraint note, an inline pre-hydration script
  // would need a CSP allowance this repo does not have.
  useEffect(() => {
    const stored = readStoredPrefs();
    setPrefs(stored);
    applyPrefs(stored);
    setHidden(readInterfaceHidden());
    setLang(readStoredLang());
  }, []);

  function commit(next: A11yPrefs) {
    setPrefs(next);
    applyPrefs(next);
    persistPrefs(next);
  }

  function toggleBoolean(key: BooleanPrefKey) {
    commit({ ...prefsRef.current, [key]: !prefsRef.current[key] });
  }

  function cycleLargeText() {
    commit({ ...prefsRef.current, largeText: nextLargeTextState(prefsRef.current.largeText) });
  }

  function cycleFont() {
    commit({ ...prefsRef.current, font: nextFontState(prefsRef.current.font) });
  }

  function cycleContrast() {
    commit({ ...prefsRef.current, contrast: nextContrastState(prefsRef.current.contrast) });
  }

  function cycleSaturation() {
    commit({ ...prefsRef.current, saturation: nextSaturationState(prefsRef.current.saturation) });
  }

  function cycleHighlight() {
    commit({ ...prefsRef.current, highlight: nextHighlightState(prefsRef.current.highlight) });
  }

  function cycleCursor() {
    commit({ ...prefsRef.current, cursor: nextCursorState(prefsRef.current.cursor) });
  }

  function cycleTextAlign() {
    commit({ ...prefsRef.current, textAlign: nextTextAlignState(prefsRef.current.textAlign) });
  }

  function setTextAlign(value: TextAlignState) {
    commit({ ...prefsRef.current, textAlign: value });
  }

  // Used by the "l" shortcut, which cycles forward with wraparound
  // (nextStepLevel: 0 -> 1 -> 2 -> 3 -> 0). The StepperRow's own Increase
  // button reuses this too: it is disabled at step 3, so the wraparound
  // branch never actually fires from a button press.
  function cycleLineHeight() {
    commit({ ...prefsRef.current, lineHeight: nextStepLevel(prefsRef.current.lineHeight) });
  }

  function cycleLetterSpacing() {
    commit({ ...prefsRef.current, letterSpacing: nextStepLevel(prefsRef.current.letterSpacing) });
  }

  // Stepper Decrease buttons need a plain decrement, not the wraparound
  // nextStepLevel uses for the keyboard-shortcut cycle.
  function decreaseLineHeight() {
    commit({ ...prefsRef.current, lineHeight: Math.max(0, prefsRef.current.lineHeight - 1) as A11yPrefs["lineHeight"] });
  }

  function decreaseLetterSpacing() {
    commit({
      ...prefsRef.current,
      letterSpacing: Math.max(0, prefsRef.current.letterSpacing - 1) as A11yPrefs["letterSpacing"],
    });
  }

  function bumpContentScale(dir: 1 | -1) {
    commit({ ...prefsRef.current, contentScale: stepContentScale(prefsRef.current.contentScale, dir) });
  }

  function setColorOverride(key: "textColor" | "titleColor" | "backgroundColor", hex: string | null) {
    commit({ ...prefsRef.current, [key]: hex });
  }

  function toggleReadMode() {
    commit({ ...prefsRef.current, readMode: !prefsRef.current.readMode });
  }

  function toggleReduceMotion() {
    commit({ ...prefsRef.current, reduceMotion: !resolveReduceMotion(prefsRef.current) });
  }

  // Reading guide and reading window are mutually exclusive: turning one
  // on turns the other off.
  function toggleReadingGuide() {
    const next = !prefsRef.current.readingGuide;
    commit({ ...prefsRef.current, readingGuide: next, readingWindow: next ? false : prefsRef.current.readingWindow });
  }

  function toggleReadingWindow() {
    const next = !prefsRef.current.readingWindow;
    commit({ ...prefsRef.current, readingWindow: next, readingGuide: next ? false : prefsRef.current.readingGuide });
  }

  function toggleProfile(profile: A11yProfile) {
    const current = prefsRef.current;
    commit(isProfileActive(current, profile) ? clearProfile(current, profile) : applyProfile(current, profile));
  }

  function resetAll() {
    commit(DEFAULT_A11Y_PREFS);
  }

  function changeLang(l: LangCode) {
    setLang(l);
    persistLang(l);
    setView("tools");
  }

  const jumpTo = useCallback((el: Element | null) => {
    if (!el) {
      window.scrollTo({ top: 0, behavior: resolveReduceMotion(prefsRef.current) ? "auto" : "smooth" });
      return;
    }
    el.scrollIntoView({ behavior: resolveReduceMotion(prefsRef.current) ? "auto" : "smooth", block: "start" });
    const h = el as HTMLElement;
    const hadTabIndex = h.hasAttribute("tabindex");
    if (!hadTabIndex) h.setAttribute("tabindex", "-1");
    h.focus({ preventScroll: true });
    if (!hadTabIndex) {
      h.addEventListener("blur", () => h.removeAttribute("tabindex"), { once: true });
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current
      ?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')[0]
      ?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      // Another overlay (Read Mode) may have already claimed this event
      // in the capture phase. Respect it or both layers close at once.
      if (e.defaultPrevented) return;

      if (e.key === "Escape") {
        if (confirmHideRef.current) {
          e.preventDefault();
          setConfirmHide(false);
          return;
        }
        if (viewRef.current === "language") {
          e.preventDefault();
          setView("tools");
          return;
        }
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "Tab") {
        // The drawer is non-modal (aria-modal="false"), so Tab flows out
        // into the page naturally instead of wrapping. The one true modal
        // moment is the hide-interface confirm: while it is open, focus
        // wraps so a keyboard user cannot tab behind an open confirm.
        if (!confirmHideRef.current) return;
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      // WCAG 2.1.4: single-key shortcuts must be focus-scoped, and the
      // statement promises exactly that. The drawer is non-modal, so the
      // user can legitimately focus page content while it stays open.
      if (!panelRef.current?.contains(document.activeElement)) return;

      // While the hide-interface confirm is open, only Escape (handled
      // above) and Tab (handled above) do anything. Every single-key
      // shortcut below is suppressed so a stray keypress can't quietly
      // change a setting behind the confirm.
      if (confirmHideRef.current) return;

      // Don't hijack single letters while the user is typing in the
      // Report Issue form fields or picking from the Useful Links select.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;

      if (e.shiftKey && (e.key === "R" || e.key === "r")) {
        e.preventDefault();
        resetAll();
        return;
      }
      switch (e.key) {
        case "=":
          e.preventDefault();
          cycleLargeText();
          break;
        case "f":
          e.preventDefault();
          cycleFont();
          break;
        case "c":
          e.preventDefault();
          cycleContrast();
          break;
        case "i":
          e.preventDefault();
          cycleSaturation();
          break;
        case "y":
          e.preventDefault();
          cycleHighlight();
          break;
        case "z":
          e.preventDefault();
          toggleBoolean("focusIndicator");
          break;
        case "m":
          e.preventDefault();
          cycleCursor();
          break;
        case "g":
          e.preventDefault();
          toggleReadingGuide();
          break;
        case "e":
          e.preventDefault();
          toggleReadingWindow();
          break;
        case "a":
          e.preventDefault();
          toggleBoolean("imageDescriptions");
          break;
        case "q":
          e.preventDefault();
          toggleReduceMotion();
          break;
        case "h":
          e.preventDefault();
          setView("report");
          break;
        case "n":
          e.preventDefault();
          setView("structure");
          break;
        case "b":
          e.preventDefault();
          window.location.assign(A11Y_LINKS.statement);
          break;
        case "[":
          e.preventDefault();
          bumpContentScale(-1);
          break;
        case "]":
          e.preventDefault();
          bumpContentScale(1);
          break;
        case "l":
          e.preventDefault();
          cycleLineHeight();
          break;
        case "k":
          e.preventDefault();
          cycleLetterSpacing();
          break;
        case "j":
          e.preventDefault();
          cycleTextAlign();
          break;
        case "x":
          e.preventDefault();
          toggleBoolean("textMagnifier");
          break;
        case "d":
          e.preventDefault();
          toggleReadMode();
          break;
        case "v":
          e.preventDefault();
          toggleBoolean("muteSounds");
          break;
        case "p":
          e.preventDefault();
          toggleBoolean("hideImages");
          break;
        case "w":
          e.preventDefault();
          toggleBoolean("highlightHover");
          break;
        case "u":
          e.preventDefault();
          usefulLinksRef.current?.focus();
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
    // Deliberately only depends on `open`: the handlers above all read
    // through prefsRef/confirmHideRef/viewRef (kept fresh every render)
    // instead of closing over `prefs`/`confirmHide`/`view` directly, so
    // the listener does not need to be torn down and re-attached on every
    // single toggle while the panel is open. No shortcut is assigned to
    // the three color palettes (eight-way choices where a cycle is worse
    // than Tab) or to Hide Interface (destructive enough to require an
    // explicit press plus this confirm, not a keystroke).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Reset to the tools tab, and clear any lingering confirm state, each
  // time the center is opened fresh.
  useEffect(() => {
    if (open) {
      setView("tools");
      setConfirmHide(false);
    }
  }, [open]);

  const dotIndex = <T extends string>(states: readonly T[], value: T) => states.indexOf(value);

  if (hidden) return null;

  const currentLangName = LANGUAGES.find((l) => l.code === lang)?.name ?? "English (US)";

  return (
    <>
      {/* Launcher: bottom-left blue circle with a hover/focus pill, per
          Daniel's AudioEye reference screenshots. data-a11y-launcher lets
          TextMagnifier.tsx recognize and skip this wrapper. */}
      <div className="group fixed bottom-5 left-5 z-[10050] flex items-center" data-a11y-launcher>
        <button
          ref={buttonRef}
          type="button"
          aria-label={t.launcher.ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-a11ybrand-700 text-white shadow-lg focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-a11ybrand-900"
        >
          <PersonIcon size={44} />
        </button>
        <span
          aria-hidden="true"
          className="pointer-events-none ml-3 hidden rounded-lg bg-a11yink-900 px-4 py-2.5 text-[16px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 sm:inline-block"
        >
          {t.launcher.pill}
        </span>
      </div>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Accessibility Center"
          dir={isRtlLang(lang) ? "rtl" : undefined}
          className="fixed inset-y-0 left-0 z-[10060] flex w-[360px] max-w-full flex-col bg-a11ysurface-alt text-a11yink-900 shadow-2xl"
        >
          {/* Header */}
          <div className={`flex flex-col gap-2 px-4 py-4 text-white ${ACCENT_GRADIENT}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/40">
                  <PersonIcon size={24} />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 text-[17px] leading-tight font-semibold">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-a11yaccent-600" />
                    {t.header.title}
                  </span>
                  <span className="block text-[12px] leading-tight text-white/70">{t.header.subtitle}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.header.close}
                className="flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-[14px] text-white/90 hover:bg-white/15"
              >
                ({t.common.esc})
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setView("language")}
              aria-haspopup="listbox"
              aria-label={`${t.language.choose}. ${t.language.current}: ${currentLangName}`}
              className="flex min-h-[36px] w-fit items-center gap-1.5 rounded-lg border border-white/25 px-3 text-[13px] font-medium text-white/90 hover:bg-white/10"
            >
              <span aria-hidden="true" className="text-a11yaccent-400">
                <GlobeIcon />
              </span>
              {currentLangName}
              <span aria-hidden="true" className="text-a11yaccent-400">
                <ChevronDownIcon />
              </span>
            </button>
          </div>

          {view === "structure" || view === "language" ? (
            <div className="flex items-center gap-2 border-b border-a11yline bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => setView("tools")}
                aria-label={view === "language" ? t.language.back : t.structure.back}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-a11ybrand-100"
              >
                <BackArrowIcon />
              </button>
              <span className="text-[17px] font-bold">{view === "language" ? t.language.pickerTitle : t.structure.title}</span>
            </div>
          ) : (
            /* Segmented tabs */
            <div className="px-4 pt-4" role="tablist" aria-label="Accessibility center sections">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-a11ybrand-100 p-1">
                {(
                  [
                    ["tools", t.tabs.tools],
                    ["report", t.tabs.report],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={view === key}
                    onClick={() => setView(key)}
                    className={`min-h-[38px] rounded-lg text-[14.5px] transition-colors ${
                      view === key ? `${ACCENT_GRADIENT} font-semibold text-white shadow` : "text-a11yink-700 hover:bg-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {confirmHide ? (
              <ConfirmHideInterface
                strings={t}
                onCancel={() => setConfirmHide(false)}
                onConfirm={() => {
                  hideInterface();
                  // No focus target survives the panel unmounting, move
                  // it to the document before that happens.
                  (document.activeElement as HTMLElement | null)?.blur();
                  setConfirmHide(false);
                  setHidden(true);
                }}
              />
            ) : view === "language" ? (
              <LanguagePicker lang={lang} strings={t} onSelect={changeLang} />
            ) : (
              <>
                {view === "tools" ? (
                  <div className="flex flex-col gap-4">
                    {/* Profiles card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-bold">{t.profiles.title}</h2>
                        <button
                          type="button"
                          onClick={resetAll}
                          className="text-[13.5px] font-medium text-a11ybrand-700 hover:text-a11ybrand-900 hover:underline"
                        >
                          {t.profiles.resetAll}
                        </button>
                      </div>
                      <p className="mt-1 text-[12.5px] leading-snug text-a11yink-500">{t.profiles.subtitle}</p>
                      <ul className="mt-3 flex flex-col">
                        {A11Y_PROFILES.map((profile) => {
                          const active = isProfileActive(prefs, profile);
                          const ps = profileStrings(t, profile.id);
                          return (
                            <li key={profile.id} className="border-t border-[#efeff6] py-2.5 first:border-t-0">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={active}
                                onClick={() => toggleProfile(profile)}
                                className="flex w-full items-center gap-3 text-left"
                              >
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    active ? `${ACCENT_GRADIENT} text-white ring-2 ring-a11yaccent-400/70` : "bg-a11ybrand-100 text-a11ybrand-700"
                                  }`}
                                >
                                  <ProfileIcon id={profile.id} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[14.5px] leading-tight font-semibold">{ps.name}</span>
                                  <span className="mt-0.5 block text-[12px] leading-snug text-a11yink-500">{ps.description}</span>
                                </span>
                                <SwitchVisual on={active} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>

                    {/* Quick actions card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setView("structure")}
                        className="flex min-h-[46px] w-full items-center justify-between rounded-xl border border-a11yline px-4 text-[14.5px] font-medium text-a11yink-700 hover:bg-a11ysurface-alt"
                      >
                        {t.quickActions.navigateStructure}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div className="mt-3 flex items-center justify-between">
                        <span id="a11y-show-shortcuts-label" className="text-[14.5px] font-medium">
                          {t.quickActions.showShortcuts}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={showShortcuts}
                          aria-labelledby="a11y-show-shortcuts-label"
                          onClick={() => setShowShortcuts((v) => !v)}
                        >
                          <SwitchVisual on={showShortcuts} />
                        </button>
                      </div>
                    </section>

                    {/* Content Adjustments card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <h2 className="text-[16px] font-bold">{t.content.title}</h2>
                      <div className="mt-3 flex flex-col gap-2">
                        <StepperRow
                          label={t.content.contentScaling}
                          keyHint="[ / ]"
                          showKey={showShortcuts}
                          valueLabel={`${prefs.contentScale}%`}
                          onDecrease={() => bumpContentScale(-1)}
                          onIncrease={() => bumpContentScale(1)}
                          atMin={prefs.contentScale === CONTENT_SCALE_STEPS[0]}
                          atMax={prefs.contentScale === CONTENT_SCALE_STEPS[CONTENT_SCALE_STEPS.length - 1]}
                          icon={<ScaleIcon />}
                          active={prefs.contentScale !== 100}
                          decreaseWord={t.common.decrease}
                          increaseWord={t.common.increase}
                        />
                        <StepperRow
                          label={t.content.lineHeight}
                          keyHint="l"
                          showKey={showShortcuts}
                          valueLabel={LINE_HEIGHT_LABELS[prefs.lineHeight]}
                          onDecrease={decreaseLineHeight}
                          onIncrease={cycleLineHeight}
                          atMin={prefs.lineHeight === 0}
                          atMax={prefs.lineHeight === 3}
                          icon={<LineHeightIcon />}
                          active={prefs.lineHeight !== 0}
                          decreaseWord={t.common.decrease}
                          increaseWord={t.common.increase}
                        />
                        <StepperRow
                          label={t.content.letterSpacing}
                          keyHint="k"
                          showKey={showShortcuts}
                          valueLabel={LETTER_SPACING_LABELS[prefs.letterSpacing]}
                          onDecrease={decreaseLetterSpacing}
                          onIncrease={cycleLetterSpacing}
                          atMin={prefs.letterSpacing === 0}
                          atMax={prefs.letterSpacing === 3}
                          icon={<LetterSpacingIcon />}
                          active={prefs.letterSpacing !== 0}
                          decreaseWord={t.common.decrease}
                          increaseWord={t.common.increase}
                        />
                        <div role="group" aria-label={t.content.textAlignGroup} className="rounded-xl border border-a11yline bg-white px-3 py-2">
                          <div aria-hidden="true" className="mb-2 flex items-center gap-1.5 text-[13.5px] font-medium text-a11yink-700">
                            <AlignIcon />
                            {t.content.textAlignGroup}
                            {showShortcuts ? " (j)" : ""}
                          </div>
                          <AlignRow value={prefs.textAlign} onSelect={setTextAlign} strings={t} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Tile
                            label={t.content.textSize}
                            keyHint="="
                            showKey={showShortcuts}
                            active={prefs.largeText !== "off"}
                            onClick={cycleLargeText}
                            icon={<TextSizeIcon />}
                            dots={3}
                            dotIndex={dotIndex(["off", "large", "larger"] as const, prefs.largeText)}
                            stateLabel={t.content.states.largeText[prefs.largeText]}
                            activateNext={t.common.activateNext}
                          />
                          <Tile
                            label={t.content.font}
                            keyHint="f"
                            showKey={showShortcuts}
                            active={prefs.font !== "default"}
                            onClick={cycleFont}
                            icon={<FontIcon />}
                            dots={3}
                            dotIndex={dotIndex(["default", "serif", "readable"] as const, prefs.font)}
                            stateLabel={t.content.states.font[prefs.font]}
                            activateNext={t.common.activateNext}
                          />
                          <Tile
                            label={t.content.highlight}
                            keyHint="y"
                            showKey={showShortcuts}
                            active={prefs.highlight !== "off"}
                            onClick={cycleHighlight}
                            icon={<LinkIcon />}
                            dots={4}
                            dotIndex={dotIndex(["off", "links", "headings", "all"] as const, prefs.highlight)}
                            stateLabel={t.content.states.highlight[prefs.highlight]}
                            activateNext={t.common.activateNext}
                          />
                          <Tile
                            label={t.content.magnifier}
                            keyHint="x"
                            showKey={showShortcuts}
                            active={prefs.textMagnifier}
                            onClick={() => toggleBoolean("textMagnifier")}
                            icon={<MagnifierIcon />}
                            activateNext={t.common.activateNext}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Color Adjustments card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <h2 className="text-[16px] font-bold">{t.color.title}</h2>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Tile
                          label={t.color.contrast}
                          keyHint="c"
                          showKey={showShortcuts}
                          active={prefs.contrast !== "off"}
                          onClick={cycleContrast}
                          icon={<ContrastIcon />}
                          dots={5}
                          dotIndex={dotIndex(["off", "high", "inverted", "dark", "light"] as const, prefs.contrast)}
                          stateLabel={t.color.states.contrast[prefs.contrast]}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.color.saturation}
                          keyHint="i"
                          showKey={showShortcuts}
                          active={prefs.saturation !== "off"}
                          onClick={cycleSaturation}
                          icon={<SaturationIcon />}
                          dots={4}
                          dotIndex={dotIndex(["off", "high", "low", "monochrome"] as const, prefs.saturation)}
                          stateLabel={t.color.states.saturation[prefs.saturation]}
                          activateNext={t.common.activateNext}
                        />
                      </div>
                      <SwatchRow title={t.color.textColors} value={prefs.textColor} onSelect={(hex) => setColorOverride("textColor", hex)} strings={t} />
                      <SwatchRow title={t.color.titleColors} value={prefs.titleColor} onSelect={(hex) => setColorOverride("titleColor", hex)} strings={t} />
                      <SwatchRow
                        title={t.color.backgroundColors}
                        value={prefs.backgroundColor}
                        onSelect={(hex) => setColorOverride("backgroundColor", hex)}
                        strings={t}
                      />
                    </section>

                    {/* Orientation Adjustments card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <h2 className="text-[16px] font-bold">{t.orientation.title}</h2>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Tile
                          label={t.orientation.muteSounds}
                          keyHint="v"
                          showKey={showShortcuts}
                          active={prefs.muteSounds}
                          onClick={() => toggleBoolean("muteSounds")}
                          icon={<MuteIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.hideImages}
                          keyHint="p"
                          showKey={showShortcuts}
                          active={prefs.hideImages}
                          onClick={() => toggleBoolean("hideImages")}
                          icon={<HideImageIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.readMode}
                          keyHint="d"
                          showKey={showShortcuts}
                          active={prefs.readMode}
                          onClick={toggleReadMode}
                          icon={<ReadModeIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.guide}
                          keyHint="g"
                          showKey={showShortcuts}
                          active={prefs.readingGuide}
                          onClick={toggleReadingGuide}
                          icon={<GuideIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.window}
                          keyHint="e"
                          showKey={showShortcuts}
                          active={prefs.readingWindow}
                          onClick={toggleReadingWindow}
                          icon={<WindowIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.animation}
                          keyHint="q"
                          showKey={showShortcuts}
                          active={resolveReduceMotion(prefs)}
                          onClick={toggleReduceMotion}
                          icon={<AnimationIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.hover}
                          keyHint="w"
                          showKey={showShortcuts}
                          active={prefs.highlightHover}
                          onClick={() => toggleBoolean("highlightHover")}
                          icon={<HoverIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.focus}
                          keyHint="z"
                          showKey={showShortcuts}
                          active={prefs.focusIndicator}
                          onClick={() => toggleBoolean("focusIndicator")}
                          icon={<FocusIcon />}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.cursor}
                          keyHint="m"
                          showKey={showShortcuts}
                          active={prefs.cursor !== "off"}
                          onClick={cycleCursor}
                          icon={<CursorIcon />}
                          dots={3}
                          dotIndex={dotIndex(["off", "black", "white"] as const, prefs.cursor)}
                          stateLabel={t.orientation.states.cursor[prefs.cursor]}
                          activateNext={t.common.activateNext}
                        />
                        <Tile
                          label={t.orientation.altText}
                          keyHint="a"
                          showKey={showShortcuts}
                          active={prefs.imageDescriptions}
                          onClick={() => toggleBoolean("imageDescriptions")}
                          icon={<ImagesIcon />}
                          activateNext={t.common.activateNext}
                        />
                      </div>
                      <div className="mt-3">
                        <label htmlFor="a11y-useful-links" className="block text-[14px] font-medium">
                          {t.orientation.usefulLinks}
                          {showShortcuts ? " (u)" : ""}
                        </label>
                        <select
                          id="a11y-useful-links"
                          ref={usefulLinksRef}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) window.location.assign(e.target.value);
                          }}
                          className="mt-1.5 min-h-[44px] w-full rounded-xl border border-a11yline bg-white px-3 text-[14px]"
                        >
                          <option value="" disabled>
                            {t.orientation.selectAPage}
                          </option>
                          {USEFUL_LINKS.map((link) => (
                            <option key={link.href} value={link.href}>
                              {t.orientation.links[link.key]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfirmHide(true)}
                        className="mt-3 flex min-h-[46px] w-full items-center justify-center rounded-xl border border-[#d8d8ea] text-[14.5px] font-medium text-a11yink-700 hover:bg-a11ysurface-alt"
                      >
                        {t.orientation.hideInterface}
                      </button>
                    </section>

                    {/* Shortcut reference card */}
                    <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                      <h3 className="text-[15px] font-bold">Additional keyboard shortcuts</h3>
                      <p className="sr-only">Shortcuts are active while this panel is open.</p>
                      <ul className="mt-3 flex flex-col gap-4">
                        {[
                          { keys: ["⇧", "r"], title: t.shortcuts.reset.title, caption: t.shortcuts.reset.caption },
                          { keys: ["h"], title: t.shortcuts.report.title, caption: t.shortcuts.report.caption },
                          { keys: ["n"], title: t.shortcuts.structure.title, caption: t.shortcuts.structure.caption },
                          { keys: ["esc"], title: t.shortcuts.close.title, caption: t.shortcuts.close.caption },
                          { keys: ["b"], title: t.shortcuts.statement.title, caption: t.shortcuts.statement.caption },
                          { keys: ["[", "]"], title: t.shortcuts.contentScaling.title, caption: t.shortcuts.contentScaling.caption },
                          { keys: ["u"], title: t.shortcuts.usefulLinks.title, caption: t.shortcuts.usefulLinks.caption },
                        ].map((row) => (
                          <li key={row.title} className="grid grid-cols-[84px_1fr] items-start gap-3">
                            <span className="flex justify-end gap-1.5">
                              {row.keys.map((k) => (
                                <kbd
                                  key={k}
                                  className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-a11yline bg-a11ysurface-alt px-1.5 text-[13px]"
                                >
                                  {k}
                                </kbd>
                              ))}
                            </span>
                            <span>
                              <span className="block text-[14px] leading-snug font-semibold">{row.title}</span>
                              <span className="block text-[12.5px] text-a11yink-500">{row.caption}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                ) : null}

                {view === "report" ? (
                  <section className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm">
                    <h2 className="text-[17px] font-bold">{t.report.title}</h2>
                    <p className="mt-1.5 text-[14px] text-a11yink-500">{t.report.subtitle}</p>
                    <div className="mt-4">
                      <AccessibilityReportForm />
                    </div>
                  </section>
                ) : null}

                {view === "structure" ? <PageStructure panelRef={panelRef} onJump={jumpTo} strings={t} /> : null}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-a11yline bg-white px-4 py-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${ACCENT_GRADIENT}`}>
              <PersonIcon size={22} />
            </span>
            <Link href={A11Y_LINKS.statement} className="text-[14.5px] font-semibold underline hover:text-a11ybrand-900">
              {t.footer.statement}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

// Purely visual switch body; the interactive element (role="switch") is
// the wrapping button so hit targets stay large.
function SwitchVisual({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${on ? ACCENT_GRADIENT : "bg-a11yline"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </span>
  );
}

function Tile({
  label,
  keyHint,
  showKey,
  active,
  onClick,
  icon,
  dots,
  dotIndex,
  stateLabel,
  activateNext,
}: {
  label: string;
  keyHint: string;
  showKey: boolean;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  dots?: number;
  dotIndex?: number;
  stateLabel?: string;
  activateNext: string;
}) {
  const cycling = typeof dots === "number";
  return (
    <button
      type="button"
      onClick={onClick}
      // aria-pressed models the boolean tiles; cycling tiles instead speak
      // their current state in the accessible name (aria-pressed is
      // boolean-only and would misreport a 3/4/5-state control).
      aria-pressed={cycling ? undefined : active}
      aria-label={cycling ? `${label}: ${stateLabel}. ${activateNext}` : label}
      className={`flex min-h-[92px] flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-3 transition-all ${
        active
          ? "border-a11ybrand-700 bg-a11ybrand-100 shadow-sm ring-1 ring-a11yaccent-600/50"
          : "border-a11yline bg-white hover:-translate-y-px hover:border-a11ybrand-300 hover:shadow-sm"
      }`}
    >
      <span aria-hidden="true" className={active ? "text-a11ybrand-700" : "text-a11yink-700"}>
        {icon}
      </span>
      <span aria-hidden="true" className="text-center text-[12.5px] leading-tight font-medium">
        {label}
        {showKey ? ` (${keyHint})` : ""}
      </span>
      {cycling ? (
        <span aria-hidden="true" className="flex gap-1">
          {Array.from({ length: dots }, (_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === dotIndex ? "bg-a11ybrand-700" : "bg-a11yline"}`} />
          ))}
        </span>
      ) : null}
    </button>
  );
}

// Full-width row: a minus button, the label and current value, and a plus
// button. The value carries aria-live="polite" so a change is announced
// without moving focus. Simplified from the spec's literal English group
// aria-label ("<label>, current setting <value>") to "<label>: <value>"
// so this component works the same way in every interface language
// without hardcoding an English phrase inside a translated panel.
function StepperRow({
  label,
  keyHint,
  showKey,
  valueLabel,
  onDecrease,
  onIncrease,
  atMin,
  atMax,
  icon,
  active,
  decreaseWord,
  increaseWord,
}: {
  label: string;
  keyHint: string;
  showKey: boolean;
  valueLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
  atMin: boolean;
  atMax: boolean;
  icon: React.ReactNode;
  active: boolean;
  decreaseWord: string;
  increaseWord: string;
}) {
  return (
    <div
      role="group"
      aria-label={`${label}: ${valueLabel}`}
      className={`flex min-h-[52px] items-center justify-between gap-2 rounded-xl border px-2.5 py-2 ${
        active ? "border-a11ybrand-700 bg-a11ybrand-100" : "border-a11yline bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={atMin}
        aria-label={`${decreaseWord} ${label.toLowerCase()}`}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-a11yline bg-white ${
          atMin ? "cursor-default opacity-40" : "hover:bg-a11ysurface-alt"
        }`}
      >
        <MinusIcon />
      </button>
      <span className="flex min-w-0 flex-1 flex-col items-center text-center">
        <span aria-hidden="true" className="flex items-center gap-1.5 text-[13px] font-medium text-a11yink-700">
          {icon}
          <span className="truncate">
            {label}
            {showKey ? ` (${keyHint})` : ""}
          </span>
        </span>
        <span aria-live="polite" className="text-[12.5px] font-semibold text-a11ybrand-700">
          {valueLabel}
        </span>
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        aria-label={`${increaseWord} ${label.toLowerCase()}`}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-a11yline bg-white ${
          atMax ? "cursor-default opacity-40" : "hover:bg-a11ysurface-alt"
        }`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

// Three segmented buttons. Mutual exclusion is inherent (only one value
// is stored), pressing the already-active option calls onSelect("off")
// so the tri-state stays escapable.
function AlignRow({
  value,
  onSelect,
  strings,
}: {
  value: TextAlignState;
  onSelect: (v: TextAlignState) => void;
  strings: A11yStrings;
}) {
  const options: { value: Exclude<TextAlignState, "off">; label: string; ariaLabel: string }[] = [
    { value: "left", label: strings.content.left, ariaLabel: strings.content.alignLeft },
    { value: "center", label: strings.content.center, ariaLabel: strings.content.alignCenter },
    { value: "right", label: strings.content.right, ariaLabel: strings.content.alignRight },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const pressed = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={pressed}
            aria-label={opt.ariaLabel}
            onClick={() => onSelect(pressed ? "off" : opt.value)}
            className={`flex min-h-[44px] items-center justify-center rounded-xl border text-[13.5px] font-medium ${
              pressed ? "border-a11ybrand-700 bg-a11ybrand-100 text-a11ybrand-700 ring-1 ring-a11yaccent-600/50" : "border-a11yline bg-white text-a11yink-700 hover:border-a11ybrand-300"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Eight preset swatches plus a Cancel button that clears the override.
// 32px-tall swatch buttons clear the WCAG 2.5.8 24px minimum, and the row
// fits an 8-column grid at a 320px viewport.
function SwatchRow({
  title,
  value,
  onSelect,
  strings,
}: {
  title: string;
  value: string | null;
  onSelect: (hex: string | null) => void;
  strings: A11yStrings;
}) {
  return (
    <div className="mt-3">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <div className="mt-2 grid grid-cols-8 gap-1.5">
        {A11Y_SWATCHES.map((swatch) => {
          const selected = value === swatch.hex;
          return (
            <button
              key={swatch.hex}
              type="button"
              aria-pressed={selected}
              aria-label={`${title}: ${swatchLabel(strings, swatch.name)}`}
              onClick={() => onSelect(swatch.hex)}
              style={{ backgroundColor: swatch.hex }}
              className={`h-8 w-full rounded-md border border-a11yline ${selected ? "ring-2 ring-a11ybrand-700" : ""}`}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-label={`${title}: ${strings.color.cancel}`}
        className="mt-2 min-h-[36px] w-full rounded-lg border border-a11yline text-[13px] font-medium text-a11yink-700 hover:bg-a11ysurface-alt"
      >
        {strings.color.cancel}
      </button>
    </div>
  );
}

// Rendered inside the panel body in place of the tools content while
// confirmHide is true, not as a nested modal: it shares the panel's
// existing focus trap instead of needing its own.
function ConfirmHideInterface({
  strings,
  onCancel,
  onConfirm,
}: {
  strings: A11yStrings;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      role="alertdialog"
      aria-labelledby="a11y-confirm-hide-title"
      aria-describedby="a11y-confirm-hide-body"
      className="rounded-2xl border border-a11yline bg-white p-4 shadow-sm"
    >
      <h2 id="a11y-confirm-hide-title" className="text-[17px] font-bold">
        {strings.confirmHide.title}
      </h2>
      <p id="a11y-confirm-hide-body" className="mt-2 text-[14px] leading-snug text-a11yink-700">
        {strings.confirmHide.body}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-a11yline text-[14px] font-medium text-a11yink-700 hover:bg-a11ysurface-alt"
        >
          {strings.confirmHide.cancel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-a11ydanger bg-a11ydanger text-[14px] font-semibold text-white hover:opacity-90"
        >
          {strings.confirmHide.confirm}
        </button>
      </div>
    </div>
  );
}

// Simple accessible listbox, not a modal: shown in the panel body with a
// back bar above it (rendered by the parent), same pattern as the page
// structure view.
function LanguagePicker({
  lang,
  strings,
  onSelect,
}: {
  lang: LangCode;
  strings: A11yStrings;
  onSelect: (l: LangCode) => void;
}) {
  return (
    <ul role="listbox" aria-label={strings.language.pickerTitle} className="flex flex-col gap-1">
      {LANGUAGES.map((l) => {
        const selected = l.code === lang;
        return (
          <li key={l.code}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(l.code)}
              dir={l.rtl ? "rtl" : undefined}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 text-[15px] ${
                selected ? `${ACCENT_GRADIENT} font-semibold text-white` : "text-a11yink-700 hover:bg-a11ybrand-100"
              }`}
            >
              {l.name}
              {selected ? <CheckIcon /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Landmarks, headings, and links scanned from the page. Sections start
// collapsed so the user picks how to navigate (Daniel's AudioEye
// reference). Scanned on mount of this view (the page content behind the
// drawer is static per route). Heading/link labels are excerpts of the
// page's own (English) content, so only the section titles and the
// top-of-page placeholder come from the interface-language strings.
function PageStructure({
  panelRef,
  onJump,
  strings,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  onJump: (el: Element | null) => void;
  strings: A11yStrings;
}) {
  const [landmarks, setLandmarks] = useState<StructureTarget[]>([]);
  const [headings, setHeadings] = useState<StructureTarget[]>([]);
  const [links, setLinks] = useState<StructureTarget[]>([]);
  const [landmarksOpen, setLandmarksOpen] = useState(false);
  const [headingsOpen, setHeadingsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const lm: StructureTarget[] = [{ label: strings.structure.topOfPage, el: null }];
    const banner = document.querySelector("header");
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");
    const contentinfo = document.querySelector("footer");
    if (banner) lm.push({ label: "Banner", el: banner });
    if (nav) lm.push({ label: "Navigation", el: nav });
    if (main) lm.push({ label: "Main", el: main });
    if (contentinfo) lm.push({ label: "Contentinfo", el: contentinfo });
    setLandmarks(lm);

    const hs = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter((h) => !panel?.contains(h))
      .map((h) => ({
        label: `${h.tagName}: ${(h.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28)}${
          (h.textContent || "").trim().length > 28 ? "…" : ""
        }`,
        el: h,
      }));
    setHeadings(hs);

    const ls = [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
      .filter((a) => !panel?.contains(a))
      .map((a) => {
        const text = (a.textContent || "").replace(/\s+/g, " ").trim() || a.getAttribute("aria-label") || "";
        return { label: text.slice(0, 28) + (text.length > 28 ? "…" : ""), el: a as Element };
      })
      .filter((l) => l.label);
    setLinks(ls);
    // strings.structure.topOfPage only affects the first landmark's
    // label, re-scanning the DOM on every language change is cheap and
    // keeps that label in sync without a second effect.
  }, [panelRef, strings.structure.topOfPage]);

  return (
    <div className="flex flex-col gap-3">
      <StructureSection
        title={strings.structure.landmarks}
        icon={<LandmarksIcon />}
        open={landmarksOpen}
        onToggle={() => setLandmarksOpen((v) => !v)}
        items={landmarks}
        onJump={onJump}
      />
      <StructureSection
        title={strings.structure.headings}
        icon={<span className="text-[14px] font-bold text-a11ybrand-700">h1</span>}
        open={headingsOpen}
        onToggle={() => setHeadingsOpen((v) => !v)}
        items={headings}
        onJump={onJump}
      />
      <StructureSection
        title={strings.structure.links}
        icon={<LinkIcon />}
        open={linksOpen}
        onToggle={() => setLinksOpen((v) => !v)}
        items={links}
        onJump={onJump}
      />
    </div>
  );
}

function StructureSection({
  title,
  icon,
  open,
  onToggle,
  items,
  onJump,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  items: StructureTarget[];
  onJump: (el: Element | null) => void;
}) {
  return (
    <section className="rounded-2xl border border-a11yline bg-white px-4 py-1 shadow-sm">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-h-[48px] w-full items-center justify-between">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex w-8 justify-center text-a11ybrand-700">
            {icon}
          </span>
          <span className="text-[15.5px] font-bold">{title}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={open ? "" : "rotate-180"}>
          <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <ul className="flex flex-col pb-2">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`}>
              <button
                type="button"
                onClick={() => onJump(item.el)}
                className="flex min-h-[42px] w-full items-center rounded-lg pl-11 text-left text-[14.5px] hover:bg-a11ysurface-alt"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/* Icons */

function PersonIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="7.2" r="1.7" fill="currentColor" />
      <path
        d="M6.3 9.9c1.8.85 3.7 1.25 5.7 1.25s3.9-.4 5.7-1.25M12 11.15v2.9M9.6 17.9l1.4-3.85h2L14.4 17.9M9.9 14.6l-1 1.55M14.1 14.6l1 1.55"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon({ id }: { id: string }) {
  switch (id) {
    case "epilepsy":
      return <AnimationIcon />;
    case "vision":
      return <EyeIcon />;
    case "older":
      return <TextSizeIcon />;
    case "cognitive":
      return <BrainIcon />;
    case "adhd":
      return <SpotlightIcon />;
    case "blind":
      return <PersonIcon size={20} />;
    case "motor":
      return <KeyboardIcon />;
    default:
      return <PersonIcon size={20} />;
  }
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 4a3 3 0 0 0-3 3c-1.7.3-3 1.8-3 3.5 0 1 .4 1.9 1.1 2.6A3.4 3.4 0 0 0 7 19.4c.8 0 1.6-.3 2.2-.8.1 1.3 1.1 2.4 2.3 2.4V4a2 2 0 0 0-2-2v2zM14.5 4a3 3 0 0 1 3 3c1.7.3 3 1.8 3 3.5 0 1-.4 1.9-1.1 2.6a3.4 3.4 0 0 1-2.4 6.3c-.8 0-1.6-.3-2.2-.8-.1 1.3-1.1 2.4-2.3 2.4V4a2 2 0 0 1 2-2v2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpotlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="7" width="19" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 10.2h1.4M9 10.2h1.4M12.5 10.2h1.4M16 10.2h2.4M5.5 13h1.4M9 13h6M16.6 13h1.8M5.5 15.2h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4l12 7.5-5.2 1.3L15 19l-2.6 1-2.2-6.2L6 17V4z" fill="currentColor" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.24 4.24 0 0 0-6-6l-1.5 1.5M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.24 4.24 0 0 0 6 6L12.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContrastIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor" />
    </svg>
  );
}

function SaturationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3c3.5 4 6 7.2 6 10.2A6 6 0 0 1 6 13.2C6 10.2 8.5 7 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function AnimationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h4l2-6 4 12 2-6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TextSizeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10h6M6 10v8M10 6h11M15.5 6v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 15v5h5M20 9V4h-5M4 20l6-6M20 4l-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LineHeightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h11M4 12h11M4 18h11M18 4v16M15.5 6.5 18 4l2.5 2.5M15.5 17.5 18 20l2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LetterSpacingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 18 8 6h1l4 12M5.5 14h6M15 10v8M20 10v8M15 14h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlignIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FontIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6h14M12 6v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="4.5" rx="2.25" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="9.5" width="16" height="5" fill="currentColor" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3.5L12 17.5v-11L7.5 10H4z" fill="currentColor" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function HideImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.4" fill="currentColor" />
      <path d="M5 17l4.5-4.5 3 3L16 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReadModeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6c-2.2-1.3-5-1.5-7-.7v12.4c2-.8 4.8-.6 7 .7 2.2-1.3 5-1.5 7-.7V5.3c-2-.8-4.8-.6-7 .7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HoverIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M10 10l7 3-3 1.2L12.5 17z" fill="currentColor" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ImagesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.4" fill="currentColor" />
      <path d="M5 17l4.5-4.5 3 3L16 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LandmarksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="16" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="16" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4M12 12H5.5v4M12 12v4M12 12h6.5v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9S9.5 5.5 12 3z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
