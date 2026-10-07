import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge, Button, Card, Dialog, DialogContent, DialogDescription, DialogTitle,
  EmptyState, IconButton, Input, SegmentedSelect, Switch, AreaChart,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@yuhuanowo/yunui";
import { Sidebar, PageHeader, StatCard, MetricBar, SettingRow, CodeBlock } from "@yuhuanowo/yunui/patterns";
import { ModelManagerCard, ThinkingBlock, AgentRunStatus } from "@yuhuanowo/yunui/ai";
import { ChatComposer, ChatMessage, ChatMessageList, ChatHeader, GenerationStats } from "@yuhuanowo/yunui/chat";
import { YunUIProvider } from "@yuhuanowo/yunui/adapters";
import {
  ArrowDownToLine, ArrowRight, ArrowUpRight, Box, Check, ChevronRight, Code2,
  Cpu, Database, Gauge, HardDrive, Layers, Menu, MessageSquare, Monitor,
  Moon, Play, Plus, Search, Settings, ShieldCheck, Sparkles, Square, Sun, X, Zap,
} from "lucide-react";
import "./styles.css";

type Page = "overview" | "models" | "chat" | "settings";
const pageNames: Record<Page, string> = { overview: "總覽", models: "模型管理", chat: "聊天測試", settings: "設定" };
const inventory = [
  { id: "qwen", name: "Qwen3.8 27B", repo: "Jundot/Qwen3.8-27B-oQ4e-mtp", family: "Qwen", size: "16.4 GB", context: "128K", kind: "文字 · 視覺", initials: "Q", memory: 24.8 },
  { id: "qwen-small", name: "Qwen3.5 9B", repo: "mlx-community/Qwen3.5-9B-MLX-4bit", family: "Qwen", size: "5.8 GB", context: "128K", kind: "文字 · 視覺", initials: "Q", memory: 8.6 },
  { id: "llama", name: "Llama 3.2 3B", repo: "mlx-community/Llama-3.2-3B-Instruct-4bit", family: "Meta", size: "1.9 GB", context: "128K", kind: "文字", initials: "L", memory: 3.4 },
];
const rates = [34,36,35,43,49,44,51,56,52,60,61,58,65,68,64,67,71,70,66,72,69,74,73,76,72,76,79,76,78,80];
const sampleConversation = [
  { role: "user" as const, text: "Yunshu 是如何加快本機推理的？" },
  { role: "assistant" as const, text: "Yunshu 把重點放在三件事：更快開始、更流暢地生成，以及避免重複計算。\n\n透過 MLX 在 Apple Silicon 上執行模型，再依模型支援情況使用推測解碼與前綴快取。第一次對話和接續對話的表現也會分開觀察。\n\n你的模型與資料留在這台 Mac，應用程式則透過相容的 API 連接。" },
];

