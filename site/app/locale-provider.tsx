"use client";

// Client-side i18n for the static-export site. We can't rely on a Next.js
// middleware/server locale segment (the site exports to static HTML), so the
// locale lives entirely on the client: read from the NEXT_LOCALE cookie on
// mount, switchable instantly via setLocale (writes the cookie + updates state
// so the whole tree re-renders without a full reload).
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/i18n/config";

import enMessages from "@/messages/en.json";
import zhCNMessages from "@/messages/zh-CN.json";
import zhTWMessages from "@/messages/zh-TW.json";

const MESSAGES: Record<Locale, Record<string, unknown>> = {
  en: enMessages,
  "zh-CN": zhCNMessages,
  "zh-TW": zhTWMessages,
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split("=")[1];
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: on the server `readCookieLocale()` returns the default
  // (no `document`), so SSG markup is the default locale; on the client it runs
  // during the *first* render (hydration) and returns the cookie value. This
  // makes the initial client render already correct — no post-paint locale jump
  // like a `useEffect` correction would cause. The expected SSG↔client text
  // mismatch for non-default locales is silenced via `suppressHydrationWarning`
  // on <html> in the root layout.
  const [locale, setLocaleState] = useState<Locale>(readCookieLocale);

  const setLocale = useCallback((next: Locale) => {
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=${60 * 60 * 24 * 365};SameSite=lax${secure}`;
    // Update state so the UI re-renders instantly — no full reload.
    setLocaleState(next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Current active locale. */
export function useLocale(): Locale {
  return useLocaleContext().locale;
}

/** Setter that writes the cookie and re-renders the tree instantly. */
export function useSetLocale(): (locale: Locale) => void {
  return useLocaleContext().setLocale;
}
