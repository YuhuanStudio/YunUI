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
    // Chromium only, deliberately.
    //
    // WebKit was in here and could not hold a baseline: at a 40 px budget it
    // flaked on three or four of twelve tests per run, and it still flaked at
    // 900 px — its rendering of these shots is not reproducible run to run.
    // A gate that cries wolf gets ignored. WebKit keeps its coverage where it
    // IS deterministic and where it genuinely differs: the a11y sweeps.
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
