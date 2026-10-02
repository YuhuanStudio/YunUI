# Beautiful UI D3 元件忠實度稽核

狀態：只讀原碼稽核，供 D4 草稿審核前參考。這不是新視覺稿，也不代表 D4 已批准；本輪沒有改正式元件或文件頁。來源 checkout 固定為 `reference/beautiful-ui` commit `44a274e598395ab61e7c96c26fda2758780253b7`（MIT）。舊 YunUI 對照取目前 `HEAD` `16cf1d4e5721f45036c1774edae7721c3f286867` 的同名檔。

本報告看的是結構、比例、元件責任和動畫實作，不代替新狀態矩陣的實際截圖核准。上游元件含本地展示資料和計時器；正式版維持宿主供應 state 的契約是必要的。以下把「外觀/互動模式可移植」和「上游 demo 的假進度/自動成功不可移植」分開評估。

## 結論摘要

- **ThinkingBlock：外層仍是舊 YunUI 元件骨架的增補版。** 新增 host steps 和逐步狀態，但 Brain 小方塊、卡片框、Active Badge 與 Framer Motion 高度動畫，仍沿用舊版 `src/ai/thinking-block.tsx` 的主要結構。和上游 ThinkingState 的無卡片 header、sparkle 狀態行、左側垂直 trace rail 相差明顯。
- **AgentTimeline：改了行排列，但仍有明顯舊 UI 遺留，工具/diff 子層還是新畫出的框。** 舊 timeline rail 已移除；新版工具行和 task 行分別加入 status Badge、任務框和框起來的 inline diff。上游 ToolChips 的 28px 細行、hover 才出現的 chevron，以及定位在 chip 旁的 body-portal diff preview，並未實際移植。警告色工具批准卡則幾乎沿用舊碼；上游 ApprovalCard 是問卷，不是同一種工具批准，不能拿它替換語義。
- **ApprovalQuestion：本輪新增的受控問卷，不是舊元件換色。** 已採上游平面選項列的方向，也保留 YunUI RadioGroup/Checkbox，這比拷貝 upstream 手刻控制件更合適。仍有比例及過場差異：目前容器寬 `max-w-md`，列高至少 40px；上游 ApprovalCard 約 320px 寬、緊湊列、滑動問題軌和 RollingDigits counter。受控手動 Next 是有意的 host-contract 改動，不能為追視覺恢復單選自動跳題。
- **AgentRunStatus：薄狀態列是重組，不是上游 ThinkingState 的完整移植。** 現在 Loader2 + TextShimmer + 單點狀態，較舊三點 pulse 有變化；上游則將 sparkle/header/展開 trace 放在同一元件。現版不含 chevron 或狀態細節，細節被另外拆到 ThinkingBlock / AgentTimeline。
- **ChatComposer：來源/命令/模型是實際功能整合，但不是 PromptBar 外觀複製。** 現版有真正 host-controlled item IDs、游標補入與回呼；上游 PromptBar 有固定高度和自動導覽展示，這些展示 timer 與假資料不應帶回正式版。

## 逐元件比較

### 1. ThinkingBlock：舊骨架留下來，trace 子內容才是新增

**舊 YunUI 對照：** `HEAD:src/ai/thinking-block.tsx` 原本已是 `rounded-xl border` 的面板、左側 Brain 方框、`Active` 小 badge、`AnimatePresence` + `motion.div` 高度/透明度動畫和游標脈衝。現在正式檔 `src/ai/thinking-block.tsx:115-185` 仍使用相同排列：卡片外框在 116 行；Brain 仍在 124-125 行的圓角方塊中；串流時的 `Badge` 在 128 行；面板內容仍由 `AnimatePresence` / `motion.div` 在 132-142 行進出。改動在 143-180 行，加入 host steps、狀態圖示、選取 handler 和 detail。

**上游差異：** `ThinkingState.tsx:138-193` 的 header 是一條獨立文字行：16px sparkle、單一 active/done status、chevron；沒有 Brain 方塊、卡片框線或額外 Active pill。上游工作文字用 shimmer，收斂後換 done text（`ThinkingState.tsx:164-184`）。展開後從左側一條動態高度 rail 引出 query/step/detail（`ThinkingState.tsx:195-220`），步驟約 28px 行，依 variant 顯示 spinner/check/source dots（`ThinkingState.tsx:221-295`）。

