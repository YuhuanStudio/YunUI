# Production AI 元件最終 Chromium 矩陣

## 範圍與證據

- ModelCard/Footer 沿用 3952（未變動的兩家族）；AccountMenu/LanguageSwitcher 取自 3954；Navbar 取自 3955；ModelSelect、ModelManagerCard、CapabilitySelector 在 3956 最新 build 复核。八條 docs routes 共 48 張 Chromium × 390/768/1440 × light/dark 矩陣圖，另有真實互動截圖。
- 完整路徑清單和彙總 diagnostics：`production-final-log.json`。總覽 contact sheet：`all-eight-routes-matrix-montage.png`；3956 新家族 sheets：`final-v3-model-manager-card-matrix-montage.png`、`final-v3-capability-selector-matrix-montage.png`。
- 根據 root 要求只用 Chromium。本次未修改 production source/site build；viewport/theme 都用正常 browser UI 選擇與 viewport API，沒有向元件 DOM 注入 attributes。

## ModelSelect

3956 final build：在 `/docs/ai/model-select` 真實 demo 上驗證搜尋選單可開啟、combobox focus、option 可見；pin/unpin 按鈕在 `role=option` 外，Enter 更新 pinned state 且焦點留在 Unpin；Escape 關閉選單並把 focus 還給 trigger。完整 panel axe (包含色彩規則) 在 `opacity=1`、動畫 settle 後執行，結果為空。3955 過渡 build 曾回報 provider icon redundant alt；3956 已更改裝飾 icon semantics，fresh Axe pass。pin state 圖為 `final-v3-interaction-model-select-pinned-open.png`，最新 JSON 是 `model-select-log-3956.json`。

實際 render 的 trigger accessible name 含 provider icon alt text，非只有 `Claude Opus 4.8`；e2e selector 使用名稱包含 `Claude Opus 4.8` 的匹配而保留 component DOM。

## Navbar、AccountMenu、LanguageSwitcher

**Navbar 768px container**：重測 preview nav 寬為 402px。新 container query 令 desktop links/auth 隱藏並保留 Acme AI、theme 與 Menu；測得可見 child 矩形互不重疊，`overlapPairs=[]`。新圖 `final-navbar-768-light.png` / `final-navbar-768-dark.png`。

**Navbar mobile open menu**：3955 build 的 390px docs Basic 預覽高 430px；Home/Models/Pricing/Docs/Sign In/Sign Up 六列 bounding boxes 全落在框內（`outsideFrame=[]`）。最新 screenshot `final-v2-interaction-navbar-mobile-menu-preview.png` 可看完整登入/註冊列，先前 3954 build 的 340px frame clipping 已解決。全頁位置圖 `final-v2-interaction-navbar-mobile-menu-fullviewport.png`。

**AccountMenu 390px**：右側 collision shift 已生效；開啟 menu rect x=27,width=224，完整位於 viewport 390px 內。Escape 把焦點還給 Yuhuan trigger。圖 `final-interaction-account-menu-open.png`。

**LanguageSwitcher 390px**：選單 rect x=144.68,width=92.80，完整在 viewport 內；可選 English/簡體中文/繁體中文，點繁體中文後 host-controlled trigger label 更新。圖 `final-interaction-language-menu-open.png`。

**3955 navbar container check**：768px page viewport 的 docs content rail 內 Navbar 寬 402px；container query 切到 compact menu，唯一可見 child controls 是 brand/theme/Menu，measure `overlapPairs=[]`。390/768/1440 light/dark 新矩陣與 v2 menu/image artifacts 用 `final-v2-navbar-*.png` 和 `final-v2-navbar-matrix-montage.png`。

## ModelManagerCard、CapabilitySelector

3956 上各有 6 張 viewport/theme matrix captures。ModelManagerCard docs fixture 中 `Select model` checkbox 真正切換 controlled selected styling，axe 在 light/dark 基礎及 selected state 均無 violations。Demo 沒有 empty/disabled host states；Edit/Disable/Delete 顯示 buttons 但沒有 host callback，未誤稱有實際動作，也不執行。

CapabilitySelector demo 可切換 controlled values：點擊 Streaming 選取、點 Vision 取消，再用 Space 選取 Thinking；aria-pressed 與 host state 更新一致。light/dark 和 interaction-state scoped axe 均為空。Docs fixture 未提供 disabled/empty/filter-text controls，這些狀態未測。矩陣和狀態圖片為 `final-model-manager-card-*.png`、`final-capability-selector-*.png`、`final-v3-interaction-model-manager-selected.png`、`final-v3-interaction-capability-selector-selected.png`。完整 run 與 fixture census 在 `manager-capability-log-3956.json`。

## 狀態診斷

3956 ModelSelect/Manager/Capability routes have no page/console/network/http/harness failures, no unexpected origins, and no axe violations. Next `_rsc` prefetches aborted on context close are recorded separately in their JSON logs. 3955 supplies the updated Navbar layout/menu preview and 3954 supplies current AccountMenu/LanguageSwitcher menu placement evidence.

ModelCard/Footer 繼續使用 3952 的 12 張先前 capture，詳見 `PRODUCTION-FIVE-FAMILY-LEDGER.zh-TW.md` 及 `capture-five-families-log.json`。ModelCard interactive host fixture body click 已使 `No model selected` 變為 `Selected for routing`；兩個 copy ID badges 保持各自按鈕，body click 後沒有 copied-state icon。
