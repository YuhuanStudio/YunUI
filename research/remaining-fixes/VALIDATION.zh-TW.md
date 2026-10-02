# 剩餘問題修復驗證

本輪已修復列出的 ContentImage 換來源／鍵盤問題、輔助檢查腳本的漏報，以及
Markdown raw HTML 的信任邊界。另補上 nearest scroll container、srcSet 變更、
過期 load events、observer 備援、footnotes、ordered-list start、標題鍵盤聚焦
與高亮範圍的相關回歸。

在修復前，以原先 0.2.18 dist 的 MarkdownRenderer 輸出本機 iframe/srcdoc 樣本，
瀏覽器確認 iframe 可執行只設定本機 marker 的腳本。修復後 SSR/browser regression
確認不保留 iframe、腳本與 event attrs，沒有執行 marker 或外部 requests。
HTML 清理保留一般 Markdown／GFM 與後續 trusted math/code rendering；URL rewrite
也受安全協定過濾。實作順序與 schema 參考
[rehype-sanitize 官方文件](https://github.com/rehypejs/rehype-sanitize)。

驗證：34 個測試檔、295 個單元測試通過；46 個 Chromium／WebKit 內容與安全案例，加上 6 個 Chromium 視覺基準測試
通過，涵蓋 light／dark／true-black 與 390／768／1440。圖片初始／換來源／失敗／
焦點／燈箱狀態已檢視截圖，axe 為零違規，未改寫既有 screenshot baselines。
本機 fixture CLI 檢查驗證錯誤頁面、登入轉址、錯主題、pageerror、hidden focus、
空 target list 等情形正確失敗；狹義的 disabled-control contrast 例外也不會
吞掉同頁其他對比錯誤。

套件／網站 build、publint、652 個 literal CSS emission checks 與 axe 腳本列出的頁面檢查通過；這不是所有文件頁的逐頁 axe 證明。

後續本輪修正與覆核：`doctor` 排除測試/研究草稿與假 import 的誤判，工具回歸為 30 個通過。文件 API 已修中文搜尋與 vector 模式 500；`search.spec.ts` 40 個兩引擎案例通過，另見 [後端稽核](./BACKEND-AUDIT.zh-TW.md)。加上原有 46 個內容案例與 6 個視覺基準，本輪這三組瀏覽器測試合計 92 個；AI 新草稿的 capture 檢查不混入此數字。
證據保留在 [evidence](./evidence)。修復仍在本機 Unreleased；依擁有者指示不發版，
公開 npm 0.2.18 與已部署應用尚未自動取得這批修復。
