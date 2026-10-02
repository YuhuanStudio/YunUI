import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";

const base = "http://127.0.0.1:3963/";
const out = resolve("./evidence");
await mkdir(out, { recursive: true });
const results = [];
for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch({ headless: true });
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, colorScheme: "light" });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const theme of ["light", "dark"]) {
      await page.goto(base, { waitUntil: "networkidle" });
      if (theme === "dark") await page.getByRole("button", { name: "Theme: light" }).click();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const dimensions = await page.evaluate(() => {
        const apply = [...document.querySelectorAll("#diff-review button")].find((button) => button.textContent?.includes("Apply"));
        const badge = document.querySelector("#context-cards .size-3\\.5");
        const luminance = (color) => { const [r,g,b] = color.match(/[\d.]+/g).slice(0,3).map(Number).map((x) => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }); return .2126*r + .7152*g + .0722*b; };
        const contrast = (foreground, background) => { const a = luminance(foreground), b = luminance(background); return Number(((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2)); };
        const colors = (element) => { if (!element) return null; const style = getComputedStyle(element); return { bg: style.backgroundColor, fg: style.color, contrast: contrast(style.color, style.backgroundColor) }; };
        return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, height: document.documentElement.scrollHeight, css: getComputedStyle(document.querySelector(".review-section")).borderRadius, page: getComputedStyle(document.body).backgroundColor, text: getComputedStyle(document.body).color, apply: colors(apply), badge: colors(badge) };
      });
      await page.screenshot({ path: `${out}/${engine}-${width}-${theme}.png`, fullPage: true });
      results.push({ engine, width, theme, errors: [...errors], ...dimensions });
    }
    await page.close();
  }
  await browser.close();
}
await writeFile(`${out}/matrix.json`, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
