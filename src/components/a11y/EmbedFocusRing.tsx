"use client";

import { useEffect } from "react";

// Draws a focus ring around a third-party embed while the keyboard is
// inside it.
//
// Why this cannot be CSS: Cloudflare's Turnstile puts its controls in a
// closed shadow root, and map embeds put theirs in a cross-origin iframe.
// In both cases `document.activeElement` becomes the host element, but the
// host matches neither `:focus` nor `:focus-within`, because the focused
// node lives in a tree this document is not allowed to see. Verified in
// Chrome: activeElement is the element, `el.matches(":focus")` is false.
// So a keyboard user tabbing into a captcha or a map got no indication at
// all of where they were.
//
// This watches for focus landing on such a host and marks it, which the
// stylesheet then rings. Render-null, no state, listeners are passive.
const MARK = "a11y-embed-focused";

function isEmbedHost(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  return el.tagName === "IFRAME" || !!el.closest(".a11y-embed-slot");
}

export function EmbedFocusRing() {
  useEffect(() => {
    let marked: HTMLElement | null = null;

    function clear() {
      if (marked) {
        marked.classList.remove(MARK);
        marked = null;
      }
    }

    function sync() {
      const active = document.activeElement;
      if (active === marked) return;
      // While focus sits inside a cross-origin frame the browser reports
      // this document as unfocused, and activeElement can momentarily read
      // as <body> even though focus never left the embed. Dropping the mark
      // there makes the ring flicker off while the visitor is still tabbing
      // through the frame's own controls, so hold it until focus is
      // demonstrably back in this document.
      if ((!active || active === document.body) && marked && !document.hasFocus()) return;
      clear();
      if (isEmbedHost(active)) {
        marked = active;
        marked.classList.add(MARK);
      }
    }

    // focusin covers the shadow-root case: focus entering a shadow tree is
    // retargeted to the host, which does fire focusin here.
    document.addEventListener("focusin", sync);
    // focusout fires before the new element is focused, so the check has to
    // be deferred. One frame is enough for a move inside this document, but
    // when focus crosses into an iframe or a shadow tree the browser blurs
    // the window first and activeElement settles a little later. Worse,
    // requestAnimationFrame is throttled once the window is blurred, so it
    // cannot be relied on here at all. A short bounded ladder of timeouts
    // covers every case and stops on its own.
    const timers: ReturnType<typeof setTimeout>[] = [];
    function deferredSync() {
      while (timers.length) clearTimeout(timers.pop());
      for (const delay of [0, 50, 150, 300, 600]) timers.push(setTimeout(sync, delay));
    }
    document.addEventListener("focusout", deferredSync);

    // Focus moving into a cross-origin iframe fires no focusin in this
    // document at all, and on some pages no window blur either: Chrome
    // simply makes the iframe the activeElement with no event to hang a
    // listener on. The Tab keydown itself is the one signal that is always
    // delivered here, because it happens while focus is still on our own
    // element, so schedule the check from there as well.
    function onTab(e: KeyboardEvent) {
      if (e.key === "Tab") deferredSync();
    }
    document.addEventListener("keydown", onTab, true);
    window.addEventListener("blur", deferredSync);
    window.addEventListener("focus", deferredSync);

    sync();
    return () => {
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", deferredSync);
      window.removeEventListener("blur", deferredSync);
      window.removeEventListener("focus", deferredSync);
      document.removeEventListener("keydown", onTab, true);
      while (timers.length) clearTimeout(timers.pop());
      clear();
    };
  }, []);

  return null;
}
