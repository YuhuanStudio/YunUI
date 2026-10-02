# 新增四項會話元件：已批准（2026-10-02）

Owner 看過 http://127.0.0.1:3963/ 的源碼移植版本後，回覆：「我看是還不錯 所以繼續做完所有」。這批准目前四項具體外觀/互動：StreamingText、ContextCards、SelectionActions、DiffTable。批准來源為 owner 本人，不是 reviewer 或產生的計畫。

範圍：將這四項正式加入 YunUI public components，接進實際聊天/showcase，補 API/三語文件/typed recipes 並驗證。維持上游 pinned source 44a274e598395ab61e7c96c26fda2758780253b7 的核准幾何，少量 YunUI token/controls integration；資料、串流、selection、backend 執行與套用結果仍由 host 控制。

Model workspace/model-card 外觀仍排除。版本維持 0.2.18，沒有發布授權。
