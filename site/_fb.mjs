import { chromium } from '@playwright/test';
const SD='/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/04b24e0b-6354-4f5c-a9d5-8895ba9af3d2/scratchpad';
const tag = process.argv[2];
const b = await chromium.launch();
for (const [vp,w,h] of [['desk',1440,1200],['mob',390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}});
  await p.goto('http://localhost:3134/fellows', {waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('*').forEach(e => { e.style.animation='none'; e.style.transition='none'; }));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${SD}/fellows-${tag}-${vp}.png`, fullPage: true });
  await p.close();
}
await b.close(); console.log('captured', tag);
