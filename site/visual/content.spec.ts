import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownRenderer } from "yunui/content";

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

const CONTENT_IMAGE_ORIGINAL = "https://picsum.photos/seed/yunui/640/360";
const CONTENT_IMAGE_REPLACEMENT = "https://picsum.photos/seed/yunui-replacement/640/360";
const imageSvg = (label: string, color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${color}"/><text x="32" y="190" font-size="32" fill="white">${label}</text></svg>`;

async function installContentImageFixtures(page: import("@playwright/test").Page) {
  await page.route("https://picsum.photos/**", route => route.fulfill({
    status: 200,
    contentType: "image/svg+xml",
    body: imageSvg(new URL(route.request().url()).pathname.split("/")[3] ?? "photo", "#6243c6"),
  }));
  await page.route("**/__yunui_content_image_fixture__/**", route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/404.svg")) {
      return route.fulfill({ status: 404, contentType: "image/svg+xml", body: "<svg/>" });
    }
    const label = url.pathname.split("/").at(-1) ?? "fixture";
    return route.fulfill({ status: 200, contentType: "image/svg+xml", body: imageSvg(label, "#267a64") });
  });
}

async function expectContentImageAxeClean(page: import("@playwright/test").Page) {
  if (!await page.evaluate(() => Boolean((window as any).axe))) {
    await page.addScriptTag({ content: axe });
  }
  const violations = await page.evaluate(async () => {
    const scopes = [
      document.querySelector('[data-testid="content-image-demo"]'),
      document.querySelector('[role="dialog"]'),
    ].filter(Boolean);
    return (await (window as any).axe.run(scopes, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    })).violations.map((violation: any) => ({
      id: violation.id,
      nodes: violation.nodes.map((node: any) => node.target),
    }));
  });
  expect(violations).toEqual([]);
}

for (const theme of ["light", "dark", "true-black"]) {
  for (const width of [390, 768, 1440]) {
    test(`content image flow ${theme} ${width}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      await installContentImageFixtures(page);
      const response = await page.goto("/docs/content/content-image");
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^| )${theme}( |$)`));

      const demo = page.getByTestId("content-image-demo");
      await demo.scrollIntoViewIfNeeded();
      const image = demo.locator('img[alt="A random placeholder photo"]');
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute("src", CONTENT_IMAGE_ORIGINAL);
      const initialSource = await image.getAttribute("src");
      await demo.screenshot({ path: testInfo.outputPath("content-image.png") });
      await expectContentImageAxeClean(page);

      // The demo control changes only srcSet. The src attribute must remain the same.
      await demo.getByRole("button", { name: "Switch srcSet only" }).click();
      await expect(image).toHaveAttribute("src", initialSource!);
      await expect(image).toHaveAttribute("srcset", /yunui-srcset\/640\/360 1x/);
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).currentSrc)).toMatch(/yunui-srcset\/(?:640\/360|1280\/720)/);
      await demo.screenshot({ path: testInfo.outputPath("content-image-srcset.png") });

      // A 404 must reach the visible fallback; switching src afterwards must retry successfully.
      await demo.getByRole("button", { name: "Fail image load" }).click();
      await expect(demo.getByText(/Image failed to load/i)).toBeVisible();
      await expect(image).toHaveClass(/hidden/);
      await expectContentImageAxeClean(page);
      await demo.screenshot({ path: testInfo.outputPath("content-image-failed.png") });
      await demo.getByRole("button", { name: "Load replacement image" }).click();
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute("src", CONTENT_IMAGE_REPLACEMENT);
      await expect(image).toHaveAttribute("role", "button");
      await expect(image).toHaveAttribute("tabindex", "0");

      const srcSetButton = demo.getByRole("button", { name: "Switch srcSet only" });
      await srcSetButton.focus();
      await page.keyboard.press("Tab");
      await expect(image).toBeFocused();
      await page.screenshot({ path: testInfo.outputPath("content-image-focused.png") });
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: /Image preview/ });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
      await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
      await expectContentImageAxeClean(page);
      await page.screenshot({ path: testInfo.outputPath("content-image-lightbox.png") });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(image).toBeFocused();
      await expectContentImageAxeClean(page);

      // Repeated keyboard activation and the dialog close button must both restore focus.
      await page.keyboard.press("Space");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: /Close/ }).click();
      await expect(dialog).toHaveCount(0);
      await expect(image).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}

