// Sync provider/model brand icons from @lobehub/icons-static-svg (MIT) into
// icons/. Re-run this whenever the lobe package is bumped — it keeps our icon
// set current instead of letting it drift. Prefers the brand `-color` SVG, then
// falls back to the monochrome base (which uses currentColor, so it adapts to
// light/dark automatically). Run: `node scripts/sync-icons.mjs [--apply]`.
//
// Without --apply it only reports coverage (dry run). With --apply it writes
// icons/<category>/<id>.svg and removes that id's older raster file.

import { readdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOBE = join(root, "node_modules/@lobehub/icons-static-svg/icons");
const apply = process.argv.includes("--apply");
// Target icon root — defaults to this repo's icons/. Pass `--icons <dir>` to sync
// a consumer's copy too (e.g. Yunxin's public/icons), reusing this repo's lobe dep.
const iconsArg = process.argv.indexOf("--icons");
const ICONS_ROOT = iconsArg !== -1 ? process.argv[iconsArg + 1] : join(root, "icons");

// our-id -> lobe slug, for the cases where they differ in spelling/word-order.
// (Direct, same-name matches need no entry.) `null` = intentionally no lobe
// equivalent (small aggregators etc.) — keep our existing file, don't warn.
const ALIAS = {
  "302ai": "ai302", "Xiaomi": "xiaomi", "aws-bedrock": "bedrock",
  "baidu-cloud": "baiducloud", "bigModel": "zhipu", "dashscope": "tongyi",
  "gitee-ai": "giteeai", "netease-youdao": "youdao", "tencent-cloud-ti": "tencentcloud",
  "voyageai": "voyage", "zero-one": "yi", "step": "stepfun", "silicon": "siliconcloud",
  "o3": "openai", "mimo": "xiaomi", "cogview3flash": "zhipu", "paddleocr": "baidu",
  "intel": "intel", "lepton": "lepton", "nomic": "nomic", "mixedbread": "mixedbread",
  "gpustack": "gpustack", "infini": "infinigence", "lanyun": "lanyun",
  // no lobe equivalent — keep ours, stay quiet:
  "DMXAPI": null, "DMXAPI-to-img": null, "dmxapi-logo": null, "dmxapi-logo-dark": null,
  "aiOnly": null, "alayanew": null, "cephalon": null, "cherryin": null, "graph-rag": null,
  "macos": null, "mcprouter": null, "ocoolai": null, "ph8": null, "tokenflux": null,
  "tokenrouter": null, "xirang": null, "Tesseract.js": null, "Kwaipilot": null,
};

// Only pull the explicitly brand-COLORED variants. Our icons render via <img>,
// where a monochrome `fill="currentColor"` SVG would resolve to black and vanish
// in dark mode — so the mono-only brands keep their existing raster instead.
function lobeFile(slug) {
  for (const v of [`${slug}-color`, `${slug}-brand-color`]) {
    const p = join(LOBE, `${v}.svg`);
    if (existsSync(p)) return { variant: v, path: p };
  }
  return null;
}

function syncCategory(category) {
  const dir = join(ICONS_ROOT, category);
  if (!existsSync(dir)) return;
  const files = readdirSync(dir);
  // unique ids by basename (drop extension + _dark)
  const ids = [...new Set(files.map((f) => f.replace(/\.(png|webp|svg|jpe?g)$/i, "")).filter((b) => !b.endsWith("_dark")))];
  const matched = [], aliased = [], missing = [];
  for (const id of ids) {
    if (ALIAS[id] === null) continue; // intentionally skipped
    const slug = ALIAS[id] ?? id.toLowerCase();
    const hit = lobeFile(slug);
    if (!hit) { missing.push(id); continue; }
    (ALIAS[id] ? aliased : matched).push(`${id}${ALIAS[id] ? `→${slug}` : ""}`);
    if (apply) {
      writeFileSync(join(dir, `${id}.svg`), readFileSync(hit.path));
      for (const ext of ["png", "webp", "jpeg", "jpg"]) {
        const old = join(dir, `${id}.${ext}`);
        if (existsSync(old)) rmSync(old);
      }
    }
  }
  console.log(`\n[${category}] ${ids.length} ids — ${matched.length} direct, ${aliased.length} aliased, ${missing.length} no-lobe-match`);
  if (aliased.length) console.log(`  aliased: ${aliased.join(", ")}`);
  if (missing.length) console.log(`  no match (kept as-is): ${missing.join(", ")}`);
}

console.log(apply ? "APPLYING (writing .svg, removing old raster)…" : "DRY RUN (pass --apply to write)…");
for (const cat of ["providers", "models", "apps"]) syncCategory(cat);

// Keep the hardcoded filename maps in sync with the files on disk. The icon
// components reference exact filenames (e.g. `google: "google.png"`); after we
// rewrite a raster to `.svg` that string would 404, so rewrite every filename
// literal whose raster no longer exists but whose `.svg` twin does.
function fixIconMaps() {
  const mapFiles = [join(root, "src/ai/provider-icons.tsx"), join(root, "src/ai/model-icons.tsx")];
  const dirs = ["providers", "models", "apps"].map((c) => join(ICONS_ROOT, c)).filter(existsSync);
  const hasFile = (name) => dirs.some((d) => existsSync(join(d, name)));
  for (const mf of mapFiles) {
    if (!existsSync(mf)) continue;
    let src = readFileSync(mf, "utf8");
    let n = 0;
    src = src.replace(/"([^"]+?)\.(png|webp|jpe?g)"/g, (m, base, ext) => {
      if (!hasFile(`${base}.${ext}`) && hasFile(`${base}.svg`)) { n++; return `"${base}.svg"`; }
      return m;
    });
    if (apply && n) { writeFileSync(mf, src); console.log(`  [map] ${mf.split("/").pop()}: rewrote ${n} filename(s) → .svg`); }
    else if (n) console.log(`  [map] ${mf.split("/").pop()}: ${n} filename(s) would change → .svg`);
  }
}
fixIconMaps();
