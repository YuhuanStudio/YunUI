# YunUI 後端與文件路由稽核

**稽核日期：2026-10-01** · **範圍：** `site/app/api/search`、`site/lib/source`、MDX server render、文件路由。這個 repo 是 React/Tailwind UI 函式庫與其文件網站，沒有 LLM、agent 執行、帳號或業務資料 API。`site/app/api` 唯一的 route handler 是 GET `/api/search`；產品 agent/模型後端由消費端負責。

## 可驗證的 server 面

| 面 | 實際行為 |
|---|---|
| `GET /api/search?query=...` | Fumadocs 根據文件 manifest 的 title、description、keywords 建立靜態 full-text index，回傳文件搜尋結果。未傳 query 時回傳空陣列。此索引不是模型／向量服務。 |
| `GET /docs`、`GET /docs/<group>/<slug>` | App Router catch-all 文件頁。`site/lib/docs.ts` 是 slug、metadata、locale MDX importer 和 sidebar group 的來源；`page.tsx` 載入可用 locale 的編譯 MDX，在 server render 成 React nodes，再交由 client wrapper 按 `NEXT_LOCALE` 顯示。 |
| `generateStaticParams` | 由 manifest 建立文件 slug；未知 slug 回 404。`/docs/patterns/navbar` 有三語 MDX、`pat("navbar", …)` manifest 項目和 sidebar 項目。 |

程式位置：[search route](../../site/app/api/search/route.ts)、[search/page-tree source](../../site/lib/source.ts)、[docs manifest](../../site/lib/docs.ts)、[MDX route](../../site/app/docs/[[...slug]]/page.tsx)、[locale render wrapper](../../site/app/docs/[[...slug]]/localized-doc.tsx)。

## 發現與修正

1. **中文文件搜尋沒有索引本地化標題。** 修正前 `navbar` 有結果，但「導航欄」、「導覽列」、「按钮」、「按鈕」都回 `200 []`；同一路由會以 cookie 正確 SSR 中文標題，中文讀者因此無法用頁面標題找回該頁。`source.ts` 現在將三種 locale 的標題和摘要加進可搜尋的內容欄位，保留原有英文結果 metadata，並繼續加入每頁 keywords。索引範圍仍是 manifest metadata 和 keywords，沒有改成抓取整篇 MDX。

2. **要求尚未設定的向量搜尋會讓 API 回 500。** 此站的搜尋來源沒有 embeddings；Fumadocs search adapter 仍接受 `mode=vector`，依賴在沒有 embeddings 時拋錯。`GET /api/search` 現在明確回 `400 {"error":"Vector search is not configured for this documentation source."}`。未知 `mode` 不是 dependency 的 vector 選項，會沿用 full-text 預設並回 `200`；沒有 query 仍回 `200 []`。

修正位於 [search route](../../site/app/api/search/route.ts) 與 [search source](../../site/lib/source.ts)。可重跑的 HTTP regression check 在 [verify_docs_search.py](./verify_docs_search.py)；永久 Playwright 覆蓋在 [search.spec.ts](../../site/visual/search.spec.ts)，WebKit project 也納入這支 spec：[Playwright config](../../site/playwright.config.ts)。

## Navbar 文件頁 runtime／browser 驗證

三個 MDX 檔案與 docs manifest 都已存在。第一次從已在 3941 埠運作的舊 `next-server` 查詢時，root 曾回 500、`/docs/patterns/navbar` 回 404；此時剛以新輸出覆寫 `.next`，但 server process 未重啟。**這是舊 server process 指向更新中/更新後輸出的 runtime 狀態，不是已證明的 docs manifest 缺陷。**我先確認 3941 埠由 `pnpm --filter yunui-site start -p 3941` 和其 `next-server` 子程序持有，只停止該程序，再以完成的 site build 重啟。重啟後 root、`/docs`、`/docs/patterns/navbar`、`/docs/ai/navbar` 均回 `200`，未知 docs slug 回 `404`。未保留重啟前 500/404 作為 source code bug。

`NEXT_LOCALE=en/zh-CN/zh-TW` 的 HTTP response 分別將 `/docs/patterns/navbar` 初始 `<h1>` server render 成 `Navbar`、`导航栏`、`導覽列`。接著以 Playwright 對此頁跑完整矩陣：Chromium、WebKit × 三個 locale × light、dark × 390、768、1440 px，共 36 個頁面檢查與截圖；另有 search API 和搜尋對話框互動回歸測試，總計 **40 passed**。搜尋 UI 測試以「導覽列」查詢，確認結果位於 Patterns，按 Enter 後導向 `/docs/patterns/navbar`。每個頁面檢查 200 response、預期 locale heading/正文、theme class、無 page error，並確認 `document.documentElement.scrollWidth <= innerWidth`。我另實際查看了六張代表截圖（含三種語言、兩種引擎、行動/桌面、明/暗）；版面正常，屬性表可在自身容器內橫向捲動，頁面本身沒有橫向溢出。36 張矩陣截圖由本地 Playwright 存於 `site/test-results/search-Navbar-docs-*/navbar-*.png`。

## 驗證紀錄

- `pnpm --filter yunui-site build`：通過 Next 編譯、TypeScript 和 151 個靜態頁面產生。
- `VISUAL_PORT=3941 pnpm --filter yunui-site exec playwright test search.spec.ts`：40/40 通過，涵蓋 Chromium 與 WebKit。
- `python3 research/remaining-fixes/verify_docs_search.py`：HTTP regression checks 通過，包括中英文 query 的預期 result URL、vector 400、未知 mode full-text fallback、未知文件 404。
- HTTP smoke：`/`、`/docs`、`/docs/patterns/navbar`、`/docs/ai/navbar`、`/api/search?query=navbar` 回 200；`/docs/no-such-route` 回 404。

Next.js 在此 repo 設定 `output: "standalone"`；本地 `next start` 印出不建議在 standalone 設定下使用的 warning，但本次重啟後實際 HTTP 與 Playwright 請求均成功。部署／正式 standalone 啟動仍應使用 standalone server entry，不將本機啟動警告混稱為 endpoint 缺陷。
