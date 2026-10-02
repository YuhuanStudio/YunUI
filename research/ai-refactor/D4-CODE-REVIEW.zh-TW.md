# D4 與代碼區塊：修訂審核入口

狀態：**PENDING_OWNER_APPROVAL**。擁有者要求更高比例 Beautiful UI，以及聊天、文章、一般文件三種情境的代碼區塊重構。本次不是已批准的 D3；新外觀尚未移入正式元件。

## 請看這兩個具體修訂

- [AI 比例修訂](http://localhost:3946)：左側目前 YunUI 工作樹元件，右側 D4。五種狀態與主題可同步對比。去除旧 Brain/Running Badge、警告大卡、額外 Agent process 外殼；採上游 ThinkingState/ToolChips/TaskRows/ApprovalCard 的實際 renderer，僅適配宿主資料與取消 gallery 固定高度。
- [代碼區塊修訂](http://localhost:3947/prototype/codeblock-v4)：聊天、無外卡片文章、一般分頁代碼三種情境。3、12 行完整顯示；超過 16 行先顯示 8 行，明確展開/收合。13px 為候選、14px 可對照；去裝飾圓點與厚標題，複製/編輯仍用完整原碼。

審核重點是 AI 的上游比例/密度、代碼區塊的默认緊湊外觀/字級/長代碼折疊，這些是可分別接受或修改的設計項目。核准後才真正替換現有元件，保留已完成的受控資料與舊匯入相容性；不能拿這份研究頁代替正式交付。

## 根因與證據

[原碼比例稽核](./BEAUTIFUL-FIDELITY-AUDIT.zh-TW.md) 指出上次 ThinkingBlock 仍保留舊卡片/Brain/Framer 殼，工具批准仍是舊 warning panel，差異預覽/任務排列沒有充分直接移植。D4 逐檔來源與狀態矩陣見 [D4 文件](./prototypes-v4/DESIGN-04-REVIEW.zh-TW.md)，源 commit 固定為 `44a274e598395ab61e7c96c26fda2758780253b7`。

代碼區塊的常駐視窗 chrome、header、padding/margin、預留行號 gutter 與長代碼占位，見 [根因](./codeblock-v4/ROOT-CAUSE.md)、[方案](./codeblock-v4/DESIGN-PROPOSAL.md) 和 [操作檢查](./codeblock-v4/INTERACTION-CHECKS.md)。尺寸數字以高亮完成後的最新 measurements 為準，不以載入占位或縮小字級冒充改善。

另已修復三項不涉及新設計的資料/渲染缺陷：源碼縮進與空行被 trim；無行號的 tab 顯示/複製不一致及空 tab fallback；直接 CodeBlock 的預設 highlightLines 新陣列造成高亮反覆重啟。型別檢查與完整 335 單元測試通過，新樣式仍待批准。

發版與部署維持暫停。
