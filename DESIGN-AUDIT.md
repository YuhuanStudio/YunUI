# YunUI design-consistency audit (2026-06)

A full pass over **every** component (24 primitive files incl. the ~65-export
`index.tsx`, 28 patterns, 13 ai components) and the CSS foundation
(`styles/yunui.css`, `styles/tokens.css`), checking each state — default / hover /
active / focus / disabled / loading / empty / error — plus animation, dark mode,
tokens and a11y. This file records what was fixed and what is deliberately left
for an owner decision, so nothing is silently skipped.

## Fixed — foundation (commit f5ec506)

- **Undefined tokens that silently no-op'd.** `--bg-hover` / `--bg-muted` were
  referenced by accordion, combobox, custom-select, pagination and table but never
  defined, so every hover/highlight did nothing. Defined once at `:root` as
  aliases (nested `var()` resolves per theme).
- **No keyboard focus ring anywhere.** `.btn` did `outline:none` with no
  replacement; `.nav-item` / `.nav-tab` / `.dropdown-item` / `.card-interactive`
  had none either. Added `:focus-visible` rings to all five global classes.
- **No reduced-motion story.** Added a global `@media (prefers-reduced-motion:
  reduce)` reset (≈20 animations + framer/Radix data-state animations previously
  ran unconditionally).
- **Dead utilities** in 6 components: `border-border-strong/default`
  (segmented-select), `--brand-primary` (shiny-button), `ring-accent-muted`
  (faq), `bg-gradient-to-r` v3 name (fellows-banner), `fd-*` popover
  tokens/keyframes (popover, transparent in light/dark) — all routed to real,
  resolving tokens/utilities.

## Fixed — token unification + a11y (commit 76e8d15)

- **New proven helper vocabulary** in `yunui.css`: `--info` token + `.bg-*-soft`
  and `.border-*-soft` classes (because the `bg-error/10` Tailwind utility is
  dead — there is no `--color-error`). Pairs with the existing `.text-*` and
  `.badge-*` helpers so a Badge, an Alert and a status dot share one red/green/amber.
- **Hardcoded color scales → tokens** across Badge, Alert, StatusIndicator, all
  four inputs' error state, and ~10 patterns/ai components (account-locked,
  error-boundary, media-page-header, page-state, notification, session-item,
  connected-account-row, model-card, toast, switch, checkbox, radio, modal badges…).
- **P1 dark-mode bug:** DropdownMenu items used `focus:bg-accent` (≈white) with
  white `accent-foreground` → invisible highlighted item in dark/true-black. Now
  `focus:bg-muted focus:text-foreground`.
- **P1 keyboard-operability:** `IDBadge` clickable `<div>` → real `<button>`.
- **focus-visible + ARIA** added to every hand-rolled control across patterns/ai
  (aria-pressed on toggles, aria-expanded/haspopup on disclosures/menus,
  role=progressbar on metric-bar, alt/role fixes), plus dark-mode fixes
  (white borders → `border-border`, black-gradient avatar tiles → `bg-muted`),
  blog-card `group` so its hover-zoom actually fires, Alert `role` politeness.
- **ConfirmModal** variant icon tints unified onto the soft/text helpers.

## Flagged — needs an owner decision (NOT changed)

1. **Two parallel color systems disagree.** The legacy flat layer
   (`--error #ef4444`, `--success #10b981` emerald, `--warning #f59e0b`) and the
   generated layered layer in `tokens.css` (`--danger-solid-strong #FF5F53`,
   `--success-solid-strong #08AC3A`, `--warning-solid-strong #E07B00`) assign
   different values to the same role. Components keyed to one won't match the
   other. Picking a canonical layer + bridging is an architecture decision
   (per CLAUDE.md, the layered system is migrated incrementally with sign-off).
2. **No radius tokens.** Nine ad-hoc radii (4–20px) across `.btn/.card/.badge/
   .input/.dropdown-item/.nav-*`. Worth tokenizing as `--radius-sm/md/lg/xl`.
3. **Dialog focus traps.** `Sheet`, `ConfirmModal`, `ConfirmCloseDialog` focus an
   initial control but don't trap Tab (only `Modal` uses `useFocusTrap`). Adding
   the trap changes initial-focus order, so it needs interaction testing — a
   focused follow-up rather than a blind change.
4. **ModelSelect result rows** are mouse-only (`<div onClick>`, no arrow-key
   listbox). Trigger now has aria/focus; full roving-focus listbox is a feature.
5. **BlogCard** tag buttons are nested inside the card-wrapping `<Link>` and
   navigate via `window.location` — should move to the adapter router and lift the
   chips out of the outer link (structural).
6. **Duplicated capability color map** (`capability-selector` vs a stale copy in
   `model-card`) — dedupe onto `CapabilityIcon`.
