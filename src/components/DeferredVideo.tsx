"use client";

import { useEffect, useRef } from "react";

/**
 * A decorative looping video that stays out of the way of first paint.
 *
 * The homepage video is 3.5 MB. As a plain <video autoPlay> it started
 * downloading immediately and competed with the CSS, fonts and JS that the
 * first paint needs. Here nothing is requested until the page has finished
 * loading and the browser is idle. It is never requested for visitors who ask
 * for reduced motion or turn on Save-Data, who get the plain background.
 */
export function DeferredVideo({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || video.getAttribute("src")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      video.src = src;
      // Autoplay can be blocked. The video is decoration, so ignore that.
      video.play().catch(() => {});
    };
    const schedule = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(start, { timeout: 3000 });
      } else {
        setTimeout(start, 1500);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
      style={style}
    />
  );
}
