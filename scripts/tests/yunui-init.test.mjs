import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, symlink, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runInit } from "../yunui-init.mjs";

async function consumer() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-init-"));
  await mkdir(path.join(cwd, "node_modules/yunui/dist"), { recursive: true });
  await writeFile(path.join(cwd, "package.json"), JSON.stringify({ name: "consumer", dependencies: { yunui: "npm:@yuhuanowo/yunui@0.2.18" } }));
  await writeFile(path.join(cwd, "node_modules/yunui/package.json"), JSON.stringify({ name: "@yuhuanowo/yunui", version: "0.2.18" }));
  await mkdir(path.join(cwd, "src"));
  await writeFile(path.join(cwd, "src/globals.css"), '@import "tailwindcss";\nbody { margin: 0; }\n');
  return cwd;
}

test("init preserves owner instructions, binds aliases and is byte-idempotent", async () => {
  const cwd = await consumer();
  try {
    await writeFile(path.join(cwd, "AGENTS.md"), "# App rules\nUse the existing data layer.\n");
    await writeFile(path.join(cwd, "CLAUDE.md"), "# Existing Claude rules\nNo deployments.\n");
    const result = await runInit({ cwd, css: "src/globals.css" });
    assert.equal(result.module, "yunui");
    const agents = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
    assert.ok(agents.includes("Use the existing data layer."));
    assert.ok(agents.includes(".agents/skills/yunui/SKILL.md"));
    assert.ok((await readFile(path.join(cwd, "CLAUDE.md"), "utf8")).includes("No deployments."));
    const setup = await readFile(path.join(cwd, ".yunui/setup.css"), "utf8");
    assert.ok(setup.includes('@import "yunui/css"'));
    assert.ok(setup.includes('@source "../node_modules/yunui/dist"'));
    const before = await readFile(path.join(cwd, "src/globals.css"), "utf8");
    await runInit({ cwd, css: "src/globals.css" });
    assert.equal(await readFile(path.join(cwd, "src/globals.css"), "utf8"), before);
    assert.equal(await readFile(path.join(cwd, "AGENTS.md"), "utf8"), agents);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test("init rejects manual asset overwrite before changing any other file", async () => {
  const cwd = await consumer();
  try {
    await runInit({ cwd, agent: "codex" });
    await writeFile(path.join(cwd, ".yunui/setup.css"), "/* Owner's custom setup */\n");
    const previous = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
    await assert.rejects(runInit({ cwd, agent: "both", css: "src/globals.css" }), /Preserving edited file/);
    assert.equal(await readFile(path.join(cwd, "AGENTS.md"), "utf8"), previous);
    await assert.rejects(readFile(path.join(cwd, "CLAUDE.md")), { code: "ENOENT" });
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test("init refuses symlinked destinations and leaves their targets untouched", async () => {
  const cwd = await consumer();
  const target = await mkdtemp(path.join(os.tmpdir(), "yunui-init-outside-"));
  try {
    await writeFile(path.join(target, "state.json"), '{"files":{}}');
    await mkdir(path.join(cwd, ".yunui"));
    await symlink(path.join(target, "state.json"), path.join(cwd, ".yunui/install-state.json"));
    await assert.rejects(runInit({ cwd }), /symlink/);
    assert.equal(await readFile(path.join(target, "state.json"), "utf8"), '{"files":{}}');
    await assert.rejects(readFile(path.join(cwd, "AGENTS.md")), { code: "ENOENT" });
  } finally {
    await rm(cwd, { recursive: true, force: true });
    await rm(target, { recursive: true, force: true });
  }
});

test("a commented Tailwind example is not a valid stylesheet integration point", async () => {
  const cwd = await consumer();
  try {
    await writeFile(path.join(cwd, "src/globals.css"), '/* @import "tailwindcss"; */\nbody { margin: 0; }\n');
    await assert.rejects(runInit({ cwd, css: "src/globals.css" }), /Import tailwindcss/);
    await assert.rejects(readFile(path.join(cwd, "AGENTS.md")), { code: "ENOENT" });
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test("Codex guidance goes into the active override instead of an ignored AGENTS.md", async () => {
  const cwd = await consumer();
  try {
    await writeFile(path.join(cwd, "AGENTS.md"), "# Base project rules\n");
    await writeFile(path.join(cwd, "AGENTS.override.md"), "# Active override\nKeep the current routing stack.\n");
    const result = await runInit({ cwd, agent: "codex" });
    assert.ok(result.files.includes("AGENTS.override.md"));
    assert.equal(await readFile(path.join(cwd, "AGENTS.md"), "utf8"), "# Base project rules\n");
    const override = await readFile(path.join(cwd, "AGENTS.override.md"), "utf8");
    assert.ok(override.includes("Keep the current routing stack."));
    assert.ok(override.includes(".agents/skills/yunui/SKILL.md"));
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
