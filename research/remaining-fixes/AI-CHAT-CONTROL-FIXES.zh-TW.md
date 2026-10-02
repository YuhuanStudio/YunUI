# 現有 AI/chat 功能修正

這批修正處理現有元件的功能契約，不是將尚未批准的 D3 移入正式元件。

| 可重現缺陷 | 修正 | 實際驗證 |
| --- | --- | --- |
| 停用的 ModelSelect option 仍觸發 onChange | 指標選取受 disabled 限制，鍵盤跳過停用項目 | 強制點擊不回呼；兩次 ArrowDown 選到後續可用項目 |
| Esc 關閉 ModelSelect 後焦點落到 body | Esc/選取後還原 trigger 焦點；外部點擊不搶回焦點 | Chromium/WebKit activeElement 檢查 |
| 收合的 AgentTimeline output 仍可取得焦點 | 保留 grid 動畫，closed subtree 使用 inert 與 aria-hidden | closed 的 Tab 跳過，open 的 Tab 可聚焦 output |
| 缺宿主批准/退回回呼仍可操作 | 缺回呼的對應按鈕 disabled | 無回呼 disabled，有回呼計數更新 |
| loading 且沒有 onStop 的 Stop 仍可操作 | 缺回呼時 Stop disabled | 無回呼 disabled，有回呼計數更新 |
| IME commit Enter 的 isComposing=false/keyCode=229 誤送 | 保留 draft，不將組字 Enter 當送出 | 單元重現與兩引擎實際事件；普通 Enter 仍送出、Shift+Enter 仍換行 |

型別檢查、36 檔/302 個單元測試、套件與文件網站 build 通過；30 個採用工具測試及 publint 通過。正式 `chat.spec.ts` 的兩引擎、三尺寸、明暗主題共 12 個案例通過，並已加入 CI。

修後完整 Playwright 再跑為 104/104（46 content、40 search、12 chat、6 Chromium pixel baselines），輸出保存於 `evidence/ai-all-browser.txt`。獨立 runtime fixture 的截圖/操作不混入這 104 個案例。

独立消費者 fixture 從真正 `/ai`、`/chat` 公開入口匯入修後 dist，驗證記錄在 [runtime-test-log.json](./ai-runtime/captures/runtime-test-log.json)。12 張矩陣截圖涵蓋 Chromium/WebKit × 390/768/1440 × light/dark；根代理實看 WebKit contact sheet 與手機深色，瀏覽器代理實看 Chromium contact sheet 與桌面深色。瀏覽器、console、request、HTTP errors 均為空，只有 localhost:3945 請求。可重跑 `ai-runtime/capture-and-test.mjs`。

ChatComposer 另有完整控制區矩陣 [chat-control-matrix.png](./evidence/chat-control-matrix.png)，根代理已實看；測試輸出在 `evidence/chat-ime-browser.txt`、`evidence/ai-contract-unit-tests.txt`。

D3 原碼移植草稿的可替換輔助標籤亦已準備，包含 undefined 時保留預設值與附件 formatter 回退；這些目前只在 research 內，不是正式公開 API。D3 仍待擁有者批准，正式 AI 重構與宿主執行整合未完成。發版與部署仍暫停。
