"use client";
import { useYunUI } from './chunk-T37N6OZA.js';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as React from 'react';
import { Sun, Moon, Droplet, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { jsx, jsxs } from 'react/jsx-runtime';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function ThemeToggle({ variant = "icon", align = "right", className = "" }) {
  const { theme, setTheme } = useTheme();
  const t = useYunUI().useT("common.theme");
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const themes = [
    { value: "light", label: t("light"), icon: /* @__PURE__ */ jsx(Sun, { size: 14 }) },
    { value: "dark", label: t("zincDark"), icon: /* @__PURE__ */ jsx(Moon, { size: 14 }) },
    { value: "true-black", label: t("trueBlack"), icon: /* @__PURE__ */ jsx(Droplet, { size: 14, fill: "currentColor" }) },
    { value: "system", label: t("system"), icon: /* @__PURE__ */ jsx(Monitor, { size: 14 }) }
  ];
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className, children: variant === "pill" ? /* @__PURE__ */ jsx("div", { className: "h-8 w-16 rounded-full bg-(--bg-elevated) border border-(--border-hairline)" }) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg" }) });
  }
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    variant === "pill" ? /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary)",
        "aria-label": t("toggle"),
        children: [
          /* @__PURE__ */ jsx(Sun, { size: 14, className: "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
          /* @__PURE__ */ jsx(Moon, { size: 14, className: "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })
        ]
      }
    ) : /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors",
        "aria-label": t("toggle"),
        children: [
          /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" }),
          /* @__PURE__ */ jsx(Moon, { className: "h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("toggle") })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 rounded-2xl border border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`, children: /* @__PURE__ */ jsx("div", { className: "p-1", children: themes.map((themeItem) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setTheme(themeItem.value);
          setIsOpen(false);
        },
        className: `dropdown-item w-full text-left ${theme === themeItem.value ? "active" : ""}`,
        children: [
          themeItem.icon,
          /* @__PURE__ */ jsx("span", { className: "flex-1", children: themeItem.label })
        ]
      },
      themeItem.value
    )) }) })
  ] });
}

export { ThemeToggle, cn };
//# sourceMappingURL=chunk-ORS36OUN.js.map
//# sourceMappingURL=chunk-ORS36OUN.js.map