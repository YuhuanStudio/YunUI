# CodeBlock v4 design review proposal

Status: owner review pending. These are candidate defaults only; no visual or API change is approved. All code here is isolated research preview code. Nothing in `src/`, `styles/`, public docs, or package exports was changed for this proposal.

Review page: `http://localhost:3947/prototype/codeblock-v4` (temporary app copy; the normal docs server on 3941 is untouched). The page compares the public `MarkdownRenderer` in an actual `ChatMessage` and an ordinary article, plus the public `patterns/CodeBlock` tabbed example. Select short, 12-line, 80-line, and single-long-line samples; review at 390, 768, and 1440 pixels in light and dark themes. Captures and measurements are under `research/ai-refactor/codeblock-v4/`.

## Proposed defaults and compatibility

| Surface | Current default | Candidate default | Compatibility and preserved behavior |
| --- | --- | --- | --- |
| `content/CodeBlock` direct export | Full card/window header, 16px code inset, line numbers off, 25rem internal vertical scroll cap, 14px code text | Compact one-row metadata/actions, about 8px inset, no reserved line-number gutter; auto-fold only when over 16 lines to first 8 lines; recommend 14px for reading, with 13px as a compact option | Keep the same export and all current props. Keep filename, Shiki themes/grammar fallback, line highlighting, copy, and optional `onEdit`. Add a comfortable/standalone opt-in for the old window appearance if the owner wants it. |
| Markdown fenced code via `MarkdownRenderer` | Same full content `CodeBlock` card and `my-4` block margins for every fence | Compact by default; short and 12-line code fully visible; >16 lines folds to 8 plus a visible “Show all N lines” control; recommend 14px for reading, with 13px as a compact option | Keep Shiki; keep `onCodeEdit`, line-number/highlight metadata and filename parsing. Copy always receives the complete source, including while folded. |
| `patterns/CodeBlock` direct export | Full card/window header; line numbers enabled by default; tabs/copy; no vertical cap or fold, 14px code text | Compact by default; gutter off unless requested while its lightweight tokenizer remains active; tabs/copy remain available; >16 lines shows exactly 8 actual lines and “Show all N lines”; recommend 14px for reading, with 13px as a compact option | Keep the export, tabs, filename/language, explicit `showLineNumbers`, copy and tab selection. A comfortable opt-in can retain the current shell. Do not replace its small tokenizer with Shiki. |
| `InlineCode` and Markdown inline code | Text-sm code token with horizontal margins, 6px side padding, subtle fill and border | Remove extra horizontal margins and border; use a lighter fill and roughly 3px side padding; keep `wrap-break-word` | No API change. Preserve long-token wrapping. |

The visual defaults are pending owner approval. The review recommendation is compact by default with 14px code text for ordinary reading and a 13px compact option; 16 lines is the proposed auto-fold threshold and 8 lines the proposed preview length. Twelve lines intentionally stays fully visible to preserve context in ordinary examples. The long-single-line case never folds vertically; it stays unwrapped, horizontally scrollable, focusable, and shows a visible “Scroll horizontally” cue.

## Why a shared shell, not a shared renderer

Keep both public `CodeBlock` exports and their existing code paths. Share the layout primitives and compact interactions only. `content/CodeBlock` must keep its on-demand Shiki core, JavaScript regex engine, shared highlighter promise, curated dynamic grammar/theme imports, theme switch, fallback plaintext, highlighted lines and `onEdit` callback. The `patterns/CodeBlock` remains dependency-light and keeps its selectable tabs and selected-tab copy behavior. A shared `CodeSurface` could accept rendered code content and provide shell, line metadata, copy/edit actions, collapse, and scroll affordances, while each component supplies its existing renderer. Do not import Shiki from the patterns entry point or route Markdown through the basic tokenizer.

The compact layer must copy the original code string, never the eight visible rows or highlighted DOM. The prototype tests copy from a folded 80-line sample and from a selected pattern tab. Collapsed tabs show exactly eight source lines and do not allow keyboard scrolling through the hidden remainder; the expansion button exposes the full 80 lines. Copy remains available while collapsed and targets the full selected tab. For content code, the outer code viewport stays focusable when horizontally scrollable. The prototype adds arrow/page key handling on the focused overflow element because Chromium did not scroll these focusable regions from default Arrow/Page keys alone. It prevents default only when the element can actually move, and ignores buttons and other descendants. That handler is a candidate behavior only. Final semantics and screen-reader behavior still need accessibility review.

## Existing measurements

