import { chromium, webkit } from '../../../site/node_modules/@playwright/test/index.mjs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url)), captures=join(root,'captures');
const log={pageErrors:[],consoleErrors:[],requestFailures:[],httpErrors:[],requestOrigins:new Set()};
const viewports=[['390',{width:390,height:844}],['768',{width:768,height:1000}],['1440',{width:1440,height:1000}]];
for(const [browserName,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{
  for(const [width,viewport] of viewports)for(const theme of ['light','dark']){
   const label=`${browserName}-${width}-${theme}-error-copy`,page=await browser.newPage({viewport});page.setDefaultTimeout(7000);
   page.on('pageerror',e=>log.pageErrors.push(`${label}: ${e.message}`));page.on('console',m=>{if(m.type()==='error')log.consoleErrors.push(`${label}: ${m.text()}`)});page.on('requestfailed',r=>log.requestFailures.push(`${label}: ${r.url()}`));page.on('request',r=>log.requestOrigins.add(new URL(r.url()).origin));page.on('response',r=>{if(r.status()>=400)log.httpErrors.push(`${label}: ${r.status()} ${r.url()}`)});
   const response=await page.goto('http://localhost:3943',{waitUntil:'networkidle'});if(response?.status()!==200)throw Error(`${label}: HTTP ${response?.status()}`);
   if(theme==='dark')await page.getByRole('button',{name:'深色'}).click();
   await page.waitForTimeout(250);await page.getByRole('group',{name:'示範狀態'}).getByRole('button',{name:'失敗',exact:true}).click();
   const copy=await page.locator('.errorCard').innerText();if(!copy.includes('下方保留已完成步驟與失敗位置'))throw Error(`${label}: error copy does not match visible trace`);
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`${label}: horizontal overflow`);
   await page.screenshot({path:join(captures,`${browserName}-${width}-${theme}-error.png`),fullPage:true});await page.close();
  }
 }finally{await browser.close()}
}
const final={...log,requestOrigins:[...log.requestOrigins]};await writeFile(join(captures,'error-copy-log.json'),JSON.stringify(final,null,2)+'\n');console.log(JSON.stringify(final,null,2));
if(final.pageErrors.length||final.consoleErrors.length||final.requestFailures.length||final.httpErrors.length)process.exitCode=1;
