import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const paths = ["dist/", "agent/catalog.generated.json"];

export function checkGeneratedArtifacts(cwd = process.cwd()) {
  const diff = spawnSync("git", ["diff", "--exit-code", "HEAD", "--", ...paths], { cwd, encoding: "utf8" });
  const others = spawnSync("git", ["ls-files", "--others", "--", ...paths], { cwd, encoding: "utf8" });
  const untracked = others.stdout?.trim().split("\n").filter(Boolean) ?? [];
  return {
    ok: diff.status === 0 && others.status === 0 && untracked.length === 0,
    diff: diff.stdout ?? "",
    error: [diff.stderr, others.stderr].filter(Boolean).join("\n"),
    untracked,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = checkGeneratedArtifacts();
  if (!result.ok) {
    if (result.diff) process.stderr.write(result.diff);
    if (result.error) process.stderr.write(result.error);
    if (result.untracked.length) process.stderr.write(`Generated files missing from the commit:\n${result.untracked.join("\n")}\n`);
    process.exitCode = 1;
  }
}