**差距和判斷：** 現版新增資料模型，但大多數視覺辨識仍是舊 ThinkingBlock：`Brain + Badge + bordered card + Framer`；目前細節是普通 ordered list，沒有上游 trace rail，也沒有 header 的完成文案狀態。`Framer Motion` 本身不是忠實移植來源：舊碼已有它，上游 ThinkingState 用 grid row、opacity、line-height 與 CSS timing function。另，現版 ThinkingBlock 的 spinner / pulse utilities 是 `animate-spin` / `animate-pulse`，沒有像 Timeline Collapse 的 `motion-reduce` 或 AgentRunStatus 的 `motion-safe`（`thinking-block.tsx:98-104,124,176`）；這是現有動效策略不一致點，D4 狀態矩陣要覆蓋 prefers-reduced-motion。若 D4 要提高可辨識度，應先審一張「header/trace 外層層級」稿，再決定保留一個 YunUI card 容器或移除；不能只再換 Brain 顏色或加更多 badge。

### 2. AgentTimeline：ToolChips/TaskRows 部分對應，status 與 diff 子層增加視覺重量

**上游 ToolChips：** `ToolChips.tsx:168-186` 的 summary 是一個 12.5px 文字 + chevron 的平面按鈕；它的 header 文案自帶計數，沒有額外數字 Badge。工具 row 固定 `h-7`、約 12.5px 文案，chip 是同列的低對比欄位；chevron 在 hover/open 時取代原 icon（`ToolChips.tsx:193-227`）。展開詳情是左線 + 短文字列，沒有每行卡片框（`ToolChips.tsx:229-246`）。Diff chip 會在 hover/focus 出現 `createPortal` 浮層，按 viewport 上下空間定位；浮層寬 18rem，行高緊湊並以 add/del tint 示差異（`ToolChips.tsx:130-151,252-330`）。

**現版 ToolRow：** `src/ai/agent-timeline.tsx:262-340` 是重畫過的文本列，但高度至少 32px，仍將 icon、verb、summary 欄、status 和常駐 chevron 放在同一個 trigger（281-295 行）。done/error/cancelled 對應 Badge，已比上游只有工具敘述的輕層級更醒目（290-295 行）。`output` 是帶 border/background 的 `<pre>`（301 行）；文件 chip 本身帶 border、card 背景和 shadow，按 click 後又把 diff `<pre>` inline 展開成第二個框（307-330 行）。與 upstream 的 hover/focus 近旁 portal preview 是不同層級和不同互動節奏；有狀態/觸控需求是可以保留 click，但 D4 應審核是否移除多重邊框、恢復一個輕量浮層而不是把每個資料層都畫成盒子。

**上游 TaskRows vs 現版 TaskRow：** upstream `TaskRows.tsx:185-234` 支援兩個明確 layout：`List` 將 row 合併在一個表面與分隔線內；預設 `Capsules` 是獨立較大圓角 surface。兩者同為 44px row；狀態主要由圓形 spinner/check badge 表達，完成/失敗文字是短 pill（`TaskRows.tsx:154-183`）。現版 `agent-timeline.tsx:352-378` 固定為一列一張 `rounded-xl border bg-card` 卡，狀態 Badge 放在 label 前，再加入 amount、step 和 chevron（361-369 行）。因此它保留了「可展開 task row」語法，但沒有 upstream `Capsules/List` 變體，也把一個 status icon 加成 icon + 長文字 Badge。最直接的忠實度檢查點是 row 的 status/label/amount 水平順序，以及是否採 upstream list/capsule 的兩種密度。

**Reasoning 和 approval 的來源邊界：** 現版 reasoning row 在 `agent-timeline.tsx:227-259` 使用 Brain + `TextShimmer`、Running Badge；上游 ThinkingState 是 sparkle 標題 + rail trace，沒有這個 Timeline Badged row。ToolChips/TaskRows 沒有與 host tool-decision 一對一對應的批准卡。現版 `ApprovalRow` 在 `agent-timeline.tsx:382-405` 的 ShieldAlert + 黃色警告面板（384-391 行）與舊 `HEAD:src/ai/agent-timeline.tsx` 的警告 Rail/Card 幾乎相同。上游 `ApprovalCard.tsx:277-416` 是多題問卷卡；將它直接拿來取代這個有副作用操作授權的 host boundary 會混淆語義。因此此處是舊 YunUI 元件遺留，而不是缺少某個同名 upstream tool approval 元件。

### 3. ApprovalQuestion：平面控件已融合，但尺寸和轉題動態未跟上游

**現版：** `src/ai/approval-question.tsx:156-276` 是新加的 controlled question card。單選分支在 171-218 行用 `RadioGroup/RadioGroupItem`；多選分支在 220-260 行用 `Checkbox`；host 傳入的穩定 ID、disabled/submitting、Other 與文字資料都有明確支援。選項已是沒有邊框的列，只有選中時淡 tint（184-191、226-233 行）；這部分和上游 `ApprovalCard.tsx:323-353` 的平面選項/自訂答案列已接近。RadioGroup/Checkbox 採 YunUI primitives 是刻意的 design-system 融合，不是需要改回手刻控制件的差異。

