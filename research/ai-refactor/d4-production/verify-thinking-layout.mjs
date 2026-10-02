import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, "captures");
await mkdir(captures, { recursive: true });
const axeSource = await readFile(new URL("../../../site/node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const report = { baseURL: "http://127.0.0.1:3961/docs/chat", theme: "light", cases: [] };

for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch({ headless: true });
  for (const width of [390, 512, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: "reduce" });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(report.baseURL, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Agent state fixture" }).waitFor({ state: "visible" });
    await page.waitForTimeout(250);
    await page.getByRole("group", { name: "Agent state fixture" }).getByRole("button", { name: "Working", exact: true }).click();
    const demo = page.getByTestId("chat-demo-root");
    const thinking = demo.locator("[data-yunui='thinking-block']");
    await thinking.waitFor({ state: "visible" });
    await page.addScriptTag({ content: axeSource });
    const layout = await thinking.evaluate((section) => {
      const row = section.querySelector("[data-yunui='thinking-block-step']");
      const label = row?.querySelector("span.min-w-0.text-left");
      const metadata = row?.querySelector("[data-yunui='thinking-block-step-meta']");
      const box = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      return {
        sectionWidth: section.getBoundingClientRect().width,
        label: box(label),
        metadata: box(metadata),
        labelText: label?.textContent,
        metadataText: metadata?.textContent,
        metadataBelowLabel: Boolean(label && metadata && metadata.getBoundingClientRect().top >= label.getBoundingClientRect().bottom - 1),
        metadataBesideLabel: Boolean(label && metadata && metadata.getBoundingClientRect().top < label.getBoundingClientRect().bottom - 1),
      };
    });
    await thinking.scrollIntoViewIfNeeded();
    const rect = await thinking.boundingBox();
    if (rect) await page.evaluate((top) => window.scrollTo(0, window.scrollY + top - 160), rect.y);
    await page.waitForTimeout(250);
    const axe = await thinking.evaluate(async (element) => {
      const result = await window.axe.run(element);
      return result.violations.map((violation) => ({ id: violation.id, impact: violation.impact, help: violation.help, targets: violation.nodes.map((node) => node.target) }));
    });
    const capture = join(captures, `${engineName}-thinking-chat-${width}-light.png`);
    await page.screenshot({ path: capture, animations: "disabled" });
    report.cases.push({ engine: engineName, width, state: "Working", layout, axeViolations: axe, pageErrors, capture: capture.replace(`${root}/`, "") });
    await page.close();
  }
  await browser.close();
}

await writeFile(join(root, "thinking-layout-3961.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
