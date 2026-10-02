import { chromium, webkit, expect } from "../../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "model-menu-geometry-3962");
await mkdir(out, { recursive: true });
const report = { baseURL: "http://127.0.0.1:3962/docs/chat", measurements: [], failures: [], pageErrors: [], consoleErrors: [], rscAborts: [], requestFailures: [], httpErrors: [], screenshots: [] };
const themes = ["light", "dark"];

for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch({ headless: true });
  try {
    for (const width of [390, 768, 1440]) {
      for (const theme of themes) {
        const tag = `${engineName}-${width}-${theme}`;
        const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
        page.on("pageerror", error => report.pageErrors.push(`${tag}: ${error.message}`));
        page.on("console", message => { if (message.type() === "error") report.consoleErrors.push(`${tag}: ${message.text()}`); });
        page.on("requestfailed", request => {
          const message = `${tag}: ${request.url()} ${request.failure()?.errorText}`;
          if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) report.rscAborts.push(message);
          else report.requestFailures.push(message);
        });
        page.on("response", response => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
        await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
        await page.addInitScript(value => localStorage.setItem("theme", value), theme);
        const response = await page.goto(report.baseURL, { waitUntil: "domcontentloaded" });
        if (response?.status() !== 200) throw new Error(`${tag}: route HTTP ${response?.status()}`);
        await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
        const demo = page.getByTestId("chat-demo-root");
        const trigger = demo.getByRole("button", { name: "Select a model" });
        await trigger.click();
        const menu = demo.locator(`#${await trigger.getAttribute("aria-controls")}`);
        await expect(menu.getByRole("option", { name: "Reasoning model" })).toBeVisible();
        const readGeometry = () => menu.evaluate(element => {
          const bounds = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
          const clips = /^(auto|scroll|hidden|clip|overlay)$/;
          for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor), rect = ancestor.getBoundingClientRect();
            if (clips.test(style.overflowX || style.overflow)) { bounds.left = Math.max(bounds.left, rect.left); bounds.right = Math.min(bounds.right, rect.right); }
            if (clips.test(style.overflowY || style.overflow)) { bounds.top = Math.max(bounds.top, rect.top); bounds.bottom = Math.min(bounds.bottom, rect.bottom); }
          }
          const rect = element.getBoundingClientRect();
          return { bounds, menu: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width } };
        });
        await expect.poll(async () => {
          const geometry = await readGeometry();
          return geometry.menu.left >= geometry.bounds.left + 7 && geometry.menu.right <= geometry.bounds.right - 7 && geometry.menu.top >= geometry.bounds.top + 7 && geometry.menu.bottom <= geometry.bounds.bottom - 7;
        }, { timeout: 3000 }).toBe(true);
        const geometry = await readGeometry();
        if (geometry.menu.left < geometry.bounds.left + 7 || geometry.menu.right > geometry.bounds.right - 7 || geometry.menu.top < geometry.bounds.top + 7 || geometry.menu.bottom > geometry.bounds.bottom - 7) throw new Error(`${tag}: popup outside clipping bounds: ${JSON.stringify(geometry)}`);
        report.measurements.push({ tag, ...geometry });
        const chatWindow = demo.locator(":scope > div").nth(1);
        const path = join(out, `${tag}.png`);
        await chatWindow.screenshot({ path, animations: "disabled" });
        report.screenshots.push(path.slice(root.length + 1));
        await page.close();
      }
    }
    for (const theme of themes) {
      const tag = `${engineName}-host270-${theme}`;
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      page.on("pageerror", error => report.pageErrors.push(`${tag}: ${error.message}`));
      page.on("console", message => { if (message.type() === "error") report.consoleErrors.push(`${tag}: ${message.text()}`); });
      page.on("requestfailed", request => {
        const message = `${tag}: ${request.url()} ${request.failure()?.errorText}`;
        if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) report.rscAborts.push(message);
        else report.requestFailures.push(message);
      });
      page.on("response", response => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      const response = await page.goto(report.baseURL, { waitUntil: "domcontentloaded" });
      if (response?.status() !== 200) throw new Error(`${tag}: route HTTP ${response?.status()}`);
      const demo = page.getByTestId("chat-demo-root"), chatWindow = demo.locator(":scope > div").nth(1);
      await chatWindow.evaluate(element => { element.style.width = "270px"; element.style.maxWidth = "270px"; });
      await expect.poll(() => chatWindow.evaluate(element => element.getBoundingClientRect().width)).toBe(270);
      const trigger = demo.getByRole("button", { name: "Select a model" });
      await trigger.click();
      const menu = demo.locator(`#${await trigger.getAttribute("aria-controls")}`);
      await expect(menu.getByRole("option", { name: "Reasoning model" })).toBeVisible();
      const readGeometry = () => menu.evaluate(element => {
        const bounds = { left: 0, right: innerWidth }, clips = /^(auto|scroll|hidden|clip|overlay)$/;
        for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor), rect = ancestor.getBoundingClientRect();
          if (clips.test(style.overflowX || style.overflow)) { bounds.left = Math.max(bounds.left, rect.left); bounds.right = Math.min(bounds.right, rect.right); }
        }
        const rect = element.getBoundingClientRect(); return { bounds, menu: { left: rect.left, right: rect.right, width: rect.width } };
      });
      await expect.poll(async () => {
        const geometry = await readGeometry();
        return geometry.menu.left >= geometry.bounds.left + 7 && geometry.menu.right <= geometry.bounds.right - 7 && geometry.menu.width <= 254;
      }, { timeout: 3000 }).toBe(true);
      const geometry = await readGeometry();
      if (geometry.menu.left < geometry.bounds.left + 7 || geometry.menu.right > geometry.bounds.right - 7 || geometry.menu.width > 254) throw new Error(`${tag}: popup outside 270px clipping bounds: ${JSON.stringify(geometry)}`);
      report.measurements.push({ tag, ...geometry });
      const path = join(out, `${tag}.png`);
      await chatWindow.screenshot({ path, animations: "disabled" });
      report.screenshots.push(path.slice(root.length + 1));
      await page.close();
    }
  } catch (error) { report.failures.push(error?.stack ?? String(error)); }
  finally { await browser.close(); }
}
report.timestamp = new Date().toISOString();
await writeFile(join(out, "log.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.failures.length || report.pageErrors.length || report.consoleErrors.length || report.requestFailures.length || report.httpErrors.length) process.exitCode = 1;
