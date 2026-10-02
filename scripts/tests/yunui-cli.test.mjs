import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "scripts/yunui-cli.mjs");
const catalogPath = path.join(root, "agent/catalog.generated.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

function runCli(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    timeout: 10_000,
  });
}

async function writeFileAt(cwd, relativePath, content) {
  const filename = path.join(cwd, relativePath);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, content);
}

async function makeAliasProject({ css, source, dependencies = { yunui: "npm:@yuhuanowo/yunui@^0.2.18", tailwindcss: "^4.0.0" } }) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-cli-")).then((value) => value);
  await writeFileAt(cwd, "package.json", JSON.stringify({ name: "consumer-fixture", dependencies }, null, 2));
  await writeFileAt(cwd, "node_modules/yunui/package.json", JSON.stringify({
    name: "@yuhuanowo/yunui",
    version: "0.2.18",
    exports: { "./css": "./styles/yunui.css", "./content.css": "./styles/content.css" },
  }));
  await mkdir(path.join(cwd, "node_modules/yunui/dist"), { recursive: true });
  await writeFileAt(cwd, "node_modules/yunui/styles/yunui.css", "/* fixture base CSS */");
  await writeFileAt(cwd, "node_modules/yunui/styles/content.css", "/* fixture content CSS */");
  await writeFileAt(cwd, "styles/global.css", css);
  if (source) await writeFileAt(cwd, "src/app.tsx", source);
  return cwd;
}

async function listTree(directory) {
  const result = [];
  async function visit(current, relative = "") {
    for (const item of (await readdir(current, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const itemPath = path.join(current, item.name);
      const itemRelative = path.join(relative, item.name);
      if (item.isDirectory()) await visit(itemPath, itemRelative);
      else result.push([itemRelative, await readFile(itemPath, "utf8")]);
    }
  }
  await visit(directory);
  return result;
}

test("catalogue records real public exports, aliases, type-only imports, and docs paths", () => {
  const markdown = catalog.exports.find((item) => item.entry === "./content" && item.name === "MarkdownRenderer");
  const type = catalog.exports.find((item) => item.entry === "./content" && item.name === "MarkdownRendererProps");
  const alias = catalog.exports.find((item) => item.entry === "." && item.name === "Tbody");
  const button = catalog.exports.find((item) => item.entry === "." && item.name === "Button");
  const pageHeader = catalog.exports.find((item) => item.entry === "./patterns" && item.name === "PageHeader");
  const chatComposer = catalog.exports.find((item) => item.entry === "./chat" && item.name === "ChatComposer");
  assert.ok(markdown);
  assert.equal(markdown.import, 'import { MarkdownRenderer } from "@yuhuanowo/yunui/content";');
  assert.equal(markdown.docs.component.path, "site/content/docs/content/markdown-renderer.mdx");
  assert.ok(type.typeOnly);
  assert.match(type.import, /^import type \{ MarkdownRendererProps \}/);
  assert.ok(alias);
  assert.match(alias.import, /\{ Tbody \}/);
  const variant = button.propsFields.find((field) => field.name === "variant");
  assert.ok(variant.type.includes('"primary"'));
  assert.ok(variant.description.includes("Visual style"));
  assert.equal(variant.default, '"default"');
  assert.equal(pageHeader.propsFields.find((field) => field.name === "description").type, "string | undefined");
  assert.equal(chatComposer.propsFields.find((field) => field.name === "onSend").required, true);
  assert.equal(chatComposer.propsFields.find((field) => field.name === "value").type, "string");
  assert.ok(catalog.resources.some((resource) => resource.entry === "./css"));
  assert.ok(catalog.guides.some((guide) => guide.path === "agent/skills/yunui/SKILL.md"));
  for (const item of catalog.exports) {
    assert.ok(existsSync(path.join(root, item.docs.overview.path)), `${item.name} overview docs path must exist`);
    if (item.docs.component) assert.ok(existsSync(path.join(root, item.docs.component.path)), `${item.name} component docs path must exist`);
  }
});

test("catalogue generation is deterministic", () => {
  const before = readFileSync(catalogPath, "utf8");
  const generated = spawnSync(process.execPath, [path.join(root, "scripts/gen-agent-catalog.mjs")], {
    cwd: root,
    encoding: "utf8",
    timeout: 30_000,
  });
  assert.equal(generated.status, 0, generated.stderr);
  assert.equal(readFileSync(catalogPath, "utf8"), before);
});

test("list, find, and info read only the generated catalogue and show alias imports for the cwd", async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-cli-catalog-")).then((value) => value);
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, "package.json", JSON.stringify({ name: "empty-fixture" }));

  const list = runCli(["list", "--entry", "./content"], cwd);
  assert.equal(list.status, 0, list.stderr);
  assert.match(list.stdout, /MarkdownRenderer \[component\]/);
  const buttonInfo = runCli(["info", "Button"], cwd);
  assert.equal(buttonInfo.status, 0, buttonInfo.stderr);
  assert.match(buttonInfo.stdout, /variant\?: .*primary/);
  assert.match(buttonInfo.stdout, /Installed declaration: node_modules\/@yuhuanowo\/yunui\/dist\/index\.d\.ts/);

  const find = runCli(["find", "MermaidDiagram", "--json"], cwd);
  assert.equal(find.status, 0, find.stderr);
  assert.equal(JSON.parse(find.stdout)[0].name, "MermaidDiagram");

  await writeFileAt(cwd, "node_modules/yunui/package.json", JSON.stringify({ name: "@yuhuanowo/yunui", version: "0.2.18" }));
  await writeFileAt(cwd, "package.json", JSON.stringify({ name: "alias-fixture", dependencies: { yunui: "npm:@yuhuanowo/yunui@^0.2.18" } }));
  const info = runCli(["info", "./content/MarkdownRenderer", "--cwd", cwd], cwd);
  assert.equal(info.status, 0, info.stderr);
  assert.match(info.stdout, /import \{ MarkdownRenderer \} from "@yuhuanowo\/yunui\/content"/);
  assert.match(info.stdout, /For this install: import \{ MarkdownRenderer \} from "yunui\/content"/);
  const jsonInfo = runCli(["info", "./content/MarkdownRenderer", "--cwd", cwd, "--json"], cwd);
  assert.equal(JSON.parse(jsonInfo.stdout)[0].consumerImport, 'import { MarkdownRenderer } from "yunui/content";');

  const before = await listTree(cwd);
  const doctor = runCli(["doctor", "--cwd", cwd], cwd);
  assert.equal(doctor.status, 0, doctor.stderr);
  assert.deepEqual(await listTree(cwd), before, "doctor must not modify project files");
});

