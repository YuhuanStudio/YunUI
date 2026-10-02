# Chat／AI 公開元件獨立審查

審查日期：2026-10-02
範圍：目前工作樹相對 HEAD 的指定元件變更與新增 chat recipe；唯讀審查，未修改程式碼。

## 結果

沒有確認到可重現、應列為缺陷的問題。因而沒有嚴重度分級或待修項目。

## 實際檢視的檔案

- `src/chat/chat-composer.tsx`
- `src/chat/chat-attachment.tsx`
- `src/chat/chat-header.tsx`
- `src/chat/chat-message.tsx`
- `src/chat/index.ts`
- `src/ai/thinking-block.tsx`
- `src/ai/agent-timeline.tsx`
- `src/ai/agent-run-status.tsx`
- `src/ai/approval-question.tsx`
- `src/ai/index.ts`
- `src/lib/use-anchored-position.ts`
- `agent/recipes/chat.tsx`
- `src/content/index.ts`、`src/content/markdown-renderer.tsx`、`src/content/code-block.tsx`、`src/content/math-renderer.tsx`、`src/content/mermaid-diagram.tsx`（僅用於核對 `/content` peer 依賴敘述，不屬於 chat／AI 程式審查範圍）

交叉檢視相關測試：`src/__tests__/chat-composer-host-menus.test.tsx`、
`src/__tests__/chat-recipe.test.tsx`、`src/__tests__/chat-d4-contract.test.tsx`、
`src/__tests__/agent-process.test.tsx`、`src/__tests__/use-anchored-position.test.tsx`。

## 檢查面向

- Composer 的 IME Enter 保護、`@`／`/` token 搜尋及取代、caret 更新、suffix 保留、空字串 `insertText`、非同步受控值更新、disabled／缺少 host callback、menu Escape／outside dismissal、model 選項鍵盤操作與多實例 DOM IDs。
- Chat message/header/attachment 的現有 slots 與 props、role 分支、零值／空值呈現及 host callback 邊界。
- AI 狀態元件的受控／非受控 disclosure、pending／running／done／failed／cancelled 表示、工具輸出及 diff disclosure、approval 忙碌和 callback 保護、問卷 Other／必填／skip／dismiss／submit 流程、collapsed 區域的 ARIA 和鍵盤可達性。
- Anchor hook 的 clipping ancestor 計算、max-width／height cap、flip／shift、ResizeObserver 和 scroll 重測。
- Chat recipe 的重複送出保護、async host 拒絕／例外、草稿保留與編輯期間的舊請求完成。

## 限制

這是依照本任務列出的檔案與程式路徑作靜態審查，並參考現有單元測試；本輪沒有另跑 Playwright、axe、建置或完整測試套件。Host 若提供重複 ID、互相矛盾的選項／受控值，或故意拒絕受控更新，並不據此推定元件缺陷。此報告也不覆蓋其他 AI 元件、文件頁、production snapshot 或非本次指定的整合路徑。

## 另行核對：`/content` 安裝文件

發現文件把 optional peer metadata 誤解成「使用時可不安裝」。`src/content/index.ts` 重新匯出多個元件；`markdown-renderer.tsx` 靜態匯入 `react-markdown`、`remark-gfm`、`remark-math`、`rehype-raw`、`rehype-katex`、`rehype-slug`，而 `code-block.tsx`／`math-renderer.tsx` 分別靜態匯入 Shiki core／JS regex engine 與 KaTeX。因此即使只從 `/content` 匯入一個命名元件，這些 peer 也必須可解析。Shiki 語法與主題模組、Mermaid 是按需載入；`rehype-sanitize` 則是 YunUI 的一般依賴，不應要求 consumer 另裝。

`yunui doctor` 目前檢查 content CSS 匯入／套件匯出，不檢查這些渲染 peer 是否可由 consumer bundler 解析。此輪僅修正文案，README、三語 Content index／CodeBlock 頁與 `agent/recipes/setup.md` 現在明確說明依賴和 doctor 的檢查界線；沒有改 CLI 行為。應用 build 仍是檢查 peer 解析的有效驗證。
