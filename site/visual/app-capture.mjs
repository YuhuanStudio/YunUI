import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const OUT = "/private/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/86fdf057-a3a3-4c32-af66-88327ea5c2d7/scratchpad/shots";
mkdirSync(OUT, { recursive: true });
const URL = process.argv[2];
const NAME = process.argv[3];
const plan = [["desktop",{width:1440,height:900}],["mobile",{width:390,height:844}]];
const b = await chromium.launch();
for (const [vp, size] of plan) {
  for (const theme of ["light","dark"]) {
    const ctx = await b.newContext({ viewport:size, deviceScaleFactor:2, colorScheme:theme });
    await ctx.addInitScript(t => { try{localStorage.setItem("theme",t)}catch{} }, theme);
    const pg = await ctx.newPage();
    const errs = [];
    pg.on("pageerror", e => errs.push(e.message.split("\n")[0]));
    await pg.goto(URL, { waitUntil:"networkidle", timeout:60000 }).catch(()=>{});
    if (theme==="dark") await pg.evaluate(()=>document.documentElement.classList.add("dark"));
    await pg.waitForTimeout(1800);
    const f = `${OUT}/${NAME}-${vp}-${theme}.png`;
    await pg.screenshot({ path:f, fullPage:false });
    console.log(`shot ${NAME}-${vp}-${theme}  url=${pg.url()}  err=${errs[0]||"none"}`);
    await ctx.close();
  }
}
await b.close();
