import { Badge, Button, Card, Table, Thead, Tbody, Tr, Th, Td } from "@yuhuanowo/yunui";
import { PageHeader, CodeBlock } from "@yuhuanowo/yunui/patterns";
import { RequestActivity } from "./DashboardView";
import { apiBase, type Model } from "./data";

export function RequestsView({items}:{items:Model[]}) {
  return <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-7 sm:py-8" data-testid="requests">
    <PageHeader title="請求與效能" description="檢查請求的處理階段、輸入重用與生成表現。" actions={<Badge variant="warning">示範數據</Badge>}/>
    <RequestActivity modelOptions={items} title="請求記錄" description="這是固定示範快照，尚未連線。搜尋、篩選、匯出目前結果，或開啟單筆請求查看詳細資料。"/>
  </section>;
}
export function ApiView({endpoint}:{endpoint:string}) {
  return <section className="mx-auto w-full max-w-5xl space-y-6 px-5 py-7 sm:px-9 sm:py-9" data-testid="api">
    <PageHeader title="API 接入" description="用既有 SDK 與工具，連接這台 Mac 的推理服務。"/>
    <Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">API Base URL</h2><Badge variant="secondary">未連線</Badge></div><p className="mt-3 break-all font-mono text-sm">{apiBase(endpoint)}</p><p className="mt-3 text-xs text-muted-foreground">如果服務已啟用認證，需使用有效的 token；此預覽不保存金鑰。</p></Card>
    <CodeBlock code="" tabs={[{id:"python",label:"OpenAI · Python",language:"python",code:`from openai import OpenAI\n\nclient = OpenAI(base_url=${JSON.stringify(apiBase(endpoint))}, api_key="local")\nresponse = client.chat.completions.create(\n    model="local",\n    messages=[{"role": "user", "content": "Hello"}],\n)`},{id:"curl",label:"cURL",language:"bash",code:`curl ${JSON.stringify(apiBase(endpoint)+"/models")}`}]} />
    <Card className="overflow-hidden"><Table scrollLabel="相容介面"><Thead><Tr><Th>用途</Th><Th>介面</Th></Tr></Thead><Tbody>{[{name:"OpenAI 聊天",path:"POST /v1/chat/completions"},{name:"Anthropic Messages",path:"POST /v1/messages"},{name:"模型資訊",path:"GET /v1/models"},{name:"引擎狀態",path:"GET /v1/yunshu/status"},{name:"即時請求",path:"GET /v1/requests"}].map(row=><Tr key={row.path}><Td>{row.name}</Td><Td><span className="font-mono text-xs">{row.path}</span></Td></Tr>)}</Tbody></Table></Card>
  </section>;
}
