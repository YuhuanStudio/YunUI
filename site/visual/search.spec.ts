import { test, expect } from "@playwright/test";

const locales = [
  { value: "en", heading: "Navbar", body: "Use the existing YunUI navigation bar" },
  { value: "zh-CN", heading: "导航栏", body: "普通网站也能直接使用现有的 YunUI 导航栏" },
  { value: "zh-TW", heading: "導覽列", body: "一般網站也能直接使用現成的 YunUI 導覽列" },
] as const;
const themes = ["light", "dark"] as const;
const widths = [390, 768, 1440] as const;

for (const locale of locales) {
  for (const theme of themes) {
    for (const width of widths) {
      test(`Navbar docs ${locale.value} ${theme} ${width}px`, async ({ page }, testInfo) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.setViewportSize({ width, height: 1000 });
        await page.context().addCookies([
          { name: "NEXT_LOCALE", value: locale.value, url: testInfo.project.use.baseURL as string },
        ]);
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);

        const response = await page.goto("/docs/patterns/navbar");
        expect(response?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1, name: locale.heading })).toBeVisible();
        await expect(page.locator("body")).toContainText(locale.body);
        await expect(page.locator("html")).toHaveClass(new RegExp(`(^| )${theme}( |$)`));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(`navbar-${locale.value}-${theme}-${width}.png`),
          fullPage: true,
          animations: "disabled",
        });
        expect(errors).toEqual([]);
      });
    }
  }
}

test("docs search indexes localized titles and rejects unavailable vector mode", async ({ request }) => {
  const cases = [
    { query: "navbar", url: "/docs/patterns/navbar" },
    { query: "导航栏", url: "/docs/patterns/navbar" },
    { query: "導覽列", url: "/docs/patterns/navbar" },
    { query: "按钮", url: "/docs/components/button" },
    { query: "按鈕", url: "/docs/components/button" },
  ];

  for (const item of cases) {
    const response = await request.get("/api/search", { params: { query: item.query } });
    expect(response.status()).toBe(200);
    const results: Array<{ url?: string }> = await response.json();
    expect(results.some((result) => result.url === item.url), item.query).toBe(true);
  }

  const vectorResponse = await request.get("/api/search", {
    params: { query: "navbar", mode: "vector" },
  });
  expect(vectorResponse.status()).toBe(400);
  expect(await vectorResponse.json()).toEqual({
    error: "Vector search is not configured for this documentation source.",
  });

  const unknownModeResponse = await request.get("/api/search", {
    params: { query: "navbar", mode: "unknown" },
  });
  expect(unknownModeResponse.status()).toBe(200);
  const unknownModeResults: Array<{ url?: string }> = await unknownModeResponse.json();
  expect(unknownModeResults.some((result) => result.url === "/docs/patterns/navbar")).toBe(true);
});

test("localized search dialog opens the matching docs page", async ({ page }, testInfo) => {
  await page.context().addCookies([
    { name: "NEXT_LOCALE", value: "zh-TW", url: testInfo.project.use.baseURL as string },
  ]);
  await page.goto("/docs/patterns/navbar");
  await page.locator("button[data-search-full]").click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const input = dialog.getByPlaceholder("Search");
  await input.fill("導覽列");
  const selectedResult = dialog.locator('button[aria-selected="true"]');
  await expect(selectedResult).toContainText("Patterns");
  await expect(dialog).toContainText("導覽列");
  await input.press("Enter");

  await expect(page).toHaveURL(/\/docs\/patterns\/navbar$/);
  await expect(page.getByRole("heading", { level: 1, name: "導覽列" })).toBeVisible();
});
