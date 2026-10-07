import { Badge, Button, Card, EmptyState, Table, Thead, Tbody, Tr, Th, Td } from "@yuhuanowo/yunui";
import { PageHeader, StatCard, SettingRow, CodeBlock } from "@yuhuanowo/yunui/patterns";
import { Activity, ArrowRight, Box, Cpu, Gauge, Layers, Server, ServerOff, Zap } from "lucide-react";
import { apiBase, type Model } from "./data";

interface Props { endpoint: string; items: Model[]; loaded: string|null; navigate: (path:string)=>void }
export function ConsoleView({endpoint, items, loaded, navigate}:Props) {
  const active = items.find(item=>item.id===loaded);
  return <section className="mx-auto w-full max-w-6xl space-y-6 px-5 py-7 sm:px-9 sm:py-9" data-testid="overview">
    <PageHeader title="推理引擎控制台" description="管理這台 Mac 上的模型、服務與推理工作。" actions={<Button onClick={()=>navigate('/models')}><Box size={15}/>管理模型</Button>}/>
    <Card className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex items-start gap-3"><Server size={22} className="mt-1 shrink-0 text-muted-foreground"/><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">Yunshu 本機服務</h2><Badge variant="secondary">未連線</Badge></div><p className="mt-2 break-all font-mono text-xs text-muted-foreground">{endpoint}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">連線後顯示引擎就緒狀態、版本與啟動錯誤。</p></div></div>
      <Button variant="secondary" onClick={()=>navigate('/settings')}>配置連線<ArrowRight size={14}/></Button>
    </Card>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard compact icon={Cpu} label="Metal 記憶體" value="—" subtext="等待引擎狀態"/>
      <StatCard compact icon={Activity} label="進行中請求" value="—" subtext="排隊 / Prefill / Decode"/>
      <StatCard compact icon={Zap} label="Decode 速度" value="—" subtext="tok/s · 由實際請求回報"/>
      <StatCard compact icon={Gauge} label="Prefill 速度" value="—" subtext="tok/s · 與 Decode 分開觀察"/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Card className="min-w-0 p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold">模型工作區</h2><Badge variant="outline">示範清單</Badge></div>
        {active ? <><div className="flex items-start gap-3"><Layers size={24} className="mt-1 text-muted-foreground"/><div className="min-w-0"><h3 className="text-lg font-semibold">{active.name}</h3><p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{active.repo}</p></div></div><div className="mt-5 grid grid-cols-3 gap-3 border-y border-border/60 py-4 text-xs"><div><p className="text-muted-foreground">檔案大小</p><p className="mt-1.5">{active.size}</p></div><div><p className="text-muted-foreground">上下文</p><p className="mt-1.5">{active.context}</p></div><div><p className="text-muted-foreground">能力</p><p className="mt-1.5">{active.kind}</p></div></div></> : <EmptyState title="沒有載入的示範模型" description="前往模型庫預覽載入與卸載流程。"/>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{items.length} 個示範模型 · {active ? 1 : 0} 個模擬載入</span><Button variant="ghost" size="sm" onClick={()=>navigate('/models')}>查看模型庫<ArrowRight size={13}/></Button></div>
      </Card>
      <Card className="min-w-0 px-5 py-2 sm:px-6"><div className="py-4"><h2 className="text-sm font-semibold">服務診斷</h2></div><SettingRow title="引擎就緒" description="模型載入或啟動錯誤會顯示在這裡" control={<Badge variant="secondary">待讀取</Badge>}/><SettingRow title="模型生命周期" description="載入、閒置、keep-alive 與卸載狀態" control={<span className="text-xs text-muted-foreground">—</span>}/><SettingRow title="請求階段" description="查看排隊、prefill 進度與 decode" control={<Button variant="ghost" size="sm" onClick={()=>navigate('/requests')}>查看<ArrowRight size={13}/></Button>}/></Card>
    </div>
    <Card className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"><div><h2 className="text-sm font-medium">讓你的應用接上本機引擎</h2><p className="mt-1 text-xs text-muted-foreground">使用 OpenAI / Anthropic 相容 API，供應用程式與 agent 共用本機模型。</p></div><Button variant="secondary" onClick={()=>navigate('/api')}>API 接入<ArrowRight size={14}/></Button></Card>
  </section>;
}
export function RequestsView({navigate}:{navigate:(path:string)=>void}) {
  return <section className="mx-auto w-full max-w-6xl space-y-6 px-5 py-7 sm:px-9 sm:py-9" data-testid="requests">
    <PageHeader title="請求與效能" description="把排隊、prefill 與 decode 分開看，定位真正的等待時間。"/>
    <Card className="p-6"><EmptyState icon={<Activity size={24}/>} title="等待引擎的請求資料" description="連線後顯示即時請求、處理進度、生成速度與延遲。" action={<Button variant="secondary" onClick={()=>navigate('/settings')}>設定連線</Button>}/></Card>
    <Card className="overflow-hidden"><Table scrollLabel="請求診斷欄位"><Thead><Tr><Th>請求 ID</Th><Th>模型</Th><Th>階段</Th><Th>進度 / 經過時間</Th><Th>操作</Th></Tr></Thead><Tbody><Tr><Td colSpan={5}><p className="py-6 text-center text-sm text-muted-foreground">連線後列出即時請求；取消動作只會作用於選定的請求。</p></Td></Tr></Tbody></Table></Card>
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
