"use client";

import { useEffect, useState } from "react";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

type Panel = { id: string; text: string; top: number; left: number; width: number; height: number };

// Hide Images (html.a11y-hide-images in globals.css) visually hides every
// image with visibility:hidden, which keeps the box in the layout instead
// of collapsing it. This renders a bordered panel that occupies that same
// box, with the image's alt text as real (not aria-hidden) DOM text, so
// the description stays discoverable to a screen reader when the image
// itself is visually hidden. Measuring approach copied from
// ImageDescriptions.tsx.
export function HiddenImageAltText() {
  const prefs = useA11yPrefs();
  const enabled = prefs.hideImages;
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    if (!enabled) {
      setPanels([]);
      return;
    }

    function collect() {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("#a11y-page-content img"));
      const next: Panel[] = [];
      imgs.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const alt = img.getAttribute("alt");
        next.push({
          id: `${i}-${img.src}`,
          text: alt ? `Image: ${alt}` : "Image",
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      });
      // Equality guard: the 1s interval would otherwise re-render this
      // component every tick even when nothing moved.
      setPanels((prev) => {
        if (prev.length === next.length && prev.every((p, i) => p.id === next[i].id && p.top === next[i].top && p.left === next[i].left && p.width === next[i].width && p.height === next[i].height)) {
          return prev;
        }
        return next;
      });
    }

    collect();
    // No scroll listener: panels use document coordinates, which are
    // scroll-invariant. Resize and the slow interval cover layout shifts.
    window.addEventListener("resize", collect);
    const interval = window.setInterval(collect, 1000);

    return () => {
      window.removeEventListener("resize", collect);
      window.clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {panels.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none absolute z-20 flex items-center justify-center border border-dashed border-[#9a9ab0] bg-[#f5f5f8] px-2 text-center text-xs text-[#424242]"
          style={{ top: p.top, left: p.left, width: p.width, height: p.height }}
        >
          {p.text}
        </div>
      ))}
    </>
  );
}
