import { useEffect, useState } from "react";
import { Badge, Button, IconButton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yuhuanowo/yunui";
import { Sidebar } from "@yuhuanowo/yunui/patterns";
import { ChatHeader } from "@yuhuanowo/yunui/chat";
import { YunUIProvider } from "@yuhuanowo/yunui/adapters";
import { Activity, Box, Code2, Gauge, Layers, Menu, MessageSquare, Moon, Plus, Settings, Sun, X } from "lucide-react";
import { readWorkspace, sessionKey } from "./session";
import { RequestsView, ApiView } from "./ConsoleView";
import { DashboardView } from "./DashboardView";
import { ChatView } from "./ChatView";
import { ModelsView, SettingsView } from "./LibraryViews";
import { initialThreads, makeThread, models, routeFromHash, type Model, type Thread } from "./data";

const adapters = {
  useT: (_namespace?: string) => (key: string, values?: Record<string, unknown>) => {
    const copy: Record<string,string> = { copy:"複製", copied:"已複製", "codeBlock.copyFull":"複製完整程式碼", "codeBlock.copyError":"無法寫入剪貼簿，請選取程式碼後複製。", "codeBlock.scrollHorizontally":"左右捲動", "codeBlock.showLess":"收合", "codeBlock.tabGroup":"程式碼格式" };
    if(key === "codeBlock.lineCount") return `${values?.count ?? 0} 行`;
    if(key === "codeBlock.showAll") return `顯示全部 ${values?.count ?? 0} 行`;
    if(key === "codeBlock.scrollRegion") return `${values?.language ?? ""} 程式碼，${values?.count ?? 0} 行`;
    return Object.prototype.hasOwnProperty.call(copy,key) ? copy[key] : key;
  },
};
const titles = { overview:"引擎總覽", chat:"推理測試", models:"模型庫", requests:"請求與效能", api:"API 接入", settings:"設定" };

export default function App() {
  const [savedWorkspace] = useState(readWorkspace);
  const [route, setRoute] = useState(routeFromHash);
  const [threads, setThreads] = useState<Thread[]>(savedWorkspace?.threads ?? initialThreads);
  const [activeId, setActiveId] = useState(savedWorkspace?.activeId ?? "new");
  const [items, setItems] = useState<Model[]>(savedWorkspace?.items ?? models);
  const [loaded, setLoaded] = useState<string|null>(savedWorkspace ? savedWorkspace.loaded : "qwen");
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(savedWorkspace?.dark ?? false);
  const [endpoint, setEndpoint] = useState(savedWorkspace?.endpoint ?? "http://127.0.0.1:8000");
  const [notice, setNotice] = useState("");
  const thread = threads.find(item => item.id === activeId) ?? threads[0];
  const ready = loaded === thread.modelId;
  useEffect(() => {
    const listener = () => setRoute(routeFromHash());
    addEventListener("hashchange",listener);return () => removeEventListener("hashchange",listener);
  },[]);
  useEffect(() => {
    if(route.page === "chat" && route.threadId && threads.some(item => item.id === route.threadId)) setActiveId(route.threadId);
  },[route,threads]);
  useEffect(() => { document.documentElement.classList.toggle("dark",dark); },[dark]);

  useEffect(() => {
    try { sessionStorage.setItem(sessionKey,JSON.stringify({threads,items,activeId,loaded,endpoint,dark})); }
    catch { setNotice("瀏覽器無法保存此示範工作區；目前內容仍保留在頁面中。"); }
  },[threads,items,activeId,loaded,endpoint,dark]);

  function navigate(href:string) {
    location.hash = href;
    setRoute(routeFromHash());setMenu(false);setNotice("");
  }
  function patch(patch: Partial<Thread>) {
    setThreads(current => current.map(item => item.id === thread.id ? { ...item, ...patch } : item));
  }
  function newChat(modelId = thread.modelId) {
    const next = makeThread(crypto.randomUUID(),modelId);
    setThreads(current => [next,...current]);setActiveId(next.id);navigate(`/chat/${next.id}`);
  }
  function send() {
    const text = thread.draft.trim();
    if(!text || !ready) return;
    const reply = text.toLowerCase().includes("python")
      ? { text:"可以使用 OpenAI SDK，將 base_url 指向 Yunshu 的本機位址。這是預設範例回覆，沒有呼叫模型。", code:'from openai import OpenAI\n\nclient = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="local")' }
      : { text:"這是預覽工作區的範例回覆，尚未呼叫推理引擎。\n\n你可以繼續輸入、切換模型，或建立新對話，檢查整個操作流程。正式接入後，這裡只會呈現引擎實際回傳的內容。" };
    patch({ title:thread.messages.length ? thread.title : Array.from(text).slice(0,24).join(""), draft:"", messages:[...thread.messages,{id:crypto.randomUUID(),role:"user",text},{id:crypto.randomUUID(),role:"assistant",modelId:thread.modelId,...reply}] });
  }
  function load(id: string) { setLoaded(id);setNotice(`已切換示範載入狀態：${items.find(item => item.id === id)?.name ?? id}`); }
  function addModel(repo:string) {
    const existing = items.find(item => item.repo === repo);
    if(existing) {setNotice("此模型已在清單中。");return;}
    setItems(current => [...current,{id:repo,name:repo.split("/").at(-1)!,repo,size:"待掃描",context:"待讀取",kind:"待辨識"}]);
    setNotice("模型 ID 已加入示範清單，沒有下載檔案。");
  }
  const currentPath = route.page === "chat" ? `/chat/${activeId}` : `/${route.page}`;

  return <YunUIProvider adapters={adapters}>
    <div className="h-dvh overflow-hidden bg-background">
      <Sidebar appName="Yunshu" ariaLabel="工作台導覽" currentPath={currentPath} isOpen={menu} onClose={() => setMenu(false)} closeLabel="關閉導覽" onNavigate={navigate}
        className="bg-muted/20"
        header={<div className="space-y-5 px-4 pb-2 pt-5"><div className="flex items-center gap-2.5 px-2"><Layers size={22} strokeWidth={1.6}/><span className="flex-1 text-lg font-semibold tracking-tight">Yunshu<span className="ml-2 text-sm font-normal text-muted-foreground">雲舒</span></span><IconButton className="lg:hidden" icon={<X size={17}/>} label="關閉導覽" onClick={() => setMenu(false)}/></div><Button variant="secondary" className="w-full justify-start" onClick={() => navigate("/models")}><Box size={16}/>管理模型</Button></div>}
        sections={[{title:"推理引擎",items:[{label:"引擎總覽",href:"/overview",icon:Gauge},{label:"模型庫",href:"/models",icon:Box},{label:"請求與效能",href:"/requests",icon:Activity},{label:"API 接入",href:"/api",icon:Code2}]},{title:"工具",items:[{label:"推理測試",href:"/chat",icon:MessageSquare}]}]}
        footer={<div className="space-y-3 px-4 pb-4"><Button variant={route.page === "settings" ? "secondary" : "ghost"} aria-current={route.page === "settings" ? "page" : undefined} className="w-full justify-start" onClick={() => navigate('/settings')}><Settings size={16}/>設定</Button><div className="flex items-center justify-between border-t border-border/60 px-2 pt-4 text-[10px] text-muted-foreground"><span>Yunshu · 本機優先</span><Badge variant="secondary" className="text-[9px]">互動原型</Badge></div></div>}/>
      <div className="flex h-dvh min-w-0 flex-col lg:pl-64">
        <ChatHeader className="min-h-16 shrink-0 border-b border-border/60 px-4 sm:px-7"
          left={<div className="flex min-w-0 items-center gap-2"><IconButton className="lg:hidden" icon={<Menu size={18}/>} label="開啟導覽" onClick={() => setMenu(true)}/>{route.page === "chat" ? <Select value={thread.modelId} onValueChange={modelId => patch({modelId})}><SelectTrigger aria-label="選擇對話模型" className="w-[180px] sm:w-[220px]"><SelectValue/></SelectTrigger><SelectContent>{items.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select> : <span className="text-sm font-medium">{titles[route.page]}</span>}</div>}
          status={route.page === "chat" ? <Badge variant={ready ? "success" : "secondary"} className="text-[10px]">{ready ? "已載入" : "未載入"}</Badge> : undefined}
          actions={<div className="flex items-center gap-2">{route.page === "chat" && <Button size="sm" variant="ghost" onClick={() => newChat()}><Plus size={13}/>新測試</Button>}<span className="hidden text-[11px] text-muted-foreground md:inline">示範工作區 · 未連接引擎</span><IconButton icon={dark ? <Sun size={16}/> : <Moon size={16}/>} label={dark ? "切換淺色" : "切換深色"} onClick={() => setDark(value => !value)}/></div>}/>
        {notice && <div role="status" className="shrink-0 border-b border-border/50 px-5 py-2 text-xs text-muted-foreground sm:px-8">{notice}</div>}
        {route.page === "chat" ? <ChatView thread={thread} ready={ready} patch={patch} send={send} load={() => load(thread.modelId)} nameForModel={id => items.find(item => item.id === id)?.name ?? id}/> : <div className="min-h-0 flex-1 overflow-y-auto">
          {route.page === "models" && <ModelsView items={items} loaded={loaded} load={load} unload={() => {setLoaded(null);setNotice("已卸載示範模型；需再次載入才能傳送訊息。");}} chat={id => newChat(id)} add={addModel}/>}
          {route.page === "overview" && <DashboardView endpoint={endpoint} items={items} loaded={loaded} navigate={navigate}/>}
          {route.page === "requests" && <RequestsView items={items}/>}
          {route.page === "api" && <ApiView endpoint={endpoint}/>}
          {route.page === "settings" && <SettingsView endpoint={endpoint} saveEndpoint={setEndpoint} dark={dark} setDark={setDark}/>}
        </div>}
      </div>
    </div>
  </YunUIProvider>;
}
