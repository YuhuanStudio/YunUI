import { chromium, webkit, expect } from '../../../site/node_modules/@playwright/test/index.mjs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const results=[];
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
  const browser=await engine.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844}});
    page.on('pageerror',error=>{throw error});
    await page.goto('http://localhost:3946',{waitUntil:'domcontentloaded'});
    const controls=page.getByRole('group',{name:'D4 state fixture'});
    await controls.getByRole('button',{name:'Approval',exact:true}).click();
    await expect(page.getByTestId('d4-phase')).toHaveAttribute('data-phase','approval');
    const card=page.getByTestId('d4-question');
    const first=card.getByRole('button',{name:/English, Simplified Chinese and Traditional Chinese/});
    await first.click();
    const next=card.getByRole('button',{name:'Next',exact:true});
    await expect(next).toBeEnabled();
    let reached=false;
    for(let i=0;i<12;i++) {
      await page.keyboard.press('Tab');
      if(await next.evaluate(element=>document.activeElement===element)){reached=true;break;}
    }
    if(!reached)throw new Error(`${name}: keyboard tab sequence did not reach enabled Next`);
    const geometry=await page.evaluate(()=>{
      const next=Array.from(document.querySelectorAll('[data-testid="d4-question"] button')).find(button=>button.textContent?.includes('Next'));
      const dock=document.querySelector('.composer-dock'); const scroll=document.querySelector('.conversation-scroll');
      if(!next||!dock||!scroll)throw new Error('Missing approval/footer/scroll region');
      const buttonRect=next.getBoundingClientRect(), dockRect=dock.getBoundingClientRect(), scrollRect=scroll.getBoundingClientRect();
      return {buttonTop:buttonRect.top,buttonBottom:buttonRect.bottom,dockTop:dockRect.top,scrollTop:scrollRect.top,scrollBottom:scrollRect.bottom,scrollOffset:scroll.scrollTop,focused:document.activeElement===next};
    });
    if(!geometry.focused||geometry.buttonTop<geometry.scrollTop-1||geometry.buttonBottom>geometry.dockTop-8)throw new Error(`${name}: Approval Next focus is too close to composer dock: ${JSON.stringify(geometry)}`);
    await page.keyboard.press('Shift+Tab');
    await expect(card.getByRole('button',{name:'Skip',exact:true})).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(card.getByRole('button',{name:'Next question'})).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(card.getByRole('textbox',{name:'Custom answer'})).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox',{name:'Prompt'})).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(next).toBeFocused();
    results.push({engine:name,passed:true,...geometry});
  } finally { await browser.close(); }
}
await writeFile(join(root, 'captures/approval-scroll.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results,null,2));
