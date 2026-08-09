/**
 * Accessibility sweep — runs axe-core against a running build.
 *
 *   pnpm --filter yunui-site build && pnpm --filter yunui-site start -p 3000
 *   node visual/axe.mjs '[{"name":"/","url":"http://localhost:3000/"}]'
 *   node visual/axe.mjs                 # defaults below
 *
 * Prints per-page violation counts, then an aggregate ordered by impact, with
 * the offending selector and the reason. Kept because the first run of it found
 * a dozen real defects, including a Checkbox that could not be given an
 * accessible name at all.
 *
 * Known remaining: one `color-contrast` from Shiki's `github-light` token
 * palette (#e36209 at 3.48:1) and one from fumadocs' own TOC. Both are
 * third-party palettes, not YunUI's.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
const AXE = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const DEFAULT_TARGETS = [
  { name: "/", url: "http://localhost:3000/" },
  { name: "/showcase", url: "http://localhost:3000/showcase" },
  { name: "/showcase mobile", url: "http://localhost:3000/showcase", vp: 390 },
  { name: "/docs", url: "http://localhost:3000/docs" },
  { name: "/changelog", url: "http://localhost:3000/changelog" },
];
const targets = process.argv[2] ? JSON.parse(process.argv[2]) : DEFAULT_TARGETS;
const b = await chromium.launch();
const all = {};
for (const { name, url, vp } of targets) {
  const p = await b.newPage({ viewport: { width: vp ?? 1440, height: 900 } });
  try {
    const res = await p.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
    if (!res || res.status() >= 400) { console.log(`${name}: HTTP ${res?.status()}`); await p.close(); continue; }
    await p.waitForTimeout(1200);
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] },
    }));
    for (const v of r.violations) {
      const key = v.id;
      all[key] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: [] };
      all[key].pages.add(name);
      for (const n of v.nodes.slice(0, 2)) all[key].nodes.push(`${name}: ${n.target.join(' ')} — ${(n.failureSummary||'').split('\n')[1]?.trim()||''}`.slice(0,190));
    }
    console.log(`${name.padEnd(28)} ${r.violations.length} violation types`);
  } catch (e) { console.log(`${name}: ERROR ${e.message.slice(0,80)}`); }
  await p.close();
}
await b.close();
console.log('\n=== AGGREGATED ===');
const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
for (const [id, v] of Object.entries(all).sort((a,b)=>(order[a[1].impact]??9)-(order[b[1].impact]??9))) {
  console.log(`\n[${v.impact}] ${id} — ${v.help}`);
  console.log(`  pages: ${[...v.pages].join(', ')}`);
  for (const n of [...new Set(v.nodes)].slice(0,3)) console.log(`   · ${n}`);
}

// Non-zero exit so CI gates on this rather than printing into the void.
const total = Object.keys(all).length;
if (total) { console.error(`\n${total} violation type(s) — failing.`); process.exit(1); }
