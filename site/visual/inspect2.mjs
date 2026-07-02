import { chromium } from "@playwright/test";
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport:{width:1200,height:1000} })).newPage();
await pg.goto("http://localhost:3941/showcase", { waitUntil:"load", timeout:60000 });
await pg.locator("#chat").scrollIntoViewIfNeeded().catch(()=>{});
await pg.waitForTimeout(1500);
const info = await pg.evaluate(() => {
  const chat = document.querySelector("#chat");
  // find the code block outer card: div with rounded-xl + border containing shiki-wrapper
  const wrapper = chat.querySelector(".shiki-wrapper");
  let card = wrapper;
  while (card && !(card.className?.toString?.().includes("rounded-xl"))) card = card.parentElement;
  const out = [];
  const walk = (el, depth) => {
    if (!el || depth > 6) return;
    const s = getComputedStyle(el);
    const hasBg = s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent";
    const hasBorder = parseFloat(s.borderTopWidth) > 0;
    const hasShadow = s.boxShadow !== "none";
    if (hasBg || hasBorder || hasShadow) {
      out.push({ tag: el.tagName, cls: (el.className?.toString?.()||"").slice(0,45), bg: s.backgroundColor, border: s.borderTopWidth+" "+s.borderTopColor, radius: s.borderTopLeftRadius, shadow: hasShadow? "yes":"no" });
    }
    [...el.children].forEach(c => walk(c, depth+1));
  };
  walk(card, 0);
  return out;
});
console.log(JSON.stringify(info, null, 2));
await b.close();
