/**
 * Accessibility sweep of Yunxin's dashboard against a REAL backend + a real
 * signed-in account. No API mocking: the pages get real (if empty) data, so
 * empty states, tables and charts render as they actually will.
 *
 *   (cd ../../Yunxin && docker compose up -d postgres redis)
 *   (cd ../../Yunxin/backend && uv run alembic upgrade head &&
 *    uv run uvicorn app.main:app --port 8001)
 *   (cd ../../Yunxin/frontend && INTERNAL_API_URL=http://127.0.0.1:8001 \
 *      NEXT_PUBLIC_API_URL=http://127.0.0.1:8001 pnpm build && pnpm start -p 3300)
 *   node visual/axe-yunxin-live.mjs
 *
 * It signs in through the real form, so a failure to reach the dashboard is
 * reported rather than silently audited as a clean login page — the trap that
 * made an earlier mocked run report seven false all-clears.
 *
 * Known and expected: /dashboard/router reports `color-contrast` inside the
 * "Auto Mode" card whenever the signed-in account lacks access. That card is
 * `opacity-50 pointer-events-none` and marked `aria-disabled` — WCAG 1.4.3
 * exempts inactive user interface components from the contrast requirement, so
 * dimming it is the intended treatment, not a defect. Everything else on the
 * thirteen dashboard routes is at zero.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
const AXE = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const BASE = 'http://localhost:3300';
const EMAIL = process.env.A11Y_EMAIL ?? 'a11y@example.com';
const PASSWORD = process.env.A11Y_PASSWORD ?? 'A11ySweep!2026';
const ROUTES = process.argv[2] ? JSON.parse(process.argv[2]) : [
  '/dashboard', '/dashboard/api-keys', '/dashboard/billing', '/dashboard/models',
  '/dashboard/analytics', '/dashboard/logs', '/dashboard/notifications',
  '/dashboard/images', '/dashboard/files', '/dashboard/feedback', '/dashboard/changelog',
  '/dashboard/fellows', '/dashboard/router', '/dashboard/playground',
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const login = await ctx.newPage();
await login.goto(BASE + '/login', { waitUntil: 'networkidle' });
await login.getByPlaceholder(/example\.com/i).fill(EMAIL);
await login.locator('input[type="password"]').fill(PASSWORD);
await Promise.all([
  login.waitForURL(/\/dashboard/, { timeout: 20000 }).catch(() => {}),
  login.getByRole('button', { name: /sign in/i }).first().click(),
]);
await login.waitForTimeout(2500);
if (!/\/dashboard/.test(login.url())) {
  console.log('SIGN-IN FAILED — still at', login.url(), '\nRefusing to audit; results would be of the login page.');
  await b.close(); process.exit(1);
}
console.log('signed in →', login.url(), '\n');
await login.close();

const all = {}; const lines = [];
for (const route of ROUTES) {
  const p = await ctx.newPage();
  try {
    const res = await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(2000);
    const state = await p.evaluate(() => ({
      url: location.pathname,
      headings: document.querySelectorAll('h1,h2').length,
      loading: /^\s*(Loading|載入|加载)/.test(document.querySelector('main')?.innerText ?? ''),
    }));
    const flag = state.url !== route ? ` !! redirected to ${state.url}`
               : state.loading ? ' !! STILL LOADING — not meaningful'
               : state.headings === 0 ? ' !! no headings' : '';
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }));
    lines.push(`${route.padEnd(26)} ${res?.status()} ${r.violations.length} violation types${flag}`);
    for (const v of r.violations) {
      all[v.id] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: [] };
      all[v.id].pages.add(route);
      for (const n of v.nodes.slice(0,3)) all[v.id].nodes.push(`${route}: ${n.target.join(' ')} :: ${(n.failureSummary||'').split('\n').slice(1).join(' ')}`.slice(0,230));
    }
  } catch (e) { lines.push(`${route}: ERROR ${e.message.slice(0,70)}`); }
  await p.close();
}
await b.close();
console.log(lines.join('\n'));
console.log('\n=== AGGREGATED ===');
const ord = { critical:0, serious:1, moderate:2, minor:3 };
for (const [id,v] of Object.entries(all).sort((a,b)=>(ord[a[1].impact]??9)-(ord[b[1].impact]??9))) {
  console.log(`\n[${v.impact}] ${id} — ${v.help}`);
  console.log('  pages:', [...v.pages].join(', '));
  for (const n of [...new Set(v.nodes)].slice(0,3)) console.log('   ·', n);
}
if (!Object.keys(all).length) console.log('(none)');
