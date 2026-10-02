# D4｜Agent Chat 上游比例調整草案

**最新狀態：OWNER_AUTHORIZED_FOR_PRODUCTION（2026-10-02）。擁有者觀看 3946 後明確要求直接做入正式元件，以實際效果評估、Git 可回退。聊天與內嵌代碼範圍已獲授權；模型卡／Model workspace 等排除，發版暫停。取代下方歷史待審狀態。**

**審核狀態：`PENDING_OWNER_APPROVAL`。** D4 是新的視覺與互動審核草案，未修改已發佈元件、site demo 或文件。畫面、行為和測試結果都不代表主人已核准。

本機預覽：<http://localhost:3946>。頁面左側會載入目前工作樹的 `/docs/chat` 元件區域，右側是 D4。兩側沿用同一個 Navbar release review fixture；上方狀態控制會同步兩邊的 Idle、Working、Approval、Done、Error，主題按鈕同步 light/dark。左側另有「Open ↗」開啟完整文件頁。CodeBlock 情境由 D4 的工具列與 Done 訊息連結到 <http://localhost:3947/prototype/codeblock-v4>，不把整頁 CodeBlock 研究工具塞進訊息高度。

所有按鈕只操作瀏覽器內的 fixture state。頁面不呼叫模型、搜尋、工具、授權服務或後端；Allow/Deny 和 onSend 是本機 host callback 範例。沒有以計時器假造任務進度。ThinkingState、ToolChips、TaskRows 採明確靜態狀態，ApprovalCard 使用手動前進。

## D4 想審核的改動

D4 用 Beautiful UI 的訊息密度、使用者訊息靠右、助理回覆行寬、助手 glyph、輸入區停靠方式及原生 trace 元件組成同一則 Agent Chat 工作回覆。Working 狀態直接顯示上游 `ThinkingState` disclosure 和 `ToolChips`；Done/Error 使用上游 `TaskRows` 摘要；Approval 保留上游 `ApprovalCard` 的題目/選項幾何，宿主的 Allow/Deny 決策列在它旁邊獨立顯示。沒有額外的「Agent process」外卡、Run 標籤列、產品狀態 pills、黃色 warning panel 或重複任務摘要。

YunUI 目前的 `/docs/chat` 工作樹 UI 保留在左側基線，可在相同視窗、fixture 狀態和主題下逐項比較。Done 助理回覆直接 render 公開 `MarkdownRenderer`，內含長段落及完整路徑參照，之後的 3 行與 80 行程式都以 3947 同款 CompactCandidate 外殼包裝公開 `CodeBlock`：14px code、檔名/語言列、Copy full code、Edit 回呼、超過 16 行時預覽前 8 行與 Show all/Show less。80 行不再以另一個 disclosure 重複包裝。Working 的 `Review CodeBlock output` 工具列直接展開 12 行 CompactCandidate tool output。完整 CodeBlock v4 placements 對照仍在 3947 頁，D4 僅保留連結，不嵌入高 iframe。

## 狀態與宿主邊界

| 狀態 | D4 畫面 | 本機 callback / 結果 |
| --- | --- | --- |
| Idle | 使用者訊息、簡短待命回覆、原始 PromptBar | PromptBar 送出文字後進入 Working；不發出請求 |
| Working | 回覆附近顯示一個 `ThinkingState` 摺疊標題，其下是來源 `ToolChips` 步驟 | 工具細節可展開；每列文字來自靜態 Navbar／YunUI fixture |
| Approval | 普通文字說明、獨立 Allow/Deny 決策列、上游 `ApprovalCard` 收集範圍/摘要偏好 | 問卷提交只保留本機答案，不決定工具；Allow 轉為 Done，Deny 轉為取消且不出現失敗命令列 |
| Done | 長 Markdown、路徑參照、3 行與 80 行 CompactCandidate/公開 `CodeBlock`；80 行預覽 8 行 | Copy full code 複製原始完整字串；80 行可展開/收合並回復焦點；Edit 送出 host callback；`TaskRows` 顯示完成路由 |
| Error | 保留完成路由，另顯示失敗的 `pnpm test` TaskRow 和展開錯誤細節 | 是實際 request/tool failure 的視覺樣例，與拒絕分開；不執行命令 |

