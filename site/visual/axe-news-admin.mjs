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
import { assertExpectedPath, assertLocalBase, assertNoPageErrors, collectPageErrors, exitOnError, gotoChecked, loadAxe, parsePaths, runAxe } from './sweep-utils.mjs';
const AXE = loadAxe();
const BASE = assertLocalBase(process.env.NEWS_A11Y_BASE ?? 'http://localhost:3301');
const DEFAULT_ROUTES = ['/admin', '/admin/pipeline', '/admin/sources', '/admin/reference', '/admin/review', '/admin/settings'];
const ADMIN = { user: { id: 1, email: "a11y@example.com", name: "A11y", is_admin: true, avatar_url: null } };

let ROUTES;
try { ROUTES = parsePaths(process.argv[2], DEFAULT_ROUTES); }
catch (error) { exitOnError(error); process.exit(); }

const b = await chromium.launch();
const all = {}; const lines = []; let failures = 0;
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = collectPageErrors(p);
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
    const res = await gotoChecked(p, BASE + route, { waitUntil: 'networkidle', timeout: 25000 }, route);
    assertExpectedPath(p, route, route);
    await p.waitForTimeout(1600);
    // Guard against auditing a spinner or an unauthorised screen and calling it
    // clean — that has happened twice in this repo's history.
    const rendered = await p.evaluate(() => ({
      h: document.querySelectorAll('h1,h2').length,
      adminMain: Boolean(document.getElementById('admin-main')),
      loading: /^\s*(Loading|載入)/.test(document.getElementById('admin-main')?.innerText ?? ''),
      passwordForm: Boolean(document.querySelector('input[type="password"]')),
      denied: /unauthorized|not authorized|access denied/i.test(document.getElementById('admin-main')?.innerText ?? ''),
    }));
    if (!rendered.adminMain || rendered.loading || rendered.h === 0 || rendered.passwordForm || rendered.denied || !await p.evaluate(() => Boolean(document.body?.innerText.trim()))) {
      throw new Error(`${route}: page not ready/authenticated (${JSON.stringify(rendered)})`);
    }
    assertNoPageErrors(errors, route);
    const r = await runAxe(p, AXE);
    assertNoPageErrors(errors, route);
    lines.push(`${route.padEnd(22)} ${res.status()} ${r.violations.length} violation types`);
    for (const v of r.violations) {
      all[v.id] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: [] };
      all[v.id].pages.add(route);
      for (const n of v.nodes.slice(0,3)) all[v.id].nodes.push(`${route}: ${n.target.join(' ')} :: ${(n.failureSummary||'').split('\n').slice(1).join(' ')}`.slice(0,240));
    }
  } catch (e) { failures++; lines.push(`${route}: ERROR ${e.message.slice(0,180)}`); }
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
if (failures || Object.keys(all).length) process.exitCode = 1;
