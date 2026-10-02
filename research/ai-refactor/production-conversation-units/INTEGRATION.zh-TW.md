# 四項新會話元件：正式整合

Owner 在 2026-10-02 看過 3963 源碼移植審核版後回覆「我看是還不錯 所以繼續做完所有」。[批准記錄](../upstream-gap-review/APPROVAL.zh-TW.md)。四項實作已加入 public exports；最終實作與受影響瀏覽器回歸通過；截圖 evidence 由 browser reviewer 記錄。版本仍為 0.2.18，出版暫停。

| 正式 export | 實作 | 使用邊界 |
| --- | --- | --- |
| `/chat` StreamingText | `src/chat/chat-streaming-text.tsx` | 精確 host token、穩定引用來源 ID、來源 disclosure、message actions、追問。沒有假串流計時；中斷保留 partial text；來源 URL 先驗證，再交給 Link/Image adapters。 |
| `/chat` ContextCards | `src/chat/chat-context-cards.tsx` | host retrieval chunks 與 controlled inclusion；來源開啟回呼不檢索或讀檔。 |
| `/ai` SelectionActions | `src/ai/selection-actions.tsx` | host-selected passage、request state/result；localized action label 與 stable ID 分離。錨點限制在 host、額外操作可水平捲動，隱藏 prompt inert，無 ResizeObserver 時退化。 |
| `/ai` DiffTable | `src/ai/diff-table.tsx` | host proposals/selected IDs，Apply/Reject 只提出請求；只有 host applied 才成功。disabled/unchanged/stale IDs 不納入有效操作。 |

來源：Beautiful UI MIT commit `44a274e598395ab61e7c96c26fda2758780253b7` 的同名 primitive。已保留來源/授權註記；重用其幾何與視覺層次，使用現有 YunUI tokens/primitives/adapters，沒有引入新的 rendering engine 或執行 backend。

## 真正套件採用

`site/components/docs/conversation-units.tsx` 從 `yunui/chat`、`yunui/ai` 匯入實際 package exports；`ChatDemo` Done 回覆嵌入這些單元，所以 `/docs/chat` 與 `/showcase` 使用同一個正式實作。沒有引用 research 元件。

四個 API 路由各有英文、繁中、簡中文件與 generated PropsTable：

- `/docs/chat/streaming-text`
- `/docs/chat/context-cards`
- `/docs/ai/selection-actions`
- `/docs/ai/diff-table`

`agent/recipes/conversation-units.tsx` 以 actual public prop types 組合四項，`agent/skills/yunui/SKILL.md` 更新對應表，catalogue 從 real exports 生成。consumer 不需要重寫來源清單、選取工具列或 apply footer。

## 同時修復既有問題

ContentCodeBlock 的檔名標籤在窄 host 有 8rem 最小寬度，讓原有 header controls 換行；解決 Chromium 390px `route-checks.ts` 僅剩首字母的實際截圖問題。Pattern CodeBlock 未更改。

## 驗證

最終 library/site build、typecheck、publint 通過。56 個測試檔案 / 423 項 unit tests 通過；31 項 typed recipe/tool tests 通過，catalogue 包含 478 個 named exports。3966 完整六套件回歸 248/248 通過；後續僅修正兩項元件的 token classes 與窄版 spacing，3967 受影響 conversation-units / agent-chat / filename regressions 120/120 在兩引擎通過（default 3 workers）。

正式網站：http://127.0.0.1:3968/showcase#chat ，切換 Done 查看四項新元件；四個 API 文件頁可以單獨切換 host 狀態。Chat 中只使用 bare public units，狀態與 callback diagnostics 位於訊息外。

實際 screenshot review 又修復：DiffTable 選取符號原先用了不存在的 bg-error/bg-success class，改成現有 error/success tokens；窄容器使用欄寬和 cell padding 避免 Category/components 斷成孤立字母；ContextCards 檔案格式標記固定不壓縮、不換行。SelectionActions 支援空字串刪除結果，保留可操作的錨點；Keep 回傳精確空字串。

WebKit 四文件頁 smoke test 改為每頁獨立 page，仍檢查 HTTP / pageerrors / 實際公開元件，以免硬切換導致前一頁的 speculative RSC requests 混入下一頁結果。沒有略過真正 navigation failure 或無障礙檢查。Model workspace/model cards 外觀不在範圍，沒有發布、tag、push 或 deploy。


最終 3968 驗證版包含容器寬度感知的 SelectionActions prompt、窄版 DiffTable 摘要獨立列，以及 optional labels 顯式 undefined 的 fallback 修復。最後兩項樣式不改寬版設計；label fallback 不改正常 fixture 外觀。3968 受影響 18 項 Chromium/WebKit 回歸通過，包含四元件整合、獨立文件頁、270px 逐操作鍵盤/刪除/axe 及手機 CodeBlock 檔名。


最後實際畫面已驗證：3968 的 40 張更新截圖與 8 項布局檢查通過，窄版 Explain 完整可讀，DiffTable 選取數保持一行；兩引擎、三尺寸、兩主題的相關 widgets 及 desktop270px host 已查看。capture log 無 page/console/unexpected request/HTTP errors（teardown RSC aborts 另記）。[完整最終驗證報告](../../remaining-fixes/content-code-review/REVIEW.zh-TW.md)。沒有剩餘待審核的這四項設計，也沒有本輪已確認而未修的問題；發版仍暫停。
