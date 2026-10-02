# Beautiful UI 互動與視覺參考稽核

稽核對象：[Beautiful UI](https://www.beautifului.dev/)；官方「Fork this」說明連到 [slev12397/beautiful-ui](https://github.com/slev12397/beautiful-ui)（MIT、Next.js + Tailwind v4）。此頁是靜態互動展示，不是連到即時代理人的產品介面。

本次以 Playwright 讀取公開頁面，在 1440×1000 桌面與 390×844 行動版觀察預設深色與切換後的淺色。互動只限本地展示：切換標籤、展開細節、選擇問題選項、輸入 `@` / `/`、選取文字。沒有送出聊天提示、啟用麥克風、連接 Gmail、填寫電子報、聯絡他人或建立 GitHub fork。截圖保存在 `reference-captures/`。

## 頁面與視覺語言

桌面採固定左側目錄與置中的示範欄：左欄約 240px，主內容約 640px。主內容由編號標題、短說明、圓角示範面板構成，區塊以淡虛線分隔；深色預設以炭黑底、低對比細邊、灰階文字和藍紫色強調色建立層次，淺色模式保留相同版面和圓角。面板右上角提供複製與檢視程式碼按鈕。桌面目錄是固定視覺錨點；行動版隱藏目錄，把品牌、標題和示範改為單欄垂直排列。

首頁狀態：[桌面深色](reference-captures/beautifului-home-dark-desktop.png)、[桌面淺色](reference-captures/beautifului-home-light-desktop.png)、[行動版深色](reference-captures/beautifului-home-dark-mobile.png)、[行動版淺色](reference-captures/beautifului-home-light-mobile.png)。

## 可觀察的互動

| 區塊 | 實際操作與畫面狀態 | 參考截圖 |
|---|---|---|
| Loading State | Drive、Dots、Orbit 在相同小型像素格指示器上切換點陣圖案，旁邊的「Churning」與秒數持續更新；Surfer 則改成「Subway surfing」並出現一個寬畫面卡框。 | [Drive](reference-captures/beautifului-loader-drive.png)、[Dots](reference-captures/beautifului-loader-dots.png)、[Orbit](reference-captures/beautifului-loader-orbit.png)、[Surfer](reference-captures/beautifului-loader-surfer.png) |
| Thinking | 底部四個 pill 切換 Steps、Reasoning、Search、Coding。Steps 與 Reasoning 的示範在等待狀態只顯示「Thinking」；Search 顯示查詢及兩筆來源；Coding 顯示 Read / Edit 檔案操作。標題列可展開或收合目前 trace。 | [Steps](reference-captures/beautifului-thinking-steps.png)、[Reasoning](reference-captures/beautifului-thinking-reasoning.png)、[Search](reference-captures/beautifului-thinking-search.png)、[Coding](reference-captures/beautifului-thinking-coding.png)、[展開 trace](reference-captures/beautifului-thinking-open-trace.png) |
| Streaming Text / Reply | 回覆本文包含行內來源標記、動作列、來源數量按鈕與 follow-up 問題。點開「10 sources」會在同一張回答卡展開三筆可見來源清單（Scoop Data、Trends Index、Market Basket），並保留 follow-up。 | [收合來源](reference-captures/beautifului-streaming-closed.png)、[展開來源](reference-captures/beautifului-streaming-expanded-sources.png) |
| Approval Card / AskQuestion | 對話框式問題置於獨立卡片，單選項目帶圓形選取狀態，底部顯示進度、Skip、Continue。選取「Five (full case)」會立即啟用藍色 Continue；約 650ms 後展示自動移至下一題的狀態（「Which mix-ins should we stock?」、2/3，尚未選取時 Continue 停用）。 | [起始題](reference-captures/beautifului-approval-start.png)、[選取答案](reference-captures/beautifului-approval-first-choice.png)、[下一題](reference-captures/beautifului-approval-next-question.png) |
| Tool Chips / tool trace | 展示區先以「4 tool calls, 2 messages」摘要收合工具流程。展開後是 Thinking、Write、Rebuild、Read 等垂直事件列；程式碼編輯列可展開綠色 diff 摘錄，檔案變更 chip 可再打開紅綠逐行差異。 | [摘要](reference-captures/beautifului-tool-chips-summary.png)、[展開](reference-captures/beautifului-tool-chips-expanded.png)、[程式碼編輯](reference-captures/beautifului-tool-chips-code-edit-expanded.png)、[檔案差異](reference-captures/beautifului-tool-chips-file-diff.png) |
| Task Rows | Capsules / List 只改變三筆任務的排列外觀，完成狀態、供應商數、SKU 數與訊息數仍可掃讀。點擊任務列可以展開子步驟；完成列有綠色勾選與 Completed 狀態，其他列以步驟數顯示進度。390px capsule 樣式會把「Verified vendor records」縮成省略文字，但保留供應商數及完成標籤。 | [Capsules 桌面](reference-captures/beautifului-task-rows-capsule-default.png)、[List 桌面](reference-captures/beautifului-task-rows-list.png)、[Capsules 行動版](reference-captures/beautifului-mobile-dark-task-rows.png)、[淺色行動版](reference-captures/beautifului-mobile-light-task-rows.png) |
| Chat | Flavors / Suppliers 是聊天面板上方的分頁。切換後選取樣式改變；展示文字是固定樣例，不是即時模型回覆。輸入框提示「Prompt or tag a flavor with @」；本次輸入 `@vanilla` 只顯示字串，沒有出現建議清單。 | [Flavors](reference-captures/beautifului-chat-flavors.png)、[Suppliers](reference-captures/beautifului-chat-suppliers.png)、[@vanilla](reference-captures/beautifului-chat-vanilla-tag.png) |
| Prompt Bar | Rounded / Pill 切換輸入列形狀，模型按鈕開啟帶 tier/status 的選單：Sprinkles 5 / Flagship、Vanilla 1 / Basic（已選）、Freezer Burn 0.4 / Stale。點 `@` 開啟來源面板（Add photos & files、Scoop Data、Flavor records、Web search、Figma、Slack、Gmail）；`/` 顯示 compare、churn-plan、restock、draft-email、summarize 等命令。Gmail 列有 Connect。麥克風按鈕標為 Start dictation，本次未啟用。 | [Rounded](reference-captures/beautifului-prompt-rounded.png)、[Pill](reference-captures/beautifului-prompt-pill.png)、[@來源](reference-captures/beautifului-prompt-at-sources.png)、[/命令](reference-captures/beautifului-prompt-slash-commands.png)、[模型選單](reference-captures/beautifului-prompt-model-picker.png)、[行動版來源面板](reference-captures/beautifului-mobile-dark-prompt-at.png) |
| Agent Screen | 示範是一張 macOS 桌面畫面預覽，底下切換 Open、Working、Loading。Working 顯示畫面縮圖；Loading 顯示黑色預覽窗、旋轉指示器及「Connecting to agent's screen」。這只是網站中的樣例畫面，不代表讀取了本機螢幕。 | [Open](reference-captures/beautifului-agent-screen-open-state.png)、[Working](reference-captures/beautifului-agent-screen-working.png)、[Loading](reference-captures/beautifului-agent-screen-loading.png) |
| Selection Actions | 在回覆段落上選取文字後，浮動工具列貼近選取區下方；包含 Explain、Improve 和更多動作。展開更多動作後顯示 Shorten、Tone，並可再往下展開 Grammar。旁邊有「Describe edits」欄位與送出圖示。僅觀察選取與工具列，未送出指令。 | [選取區工具列](reference-captures/beautifului-selection-actions-toolbar.png)、[更多動作](reference-captures/beautifului-selection-actions-more-open.png) |

## 版面適配與證據界線

行動版隱藏目錄，卡片改為近乎滿寬，互動控制會換行或垂直排列。Prompt Bar 的來源面板仍完整顯示在輸入列上方；Task Rows 可以放進單欄，但 capsule 的長任務名會省略。淺色、深色版本都維持相同結構，差異主要在背景、面板、邊框、文字階層。

這些觀察可用於後續設計討論；尚未提出或實作 YunUI 的 AI 元件重設計。網站提供的複製程式碼、元件 source 及互動模型應由後續 review 與設計核准決定是否採用。
