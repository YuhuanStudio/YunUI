// Locale config for the YunUI marketing site. Mirrors Yunxin's
// src/i18n/config.ts (LOCALES + LOCALE_NAMES) so the two stay in sync.
export const LOCALES = ["en", "zh-CN", "zh-TW"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export const COOKIE_NAME = "NEXT_LOCALE";

/** Narrows an arbitrary string to a known Locale, falling back to the default. */
export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
