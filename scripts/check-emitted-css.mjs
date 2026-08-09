/**
 * Fail the build when a class the library writes emits NO CSS.
 *
 * This exists because the same bug kept arriving in different disguises, and
 * every time it looked fine in the source and produced nothing in the browser:
 *
 *   bg-error/10          an unregistered colour cannot take an alpha modifier
 *   animate-in           tailwindcss-animate is v3-only; dead under v4
 *   hover:bg-error-soft  `@layer components` classes cannot take a variant
 *   text-fd-muted-*      --color-fd-* lives in a scope, not in `@theme`
 *
 * Each one silently removed a hover state, an animation or a whole component's
 * styling in three apps at once. Reading the source can never catch them; the
 * only proof is the built stylesheet.
 *
 * Usage:  node scripts/check-emitted-css.mjs <built.css> [<built.css> …]
 *         (the site build writes to site/.next/static/chunks/*.css)
 */
import fs from "node:fs";
import path from "node:path";

const CSS_FILES = process.argv.slice(2);
if (!CSS_FILES.length) {
  console.error("usage: node scripts/check-emitted-css.mjs <built.css> [...]");
  process.exit(2);
}

/** Class names that intentionally emit nothing. */
const NO_OP = new Set([
  // Tailwind markers — they exist so *other* selectors can target them.
  "group", "peer", "dark", "true-black",
  // Fumadocs / Typography plugin ownership, not ours.
  "prose", "not-prose",
  // Hooks for JS or for CSS written elsewhere in a scoped block.
  "shiki-wrapper", "yunui-number",
  // Tailwind Typography plugin modifiers. None of the three apps installs that
  // plugin — fumadocs ships its own `.prose`, and its `--tw-prose-*` variables
  // already read from `--color-fd-foreground`, so they flip with the theme on
  // their own. These do nothing here and are kept only so a consumer that DOES
  // install Typography still gets the intended treatment.
  "prose-neutral", "dark:prose-invert", "prose-sm", "prose-fd",
]);

/** Escape a class the way Tailwind escapes it in a selector. */
const esc = (c) =>
  c.replace(/[.*+?^${}()|[\]\\/:%!#&,<=>@~'"]/g, (m) => "\\" + m);

function collectClasses(dir) {
  const found = new Map(); // class -> first file that used it
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        // `_deferred/` is deliberately not exported from any barrel, so its
        // classes never reach a build and cannot be checked against one.
        if (!/node_modules|__tests__|_deferred|\.next/.test(e.name)) walk(p);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(e.name) || /\.test\./.test(e.name)) continue;
      const src = fs.readFileSync(p, "utf8");
      // Only literal className strings. Template literals and conditionals are
      // skipped on purpose: a half-interpolated token is not a real class, and
      // guessing produces noise that makes the check ignorable.
      for (const m of src.matchAll(/className="([^"${}]*)"/g)) {
        for (const c of m[1].split(/\s+/)) {
          if (!c || NO_OP.has(c)) continue;
          // Skip anything with an unresolved fragment.
          if (/[${}`]/.test(c)) continue;
          if (!found.has(c)) found.set(c, path.relative(process.cwd(), p));
        }
      }
    }
  };
  walk(dir);
  return found;
}

const css = CSS_FILES.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const classes = collectClasses("src");
const missing = [];
for (const [c, file] of classes) {
  if (!css.includes("." + esc(c))) missing.push({ c, file });
}

/*
 * Second rule, because the first one cannot see this failure.
 *
 * `fd-*` utilities DO emit in YunUI's own docs site, which is built on
 * fumadocs — so checking against that stylesheet passes them. They emit nothing
 * in a consumer that has not installed fumadocs' theme, because `--color-fd-*`
 * is declared in a scoped block here, never as an `@theme` entry. That is how
 * LLMCopyButton, ViewOptions and the exported buttonVariants shipped completely
 * unstyled to two apps without anyone noticing.
 *
 * The library therefore must not reference `fd-*` at all.
 */
const fdUses = [];
for (const [c, file] of classes) {
  if (/(^|:)[a-z-]*-fd-/.test(c)) fdUses.push({ c, file });
}
if (fdUses.length) {
  console.error(`\n${fdUses.length} class(es) use the \`fd-*\` namespace, which emits nothing outside a fumadocs host:\n`);
  for (const { c, file } of fdUses.slice(0, 20)) console.error(`  ${c.padEnd(44)} ${file}`);
  console.error("\nUse YunUI's own registered colours instead (primary, accent, muted-foreground, …).");
}

console.log(`checked ${classes.size} literal classes from src/ against ${CSS_FILES.length} stylesheet(s)`);
if (!missing.length && !fdUses.length) {
  console.log("all emit CSS ✓  ·  no fd-* leakage ✓");
  process.exit(0);
}
if (!missing.length) process.exit(1);
console.error(`\n${missing.length} class(es) emit NO CSS:\n`);
for (const { c, file } of missing.slice(0, 40)) console.error(`  ${c.padEnd(44)} ${file}`);
if (missing.length > 40) console.error(`  … and ${missing.length - 40} more`);
console.error(`
Each of these is written in a className but produces no rule in the built
stylesheet, so it does nothing in the browser. Usual causes: an unregistered
colour with an alpha modifier (bg-error/10), a variant on a class declared in
@layer components (hover:bg-error-soft), or a utility from a Tailwind v3 plugin.
If a class is deliberately a marker, add it to NO_OP in this script.`);
process.exit(1);
