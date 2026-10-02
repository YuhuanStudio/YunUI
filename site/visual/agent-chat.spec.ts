import { test, expect, type Page } from "@playwright/test";
import axe from "axe-core";

const themes = ["light", "dark", "true-black"] as const;
const widths = [390, 768, 1440] as const;
const agentStates = ["Idle", "Working", "Approval", "Done", "Error"] as const;

type Theme = (typeof themes)[number];

async function openRoute(page: Page, route: string, theme: Theme, width: number, height = 1000) {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme === "light" ? "light" : "dark" });
  await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`));
  if (route === "/docs/chat") {
    const controls = page.getByRole("group", { name: "Agent state fixture" });
    const working = controls.getByRole("button", { name: "Working", exact: true });
    await working.click();
    await expect(working).toHaveAttribute("aria-pressed", "true");
    const idle = controls.getByRole("button", { name: "Idle", exact: true });
    await idle.click();
    await expect(idle).toHaveAttribute("aria-pressed", "true");
  }
}

function statesFor(page: Page) {
  return page.getByRole("group", { name: "Agent state fixture" });
}

async function setAgentState(page: Page, state: (typeof agentStates)[number]) {
  await statesFor(page).getByRole("button", { name: state, exact: true }).click();
}

async function collectAxeViolations(page: Page, selector: string, label: string) {
  if (!(await page.evaluate(() => Boolean((window as Window & { axe?: unknown }).axe)))) {
    await page.addScriptTag({ content: axe.source });
  }
  const violations = await page.evaluate(async (target) => {
    const root = document.querySelector(target);
    if (!root) throw new Error(`Missing axe target: ${target}`);
    const result = await (window as unknown as { axe: { run: (element: Element, options: unknown) => Promise<{ violations: Array<{ id: string; impact?: string | null; nodes: Array<{ target: string[]; failureSummary?: string }> }> }> } }).axe.run(root, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    });
    return result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  }, selector);
  return violations.map((violation) => ({ label, ...violation }));
}

async function axeWithin(page: Page, selector: string, label: string) {
  expect(await collectAxeViolations(page, selector, label), `${label} scoped axe violations`).toEqual([]);
}

async function saveDemoScreenshot(page: Page, selector: string, testInfo: { outputPath: (name: string) => string }, name: string) {
  const changed = await page.evaluate((targetSelector) => {
    const target = document.querySelector(targetSelector);
    const candidates = [
      document.querySelector("#nd-subnav"),
      ...Array.from(document.querySelectorAll("#nd-docs-layout > div")),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);
    const records: Array<{ marker: string; visibility: string; priority: string; hadMarker: boolean; previousMarker: string | null }> = [];
    for (const element of candidates) {
      if (target?.contains(element)) continue;
      const style = getComputedStyle(element);
      if (element.id !== "nd-subnav" && style.position !== "sticky" && style.position !== "fixed") continue;
      const marker = `capture-${Date.now()}-${records.length}`;
      records.push({
        marker,
        visibility: element.style.getPropertyValue("visibility"),
        priority: element.style.getPropertyPriority("visibility"),
        hadMarker: element.hasAttribute("data-yunui-capture-overlay"),
        previousMarker: element.getAttribute("data-yunui-capture-overlay"),
      });
      element.setAttribute("data-yunui-capture-overlay", marker);
      // Hide documentation chrome only; visibility preserves its layout space.
      element.style.setProperty("visibility", "hidden", "important");
    }
    return records;
  }, selector);
  try {
    await page.locator(selector).screenshot({ path: testInfo.outputPath(name), animations: "disabled" });
  } finally {
    await page.evaluate((records) => {
      for (const record of records) {
        const element = document.querySelector<HTMLElement>(`[data-yunui-capture-overlay="${record.marker}"]`);
        if (!element) continue;
        if (record.visibility) element.style.setProperty("visibility", record.visibility, record.priority);
        else element.style.removeProperty("visibility");
        if (record.hadMarker) element.setAttribute("data-yunui-capture-overlay", record.previousMarker ?? "");
        else element.removeAttribute("data-yunui-capture-overlay");
      }
    }, changed);
  }
}

for (const theme of themes) {
  for (const width of widths) {
    for (const state of agentStates) {
      test(`Agent Chat ${state} · ${theme} · ${width}px`, async ({ page }, testInfo) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await openRoute(page, "/docs/chat", theme, width, 980);
        const demo = page.getByTestId("chat-demo-root");
        await expect(demo).toBeVisible();
        await setAgentState(page, state);
        if (state === "Approval") {
          await expect(demo.getByRole("button", { name: "Allow", exact: true })).toBeEnabled();
          await expect(demo.getByRole("button", { name: "Deny", exact: true })).toBeEnabled();
          await expect(demo.getByTestId("chat-demo-question")).toBeVisible();
        }
        if (state === "Working") await expect(demo.getByRole("button", { name: "Stop" })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `agent-chat-${state.toLowerCase()}-${theme}-${width}-${testInfo.project.name}.png`);
        expect(errors).toEqual([]);
      });
    }
  }
}

test.describe("Agent Chat host-controlled interactions", () => {
  test("source caret completion preserves a suffix, command semantics stay with the host, and model/source state uses stable ids", async ({ page }, testInfo) => {
    await openRoute(page, "/docs/chat", "light", 1440, 1000);
    const demo = page.getByTestId("chat-demo-root");
    const prompt = demo.getByRole("textbox", { name: "Message prompt" });

    const sourceText = "Use @Web after this sentence";
    await prompt.fill(sourceText);
    await expect(prompt).toHaveValue(sourceText);
    const sourceCaret = sourceText.indexOf("@Web") + "@Web".length;
    const sourceSuffix = sourceText.slice(sourceCaret);
    await prompt.focus();
    for (let count = 0; count < sourceSuffix.length; count += 1) await prompt.press("ArrowLeft");
    await expect.poll(() => prompt.evaluate((element: HTMLTextAreaElement) => element.selectionStart)).toBe(sourceCaret);
    await expect(demo.getByRole("listbox", { name: "Sources" })).toBeVisible();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `source-menu-${testInfo.project.name}.png`);
    expect(await prompt.getAttribute("role")).not.toBe("combobox");
    await prompt.press("ArrowDown");
    const sourceOption = demo.getByRole("option", { name: "Web search" });
    await expect(prompt).toHaveAttribute("aria-controls", await sourceOption.evaluate((element) => element.closest('[role="listbox"]')?.id ?? ""));
    await expect(prompt).toHaveAttribute("aria-activedescendant", await sourceOption.getAttribute("id") ?? "");
    await prompt.press("Enter");
    await expect(prompt).toHaveValue("Use @Web search after this sentence");
    await expect(demo.getByRole("button", { name: "Remove Web search" })).toBeVisible();

    const commandText = "Please /review later";
    await prompt.fill(commandText);
    const commandSuffix = commandText.slice(commandText.indexOf("/review") + "/review".length);
    for (let count = 0; count < commandSuffix.length; count += 1) await prompt.press("ArrowLeft");
    await expect(demo.getByRole("listbox", { name: "Commands" })).toBeVisible();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `command-menu-${testInfo.project.name}.png`);
    await prompt.press("ArrowDown");
    await prompt.press("Enter");
    await expect(prompt).toHaveValue(commandText); // callback-only command must not invent prompt text
    await expect(demo.getByTestId("chat-demo-host-event")).toContainText("Host command callback received: review.");

    await demo.getByRole("button", { name: "Select a model" }).click();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `model-menu-${testInfo.project.name}.png`);
    await demo.getByRole("option", { name: "Fast model" }).click();
    await expect(demo.getByTestId("chat-demo-host-event")).toContainText("Host selected model id: host-fast.");
    await expect(demo.locator("[data-model-trigger]")).toContainText("Fast model");
  });

  test("IME Enter is preserved, normal Enter sends locally, and stop only calls the host callback", async ({ page }) => {
    await openRoute(page, "/docs/chat", "light", 768, 920);
    const demo = page.getByTestId("chat-demo-root");
    const prompt = demo.getByRole("textbox", { name: "Message prompt" });
    const chatMessageCount = await demo.locator('[data-yunui="chat-message"]').count();
    await prompt.fill("中文輸入稿");
    const initialNotice = await demo.getByTestId("chat-demo-host-event").innerText();
    for (const isComposing of [true, false]) {
      await prompt.evaluate((element, composing) => element.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Enter", code: "Enter", keyCode: 229, which: 229, isComposing: composing, bubbles: true,
      })), isComposing);
      await expect(prompt).toHaveValue("中文輸入稿");
      await expect(demo.getByTestId("chat-demo-host-event")).toHaveText(initialNotice);
      await expect(demo.locator('[data-yunui="chat-message"]')).toHaveCount(chatMessageCount);
    }
    await prompt.press("Enter");
    await expect(prompt).toHaveValue("");
    await expect(demo.locator('[data-yunui="chat-message"]')).toHaveCount(chatMessageCount + 1);
    await expect(demo.getByTestId("chat-demo-host-event")).toContainText("onSend received");

    await setAgentState(page, "Working");
    await demo.getByRole("button", { name: "Stop" }).click();
    await expect(statesFor(page).getByRole("button", { name: "Idle", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(demo.getByTestId("chat-demo-host-event")).toContainText("onStop callback received");
  });

  test("approval tool Allow/Reject callbacks stay host-controlled while the questionnaire supports Other and host submit", async ({ page }, testInfo) => {
    await openRoute(page, "/docs/chat", "light", 1440, 1000);
    const demo = page.getByTestId("chat-demo-root");
    await setAgentState(page, "Approval");
    const hostEvent = demo.getByTestId("chat-demo-host-event");
    const allow = demo.getByRole("button", { name: "Allow", exact: true });
    const deny = demo.getByRole("button", { name: "Deny", exact: true });
    await expect(allow).toBeEnabled();
    await expect(deny).toBeEnabled();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `approval-callbacks-${testInfo.project.name}.png`);
    await allow.click();
    await expect(hostEvent).toContainText("Approval callback received for approval-command");
    await expect(statesFor(page).getByRole("button", { name: "Done", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase", "completed");
    await expect(demo.locator('[data-yunui="agent-approval-row"]')).toContainText("Allowed");
    await expect(demo.locator('[data-yunui="agent-tool-row"]').filter({ hasText: "pnpm test" })).toBeVisible();
    await setAgentState(page, "Approval");
    await demo.getByRole("button", { name: "Deny", exact: true }).click();
    await expect(hostEvent).toContainText("Rejection callback received for approval-command");
    await expect(statesFor(page).getByRole("button", { name: "Error", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase", "cancelled");
    await expect(demo.locator('[data-yunui="agent-approval-row"]')).toContainText("Rejected");
    await expect(demo.locator('[data-yunui="agent-tool-row"]').filter({ hasText: "pnpm test" })).toHaveCount(0);
    await setAgentState(page, "Error");
    await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase", "failed");
    await expect(demo.locator('[data-yunui="agent-task-row"]').filter({ hasText: "Typecheck failed" })).toBeVisible();
    await expect(demo.locator('[data-yunui="agent-tool-row"]').filter({ hasText: "pnpm test" })).toBeVisible();
    await setAgentState(page, "Approval");

    let question = demo.getByTestId("chat-demo-question");
    await question.getByRole("button", { name: "Dismiss questions" }).click();
    await expect(demo.getByTestId("chat-demo-question")).toHaveCount(0);
    await expect(hostEvent).toContainText("Question dismissed; the tool decision is still pending.");
    await expect(demo.getByRole("button", { name: "Allow", exact: true })).toBeEnabled();
    await expect(demo.getByRole("button", { name: "Restore questions" })).toBeVisible();
    await demo.getByRole("button", { name: "Restore questions" }).click();
    question = demo.getByTestId("chat-demo-question");
    await expect(question).toBeVisible();
    await question.getByRole("checkbox", { name: "Another source" }).click();
    const other = question.getByRole("textbox", { name: "Name the source" });
    await other.fill("API reference");
    await question.getByRole("button", { name: "Next" }).click();
    await expect(question.getByRole("heading", { name: "How should I format the summary?" })).toBeVisible();
    await question.getByRole("radio", { name: "Short summary" }).click();
    await question.getByRole("button", { name: "Back" }).click();
    await expect(question.getByRole("textbox", { name: "Name the source" })).toHaveValue("API reference");
    await question.getByRole("button", { name: "Next" }).click();
    await question.getByRole("radio", { name: "Short summary" }).click();
    await question.getByRole("button", { name: "Submit answers" }).click();
    await expect(hostEvent).toContainText("Host received");
    await expect(statesFor(page).getByRole("button", { name: "Approval", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(demo.locator('[data-yunui="agent-run-status"]')).toHaveAttribute("data-phase", "waiting");
    await expect(demo.getByRole("button", { name: "Allow", exact: true })).toBeEnabled();
  });

  test("ApprovalQuestion exposes busy/Other states and scoped axe is clean", async ({ page }, testInfo) => {
    await openRoute(page, "/docs/ai/approval-question", "light", 768, 1000);
    const demo = page.getByTestId("approval-question-demo");
    await demo.getByRole("button", { name: "Preview submitting state" }).click();
    const busy = demo.locator("section[aria-busy='true']");
    await expect(busy).toBeVisible();
    await expect(busy.getByRole("checkbox", { name: "Workspace docs" })).toBeDisabled();
    await expect(busy.getByRole("button", { name: "Next" })).toBeDisabled();
    await expect(busy.getByRole("button", { name: "Dismiss questions" })).toBeDisabled();
    await saveDemoScreenshot(page, '[data-testid="approval-question-demo"]', testInfo, `question-busy-${testInfo.project.name}.png`);
    await axeWithin(page, '[data-testid="approval-question-demo"]', "ApprovalQuestion busy state");
    await demo.getByRole("button", { name: "Exit submitting preview" }).click();
    await demo.getByRole("checkbox", { name: "Another source" }).click();
    const other = demo.getByRole("textbox", { name: "Name the source" });
    await expect(other).toBeVisible();
    await other.fill("API reference");
    await demo.getByRole("button", { name: "Dismiss questions" }).click();
    await expect(demo.getByRole("button", { name: "Restore questions" })).toBeVisible();
    await demo.getByRole("button", { name: "Restore questions" }).click();
    await expect(demo.getByRole("textbox", { name: "Name the source" })).toHaveValue("API reference");
    await saveDemoScreenshot(page, '[data-testid="approval-question-demo"]', testInfo, `question-other-${testInfo.project.name}.png`);
    await axeWithin(page, '[data-testid="approval-question-demo"]', "ApprovalQuestion Other state");
    await demo.getByRole("button", { name: "Next" }).click();
    await demo.getByRole("radio", { name: "Short summary" }).click();
    await demo.getByRole("button", { name: "Submit answers" }).click();
    await expect(demo.getByRole("status")).toContainText("answer(s) collected locally; no tool was approved.");
  });

  test("the ChatMessageList preserves scrollback when new local messages arrive", async ({ page }) => {
    await openRoute(page, "/docs/chat", "light", 1440, 820);
    const demo = page.getByTestId("chat-demo-root");
    const prompt = demo.getByRole("textbox", { name: "Message prompt" });
    const messages = demo.locator('[data-scroll-container="true"]');
    for (let index = 0; index < 14; index += 1) {
      await prompt.fill(`Scrollback fixture message ${index}`);
      await prompt.press("Enter");
    }
    const overflow = await messages.evaluate((element) => element.scrollHeight > element.clientHeight);
    expect(overflow).toBe(true);
    await messages.evaluate((element) => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll", { bubbles: true })); });
    await expect.poll(() => messages.evaluate((element) => element.scrollTop)).toBe(0);
    const pageScroll = await page.evaluate(() => window.scrollY);
    await prompt.fill("New message while reading history");
    await prompt.press("Enter");
    await expect(demo.getByText("New message while reading history", { exact: true })).toBeVisible();
    await expect.poll(() => messages.evaluate((element) => element.scrollTop)).toBe(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  });

  test("ChatDemo scoped axe is clean in all runtime states and composer menu states", async ({ page }, testInfo) => {
    await openRoute(page, "/docs/chat", "light", 1440, 1000);
    const demo = page.getByTestId("chat-demo-root");
    const allViolations: Awaited<ReturnType<typeof collectAxeViolations>> = [];
    for (const state of agentStates) {
      await setAgentState(page, state);
      allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', `ChatDemo ${state}`));
    }
    await setAgentState(page, "Idle");
    const prompt = demo.getByRole("textbox", { name: "Message prompt" });
    await prompt.fill("Search @zz");
    await expect(demo.getByText("No matching sources", { exact: true })).toBeVisible();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `empty-sources-${testInfo.project.name}.png`);
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "empty source menu"));
    await prompt.fill("Search /zz");
    await expect(demo.getByText("No matching commands", { exact: true })).toBeVisible();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `empty-commands-${testInfo.project.name}.png`);
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "empty command menu"));
    await prompt.fill("Find @");
    const sourceMenu = demo.getByRole("listbox", { name: "Sources" });
    await expect(sourceMenu.getByRole("option")).toHaveCount(3);
    await expect(sourceMenu.getByRole("option", { name: "Workspace docs" })).toBeVisible();
    await expect(sourceMenu.getByRole("option", { name: "Web search" })).toBeVisible();
    await expect(sourceMenu.getByRole("option", { name: "Shared drive" })).toBeDisabled();
    await sourceMenu.getByRole("option", { name: "Web search" }).hover();
    await expect(sourceMenu.getByRole("option", { name: "Web search" })).toHaveAttribute("data-active", "true");
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `populated-sources-hover-${testInfo.project.name}.png`);
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "populated source menu hover"));
    await prompt.fill("Run /");
    const commandMenu = demo.getByRole("listbox", { name: "Commands" });
    await expect(commandMenu.getByRole("option")).toHaveCount(2);
    await expect(commandMenu.getByRole("option", { name: "summarize" })).toBeVisible();
    await expect(commandMenu.getByRole("option", { name: "review" })).toBeVisible();
    await commandMenu.getByRole("option", { name: "review" }).hover();
    await expect(commandMenu.getByRole("option", { name: "review" })).toHaveAttribute("data-active", "true");
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `populated-commands-hover-${testInfo.project.name}.png`);
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "populated command menu hover"));
    await prompt.fill("Search @Shared");
    await expect(demo.getByRole("option", { name: "Shared drive" })).toBeDisabled();
    await saveDemoScreenshot(page, '[data-testid="chat-demo-root"]', testInfo, `disabled-source-${testInfo.project.name}.png`);
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "disabled source option"));
    await prompt.fill("");
    await demo.getByRole("button", { name: "Select a model" }).click();
    allViolations.push(...await collectAxeViolations(page, '[data-testid="chat-demo-root"]', "open model menu"));
    expect(allViolations, "all scoped ChatDemo axe states").toEqual([]);
  });
});
