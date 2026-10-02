# D3｜Beautiful UI Agent Chat 整頁草案

**審核狀態：`PENDING_OWNER_APPROVAL`。** 這是新的完整 Agent Chat 設計審核項目，直接移植 Beautiful UI 的原始元件與視覺作為主體，僅在待審核標籤融合一個 YunUI `Badge`。未修改 shipped `src/`，未部署或發布。D3 尚未核准；參考圖、截圖、測試結果都不構成核准。

本機預覽：<http://localhost:3943>。上方狀態控制器可切換等待、執行中、待確認、完成、失敗。操作只改變本機 React state 與靜態 fixture；不會呼叫模型、工具、授權來源、上傳、麥克風或後端。`@`、`/`、模型選單、工具列和確認卡片可在預覽中直接操作。

## 草案範圍

D3 將 Agent Chat 作為完整工作介面審核：左側工作區導覽與最近對話、中間訊息串與 composer、右側來源及 run 摘要。主要視覺取自 Beautiful UI 的冷調中性色、細邊框、低層次陰影、圓角、密度和互動動畫；版面使用其深色預設語彙，也提供淺色切換。頂部只有本次審核必要的 D3、PENDING 與五狀態控制列。

- **等待：** 顯示使用者問題、來源 chips、回覆區和 composer。
- **執行中：** 顯示 `ThinkingState` 的進度與可展開步驟，`ToolChips` 呈現工具列及檔案差異；右側呈現 run 摘要。流程資料為固定範例，沒有真的執行工具。
- **待確認：** 顯示上游 `ApprovalCard`。單選後須明確按「下一步」；選完第二題後按「完成示範」才將本機狀態轉成完成。
- **完成：** 顯示獨立的答覆、靜態來源 chips、訊息動作及 follow-up 建議。
- **失敗：** 顯示「已完成一部分」的 request 失敗狀態，保留完成與失敗步驟；右側 `TaskRows` 可展開已完成項目。它不顯示假成功的外部工具結果。

Composer 沿用上游 `PromptBar` 的游標 token 辨識、`@` 來源選單、`/` 指令選單、方向鍵與 Enter 選擇、模型 picker 位置、附件 chips 及輸入框排版。預覽清單只含示範來源與示範模型名稱。上游語音按鈕、Glimm 彩虹 shader、示範自動輪播和品牌服務標誌已移除；附件僅加入預設靜態檔名，不會開檔案選擇器或上傳。

## 原始碼、授權與移植差異

