import { useRef, useState } from "react";
import { Badge, Button, Card, Dialog, DialogContent, DialogDescription, DialogTitle, EmptyState, Input, SegmentedSelect, Table, Thead, Tbody, Tr, Th, Td, Switch } from "@yuhuanowo/yunui";
import { CodeBlock, PageHeader, SettingRow } from "@yuhuanowo/yunui/patterns";
import { ArrowRight, Box, Cpu, HardDrive, Plus, Search, ServerOff, Square, Play } from "lucide-react";
import { apiBase, endpointError, type Model } from "./data";

interface ModelsProps { items: Model[]; loaded: string | null; load: (id: string) => void; unload: () => void; chat: (id: string) => void; add: (repo: string) => void }
export function ModelsView({ items, loaded, load, unload, chat, add }: ModelsProps) {
  const opener = useRef<HTMLButtonElement | null>(null);
  const restoreFocus = (event: Event) => {
    if (opener.current?.isConnected) { event.preventDefault(); opener.current.focus({ preventScroll: true }); }
  };
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [importing, setImporting] = useState(false);
  const [repo, setRepo] = useState("");
  const [details, setDetails] = useState<Model | null>(null);
  const shown = items.filter(item => (filter === "all" || item.id === loaded) && `${item.name} ${item.repo}`.toLowerCase().includes(query.toLowerCase()));
  const validRepo = /^[\w.-]+\/[\w.-]+$/.test(repo.trim());
  return <section className="mx-auto w-full max-w-6xl space-y-6 px-5 py-7 sm:px-9 sm:py-9" data-testid="models">
    <PageHeader title="模型庫" description="查看本機模型，選擇要載入的模型。" actions={<Button onClick={event => { opener.current = event.currentTarget; setImporting(true); }}><Plus size={15}/>加入模型</Button>}/>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full sm:max-w-xs"><Search size={15} className="pointer-events-none absolute left-3 top-3 text-muted-foreground"/><Input aria-label="搜尋模型" placeholder="搜尋模型名稱或 ID" className="pl-9" value={query} onChange={event => setQuery(event.target.value)}/></div>
      <SegmentedSelect value={filter} onChange={setFilter} options={[{label:`全部 ${items.length}`,value:"all"},{label:`已載入 ${loaded ? 1 : 0}`,value:"loaded"}]}/>
    </div>
    <Card className="overflow-hidden">
      <Table scrollLabel="模型清單">
        <Thead><Tr><Th>模型</Th><Th className="hidden md:table-cell">檔案大小</Th><Th className="hidden xl:table-cell">上下文</Th><Th>狀態與操作</Th></Tr></Thead>
        <Tbody>{shown.map(item => <Tr key={item.id}>
          <Td><div className="flex items-start gap-3 py-2"><Cpu size={19} className="mt-1 hidden shrink-0 text-muted-foreground sm:block"/><div className="min-w-0"><Button variant="ghost" size="sm" className="-ml-2 h-auto max-w-full justify-start whitespace-normal px-2 text-left font-medium" onClick={event => { opener.current = event.currentTarget; setDetails(item); }}>{item.name}</Button><p className="mt-1 max-w-[160px] break-all font-mono text-[10px] text-muted-foreground sm:max-w-[280px]">{item.repo}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.kind} · 4-bit<span className="md:hidden"> · {item.size}</span></p></div></div></Td>
          <Td className="hidden font-mono text-xs md:table-cell">{item.size}</Td>
          <Td className="hidden font-mono text-xs xl:table-cell">{item.context}</Td>
          <Td><div className="flex flex-col items-start gap-2 py-2 sm:items-end">
            <Badge variant={loaded === item.id ? "success" : "secondary"}>{loaded === item.id ? "已載入" : "未載入"}</Badge>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="secondary" onClick={() => loaded === item.id ? unload() : load(item.id)}>{loaded === item.id ? <Square size={12}/> : <Play size={12}/>} {loaded === item.id ? "卸載" : "載入"}</Button>
              <Button size="sm" variant="ghost" onClick={() => chat(item.id)}>測試<ArrowRight size={12}/></Button>
            </div>
          </div></Td>
        </Tr>)}</Tbody>
      </Table>
      {!shown.length && <EmptyState icon={<Box size={22}/>} title="找不到模型" description="換個關鍵字，或查看全部模型。"/>}
    </Card>
    <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><HardDrive size={14} className="mt-0.5 shrink-0"/>此清單是示範資料。加入、載入與卸載只更新預覽狀態，不下載檔案或使用 GPU。</p>
    <Dialog open={importing} onOpenChange={setImporting}><DialogContent closeLabel="關閉對話框" onCloseAutoFocus={restoreFocus}><DialogTitle>加入模型</DialogTitle><DialogDescription>輸入 Hugging Face 模型 ID，加入此示範清單；不會下載模型。</DialogDescription><label htmlFor="repo-id" className="text-sm">模型 ID</label><Input id="repo-id" placeholder="組織名稱／模型名稱" value={repo} onChange={event => setRepo(event.target.value)} aria-describedby="repo-hint"/><p id="repo-hint" className="text-xs text-muted-foreground">例如 mlx-community/Qwen3.5-9B-MLX-4bit</p><Button disabled={!validRepo} onClick={() => {add(repo.trim());setRepo("");setImporting(false);}}>加入示範清單</Button></DialogContent></Dialog>
    <Dialog open={!!details} onOpenChange={open => {if(!open)setDetails(null);}}><DialogContent closeLabel="關閉對話框" onCloseAutoFocus={restoreFocus}><DialogTitle>{details?.name}</DialogTitle><DialogDescription>模型資料 · 預覽工作區</DialogDescription><p className="break-all font-mono text-xs text-muted-foreground">{details?.repo}</p><dl className="grid grid-cols-2 gap-5 py-4 text-sm"><div><dt className="text-muted-foreground">檔案大小</dt><dd className="mt-1">{details?.size}</dd></div><div><dt className="text-muted-foreground">上下文</dt><dd className="mt-1">{details?.context}</dd></div></dl><Button onClick={() => {if(details)chat(details.id);setDetails(null);}}>測試此模型<ArrowRight size={14}/></Button></DialogContent></Dialog>
  </section>;
}

