"use client";

import { useEffect, useRef } from "react";
import { useA11yPrefs } from "@/lib/useA11yPrefs";

// Behavior only, renders nothing. Mutes and pauses audio/video on this
// page while the pref is on, stays authoritative for media added later
// (a MutationObserver for elements inserted after mount, plus a
// capture-phase "play" listener since play does not bubble), and
// restores each element's original muted value on cleanup without ever
// resuming playback the user did not ask for.
//
// Cross-origin iframes (embedded YouTube, the Google map) cannot be
// controlled from this page and are not attempted here. Stated in the
// accessibility statement.
export function MuteSounds() {
  const prefs = useA11yPrefs();
  const active = prefs.muteSounds;
  const originalMuted = useRef(new WeakMap<HTMLMediaElement, boolean>());

  useEffect(() => {
    if (!active) return;

    function silence(el: HTMLMediaElement) {
      if (!originalMuted.current.has(el)) originalMuted.current.set(el, el.muted);
      el.muted = true;
      el.pause();
    }

    function silenceAll() {
      document.querySelectorAll<HTMLMediaElement>("audio, video").forEach(silence);
    }

    silenceAll();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLMediaElement) silence(node);
          node.querySelectorAll?.("audio, video").forEach((el) => silence(el as HTMLMediaElement));
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function handlePlay(e: Event) {
      const target = e.target;
      if (target instanceof HTMLMediaElement) silence(target);
    }
    // Capture phase: the "play" event does not bubble.
    document.addEventListener("play", handlePlay, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("play", handlePlay, true);
      document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((el) => {
        const original = originalMuted.current.get(el);
        if (original !== undefined) el.muted = original;
      });
      originalMuted.current = new WeakMap();
    };
  }, [active]);

  return null;
}
