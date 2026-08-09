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
const USER = { id:1, email:"a@b.c", username:"admin", is_admin:true, is_active:true, email_verified:true, balance:100 };
const PAGES = process.argv[2] ? JSON.parse(process.argv[2]) : ["/dashboard","/dashboard/router","/dashboard/billing","/dashboard/fellows",
               "/dashboard/api-keys","/dashboard/admin/users","/dashboard/playground","/dashboard/logs"];
const b = await chromium.launch();
let bad=0;
for (const path of PAGES) {
  const ctx = await b.newContext({ viewport:{width:1440,height:1000}, colorScheme:"dark" });
  await ctx.addCookies([{name:"yunxin_session",value:"probe",domain:"localhost",path:"/"},{name:"NEXT_LOCALE",value:"zh-TW",domain:"localhost",path:"/"}]);
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
  await p.goto("http://localhost:3213"+path, { waitUntil:"networkidle" }).catch(()=>{});
  await p.waitForTimeout(1400);
  await p.evaluate(() => document.body.setAttribute("tabindex","-1"));
  await p.locator("body").focus();
  let hits=0, sample=null;
  for (let i=0;i<100;i++) {
    await p.keyboard.press("Tab");
    await p.waitForTimeout(80);
    const d = await p.evaluate(() => {
      const a=document.activeElement; if(!a||a===document.body) return null;
      for (let el=a; el && el!==document.documentElement; el=el.parentElement) {
        const cs=getComputedStyle(el);
        if (cs.pointerEvents==="none" && Number(cs.opacity)<1)
          return { label:(a.getAttribute("aria-label")||a.textContent||"").trim().slice(0,24), region:(el.className||"").toString().slice(0,50) };
      }
      return null;
    });
    if (d) { hits++; sample ??= d; }
  }
  if (hits) { bad++; console.log(`  ✗ ${path}: ${hits}x — ${JSON.stringify(sample)}`); } else console.log(`  ✓ ${path}`);
  await ctx.close();
}
await b.close();
console.log(bad ? `\n${bad} page(s) affected` : "\nno page lets keyboard focus into a hidden or disabled region");
