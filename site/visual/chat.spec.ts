import { test, expect } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 768, 1440]) {
    test(`composer preserves IME draft ${theme} ${width}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      const response = await page.goto("/docs/chat/chat-composer");
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^| )${theme}( |$)`));
      const demo = page.getByTestId("chat-composer-demo");
      // Confirm a host state transition before typing. SSR markup is actionable
      // before React hydration, and WebKit fill can otherwise be reset by it.
      await demo.getByRole("button", { name: "Preview Stop state" }).click();
      await expect(demo.getByRole("button", { name: "Stop", exact: true })).toBeVisible();
      await demo.getByRole("button", { name: "Exit Stop preview" }).click();
      await expect(demo.getByRole("button", { name: "Send", exact: true })).toBeVisible();
      const input = demo.getByRole("textbox", { name: "Message prompt" });
      await input.fill("中文輸入");
      for (const isComposing of [true, false]) {
        await input.evaluate((element, composing) => element.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Enter", code: "Enter", keyCode: 229, which: 229, isComposing: composing, bubbles: true,
        })), isComposing);
        await expect(input).toHaveValue("中文輸入");
        await expect(demo.getByRole("status")).not.toContainText("onSend received: 中文輸入");
      }
      await input.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`composer-${theme}-${width}.png`), animations: "disabled" });
      await input.locator("..").locator("..").screenshot({ path: testInfo.outputPath(`composer-control-${theme}-${width}.png`), animations: "disabled" });
      await input.press("Shift+Enter");
      await expect(input).toHaveValue("中文輸入\n");
      await input.press("Enter");
      await expect(input).toHaveValue("");
      await expect(demo.getByRole("status")).toContainText("onSend received: 中文輸入");
      expect(errors).toEqual([]);
    });
  }
}

for (const theme of ["light", "dark"] as const) {
  test(`model menu adapts to a 270px host chat window ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.addInitScript(value => localStorage.setItem("theme", value), theme);
    const response = await page.goto("/docs/chat");
    expect(response?.status()).toBe(200);

    const demo = page.getByTestId("chat-demo-root");
    const chatWindow = demo.locator(":scope > div").nth(1);
    await chatWindow.evaluate(element => {
      (element as HTMLElement).style.width = "270px";
      (element as HTMLElement).style.maxWidth = "270px";
    });
    await expect.poll(() => chatWindow.evaluate(element => element.getBoundingClientRect().width)).toBe(270);

    const trigger = demo.getByRole("button", { name: "Select a model" });
    await trigger.click();
    const id = await trigger.getAttribute("aria-controls");
    expect(id).toBeTruthy();
    const menu = demo.locator(`#${id}`);
    await expect(menu).toBeVisible();
    const readGeometry = () => menu.evaluate(element => {
      const bounds = { left: 0, right: window.innerWidth };
      const clipsX = /^(auto|scroll|hidden|clip|overlay)$/;
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (!clipsX.test(style.overflowX || style.overflow)) continue;
        const rect = ancestor.getBoundingClientRect();
        bounds.left = Math.max(bounds.left, rect.left);
        bounds.right = Math.min(bounds.right, rect.right);
      }
      const rect = element.getBoundingClientRect();
      return { bounds, menu: { left: rect.left, right: rect.right, width: rect.width } };
    });
    await expect.poll(async () => {
      const geometry = await readGeometry();
      return geometry.menu.left >= geometry.bounds.left + 7
        && geometry.menu.right <= geometry.bounds.right - 7
        && geometry.menu.width <= 254;
    }, { timeout: 3_000 }).toBe(true);
    const geometry = await readGeometry();
    expect(geometry.menu.left).toBeGreaterThanOrEqual(geometry.bounds.left + 7);
    expect(geometry.menu.right).toBeLessThanOrEqual(geometry.bounds.right - 7);

    const first = menu.getByRole("option", { name: "Reasoning model" });
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowDown");
    const last = menu.getByRole("option", { name: "Fast model" });
    await expect(last).toBeFocused();
    await expect.poll(async () => {
      const option = await last.boundingBox();
      const popup = await menu.boundingBox();
      return !!option && !!popup && option.x >= popup.x && option.x + option.width <= popup.x + popup.width;
    }).toBe(true);
    await page.keyboard.press("Enter");
    await expect(demo.getByTestId("chat-demo-host-event")).toContainText("Host selected model id: host-fast.");
    await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 768, 1440]) {
    test(`model menu stays inside chat clipping bounds and keeps keyboard selection ${theme} ${width}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      const response = await page.goto("/docs/chat");
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`));

      const demo = page.getByTestId("chat-demo-root");
      const trigger = demo.getByRole("button", { name: "Select a model" });
      await trigger.click();
      const menuId = await trigger.getAttribute("aria-controls");
      expect(menuId).toBeTruthy();
      const menu = demo.locator(`#${menuId}`);
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("option", { name: "Reasoning model" })).toBeVisible();

      const readGeometry = () => menu.evaluate(element => {
        const bounds = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        const clipsX = /^(auto|scroll|hidden|clip|overlay)$/;
        const clipsY = /^(auto|scroll|hidden|clip|overlay)$/;
        for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          const rect = ancestor.getBoundingClientRect();
          if (clipsX.test(style.overflowX || style.overflow)) {
            bounds.left = Math.max(bounds.left, rect.left);
            bounds.right = Math.min(bounds.right, rect.right);
          }
          if (clipsY.test(style.overflowY || style.overflow)) {
            bounds.top = Math.max(bounds.top, rect.top);
            bounds.bottom = Math.min(bounds.bottom, rect.bottom);
          }
        }
        const rect = element.getBoundingClientRect();
        return { bounds, menu: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } };
      });
      // The hook measures the newly mounted panel after the open state commits.
      // Wait for its collision correction to settle, then require full containment.
      await expect.poll(async () => {
        const geometry = await readGeometry();
        return geometry.menu.left >= geometry.bounds.left + 7
          && geometry.menu.right <= geometry.bounds.right - 7
          && geometry.menu.top >= geometry.bounds.top + 7
          && geometry.menu.bottom <= geometry.bounds.bottom - 7;
      }, { timeout: 3_000 }).toBe(true);
      const geometry = await readGeometry();
      expect(geometry.menu.left).toBeGreaterThanOrEqual(geometry.bounds.left + 7);
      expect(geometry.menu.right).toBeLessThanOrEqual(geometry.bounds.right - 7);
      expect(geometry.menu.top).toBeGreaterThanOrEqual(geometry.bounds.top + 7);
      expect(geometry.menu.bottom).toBeLessThanOrEqual(geometry.bounds.bottom - 7);

      const first = menu.getByRole("option", { name: "Reasoning model" });
      await expect(first).toBeFocused();
      await page.keyboard.press("ArrowDown");
      const second = menu.getByRole("option", { name: "Fast model" });
      await expect(second).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(demo.getByTestId("chat-demo-host-event")).toContainText("Host selected model id: host-fast.");
      await expect(menu).toBeHidden();
      await expect(trigger).toContainText("Fast model");
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });
  }
}
