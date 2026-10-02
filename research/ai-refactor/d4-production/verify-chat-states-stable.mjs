import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, "captures");
await mkdir(captures, { recursive: true });
const axeSource = await readFile(new URL("../../../site/node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const expectedPhases = { Idle: "waiting", Working: "acting", Approval: "waiting", Done: "completed", Error: "failed" };
const report = { baseURL: "http://localhost:3957/docs/chat", viewport: { width: 390, height: 844 }, theme: "light", engines: {} };

for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch({ headless: true });
  const results = [];
  const page = await browser.newPage({ viewport: report.viewport, reducedMotion: "reduce" });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(report.baseURL, { waitUntil: "domcontentloaded" });
  const demo = page.getByTestId("chat-demo-root");
  const group = demo.getByRole("group", { name: "Agent state fixture" });
  await group.waitFor({ state: "visible" });
  await page.waitForTimeout(250);
  await page.addScriptTag({ content: axeSource });

  for (const [state, expectedPhase] of Object.entries(expectedPhases)) {
    await group.getByRole("button", { name: state, exact: true }).click();
    await page.waitForTimeout(350);
    const phase = await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase");
    const violations = await demo.evaluate(async (element) => {
      const result = await window.axe.run(element);
      return result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
      }));
    });
    const capture = join(captures, `${engineName}-chat-${state.toLowerCase()}-390-light-stable.png`);
    await demo.screenshot({ path: capture, animations: "disabled" });
    results.push({ state, expectedPhase, actualPhase: phase, phaseMatches: phase === expectedPhase, axeViolations: violations, capture: capture.replace(`${root}/`, "") });
  }
  report.engines[engineName] = { states: results, pageErrors };
  await browser.close();
}

await writeFile(join(root, "chat-states-stable.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  stateCounts: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.states.length])),
  axeViolations: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.states.reduce((sum, state) => sum + state.axeViolations.length, 0)])),
  phaseMismatches: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.states.filter((state) => !state.phaseMatches).map((state) => state.state)])),
  pageErrors: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.pageErrors])),
}, null, 2));