`measurements.json` records 144 post-fix baseline/candidate measurements: block, header and code viewport dimensions, header share, actual code font/line-height, inline-token metrics, and scroll extents for each width/theme/sample/placement/font-size combination. After the Shiki settlement fix, representative screenshots were refreshed for 3, 12, and 80 lines: Chromium has 54 13px chat/article/tabbed cases, 12 expanded 80-line chat/article cases, and 24 14px chat/article comparisons; WebKit has the same 54 + 12 + 8. They cover mobile, tablet and desktop in light/dark without repeating the old full matrix. The earlier `captures/final-13px/`, `captures/final-14px/`, and `captures/webkit/` sets predate the Shiki fix and must not be used for owner review. Use the current `captures/post-shiki-fix/` set. Screenshots use normal chat/article context rather than an artificial card around a code sample.

Observed in the baseline source and rendered captures:

- Each content fence starts with a full-width header of approximately 41px before the code pane, plus the Markdown `my-4` spacing. Its panel adds 16px padding. A 12px code token then appears inside a nested card boundary with traffic lights, metadata badge, and text button.
- The pattern header is likewise a separate toolbar, and its default line-number column occupies layout width even when its numbers are hidden until hover. The 80-line pattern example grows to the full transcript height because it has no cap.
- Content code's 80-line example is clipped to a 25rem scroll viewport, but the frame presents no line count or expand action; a single long line is clipped at the right edge until the user discovers horizontal scrolling.
- Compact candidate removes nested-card presentation and reduces the metadata row; the 80-line candidate initially occupies an 8-line viewport while Copy still targets the full source.

Use the actual numbers in `measurements.json` for the specific viewport and theme under review; do not infer a universal percentage from one image. The preview imports the rebuilt `dist` entry with stable highlight defaults and exact child-string preservation. The token-span/settlement evidence is recorded in `INTERACTION-CHECKS.md`.

For a concrete 390px light-mode Chromium comparison, block heights include the current content renderer's 32px `my-4` margins:

| Scenario | Baseline | Candidate 13px | Candidate 14px |
| --- | ---: | ---: | ---: |
| Markdown in chat, 3 lines | 190px | 116px (−39%) | 111px (−41%) |
| Markdown in chat, 12 lines | 406px | 311px (−23%) | 293px (−28%) |
| Markdown in chat, 80 lines | 486px | 267px (−45%) | 267px (−45%) |
| Markdown in chat, one long line | 142px | 73px (−49%) | 71px (−50%) |
| Tabbed `patterns/CodeBlock`, 80 lines | 1,685px | 242px (−86%) | 230px (−86%) |
| Tabbed `patterns/CodeBlock`, one long line | 105px | 112px (+7%) | 110px (+5%) |

The long-line tabs case is slightly taller because the candidate makes horizontal scrolling discoverable and keeps all three tabs and copy available. The proposal trades that small height cost for a clear affordance. At this viewport, the compact content header is 33px versus the current 52px; the Shiki text is 13px/20.15px computed line-height or 14px/21.7px, while the `.line` rule keeps a 24px minimum row height. Current content text is 14px/23.8px line-height. The pattern renderer text is 14px/20px now and 13px/19.5px or 14px/21px in the candidate. This shows the savings with both candidate font sizes. The sample inline `pnpm test` token measures 89.9px now and 75.8px in the candidate; the candidate uses 12.88px text, 3px horizontal padding, and no horizontal margin/border, compared with the current 14px text, 6px padding, 2px margin each side, and 1px border. Those values are detailed per case in `measurements.json`.

## Interaction and verification still required

Chromium and WebKit prototype checks cover exact full-source copy in folded/expanded content and tabbed examples; the optional `onEdit` payload receives all 80 lines; the folded pattern preview shows exactly 8 lines and cannot scroll through hidden rows; the full 80 lines appear after expansion; and long-line code scrolls from the focused viewport. Both engines pass the interaction checks in `INTERACTION-CHECKS.md`. The preview does not yet include explicit line-number/highlight-line interaction cases or true-black screenshots. Before any production implementation, those cases, touch horizontal scroll, line numbers/highlighted lines, optional edit payload in the real public component, light/dark/true-black Shiki changes, highlighter loading/hydration, reduced motion, and labels/localization for “Show all”, “Show less”, line counts, and scroll-region names remain approval gates. Keep SSR-readable code and avoid new eager language/theme imports. Confirm direct default exports are compact and the `comfortable` opt-in faithfully approximates the old shell before choosing whether to retain it.
