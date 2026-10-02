import { chromium } from "../../../site/node_modules/@playwright/test/index.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const dir = new URL("./captures-3966/", import.meta.url);
const base = new URL(dir).pathname;
const browser = await chromium.launch({headless:true});
for (const engine of ["chromium","webkit"]) for (const theme of ["light","dark"]) {
  const page = await browser.newPage({viewport:{width:1320,height:1800},deviceScaleFactor:1});
  const items=[];
  for(const width of [390,768,1440]) for(const scenario of ["content-short","content-long-folded","content-long-expanded","tool-output-12","pattern-tabs-npm","pattern-tabs-pnpm"]) {
    const filename=`${engine}-${width}-${theme}-${scenario}.png`;
    const bytes=await readFile(join(base,filename));
    items.push(`<figure><figcaption>${width}px · ${scenario}</figcaption><img src="data:image/png;base64,${bytes.toString('base64')}"></figure>`);
  }
  await page.setContent(`<html><style>*{box-sizing:border-box}body{font:14px system-ui;margin:12px;background:#ddd}main{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}figure{margin:0;padding:6px;background:white;border:1px solid #888;border-radius:4px}figcaption{font-weight:600;height:24px}img{width:100%;height:250px;object-fit:contain;display:block}</style><h2>${engine} / ${theme} · CodeBlock matrix</h2><main>${items.join('')}</main></html>`,{waitUntil:'load'});
  await page.screenshot({path:join(base,`montage-${engine}-${theme}.png`),fullPage:true});
  await page.close();
}
await browser.close();
