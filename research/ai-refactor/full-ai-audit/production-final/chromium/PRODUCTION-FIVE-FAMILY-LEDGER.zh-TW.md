# Production AI 元件像素驗證（5/6 家族，ModelSelect 待重建）

**歷史 run：** 本檔初版及 `capture-five-families-log.json` 來自 3952 舊建置，已被 root 後續的 Navbar/AccountMenu/LanguageSwitcher/ModelSelect 修正取代。請以同目錄 `PRODUCTION-FINAL-LEDGER.zh-TW.md`、`final-changed-routes-log.json` 及 `final-*.png` 為最終四家族證據；本檔保留 ModelCard host-fixture 行為觀察與早期 issue trace。

Production docs server：`http://localhost:3952`。本輪只用 Chromium，沒有修改元件/文件/server，也沒有對 component DOM 注入屬性；theme 切換經由 docs 的 Light/Dark 按鈕，視窗尺寸由 Playwright viewport 設定。

矩陣已完成 ModelCard、AccountMenu、LanguageSwitcher、Navbar、Footer 五條 docs route：每條 route 的 390/768/1440 × light/dark 共 30 張實際元件預覽圖。互動另有 4 張圖（開啟 AccountMenu、LanguageSwitcher、Navbar mobile menu、ModelCard body selection）。ModelSelect source 正由 root 修 nested interactive pin DOM；待新 build/3952 refresh 後再拍其 6 張矩陣圖與 open-menu state，故本報告**尚非 6-route 最終驗收**。

- 總覽：`five-families-matrix-montage.png`
- Family sheets：`model-card-matrix-montage.png`、`account-menu-matrix-montage.png`、`language-switcher-matrix-montage.png`、`navbar-matrix-montage.png`、`footer-matrix-montage.png`
- ModelCard 點擊後：`interaction-model-card-body-select.png`
- Navbar 完整 mobile viewport：`interaction-navbar-mobile-menu-viewport.png`
- 完整 run log：`capture-five-families-log.json`

## 觀察

**ModelCardInteractiveDemo** 以真實 docs host fixture 的 GPT-4o card 測試：點擊描述 body 後狀態成為 `Selected for routing`；兩個 ID badge `gpt-4o`、`gpt-4o-latest` 仍保持各自可操作 button，body click 後沒有任何 ID copy success icon。390/768/1440 寬度的卡片排版清楚，light/dark 都可讀。

**AccountMenu、LanguageSwitcher、Footer** 的 closed matrix 視覺清楚，沒有發現控制/主題缺陷。AccountMenu open、language list 選 locale、Escape 還焦點及 host locale label 更新均有 Playwright assertion。單獨擷取 preview box 時會把部分 overlay 排除在 screenshot clip 外；全 viewport captures 顯示 LanguageSwitcher 三個 locale 皆完整。AccountMenu menu 所有選項也都顯示，但 docs demo 把 trigger 放在預覽中央，menu 貼齊 viewport 左側；真實 navbar host 的 trigger 位置會不同。

**Navbar Basic 在 768px** 的當前 docs 預覽明顯重疊。DOM 幾何證據：預覽中的 nav 實際寬 402px；brand x=334–439、Home x=360–420；Models x=444–507、theme toggle x=498–538；Docs x=616–676、Sign Up x=610–694。它以 viewport breakpoint 顯示 desktop nav，但 docs route 的文章欄較窄，造成重疊；390px mobile 和 1440px desktop matrix沒有這種情況。這是真正已觀察到的窄容器 responsive 問題，尚未修 source。

Navbar mobile menu 展開後四個 link 節點存在於 DOM，但 docs Basic 預覽高度僅 130px 且 `overflow-hidden`，open state 的 panel 在該 preview box 中被裁切；全 viewport screenshot 也證實只看見 Home 開頭，後續連結被 preview clip 擋住。`interaction-navbar-mobile-menu-viewport.png` 保存此 docs wrapper 裁切實況。

Navbar docs Basic fixture 使用預設 `/login`、`/signup`。Next Link prefetch 在六個 navbar matrix 截圖與 mobile interaction 中對兩條不存在的 route 回 HTTP 404（共 14 記錄，console 亦有相應 404 訊息），未點擊這些連結。這屬於 docs fixture destination mismatch，與 Navbar layout overlap 分開記錄。

## 機器結果

`capture-five-families-log.json` 記錄 30 matrix + 4 interaction captures，`failures`、page errors 為 0。它也未隱藏其餘診斷：14 個 Navbar `/login`/`signup` 404、其對應 console 訊息，以及 554 個 Next `_rsc` prefetch 在 Playwright page/context 結束時回報 `net::ERR_ABORTED`，完整清單在 `nextPrefetchCancellations`。這些 RSC prefetch abort 是頁面 teardown 的取消事件，和被實際要求並收到 404 的路徑分開列示。唯一外部 asset origin 為網站原有 Google Fonts (`fonts.googleapis.com`)；其他請求是 localhost:3952。

Root 修正 ModelSelect 並重建 3952 後，需新增 ModelSelect 6 張 capture/open menu 圖並更新此 ledger、總覽 montage 及 log，再做最後全六 route pixels review。
