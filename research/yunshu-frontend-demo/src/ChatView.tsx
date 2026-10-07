import { useState } from "react";
import { Badge, Button, EmptyState, IconButton, Sheet, Slider, Textarea } from "@yuhuanowo/yunui";
import { CodeBlock } from "@yuhuanowo/yunui/patterns";
import { ChatComposer, ChatMessage, ChatMessageList } from "@yuhuanowo/yunui/chat";
import { ArrowRight, Code2, FileText, Lightbulb, SlidersHorizontal, Sparkles } from "lucide-react";
import { type Thread } from "./data";

interface Props {
  thread: Thread; ready: boolean; nameForModel: (id: string) => string;
  patch: (patch: Partial<Thread>) => void; send: () => void; load: () => void;
}
export function ChatView({ thread, ready, patch, send, load, nameForModel }: Props) {
  const [parameters, setParameters] = useState(false);
  const composer = <div className="mx-auto w-full max-w-3xl">
    {!ready && <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>{nameForModel(thread.modelId)} 尚未載入示範工作區</span>
      <Button size="sm" variant="secondary" onClick={load}>載入此模型<ArrowRight size={13}/></Button>
    </div>}
    <ChatComposer value={thread.draft} onChange={draft => patch({ draft })} onSend={send}
      sendDisabled={!ready} placeholder={ready ? "輸入訊息…" : "可以先寫下問題，載入模型後再傳送。"}
      labels={{ send: "傳送訊息" }}
      toolbar={<IconButton icon={<SlidersHorizontal size={16}/>} label="對話設定" onClick={() => setParameters(true)}/>}/>
    <p className="mt-2 text-center text-[10px] leading-5 text-muted-foreground">示範工作區 · 回覆為本機預設內容，未連接推理引擎</p>
  </div>;
  return <>
    <section className="flex min-h-0 flex-1 flex-col" aria-label="對話內容" data-testid="chat">
      {thread.messages.length === 0 ? <div className="flex min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8">
        <div className="m-auto w-full max-w-3xl pb-8">
          <EmptyState icon={<Sparkles size={25} strokeWidth={1.5}/>} title="驗證模型回應" description="送出一個測試提示詞，檢查模型行為與輸出格式。"/>
          {composer}
          <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="建議提示詞">
            {[{ icon: Code2, text: "用 Python 呼叫 Yunshu" }, { icon: FileText, text: "幫我整理一段文字" }, { icon: Lightbulb, text: "解釋前綴快取的用途" }].map(({ icon: Icon, text }) =>
              <Button key={text} size="sm" variant="ghost" onClick={() => patch({ draft: text })}><Icon size={14}/>{text}</Button>)}
          </div>
        </div>
      </div> : <>
        <ChatMessageList key={thread.id} className="px-5 sm:px-8" empty={null}>
          <div className="mx-auto w-full max-w-3xl space-y-6 py-7">
            {thread.messages.map(message => <ChatMessage key={message.id} role={message.role} density="compact"
              name={message.role === "assistant" ? nameForModel(message.modelId ?? thread.modelId) : undefined}>
              <div className="whitespace-pre-wrap text-sm leading-7">{message.text}</div>
              {message.code && <CodeBlock language="python" code={message.code}/>}
            </ChatMessage>)}
          </div>
        </ChatMessageList>
        <div className="shrink-0 px-5 pb-4 pt-3 sm:px-8">{composer}</div>
      </>}
    </section>
    <Sheet open={parameters} onClose={() => setParameters(false)} title="對話設定" closeLabel="關閉對話設定">
      <div>
        <p className="text-xs leading-5 text-muted-foreground">僅套用到這段示範對話，不更改引擎設定。</p>
        <div className="mt-7 space-y-7">
          <div><p className="text-sm font-medium">目前模型</p><p className="mt-2 text-sm text-muted-foreground">{nameForModel(thread.modelId)}</p></div>
          <div><div className="mb-4 flex justify-between text-sm"><span>Temperature</span><Badge variant="secondary">{thread.temperature.toFixed(1)}</Badge></div>
            <Slider label="Temperature" min={0} max={2} step={0.1} value={[thread.temperature]} onValueChange={value => patch({ temperature: value[0] })}/>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">較低的值偏向穩定回答，較高的值讓回答更多變。</p>
          </div>
          <div><label htmlFor="system-prompt" className="text-sm font-medium">系統提示詞</label><Textarea id="system-prompt" className="mt-2 min-h-36" placeholder="例如：使用繁體中文，簡潔回答。" value={thread.systemPrompt} onChange={event => patch({ systemPrompt: event.target.value })}/></div>
        </div>
      </div>
    </Sheet>
  </>;
}
