import { chromium, webkit, expect } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url)); const out=join(root,'captures-3968'); await mkdir(out,{recursive:true});
const report={baseURL:'http://127.0.0.1:3968',captures:[],assertions:[],failures:[],pageErrors:[],consoleErrors:[],requestFailures:[],rscAborts:[],httpErrors:[]};
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{
  for(const width of [390,768,1440]) for(const theme of ['light','dark']){
   const tag=`${engineName}-${width}-${theme}`; const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});
   page.on('pageerror',e=>report.pageErrors.push(`${tag}: ${e.message}`)); page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(`${tag}: ${m.text()}`)}); page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)}); page.on('requestfailed',r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==='net::ERR_ABORTED'&&new URL(r.url()).searchParams.has('_rsc'))report.rscAborts.push(s);else report.requestFailures.push(s)});
   await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'}); await page.addInitScript(v=>localStorage.setItem('theme',v),theme);
   const response=await page.goto(`${report.baseURL}/docs/chat`,{waitUntil:'domcontentloaded'}); if(response?.status()!==200)throw new Error(`${tag}: /docs/chat HTTP ${response?.status()}`);
   const controls=page.getByRole('group',{name:'Agent state fixture'}); await controls.getByRole('button',{name:'Done',exact:true}).click(); await expect(controls.getByRole('button',{name:'Done',exact:true})).toHaveAttribute('aria-pressed','true');
   for(const component of ['selection-actions','diff-table']){const target=page.locator(`[data-testid="conversation-units-demo"] [data-yunui="${component}"]`);await expect(target,`${tag} ${component}`).toBeVisible();const file=join(out,`${tag}-${component}.png`);await target.screenshot({path:file,animations:'disabled',caret:'hide'});report.captures.push(file.slice(root.length+1));}
   await page.close();
  }
  for(const theme of ['light','dark']){
   const tag=`${engineName}-1440-${theme}-narrow270`;const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
   page.on('pageerror',e=>report.pageErrors.push(`${tag}: ${e.message}`));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(`${tag}: ${m.text()}`)});page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${tag}: ${r.status()} ${r.url()}`)});page.on('requestfailed',r=>{const s=`${tag}: ${r.url()} ${r.failure()?.errorText}`;if(r.failure()?.errorText==='net::ERR_ABORTED'&&new URL(r.url()).searchParams.has('_rsc'))report.rscAborts.push(s);else report.requestFailures.push(s)});
   await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});await page.addInitScript(v=>localStorage.setItem('theme',v),theme);
   const response=await page.goto(`${report.baseURL}/docs/chat`,{waitUntil:'domcontentloaded'});if(response?.status()!==200)throw new Error(`${tag}: /docs/chat HTTP ${response?.status()}`);
   const controls=page.getByRole('group',{name:'Agent state fixture'});await controls.getByRole('button',{name:'Done',exact:true}).click();await expect(controls.getByRole('button',{name:'Done',exact:true})).toHaveAttribute('aria-pressed','true');
   const units=page.getByTestId('conversation-units-demo'); const selection=units.locator('[data-yunui="selection-actions"]'); const diff=units.locator('[data-yunui="diff-table"]');
   await selection.evaluate(el=>{el.style.width='270px';el.style.maxWidth='270px'});await diff.evaluate(el=>{el.style.width='270px';el.style.maxWidth='270px'});
   await expect.poll(()=>selection.evaluate(el=>el.getBoundingClientRect().width)).toBe(270);await expect.poll(()=>diff.evaluate(el=>el.getBoundingClientRect().width)).toBe(270);
   const explain=selection.getByRole('button',{name:'Explain',exact:true});await expect(explain).toBeVisible();const explainGeom=await explain.evaluate(el=>{const r=el.getBoundingClientRect();const strip=el.closest('[data-yunui="selection-actions-scroll"]');const b=strip.getBoundingClientRect();return {text:el.innerText,buttonWidth:r.width,left:r.left,right:r.right,stripLeft:b.left,stripRight:b.right}});if(explainGeom.buttonWidth<52||explainGeom.right<=explainGeom.left)throw new Error(`${tag}: Explain action does not have readable width ${JSON.stringify(explainGeom)}`);report.assertions.push({tag,assertion:'Explain action readable at 270px host',...explainGeom});
   const diffFooter=diff.locator('div.border-t.border-border');const summary=diffFooter.locator('span[aria-live="polite"]');const lines=await summary.evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);return range.getClientRects().length});if(lines>2)throw new Error(`${tag}: DiffTable selection summary wraps into ${lines} lines`);report.assertions.push({tag,assertion:'DiffTable count occupies at most two lines',lines});
   for(const [name,target] of [['selection-actions',selection],['diff-table',diff]]){const file=join(out,`${tag}-${name}.png`);await target.screenshot({path:file,animations:'disabled',caret:'hide'});report.captures.push(file.slice(root.length+1));}
   await page.close();
   const page2=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await page2.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});await page2.addInitScript(v=>localStorage.setItem('theme',v),theme);
   const r2=await page2.goto(`${report.baseURL}/docs/ai/selection-actions`,{waitUntil:'domcontentloaded'});if(r2?.status()!==200)throw new Error(`${tag}: selection page HTTP ${r2?.status()}`);const demo=page2.getByTestId('selection-actions-demo');await demo.evaluate(el=>{el.style.width='270px';el.style.maxWidth='270px'});await expect.poll(()=>demo.evaluate(el=>el.getBoundingClientRect().width)).toBe(270);const narrow=demo.locator('[data-yunui="selection-actions"]');
   for(const state of ['idle','empty-result']){if(state==='empty-result'){await demo.getByRole('button',{name:'Preview deletion',exact:true}).click();await expect(narrow.getByRole('button',{name:'Keep',exact:true})).toBeVisible()}const f=join(out,`${tag}-selection-demo-${state}.png`);await narrow.screenshot({path:f,animations:'disabled',caret:'hide'});report.captures.push(f.slice(root.length+1));}
   await page2.close();
  }
 }catch(error){report.failures.push(error?.stack??String(error))}finally{await browser.close()}
}
report.timestamp=new Date().toISOString();await writeFile(join(out,'log.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.failures.length||report.pageErrors.length||report.consoleErrors.length||report.requestFailures.length||report.httpErrors.length)process.exitCode=1;
