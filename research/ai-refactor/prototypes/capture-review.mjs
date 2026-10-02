import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, "captures");
await mkdir(captures, { recursive: true });
const states = [
  ["idle", "等待"], ["working", "執行中"], ["approval", "待確認"], ["done", "完成"], ["error", "失敗"],
];
const logs = { pageErrors: [], consoleErrors: [], requestFailures: [], requestOrigins: new Set(), fontStacks: {} };
const environments = [
  ["desktop1440", { width: 1440, height: 1000 }],
  ["mobile390", { width: 390, height: 844 }],
];

function observe(page, tag) {
  page.on("pageerror", (error) => logs.pageErrors.push(`${tag}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") logs.consoleErrors.push(`${tag}: ${message.text()}`);
  });
  page.on("requestfailed", (request) => logs.requestFailures.push(`${tag}: ${request.url()} ${request.failure()?.errorText}`));
  page.on("request", (request) => logs.requestOrigins.add(new URL(request.url()).origin));
}

async function openPage(browser, viewport, theme, tag) {
  const page = await browser.newPage({ viewport });
  observe(page, tag);
  const response = await page.goto("http://localhost:3942", { waitUntil: "networkidle" });
  if (response?.status() !== 200) throw new Error(`${tag}: HTTP ${response?.status()}`);
  if (theme === "dark") {
    await page.getByRole("button", { name: "切換深色" }).click();
  }
  const actualTheme = await page.evaluate(() => document.documentElement.classList.contains("dark") ? "dark" : "light");
  if (actualTheme !== theme) throw new Error(`${tag}: expected ${theme}, got ${actualTheme}`);
  await page.waitForTimeout(450); // allow token-driven surface transitions to settle before capture
  await page.evaluate(() => document.fonts.ready);
  logs.fontStacks[`${tag}-${theme}`] = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    mono: getComputedStyle(document.querySelector(".font-mono") ?? document.body).fontFamily,
  }));
  return page;
}

async function cardScreenshot(page, id, name) {
  const card = page.locator(`[data-review-draft="${id}"]`);
  await card.screenshot({ path: join(captures, `${name}.png`) });
}

try {
  for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await engine.launch({ headless: true });
    for (const [viewportName, viewport] of environments) {
      for (const theme of ["light", "dark"]) {
        const tag = `${engineName}-${viewportName}-${theme}`;
        const page = await openPage(browser, viewport, theme, tag);
        await page.screenshot({ path: join(captures, `${tag}-proposal.png`), fullPage: true });
        await page.locator('[data-review-draft="D1"]').getByRole("button", { name: "現行基線" }).click();
        await page.locator('[data-review-draft="D2"]').getByRole("button", { name: "現行基線" }).click();
        await page.screenshot({ path: join(captures, `${tag}-baseline.png`), fullPage: true });
        await page.close();
      }
    }

    // Inspect each state for each proposal. Desktop dark screenshots are the main review set.
    const page = await openPage(browser, { width: 1440, height: 1000 }, "dark", `${engineName}-state-matrix`);
    for (const [state, label] of states) {
      const d1 = page.locator('[data-review-draft="D1"]');
      const d2 = page.locator('[data-review-draft="D2"]');
      await d1.getByRole("button", { name: label, exact: true }).click();
      await d2.getByRole("button", { name: label, exact: true }).click();
      await cardScreenshot(page, "D1", `${engineName}-d1-${state}`);
      await cardScreenshot(page, "D2", `${engineName}-d2-${state}`);
    }

    // D1 local context, command, and model menu states. No sends or external calls.
    await page.locator('[data-review-draft="D1"]').getByRole("button", { name: "開啟來源選單" }).click();
    await page.screenshot({ path: join(captures, `${engineName}-d1-context-menu.png`) });
    const source = page.getByRole("button", { name: "PromptBar.tsx", exact: true });
    await source.click();
    await cardScreenshot(page, "D1", `${engineName}-d1-context-selected`);
    await page.locator('[data-review-draft="D1"]').getByRole("button", { name: "開啟指令選單" }).click();
    await page.screenshot({ path: join(captures, `${engineName}-d1-command-menu.png`) });
    await page.getByRole("button", { name: /比較基線與草案/ }).click();
    await cardScreenshot(page, "D1", `${engineName}-d1-command-filled`);
    await page.locator('[data-review-draft="D1"]').getByRole("combobox", { name: "預覽模型" }).click();
    await page.screenshot({ path: join(captures, `${engineName}-d1-model-picker.png`) });
    await page.keyboard.press("Escape");

    // D2 local disclosure and approval-only toggles; handlers only select mock states.
    const d2 = page.locator('[data-review-draft="D2"]');
    await d2.getByRole("button", { name: "收合步驟" }).click();
    await cardScreenshot(page, "D2", `${engineName}-d2-timeline-collapsed`);
    await d2.getByRole("button", { name: "展開步驟" }).click();
    await d2.locator('[data-yunui="agent-timeline-reasoning-disclosure"] button').first().click();
    await cardScreenshot(page, "D2", `${engineName}-d2-reasoning-open`);
    await d2.getByRole("button", { name: "待確認", exact: true }).click();
    await cardScreenshot(page, "D2", `${engineName}-d2-approval-pending`);
    await d2.getByRole("button", { name: "確認方向" }).click();
    await cardScreenshot(page, "D2", `${engineName}-d2-approval-local-done`);
    await d2.getByRole("button", { name: "待確認", exact: true }).click();
    await d2.getByRole("button", { name: "需要調整" }).click();
    await cardScreenshot(page, "D2", `${engineName}-d2-approval-local-rejected`);
    await page.close();
    await browser.close();
  }
} catch (error) {
  logs.pageErrors.push(`capture: ${error.stack ?? error}`);
} finally {
  const report = {
    pageErrors: logs.pageErrors,
    consoleErrors: logs.consoleErrors,
    requestFailures: logs.requestFailures,
    requestOrigins: [...logs.requestOrigins],
    fontStacks: logs.fontStacks,
  };
  await writeFile(join(captures, "capture-log.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

if (logs.pageErrors.length || logs.consoleErrors.length || logs.requestFailures.length) process.exitCode = 1;
