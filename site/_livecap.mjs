import { chromium } from '@playwright/test';
import fs from 'fs';
const SD='/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/04b24e0b-6354-4f5c-a9d5-8895ba9af3d2/scratchpad/live';
fs.mkdirSync(SD,{recursive:true});
const tag = process.argv[2];
const PAGES = { login:'/login', signup:'/signup', forgot:'/forgot-password', resend:'/resend-verification' };
const b = await chromium.launch();
for (const [n,path] of Object.entries(PAGES)) for (const [vp,w] of [['desk',1440],['mob',390]]) {
  const p = await b.newPage({viewport:{width:w,height:1000}});
  await p.goto('http://localhost:3300'+path, {waitUntil:'networkidle'});
  await p.waitForTimeout(2200);
  const info = await p.evaluate(() => ({h1:document.querySelector('h1')?.textContent?.slice(0,20)??null, inputs:document.querySelectorAll('input').length}));
  if (vp==='desk') console.log(`  ${tag}/${n.padEnd(8)} h1=${JSON.stringify(info.h1)} inputs=${info.inputs}`);
  await p.evaluate(()=>document.querySelectorAll('*').forEach(e=>{e.style.animation='none';e.style.transition='none';}));
  await p.waitForTimeout(250);
  await p.screenshot({path:`${SD}/${n}-${tag}-${vp}.png`, fullPage:true});
  await p.close();
}
await b.close();
