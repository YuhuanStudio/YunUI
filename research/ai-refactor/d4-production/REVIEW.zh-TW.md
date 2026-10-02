# D4 Chat 正式來源與渲染覆核

**範圍：**只讀檢查 shared production docs site `http://localhost:3957` 的正式公開元件及 ChatDemo；未改 `src`、site、demos 或 CSS。被檢查的 public routes 為 `/docs/ai/thinking-block`、`/docs/ai/agent-timeline`、`/docs/ai/approval-question`、`/docs/ai/agent-run-status`、`/docs/chat`。所有 routes 為 HTTP 200。

## 測試結果

`verify.mjs` 使用正式 site、真正 public components、可見 theme controls 和 Playwright viewport，不把 3946 prototype 或測試注入的 DOM 當 production 證據。每個引擎包含四個 component pages 的 390/768/1440 × light/dark 預覽，以及 ChatDemo 五個狀態同樣的 30 格，共 54 個 Axe 預覽檢查／engine、108 張截圖。JSON 與 captures 位於 [`production-review.json`](./production-review.json) 和 [`captures/`](./captures/)；頁面、console、HTTP、request error 陣列皆為空。

- 四個 standalone public component routes 共 24 格／engine；Chromium 和 WebKit 的元件 scoped full-rule Axe 均為零違規。
- Chromium Chat 五狀態共 30 格 full Axe 零違規。WebKit 在重用同一 page 並於 viewport/theme 間切換的矩陣有 4 筆 390px light `color-contrast` hit，selector `.block.truncate.text-sm` 或 `.block.truncate.font-medium`，failure summary 顯示 `#ededed` on `#ffffff`。在每種狀態用全新 WebKit page 重測並等候穩定後，五狀態全部零 Axe 違規；暗→亮切換後立即及 300/700ms full Axe 也全通過，資料見 [`chat-states-stable.json`](./chat-states-stable.json) 與 [`chat-light-theme-switch-recheck.json`](./chat-light-theme-switch-recheck.json)。我沒有將重用頁面的 4 筆讀值隱去：目前無法在獨立穩定頁或主題切換穩定後重現，視為矩陣 harness/theme 切換瞬間的暫態，不是已確認元件 bug。
- D4 互動證據在 `production-review.json` 的 `interactions`：ThinkingBlock 按鍵收合後 trace 帶 `inert`，展開可由 host 選步驟；AgentTimeline 按鍵收合、展開及 inert 通過，沒有 host approval callback 時 Allow/Deny disabled；ApprovalQuestion 可選 Other、輸入文字、明確 Next/Submit，`submitting` 停用選項與 Dismiss。填問卷只顯示「answers collected locally」，工具仍 pending；Deny 轉為 `cancelled`，failed fixture 是 `failed`，Allow 只透過 host callback 顯示完成狀態。
- ChatDemo Working 的 Review tool 展開後直接 render host `ContentCodeBlock`，12 行內容、Edit callback 收到 `verification.ts` 與 12-line 資料。legacy string `output` 仍可在其他工具列顯示；不會把 host CodeBlock 包成舊 terminal panel。相關正式元件來源是 `src/ai/agent-timeline.tsx` 新增的 `AgentTimelineToolEntryBlock.outputContent`。
- 多 Timeline/Unicode/collision ID 案例由 `src/__tests__/ai-chat-d4-contract.test.tsx` 驗證；source unit tests 已跑過 75 個 focus cases。正式 docs 頁沒有重複 Unicode ID fixture，因此不把 prototype 當多實例 browser 證據。

## 與 3946 D4 prototype / Beautiful UI source 的差異

3946 prototype 原始 capture 在 `research/ai-refactor/prototypes-v4/captures/chromium-1440-light-working.png`，採用 Beautiful UI checkout commit `44a274e598395ab61e7c96c26fda2758780253b7`。實際 upstream paths 為 `reference/beautiful-ui/components/primitives/ThinkingState.tsx`、`ToolChips.tsx`、`TaskRows.tsx`、`ApprovalCard.tsx`；授權文字為 `licenses/beautiful-ui-MIT.txt`。目前 source JSDoc 亦固定同一 commit/path。

| 元件 | 上游主要結構與互動 | 正式 YunUI 實作 | 保留的 host 邊界 |
| --- | --- | --- | --- |
| ThinkingBlock | `ThinkingState.tsx` compact sparkle/status button、可收合 trace、細左軌、step status glyph | 公開元件是細 header + sparkles + 展開後 host step rows，無舊的大 Brain 卡、無包住整段 reasoning 的卡片；工具列與微動畫服從 host `isStreaming`/step status。 | 不帶上游的 stage timers、variant fixtures、`onSettled`; `content`, steps, status, active title、selected step 與 controlled `open` 都來自 host。 |
| AgentTimeline | `ToolChips.tsx` compact header、工具列 chip、逐列 disclosure、file diff；`TaskRows.tsx` compact status row、meta、detail disclosure | timeline summary 按 host rows 統計，沒有推測 message count；tool/task rows 為無厚卡片的短列，status glyph/terminal label，detail 透過 inert collapse；diff chip 仍 host-driven。 | 移除 upstream `useSequence`、靜態任務資料、portal hover fixture；statuses/details/answers/callbacks 由 host 提供。新增 `outputContent` 直接呈現 host rich ReactNode，優先於 legacy `output` string。 |
| ApprovalQuestion | `ApprovalCard.tsx` 一張 surface、題目與平面 radio/check rows、Other 和 next/submit 行為 | 外層只有一個輕 surface；每個選項不是獨立卡片，使用 YunUI core `RadioGroup`/`Checkbox`，Other 仍同列並受控。 | 穩定 question/option IDs、controlled answers/activeQuestionId、明確 Next、host submit/busy/disabled；移除 upstream 延遲 auto-advance/auto-submit 與示範答案。問卷提交不等同 tool Allow/Deny。 |
| AgentRunStatus | `ThinkingState.tsx` compact current-state headline | 單行 status icon + host label，thinking 用 sparkle、其他 active phase 用 loader、terminal phase 用 check/alert/x；無 Brain card 或另一個浮動 run pill。ChatDemo 只把它放在 assistant message header。 | label/phase/active 都由 host 控制；不產生 transition timer。 |

