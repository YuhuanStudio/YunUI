# Chat 元件整合驗證（3962）

最終驗證使用獨立正式站快照 `http://127.0.0.1:3962`，頁面從最新 `dist` 載入 YunUI 公開元件；沒有使用 D4 research renderer 或注入 ARIA 屬性。窄容器用例只調整宿主 ChatWindow 的 CSS 寬度至 270px。

- Playwright Chromium + WebKit：20/20 通過。包含 390/768/1440px、light/dark 的模型選單幾何與鍵盤選擇，兩引擎 270px 宿主容器，以及 @ 完成後立即改輸入 `/review` 的原回歸案例。結果：[agent-final-3962-playwright.log](chromium/agent-final-3962-playwright.log)。
- Source 與 Command 選單分別開啟完整 host data，hover 可選列後執行 ChatDemo 全元件 Axe；兩種選單 × 兩引擎均為零 violations，無頁面錯誤、console error、HTTP error 或實際 request failure。原生 Next 導覽取消的 `_rsc` 請求另記為 teardown aborts，不算產品失敗。結果與截圖：[populated-menus-3962](chromium/populated-menus-3962/log.json)。
- 模型選單幾何另做 16 組 Chromium/WebKit 截圖與記錄：390/768/1440px × light/dark，加上 270px 宿主寬度 × light/dark。全部 8px 內縮界線與可達選項斷言通過；Axe／鍵盤行為由上述 Playwright 用例涵蓋。見 [model-menu-geometry-3962](chromium/model-menu-geometry-3962/log.json) 和 [montage](chromium/model-menu-geometry-3962/montage.png)。
- Showcase 的 ChatAttachment idle/loading/error 三列於 390/768/1440px × light/dark 共六張截圖；頁面、資產皆無 4xx、console/page error 或 request failure，圖片所需外部來源均在預期清單。見 [showcase log](chromium/showcase-attachment-log-3962.json) 與 [montage](chromium/showcase-attachment-montage-3962.png)。

此次檢查也驗證兩項修正：錨定選單在 ResizeObserver/layout 時序下只讀 DOM 已提交的水平 margin，避免 reduced-motion 模式重複位移；ChatComposer 的插入游標在受控值 commit 時以 layout effect 還原，後續使用者編輯會清除過期位置。全站來源端另由 root 完成 176 項正式瀏覽器合約檢查並全部通過；本 agent 的 40 項 focused unit 測試、typecheck 與 diff-check 亦通過。

此結果只覆蓋元件實作與視覺驗證；版本仍依 owner 的 publication hold，不代表可發版。
