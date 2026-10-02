import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, ChevronDown, Menu, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "@yuhuanowo/yunui/content";
import CompactCodeBlock from "./upstream/CompactCodeBlock";
import ApprovalCard, { type ApprovalQuestion } from "./upstream/ApprovalCard";
import PromptBar from "./upstream/PromptBar";
import TaskRows, { type TaskRow } from "./upstream/TaskRows";
import ThinkingState from "./upstream/ThinkingState";
import ToolChips, { type ToolStep } from "./upstream/ToolChips";

type State = "Idle" | "Working" | "Approval" | "Done" | "Error";
type Phase = "waiting" | "acting" | "approval" | "completed" | "failed" | "cancelled";

const labels: Record<State, string> = { Idle: "Ready", Working: "Checking the Navbar docs…", Approval: "Approval required", Done: "Route checks completed", Error: "Documentation test failed" };
const sourceSteps: ToolStep[] = [
  { icon: "read", label: "Check documentation routes", chip: "/docs/patterns/navbar · 3 locales", mono: false, detailMono: false, detail: [{ text: "The route rendered in English, Simplified Chinese and Traditional Chinese." }, { text: "Reference: site/content/docs/ai/agent-timeline.zh-TW.mdx" }] },
  { icon: "think", label: "Review ChatComposer API", chip: "src/chat/chat-composer.tsx", mono: true, detailMono: true, detail: [{ text: "The host owns source, command, model and send callbacks." }] },
  { icon: "run", label: "Review CodeBlock output", chip: "12-line verification", mono: false, detailMono: false, detail: [{ text: "The source is `research/ai-refactor/prototypes-v4/captures/webkit-390-light-approval.png`." }, { text: "The source row opens an actual public CodeBlock with this tool output." }] },
  { icon: "run", label: "Run documentation tests", chip: "pnpm test", mono: true, detailMono: true, detail: [{ text: "The command outcome is controlled by this local review fixture." }] },
];
const sourceDiffs = [
  { file: "src/chat/chat-composer.tsx", add: 18, del: 4 },
  { file: "site/content/docs/ai/agent-timeline.zh-TW.mdx", add: 12, del: 2 },
];
const sourceDiffLines = {
  "src/chat/chat-composer.tsx": [
    { text: "const source = host.sourceItems.find(item => item.id === id);", tone: "ctx" as const },
    { text: "onSourceSelect?.(source);", tone: "add" as const },
    { text: "setDraft(prefix + insertion);", tone: "del" as const },
    { text: "setDraft(prefix + insertion + suffix);", tone: "add" as const },
  ],
  "site/content/docs/ai/agent-timeline.zh-TW.mdx": [
    { text: "Run state comes from the host.", tone: "ctx" as const },
    { text: "The route output remains available after a tool failure.", tone: "add" as const },
    { text: "A rejected request is recorded without a failed command.", tone: "add" as const },
  ],
};
const questions: ApprovalQuestion[] = [
  { q: "Which documentation scope should I use?", type: "check", options: ["English, Simplified Chinese and Traditional Chinese", "ChatComposer API", "Agent process states"] },
  { q: "How should the result be summarized?", type: "radio", options: ["Short summary", "Include route details", "Include API notes"] },
];
const sourceItems = [
  { key: "workspace", name: "Workspace docs", desc: "Guides and release notes", glyph: "layers" },
  { key: "web-search", name: "Web search", desc: "Search the public documentation", glyph: "globe" },
  { key: "promptbar", name: "ChatComposer API", desc: "Published composer contract", glyph: "chart" },
  { key: "timeline", name: "AgentTimeline API", desc: "Published agent process contract", glyph: "globe" },
  { key: "run-status", name: "AgentRunStatus API", desc: "Host-owned run phase", glyph: "chart" },
  { key: "questionnaire", name: "ApprovalQuestion API", desc: "Host-owned questionnaire data", glyph: "layers" },
  { key: "markdown", name: "MarkdownRenderer API", desc: "Public content entry point", glyph: "chart" },
  { key: "code-block", name: "CodeBlock API", desc: "Public Shiki code renderer", glyph: "layers" },
  { key: "patterns", name: "YunUI patterns", desc: "Shared page-level components", glyph: "layers" },
  { key: "catalog", name: "catalog.generated.json", desc: "Generated public export catalogue", glyph: "chart" },
  { key: "recipe-chat", name: "agent/recipes/chat/README.md", desc: "Typed host integration recipe", glyph: "clip" },
  { key: "timeline-file", name: "site/content/docs/ai/agent-timeline.zh-TW.mdx", desc: "Traditional Chinese API documentation", glyph: "clip" },
  { key: "capture-file", name: "research/ai-refactor/prototypes-v4/captures/approval-review-image-390.png", desc: "Local review capture filename", glyph: "clip" },
];
const commandItems = [
  { key: "review", name: "/review", desc: "Review the current API" },
  { key: "summarize", name: "/summarize", desc: "Summarize route results" },
  { key: "compare", name: "/compare", desc: "Compare the two layouts" },
];
const modelItems = [
  { key: "host-reasoning", name: "Reasoning model", tag: "Workspace" },
  { key: "host-fast", name: "Fast model", tag: "Workspace" },
];
const toolCode12 = Array.from({ length: 12 }, (_, index) => `const locale${index + 1} = await checkRoute("/docs/patterns/navbar", "${["en", "zh-CN", "zh-TW"][index % 3]}");`).join("\n");
const shortCode3 = `const route = "/docs/patterns/navbar";\nconst locales = ["en", "zh-CN", "zh-TW"];\nawait verifyRoute(route, locales);`;
const longCode80 = Array.from({ length: 80 }, (_, index) => `const routeResult${String(index + 1).padStart(2, "0")} = await checkRoute("/docs/patterns/navbar", "${["en", "zh-CN", "zh-TW"][index % 3]}");`).join("\n");
const doneMarkdown = `The Navbar documentation route rendered in English, Simplified Chinese and Traditional Chinese. The route result remains available alongside the test output, so the release review can preserve partial results if a later check fails.\n\nThe host-owned composer contract is in \`src/chat/chat-composer.tsx\`; the language-specific agent process reference is \`site/content/docs/ai/agent-timeline.zh-TW.mdx\`. The generated export list is \`agent/catalog.generated.json\`, and the approval interaction capture is \`research/ai-refactor/prototypes-v4/captures/webkit-390-light-approval.png\`.\n\nThis concise code sample supports the result rather than replacing it. All selections and rendered output in this review stay local to the fixture.`;
const completedTasks: TaskRow[] = [
  { key: "routes", label: "Check documentation routes", amount: "3 locales", status: "done", details: [{ label: "Navbar route rendered", meta: "3 / 3" }, { label: "site/content/docs/ai/agent-timeline.zh-TW.mdx", meta: "read" }] },
  { key: "tests", label: "Run documentation tests", amount: "1 command", status: "done", details: [{ label: "Tests passed", meta: "local fixture" }] },
];
const failedTasks: TaskRow[] = [
  { key: "routes", label: "Check documentation routes", amount: "3 locales", status: "done", details: [{ label: "Navbar route rendered", meta: "3 / 3" }, { label: "site/content/docs/ai/agent-timeline.zh-TW.mdx", meta: "read" }] },
  { key: "tests", label: "Run documentation tests", amount: "1 command", status: "sequence", step: 2, details: [{ label: "Typecheck failed", meta: "exit 2" }, { label: "research/ai-refactor/prototypes-v4/captures/webkit-390-light-approval.png", meta: "review" }] },
];

