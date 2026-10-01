import {createRequire} from 'node:module';
const {chromium, webkit}=createRequire(new URL('../../../site/package.json', import.meta.url))('@playwright/test');
import fs from 'node:fs';
const axe=fs.readFileSync('site/node_modules/axe-core/axe.min.js','utf8');
for(const [name,engine] of Object.entries({chromium,webkit})){
 let browser;try{browser=await engine.launch();}catch(e){console.log(name,'UNAVAILABLE',e.message.split('\n')[0]);continue;}
 for(const theme of ['light','dark','true-black'])for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme==='light'?'light':'dark'});
  const page=await context.newPage();await page.addInitScript(t=>localStorage.setItem('theme',t),theme);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://localhost:3941/showcase',{waitUntil:'networkidle',timeout:30000});await page.waitForTimeout(1000);
   await page.addScriptTag({content:axe});
   const result=await page.evaluate(async()=>({theme:document.documentElement.className,overflow:document.documentElement.scrollWidth>innerWidth,violations:(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,3).map(n=>n.target)}))}));
   console.log(JSON.stringify({name,theme,width,...result,errors}));
   if(width===390||width===1440)await page.screenshot({path:`/tmp/yunui-research/${name}-${theme}-${width}.png`});
   if(name==='chromium'&&width===1440){console.log('content-theme',theme,await page.locator('.mermaid-container').count(),await page.locator('.shiki').evaluateAll(ns=>ns.slice(-2).map(n=>({bg:getComputedStyle(n).backgroundColor,fg:getComputedStyle(n).color}))))}
  }catch(e){console.log(JSON.stringify({name,theme,width,error:e.message}));}await context.close();
 }
 await browser.close();
}
