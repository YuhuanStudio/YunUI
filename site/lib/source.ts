/**
 * source.ts — fumadocs page tree + search source, built from the manifest.
 *
 * We don't use fumadocs-mdx here (its published version trails the v16 core);
 * instead we build the sidebar `PageTree.Root` directly from the manifest, and
 * feed a hand-built virtual file source to fumadocs' `loader` so that
 * `createFromSource` can produce a search index. MDX bodies are compiled
 * separately by @next/mdx and loaded per-route via the manifest's `load()`.
 */
import { loader } from "fumadocs-core/source";
import type { VirtualFile, PageData } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { docs, groups, slugKey, getDoc, resolveLocalized } from "./docs";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

interface DocPageData extends PageData {
  title: string;
  description: string;
}

const docUrl = (key: string): string => (key === "" ? "/docs" : `/docs/${key}`);

// ---- Sidebar tree (consumed by DocsLayout) --------------------------------
// Built per-locale so sidebar group + page titles localize with the client
// locale. `buildPageTree(locale)` is called by the client DocsLayout wrapper
// (app/docs/docs-shell.tsx) on every locale change; `pageTree` is the default
// (English) tree used for any non-localized render path.

export function buildPageTree(locale: Locale): PageTree.Root {
  return {
    name: "YunUI",
    children: groups.map((g) => ({
      type: "folder",
      name: resolveLocalized(g.title, locale),
      children: g.pages.map((key) => {
        const entry = getDoc(key === "" ? [] : key.split("/"));
        return {
          type: "page",
          name: entry ? resolveLocalized(entry.title, locale) : key,
          url: docUrl(key),
        } satisfies PageTree.Item;
      }),
    })),
  };
}

export const pageTree: PageTree.Root = buildPageTree(DEFAULT_LOCALE);

// ---- Search source --------------------------------------------------------
// One virtual page per manifest entry. `structuredData` powers fumadocs' static
// search (title + description + keywords as a single searchable contents blob).

const pages: VirtualFile<{ pageData: DocPageData; metaData: never }>[] = docs.map(
  (d) => {
    // The static search index is built once at module load; resolve to the
    // default (English) locale. Per-page `keywords` cover search recall.
    const title = resolveLocalized(d.title, DEFAULT_LOCALE);
    const description = resolveLocalized(d.description, DEFAULT_LOCALE);
    return {
      type: "page",
      path: d.slugs.length === 0 ? "index.mdx" : `${slugKey(d.slugs)}.mdx`,
      slugs: d.slugs,
      data: {
        title,
        description,
        structuredData: {
          headings: [],
          contents: [
            {
              heading: undefined,
              content: `${title}. ${description} ${d.keywords ?? ""}`.trim(),
            },
          ],
        },
      },
    };
  },
);

export const source = loader({
  source: { files: pages },
  baseUrl: "/docs",
});
