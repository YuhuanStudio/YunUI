# YunUI 專案現況研究

研究日期：2026 年 10 月 1 日。研究基準：`main` 的 `d40e29125a3afaadd6b544b23ba10c290bd4eeca`。

YunUI 目前有可正常建置的設計系統、持續被產品使用的元件，以及相當完整的文件和自動化檢查。主要問題集中在發布版與主分支分裂、跨專案採用不同提交、歷史決策文件過期，以及測試沒有驗證若干真正的功能。這次實測找到內容渲染的現存缺陷，不能用「CI 全綠」認定整體已穩定。

建議保留目前主分支，先修復已重現的內容功能、補齊驗證，再統一相容性與發布策略。歷史上查到的主要回退都有具體理由，沒有證據支持整個專案需要回到某個舊版。

## 研究範圍與證據

本次檢查 Git 歷史與分支、公開 GitHub PR 和 Actions、npm registry、套件與網站建置、元件入口、樣式生成、測試與文件，以及本機 Yunxin、YunNEWS、Yunshu 的採用狀況。跨專案只作唯讀盤點；沒有發布套件、部署、更新消費端或修改功能程式碼。

本機檢查使用 Node `26.10.0`、pnpm `11.19.0`；專案宣告 pnpm `11.8.0`，CI 使用 Node 22。本機通過不等於重新跑過相同的 CI 環境；另外查到目前 HEAD 的遠端 CI 確實成功。

可重現的瀏覽器輸出、截圖回歸結果和部分截圖保存在 [evidence](./evidence)。本次的 18 組瀏覽器矩陣全部檢查頁面尺寸、axe 與 JavaScript 錯誤；另外人工檢視手機淺色、手機深色、桌面淺色、桌面純黑及內容頁截圖。這不是逐一操作所有元件的完整互動認證，也沒有重新登入所有消費端的正式環境。

## Git 與發布的實際狀態

| 項目 | 已核實的狀態 | 意義 |
| --- | --- | --- |
| 工作目錄 | 研究開始時乾淨 | 沒有待整理的未提交功能變更 |
| 遠端 | fetch 後 `main = origin/main = d40e291` | 沒有本機落後遠端或未推送的 main 提交 |
| 最近提交 | 2026-09-04，新增 GMI Cloud 圖示 | 到研究日約 27 天沒有 main 更新 |
| 最新發布 | npm latest 與 Git tag 都是 `0.2.17`，2026-08-06 | 正式發布已停約 56 天 |
| 發布後變更 | `v0.2.17..HEAD` 有 58 個提交 | 主分支與 npm 包差距明顯 |
| 版本欄位 | HEAD 仍標示 `0.2.17` | Git 安裝與 npm 安裝會顯示相同版本、取得不同 API |
| Git 歷史 | 368 個提交；6 月 178、7 月 124、8 月 65、9 月 1 | 開發前期非常密集，後期主要修復與整理 |
| 額外分支 | `feat/token-system-and-trust-fixes` 已是 main 的祖先 | 屬於舊分支殘留，沒有未整合功能 |
| 公開 PR | #1 與 #2 均已合併；查詢當下沒有 open issue / PR | 不能用沒有 open issue 推論沒有缺陷 |

