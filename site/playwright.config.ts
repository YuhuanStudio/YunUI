import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression for the YunUI site (showcase + docs).
 *
 *   pnpm test:visual           # compare against committed baselines
 *   pnpm test:visual:update    # re-record baselines (review the diff before committing!)
 *
 * Baselines live in visual/__snapshots__. The webServer builds + starts the site;
 * locally an already-running server on PORT is reused (set one up to skip the build).
 */
const PORT = Number(process.env.VISUAL_PORT ?? 3941);

export default defineConfig({
  testDir: "./visual",
  snapshotDir: "./visual/__snapshots__",
  fullyParallel: true,
  workers: 3,
  timeout: 45_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  // Animations (marquee, springs, blinking cursors) are non-deterministic — freeze
  // them, and allow a tiny anti-aliasing delta so baselines aren't flaky.
  expect: {
    // An ABSOLUTE budget, not a ratio. `maxDiffPixelRatio: 0.01` sounds strict
    // but these are whole-section shots — one is 1152x3014, so 1% is ~35,000
    // pixels. Measured: rounding ShinyButton's corners from `rounded-xl` to
    // `rounded-none` changes ~124 px and sailed clean through that ratio, and
    // through a 150 px budget too. 40 px absorbs font antialiasing and still
    // catches one button changing shape.
    toHaveScreenshot: { animations: "disabled", maxDiffPixels: 40 },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 1000 },
  },
  projects: [
    // Pixel baselines are Chromium-only; WebKit runs behavioral contracts and
    // captures because its exact pixel output was not reproducible across runs.
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Deterministic content/keyboard/theme contracts, without pixel baselines.
    { name: "webkit", testMatch: "**/content.spec.ts", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI || process.env.PLAYWRIGHT_REUSE_SERVER === "1",
    timeout: 240_000,
  },
});
