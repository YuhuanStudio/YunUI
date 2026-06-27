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

## Fixed — a11y + structural follow-ups (commit ed9990d, blog-card)

- **Dialog focus traps.** `Sheet`, `ConfirmModal`, `ConfirmCloseDialog` now use
  `useFocusTrap` (Tab containment + focus restore; Sheet also gains role=dialog /
  aria-modal / aria-labelledby). The confirm dialogs keep their existing initial
  focus. A new Sheet focus-trap test guards it (and caught a deferred-mount bug:
  the trap flag must include `mounted` so the effect runs after the ref attaches).
- **BlogCard** moved to the stretched-link a11y pattern: one overlay adapter
  `Link` for the card, tag chips lifted above it (`z-10`) as their own adapter
  `Link`s — no more `<button>`-in-`<a>` nesting or `window.location` full reload.

## Decided / deferred — with rationale (NOT changed)

1. **Two color systems — DECIDED: legacy flat is canonical for status.** Evidence:
   the layered `*-{danger,success,warning,info}-*` status utilities are used by
   **zero** components (only the legacy `.text-*` / `.bg-*-soft` / `.badge-*`
   helpers are), so the `#ef4444`-vs-`#FF5F53` drift is purely latent. Components
   must use the legacy helpers for status (see
   `[[yunui-semantic-color-vocabulary]]`). Rewriting the generated once-ui ramps to
   bridge unused tokens risks the brand/accent/neutral ramps that **are** used, so
   the generator is intentionally left untouched; revisit only if a consumer needs
   the layered status utilities.
2. **Radius tokens — deferred.** Nine ad-hoc radii (4–20px) work and are visually
   fine; tokenizing as `--radius-sm/md/lg/xl` is pure polish with broad churn and
   no user-facing bug. Worth doing in a dedicated pass.
3. **ModelSelect result rows** are mouse-only (`<div onClick>`). The trigger now
   has aria-expanded/haspopup + a focus ring; a full roving-focus `role=listbox`
   with arrow-key nav is a feature-sized change, deferred to its own task.
4. **Duplicated capability color map** (`capability-selector` vs a copy in
   `model-card`) — internal cleanliness with appearance-parity risk; no user-facing
   bug. Deferred to a dedicated dedupe onto `CapabilityIcon`.