function App() {
  const [state, setState] = useState<State>("Working");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [phase, setPhase] = useState<Phase>("acting");
  const [notice, setNotice] = useState("No host callback has run yet.");
  const [approvalDecision, setApprovalDecision] = useState<"approved" | "rejected" | null>(null);
  const [questionnaireSubmitted, setQuestionnaireSubmitted] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, number[]>>({});
  const [selectedModel, setSelectedModel] = useState(modelItems[0].key);
  const [selectedSources, setSelectedSources] = useState<string[]>(["workspace"]);
  const [modelPickerDisabled, setModelPickerDisabled] = useState(false);
  const [modelListEmpty, setModelListEmpty] = useState(false);
  const [approvalBusy, setApprovalBusy] = useState(false);
  const [toolCodeExpanded, setToolCodeExpanded] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const baselineFrameRef = useRef<HTMLIFrameElement>(null);
  const baselineSyncTimerRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  const themeRef = useRef(theme);
  stateRef.current = state;
  themeRef.current = theme;

  const syncBaseline = () => {
    if (baselineSyncTimerRef.current !== null) {
      window.clearTimeout(baselineSyncTimerRef.current);
      baselineSyncTimerRef.current = null;
    }
    const desiredState = stateRef.current;
    const doc = baselineFrameRef.current?.contentDocument;
    if (!doc) return;
    const root = doc.querySelector<HTMLElement>('[data-testid="chat-demo-root"]');
    if (!root) return;
    doc.documentElement.classList.toggle("dark", themeRef.current === "dark");
    doc.documentElement.setAttribute("data-theme", themeRef.current);
    doc.body.style.setProperty("margin", "0", "important");
    doc.body.style.setProperty("overflow", "hidden", "important");
    const styleId = "d4-baseline-isolation";
    let isolated = doc.getElementById(styleId) as HTMLStyleElement | null;
    if (!isolated) {
      isolated = doc.createElement("style");
      isolated.id = styleId;
      isolated.textContent = `html,body{height:100%!important;min-height:100%!important;background:var(--bg-base,#fff)!important;overflow:hidden!important}#nd-subnav{visibility:hidden!important;pointer-events:none!important}[data-testid="chat-demo-root"]{position:fixed!important;inset:0!important;z-index:2147483647!important;width:100%!important;max-width:none!important;max-height:100%!important;overflow:auto!important;margin:0!important;padding:10px!important;box-sizing:border-box!important;background:var(--bg-base,#fff)!important}.d4-baseline-hidden{visibility:hidden!important;pointer-events:none!important}`;
      doc.head.appendChild(isolated);
    }
    let ancestor: HTMLElement | null = root.parentElement;
    while (ancestor && ancestor !== doc.body) {
      ancestor.style.setProperty("background", "transparent", "important");
      ancestor.style.setProperty("border", "0", "important");
      ancestor.style.setProperty("box-shadow", "none", "important");
      ancestor.style.setProperty("padding", "0", "important");
      ancestor.style.setProperty("margin", "0", "important");
      ancestor.style.setProperty("overflow", "visible", "important");
      ancestor.style.setProperty("transform", "none", "important");
      ancestor = ancestor.parentElement;
    }
    for (const element of Array.from(doc.querySelectorAll<HTMLElement>("#nd-docs-layout > div"))) {
      if (element.contains(root)) continue;
      if (getComputedStyle(element).position === "sticky" || getComputedStyle(element).position === "fixed") element.classList.add("d4-baseline-hidden");
    }
    const group = root.querySelector<HTMLElement>('[role="group"][aria-label="Agent state fixture"]');
    const stateButton = group && Array.from(group.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent?.trim() === desiredState);
    if (stateButton?.getAttribute("aria-pressed") === "true") {
      doc.documentElement.removeAttribute("data-d4-state-sync-retry");
      return;
    }
    stateButton?.click();
    if (stateButton?.getAttribute("aria-pressed") !== "true") {
      const retries = Number(doc.documentElement.getAttribute("data-d4-state-sync-retry") ?? "0");
      if (retries >= 16) return;
      doc.documentElement.setAttribute("data-d4-state-sync-retry", String(retries + 1));
      baselineSyncTimerRef.current = window.setTimeout(() => {
        baselineSyncTimerRef.current = null;
        syncBaseline();
      }, 100);
    } else doc.documentElement.removeAttribute("data-d4-state-sync-retry");
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => { syncBaseline(); }, [state, theme]);

  const transition = (next: State) => {
    setState(next);
    setPhase(next === "Idle" ? "waiting" : next === "Working" ? "acting" : next === "Approval" ? "approval" : next === "Done" ? "completed" : "failed");
    setApprovalDecision(null);
    setQuestionnaireSubmitted(false);
    setQuestionnaireAnswers({});
    setApprovalBusy(false);
    setToolCodeExpanded(false);
    setNotice("No host callback has run yet.");
  };
  const localAllow = () => {
    if (approvalBusy) return;
    setApprovalDecision("approved");
    setState("Done");
    setPhase("completed");
    setNotice("Host approval callback received for approval-command.");
  };
  const localDeny = () => {
    if (approvalBusy) return;
    setApprovalDecision("rejected");
    setState("Error");
    setPhase("cancelled");
    setNotice("Host rejection callback received for approval-command; the command was not run.");
  };
  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((current) => [...current, text.trim()]);
    setState("Working");
    setPhase("acting");
    setNotice(`Host onSend callback received: “${text.trim()}”.`);
  };
  const resultText = state === "Idle"
    ? "I’m ready to check the Navbar documentation and the Agent Chat component contracts."
    : state === "Working"
      ? "I’m checking the Navbar route in all three locales, then reviewing the composer and agent process APIs."
      : state === "Approval"
        ? "The route check is complete. Review the proposed documentation test command before it runs."
        : state === "Done"
          ? approvalDecision === "approved"
            ? "The host approval callback completed the local test fixture."
            : "The documentation tests passed."
          : approvalDecision === "rejected"
            ? "The route check is complete. The requested command was declined and was not run."
            : "The route check is complete. The documentation test command ran and failed; the route result is still available.";
  return <div className={`d4-root ${theme}`} data-testid="d4-root">
    <div className="review-bar">
      <div className="review-copy"><span className="review-mark">D4</span><div><strong>Agent Chat · D4 review draft</strong><small>Pending owner review · local fixture only</small></div></div>
      <div className="review-actions">
        <button type="button" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"}</button>
        <a href="http://localhost:3941/docs/chat" target="_blank" rel="noreferrer">Open current baseline</a>
      </div>
      <div className="state-controls" role="group" aria-label="D4 state fixture">
        {(["Idle", "Working", "Approval", "Done", "Error"] as State[]).map((item) => <button key={item} type="button" aria-pressed={state === item} className={state === item ? "selected" : ""} onClick={() => transition(item)}>{item}</button>)}
      </div>
      <div className="model-controls" role="group" aria-label="Model availability fixture">
        <button type="button" aria-pressed={modelPickerDisabled} onClick={() => setModelPickerDisabled((value) => !value)}>Disable model picker</button>
        <button type="button" aria-pressed={modelListEmpty} onClick={() => setModelListEmpty((value) => !value)}>Clear model list</button>
      </div>
      <div className="model-controls" role="group" aria-label="Approval request fixture">
        <button type="button" aria-pressed={approvalBusy} onClick={() => setApprovalBusy((value) => !value)}>Busy approval</button>
      </div>
      <p className="review-notice" role="status" data-testid="d4-host-event">{notice}</p>
    </div>

    <div className="compare-grid">
      <section className="baseline-pane" aria-label="Current documentation baseline">
        <header><div><strong>Current working-tree UI</strong><small>/docs/chat · same fixture and state</small></div><a href="http://localhost:3941/docs/chat" target="_blank" rel="noreferrer">Open ↗</a></header>
        <iframe ref={baselineFrameRef} title="Current working-tree Agent Chat baseline" src="/docs/chat" loading="eager" onLoad={syncBaseline} />
      </section>

      <section className="draft-pane" aria-label="D4 Beautiful UI source-derived draft">
        <div className="d4-window">
          <header className="workspace-head">
            <div className="workspace-title"><button type="button" className="mobile-nav" aria-label="Open workspace navigation"><Menu size={16}/></button><div><div className="title-line"><strong>Release review</strong></div><small>Agent Chat · YunUI workspace</small></div></div>
            <a href="http://localhost:3941/docs/chat" target="_blank" rel="noreferrer">Compare</a>
          </header>
          <div className="conversation-scroll">
            <div className="user-turn"><div>Can you check the Navbar docs before the release?</div></div>
            {messages.map((message, index) => <div className="user-turn" key={`${message}-${index}`}><div>{message}</div></div>)}
            <article className="assistant-turn">
              <span className="assistant-glyph"><Sparkles size={14}/></span>
              <div className="assistant-body">
                <div className="assistant-meta"><span>YunUI agent</span><span className={`phase-copy ${state.toLowerCase()}`} data-testid="d4-phase" data-phase={phase}>{labels[state]}</span></div>
                {state !== "Done" && <p className="assistant-response">{resultText}</p>}
                {state === "Done" && <div className="done-markdown" data-testid="d4-long-assistant-output">
                  <MarkdownRenderer content={doneMarkdown} linkOrigin="http://localhost:3946" />
                  <CompactCodeBlock code={shortCode3} language="typescript" filename="src/chat/chat-composer.tsx · route example" onEdit={(payload) => setNotice(`Host edit received ${payload.filename} (${payload.code.split("\n").length} lines, ${payload.language}).`)} />
                  <CompactCodeBlock code={longCode80} language="typescript" filename="research/ai-refactor/prototypes-v4/captures/webkit-390-light-approval.png" onEdit={(payload) => setNotice(`Host edit received ${payload.filename} (${payload.code.split("\n").length} lines, ${payload.language}).`)} />
                </div>}
                {state === "Approval" && <>
                  <div className="approval-tool-line">
                    <div><span className="approval-title">Run documentation tests</span><code>pnpm test</code></div>
                    <span>Review before run</span>
                  </div>
                  <div className="approval-actions" role="group" aria-label="Host tool decision">
                    <button type="button" disabled={approvalBusy} onClick={localAllow}>Allow</button>
                    <button type="button" disabled={approvalBusy} onClick={localDeny}>Deny</button>
                  </div>
                  <div className="question-card" data-testid="d4-question" data-answer-count={Object.keys(questionnaireAnswers).length}>
                    <ApprovalCard disabled={approvalBusy} manualAdvance questions={questions} labels={{skip:"Skip",continue:"Next",send:"Save answers",customPlaceholder:"Add another…",sentMessage:"Answers saved"}} onAnswerChange={(questionIndex, answer) => { setQuestionnaireAnswers((current) => ({ ...current, [questionIndex]: answer })); setNotice(`Host received a local answer for question ${questionIndex + 1}.`); }} onSubmitted={(answers) => { setQuestionnaireAnswers(answers); setQuestionnaireSubmitted(true); setNotice("Questionnaire answers saved locally; tool approval is still pending."); }} />
                    {questionnaireSubmitted && <button type="button" className="restore-question" onClick={() => setQuestionnaireSubmitted(false)}>Reset questionnaire preview</button>}
                  </div>
                </>}
                {state === "Working" && <div className="activity-details" aria-label="Agent activity details">
                  <ThinkingState compact variant="Coding" staticStage={2} active="Checking the Navbar docs…" done="Documentation review complete" rows={[
                    {primary:"Render the Navbar page", secondary:"3 locales"},
                    {primary:"Review ChatComposer API", secondary:"chat-composer.tsx", mono:true},
                    {primary:"Review AgentTimeline API", secondary:"agent-timeline.tsx", mono:true},
                  ]}/>
                  <ToolChips compact staticStep={5} labels={{header:"4 tool calls · 2 files", more:"More"}} steps={sourceSteps} diffs={sourceDiffs} diffLines={sourceDiffLines} onOpenChange={(open) => { if (!open) setToolCodeExpanded(false); }} onToggleRow={(label, open) => { if (label === "Review CodeBlock output") setToolCodeExpanded(open); }} />
                  {toolCodeExpanded && <div className="tool-code-output" data-testid="d4-tool-code-output">
                    <CompactCodeBlock code={toolCode12} language="typescript" filename="site/content/docs/ai/agent-timeline.zh-TW.mdx · code sample" onEdit={(payload) => setNotice(`Host edit received ${payload.filename} (${payload.code.split("\n").length} lines, ${payload.language}).`)} />
                  </div>}
                </div>}
                {state === "Done" && <div className="task-details"><TaskRows variant="List" staticTick={5} labels={{completed:"Completed",failed:"Failed"}} rows={completedTasks}/></div>}
                {state === "Error" && <div className="task-details">
                  {approvalDecision === "rejected"
                    ? <TaskRows variant="List" staticTick={5} labels={{completed:"Completed",failed:"Failed"}} rows={[completedTasks[0]]}/>
                    : <TaskRows variant="List" staticTick={3} labels={{completed:"Completed",failed:"Failed"}} rows={failedTasks}/>}
                </div>}
                    {state === "Done" && <div className="message-actions"><button type="button" onClick={() => setNotice("Host copy callback received.")}>Copy</button><button type="button" onClick={() => setNotice("Host regenerate callback received.")}>Regenerate</button></div>}
                {state === "Done" && <div className="code-review"><a href="http://localhost:3947/prototype/codeblock-v4" target="_blank" rel="noreferrer">Review the three CodeBlock scenarios <ChevronDown size={13}/></a></div>}
              </div>
            </article>
          </div>
          <footer className="composer-dock" onKeyDownCapture={(event) => {
            if (state !== "Approval" || event.key !== "Tab" || !event.shiftKey) return;
            const footer = document.querySelector('[data-testid="d4-question"] .primitive-card-footer');
            const buttons = footer ? Array.from(footer.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")) : [];
            const last = buttons.at(-1);
            if (!last) return;
            event.preventDefault();
            last.style.setProperty("scroll-margin-bottom", "8px");
            last.focus();
            last.scrollIntoView({ block: "nearest", inline: "nearest" });
          }}>
            <PromptBar
              tall
              placeholder="Message the release review agent…"
              onSend={send}
              sourceItems={sourceItems}
              commandItems={commandItems}
              modelItems={modelListEmpty ? [] : modelItems}
              selectedModelKey={modelListEmpty ? undefined : selectedModel}
              modelPickerDisabled={modelPickerDisabled}
              onSourceSelect={(source) => { setSelectedSources((current) => current.includes(source.key) ? current : [...current, source.key]); setNotice(`Host source callback received: ${source.key}.`); }}
              onCommandSelect={(command) => setNotice(`Host command callback received: ${command.key}.`)}
              onModelChange={(model) => { setSelectedModel(model.key); setNotice(`Host selected model id: ${model.key}.`); }}
            />
            <div className="composer-note"><span>Enter to send · @ sources · / commands</span><span>{selectedSources.length} source{selectedSources.length === 1 ? "" : "s"} · {modelPickerDisabled ? "Model picker disabled" : modelListEmpty ? "No models available" : modelItems.find((item) => item.key === selectedModel)?.name}</span></div>
            <div className="host-fixture-links" aria-label="Host data callbacks"><button type="button" onClick={() => setSelectedSources((current) => current.includes("workspace") ? current.filter((id) => id !== "workspace") : [...current, "workspace"])}><Check size={12}/> Workspace docs</button><span>{sourceItems.length} sources available</span></div>
          </footer>
        </div>
      </section>
    </div>
    <footer className="privacy-note">D4 is a pending visual/interaction review. All controls update this local fixture only; it sends no model, command, search, or tool request.</footer>
  </div>;
}

createRoot(document.getElementById("root")!).render(<App/>);
