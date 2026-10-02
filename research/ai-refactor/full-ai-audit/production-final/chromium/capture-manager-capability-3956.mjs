import { chromium, expect } from "../../../../../site/node_modules/@playwright/test/index.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));
const report={baseURL:"http://localhost:3956",families:["model-manager-card","capability-selector"],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],origins:new Set(),screenshots:[],interactions:[],axe:[],fixtureStates:{modelManager:{selectSlot:true,disabledState:false,emptyState:false,editableActionsHaveCallbacks:false},capabilitySelector:{controlledType:true,disabledState:false,emptyState:false,filterText:false}}};
const routes=[
 {family:"model-manager-card",path:"/docs/ai/model-manager-card",heading:"Model Manager Card",previewText:"ModelManagerCard"},
 {family:"capability-selector",path:"/docs/ai/capability-selector",heading:"Capability Selector",previewText:"Basic"},
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
 const current=await page.locator("html").getAttribute("class");if(current!==theme)await page.locator(`button[aria-label="${theme}"]`).click();if(await page.locator("html").getAttribute("class")!==theme)throw new Error(`${tag}: theme UI failed to set ${theme}`);
 await page.setViewportSize(viewport);const preview=page.locator(".not-prose.my-6").filter({hasText:route.previewText}).last();await preview.waitFor({state:"visible"});await preview.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.fonts.ready);return{context,page,preview};
}
async function capture(target,name){const path=join(root,name);await target.screenshot({path,animations:"disabled"});report.screenshots.push(name);}
async function axeWithin(page,target,tag){
 if(!(await page.evaluate(()=>Boolean(window.axe)))){const source=await readFile(new URL("../../../../../site/node_modules/axe-core/axe.min.js",import.meta.url),"utf8");await page.addScriptTag({content:source});}
 const violations=await target.evaluate(async el=>{const result=await window.axe.run(el);return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});report.axe.push({tag,violations});return violations;
}
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const route of routes){for(const [w,viewport] of widths){for(const theme of ["light","dark"]){const tag=`${route.family}-${w}-${theme}`;const {context,page,preview}=await open(browser,route,viewport,theme,tag);await capture(preview,`final-${route.family}-${w}-${theme}.png`);if(w==="390"){const target=route.family==="model-manager-card"?preview.locator(".card").first():preview.locator(".grid").first();const violations=await axeWithin(page,target,`${tag}-component`);if(violations.length)report.failures.push(`${tag} scoped axe: ${JSON.stringify(violations)}`)}await context.close();}}}
 // ModelManagerCard real controlled checkbox fixture: toggle and verify host-selected appearance.
 {
  const route=routes.find(r=>r.family==="model-manager-card");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","model-manager-select-state");const card=preview.locator(".card").first();const checkbox=preview.getByRole("checkbox",{name:"Select model"});await expect(checkbox).not.toBeChecked();await checkbox.check();await expect(checkbox).toBeChecked();await expect(card).toHaveClass(/ring-2/);const violations=await axeWithin(page,card,"model-manager-selected-390");if(violations.length)report.failures.push(`ModelManager selected axe: ${JSON.stringify(violations)}`);await capture(preview,"final-v3-interaction-model-manager-selected.png");report.interactions.push("ModelManager select checkbox toggles controlled selected card state");await context.close();
 }
 // CapabilitySelector controlled host fixture: pointer and keyboard toggles reflect through aria-pressed.
 {
  const route=routes.find(r=>r.family==="capability-selector");const {context,page,preview}=await open(browser,route,{width:390,height:844},"light","capability-selector-host-state");const chat=preview.getByRole("button",{name:/Chat/});const vision=preview.getByRole("button",{name:/Vision/});const streaming=preview.getByRole("button",{name:/Streaming/});const thinking=preview.getByRole("button",{name:/Thinking/});await expect(chat).toHaveAttribute("aria-pressed","true");await expect(vision).toHaveAttribute("aria-pressed","true");await streaming.click();await expect(streaming).toHaveAttribute("aria-pressed","true");await vision.click();await expect(vision).toHaveAttribute("aria-pressed","false");await thinking.focus();await thinking.press("Space");await expect(thinking).toHaveAttribute("aria-pressed","true");const violations=await axeWithin(page,preview.locator(".grid").first(),"capability-selector-selected-390");if(violations.length)report.failures.push(`CapabilitySelector interaction axe: ${JSON.stringify(violations)}`);await capture(preview,"final-v3-interaction-capability-selector-selected.png");report.interactions.push("CapabilitySelector pointer and Space toggles update controlled selected values");await context.close();
 }
}catch(error){report.failures.push(error?.stack??String(error));}
finally{
 if(browser)await browser.close();report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(x=>!new Set(["http://localhost:3956","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(x));await writeFile(join(root,"manager-capability-log-3956.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));
}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length)process.exitCode=1;
