import { chromium } from "@playwright/test";
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 })).newPage();
await pg.goto(process.argv[2] || "http://localhost:3941/docs/content/markdown-renderer", { waitUntil:"load", timeout:60000 });
await pg.waitForTimeout(2800);
const info = await pg.evaluate(() => {
  const docW = document.documentElement.clientWidth;
  const pageOverflow = document.documentElement.scrollWidth - docW;
  const bad = [];
  document.querySelectorAll("*").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > docW + 1 && r.width > 40) {
      bad.push({ tag: el.tagName, cls: (el.className?.toString?.()||"").slice(0,70), w: Math.round(r.width), right: Math.round(r.right) });
    }
  });
  return { docW, pageOverflow, worst: bad.sort((a,b)=>b.right-a.right).slice(0,10) };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
