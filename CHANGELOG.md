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
- **`AreaChart` (primitive)** — an interactive line/area chart for a time series:
  smooth bezier curve, gradient area fill, dashed grid, and a hover guide with a
  value tooltip. Container-width (ResizeObserver), pure SVG. The "full" chart
  counterpart to `Sparkline`. Extracted from Yunxin's analytics charts so both
  apps (and Yunshu) share one canonical chart.
- **`Sparkline` (primitive)** — a tiny inline SVG line/area chart for a single
  number series (throughput, GPU utilization, latency), tone-colored and
  container-width. No chart library.
- **`Gauge` (primitive)** — a circular 0–100 percentage ring with a centered
  value or custom label; the arc color follows a semantic `tone`.
- **`SegmentedBar` (primitive)** — a proportional multi-segment bar toward a
  `total` (memory allocation, request mix) with an optional value legend.
  Complements `MetricBar`'s single fill.
- **`FileDropzone` (primitive)** — a drag-and-drop / click-to-browse upload
  target that reports files via `onFiles`; presentation + interaction only.
- **`AudioPlayer` (patterns)** — a compact controls bar around an HTML5
  `<audio>`: play/pause, seek, time, and an optional download button.
- Full docs (3 locales), showcase demos and prop tables for all five.
  Motivated by the Yunshu webui rewrite onto YunUI.

## [0.2.15] - 2026-06-27

### Added
- **`PageLayout` (patterns)** — the standard full-height page shell: a navbar slot,
  a `flex-1` `<main>` offset (`pt-28`) to clear the fixed navbar, and a footer slot.
  Navbar/footer are passed as slots so the shell stays decoupled from their props;
  `hideFooter`, `transparentBg` and `mainClassName` cover the common variations.
  Extracted from Yunxin's hand-rolled shell (used by 8+ marketing pages).
- **Original OKLCH palette system — 24 palettes.** The design-token scheme layer is
  now generated from an in-house OKLCH model (`scripts/gen-tokens.mjs`) with
  perceptually-even ramps; added `teal`, `lime`, `amber`, `plum` and `fuchsia` (19 →
  24). The brand/accent/neutral roles can target any of them at runtime.
- **`YUNUI_THEME_PRESETS` — 12 curated multi-color themes.** Named
  `{brand, accent, neutral}` combos (Aurora, Sunset, Forest, Ocean, Grape, Ember,
  Lagoon, Blossom, Royal, Citrus, Orchid, Mono), exported with
  `YunUIThemePreset` / `YunUIThemePresetName`. Apply with `applyTheme(preset)`.
- **Theme-effect utilities** (in the stylesheet, token-driven so they restyle with
  the active brand/accent): `.bg-brand-gradient`, `.text-brand-gradient`,
  `.glow-brand`, `.glow-accent`, `.bg-brand-sheen`.

### Fixed
- **iOS Safari no longer zooms the page when focusing a field.** Mobile Safari
  auto-zooms when a focused input/textarea/select has font-size < 16px (our fields
  use `text-sm` = 14px). Added a touch-only (`hover:none` + `pointer:coarse`) rule
  flooring form fields at 16px; desktop keeps the 14px look. Verified in WebKit and
  Chromium under iPhone emulation.
- **Escape closes the `LanguageSwitcher` / `ThemeToggle` dropdowns (cross-browser).**
  They previously only closed on outside-click. Added Escape-to-close with focus
  return to the trigger — via a **document-level** listener, because WebKit/Safari
  on macOS doesn't focus a `<button>` on click, so a container `onKeyDown` would
  never receive the key (caught by testing in the WebKit engine). `CustomSelect`
  now focuses its trigger on mouse-open for the same reason, so its keyboard nav
  works in Safari too.
- **`Combobox` is keyboard-navigable.** Added ArrowUp/Down/Home/End/Enter listbox
  navigation, `role="listbox"`/`role="option"`/`aria-selected`, and
  `aria-activedescendant` — previously mouse-only.
- **Accessible names + ARIA on the dropdowns.** `aria-label` on the `ModelSelect` /
  `CustomSelect` / `Combobox` / `SearchInput` search fields (placeholder alone isn't
  a label); `aria-expanded`/`aria-haspopup` on the `ThemeToggle` trigger; the Navbar
  mobile-menu scrim is `aria-hidden`.
- **Navbar respects the iPhone safe area.** The fixed top bar uses
  `max(1.5rem, env(safe-area-inset-top))` so it clears the notch / Dynamic Island in
  standalone Safari (no change on desktop, where the inset is 0).
