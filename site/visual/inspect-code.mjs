import { chromium } from "@playwright/test";
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport:{width:1200,height:1000} })).newPage();
await pg.goto("http://localhost:3941/showcase", { waitUntil:"load", timeout:60000 });
await pg.locator("#chat").scrollIntoViewIfNeeded().catch(()=>{});
await pg.waitForTimeout(1500);
const info = await pg.evaluate(() => {
  // find the shiki wrapper + pre inside the chat demo
  const chat = document.querySelector("#chat");
  const pre = chat?.querySelector(".shiki-wrapper pre") || chat?.querySelector("pre");
  const wrapper = chat?.querySelector(".shiki-wrapper");
  const scrollDiv = wrapper?.parentElement;
  const g = (el) => el ? getComputedStyle(el) : null;
  const desc = (el, name) => el ? { name, tag: el.tagName, cls: (el.className?.toString?.()||"").slice(0,50), bg: g(el).backgroundColor, pad: g(el).padding, radius: g(el).borderRadius, border: g(el).borderWidth } : { name, missing:true };
  return {
    contentCssLoaded: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r=>r.selectorText?.includes("shiki-wrapper")) } catch { return false } }),
    pre: desc(pre, "pre"),
    wrapper: desc(wrapper, "wrapper"),
    scrollDiv: desc(scrollDiv, "scrollDiv"),
    code: desc(pre?.querySelector("code"), "code"),
  };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
