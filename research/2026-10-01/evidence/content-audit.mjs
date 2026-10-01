import {createRequire} from 'node:module';
const {chromium, webkit}=createRequire(new URL('../../../site/package.json', import.meta.url))('@playwright/test');
const b=await chromium.launch();
for(const theme of ['light','dark','true-black']){
const p=await b.newPage();await p.addInitScript(t=>localStorage.setItem('theme',t),theme);await p.goto('http://localhost:3941/docs/content/markdown-renderer',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
console.log('THEME',theme,await p.locator('.shiki').evaluateAll(ns=>ns.map(n=>({bg:getComputedStyle(n).backgroundColor,first:n.outerHTML.slice(0,200)}))));
const d=p.locator('.mermaid-container').first();await d.scrollIntoViewIfNeeded();await d.focus();await p.keyboard.press('Enter');console.log('enter zoom',await p.locator('.fixed.inset-0.z-50').count());await d.click();console.log('click zoom',await p.locator('.fixed.inset-0.z-50').count(),'dialogs',await p.getByRole('dialog').count());await p.keyboard.press('Escape');await p.screenshot({path:`/tmp/yunui-research/content-${theme}.png`,fullPage:true});await p.close();}
const p=await b.newPage();p.on('pageerror',e=>console.log('DEV ERROR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('DEV CONSOLE',m.text().slice(0,7000))});await p.goto('http://localhost:3942/showcase',{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(2000);await b.close();
