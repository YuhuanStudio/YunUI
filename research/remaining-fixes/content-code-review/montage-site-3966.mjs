import { chromium } from "../../../site/node_modules/@playwright/test/index.mjs";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
const root=process.cwd();
const base=join(root,'site/test-results/final-3966-final');
const files=[];
async function walk(d){for(const entry of await readdir(d,{withFileTypes:true})){const p=join(d,entry.name); if(entry.isDirectory()) await walk(p); else if(entry.name.endsWith('.png')) files.push(p);}}
await walk(base);
const browser=await chromium.launch({headless:true});
async function sheet(title, selected, out, columns=3){const page=await browser.newPage({viewport:{width:1320,height:1800}});const cards=[];for(const f of selected){const b=await readFile(f);cards.push(`<figure><figcaption>${relative(base,f)}</figcaption><img src="data:image/png;base64,${b.toString('base64')}"></figure>`)}await page.setContent(`<style>*{box-sizing:border-box}body{font:13px system-ui;margin:12px;background:#ddd}main{display:grid;grid-template-columns:repeat(${columns},1fr);gap:8px}figure{margin:0;background:#fff;padding:6px;border:1px solid #999}figcaption{font-weight:600;overflow-wrap:anywhere;height:38px}img{width:100%;height:260px;object-fit:contain;display:block}</style><h2>${title}</h2><main>${cards.join('')}</main>`);await page.screenshot({path:out,fullPage:true});await page.close()}
for(const engine of ['chromium','webkit']) for(const theme of ['light','dark']) {
 const selected=files.filter(f=>f.includes(`agent-chat-`)&&f.includes(`-${theme}-`)&&f.endsWith(`-${engine}/agent-chat-${f.split('agent-chat-').pop()}`));
 // Stable selection by filename suffix, with state and viewport encoded in each capture.
 const imgs=files.filter(f=>f.includes('/agent-chat-Agent-Chat-')&&f.includes(`-${theme}-`)&&f.endsWith(`-${engine}.png`)).sort((a,b)=>{
  const key=f=>{const n=f.split('/').pop();return ['Idle','Working','Approval','Done','Error'].findIndex(s=>n.includes(`-${s.toLowerCase()}-`))*10 + Number(n.match(/-(390|768|1440)-/)?.[1]||0)};return key(a)-key(b)});
 await sheet(`Agent Chat ${engine} ${theme} (${imgs.length} state/width captures)`,imgs,join(base,`montage-agent-${engine}-${theme}.png`));
 const units=files.filter(f=>f.includes('/conversation-units-')&&f.endsWith(`-${engine}/conversation-${theme}-`+f.split('/').pop()));
 const units2=files.filter(f=>f.includes(`/conversation-units-public-conversation-units-${theme}-`)&&f.includes(`-${engine}/conversation-${theme}-`)).sort((a,b)=>Number(a.match(/-(390|768|1440)-/)?.[1])-Number(b.match(/-(390|768|1440)-/)?.[1]));
 // Match route screenshot basename + engine output folder, avoid report/trace images.
 await sheet(`Conversation units ${engine} ${theme}`,units2.sort(),join(base,`montage-units-${engine}-${theme}.png`));
}
await browser.close();
