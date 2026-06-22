# Changelog

All notable changes to `@yuhuanowo/yunui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/); this project
uses [Semantic Versioning](https://semver.org/) (pre-1.0: minor = features,
patch = fixes, anything may change between 0.x releases).

## [Unreleased]

### Added
- `CHANGELOG.md` and a fuller README (install, Tailwind `@source`, adapters,
  exports, the AI icon-asset requirement, sync workflow).
- CI: `.github/workflows/ci.yml` (typecheck + build + pack) and
  `release.yml` (tag `v*` → `npm publish --provenance`, no manual OTP).

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

[Unreleased]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/YuhuanStudio/YunUI/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.4
[0.1.0]: https://github.com/YuhuanStudio/YunUI/releases/tag/v0.1.0