D4 PromptBar 接受宿主的 source、command、model 清單，透過 `onSourceSelect`、`onCommandSelect`、`onModelChange`、`onSend` 回傳選擇。D4 預覽提供 13 筆來源（含長路徑/檔名）、三個指令和兩個模型，能切換停用模型選擇器與空模型清單。實測從文字中間選取 `@Web` 後插入來源，suffix 保留；長來源路徑同樣保留前後字串且不令輸入區溢位；IME composition Enter 不會選取或送出；模型與指令回呼使用穩定 host id。傳入資料全部是本機 fixture。它不是正式 API，也沒有將 D4 按鈕接到真實模型或工具。

手機 Approval 的 `ApprovalCard` 保持原始提問/選項/頁尾 DOM。測試發現本次 WebKit 環境 native Tab 會由一般按鈕 A 跳過按鈕 B 直接到 textarea；這是觀察到的環境/平台序列，不宣稱是上游元件缺陷。D4 的本地副本提出一個額外 review adapter（未核准、不是 production 搬運要求）：最後一個問題欄位進入第一個啟用的頁尾控制；頁尾按鈕按 Tab/Shift+Tab 逐一走訪；Shift+Tab 可回到最後題目欄位；最後一個頁尾動作 Tab 到 composer，而 composer Shift+Tab 回到該頁尾動作，因此不形成 focus trap。390px 的 Chromium/WebKit 實測 Next 透過真實 Tab 到達，按鈕下緣與 composer dock 保持約 8.08px 間距（712.42px vs 720.50px）。原生 A→B→textarea 差異與兩引擎幾何證據在 `captures/approval-scroll.json`。

## 原始碼來源、授權與改動差異

