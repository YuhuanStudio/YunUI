/**
 * Accessibility sweep of YunNEWS's ADMIN routes.
 *
 *   (cd ../../YunNEWS/web && npm run build && npm start -- -p 3301)
 *   node visual/axe-news-admin.mjs
 *
 * Unlike Yunxin's dashboard, this gate is CLIENT-side (app/(admin)/shell.tsx
 * calls api.me() and checks `is_admin`), so answering that one request is
 * enough — no session cookie needed. Everything else under the API base is
 * fulfilled with an empty-but-valid payload so the pages render their real
 * chrome and empty states instead of an error boundary.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
const AXE = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const BASE = 'http://localhost:3301';
const ROUTES = ['/admin', '/admin/pipeline', '/admin/sources', '/admin/reference', '/admin/review', '/admin/settings'];
const ADMIN = { user: { id: 1, email: "a11y@example.com", name: "A11y", is_admin: true, avatar_url: null } };

const b = await chromium.launch();
const all = {}; const lines = [];
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route('**/api/**', (r) => {
    const u = r.request().url();
    // Shape-specific: SettingsPanel awaits issueDates + settings + models
    // together, and a generic empty object leaves it on "Loading…" forever —
    // which then audits clean while showing nothing. Answer each properly.
    const body =
      u.includes('/api/auth/me') ? ADMIN
      : u.includes('/api/issues') ? { issues: [] }
      : u.includes('/api/admin/settings') ? { settings: {} }
      : u.includes('/api/admin/models') ? { models: [], error: null }
      : { items: [], data: [], results: [], reports: [], sources: [], total: 0 };
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  try {
    const res = await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(1600);
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
    // Guard against auditing a spinner or an unauthorised screen and calling it
    // clean — that has happened twice in this repo's history.
    const rendered = await p.evaluate(() => ({
      h: document.querySelectorAll('h1,h2').length,
      loading: /^\s*(Loading|載入)/.test(document.getElementById('admin-main')?.innerText ?? ''),
    }));
    const flag = rendered.loading ? ' !! STILL LOADING — result not meaningful'
               : rendered.h === 0 ? ' !! no headings — check it actually rendered' : '';
    lines.push(`${route.padEnd(22)} ${res?.status()} ${r.violations.length} violation types${flag}`);
    for (const v of r.violations) {
      all[v.id] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: [] };
      all[v.id].pages.add(route);
      for (const n of v.nodes.slice(0,3)) all[v.id].nodes.push(`${route}: ${n.target.join(' ')} :: ${(n.failureSummary||'').split('\n').slice(1).join(' ')}`.slice(0,240));
    }
  } catch (e) { lines.push(`${route}: ERROR ${e.message.slice(0,60)}`); }
  await p.close();
}
await b.close();
console.log(lines.join('\n'));
console.log('\n=== AGGREGATED ===');
const ord={critical:0,serious:1,moderate:2,minor:3};
for (const [id,v] of Object.entries(all).sort((a,b)=>(ord[a[1].impact]??9)-(ord[b[1].impact]??9))) {
  console.log(`\n[${v.impact}] ${id} — ${v.help}`);
  console.log('  pages:', [...v.pages].join(', '));
  for (const n of [...new Set(v.nodes)].slice(0,3)) console.log('   ·', n);
}
if (!Object.keys(all).length) console.log('(none)');
