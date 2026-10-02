# YunUI 整合 code review（2026-10-02）

狀態：既有重構的程式修正已整合；最新版 production build 完成，完整套件回歸 248 項通過；最後樣式修正後，受影響 120 項雙引擎回歸通過。Beautiful UI 新增四項會話元件已由 owner 批准並正式整合，見最新 production-conversation-units/INTEGRATION.zh-TW.md。版本維持 0.2.18，沒有發布。

## 已確認並修復

| 等級 | 問題與影響 | 修復與證據 |
| --- | --- | --- |
| P1 | CodeBlock 語言字典讀取繼承屬性。Markdown fence 使用 `__proto__` 可使整段 React 回覆崩潰；`constructor` 可錯誤解析為函式。 | `src/content/code-block.tsx` 對顯示名稱、語言及 aliases 做 own-key 檢查，未知語言使用純文字。`src/__tests__/code-language-safety.test.tsx` 檢查 SSR、client、完整 Markdown 前後文。 |
| P2 | 已送出的 clipboard Promise 在內容更新後完成，可能把新內容誤標已複製；舊 timer 可清掉新的成功狀態。 | 兩種 CodeBlock 使用 request generation、payload 變更失效與 timer 清理。deferred clipboard/overlap regression tests。 |
| P2 | Pattern CodeBlock 以 index 記錄選取；tabs 重排或刪除後，顯示內容與選取狀態可能錯亂。 | 以穩定 tab ID 記錄選取，刪除後同步選取第一個剩餘項。重排及縮減測試。 |
| P2 | CI 的 browser 指令漏掉 model-select regressions；generated 檢查漏掉新生成但未追蹤檔，也可被 staging 遮蔽。 | CI 加入 model-select；`scripts/check-generated.mjs` 比較 HEAD 並偵測 untracked（含 ignored）生成檔。真實 temporary git fixture 覆蓋 staged/ignored/untracked。release workflow 同時檢查 catalogue/recipes/generated，但沒有觸發發布。 |

## 審查覆蓋與邊界

- Content：CodeBlock、Markdown sanitization/URL/metadata、ContentImage、clipboard；詳細獨立報告：[content review](../content-code-review/REVIEW.zh-TW.md)。未找到已確認的 sanitizer bypass。
- Conversation：composer value/IME/caret、menus、messages、attachments、thinking、tool/task disclosures、approvals/questions、async send recipe。獨立 reviewer 未提出已確認的新缺陷；報告另存 chat-code-review。
- Package/consumer tooling：六個 public entrypoints、生成 catalogue、typed recipes、init 路徑與 instruction preservation、CI/release gate。
- `/content` barrel 靜態載入 optional content peers：只對不使用此 subpath 的 consumer 可省略這些 dependencies。缺 peer 時不能依靠 runtime Shiki catch。補充真實安裝說明；沒有在本輪偷偷重建 entrypoint 架構。
- Model workspace/model cards 外觀維持排除範圍；已確認功能與無障礙修復保留。
- 已完成 full unit：56 files / 423 tests；typecheck 通過；agent recipe/tool tests：31 通過。最新 library/site build 與 publint 通過；3964 production snapshot 的 188 項 browser regression 通過，另兩項實際 ChatMessageList 長代碼捲動檢查通過。最新 CodeBlock 的 72 張截圖涵蓋短代碼、長代碼展開/摺疊、tool output、npm/pnpm tabs，在兩引擎、三尺寸、兩主題驗證；最後 log 無 page/console/request/HTTP errors。ModelSelect assertion 改為檢查顯示標籤，不把裝飾圖示備援字母當作模型名。收合時的 scrollTop 允許限縮至新的最大捲動範圍。

## 新增需求已正式整合

Owner 已批准 StreamingText、ContextCards、SelectionActions、DiffTable 四項設計。四個正式元件、公用 exports、實際 ChatDemo/showcase、三語 API 文件、478-export catalogue 與 typed recipe 全數整合。

最終驗證：423 unit tests / 31 recipe-tool tests；typecheck/library-site build/publint 通過。3966 六套件 248 項 browser regression 通過；最後 token/narrow-layout 視覺修正後，3967 受影響 120 項雙引擎回歸通過。包括手機檔名、來源/引用、工具列所有操作、空字串刪除、controlled callbacks 與 scoped axe。

詳細來源、契約、實際網站及截圖驗證：[正式整合報告](../../ai-refactor/production-conversation-units/INTEGRATION.zh-TW.md)。沒有更動 Model workspace/model cards 外觀，沒有發布。

這份 review 記錄有證據的問題及修復；出版仍明確暫停。


最新交付驗證版為 3968；最後容器樣式與 optional label fallback 修正後，18 項受影響雙引擎回歸通過。單元測試最終為 56 files / 423 tests；31 tool tests，typecheck/build/publint 通過。
