import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = dirname(fileURLToPath(import.meta.url));
const esbuild = resolve(root, "../../../node_modules/.bin/esbuild");
execFileSync(esbuild, [resolve(root, "entry.tsx"), "--bundle", "--format=esm", "--target=es2022", "--outfile=" + resolve(root, "d4.js")], { stdio: "inherit" });
execFileSync("node", [resolve(root, "build-yunui-theme.mjs")], { cwd: root, stdio: "inherit" });
execFileSync("node", [resolve(root, "build-css.mjs")], { cwd: root, stdio: "inherit" });
