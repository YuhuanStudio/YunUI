# 歷史狀態快照（已被正式整合記錄取代）

本文件保留當時的待審核狀態。D4、compact CodeBlock 與四項新增會話元件
其後已由 owner 批准並正式整合；請以 [目前整合記錄](production-conversation-units/INTEGRATION.zh-TW.md)
和 [主索引](../INDEX.md) 為準。Model workspace 等外觀仍排除，發版仍暫停。

---

# 整合狀態：全 AI 與代碼區塊

## 擁有者最新範圍

AI 外觀重構只涵蓋聊天、輸入框、訊息、思考／工具／任務流程與批准問答。Model workspace、模型卡／管理、能力與帳戶／語言／導覽等維持原有設計；全 AI family 外觀稿已撤回。既有功能與無障礙修正保留。先前另行要求的 CodeBlock 重構保留。舊的第三份全 AI family 審核問題不再適用。

狀態：已確認功能缺陷完成修復；新外觀待擁有者逐稿審核。發版保留在 0.2.18，沒有發布本輪變更。D4 與緊湊 CodeBlock 的新外觀仍待擁有者逐項審核。

## 已落入正式原始碼的功能修正

- content CodeBlock 保留原始縮排與空行；預設空 highlightLines 不再每次 render 改變 effect dependency。
- patterns CodeBlock 顯示目前選中 tab，空 tab 不回退成主 code。
- patterns 行號與高亮解耦；關閉行號仍高亮。tokenizer 保留 Unicode、emoji 與未完成引號，不再丟字。
- Copy/Edit/tab 按鈕不誤提交宿主表單。複製失敗不顯示成功；legacy clipboard 例外也清除臨時 textarea 並恢復焦點。
- Markdown 的 fenced-code metadata 經 remark 插件與精確 sanitizer class 白名單傳遞：行號、有限範圍高亮及檔名；未知事件/樣式不傳入。
- ModelCard 的選擇按鈕與 ID 複製按鈕改成 sibling，保留卡片點擊 API；內層互動與選取文字不選模型。保留描述/價格 0。

最新整合單元測試：49 個檔案、370 項通過。Chromium/WebKit 的 content/chat/agent-chat 共 160 項通過；最新 ModelSelect 完整 Axe、鍵盤與焦點 12 項通過（合計 172 項）；30 項 agent 工具測試、typecheck、build、publint、git diff --check 通過。這些結果不代表新外觀已核准。

## 完整使用檢查與待審稿

- [全範圍清單](./ALL-SURFACES-CHECKLIST.zh-TW.md)：所有 AI 族與代碼情境。
- [D4 Chat 草案](./prototypes-v4/DESIGN-04-REVIEW.zh-TW.md)：上游原碼為主，長資料、真實內嵌代碼與緊湊外框均已補上；102 個擴展情境 captures 加 28 個代碼外框更新 captures。
- [CodeBlock 草案](./codeblock-v4/DESIGN-PROPOSAL.md)：聊天、文章與 tabs，含尺寸比較；緊湊/折疊/字級都是待審設計。

模型/能力/帳戶/語言/導航等其餘 AI 族的具體稿與矩陣見 [全 AI family 稿](./full-ai-audit/PROPOSAL-D4.zh-TW.md)，預覽 http://localhost:3953/research/ai-refactor/full-ai-audit/preview.html 。

另修正 ModelSelect ID 碰撞、group prototype key、listbox 分組/空結果結構與清除按鈕觸控範圍；AccountMenu 鍵盤/焦點；LanguageSwitcher 宣告/忙碌/對比；provider/model 圖示失敗後更換来源重試；Navbar/Footer 重複 key 與非視覺語意。

正式新外觀仍待 owner 審核：不能將待審稿稱為已替換正式元件。

最終 browser 使用本機 3952 的隔離正式建置，保持正確 dist CSS 掃描。先前 3951 scratch build 漏掃套件 CSS，其對比結果無效，已重建並完整重驗；沒有為該環境問題修改 ImageLightbox。

## 最終正式元件證據

後續整合以正確 CSS 的 3955/3956 正式建置覆核。ModelCard、ModelSelect、ModelManagerCard、CapabilitySelector、AccountMenu、LanguageSwitcher、Navbar、Footer 的兩引擎、三尺寸、light/dark 矩陣完成。來源與互動證據見 [Chromium](./full-ai-audit/production-final/chromium/PRODUCTION-FINAL-LEDGER.zh-TW.md) 與 [WebKit](./full-ai-audit/production-final/webkit/FINAL-ROUTE-LEDGER.md)。圖示載入失敗後換成有效來源的恢復另有 [12-case matrix](../remaining-fixes/icon-error-reset/final-cross-engine-matrix.json)。

ModelSelect 修正 Pin 語義擁有關係、重分組焦點、Escape、文字對比與重複圖示描述。Navbar 改依容器寬度切換既有模式；Account/Language 修正右側錨定，Navbar docs 可完整顯示末尾操作。

新緊湊 CodeBlock、D4 Chat 和其餘 AI 家族外觀仍待 owner 審核，不能稱為已替換正式外觀。
