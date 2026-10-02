import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { checkGeneratedArtifacts } from "../check-generated.mjs";

test("generated artifact gate catches missing chunks and staged divergence", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "yunui-generated-review-"));
  const git = (...args) => execFileSync("git", args, { cwd, stdio: "pipe" });
  try {
    git("init", "-q");
    await mkdir(path.join(cwd, "dist"));
    await writeFile(path.join(cwd, "dist/index.js"), "export {};\n");
    await writeFile(path.join(cwd, ".gitignore"), "dist/*.map\n");
    git("add", ".");
    git("-c", "user.name=Codex", "-c", "user.email=codex@local.invalid", "commit", "-qm", "fixture");
    assert.equal(checkGeneratedArtifacts(cwd).ok, true);
    await writeFile(path.join(cwd, "dist/chunk-new.js"), "export const missing = true;\n");
    assert.deepEqual(checkGeneratedArtifacts(cwd).untracked, ["dist/chunk-new.js"]);
    await rm(path.join(cwd, "dist/chunk-new.js"));
    await writeFile(path.join(cwd, "dist/new.map"), "{}\n");
    assert.equal(checkGeneratedArtifacts(cwd).ok, false, "ignored generated files must also be committed");
    await rm(path.join(cwd, "dist/new.map"));
    await writeFile(path.join(cwd, "dist/index.js"), "export const changed = true;\n");
    git("add", "dist/index.js");
    assert.equal(checkGeneratedArtifacts(cwd).ok, false, "staging a divergence must not bypass HEAD comparison");
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
