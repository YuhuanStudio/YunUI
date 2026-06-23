"use client";

// Theme switch rendered in fumadocs' native slot (DocsLayout `themeSwitch`),
// bottom of the sidebar next to the language selector. fumadocs' built-in
// toggle only knows light/dark/system, so we provide our own segmented control
// that also exposes YunUI's `true-black` theme. Styled with fumadocs `fd-`
// tokens so it matches the native chrome.
import { useTheme } from "next-themes";
import { Sun, Moon, Airplay, Droplet } from "lucide-react";
import { useEffect, useState } from "react";

const themes = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "true-black", icon: Droplet },
  { value: "system", icon: Airplay },
] as const;

export function DocsThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? theme : null;

  return (
    <div
      className="ms-auto inline-flex items-center rounded-full border border-fd-border p-0.5 *:rounded-full"
      data-theme-toggle=""
    >
      {themes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={value}
          className={`size-6.5 p-1.5 transition-colors ${
            current === value
              ? "bg-fd-accent text-fd-accent-foreground"
              : "text-fd-muted-foreground"
          }`}
          onClick={() => setTheme(value)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
