"use client";

import { useEffect, useState } from "react";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

type Caption = { id: string; text: string; top: number; left: number; width: number };

// AudioEye's "Image descriptions" tool overlays each image's alt text as a
// visible caption. Pure CSS cannot read an alt attribute's value into
// visible content reliably across browsers (no CSS content:attr() support
// for this in a way that works with real layout), so this decorates
// images with positioned caption chips when the toggle is on, and cleans
// up (returns null, clearing state) when it is off. Reads its own enabled
// state via useA11yPrefs so it can be mounted once in the root layout.
export function ImageDescriptions() {
  const prefs = useA11yPrefs();
  // hideImages replaces each image's box with an alt-text panel of its own
  // (HiddenImageAltText.tsx). Skip this overlay too when that mode is on,
  // so the two don't double up captions on the same hidden image.
  const enabled = prefs.imageDescriptions && !prefs.hideImages;
  const [captions, setCaptions] = useState<Caption[]>([]);

  useEffect(() => {
    if (!enabled) {
      setCaptions([]);
      return;
    }

    function collect() {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("#a11y-page-content img[alt]"));
      const next: Caption[] = [];
      imgs.forEach((img, i) => {
        const alt = img.getAttribute("alt");
        if (!alt) return; // decorative images (empty alt) are intentionally skipped
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        next.push({
          id: `${i}-${img.src}`,
          text: alt,
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      });
      setCaptions(next);
    }

    collect();
    window.addEventListener("scroll", collect, { passive: true });
    window.addEventListener("resize", collect);
    // Cheap fallback for images that finish loading/layout-shift after the
    // listeners above are attached (no ResizeObserver wiring per-image, to
    // keep this a "small effect" rather than a full observer system).
    const interval = window.setInterval(collect, 1000);

    return () => {
      window.removeEventListener("scroll", collect);
      window.removeEventListener("resize", collect);
      window.clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {captions.map((c) => (
        <div
          key={c.id}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 bg-black/80 px-2 py-1 text-xs text-white"
          style={{ top: c.top, left: c.left, maxWidth: c.width }}
        >
          {c.text}
        </div>
      ))}
    </>
  );
}
