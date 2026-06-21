import { defineConfig } from "tsup";
import { readFile, writeFile } from "node:fs/promises";

const ENTRY_OUTPUTS = [
  "dist/index.js",
  "dist/adapters.js",
  "dist/patterns.js",
  "dist/ai.js",
];

export default defineConfig({
  entry: {
    index: "src/index.ts",
    adapters: "src/adapters/index.ts",
    patterns: "src/patterns/index.ts",
    ai: "src/ai/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Self-contained entries: no shared chunks that would lose the directive.
  splitting: false,
  external: ["react", "react-dom", "tailwindcss", "next", "next-themes"],
  // esbuild's bundler strips module-level "use client" directives. Re-add the
  // directive to the top of every entry so Next.js App Router treats these as
  // client components (they all are).
  async onSuccess() {
    const directive = '"use client";\n';
    for (const file of ENTRY_OUTPUTS) {
      try {
        const code = await readFile(file, "utf8");
        if (!code.startsWith(directive.trim())) {
          await writeFile(file, directive + code);
        }
      } catch {
        // entry may be empty/absent (e.g. stub patterns/ai); ignore.
      }
    }
  },
});
