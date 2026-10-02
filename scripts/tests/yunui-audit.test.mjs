import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "scripts/yunui-cli.mjs");
const typescriptPath = await readFile(path.join(root, "node_modules/typescript/package.json"), "utf8").then(() => path.join(root, "node_modules/typescript"));

function runCli(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8", timeout: 15_000 });
}

async function writeFileAt(cwd, name, content) {
  const filename = path.join(cwd, name);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, content);
}

async function fixture(t, { typescript = true, sources = {}, dependencies = { yunui: "npm:@yuhuanowo/yunui@^0.2.18" } } = {}) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-audit-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFileAt(cwd, "package.json", JSON.stringify({ name: "audit-consumer", dependencies }, null, 2));
  await writeFileAt(cwd, "node_modules/yunui/package.json", JSON.stringify({ name: "@yuhuanowo/yunui", version: "0.2.18" }));
  if (typescript) {
    await mkdir(path.join(cwd, "node_modules"), { recursive: true });
    await symlink(await realpath(typescriptPath), path.join(cwd, "node_modules/typescript"), "dir");
  }
  for (const [filename, content] of Object.entries(sources)) await writeFileAt(cwd, filename, content);
  return cwd;
}

test("audit maps direct aliases, re-exports, and namespace JSX uses; comments and strings are not controls", async (t) => {
  const cwd = await fixture(t, {
    sources: {
      "src/barrel.ts": `export { Button as CoreButton } from "yunui";\nexport * as UI from "yunui";`,
      "src/App.tsx": `import { CoreButton } from "./barrel";\nimport * as UI from "yunui";\nimport type { ButtonProps } from "yunui/ai";\nconst typed: ButtonProps = { variant: "primary" };\nconst markup = "<button><input />";\n// <button>comment only</button>\nexport function App() { return <><CoreButton variant="primary">Go</CoreButton><UI.Avatar><UI.AvatarFallback>AB</UI.AvatarFallback></UI.Avatar></>; }`,
      "src/ignore.test.tsx": `export const Example = () => <button>test fixture</button>;`,
      "agent/recipes/ignore.tsx": `export const Example = () => <button>recipe fixture</button>;`,
    },
  });
  const run = runCli(["audit", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(run.status, 0, `${run.stderr}\n${run.stdout}`);
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, "ok");
  assert.equal(result.strict.ok, true);
  assert.equal(result.definiteIssues.length, 0);
  assert.ok(result.imports.some((item) => item.name === "Button" && item.action === "re-export"));
  assert.ok(result.imports.some((item) => item.action === "namespace-import"));
  assert.ok(result.imports.some((item) => item.name === "ButtonProps" && item.typeOnly));
  assert.ok(result.usedExports.some((item) => item.entry === "." && item.name === "Button" && item.uses[0].file === "src/App.tsx"));
  assert.ok(result.usedExports.some((item) => item.name === "Avatar"));
  assert.ok(result.usedExports.some((item) => item.name === "AvatarFallback"));
  assert.equal(result.filesScanned, 2, "test files are excluded from runtime consumer scanning");
});

test("audit reports definite raw controls and local public-widget imitations", async (t) => {
  const cwd = await fixture(t, {
    sources: {
      "src/FakeWidgets.tsx": `import { Button as YunButton } from "yunui";\nexport function Button() { return <button className="btn-primary">Copy</button>; }\nexport function Page() { return <><Button /><YunButton>Library</YunButton><input type="hidden" /><input aria-label="Email" /><select><option>A</option></select><textarea /><table><tbody><tr><td>Data</td></tr></tbody></table></>; }`,
    },
  });
  const run = runCli(["audit", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(run.status, 1);
  const result = JSON.parse(run.stdout);
  assert.equal(result.strict.ok, false);
  assert.ok(result.definiteIssues.some((item) => item.code === "raw-library-control" && item.message.includes("<button>")));
  assert.ok(result.definiteIssues.some((item) => item.code === "raw-library-control" && item.message.includes("<input>")));
  assert.equal(result.definiteIssues.filter((item) => item.code === "raw-library-control" && item.message.includes("<input>")).length, 1, "hidden inputs are ignored");
  assert.ok(result.definiteIssues.some((item) => item.code === "raw-library-control" && item.message.includes("<select>")));
  assert.ok(result.definiteIssues.some((item) => item.code === "raw-library-control" && item.message.includes("<textarea>")));
  assert.ok(result.definiteIssues.some((item) => item.code === "raw-library-control" && item.message.includes("<table>")));
  assert.ok(result.definiteIssues.some((item) => item.code === "shadowed-library-widget" && item.message.includes("Local Button")));
  assert.ok(result.definiteIssues.every((item) => item.file === "src/FakeWidgets.tsx" && item.line > 0));
});

test("a local wrapper that delegates to the real YunUI export is valid", async (t) => {
  const cwd = await fixture(t, {
    sources: {
      "src/App.tsx": `import { Button as YunButton } from "yunui";\nexport function Button(props: { children: string }) { return <YunButton>{props.children}</YunButton>; }\nexport const App = () => <Button>Compose</Button>;`,
    },
  });
  const run = runCli(["audit", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(run.status, 0, `${run.stderr}\n${run.stdout}`);
  const result = JSON.parse(run.stdout);
  assert.equal(result.definiteIssues.length, 0);
  assert.ok(result.usedExports.some((item) => item.name === "Button"));
});

test("avatar and empty-state markup are non-blocking human-review candidates", async (t) => {
  const cwd = await fixture(t, {
    sources: {
      "src/Profile.tsx": `export function Profile({ items }: { items: string[] }) { return <><div className="rounded-full bg-brand text-white" aria-label="Profile avatar">JD</div>{items.length === 0 ? <div className="p-6 text-center"><p>No results found</p></div> : items.map(item => <p key={item}>{item}</p>)}</>; }`,
    },
  });
  const run = runCli(["audit", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  assert.equal(result.strict.ok, true);
  assert.equal(result.definiteIssues.length, 0);
  assert.ok(result.candidates.some((item) => item.category === "avatar-like-markup" && item.candidates.some((candidate) => candidate.name === "Avatar")));
  assert.ok(result.candidates.some((item) => item.category === "handbuilt-empty-state" && item.candidates.some((candidate) => candidate.name === "EmptyState")));
  assert.match(result.candidates[0].message, /not a ban|review/i);
});

test("audit reports AST status unknown and strict failure when host TypeScript is unavailable", async (t) => {
  const cwd = await fixture(t, {
    typescript: false,
    sources: { "src/App.tsx": `export const App = () => <button>Raw</button>;` },
  });
  const run = runCli(["audit", "--cwd", cwd, "--strict", "--json"], cwd);
  assert.equal(run.status, 1);
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, "unknown");
  assert.equal(result.definiteIssues.length, 0, "no AST parser means no guessed pass/fail findings");
  assert.equal(result.strict.ok, false);
  assert.ok(result.strict.failures.includes("typescript-unavailable"));
});
