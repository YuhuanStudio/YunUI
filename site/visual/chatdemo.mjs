import { chromium } from "@playwright/test";
const OUT = "/private/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/86fdf057-a3a3-4c32-af66-88327ea5c2d7/scratchpad/shots";
const b = await chromium.launch();
// desktop full chat demo
let pg = await (await b.newContext({ viewport:{width:1200,height:1200}, deviceScaleFactor:2 })).newPage();
await pg.goto("http://localhost:3941/showcase", { waitUntil:"load", timeout:60000 });
await pg.locator("#chat").scrollIntoViewIfNeeded().catch(()=>{});
await pg.waitForTimeout(1200);
await pg.locator("#chat").screenshot({ path: `${OUT}/chatdemo-desktop.png` }).catch(async()=>{ await pg.screenshot({path:`${OUT}/chatdemo-desktop.png`}); });
// mobile full chat demo
const ctx2 = await b.newContext({ viewport:{width:390,height:1400}, deviceScaleFactor:2 });
const pg2 = await ctx2.newPage();
await pg2.goto("http://localhost:3941/showcase", { waitUntil:"load", timeout:60000 });
await pg2.locator("#chat").scrollIntoViewIfNeeded().catch(()=>{});
await pg2.waitForTimeout(1200);
await pg2.locator("#chat").screenshot({ path: `${OUT}/chatdemo-mobile.png` }).catch(async()=>{ await pg2.screenshot({path:`${OUT}/chatdemo-mobile.png`}); });
await b.close();
console.log("done");
