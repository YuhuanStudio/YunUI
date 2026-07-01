"use client";

import { useYunUI } from "../adapters/context";

/**
 * Translator for the content stack. Reads the host app's i18n via the YunUI
 * adapter under the `content` namespace; when no translation is wired (or the
 * key is missing) it falls back to the built-in English string, so the content
 * components render correctly with zero setup.
 */
export function useContentT() {
  const t = useYunUI().useT("content");
  return (key: string, fallback: string): string => {
    try {
      const value = t(key);
      // Identity translator returns the key; next-intl returns a namespaced
      // "content.key" miss marker. Treat both as "not translated".
      if (!value || value === key || value.endsWith(`.${key}`)) return fallback;
      return value;
    } catch {
      return fallback;
    }
  };
}