- **Horizontal scroll bars no longer scroll vertically on touch.** `overflow-x-auto`
  with the default `overflow-y: visible` makes a browser compute `overflow-y` to
  `auto` too, so the `ModelSelect` provider-filter row (and the `NavTabs` / `Tabs`
  bars) could be dragged up/down a few px on a phone. Added explicit
  `overflow-y-hidden overscroll-x-contain` to those single-row scrollers.
- **Unbreakable text no longer widens its row/card.** Added `truncate` to the
  `LinkRow` title, `SessionItem` detail, `ModelCard` developer label and the
  `Navbar` app name (with `min-w-0` on the logo link), so long ids / device strings
  / brand names ellipsize instead of pushing the layout past the viewport.
- **Hand-rolled dropdown panels stay inside the viewport.** `ModelSelect`,
  `CustomSelect`, `Combobox`, `LanguageSwitcher` and `ThemeToggle` positioned
  their floating panel with a plain `absolute` and no collision handling, so on
  narrow / mobile screens the panel (notably `ModelSelect`'s fixed `w-96`) spilled
  off the right edge and could run past the bottom. New `useAnchoredPosition` hook
  measures each panel against the viewport and applies a horizontal `marginLeft`
  nudge (margin, so it never fights framer-motion / `animate-in` transforms) plus a
  `maxHeight` cap paired with an internal `flex-1 min-h-0` scroll region. The Radix
  panels (`Select`, `DropdownMenu`, `Popover`) already flip/shift via Popper and are
  unchanged.

### Changed
- **All dropdown / select panels share the LanguageSwitcher look.** Unified every
  floating menu panel onto one chrome — `rounded-2xl border border-border
  bg-background/60 backdrop-blur-2xl shadow-lg shadow-black/5` — across `Select`,
  `CustomSelect`, `Combobox`, `DropdownMenu`, `Popover`, `ModelSelect` and the
  `Navbar` mobile menu (they previously diverged: square `rounded-xl`, opaque
  `bg-(--bg-elevated)` / `bg-popover`, weaker/absent blur, `shadow-md`/`shadow-2xl`).
  The selectable rows in `Select`/`CustomSelect`/`Combobox` now use the shared
  `.dropdown-item` class — the same left accent bar on hover/selection as the
  language picker, replacing per-component check-mark / tinted-background styles.
  `.dropdown-item` was extended to also drive Radix rows (keyboard
  `data-highlighted`, selected `data-state=checked`), so hand-rolled and Radix
  dropdowns render identically.
- **Palette values are now original.** The scheme primitives are regenerated from
  the OKLCH model rather than the previously vendored ramps, so semantic-token
  consumers may see subtle color shifts. The generator and all values are first-party.

## [0.2.14] - 2026-06-27

### Changed
- **Softer corner radii across the core surfaces.** Bumped the global component
  classes a notch rounder — `.btn` 12→14, `.btn-sm` 9→11, `.btn-lg` 14→16,
  `.card`/`.glass-card` 16→20, `.stat-card`/`.gradient-card`/`.glass-card-enhanced`
  20→24, `.input`/`.code-block` 12→14, `.badge` 6→8, `.nav-item`/`.nav-tab`/
  `.dropdown-item` 10→12. Literal px only — the Tailwind `--radius-*` namespace is
  deliberately untouched (defining it there hijacks every `rounded-*` utility).

### Fixed
- **True-black (OLED) surfaces are no longer invisible.** `--color-muted`/
  `--color-card` map to `--bg-elevated`/`--bg-card`, which true-black set to pure
  `#000` — so every `bg-muted`/`bg-card` fill (hover states, tiles, switch tracks,
  sticky headers, cards) vanished into the black page. Lifted elevated→`#141414`
  and card→`#0a0a0a` (page stays `#000`), so fills are visible while borders/rings
  still delineate.
- **`Switch` off-state is visible in true-black.** The unchecked track was
  `bg-transparent` with only a faint `--border-strong` outline (≈invisible on
  `#000`); it now carries a `bg-muted` fill so the track reads in every theme.
- **White ink on colored fills stays white in true-black.** Added `.text-pure-white`
  (immune to the true-black `.text-white`→`#d4d4d8` body-text dim) and used it for
  the `NotificationBell` count badge and `AvatarUploader` overlay icons, which were
  dropping to a low-contrast grey on their red / black fills.
- **`ConnectedAccountRow` provider badge sits on the avatar edge.** It was pinned
  to the bounding-box corner (`-bottom-1 -right-1`), floating off the circular
  avatar; now `bottom-0 right-0` so it overlaps the ring cleanly.
- **`ModelSelect` hover stutter (esp. Safari).** Each sticky group header added its
  own `backdrop-blur` on top of the panel's — 5 stacked `backdrop-filter` layers,
  which makes hover/scroll repaint janky. The header now uses a solid `bg-muted`
  fill (1 filter layer total).
- **`ModelSelect` provider group headers no longer render as a bright white box.**
  The sticky header laid its own `bg-popover/95` fill on top of the already
  translucent `bg-popover/90` panel, so the band stacked to a brighter/whiter
  surface — a hard square seam, very visible over a tinted page. It's now a
  rounded `rounded-xl` bar with a *muted* (not popover-white) fill that echoes
  the model rows — a deliberate on-brand label that still occludes scrolling
  rows, instead of a stray white box.
- **`ModelSelect` keyboard-highlight ring no longer sits on the top row by default.**
  The arrow-key highlight now starts at "no selection" (`-1`) instead of index `0`, so
  the white focus ring appears only once the user actually presses Up/Down — and clears
  on mouse move so it never competes with hover. `Enter` with nothing highlighted still
  picks the top result (classic combobox).
- **`Checkbox` no longer crashes when used uncontrolled.** `checked` now defaults
  to `false` and `onCheckedChange` is optional (guarded), so a display-only
  checkbox (no handler) renders instead of throwing on click.
- **`ModelManagerCard` no longer stretches to fit a long model name.** The name now
  carries `min-w-0 break-words`, so an unbreakable long name wraps inside the card
  instead of widening the whole column.
- **`.badge` is now an atomic unit.** Added `white-space: nowrap` + `flex-shrink: 0`
  so a badge keeps its icon and label on one line and wraps as a whole in a narrow
  flex column, instead of being squeezed until a CJK label breaks per-character.
- **`LanguageSwitcher` `pill` collapses to icon-only when space is tight.** The label
  is `hidden sm:inline` (icon + `aria-label` still convey the control), so the pill
  degrades to a round globe button on narrow widths instead of overflowing.

### Added
- **`SessionItem` (patterns)** — a row in an active-sessions / signed-in-devices
  list: device glyph, name with current / inactive badges, a `browser · OS` line,
  an IP + last-seen footer, and a revoke button. Host maps device→icon, formats
  the time, owns revoke.
- **`MetricBar` (patterns)** — a labelled row with a thin proportion bar for
  "top N" breakdowns (spend-by-provider, usage-by-category, storage-by-bucket):
  icon (or color dot) · label · right-aligned value · colored bar.
- **`InlineStatus` (primitive)** — a compact inline async-job status: a (spinning)
  icon plus a host-supplied label, or a percentage while running (`pending` /
  `processing` / `completed` / `failed`). Distinct from `StatusIndicator` (a
  presence dot) and `StatusBadge` (an approval pill).
- **`FeatureLockedState` (patterns)** — the centered "feature unavailable" screen
  (icon medallion · title · description · optional dashed restricted-note card),
  for rendering as a feature-flag fallback. Presentation only; the host gates.
- **`Banner` (patterns)** — a tinted, horizontal banner row (`info` / `warning` /
  `critical` / `success` / `neutral`) with an icon, title, inline description,
  meta, actions and an optional dismiss. One component for announcement, release
  and verification-style banners (distinct from the stacked `Alert` primitive).
- **`NotificationBell` / `NotificationItem` / `NotificationPanel` (patterns)** —
  presentational notification-center pieces: a bell trigger with an unread-count
  badge, a notification row (type-glyph slot · title · body · time, optional
  adapter-`Link` + hover dismiss), and the dropdown chrome (header, scrollable
  list with loading / empty states, footer slot). The host owns fetch / auth /
  polling / mark-as-read and the open state; copy is passed in.
- **`SimplePagination` (patterns)** — a prev / page-indicator / next pager for
  cursor- or has-more-style lists where the total page count isn't known (so
  `BlogPagination`'s numbered pages don't apply). Same ghost-button styling;
  `hasNext` drives the next button, `labels.page` renders the centre indicator.
