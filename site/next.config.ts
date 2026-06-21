import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
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

export default nextConfig;
