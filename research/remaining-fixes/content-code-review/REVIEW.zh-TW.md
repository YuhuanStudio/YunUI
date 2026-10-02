# Content／CodeBlock review

Review scope: src/content/code-block.tsx, src/patterns/code-block.tsx, src/lib/code-block.ts, src/lib/clipboard.ts, src/content/markdown-renderer.tsx, src/content/remark-code-meta.ts, src/content/sanitize-markdown.ts, src/content/content-image.tsx, and related focused tests/docs. No source outside the two CodeBlock components and their focused tests was edited in this review.

## Confirmed issues fixed

- **P2 — stale “Copied” confirmation after content changes.** Both CodeBlocks awaited the clipboard request and then unconditionally set the shared copied state. If clipboard permission resolution lagged while the Markdown code or active Pattern tab changed, the old payload could be copied correctly but the new payload would be labeled “Copied.” A previous 2-second timer could also clear the confirmation for a later copy. Fixed by request generations, invalidation on payload changes, one tracked timer, and unmount cleanup in [content CodeBlock](../../../src/content/code-block.tsx:394) and [Pattern CodeBlock](../../../src/patterns/code-block.tsx:284). Regressions defer clipboard resolution across a code update/tab switch and overlap same-payload copy timers in [code-block-compact.test.tsx](../../../src/__tests__/code-block-compact.test.tsx:49).
- **P2 — Pattern tabs lost selection when host data changed.** Selection was stored as an array index. Selecting the third tab and then receiving a reordered or shorter tabs array could silently select different code, or fall back to tabs[0] while every tab button reported aria-pressed=false. Fixed to track the stable tab id, retain it through reorder, and select the first available tab if the selected id is removed in [patterns/code-block.tsx](../../../src/patterns/code-block.tsx:199). The reorder/shrink regression is in [code-block-compact.test.tsx](../../../src/__tests__/code-block-compact.test.tsx:29).

## Security, payload, and runtime review

- Markdown raw HTML is sanitized before KaTeX rendering. Dangerous embedded tags and attributes are removed; href/src are protocol-filtered after custom URL rewriting. Fence options are converted only to bounded line ranges and percent-encoded filename class tokens, then revalidated by the sanitizer before rendering. Matching adversarial tests are in markdown-safety.test.tsx and markdown-code-meta.test.tsx.
- Code payloads remain full and exact: folding changes only shownCode; Copy and Edit use the unabridged code/current tab. Unknown Shiki grammars fall back to escaped plaintext. Root also added own-key guards for language maps after finding prototype-named language labels; retain explicit __proto__ and constructor regressions for both direct ContentCodeBlock and Markdown fences.
- ContentImage rejects stale image state updates across src/srcSet generations, retries after source-set changes, handles absent IntersectionObserver, and avoids turning linked images into nested zoom controls. Sanitizer and image tests cover protocols, malformed/raw content, linked images, source changes, and keyboard/focus behavior.
- Focused validation after the fixes: **46 tests passed across five files**, tsc --noEmit passed, and git diff --check passed. I did not run or alter the integrated build.

## Remaining integration caveat and coverage notes

The content export still has static imports for optional React Markdown/remark/rehype/Shiki peers (visible in dist/content.js). Its per-language Shiki fallback catches grammar/render failures after module loading; it cannot recover if a peer package is absent at module resolution time. This predates the reviewed changes, and consumers of ./content need its rendering peers installed. The new rehype-sanitize package is a normal runtime dependency, so the added sanitizer itself is present in published installs.

Docs have been updated in English, Simplified Chinese, and Traditional Chinese for compact code blocks, metadata, sanitized URL behavior, and ContentImage zoom labels. The test suite exercises DOM focus restoration and the scroll snapshot helper, but does not yet drive a real browser through disclosure expansion inside a nested scrolling host while asserting both window and ancestor scroll positions. That remains the main content-specific browser-integration gap; it does not invalidate the focused component tests above.

## 最新整合驗證（snapshot 3964）

在最新 dist/site build 建立的獨立快照 `http://127.0.0.1:3964` 上，`content.spec.ts`、`chat.spec.ts`、`agent-chat.spec.ts`、`model-select.spec.ts` 的 Chromium + WebKit 套件 **188/188 通過**。另外針對實際 `/docs/chat` 中 80 行 CodeBlock、`data-scroll-container` ChatMessageList 和頁面 window 的展開／收合位置驗證 **2/2 通過**；收合後的 scrollTop 以新內容高度可達的最大值為準，避免把瀏覽器合法 clamp 誤判成捲動遺失。

最新兩個 CodeBlock 入口共 **72 張**截圖已從正式 3964 頁面擷取，涵蓋 Chromium/WebKit、390/768/1440px、light/dark、ContentCodeBlock 的短碼／折疊長碼／展開長碼／12 行工具輸出，以及 Pattern CodeBlock 的 npm/pnpm tabs。索引與逐張圖在 [captures-3964](captures-3964/log.json)；各型態 montage 為 `montage-content-short.png`、`montage-content-long-folded.png`、`montage-content-long-expanded.png`、`montage-tool-output-12.png`、`montage-pattern-tabs-npm.png`、`montage-pattern-tabs-pnpm.png`。截圖流程沒有 page/console error、非預期 request failure 或 HTTP 4xx；Next 導覽 teardown 的 `_rsc` aborts 分開記錄。

### 3964 時尚待處理、已在 3967 重驗通過的窄版問題

