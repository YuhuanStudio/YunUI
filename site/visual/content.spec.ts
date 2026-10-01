import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const axe = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");

for (const theme of ["light", "dark", "true-black"]) {
  for (const width of [390, 768, 1440]) {
    test(`content ${theme} ${width}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      const response = await page.goto("/docs/content/markdown-renderer");
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^| )${theme}( |$)`));
      const preview = page.locator(".shiki-wrapper").first();
      await expect(preview.locator(`pre.github-${theme === "light" ? "light" : "dark"}-default .line span`).first()).toBeVisible();
      const diagram = page.locator(".mermaid-container").first();
      await expect(diagram.locator("svg")).toBeVisible();
      await preview.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath("content.png") });
      await diagram.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath("diagram.png") });
      await diagram.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Image preview" });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
      await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      await dialog.getByRole("button").last().focus();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button").first()).toBeFocused();
      await page.screenshot({ path: testInfo.outputPath("lightbox.png") });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(diagram).toBeFocused();
      await page.keyboard.press("Space");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.addScriptTag({ content: axe });
      const violations = await page.evaluate(async () => (await (window as any).axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      })).violations.map((v: any) => ({ id: v.id, nodes: v.nodes.map((n: any) => n.target) })));
      expect(violations).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

for (const theme of ["light", "dark", "true-black"]) {
  test(`highlighted code contrast ${theme}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(value => localStorage.setItem("theme", value), theme);
    const response = await page.goto("/docs/content/code-block");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveClass(new RegExp(`(^| )${theme}( |$)`));

    const preview = page.locator(".shiki-wrapper:has(.highlighted-line)").first();
    const highlightedLine = preview.locator(".highlighted-line");
    await expect(highlightedLine.first()).toBeVisible();
    await expect(highlightedLine.first().locator("span").first()).toBeVisible();
    await preview.scrollIntoViewIfNeeded();
    await preview.screenshot({ path: testInfo.outputPath("highlighted-code.png") });

    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await (window as any).axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    })).violations.map((v: any) => ({ id: v.id, nodes: v.nodes.map((n: any) => n.target) })));
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
