/** Accessibility sweep of local Yunxin authenticated routes, using synthetic auth/API fixtures. */
import { chromium } from '@playwright/test';
import { assertExpectedPath, assertLocalBase, assertNoPageErrors, collectPageErrors, exitOnError, gotoChecked, loadAxe, parsePaths, runAxe } from './sweep-utils.mjs';

const AXE = loadAxe();
const BASE = assertLocalBase(process.env.A11Y_BASE ?? 'http://localhost:3300');
const DEFAULT_ROUTES = ['/dashboard', '/dashboard/api-keys', '/dashboard/billing', '/dashboard/models',
  '/dashboard/analytics', '/dashboard/logs', '/dashboard/notifications', '/dashboard/fellows'];
const USER = { id: 1, email: 'a11y@example.com', name: 'A11y Sweep', display_name: 'A11y Sweep',
  avatar_url: null, is_admin: false, is_active: true, role: 'user', credits: 1000 };

let ROUTES;
try { ROUTES = parsePaths(process.argv[2], DEFAULT_ROUTES); }
catch (error) { exitOnError(error); process.exit(); }

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addCookies([{ name: 'yunxin_session', value: 'synthetic-a11y-fixture', domain: new URL(BASE).hostname, path: '/' }]);
await context.route('**/api/**', async (request) => {
  const url = request.request().url();
  if (url.includes('/api/auth/me')) return request.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) });
  return request.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [], data: [], results: [], total: 0 }) });
});

const all = {}; const lines = []; let failures = 0;
for (const route of ROUTES) {
  const page = await context.newPage();
  const errors = collectPageErrors(page);
  try {
    const response = await gotoChecked(page, BASE + route, { waitUntil: 'networkidle', timeout: 30000 }, route);
    assertExpectedPath(page, route, route);
    if (new URL(page.url()).pathname === '/login') throw new Error(`${route}: synthetic session was rejected; refusing to audit login`);
    await page.waitForTimeout(2000);
    const state = await page.evaluate(() => ({
      headings: document.querySelectorAll('h1,h2').length,
      main: Boolean(document.querySelector('main')),
      loading: /^\s*(Loading|載入|加载)/.test(document.querySelector('main')?.innerText ?? ''),
      body: Boolean(document.body?.innerText.trim()),
      passwordForm: Boolean(document.querySelector('input[type="password"]')),
      denied: /unauthorized|not authorized|access denied/i.test(document.querySelector('main')?.innerText ?? ''),
    }));
    if (!state.body || !state.main || state.headings === 0 || state.loading || state.passwordForm || state.denied) {
      throw new Error(`${route}: authenticated page not ready (${JSON.stringify(state)})`);
    }
    assertNoPageErrors(errors, route);
    const result = await runAxe(page, AXE);
    assertNoPageErrors(errors, route);
    lines.push(`${route.padEnd(26)} ${response.status()} ${result.violations.length} violation types`);
    for (const violation of result.violations) {
      all[violation.id] ??= { impact: violation.impact, help: violation.help, pages: new Set(), nodes: [] };
      all[violation.id].pages.add(route);
      for (const node of violation.nodes.slice(0, 3)) {
        all[violation.id].nodes.push(`${route}: ${node.target.join(' ')} :: ${(node.failureSummary || '').split('\n').slice(1).join(' ')}`.slice(0, 260));
      }
    }
  } catch (error) {
    failures++;
    lines.push(`${route}: ERROR ${error.message.slice(0, 180)}`);
  }
  await page.close();
}
await browser.close();
console.log(lines.join('\n'));
console.log('\n=== AGGREGATED ===');
const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
for (const [id, value] of Object.entries(all).sort((a, b) => (order[a[1].impact] ?? 9) - (order[b[1].impact] ?? 9))) {
  console.log(`\n[${value.impact}] ${id} — ${value.help}`);
  console.log('  pages:', [...value.pages].join(', '));
  for (const node of [...new Set(value.nodes)].slice(0, 3)) console.log('   ·', node);
}
if (!Object.keys(all).length) console.log('(none)');
if (failures || Object.keys(all).length) process.exitCode = 1;
