"use client";

// Client shell around fumadocs' DocsLayout so the sidebar (group + page
// titles) localizes with the active client locale. The page tree is rebuilt
// from the manifest on every locale change via `buildPageTree(locale)`.
import { useMemo, type ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { buildPageTree } from "@/lib/source";
import { Logo } from "@/components/logo";
import { useLocale } from "@/app/locale-provider";

export function DocsShell({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const tree = useMemo(() => buildPageTree(locale), [locale]);

  return (
    <DocsLayout
      tree={tree}
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
