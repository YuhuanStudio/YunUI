"use client";
import { useAnchoredPosition } from './chunk-AV5TGEJS.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import * as React from 'react';
import { Sun, Moon, Droplet, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { jsx, jsxs } from 'react/jsx-runtime';

function ThemeToggle({ variant = "icon", align = "right", className = "" }) {
  const { theme, setTheme } = useTheme();
  const t = useYunUI().useT("common.theme");
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const { shift, maxHeight } = useAnchoredPosition(isOpen, panelRef);
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
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);
  const themes = [
    { value: "light", label: t("light"), icon: /* @__PURE__ */ jsx(Sun, { size: 14 }) },
    { value: "dark", label: t("zincDark"), icon: /* @__PURE__ */ jsx(Moon, { size: 14 }) },
    { value: "true-black", label: t("trueBlack"), icon: /* @__PURE__ */ jsx(Droplet, { size: 14, fill: "currentColor" }) },
    { value: "system", label: t("system"), icon: /* @__PURE__ */ jsx(Monitor, { size: 14 }) }
  ];
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className, children: variant === "pill" ? (
      /* Must match the mounted trigger's footprint (h-9, px-3 + one
         14px icon ≈ w-10) — a wider skeleton reads as a stray blank
         pill strip before hydration. */
      /* @__PURE__ */ jsx("div", { className: "h-9 w-10 rounded-full bg-(--bg-elevated) border border-(--border-hairline)" })
    ) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg" }) });
  }
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    variant === "pill" ? /* @__PURE__ */ jsx(
      "button",
      {
        ref: triggerRef,
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-label": t("toggle"),
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        children: /* @__PURE__ */ jsxs("span", { className: "relative flex h-3.5 w-3.5 items-center justify-center", children: [
          /* @__PURE__ */ jsx(Sun, { size: 14, className: "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
          /* @__PURE__ */ jsx(Moon, { size: 14, className: "absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })
        ] })
      }
    ) : /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        onClick: () => setIsOpen(!isOpen),
        className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-label": t("toggle"),
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        children: [
          /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" }),
          /* @__PURE__ */ jsx(Moon, { className: "h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("toggle") })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        ref: panelRef,
        style: { marginLeft: shift, maxHeight },
        className: `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`,
        children: /* @__PURE__ */ jsx("div", { className: "p-1 flex-1 min-h-0 overflow-y-auto", children: themes.map((themeItem) => /* @__PURE__ */ jsxs(
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
        )) })
      }
    )
  ] });
}

export { ThemeToggle };
//# sourceMappingURL=chunk-N7IH7SPF.js.map
//# sourceMappingURL=chunk-N7IH7SPF.js.map