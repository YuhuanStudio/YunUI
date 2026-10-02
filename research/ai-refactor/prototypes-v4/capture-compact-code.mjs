import { chromium, webkit, expect } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, "captures", "codeblock-update");
await mkdir(captures, { recursive: true });
const report = { failures: [], pageErrors: [], consoleErrors: [], requestFailures: [], httpErrors: [], origins: new Set(), screenshots: [] };
const widths = [["390", { width: 390, height: 844 }], ["768", { width: 768, height: 1000 }], ["1440", { width: 1440, height: 1000 }]];

function watch(page, tag) {
  page.on("pageerror", (error) => report.pageErrors.push(`${tag}: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") report.consoleErrors.push(`${tag}: ${message.text()}`); });
  page.on("requestfailed", (request) => report.requestFailures.push(`${tag}: ${request.url()} ${request.failure()?.errorText}`));
  page.on("request", (request) => report.origins.add(new URL(request.url()).origin));
  page.on("response", (response) => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
}

async function open(browser, width, theme, tag, clipboard = false) {
  const context = await browser.newContext({ viewport: width, deviceScaleFactor: 1, reducedMotion: "reduce" });
  if (clipboard) await context.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value) => { window.__d4CopiedText = value; } } });
  });
  const page = await context.newPage();
  watch(page, tag);
  const response = await page.goto("http://localhost:3946", { waitUntil: "domcontentloaded" });
  if (response?.status() !== 200) throw new Error(`${tag}: D4 returned ${response?.status()}`);
  await page.getByTestId("d4-root").waitFor({ state: "visible" });
  if (theme === "dark") await page.getByRole("button", { name: "Dark", exact: true }).click();
  const state = page.getByRole("group", { name: "D4 state fixture" });
  const fixtureState = theme === "snapshot-state" ? "Working" : tag.endsWith("-done") ? "Done" : "Working";
  await state.getByRole("button", { name: fixtureState, exact: true }).click();
  const expectedPhase = fixtureState === "Done" ? "completed" : "acting";
  await expect(page.getByTestId("d4-phase")).toHaveAttribute("data-phase", expectedPhase);
  if (fixtureState === "Done") await page.getByTestId("candidate-code").first().waitFor({ state: "visible" });
  await page.waitForFunction(() => document.fonts.ready);
  return { context, page };
}

async function capture(page, filename) {
  await page.locator(".d4-window").screenshot({ path: join(captures, filename), animations: "disabled" });
  report.screenshots.push(filename);
}

const browsers = [];
try {
  for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await launcher.launch({ headless: true });
    browsers.push(browser);
    for (const [widthLabel, viewport] of widths) {
      for (const theme of ["light", "dark"]) {
        for (const stateName of ["done", "working"]) {
          const tag = `${engine}-${widthLabel}-${theme}-${stateName}`;
          const { context, page } = await open(browser, viewport, theme, tag);
          if (stateName === "done") {
            const codes = page.getByTestId("d4-long-assistant-output").getByTestId("candidate-code");
            await expect(codes).toHaveCount(2);
            await expect(codes.nth(0)).toHaveAttribute("data-code-lines", "3");
            await expect(codes.nth(1)).toHaveAttribute("data-code-lines", "80");
            await expect(codes.nth(0).locator(".shiki-wrapper code > span")).toHaveCount(3);
            await expect(codes.nth(1).locator(".shiki-wrapper code > span")).toHaveCount(8);
            await expect.poll(() => codes.nth(0).locator(".shiki-wrapper").evaluate((element) => getComputedStyle(element).fontSize)).toBe("14px");
            await expect(codes.nth(1).locator(".d4-compact-code-file")).toHaveAttribute("title", "research/ai-refactor/prototypes-v4/captures/webkit-390-light-approval.png");
            await expect(codes.nth(1).getByRole("button", { name: "Show all 80 lines" })).toBeVisible();
            await codes.nth(1).scrollIntoViewIfNeeded();
          } else {
            await expect(page.getByTestId("d4-tool-code-output")).toHaveCount(0);
            await page.getByRole("button", { name: /Review CodeBlock output/ }).click();
            const output = page.getByTestId("d4-tool-code-output").getByTestId("candidate-code");
            await expect(output).toHaveAttribute("data-code-lines", "12");
            await expect(output.locator(".shiki-wrapper code > span")).toHaveCount(12);
            await expect.poll(() => output.locator(".shiki-wrapper").evaluate((element) => getComputedStyle(element).fontSize)).toBe("14px");
            await expect(output.locator(".d4-compact-code-file")).toHaveAttribute("title", "site/content/docs/ai/agent-timeline.zh-TW.mdx · code sample");
            await output.scrollIntoViewIfNeeded();
          }
          const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          if (pageWidth > viewport.width) throw new Error(`${tag}: document overflows horizontally ${pageWidth}/${viewport.width}`);
          await capture(page, `${tag}.png`);
          await context.close();
        }
      }
    }

    const { context, page } = await open(browser, { width: 1440, height: 1000 }, "light", `${engine}-interactions-done`, true);
    const doneCodes = page.getByTestId("d4-long-assistant-output").getByTestId("candidate-code");
    const shortCode = `const route = "/docs/patterns/navbar";\nconst locales = ["en", "zh-CN", "zh-TW"];\nawait verifyRoute(route, locales);`;
    await doneCodes.nth(0).getByRole("button", { name: "Copy full code" }).click();
    await expect(doneCodes.nth(0).getByRole("button", { name: "Copy full code" })).toContainText("Copied");
    if (await page.evaluate(() => window.__d4CopiedText) !== shortCode) throw new Error(`${engine}: 3-line Copy did not send the complete source`);
    await doneCodes.nth(1).getByRole("button", { name: "Copy full code" }).click();
    await expect(doneCodes.nth(1).getByRole("button", { name: "Copy full code" })).toContainText("Copied");
    const longCopied = await page.evaluate(() => window.__d4CopiedText);
    if (longCopied.split("\n").length !== 80 || !longCopied.startsWith("const routeResult01") || !longCopied.endsWith('"zh-CN");')) throw new Error(`${engine}: 80-line Copy payload was truncated`);
    const expand = doneCodes.nth(1).getByRole("button", { name: "Show all 80 lines" });
    await expand.click();
    await expect(doneCodes.nth(1).locator(".shiki-wrapper code > span")).toHaveCount(80);
    await expect(doneCodes.nth(1).getByRole("button", { name: "Show less" })).toBeVisible();
    await doneCodes.nth(1).getByRole("button", { name: "Show less" }).click();
    await expect(doneCodes.nth(1).getByRole("button", { name: "Show all 80 lines" })).toBeFocused();
    await expect(doneCodes.nth(1).locator(".shiki-wrapper code > span")).toHaveCount(8);
    await doneCodes.nth(1).scrollIntoViewIfNeeded();
    await doneCodes.nth(0).getByRole("button", { name: "Edit code" }).click();
    await expect(page.getByTestId("d4-host-event")).toContainText("Host edit received src/chat/chat-composer.tsx · route example (3 lines, typescript).");
    await capture(page, `${engine}-80-expanded.png`);

    await page.getByRole("group", { name: "D4 state fixture" }).getByRole("button", { name: "Working", exact: true }).click();
    await expect(page.getByTestId("d4-phase")).toHaveAttribute("data-phase", "acting");
    await page.getByRole("button", { name: /Review CodeBlock output/ }).click();
    const toolCode = page.getByTestId("d4-tool-code-output").getByTestId("candidate-code");
    await toolCode.scrollIntoViewIfNeeded();
    await toolCode.getByRole("button", { name: "Copy full code" }).click();
    await expect(toolCode.getByRole("button", { name: "Copy full code" })).toContainText("Copied");
    const toolCopied = await page.evaluate(() => window.__d4CopiedText);
    if (toolCopied.split("\n").length !== 12 || !toolCopied.startsWith("const locale1") || !toolCopied.endsWith('");')) throw new Error(`${engine}: 12-line tool Copy payload is incomplete`);
    await toolCode.getByRole("button", { name: "Edit code" }).click();
    await expect(page.getByTestId("d4-host-event")).toContainText("Host edit received site/content/docs/ai/agent-timeline.zh-TW.mdx · code sample (12 lines, typescript).");
    await capture(page, `${engine}-tool-copy-edit.png`);
    await context.close();
    browsers.pop();
    await browser.close();
  }
} catch (error) {
  report.failures.push(error?.stack ?? String(error));
} finally {
  await Promise.all(browsers.map((browser) => browser.close().catch(() => {})));
  report.origins = [...report.origins];
  report.unexpectedOrigins = report.origins.filter((origin) => origin !== "http://localhost:3946");
  await writeFile(join(captures, "capture-log.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}
if (report.failures.length || report.pageErrors.length || report.consoleErrors.length || report.requestFailures.length || report.httpErrors.length || report.unexpectedOrigins.length) process.exitCode = 1;
