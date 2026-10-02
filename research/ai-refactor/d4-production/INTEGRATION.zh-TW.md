# D4 正式元件整合

狀態：已實作並完成真頁回歸。擁有者在觀看 3946 後要求直接做入正式元件，以實際效果評估。Model workspace 與模型卡等外觀維持原樣；不發版。

正式元件實際使用頁：http://127.0.0.1:3962/docs/chat 與 http://127.0.0.1:3962/showcase 。這是目前原 repo 的實際正式建置快照，使用公開 exports，並非研究 renderer。

最終回歸：52 個 unit 檔案、397 項通過；Chromium/WebKit content/chat/agent-chat 共 176 項通過；30 項 agent 工具測試、typecheck、library/site build、publint 與 diff-check 通過。完整 browser 記錄在 `/tmp/yunui-d4-delivery-browser.log`。圖片、實際布局與交互證據在本目錄的 Chromium/WebKit 子目錄，以及 `thinking-layout-3961.json`。

實際長代碼讀碼回歸：`webkit/fold-tab-3962.json` 的四個跨引擎／尺寸情境全部通過。展開後焦點位於可見的程式碼 PRE、閱讀位置變化為 0；Shift+Tab 到 Copy，Tab 回 PRE 再到可見收合控制；收合回原位置及 Show all。複製／編輯皆保留 80 行。`webkit/locale-focus-3962.json` 記錄簡繁中文文案與焦點操作通過。

## 正式來源

- `src/chat/chat-composer.tsx`、`chat-message.tsx`、`chat-header.tsx`、`chat-attachment.tsx`：D4 會話外觀與輸入區。
- `src/ai/thinking-block.tsx`、`agent-timeline.tsx`、`agent-run-status.tsx`、`approval-question.tsx`：思考、工具、任務、狀態與問答。
- `src/content/code-block.tsx`、`src/patterns/code-block.tsx`、`styles/content.css`：14px 緊湊代碼、超過 16 行先顯示 8 行、完整複製／編輯、輕量 InlineCode。
- 正式 docs/showcase 與 `agent/recipes/chat.tsx` 使用公開元件組合，將 trace、問答與代碼放入助理訊息；移除示例中重複的狀態列與模型徽章。

Beautiful UI 來源固定在 `44a274e598395ab61e7c96c26fda2758780253b7`，採用 ThinkingState、ToolChips、TaskRows、ApprovalCard、PromptBar 的結構與密度。MIT 通知保留；宿主仍提供資料、狀態和執行回呼，沒有自動執行工具或模擬後端。

## 相容性

保留原有匯入、legacy unions、受控 value/answers/steps、IME、游標插入、來源／命令／模型回呼與 disclosure。新增的 tool `outputContent` 為 additive slot，舊 `output` 字串不變。代碼完整原文、縮排、空行、行號／高亮與 sanitizer 路徑保留。

修復在真正聊天容器才出現的問題：空選單對比、模型 popup 裁切／shift 回饋、長代碼展開引起的焦點與閱讀位置跳動。最後驗證使用獨立的正式 site build snapshot，避免重建時舊 server 的 chunks/manifest 混用。

## 回復點

本輪主要來源與 docs composition 的修改前快照：`refs/codex/checkpoints/d4-before-20261002`（`c20f74bcb719522e434d2c1f19b030bdf2fb5c5d`）。按需要還原對應來源路徑，可保留先前其他功能修正；目前工作分支與原 index 未切換，沒有 push。