const demoAdapters = {
  useT: (_namespace?: string) => (key: string, values?: Record<string, unknown>) => {
    const copy: Record<string, string> = {
      copy: "複製", copied: "已複製", "codeBlock.copyFull": "複製完整程式碼",
      "codeBlock.copyError": "無法寫入剪貼簿，請選取程式碼後複製。",
      "codeBlock.scrollHorizontally": "左右捲動", "codeBlock.showLess": "收合",
      "codeBlock.tabGroup": "程式碼格式",
    };
    if (key === "codeBlock.lineCount") return `${values?.count ?? 0} 行`;
    if (key === "codeBlock.showAll") return `顯示全部 ${values?.count ?? 0} 行`;
    if (key === "codeBlock.scrollRegion") return `${values?.language ?? ""} 程式碼，${values?.count ?? 0} 行`;
    return Object.prototype.hasOwnProperty.call(copy, key) ? copy[key] : key;
  },
};

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState<string | null>("qwen");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState("30m");
  const [details, setDetails] = useState<typeof inventory[number] | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importId, setImportId] = useState("");
  const [notice, setNotice] = useState("");
  const [messages, setMessages] = useState(sampleConversation);
  const [draft, setDraft] = useState("");
  const [chatModel, setChatModel] = useState("qwen");
  const [endpoint, setEndpoint] = useState("http://127.0.0.1:8000");
  const [cache, setCache] = useState(true);
  const [reasoning, setReasoning] = useState(true);
  const [localOnly, setLocalOnly] = useState(true);
  const [saved, setSaved] = useState(false);
  const activeModel = inventory.find(item => item.id === loaded);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  function navigate(next: string) { setPage(next.replace("/", "") as Page); setMenuOpen(false); setNotice(""); }
  function send() {
    const text = draft.trim(); if (!text) return;
    setMessages(current => [...current, { role: "user", text }, { role: "assistant", text: `這是前端示範回覆，尚未呼叫模型。\n\n我已收到你的訊息「${text}」。正式接入後，這裡會顯示模型的串流回答、推理過程，以及這次生成的實際效能。` }]);
    setDraft("");
  }
  const shownModels = inventory.filter(item => (filter === "all" || item.id === loaded) && `${item.name} ${item.repo}`.toLowerCase().includes(query.toLowerCase()));
  const primaryAction = <Button onClick={() => navigate("/chat")}><MessageSquare size={15} />開始對話<ArrowUpRight size={14} /></Button>;

  return <YunUIProvider adapters={demoAdapters}>
    <div className="min-h-dvh">
      <Sidebar appName="Yunshu" ariaLabel="主要導覽" currentPath={`/${page}`} isOpen={menuOpen} onClose={() => setMenuOpen(false)} closeLabel="關閉導覽" onNavigate={navigate}
        sections={[{ title: "工作台", items: [
          { label: "總覽", href: "/overview", icon: Gauge },
          { label: "模型管理", href: "/models", icon: Box },
          { label: "聊天測試", href: "/chat", icon: MessageSquare },
        ] }, { title: "偏好設定", items: [{ label: "設定", href: "/settings", icon: Settings }] }]}
        header={<div className="flex items-center gap-3 px-6 py-7"><div aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background"><Layers size={20} strokeWidth={1.7} /></div><div className="flex-1"><div className="text-lg font-semibold tracking-tight">Yunshu<span className="ml-1.5 text-muted-foreground font-normal">雲舒</span></div><div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground">LOCAL INTELLIGENCE</div></div><IconButton className="lg:hidden" icon={<X size={17}/>} label="關閉導覽" onClick={() => setMenuOpen(false)} /></div>}
        footer={<div className="space-y-4 px-4 pb-5"><Card className="p-4"><div className="flex items-center gap-2 text-xs font-medium"><Monitor size={15}/><span>本機工作站</span><Badge variant="success" className="ml-auto text-[10px]">預覽</Badge></div><p className="mt-2 text-xs text-muted-foreground">Apple Silicon · MLX</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">127.0.0.1:8000</p></Card><div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground"><span>Yunshu 工作台</span><span>Demo 01</span></div></div>}
      />
      <div className="lg:pl-64">
        <header className="flex h-[72px] items-center justify-between gap-3 border-b border-border/60 px-5 sm:px-9 lg:px-10">
          <div className="flex min-w-0 items-center gap-3"><IconButton className="lg:hidden" icon={<Menu size={18}/>} label="開啟導覽" onClick={() => setMenuOpen(true)}/><span className="hidden text-sm text-muted-foreground sm:inline">工作台</span><ChevronRight className="hidden text-muted-foreground sm:block" size={13}/><span className="text-sm font-medium">{pageNames[page]}</span></div>
          <div className="flex items-center gap-3"><Badge variant="outline" className="text-[10px]">互動示範</Badge><span className="hidden text-xs text-muted-foreground md:inline">示範資料 · 未連線</span><div className="h-4 w-px bg-border"/><IconButton icon={dark ? <Sun size={17}/> : <Moon size={17}/>} label={dark ? "切換淺色" : "切換深色"} onClick={() => setDark(value => !value)}/></div>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-9 sm:py-9 lg:px-10 lg:py-10">
          {page === "overview" && <div className="space-y-7" data-testid="overview">
            <PageHeader title="你的本機推理工作台" description="從模型到對話，每一步都清楚掌握。" actions={primaryAction}/>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
              <StatCard compact label="生成速度" value={<span>80.2 <span className="text-sm font-normal text-muted-foreground">tok/s</span></span>} icon={Zap} subtext="最近一次生成 · 示範"/>
              <StatCard compact label="首字延遲" value={<span>186 <span className="text-sm font-normal text-muted-foreground">ms</span></span>} icon={Gauge} subtext="暖快取請求 · 示範"/>
              <StatCard compact label="模型記憶體" value={<span>{activeModel?.memory ?? "0"} <span className="text-sm font-normal text-muted-foreground">GB</span></span>} icon={Cpu} subtext="示範工作站 · 64 GB"/>
              <StatCard compact label="前綴快取命中" value={<span>92.4<span className="text-lg font-normal text-muted-foreground">%</span></span>} icon={Database} subtext="本次工作階段 · 示範"/>
            </div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
              <Card className="min-w-0 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-sm font-semibold">推理表現</h2><p className="mt-1 text-xs text-muted-foreground">生成速度 / tokens per second</p></div><SegmentedSelect value={range} onChange={setRange} options={[{label:"30 分鐘",value:"30m"},{label:"1 小時",value:"1h"}]}/></div>
                <div className="mb-2 mt-7 flex items-baseline gap-2"><span className="font-mono text-3xl tracking-tight">80.2</span><span className="text-xs text-muted-foreground">tok/s</span><Badge variant="success" className="ml-2 text-[10px]">穩定生成</Badge></div>
                <AreaChart ariaLabel="示範生成速度曲線" data={(range === "30m" ? rates : rates.slice().reverse()).map((value, i) => ({ value, label: `${range === "30m" ? "14" : "13"}:${String(range === "30m" ? i : i * 2).padStart(2, "0")}` }))} height={175} color="var(--text-primary)" showXAxis showGrid formatValue={value => `${value} tok/s`}/>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground"><span>平均 <strong className="ml-1 font-mono font-medium text-foreground">64.8</strong></span><span>最高 <strong className="ml-1 font-mono font-medium text-foreground">80.2</strong></span><span className="ml-auto">示範曲線</span></div>
              </Card>
              <Card className="flex flex-col p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">目前模型</h2><Badge variant={activeModel ? "success" : "secondary"}>{activeModel ? "已載入" : "未載入"}</Badge></div>
                {activeModel ? <><div className="mt-7 flex items-center gap-3"><Cpu size={27} strokeWidth={1.3} aria-hidden="true"/><div><h3 className="text-lg font-semibold tracking-tight">{activeModel.name}</h3><p className="mt-1 text-xs text-muted-foreground">4-bit · {activeModel.kind}</p></div></div><div className="my-6 space-y-4 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">上下文視窗</span><span className="font-mono">{activeModel.context}</span></div><div className="flex justify-between"><span className="text-muted-foreground">推理引擎</span><span>MLX · 本機</span></div><div className="flex justify-between"><span className="text-muted-foreground">模型檔案</span><span className="font-mono">{activeModel.size}</span></div></div><MetricBar label="記憶體使用" value={`${activeModel.memory} / 64 GB`} percentage={activeModel.memory / 64 * 100} color="var(--text-primary)"/></> : <EmptyState title="選擇一個模型" description="載入示範模型以預覽工作台狀態。"/>}
                <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate("/models")}>管理模型<ArrowRight size={14}/></Button>
              </Card>
            </div>
            <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-6"><div><h2 className="text-sm font-semibold">最近的請求</h2><p className="mt-1 text-xs text-muted-foreground">快速檢視每一次推理的表現</p></div><Badge variant="secondary">示範紀錄</Badge></div><Table scrollLabel="示範請求紀錄"><Thead><Tr><Th>請求</Th><Th>模型</Th><Th>首字延遲</Th><Th>速度</Th><Th>狀態</Th></Tr></Thead><Tbody>{[{id:"req_8a2f",time:"14:32:08",latency:"186 ms",speed:"80.2 tok/s"},{id:"req_79c1",time:"14:28:41",latency:"204 ms",speed:"77.6 tok/s"},{id:"req_62b0",time:"14:24:12",latency:"1.24 s",speed:"76.8 tok/s"}].map(row => <Tr key={row.id}><Td><div className="font-mono text-xs">{row.id}</div><div className="mt-1 text-[10px] text-muted-foreground">{row.time}</div></Td><Td><span className="text-xs">Qwen3.8 27B</span></Td><Td><span className="font-mono text-xs">{row.latency}</span></Td><Td><span className="font-mono text-xs">{row.speed}</span></Td><Td><Badge variant="success" className="text-[10px]">完成</Badge></Td></Tr>)}</Tbody></Table></Card>
            <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck size={14}/>本機優先。模型和資料由你掌握。</span><Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>設定 API 連線<ArrowUpRight size={13}/></Button></div>
          </div>}

          {page === "models" && <div className="space-y-6" data-testid="models"><PageHeader title="模型管理" description="把適合這台 Mac 的模型，放在手邊。" actions={<Button onClick={() => setImportOpen(true)}><Plus size={15}/>加入模型</Button>}/><div className="flex flex-col justify-between gap-3 sm:flex-row"><div className="relative w-full sm:max-w-sm"><Search size={16} className="pointer-events-none absolute left-3 top-3 text-muted-foreground"/><Input className="pl-9" aria-label="搜尋模型" placeholder="搜尋名稱或模型 ID…" value={query} onChange={event => setQuery(event.target.value)}/></div><SegmentedSelect value={filter} onChange={setFilter} options={[{label:`全部 ${inventory.length}`,value:"all"},{label:`已載入 ${loaded ? 1 : 0}`,value:"loaded"}]}/></div>
            <div className="space-y-4">{shownModels.map(item => <ModelManagerCard key={item.id} name={item.name} icon={<Cpu size={24} strokeWidth={1.4}/>} nameBadges={<Badge variant={loaded === item.id ? "success" : "secondary"}>{loaded === item.id ? "已載入" : "本機檔案"}</Badge>} ids={<span className="break-all font-mono text-[11px] text-muted-foreground">{item.repo}</span>} fields={[{label:"模型類型",value:item.kind},{label:"量化",value:"4-bit"},{label:"檔案大小",value:item.size},{label:"上下文",value:item.context}]} actions={<><Button size="sm" variant="ghost" onClick={() => setDetails(item)}>詳情</Button><Button size="sm" variant={loaded === item.id ? "secondary" : "primary"} onClick={() => { setLoaded(loaded === item.id ? null : item.id); setNotice(`已更新「${item.name}」的示範狀態；未操作真實模型。`); }}>{loaded === item.id ? <Square size={13}/> : <Play size={13}/>} {loaded === item.id ? "卸載" : "載入"}</Button></>}/>)}</div>
            {!shownModels.length && <EmptyState title="沒有符合的模型" description="試試其他關鍵字，或切回全部模型。"/>}<p role="status" className="min-h-5 text-xs text-muted-foreground">{notice || "此頁使用本機示範清單；載入、卸載與加入操作不會使用 GPU 或下載檔案。"}</p>
          </div>}

          {page === "chat" && <div data-testid="chat" className="flex h-[calc(100dvh-146px)] min-h-[500px] flex-col sm:h-[calc(100dvh-178px)]"><div className="mb-5"><PageHeader title="聊天測試" description="在接入應用之前，先和模型聊一聊。" actions={<Button variant="secondary" size="sm" onClick={() => setMessages([])}><Plus size={14}/>新對話</Button>}/></div><Card className="flex min-h-0 flex-1 flex-col overflow-hidden"><ChatHeader className="border-b border-border/60" left={<div className="flex items-center gap-2"><Cpu size={16}/><span className="text-sm font-medium">{inventory.find(item=>item.id===chatModel)?.name}</span><Badge variant="secondary" className="text-[10px]">本機</Badge></div>} status={<span className="text-xs text-muted-foreground">示範對話</span>}/><ChatMessageList className="px-4 sm:px-7" empty={<EmptyState icon={<MessageSquare size={24}/>} title="從一個問題開始" description="輸入訊息以體驗示範對話。"/>}>{messages.map((message,index) => <ChatMessage key={index} role={message.role} name={message.role === "assistant" ? inventory.find(item=>item.id===chatModel)?.name : undefined} density="compact" badges={message.role === "assistant" ? <AgentRunStatus phase="completed" label="示範回覆"/> : undefined} footer={message.role === "assistant" ? <GenerationStats tokens={128} tokensPerSecond={80.2} labels={{tokens:"示範 tokens",speed:"示範 tok/s"}}/> : undefined}>{message.role === "assistant" && reasoning && <ThinkingBlock content="這是展開推理過程的介面示範，並非模型的真實思考內容。" labels={{title:"推理過程",completed:"完成"}}/>}<div className="whitespace-pre-wrap text-sm leading-7">{message.text}</div></ChatMessage>)}</ChatMessageList><div className="border-t border-border/50 p-3 sm:p-4"><ChatComposer value={draft} onChange={setDraft} onSend={send} selectedModelId={chatModel} onModelChange={setChatModel} modelItems={inventory.map(item => ({id:item.id,label:item.name,description:item.kind}))} placeholder="輸入訊息，試試模型的回應…" labels={{send:"傳送示範訊息",model:"選擇聊天模型"}}/><div className="mt-2 text-center text-[10px] text-muted-foreground">互動示範 · 回覆為預設內容，未呼叫推理服務</div></div></Card></div>}

          {page === "settings" && <div className="max-w-4xl space-y-6" data-testid="settings"><PageHeader title="工作台設定" description="保留簡單，把控制權留給你。"/><Card className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><Code2 size={17}/><h2 className="text-sm font-semibold">API 連線</h2><Badge variant="secondary" className="ml-auto">僅儲存於本次預覽</Badge></div><label htmlFor="endpoint" className="text-sm font-medium">服務位址</label><Input id="endpoint" className="mt-2 font-mono text-sm" value={endpoint} onChange={event => {setEndpoint(event.target.value);setSaved(false);}}/><p className="mt-2 text-xs leading-5 text-muted-foreground">正式版將用於連接這台 Mac 上的 Yunshu 服務。</p><div className="mt-5 flex items-center gap-3"><Button size="sm" onClick={() => setSaved(true)}><Check size={14}/>{saved ? "已儲存示範設定" : "儲存設定"}</Button><span role="status" className="text-xs text-muted-foreground">{saved ? "沒有變更真實引擎設定。" : ""}</span></div></Card><Card className="px-5 py-2 sm:px-6"><SettingRow title="只連接本機服務" description="預設使用 loopback 位址，讓工作流程留在你的 Mac。" control={<Switch checked={localOnly} onCheckedChange={setLocalOnly} label="只連接本機服務"/>}/><SettingRow title="前綴快取" description="重複的上下文可以重用計算結果；此處為設定外觀示範。" control={<Switch checked={cache} onCheckedChange={setCache} label="前綴快取"/>}/><SettingRow title="顯示推理過程" description="在聊天測試中顯示可展開的推理區塊。" control={<Switch checked={reasoning} onCheckedChange={setReasoning} label="顯示推理過程"/>}/></Card><Card className="p-5 sm:p-6"><div className="mb-3 flex items-center gap-2"><Code2 size={16}/><h2 className="text-sm font-semibold">接入你的應用</h2></div><p className="mb-4 text-xs text-muted-foreground">OpenAI 相容介面。下方程式碼可切換格式、複製。</p><CodeBlock code="" tabs={[{id:"python",label:"Python",language:"python",code:`from openai import OpenAI\n\nclient = OpenAI(base_url=${JSON.stringify(endpoint + "/v1")}, api_key="local")\nresponse = client.chat.completions.create(\n    model="local",\n    messages=[{"role": "user", "content": "Hello, Yunshu."}],\n)`},{id:"curl",label:"cURL",language:"bash",code:`curl ${JSON.stringify(endpoint + "/v1/models")}`}]} /></Card></div>}
        </main>
      </div>
      <Dialog open={!!details} onOpenChange={open => {if(!open)setDetails(null);}}><DialogContent closeLabel="關閉對話框"><DialogTitle>{details?.name}</DialogTitle><DialogDescription>本機模型詳情 · 示範資料</DialogDescription><div className="space-y-4 py-3"><div className="break-all font-mono text-xs text-muted-foreground">{details?.repo}</div><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-muted-foreground">模型檔案</p><p className="mt-1">{details?.size}</p></div><div><p className="text-xs text-muted-foreground">上下文視窗</p><p className="mt-1">{details?.context}</p></div></div></div><Button onClick={() => {if(details)setChatModel(details.id);setDetails(null);navigate('/chat');}}>前往聊天測試<ArrowRight size={14}/></Button></DialogContent></Dialog>
      <Dialog open={importOpen} onOpenChange={setImportOpen}><DialogContent closeLabel="關閉對話框"><DialogTitle>加入模型</DialogTitle><DialogDescription>輸入 Hugging Face 模型 ID，預覽加入流程。Demo 不會下載檔案。</DialogDescription><Input aria-label="模型 ID" placeholder="例如 mlx-community/Qwen3.5-9B-MLX-4bit" value={importId} onChange={event => setImportId(event.target.value)}/><Button disabled={!importId.trim()} onClick={() => {setNotice(`示範已記錄模型 ID：${importId.trim()}；未啟動下載。`);setImportId('');setImportOpen(false);}}><ArrowDownToLine size={15}/>確認模型 ID</Button></DialogContent></Dialog>
    </div>
  </YunUIProvider>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
