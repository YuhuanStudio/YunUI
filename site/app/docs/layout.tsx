import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/lib/source";

/**
 * Docs chrome: fumadocs DocsLayout provides the sidebar (from our manifest
 * `pageTree`), the search trigger, and the responsive doc shell. The fumadocs
 * RootProvider (search + theme context) is mounted once in app/providers.tsx.
 */
export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{ title: "YunUI Docs", url: "/" }}
      sidebar={{ defaultOpenLevel: 1 }}
    >
      {children}
    </DocsLayout>
  );
}
