import { test, expect } from "@playwright/test";
import axe from "axe-core";

for (const theme of ["light", "dark"] as const) for (const width of [390, 768, 1440]) {
  test(`public conversation units ${theme} ${width}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.addInitScript(value => localStorage.setItem("theme", value), theme);
    expect((await page.goto("/docs/chat"))?.status()).toBe(200);
    const controls = page.getByRole("group", { name: "Agent state fixture" });
    await controls.getByRole("button", { name: "Working", exact: true }).click();
    await expect(controls.getByRole("button", { name: "Working", exact: true })).toHaveAttribute("aria-pressed", "true");
    await controls.getByRole("button", { name: "Done", exact: true }).click();
    const units = page.getByTestId("conversation-units-demo");
    await expect(units).toBeVisible();
    const answer = units.locator('[data-yunui="streaming-text"]');
    await expect(answer).toHaveAttribute("data-state", "complete");
    await answer.getByRole("button", { name: "2 sources", exact: true }).click();
    await expect(answer.getByRole("link", { name: /Release guide/ }).last()).toBeVisible();
    await answer.getByRole("button", { name: /Show the integration guide/ }).click();
    await expect(page.getByTestId("chat-demo-host-event")).toContainText("Host follow-up requested: Show the integration guide.");
    const context = units.locator('[data-yunui="context-cards"]');
    await context.getByRole("button", { name: "Include Release guide.md", exact: true }).click();
    await expect(context.getByRole("button", { name: "Exclude Release guide.md", exact: true })).toHaveAttribute("aria-pressed", "true");
    const selection = units.locator('[data-yunui="selection-actions"]');
    await expect(selection).toHaveAttribute("data-selection-state", "idle");
    await selection.getByRole("button", { name: "Explain", exact: true }).click();
    await expect(page.getByTestId("chat-demo-host-event")).toContainText("Host edit requested: Explain.");
    await expect(selection).toHaveAttribute("data-selection-state", "busy");
    const diff = units.locator('[data-yunui="diff-table"]');
    await expect(diff).toHaveAttribute("data-diff-state", "idle");
    await diff.getByRole("button", { name: /Apply 2/ }).click();
    await expect(page.getByTestId("chat-demo-host-event")).toContainText("No changes have been persisted.");
    await expect(diff).toHaveAttribute("data-diff-state", "busy");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.addScriptTag({ content: axe.source });
    const violations = await units.evaluate(async element => {
      const result = await (window as unknown as { axe: { run: (element: Element) => Promise<{ violations: unknown[] }> } }).axe.run(element);
      return result.violations;
    });
    expect(violations).toEqual([]);
    await units.screenshot({ path: info.outputPath(`conversation-${theme}-${width}.png`), animations: "disabled" });
    expect(errors).toEqual([]);
  });
}

test("the four conversation-unit docs routes render their public demos", async ({ page }) => {
  const routes = [
    { path: "/docs/chat/streaming-text", demo: "streaming-text-demo", component: "streaming-text" },
    { path: "/docs/chat/context-cards", demo: "context-cards-demo", component: "context-cards" },
    { path: "/docs/ai/selection-actions", demo: "selection-actions-demo", component: "selection-actions" },
    { path: "/docs/ai/diff-table", demo: "diff-table-demo", component: "diff-table" },
  ] as const;

  for (const route of routes) {
    const routePage = await page.context().newPage();
    const errors: string[] = [];
    routePage.on("pageerror", error => errors.push(error.message));
    try {
      const response = await routePage.goto(route.path);
      expect(response?.status(), route.path).toBe(200);
      await expect(routePage.getByTestId(route.demo)).toBeVisible();
      await expect(routePage.locator(`[data-yunui="${route.component}"]`)).toBeVisible();
      expect(errors, route.path).toEqual([]);
    } finally {
      await routePage.close();
    }
  }
});

test("SelectionActions result/error axe is clean and expanded actions stay inside a narrow host", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  const response = await page.goto("/docs/ai/selection-actions");
  expect(response?.status()).toBe(200);

  const demo = page.getByTestId("selection-actions-demo");
  await demo.evaluate(element => {
    (element as HTMLElement).style.width = "270px";
    (element as HTMLElement).style.maxWidth = "270px";
  });
  await expect.poll(() => demo.evaluate(element => element.getBoundingClientRect().width)).toBe(270);
  const actions = demo.locator('[data-yunui="selection-actions"]');
  await page.addScriptTag({ content: axe.source });
  const axeViolations = () => actions.evaluate(async element => {
    const result = await (window as unknown as { axe: { run: (element: Element) => Promise<{ violations: unknown[] }> } }).axe.run(element);
    return result.violations;
  });

  await demo.getByLabel("Host edit state").selectOption("result");
  await expect(actions.getByRole("button", { name: "Keep", exact: true })).toBeVisible();
  expect(await axeViolations()).toEqual([]);
  await demo.getByLabel("Host edit state").selectOption("error");
  await expect(actions.getByRole("status")).toContainText("The edit request failed");
  expect(await axeViolations()).toEqual([]);

  await demo.getByRole("button", { name: "Preview deletion", exact: true }).click();
  await expect(actions.getByRole("button", { name: "Keep", exact: true })).toBeVisible();
  expect(await axeViolations()).toEqual([]);
  await actions.getByRole("button", { name: "Keep", exact: true }).click();
  await expect.poll(() => demo.getByRole("status").last().evaluate(element => element.textContent)).toBe("Host accepted: ");

  await demo.getByLabel("Host edit state").selectOption("idle");
  const actionCallbacks = new Map([
    ["Explain", "Explain"],
    ["Improve", "Improve"],
    ["Shorten", "Shorten"],
    ["Tone", "Change tone"],
    ["Grammar", "Fix grammar"],
  ]);
  for (const [label, callback] of actionCallbacks) {
    await actions.getByRole("button", { name: "Show more actions" }).click();
    const action = actions.getByRole("button", { name: label, exact: true });
    await action.scrollIntoViewIfNeeded();
    await action.focus();
    await expect(action).toBeFocused();
    const geometry = await action.evaluate(button => {
      const rect = button.getBoundingClientRect();
      let bounds = { left: 0, right: window.innerWidth };
      for (let ancestor = button.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (!/^(auto|scroll|hidden|clip|overlay)$/.test(style.overflowX || style.overflow)) continue;
        const ancestorRect = ancestor.getBoundingClientRect();
        bounds = { left: Math.max(bounds.left, ancestorRect.left), right: Math.min(bounds.right, ancestorRect.right) };
      }
      return { left: rect.left, right: rect.right, bounds };
    });
    const center = (geometry.left + geometry.right) / 2;
    expect(center, `${label} remains reachable inside its clipping bounds after focus`).toBeGreaterThanOrEqual(geometry.bounds.left);
    expect(center, `${label} remains reachable inside its clipping bounds after focus`).toBeLessThanOrEqual(geometry.bounds.right);
    await page.keyboard.press("Enter");
    await expect(demo.getByRole("status").last()).toContainText(`Host request: ${callback}`);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