遠端證據：[目前成功的 CI](https://github.com/YuhuanStudio/YunUI/actions/runs/33836644466)、[v0.2.17 release](https://github.com/YuhuanStudio/YunUI/releases/tag/v0.2.17)、[npm 套件](https://www.npmjs.com/package/@yuhuanowo/yunui)。發布時間以 registry 回應核對。

### 相同版本號下的 API 分裂

從已提交的 `.d.ts` 比較，發布之後沒有移除頂層的執行期匯出，但增加了 23 個匯出名稱：core 5 個、patterns 17 個、AI 1 個。名稱數包含 hooks、別名及 helper，不應當成獨立元件數。

新增內容包括 CommandPalette、AuthShell、ArchiveCalendar、MarketingHero、CTASection、MembershipCard、SectionNav、AccountMenu 等。從 npm 安裝 `0.2.17` 的使用者拿不到這些功能。

更重要的是，`e3a4327` 在發布後移除了四個元件的舊 label props：

| 元件 | npm 0.2.17 的 props | main 的 props |
| --- | --- | --- |
| SessionItem | currentLabel / inactiveLabel / runningLabel / revokeLabel | labels.current / inactive / running / revoke |
| NotificationPanel | unreadLabel / loadingLabel / emptyLabel | labels.unread / loading / empty |
| Pagination | previousLabel / nextLabel | labels.previous / next，另新增 labels.page |
| ChatComposer | sendLabel / stopLabel | labels.send / stop |

CHANGELOG 已明確寫出 Breaking，但與「長期維持 0.2.x、避免未經同意的破壞性改動」的專案政策產生張力。對 TypeScript 使用者，更新 Git pin 可能直接出現型別錯誤；JavaScript 使用者的舊 props 則可能失效而回到英文預設文字。

**判斷：這是目前整理成本最高的管理問題。** 要先決定加入舊 props 的相容層，或提供明確的遷移與版本安排，再發下一個版本。單純把 main 直接發布為下一個 patch，無法消除這個問題。

## 跨專案貢獻與採用狀況

從 Git 記錄可識別出以下來源；提交作者都使用維護者身分，所以不能把「來自其他專案」等同「外部貢獻者」。

| 來源 | 留在 YunUI 的內容 | 目前理解 |
| --- | --- | --- |
| Yunxin | 初始 primitives、頁面與模型介面；後續 marketing kit、AuthShell、dashboard states、MembershipCard | 原始來源仍是設計語言的重要參考 |
| YunNEWS | AccountMenu、SectionNav、ArchiveCalendar | 有具體 upstream 提交和文件，並非未整合的零散檔案 |
| Agent 類場景 | AgentTimeline、AgentRunStatus、reasoning state，以及較細的 content/chat hooks 與 slots | 已成為 AI 子入口的正式能力；本次未確認獨立 Agent 專案的目前安裝狀態 |
| 浮動面板修復 PR | clipping ancestors、翻轉方向、內容與 anchor resize 後重新定位 | [PR #1](https://github.com/YuhuanStudio/YunUI/pull/1)、[PR #2](https://github.com/YuhuanStudio/YunUI/pull/2) 都已合併，後續仍有 rAF 效能改善 |

本機消費端盤點：

| 專案 | 依賴基準 | 與 main 的差距 |
| --- | --- | --- |
| Yunxin frontend | Git pin `d40e291`，package 與 pnpm lockfile 一致 | 0 個提交，與目前 main 相同 |
| YunNEWS web | Git pin `cd2ca3c` | 落後 4 個提交，缺少後續 Sidebar 修復／dist 重建、caching badge 與 GMI 圖示 |
| npm 使用者 | registry `0.2.17` | 落後 58 個提交 |
| Yunshu | 目前本機工作樹沒有找到 package.json 或活躍 YunUI import | README 的 Used by 敘述不能直接視為目前採用證據；需要確認它描述的是舊 web UI 還是外部 checkout |

這些是本機 checkout 的證據，不代表消費端正式部署已更新到同一提交。README 目前仍宣稱 Yunshu web UI 使用 YunUI，與當下可核查的本機結構有落差。

## 回退與替換的脈絡

| 提交 | 變更 | 保留或取消的結果 |
| --- | --- | --- |
| `1fe4a00`，6/24 | 撤掉推測需求的 Timeline | 理由是沒有實際消費者；同時保留 SearchInput size 能力 |
| `f07b2db`，6/27 | 撤掉 radius tokens | `--radius-*` 污染 Tailwind 的既有圓角尺度，造成 YunUI／Yunxin 外觀變形；屬於正確修復 |
| `2da7992`，6/27 | 取消單色 provider/model glyphs | 提交記錄明確說明依擁有者要求保留彩色品牌頭像；不是圖示能力整個消失 |
| `07d28df`，7/7 | 刪除 AgentSteps | 由 AgentTimeline 接替；提交記錄稱當時沒有已出貨消費者依賴 AgentSteps，本次無法獨立證實所有消費者狀況 |
| `12a556a`，7/13 | 取消 ModelSelect 手機全螢幕 bottom sheet | 原需求被誤讀；回到各尺寸 anchored dropdown，保留橫向觸控捲動 |

**判斷：可確認的主要回退有理由，屬於需求收斂、錯誤修復或替換。** 不應重新啟用 radius token 或 bottom sheet 來「追回功能」。真正缺的是把最終決策集中記錄，避免後續再次實作已被否決的方案。

## 架構與功能成熟度

套件目前有 core、patterns、AI、content、chat、adapters 六個 JavaScript 入口，另有 CSS 入口。分離入口、adapter 注入與共享 React context 的 code splitting 仍然成立；建置為 ESM，並保留 client boundary。這是一個已經成形的系統。

`ARCHITECTURE.md` 仍以三層架構介紹專案，沒有完整納入 content 與 chat，属于設計說明落後實作。core 中仍有大型 `primitives/index.tsx`，而 Dialog／Modal、Select／CustomSelect／Combobox、兩個 CodeBlock 等重疊面向採取「共存並提供選擇指引」，不是全部統一。

設計 token 仍是 layered scheme／function／theme 加 legacy flat token。歷史設計稽核曾決定狀態色以 legacy helper 為主；這種並存有明確原因，不能只看兩套名稱就判斷必須全部重寫。不過從 CSS class、Fumadocs bridge、第三方 syntax theme 到 runtime theme 有數個耦合點，已有反覆漏修的記錄。

429 個 MDX 文件包含多語版本；有 30 個單元測試檔。這些數量說明已有相當投入，但不證明每個 public prop、動畫、portal 或 async renderer 都被完整驗證。

## 實際驗證結果

| 檢查 | 本次結果 | 說明 |
| --- | --- | --- |
| pnpm typecheck | 通過 | tsc noEmit |
| pnpm test | 30 檔、270 測試全部通過 | 不代表完整 DOM 互動與 SSR 行為 |
| pnpm build | 通過 | ESM 與 declaration 生成正常 |
| dist／token 重建 | 沒有差異 | 目前提交的套件產物與原始碼一致 |
| publint | 通過 | 套件入口與包裝檢查正常 |
| site build | 通過 | Next production build 完成 |
| CSS emission | 652 個 literal classes 通過 | 此檢查刻意略過 template literal、cn 條件字串等，不能解讀成全部類別都已驗證 |
| 既有 screenshot tests | 6 個 Chromium 測試通過 | 使用既有 macOS baselines；沒有改寫 baselines |
| Showcase 瀏覽器矩陣 | Chromium／WebKit × 390／768／1440 × light／dark／true-black，18 組 | 全部無頁面橫向溢出、axe 違規為 0；全部有 hydration error |
| 額外內容頁操作 | 重現純文字 fallback、Enter 無法放大、缺少 dialog 語意 | 與 source 中的缺口一致 |

最新遠端 Actions 的 Verify、image build、Notify Dokploy 均成功。Notify 成功只是 workflow 完成，因為 webhook 缺失時允許 no-op，沒有正式站的部署 SHA 驗證，不能僅憑此認證已部署 HEAD。

8/19 的 `34702e9` CI 失敗在 `dist/ reproduces from src/`，後續 `522d157` 補建置後成功，且現在重建沒有差異。這是 gate 已經發揮作用的例子：[失敗紀錄](https://github.com/YuhuanStudio/YunUI/actions/runs/32266055095)。

## 現存缺陷與優先順序

### P1 內容 CodeBlock 的語法高亮已退化

`src/content/code-block.tsx` 的主題 map 以 `github-light`／`github-dark` 為 key，實際載入的主題卻叫 `github-light-default`／`github-dark-default`。呼叫 `codeToHtml` 時仍使用舊 key，Shiki 回報找不到 theme，catch 隨後默默輸出純文字。

本次內容文件頁三種主題都得到 `<pre class="shiki"><code>...`，沒有 token spans。直接以目前安裝的 Shiki 重現：載入後 `getLoadedThemes()` 是 `['github-light-default']`；要求 `github-light` 會拋出 `Theme github-light not found`；改用真正的名稱可以成功高亮。

回歸來源可定位到 `c878738`：為改善色彩對比而更換 import，但沒有同步名稱。**這說明歷史上「a11y clean」可能是失去語法色彩後的結果，不能把它當成高亮正常的證據。** 需要確認真正輸出 token spans，而不只檢查文字存在或對比為零違規。

### P1 MarkdownRenderer 導致 hydration mismatch

`src/content/markdown-renderer.tsx` 的 link renderer 在 SSR 時把 host 設為空字串，因此 `href.includes("")` 永遠為 true，外部連結被當成内部連結；客戶端取得真正 host 後又將其標為外部連結，增加 target、rel 與 ExternalLink SVG。

18 組 showcase 測試全部出現 React #418。開發模式顯示差異正是 `target="_blank"`、`rel="noopener noreferrer"` 與新增加的 SVG。這會使 React 放棄對應 subtree 的正常 hydration 並重新生成。修復應確保首輪 SSR／client 決策一致，並用 URL origin 判斷取代字串 includes，防止同名 host 子字串被誤判。

### P1 Mermaid 與 ImageLightbox 的鍵盤操作不完整

Mermaid container 有 role=button 和 tabIndex，却沒有 Enter／Space handler。本次以內容文件頁重現：focus 後按 Enter，放大層數量為 0；滑鼠 click 後為 1。放大後 `getByRole('dialog')` 數量為 0。

ImageLightbox 沒有 dialog／aria-modal 語意與 focus trap，並直接改寫 body overflow。Escape 快捷鍵存在，但這不是完整的 dialog 可用性。應統一既有 overlay hooks、焦點恢復和 scroll lock，測試從鍵盤開啟、Tab containment 和關閉回到觸發點。

### P2 內容渲染仍漏掉 true black 主題

CodeBlock 的 `useIsDarkMode` 與 MermaidDiagram 都只看 `.dark`，沒有識別 `.true-black`；文件站的 true-black 用自己的 class。截圖顯示純黑內容頁的 Mermaid 仍是淺色填充。CodeBlock 目前高亮錯誤掩蓋了另一個問題：修好 Shiki 後仍會在 true-black 選擇 light theme。

先統一 theme 判斷，再以三種主題驗證內容本身。Fumadocs 的 CSS bridge 修復並沒有自動修復這些 JavaScript 判斷。

### P2 最新 GMI 圖示不會跟隨 Git 安裝自動進入預設 CDN

HEAD 內已加入 `icons/providers/gmi.svg` 和 provider name，但預設 iconBasePath 是 jsDelivr 的 npm `@0.2`。此 URL 本次回應 404，因為 npm 還停在新增圖示之前的 0.2.17。

Git pin 使用者只有在自行同步 icons 並覆寫 iconBasePath 時才能拿到它；使用預設 CDN 仍會 fallback。需要把 npm 發布與資產基準一起規劃，避免 JS 和 icon set 分裂。

### P2 驗證 gate 的盲點

1. `site/visual/axe.mjs` 遇到 HTTP 錯誤會 continue，catch 也只列印；最後只計算 axe violations。頁面沒有成功載入時仍可能 exit 0。應把 target failure 納入 failure。
2. CI 沒有呼叫 `test:visual`、`axe-theme.mjs` 或 `focus-walk.mjs`，目前主要 a11y gate 是 Chromium 的預設主題與少量頁面。
3. screenshot config 已因穩定性移除 WebKit，而 CLAUDE.md 仍說 config 有兩個 browser projects。替代覆蓋需要清楚記錄；現有 CI 也沒有在 WebKit 執行 a11y sweep。
4. 視覺測試中 `setDark` 直接新增 `.dark`，但另一个 a11y harness 明確指出應以 next-themes storage 設主題，避免 data-theme 留下舊值；兩個測試設置方式不一致。
5. 瀏覽器檢查目前沒有對 pageerror 設 gate。這次 screenshot 和 axe 全過，但 hydration 問題仍在。

### P2 文件與生成檔漂移

CLAUDE.md 仍稱 icons 不隨套件發布，与 package.files、README、adapter 預設衝突。ARCHITECTURE 沒有涵蓋 content/chat。CHANGELOG 的 Unreleased 比較連結仍從 v0.2.9 開始。舊 DESIGN-AUDIT 只能作歷史記錄，不能當成現在全部元件的稽核證明。

site prebuild 重建 `changelog.generated.ts` 時出現差異，说明 HEAD 的生成檔沒有完全同步最新版 CHANGELOG；本次在檢查後恢復原始檔，沒有把生成差異混進研究。正式 build 會重建它，所以不能只憑這項推論正式網站一定缺內容。

### 待核查的安全與依賴邊界

MarkdownRenderer 啟用 rehypeRaw，沒有 sanitize plugin 或明確 HTML trust mode；Mermaid 則已設 securityLevel=strict。若來源是任意使用者或 LLM 內容，應另做 HTML allowlist、URL 與嵌入元素安全測試。**本次沒有進行攻擊載荷測試，沒有證實可執行腳本漏洞，不能把原始碼觀察寫成已驗證 XSS。**

content 的多個 optional peer 是靜態 import；只使用 core 的最小消費端，以及使用 content 時漏裝 peer 的行為，需要以真正的最小應用驗證。本次沒有作完整 peer-version 相容性矩陣、bundle size benchmark 或依賴漏洞掃描。

## 建議的整理順序

| 順序 | 工作 | 完成標準 |
| --- | --- | --- |
| 1 | 修復 Shiki theme IDs、SSR link 判斷、Mermaid／Lightbox 鍵盤與焦點行為 | 真正高亮 spans、零 hydration errors、鍵盤開關與焦點恢復；三種主題與兩種引擎實測 |
| 2 | 補 gate | route failure 和 pageerror 會失敗；重點互動／內容頁納入測試；真實 next-themes 狀態一致 |
| 3 | 確定 API 相容方式 | 四組 labels 變更有相容層或清楚遷移決策；不能只依版本號判斷安裝內容 |
| 4 | 統一文件與決策記錄 | 六入口架構、icons hosting、主題與 browser 覆蓋、各項回退理由一致 |
| 5 | 安排一次發布與消費端同步 | 新版本內容可列舉，npm／Git／icons 基準明確；Yunxin 與 YunNEWS 分別驗證並記錄 pin |
| 6 | 再決定結構整理 | 只針對真正重复且有消費者證據的 API；避免大規模拆包或重新設計引入額外回歸 |

近期工作應以一次維護批次收斂，不必重新設計整個系統。至少在修好已重現缺陷前，暫停繼續擴增公用元件，是本次研究的建議，不是已執行的政策變更。

## 研究的限制與交付

目前可以確認主分支乾淨且同步、發布落後、主要回退的理由、核心建置可重現，以及數個內容功能缺陷。不能確認所有消費端正式部署版本、所有历史贡献的需求原文、所有 props 的完整可及性、Markdown 的安全承諾或全版本依賴相容性。

研究報告与 evidence 是本次唯一保留的專案新增內容。建置／開發伺服器產生的已追蹤生成檔差異已恢復，臨時測試檔與 Next 自動建立的 site agent 文件已移除，測試伺服器已停止。Playwright Chromium 与 WebKit 已安裝在本機 cache，供後續驗證使用。
