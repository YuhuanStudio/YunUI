"use client";

// Client wrapper that renders the docs page in the active locale.
//
// There is no locale in the URL — the locale is resolved on the *server* from
// the NEXT_LOCALE cookie (see app/layout.tsx / app/locale-provider.tsx), so the
// initial server render is already in the right language. The server component
// pre-renders the compiled MDX body for *every* available locale variant and
// hands them all to this wrapper (as already-rendered React nodes — a compiled
// MDX component is a function and can't cross the RSC → Client boundary). This
// wrapper picks the node matching `useLocale()` — which equals the server locale
// on first paint (no flash), and lets the language switcher swap the body
// instantly with no reload. Falls back to English when a page lacks a variant.
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
