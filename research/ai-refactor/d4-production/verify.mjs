import { chromium, webkit } from "../../../site/node_modules/@playwright/test/index.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const captures = join(root, "captures");
await mkdir(captures, { recursive: true });
const axeSource = await readFile(new URL("../../../site/node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const widths = [390, 768, 1440];
const themes = ["light", "dark"];
const componentRoutes = [
  { key: "thinking-block", path: "/docs/ai/thinking-block", preview: (page) => page.locator(".not-prose.my-6").filter({ hasText: "Host-supplied steps" }).first(), axeTargets: (preview) => preview.locator("[data-yunui='thinking-block']") },
  { key: "agent-timeline", path: "/docs/ai/agent-timeline", preview: (page) => page.locator(".not-prose.my-6").filter({ hasText: "Approval prompts" }).first(), axeTargets: (preview) => preview.locator("[data-yunui='agent-timeline']") },
  { key: "approval-question", path: "/docs/ai/approval-question", preview: (page) => page.locator(".not-prose.my-6").filter({ hasText: "Approval Question" }).first(), axeTargets: (preview) => preview.locator("[data-yunui='approval-question']") },
  { key: "agent-run-status", path: "/docs/ai/agent-run-status", preview: (page) => page.locator(".not-prose.my-6").filter({ hasText: "Phases" }).first(), axeTargets: (preview) => preview.locator("[data-yunui='agent-run-status']") },
];
const report = {
  baseURL: "http://localhost:3957",
  source: "production build from the shared workspace; no scratch site",
  engines: {},
  notes: [
    "Docs component Axe is scoped to the real public-component preview; Chat Axe is scoped to the actual ChatDemo composition.",
    "Theme is selected using the visible docs theme control. No component attributes or props are injected.",
    "Static screenshots come from the rendered public docs components and the site ChatDemo. D4 prototype counts are not used as evidence.",
  ],
};

function observe(page, diagnostics) {
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") diagnostics.consoleErrors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) diagnostics.httpErrors.push(`${response.status()} ${response.url()}`); });
  page.on("requestfailed", (request) => {
    const error = request.failure()?.errorText ?? "request failed";
    if (error === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) diagnostics.cancelledRsc++;
    else diagnostics.requestErrors.push(`${request.url()} ${error}`);
  });
}

async function selectTheme(page, theme) {
  const html = page.locator("html");
  const current = await html.getAttribute("class") ?? "";
  const isDark = current.split(/\s+/).includes("dark");
  if ((theme === "dark") !== isDark) {
    let themeButton = page.locator(`button[aria-label="${theme}"]:visible`).first();
    let openedSidebar = false;
    if (await themeButton.count() === 0) {
      const openSidebar = page.locator('button[aria-label="Open Sidebar"]:visible').last();
      if (await openSidebar.isVisible()) {
        await openSidebar.click();
        await page.locator("#nd-sidebar-mobile").waitFor({ state: "visible" });
        openedSidebar = true;
      }
      themeButton = page.locator(`#nd-sidebar-mobile button[aria-label="${theme}"]`).first();
    }
    await themeButton.waitFor({ state: "visible" });
    await themeButton.click();
    if (openedSidebar) {
      const closeSidebar = page.locator("#nd-sidebar-mobile").getByRole("button", { name: "Close Sidebar" });
      if (await closeSidebar.isVisible()) {
        await closeSidebar.click();
        await page.waitForFunction(() => {
          const aside = document.querySelector("#nd-sidebar-mobile");
          if (!aside) return true;
          const rect = aside.getBoundingClientRect();
          return aside.dataset.state === "closed" && (getComputedStyle(aside).visibility === "hidden" || rect.left >= window.innerWidth || rect.right <= 0);
        });
      }
    }
  }
  await page.waitForFunction((expected) => {
    const dark = document.documentElement.classList.contains("dark");
    if ((expected === "dark") !== dark) return false;
    const bg = getComputedStyle(document.body).getPropertyValue("--bg-base").trim();
    return expected === "dark" ? bg === "#09090b" : bg === "#fff";
  }, theme, { timeout: 5000 });
  await page.waitForTimeout(100);
}

async function axe(target) {
  return target.evaluate(async (element) => {
    const result = await window.axe.run(element);
    return result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    }));
  });
}

async function screenshot(target, name) {
  const path = join(captures, name);
  await target.screenshot({ path, animations: "disabled" });
  return path.replace(`${root}/`, "");
}