test("content image loads when IntersectionObserver is unavailable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 600 });
  await installContentImageFixtures(page);
  // Isolate the public component: removing the browser API from the docs page
  // also breaks fumadocs' own ScrollSpy, which is outside ContentImage's contract.
  const require = createRequire(import.meta.url);
  const { build } = createRequire(require.resolve("tsup"))("esbuild");
  const library = fileURLToPath(new URL("../../dist/content.js", import.meta.url));
  const { outputFiles } = await build({
    stdin: {
      contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {ContentImage} from ${JSON.stringify(library)}; createRoot(document.getElementById('root')).render(React.createElement(ContentImage, {src: ${JSON.stringify(CONTENT_IMAGE_REPLACEMENT)}, alt: 'No observer fixture', enableLightbox: false}));`,
      resolveDir: fileURLToPath(new URL("../", import.meta.url)),
    },
    bundle: true, write: false, format: "iife", platform: "browser",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  // KaTeX includes literal Unicode subscript/superscript characters in regexes.
  // Explicit UTF-8 avoids WebKit decoding this routed script as legacy encoding.
  await page.route("**/__yunui_no_observer_fixture__.js", route => route.fulfill({ contentType: "application/javascript; charset=utf-8", body: outputFiles[0].text }));
  await page.route("**/__yunui_no_observer_fixture__", route => route.fulfill({ contentType: "text/html; charset=utf-8", body: '<!doctype html><meta charset="utf-8"><div id="root" style="margin-top:2000px"></div><script src="/__yunui_no_observer_fixture__.js"></script>' }));
  await page.addInitScript(() => Object.defineProperty(window, "IntersectionObserver", { configurable: true, value: undefined }));
  const response = await page.goto("/__yunui_no_observer_fixture__");
  expect(response?.status()).toBe(200);
  const image = page.locator('img[alt="No observer fixture"]');
  const top = await page.locator("#root").evaluate(element => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThan(600);
  expect(await page.evaluate(() => typeof IntersectionObserver)).toBe("undefined");
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(image).toHaveAttribute("src", CONTENT_IMAGE_REPLACEMENT);
  expect(errors).toEqual([]);
});

test("CodeBlock disclosure preserves real ChatMessageList and window scroll positions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  const response = await page.goto("/docs/chat");
  expect(response?.status()).toBe(200);

  const demo = page.getByTestId("chat-demo-root");
  const states = demo.getByRole("group", { name: "Agent state fixture" });
  await states.getByRole("button", { name: "Working", exact: true }).click();
  await expect(states.getByRole("button", { name: "Working", exact: true })).toHaveAttribute("aria-pressed", "true");
  await states.getByRole("button", { name: "Idle", exact: true }).click();
  await expect(states.getByRole("button", { name: "Idle", exact: true })).toHaveAttribute("aria-pressed", "true");
  await states.getByRole("button", { name: "Done", exact: true }).click();
  await expect(states.getByRole("button", { name: "Done", exact: true })).toHaveAttribute("aria-pressed", "true");

  const messageList = demo.locator('[data-scroll-container="true"]');
  const longBlockRoot = demo.getByText("all-routes.ts", { exact: true }).locator("xpath=../..");
  const longBlock = longBlockRoot.getByRole("button", { name: "Show all 80 lines" });
  await longBlock.scrollIntoViewIfNeeded();
  await expect.poll(() => messageList.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  const initial = await page.evaluate(() => window.scrollY);
  const collapsedTop = await messageList.evaluate(element => element.scrollTop);
  await longBlock.click();
  const disclosure = longBlockRoot.locator("button[aria-expanded]");
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => longBlockRoot.locator(".shiki-wrapper .line").count()).toBe(80);
  await expect.poll(() => messageList.evaluate(element => element.scrollTop)).toBe(collapsedTop);
  expect(await page.evaluate(() => window.scrollY)).toBe(initial);

  const showLess = longBlockRoot.getByRole("button", { name: "Show less" });
  await showLess.scrollIntoViewIfNeeded();
  const expandedTop = await messageList.evaluate(element => element.scrollTop);
  await showLess.click();
  await expect(longBlockRoot.locator("button[aria-expanded]")).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => longBlockRoot.locator(".shiki-wrapper .line").count()).toBe(8);
  await expect.poll(async () => messageList.evaluate(element => ({
    top: element.scrollTop,
    maxTop: Math.max(0, element.scrollHeight - element.clientHeight),
  })).then(position => position.top === Math.min(expandedTop, position.maxTop))).toBe(true);
  const collapsedScroll = await messageList.evaluate(element => ({
    top: element.scrollTop,
    maxTop: Math.max(0, element.scrollHeight - element.clientHeight),
  }));
  expect(collapsedScroll.top).toBe(Math.min(expandedTop, collapsedScroll.maxTop));
  expect(await page.evaluate(() => window.scrollY)).toBe(initial);
  expect(errors).toEqual([]);
});

test("narrow ChatMessage CodeBlock keeps its filename visible and wraps header controls", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  const response = await page.goto("/docs/chat");
  expect(response?.status()).toBe(200);

  const demo = page.getByTestId("chat-demo-root");
  const states = demo.getByRole("group", { name: "Agent state fixture" });
  await states.getByRole("button", { name: "Working", exact: true }).click();
  await expect(states.getByRole("button", { name: "Working", exact: true })).toHaveAttribute("aria-pressed", "true");
  await states.getByRole("button", { name: "Idle", exact: true }).click();
  await expect(states.getByRole("button", { name: "Idle", exact: true })).toHaveAttribute("aria-pressed", "true");
  await states.getByRole("button", { name: "Done", exact: true }).click();
  await expect(states.getByRole("button", { name: "Done", exact: true })).toHaveAttribute("aria-pressed", "true");

  const filename = demo.getByText("route-checks.ts", { exact: true });
  const codeBlock = filename.locator("xpath=../..");
  await expect(filename).toBeVisible();
  const header = codeBlock.locator(":scope > div").first();
  const labelMetrics = await filename.evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(labelMetrics.clientWidth).toBeGreaterThanOrEqual(128);
  expect(labelMetrics.scrollWidth).toBeLessThanOrEqual(labelMetrics.clientWidth);

  const headerBox = await header.boundingBox();
  expect(headerBox).not.toBeNull();
  const controls = await header.getByRole("button").all();
  expect(controls).toHaveLength(2);
  for (const control of controls) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(headerBox!.x);
    expect(box!.x + box!.width).toBeLessThanOrEqual(headerBox!.x + headerBox!.width);
  }
  await codeBlock.screenshot({ path: testInfo.outputPath("chat-codeblock-filename-390-light.png"), animations: "disabled" });
  expect(errors).toEqual([]);
});

test("MarkdownRenderer removes hostile raw HTML and unsafe links before browser render", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url()));
  await page.goto("about:blank");
  await page.evaluate(() => {
    (window as any).__yunuiIframeProbe = false;
    (window as any).__yunuiHandlerProbe = false;
    (window as any).__yunuiLinkProbe = false;
  });
  const hostile = [
    '<iframe srcdoc="&lt;script&gt;window.parent.__yunuiIframeProbe = true&lt;/script&gt;"></iframe>',
    '<img src="/__yunui_content_image_fixture__/missing.svg" onerror="window.__yunuiHandlerProbe = true">',
    '<a href="javascript:window.__yunuiLinkProbe=true">unsafe scheme</a>',
    '<a href="java&#x73;cript:window.__yunuiLinkProbe=true">obfuscated unsafe scheme</a>',
  ].join("\n\n");
  const markup = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: hostile }));
  await page.route("**/*", route => route.abort());
  await page.setContent(markup, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(150);
  await expect(page.locator("iframe, script")).toHaveCount(0);
  await expect(page.locator("[onerror], [onclick], [onload]")).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:" i]')).toHaveCount(0);
  expect(await page.evaluate(() => [
    (window as any).__yunuiIframeProbe,
    (window as any).__yunuiHandlerProbe,
    (window as any).__yunuiLinkProbe,
  ])).toEqual([false, false, false]);
  expect(requests).toEqual([]);
});