3946 prototype 與 production ChatDemo 的框架有所不同：prototype 的比較按鈕/訊息內容和 source/tools/diff fixture 都屬 prototype；production 有 docs 本身的 Idle/Working/Approval/Done/Error 本機控制、YunUI `ChatHeader`/`ChatComposer`、真實 CodeBlock slot。Production working 的 tool disclosure 預設關閉，使用者點開才看 output/diff；這是來源 API 的 `defaultOpen`/controlled disclosure 契約，不是 prototype 的 `staticStep` 定時顯示。沒有在元件中引入上游計時器或授權行為。

## 發現與可用限制

1. Source contract 有一個我已回報 root、但本覆核未修改的 a11y 關聯缺口：AgentTimeline 的全域 summary button 有 `aria-expanded`，對應 Collapse 有 per-instance `contentId`，但 summary button 未設 `aria-controls={contentId}`。按鍵開合及 `inert` 正常；缺的是明確控制關係。
2. 四個公開元件的三語 docs 有外觀文字沿用舊殼：ThinkingBlock 還說「active badge」與 blinking caret，AgentTimeline 還稱 connected vertical timeline、錯誤會把 row/console 染紅；實際 D4 是 sparkle/compact rows、error status glyph 與中性 code surface。這三語文件也沒有 `outputContent?: ReactNode` 的 precedence/legacy string 說明。未改 docs，讓文件 owner 選擇處理。
3. 在 390px **docs `ComponentPreview` framing** 裡，ChatDemo root 實際寬度約 270–276px（preview 自帶 40px 內距），長工具摘要/CodeBlock header 因此過窄換行，部分名稱拆成多行。這是 docs frame 測量，不代表 consumer app 的 ChatMessageList 只有 270px；ChatDemo 在更寬產品容器 1440px 的實際渲染正常。截圖是 preview frame，避免把這項當成 source contract failure。

Representative inspected production PNGs:

- [ThinkingBlock, Chromium 1440 light](./captures/chromium-thinking-block-1440-light.png)
- [AgentTimeline, Chromium 1440 light](./captures/chromium-agent-timeline-1440-light.png)
- [ApprovalQuestion, Chromium 1440 light](./captures/chromium-approval-question-1440-light.png)
- [AgentRunStatus, Chromium 1440 light](./captures/chromium-agent-run-status-1440-light.png)
- [Chat Working, Chromium 1440 light](./captures/chromium-chat-working-1440-light.png)
- [Chat Working, stable WebKit 390 light](./captures/webkit-chat-working-390-light-stable.png)

## 最終 ThinkingBlock metadata 修正確認（build `vWEC-UfH9IhmBJPrHqaxB`）

Root 在上面的 production snapshot 之後修了窄容器 metadata。最新真實 site snapshot 位於 `http://127.0.0.1:3961`（獨立複製的 standalone/static/public；不讀共享 `.next`）。單獨重驗 `/docs/chat` 的 Working trace：

| Browser viewport | ThinkingBlock 實際容器寬 | label / metadata 幾何 | Axe / runtime |
| --- | ---: | --- | --- |
| Chromium 390 | 268px | `Render the Navbar page` 為 213px 可讀文字列；`3 locales` 在下一列，沒有截掉主 label | Full Axe 0，page errors 0 |
| WebKit 390 | 256px | 201px label；`3 locales` 在下一列 | Full Axe 0，page errors 0 |
| Chromium 512 | 390px | 280px label 與 47px metadata 在同一列 | Full Axe 0，page errors 0 |
| WebKit 512 | 384px | 274px label 與 47px metadata 在同一列 | Full Axe 0，page errors 0 |
| Chromium/WebKit 1440 | 680px | label 與 metadata 同列 | Full Axe 0，page errors 0 |

layout boxes、文字及 Axe 原始紀錄：[`thinking-layout-3961.json`](./thinking-layout-3961.json)；六張最新圖為 `captures/{chromium,webkit}-thinking-chat-{390,512,1440}-light.png`。此修正使用 ThinkingBlock 自身的 inline-size container query，390 瀏覽器 viewport 內的 256–268px 真實 host 容器依窄版排版，512 viewport 內的 384–390px host 容器回到 metadata 同列，非依賴 viewport media query。
