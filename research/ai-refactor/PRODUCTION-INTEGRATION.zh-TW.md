# D3 正式整合

擁有者於 2026-10-01 批准 D3 並要求真正替換現有 YunUI 元件，以及有限融合既有 YunUI 美感。這輪修改的是公開元件實作，研究 demo 不作交付。

| 既有公開元件 | 正式改動 |
| --- | --- |
| ChatComposer | 來源/指令/模型選單、穩定 ID、受控選取、游標與選取區域補全；保留舊 props/slots/label aliases |
| ChatMessage | 更緊湊的訊息層次、重用 YunUI Avatar、動作在正常排版流中持續顯示 |
| ChatHeader | 輕量頁首與響應式換行，既有 slots 保留 |
| ChatAttachment | 緊湊的附件表面與既有主題；不將非有限數值當作進度 |
| ThinkingBlock | 上游式思考/處理詳情、宿主傳入步驟和可控展開，既有內容/翻譯/renderer 保留 |
| AgentTimeline | 上游式工具/任務/差異展示、受控批准等待、收合與鍵盤；舊 reasoning/tool/approval 仍可用 |
| AgentRunStatus | 輕量活動摘要與終態，宿主提供狀態，不以計時器推斷結果 |

新增 `ApprovalQuestion` 是穩定 question/option ID 的受控問答，重用 YunUI RadioGroup、Checkbox、Button。回答、下一題、提交、等待及關閉均由宿主處理；它不等於工具執行授權。

正式入口是 `/docs/chat` 與各元件文件頁，均從公開 exports 匯入；英文、簡中、繁中文件與 typed consumer recipe 已更新。上游參考固定在 `44a274e598395ab61e7c96c26fda2758780253b7`；MIT 原文與第三方來源聲明納入 npm 打包。

## 相容性與宿主邊界

- 原匯入名稱保留；legacy `AgentTimelineBlock`、`AgentTimelineToolStatus`、`AgentTimelineIconName`、`AgentRunPhase` 保持原 union。新任务/取消/圖示使用獨立 Entry/State 型別，已有資料仍可傳入。
- 所有來源、模型、命令、答案、工具結果與 runtime state 由宿主提供；沒有庫內示範資料、模型請求或假執行計時器。
- command.insertText 原樣插入；中途游標操作保留未選取後文，IME 不會誤送。
- 沒有 handler 的動作不可偽裝可操作；忙碌批准與問答不記錄虛構成功。consumer recipe 等宿主接受才清草稿，拒絕/錯誤及等待時的新編輯都保留。
- 融合既有 YunUI 字體、主題、圖示與基本控制；不將 Beautiful UI 的全域 CSS 或商業圖示混入套件。

## 驗證

正式文件的 Agent Chat 矩陣涵蓋 Chromium/WebKit、390/768/1440、light/dark/true-black、五種狀態，加上選單/問答/工具回呼/游標/IME/scoped axe。來源 chip 與選單描述對比已使用既有 secondary 文字色修復；空選單用 status 語義，不宣稱有不存在的 listbox 選項。

最終覆核：39 檔/332 單元測試、30 採用工具測試、型別檢查、library/site build、publint 通過；Agent Chat 102 案例加上原有 104 回歸共 206 個瀏覽器案例通過。90 張新狀態矩陣截圖、scoped axe、來源/模型/命令、游標/IME、Question/工具批准/拒絕/失敗以及捲動行为均已驗證。拒絕後沒有顯示被拒絕命令曾執行；問答提交不批准工具。日志在 `production-evidence/`。

根代理實看正式桌面 Working、手機淺色 Approval、桌面純黑 Error；瀏覽器代理另實看手機 Working/Approval、平板 Done、桌面 Approval/Working/Error。長元件截圖暫時隱藏文件站自身的 sticky chrome，保留原佔位與元件排版；這是獨立元件攝影，不是移除產品的可見元素。未發版、部署或推送。

這份交付涵蓋批准的 D3 Agent Chat；不將其他尚未批准的 AI 設計算作已重構。
