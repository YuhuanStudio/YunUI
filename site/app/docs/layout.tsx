import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/lib/source";
import { Logo } from "@/components/logo";

/**
 * Docs chrome: fumadocs DocsLayout provides the sidebar (from our manifest
 * `pageTree`), the search trigger, and the responsive doc shell. The fumadocs
 * RootProvider (search + theme context) is mounted once in app/providers.tsx.
 */
export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: (
          <Logo
            size={22}
            suffix={<span className="ml-1 text-muted-foreground font-normal">Docs</span>}
          />
        ),
        url: "/",
      }}
      sidebar={{ defaultOpenLevel: 1 }}
    >
      {children}
    </DocsLayout>
  );
}
