import { chromium, webkit, expect } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "captures-3964");
await mkdir(out, { recursive: true });
const report = { baseURL: "http://127.0.0.1:3964", failures: [], pageErrors: [], consoleErrors: [], requestFailures: [], rscAborts: [], httpErrors: [], captures: [] };

for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch({ headless: true });
  try {
    for (const width of [390, 768, 1440]) {
      for (const theme of ["light", "dark"]) {
        const tag = `${engineName}-${width}-${theme}`;
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
        page.on("pageerror", error => report.pageErrors.push(`${tag}: ${error.message}`));
        page.on("console", message => { if (message.type() === "error") report.consoleErrors.push(`${tag}: ${message.text()}`); });
        page.on("requestfailed", request => {
          const text = `${tag}: ${request.url()} ${request.failure()?.errorText}`;
          if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) report.rscAborts.push(text);
          else report.requestFailures.push(text);
        });
        page.on("response", response => { if (response.status() >= 400) report.httpErrors.push(`${tag}: ${response.status()} ${response.url()}`); });
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        await page.addInitScript(value => localStorage.setItem("theme", value), theme);
        const response = await page.goto(`${report.baseURL}/docs/chat`, { waitUntil: "domcontentloaded" });
        if (response?.status() !== 200) throw new Error(`${tag}: /docs/chat HTTP ${response?.status()}`);
        const demo = page.getByTestId("chat-demo-root");
        const states = demo.getByRole("group", { name: "Agent state fixture" });
        await states.getByRole("button", { name: "Working", exact: true }).click();
        await expect(states.getByRole("button", { name: "Working", exact: true })).toHaveAttribute("aria-pressed", "true");
        await states.getByRole("button", { name: "Idle", exact: true }).click();
        await expect(states.getByRole("button", { name: "Idle", exact: true })).toHaveAttribute("aria-pressed", "true");
        await states.getByRole("button", { name: "Done", exact: true }).click();
        await expect(states.getByRole("button", { name: "Done", exact: true })).toHaveAttribute("aria-pressed", "true");

        const shortBlock = demo.getByText("route-checks.ts", { exact: true }).locator("xpath=../..");
        const longBlock = demo.getByText("all-routes.ts", { exact: true }).locator("xpath=../..");
        await expect(shortBlock.locator(".shiki-wrapper .line")).toHaveCount(3);
        await expect(longBlock.locator(".shiki-wrapper .line")).toHaveCount(8);
        for (const [name, block] of [["content-short", shortBlock], ["content-long-folded", longBlock]]) {
          const path = join(out, `${tag}-${name}.png`);
          await block.screenshot({ path, animations: "disabled" });
          report.captures.push(path.slice(root.length + 1));
        }
        await longBlock.getByRole("button", { name: "Show all 80 lines" }).click();
        await expect.poll(() => longBlock.locator(".shiki-wrapper .line").count()).toBe(80);
        const expandedPath = join(out, `${tag}-content-long-expanded.png`);
        await longBlock.screenshot({ path: expandedPath, animations: "disabled" });
        report.captures.push(expandedPath.slice(root.length + 1));

        await states.getByRole("button", { name: "Working", exact: true }).click();
        await expect(states.getByRole("button", { name: "Working", exact: true })).toHaveAttribute("aria-pressed", "true");
        const toolRow = demo.locator('[data-yunui="agent-tool-row"]').filter({ hasText: "CodeBlock output" });
        await toolRow.getByRole("button").click();
        const toolOutput = demo.getByRole("region", { name: "Review output" });
        const toolBlock = toolOutput.locator(".shiki-wrapper").locator("xpath=../..");
        await expect(toolBlock.locator(".shiki-wrapper .line")).toHaveCount(12);
        const toolPath = join(out, `${tag}-tool-output-12.png`);
        await toolBlock.screenshot({ path: toolPath, animations: "disabled" });
        report.captures.push(toolPath.slice(root.length + 1));
        await page.close();

        const patternPage = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
        patternPage.on("pageerror", error => report.pageErrors.push(`${tag}-pattern: ${error.message}`));
        patternPage.on("console", message => { if (message.type() === "error") report.consoleErrors.push(`${tag}-pattern: ${message.text()}`); });
        patternPage.on("requestfailed", request => {
          const text = `${tag}-pattern: ${request.url()} ${request.failure()?.errorText}`;
          if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) report.rscAborts.push(text);
          else report.requestFailures.push(text);
        });
        patternPage.on("response", item => { if (item.status() >= 400) report.httpErrors.push(`${tag}-pattern: ${item.status()} ${item.url()}`); });
        await patternPage.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        await patternPage.addInitScript(value => localStorage.setItem("theme", value), theme);
        const patternResponse = await patternPage.goto(`${report.baseURL}/docs/patterns/code-block`, { waitUntil: "domcontentloaded" });
        if (patternResponse?.status() !== 200) throw new Error(`${tag}: /docs/patterns/code-block HTTP ${patternResponse?.status()}`);
        const preview = patternPage.locator("p.text-sm.font-medium").filter({ hasText: /^Tabs$/ }).locator("xpath=../../..");
        await preview.getByRole("button", { name: "Code", exact: true }).click();
        await expect(preview.getByRole("button", { name: "Preview", exact: true })).toBeVisible();
        await preview.getByRole("button", { name: "Preview", exact: true }).click();
        // The installed host may localize this group label (e.g. “Code examples”).
        const tabGroup = preview.getByRole("group");
        await expect(tabGroup).toHaveCount(1);
        const npm = tabGroup.getByRole("button", { name: "npm", exact: true });
        const pnpm = tabGroup.getByRole("button", { name: "pnpm", exact: true });
        const patternBlock = preview.locator("pre[aria-label]").locator("xpath=..");
        await expect(patternBlock.locator("code")).toContainText("npm install");
        const npmPath = join(out, `${tag}-pattern-tabs-npm.png`);
        await patternBlock.screenshot({ path: npmPath, animations: "disabled" });
        report.captures.push(npmPath.slice(root.length + 1));
        await pnpm.click();
        await expect(pnpm).toHaveAttribute("aria-pressed", "true");
        await expect(patternBlock.locator("code")).toContainText("pnpm add");
        const pnpmPath = join(out, `${tag}-pattern-tabs-pnpm.png`);
        await patternBlock.screenshot({ path: pnpmPath, animations: "disabled" });
        report.captures.push(pnpmPath.slice(root.length + 1));
        await patternPage.close();
      }
    }
  } catch (error) {
    report.failures.push(error?.stack ?? String(error));
  } finally {
    await browser.close();
  }
}
report.timestamp = new Date().toISOString();
await writeFile(join(out, "log.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.failures.length || report.pageErrors.length || report.consoleErrors.length || report.requestFailures.length || report.httpErrors.length) process.exitCode = 1;