- **`ModelManagerCard` (ai)** — a dense admin model row rendered as a card: header
  (select · icon · name + id chips · row actions), a 2-column labelled spec grid
  (provider, developer, type, status, context **or** resolution, max output, price
  in/out), and capability badges — every admin-table column present, top-to-bottom,
  so model management reads on any width instead of a wide scrolling table. All
  values are slots. Long, unbreakable names wrap inside the card.
- **`SettingRow` (patterns)** — one labelled row in a settings / preferences list:
  title · optional description · trailing control slot (a `Switch`, `Select`,
  button…). Stack several in a card; a bottom border divides them and the last
  one drops it. Presentation only — the host owns the control and its state.
- **`LinkRow` (patterns)** — a tappable row that links somewhere: leading icon ·
  title + description · trailing chevron. For support links, settings navigation,
  "manage X" entries. `external` opens a new-tab anchor; otherwise it routes
  through the adapter `Link`.
- **`ConnectedAccountRow` (patterns)** — a row in a connected-accounts /
  integrations list: a provider avatar (image, or a glyph in a ring) with a small
  provider badge overlay · name + optional sub-name · detail line · connected-time
  footer · unlink button. Host owns the unlink.
- **`AvatarUploader` (patterns)** — a clickable avatar that opens a file picker:
  shows the image or an initials fallback, a camera overlay on hover, and a spinner
  while uploading. `onSelectFile` hands back the chosen `File`; the host uploads.

