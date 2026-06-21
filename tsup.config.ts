import { defineConfig } from "tsup";
import { readFile, writeFile, readdir } from "node:fs/promises";

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
  // Code-split so shared modules (notably the adapter React context) are emitted
  // ONCE as a shared chunk and imported by every entry. Without this each entry
  // inlines its own copy of the context, so YunUIProvider and consumers end up on
  // different React contexts and injected adapters never reach components.
  splitting: true,
  external: ["react", "react-dom", "tailwindcss", "next", "next-themes"],
  // esbuild's bundler strips module-level "use client" directives. YunUI is an
  // all-client library, so re-add the directive to the top of every emitted .js
  // (entries AND shared chunks) so Next.js App Router treats them as client.
  async onSuccess() {
    const directive = '"use client";\n';
    const files = (await readdir("dist")).filter((f) => f.endsWith(".js"));
    for (const name of files) {
      const file = `dist/${name}`;
      const code = await readFile(file, "utf8");
      if (!code.startsWith(directive.trim())) {
        await writeFile(file, directive + code);
      }
    }
  },
});
