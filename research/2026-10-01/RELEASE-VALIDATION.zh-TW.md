# YunUI 0.2.18 發布驗證

2026 年 10 月 1 日完成本機驗證。本次維護版本收斂 0.2.17 之後的累積變更，修復研究重現的內容缺陷，保留舊 label props 的相容性。大範圍結構重整留待後續工作。

## 本次修復

- Shiki 載入與渲染使用一致的主題 ID，實際產生語法 token spans。
- Markdown 外部連結使用穩定的 SSR 判斷；可用 linkOrigin 指定同來源絕對連結。
- 內容元件支援 dark、true-black 與 data-theme 切換。
- Mermaid 支援 Enter／Space 開啟燈箱；燈箱使用 Radix dialog 焦點範圍，正確處理巢狀 Dialog／Modal、Escape、焦點恢復與共用捲動鎖。
- 高亮行 tint 降低，修復恢復語法色彩後暴露的對比不足。
- 三語 InlineCode 文件修正 MDX 產生的巢狀段落，消除 hydration 錯誤。
- SessionItem、NotificationPanel、Pagination、ChatComposer 保留已發布的舊 label props；新的 labels 物件逐欄優先。
- 架構、圖示資產說明與三語文件同步；更新產物與發布紀錄。

## 驗證結果

| 檢查 | 結果 |
| --- | --- |
| 型別檢查 | 通過 |
| 單元測試 | 32 個檔案，280 個測試通過 |
| 套件與文件網站建置 | 通過 |
| publint | 通過 |
| CSS emission | 652 個 literal classes 通過 |
| 瀏覽器套件 | 30 個測試通過，沒有改寫既有 screenshot baselines |
| 內容矩陣 | Chromium／WebKit × light／dark／true-black × 390／768／1440 |
| 高亮行對比 | 兩個引擎、三種主題通過 axe，無 pageerror |
| 全站 axe | 首頁、showcase、手機 showcase、docs、changelog 均為零違規與零 runtime error |
| 檢查失敗頁面 | 404 target 正確以 exit 1 失敗 |
| CI server reuse | 以 CI=1 與既有伺服器實測，正常重用且通過測試 |
| 巢狀預覽 | 真實 Radix Dialog 與自訂 Modal 內的焦點、Tab／ShiftTab、Escape 回歸測試通過 |

三個 GPT-6 Luna medium 子代理分別同步文件、執行瀏覽器矩陣、審查相容性與巢狀焦點行為；主代理審閱並整合變更、檢視截圖、處理驗證發現與負責發布。

## 證據與後續範圍

[release-evidence](./release-evidence) 保留最後的測試輸出與人工檢視的截圖矩陣。先前的 [專案研究](./PROJECT-RESEARCH.zh-TW.md) 是發布前 d40e291 的歷史基準，所列已修復缺陷以本文件與 0.2.18 CHANGELOG 為準。

本次沒有更改消費端 Git pins。Markdown HTML trust mode、全部 optional peer 版本矩陣、重疊元件收斂與套件分拆仍待後續研究或重構；本次通過的檢查不代表這些項目已完成。
