// =====================================================================
// YunUI token generator
// ---------------------------------------------------------------------
// Emits styles/tokens.css — a 3-layer, runtime-switchable design-token
// system modelled on once-ui-system:
//
//   1. SCHEME (primitives)  --scheme-{palette}-{100..1200} + alpha
//        Raw palette values, theme-independent. Vendored verbatim from
//        once-ui (scripts/tokens/scheme.primitives.css) so the values are
//        authoritative, not hand-transcribed.
//   2. FUNCTION (role map)  --function-{role}-{step}
//        Indirection that points a ROLE (brand/accent/neutral/…) at a
//        chosen palette. Switchable at runtime via data-brand / data-accent
//        / data-neutral attributes on <html> — zero rebuild.
//   3. THEME (semantic)     --{role}-{family}-{intensity}
//        What components consume: background / on-background / border /
//        alpha / solid / on-solid, per role, remapped per light/dark.
//
// This file is ADDITIVE: it introduces a new --scheme/--function/--{role}
// namespace and does NOT touch YunUI's existing flat vars (--bg-base,
// --text-primary, --accent, …), so the current look is unchanged. Components
// migrate onto the semantic tokens incrementally.
//
// Regenerate:  node scripts/gen-tokens.mjs
// =====================================================================

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- model -----------------------------------------------------------

// All palettes shipped in the scheme layer (3 neutral + 16 chromatic).
const PALETTES = [
  "gray", "sand", "slate",
  "mint", "rose", "dusk", "red", "orange", "yellow", "moss", "green",
  "emerald", "aqua", "cyan", "blue", "indigo", "violet", "magenta", "pink",
];

const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
const ALPHAS = ["600-15", "600-30", "600-50"];

const ROLES = ["brand", "accent", "neutral", "info", "warning", "danger", "success"];

// Roles whose palette is user-selectable at runtime (via data-* attributes).
const DYNAMIC_ROLES = ["brand", "accent", "neutral"];

// Default palette per role. Fixed-status roles (info/warning/danger/success)
// are conventional and not exposed as data-* switches.
const ROLE_PALETTE = {
  brand: "blue",
  accent: "indigo",
  neutral: "gray",
  info: "gray",
  warning: "yellow",
  danger: "red",
  success: "green",
};

// Semantic intensity → function step, per theme. Mirrors once-ui theme.scss.
// "white"/"black" resolve to --static-*, "NNN-NN" to the function alpha var.
const SEMANTIC = {
  light: {
    "background-strong": 800, "background-medium": 1000, "background-weak": "white",
    "on-background-strong": 100, "on-background-medium": 400, "on-background-weak": 500,
    "border-strong": 800, "border-medium": 900, "border-weak": 1000,
    "alpha-strong": "600-50", "alpha-medium": "600-30", "alpha-weak": "600-15",
    "solid-strong": 600, "solid-medium": 500, "solid-weak": 400,
    "on-solid-strong": "white", "on-solid-weak": 1000,
  },
  dark: {
    "background-strong": 300, "background-medium": 200, "background-weak": 100,
    "on-background-strong": "white", "on-background-medium": 900, "on-background-weak": 700,
    "border-strong": 400, "border-medium": 300, "border-weak": 200,
    "alpha-strong": "600-50", "alpha-medium": "600-30", "alpha-weak": "600-15",
    "solid-strong": 500, "solid-medium": 400, "solid-weak": 300,
    "on-solid-strong": "white", "on-solid-weak": 900,
  },
};

// Surface / chrome tokens that differ per theme.
const CHROME = {
  light: {
    "page-background": "var(--neutral-background-weak)",
    "backdrop": "var(--static-white-medium)",
    "surface-background": "var(--neutral-background-weak)",
    "surface-border": "var(--neutral-border-medium)",
    "default-border": "var(--neutral-border-medium)",
  },
  dark: {
    "page-background": "var(--neutral-background-weak)",
    "backdrop": "var(--static-black-medium)",
    "surface-background": "var(--neutral-background-medium)",
    "surface-border": "var(--static-transparent)",
    "default-border": "var(--neutral-border-medium)",
  },
};

// ---- helpers ---------------------------------------------------------

const fnVar = (role, step) => `var(--function-${role}-${step})`;

function resolveSemantic(role, value) {
  if (value === "white") return "var(--static-white)";
  if (value === "black") return "var(--static-black)";
  return fnVar(role, value); // numeric step or alpha key ("600-50")
}

function functionMap(role, palette, indent = "  ") {
  const out = [];
  for (const s of STEPS) out.push(`${indent}--function-${role}-${s}: var(--scheme-${palette}-${s});`);
  out.push("");
  for (const a of ALPHAS) out.push(`${indent}--function-${role}-${a}: var(--scheme-${palette}-${a});`);
  return out.join("\n");
}

