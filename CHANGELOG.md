# Changelog

All notable changes to `@yuhuanowo/yunui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/); this project
uses [Semantic Versioning](https://semver.org/) (pre-1.0: minor = features,
patch = fixes, anything may change between 0.x releases).

> **Cadence:** we deliberately stay on `0.2.x` for a long run — releases are
> almost always **patch** bumps. A `0.3.0` / `1.0.0` bump needs explicit owner
> sign-off. See [CLAUDE.md](./CLAUDE.md#versioning-policy).

## [Unreleased]

### Added
- **`SearchInput`** — the canonical search field: a leading magnifier with the
  right padding (typed text never sits under the icon) plus an optional clear
  button. Uses `type="text"` + `role="searchbox"` so there's **no duplicate native
  ✕**, restores focus after clearing, and `onChange` returns the string directly.
  Replaces hand-rolled `<input> + absolute icon` search boxes.

## [0.2.6] - 2026-06-24

### Added
- New primitives closing part of the breadth gap with once-ui: **`PasswordInput`**
  (masked field + show/hide reveal toggle), **`NumberInput`** (−/+ steppers with
  min/max clamping), and **`Kbd`** (inline keyboard-key display). All additive,
  same styling/error API as `Input`.
- `useFocusTrap(ref, enabled)` hook. **`Modal` (and `ConfirmModal`/`DeleteConfirmModal`/
  `RegenerateConfirmModal`, which build on it) now trap focus** — focus moves into
  the dialog on open, Tab/Shift+Tab cycle inside it, and focus returns to the
  opener on close. Closes the a11y gap flagged in 0.2.5.

### Fixed
- Showcase "Code" tabs now match the rendered preview (Button shows all 7 variants;
  Radix Select shows 3 items) and use the real `@yuhuanowo/yunui` import specifier
  (the in-repo `yunui` alias only resolves inside this repo).

## [0.2.5] - 2026-06-24

### Added
- **Broad opt-in brand theming.** With `data-accent-source="brand"` (+ `data-brand`)
  on `<html>` — or `applyTheme({ accentSource: "brand", brand: "blue" })` — the brand
  color now flows across the whole UI, not just a couple of buttons: primary/accent
  buttons, the `--color-primary` active/selected states (Switch, Checkbox,
  RadioGroup, selected combobox/select rows…), Slider range + thumb, Progress fill,
  focus rings (`--color-ring`), and the `bg-accent`/`text-accent` utilities. Body
  text stays on `--color-foreground`, so readability is untouched. **Default
  monochrome is byte-identical** (the markers/overrides do nothing without the
  attribute; verified visually with a violet brand across the showcase).
  Also covers active **navigation indicators** (sidebar nav-item bar, NavTabs
  underline, Navbar active-link underline + Sign-up CTA) and the **Radix Tabs**
  active pill (translucent brand tint).
  Brand buttons use a **translucent** brand tint (keeps YunUI's glassy feel, not
  heavy solid blocks) and **render correctly in dark mode** (the brand button
  overrides are placed after the `.dark .btn-*` rules so they win in both modes).
- A live **"Live brand theming" switcher** in the showcase (Mono/Brand + palette
  swatches) that dogfoods `useYunUITheme` and re-themes the whole page on click.

### Changed
- **"Which one do I use" guidance** on the overlapping component families, via
  JSDoc (visible in IDE + props tables), so picking one no longer feels like a
  trap: 3 dialogs (`Dialog` = accessible default / `Modal` = styled prop-driven /
  `ConfirmModal*` = confirmations) and 4 selects (`Select` / `CustomSelect` /
  `Combobox` / `SegmentedSelect`), plus `Tabs` vs `NavTabs`. Non-breaking.
- Corrected `Modal`'s docstring to state it does **not** trap focus (use `Dialog`
  when keyboard focus containment matters) — was previously implied "accessible".
- Demarcated `@yuhuanowo/yunui/ai` as the **app-domain layer** (AI-gateway
  components), not general-purpose primitives — so the core surface reads as a
  clean design system (core → `.`, patterns → `/patterns`, app domain → `/ai`).

### Internal
- CI: bumped `actions/checkout` + `actions/setup-node` to v5 (Node 24).

## [0.2.4] - 2026-06-24

### Added
- **Opt-in brand accent** — bridge the legacy monochrome accent to the
  runtime token system. Set `data-accent-source="brand"` (+ `data-brand`) on
  `<html>`, or `applyTheme({ accentSource: "brand", brand: "blue" })`, to make
  accent-driven components (`.btn-accent`, `bg-accent`/`text-accent`, …) follow
  your brand color across every project. **Purely additive**: without the
  attribute the default monochrome look is byte-identical (verified by compiled
  CSS diff). New `YunUIAccentSource` type.

## [0.2.3] - 2026-06-24

### Added
- Bundled icon set expanded to the **full shared asset library** sourced from
  Yunxin: `providers` (88), `models` (171), `apps` (55), `paintings` (7),
  `search` (5) — 326 files. YunUI is now the single source of truth for these
  icons; any project can pull them from the package or via jsDelivr
  (`…/@yuhuanowo/yunui@0.2/icons/<category>/<name>`), instead of keeping its own
  copy.

## [0.2.2] - 2026-06-24

### Changed
- **AI icons are now bundled and served via CDN by default.** The package ships
  the provider/model icon set under `icons/`, and `iconBasePath` now defaults to
  jsDelivr (`https://cdn.jsdelivr.net/npm/@yuhuanowo/yunui@0.2/icons`) — so
  `ProviderIcon` / `ModelIcon` / `ModelCard` render with **zero setup**.
  - To self-host and extend with your own icons, copy the package's `icons/`
    into your app and set `iconBasePath` (e.g. `"/icons"`).
  - **Behavior change for self-hosting consumers** that relied on the old
    `/icons` default (e.g. Yunxin): set `iconBasePath: "/icons"` to keep using
    your own copy. `next/image` users: allow `cdn.jsdelivr.net` or self-host.

