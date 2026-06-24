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
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  // Animations (marquee, springs, blinking cursors) are non-deterministic — freeze
  // them, and allow a tiny anti-aliasing delta so baselines aren't flaky.
  expect: {
    toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 1000 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
