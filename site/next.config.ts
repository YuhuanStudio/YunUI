import type { NextConfig } from "next";
import { resolve } from "node:path";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker: emits `.next/standalone` (server.js +
  // a minimal node_modules) so the runtime image needs neither pnpm nor a full
  // install. See site/Dockerfile + .github/workflows/deploy-site.yml.
  output: "standalone",
  // The site lives in a monorepo and imports the parent library (`yunui` → repo
  // root via symlink + dist/). Pin the trace root to the repo root so standalone
  // follows the symlink and bundles the library files it actually uses; without
  // this Next roots the trace at site/ and drops the parent's dist/styles.
  outputFileTracingRoot: resolve(import.meta.dirname, ".."),
  // Allow phones/other devices on the LAN to use the dev server. Next 15+ blocks
  // cross-origin /_next/* requests by default, so visiting http://<lan-ip>:3939
  // loads the HTML but never hydrates → "only localhost is interactive". Permit
  // the private LAN ranges so the client bundle/HMR load over the network too.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  // Treat .mdx as an importable page extension so the docs content tree
  // (content/docs/**/*.mdx) compiles via @next/mdx.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // The library is a workspace package shipping ESM + "use client"; let Next
  // transpile it so HMR works when you edit YunUI and rebuild its dist.
  transpilePackages: ["yunui"],
  // Pin the workspace root (a stray ~/pnpm-lock.yaml otherwise confuses Next).
  turbopack: {
    root: resolve(import.meta.dirname, ".."),
  },
  // Provider logos used in the icon-combobox demo.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.simpleicons.org" }],
  },
};

// Turbopack requires serializable loader options, so MDX plugins are referenced
// by ABSOLUTE module path (not imported function references). The @next/mdx
// loader resolves these from its own package dir, so a relative path won't
// work — use absolute paths into our wrapper modules. Each wrapper
// default-exports a fumadocs plugin:
//   - remarkHeading adds heading ids (anchor links)
//   - rehypeToc exports a `toc` constant from each MDX module (on-page TOC)
const plugin = (p: string) => resolve(import.meta.dirname, "lib/mdx-plugins", p);

const withMDX = createMDX({
  options: {
    remarkPlugins: [plugin("remark-demo-source.mjs"), plugin("remark-gfm.mjs"), plugin("remark-heading.mjs")],
    rehypePlugins: [[plugin("rehype-toc.mjs"), { exportToc: true }]],
  },
});

export default withMDX(nextConfig);
