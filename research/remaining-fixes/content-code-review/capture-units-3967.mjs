import { chromium, webkit, expect } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const out=join(root,'captures-3967'); await mkdir(out,{recursive:true});
const report={baseURL:'http://127.0.0.1:3967',captures:[],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],rscAborts:[],httpErrors:[]};
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{
  for(const width of [390,768,1440]) for(const theme of ['light','dark']){
   const tag=`${engineName}-${width}-${theme}`;
   const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
   page.on('pageerror',e=>report.pageErrors.push(`${tag}: ${e.message}`));
   page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(`${tag}: ${m.text()}`)});
   page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
   page.on('requestfailed',r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`; if(r.failure()?.errorText==='net::ERR_ABORTED'&&new URL(r.url()).searchParams.has('_rsc'))report.rscAborts.push(s); else report.requestFailures.push(s)});
   await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
   await page.addInitScript(v=>localStorage.setItem('theme',v),theme);
   const response=await page.goto(`${report.baseURL}/docs/chat`,{waitUntil:'domcontentloaded'});
   if(response?.status()!==200)throw new Error(`${tag}: chat route returned ${response?.status()}`);
   await page.evaluate(()=>document.fonts.ready);
   const controls=page.getByRole('group',{name:'Agent state fixture'});
   await controls.getByRole('button',{name:'Done',exact:true}).click();
   await expect(controls.getByRole('button',{name:'Done',exact:true})).toHaveAttribute('aria-pressed','true');
   const components=['streaming-text','context-cards','selection-actions','diff-table'];
   for(const name of components){
    const target=page.locator(`[data-testid="conversation-units-demo"] [data-yunui="${name}"]`);
    await expect(target,`${tag} ${name} component`).toBeVisible();
    const file=join(out,`${tag}-${name}.png`);
    await target.screenshot({path:file,animations:'disabled',caret:'hide'}); report.captures.push(file.slice(root.length+1));
   }
   const demo=page.getByTestId('chat-demo-root');
   const hideOverlays=await page.evaluate(()=>{const els=[document.querySelector('#nd-subnav'),document.querySelector('#nd-docs-layout>div')].filter(Boolean);for(const el of els)(el).style.visibility='hidden';return els.length});
   const chatFile=join(out,`${tag}-chat-demo.png`); await demo.screenshot({path:chatFile,animations:'disabled',caret:'hide'}); report.captures.push(chatFile.slice(root.length+1));
   const showResponse=await page.goto(`${report.baseURL}/showcase`,{waitUntil:'domcontentloaded'});
   if(showResponse?.status()!==200)throw new Error(`${tag}: showcase returned ${showResponse?.status()}`);
   await page.evaluate(()=>document.fonts.ready);
   const showFile=join(out,`${tag}-showcase.png`); await page.screenshot({path:showFile,animations:'disabled',caret:'hide'}); report.captures.push(showFile.slice(root.length+1));
   await page.close();
  }
  for(const theme of ['light','dark']){
   const tag=`${engineName}-1440-${theme}-narrow270`;
   const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
   page.on('pageerror',e=>report.pageErrors.push(`${tag}: ${e.message}`));
   page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(`${tag}: ${m.text()}`)});
   page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});
   await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'}); await page.addInitScript(v=>localStorage.setItem('theme',v),theme);
   const r=await page.goto(`${report.baseURL}/docs/ai/selection-actions`,{waitUntil:'domcontentloaded'}); if(r?.status()!==200)throw new Error(`${tag}: selection docs returned ${r?.status()}`);
   const demo=page.getByTestId('selection-actions-demo'); await demo.evaluate(el=>{el.style.width='270px';el.style.maxWidth='270px'});
   await expect.poll(()=>demo.evaluate(el=>el.getBoundingClientRect().width)).toBe(270);
   const target=demo.locator('[data-yunui="selection-actions"]');
   const idle=join(out,`${tag}-idle.png`); await target.screenshot({path:idle,animations:'disabled'}); report.captures.push(idle.slice(root.length+1));
   await demo.getByRole('button',{name:'Preview deletion',exact:true}).click();
   await expect(target.getByRole('button',{name:'Keep',exact:true})).toBeVisible();
   const deletion=join(out,`${tag}-empty-result.png`); await target.screenshot({path:deletion,animations:'disabled'}); report.captures.push(deletion.slice(root.length+1));
   await page.close();
  }
 }catch(error){report.failures.push(error?.stack??String(error));}finally{await browser.close()}
}
report.timestamp=new Date().toISOString(); await writeFile(join(out,'log.json'),JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2)); if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length)process.exitCode=1;
