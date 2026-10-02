# CodeBlock v4: embedded-use audit and compact proposal

Status: design exploration only. No production component, stylesheet, or public prop has changed.

## What is rendered today

There are two separate public components with the same name and different cost/behavior:

- `@yuhuanowo/yunui/content` exports a client-side Shiki `CodeBlock` (`src/content/code-block.tsx`). `MarkdownRenderer` routes every fenced code block through it (`src/content/markdown-renderer.tsx`); its `<pre>` wrapper is removed after the code child is recognized. It supports optional line numbers, highlighted lines, filename, copy and host `onEdit`; code/grammar/theme are highlighted after mount through one shared highlighter with dynamically imported grammar/theme modules. Theme changes rerun highlighting. A 400px code viewport scrolls vertically; a long line scrolls horizontally. There is no line-count collapse. Unknown languages fall back to plaintext. Current source and rebuilt `dist` preserve the exact child string.
- `@yuhuanowo/yunui/patterns` exports a separate hand-tokenizing `CodeBlock` (`src/patterns/code-block.tsx`). It supports tabs, filename/language, line numbers and copy, defaults line numbers on, and uses a lightweight regex tokenizer rather than Shiki. It has no edit/highlight-line API and no code-height or line-count collapse. Its scrollable `<pre>` is keyboard-focusable.

Both components render a full card/window treatment for every snippet. The content version adds `my-4`, an outer `card`, a 1px frame, header border/surface, three 8px traffic-light dots, language badge or filename, action text/icon controls, then a separate code surface with 16px padding. The header alone is about 41px tall before the code starts. A three-line block therefore spends substantial height on the frame and header rather than the code; repeated snippets compound that cost in prose and assistant messages. The `patterns` version adds the same window dots and similar header, plus line-number cells by default; line-number digits are opacity-zero until hover but their gutter remains allocated. This is more chrome than an inline response or explanatory paragraph needs.

## Root causes to validate visually

1. Full window chrome is unconditional: no inline/compact density exists for embedded contexts.
2. Content Markdown inherits `my-4` on every fence, even inside a dense message body.
3. Both headers have independent padding, border, background and copy affordance; filename/language plus traffic lights occupy a dedicated full row.
4. `patterns/CodeBlock` reserves a gutter by default even when numbers are hidden until hover; `content/CodeBlock` defaults them off but Shiki can still emit a wide code layout.
5. Vertical overflow is scroll-only. Long code is capped at 25rem in the content component, but it still consumes up to that height; pattern blocks have no analogous cap. There is no labeled expand/collapse control or visible line-count cue.
6. Horizontal scrolling exists, but it is inside a generic focusable region (`content`) or `<pre>` (`patterns`); the narrow viewport needs a strong visible cue and the focus stop must expose the entire code without clipping/line wrapping.
7. The public APIs split styling/layout from highlighting strategy. Replacing Markdown's Shiki renderer with `patterns/CodeBlock` would regress language coverage, token fidelity, line highlighting, edit callback, and potentially tree-shaking assumptions.
8. Inline code uses a dense token capsule (`px-1.5 py-0.5 mx-0.5` plus a hairline border) inside ordinary prose. At a 16px root size, each token adds 4px of horizontal margins, 12px of padding, and 2px of border before its glyphs. The spacing is visible in ordinary sentences such as “Run `pnpm test` after setting `linkOrigin`.” The wrap-break-word rule must remain so a single long token cannot widen a narrow message.

These are source-observed causes. Exact height/area impact must be measured in the browser grid before selecting defaults.

## Compact proposal for owner review

Keep both exports and all existing props. Introduce a shared visual shell/layout primitive, not a shared highlighter: each entry point keeps its current highlighter, grammar loading, tabs, edit action, line highlights, and copy source. Since the owner asked for the everyday compact treatment in all contexts, the candidate default is compact for both direct exports and Markdown rendering; a named `comfortable`/`standalone` mode may remain as an explicit opt-in to the old window chrome. Showcase demos should exercise the actual default compact mode rather than creating a separate, hand-polished skin.