function semanticBlock(theme, indent = "  ") {
  const map = SEMANTIC[theme];
  const out = [];
  for (const role of ROLES) {
    out.push(`${indent}/* ${role} */`);
    for (const [family, val] of Object.entries(map)) {
      out.push(`${indent}--${role}-${family}: ${resolveSemantic(role, val)};`);
    }
    out.push("");
  }
  // chrome
  for (const [k, v] of Object.entries(CHROME[theme])) out.push(`${indent}--${k}: ${v};`);
  return out.join("\n");
}

// ---- assemble --------------------------------------------------------

const primitives = (await readFile(resolve(__dirname, "tokens/scheme.primitives.css"), "utf8")).trim();

const header = `/* =====================================================================
 * YunUI design tokens — GENERATED FILE, do not edit by hand.
 * Source: scripts/gen-tokens.mjs  (run: node scripts/gen-tokens.mjs)
 * Palette values vendored from once-ui-system/core (Apache-2.0).
 *
 * 3 layers: scheme (primitives) -> function (role map) -> theme (semantic).
 * Runtime theming via attributes on <html>:
 *   data-brand / data-accent / data-neutral = ${PALETTES.join(" | ")}
 *   data-theme = light | dark   (also honors .dark / .true-black classes)
 * Additive: does not modify YunUI's legacy flat vars; current look unchanged.
 * ===================================================================== */`;

// 1. SCHEME (primitives) — vendored verbatim.
const schemeSection = `/* ---------------------------------------------------------------------
 * Layer 1 — SCHEME (primitives): raw palette values, theme-independent.
 * ------------------------------------------------------------------- */
${primitives}`;

// 2. FUNCTION defaults + the data-* override matrix.
const functionDefaults = `/* ---------------------------------------------------------------------
 * Layer 2 — FUNCTION (role map): default palette per role.
 * Override a role's palette at runtime with data-{brand,accent,neutral}.
 * ------------------------------------------------------------------- */
:root {
${ROLES.map((role) => `  /* ${role} -> ${ROLE_PALETTE[role]} */\n${functionMap(role, ROLE_PALETTE[role])}`).join("\n\n")}
}`;

const dataMatrix = DYNAMIC_ROLES.map((role) =>
  PALETTES.map((palette) =>
    `[data-${role}="${palette}"] {\n${functionMap(role, palette)}\n}`
  ).join("\n\n")
).join("\n\n");

const matrixSection = `/* Runtime role -> palette switches (data-brand / data-accent / data-neutral) */
${dataMatrix}`;

// 3. THEME (semantic) — light is the default (:root), dark via class/attr.
const themeSection = `/* ---------------------------------------------------------------------
 * Layer 3 — THEME (semantic): what components consume. Light = default.
 * ------------------------------------------------------------------- */
:root,
[data-theme="light"] {
${semanticBlock("light")}
}

.dark,
[data-theme="dark"],
.true-black {
${semanticBlock("dark")}
}

/* true-black: OLED page surface */
.true-black {
  --page-background: var(--static-black);
}`;

// 4. Surface the semantic tokens as Tailwind color utilities (bg-/text-/border-).
//    `@theme inline` so each utility inlines `var(--{role}-{family})`, which
//    resolves live per theme / data-* attribute (runtime-themeable utilities).
const FAMILIES = [
  "background-strong", "background-medium", "background-weak",
  "on-background-strong", "on-background-medium", "on-background-weak",
  "border-strong", "border-medium", "border-weak",
  "alpha-strong", "alpha-medium", "alpha-weak",
  "solid-strong", "solid-medium", "solid-weak",
  "on-solid-strong", "on-solid-weak",
];

const utilityLines = ROLES.flatMap((role) =>
  FAMILIES.map((family) => `  --color-${role}-${family}: var(--${role}-${family});`)
);
// convenience aliases for page / surface chrome
utilityLines.push(
  "",
  "  --color-page: var(--page-background);",
  "  --color-surface: var(--surface-background);",
  "  --color-surface-border: var(--surface-border);",
);

const utilitiesSection = `/* ---------------------------------------------------------------------
 * Tailwind utilities — surfaces the semantic tokens as bg-/text-/border-
 * color utilities (e.g. bg-brand-solid-strong, text-accent-on-background-weak,
 * border-neutral-border-medium). \`inline\` keeps them runtime-themeable.
 * ------------------------------------------------------------------- */
@theme inline {
${utilityLines.join("\n")}
}`;

const out = [header, schemeSection, functionDefaults, matrixSection, themeSection, utilitiesSection].join("\n\n");

await writeFile(resolve(repoRoot, "styles/tokens.css"), out + "\n", "utf8");

const lines = out.split("\n").length;
console.log(`✓ wrote styles/tokens.css (${lines} lines)`);
console.log(`  palettes: ${PALETTES.length}, roles: ${ROLES.length}, dynamic: ${DYNAMIC_ROLES.join("/")}`);
