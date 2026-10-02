import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const axe = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");

for (const theme of ["light", "dark"]) {
  for (const width of [390, 768, 1440]) {
    test(`model picker pin semantics and focus ${theme} ${width}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      expect((await page.goto("/docs/ai/model-select"))?.status()).toBe(200);
      const trigger = page.getByRole("button", { name: /Claude Opus 4\.8/ }).first();
      await trigger.click();
      const panel = page.locator('[data-yunui="model-select-panel"]');
      await expect(panel.getByRole("combobox")).toBeFocused();
      const pin = panel.getByRole("button", { name: "Pin", exact: true }).first();
      expect(await pin.evaluate(element => element.closest('[role="option"]') === null)).toBe(true);
      await pin.focus();
      await pin.press("Enter");
      // Find the focused replacement without relying on provider/group order.
      await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe("Unpin");
      // The provider icon deliberately falls back to its initial when its optional
      // asset is unavailable, so assert the selected model label itself.
      await expect(trigger.locator(":scope > span.flex-1.truncate")).toHaveText("Claude Opus 4.8");
      await expect(panel).toHaveCSS("opacity", "1");
      await page.addScriptTag({ content: axe });
      const violations = await panel.evaluate(async element => {
        const result = await (window as unknown as { axe: { run: (node: Element, options: unknown) => Promise<{ violations: { id: string; nodes: { target: string[]; failureSummary?: string }[] }[] }> } }).axe.run(element, {});
        return result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
      });
      expect(violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`model-picker-${theme}-${width}.png`), animations: "disabled" });
      await page.keyboard.press("Escape");
      await expect(panel).not.toBeVisible();
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });
  }
}
