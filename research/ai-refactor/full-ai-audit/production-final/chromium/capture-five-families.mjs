import { chromium, expect } from "../../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(fileURLToPath(import.meta.url));
const report={phase:"5 of 6 families; ModelSelect pending current source rebuild",failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],nextPrefetchCancellations:[],httpErrors:[],origins:new Set(),screenshots:[],interactions:[]};
const routes=[
  {family:"model-card",path:"/docs/ai/model-card",title:"Clickable card and independent copy actions"},
  {family:"account-menu",path:"/docs/ai/account-menu",title:"Signed in"},
  {family:"language-switcher",path:"/docs/ai/language-switcher",title:"Basic"},
  {family:"navbar",path:"/docs/ai/navbar",title:"Basic"},
  {family:"footer",path:"/docs/ai/footer",title:"Basic"},
];
const widths=[["390",{width:390,height:844}],["768",{width:768,height:1000}],["1440",{width:1440,height:1000}]];
function watch(page,tag){
  page.on("pageerror",e=>report.pageErrors.push(`${tag}: ${e.message}`));
  page.on("console",m=>{if(m.type()==="error")report.consoleErrors.push(`${tag}: ${m.text()}`)});
  page.on("requestfailed",r=>{
    const line=`${tag}: ${r.url()} ${r.failure()?.errorText}`;
    if(r.failure()?.errorText==="net::ERR_ABORTED"&&new URL(r.url()).searchParams.has("_rsc"))report.nextPrefetchCancellations.push(line);
    else report.requestFailures.push(line);
  });
  page.on("request",r=>report.origins.add(new URL(r.url()).origin));
  page.on("response",r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
}
async function openTarget(browser,route,viewport,theme,tag){
  // Use the visible docs theme switch at tablet width, then resize using the
  // browser viewport API. The switch is intentionally hidden at 390px.
  const context=await browser.newContext({viewport:{width:768,height:1000},deviceScaleFactor:1,reducedMotion:"reduce"});
  const page=await context.newPage();watch(page,tag);
  const response=await page.goto(`http://localhost:3952${route.path}`,{waitUntil:"domcontentloaded"});
  if(response?.status()!==200)throw new Error(`${tag}: HTTP ${response?.status()}`);
  await page.getByRole("heading",{name:new RegExp(route.family==="model-card"?"Model Card":route.family==="model-select"?"Model Select":route.family==="account-menu"?"Account Menu":route.family==="language-switcher"?"Language Switcher":route.family==="navbar"?"Navbar":"Footer","i")}).first().waitFor({state:"visible"});
  const themeState=await page.locator("html").getAttribute("class");
  if(theme==="dark"&&themeState!=="dark")await page.locator('button[aria-label="dark"]').click();
  if(theme==="light"&&themeState!=="light")await page.locator('button[aria-label="light"]').click();
  if(await page.locator("html").getAttribute("class")!==theme)throw new Error(`${tag}: theme UI did not set ${theme}`);
  await page.setViewportSize(viewport);
  const preview=page.locator(".not-prose.my-6").filter({hasText:route.title}).last();
  await preview.waitFor({state:"visible"});await preview.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.fonts.ready);
  return {context,page,preview};
}
async function capture(preview,path){await preview.screenshot({path,animations:"disabled"});report.screenshots.push(path.slice(root.length+1));}
async function captureViewport(page,path){await page.screenshot({path,animations:"disabled"});report.screenshots.push(path.slice(root.length+1));}
const browser=await chromium.launch({headless:true});
try{
  for(const route of routes){
    for(const [widthName,viewport] of widths){
      for(const theme of ["light","dark"]){
        const tag=`${route.family}-${widthName}-${theme}`;
        const {context,page,preview}=await openTarget(browser,route,viewport,theme,tag);
        const out=join(root,`${tag}.png`);await capture(preview,out);await context.close();
      }
    }
  }
  // Account menu: open and verify the host-provided rows, then Escape restores trigger focus.
  {
    const route=routes.find(r=>r.family==="account-menu"),{context,page,preview}=await openTarget(browser,route,{width:390,height:844},"light","account-menu-open");
    const trigger=preview.getByRole("button",{name:"Yuhuan"});await trigger.click();
    for(const label of ["API keys","Saved","Admin","Sign out"])await expect(preview.getByRole("menuitem",{name:new RegExp(label)})).toBeVisible();
    await capture(preview,join(root,"interaction-account-menu-open.png"));
    await captureViewport(page,join(root,"interaction-account-menu-open-viewport.png"));report.interactions.push("account menu items visible");
    await page.keyboard.press("Escape");await expect(trigger).toBeFocused();report.interactions.push("account menu Escape restores focus");await context.close();
  }
  // Language menu: choose a locale through the public control and verify host callback state.
  {
    const route=routes.find(r=>r.family==="language-switcher"),{context,page,preview}=await openTarget(browser,route,{width:390,height:844},"light","language-menu-open");
    const trigger=preview.getByRole("button",{name:"Language: English"});await trigger.click();
    for(const label of ["English","简体中文","繁體中文"])await expect(preview.getByRole("button",{name:label,exact:true})).toBeVisible();
    await capture(preview,join(root,"interaction-language-menu-open.png"));
    await captureViewport(page,join(root,"interaction-language-menu-open-viewport.png"));
    await preview.getByRole("button",{name:"繁體中文",exact:true}).click();await expect(preview.getByRole("button",{name:"Language: 繁體中文"})).toBeVisible();report.interactions.push("language selection updates host-controlled current locale");await context.close();
  }
  // Navbar's real mobile menu at the smallest target viewport.
  {
    const route=routes.find(r=>r.family==="navbar"),{context,page,preview}=await openTarget(browser,route,{width:390,height:844},"light","navbar-mobile-menu");
    const trigger=preview.getByRole("button",{name:"Menu",exact:true});await trigger.click();await expect(trigger).toHaveAttribute("aria-expanded","true");
    for(const label of ["Home","Models","Pricing","Docs"])await expect(preview.getByRole("link",{name:label,exact:true})).toBeVisible();
    await capture(preview,join(root,"interaction-navbar-mobile-menu.png"));
    await captureViewport(page,join(root,"interaction-navbar-mobile-menu-viewport.png"));report.interactions.push("mobile Navbar menu opens with host links");await context.close();
  }
  // Real clickable ModelCard host fixture: body click selects, while ID badge actions stay independent.
  {
    const route=routes.find(r=>r.family==="model-card"),{context,preview}=await openTarget(browser,route,{width:390,height:844},"light","model-card-body-click");
    const cardPreview=preview.locator(".card-interactive").filter({hasText:"Click the body to select; each model ID remains a separate copy action."});
    await expect(preview.getByText("No model selected",{exact:true})).toBeVisible();
    await cardPreview.getByText("Click the body to select; each model ID remains a separate copy action.",{exact:true}).click();
    await expect(preview.getByText("Selected for routing",{exact:true})).toBeVisible();
    await expect(cardPreview.locator("button[aria-label^='Click to copy'] svg.lucide-check")).toHaveCount(0);
    await expect(cardPreview.getByRole("button",{name:"Click to copy gpt-4o",exact:true})).toBeVisible();
    await expect(cardPreview.getByRole("button",{name:"Click to copy gpt-4o-latest",exact:true})).toBeVisible();
    await capture(preview,join(root,"interaction-model-card-body-select.png"));report.interactions.push("body click selects route; independent ID copy buttons remain unchanged (no copied-state icon)");await context.close();
  }
}catch(error){report.failures.push(error?.stack??String(error));}
finally{
  await browser.close();report.origins=[...report.origins];report.unexpectedOrigins=report.origins.filter(origin=>!new Set(["http://localhost:3952","https://fonts.googleapis.com","https://fonts.gstatic.com"]).has(origin));
  await writeFile(join(root,"capture-five-families-log.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));
}
if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length||report.unexpectedOrigins.length)process.exitCode=1;