原始專案為 [Beautiful UI](https://github.com/slev12397/beautiful-ui)，本地固定於 commit `44a274e598395ab61e7c96c26fda2758780253b7`。其 [LICENSE](../prototypes-v2/LICENSE) 為 MIT，保留在 D3 草案資料夾。已移植並實際 render 的上游 primitive：

- `components/primitives/PromptBar.tsx`
- `components/primitives/ThinkingState.tsx`
- `components/primitives/ToolChips.tsx`
- `components/primitives/TaskRows.tsx`
- `components/primitives/ApprovalCard.tsx`
- `components/primitives/GlideMenu.tsx`、`components/atoms/Button.tsx` 與 `lib/utils.ts`（ApprovalCard 依賴）

原始檔副本在 `research/ai-refactor/prototypes-v2/upstream/`，來源與 D3 專用差異見 [`upstream/SOURCE-NOTES.md`](upstream/SOURCE-NOTES.md)。原始 `app/globals.css` 複本為 `upstream.css`；用 workspace Tailwind v4 編譯，直接保留其 tokens 和 primitive styles。`layout.css` 只建立本機 shell 的欄位、響應式格線與頁面框架，並提供 shadow-plugin 原本注入的基礎 shadow 變數。

為使互動可審核而非假裝產品執行，上游自動序列已改為由 review controls 固定狀態：`ThinkingState` 增加 `staticStage`、`ToolChips` 增加 `staticStep`、`TaskRows` 增加 `staticTick`；未指定這些 props 時，上游原始展示序列仍可用。`ApprovalCard` 增加 `manualAdvance`，待審模式不會在 480ms 後自動跳題。`PromptBar` 的資料改為 YunUI API／來源故事，移除 autoplay、檔案上傳、語音輸入、Glimm 外部依賴和可連接第三方服務的選項。D3 自己的 `onSend` 只將狀態切成執行中。

外框圖示使用本機已有的 `lucide-react`；上游 PromptBar 內的通用線條符號保留，Figma、Slack、Gmail 等品牌圖樣移除。模型、附件、來源、工具輸出、回覆與錯誤都是靜態本機 fixture。YunUI 在本稿只用於 D3 狀態的 `Badge`，不覆蓋上游互動元件的視覺。

ApprovalCard 的 aria labels（Dismiss、Custom answer、Previous question、Next question）與 PromptBar 的 prompt／附件／模型／送出／動態移除 labels 現已可由宿主覆寫，並使用逐欄 `??` fallback，顯式傳入 `undefined` 仍保留原始英文預設。D3 目前仍使用那些英文 a11y 預設；中文題目及 skip／continue 按鈕文字透過既有 labels 提供。這不代表完整國際化、無障礙或資料安全已完成。若 D3 獲核准，正式整合仍需把選擇結果交由宿主處理，明確接入已授權的來源／模型／工具與後端，檢查拒絕、取消、逾時、重試及部分結果語意，並完成本地化、鍵盤和螢幕閱讀器驗證。核准設計不等於免除此工作。

## 操作與資料邊界

截圖驗證涵蓋 `@`／`/` 的方向鍵與 Enter、模型選取、ToolChips 詳情展開、TaskRows 展開、ApprovalCard 人工逐題前進、完成回呼只切換本機完成狀態，以及 PromptBar 的本機送出 callback。另以 composition Enter（`isComposing=true`, `keyCode=229`）驗證不會選來源或清空輸入；此 guard 是本地必要移植修正，避免中文輸入法按 Enter 時被誤認為選單／送出操作。

來源、模型、任務步驟和錯誤資料都沒有使用使用者憑證、外部帳戶或生產服務。Playwright 主矩陣的 request origin 只有 `http://localhost:3943`；label fixture request origin 只有 `http://localhost:3944`。兩份 Playwright log 都沒有 HTTP 4xx/5xx、failed request、console error 或 page error。畫面中的 Request failed 是靜態 UI 範例，不是網路請求失敗。

## 截圖與驗證

Chromium 與 WebKit 均實際載入完整預覽。五種 state 全數涵蓋 390、768、1440 px × light/dark × 兩種引擎。interaction captures 覆蓋來源／指令／模型選單、IME Enter、ToolChips 詳情、ApprovalCard 手動選取與完成、TaskRows 詳情、本機送出。label override 的獨立測試另覆蓋自訂 aria labels 與顯式 undefined fallback。截圖及 log 位於 `research/ai-refactor/prototypes-v2/captures/`：

- `chromium-1440-dark-working.png`、`webkit-390-light-working.png`
- `chromium-1440-dark-approval.png`、`webkit-390-light-error.png`
- `chromium-source-menu.png`、`chromium-command-menu.png`、`chromium-model-menu.png`
- `chromium-tool-expanded.png`、`chromium-approval-local-complete.png`、`chromium-taskrow-expanded.png`、`chromium-local-send.png`
- `capture-log.json` 是互動與完整 state 矩陣的檢查結果；`error-copy-log.json` 記錄 error copy 確認；`label-override-log.json` 記錄獨立 label fixture 測試。

要審核的是 D3 這份上游視覺主體與完整 Agent Chat 互動。請明確回覆接受此 D3 方向、要求修改的具體區域，或拒絕；在主人明確核准前，所有 D3 變更維持在 `research/ai-refactor/prototypes-v2/`。
