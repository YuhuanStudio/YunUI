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
 * title, description, load, keywords) and list it in a `groups` section.
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

/** Helper to declare a component page entry (slug under /docs/components). */
function comp(
  slug: string,
  title: Localized<string>,
  description: Localized<string>,
  keywords: string,
): DocEntry {
  return {
    slugs: ["components", slug],
    title,
    description,
    load: {
      en: () => import(`@/content/docs/components/${slug}.mdx`),
      "zh-CN": () => import(`@/content/docs/components/${slug}.zh-CN.mdx`),
      "zh-TW": () => import(`@/content/docs/components/${slug}.zh-TW.mdx`),
    },
    keywords,
  };
}

/** Helper to declare a pattern page entry (slug under /docs/patterns). */
function pat(
  slug: string,
  title: Localized<string>,
  description: Localized<string>,
  keywords: string,
): DocEntry {
  return {
    slugs: ["patterns", slug],
    title,
    description,
    load: {
      en: () => import(`@/content/docs/patterns/${slug}.mdx`),
      "zh-CN": () => import(`@/content/docs/patterns/${slug}.zh-CN.mdx`),
      "zh-TW": () => import(`@/content/docs/patterns/${slug}.zh-TW.mdx`),
    },
    keywords,
  };
}

/** Helper to declare an AI-component page entry (slug under /docs/ai). */
function aiDoc(
  slug: string,
  title: Localized<string>,
  description: Localized<string>,
  keywords: string,
): DocEntry {
  return {
    slugs: ["ai", slug],
    title,
    description,
    load: {
      en: () => import(`@/content/docs/ai/${slug}.mdx`),
      "zh-CN": () => import(`@/content/docs/ai/${slug}.zh-CN.mdx`),
      "zh-TW": () => import(`@/content/docs/ai/${slug}.zh-TW.mdx`),
    },
    keywords,
  };
}