## [0.2.1] - 2026-06-24

### Added
- **Runtime design-token system** (`styles/tokens.css`, generated by
  `scripts/gen-tokens.mjs`): once-ui-style 3 layers — 19 palettes × 12 steps →
  role map → semantic — switchable at runtime via `data-brand` / `data-accent` /
  `data-neutral` on `<html>`. Exposed as Tailwind utilities
  (`bg-brand-solid-strong`, `text-accent-on-background-weak`, …) and a JS API
  (`applyTheme`, `useYunUITheme`, `YUNUI_PALETTES`). **Additive** — the default
  look is unchanged.
- `Button` `variant="brand"` — solid fill driven by the themeable brand token.
- `Footer` is now also re-exported from `@yuhuanowo/yunui/patterns`.
- Docs demos have a single source of truth: `<ComponentPreview>` code tabs are
  auto-derived from the rendered children (remark plugin), so the shown code
  can't drift from the live preview.

### Fixed
- **Marquee** rendered as static text — added the missing
  `--animate-marquee(-vertical)` `@theme` tokens + keyframes.
- **Accessibility/correctness**: `Input`/`Textarea` set `aria-invalid` /
  `aria-describedby` + disabled styling; `IconButton` sets `aria-label`;
  `SegmentedSelect` buttons are `type="button"` + `aria-pressed`;
  `Switch`/`Checkbox` gained focus-visible rings.
- **Crash fix**: AI icon helpers (`ProviderIcon` / `ModelIcon` / `getIconPath` /
  `getProviderName`) no longer throw on an undefined provider id; tightened the
  fuzzy id matcher (no more `"ai"` → OpenAI false positives); `ProviderIcon`
  falls back gracefully when an icon asset 404s.
- Honest README: cross-project sync lands on the next `pnpm up`, not "instantly".

### Developer experience
- `pnpm dev` now runs the lib watch + site dev together (`concurrently`); added
  `pnpm tokens` to regenerate the token CSS.

## [0.2.0] - 2026-06-23

### Added
- **Layout primitives** (the big once-ui-parity gap): `Flex`, `Grid`, `Column`,
  `Row`, `Stack` — token-aware `gap`/`padding`/`align`/`justify`/`columns` via
  static class maps (Tailwind-compiler-safe).
- **`Accordion`** + **`RadioGroup`** (Radix-backed, full keyboard a11y).
- **Data display**: `Table` family (Table/Thead/Tbody/Tfoot/Tr/Th/Td + aliases),
  `Breadcrumb` family, controlled `Pagination` (ellipsis truncation, a11y labels).
