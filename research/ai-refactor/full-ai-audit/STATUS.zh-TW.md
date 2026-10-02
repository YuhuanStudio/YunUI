# 全 AI Surface 稽核狀態

## 最終矩陣補驗

ManagerCard/CapabilitySelector 的兩引擎矩陣已補完：每個引擎各 12 張（兩 routes、三尺寸、light/dark），scoped Axe 無違規，checkbox 與能力選擇使用真實 fixture callback 驗證。見 `production-final/chromium/final-v3-model-manager-card-matrix-montage.png`、`final-v3-capability-selector-matrix-montage.png`，以及 `production-final/webkit/model-manager-card-capability-selector-3956.json`。下文較早的「待補」由本節取代。

圖示 12-case 恢復矩陣亦已完成。最新 ModelSelect 3956 完整 Axe 在兩引擎均 clean；新增的 12 browser cases 全部通過。

CapabilitySelector 的 modelType/disabled 由 source audit 與既有 unit tests 覆核，docs fixture 沒有這些切換，不宣稱 browser 全窮舉。Manager 的宿主 actions 未接後端，不宣稱驗過後端操作。新外觀仍待 owner 審核。

**工程修正與本輪確認完成；D4 外觀整體稿仍待 owner 核准。** 不將研究稿視為 production 變更授權。Root 回報整合檢查為 367 個 unit tests、160 個 production browser tests、30 個 agent-tool checks 通過。本稽核另有針對近期改動 routes 的 Chromium/WebKit production 截圖與互動檢查；證據依 build 版本記錄，避免混用舊 CSS 或舊站點。

## 本輪涵蓋範圍

| Family | Source / docs route | 本輪已確認的實作與行為 | 最新實際 production 證據 | 尚未涵蓋 |
| --- | --- | --- | --- | --- |
| ModelCard / IDBadge | `src/ai/model-card.tsx`, `src/ai/id-badge.tsx`; `/docs/ai/model-card`, `/docs/ai/id-badge` | card click 與 ID copy/link/host controls 分離；支援 0 資料值。真實公開元件 host fixture 驗證 body click 選取、copy 不會選取 card。 | Chromium 3952 和 WebKit 3954 的 390/768/1440 × light/dark capture；WebKit host fixture body/copy 互動通過。總表見 [`PRODUCTION-FINAL-LEDGER.zh-TW.md`](./production-final/chromium/PRODUCTION-FINAL-LEDGER.zh-TW.md)、[`production-webkit-matrix.json`](./production-final/webkit/production-webkit-matrix.json)。 | 本輪未完整檢查 IDBadge 的每個 copy feedback 狀態。 |
| ModelSelect | `src/ai/model-select.tsx`; `/docs/ai/model-select` | Pin 已移出 option 子樹，option 關聯由 `aria-owns` 維持，context 以 `aria-description` 提供；Pin/Unpin 以 host-controlled 按鈕操作並保留焦點；Escape 從 search 或 Pin 還原 trigger focus。provider/filter/count、alias 次要文字對比與重複 icon alt 已修。 | Chromium 3955 390/768/1440 × light/dark；WebKit 3955 同矩陣。Keyboard pin、焦點、Escape 及 `aria-required-children`、`nested-interactive`、`aria-valid-attr-value` scoped axe 均通過。3956 新 source 上的 full-rule Axe settled-state 結果為空：[`model-select-full-axe-3956.json`](./production-final/chromium/model-select-full-axe-3956.json)。Chromium capture/log 在 [`chromium/final-v2-changed-routes-log.json`](./production-final/chromium/final-v2-changed-routes-log.json)（3955 歷史 build）；WebKit 在 [`model-navbar-3955-final.json`](./production-final/webkit/model-navbar-3955-final.json)。 | 3956 full-rule Axe 專項在 390px Chromium 完成；最新 decorative icon source 尚未重拍完整 390/768/1440 雙引擎矩陣。 |
| ModelManagerCard | `src/ai/model-manager-card.tsx`; `/docs/ai/model-manager-card` | docs fixture 的 Edit/Disable/Delete icon actions 有 accessible name；Approved 狀態使用 YunUI semantic Badge。 | 3952 docs-preview 1440/390 light capture，Chromium scoped Axe 無違規。 | 沒有本輪 390/768/1440 × themes × 兩引擎完整矩陣；busy/empty/error 由 host slot 管理。 |
| CapabilitySelector | `src/ai/capability-selector.tsx`; `/docs/ai/capability-selector` | controlled state 與基本 selectable/disabled preview 已檢查。 | 3952 docs-preview 1440/390 light capture，Chromium scoped Axe 無違規。 | 沒有完整多引擎/多主題矩陣或所有 model type 的截圖。 |
| Provider / Model icons | `src/ai/provider-icons.tsx`, `src/ai/model-icons.tsx`; `/docs/ai/provider-icon` | image load failure 後更換來源能重置 fallback 狀態；`icon-error-reset.test.tsx` 覆蓋。 | 12 case cross-engine matrix（Chromium/WebKit × 390/768/1440 × light/dark）實際將 provider/model image request 送至 404 後切換成功 URL；每一 case recovery 成功且無 browser error。證據：[`final-cross-engine-matrix.json`](../../remaining-fixes/icon-error-reset/final-cross-engine-matrix.json) 及 before/after capture。 | 此矩陣是獨立 failure/recovery fixture，不代表 provider icon docs preview 也有同等 12 個截圖；功能失敗/更換來源已覆蓋。 |
| AccountMenu | `src/ai/account-menu.tsx`; `/docs/ai/account-menu` | popup 用 shared anchored-position 計算右緣 shift/上下位置；鍵盤 roving 與 Escape focus restore 由 contract tests 驗證。390px 實際 popup 完整位於 viewport。 | Chromium 3954 與 WebKit 3954 的 390/768/1440 × light/dark screenshots；menu-open 互動捕捉於 Chromium/WebKit production logs。 | 無本輪發現需修功能問題。 |
| LanguageSwitcher | `src/ai/language-switcher.tsx`; `/docs/ai/language-switcher` | 右對齊 popup 將 shift 套在 `marginRight`；左對齊保留 `marginLeft`；Escape focus restore、pending 與 locale host callback 已檢查。390px menu 完整在 viewport。 | Chromium 3954 與 WebKit 3954 的 390/768/1440 × light/dark screenshots；menu-open 互動在兩引擎確認。 | 無本輪發現需修功能問題。 |
| Navbar | `src/ai/navbar.tsx`; `/docs/ai/navbar` 英／簡中／繁中 | desktop/mobile switch 改用 nav 自身 720px container query，768px viewport 中 402px nav container 不再重疊；brand/theme/Menu 互不相撞。各語言 Basic preview 高度調為 430px；示例 auth href 改 `#` 並註明宿主應傳實際路由。 | Chromium/WebKit 3955；390/768/1440 × light/dark。Navbar 768 overlap pairs 為空；mobile preview 的 Sign Up 在 frame 內完整可見。Chromium [`final-v2-changed-routes-log.json`](./production-final/chromium/final-v2-changed-routes-log.json)、WebKit [`model-navbar-3955-final.json`](./production-final/webkit/model-navbar-3955-final.json)。 | 無本輪發現需修功能問題。 |
| Footer | `src/ai/footer.tsx`; `/docs/ai/footer` | heading hierarchy、品牌 logo alt、重複 `#` link keys 已修。 | Chromium 3952、WebKit 3954 的 390/768/1440 × light/dark screenshots；Chromium scoped axe 通過。 | 本輪未覆蓋 0/1/3/5 sections 各資料數量的完整視覺狀態。 |

