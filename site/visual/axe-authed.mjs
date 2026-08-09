/**
 * Accessibility sweep of Yunxin's AUTHENTICATED routes.
 *
 *   (cd ../../Yunxin/frontend && pnpm build && pnpm start -p 3300)
 *   node visual/axe-authed.mjs
 *
 * Two things make this different from visual/axe.mjs:
 *  - the gate is SERVER-side (Yunxin/frontend/src/proxy.ts checks a
 *    `yunxin_session` cookie), so mocking /api/auth/me is not enough — without
 *    the cookie every route 302s to /login before any JS runs, and the sweep
 *    silently audits the login page instead;
 *  - every /api/** call is fulfilled with an empty-but-valid payload, so the
 *    pages render their real chrome and empty states rather than an error
 *    boundary. Empty states are where a11y defects tend to hide.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
const AXE = fs.readFileSync(new URL('node_modules/axe-core/axe.min.js', `file://${process.cwd()}/`), 'utf8');
const BASE = 'http://localhost:3300';
const ROUTES = ['/dashboard', '/dashboard/api-keys', '/dashboard/billing', '/dashboard/models',
                '/dashboard/analytics', '/dashboard/logs', '/dashboard/notifications', '/dashboard/fellows'];
const USER = { id: 1, email: "a11y@example.com", name: "A11y Sweep", display_name: "A11y Sweep",
               avatar_url: null, is_admin: false, is_active: true, role: "user", credits: 1000 };

const b = await chromium.launch();
// The gate is server-side (src/proxy.ts checks the `yunxin_session` cookie), so
// mocking the client's /api/auth/me is not enough — without the cookie every
// dashboard route 302s to /login before any JS runs.
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addCookies([{ name: 'yunxin_session', value: 'a11y-sweep', domain: 'localhost', path: '/' }]);
const all = {}; const seen = [];
for (const route of ROUTES) {
  const p = await ctx.newPage();
  // Anything the app asks the backend for: answer plausibly rather than 500,
  // so the page renders its real chrome instead of an error boundary.
  await p.route('**/api/**', async (r) => {
    const u = r.request().url();
    if (u.includes('/api/auth/me')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [], data: [], results: [], total: 0 }) });
  });
  try {
    const res = await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(1500);
    const url = p.url().replace(BASE, '');
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
    seen.push(`${route.padEnd(24)} → ${url.padEnd(24)} ${res?.status()} ${r.violations.length} violation types`);
    for (const v of r.violations) {
      all[v.id] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: [] };
      all[v.id].pages.add(route);
      for (const n of v.nodes.slice(0,3)) all[v.id].nodes.push(`${route}: ${n.target.join(' ')} :: ${(n.failureSummary||'').split('\n').slice(1).join(' ')}`.slice(0,260));
    }
  } catch (e) { seen.push(`${route}: ERROR ${e.message.slice(0,60)}`); }
  await p.close();
}
await b.close();
console.log(seen.join('\n'));
console.log('\n=== AGGREGATED ===');
const ord={critical:0,serious:1,moderate:2,minor:3};
for (const [id,v] of Object.entries(all).sort((a,b)=>(ord[a[1].impact]??9)-(ord[b[1].impact]??9))) {
  console.log(`\n[${v.impact}] ${id} — ${v.help}`);
  console.log('  pages:', [...v.pages].join(', '));
  for (const n of [...new Set(v.nodes)].slice(0,3)) console.log('   ·', n);
}
if (!Object.keys(all).length) console.log('(none)');