export const docs: DocEntry[] = [
  {
    slugs: [],
    title: { en: "Getting Started", "zh-CN": "快速开始", "zh-TW": "快速開始" },
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

  // ---- Buttons & Actions --------------------------------------------------
  comp(
    "button",
    { en: "Button", "zh-CN": "按钮", "zh-TW": "按鈕" },
    {
      en: "Primary action button with variants, sizes, a loading spinner and asChild slotting.",
      "zh-CN": "主操作按钮，支持多种变体、尺寸、加载指示器以及 asChild 插槽。",
      "zh-TW": "主操作按鈕，支援多種變體、尺寸、載入指示器以及 asChild 插槽。",
    },
    "button variant size loading icon action primary secondary ghost",
  ),
  comp(
    "icon-button",
    { en: "Icon Button", "zh-CN": "图标按钮", "zh-TW": "圖示按鈕" },
    {
      en: "An icon-only button with a built-in tooltip; its label doubles as the accessible name.",
      "zh-CN": "带内置工具提示的纯图标按钮；label 同时充当无障碍名称。",
      "zh-TW": "帶內建工具提示的純圖示按鈕;label 同時充當無障礙名稱。",
    },
    "icon button tooltip icon-only action accessible",
  ),
  comp(
    "shiny-button",
    { en: "Shiny Button", "zh-CN": "闪光按钮", "zh-TW": "閃光按鈕" },
    {
      en: "A high-emphasis CTA button with an animated shimmer sweep; renders a link when href is set.",
      "zh-CN": "带微光扫过动画的高强调号召按钮；设置 href 时渲染为链接。",
      "zh-TW": "帶微光掃過動畫的高強調呼籲按鈕;設定 href 時渲染為連結。",
    },
    "shiny button cta shimmer gradient call to action animated",
  ),
  comp(
    "theme-toggle",
    { en: "Theme Toggle", "zh-CN": "主题切换", "zh-TW": "主題切換" },
    {
      en: "A theme switcher dropdown (light / zinc-dark / true-black / system) backed by next-themes.",
      "zh-CN": "由 next-themes 驱动的主题切换下拉菜单（浅色 / 锌灰深色 / 纯黑 / 系统）。",
      "zh-TW": "由 next-themes 驅動的主題切換下拉選單（淺色 / 鋅灰深色 / 純黑 / 系統）。",
    },
    "theme toggle dark mode light next-themes switcher appearance",
  ),

  // ---- Forms & Inputs -----------------------------------------------------
  comp(
    "input",
    { en: "Input", "zh-CN": "输入框", "zh-TW": "輸入框" },
    {
      en: "Single-line text field with an optional leading icon and inline error.",
      "zh-CN": "单行文本输入框，支持可选的前置图标与内联错误提示。",
      "zh-TW": "單行文字輸入框,支援可選的前置圖示與內聯錯誤提示。",
    },
    "input text field form icon error",
  ),
  comp(
    "textarea",
    { en: "Textarea", "zh-CN": "多行输入框", "zh-TW": "多行輸入框" },
    {
      en: "Multi-line text field with an inline error message.",
      "zh-CN": "多行文本输入框,带内联错误提示。",
      "zh-TW": "多行文字輸入框,帶內聯錯誤提示。",
    },
    "textarea multiline text field form error",
  ),
  comp(
    "label",
    { en: "Label", "zh-CN": "标签", "zh-TW": "標籤" },
    {
      en: "Styled form label; pairs with a control via htmlFor.",
      "zh-CN": "样式化的表单标签,通过 htmlFor 与控件关联。",
      "zh-TW": "樣式化的表單標籤,透過 htmlFor 與控制項關聯。",
    },
    "label form field htmlFor accessibility",
  ),
  comp(
    "checkbox",
    { en: "Checkbox", "zh-CN": "复选框", "zh-TW": "核取方塊" },
    {
      en: "Controlled checkbox, pairs with a label for an accessible row.",
      "zh-CN": "受控复选框,与标签配对组成无障碍选项行。",
      "zh-TW": "受控核取方塊,與標籤配對組成無障礙選項列。",
    },
    "checkbox check controlled form boolean toggle",
  ),
  comp(
    "switch",
    { en: "Switch", "zh-CN": "开关", "zh-TW": "開關" },
    {
      en: "Controlled on/off toggle with sizes and color variants.",
      "zh-CN": "受控的开/关切换开关,支持尺寸与颜色变体。",
      "zh-TW": "受控的開/關切換開關,支援尺寸與顏色變體。",
    },
    "switch toggle on off controlled checked variant size",
  ),
  comp(
    "radio-group",
    { en: "Radio Group", "zh-CN": "单选组", "zh-TW": "單選組" },
    {
      en: "Radix RadioGroup — a single-choice set of radio items.",
      "zh-CN": "基于 Radix RadioGroup 的单选项集合。",
      "zh-TW": "基於 Radix RadioGroup 的單選項集合。",
    },
    "radio group single choice select option form control",
  ),
  comp(
    "slider",
    { en: "Slider", "zh-CN": "滑块", "zh-TW": "滑桿" },
    {
      en: "Range slider built on Radix Slider, with single or dual thumbs.",
      "zh-CN": "基于 Radix Slider 的范围滑块,支持单个或双滑块。",
      "zh-TW": "基於 Radix Slider 的範圍滑桿,支援單個或雙滑桿。",
    },
    "slider range input radix value min max step",
  ),
  comp(
    "select",
    { en: "Select", "zh-CN": "选择器", "zh-TW": "選擇器" },
    {
      en: "Dropdown select built on Radix Select — a composed family of parts.",
      "zh-CN": "基于 Radix Select 的下拉选择器,由多个部件组合而成。",
      "zh-TW": "基於 Radix Select 的下拉選擇器,由多個部件組合而成。",
    },
    "select dropdown listbox option radix value",
  ),
  comp(
    "combobox",
    { en: "Combobox", "zh-CN": "组合框", "zh-TW": "組合框" },
    {
      en: "Searchable, optionally creatable combobox — type to filter, Enter to pick or create.",
      "zh-CN": "可搜索、可选择创建新值的组合框 —— 输入即可过滤，按 Enter 选中或创建。",
      "zh-TW": "可搜尋、可選擇建立新值的組合框 —— 輸入即可篩選,按 Enter 選取或建立。",
    },
    "combobox autocomplete search creatable typeahead filter select input",
  ),
  comp(
    "custom-select",
    { en: "CustomSelect", "zh-CN": "自定义选择器", "zh-TW": "自訂選擇器" },
    {
      en: "Fully custom-styled select with optional search, icons, descriptions and keyboard support.",
      "zh-CN": "完全自定义样式的选择框，支持可选搜索、图标、描述与完整键盘操作。",
      "zh-TW": "完全自訂樣式的選擇框,支援可選搜尋、圖示、描述與完整鍵盤操作。",
    },
    "select dropdown listbox searchable options icons descriptions keyboard",
  ),
  comp(
    "segmented-select",
    { en: "SegmentedSelect", "zh-CN": "分段选择器", "zh-TW": "分段選擇器" },
    {
      en: "Inline segmented control — a row of buttons where one option is active at a time.",
      "zh-CN": "内联分段控件 —— 一排按钮，任意时刻只有一个选项处于激活状态。",
      "zh-TW": "內嵌分段控制項 —— 一排按鈕,任何時刻只有一個選項處於啟用狀態。",
    },
    "segmented control toggle group view switcher button group filter",
  ),

  // ---- Layout -------------------------------------------------------------
  comp(
    "flex",
    { en: "Flex", "zh-CN": "Flex 弹性布局", "zh-TW": "Flex 彈性佈局" },
    {
      en: "Flexbox layout primitive with token-mapped direction, align, justify, gap and padding.",
      "zh-CN": "Flexbox 布局基础组件，方向、对齐、分布、间距和内边距均映射到设计令牌。",
      "zh-TW": "Flexbox 佈局基礎元件，方向、對齊、分佈、間距和內邊距均對應到設計權杖。",
    },
    "flex layout flexbox direction align justify gap row column stack",
  ),
  comp(
    "grid",
    { en: "Grid", "zh-CN": "Grid 网格布局", "zh-TW": "Grid 網格佈局" },
    {
      en: "CSS-grid layout primitive with token-mapped columns, rows and gap.",
      "zh-CN": "CSS Grid 布局基础组件，列、行和间距均映射到设计令牌。",
      "zh-TW": "CSS Grid 佈局基礎元件，欄、列和間距均對應到設計權杖。",
    },
    "grid layout columns rows gap css grid",
  ),
  comp(
    "bento-grid",
    { en: "Bento Grid", "zh-CN": "便当网格", "zh-TW": "便當網格" },
    {
      en: "Responsive bento-style grid of glass cards with icon, title and description.",
      "zh-CN": "由玻璃卡片组成的响应式便当风格网格，带图标、标题和描述。",
      "zh-TW": "由玻璃卡片組成的響應式便當風格網格,帶圖示、標題和描述。",
    },
    "bento grid card glass layout feature tiles span responsive",
  ),

  // ---- Data Display -------------------------------------------------------
  comp(
    "card",
    { en: "Card", "zh-CN": "卡片", "zh-TW": "卡片" },
    {
      en: "Surface container rendering the canonical .card style.",
      "zh-CN": "渲染标准 .card 样式的表面容器。",
      "zh-TW": "渲染標準 .card 樣式的表面容器。",
    },
    "card surface container hover panel",
  ),
  comp(
    "badge",
    { en: "Badge", "zh-CN": "徽章", "zh-TW": "徽章" },
    {
      en: "Small inline pill for statuses and labels, with semantic color variants.",
      "zh-CN": "用于状态和标签的小型行内胶囊，带语义化颜色变体。",
      "zh-TW": "用於狀態和標籤的小型行內膠囊,帶語義化顏色變體。",
    },
    "badge pill status label tag variant success warning error info",
  ),
  comp(
    "avatar",
    { en: "Avatar", "zh-CN": "头像", "zh-TW": "頭像" },
    {
      en: "Radix-backed circular avatar with image and initials fallback.",
      "zh-CN": "基于 Radix 的圆形头像，带图片和首字母缩写后备。",
      "zh-TW": "基於 Radix 的圓形頭像,帶圖片和首字母縮寫後備。",
    },
    "avatar image fallback initials profile user radix",
  ),
  comp(
    "table",
    { en: "Table", "zh-CN": "表格", "zh-TW": "表格" },
    {
      en: "Semantic, presentational table family using design-system tokens.",
      "zh-CN": "基于设计系统令牌的语义化、纯展示型表格组件族。",
      "zh-TW": "基於設計系統權杖的語義化、純展示型表格元件族。",
    },
    "table thead tbody row cell data display",
  ),
  comp(
    "animated-number",
    { en: "Animated Number", "zh-CN": "数字动画", "zh-TW": "數字動畫" },
    {
      en: "A number that springs from 0 to value on mount; SSR-hydration safe.",
      "zh-CN": "挂载时从 0 弹簧动画增长到目标值的数字；SSR 水合安全。",
      "zh-TW": "掛載時從 0 彈簧動畫增長到目標值的數字;SSR 水合安全。",
    },
    "animated number count up spring counter stat suffix decimals",
  ),
  comp(
    "marquee",
    { en: "Marquee", "zh-CN": "跑马灯", "zh-TW": "跑馬燈" },
    {
      en: "Infinitely scrolling row or column with reverse, vertical and pause-on-hover.",
      "zh-CN": "无限滚动的行或列，支持反向、垂直和悬停暂停。",
      "zh-TW": "無限捲動的行或列,支援反向、垂直和懸停暫停。",
    },
    "marquee scroll ticker infinite loop reverse vertical pause hover",
  ),

  // ---- Navigation ---------------------------------------------------------
  comp(
    "tabs",
    { en: "Tabs", "zh-CN": "选项卡", "zh-TW": "頁籤" },
    {
      en: "Radix-backed tabbed sections with keyboard-accessible triggers and content panels.",
      "zh-CN": "基于 Radix 的选项卡，触发器支持完整键盘无障碍，含内容面板。",
      "zh-TW": "基於 Radix 的頁籤,觸發器支援完整鍵盤無障礙,含內容面板。",
    },
    "tabs tab panel trigger content radix navigation switch",
  ),
  comp(
    "nav-tabs",
    { en: "Nav Tabs", "zh-CN": "导航标签", "zh-TW": "導覽頁籤" },
    {
      en: "The horizontal tab bar for page-level navigation, with a sliding active indicator.",
      "zh-CN": "用于页面级导航的横向标签栏，带滑动激活指示器。",
      "zh-TW": "用於頁面層級導覽的橫向頁籤列,帶滑動作用中指示器。",
    },
    "nav tabs navigation tab bar link active indicator page",
  ),
  comp(
    "breadcrumb",
    { en: "Breadcrumb", "zh-CN": "面包屑", "zh-TW": "麵包屑" },
    {
      en: "An accessible breadcrumb trail with links, a current page, separators and an ellipsis.",
      "zh-CN": "无障碍面包屑导航，含链接、当前页、分隔符与省略号。",
      "zh-TW": "無障礙麵包屑導覽,含連結、目前頁、分隔符與省略號。",
    },
    "breadcrumb trail navigation link page separator ellipsis",
  ),
  comp(
    "pagination",
    { en: "Pagination", "zh-CN": "分页", "zh-TW": "分頁" },
    {
      en: "A controlled page navigator with prev/next arrows and ellipsis truncation.",
      "zh-CN": "受控的分页导航，带上一页/下一页箭头与省略号截断。",
      "zh-TW": "受控的分頁導覽,帶上一頁/下一頁箭頭與省略號截斷。",
    },
    "pagination pager page navigation prev next ellipsis controlled",
  ),
  comp(
    "dropdown-menu",
    { en: "Dropdown Menu", "zh-CN": "下拉菜单", "zh-TW": "下拉選單" },
    {
      en: "Radix-backed contextual actions menu with labels, separators, shortcuts and submenus.",
      "zh-CN": "基于 Radix 的上下文操作菜单，含标题、分隔符、快捷键与子菜单。",
      "zh-TW": "基於 Radix 的情境操作選單,含標題、分隔符、快捷鍵與子選單。",
    },
    "dropdown menu actions context radix item label separator shortcut submenu",
  ),

  // ---- Overlays -----------------------------------------------------------
  comp(
    "dialog",
    { en: "Dialog", "zh-CN": "对话框", "zh-TW": "對話框" },
    {
      en: "Radix-backed modal dialog with a trigger, portalled panel and built-in close button.",
      "zh-CN": "基于 Radix 的模态对话框，包含触发器、传送面板和内置关闭按钮。",
      "zh-TW": "基於 Radix 的模態對話框,包含觸發器、傳送面板和內建關閉按鈕。",
    },
    "dialog modal radix overlay trigger portal popup confirm",
  ),
  comp(
    "modal",
    { en: "Modal", "zh-CN": "模态框", "zh-TW": "模態框" },
    {
      en: "YunUI's controlled modal — a portalled card with title, scrollable body and footer.",
      "zh-CN": "YunUI 的受控模态框——一个带标题、可滚动主体和底部的传送卡片。",
      "zh-TW": "YunUI 的受控模態框——一個帶標題、可捲動主體和底部的傳送卡片。",
    },
    "modal dialog overlay controlled isOpen onClose footer size portal",
  ),
  comp(
    "sheet",
    { en: "Sheet", "zh-CN": "抽屉", "zh-TW": "抽屜" },
    {
      en: "Mobile-only panel that slides in from the right over a backdrop (hidden on lg+).",
      "zh-CN": "仅移动端使用、从右侧滑入并叠加背景的面板（在 lg 及以上隐藏）。",
      "zh-TW": "僅行動端使用、從右側滑入並疊加背景的面板（在 lg 及以上隱藏）。",
    },
    "sheet drawer mobile slide-in panel side overlay controlled",
  ),
  comp(
    "popover",
    { en: "Popover", "zh-CN": "气泡卡片", "zh-TW": "彈出卡片" },
    {
      en: "Radix-backed floating panel anchored to a trigger, with alignment and offset props.",
      "zh-CN": "基于 Radix 的浮动面板，锚定在触发器上，支持对齐和偏移属性。",
      "zh-TW": "基於 Radix 的浮動面板,錨定在觸發器上,支援對齊和偏移屬性。",
    },
    "popover floating panel radix anchor align trigger non-modal",
  ),
  comp(
    "tooltip",
    { en: "Tooltip", "zh-CN": "工具提示", "zh-TW": "工具提示" },
    {
      en: "Radix-backed hover/focus label; wrap triggers in a TooltipProvider.",
      "zh-CN": "基于 Radix 的悬停/聚焦标签；将触发器包裹在 TooltipProvider 中。",
      "zh-TW": "基於 Radix 的懸停/聚焦標籤;將觸發器包裹在 TooltipProvider 中。",
    },
    "tooltip hover focus hint label radix provider side",
  ),
  comp(
    "confirm-modal",
    { en: "Confirm Modal", "zh-CN": "确认对话框", "zh-TW": "確認對話框" },
    {
      en: "Variant-colored confirmation dialog with a loading state for destructive actions.",
      "zh-CN": "带变体配色和加载状态的确认对话框，用于破坏性操作。",
      "zh-TW": "帶變體配色和載入狀態的確認對話框,用於破壞性操作。",
    },
    "confirm modal dialog danger delete warning onConfirm controlled loading",
  ),
  comp(
    "toast",
    { en: "Toast", "zh-CN": "轻提示", "zh-TW": "輕提示" },
    {
      en: "Imperative Sonner-powered notifications; render <Toaster /> once at the app root.",
      "zh-CN": "由 Sonner 驱动的命令式通知；在应用根部只渲染一次 <Toaster />。",
      "zh-TW": "由 Sonner 驅動的命令式通知;在應用根部只渲染一次 <Toaster />。",
    },
    "toast notification sonner success error info warning promise imperative",
  ),

  // ---- Feedback -----------------------------------------------------------
  comp(
    "progress",
    { en: "Progress", "zh-CN": "进度条", "zh-TW": "進度條" },
    {
      en: "A horizontal progress bar; pass a value from 0–100 and the indicator animates to it.",
      "zh-CN": "水平进度条；传入 0–100 的 value，指示条会动画过渡到该百分比。",
      "zh-TW": "水平進度條;傳入 0–100 的 value,指示條會動畫過渡到該百分比。",
    },
    "progress bar loading percent indicator determinate",
  ),
  comp(
    "spinner",
    { en: "Spinner", "zh-CN": "加载图标", "zh-TW": "載入圖示" },
    {
      en: "An animated loading spinner in three sizes with a built-in screen-reader label.",
      "zh-CN": "三种尺寸的加载旋转图标，内置屏幕阅读器标签。",
      "zh-TW": "三種尺寸的載入旋轉圖示,內建螢幕閱讀器標籤。",
    },
    "spinner loading loader busy indicator sizes",
  ),
  comp(
    "skeleton",
    { en: "Skeleton", "zh-CN": "骨架屏", "zh-TW": "骨架屏" },
    {
      en: "A pulsing placeholder block for loading states, shaped entirely with className.",
      "zh-CN": "用于加载状态的脉冲占位块，完全通过 className 控制形状。",
      "zh-TW": "用於載入狀態的脈衝佔位塊,完全透過 className 控制形狀。",
    },
    "skeleton placeholder loading shimmer pulse ghost",
  ),
  comp(
    "page-loader",
    { en: "Page Loader", "zh-CN": "页面加载器", "zh-TW": "頁面載入器" },
    {
      en: "A full-viewport centered loading screen with a spinner and optional title/subtitle.",
      "zh-CN": "占满视口、居中的加载屏幕，含旋转图标与可选标题/副标题。",
      "zh-TW": "佔滿視口、置中的載入畫面,含旋轉圖示與可選標題/副標題。",
    },
    "page loader fullscreen loading route fallback splash",
  ),
  comp(
    "inline-status",
    { en: "Inline Status", "zh-CN": "内联状态", "zh-TW": "內聯狀態" },
    {
      en: "A compact inline async-job status — a (spinning) icon plus a label, or a percentage while running.",
      "zh-CN": "紧凑的内联异步任务状态——一个（旋转的）图标加标签，或运行时显示百分比。",
      "zh-TW": "精簡的內聯非同步任務狀態——一個（旋轉的）圖示加標籤，或執行時顯示百分比。",
    },
    "inline status async job pending processing completed failed progress percent spinner",
  ),
  comp(
    "empty-state",
    { en: "Empty State", "zh-CN": "空状态", "zh-TW": "空狀態" },
    {
      en: "A centered placeholder for empty lists and no-results screens, with icon, title, description and action.",
      "zh-CN": "用于空列表和无结果界面的居中占位符，含图标、标题、描述和操作槽位。",
      "zh-TW": "用於空清單和無結果畫面的置中佔位符,含圖示、標題、描述和操作插槽。",
    },
    "empty state placeholder no results no data zero state",
  ),

  // ---- Disclosure ---------------------------------------------------------
  comp(
    "accordion",
    { en: "Accordion", "zh-CN": "手风琴", "zh-TW": "手風琴" },
    {
      en: "Radix-backed vertically stacked set of collapsible sections.",
      "zh-CN": "基于 Radix 的垂直堆叠可折叠区块集合。",
      "zh-TW": "基於 Radix 的垂直堆疊可折疊區塊集合。",
    },
    "accordion collapse expand disclosure radix sections",
  ),
  comp(
    "collapsible",
    { en: "Collapsible", "zh-CN": "可折叠区域", "zh-TW": "可摺疊區域" },
    {
      en: "An animated show/hide region with a trigger and content, built on Radix Collapsible.",
      "zh-CN": "基于 Radix Collapsible 的带动画显示/隐藏区域，含触发器与内容。",
      "zh-TW": "基於 Radix Collapsible 的帶動畫顯示/隱藏區域,含觸發器與內容。",
    },
    "collapsible expand collapse toggle disclosure show hide radix",
  ),

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
  pat(
    "stat-card",
    "StatCard",
    {
      en: "Canonical dashboard metric tile with icon, trend, tone, and layout variants.",
      "zh-CN": "标准仪表盘指标卡片，支持图标、趋势、色调和布局变体。",
      "zh-TW": "標準儀表板指標卡片，支援圖示、趨勢、色調與版面變體。",
    },
    "stat card metric dashboard kpi tile trend tone inline valueFirst",
  ),
  pat(
    "faq",
    "FAQ",
    {
      en: "Accordion list of questions where one item expands at a time.",
      "zh-CN": "手风琴式问题列表，每次展开一项。",
      "zh-TW": "手風琴式問題清單，每次展開一項。",
    },
    "faq accordion questions collapse expand",
  ),
  pat(
    "fellows-banner",
    "FellowsBanner",
    {
      en: "Clickable gradient promo banner with title, features, and a CTA.",
      "zh-CN": "可点击的渐变推广横幅，含标题、特性列表和行动号召。",
      "zh-TW": "可點擊的漸層推廣橫幅，含標題、特性清單與行動呼籲。",
    },
    "banner promo cta fellows callout upgrade",
  ),
  pat(
    "page-header",
    "PageHeader",
    {
      en: "Page title block with heading, description, and an actions slot.",
      "zh-CN": "页面标题区块，含标题、描述和操作插槽。",
      "zh-TW": "頁面標題區塊，含標題、描述與操作插槽。",
    },
    "page header title heading actions toolbar",
  ),
  pat(
    "sidebar",
    "Sidebar",
    {
      en: "App navigation sidebar with grouped sections, mobile drawer, and collapse.",
      "zh-CN": "应用导航侧边栏，含分组导航、移动端抽屉和折叠。",
      "zh-TW": "應用導覽側邊欄，含分組導覽、行動裝置抽屜與收合。",
    },
    "sidebar navigation nav drawer menu collapse",
  ),
  pat(
    "code-block",
    "CodeBlock",
    {
      en: "Styled code block with header, line numbers, tabs, and copy.",
      "zh-CN": "带样式的代码块，含标题、行号、标签页和复制。",
      "zh-TW": "帶樣式的程式碼區塊，含標頭、行號、分頁與複製。",
    },
    "code block syntax highlight copy tabs snippet",
  ),
  pat(
    "error-boundary",
    "ErrorBoundary",
    {
      en: "React error boundary with a friendly retry fallback.",
      "zh-CN": "React 错误边界，提供友好的重试回退界面。",
      "zh-TW": "React 錯誤邊界，提供友善的重試後備介面。",
    },
    "error boundary fallback retry crash react",
  ),
  pat(
    "badges",
    "Badges",
    {
      en: "Self-labeling status badges: fellow, capability, status, source, active, deprecated.",
      "zh-CN": "自带标签的状态徽章：会员、能力、状态、来源、激活、弃用。",
      "zh-TW": "自帶標籤的狀態徽章：會員、能力、狀態、來源、啟用、淘汰。",
    },
    "badge status capability label tag pill fellow source deprecated",
  ),
  pat(
    "page-state",
    { en: "Page State", "zh-CN": "页面状态", "zh-TW": "頁面狀態" },
    {
      en: "Centered loading, error, and empty placeholders for page lifecycles.",
      "zh-CN": "用于页面生命周期的居中加载、错误和空状态占位。",
      "zh-TW": "用於頁面生命週期的置中載入、錯誤與空狀態佔位。",
    },
    "loading error empty state placeholder page lifecycle",
  ),
  pat(
    "account-locked-card",
    { en: "Account Locked Card", "zh-CN": "账户锁定卡片", "zh-TW": "帳戶鎖定卡片" },
    {
      en: "A full-screen card for terminal account-locked auth screens (banned or suspended).",
      "zh-CN": "用于账户锁定终态认证页面（封禁或停用）的全屏卡片。",
      "zh-TW": "用於帳戶鎖定終態認證頁面（封禁或停用）的全螢幕卡片。",
    },
    "account locked suspended banned auth terminal screen logout",
  ),
  pat(
    "media-page-header",
    { en: "Media Page Header", "zh-CN": "媒体页头", "zh-TW": "媒體頁首" },
    {
      en: "Page-level building blocks for media library screens: header, empty, loading and error states.",
      "zh-CN": "媒体库页面的页面级构件：页头、空状态、加载状态和错误状态。",
      "zh-TW": "媒體庫頁面的頁面級元件：頁首、空狀態、載入狀態和錯誤狀態。",
    },
    "media library page header sync empty state loading state error state",
  ),
  pat(
    "background-effects",
    { en: "Background Effects", "zh-CN": "背景效果", "zh-TW": "背景效果" },
    {
      en: "A decorative full-bleed dotted-grid background layer masked to a soft radial vignette.",
      "zh-CN": "装饰性的全幅细点网格背景层，带柔和径向渐隐遮罩。",
      "zh-TW": "裝飾性的全幅細點網格背景層，帶柔和徑向漸隱遮罩。",
    },
    "background decorative dotted grid vignette hero visual effect",
  ),
  pat(
    "blog-card",
    { en: "Blog Card", "zh-CN": "博客卡片", "zh-TW": "部落格卡片" },
    {
      en: "A blog post preview card with cover image, category, meta row, and tags.",
      "zh-CN": "带封面图、分类、元信息行和标签的博客文章预览卡片。",
      "zh-TW": "帶封面圖、分類、中繼資訊列和標籤的部落格文章預覽卡片。",
    },
    "blog post card preview cover image tags featured",
  ),
  pat(
    "blog-post-header",
    { en: "Blog Post Header", "zh-CN": "博客文章页头", "zh-TW": "部落格文章頁首" },
    {
      en: "The header block for a single blog post: category, title, description, meta, cover, and tags.",
      "zh-CN": "单篇博客文章的页头区块：分类、标题、描述、元信息、封面和标签。",
      "zh-TW": "單篇部落格文章的頁首區塊：分類、標題、描述、中繼資訊、封面和標籤。",
    },
    "blog post header article header cover image author tags",
  ),
  pat(
    "blog-pagination",
    { en: "Blog Pagination", "zh-CN": "博客分页", "zh-TW": "部落格分頁" },
    {
      en: "A compact controlled page navigator with prev/next and windowed numbered pages.",
      "zh-CN": "紧凑的受控分页器，含上一页/下一页和滑动页码区间。",
      "zh-TW": "精簡的受控分頁器，含上一頁/下一頁和滑動頁碼區間。",
    },
    "pagination blog page navigator prev next controlled",
  ),
  pat(
    "simple-pagination",
    { en: "Simple Pagination", "zh-CN": "简单分页", "zh-TW": "簡單分頁" },
    {
      en: "A prev / page-indicator / next pager for cursor- or has-more lists where the total page count isn't known.",
      "zh-CN": "用于游标式或 has-more 列表（总页数未知）的上一页 / 页码指示 / 下一页分页器。",
      "zh-TW": "用於游標式或 has-more 清單（總頁數未知）的上一頁 / 頁碼指示 / 下一頁分頁器。",
    },
    "pagination simple cursor has-more page navigator prev next controlled no total",
  ),
  pat(
    "session-item",
    { en: "Session Item", "zh-CN": "会话项", "zh-TW": "工作階段項" },
    {
      en: "A row in an active-sessions / signed-in-devices list — device glyph, name with current/inactive badges, browser·OS, IP + last-seen, and a revoke button.",
      "zh-CN": "活跃会话 / 已登录设备列表中的一行——设备图标、带当前/失效徽章的名称、浏览器·系统、IP + 最后活动，以及吊销按钮。",
      "zh-TW": "活躍工作階段 / 已登入裝置清單中的一列——裝置圖示、帶目前/失效徽章的名稱、瀏覽器·系統、IP + 最後活動，以及撤銷按鈕。",
    },
    "session device sign-in active revoke security browser os ip current inactive",
  ),
  pat(
    "metric-bar",
    { en: "Metric Bar", "zh-CN": "指标条", "zh-TW": "指標條" },
    {
      en: "A labelled row with a thin proportion bar for 'top N' breakdowns — spend by provider, usage by category, storage by bucket. Icon/dot, label, value, colored bar.",
      "zh-CN": "带细比例条的标签行，用于「Top N」分解——按供应商花费、按分类用量、按存储桶容量。图标/色点、标签、数值、彩色条。",
      "zh-TW": "帶細比例條的標籤列，用於「Top N」分解——按供應商花費、按分類用量、按儲存桶容量。圖示/色點、標籤、數值、彩色條。",
    },
    "metric bar usage breakdown proportion progress spend provider category top analytics",
  ),
  pat(
    "feature-locked-state",
    { en: "Feature Locked State", "zh-CN": "功能锁定状态", "zh-TW": "功能鎖定狀態" },
    {
      en: "The centered 'feature unavailable' screen — an icon medallion, title, description, and an optional dashed restricted-note card. Render as a feature-flag fallback.",
      "zh-CN": "居中的「功能不可用」界面——图标徽章、标题、描述与可选的虚线受限提示卡。作为功能开关的回退渲染。",
      "zh-TW": "置中的「功能不可用」畫面——圖示徽章、標題、描述與可選的虛線受限提示卡。作為功能開關的後備渲染。",
    },
    "feature locked restricted gate flag unavailable upgrade empty state access",
  ),
  pat(
    "banner",
    { en: "Banner", "zh-CN": "横幅", "zh-TW": "橫幅" },
    {
      en: "A tinted horizontal banner row (info / warning / critical / success) with an icon, title, inline description, meta, actions and an optional dismiss — for announcements, releases and verification prompts.",
      "zh-CN": "彩色横幅条（info / warning / critical / success），含图标、标题、内联描述、元信息、操作与可选关闭——用于公告、版本发布与验证提示。",
      "zh-TW": "彩色橫幅條（info / warning / critical / success），含圖示、標題、內聯描述、中繼資訊、操作與可選關閉——用於公告、版本發布與驗證提示。",
    },
    "banner announcement release notice alert tone dismissible info warning critical success",
  ),
  pat(
    "notification",
    { en: "Notification", "zh-CN": "通知", "zh-TW": "通知" },
    {
      en: "Presentational notification center pieces — a bell with an unread badge, a notification row, and the dropdown panel chrome. The host owns data.",
      "zh-CN": "通知中心的展示型部件——带未读徽章的铃铛、通知行，以及下拉面板外壳。数据由宿主负责。",
      "zh-TW": "通知中心的展示型部件——帶未讀徽章的鈴鐺、通知列,以及下拉面板外殼。資料由宿主負責。",
    },
    "notification bell badge unread dropdown panel item toast alert center",
  ),
  pat(
    "setting-row",
    { en: "Setting Row", "zh-CN": "设置行", "zh-TW": "設定列" },
    {
      en: "One labelled row in a settings / preferences list — a title, optional description, and a trailing control slot (Switch, Select, button). Stack several; a divider separates them.",
      "zh-CN": "设置 / 偏好列表中的一行——标题、可选描述与尾部控件槽（Switch、Select、按钮）。可堆叠多行,分隔线自动区隔。",
      "zh-TW": "設定 / 偏好清單中的一列——標題、可選描述與尾端控制項槽（Switch、Select、按鈕）。可堆疊多列,分隔線自動區隔。",
    },
    "setting preference row toggle switch control option list divider profile",
  ),
  pat(
    "link-row",
    { en: "Link Row", "zh-CN": "链接行", "zh-TW": "連結列" },
    {
      en: "A tappable row that links somewhere — leading icon, title + description, trailing chevron. For support links, settings navigation, 'manage X' entries. External links open a new tab; internal use the adapter Link.",
      "zh-CN": "可点击的导航行——前置图标、标题 + 描述、尾部箭头。用于支持链接、设置导航、「管理 X」入口。外链新开标签页,内链走适配器 Link。",
      "zh-TW": "可點擊的導覽列——前置圖示、標題 + 描述、尾端箭頭。用於支援連結、設定導覽、「管理 X」入口。外連新開分頁,內連走轉接器 Link。",
    },
    "link row navigation chevron support settings external anchor list profile",
  ),
  pat(
    "connected-account-row",
    { en: "Connected Account Row", "zh-CN": "已连接账户行", "zh-TW": "已連結帳戶列" },
    {
      en: "A row in a connected-accounts / integrations list — a provider avatar (image or glyph in a ring) with a badge overlay, name + sub-name, detail line, connected-time footer, and an unlink button.",
      "zh-CN": "已连接账户 / 集成列表中的一行——供应商头像（图片或环中图标）带徽章叠加、名称 + 副名、详情行、连接时间页脚与解绑按钮。",
      "zh-TW": "已連結帳戶 / 整合清單中的一列——供應商頭像（圖片或環中圖示）帶徽章疊加、名稱 + 副名、詳情列、連結時間頁尾與解除綁定按鈕。",
    },
    "connected account oauth integration provider unlink avatar badge social github google profile",
  ),
  pat(
    "avatar-uploader",
    { en: "Avatar Uploader", "zh-CN": "头像上传", "zh-TW": "頭像上傳" },
    {
      en: "A clickable avatar that opens a file picker — shows the image or an initials fallback, a camera overlay on hover, and a spinner while uploading. The host owns the upload.",
      "zh-CN": "可点击的头像,点击打开文件选择器——显示图片或首字母回退、悬停时相机叠层、上传时加载转圈。上传由宿主负责。",
      "zh-TW": "可點擊的頭像,點擊開啟檔案選擇器——顯示圖片或首字母後備、懸停時相機疊層、上傳時載入轉圈。上傳由主端負責。",
    },
    "avatar uploader image upload file picker camera profile picture initials fallback",
  ),
  pat(
    "category-filter",
    { en: "Category Filter", "zh-CN": "分类筛选", "zh-TW": "分類篩選" },
    {
      en: "A row of pill buttons for filtering a list by category, with an all-posts button.",
      "zh-CN": "用于按分类筛选列表的胶囊按钮组，含全部文章按钮。",
      "zh-TW": "用於按分類篩選列表的膠囊按鈕組，含全部文章按鈕。",
    },
    "category filter blog pills tabs controlled filter",
  ),
  pat(
    "code-demo",
    { en: "Code Demo", "zh-CN": "代码示例", "zh-TW": "程式碼範例" },
    {
      en: "A ready-made tabbed code sample for calling an OpenAI-compatible API (Python, Node.js, cURL).",
      "zh-CN": "开箱即用的多标签代码示例，演示调用兼容 OpenAI 的 API（Python、Node.js、cURL）。",
      "zh-TW": "開箱即用的多標籤程式碼範例，示範呼叫相容 OpenAI 的 API（Python、Node.js、cURL）。",
    },
    "code demo code block tabs api example quickstart snippet",
  ),
  pat(
    "docs-actions",
    { en: "Docs Actions", "zh-CN": "文档操作", "zh-TW": "文件操作" },
    {
      en: "Documentation page header controls: copy-as-Markdown and view/edit links.",
      "zh-CN": "文档页面头部控件：复制为 Markdown 以及查看/编辑链接。",
      "zh-TW": "文件頁面標頭控制項：複製為 Markdown 以及檢視/編輯連結。",
    },
    "docs actions copy markdown llm view options github edit page header",
  ),

  // ---- AI -----------------------------------------------------------------
  aiDoc(
    "model-card",
    { en: "Model Card", "zh-CN": "模型卡片", "zh-TW": "模型卡片" },
    {
      en: "A card summarizing an AI model — icon, capabilities, ids, and a developer/context/price footer.",
      "zh-CN": "概览 AI 模型的卡片——图标、能力、id 以及开发者/上下文/价格页脚。",
      "zh-TW": "概覽 AI 模型的卡片——圖示、能力、id 以及開發者/上下文/價格頁尾。",
    },
    "model card ai model capabilities provider llm",
  ),
  aiDoc(
    "model-select",
    { en: "Model Select", "zh-CN": "模型选择器", "zh-TW": "模型選擇器" },
    {
      en: "A searchable, groupable model picker with capability filters and controlled pinning.",
      "zh-CN": "可搜索、可分组的模型选择器，支持能力筛选与受控固定。",
      "zh-TW": "可搜尋、可分組的模型選擇器，支援能力篩選與受控釘選。",
    },
    "model select picker dropdown search filter pin ai llm provider",
  ),
  aiDoc(
    "model-manager-card",
    { en: "Model Manager Card", "zh-CN": "模型管理卡片", "zh-TW": "模型管理卡片" },
    {
      en: "A dense admin model row rendered as a card — select, icon, name + ids, a 2-column spec grid, capabilities, and row actions; every admin-table column, top-to-bottom.",
      "zh-CN": "将一行密集的管理后台模型行渲染成卡片——选择、图标、名称 + id、两列规格网格、能力与行操作；后台表格的每一列，自上而下。",
      "zh-TW": "將一列密集的管理後台模型列渲染成卡片——選擇、圖示、名稱 + id、兩欄規格網格、能力與列操作；後台表格的每一欄，自上而下。",
    },
    "model manager card admin table row spec grid capabilities actions select slots",
  ),
  aiDoc(
    "provider-icon",
    { en: "Provider Icon", "zh-CN": "提供商图标", "zh-TW": "提供商圖示" },
    {
      en: "Icons for AI providers and models, resolved by id — ProviderIcon, ModelIcon, avatars, and type icons.",
      "zh-CN": "按 id 解析的 AI 提供商与模型图标——ProviderIcon、ModelIcon、头像与类型图标。",
      "zh-TW": "按 id 解析的 AI 提供商與模型圖示——ProviderIcon、ModelIcon、頭像與類型圖示。",
    },
    "provider icon model icon avatar logo openai anthropic google",
  ),
  aiDoc(
    "capability-selector",
    { en: "Capability Selector", "zh-CN": "能力选择器", "zh-TW": "能力選擇器" },
    {
      en: "A controlled multi-select grid of toggleable model capabilities that adapts to the model type.",
      "zh-CN": "受控的模型能力多选网格，随模型类型自适应。",
      "zh-TW": "受控的模型能力多選網格，隨模型類型自適應。",
    },
    "capability selector capabilities multi-select model type toggle",
  ),
  aiDoc(
    "capability-badge",
    { en: "Capability Badge", "zh-CN": "能力徽章", "zh-TW": "能力徽章" },
    {
      en: "Stateless renderers for a model capability — CapabilityIcon (glyph) and CapabilityBadge (tinted pill + label).",
      "zh-CN": "呈现模型能力的无状态组件——CapabilityIcon（图示）与 CapabilityBadge（带色调胶囊 + 标签）。",
      "zh-TW": "呈現模型能力的無狀態元件——CapabilityIcon（符號）與 CapabilityBadge（帶色調膠囊 + 標籤）。",
    },
    "capability badge icon glyph pill model vision thinking streaming function calling",
  ),
  aiDoc(
    "thinking-block",
    { en: "Thinking Block", "zh-CN": "思考块", "zh-TW": "思考區塊" },
    {
      en: "A collapsible panel for a model's reasoning trace, with a live streaming indicator.",
      "zh-CN": "用于模型推理过程的可折叠面板，带有实时流式指示。",
      "zh-TW": "用於模型推理過程的可折疊面板，帶有即時串流指示。",
    },
    "thinking block reasoning chain of thought streaming collapsible",
  ),
  aiDoc(
    "id-badge",
    { en: "ID Badge", "zh-CN": "ID 徽章", "zh-TW": "ID 徽章" },
    {
      en: "A compact monospace, click-to-copy badge for ids, keys, and tokens.",
      "zh-CN": "用于 id、密钥与令牌的紧凑等宽、点击复制徽章。",
      "zh-TW": "用於 id、金鑰與權杖的緊湊等寬、點擊複製徽章。",
    },
    "id badge copy clipboard monospace token",
  ),
  aiDoc(
    "navbar",
    { en: "Navbar", "zh-CN": "导航栏", "zh-TW": "導覽列" },
    {
      en: "A floating top navigation bar with scroll-spy links, control slots, auth buttons, and a mobile menu.",
      "zh-CN": "悬浮顶部导航栏，含滚动监听链接、控件插槽、认证按钮与移动端菜单。",
      "zh-TW": "懸浮頂部導覽列，含捲動監聽連結、控制項插槽、驗證按鈕與行動端選單。",
    },
    "navbar navigation header scroll spy mobile menu",
  ),
  aiDoc(
    "footer",
    { en: "Footer", "zh-CN": "页脚", "zh-TW": "頁尾" },
    {
      en: "A site footer with a brand block, link columns, copyright, and social icon links.",
      "zh-CN": "站点页脚，含品牌区块、链接栏、版权与社交图标链接。",
      "zh-TW": "網站頁尾，含品牌區塊、連結欄、版權與社群圖示連結。",
    },
    "footer site footer links social copyright",
  ),
  aiDoc(
    "language-switcher",
    { en: "Language Switcher", "zh-CN": "语言切换器", "zh-TW": "語言切換器" },
    {
      en: "A controlled locale picker dropdown in icon and pill variants; the host owns the locale change.",
      "zh-CN": "受控的语言选择下拉菜单，提供 icon 与 pill 变体；语言切换由宿主负责。",
      "zh-TW": "受控的語言選擇下拉選單，提供 icon 與 pill 變體；語言切換由宿主負責。",
    },
    "language switcher locale i18n dropdown translation",
  ),
];

/** Sidebar grouping, in display order. Slugs reference the manifest by key. */
export const groups: DocGroup[] = [
  {
    title: { en: "Getting Started", "zh-CN": "快速开始", "zh-TW": "快速開始" },
    pages: ["", "components"],
  },
  {
    title: { en: "Buttons & Actions", "zh-CN": "按钮与操作", "zh-TW": "按鈕與操作" },
    pages: [
      "components/button",
      "components/icon-button",
      "components/shiny-button",
      "components/theme-toggle",
    ],
  },
  {
    title: { en: "Forms & Inputs", "zh-CN": "表单与输入", "zh-TW": "表單與輸入" },
    pages: [
      "components/input",
      "components/textarea",
      "components/label",
      "components/checkbox",
      "components/switch",
      "components/radio-group",
      "components/slider",
      "components/select",
      "components/combobox",
      "components/custom-select",
      "components/segmented-select",
    ],
  },
  {
    title: { en: "Layout", "zh-CN": "布局", "zh-TW": "佈局" },
    pages: ["components/flex", "components/grid", "components/bento-grid"],
  },
  {
    title: { en: "Data Display", "zh-CN": "数据展示", "zh-TW": "資料展示" },
    pages: [
      "components/card",
      "components/badge",
      "components/avatar",
      "components/table",
      "components/animated-number",
      "components/marquee",
    ],
  },
  {
    title: { en: "Navigation", "zh-CN": "导航", "zh-TW": "導覽" },
    pages: [
      "components/tabs",
      "components/nav-tabs",
      "components/breadcrumb",
      "components/pagination",
      "components/dropdown-menu",
    ],
  },
  {
    title: { en: "Overlays", "zh-CN": "浮层", "zh-TW": "浮層" },
    pages: [
      "components/dialog",
      "components/modal",
      "components/sheet",
      "components/popover",
      "components/tooltip",
      "components/confirm-modal",
      "components/toast",
    ],
  },
  {
    title: { en: "Feedback", "zh-CN": "反馈", "zh-TW": "回饋" },
    pages: [
      "components/progress",
      "components/spinner",
      "components/skeleton",
      "components/page-loader",
      "components/empty-state",
      "components/inline-status",
    ],
  },
  {
    title: { en: "Disclosure", "zh-CN": "折叠展示", "zh-TW": "摺疊展示" },
    pages: ["components/accordion", "components/collapsible"],
  },
  {
    title: { en: "Patterns", "zh-CN": "模式", "zh-TW": "模式" },
    pages: [
      "patterns",
      "patterns/stat-card",
      "patterns/faq",
      "patterns/fellows-banner",
      "patterns/page-header",
      "patterns/sidebar",
      "patterns/code-block",
      "patterns/error-boundary",
      "patterns/badges",
      "patterns/page-state",
      "patterns/account-locked-card",
      "patterns/media-page-header",
      "patterns/background-effects",
      "patterns/blog-card",
      "patterns/blog-post-header",
      "patterns/blog-pagination",
      "patterns/simple-pagination",
      "patterns/banner",
      "patterns/feature-locked-state",
      "patterns/session-item",
      "patterns/metric-bar",
      "patterns/notification",
      "patterns/setting-row",
      "patterns/link-row",
      "patterns/connected-account-row",
      "patterns/avatar-uploader",
      "patterns/category-filter",
      "patterns/code-demo",
      "patterns/docs-actions",
    ],
  },
  {
    title: { en: "AI", "zh-CN": "AI", "zh-TW": "AI" },
    pages: [
      "ai/model-card",
      "ai/model-select",
      "ai/model-manager-card",
      "ai/provider-icon",
      "ai/capability-selector",
      "ai/capability-badge",
      "ai/thinking-block",
      "ai/id-badge",
      "ai/navbar",
      "ai/footer",
      "ai/language-switcher",
    ],
  },
];

export function getDoc(slugs: string[] | undefined): DocEntry | undefined {
  const key = slugKey(slugs ?? []);
  return docs.find((d) => slugKey(d.slugs) === key);
}
