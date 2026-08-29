"use client";

import { useEffect, useState } from "react";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

const BAND_HALF_HEIGHT = 60; // reading window band is ~120px tall total

// Reading guide (a thin bar) and reading window (a dimmed mask with a
// band cut out) are mutually exclusive, both track the cursor's vertical
// position, and both are pointer-events:none so they never block clicks.
// Position is set directly from the mousemove event with no transition/
// animation, so there is nothing for the reduce-motion mode to need to
// suppress here, the "respect reduce-motion" requirement is satisfied by
// there being no motion beyond the 1:1 cursor tracking itself.
//
// Reads its own enabled state via useA11yPrefs so it can be mounted once
// in the root layout with no props, and stays in sync with the widget
// (same localStorage + event channel).
export function ReadingOverlays() {
  const prefs = useA11yPrefs();
  const guide = prefs.readingGuide;
  const readingWindow = prefs.readingWindow;
  const [y, setY] = useState<number | null>(null);
  const active = guide || readingWindow;

  useEffect(() => {
    if (!active) {
      setY(null);
      return;
    }

    function handleMove(e: MouseEvent) {
      setY(e.clientY);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [active]);

  if (!active || y === null) return null;

  if (guide) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 z-[10040] w-full"
        style={{ top: y - 4, height: 8, backgroundColor: "rgba(255, 209, 0, 0.4)" }}
      />
    );
  }

  const topMaskHeight = Math.max(0, y - BAND_HALF_HEIGHT);
  const bottomMaskTop = y + BAND_HALF_HEIGHT;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[10040] bg-black/70"
        style={{ height: topMaskHeight }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[10040] bg-black/70"
        style={{ top: bottomMaskTop }}
      />
    </>
  );
}
