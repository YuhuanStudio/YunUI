/**
 * docs.ts — the YunUI documentation manifest.
 *
 * One entry per MDX page under `content/docs/`. This is the single source of
 * truth for: the fumadocs sidebar tree, page metadata (title/description),
 * the search index, and the slug → MDX-module loader the route uses.
 *
 * ── i18n ──────────────────────────────────────────────────────────────────
 * The site has client-side i18n (cookie-backed `useLocale()`, no locale
 * routing — see app/locale-provider.tsx). Docs prose is localized by shipping
 * per-locale MDX variants next to each page:
 *
 *     components/button.mdx        (en — the default/fallback)
 *     components/button.zh-CN.mdx  (simplified Chinese)
 *     components/button.zh-TW.mdx  (traditional Chinese)
 *
 * The manifest's `load` is a map of locale → importer (only `en` is required;
 * missing locales fall back to `en`). Likewise `title`/`description` accept a
 * per-locale map so the sidebar and page heading localize too. Code samples,
 * imports, component names and <ComponentPreview>/<PropsTable> usages stay
 * identical across locale variants — only the surrounding prose is translated.
 *
 * To add a page: drop `content/docs/<path>.mdx` (en) plus optional
 * `<path>.zh-CN.mdx` / `<path>.zh-TW.mdx`, then add an entry here (slug,
 * title, description, load, keywords, and which sidebar group it belongs to).
 */
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

/** Shape of a compiled MDX module (see mdx.d.ts). */
export interface MDXModule {
  default: ComponentType<{ components?: MDXComponents }>;
  toc?: unknown;
}

/** A lazy importer for one compiled MDX module. */
export type MDXLoader = () => Promise<MDXModule>;

/**
 * Per-locale value: either a single value shared across all locales, or a
 * partial map keyed by locale (the `en` key is required as the fallback).
 */
export type Localized<T> = T | ({ en: T } & Partial<Record<Locale, T>>);

/** Resolve a `Localized<T>` for a locale, falling back to the default locale. */
export function resolveLocalized<T>(value: Localized<T>, locale: Locale): T {
  if (value && typeof value === "object" && "en" in (value as object)) {
    const map = value as { en: T } & Partial<Record<Locale, T>>;
    return map[locale] ?? map[DEFAULT_LOCALE];
  }
  return value as T;
}

export interface DocEntry {
  /** URL slug segments under /docs (empty array = the /docs index). */
  slugs: string[];
  /** Page title — a string, or a per-locale map (en required). */
  title: Localized<string>;
  /** Page description — a string, or a per-locale map (en required). */
  description: Localized<string>;
  /** Lazy import of the compiled MDX module, per locale (en required). */
  load: Localized<MDXLoader>;
  /** Short search-text blob (headings/keywords) used to build the static index. */
  keywords?: string;
}

export interface DocGroup {
  title: Localized<string>;
  /** Slugs (joined with "/") of pages in this sidebar group, in order. */
  pages: string[];
}

/** Join slugs into the manifest key used for lookups ("" for the index). */
export const slugKey = (slugs: string[]): string => slugs.join("/");

