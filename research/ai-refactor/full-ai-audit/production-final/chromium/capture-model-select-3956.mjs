import { chromium, expect } from "../../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));await mkdir(root,{recursive:true});
const report={baseURL:"http://localhost:3956",families:["model-select"],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],origins:new Set(),screenshots:[],interactions:[],measurements:{}};
const routes=[
 {family:"model-select",path:"/docs/ai/model-select",previewText:"Basic",heading:"Model Select"},
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
 const response=await page.goto(`http://localhost:3956${route.path}`,{waitUntil:"domcontentloaded"});if(response?.status()!==200)throw new Error(`${tag}: HTTP ${response?.status()}`);
 await page.getByRole("heading",{name:new RegExp(route.heading,"i")}).first().waitFor({state:"visible"});
 const current=await page.locator("html").getAttribute("class");if(theme!==current)await page.locator(`button[aria-label="${theme}"]`).click();
 if(await page.locator("html").getAttribute("class")!==theme)throw new Error(`${tag}: theme UI failed to set ${theme}`);
 await page.setViewportSize(viewport);const candidates=page.locator(".not-prose.my-6").filter({hasText:route.previewText});const preview=route.previewIndex==null?candidates.last():candidates.nth(route.previewIndex);await preview.waitFor({state:"visible"});await preview.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.fonts.ready);return{context,page,preview};
}
async function capture(target,name){const path=join(root,name);await target.screenshot({path,animations:"disabled"});report.screenshots.push(name);}
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const route of routes){for(const [w,viewport] of widths){for(const theme of ["light","dark"]){const tag=`${route.family}-${w}-${theme}-fresh`;const {context,preview}=await open(browser,route,viewport,theme,tag);await capture(preview,`final-v2-${route.family}-${w}-${theme}.png`);await context.close();}}}
 // ModelSelect open/pin/axe/focus sequence.
 {
  const route=routes.find(x=>x.family==="model-select");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","model-select-pin-axe");const trigger=preview.getByRole("button",{name:/Claude Opus 4\.8/});await trigger.click();const panel=page.locator('[data-yunui="model-select-panel"]');await expect(panel).toBeVisible();await expect.poll(()=>panel.evaluate(el=>getComputedStyle(el).opacity)).toBe("1");await page.waitForTimeout(50);const combobox=panel.getByRole("combobox");await expect(combobox).toBeFocused();const listbox=panel.getByRole("listbox");await expect(listbox).toHaveAttribute("aria-owns",/yunui-ms-/);await expect(panel.getByRole("option").first()).toBeVisible();
  const pin=panel.getByRole("button",{name:"Pin",exact:true}).first();const nested=await pin.evaluate(el=>el.closest('[role="option"]')!==null);if(nested)throw new Error("ModelSelect pin control is nested in role=option");await pin.focus();await pin.press("Enter");const unpin=panel.getByRole("button",{name:"Unpin",exact:true}).first();await expect(unpin).toBeFocused();await expect(trigger).toContainText("Claude Opus 4.8");
  await capture(panel,"final-v3-interaction-model-select-pinned-open.png");const axe=await readFile(new URL("../../../../../site/node_modules/axe-core/axe.min.js",import.meta.url),"utf8");await page.addScriptTag({content:axe});const violations=await panel.evaluate(async el=>{const result=await window.axe.run(el);return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});report.measurements.modelSelect390Axe=violations;if(violations.length)report.interactions.push(`Full scoped axe reported ${violations.length} violation group(s)`);
  await combobox.focus();await combobox.press("Escape");await expect(panel).toBeHidden();await expect(trigger).toBeFocused();report.interactions.push("ModelSelect open focus, pin toggle, scoped axe and Escape focus restore pass");await context.close();
 }
}catch(error){report.failures.push(error?.stack??String(error));}
finally{
 if(browser)await browser.close();report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(x=>!new Set(["http://localhost:3956","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(x));await writeFile(join(root,"model-select-log-3956.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));
}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length||report.measurements.modelSelect390Axe?.length)process.exitCode=1;
