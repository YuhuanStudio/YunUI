# CLAUDE.md — working notes for YunUI

A versioned React 19 + Tailwind v4 design system, originally extracted from the
Yunxin app and being generalized into a standalone system. Published as
`@yuhuanowo/yunui`.

## Versioning policy (IMPORTANT — read before bumping)

**Deliberately slow the version cadence. Stay on `0.2.x` for a long time.**

- npm/semver is **exactly 3 numeric segments** (`major.minor.patch`). A 4th
  segment like `0.2.4.1` is INVALID and cannot be published — so "0.2.4.xxx" is
  expressed as the **patch slot being the slow counter**: `0.2.5`, `0.2.6`, …
  up to `0.2.50`+ if needed. `0.2` (the minor) stays frozen; the number after it
  is the only thing that moves.
- **Release infrequently.** The cadence was too fast (0.2.0→0.2.4 in one sitting).
  Going forward: accumulate changes under `[Unreleased]` in the CHANGELOG and cut
  a patch release only when the owner asks or a batch is genuinely worth shipping.
  Do NOT bump `version` / push a tag per change.
- Do **NOT** bump the minor (`0.3.0`) or major (`1.0.0`) without explicit owner
  sign-off. A new component or token is still a patch while we stabilize.
- Optional canary scheme (only if asked): prereleases of the next patch,
  `0.2.5-0`, `0.2.5-1`, … — opt-in for consumers, sort after the current release.
- Releases are tag-triggered (see below).

## Commands

```bash
pnpm dev        # builds dist once, then runs lib watch + site dev together
pnpm dev:lib    # tsup --watch only
pnpm build      # regenerates tokens, then tsup build -> dist/
pnpm tokens     # regenerate styles/tokens.css from scripts/gen-tokens.mjs
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest run
pnpm --filter yunui-site build   # build the docs/showcase site
```

## Layout

- `src/primitives/` — atomic components (Button, Input, Card, Dialog, Select…),
  big barrel is `src/primitives/index.tsx`.
- `src/patterns/` — page-level components (StatCard, Sidebar, PageHeader…).
- `src/ai/` — AI-domain components (ModelCard, ProviderIcon, Navbar, Footer…),
  the most app-specific surface.
- `src/adapters/` — `YunUIProvider` injects Link/Image/useRouter/useT + iconBasePath.
- `src/lib/` — `cn`, hooks, and `theme.ts` (runtime theming API).
- `styles/yunui.css` — legacy flat tokens + global `.btn`/`.card` classes + `@theme`.
- `styles/tokens.css` — GENERATED layered token system (do not hand-edit; run `pnpm tokens`).
- `site/` — Next.js 16 docs + showcase. Imports the built `dist/` via a symlink.

## Design-token system (`styles/tokens.css`, generated)

3 layers: scheme (primitives) → function (role→palette map,
switchable at runtime via `data-brand`/`data-accent`/`data-neutral`) → theme
(semantic `--{role}-{family}-{intensity}` for light/dark). Surfaced as Tailwind
utilities (`bg-brand-solid-strong`, `text-accent-on-background-weak`, …) and
driven from JS via `applyTheme()` / `useYunUITheme()`.

- It is **additive**: it does not touch the legacy flat vars, so the default look
  is unchanged. Migrate components onto the semantic tokens incrementally.
- Edit palettes/model in `scripts/gen-tokens.mjs`, then `pnpm tokens`. Never edit
  `styles/tokens.css` by hand.

## Conventions

- Components carry **no copy** and bind **no i18n library** — text goes through
  `useYunUI().useT`; routing/images via the adapter; data via props. See CONTRIBUTING.md.
- AI icon assets are **not bundled**; consumers host them and set `iconBasePath`.
  Icon components must degrade gracefully (fallback, no crash) when assets/ids are missing.
- Docs demos: write the JSX children inside `<ComponentPreview>`; the `code` tab is
  auto-derived from that source by `site/lib/mdx-plugins/remark-demo-source.mjs`.
  **Do not hand-write `code` strings** — they would drift and are overwritten anyway.

## Frontend verification (MANDATORY — no "looks-done" without pixels)

**Any frontend change — in YunUI or in a consumer (Agent / Yunshu / Yunxin) — is
NOT done until it has passed real-render screenshot verification.** A green
`typecheck` / `build` / test run is necessary but **not sufficient**: it proves the
code compiles, not that the component renders correctly. Do not claim a UI change
works from reading the code — look at the pixels.

Every UI change must be screenshotted and visually inspected across the full matrix:

- **Two engines: Chromium (Chrome) AND WebKit (Safari).** WebKit has real, shipping
  differences (focus-on-click, `<16px` input zoom, backdrop-filter, flex/grid quirks —
  see [[yunui-safari-cross-browser-gotchas]]). Chrome-only verification misses them.
- **Multiple device sizes:** at least mobile (~390px), tablet (~768px), desktop (~1440px).
- **Both themes:** light and dark (and, when the change touches palettes, an opt-in brand).

How: drive the built site / app with Playwright (`site/visual/` already has the config,
`capture.mjs`, and the `chromium`+`webkit` projects). Start the target (`pnpm build && pnpm
start`, or the consumer's server), capture the changed sections/pages across the matrix,
then **actually open the PNGs and inspect them** — don't just confirm the files exist.
Install browsers once with `npx playwright install chromium webkit`.

Report findings honestly: if a diagram is stuck loading, a layout breaks at mobile, or
dark mode has contrast issues, say so and fix it — that's the whole point of looking.

## Releasing (only when asked)

Tag-triggered: bump version → `git tag vX.Y.Z` → push tag → GitHub Actions runs
typecheck/test/build → npm publish (trusted publishing, no token). Per the policy
above, that version bump should almost always be a patch.
