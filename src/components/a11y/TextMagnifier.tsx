"use client";

import { useEffect, useRef, useState } from "react";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

const MAX_CHARS = 220;

// Floating enlarged copy of whatever text is under the pointer. Position
// is set directly from the pointermove event with no transition, so
// there is nothing here for reduce-motion to need to suppress, same
// reasoning as ReadingOverlays.tsx.
export function TextMagnifier() {
  const prefs = useA11yPrefs();
  const active = prefs.textMagnifier;
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setTooltip(null);
      return;
    }

    function handleMove(e: PointerEvent) {
      if (frameRef.current !== null) return;
      const { clientX, clientY } = e;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const el = document.elementFromPoint(clientX, clientY);
        if (!el || el.closest('[aria-label="Accessibility Center"]') || el.closest('[data-a11y-launcher]') || el.closest("[data-a11y-magnifier]")) {
          setTooltip(null);
          return;
        }

        let node: Element | null = el;
        while (node && !(node.textContent || "").trim()) {
          node = node.parentElement;
        }
        if (!node) {
          setTooltip(null);
          return;
        }

        const raw = (node as HTMLElement).innerText ?? node.textContent ?? "";
        const collapsed = raw.replace(/\s+/g, " ").trim();
        if (!collapsed) {
          setTooltip(null);
          return;
        }

        const text = collapsed.length > MAX_CHARS ? `${collapsed.slice(0, MAX_CHARS)}…` : collapsed;
        setTooltip({ text, x: clientX, y: clientY });
      });
    }

    // pointermove also fires for touch drags, so on mobile this degrades
    // to "drag a finger to magnify" instead of breaking. Not gated on
    // (pointer: fine) on purpose.
    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [active]);

  if (!active || !tooltip) return null;

  const flipLeft = tooltip.x + 340 > window.innerWidth;
  const flipUp = tooltip.y + 160 > window.innerHeight;

  const style: React.CSSProperties = {
    top: flipUp ? undefined : tooltip.y + 24,
    bottom: flipUp ? window.innerHeight - tooltip.y + 16 : undefined,
    left: flipLeft ? undefined : tooltip.x + 18,
    right: flipLeft ? window.innerWidth - tooltip.x + 18 : undefined,
  };

  return (
    <div
      data-a11y-magnifier
      aria-hidden="true"
      className="pointer-events-none fixed z-[10080] max-w-[320px] rounded-lg bg-[#1f1f2e] px-3 py-2 text-[26px] leading-snug text-white shadow-lg"
      style={style}
    >
      {tooltip.text}
    </div>
  );
}