## 最新互動與 Axe 結果

- 正確 CSS 掃描的 latest site build 為 **3955**。建置 CSS 確認 Tailwind 產生 `@container yunui-nav (min-width:720px)`，且 YunUI dist utility styles 有被掃描。3955 Chromium 截圖在 [`production-final/chromium/`](./production-final/chromium/)；WebKit 截圖在 [`production-final/webkit/captures/`](./production-final/webkit/captures/)。
- ModelSelect 舊版本曾有 listbox `aria-required-children` critical 與每個 pinned/unpinned option `nested-interactive` serious。最新 source 已移出 Pin 控件並修正 group/icon 關聯；3955 Chromium/WebKit 真實 host fixture 重測後，指定 ARIA 規則為空，Pin Enter、focused Unpin、Escape focus restore 都通過。
- 3955 Chromium full-scoped ModelSelect Axe 曾回報 1 項 minor `image-redundant-alt`，root 已將 filter icon 設為 decorative。使用 root 新 dist 重建的 3956 production site、等待 panel opacity=1 且動畫完成後，以 Axe default full rule set 重測真實 docs preview，violations/page errors 均為空；結果記錄於 `model-select-full-axe-3956.json`。舊 3955 的 `final-v2-changed-routes-log.json` 保留為該舊 build 的歷史證據。
- Navbar 早先 340px ComponentPreview 會把 Sign Up 底部裁掉 26px；三語文件已加高至 430px。3955 Chromium 與 WebKit 實測完整可見且在 frame 範圍內。
- AccountMenu/LanguageSwitcher 的 3954 互動檢查確認 right-edge shift 生效；390px popup bounds 完整在 viewport 內。這些 menu source 在 3955 沒有變更，無須重拍。
- Root 最終回報 160 項 production Playwright 測試通過，紀錄 `/tmp/yunui-final-browser-production-valid.log`；本項 source 後續建置後，ModelSelect/Navbar 改動 routes 再以 3955 窄範圍重測。舊 3951 scratch CSS 掃描錯誤的 contrast 結果已作廢。

## D4 草稿與剩餘審核

[`PROPOSAL-D4.zh-TW.md`](./PROPOSAL-D4.zh-TW.md) 和 [`preview.html`](./preview.html) 是研究用共通視覺稿，狀態仍為 **待 owner 核准**。草稿的雙引擎/狀態矩陣不構成套用到 production 的許可。尚未取得 owner 核准前，不應將草稿視覺搬入已發布 AI 元件。

正式頁面矩陣已覆蓋 ModelCard、ModelSelect、AccountMenu、LanguageSwitcher、Navbar、Footer；Provider/Model icon 的 404→恢復也有 12-case Chromium/WebKit fixture 矩陣。ModelManagerCard、CapabilitySelector 尚無完整 390/768/1440 × light/dark × Chromium/WebKit 矩陣，已由 root 安排補測。各家族以 host data 呈現的所有 busy/empty/failed 組合亦未逐一做視覺矩陣。ModelSelect 3955 的 duplicate-alt finding 已修，3956 settled-state full Axe 為空。D4 設計核准仍待 owner；沒有將待設計核准當成 production 採用。