參考來源為 [Beautiful UI](https://github.com/slev12397/beautiful-ui)，固定 commit `44a274e598395ab61e7c96c26fda2758780253b7`；`reference/beautiful-ui/LICENSE` 為 MIT，副本保存在此草案目錄。其本機 clone hash 與固定 SHA 相同。

D4 的 renderer 來源檔副本位於 `upstream/`：

- `ThinkingState.tsx` ← `components/primitives/ThinkingState.tsx`
- `ToolChips.tsx` ← `components/primitives/ToolChips.tsx`
- `TaskRows.tsx` ← `components/primitives/TaskRows.tsx`
- `ApprovalCard.tsx` ← `components/primitives/ApprovalCard.tsx`
- `PromptBar.tsx` ← `components/primitives/PromptBar.tsx`
- `GlideMenu.tsx` ← `components/primitives/GlideMenu.tsx`
- `atoms/Button.tsx` ← `components/atoms/Button.tsx`
- `lib/utils.ts` ← `lib/utils.ts`

ThinkingState、ToolChips、TaskRows 的 source row / disclosure DOM、原始動畫和排列保留，D4 只在副本增加 `staticStage`、`staticStep`、`staticTick` 固定展示位置，並增加 `compact` 取消 gallery 展示用的最小高度，不改每列尺寸或 disclosure 動作。ApprovalCard 保留 GlideMenu、高亮滑動、逐題進退與原始卡片幾何；`manualAdvance` 避免單選題在 480ms 後自動跳題，答案回呼與工具決策分離。這些 review adapter 都只在 `upstream/`。

PromptBar 保留原始 `@`／`/` 選單、方向鍵、Enter、IME guard、模型選單位置與輸入區排版。D4 副本另加 host data items、`selectedModelKey` 和 source/command/model callback props，讓展示資料回到父層所有。PromptBar 仍持有本機文字草稿、附件 preview chips 和選單焦點；這與正式 ChatComposer 的 controlled value contract 不同，D4 不宣稱它可以替換已發布 API。它沒有啟用上傳、語音、外部服務或模型執行。

`entry.tsx` 參考 `components/site/ChatExperience.tsx` 的使用者右側泡泡、AssistantMessage、寬度、工具詳情摺疊與 composer 停靠排版；它是依 YunUI release review 內容重新組成的小型 review fixture，沒有複製 Scoop/Food 狀態資料。D4 shell 和 `layout.css` 不是上游檔案；核心互動元件則直接從指定來源副本 render。lucide-react 用於本地通用 glyph，不包含商標 icon。

`upstream.css` 保留 Beautiful UI 源 palette 與 Tailwind utility definitions。`build-yunui-theme.mjs` 從工作樹 `styles/yunui.css` 擷取 light/dark 的 token 子集；D4 用獨立 CSS alias 將 page/surface/ink/border/semantic status/shadow role 對應到 YunUI token，同時保留上游 spacing、type scale、radius、DOM 與 motion。不是全量套用 YunUI card/pill 結構。D4 的 font stack 使用 Inter、macOS、Segoe UI 與 system fallback。基線 iframe 的代理也會去除文件站原有 Google Fonts `@import`，避免審核時的遠端字型請求；左側基線因此用系統字型 fallback，這個字型差異要在看圖時一併考量。

左側基線是目前工作樹的 `/docs/chat`，不是 npm 已發布版本。`server.mjs` 只把基線文件頁和 Next 靜態資源從本機 3941 代理到 3946 同源，讓草案可以裁切成元件區域並同步主題/狀態；對應 iframe 注入只作用於本機審核頁。D4 不更改 `site/`、`src/` 或 3941 server。

CompactCandidate 的研究來源為 `research/ai-refactor/codeblock-v4/Prototype.tsx`，D4 本地副本位於 `upstream/CompactCodeBlock.tsx`。D4 保留 3947 結構和展開/copy/edit 行為，只把顏色角色映射到 D4/YunUI theme，使用 14px 並把完整檔名放在 title；底層直接 render 公開 `CodeBlock`。完整 3/12/80 行 Chat/Article/Tabs 矩陣在 `research/ai-refactor/codeblock-v4/captures/post-shiki-fix/`，互動檢查在 `research/ai-refactor/codeblock-v4/INTERACTION-CHECKS.md`。

## 截圖與驗證

初始五狀態 Chromium/WebKit 矩陣為 60 張 viewport captures，42 張互動 captures；證據在 `captures/capture-log.json`。Done/Working code 外殼更新後，受影響的兩狀態另跑 Chromium/WebKit × 390/768/1440 × light/dark，共 24 張新矩陣 captures，另有 4 張 copy/expand/edit interaction captures。新結果在 `captures/codeblock-update/capture-log.json`：failures、page error、console error、HTTP error、request failure、unexpected origin 均為零；唯一 origin 為 localhost:3946。初始完整 run 的截圖仍可參考未受影響的 Idle/Approval/Error 視覺；Done/Working code 視覺以 codeblock-update 目錄為準。圖只截 `.d4-window` 元件區域，避免文件站 sticky chrome；鍵盤流程則在完整頁面測試。Google Fonts import 已由本機 proxy 剝除，使用本機 fallback。擴大互動涵蓋長 user message、長 assistant Markdown/程式、長檔名、13 個來源、empty/disabled model、middle-caret @ 選取、suffix 保留、slash 指令、IME、source/model/command callback、工具 diff hover/CodeBlock、closed disclosure inert、busy approval、問卷答案隔離、Allow/Deny/Error、TaskRows metadata、scrollback，以及切換 Approval 後答案歸零。

代表圖：

- Working, desktop, light: `captures/chromium-1440-light-working.png`
- Approval, mobile, light: `captures/webkit-390-light-approval.png`
- Done, tablet, dark: `captures/chromium-768-dark-done.png`
- Error, desktop, dark: `captures/webkit-1440-dark-error.png`
- Working, mobile, dark: `captures/chromium-390-dark-working.png`
- Live baseline vs D4, desktop, light: `captures/comparison-chromium-1440-light-working.png`
- Initial state matrix contact sheet (Done/Working code visuals superseded): `captures/expanded-montage.png`
- Updated Done code matrix: `captures/codeblock-update/done-matrix-montage.png`
- Updated tool-output matrix: `captures/codeblock-update/working-matrix-montage.png`
- Real 80-line compact assistant output: `captures/codeblock-update/chromium-1440-light-done.png`
- Real compact 12-line tool output: `captures/codeblock-update/webkit-tool-copy-edit.png`
- Long-source mid-caret insertion: `captures/chromium-source-middle-caret.png`
- 13-source picker: `captures/chromium-sources-13.png`
- Busy questionnaire state: `captures/chromium-approval-busy.png`
- Expanded scrollback send path: `captures/webkit-local-send.png`

實看顯示 mobile Approval 可上下捲動題目和 composer；Next focus 有明確 scroll margin，且 Tab 可離開 footer 到 composer；Working 用上游 thinking/ToolChips 直接構成流程；Done/Error 以 TaskRows 保留結果，拒絕與執行失敗分開。長訊息與路徑可換行；80 行程式預設折疊，12 行工具輸出展開後仍留在可捲動對話中。以上是待審草案的本機行為，不表示已通過 production accessibility、安全或公開 API 驗收。右側 CodeBlock review link 打開 3947 頁的 public renderer vs compact candidate 對照。

D4 的 ChatExperience shell、token mapping、host callbacks 與 Approval 題目文案都要主人審核。核准 D4 不代表核准其他 AI 視覺，也不等於後端、安全、本地化或 production interaction contract 已驗收。
