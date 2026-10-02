import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@yuhuanowo/yunui";
import { AgentRunStatus, AgentTimeline, ThinkingBlock, type AgentTimelineBlock } from "@yuhuanowo/yunui/ai";
import { ChatComposer, ChatHeader, ChatMessage, ChatMessageList } from "@yuhuanowo/yunui/chat";

type PreviewState = "idle" | "working" | "approval" | "done" | "error";
type DraftView = "baseline" | "proposal";

const stateLabels: Record<PreviewState, string> = {
  idle: "等待",
  working: "執行中",
  approval: "待確認",
  done: "完成",
  error: "失敗",
};

const stateOrder: PreviewState[] = ["idle", "working", "approval", "done", "error"];

function StateControls({ value, onChange }: { value: PreviewState; onChange: (value: PreviewState) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="預覽狀態">
      {stateOrder.map((state) => (
        <Button
          key={state}
          type="button"
          size="sm"
          variant={state === value ? "secondary" : "ghost"}
          aria-pressed={state === value}
          onClick={() => onChange(state)}
        >
          {stateLabels[state]}
        </Button>
      ))}
    </div>
  );
}

function ReviewStatus({ children = "PENDING" }: { children?: React.ReactNode }) {
  return <Badge variant="warning" aria-label="設計審核狀態">{children}</Badge>;
}

function DraftHeader({
  id,
  title,
  description,
  view,
  onView,
}: {
  id: string;
  title: string;
  description: string;
  view: DraftView;
  onView: (view: DraftView) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{id}</span>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <ReviewStatus />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 gap-1" role="group" aria-label={`${id} 比較視圖`}>
          <Button size="sm" variant={view === "baseline" ? "secondary" : "ghost"} aria-pressed={view === "baseline"} onClick={() => onView("baseline")}>現行基線</Button>
          <Button size="sm" variant={view === "proposal" ? "secondary" : "ghost"} aria-pressed={view === "proposal"} onClick={() => onView("proposal")}>草案</Button>
        </div>
      </div>
    </div>
  );
}

function SampleMessages({ state }: { state: PreviewState }) {
  if (state === "idle") {
    return (
      <>
        <ChatMessage role="user" timestamp="剛才">請整理 ChatComposer 的插槽能力，並比較 @ 來源與 / 指令入口的草案。</ChatMessage>
        <ChatMessage role="assistant">
          收到。我會先核對 composer 的受控輸入與 toolbar 插槽，再整理來源和指令入口。
        </ChatMessage>
      </>
    );
  }
  if (state === "working") {
    return (
      <>
        <ChatMessage role="user" timestamp="剛才">請整理 ChatComposer 的插槽能力，並比較 @ 來源與 / 指令入口的草案。</ChatMessage>
        <ChatMessage role="assistant">
          <AgentRunStatus label="正在檢查 ChatComposer 的互動插槽" phase="thinking" />
          <ThinkingBlock isStreaming content="已確認受控 value、onChange、onSend 及 toolbar / attachments。" defaultOpen />
        </ChatMessage>
      </>
    );
  }
  if (state === "approval") {
    return (
      <>
        <ChatMessage role="user" timestamp="剛才">請整理 ChatComposer 的插槽能力，並比較 @ 來源與 / 指令入口的草案。</ChatMessage>
        <ChatMessage role="assistant" badges={<Badge variant="warning">待確認</Badge>}>
          D1 草案以工具列按鈕開啟來源與指令選單，輸入文字中的 @ 與 / 維持一般文字。
          <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            游標位置式選單是另一個可比較的方向。
          </div>
        </ChatMessage>
      </>
    );
  }
  if (state === "done") {
    return (
      <>
        <ChatMessage role="user" timestamp="剛才">請整理 ChatComposer 的插槽能力，並比較 @ 來源與 / 指令入口的草案。</ChatMessage>
        <ChatMessage role="assistant" badges={<Badge variant="success">整理完成</Badge>}>
          ChatComposer 有受控輸入、onSend，以及 toolbar 與 attachments 插槽。來源和指令可先由 toolbar 組合；目前沒有游標位置 callback。
        </ChatMessage>
      </>
    );
  }
  return (
    <>
      <ChatMessage role="user" timestamp="剛才">請整理 ChatComposer 的插槽能力，並比較 @ 來源與 / 指令入口的草案。</ChatMessage>
      <ChatMessage role="assistant" badges={<Badge variant="error">需調整</Badge>}>
        元件目錄未提供游標位置 callback；inline @ / 需要另外審查 API 範圍。
      </ChatMessage>
    </>
  );
}

