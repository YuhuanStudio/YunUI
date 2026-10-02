# D4 真實使用路徑覆蓋報告

**狀態：待 owner 審核。** 本報告僅涵蓋 `prototypes-v4` 本機草案，不是 shipped UI 驗收或設計批准。

預覽：<http://localhost:3946>。對照文件元件區域是目前工作樹 `/docs/chat`，同一 fixture 狀態/主題。CodeBlock 完整情境研究：<http://localhost:3947/prototype/codeblock-v4>。D4 不呼叫模型、工具、搜尋、授權、檔案上傳或後端。公開 renderer 與 CodeBlock 直接從當前本機 `dist` bundle 引入。

## 執行證據

- After the compact code update, `build.mjs` rebuilt the latest local public dist into the D4 research bundle; targeted Chromium/WebKit capture below passed.
- Original unaffected-state run: 60 viewport images plus 42 interactions. The changed Done/Working code surfaces have 24 current matrix images (2 states × 3 widths × 2 themes × 2 engines) plus 4 copy/expand/edit interaction images.
- Original full-run evidence remains in `captures/capture-log.json`; its older Done/Working code shell captures are superseded. Current changed areas use `captures/codeblock-update/capture-log.json`, with all failure/error arrays empty and localhost:3946 as its only origin.
- `verify-approval-scroll.mjs`：Chromium/WebKit 均通過，Next 真正取得焦點；截圖頁的按鈕下緣到 composer dock 間距 8.08px。當前獨立驗證結果記錄在 `captures/approval-scroll.json`。
- `capture-compact-code.mjs` asserts 14px computed code size, complete filename title, exact 3/12/80 source line counts, complete clipboard payloads, 80-line expand/collapse and focus restore, and the host edit callback in both engines.
- Updated visual montages: `captures/codeblock-update/done-matrix-montage.png` and `captures/codeblock-update/working-matrix-montage.png`; each includes Chromium and WebKit at 390/768/1440, light and dark.
- 此前一次 capture 執行於 slash-menu 可見性 assertion 中斷，且沒有瀏覽器錯誤。針對相同 source/middle-caret 序列做了獨立重現，確認 slash 選單與 `/review` row 確實存在；用新 bundle 的最終完整重跑通過，沒有略過該功能 assertion。

## 內嵌 CodeBlock 更新（取代較早的披露版本）

依 owner 觀察移除舊 Shiki traffic-light header/80-line 原生 details 的重複外殼。新本地 adapter `upstream/CompactCodeBlock.tsx` 依 `research/ai-refactor/codeblock-v4/Prototype.tsx` 的 `CompactCandidate` 行為：14px code、完整 filename title、語言/行數 metadata、完整原始碼複製、Edit host callback、超過 16 行折疊至 8 行並在 Show all/Show less 間切換。預覽及展開狀態內部均用公開 `@yuhuanowo/yunui/content` CodeBlock renderer。Done 訊息直接含 3 行案例與 80 行案例，不另套第二層原生 details；Working tool output 的 12 行案例也使用相同 adapter。只修改本機 `research/ai-refactor/prototypes-v4`。

`capture-compact-code.mjs` 有實際行數、無橫向頁面溢位、copy完整payload、80行展開/收合及焦點復原、Edit callback assertions。最終目錄 `captures/codeblock-update/` 有 24 張 Done/Working × 390/768/1440 × light/dark × Chromium/WebKit viewport captures，另有 4 張雙引擎 expanded/copy/edit captures；其 JSON log 沒有 page/console/network/http error。矩陣與代表圖分別在 `done-matrix-montage.png`、`working-matrix-montage.png`、`chromium-1440-light-done.png` 和 `webkit-tool-copy-edit.png`。

## 實際案例與結果

