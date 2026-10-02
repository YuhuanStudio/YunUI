/**
 * Keyboard-reachability check: does Tab ever land on something the sight and
 * the mouse cannot reach?
 *
 * `pointer-events: none` and `opacity: 0` stop the mouse and the eye. They do
 * NOT remove anything from the tab order. Two real cases in this codebase:
 *
 *  - the dashboard's collapsed-sidebar toggle animates to
 *    `max-w-0 opacity-0 pointer-events-none` while the sidebar is open, and a
 *    keyboard user landed on an invisible "open menu" button on every page;
 *  - `/dashboard/router`'s tier-gated cards were dimmed with
 *    `opacity-50 pointer-events-none` and still held 16 focusable controls that
 *    silently did nothing.
 *
 * Both are fixed with `inert`, which is the attribute that actually means
 * "not here". axe cannot see either: the elements are perfectly labelled and,
 * for the dimmed cards, WCAG 1.4.3 exempts inactive components from contrast —
 * so nothing flagged them.
 *
 * Notes for anyone extending this:
 *  - Walk with real `Tab` keypresses. Calling `.focus()` bypasses `inert` and
 *    reports success that a user would never get.
 *  - Test the ancestors' COMPUTED style, not the class string:
 *    `lg:pointer-events-none` is in the className at every width.
 *  - Stub the API. An unstubbed dashboard sits in a permanent loading state
 *    whose fading skeletons produce a page of false positives.
 */
import { chromium } from "@playwright/test";
import { assertExpectedPath, assertLocalBase, assertNoPageErrors, collectPageErrors, exitOnError, gotoChecked, parsePaths, walkTabFocus } from "./sweep-utils.mjs";
const USER = { id:1, email:"a@b.c", username:"admin", is_admin:true, is_active:true, email_verified:true, balance:100 };
const DEFAULT_PAGES = ["/dashboard","/dashboard/router","/dashboard/billing","/dashboard/fellows",
               "/dashboard/api-keys","/dashboard/admin/users","/dashboard/playground","/dashboard/logs"];
const BASE = assertLocalBase(process.env.FOCUS_BASE ?? "http://localhost:3213");
let PAGES;
try { PAGES = parsePaths(process.argv[2], DEFAULT_PAGES); }
catch (error) { exitOnError(error); process.exit(); }
const b = await chromium.launch();
let bad=0;
try { for (const path of PAGES) {
  const ctx = await b.newContext({ viewport:{width:1440,height:1000}, colorScheme:"dark" });
  const cookieHost = new URL(BASE).hostname;
  await ctx.addCookies([{name:"yunxin_session",value:"synthetic-focus-fixture",domain:cookieHost,path:"/"},{name:"NEXT_LOCALE",value:"zh-TW",domain:cookieHost,path:"/"}]);
  const p = await ctx.newPage();
  await p.route("**/api/**", r => {
    const u=r.request().url();
    if (/\/api\/auth\/me/.test(u)) return r.fulfill({json:USER});
    if (/\/api\/admin\/providers/.test(u)) return r.fulfill({json:[]});
    if (/\/api\/models/.test(u)) return r.fulfill({json:{data:[]}});
    if (/\/api\/notifications\/unread-count/.test(u)) return r.fulfill({json:{count:0}});
    if (/\/api\/billing\/balance/.test(u)) return r.fulfill({json:{balance:100}});
    return r.fulfill({json:{data:[],total:0}});
  });
  const errors = collectPageErrors(p);
  await gotoChecked(p, BASE+path, { waitUntil:"networkidle", timeout:30000 }, path);
  assertExpectedPath(p, path, path);
  await p.waitForTimeout(1400);
  const ready = await p.evaluate(() => ({
    body: Boolean(document.body?.innerText.trim()),
    heading: document.querySelectorAll("h1,h2").length > 0,
    login: /\/login\/?$/.test(location.pathname),
    passwordForm: Boolean(document.querySelector('input[type="password"]')),
    loading: /^\s*(Loading|載入|加载)/i.test(document.querySelector("main")?.innerText ?? ""),
  }));
  if (!ready.body || !ready.heading || ready.login || ready.passwordForm || ready.loading) {
    throw new Error(`${path}: page not ready/authenticated (${JSON.stringify(ready)})`);
  }
  assertNoPageErrors(errors, path);
  const hits = await walkTabFocus(p, 100);
  assertNoPageErrors(errors, path);
  if (hits.length) { bad++; console.log(`  ✗ ${path}: ${hits.length}x — ${JSON.stringify(hits[0])}`); } else console.log(`  ✓ ${path}`);
  await ctx.close();
} } catch (error) { exitOnError(error); }
finally { await b.close(); }
console.log(bad ? `\n${bad} page(s) affected` : "\nno page lets keyboard focus into a hidden or disabled region");
if (bad) process.exitCode=1;