function SourceMenu({ selected, onToggle }: { selected: string[]; onToggle: (source: string) => void }) {
  const sources = ["PromptBar.tsx", "AgentTimeline.tsx", "YunUI export catalogue"];
  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-foreground">加入來源</p>
      </div>
      <div className="space-y-1">
        {sources.map((source) => (
          <Button key={source} type="button" variant="ghost" size="sm" className="w-full justify-between" aria-pressed={selected.includes(source)} onClick={() => onToggle(source)}>
            <span>{source}</span><span aria-hidden="true">{selected.includes(source) ? "✓" : "+"}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

const slashCommands = [
  { command: "/summarize", description: "整理目前元件 API" },
  { command: "/compare", description: "比較基線與草案" },
  { command: "/explain", description: "說明互動取捨" },
];

function DraftComposer({ state, onStateChange }: { state: PreviewState; onStateChange: (state: PreviewState) => void }) {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<string[]>(["PromptBar.tsx"]);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [model, setModel] = useState("preview-fast");
  const toggleSource = (source: string) => setSelected((current) => current.includes(source) ? current.filter((item) => item !== source) : [...current, source]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-8 w-[170px]" aria-label="預覽模型">
            <SelectValue placeholder="選擇預覽模型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preview-fast">快速檢查（範例）</SelectItem>
            <SelectItem value="preview-reasoning">深入分析（範例）</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="已選來源">
          {selected.map((source) => <Badge key={source} variant="outline">{source}</Badge>)}
        </div>
      )}

      <ChatComposer
        value={value}
        onChange={setValue}
        placeholder="描述你要檢查的 YunUI 元件…"
        loading={state === "working"}
        onStop={() => onStateChange("idle")}
        labels={{ send: "預覽草案", stop: "停止預覽" }}
        onSend={() => { setValue(""); onStateChange("working"); }}
        toolbar={(
          <div className="flex flex-wrap items-center gap-1.5">
            <Popover open={sourcesOpen} onOpenChange={setSourcesOpen}>
              <PopoverTrigger asChild>
                <Button type="button" size="sm" variant={sourcesOpen ? "secondary" : "ghost"} aria-label="開啟來源選單">@ 來源</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                <SourceMenu selected={selected} onToggle={toggleSource} />
              </PopoverContent>
            </Popover>
            <Popover open={commandsOpen} onOpenChange={setCommandsOpen}>
              <PopoverTrigger asChild>
                <Button type="button" size="sm" variant={commandsOpen ? "secondary" : "ghost"} aria-label="開啟指令選單">/ 指令</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                <div className="space-y-1" role="listbox" aria-label="指令選單">
                  {slashCommands.map(({ command, description }) => (
                    <Button key={command} type="button" variant="ghost" size="sm" className="w-full justify-start gap-3" onClick={() => { setValue(`${command} `); setCommandsOpen(false); }}>
                      <span className="font-mono">{command}</span><span className="text-muted-foreground">{description}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      />
    </div>
  );
}

function DraftOne() {
  const [view, setView] = useState<DraftView>("proposal");
  const [state, setState] = useState<PreviewState>("idle");
  return (
    <Card className="overflow-hidden" data-review-draft="D1">
      <DraftHeader
        id="D1"
        title="撰寫區與情境來源"
        description="比較現行 ChatComposer 與附加 @ 來源、/ 指令、模型選擇的草案。"
        view={view}
        onView={setView}
      />
      <div className="space-y-4 p-4">
        <StateControls value={state} onChange={setState} />
        <div className="rounded-xl border border-border bg-background">
          <ChatHeader
            className="h-12 px-3"
            left={<><Badge variant="outline">YunUI</Badge><span className="truncate text-sm font-medium text-foreground">Composer 互動</span></>}
            status={<Badge variant="secondary">D1</Badge>}
            actions={<Button type="button" variant="ghost" size="sm" onClick={() => setState("idle")}>重設狀態</Button>}
          />
          {view === "baseline" ? (
            <div className="border-t border-border p-3">
              <div className="h-52 overflow-hidden">
                <ChatMessageList autoScroll={false} className="h-full space-y-1 px-2">
                  <SampleMessages state={state} />
                </ChatMessageList>
              </div>
              <div className="mt-3"><ChatComposer value="" onChange={() => {}} onSend={() => {}} placeholder="描述你要檢查的元件…" sendDisabled /></div>
            </div>
          ) : (
            <div className="border-t border-border p-3">
              <div className="h-52 overflow-hidden">
                <ChatMessageList autoScroll={false} className="h-full space-y-1 px-2">
                  <SampleMessages state={state} />
                </ChatMessageList>
              </div>
              <div className="mt-3">
                <DraftComposer state={state} onStateChange={setState} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function timelineFor(state: PreviewState): AgentTimelineBlock[] {
  if (state === "idle") return [];
  if (state === "working") {
    return [
      { kind: "reasoning", id: "reasoning-working", label: "檢查 composer 插槽", content: "先核對 ChatComposer 的 value / onChange / onSend，再分辨 toolbar 與游標位置控制。", active: true },
      { kind: "tool", id: "read-catalogue", verb: "讀取匯出目錄", summary: "agent/catalog.generated.json", status: "done", icon: "file", output: "已找到 ChatComposer、AgentTimeline 與 AgentRunStatus。" },
      { kind: "tool", id: "read-upstream", verb: "比對來源模式", summary: "PromptBar.tsx", status: "running", icon: "search", indent: true, command: "inspect @ / command menus" },
    ];
  }
  if (state === "approval") {
    return [
      { kind: "reasoning", id: "reasoning-approval", label: "整理 D1 / D2 取捨", content: "來源選單目前透過 toolbar 按鈕開啟；run summary 與 timeline 分離。" },
      { kind: "tool", id: "read-api", verb: "核對公開元件 API", summary: "ChatComposer / AgentTimeline", status: "done", icon: "file", output: "D1 用 toolbar 插槽；D2 用 AgentRunStatus 與既有 AgentTimeline。" },
      { kind: "approval", id: "approve-local", title: "確認 D1 / D2 草案方向", verb: "設計審核", message: "請選擇接受目前視覺方向，或退回進一步調整。", argsText: "D1：來源 / 指令 toolbar 選單\nD2：固定 run summary + expandable timeline\n回覆：維持在對話 lane", allowLabel: "確認方向", denyLabel: "需要調整" },
    ];
  }
  if (state === "done") {
    return [
      { kind: "reasoning", id: "reasoning-done", label: "完成 API 與狀態整理", content: "run summary 呈現當下活動；timeline 保留可展開的過程；最終答案維持獨立訊息。" },
      { kind: "tool", id: "done-catalogue", verb: "讀取公開匯出", summary: "agent/catalog.generated.json", status: "done", icon: "file", output: "已列出目前可用的 Chat 與 AI 元件。" },
      { kind: "tool", id: "done-source", verb: "比對互動參考", summary: "PromptBar.tsx", status: "done", icon: "search", output: "已整理 @、/ 選單入口的參考模式。" },
    ];
  }
  return [
    { kind: "reasoning", id: "reasoning-error", label: "檢查匯出目錄", content: "指定元件名稱未出現在目前的公開匯出清單。" },
    { kind: "tool", id: "tool-error", verb: "讀取 API 型別", summary: "agent/catalog.generated.json", status: "error", icon: "file", output: "無法確認此能力是否為已發布 API；應先補齊或重新確認範圍。" },
  ];
}

function SampleAnswer({ state }: { state: PreviewState }) {
  if (state !== "done" && state !== "error") return null;
  return (
    <ChatMessage role="assistant" name="YunUI 助手" badges={<Badge variant={state === "done" ? "success" : "error"}>{state === "done" ? "整理完成" : "需確認 API"}</Badge>}>
      {state === "done"
        ? "ChatComposer 的受控輸入與 toolbar 插槽已整理完成；D2 將 run status、時間線與回答分層。"
        : "目前型別未提供游標位置資訊；D1 以明確 toolbar 入口呈現來源與指令。"}
    </ChatMessage>
  );
}

function DraftTwo() {
  const [view, setView] = useState<DraftView>("proposal");
  const [state, setState] = useState<PreviewState>("working");
  const [timelineOpen, setTimelineOpen] = useState(true);
  const statusCopy: Record<PreviewState, { label: string; phase: "thinking" | "acting" | "observing" | "reflecting" | "responding" | "waiting"; active: boolean }> = {
    idle: { label: "等待新工作", phase: "waiting", active: false },
    working: { label: "正在檢查 ChatComposer 與 AgentTimeline API", phase: "thinking", active: true },
    approval: { label: "等待你確認 D1 / D2 草案", phase: "waiting", active: false },
    done: { label: "API 與流程分工已整理", phase: "responding", active: false },
    error: { label: "匯出目錄尚無此能力", phase: "waiting", active: false },
  };
  const blocks = timelineFor(state);
  const onApprove = () => setState("done");
  const onReject = () => setState("error");
  return (
    <Card className="overflow-hidden" data-review-draft="D2">
      <DraftHeader
        id="D2"
        title="代理流程摘要與時間線"
        description="比較現行 ThinkingBlock 與固定狀態摘要＋AgentTimeline 的分層草案。"
        view={view}
        onView={setView}
      />
      <div className="space-y-4 p-4">
        <StateControls value={state} onChange={setState} />
      {view === "baseline" ? (
        <div className="rounded-xl border border-border bg-background p-3">
            <ChatMessage role="user" timestamp="剛才">如何分開呈現目前 run 狀態、工具流程與最終回答？</ChatMessage>
            <ChatMessage role="assistant" name="YunUI 助手">
              {state === "done" ? "ChatComposer 提供 toolbar 與 attachments 插槽；AgentTimeline 可呈現 reasoning、tool 和 approval 節點。" : "目前先整理 composer 與 agent process 的分工。"}
              <ThinkingBlock
                isStreaming={state === "working"}
                content={state === "error" ? "匯出目錄沒有找到對應項目。" : "先核對 ChatComposer 的受控輸入，再整理 AgentTimeline 的狀態責任。"}
                defaultOpen={state === "working"}
              />
            </ChatMessage>
            <SampleAnswer state={state} />
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-border bg-background p-3">
            <section aria-label="目前代理狀態" className="rounded-lg border border-border px-3 py-2.5">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">目前代理狀態</span>
                <Badge variant={state === "working" ? "info" : state === "approval" ? "warning" : state === "error" ? "error" : state === "done" ? "success" : "default"}>{stateLabels[state]}</Badge>
              </div>
              <AgentRunStatus label={statusCopy[state].label} phase={statusCopy[state].phase} active={statusCopy[state].active} />
            </section>

            <section aria-label="處理時間線" className="rounded-lg border border-border px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">處理時間線</p>
                  <p className="text-xs text-muted-foreground">目前活動與已完成步驟</p>
                </div>
                <Badge variant="outline">{blocks.length} 個節點</Badge>
              </div>
              {blocks.length > 0 ? (
                <Collapsible open={timelineOpen} onOpenChange={setTimelineOpen}>
                  <CollapsibleTrigger asChild>
                    <Button type="button" size="sm" variant="ghost" className="mt-2">
                      {timelineOpen ? "收合步驟" : "展開步驟"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 border-t border-border pt-3">
                      <AgentTimeline blocks={blocks} onApprove={onApprove} onReject={onReject} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">目前沒有執行中的步驟。</p>
              )}
            </section>

            <section aria-label="對話回覆" className="rounded-lg border border-border px-3 py-2.5">
              <p className="mb-1 text-xs font-medium text-muted-foreground">對話回覆</p>
              <ChatMessageList autoScroll={false} className="max-h-48 space-y-0">
                <ChatMessage role="user" density="compact">如何分開呈現目前 run 狀態、歷史工具流程與最終回答？</ChatMessage>
                <SampleAnswer state={state} />
                {state !== "done" && state !== "error" && (
                  <ChatMessage role="assistant" density="compact" name="YunUI 助手" badges={<Badge variant="outline">尚未完成</Badge>}>
                    {state === "approval" ? "等待你確認時間線與回覆的分層方式。" : state === "idle" ? "等待工作指示。" : "時間線與最終回答尚未完成。"}
                  </ChatMessage>
                )}
              </ChatMessageList>
            </section>
          </div>
        )}
      </div>
    </Card>
  );
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <ChatHeader
          left={<><Badge variant="outline">YunUI</Badge><span className="text-sm font-medium">AI 互動設計審核</span></>}
          status={<Badge variant="warning">草案待審核</Badge>}
          actions={<Button type="button" variant="secondary" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "切換淺色" : "切換深色"}</Button>}
        />
      </header>
      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-5 md:px-6">
        <section className="rounded-xl border border-warning/30 bg-warning-soft p-4 text-warning">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning">PENDING</Badge>
            <p className="font-semibold">草案待審核，不會執行真實操作</p>
          </div>
          <p className="mt-1 text-sm">互動控制僅切換本地示範狀態；未連接代理、來源或後端。</p>
        </section>
        <div className="draft-review-grid items-start gap-4">
          <DraftOne />
          <DraftTwo />
        </div>
        <footer className="pb-6 text-xs text-muted-foreground">回饋焦點：D1 的來源入口與 D2 的 process / reply 分層。</footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