interface SettingsProps { endpoint: string; saveEndpoint: (value: string) => void; dark: boolean; setDark: (value: boolean) => void }
export function SettingsView({ endpoint, saveEndpoint, dark, setDark }: SettingsProps) {
  const [draft, setDraft] = useState(endpoint);
  const [saved, setSaved] = useState(false);
  const error = endpointError(draft.trim());
  return <section className="mx-auto w-full max-w-4xl space-y-7 px-5 py-7 sm:px-9 sm:py-9" data-testid="settings">
    <PageHeader title="設定" description="連線與介面偏好。生成參數可在推理測試工具中調整；引擎啟動設定由服務管理。"/>
    <Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold">引擎連線</h2><p className="mb-5 mt-1 text-xs leading-5 text-muted-foreground">預覽只記錄服務位址，不會發送連線請求或變更引擎設定。</p><label className="text-sm" htmlFor="endpoint">服務位址</label><Input id="endpoint" className="mt-2 font-mono" value={draft} onChange={event => {setDraft(event.target.value);setSaved(false);}} aria-invalid={!!error} aria-describedby="endpoint-feedback"/><p id="endpoint-feedback" role={error ? "alert" : "status"} className="mt-2 min-h-5 text-xs text-muted-foreground">{error ?? (saved ? "位址已儲存於本次工作區，尚未連線。" : "可使用 http://127.0.0.1:8000，或包含 /v1 的 API base URL。")}</p><Button size="sm" className="mt-4" disabled={!!error || !draft.trim()} onClick={() => {saveEndpoint(draft.trim().replace(/\/+$/, ""));setSaved(true);}}>儲存位址</Button></Card>
    <Card className="px-5 sm:px-6"><SettingRow title="深色介面" description="只調整此工作台的外觀。" control={<Switch checked={dark} onCheckedChange={setDark} label="深色介面"/>}/></Card>
    <div><h2 className="mb-3 text-sm font-medium">連接應用程式</h2><CodeBlock code="" tabs={[{id:"python",label:"Python",language:"python",code:`from openai import OpenAI\n\nclient = OpenAI(\n    base_url=${JSON.stringify(apiBase(endpoint))},\n    api_key="local",\n)`},{id:"curl",label:"cURL",language:"bash",code:`curl ${JSON.stringify(apiBase(endpoint)+"/models")}`}]} /></div>
  </section>;
}
