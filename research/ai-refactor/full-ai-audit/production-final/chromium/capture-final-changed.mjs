import { chromium, expect } from "../../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));await mkdir(root,{recursive:true});
const report={baseURL:"http://localhost:3954",families:["model-select","account-menu","language-switcher","navbar"],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],origins:new Set(),screenshots:[],interactions:[],measurements:{}};
const routes=[
 {family:"model-select",path:"/docs/ai/model-select",previewText:"Basic",heading:"Model Select"},
 {family:"account-menu",path:"/docs/ai/account-menu",previewText:"Signed in",heading:"Account Menu"},
 {family:"language-switcher",path:"/docs/ai/language-switcher",previewText:"Basic",heading:"Language Switcher"},
 {family:"navbar",path:"/docs/ai/navbar",previewText:"Basic",heading:"Navbar"},
];
const widths=[["390",{width:390,height:844}],["768",{width:768,height:1000}],["1440",{width:1440,height:1000}]];
function watch(page,tag){
 page.on("pageerror",e=>report.pageErrors.push(`${tag}: ${e.message}`));
 page.on("console",m=>{if(m.type()==="error")report.consoleErrors.push(`${tag}: ${m.text()}`)});
 page.on("requestfailed",r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==="net::ERR_ABORTED"&&new URL(r.url()).searchParams.has("_rsc"))report.nextPrefetchCancellations.push(s);else report.requestFailures.push(s)});
 page.on("request",r=>report.origins.add(new URL(r.url()).origin));
 page.on("response",r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
}
async function open(browser,route,viewport,theme,tag){
 const context=await browser.newContext({viewport:{width:768,height:1000},deviceScaleFactor:1,reducedMotion:"reduce"});const page=await context.newPage();watch(page,tag);
 const response=await page.goto(`http://localhost:3954${route.path}`,{waitUntil:"domcontentloaded"});if(response?.status()!==200)throw new Error(`${tag}: HTTP ${response?.status()}`);
 await page.getByRole("heading",{name:new RegExp(route.heading,"i")}).first().waitFor({state:"visible"});
 const current=await page.locator("html").getAttribute("class");if(theme!==current)await page.locator(`button[aria-label="${theme}"]`).click();
 if(await page.locator("html").getAttribute("class")!==theme)throw new Error(`${tag}: theme UI failed to set ${theme}`);
 await page.setViewportSize(viewport);const candidates=page.locator(".not-prose.my-6").filter({hasText:route.previewText});const preview=route.previewIndex==null?candidates.last():candidates.nth(route.previewIndex);await preview.waitFor({state:"visible"});await preview.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.fonts.ready);return{context,page,preview};
}
async function capture(target,name){const path=join(root,name);await target.screenshot({path,animations:"disabled"});report.screenshots.push(name);}
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const route of routes){for(const [w,viewport] of widths){for(const theme of ["light","dark"]){const tag=`${route.family}-${w}-${theme}-fresh`;const {context,preview}=await open(browser,route,viewport,theme,tag);await capture(preview,`final-${route.family}-${w}-${theme}.png`);await context.close();}}}
 // Measure Navbar real child geometry at the narrow-content 768px docs breakpoint.
 {
  const route=routes.find(x=>x.family==="navbar");const {context,preview}=await open(browser,route,{width:768,height:1000},"light","navbar-768-overlap-measure");
  const measure=await preview.locator("nav").evaluate(nav=>{const items=[...nav.querySelectorAll("a,button")].map(el=>{const r=el.getBoundingClientRect();return{label:el.textContent?.trim().replace(/\s+/g," ")||el.getAttribute("aria-label")||"",left:r.left,right:r.right,top:r.top,bottom:r.bottom,display:getComputedStyle(el).display}}).filter(x=>x.display!=="none"&&x.right>x.left);const pairs=[];for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j];if(Math.max(a.left,b.left)<Math.min(a.right,b.right)&&Math.max(a.top,b.top)<Math.min(a.bottom,b.bottom))pairs.push([a.label,b.label])}return{navRect:(()=>{const r=nav.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width}})(),items,overlapPairs:pairs}});
  report.measurements.navbar768=measure;if(measure.overlapPairs.length)throw new Error(`Navbar 768px overlap pairs: ${JSON.stringify(measure.overlapPairs)}`);await context.close();
 }
 // Measure the expanded mobile Navbar panel and both auth rows relative to the current 340px docs preview frame.
 {
  const route=routes.find(x=>x.family==="navbar");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","navbar-mobile-menu-final");const frame=preview.locator(".relative.overflow-hidden").first();const trigger=preview.getByRole("button",{name:"Menu",exact:true});await trigger.click();await expect(trigger).toHaveAttribute("aria-expanded","true");
  const mobileLinks=preview.getByRole("link",{name:/^(Home|Models|Pricing|Docs|Sign In|Sign Up)$/});for(const label of ["Home","Models","Pricing","Docs","Sign In","Sign Up"])await expect(preview.getByRole("link",{name:label,exact:true})).toBeVisible();
  const rects=await Promise.all(["Home","Models","Pricing","Docs","Sign In","Sign Up"].map(async label=>({label,...await preview.getByRole("link",{name:label,exact:true}).evaluate(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom}})})));
  const fr=await frame.boundingBox();const outside=rects.filter(r=>r.left<fr.x||r.right>fr.x+fr.width||r.top<fr.y||r.bottom>fr.y+fr.height);report.measurements.navbarMobileMenu={frame:fr,links:rects,outsideFrame:outside};
  if(outside.length)report.interactions.push(`Navbar preview still clips ${outside.map(x=>x.label).join(", ")} outside its 340px frame`);
  await capture(page,`final-interaction-navbar-mobile-menu-fullviewport.png`);await capture(preview,`final-interaction-navbar-mobile-menu-preview.png`);await context.close();
 }
 // Account menu changed its right anchoring; measure popup against viewport and verify Escape focus restore.
 {
  const route=routes.find(x=>x.family==="account-menu");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","account-menu-final-open");const trigger=preview.getByRole("button",{name:"Yuhuan"});await trigger.click();const menu=page.getByRole("menu");await expect(menu.getByRole("menuitem",{name:/API keys/})).toBeVisible();for(const label of ["Saved","Admin","Sign out"])await expect(menu.getByRole("menuitem",{name:new RegExp(label)})).toBeVisible();await expect.poll(async()=>{const r=await menu.boundingBox();return !!r&&r.x>=0&&r.x+r.width<=390}).toBe(true);const r=await menu.boundingBox();report.measurements.accountMenu390={menu:r,withinViewport:true};await capture(page,"final-interaction-account-menu-open.png");await page.keyboard.press("Escape");await expect(trigger).toBeFocused();report.interactions.push("AccountMenu Escape restores trigger focus; right-shifted menu fits viewport");await context.close();
 }
 // Language dropdown must remain within the narrow docs preview viewport and return the host-selected locale.
 {
  const route=routes.find(x=>x.family==="language-switcher");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","language-menu-final-open");const trigger=preview.getByRole("button",{name:"Language: English"});await trigger.click();for(const label of ["English","简体中文","繁體中文"])await expect(preview.getByRole("button",{name:label,exact:true})).toBeVisible();const panelId=await trigger.getAttribute("aria-controls");await expect.poll(async()=>{const rect=await page.locator(`#${panelId}`).boundingBox();return !!rect&&rect.x>=0&&rect.x+rect.width<=390}).toBe(true);const rect=await page.locator(`#${panelId}`).boundingBox();report.measurements.languageMenu390={rect,withinViewport:true};await capture(page,"final-interaction-language-menu-open.png");await preview.getByRole("button",{name:"繁體中文",exact:true}).click();await expect(preview.getByRole("button",{name:"Language: 繁體中文"})).toBeVisible();report.interactions.push("LanguageSwitcher updates host locale and remains viewport anchored");await context.close();
 }
 // ModelSelect open/pin/axe/focus sequence.
 {
  const route=routes.find(x=>x.family==="model-select");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","model-select-pin-axe");const trigger=preview.getByRole("button",{name:/Claude Opus 4\.8/});await trigger.click();const panel=page.locator('[data-yunui="model-select-panel"]');await expect(panel).toBeVisible();const combobox=panel.getByRole("combobox");await expect(combobox).toBeFocused();const listbox=panel.getByRole("listbox");await expect(listbox).toHaveAttribute("aria-owns",/yunui-ms-/);await expect(panel.getByRole("option").first()).toBeVisible();
  const pin=panel.getByRole("button",{name:"Pin",exact:true}).first();const nested=await pin.evaluate(el=>el.closest('[role="option"]')!==null);if(nested)throw new Error("ModelSelect pin control is nested in role=option");await pin.focus();await pin.press("Enter");const unpin=panel.getByRole("button",{name:"Unpin",exact:true}).first();await expect(unpin).toBeFocused();await expect(trigger).toContainText("Claude Opus 4.8");
  const axe=await readFile(new URL("../../../../../site/node_modules/axe-core/axe.min.js",import.meta.url),"utf8");await page.addScriptTag({content:axe});const violations=await panel.evaluate(async el=>{const result=await window.axe.run(el,{runOnly:["aria-required-children","nested-interactive","aria-valid-attr-value"]});return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});report.measurements.modelSelect390Axe=violations;if(violations.length)throw new Error(`ModelSelect scoped axe violations: ${JSON.stringify(violations)}`);await capture(panel,"final-interaction-model-select-pinned-open.png");
  await combobox.focus();await combobox.press("Escape");await expect(panel).toBeHidden();await expect(trigger).toBeFocused();report.interactions.push("ModelSelect open focus, pin toggle, scoped axe and Escape focus restore pass");await context.close();
 }
}catch(error){report.failures.push(error?.stack??String(error));}
finally{
 if(browser)await browser.close();report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(x=>!new Set(["http://localhost:3954","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(x));await writeFile(join(root,"final-changed-routes-log.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));
}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length)process.exitCode=1;
