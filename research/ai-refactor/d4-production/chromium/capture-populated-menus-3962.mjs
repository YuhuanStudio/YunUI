import { chromium, webkit, expect } from "../../../../site/node_modules/@playwright/test/index.mjs";
import axe from "../../../../site/node_modules/axe-core/axe.min.js";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));const out=join(root,"populated-menus-3962");await mkdir(out,{recursive:true});
const report={baseURL:"http://127.0.0.1:3962/docs/chat",cases:[],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],rscAborts:[],httpErrors:[],screenshots:[]};
for(const [engineName,engine] of [["chromium",chromium],["webkit",webkit]]){
 const browser=await engine.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
  page.on("pageerror",e=>report.pageErrors.push(`${engineName}: ${e.message}`));
  page.on("console",m=>{if(m.type()==="error")report.consoleErrors.push(`${engineName}: ${m.text()}`)});
  page.on("requestfailed",r=>{const msg=`${engineName}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==="net::ERR_ABORTED"&&new URL(r.url()).searchParams.has("_rsc"))report.rscAborts.push(msg);else report.requestFailures.push(msg)});
  page.on("response",r=>{if(r.status()>=400)report.httpErrors.push(`${engineName}: ${r.status()} ${r.url()}`)});
  await page.emulateMedia({reducedMotion:"reduce",colorScheme:"light"});
  await page.addInitScript(()=>localStorage.setItem("theme","light"));
  const response=await page.goto(report.baseURL,{waitUntil:"domcontentloaded"});if(response?.status()!==200)throw new Error(`${engineName}: route HTTP ${response?.status()}`);
  const states=page.getByRole("group",{name:"Agent state fixture"});const idle=states.getByRole("button",{name:"Idle",exact:true});await states.getByRole("button",{name:"Working",exact:true}).click();await expect(states.getByRole("button",{name:"Working",exact:true})).toHaveAttribute("aria-pressed","true");await idle.click();await expect(idle).toHaveAttribute("aria-pressed","true");
  const demo=page.getByTestId("chat-demo-root"),prompt=demo.getByRole("textbox",{name:"Message prompt"});
  for(const mode of ["sources","commands"]){
   const token=mode==="sources"?"Find @":"Run /";await prompt.fill(token);
   const label=mode==="sources"?"Sources":"Commands",menu=demo.getByRole("listbox",{name:label});await expect(menu).toBeVisible();
   const names=mode==="sources"?["Workspace docs","Web search","Shared drive"]:["summarize","review"];
   for(const name of names)await expect(menu.getByRole("option",{name})).toBeVisible();
   const hovered=menu.getByRole("option",{name:mode==="sources"?"Web search":"review"});await hovered.hover();await expect(hovered).toHaveAttribute("data-active","true");
   await page.addScriptTag({content:axe.source});
   const result=await page.evaluate(async()=>{const root=document.querySelector('[data-testid="chat-demo-root"]');if(!root)throw new Error("ChatDemo root missing");return await window.axe.run(root,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"]}})});
   const caseResult={engine:engineName,mode,options:names,hovered:mode==="sources"?"Web search":"review",violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))}))};report.cases.push(caseResult);
   if(caseResult.violations.length)throw new Error(`${engineName} ${mode} Axe: ${JSON.stringify(caseResult.violations)}`);
   const shot=join(out,`${engineName}-${mode}-hover.png`);await menu.screenshot({path:shot,animations:"disabled"});report.screenshots.push(shot.slice(root.length+1));
  }
  await page.close();
 }catch(error){report.failures.push(error?.stack??String(error))}finally{await browser.close()}
}
report.timestamp=new Date().toISOString();await writeFile(join(out,"log.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length)process.exitCode=1;
