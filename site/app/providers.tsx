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
import { LocaleProvider } from "./locale-provider";

// YunUI's adapter `useT` delegates to next-intl's `useTranslations` — mirrors
// Yunxin's yunui-provider.tsx. Component labels (theme toggle, combobox, select,
// thinking block, copy) live in messages/{en,zh-CN,zh-TW}.json under `common.*`.
const useT = (namespace?: string) => {
  const t = useTranslations(namespace as never);
  return (key: string, vars?: Record<string, unknown>) =>
    (t as (k: string, v?: Record<string, unknown>) => string)(key, vars);
};

export function Providers({ children }: { children: ReactNode }) {
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
      <LocaleProvider>
        {/* fumadocs context for the docs' search dialog. We own theming via the
            next-themes ThemeProvider above (custom light/dark/true-black), so
            disable fumadocs' own theme integration to avoid double-mounting. */}
        <RootProvider theme={{ enabled: false }} search={{ enabled: true }}>
          <YunUIProvider
            adapters={{
              Link: NextLink as never,
              Image: NextImage as never,
              useRouter: () => {
                const r = useNextRouter();
                return { push: r.push, replace: r.replace, back: r.back };
              },
              useT,
            }}
          >
            {children}
            <Toaster />
          </YunUIProvider>
        </RootProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