export const docs: DocEntry[] = [
  {
    slugs: [],
    title: {
      en: "Getting Started",
      "zh-CN": "快速开始",
      "zh-TW": "快速開始",
    },
    description: {
      en: "Install YunUI, wire up Tailwind, and plug in the framework adapters.",
      "zh-CN": "安装 YunUI、配置 Tailwind，并接入框架适配器。",
      "zh-TW": "安裝 YunUI、設定 Tailwind，並接入框架轉接器。",
    },
    load: {
      en: () => import("@/content/docs/index.mdx"),
      "zh-CN": () => import("@/content/docs/index.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/index.zh-TW.mdx"),
    },
    keywords: "install tailwind source adapters provider getting started setup",
  },
  // ---- Components ---------------------------------------------------------
  {
    slugs: ["components"],
    title: { en: "Components", "zh-CN": "组件", "zh-TW": "元件" },
    description: {
      en: "Every YunUI primitive, with live previews and prop tables.",
      "zh-CN": "每一个 YunUI 基础组件，配有实时预览和属性表。",
      "zh-TW": "每一個 YunUI 基礎元件，配有即時預覽和屬性表。",
    },
    load: {
      en: () => import("@/content/docs/components/index.mdx"),
      "zh-CN": () => import("@/content/docs/components/index.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/index.zh-TW.mdx"),
    },
    keywords: "components overview primitives catalog",
  },
  {
    slugs: ["components", "button"],
    title: { en: "Button", "zh-CN": "按钮", "zh-TW": "按鈕" },
    description: {
      en: "Primary action button with variants, sizes, a loading spinner and asChild slotting.",
      "zh-CN": "主操作按钮，支持多种变体、尺寸、加载指示器以及 asChild 插槽。",
      "zh-TW": "主操作按鈕，支援多種變體、尺寸、載入指示器以及 asChild 插槽。",
    },
    load: {
      en: () => import("@/content/docs/components/button.mdx"),
      "zh-CN": () => import("@/content/docs/components/button.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/button.zh-TW.mdx"),
    },
    keywords: "button variant size loading icon action primary secondary ghost",
  },
  {
    slugs: ["components", "card"],
    title: { en: "Card", "zh-CN": "卡片", "zh-TW": "卡片" },
    description: {
      en: "Surface container rendering the canonical .card style.",
      "zh-CN": "渲染标准 .card 样式的表面容器。",
      "zh-TW": "渲染標準 .card 樣式的表面容器。",
    },
    load: {
      en: () => import("@/content/docs/components/card.mdx"),
      "zh-CN": () => import("@/content/docs/components/card.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/card.zh-TW.mdx"),
    },
    keywords: "card surface container hover panel",
  },
  {
    slugs: ["components", "flex"],
    title: { en: "Flex", "zh-CN": "Flex 弹性布局", "zh-TW": "Flex 彈性佈局" },
    description: {
      en: "Flexbox layout primitive with token-mapped direction, align, justify, gap and padding.",
      "zh-CN": "Flexbox 布局基础组件，方向、对齐、分布、间距和内边距均映射到设计令牌。",
      "zh-TW": "Flexbox 佈局基礎元件，方向、對齊、分佈、間距和內邊距均對應到設計權杖。",
    },
    load: {
      en: () => import("@/content/docs/components/flex.mdx"),
      "zh-CN": () => import("@/content/docs/components/flex.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/flex.zh-TW.mdx"),
    },
    keywords: "flex layout flexbox direction align justify gap row column stack",
  },
  {
    slugs: ["components", "grid"],
    title: { en: "Grid", "zh-CN": "Grid 网格布局", "zh-TW": "Grid 網格佈局" },
    description: {
      en: "CSS-grid layout primitive with token-mapped columns, rows and gap.",
      "zh-CN": "CSS Grid 布局基础组件，列、行和间距均映射到设计令牌。",
      "zh-TW": "CSS Grid 佈局基礎元件，欄、列和間距均對應到設計權杖。",
    },
    load: {
      en: () => import("@/content/docs/components/grid.mdx"),
      "zh-CN": () => import("@/content/docs/components/grid.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/grid.zh-TW.mdx"),
    },
    keywords: "grid layout columns rows gap css grid",
  },
  {
    slugs: ["components", "table"],
    title: { en: "Table", "zh-CN": "表格", "zh-TW": "表格" },
    description: {
      en: "Semantic, presentational table family using design-system tokens.",
      "zh-CN": "基于设计系统令牌的语义化、纯展示型表格组件族。",
      "zh-TW": "基於設計系統權杖的語義化、純展示型表格元件族。",
    },
    load: {
      en: () => import("@/content/docs/components/table.mdx"),
      "zh-CN": () => import("@/content/docs/components/table.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/table.zh-TW.mdx"),
    },
    keywords: "table thead tbody row cell data display",
  },
  {
    slugs: ["components", "accordion"],
    title: { en: "Accordion", "zh-CN": "手风琴", "zh-TW": "手風琴" },
    description: {
      en: "Radix-backed vertically stacked set of collapsible sections.",
      "zh-CN": "基于 Radix 的垂直堆叠可折叠区块集合。",
      "zh-TW": "基於 Radix 的垂直堆疊可折疊區塊集合。",
    },
    load: {
      en: () => import("@/content/docs/components/accordion.mdx"),
      "zh-CN": () => import("@/content/docs/components/accordion.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/accordion.zh-TW.mdx"),
    },
    keywords: "accordion collapse expand disclosure radix sections",
  },
  {
    slugs: ["components", "radio-group"],
    title: { en: "Radio Group", "zh-CN": "单选组", "zh-TW": "單選組" },
    description: {
      en: "Radix RadioGroup — a single-choice set of radio items.",
      "zh-CN": "基于 Radix RadioGroup 的单选项集合。",
      "zh-TW": "基於 Radix RadioGroup 的單選項集合。",
    },
    load: {
      en: () => import("@/content/docs/components/radio-group.mdx"),
      "zh-CN": () => import("@/content/docs/components/radio-group.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/components/radio-group.zh-TW.mdx"),
    },
    keywords: "radio group single choice select option form control",
  },
  // ---- Patterns -----------------------------------------------------------
  {
    slugs: ["patterns"],
    title: { en: "Patterns", "zh-CN": "模式", "zh-TW": "模式" },
    description: {
      en: "Higher-level, prop-driven page compositions built on the primitives.",
      "zh-CN": "基于基础组件构建的、由属性驱动的高层页面组合。",
      "zh-TW": "基於基礎元件構建的、由屬性驅動的高層頁面組合。",
    },
    load: {
      en: () => import("@/content/docs/patterns/index.mdx"),
      "zh-CN": () => import("@/content/docs/patterns/index.zh-CN.mdx"),
      "zh-TW": () => import("@/content/docs/patterns/index.zh-TW.mdx"),
    },
    keywords: "patterns page-level sidebar footer model card stat card blog",
  },
];

/** Sidebar grouping, in display order. Slugs reference the manifest by key. */
export const groups: DocGroup[] = [
  {
    title: { en: "Getting Started", "zh-CN": "快速开始", "zh-TW": "快速開始" },
    pages: [""],
  },
  {
    title: { en: "Components", "zh-CN": "组件", "zh-TW": "元件" },
    pages: [
      "components",
      "components/button",
      "components/card",
      "components/flex",
      "components/grid",
      "components/table",
      "components/accordion",
      "components/radio-group",
    ],
  },
  { title: { en: "Patterns", "zh-CN": "模式", "zh-TW": "模式" }, pages: ["patterns"] },
];

export function getDoc(slugs: string[] | undefined): DocEntry | undefined {
  const key = slugKey(slugs ?? []);
  return docs.find((d) => slugKey(d.slugs) === key);
}
