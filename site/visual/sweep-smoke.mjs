/** Local fixtures proving the visual harness rejects false-pass conditions. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('..', import.meta.url));

function html(path, requestUrl) {
  const wrongTheme = path === '/wrong-theme';
  const pageError = path === '/pageerror';
  const hidden = path === '/hidden';
  const opacityZero = path === '/opacity-zero';
  const empty = path === '/empty';
  const contrastFixture = path === '/dashboard/router';
  if (path === '/login') return `<!doctype html><html lang="en"><head><title>Fixture</title></head><body><main id="admin-main"><h1>Sign in</h1><input placeholder="name@example.com"><input type="password"><button onclick="history.pushState({}, '', '/dashboard')">Sign in</button></main></body></html>`;
  const contrastContent = contrastFixture
    ? `<div aria-disabled="true"><span class="bad-contrast">Inactive automatic mode</span></div>${new URL(requestUrl).searchParams.has('mixed') ? '<span class="bad-contrast">Active text</span>' : ''}`
    : '';
  return `<!doctype html><html lang="en"><head><title>Fixture</title><script>
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = ${wrongTheme ? "'dark'" : 'theme'};
    document.documentElement.setAttribute('data-theme', ${wrongTheme ? "'dark'" : 'theme'});
  </script><style>body{background:#fff;color:#111} .hidden{pointer-events:none;opacity:.5} .opacity-zero{pointer-events:auto;opacity:0} .bad-contrast{color:#eee;background:#fff}</style></head><body>${empty ? '<main id="admin-main"></main>' : `<main id="admin-main"><h1>Local fixture</h1><button>Continue</button>${contrastContent}</main>`}${hidden ? '<button class="hidden">Hidden control</button>' : ''}${opacityZero ? '<button class="opacity-zero">Transparent control</button>' : ''}${pageError ? '<script>setTimeout(() => { throw new Error("fixture pageerror") }, 20)</script>' : ''}</body></html>`;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost');
  const path = requestUrl.pathname;
  if (path === '/auth-redirect') {
    response.writeHead(302, { location: '/login' }); response.end(); return;
  }
  if (path === '/404') {
    response.writeHead(404, { 'content-type': 'text/plain' }); response.end('fixture 404'); return;
  }
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(html(path, requestUrl.href));
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

function run(script, args = [], env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], {
      cwd: siteRoot,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.setEncoding('utf8').on('data', chunk => { output += chunk; });
    child.stderr.setEncoding('utf8').on('data', chunk => { output += chunk; });
    const timeout = setTimeout(() => child.kill('SIGKILL'), 90000);
    child.on('error', error => { clearTimeout(timeout); reject(error); });
    child.on('close', status => { clearTimeout(timeout); resolve({ status, output }); });
  });
}

async function expectExit(script, args, env, status, label) {
  const result = await run(script, args, env);
  assert.equal(result.status, status, `${label}: expected exit ${status}, got ${result.status}\n${result.output}`);
  console.log(`✓ ${label} → exit ${status}`);
}

try {
  const target = (name, path) => JSON.stringify([{ name, url: `${base}${path}` }]);
  const themeEnv = {};
  await expectExit('axe.mjs', [target('fixture', '/ok')], {}, 0, 'default axe clean fixture');
  await expectExit('axe.mjs', ['[]'], {}, 1, 'empty default axe target list');
  await expectExit('axe.mjs', ['{'], {}, 1, 'invalid default axe target JSON');
  await expectExit('axe.mjs', [target('fixture', '/404')], {}, 1, 'default axe HTTP 404 is fatal');
  await expectExit('axe.mjs', [target('fixture', '/auth-redirect')], {}, 1, 'default axe auth redirect is fatal');
  await expectExit('axe.mjs', [target('fixture', '/pageerror')], {}, 1, 'default axe pageerror is fatal');
  await expectExit('axe-theme.mjs', ['light', target('fixture', '/ok')], themeEnv, 0, 'axe theme clean fixture');
  await expectExit('axe-theme.mjs', ['light', '[]'], themeEnv, 1, 'empty axe target list');
  await expectExit('axe-theme.mjs', ['light', '{'], themeEnv, 1, 'invalid axe target JSON');
  await expectExit('axe-theme.mjs', ['light', target('fixture', '/404')], themeEnv, 1, 'HTTP 404 is fatal');
  await expectExit('axe-theme.mjs', ['light', target('fixture', '/auth-redirect')], themeEnv, 1, 'authentication redirect is fatal');
  await expectExit('axe-theme.mjs', ['light', target('fixture', '/pageerror')], themeEnv, 1, 'browser pageerror is fatal');
  await expectExit('axe-theme.mjs', ['light', target('fixture', '/wrong-theme')], themeEnv, 1, 'theme mismatch is fatal');
  await expectExit('axe-theme.mjs', ['light', JSON.stringify([{ name: 'fixture', url: 'http://127.0.0.1:1/nope' }])], themeEnv, 1, 'navigation failure is fatal');

  const focusEnv = { FOCUS_BASE: base };
  await expectExit('focus-walk.mjs', [JSON.stringify(['/ok'])], focusEnv, 0, 'real tab walk clean fixture');
  await expectExit('focus-walk.mjs', [JSON.stringify(['/hidden'])], focusEnv, 1, 'hidden tab stop fails gate');
  await expectExit('focus-walk.mjs', [JSON.stringify(['/opacity-zero'])], focusEnv, 1, 'opacity-zero tab stop fails gate');
  await expectExit('focus-walk.mjs', [JSON.stringify(['/404'])], focusEnv, 1, 'focus-walk HTTP 404 is fatal');
  await expectExit('focus-walk.mjs', [JSON.stringify(['/login'])], focusEnv, 1, 'focus-walk auth screen is fatal');
  await expectExit('focus-walk.mjs', [JSON.stringify(['/pageerror'])], focusEnv, 1, 'focus-walk pageerror is fatal');
  await expectExit('focus-walk.mjs', ['[]'], focusEnv, 1, 'empty focus route list');
  await expectExit('focus-walk.mjs', ['{'], focusEnv, 1, 'invalid focus route JSON');

  await expectExit('axe-authed.mjs', [JSON.stringify(['/ok'])], { A11Y_BASE: base }, 0, 'synthetic authenticated fixture');
  await expectExit('axe-authed.mjs', [JSON.stringify(['/404'])], { A11Y_BASE: base }, 1, 'authenticated sweep HTTP 404 is fatal');
  await expectExit('axe-authed.mjs', [JSON.stringify(['/auth-redirect'])], { A11Y_BASE: base }, 1, 'authenticated sweep redirect is fatal');
  await expectExit('axe-authed.mjs', [JSON.stringify(['/pageerror'])], { A11Y_BASE: base }, 1, 'authenticated sweep pageerror is fatal');
  await expectExit('axe-news-admin.mjs', [JSON.stringify(['/ok'])], { NEWS_A11Y_BASE: base }, 0, 'synthetic admin fixture');
  await expectExit('axe-news-admin.mjs', [JSON.stringify(['/empty'])], { NEWS_A11Y_BASE: base }, 1, 'admin readiness failure is fatal');
  await expectExit('axe-news-admin.mjs', [JSON.stringify(['/pageerror'])], { NEWS_A11Y_BASE: base }, 1, 'admin pageerror is fatal');
  await expectExit('axe-yunxin-live.mjs', [JSON.stringify(['/dashboard'])], { A11Y_BASE: base, A11Y_EMAIL: 'fixture@example.test', A11Y_PASSWORD: 'fixture-only' }, 0, 'local login fixture pass');
  await expectExit('axe-yunxin-live.mjs', [JSON.stringify(['/dashboard/router'])], { A11Y_BASE: base, A11Y_EMAIL: 'fixture@example.test', A11Y_PASSWORD: 'fixture-only' }, 0, 'specific inactive-control contrast exception');
  await expectExit('axe-yunxin-live.mjs', [JSON.stringify(['/dashboard/router?mixed=1'])], { A11Y_BASE: base, A11Y_EMAIL: 'fixture@example.test', A11Y_PASSWORD: 'fixture-only' }, 1, 'unrelated router contrast still fails');
  await expectExit('axe-yunxin-live.mjs', [JSON.stringify(['/404'])], { A11Y_BASE: base, A11Y_EMAIL: 'fixture@example.test', A11Y_PASSWORD: 'fixture-only' }, 1, 'live sweep HTTP 404 is fatal');
  await expectExit('axe-yunxin-live.mjs', [JSON.stringify(['/pageerror'])], { A11Y_BASE: base, A11Y_EMAIL: 'fixture@example.test', A11Y_PASSWORD: 'fixture-only' }, 1, 'live sweep pageerror is fatal');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
