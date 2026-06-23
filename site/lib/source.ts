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
import { docs, groups, slugKey, getDoc } from "./docs";

interface DocPageData extends PageData {
  title: string;
  description: string;
}

const docUrl = (key: string): string => (key === "" ? "/docs" : `/docs/${key}`);

// ---- Sidebar tree (consumed by DocsLayout) --------------------------------

export const pageTree: PageTree.Root = {
  name: "YunUI",
  children: groups.map((g) => ({
    type: "folder",
    name: g.title,
    children: g.pages.map((key) => {
      const entry = getDoc(key === "" ? [] : key.split("/"));
      return {
        type: "page",
        name: entry?.title ?? key,
        url: docUrl(key),
      } satisfies PageTree.Item;
    }),
  })),
};

// ---- Search source --------------------------------------------------------
// One virtual page per manifest entry. `structuredData` powers fumadocs' static
// search (title + description + keywords as a single searchable contents blob).

const pages: VirtualFile<{ pageData: DocPageData; metaData: never }>[] = docs.map(
  (d) => ({
    type: "page",
    path: d.slugs.length === 0 ? "index.mdx" : `${slugKey(d.slugs)}.mdx`,
    slugs: d.slugs,
    data: {
      title: d.title,
      description: d.description,
      structuredData: {
        headings: [],
        contents: [
          {
            heading: undefined,
            content: `${d.title}. ${d.description} ${d.keywords ?? ""}`.trim(),
          },
        ],
      },
    },
  }),
);

export const source = loader({
  source: { files: pages },
  baseUrl: "/docs",
});
