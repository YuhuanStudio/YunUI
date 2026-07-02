"use client";

import { useCallback } from "react";
import { useYunUI } from "../adapters/context";

/**
 * Translator for the content stack. Reads the host app's i18n via the YunUI
 * adapter under the `content` namespace; when no translation is wired (or the
 * key is missing) it falls back to the built-in English string, so the content
 * components render correctly with zero setup.
 */
export function useContentT() {
  const t = useYunUI().useT("content");
  // Stable identity — consumers put this in effect deps (e.g. MermaidDiagram).
  // A fresh function each render would retrigger those effects on every render
  // and, when the effect setStates, loop forever ("Maximum update depth").
  return useCallback(
    (key: string, fallback: string): string => {
      try {
        const value = t(key);
        // Identity translator returns the key; next-intl returns a namespaced
        // "content.key" miss marker. Treat both as "not translated".
        if (!value || value === key || value.endsWith(`.${key}`)) return fallback;
        return value;
      } catch {
        return fallback;
      }
    },
    [t],
  );
}