在 Chromium 390px light（同類 dark 畫面也有）[舊短碼截圖](captures-3964/chromium-390-light-content-short.png) 中，ChatMessage 內的 `route-checks.ts` header 只露出首字母 `r`。已在 `src/content/code-block.tsx` 的 metadata filename span 增加最小寬度，並補上 browser regression；3967 Chromium + WebKit focused 測試均通過，並以新矩陣逐張檢視。

ModelSelect 的回歸測試已由整個 button 的文字改為直接檢查已選模型名稱 span；原因是 icon 載入失敗時 ProviderIcon 會渲染可見初始字母 `A`，它也會計入 button text。這是測試對象修正，沒有改產品元件。第一次隔離 snapshot 曾漏複製 public 資產，已補齊並重啟 3964；最終 188-case rerun 與 72 張 capture 均使用補齊 public 的同一個最新快照。

## 最終整合驗證（snapshot 3967，未發布）

在 `http://127.0.0.1:3967` 的獨立 site snapshot 上，production build 成功；`/docs/chat`、四個 conversation-unit 文件頁、`/showcase` 和 logo 資產皆回 HTTP 200。針對變更範圍的 **120/120 Chromium + WebKit 測試通過**：`conversation-units.spec.ts` 的 12 種尺寸／主題整合截圖與狀態操作、4 個獨立元件 demo 的實際 route/render、SelectionActions 的 result/error/空字串刪除 Axe 與 270px host 的逐 action focus/keyboard callback，以及 `agent-chat.spec.ts` 的完整狀態／互動矩陣和窄版 CodeBlock filename regression。Root 另行確認 421 個單元測試、31 個 tooling 測試及 publint 均通過。

在 Chat 頁面直接擷取 **80 張**元件級圖：四個公開 conversation units 各涵蓋 Chromium/WebKit、390/768/1440px、light/dark；另含 Chat demo、`/showcase` viewport 與 270px SelectionActions host 的 idle/空字串 result。`captures-3967/log.json` 記錄 80 張圖、0 個失敗、0 個 page/console error、0 個非預期 request failure、0 個 HTTP error；99 個 Next `_rsc` teardown abort 單獨列出。元件 crop montage 在 `captures-3967/montage-components-chromium.png`、`montage-components-webkit.png`、`montage-narrow270.png`，Showcase 矩陣在 `montage-showcase-chromium.png` 和 `montage-showcase-webkit.png`。已檢視這些圖；初次 3966 檢視曾發現 DiffTable 的錯誤/成功背景 token 未套用、ContextCards 的 MD 標記換行，以及窄版 DiffTable 欄文字直排，root 修正後 3967 截圖顯示背景色與標記恢復、MD 單行、欄位可讀。

此外，在不受這次 conversation-unit 外觀修正影響的 3966 snapshot 擷取並檢視 **72 張** ContentCodeBlock／Pattern CodeBlock 圖，覆蓋兩引擎、390/768/1440px、light/dark、短碼、折疊／展開長碼、12 行工具輸出及 npm/pnpm tabs。捕捉記錄為 `captures-3966/log.json`，0 個失敗、page/console errors、非預期 request failures 或 HTTP errors；180 個 Next `_rsc` 導覽中止另外記錄。完整套件在修正 WebKit 跨路由預取競態的測試結構後，於 3966 **248/248 通過**；該全套件早於最後的 conversation-unit CSS 修正，最新變動範圍以 3967 的 120/120 結果為準。

## 最終容器調整與 undefined label fallback（snapshot 3968）

最終 3968 snapshot `http://127.0.0.1:3968` 包含 SelectionActions 窄容器 prompt、DiffTable 窄 footer 排版，以及 labels `undefined` 時使用預設值的 fallback。受影響的 Chromium + WebKit focused browser checks **18/18 通過**：conversation-unit 12 種 viewport/theme、4 個元件 demo route、SelectionActions result/error/空字串 deletion 的 Axe 與 270px host 操作，以及 CodeBlock filename 窄版回歸。Root 另確認本次最終 source 有 423 個 unit tests、31 個 tooling tests 通過，publint 也通過。

3968 的元件級圖共 **40 張**，存於 `captures-3968`：SelectionActions 與 DiffTable 的兩引擎 × 390/768/1440px × light/dark 矩陣 24 張；270px host 的 selection toolbar、DiffTable，以及獨立 idle/空字串刪除畫面 16 張。capture log 有 0 個失敗、page/console errors、非預期 request failures 或 HTTP errors；78 個 Next `_rsc` teardown abort 分開記錄。窄版 1440px host 的 DOM 量測確認 Explain 按鈕可讀（寬 81.5px），DiffTable count 只佔一行。已檢視 [Chromium light montage](captures-3968/montage-chromium-light.png)、[Chromium dark montage](captures-3968/montage-chromium-dark.png)、[WebKit light montage](captures-3968/montage-webkit-light.png)、[WebKit dark montage](captures-3968/montage-webkit-dark.png) 與 [270px host montage](captures-3968/montage-narrow270.png)。代表圖：[270px idle Explain](captures-3968/chromium-1440-light-narrow270-selection-demo-idle.png)、[WebKit narrow toolbar](captures-3968/webkit-1440-dark-narrow270-selection-actions.png)、[WebKit narrow DiffTable](captures-3968/webkit-1440-dark-narrow270-diff-table.png)。此前 3967 的 StreamingText、ContextCards、Chat／Showcase 與 CodeBlock 72 張矩陣未受這些容器規則及非視覺 label fallback 影響，沿用其有效證據。
