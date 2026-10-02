# AI 互動草案 01：Composer 與代理流程

> 已被 2026-10-01 擁有者的新方向取代：直接以 Beautiful UI 原碼與主要視覺/交互為主體，少量融合 YunUI。本稿保留作研究紀錄，不再作為本輪正式實作的審核候選。新的 D3 預覽在 <http://localhost:3943>，仍待擁有者具體批准。

**狀態：`SUPERSEDED_NOT_APPROVED`。D1 與 D2 均未獲批准，沒有依本稿改動生產元件。以下內容保留為當時草稿紀錄。**

預覽網址：<http://localhost:3942>（本機草案伺服器；需先啟動 `yunui-site` 的本機 CSS／字型服務 `:3941`）。上方提示「草案待審核，不會執行真實操作」。狀態按鈕、選單、送出和核准回呼都只更新瀏覽器內的範例 state，不會呼叫模型、來源、工具或後端。

## D1：撰寫區與情境來源

**待審範圍：** toolbar 內的來源與指令入口、已選來源標籤、模型選擇，以及它們和輸入框的排列。請分開審查此項；D2 核准不代表 D1 核准。

- **現行基線：** YunUI `ChatHeader`、`ChatMessageList`、`ChatMessage` 與 `ChatComposer`；只有訊息、輸入框和送出槽。
- **草案：** 保留同一組聊天元件；使用 `ChatComposer.toolbar` 加入 `@ 來源`、`/ 指令` 按鈕，另以 `Select` 呈現模型選擇，已選來源使用 `Badge`。按來源／指令只改變本地示範選取；送出只轉到「執行中」。
- **狀態／操作：** 預覽上方可切換等待、執行中、待確認、完成、失敗。來源可多選；指令選項填入輸入框；模型選項只切換選取值。完成和失敗展示 API 核對結果示例。切換「現行基線／草案」比較兩種排列。
- **API 邊界：** 現行 `ChatComposer` 提供受控輸入、`onSend`、`toolbar`、`attachments`，但沒有游標位置或 token／caret callback。因此這版明確使用 toolbar 按鈕；不假裝有游標處 `@`／`/` 自動完成。模型清單、來源權限與實際來源資料屬於宿主應用狀態，未由 YunUI 提供，也不在草案內實作。若希望 inline token menu，須另提 API 設計，不包含在本次核准範圍。

## D2：代理狀態、處理時間線與回覆

**待審範圍：** 固定 run status、可收合的處理時間線、獨立對話回覆區。請分開審查此項；D1 核准不代表 D2 核准。

- **現行基線：** 一則 assistant `ChatMessage` 中放置 `ThinkingBlock`，供讀取進度文字。
- **草案：** 上層 `AgentRunStatus` 表示現在正在做什麼；`AgentTimeline` 放在 `Collapsible` 中承載 reasoning、tool、approval 節點；使用 `ChatMessageList`／`ChatMessage` 獨立呈現使用者訊息和最後回答。timeline 的核准／退回按鈕只改變本地狀態。
- **狀態／操作：** 等待顯示空時間線；執行中顯示活動中的檢查與完成節點；待確認顯示 approval 節點，確認轉「完成」、退回轉「失敗」；完成展示獨立回答；失敗展示 API 尚未確認的結果。可切換時間線收合、reasoning 詳情，以及基線／草案。
- **資料邊界與失敗：** 這些節點是靜態本地範例，不代表真正的 agent 執行記錄、工具輸出或授權。生產整合必須由宿主傳入已授權的事件資料，處理取消、逾時、工具失敗與不完整輸出；不可從 UI 自行執行工具或把範例字串當作結果。

## 使用的 YunUI 匯出與參考來源

草案直接從目前 workspace 的 `@yuhuanowo/yunui`、`@yuhuanowo/yunui/chat`、`@yuhuanowo/yunui/ai` 匯入 `Badge`、`Button`、`Card`、`Popover`、`Select`、`Collapsible`、`ChatHeader`、`ChatMessageList`、`ChatMessage`、`ChatComposer`、`ThinkingBlock`、`AgentRunStatus`、`AgentTimeline`。未重畫這些控制元件或複製其樣式；僅有外層比較格局用於並排審閱。

上游互動參考固定於 `reference/beautiful-ui/` commit `44a274e598395ab61e7c96c26fda2758780253b7`：`components/primitives/PromptBar.tsx`（來源／指令／模型入口）、`components/primitives/ThinkingState.tsx`（進度與詳情）、`components/primitives/TaskRows.tsx`、`components/primitives/ToolChips.tsx`、`components/primitives/ChatComposer.tsx`、`components/primitives/ApprovalCard.tsx`，以及 `components/site/IceCreamHarness.tsx`。草案只借鑑入口和流程分層；不搬用其樣式、業務資料、計時器、後端或自動執行行為。上述 upstream 展示器有以計時器變換的靜態示範；本地草案改用明確的人工狀態按鈕，避免混淆真實執行。

## 預覽與截圖

完整頁面以 Chromium 與 WebKit 實際載入草案；每個引擎都捕捉桌面 1440px／手機 390px、淺色／深色的基線與草案。桌面深色另逐一捕捉五種狀態及互動選單／時間線。截圖位於 `research/ai-refactor/prototypes/captures/`，瀏覽器檢查結果在同目錄的 `capture-log.json`（page errors、console errors、request failures 均為空；request origin 只有 `http://localhost:3942`）。

代表圖：

- `captures/chromium-desktop1440-dark-proposal.png`
- `captures/chromium-desktop1440-light-proposal.png`
- `captures/webkit-mobile390-dark-proposal.png`
- `captures/webkit-mobile390-light-proposal.png`
- `captures/chromium-d1-context-menu.png`、`captures/chromium-d1-command-menu.png`、`captures/chromium-d1-model-picker.png`
- `captures/chromium-d2-working.png`、`captures/chromium-d2-approval-pending.png`、`captures/chromium-d2-approval-local-done.png`、`captures/chromium-d2-approval-local-rejected.png`

預覽使用 `site/.next/static` 編譯的本機 CSS／字型，並移除 Google Fonts 的外部 `@import` 以保持純本機流量。`capture-log.json` 記錄實際字型 fallback；mono stack 為 `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`，因此截圖不應解讀為已載入 JetBrains Mono。預覽 CSS 由 server 動態讀取目前建置檔，沒有固定 chunk hash。

## 審核後才進行的工作

請分別回覆 D1、D2 的方向（接受、要求修改或拒絕），以及希望修改的具體狀態／互動。此稿只供視覺與互動決策；沒有把任何項目標成已批准，也沒有將草案移入 `src/ai` 或 `src/chat`。