for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch({ headless: true });
  const data = {
    matrix: [],
    interactions: {},
    axeViolations: [],
    pageErrors: [],
    consoleErrors: [],
    httpErrors: [],
    requestErrors: [],
    cancelledRsc: 0,
  };

  for (const route of componentRoutes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    observe(page, data);
    const response = await page.goto(`${report.baseURL}${route.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible" });
    await page.waitForTimeout(250);
    await page.addScriptTag({ content: axeSource });
    for (const width of widths) {
      for (const theme of themes) {
        await selectTheme(page, theme);
        await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
        const preview = route.preview(page);
        await preview.waitFor({ state: "visible" });
        await preview.scrollIntoViewIfNeeded();
        await page.evaluate(() => document.fonts.ready);
        const targets = route.axeTargets(preview);
        const violations = [];
        const targetCount = await targets.count();
        for (let targetIndex = 0; targetIndex < targetCount; targetIndex++) {
          const target = targets.nth(targetIndex);
          await target.waitFor({ state: "visible" });
          for (const violation of await axe(target)) violations.push({ componentIndex: targetIndex, ...violation });
        }
        const tag = `${engineName}-${route.key}-${width}-${theme}`;
        const shot = await screenshot(preview, `${tag}.png`);
        data.matrix.push({ route: route.path, width, theme, status: response?.status() ?? null, capture: shot, axeViolations: violations });
        for (const violation of violations) data.axeViolations.push({ tag, ...violation });
      }
    }

    if (route.key === "thinking-block") {
      await selectTheme(page, "light");
      const preview = route.preview(page);
      const trace = preview.locator("[data-yunui='thinking-block']");
      const trigger = trace.getByRole("button", { name: "Agent trace" });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const expanded = await trigger.getAttribute("aria-expanded");
      const closedTraceInert = await trace.locator("[inert]").count() > 0;
      if (expanded === "false") {
        await trigger.focus();
        await page.keyboard.press("Enter");
      }
      const step = trace.getByRole("button", { name: /Compare the examples/ });
      await step.click();
      data.interactions.thinking = {
        triggerExpandedAfterEnter: expanded,
        hostSelectedStep: await preview.getByText("Host-selected step:").textContent(),
        closedTraceInert,
      };
    }

    if (route.key === "agent-timeline") {
      const preview = route.preview(page);
      const timeline = preview.locator("[data-yunui='agent-timeline']");
      const summary = timeline.getByRole("button").first();
      await summary.focus();
      await summary.press("Enter");
      const collapsed = await timeline.locator(":scope > [inert]").count();
      await summary.press("Enter");
      const expandedAgain = await summary.getAttribute("aria-expanded");
      const approvalPreview = page.locator(".not-prose.my-6").filter({ hasText: "Approval prompts" }).first();
      const allow = approvalPreview.getByRole("button", { name: "Allow", exact: true });
      const deny = approvalPreview.getByRole("button", { name: "Deny", exact: true });
      data.interactions.timeline = {
        collapsedAfterKeyboard: collapsed > 0,
        expandedAgainAfterKeyboard: expandedAgain === "true",
        allowDisabledWithoutHostCallback: await allow.isDisabled(),
        denyDisabledWithoutHostCallback: await deny.isDisabled(),
      };
    }

    if (route.key === "approval-question") {
      const demo = page.getByTestId("approval-question-demo");
      await demo.getByRole("checkbox", { name: "Another source" }).check();
      await demo.getByRole("textbox", { name: "Name the source" }).fill("Vector index");
      await demo.getByRole("button", { name: "Next" }).click();
      await demo.getByRole("radio", { name: "Step-by-step" }).check();
      await demo.getByRole("button", { name: "Submit answers" }).click();
      const submittedNotice = await demo.getByRole("status").textContent();
      await page.getByRole("button", { name: "Preview submitting state" }).click();
      const busyChoiceDisabled = await demo.getByRole("radio", { name: "Short summary" }).isDisabled();
      const busyDismissDisabled = await demo.getByRole("button", { name: "Dismiss questions" }).isDisabled();
      data.interactions.questionnaire = { submittedNotice, busyChoiceDisabled, busyDismissDisabled };
    }

    await page.close();
  }

  // Inspect all five real ChatDemo states at each viewport/theme, axe-scoped
  // to the public-composition root. Scenario actions remain local docs state.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    observe(page, data);
    const response = await page.goto(`${report.baseURL}/docs/chat`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "Agent state fixture" }).waitFor({ state: "visible" });
    await page.waitForTimeout(250);
    await page.addScriptTag({ content: axeSource });
    const demo = page.getByTestId("chat-demo-root");
    const stateGroup = demo.getByRole("group", { name: "Agent state fixture" });
    for (const state of ["Idle", "Working", "Approval", "Done", "Error"]) {
      await stateGroup.getByRole("button", { name: state, exact: true }).click();
      for (const width of widths) {
        for (const theme of themes) {
          await selectTheme(page, theme);
          await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
          await demo.scrollIntoViewIfNeeded();
          await page.evaluate(() => document.fonts.ready);
          const violations = await axe(demo);
          const tag = `${engineName}-chat-${state.toLowerCase()}-${width}-${theme}`;
          const shot = await screenshot(demo, `${tag}.png`);
          const runStatus = await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase");
          const timeline = demo.locator("[data-yunui='agent-timeline']");
          const rowCount = await timeline.locator("[data-yunui='agent-tool-row'],[data-yunui='agent-task-row'],[data-yunui='agent-approval-row']").count();
          data.matrix.push({ route: "/docs/chat", state, width, theme, status: response?.status() ?? null, runStatus, rowCount, capture: shot, axeViolations: violations });
          for (const violation of violations) data.axeViolations.push({ tag, ...violation });
        }
      }
    }

    await stateGroup.getByRole("button", { name: "Working", exact: true }).click();
    const timeline = demo.locator("[data-yunui='agent-timeline']");
    const codeRow = timeline.getByRole("button", { name: /Review CodeBlock output/ });
    await codeRow.click();
    const outputRegion = timeline.getByRole("region", { name: "Review output" });
    const visibleHostCode = await outputRegion.getByText(/const result1 = await checkRoute/).count();
    const edit = outputRegion.getByRole("button", { name: "Edit" });
    await edit.click();
    const hostEditEvent = await demo.getByTestId("chat-demo-host-event").textContent();
    data.interactions.chatRichOutput = { codeBlockRendered: visibleHostCode > 0, editCallback: hostEditEvent };

    await stateGroup.getByRole("button", { name: "Approval", exact: true }).click();
    await demo.getByRole("checkbox", { name: "Another source" }).check();
    await demo.getByRole("textbox", { name: "Name the source" }).fill("Vector index");
    await demo.getByRole("button", { name: "Next" }).click();
    await demo.getByRole("radio", { name: "Step-by-step" }).check();
    await demo.getByRole("button", { name: "Submit answers" }).click();
    const questionOnlyEvent = await demo.getByTestId("chat-demo-host-event").textContent();
    const approvalStillPending = await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase");
    await stateGroup.getByRole("button", { name: "Approval", exact: true }).click();
    await demo.getByRole("button", { name: "Deny", exact: true }).click();
    const cancelledPhase = await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase");
    const declineEvent = await demo.getByTestId("chat-demo-host-event").textContent();
    await stateGroup.getByRole("button", { name: "Error", exact: true }).click();
    const failedPhase = await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase");
    data.interactions.approvalSeparation = { questionOnlyEvent, approvalStillPending, cancelledPhase, declineEvent, failedPhase };

    await stateGroup.getByRole("button", { name: "Approval", exact: true }).click();
    await demo.getByRole("button", { name: "Allow", exact: true }).click();
    data.interactions.approvalAllow = {
      phase: await demo.locator("[data-yunui='agent-run-status']").getAttribute("data-phase"),
      event: await demo.getByTestId("chat-demo-host-event").textContent(),
    };
    await page.close();
  }

  await browser.close();
  data.axeSummary = {
    runs: data.matrix.length,
    casesWithViolations: data.matrix.filter((item) => item.axeViolations.length).length,
    violationGroups: data.axeViolations.length,
  };
  report.engines[engineName] = data;
}

await writeFile(join(root, "production-review.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  matrixCases: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.matrix.length])),
  axeSummary: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.axeSummary])),
  interactions: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.interactions])),
  pageErrors: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.pageErrors])),
  httpErrors: Object.fromEntries(Object.entries(report.engines).map(([engine, result]) => [engine, result.httpErrors])),
}, null, 2));
