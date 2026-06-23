"use client";

// Client i18n state. The active locale is resolved on the *server* from the
// NEXT_LOCALE cookie (see app/layout.tsx) and handed in as `initialLocale`, so
// the server-rendered HTML is already in the user's language — the client
// hydrates with the same locale (no mismatch, no first-paint language flash).
// `setLocale` flips the locale instantly in-session and writes the cookie so
// the server renders the new language on the next request.
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider, IntlErrorCode, type IntlError } from "next-intl";
import { COOKIE_NAME, type Locale } from "@/i18n/config";

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

// next-intl error handler — surface real problems (e.g. MISSING_MESSAGE) but
// stay quiet for the benign ENVIRONMENT_FALLBACK code.
function handleIntlError(error: IntlError): void {
  if (error.code === IntlErrorCode.ENVIRONMENT_FALLBACK) return;
  console.error(error);
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? ";Secure"
        : "";
    document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=${60 * 60 * 24 * 365};SameSite=lax${secure}`;
    // Update state so the UI re-renders instantly — no full reload.
    setLocaleState(next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        onError={handleIntlError}
      >
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
