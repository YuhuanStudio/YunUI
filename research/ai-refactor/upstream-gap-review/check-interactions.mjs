import assert from "node:assert/strict";
import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";

const base = "http://127.0.0.1:3963/";
const report = [];
for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "2 sources" }).click();
  assert.equal(await page.locator("#streaming-source-list a").count(), 2);
  await page.getByRole("button", { name: "Show the access review steps" }).click();
  assert.match(await page.locator("#streaming .review-status").textContent(), /follow-up requested/);
  await page.selectOption("#stream-state", "streaming");
  await page.getByRole("button", { name: "Advance host chunk" }).click();
  await page.selectOption("#stream-state", "empty");
  assert.match(await page.locator("#streaming").textContent(), /No answer was returned/);
  await page.selectOption("#stream-state", "error");
  assert.match(await page.locator("#streaming").textContent(), /could not be completed/);

  await page.getByRole("button", { name: "Include" }).first().click();
  assert.match(await page.locator("#context-cards .review-status").textContent(), /context callback/);
  await page.getByRole("button", { name: "Show empty host state" }).click();
  assert.match(await page.locator("#context-cards").textContent(), /No retrieved context/);

  await page.getByRole("button", { name: "Improve" }).click();
  assert.match(await page.locator("#selection-actions .review-status").textContent(), /Improve requested/);
  await page.selectOption("#selection-state", "busy");
  assert.match(await page.locator("#selection-actions").textContent(), /Improving/);
  await page.selectOption("#selection-state", "result");
  await page.getByRole("button", { name: "Keep" }).click();
  assert.match(await page.locator("#selection-actions .review-status").textContent(), /Host accepted result/);
  await page.selectOption("#selection-state", "error");
  assert.match(await page.locator("#selection-actions").textContent(), /edit request failed/);
  await page.selectOption("#selection-state", "cancelled");
  assert.match(await page.locator("#selection-actions").textContent(), /cancelled/);
  await page.selectOption("#selection-state", "idle");
  await page.getByRole("button", { name: "Show more actions" }).click();
  await page.getByRole("button", { name: "Shorten" }).waitFor({ state: "visible" });

  await page.getByRole("button", { name: "Clear selection" }).click();
  assert.equal(await page.getByRole("button", { name: /Apply/ }).isDisabled(), true);
  await page.getByRole("button", { name: "Restore selection" }).click();
  assert.equal(await page.getByRole("button", { name: "Apply 2 changes" }).isDisabled(), false);
  await page.getByRole("button", { name: "Apply 2 changes" }).click();
  assert.match(await page.locator("#diff-review .review-status").textContent(), /Apply requested/);
  await page.selectOption("#diff-state", "busy");
  assert.equal(await page.getByRole("button", { name: /Apply/ }).count(), 0);
  await page.selectOption("#diff-state", "error");
  assert.match(await page.locator("#diff-review").textContent(), /Could not apply changes/);
  await page.selectOption("#diff-state", "cancelled");
  assert.match(await page.locator("#diff-review").textContent(), /Changes cancelled/);
  await page.selectOption("#diff-state", "disabled");
  assert.match(await page.locator("#diff-review").textContent(), /Changes unavailable/);
  assert.equal(await page.getByRole("button", { name: /Apply/ }).count(), 0);
  await page.selectOption("#diff-state", "applied");
  assert.match(await page.locator("#diff-review").textContent(), /2 edits applied/);

  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert.ok(dimensions.scroll <= dimensions.client + 1, `${engine} mobile horizontal overflow: ${JSON.stringify(dimensions)}`);
  assert.deepEqual(errors, []);
  report.push({ engine, viewport: 390, assertions: 23, errors, ...dimensions, result: "pass" });
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
