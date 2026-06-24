import { test, expect, type Page } from "@playwright/test";

// Helpers ------------------------------------------------------------------
const setBrand = (page: Page, brand = "violet") =>
  page.evaluate((b) => {
    const h = document.documentElement;
    h.setAttribute("data-accent-source", "brand");
    h.setAttribute("data-brand", b);
  }, brand);

const setDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.add("dark"));

// Showcase -----------------------------------------------------------------
test.describe("showcase", () => {
  test("top — light, default monochrome", async ({ page }) => {
    await page.goto("/showcase");
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot("showcase-top-light.png");
  });

  test("buttons — default monochrome", async ({ page }) => {
    await page.goto("/showcase");
    await page.locator("#buttons").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator("#buttons")).toHaveScreenshot("buttons-mono.png");
  });

  test("buttons — opt-in brand (violet)", async ({ page }) => {
    await page.goto("/showcase");
    await setBrand(page);
    await page.locator("#buttons").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator("#buttons")).toHaveScreenshot("buttons-brand.png");
  });

  test("buttons — brand in dark mode", async ({ page }) => {
    await page.goto("/showcase");
    await setDark(page);
    await setBrand(page);
    await page.locator("#buttons").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator("#buttons")).toHaveScreenshot("buttons-brand-dark.png");
  });

  test("forms — brand (slider/segmented re-themed)", async ({ page }) => {
    await page.goto("/showcase");
    await setBrand(page);
    await page.locator("#forms").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator("#forms")).toHaveScreenshot("forms-brand.png");
  });
});

// Docs ---------------------------------------------------------------------
test.describe("docs", () => {
  test("button page renders (live demos + props)", async ({ page }) => {
    await page.goto("/docs/components/button");
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot("docs-button.png");
  });
});