test("doctor resolves aliased package, CSS imports, CSS-relative @source, content CSS, adapters, and fonts", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";\n@import "yunui/css";\n@import "yunui/content.css";\n@import "katex/dist/katex.min.css";\n@source "../node_modules/yunui/dist";\n@font-face { font-family: "Geist"; src: url("/geist.woff2"); }`,
    source: `import "../styles/global.css";\nimport { MarkdownRenderer } from "yunui/content";\nimport { ModelCard } from "yunui/ai";\nimport { YunUIProvider } from "yunui/adapters";\nexport { MarkdownRenderer, ModelCard, YunUIProvider };`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = runCli(["doctor", "--cwd", cwd, "--json"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.package.status, "ok");
  assert.equal(byId.package.alias, "yunui");
  assert.equal(byId.styles.status, "ok");
  assert.equal(byId["package-css-export"].status, "ok");
  assert.equal(byId["content-styles"].status, "ok");
  assert.equal(byId["katex-styles"].status, "ok");
  assert.equal(byId["tailwind-source"].status, "ok");
  assert.equal(byId.adapters.status, "ok");
  assert.equal(byId.fonts.status, "ok");
  assert.equal(report.strict.enabled, false);

  const strictResult = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(strictResult.status, 0, strictResult.stderr);
  assert.equal(JSON.parse(strictResult.stdout).strict.ok, true);
});

