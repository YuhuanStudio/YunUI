# Contributing to YunUI

YunUI is a **presentational, framework-agnostic** design system. The golden rule:
components own **look + behavior**, never an app's **data, routing, or copy**.
Everything app-specific is injected by the consumer (via props or the adapter
layer). Follow these rules so a component works in YunUI's showcase, in Yunxin,
and in any future consumer.

## Project layout

| Path | What goes here |
| --- | --- |
| `src/primitives/` | Atomic, app-agnostic UI (Button, Input, Dialog…). Exported from `.` |
| `src/patterns/` | Page-level compositions (FAQ, StatCard, Sidebar…). Exported from `./patterns` |
| `src/ai/` | Yunxin AI-domain components (ProviderIcon, ModelCard…). Exported from `./ai` |
| `src/adapters/` | `YunUIProvider` / `useYunUI` — the injection layer |
| `styles/yunui.css` | The design system: tokens, `@theme`, global classes, keyframes |
| `site/` | The showcase (Next.js). Demo every exported component here |

## The rules

### 1. Components with user-facing text → use the adapter, never hardcode

**YunUI ships NO translations and depends on NO i18n library.** A component that
displays text MUST read it through the adapter's translate function:

```tsx
import { useYunUI } from "../adapters/context";

export function Thing() {
  const t = useYunUI().useT("thing");   // namespace
  return <button>{t("submit")}</button>; // key, not a literal
}
```

- ❌ Do **not** `import { useTranslations } from "next-intl"`, import any i18n
  lib, or hardcode `"Submit"`.
- The consumer injects real translations via `<YunUIProvider adapters={{ useT }}>`.
  Without a provider, `useT` returns the **key** — so the component still renders
  (it just shows the key), which is also what the showcase's humanizing stub does.
- Add the actual strings to the **consumer's** message files (e.g. Yunxin's
  `messages/{en,zh-CN,zh-TW}.json`), **not** to YunUI.

### 2. Routing / images → adapter, not `next/*`

Use `useYunUI().Link` / `.Image` / `.useRouter`, never `next/link`, `next/image`,
or `next/navigation` directly. Defaults are a plain `<a>` / `<img>` /
`window.location`, so components work with zero config.

### 3. App data → props, not contexts / API / storage

No `useBranding()`, `useAuth()`, `fetch`, `localStorage`, etc. inside a component.
Take them as props; let the consumer wire a thin wrapper (see Yunxin's `navbar.tsx`
/ `provider-icons.tsx` for the pattern).

### 4. Icon assets are not bundled

`yunui/ai` icons resolve to `<iconBasePath>/providers|models/*.png` (see
`iconBasePath` adapter). Do not import binary assets into the bundle; the consumer
hosts them.

### 5. Styling

Use the design-system tokens and global classes (`.btn`, `.card`, `.glass`,
`bg-(--bg-elevated)`, etc.) from `styles/yunui.css`. New tokens/global classes go
**there** (the single source) — not inlined per component. Client components need
the `"use client"` banner (tsup re-injects it on build).

## Before you open a PR

```bash
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest (add tests for new components)
pnpm build       # tsup → dist (ESM + .d.ts)
pnpm exec publint # package sanity
```

- Add a **demo to `site/app/page.tsx`** for any new exported component.
- Add a **test** under `src/__tests__/`.
- Update **`CHANGELOG.md`** under `[Unreleased]`.

## Releasing

Bump `package.json` version → `git tag vX.Y.Z && git push --tags`. GitHub Actions
(`release.yml`) runs the gate and publishes to npm via OIDC trusted publishing
(no token). Consumers then `pnpm up @yuhuanowo/yunui`.
