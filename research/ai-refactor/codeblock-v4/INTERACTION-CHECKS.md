# Prototype interaction checks

Run against the isolated Next app at `http://localhost:3947/prototype/codeblock-v4` with Playwright Chromium and WebKit. These are review-prototype checks, not production regression tests.

After root rebuilt `dist` with a stable empty `highlightLines` default, the isolated 3947 server was restarted with a fresh Next dist directory. Chromium confirmed two Shiki wrappers, 36 token spans, six source lines highlighted, no page errors, and zero observed comparison-DOM mutations over 700ms after load. WebKit measured the same 2/36/6 counts and zero mutations. The post-fix screenshots now show syntax-token colors in both the baseline and candidate; the earlier full matrices captured during the render-loop defect are superseded by `captures/post-shiki-fix/`.

- 3- and 12-line examples stay fully visible; no fold action appears.
- The 80-line candidate begins folded. `Copy full code` while folded matches the baseline renderer's full source. The optional Edit action receives `verify-navbar.ts` and all 80 lines.
- `Show all 80 lines` exposes exactly 80 code lines.
- A single long line stays unwrapped inside an `overflow:auto`, `tabIndex=0` scroll viewport. In the check viewport its scroll extent is 4080px vs 569px client width.
- The prototype provides key handling only when focus is on the actual scrollable code viewport. ArrowLeft/ArrowRight move a long line horizontally; vertical arrows/PageUp/PageDown work only when the focused region has additional vertical content. A key at the scroll boundary is not prevented. Browser ArrowRight moves the long-line pane 48px. This handler is review behavior, not present in the released components.
- The tabbed-pattern 80-line example exposes exactly eight preview lines, with no scrollable hidden rows under the collapsed state. “Show all 80 lines” reveals all lines; the tabs remain selectable, and both collapsed and expanded copy use the complete selected tab. Switching to Python then copying returns the Python tab content.

Chromium and WebKit both passed these interaction assertions. Chromium read the browser clipboard after the copy controls ran. WebKit does not accept Playwright's `clipboard-read`/`clipboard-write` permission grant, so the WebKit run provided a deterministic `navigator.clipboard` test stub and asserted the complete string written by the UI. Its single-line viewport scrolled 48px with ArrowRight (4188px scroll width / 569px client width); Chromium's was 4080px / 569px. Screenshots are in `captures/final-13px`, `captures/final-14px`, and `captures/webkit`.

The current preview CSS keeps the full code in the component props during collapse; it does not derive copied text from the visible preview. The host Edit callback receives the unchanged full source payload.
