import { chromium, expect } from "../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));await mkdir(root,{recursive:true});
const report={baseURL:"http://localhost:3957/docs/chat",failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],origins:new Set(),screenshots:[],matrix:[],componentEvidence:{}};
const themes=["light","dark"],widths=[["390",{width:390,height:980}],["768",{width:768,height:980}],["1440",{width:1440,height:980}]],states=["Idle","Working","Approval","Done","Error"];
const phases={Idle:"waiting",Working:"acting",Approval:"waiting",Done:"completed",Error:"failed"};
function watch(page,tag){
 page.on("pageerror",e=>report.pageErrors.push(`${tag}: ${e.message}`));
 page.on("console",m=>{if(m.type()==="error")report.consoleErrors.push(`${tag}: ${m.text()}`)});
 page.on("requestfailed",r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==="net::ERR_ABORTED"&&new URL(r.url()).searchParams.has("_rsc"))report.nextPrefetchCancellations.push(s);else report.requestFailures.push(s)});
 page.on("request",r=>report.origins.add(new URL(r.url()).origin));
 page.on("response",r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
}
async function open(page,theme,width,tag){
 await page.setViewportSize(width);await page.emulateMedia({reducedMotion:"reduce",colorScheme:theme});await page.addInitScript(value=>localStorage.setItem("theme",value),theme);
 const response=await page.goto("http://localhost:3957/docs/chat",{waitUntil:"domcontentloaded"});if(response?.status()!==200)throw new Error(`${tag}: /docs/chat returned ${response?.status()}`);
 await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`));const demo=page.getByTestId("chat-demo-root");await expect(demo).toBeVisible();
 const statesControl=page.getByRole("group",{name:"Agent state fixture"});
 const idle=statesControl.getByRole("button",{name:"Idle",exact:true});await idle.click();await expect(idle).toHaveAttribute("aria-pressed","true");await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase","waiting");
 const working=statesControl.getByRole("button",{name:"Working",exact:true});await working.click();await expect(working).toHaveAttribute("aria-pressed","true");await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase","acting");
 report.componentEvidence["public package markers"]={header:await demo.locator('[data-yunui="chat-header"]').count(),messages:await demo.locator('[data-yunui="chat-message"]').count(),composer:await demo.locator('[data-yunui="chat-composer"]').count()};
 return {demo,statesControl};
}
try{
 const browser=await chromium.launch({headless:true});
 for(const theme of themes)for(const [widthLabel,viewport] of widths)for(const state of states){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:"reduce"});const page=await context.newPage();const tag=`${state}-${theme}-${widthLabel}`;watch(page,tag);const {demo,statesControl}=await open(page,theme,viewport,tag);const control=statesControl.getByRole("button",{name:state,exact:true});await control.click();await expect(control).toHaveAttribute("aria-pressed","true");await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase",phases[state]);
  if(state==="Approval"){await expect(demo.getByRole("button",{name:"Allow",exact:true})).toBeEnabled();await expect(demo.getByRole("button",{name:"Deny",exact:true})).toBeEnabled();await expect(demo.getByTestId("chat-demo-question")).toBeVisible();}
  if(state==="Working"){await expect(demo.locator('[data-yunui="thinking-block"]')).toBeVisible();await expect(demo.getByRole("button",{name:"Stop",exact:true})).toBeVisible();}
  if(state==="Done"){await expect(demo.locator('span[title="route-checks.ts"]')).toBeVisible();await expect.poll(()=>demo.locator('span[title="all-routes.ts"]').locator("xpath=../..").locator(".shiki-wrapper code > span").count()).toBe(8);}
  if(state==="Error"){await expect(demo.locator('[data-yunui="agent-task-row"]').filter({hasText:"Typecheck failed"})).toBeVisible();}
  const file=join(root,`chat-${state.toLowerCase()}-${theme}-${widthLabel}.png`);await demo.screenshot({path:file,animations:"disabled"});report.screenshots.push(file.slice(root.length+1));report.matrix.push({state,theme,width:widthLabel,phase:phases[state]});await context.close();
 }
 await browser.close();
}catch(error){report.failures.push(error?.stack??String(error));}
finally{report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(x=>!new Set(["http://localhost:3957","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(x));await writeFile(join(root,"matrix-log.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length)process.exitCode=1;
