import { chromium, webkit, expect } from "../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));const out=join(root,"menus-3958");await mkdir(out,{recursive:true});
const report={baseURL:"http://localhost:3958/docs/chat",failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],screenshots:[],origins:new Set()};
try{
 for(const [engine,launcher] of [["chromium",chromium],["webkit",webkit]]){
  const browser=await launcher.launch({headless:true});const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});const page=await context.newPage();const tag=`${engine}-dark-menus`;
  page.on("pageerror",e=>report.pageErrors.push(`${tag}: ${e.message}`));page.on("console",m=>{if(m.type()==="error")report.consoleErrors.push(`${tag}: ${m.text()}`)});page.on("requestfailed",r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==="net::ERR_ABORTED"&&new URL(r.url()).searchParams.has("_rsc"))report.nextPrefetchCancellations.push(s);else report.requestFailures.push(s)});page.on("request",r=>report.origins.add(new URL(r.url()).origin));page.on("response",r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
  await page.addInitScript(()=>localStorage.setItem("theme","dark"));const response=await page.goto("http://localhost:3958/docs/chat",{waitUntil:"domcontentloaded"});if(response?.status()!==200)throw new Error(`${tag}: route HTTP ${response?.status()}`);await expect(page.locator("html")).toHaveClass(/\bdark\b/);const demo=page.getByTestId("chat-demo-root");await expect(demo).toBeVisible();const group=page.getByRole("group",{name:"Agent state fixture"});await group.getByRole("button",{name:"Idle",exact:true}).click();await group.getByRole("button",{name:"Working",exact:true}).click();const prompt=demo.getByRole("textbox",{name:"Message prompt"});
  await prompt.fill("Find @zz");const source=demo.locator('[data-yunui="chat-composer-source-menu"]');await expect(source).toContainText("No matching sources");await source.screenshot({path:join(out,`empty-sources-dark-${engine}.png`),animations:"disabled"});report.screenshots.push(`empty-sources-dark-${engine}.png`);
  await prompt.fill("Use /zz");const command=demo.locator('[data-yunui="chat-composer-command-menu"]');await expect(command).toContainText("No matching commands");await command.screenshot({path:join(out,`empty-commands-dark-${engine}.png`),animations:"disabled"});report.screenshots.push(`empty-commands-dark-${engine}.png`);
  await prompt.fill("");await demo.getByRole("button",{name:"Select a model"}).click();const models=demo.getByRole("listbox",{name:"Select a model"});await expect(models).toBeVisible();await models.screenshot({path:join(out,`model-menu-dark-${engine}.png`),animations:"disabled"});report.screenshots.push(`model-menu-dark-${engine}.png`);
  await context.close();await browser.close();
 }
}catch(error){report.failures.push(error?.stack??String(error));}
finally{report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(x=>!new Set(["http://localhost:3958","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(x));await writeFile(join(out,"capture-log.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length)process.exitCode=1;
