// Default-export wrapper so the plugin can be referenced by module path in the
// Turbopack MDX rule (Turbopack requires serializable loader options — i.e.
// string module specifiers, not imported function references).
export { remarkGfm as default } from "fumadocs-core/mdx-plugins/remark-gfm";
