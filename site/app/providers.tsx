"use client";

import { ThemeProvider } from "next-themes";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Toaster } from "yunui";
import { YunUIProvider } from "yunui/adapters";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import NextImage from "next/image";
import { useRouter as useNextRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LOCALES, LOCALE_NAMES, isLocale, type Locale } from "@/i18n/config";
import { LocaleProvider, useLocale, useSetLocale } from "./locale-provider";

// YunUI's adapter `useT` delegates to next-intl's `useTranslations` — mirrors
// Yunxin's yunui-provider.tsx. Component labels (theme toggle, combobox, select,
// thinking block, copy) live in messages/{en,zh-CN,zh-TW}.json under `common.*`.
const useT = (namespace?: string) => {
  const t = useTranslations(namespace as never);
  return (key: string, vars?: Record<string, unknown>) =>
    (t as (k: string, v?: Record<string, unknown>) => string)(key, vars);
};

// fumadocs RootProvider, wired to our cookie-backed locale store. Passing
// `i18n.locales` makes fumadocs render its built-in language switcher at the
// bottom of the docs sidebar; `onLocaleChange` routes the choice back into our
// store (cookie + instant in-session switch) instead of fumadocs' default
// URL redirect. Must live *inside* LocaleProvider to read the locale context.
function FumadocsRoot({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const setLocale = useSetLocale();
  return (
    <RootProvider
      // We own theming via the next-themes ThemeProvider above (custom
      // light/dark/true-black), so disable fumadocs' own theme integration.
      theme={{ enabled: false }}
      search={{ enabled: true }}
      i18n={{
        locale,
        locales: LOCALES.map((l) => ({ locale: l, name: LOCALE_NAMES[l] })),
        onLocaleChange: (v) => {
          if (isLocale(v)) setLocale(v);
        },
      }}
    >
      {children}
    </RootProvider>
  );
}

export function Providers({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      themes={["light", "dark", "true-black"]}
      value={{ light: "light", dark: "dark", "true-black": "true-black" }}
    >
      {/* Client-side locale (cookie-backed, instant switch) wraps the tree so
          both yunui component labels and the marketing copy re-render on change. */}
      <LocaleProvider initialLocale={initialLocale}>
        <FumadocsRoot>
          <YunUIProvider
            adapters={{
              Link: NextLink as never,
              Image: NextImage as never,
              useRouter: () => {
                const r = useNextRouter();
                return { push: r.push, replace: r.replace, back: r.back };
              },
              useT,
              // Self-host icons from the site's own public/icons (the package
              // default now points at jsDelivr; the site ships its own copy).
              iconBasePath: "/icons",
            }}
          >
            {children}
            <Toaster />
          </YunUIProvider>
        </FumadocsRoot>
      </LocaleProvider>
    </ThemeProvider>
  );
}
