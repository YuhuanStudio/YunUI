import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import type { TableOfContents } from "fumadocs-core/toc";
import {
  docs,
  getDoc,
  resolveLocalized,
  type Localized,
  type MDXLoader,
  type MDXModule,
} from "@/lib/docs";
import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/i18n/config";
import { getMDXComponents } from "@/mdx-components";
import { LocalizedDoc, type LocaleDocContent } from "./localized-doc";

export const dynamicParams = false;

/**
 * Resolve the per-locale loader map for an entry. `load` is either a single
 * shared loader or a `{ en, "zh-CN"?, "zh-TW"? }` map. Returns one loader per
 * defined locale (locales without their own variant are omitted and fall back
 * to `en` at render time).
 */
function loaderMap(load: Localized<MDXLoader>): Partial<Record<Locale, MDXLoader>> {
  if (typeof load === "function") {
    return { [DEFAULT_LOCALE]: load } as Partial<Record<Locale, MDXLoader>>;
  }
  return load as Partial<Record<Locale, MDXLoader>>;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const entry = getDoc(slug);
  if (!entry) notFound();

  // Statically load + render every available locale variant at build time.
  // We render the MDX body to React elements *here* (server side) because a
  // compiled MDX component is a function and functions can't cross the RSC →
  // Client boundary. The client wrapper just picks the pre-rendered node for
  // the active locale, falling back to `en`.
  const loaders = loaderMap(entry.load);
  const components = getMDXComponents();
  const content: Partial<Record<Locale, LocaleDocContent>> = {};
  for (const locale of LOCALES) {
    const load = loaders[locale];
    if (!load) continue;
    const mod: MDXModule = await load();
    const Body = mod.default;
    content[locale] = {
      title: resolveLocalized(entry.title, locale),
      description: resolveLocalized(entry.description, locale),
      // fumadocs' rehypeToc already exports items in TableOfContents shape
      // (title is a renderable React node) — pass them straight through.
      toc: (mod.toc as TableOfContents | undefined) ?? [],
      body: <Body components={components} />,
    };
  }

  return <LocalizedDoc content={content} />;
}

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slugs.length === 0 ? undefined : d.slugs }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = getDoc(slug);
  if (!entry) return {};
  // Resolve the locale from the NEXT_LOCALE cookie so the <title>/description
  // match the language the page renders in.
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const title = resolveLocalized(entry.title, locale);
  const description = resolveLocalized(entry.description, locale);
  return {
    title: `${title} — YunUI`,
    description,
  };
}
