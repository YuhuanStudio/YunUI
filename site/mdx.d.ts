// Type declarations for MDX modules compiled by @next/mdx. Each module exports
// the rendered component as its default plus a `toc` constant (from rehypeToc).
declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "mdx/types";
  import type { TOCItemType } from "fumadocs-core/toc";

  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export const toc: TOCItemType[];
  export default MDXComponent;
}
