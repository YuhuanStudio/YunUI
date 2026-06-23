"use client";

// Client wrapper that renders the docs page in the active client locale.
//
// The site has no locale routing (it's a static export, locale lives in a
// cookie — see app/locale-provider.tsx). The server component pre-renders the
// compiled MDX body for every available locale variant and hands them all to
// this wrapper (as already-rendered React nodes — a compiled MDX component is
// a function and can't cross the RSC → Client boundary). This wrapper picks the
// node matching `useLocale()` and falls back to English when a page has no
// variant for the active locale.
//
// Only the prose (the MDX body) and the title/description are localized; the
// shared <ComponentPreview>/<PropsTable> demos and code samples live inside the
// MDX bodies and are kept identical across variants by convention.
import type { ReactNode } from "react";
import type { TableOfContents } from "fumadocs-core/toc";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { useLocale } from "@/app/locale-provider";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export interface LocaleDocContent {
  title: string;
  description: string;
  toc: TableOfContents;
  /** The MDX body, pre-rendered to React elements server-side. */
  body: ReactNode;
}

export function LocalizedDoc({
  content,
}: {
  content: Partial<Record<Locale, LocaleDocContent>>;
}) {
  const locale = useLocale();
  const active = content[locale] ?? content[DEFAULT_LOCALE];
  if (!active) return null;

  const { title, description, toc, body } = active;
  return (
    <DocsPage toc={toc}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  );
}
