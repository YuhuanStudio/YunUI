// =====================================================================
// YunUI token generator
// ---------------------------------------------------------------------
// Emits styles/tokens.css — a 3-layer, runtime-switchable design-token system:
//
//   1. SCHEME (primitives)  --scheme-{palette}-{100..1200} + alpha
//        Raw palette values, theme-independent. ORIGINAL — every value is
//        OKLCH-generated from the MODEL below (see generatePrimitives), not
//        copied from any external palette.
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

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- model -----------------------------------------------------------

// All palettes shipped in the scheme layer. 6 tinted-neutral + 18 chromatic,
// every value OKLCH-generated below (MODEL). Names are generic; no external
// palette is referenced.
const PALETTES = [
  "gray", "sand", "slate", "mint", "rose", "dusk",
  "red", "orange", "amber", "yellow", "lime", "moss", "green", "emerald",
  "teal", "aqua", "cyan", "blue", "indigo", "violet", "plum", "magenta",
  "fuchsia", "pink",
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

// ---- Layer 1 palette generation (original, OKLCH → sRGB) -------------
// Every --scheme-* value is COMPUTED from this hue/chroma/lightness model —
// nothing is transcribed from any external palette. OKLCH gives perceptually
// even ramps: a shared lightness curve + a chroma envelope that peaks in the
// mid-tones and tapers to soft tints, with a subtle hue torsion for richness.

// Perceptual lightness + chroma-multiplier across the 12 steps (100 = darkest).
const STEP_L = { 100: 0.18, 200: 0.255, 300: 0.36, 400: 0.46, 500: 0.55, 600: 0.65, 700: 0.74, 800: 0.83, 900: 0.885, 1000: 0.93, 1100: 0.96, 1200: 0.985 };
const STEP_C = { 100: 0.32, 200: 0.52, 300: 0.85, 400: 1.0, 500: 1.0, 600: 0.92, 700: 0.70, 800: 0.48, 900: 0.38, 1000: 0.26, 1100: 0.16, 1200: 0.09 };

// Per-palette { hue°, maxChroma, hueTorsion }. Neutrals carry a whisper of
// chroma; chromatics span a deliberately even hue wheel.
const MODEL = {
  gray: { h: 0, c: 0, t: 0 }, sand: { h: 80, c: 0.014, t: 6 }, slate: { h: 264, c: 0.020, t: -8 },
  mint: { h: 168, c: 0.018, t: 6 }, rose: { h: 18, c: 0.018, t: 8 }, dusk: { h: 318, c: 0.018, t: 8 },
  red: { h: 27, c: 0.20, t: 6 }, orange: { h: 50, c: 0.19, t: 10 }, amber: { h: 66, c: 0.16, t: 12 },
  yellow: { h: 82, c: 0.17, t: 14 }, lime: { h: 124, c: 0.18, t: 12 }, moss: { h: 138, c: 0.17, t: 8 },
  green: { h: 150, c: 0.18, t: 6 }, emerald: { h: 165, c: 0.16, t: 6 }, teal: { h: 196, c: 0.13, t: -6 },
  aqua: { h: 184, c: 0.13, t: 6 }, cyan: { h: 218, c: 0.15, t: -8 }, blue: { h: 256, c: 0.18, t: -10 },
  indigo: { h: 278, c: 0.17, t: -8 }, violet: { h: 300, c: 0.20, t: -6 }, plum: { h: 312, c: 0.17, t: -6 },
  magenta: { h: 330, c: 0.21, t: -6 }, fuchsia: { h: 342, c: 0.24, t: 0 }, pink: { h: 352, c: 0.20, t: 6 },
};

const _gamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
function _oklab2lrgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
// OKLCH → sRGB hex; reduce chroma until the color falls inside the sRGB gamut.
function oklch2hex(L, C, Hdeg) {
  const H = (Hdeg * Math.PI) / 180;
  let c = C, rgb = _oklab2lrgb(L, c * Math.cos(H), c * Math.sin(H));
  const inGamut = (v) => v.every((x) => x >= -1e-4 && x <= 1 + 1e-4);
  while (!inGamut(rgb) && c > 0) { c *= 0.96; rgb = _oklab2lrgb(L, c * Math.cos(H), c * Math.sin(H)); }
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, _gamma(v))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

const ALPHA_HEX = { "600-15": "26", "600-30": "4D", "600-50": "80" };

function paletteRamp(def) {
  const r = {};
  for (const s of STEPS) r[s] = oklch2hex(STEP_L[s], def.c * STEP_C[s], def.h + (def.t || 0) * (STEP_L[s] - 0.55));
  return r;
}

// Emit the Layer-1 `:root { --scheme-* }` block (static colors + every ramp).
function generatePrimitives() {
  const out = [
    ":root {",
    "  /* STATIC */",
    "  --static-transparent: #00000000;",
    "",
    "  --static-white:        #ffffff;",
    "  --static-white-medium: #ffffff4D;",
    "  --static-black:        #000000;",
    "  --static-black-medium: #0000004D;",
    "",
    "  /* BASE — OKLCH-generated, 100 = darkest → 1200 = lightest */",
  ];
  for (const p of PALETTES) {
    const r = paletteRamp(MODEL[p]);
    out.push(`  /* ${p} */`);
    for (const s of STEPS) out.push(`  --scheme-${p}-${s}: ${r[s]};`);
    for (const a of ALPHAS) out.push(`  --scheme-${p}-${a}: ${r[600]}${ALPHA_HEX[a]};`);
    out.push("");
  }
  out.push("}");
  return out.join("\n");
}

// Semantic intensity → function step, per theme.
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

const primitives = generatePrimitives();

const header = `/* =====================================================================
 * YunUI design tokens — GENERATED FILE, do not edit by hand.
 * Source: scripts/gen-tokens.mjs  (run: node scripts/gen-tokens.mjs)
 * Palette values are original, OKLCH-generated by that script.
 *
 * 3 layers: scheme (primitives) -> function (role map) -> theme (semantic).
 * Runtime theming via attributes on <html>:
 *   data-brand / data-accent / data-neutral = ${PALETTES.join(" | ")}
 *   data-theme = light | dark   (also honors .dark / .true-black classes)
 * Additive: does not modify YunUI's legacy flat vars; current look unchanged.
 * ===================================================================== */`;

// 1. SCHEME (primitives) — original, OKLCH-generated.
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