## [0.2.13] - 2026-06-26

### Added
- **`ModelSelect` (ai)** — a generic, domain-agnostic searchable model picker:
  provider grouping, provider + capability filters, a pinned section, and a glassy
  dropdown. Consumers map their model type to `ModelSelectOption` (icon/badges/
  detail/meta are slots) and own pinning + filters via props — no app types,
  pricing or i18n leak into the design system. Selection uses YunUI's left-bar
  signature (a full bar when selected, a faint bar that slides in on hover, like
  the Sidebar). New exports: `ModelSelect`, `ModelSelectOption`,
  `ModelSelectFilter`, `ModelSelectLabels`.
- **`CapabilityIcon` (ai)** — the glyph-only capability indicator (the colored
  icon shown inline after a model name), built on the same shared capability
  config `CapabilitySelector` uses. Plus `isKnownCapability`. (The labelled pill
  `CapabilityBadge` already lived in `patterns`.) The capability config also
  gained `dark:` text variants, improving `CapabilitySelector` dark mode.
- **`StatCard` `compact` prop (patterns)** — the lighter `card p-4` tile for dense
  stat grids (keeps the dark-mode tone colors inline versions lacked).

### Changed
- **Unified glassy overlay surfaces** — `Dialog`, `Modal`, `DropdownMenu`, `Select`
  and `Sheet` now share the navbar's glassy treatment (`bg-…/90 backdrop-blur-xl`)
  instead of flat opaque slabs. `Sheet` is a floating, fully-rounded drawer.
- **Mobile-responsive layouts** — `PageHeader` / `MediaPageHeader` stack title and
  actions on small screens; `Grid` and `CapabilitySelector` ramp columns
  mobile-first; `Navbar`, `Footer`, `CodeBlock`, `Pagination` and `Table` were
  tightened for narrow viewports.

### Fixed
- **`<Table responsive>` no longer overflows on mobile.** The stacked card used a
  label-left / value-right row that pushed wide cell content (icons, badges, long
  names, action buttons) off the card and clipped it. Cells now stack
  label-above-value, full-width, so any content stays on-screen.
- **`azure` / `aws` / `bedrock` rendered GitHub's icon and the "GitHub Models"
  name** — a stale "served-via-GitHub-Models" shortcut. They now resolve to their
  own icon and proper display name.
- **`Pagination`** active-state and width on mobile (no stray overflow box on tap).

## [0.2.12] - 2026-06-25

### Changed
- **Brand icons now come from `@lobehub/icons-static-avatar` (MIT)** — the avatar
  variants (logo on a brand-colored rounded tile) instead of bare logos, so every
  provider/model icon reads as a consistent app-style tile in both light and dark
  (the previous bare SVGs looked "naked" on cards). `scripts/sync-icons.mjs` now
  vendors the FULL avatar set (309 brands) into `icons/providers/` and generates
  `PROVIDER_ICON_SLUGS`, so any brand Yunxin references (e.g. `opencode`, which was
  missing) resolves without a hand-maintained map entry. Mono-only / non-lobe
  brands keep their existing raster.

## [0.2.11] - 2026-06-25

### Fixed
- **Provider/model icons resolved to the wrong extension after the 0.2.10 lobe sync.**
  The sync rewrote 43+ rasters to `.svg` but `providerIconMap`/`modelIconMap` still
  named the old `.png`/`.webp`, so those icons 404'd and fell back to initials.
  `scripts/sync-icons.mjs` now also rewrites the filename literals in the icon maps
  to match the files on disk (75 entries corrected).

