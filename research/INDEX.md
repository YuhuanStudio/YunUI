# YunUI 研究與驗證索引

此目錄保存決策、批准、來源與驗證，不是正式元件或 consumer 使用範例。
正式實作在 `src/`，網站在 `site/`，consumer 契約在 `agent/`。
版本仍為 **0.2.18**；本輪重構已整合，**發布暫停**。

## 待回饋的應用 Demo

- [Yunshu 本機推理工作台](yunshu-frontend-demo/README.md)（2026-10-07）：
  owner 要求先看全新 demo，並明確定位為推理引擎控制台；直接使用 YunUI 公開元件。
  主流程為引擎總覽、模型、請求／效能、API 接入與設定；推理測試是次要工具。
  僅示範資料，未連接推理服務；聊天產品定位已被排除。
  新增 [oMLX 原始碼研究](yunshu-frontend-demo/OMLX-RESEARCH.md) 與
  [儀表板審核矩陣](yunshu-frontend-demo/DASHBOARD-REVIEW.md)：吞吐／記憶體／快取圖表、請求篩選與匯出。

## 目前有效的記錄

| 內容 | 入口 |
| --- | --- |
| 全項目 code review 與已修復問題 | [完整審查](remaining-fixes/full-code-review/REVIEW.zh-TW.md) |
| 四項新增會話元件與正式 API 整合 | [正式整合](ai-refactor/production-conversation-units/INTEGRATION.zh-TW.md) |
| 四項設計的 owner 批准 | [批准記錄](ai-refactor/upstream-gap-review/APPROVAL.zh-TW.md) |
| D4 聊天整合、既有契約與驗證 | [D4 整合](ai-refactor/d4-production/INTEGRATION.zh-TW.md) |
| CodeBlock 與最終 3968 瀏覽器證據 | [最終驗證](remaining-fixes/content-code-review/REVIEW.zh-TW.md) |
| 上游源碼、MIT 授權與移植邊界 | [源碼研究](ai-refactor/BEAUTIFUL-UI-RESEARCH.zh-TW.md)、[缺口對照](ai-refactor/UPSTREAM-GAP-AUDIT.zh-TW.md)、[reference 索引](../reference/README.md) |
| Consumer 正確採用問題 | [adoption 研究](agent-adoption/)；實際契約以 [skill](../agent/skills/yunui/SKILL.md) 與 [typed recipes](../agent/recipes/) 為準 |
| 已發布 0.2.18 的歷史狀態 | [2026-10-01 release validation](2026-10-01/RELEASE-VALIDATION.zh-TW.md) |

舊草稿中的 pending／待審核文字是當時狀態，不能推翻後來的 owner 批准。
Model workspace/model cards 外觀未批准重設計；其歷史提案不屬於交付範圍。

## 產物與歷史資料

[歷史索引](archive/INDEX.md) 標示已被取代的原型。保持原路徑以免破壞來源
記錄、內部連結及本機預覽，沒有把研究程式移入 production。

Git 保留決策文字、批准、可重現研究程式、validation JSON、被 Markdown
直接引用的截圖及精選最終 contact sheets。反覆擷取的原始 PNG、生成的
bundle、Vite dist、node_modules、Playwright run output 留在本機並忽略。
`research/.gitignore` 明確列出保留的 91 張歷史／最終 PNG，不把近 2,000 張
重複 viewport captures 全部提交。

2026-10-02 整理前完整研究備份位於 repository 外的
`../YunUI-local-artifacts/2026-10-02-repository-cleanup/`，含 research tar、
原始 git diff、未追蹤程式備份及 curation manifest；不屬於 npm/Docker/Git
交付。需查看未提交的 raw capture 時使用本機原路徑或該備份。

新增研究先更新此索引。完成後只保留能支援結論的證據，不把每次試跑產物
提交成永久歷史。pixel baseline 仍只放 `site/visual/__snapshots__/`。
