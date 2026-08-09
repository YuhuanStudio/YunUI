import { chromium } from '@playwright/test';
const SD='/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/04b24e0b-6354-4f5c-a9d5-8895ba9af3d2/scratchpad';
const tag = process.argv[2], port = process.argv[3];
const b = await chromium.launch();
for (const [vp,w] of [['desk',1440],['mob',390]]) {
  for (const menu of vp==='mob' ? [false,true] : [false]) {
    const p = await b.newPage({viewport:{width:w,height:900}});
    const bad=[]; p.on('response', r => { if (r.status()>=400 && r.url().includes('/_next/')) bad.push(r.status()); });
    await p.goto(`http://localhost:${port}/`, {waitUntil:'networkidle'}); await p.waitForTimeout(1500);
    if (menu) { const btns = p.locator('nav button'); await btns.nth((await btns.count())-1).click().catch(()=>{}); await p.waitForTimeout(500); }
    const info = await p.evaluate(() => ({ b: document.querySelectorAll('nav button').length, a: document.querySelectorAll('nav a').length }));
    console.log(`  ${tag}/${vp}${menu?'/menu':''} buttons=${info.b} links=${info.a}${bad.length?' !! '+bad.length+' failed':''}`);
    await p.evaluate(() => document.querySelectorAll('*').forEach(e => { e.style.animation='none'; e.style.transition='none'; }));
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${SD}/nn-${tag}-${vp}${menu?'-menu':''}.png`, clip:{x:0,y:0,width:w,height:menu?420:120} });
    await p.close();
  }
}
await b.close();