## [0.2.10] - 2026-06-25

### Added
- **Icon sync from `@lobehub/icons-static-svg` (MIT).** `scripts/sync-icons.mjs`
  pulls fresh brand-COLOR SVGs for providers/models/apps into `icons/`, so the
  set stops drifting — re-run `pnpm icons:sync` to refresh or add brands (alias
  map handles name differences; mono-only brands keep their raster to avoid the
  currentColor-in-dark-mode issue). 43 providers upgraded to vector this pass.
- **`<Table responsive>`** — dense, many-column tables stack each row into a
  labelled card below the `md` breakpoint instead of forcing a horizontal scroll,
  so they stay readable on narrow screens. Pair with **`<TableCell label="…">`**
  to label each value. (Wide screens render the normal table; pages should avoid
  forcing `whitespace-nowrap`/`min-width` on every column so it can fit the
  viewport.)
- `Checkbox` now accepts `checked="indeterminate"` (renders a dash) for partial
  select-all states.

### Changed
- **`Sheet` is now a general slide-in drawer**, shown on all screen sizes by
  default — it no longer hard-codes `lg:hidden`. Pass **`mobileOnly`** for the old
  hide-on-`lg`+ behavior (a drawer that only exists on mobile). Fixes the Sheet
  appearing to "not open" on desktop.

### Fixed
- **Safari rendering.** `PasswordInput`'s reveal toggle is now a flex child (it
  was absolutely positioned, which Safari pushed *outside* the field), and
  `NumberInput` hides the native number spinner via plain CSS in
  `styles/yunui.css` — the Tailwind `[&::-webkit-*]` arbitrary variants were
  ignored by Safari, so it showed a duplicate spinner next to the −/+ steppers.

## [0.2.9] - 2026-06-24

### Added
- `SearchInput` gains a **`size`** prop (`"sm" | "md"`, default `md`). `sm` is a
  compact 32px-tall variant for toolbars and dropdown filters (e.g. the model
  picker), keeping the same icon size so it reads as a smaller version, not a
  different control.
- `Combobox` gains **`creatableFilter`** (only offer the "create new" row for
  inputs passing a test) and **`creatableIcon`** (custom glyph for that row) — so
  consumers like Yunxin's icon-URL combobox can single-source from YunUI instead
  of forking the component.

## [0.2.8] - 2026-06-24

### Fixed
- **`.card-col` no longer sets `height: 100%`.** That explicit height overrode the
  grid's `align-items: stretch` and, when the grid's own height was indefinite
  (e.g. a centered flex container), collapsed each card to its content height — so
  the footer-pinning silently failed. Stretch alone is the robust path; footers now
  align in any grid context.

## [0.2.7] - 2026-06-24

### Added
- **`SearchInput`** — the canonical search field: a leading magnifier with the
  right padding (typed text never sits under the icon) plus an optional clear
  button. Uses `type="text"` + `role="searchbox"` so there's **no duplicate native
  ✕**, restores focus after clearing, and `onChange` returns the string directly.
  Replaces hand-rolled `<input> + absolute icon` search boxes.
- More common primitives: **`Separator`** (h/v divider), **`Alert`** (info/success/
  warning/error callout with icon + title), **`Tag`** (small, optionally removable
  label), and **`AvatarGroup`** (overlapping avatars with a "+N" overflow chip).
- Status & docs primitives: **`StatusIndicator`** (colored status dot + label,
  optional pulse), **`InlineCode`** (inline code span), and **`Steps`** (vertical
  progress stepper with done/active/upcoming states).
- **`.card-col` + `.card-footer`** CSS classes: lay a `.card` out as a column with
  its footer pinned to the bottom, so equal-height grid cards line their footers up
  regardless of body content. Single-sources the card-footer-alignment fix here
  (instead of per-consumer inline flex tweaks that keep regressing).

## [0.2.6] - 2026-06-24

### Added
- New primitives closing part of the breadth gap: **`PasswordInput`**
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
  `scripts/gen-tokens.mjs`): a layered 3-tier system — 19 palettes × 12 steps →
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
- **Layout primitives** (the big layout-primitive gap): `Flex`, `Grid`, `Column`,
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

[Unreleased]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.9...HEAD
[0.2.9]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.8...v0.2.9
[0.2.8]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/YuhuanStudio/YunUI/compare/v0.2.6...v0.2.7
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