| 範圍 | 驗證方式 | 結果 |
| --- | --- | --- |
| 長 user message / scrollback | 本機送出一段長訊息，再送出 9 個跟進；確認內容保留、歷史數量增加、scroll container 形成且閱讀頂端時送出不跳到底 | Chromium、WebKit 通過 |
| 長 assistant Markdown | Done 訊息含多段正文與長路徑 references；確認公開 MarkdownRenderer 完成 render，旁邊的 3 行 compact block 使用公開 CodeBlock | 兩引擎通過 |
| Assistant CodeBlock | 3-line and 80-line `CompactCandidate` shells render the public CodeBlock; 80-line case previews first 8 lines, expands to all 80, collapses with focus restoration | Chromium, WebKit pass; copy payload checked against complete source |
| Tool output CodeBlock | Working expands 12-line `CompactCandidate` with public CodeBlock, full filename metadata, copy and edit callback | Chromium, WebKit pass; no horizontal page overflow |
| CodeBlock 研究 | 3/12/80 行 Chat/Article/Tabs 和 full expand/copy 案例另外存於 `research/ai-refactor/codeblock-v4/captures/post-shiki-fix/` 與 `INTERACTION-CHECKS.md` | 使用同一版本公開 renderer；不把高 iframe 嵌進 D4 |
| 來源選單 | 13 個 host sources；長檔名可見/可選，選取後前後文字保留；來源 list 繪製後無頁面寬溢位 | 兩引擎通過 |
| @ 中間游標 | 輸入 `Check @Web after release.`，將 caret 移至 token 後，選取 Web search；精確檢查 `Check @Web search after release.` 和 host id `web-search` | 兩引擎通過 |
| Slash 中間游標 | 輸入含 suffix 的 `/review`，移 caret 至 token 後，檢查 command host id `review`；文字沒有被偷偷改成由 label 推導的指令值 | 兩引擎通過 |
| IME Enter | 送 composition keydown 229/`isComposing`; 確認輸入仍為 `@`、host notice 不變 | 兩引擎通過 |
| Model picker | 選 Fast model 後驗證 `host-fast` id；停用時不能打開；空選項時 trigger 保持可用並顯示 `No models available` | 兩引擎通過 |
| Closed disclosure | 收合 ThinkingState/ToolChips/TaskRows，驗證內容 inert/hidden；重新展開後可讀；diff hover 顯示來源行程式片段 | 兩引擎通過 |
| Approval busy | busy 時 Allow/Deny、問卷選項/自訂答案/Next disabled | 兩引擎通過 |
| 問卷與決策隔離 | Answer 兩題並提交；答案數到 2，但 phase 保持 approval，notice 指明 tool approval 仍 pending | 兩引擎通過 |
| Allow / Deny / Error | Allow 進 completed；重新切換 Approval 後答案重設為 0；Deny 進 cancelled 且不呈現命令錯誤；Error 獨立顯示 failed `Typecheck failed` task | 兩引擎通過 |
| TaskRows 詳情 | 展開路由結果與長 MDX 路徑；檢查 pathname metadata 不令頁面橫向溢位 | 兩引擎通過 |
| Focus / dock | 手機 Approval 選擇題 → Next，透過 Tab 真正到達 footer；保持 8.08px clearance；Tab/Shift+Tab 可離開自然流程 | Chromium、WebKit 通過 |

### 最後修正和審核觀察

- 起初描述只有「CodeBlock review link」已過時；D4 現在把公開 `MarkdownRenderer`/`CodeBlock` 真正渲染於 assistant reply 與 tool output，另留 3947 作多 placements 對照。
- 13 個來源的 filename 原先可能擠壓選單；現有 row 以可讀名稱和受限 metadata 區域容納長路徑，輸入與頁面都通過 overflow checks。
- Mobile Approval 初始視窗可能在 composer dock 前截到問卷 footer。互動測試會真的前進至 Next 並確認焦點；D4-only copy 以 scroll margin 和自然 Tab 序列解決遮擋，按鈕與 dock 保留 8.08px。這是額外待審 adapter，不是聲稱上游 API 已有此行為。
- WebKit test environment 中一般按鈕序列 A→B→textarea，原生 Tab 曾跳過 B；同頁對照得到相同行為。這是平台/測試環境觀察，未定性為元件缺陷，也不作為正式設計批准。
- 模型空清單、disabled 狀態、source、slash 選取和 IME 都透過 host data/callback fixtures；切換 Approval 後問卷 answer count 回到 0，Deny 與 Error 仍分辨 cancelled 和 failed。

## 覆蓋界線與剩餘審核

- 目前視覺矩陣每張截取 D4 的 `.d4-window` 元件工作區；隱藏的只有文件站 sticky chrome。狀態/主題同步的左基線與 D4 全頁差異可在瀏覽器中直接看；coverage 互動仍用完整頁 DOM。左側基線不是已發布 npm 版本。
- Source callbacks/Allow/Deny/Submit/Send 都只更新 local fixture；不驗證 production backend lifecycle、網路重試、真實檔案上傳、授權或併發。
- 長回覆/程式碼是代表性案例，不是任意超大 payload 壓力測試；CodeBlock 3/12/80 matrices 的真實公開元件效果在 companion review page。
- `PromptBar`、approval keyboard adapter、layout/token mapping 均為隔離於 `src/` 的審稿副本；需 owner 按 D4 外觀與互動逐項核准後，才可考慮任何 production 移植。
