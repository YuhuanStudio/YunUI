# 參考專案

這裡放完整的上游 Git checkout，供讀碼、比較 API、研究互動與追蹤演進使用。
保留各專案自己的 Git 歷史與授權；clone 目錄不提交到 YunUI，也不進入網站
映像或 npm 套件。研究結論與改寫方案記錄在 YunUI 的 `research/`。

| 專案 | 本機目錄 | 官方來源 | 目前研究基準 |
| --- | --- | --- | --- |
| Beautiful UI | `beautiful-ui/` | https://github.com/slev12397/beautiful-ui | `44a274e598395ab61e7c96c26fda2758780253b7` |
| oMLX | `omlx/` | https://github.com/jundot/omlx | `4b6b4458a53dfb1a3c6ce2af7379f75ce13e24bd` |

重新取得來源：

```sh
git clone https://github.com/slev12397/beautiful-ui.git reference/beautiful-ui
git clone https://github.com/jundot/omlx.git reference/omlx
```

研究重點與逐檔來源見
[Beautiful UI 讀碼研究](../research/ai-refactor/BEAUTIFUL-UI-RESEARCH.zh-TW.md)。
採用程式碼時保留適用的授權與 attribution；商用圖示或資產需另核對授權。
新的 YunUI AI 介面與動效須先讓擁有者審核具體設計，再實作到正式元件。

oMLX 用於研究 Yunshu 推理引擎控制台的資訊架構、統計口徑與操作流程，
其 Apache-2.0 原始碼留在本機 reference；demo 使用 YunUI 公開元件重新組合。
研究記錄見 [oMLX 控制台研究](../research/yunshu-frontend-demo/OMLX-RESEARCH.md)。
