import { chromium } from "../../../site/node_modules/@playwright/test/index.mjs";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, basename } from "node:path";
const out=join(process.cwd(),'research/remaining-fixes/content-code-review/captures-3967');
const files=(await readdir(out)).filter(f=>f.endsWith('.png'));
const browser=await chromium.launch({headless:true});
for(const engine of ['chromium','webkit']){
 const imgs=[];
 for(const comp of ['streaming-text','context-cards','selection-actions','diff-table']) for(const theme of ['light','dark']) for(const width of [390,768,1440]) imgs.push(`${engine}-${width}-${theme}-${comp}.png`);
 const cards=[];for(const name of imgs){const b=await readFile(join(out,name));cards.push(`<figure><figcaption>${name.replace(`${engine}-`,'')}</figcaption><img src="data:image/png;base64,${b.toString('base64')}"></figure>`)}
 const page=await browser.newPage({viewport:{width:1500,height:1600}});await page.setContent(`<style>*{box-sizing:border-box}body{font:12px system-ui;margin:10px;background:#ddd}main{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}figure{margin:0;padding:5px;background:white;border:1px solid #999}figcaption{height:30px;font-weight:600;overflow-wrap:anywhere}img{width:100%;height:220px;object-fit:contain;display:block}</style><h2>Conversation-unit component crops · ${engine}</h2><main>${cards.join('')}</main>`);await page.screenshot({path:join(out,`montage-components-${engine}.png`),fullPage:true});await page.close();
}
const names=files.filter(f=>f.includes('narrow270'));
const cards=[];for(const name of names){const b=await readFile(join(out,name));cards.push(`<figure><figcaption>${basename(name)}</figcaption><img src="data:image/png;base64,${b.toString('base64')}"></figure>`)}
const page=await browser.newPage({viewport:{width:1200,height:700}});await page.setContent(`<style>*{box-sizing:border-box}body{font:14px system-ui;margin:10px;background:#ddd}main{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}figure{margin:0;padding:6px;background:white;border:1px solid #999}figcaption{height:40px;font-weight:600}img{width:100%;height:350px;object-fit:contain;display:block}</style><h2>SelectionActions narrow-host states</h2><main>${cards.join('')}</main>`);await page.screenshot({path:join(out,'montage-narrow270.png'),fullPage:true});await page.close();await browser.close();
