import fs from "node:fs";
import { fileURLToPath } from "node:url";

const THEMES = new Set(["light", "dark", "true-black"]);

export function loadAxe(fromUrl) {
  const url = fromUrl ?? new URL("../node_modules/axe-core/axe.min.js", import.meta.url);
  return fs.readFileSync(fileURLToPath(url), "utf8");
}

export function parseJsonList(raw, label, validateItem = () => {}) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty JSON array`);
  }
  value.forEach((item, index) => validateItem(item, index));
  return value;
}

export function validateAxeTarget(target, index) {
  const label = `target[${index}]`;
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    throw new Error(`${label} must be an object`);
  }
  if (typeof target.name !== "string" || !target.name.trim()) {
    throw new Error(`${label}.name must be a non-empty string`);
  }
  if (typeof target.url !== "string") throw new Error(`${label}.url must be a URL string`);
  let url;
  try { url = new URL(target.url); } catch { throw new Error(`${label}.url is invalid`); }
  if (!new Set(["http:", "https:"]).has(url.protocol)) throw new Error(`${label}.url must use HTTP or HTTPS`);
  if (target.vp !== undefined && (!Number.isInteger(target.vp) || target.vp < 320)) {
    throw new Error(`${label}.vp must be an integer of at least 320`);
  }
  if (target.cookies !== undefined && !Array.isArray(target.cookies)) {
    throw new Error(`${label}.cookies must be an array`);
  }
}

export function parsePaths(raw, defaults) {
  if (raw === undefined) return defaults;
  return parseJsonList(raw, "paths", (item, index) => {
    if (typeof item !== "string" || !item.startsWith("/") || item.startsWith("//")) {
      throw new Error(`paths[${index}] must be a same-origin path starting with /`);
    }
  });
}

export function collectPageErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  return errors;
}

export async function gotoChecked(page, url, options = {}, label = url) {
  let response;
  try {
    response = await page.goto(url, options);
  } catch (error) {
    throw new Error(`${label}: navigation failed: ${error.message}`);
  }
  if (!response) throw new Error(`${label}: navigation returned no HTTP response`);
  if (response.status() >= 400) {
    throw new Error(`${label}: HTTP ${response.status()} at ${response.url()}`);
  }
  return response;
}

export function assertExpectedPath(page, expectedPath, label) {
  const actual = new URL(page.url()).pathname;
  const expected = new URL(expectedPath, page.url()).pathname;
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, landed at ${actual}`);
}

export function assertNoPageErrors(errors, label) {
  if (errors.length) throw new Error(`${label}: browser pageerror(s):\n${errors.join("\n")}`);
}

export async function assertThemeApplied(page, theme, label = "page") {
  if (!THEMES.has(theme)) throw new Error(`unsupported theme: ${theme}`);
  const state = await page.evaluate(() => ({
    classes: document.documentElement.className.split(/\s+/).filter(Boolean),
    attr: document.documentElement.getAttribute("data-theme"),
  }));
  const themeClasses = state.classes.filter((value) => THEMES.has(value));
  const markers = [...themeClasses, ...(state.attr ? [state.attr] : [])];
  if (!markers.includes(theme) || markers.some((value) => value !== theme)) {
    throw new Error(`${label}: requested ${theme}, got class="${state.classes.join(" ")}" data-theme="${state.attr}"`);
  }
}

export function assertLocalBase(base) {
  const url = new URL(base);
  if (url.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error(`refusing non-local test base: ${url.origin}`);
  }
  return url.origin;
}

export async function runAxe(page, axeSource) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  }));
}

export async function inactiveAxeNodes(page, nodes) {
  return page.evaluate((targetsByNode) => targetsByNode.map((targets) => {
    const selectors = Array.isArray(targets) ? targets : [targets];
    const elements = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
    return elements.length > 0 && elements.every((element) =>
      Boolean(element.closest('[aria-disabled="true"], [inert]')) ||
      element.matches(':disabled') || Boolean(element.closest(':disabled'))
    );
  }), nodes.map((node) => node.target));
}

export async function walkTabFocus(page, maxTabs = 100) {
  const hits = [];
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");
    // Let opacity transitions (for example, a focus-visible transition) settle
    // before deciding that a reached item is effectively invisible.
    await page.waitForTimeout(80);
    const hit = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body || active === document.documentElement) return null;
      let opacity = 1;
      const activeVisibility = getComputedStyle(active).visibility;
      for (let el = active; el && el !== document.documentElement; el = el.parentElement) {
        const style = getComputedStyle(el);
        opacity *= Number(style.opacity);
        const hiddenDisplay = style.display === "none";
        const hiddenVisibility = activeVisibility === "hidden" || activeVisibility === "collapse";
        const pointerSuppressed = style.pointerEvents === "none" && Number(style.opacity) < 1;
        if (hiddenDisplay || hiddenVisibility || opacity <= 0.02 || pointerSuppressed) {
          return {
            label: (active.getAttribute("aria-label") || active.textContent || active.tagName).trim().slice(0, 40),
            region: String(el.className || el.tagName).slice(0, 60),
            reason: hiddenDisplay ? `display:${style.display}`
              : hiddenVisibility ? `visibility:${activeVisibility}`
              : opacity <= 0.02 ? `effective opacity:${opacity}` : `pointer-events:${style.pointerEvents};opacity:${style.opacity}`,
          };
        }
      }
      return null;
    });
    if (hit) hits.push(hit);
  }
  return hits;
}

export function exitOnError(error) {
  console.error(error?.stack ?? error);
  process.exitCode = 1;
}
