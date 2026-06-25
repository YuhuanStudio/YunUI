// Mirror YunUI's icons/ into the site's public/icons so the showcase serves the
// full bundled icon set (not a stale subset). Runs at predev/prebuild.
import { cpSync, rmSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "../../icons");
const DEST = join(here, "../public/icons");
if (!existsSync(SRC)) { console.warn("[site sync-icons] no ../../icons; skipping"); process.exit(0); }
for (const sub of readdirSync(SRC)) {
  const d = join(DEST, sub);
  if (existsSync(d)) rmSync(d, { recursive: true, force: true });
}
mkdirSync(DEST, { recursive: true });
cpSync(SRC, DEST, { recursive: true });
const n = (s) => existsSync(join(DEST, s)) ? readdirSync(join(DEST, s)).length : 0;
console.log(`[site sync-icons] mirrored icons → public/icons (providers ${n("providers")}, models ${n("models")}, apps ${n("apps")})`);
