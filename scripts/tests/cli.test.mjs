import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "scripts/yunui-cli.mjs");

async function put(cwd, relative, text) {
  const file = path.join(cwd, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
}

async function consumer(t) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-doctor-runtime-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await put(cwd, "package.json", JSON.stringify({
    name: "consumer-runtime-fixture",
    dependencies: { yunui: "npm:@yuhuanowo/yunui@^0.2.18", tailwindcss: "^4.0.0" },
  }));
  await put(cwd, "node_modules/yunui/package.json", JSON.stringify({
    name: "@yuhuanowo/yunui",
    version: "0.2.18",
    exports: { "./css": "./styles/yunui.css", "./content.css": "./styles/content.css" },
  }));
  await mkdir(path.join(cwd, "node_modules/yunui/dist"), { recursive: true });
  await put(cwd, "node_modules/yunui/styles/yunui.css", "/* base */");
  await put(cwd, "node_modules/yunui/styles/content.css", "/* content */");
  return cwd;
}

function doctor(cwd) {
  return spawnSync(process.execPath, [cli, "doctor", "--cwd", cwd, "--strict", "--json"], {
    cwd,
    encoding: "utf8",
    timeout: 10_000,
  });
}

test("strict doctor ignores test-only content imports and retains runtime stylesheet imports", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `import "../styles/global.css";\nimport { Button } from "yunui";\nexport const App = () => <Button>Save</Button>;`);
  await put(cwd, "src/__tests__/App.test.tsx", `import { MarkdownRenderer } from "yunui/content";\nimport "yunui/content.css";\nvoid MarkdownRenderer;`);
  await put(cwd, "styles/global.css", `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";`);

  const run = doctor(cwd);
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  const checks = Object.fromEntries(result.checks.map((check) => [check.id, check]));
  assert.equal(checks.styles.status, "ok");
  assert.equal(checks["tailwind-source"].status, "ok");
  assert.equal(checks["content-styles"].status, "note");
  assert.equal(result.strict.ok, true);
});

test("test-only CSS imports cannot make an unstyled runtime pass strict doctor", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `import { Button } from "yunui";\nexport const App = () => <Button>Save</Button>;`);
  await put(cwd, "src/__tests__/setup.test.tsx", `import "./setup.css";`);
  await put(cwd, "src/__tests__/setup.css", `@import "tailwindcss";\n@import "yunui/css";\n@source "../../node_modules/yunui/dist";`);

  const run = doctor(cwd);
  assert.equal(run.status, 1);
  const result = JSON.parse(run.stdout);
  const checks = Object.fromEntries(result.checks.map((check) => [check.id, check]));
  assert.equal(checks.styles.status, "unknown");
  assert.equal(checks["tailwind-source"].status, "unknown");
  assert.equal(result.strict.ok, false);
  assert.ok(result.strict.failures.includes("styles"));
  assert.ok(result.strict.failures.includes("tailwind-source"));
});

test("comments and quoted examples cannot masquerade as runtime imports", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `const example = 'import "../styles/global.css"; import "yunui/content.css"';\n/* import "./setup.css"; */\nexport const App = () => <main>{example}</main>;`);
  await put(cwd, "styles/global.css", `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";\n@import "yunui/content.css";`);

  const run = doctor(cwd);
  assert.equal(run.status, 1);
  const result = JSON.parse(run.stdout);
  const checks = Object.fromEntries(result.checks.map((check) => [check.id, check]));
  assert.equal(checks.styles.status, "unknown");
  assert.equal(checks["content-styles"].status, "note");
  assert.equal(result.strict.ok, false);
});

test("literal dynamic imports count as runtime package usage", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `import "../styles/global.css";\nvoid import("yunui/content");\nexport const App = () => <main>Ready</main>;`);
  await put(cwd, "styles/global.css", `@import "tailwindcss";\n@import "yunui/css";\n@import "yunui/content.css";\n@source "../node_modules/yunui/dist";`);

  const run = doctor(cwd);
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  assert.ok(result.checks.find((check) => check.id === "content-styles").contentImports.includes("yunui/content"));
  assert.equal(result.strict.ok, true);
});

test("type-only content imports do not require runtime content styles", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `import "../styles/global.css";\nimport type { MarkdownRendererProps } from "yunui/content";\nexport const App = (_props: MarkdownRendererProps) => <main>Core only</main>;`);
  await put(cwd, "styles/global.css", `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";`);

  const run = doctor(cwd);
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  assert.equal(result.checks.find((check) => check.id === "content-styles").status, "note");
  assert.equal(result.strict.ok, true);
});

test("HTML comments cannot activate a stylesheet, while a real link remains discoverable", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "index.html", `<!doctype html><!-- <link rel="stylesheet" href="./global.css"> -->`);
  await put(cwd, "global.css", `@import "tailwindcss";\n@import "yunui/css";\n@source "./node_modules/yunui/dist";`);
  await put(cwd, "src/App.tsx", `export const App = () => <main>Core only</main>;`);

  let run = doctor(cwd);
  assert.equal(run.status, 1);
  let result = JSON.parse(run.stdout);
  assert.equal(result.checks.find((check) => check.id === "styles").status, "unknown");
  assert.equal(result.strict.ok, false);

  await put(cwd, "index.html", `<!doctype html><html><head><link rel="stylesheet" href="./global.css"></head><body><div id="root"></div></body></html>`);
  run = doctor(cwd);
  assert.equal(run.status, 0, run.stderr);
  result = JSON.parse(run.stdout);
  assert.equal(result.checks.find((check) => check.id === "styles").status, "ok");
  assert.equal(result.checks.find((check) => check.id === "tailwind-source").status, "ok");
});

test("reference and research drafts cannot supply strict runtime CSS evidence", async (t) => {
  const cwd = await consumer(t);
  await put(cwd, "src/App.tsx", `import { Button } from "yunui";\nexport const App = () => <Button>Save</Button>;`);
  for (const folder of ["reference/example", "references/example", "research/draft"]) {
    await put(cwd, `${folder}/src/App.tsx`, `import "../styles/global.css";\nimport { Button } from "yunui";\nexport const Example = () => <Button>Reference</Button>;`);
    await put(cwd, `${folder}/styles/global.css`, `@import "tailwindcss";\n@import "yunui/css";\n@source "../../../node_modules/yunui/dist";`);
  }

  const run = doctor(cwd);
  assert.equal(run.status, 1);
  const result = JSON.parse(run.stdout);
  const checks = Object.fromEntries(result.checks.map((check) => [check.id, check]));
  assert.equal(checks.styles.status, "unknown");
  assert.equal(checks["tailwind-source"].status, "unknown");
  assert.equal(result.strict.ok, false);
});
