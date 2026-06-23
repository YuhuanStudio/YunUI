import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import type { TableOfContents } from "fumadocs-core/toc";
import { getMDXComponents } from "@/mdx-components";
import { docs, getDoc } from "@/lib/docs";

export const dynamicParams = false;

// rehype-toc exports its items with a hast `title` element; the DocsPage TOC
// wants a renderable title, so flatten the hast node to plain text.
interface HastNode {
  type?: string;
  value?: string;
  children?: HastNode[];
}
function hastText(node: HastNode | string | undefined): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

interface RawTocItem {
  title: HastNode;
  url: string;
  depth: number;
}

function normalizeToc(raw: unknown): TableOfContents {
  if (!Array.isArray(raw)) return [];
  return (raw as RawTocItem[]).map((item) => ({
    title: hastText(item.title),
    url: item.url,
    depth: item.depth,
  }));
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const entry = getDoc(slug);
  if (!entry) notFound();

  const mod = await entry.load();
  const MDX = mod.default;
  const toc = normalizeToc(mod.toc);

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{entry.title}</DocsTitle>
      <DocsDescription>{entry.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
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
  return {
    title: `${entry.title} — YunUI`,
    description: entry.description,
  };
}
