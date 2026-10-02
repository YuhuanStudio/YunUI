# D4 全 AI Surface 共用語法（審核稿）

**最新狀態：WITHDRAWN_OUT_OF_SCOPE。擁有者已排除 Model workspace 與模型卡等非聊天元件的外觀重構，維持原本設計。以下僅保留歷史研究，不再送審或移植；取代下方原有待審說明。**

**狀態：待 owner 審核，不是 production 指示。** 可在 [`preview.html`](./preview.html) 檢視互動 draft；它只存在 research，不匯入任何 public component。此稿針對 Model/Capability/Account/Navigation 家族作為一個整體審核，避免各頁繼續增加彼此不同的卡片、徽章與下拉選單。

來源固定為 Beautiful UI commit `44a274e598395ab61e7c96c26fda2758780253b7`（MIT，授權文字於 `licenses/beautiful-ui-MIT.txt`）。只抽取可重用結構；沒有上游資料、計時器、真模型/價格/授權效果。YunUI tokens、既有 Provider/Icon asset 與原 API/host callback 保留。

## 要 owner 審的具體語法

- **資料列表**：用 `SearchList.tsx:52-97` 的 40px search row、緊湊結果列、空結果說明；多 provider 組群採 `FilterTable.tsx` 的 sticky group/context 結構。共享 `GlideMenu.tsx` 的單一 hover/focus highlight，不為每一行畫一張小卡。
- **身份與模型細節**：`ContextCards.tsx:68-110` 的簡短標題列、來源/字數 meta、內文與底部 source chip；`FineTuneCard.tsx:204-241,289-327` 的 card bar/footer 與類似 Segment control 的單一選中滑塊。AI family 可用 host slots 顯示 ID、provider、context/pricing 等，不建新 pricing model。
- **可重用 token**：`Chip.tsx` 表示 mono ID/alias；`EntityChip.tsx` 表示 provider/developer；`StatusPill.tsx` 表示狀態；`ValuePill.tsx` 顯示 context/price meta。YunUI 對應則用現有 Badge/RadioGroup/Checkbox/ProviderIcon，但保留相同視覺位置、密度和狀態詞彙。
- **導覽與選單**：`SidebarNav.tsx:260-440` / `Nav.tsx:35-75` 的同一條滑動 highlight 和 32–36px row。Account/Language picker 共用 `SearchList`/`GlideMenu` 的 compact menu surface，不分別再造玻璃框、大卡片和不同 hover 色。
- **Footer**：Beautiful UI 沒有一個相同的產品 Footer primitive，故不聲稱逐元件移植；保留 YunUI brand/link slots，以同一 neutral ink、compact row、thin divider 語法收尾，不多疊一張浮起來的卡。

## 預覽內各 family 狀態矩陣

| Family | Draft states / 操作 | Host state 邊界 | 預覽已涵蓋 |
| --- | --- | --- | --- |
| ModelCard | default、selected、unavailable、description/price 缺省或 `0`；card activate、ID copy 分開 | `onClick` 只表示 host 選擇；ID 另行 copy，不是巢狀 action | default/selected/unavailable、含 ID copy button |
| ModelSelect | closed/open、query/filter、pinned、no results、loading、failed、option disabled | loading/error 是 host-fed；不因載入計時自動選取 | open/search、empty、busy/error presentation、disabled row |
| ModelManagerCard | normal、selected、busy、disabled、empty/failed fields | row action/checkbox callbacks 由 host；state badge 不由 UI 推導 | compact identity/spec rows、selected 和 unavailable |
| CapabilitySelector | selected/unselected/disabled，各 model type | `selected[]` / `onChange` 是唯一選取來源；unknown type 顯示中性 fallback | selected, disabled, modality filter |
| IDBadge | default/hover/focus/copied/failed copy | copy success 來自 clipboard helper；失敗不宣稱 copied | mouse, keyboard focus, touch-readable feedback |
| Provider/Model icons | provider/dev/model priority、unknown fallback、load failure | icon base path/URL 由 host；source 變動不沿用舊 URL 的錯誤狀態 | monogram fallback、provider/model source switching |
| AccountMenu | session unknown、signed-out、signed-in/open、signout pending/failure | host supplies session; signout completion/error remains host-owned | placeholder, sign-in, menu, pending label |
| LanguageSwitcher | icon/pill, closed/open/current locale, pending/empty locales | host applies locale/reload, `pending` disables choices | compact switch menu, pending/empty |
| Navbar | desktop active link、mobile closed/open、slots、no links | path/scroll/current route 由 host/router | desktop, 390px mobile menu |
| Footer | 0/1/3/5 sections、social/no social、mobile | link/copyright data 由 host; keys 不依賴 URL 唯一 | 2/3-column sample, empty sample, social links |

## 需要 owner 明確回覆的審核點

1. 是否接受 12–13px 細 row、32–40px 控件高、10px 卡片半徑和單一 1px hairline 的密度，取代現在各家族不一致的卡片/outline/badge 混搭？
2. ModelSelect 以 search-first grouped list 作唯一重型 surface；選擇、pinned 和 filters 同在一份搜尋結果，而不把每個 provider header/option/card 分層成更多面板。
3. Manager 的 field grid 是否可收斂為 identity row + status pill + compact property rows；保留所有 API fields 但不為每個欄位造一個 badge。
4. Account/Language/Model menus 是否共同採單一 GlideMenu highlight、同一 popover surface 和 keyboard focus behavior？
5. IDBadge copied state 是否在 focus/touch 時也可見；fallback icon 和 error state 是否以中性 monogram 在 card/layout 中保留原位？
6. Mobile navbar/footer 的欄位/順序是否保留現狀，只統一 menu row 的密度/層次？

未得到明確批准前，這份 draft 及其 CSS/互動只用於討論，不代表任何 family 可直接改 production。
