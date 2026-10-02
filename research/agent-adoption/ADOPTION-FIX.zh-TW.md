# YunUI 直接使用接入修復

目標是讓「基於 YunUI 建站」落實為匯入既有 UI 元件、組合 props／slots，並在
交付前驗證接入與元件來源。這不是要求模型多讀幾張 screenshot，也不以一個
匯入或相似配色作為採用證明。

## 已定位的原因

1. 使用契約原本沒有進入消費端專案的 agent context。npm 主要提供 dist、styles、
   icons、README；庫內 CLAUDE.md 並不會自動成為每個應用的指令。
2. README 的 alias 範例與 CSS 接入不一致。安裝 `yunui` alias 後，範例卻要求
   `@yuhuanowo/yunui/css` 和 scoped node_modules 路徑，容易讓 agent 對缺樣式
   問題改寫控制項。
3. 匯出與 API 分散在不同入口；同名 CodeBlock、框架注入、native props 與 slots
   缺少便宜且準確的查詢入口。泛用 Navbar 原本只列在 AI 入口也造成分類誤導。
4. 只有 setup／typecheck 並不能判斷是否重製 UI。獨立試用曾正確匯入主要控制項，
   卻仍自行畫出 profile avatar 與空狀態。

這些是由套件內容、文件、原始碼與實際試用觀察支持的工程問題，不能據此推論
所有 Codex／Claude 版本的內部決策原因。

## 已實作的接入

- 以六個真實 TypeScript public barrels 產生 catalogue，目前有 423 個 named
  exports（包含 types，不能當成 423 個元件）。提供精確 import、alias、來源、
  custom props、文件路徑與 installed declaration 位置。
- CLI `list/find/info` 查詢；`doctor --strict` 驗證實際安裝、啟用中的 CSS import、
  alias、exports 與 CSS-relative `dist` 掃描。未使用的 setup.css 不會構成通過。
- `init` 將 consumer skill 接入 Codex `.agents/skills` 與 Claude `.claude/skills`，
  合併專案指令且保留原有內容；有 Codex override 時更新實際生效的 override。
  不更動 global agent 配置，不自動做網路安裝，保護手改檔案與 symlink 目的地。
- AST `audit --strict` 記錄真正的 imports／reexports／JSX use，攔截明確的 raw
  控制項與同名重製元件；頭像／空狀態等疑似重製另列 review candidates，避免
  誤把品牌標記或產品資料 markup 全部禁止。缺少 parser 不會假稱驗證成功。
- Typed landing／dashboard／chat recipes 只組合 YunUI imports。泛用 Navbar
  透過 `/patterns` 匯出同一個實作，保留舊 `/ai` 用法。

專案 instructions 與技能探索機制依照
[OpenAI AGENTS.md 文件](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、
[Codex skills 文件](https://learn.chatgpt.com/docs/build-skills) 與
[Claude project skills 文件](https://code.claude.com/docs/en/skills) 接入。
既有使用者指令與專案規則仍優先；這些入口不保證每個模型永遠遵守，因此也
要求 build、origin review 與真實渲染檢查。

## 獨立實測

使用 GPT-6 Luna medium 的獨立 agent 在隔離 consumer workspace 完成 responsive
dashboard：指標、搜尋／狀態篩選、Table、詳細資料 Dialog。沒有給它實作答案。
第一次使用主要元件正確，但留下手畫頭像與空狀態；新增 audit 後，agent 依據
結果改用 Avatar／AvatarFallback 與 PageEmptyState。

最後有 21 個實際 library exports 的匯入與 JSX use，沒有剩餘 candidates，
TypeScript、doctor、audit 均通過。使用真實 Tailwind v4 PostCSS 編譯 CSS，
headless browser 驗證起始 6 筆、篩選 1 筆、無結果狀態、清除回復、Dialog
內容與 Escape 關閉。390px 頁面沒有橫向溢出；寬表格保留內部捲動。

證據見 [evidence](./evidence)。這是工作樹／workspace-linked 套件的實測，並非
已發布 npm 新版，也不是對所有 vendor／model 的普遍保證。

## 使用與交付狀態

目前工具與修復保持本機、Unreleased，尚未發布或推送。此 checkout 可用：

```sh
node scripts/yunui-cli.mjs init --cwd /path/to/app --css src/app/globals.css
node scripts/yunui-cli.mjs doctor --cwd /path/to/app --strict
node scripts/yunui-cli.mjs audit --cwd /path/to/app --strict
```

消費端需先有 React／Tailwind 的實際 compiler pipeline。新版本獲准發布後才可
透過安裝的 `yunui` bin 使用；目前公開 npm 0.2.18 沒有本次新增工具與修復。
