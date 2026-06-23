"use client";

import * as React from "react";

/**
 * Runtime theming for YunUI's token system.
 *
 * The design tokens (styles/tokens.css) are driven by data-* attributes on a
 * root element. Switching a role's palette is a single attribute change — no
 * rebuild, instant, and it cascades to every component/utility that consumes the
 * semantic tokens (e.g. the `bg-brand-solid-strong` / `text-accent-on-background-*`
 * utilities). Light/dark itself is still owned by your theme manager (e.g.
 * next-themes via the `.dark` class); this layer governs brand/accent/neutral
 * palette + solid/surface style.
 *
 *   import { applyTheme, useYunUITheme, YUNUI_PALETTES } from "@yuhuanowo/yunui";
 *   applyTheme({ brand: "emerald", accent: "violet" });   // imperative
 *   const [theme, setTheme] = useYunUITheme({ brand: "blue" }); // React, persisted
 */

export type YunUIPalette =
  | "gray" | "sand" | "slate"
  | "mint" | "rose" | "dusk" | "red" | "orange" | "yellow" | "moss" | "green"
  | "emerald" | "aqua" | "cyan" | "blue" | "indigo" | "violet" | "magenta" | "pink";

/** How solid (filled) surfaces derive their color. */
export type YunUISolid = "color" | "contrast" | "inverse";
/** Whether elevated surfaces are opaque or frosted. */
export type YunUISurface = "filled" | "translucent";
/** Color scheme — usually managed by your theme manager, exposed here for completeness. */
export type YunUIColorScheme = "light" | "dark";

export interface YunUITheme {
  /** Primary brand palette. */
  brand?: YunUIPalette;
  /** Secondary accent palette. */
  accent?: YunUIPalette;
  /** Neutral/gray palette (typically gray, sand, or slate). */
  neutral?: YunUIPalette;
  solid?: YunUISolid;
  surface?: YunUISurface;
  theme?: YunUIColorScheme;
}

/** All palettes available to the brand/accent/neutral roles (for building pickers). */
export const YUNUI_PALETTES: YunUIPalette[] = [
  "gray", "sand", "slate",
  "mint", "rose", "dusk", "red", "orange", "yellow", "moss", "green",
  "emerald", "aqua", "cyan", "blue", "indigo", "violet", "magenta", "pink",
];

const ATTR: Record<keyof YunUITheme, string> = {
  brand: "data-brand",
  accent: "data-accent",
  neutral: "data-neutral",
  solid: "data-solid",
  surface: "data-surface",
  theme: "data-theme",
};

function resolveTarget(el?: HTMLElement | null): HTMLElement | null {
  if (el) return el;
  return typeof document !== "undefined" ? document.documentElement : null;
}

/**
 * Apply theme attributes to an element (defaults to <html>). Only the keys you
 * pass are written; pass `null` for a key to clear it. Safe to call on the
 * server (no-ops when there is no document and no explicit element).
 */
export function applyTheme(theme: Partial<Record<keyof YunUITheme, string | null>>, el?: HTMLElement | null): void {
  const target = resolveTarget(el);
  if (!target) return;
  for (const key of Object.keys(theme) as (keyof YunUITheme)[]) {
    const value = theme[key];
    const attr = ATTR[key];
    if (!attr) continue;
    if (value == null) target.removeAttribute(attr);
    else target.setAttribute(attr, value);
  }
}

/** Read the current theme attributes back off an element (defaults to <html>). */
export function readTheme(el?: HTMLElement | null): YunUITheme {
  const target = resolveTarget(el);
  const out: YunUITheme = {};
  if (!target) return out;
  for (const key of Object.keys(ATTR) as (keyof YunUITheme)[]) {
    const v = target.getAttribute(ATTR[key]);
    if (v != null) (out as Record<string, string>)[key] = v;
  }
  return out;
}

const STORAGE_KEY = "yunui-theme";

/**
 * React hook for runtime theming. Returns the current theme and a setter that
 * merges a patch, applies it to <html>, and persists to localStorage. On mount
 * it hydrates from localStorage (falling back to `defaults`) and applies it.
 */
export function useYunUITheme(
  defaults: YunUITheme = {}
): [YunUITheme, (patch: YunUITheme) => void] {
  const [theme, setTheme] = React.useState<YunUITheme>(defaults);

  React.useEffect(() => {
    let stored: YunUITheme = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as YunUITheme;
    } catch {
      /* ignore malformed storage */
    }
    const merged = { ...defaults, ...stored };
    setTheme(merged);
    applyTheme(merged);
    // Run once on mount; `defaults` is treated as initial-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = React.useCallback((patch: YunUITheme) => {
    setTheme((prev) => {
      const next = { ...prev, ...patch };
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota/availability errors */
      }
      return next;
    });
  }, []);

  return [theme, update];
}
