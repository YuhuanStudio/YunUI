import { chromium, webkit } from "@playwright/test";
import { mkdirSync } from "node:fs";

const ENGINES = { chromium, webkit };

const BASE = process.env.CAP_BASE || "http://localhost:3941";
const OUT =
  "/private/tmp/claude-501/-Users-yuhuan-Documents-YuhuanStudio-YunUI/86fdf057-a3a3-4c32-af66-88327ea5c2d7/scratchpad/shots";
mkdirSync(OUT, { recursive: true });

const targets = [
  { name: "showcase-content", url: "/showcase", anchor: "#content" },
  { name: "showcase-chat", url: "/showcase", anchor: "#chat" },
  { name: "docs-markdown", url: "/docs/content/markdown-renderer" },
  { name: "docs-callout", url: "/docs/content/callout-block" },
  { name: "docs-chat-message", url: "/docs/chat/chat-message" },
  { name: "docs-chat-composer", url: "/docs/chat/chat-composer" },
  { name: "docs-scroll-area", url: "/docs/components/scroll-area" },
];

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};

// Which combos to shoot (keep the set focused but cover devices + themes).
const plan = [
  ["desktop", "light"],
  ["desktop", "dark"],
  ["mobile", "light"],
];

// One engine per run (arg or env), so filenames carry the engine and Safari
// differences show up next to Chrome. Usage: node visual/capture.mjs webkit
const engineName = process.argv[2] || process.env.CAP_ENGINE || "chromium";
const browser = await ENGINES[engineName].launch();
let count = 0;

for (const [vp, theme] of plan) {
  const context = await browser.newContext({
    viewport: viewports[vp],
    deviceScaleFactor: 2,
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  // Pre-seed next-themes so it hydrates into the right theme.
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);

  const page = await context.newPage();

  for (const tgt of targets) {
    // mobile: only the two showcase sections + markdown (avoid combinatorial blowup)
    if (vp === "mobile" && !["showcase-content", "showcase-chat", "docs-markdown"].includes(tgt.name))
      continue;

    await page.goto(`${BASE}${tgt.url}`, { waitUntil: "load", timeout: 60000 });
    if (theme === "dark") {
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    }
    await page.waitForTimeout(900);

    const file = `${OUT}/${engineName}-${tgt.name}-${vp}-${theme}.png`;
    if (tgt.anchor) {
      const el = page.locator(tgt.anchor);
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
      await el.screenshot({ path: file }).catch(async () => {
        await page.screenshot({ path: file });
      });
    } else {
      await page.screenshot({ path: file, fullPage: true });
    }
    count++;
    console.log(`shot ${file}`);
  }
  await context.close();
}

await browser.close();
console.log(`\nDone: ${count} screenshots -> ${OUT}`);
