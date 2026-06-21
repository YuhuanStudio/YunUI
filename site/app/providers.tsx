"use client";

import { ThemeProvider } from "next-themes";
import { YunUIProvider } from "yunui/adapters";
import NextLink from "next/link";
import NextImage from "next/image";
import { useRouter as useNextRouter } from "next/navigation";
import type { ReactNode } from "react";

// A tiny in-site dictionary so component labels (theme toggle, combobox, etc.)
// read nicely. In a real app you'd inject next-intl here instead.
const MESSAGES: Record<string, Record<string, string>> = {
  "common.theme": {
    light: "Light",
    zincDark: "Zinc Dark",
    trueBlack: "True Black",
    system: "System",
    toggle: "Toggle theme",
  },
  "common.combobox": {
    placeholder: "Select or type…",
    creatableText: 'Create "{value}"',
    noResults: "No results",
  },
  "common.select": {
    placeholder: "Select…",
    search: "Search…",
    clearSearch: "Clear",
    noOptions: "No options",
  },
  "common.thinking": {
    label: "Thinking",
    active: "Live",
    inProgress: "Thinking…",
  },
  common: {
    copied: "Copied!",
    copy: "Copy",
  },
};

function humanize(key: string): string {
  const last = key.split(".").pop() ?? key;
  return last.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const useT = (namespace?: string) => (key: string, vars?: Record<string, unknown>) => {
  const ns = namespace ? MESSAGES[namespace] : undefined;
  let value = ns?.[key] ?? humanize(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
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
      </YunUIProvider>
    </ThemeProvider>
  );
}