Candidate visual treatment (not implementation): a single low-height toolbar integrated into the code surface; no traffic-light dots in compact mode; language/filename as quiet left metadata; copy and optional edit as icon-first controls with accessible names; 8–10px code inset; no reserved line-number gutter unless numbers are actually requested. Use a hairline outline/background consistent with YunUI, without nested surfaces.

Candidate collapse behavior in the current preview: keep 3-line and 12-line snippets fully visible; only auto-collapse beyond 16 lines, showing the first 8 lines and a visible “Show all N lines” control. This intentionally tests a 12-line block in full so readers retain enough context for ordinary examples. Expanded content stays in flow and has a focusable horizontal-scroll viewport for long lines. Toggle back with “Show less”; preserve scroll position where possible. The copy button always copies the exact full source even while collapsed. Do not use CSS line-clamp on the only accessible code text, and do not derive the copy payload from visible DOM. The 80-line and long-single-line cases still need explicit keyboard, touch, and screen-reader review before approval.

Candidate API questions (no API chosen):

- `density?: "compact" | "comfortable"`, defaulting to compact for both public exports, or a semantic `variant?: "embedded" | "standalone"` with the compact mode as its everyday default.
- `collapse?: "auto" | "none"` and `collapsedLines?: number` versus one `maxPreviewLines` prop. Preview currently hard-codes 16 as the auto-collapse threshold and 8 as the preview length; exposing either as an API is still undecided.
- Keep the current `CodeBlock` names/exports; compatibility is additive props and visual defaults. `showLineNumbers`, `highlightLines`, `filename`, `onEdit`, pattern `tabs`, and copy semantics remain orthogonal. Candidate direct defaults remove the reserved line-number gutter (still available with `showLineNumbers`).
- Avoid `compact` changing copy/highlighting; avoid a second public export name unless the two implementations prove structurally incompatible.

No accessibility or visual decision is assumed approved. In particular, whether auto-collapse starts at 12, 16, or another line count; whether a one-line long command gets a distinct overflow cue; and whether direct exports adopt compact defaults remain for owner review.

## Review matrix

The preview should put snippets inside real message and paragraph prose, not in a component showcase card only. Compare current public renderer against the candidate in each combination below:

- Length: 3 lines, 12 lines, 80 lines, and a single very long line (no wrapping).
- Placement: MarkdownRenderer in a chat assistant message; MarkdownRenderer in a narrow reading column; standalone `content/CodeBlock`; standalone `patterns/CodeBlock` with tabs.
- Width: 390px mobile, 768px tablet, 1440px desktop.
- Theme: light and dark.
- Interaction: copy full content collapsed/expanded; expand/collapse with keyboard; focus and horizontally scroll a long line; optional Edit; line numbers and highlighted lines; pattern tab switching; Shiki first-render loading and dark-theme switch.

The isolated preview on port 3947 has a 4-sample × 3-placement × 3-width × 2-theme matrix: 72 primary screenshots (chat assistant message, ordinary docs article, and direct `patterns/CodeBlock` tabs), plus 12 expanded 80-line chat/article captures. It also keeps the highlighter's line-number/highlight/edit controls available in the component API audit; they need targeted screenshots and interaction checks before implementation. The D4 research preview remains on 3946.

## SSR and bundle constraints

`src/content/code-block.tsx` is a client component and performs Shiki work in an effect; the first render emits readable plain code while loading, then swaps in tokenized HTML. Root fixed two production issues before this final review capture: the default `highlightLines` array is now a stable module constant (so the effect settles), and code text is preserved exactly (including indentation/trailing blank lines). The isolated preview was restarted against that rebuilt `dist`. Its 3-line ChatMessage has two Shiki wrappers, 36 styled token spans and 6 source lines, then zero comparison-DOM mutations over 700ms with no page errors. The post-fix captures show syntax tokens. The measured 3/12/80-line block heights are unchanged from the earlier fallback captures; this fix changes highlighting settlement and source fidelity, not compact layout geometry. Any compact/collapsed markup should keep the full original string in the component props, avoid eagerly importing all grammars/themes, and reuse the current shared `getContentHighlighter`, grammar alias table, and dynamic imports. Do not route Markdown to the patterns tokenizer to save height. Verify no new eager import of the `shiki` barrel or all-language bundle, no duplicate highlighter per block, no hydration-only hidden payload, and no interaction that copies only a visible preview.
