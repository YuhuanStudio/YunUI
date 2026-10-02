Owner approval update (2026-10-02): the owner reviewed the source-adapted packet and approved all four for production integration. See `research/ai-refactor/upstream-gap-review/APPROVAL.zh-TW.md` and `research/ai-refactor/production-conversation-units/INTEGRATION.zh-TW.md`. Earlier pending labels below describe the historical review stage.

# Beautiful UI chat primitives — YunUI review port

This isolated React/Vite review app copies and adapts upstream component source from Beautiful UI commit `44a274e598395ab61e7c96c26fda2758780253b7` (MIT). It is research-only and is not part of YunUI exports, site routes, or the package build.

| Review unit | Copied source | Adaptation boundary |
| --- | --- | --- |
| StreamingText | `reference/beautiful-ui/components/primitives/StreamingText.tsx` | Retains source answer/action/source/follow-up DOM and SVGs; removes local sample tokens, timer reveal, and auto-loop; accepts host stream state/content/callbacks. |
| ContextCards | `reference/beautiful-ui/components/primitives/ContextCards.tsx` | Retains source card/header/source-pill DOM and geometry; removes fixture chunks/count/timer; accepts host rows and source/selection callbacks. |
| SelectionActions | `reference/beautiful-ui/components/primitives/SelectionActions.tsx` | Retains selected-passage anchor measurement and floating pill layout; replaces Iconoir imports with YunUI's existing Lucide dependency; removes fake rewrite and timers; receives host state/result and request/accept/dismiss callbacks. |
| DiffTable | `reference/beautiful-ui/components/primitives/DiffTable.tsx` | Retains source card/fixed table/row selection marks/footer; removes hardcoded ice-cream rows, reveal timer, local edit map, and optimistic applied state; controlled host ID/state contract. |
| Supporting atom | `reference/beautiful-ui/components/atoms/Button.tsx` and `reference/beautiful-ui/lib/utils.ts` | Copied because DiffTable and SelectionActions use the upstream button; import path adjusted to the local research helper. |

The copied-source license notice is served at `/licenses/beautiful-ui-MIT.txt`. UI fixtures in `src/App.tsx` are host props only; button interactions record requests in local fixture state and never call a backend. All four appearances were approved on 2026-10-02 and integrated into production. See [approval](APPROVAL.zh-TW.md) and [current integration](../production-conversation-units/INTEGRATION.zh-TW.md).

Run from this directory with `pnpm exec vite --config vite.config.ts --host 127.0.0.1 --port 3963 --strictPort`. The app uses the installed workspace runtime without adding package dependencies. `capture-matrix.mjs` captures Chromium and WebKit at 390/768/1440 in both light and dark modes and writes `evidence/matrix.json`; `check-interactions.mjs` drives host fixtures in both engines at 390px.