- Tests for all of the above (141 total, up from 101).

### Fixed
- **`license` field corrected to `Apache-2.0`** to match the repo's LICENSE file.
  0.1.4–0.1.8 wrongly declared `MIT` in package metadata; this release fixes it.
- `CodeDemo` sample snippets use a generic `api.example.com` endpoint instead of
  a product-specific one.

## [0.1.8]

### Added
- JSDoc on ~150 public props + component descriptions across primitives,
  patterns, and ai entries — surfaces in editor IntelliSense (ships in `.d.ts`).
- Test suite expanded to 101 tests (from 21): interactive primitives (Switch,
  Checkbox, Slider, Tabs, Label), overlays/patterns (Modal, FAQ, Badge
  variants), and AI components (ModelCard, CapabilitySelector, IDBadge,
  ModelTypeIcon, Navbar, Footer). vitest setup stubs `ResizeObserver`.

### Changed
- `Button` variant aliases `default`/`red` documented as `@deprecated` (prefer
  `primary`/`destructive`); kept for backward compatibility.

## [0.1.7]

### Added
- `iconBasePath` adapter option — configure where `yunui/ai` icon assets are
  served (default `/icons`; point it at `/assets/icons`, a CDN origin, …).
  Resolves the out-of-box broken-image issue for non-default hosting. Custom
  `iconUrl` props still pass through untouched.
- `publint` packaging lint in CI + release.
- 3 tests for `ProviderIcon` icon-base resolution (21 tests total).

### Changed
- README icon caveat now documents the configurable `iconBasePath`.

## [0.1.6]

### Added
- `CHANGELOG.md` and a fuller README (install, Tailwind `@source`, adapters,
  exports, the AI icon-asset requirement, hooks, sync workflow).
- Test suite: vitest + Testing Library; 18 tests covering core primitives,
  `StatCard` variants, and `CustomSelect` keyboard/a11y.
- CI: `ci.yml` (typecheck + test + build + pack) and `release.yml`
  (tag `v*` → tokenless **OIDC trusted publishing** + provenance; no NPM_TOKEN).

### Changed
- `CustomSelect` is now an accessible combobox: ARIA roles
  (`combobox`/`listbox`/`option` + `aria-expanded`/`selected`/`activedescendant`)
  and full keyboard nav (↑/↓, Home/End, Enter, Escape, Tab) with
  highlight-into-view. Previously mouse-only.

### Fixed
- `site/` workspace dependency aliased to `@yuhuanowo/yunui` (broke after the
  package was scoped).

## [0.1.5]

### Added
- `yunui/ai`: `ModelTypeIcon`, `ProviderIconImg` (delegates to `ProviderIcon`),
  and `buttonVariants` (cva, for fumadocs-themed docs buttons).

### Notes
- `_deferred/ai-search` stays unexported — it is a full ai-sdk feature, not a
  reusable primitive, and would force `@ai-sdk/react` peer deps on the library.

## [0.1.4]

### Added
- Canonical `StatCard` with `tone` colors + `inline` and `valueFirst` layout
  variants (covers the dashboard / insights / analytics stat-card styles from
  one component).
- Built `dist/` is tracked in git so the package resolves over a git dependency
  without an install-time build.

### Changed
- `<Card>` now renders the `.card` utility class (matches the app-wide `.card`
  usages instead of bespoke inline classes).
- Package scoped to `@yuhuanowo/yunui` (the bare `yunui` name is blocked on npm).

## [0.1.0] – Initial extraction

- Yunxin's design system extracted into a standalone, versioned package:
  - `yunui` — atomic primitives (Button…DropdownMenu).
  - `yunui/css` — tokens, `@theme`, global classes, keyframes (3 themes).
  - `yunui/adapters` — `YunUIProvider`/`useYunUI` (Link/Image/router/i18n injection).
  - `yunui/patterns` — landing/blog/docs + layout components.
  - `yunui/ai` — Yunxin AI-domain components (prop-driven).
- tsup build → ESM + `.d.ts`, code-split shared adapter context, `"use client"`
  preserved, deps externalized at Yunxin's exact versions.

[Unreleased]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.6...HEAD
[0.2.6]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.8...v0.2.0
[0.1.8]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.4
[0.1.0]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.0
