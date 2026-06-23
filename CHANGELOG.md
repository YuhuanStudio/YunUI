# Changelog

All notable changes to `@yuhuanowo/yunui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/); this project
uses [Semantic Versioning](https://semver.org/) (pre-1.0: minor = features,
patch = fixes, anything may change between 0.x releases).

## [Unreleased]

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

[Unreleased]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.8...HEAD
[0.1.8]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.4
[0.1.0]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.0
