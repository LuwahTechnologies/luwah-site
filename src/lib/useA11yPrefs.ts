"use client";

import { useEffect, useState } from "react";
import { A11Y_PREFS_EVENT, DEFAULT_A11Y_PREFS, readStoredPrefs, type A11yPrefs } from "@/lib/a11y";

// Full prefs, live-synced with the widget (via the A11Y_PREFS_EVENT the
// widget dispatches on every change) and with localStorage across tabs.
// Used by components that need more than just reduce-motion: the reading
// guide/window overlay and the image-description captions.
export function useA11yPrefs(): A11yPrefs {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_A11Y_PREFS);

  useEffect(() => {
    setPrefs(readStoredPrefs());

    function sync() {
      setPrefs(readStoredPrefs());
    }

    window.addEventListener(A11Y_PREFS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(A11Y_PREFS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return prefs;
}
