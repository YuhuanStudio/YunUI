/**
 * docs.ts — the YunUI documentation manifest.
 *
 * One entry per MDX page under `content/docs/`. This is the single source of
 * truth for: the fumadocs sidebar tree, page metadata (title/description),
 * the search index, and the slug → MDX-module loader the route uses.
 *
 * To add a page: drop a new `content/docs/<path>.mdx` file, then add an entry
 * here (slug, title, description, load, and which sidebar group it belongs to).
 */
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";

/** Shape of a compiled MDX module (see mdx.d.ts). */
export interface MDXModule {
  default: ComponentType<{ components?: MDXComponents }>;
  toc?: unknown;
}

export interface DocEntry {
  /** URL slug segments under /docs (empty array = the /docs index). */
  slugs: string[];
  title: string;
  description: string;
  /** Lazy import of the compiled MDX module. */
  load: () => Promise<MDXModule>;
  /** Short search-text blob (headings/keywords) used to build the static index. */
  keywords?: string;
}

export interface DocGroup {
  title: string;
  /** Slugs (joined with "/") of pages in this sidebar group, in order. */
  pages: string[];
}

/** Join slugs into the manifest key used for lookups ("" for the index). */
export const slugKey = (slugs: string[]): string => slugs.join("/");

export const docs: DocEntry[] = [
  {
    slugs: [],
    title: "Getting Started",
    description:
      "Install YunUI, wire up Tailwind, and plug in the framework adapters.",
    load: () => import("@/content/docs/index.mdx"),
    keywords: "install tailwind source adapters provider getting started setup",
  },
  // ---- Components ---------------------------------------------------------
  {
    slugs: ["components"],
    title: "Components",
    description: "Every YunUI primitive, with live previews and prop tables.",
    load: () => import("@/content/docs/components/index.mdx"),
    keywords: "components overview primitives catalog",
  },
  {
    slugs: ["components", "button"],
    title: "Button",
    description:
      "Primary action button with variants, sizes, a loading spinner and asChild slotting.",
    load: () => import("@/content/docs/components/button.mdx"),
    keywords: "button variant size loading icon action primary secondary ghost",
  },
  {
    slugs: ["components", "card"],
    title: "Card",
    description: "Surface container rendering the canonical .card style.",
    load: () => import("@/content/docs/components/card.mdx"),
    keywords: "card surface container hover panel",
  },
  {
    slugs: ["components", "flex"],
    title: "Flex",
    description:
      "Flexbox layout primitive with token-mapped direction, align, justify, gap and padding.",
    load: () => import("@/content/docs/components/flex.mdx"),
    keywords: "flex layout flexbox direction align justify gap row column stack",
  },
  {
    slugs: ["components", "grid"],
    title: "Grid",
    description: "CSS-grid layout primitive with token-mapped columns, rows and gap.",
    load: () => import("@/content/docs/components/grid.mdx"),
    keywords: "grid layout columns rows gap css grid",
  },
  {
    slugs: ["components", "table"],
    title: "Table",
    description: "Semantic, presentational table family using design-system tokens.",
    load: () => import("@/content/docs/components/table.mdx"),
    keywords: "table thead tbody row cell data display",
  },
  {
    slugs: ["components", "accordion"],
    title: "Accordion",
    description: "Radix-backed vertically stacked set of collapsible sections.",
    load: () => import("@/content/docs/components/accordion.mdx"),
    keywords: "accordion collapse expand disclosure radix sections",
  },
  {
    slugs: ["components", "radio-group"],
    title: "Radio Group",
    description: "Radix RadioGroup — a single-choice set of radio items.",
    load: () => import("@/content/docs/components/radio-group.mdx"),
    keywords: "radio group single choice select option form control",
  },
  // ---- Patterns -----------------------------------------------------------
  {
    slugs: ["patterns"],
    title: "Patterns",
    description: "Higher-level, prop-driven page compositions built on the primitives.",
    load: () => import("@/content/docs/patterns/index.mdx"),
    keywords: "patterns page-level sidebar footer model card stat card blog",
  },
];

/** Sidebar grouping, in display order. Slugs reference the manifest by key. */
export const groups: DocGroup[] = [
  { title: "Getting Started", pages: [""] },
  {
    title: "Components",
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
  { title: "Patterns", pages: ["patterns"] },
];

export function getDoc(slugs: string[] | undefined): DocEntry | undefined {
  const key = slugKey(slugs ?? []);
  return docs.find((d) => slugKey(d.slugs) === key);
}