test("doctor does not accept scoped CSS or a nonexistent @source for alias-only installs", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";\n@import "@yuhuanowo/yunui/css";\n@source "../node_modules/yunui/styles";`,
    source: `import "../styles/global.css";\nimport { MarkdownRenderer } from "yunui/content";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = runCli(["doctor", "--cwd", cwd, "--json"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.package.alias, "yunui");
  assert.equal(byId.styles.status, "warn");
  assert.equal(byId["content-styles"].status, "warn");
  assert.equal(byId["tailwind-source"].status, "warn");
  const strictResult = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(strictResult.status, 1);
  const strictReport = JSON.parse(strictResult.stdout);
  assert.equal(strictReport.strict.ok, false);
  assert.ok(strictReport.strict.failures.includes("styles"));
  assert.ok(strictReport.strict.failures.includes("content-styles"));
  assert.ok(strictReport.strict.failures.includes("tailwind-source"));
});

test("doctor resolves installed workspace links under a local dependency name", async (t) => {
  const cwd = await makeAliasProject({
    dependencies: { "ui-kit": "workspace:*", tailwindcss: "^4.0.0" },
    css: `@import "tailwindcss";\n@import "ui-kit/css";\n@source "../node_modules/ui-kit/dist";`,
    source: `import "../styles/global.css";\nimport { Button } from "ui-kit";`,
  });
  await rm(path.join(cwd, "node_modules/yunui"), { recursive: true, force: true });
  await writeFileAt(cwd, "node_modules/ui-kit/package.json", JSON.stringify({
    name: "@yuhuanowo/yunui",
    version: "0.2.18",
    exports: { "./css": "./styles/yunui.css", "./content.css": "./styles/content.css" },
  }));
  await mkdir(path.join(cwd, "node_modules/ui-kit/dist"), { recursive: true });
  await writeFileAt(cwd, "node_modules/ui-kit/styles/yunui.css", "/* fixture base CSS */");
  await writeFileAt(cwd, "node_modules/ui-kit/styles/content.css", "/* fixture content CSS */");
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = runCli(["doctor", "--cwd", cwd, "--json"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.package.status, "ok");
  assert.equal(byId.package.alias, "ui-kit");
  assert.equal(byId.styles.status, "ok");
  assert.equal(byId["tailwind-source"].status, "ok");
});

test("doctor identifies a GitHub dependency alias from its installed package manifest", async (t) => {
  const cwd = await makeAliasProject({
    dependencies: { yunui: "github:YuhuanStudio/YunUI#main", tailwindcss: "^4.0.0" },
    css: `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";`,
    source: `import "../styles/global.css";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const result = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.package.status, "ok");
  assert.equal(byId.package.alias, "yunui");
  assert.equal(report.strict.ok, true);
});

test("doctor scans .yunui/setup.css but ignores generated recipes as runtime usage", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";`,
    source: `import "../styles/global.css";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, "styles/global.css", `@import "tailwindcss";\n@import "../.yunui/setup.css";`);
  await writeFileAt(cwd, ".yunui/setup.css", `@import "yunui/css";\n@source "../node_modules/yunui/dist";`);
  await writeFileAt(cwd, ".yunui/recipes/content.tsx", `import { MarkdownRenderer } from "yunui/content";`);
  await writeFileAt(cwd, "src/app.tsx", `import "../styles/global.css";\nexport function App() { return null; }`);

  const result = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.styles.status, "ok");
  assert.equal(byId["tailwind-source"].status, "ok");
  assert.equal(byId["content-styles"].status, "note");
  assert.equal(report.strict.ok, true);
});

test("doctor does not treat an unimported .yunui/setup.css as active setup", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";`,
    source: `import "../styles/global.css";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, ".yunui/setup.css", `@import "yunui/css";\n@source "../node_modules/yunui/dist";`);

  const result = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  const byId = Object.fromEntries(report.checks.map((check) => [check.id, check]));
  assert.equal(byId.styles.status, "warn");
  assert.equal(byId["tailwind-source"].status, "warn");
  assert.ok(report.strict.failures.includes("styles"));
  assert.ok(report.strict.failures.includes("tailwind-source"));
});

test("init --css wires setup after Tailwind and produces a strict-doctor-clean consumer", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";`,
    source: `import "../styles/global.css";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const initialized = runCli(["init", "--cwd", cwd, "--agent", "codex", "--css", "styles/global.css"], cwd);
  assert.equal(initialized.status, 0, initialized.stderr);
  const globalCss = await readFile(path.join(cwd, "styles/global.css"), "utf8");
  const tailwindAt = globalCss.indexOf('@import "tailwindcss";');
  const setupAt = globalCss.indexOf('@import "../.yunui/setup.css";');
  assert.ok(tailwindAt >= 0 && setupAt > tailwindAt);
  const setupCss = await readFile(path.join(cwd, ".yunui/setup.css"), "utf8");
  assert.match(setupCss, /@import "yunui\/css";/);
  assert.match(setupCss, /@source "\.\.\/node_modules\/yunui\/dist";/);

  const doctor = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(doctor.status, 0, doctor.stderr);
  assert.equal(JSON.parse(doctor.stdout).strict.ok, true);
});

test("CLI rejects unsupported flags and missing option values", () => {
  assert.equal(runCli(["doctor", "--strcit"], root).status, 2);
  assert.equal(runCli(["doctor", "--cwd"], root).status, 2);
  assert.equal(runCli(["list", "--strict"], root).status, 2);
  assert.equal(runCli(["doctor", "--css", "styles.css"], root).status, 2);
  assert.equal(runCli(["init", "--css"], root).status, 2);
});

test("doctor reports an unresolved install without turning optional style notes into hard errors", async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-cli-missing-")).then((value) => value);
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, "package.json", JSON.stringify({ name: "missing-fixture" }));
  const result = runCli(["doctor", "--cwd", cwd, "--json"], cwd);
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).checks[0].status, "missing");
});

test("strict doctor rejects an exported CSS target outside the installed package root", async (t) => {
  const cwd = await makeAliasProject({
    css: `@import "tailwindcss";\n@import "yunui/css";\n@source "../node_modules/yunui/dist";`,
    source: `import "../styles/global.css";`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, "escape.css", "/* outside package */");
  await writeFileAt(cwd, "node_modules/yunui/package.json", JSON.stringify({
    name: "@yuhuanowo/yunui",
    version: "0.2.18",
    exports: { "./css": "../../escape.css", "./content.css": "./styles/content.css" },
  }));

  const result = runCli(["doctor", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  const baseExport = report.checks.find((check) => check.id === "package-css-export");
  assert.equal(baseExport.status, "missing");
  assert.ok(report.strict.failures.includes("package-css-export"));
});
