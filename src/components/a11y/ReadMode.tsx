"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setPref } from "@/lib/a11y";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

type Block = { tag: "h1" | "h2" | "h3" | "h4" | "p" | "li" | "blockquote"; text: string };

const BLOCK_SELECTOR = "h1, h2, h3, h4, p, li, blockquote";

// Clean reading overlay built from the current route's <main>. Rebuilds on
// mount, on client-side route changes (usePathname), and once more after
// a short delay so a route that paints content asynchronously still gets
// picked up. Not translated by the interface language picker: it renders
// over the page's own (English) content, not inside the Accessibility
// Center panel. See .pipeline/changes.md.
export function ReadMode() {
  const prefs = useA11yPrefs();
  const active = prefs.readMode;
  const pathname = usePathname();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active) return;

    function build() {
      const main = document.querySelector("main");
      if (!main) {
        setBlocks([]);
        return;
      }
      const next: Block[] = [];
      let lastText = "";
      main.querySelectorAll<HTMLElement>(BLOCK_SELECTOR).forEach((el) => {
        const text = (el.innerText || "").replace(/\s+/g, " ").trim();
        if (!text || text === lastText) return;
        lastText = text;
        next.push({ tag: el.tagName.toLowerCase() as Block["tag"], text });
      });
      setBlocks(next);
    }

    build();
    const timeout = window.setTimeout(build, 150);
    return () => window.clearTimeout(timeout);
  }, [active, pathname]);

  function close() {
    setPref("readMode", false);
  }

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
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
    }

    // Capture phase: runs before the widget's bubble-phase listener, so
    // Escape closes only this topmost overlay and the panel survives.
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      // The launcher is absent when the interface was hidden while Read
      // Mode was open; fall back to the main landmark so focus never
      // silently drops to <body>.
      const launcher = document.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
      if (launcher) launcher.focus();
      else {
        // Sites name their skip target differently (#main-content, #main),
        // so fall back to the main landmark itself rather than assuming an
        // id. tabIndex is set so the element can take focus even when the
        // host page did not mark it focusable.
        const main =
          document.querySelector<HTMLElement>("#main-content") ?? document.querySelector<HTMLElement>("main");
        if (main) {
          if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
          main.focus();
        }
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Read mode"
      className="fixed inset-0 z-[10070] overflow-y-auto bg-white"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e4e4f1] bg-white px-5 py-3">
        <span className="text-[16px] font-bold">Read mode</span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          className="flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[14px] font-medium hover:bg-[#f4f4fb]"
        >
          Close
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <article
        className="mx-auto max-w-[70ch] px-5 py-8 text-[19px] leading-[1.8]"
        style={{ fontFamily: "var(--font-readable), sans-serif" }}
      >
        {blocks.length === 0 ? (
          <p>No readable text was found on this page.</p>
        ) : (
          blocks.map((block, i) => {
            if (block.tag === "li") {
              const prev = blocks[i - 1];
              const isListStart = !prev || prev.tag !== "li";
              if (!isListStart) return null; // already rendered as part of the group below
              const items: Block[] = [block];
              let j = i + 1;
              while (blocks[j]?.tag === "li") {
                items.push(blocks[j]);
                j += 1;
              }
              return (
                <ul key={i} className="mb-6 list-disc pl-6">
                  {items.map((item, k) => (
                    <li key={k} className="mb-2">
                      {item.text}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.tag === "h1" || block.tag === "h2" || block.tag === "h3" || block.tag === "h4") {
              const Heading = block.tag;
              return (
                <Heading key={i} className="mt-8 mb-3 font-bold first:mt-0">
                  {block.text}
                </Heading>
              );
            }
            return (
              <p key={i} className="mb-5">
                {block.text}
              </p>
            );
          })
        )}
      </article>
    </div>
  );
}
