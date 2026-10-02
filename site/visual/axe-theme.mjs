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
 * The theme is applied the way a user applies it: write next-themes' storage
 * key, then load the page and let the app put itself into that state.
 *
 * Do NOT set `document.documentElement.className` instead. next-themes also
 * writes `data-theme` and `style="color-scheme"`, and YunUI's tokens key off
 * `.dark, [data-theme="dark"]` — so overwriting only the class leaves the old
 * `data-theme` behind and produces a hybrid no user can reach. That harness bug
 * reported a page full of contrast failures in a "light" theme that was
 * actually still dark underneath.
 */
import { chromium } from "@playwright/test";
import { assertThemeApplied, assertNoPageErrors, collectPageErrors, exitOnError, gotoChecked, loadAxe, parseJsonList, runAxe, validateAxeTarget } from "./sweep-utils.mjs";

const AXE = loadAxe();
const theme = process.argv[2];
if (!new Set(["light", "dark", "true-black"]).has(theme) || !process.argv[3]) {
  console.error("usage: node visual/axe-theme.mjs <theme> '<targets json>'");
  process.exitCode = 2;
} else {
let browser;
try {
const targets = parseJsonList(process.argv[3], "targets", validateAxeTarget);
browser = await chromium.launch();
const all = {};

for (const { name, url, vp, cookies } of targets) {
  const ctx = await browser.newContext({
    viewport: { width: vp ?? 1440, height: 1000 },
    colorScheme: theme === "light" ? "light" : "dark",
  });
  if (cookies) await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  const errors = collectPageErrors(page);
  // Seed the theme before any app code runs, so the page renders in it directly.
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const response = await gotoChecked(page, url, { waitUntil: "networkidle", timeout: 30000 }, name);
  await page.waitForTimeout(700);
  const intendedPath = new URL(url).pathname;
  const actualPath = new URL(page.url()).pathname;
  if (!/\/(?:login|log-in|signin|sign-in)\/?$/i.test(intendedPath) && /\/(?:login|log-in|signin|sign-in)\/?$/i.test(actualPath)) {
    throw new Error(`${name}: redirected to an authentication screen (${actualPath})`);
  }
  await assertThemeApplied(page, theme, name);
  const ready = await page.evaluate(() => ({
    body: document.body?.innerText.trim().length > 0,
    passwordForm: Boolean(document.querySelector('input[type="password"]')),
  }));
  if (!ready.body) throw new Error(`${name}: page body is empty`);
  if (!/\/(?:login|log-in|signin|sign-in)\/?$/i.test(intendedPath) && ready.passwordForm) {
    throw new Error(`${name}: page rendered an authentication form instead of the requested content`);
  }
  const res = await runAxe(page, AXE);
  if (response.status() >= 400) throw new Error(`${name}: HTTP ${response.status()}`);
  assertNoPageErrors(errors, name);
  console.log(`${name.padEnd(28)} ${res.violations.length} violation types`);
  for (const v of res.violations) {
    (all[v.id] ??= { impact: v.impact, help: v.help, nodes: [] }).nodes.push(
      ...v.nodes.map((n) => ({ page: name, target: n.target.join(" "), why: n.failureSummary?.split("\n").pop() })),
    );
  }
  await ctx.close();
}

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
  process.exitCode = 1;
}
if (!ids.length) console.log("clean.");
} catch (error) {
  exitOnError(error);
} finally {
  await browser?.close();
}
}
