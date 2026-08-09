/**
 * Accessibility sweep with an explicit theme.
 *
 *   node visual/axe-theme.mjs true-black '[{"name":"/","url":"http://localhost:3000/"}]'
 *
 * `axe.mjs` runs whatever theme the app happens to default to, which in
 * practice meant `dark` or `light` and never `true-black`. That gap hid a real
 * defect for a long time: code blocks rendered the LIGHT syntax palette on a
 * near-black page at 1.35:1, because `true-black` sets `class="true-black"`
 * with no `dark` beside it and every `.dark`-keyed rule silently stopped
 * matching. A theme that no sweep ever visits is a theme nothing is checked in.
 *
 * The theme is applied by setting `document.documentElement.className`, which
 * is exactly what next-themes does (one theme → one class). Do NOT "help" by
 * adding `dark` alongside `true-black` when testing — that is the mistake that
 * made the bug invisible.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const AXE = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const theme = process.argv[2];
const targets = JSON.parse(process.argv[3]);
if (!theme || !targets) {
  console.error("usage: node visual/axe-theme.mjs <theme> '<targets json>'");
  process.exit(2);
}

const browser = await chromium.launch();
const all = {};

for (const { name, url, vp, cookies } of targets) {
  const ctx = await browser.newContext({
    viewport: { width: vp ?? 1440, height: 1000 },
    colorScheme: theme === "light" ? "light" : "dark",
  });
  if (cookies) await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});
  await page.evaluate((t) => {
    document.documentElement.className = t;
  }, theme);
  await page.waitForTimeout(700);
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(
    async () =>
      await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      }),
  );
  console.log(`${name.padEnd(28)} ${res.violations.length} violation types`);
  for (const v of res.violations) {
    (all[v.id] ??= { impact: v.impact, help: v.help, nodes: [] }).nodes.push(
      ...v.nodes.map((n) => ({ page: name, target: n.target.join(" "), why: n.failureSummary?.split("\n").pop() })),
    );
  }
  await ctx.close();
}
await browser.close();

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const ids = Object.keys(all).sort((a, b) => order[all[a].impact] - order[all[b].impact]);
console.log(`\n=== ${theme.toUpperCase()} ===`);
for (const id of ids) {
  const v = all[id];
  console.log(`\n[${v.impact}] ${id} — ${v.help}`);
  console.log(`  pages: ${[...new Set(v.nodes.map((n) => n.page))].join(", ")}`);
  for (const n of v.nodes.slice(0, 4)) console.log(`   · ${n.page}: ${n.target} — ${n.why}`);
}
if (ids.length) {
  console.error(`\n${ids.length} violation type(s) in ${theme} — failing.`);
  process.exit(1);
}
console.log("clean.");