**比例/動態差異：** 現版外框 `max-w-md`、`rounded-2xl border shadow-sm p-4`（157 行）；上游 `ApprovalCard.tsx:277-287` 是 `max-w-80`（約 320px）一張 surface card。上游選項用 13px 文案、`py-1`、16px control 和 GlideMenu 的單一滑動 highlight（`ApprovalCard.tsx:322-353`）；現版列 `min-h-10`、`px-2.5 py-2`、通常 14px 文案（`approval-question.tsx:184-191,226-233`），比 upstream 高且寬。這是具體的密度差異，不是邊框色差異。

上游問題以 360ms transform + 動態量測 height 推進 track，並用 RollingDigits 顯示 `n / total`（`ApprovalCard.tsx:289-304,381-405`）；現版只 render `activeQuestionId` 對應問題，progress/title 立即更新，沒有 track/height 過場或 footer counter（`approval-question.tsx:107-110,160-163,262-274`）。現版明確要求 host 按 Next，不接受上游單選後 480ms 自動前進（`ApprovalCard.tsx:223-236`）：這是後端/可預期性邊界，不應恢復。D4 的可審範圍是單題卡的寬/列高、host-controlled 題目切換的可見過場、輕量 counter；不改成自動送答案。

### 4. AgentRunStatus：抽出狀態行，未複製 ThinkingState 組合體

目前 `src/ai/agent-run-status.tsx:28-69` 以 `Loader2`、`TextShimmer`、小點組成單行（46、55-68 行），active spin 使用 motion-safe。舊 `HEAD:src/ai/agent-run-status.tsx` 是同一獨立狀態 API、TextShimmer、三個延遲 pulse 點（51-76 行），所以可說它改了標示符密度，但不是原碼上游 ThinkingState 的逐層搬移。

上游 `ThinkingState.tsx:147-193` 把 sparkle/active-or-done text/chevron 作為 ThinkingBlock header；點開後同元件含完整 trace rail（195-220 行）。AgentRunStatus 本身沒有 disclosure、終態 summary text 或 trace slots；timeline/history 另由 `AgentTimeline` 顯示。這種拆分適合「current status 與 durable history 分層」API，但造成上游同一個 status/header+trace 被拆成多塊產品結構。D4 需具體決定在狀態行加入何種上下文/收合關係，不能只再換 status icon；且 terminal 狀態仍以 host phase 顯示，不能照 upstream demo timer 自動變完成。

### 5. ChatComposer：功能來源對得上，視覺尺寸和 demo lifecycle 有意識地不同

上游 `PromptBar.tsx:146-180` 是固定 `h-[288px] max-w-95` 面板，含 tabs/action、來源及命令選單、model picker、attachments/voice 等 demo 狀態。它預設 `demo=true` 並逐步改變游標/來源/模型，展示 steps 在 `PromptBar.tsx:108-133,161-179`。現版 `src/chat/chat-composer.tsx:50-89,150-175` 則以受控 value 與 host item arrays/callback 組成：整列寬度彈性、textarea 高度按內容成長、chip 顯示已選來源，sources/commands/model 菜單是浮層（452-543 行）。兩者共享 prompt + toolbar 概念，現版在功能來源上有實際整合，但不是 PromptBar 的固定尺寸/內置 demo animation port。避免把 upstream 自動 walkthrough、預置品牌與語音/連線展示帶回 production。

## D4 可供 owner 審稿的具體範圍

1. ThinkingBlock：以 `ThinkingState` 單行 status header + 展開 rail trace 為基礎，草擬 card/frame 是否保留；在同一稿標出 Brain/Badge/Framer 舊骨架哪部分移除。步驟、state、文字仍由 host 傳入。
2. AgentTimeline：按 ToolChips 的「24–28px 行 + 一欄低對比 chip + hover/focus detail preview」重列資訊層級；決定 TaskRows 用 capsule 或 grouped list；確定 status Badge 的用途只留需要視覺化辨識的狀態；保留批准警告卡語義並單獨審核其是否沿用 YunUI warning panel。
3. ApprovalQuestion：對照 320px 上游卡及 13px/約 24–28px 平面列，決定目前 `max-w-md`/40px 列是否過鬆；提出 controlled `activeQuestionId` 變化的 height/translate transition 與 progress indicator，不恢復自動跳題。
4. AgentRunStatus：和 ThinkingBlock 的 header/trace 關係畫在同一狀態矩陣中，避免只看單一元件截圖漏掉重複資訊或過度拆層。

本 audit 不批准上述 D4；只有 owner 對具體圖、狀態矩陣與交互逐項批准後，才可動 production AI 外觀。
