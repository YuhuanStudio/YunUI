import { useEffect, useMemo, useState } from "react";
import StreamingText, { type StreamingSource, type StreamingToken } from "../components/StreamingText";
import ContextCards, { type ContextChunk } from "../components/ContextCards";
import SelectionActions, { type SelectionActionsState } from "../components/SelectionActions";
import DiffTable, { type DiffTableRow } from "../components/DiffTable";

const prose = "Account access changes can take up to one business day to appear for all team members. If access is still missing, contact the workspace administrator with the request ID.";
const proseTokens = prose.split(/(\s+)/).filter(Boolean).map((text) => ({ text }));
const tokens: StreamingToken[] = [...proseTokens.slice(0, 17), { text: "", cite: true }, ...proseTokens.slice(17)];
const sources: StreamingSource[] = [
  { name: "Access guide", domain: "help.example", href: "#source-access" },
  { name: "Service status", domain: "status.example", href: "#source-status" },
];
const context: ContextChunk[] = [
  { id: "access-guide", title: "Workspace access guide", chars: "182 words", body: "Role updates may take up to one business day to reach every workspace service. The request ID can help an administrator trace a delayed update.", source: "Access guide.pdf", badge: "PDF", tone: "bg-red", href: "#access-guide" },
  { id: "status-report", title: "Service status note", chars: "96 words", body: "No active access-control incident is reported. Delays affecting individual accounts should be checked with the workspace administrator.", source: "Service status.md", badge: "DOC", tone: "bg-green", href: "#status-note" },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [streamState, setStreamState] = useState<"streaming" | "complete" | "error" | "cancelled" | "empty">("complete");
  const [visibleCount, setVisibleCount] = useState(tokens.length);
  const [streamStatus, setStreamStatus] = useState("Host fixture: answer complete; source and follow-up callbacks are available.");
  const [contextEmpty, setContextEmpty] = useState(false);
  const [contextStatus, setContextStatus] = useState("Retrieved context is supplied by the host.");
  const [selectionState, setSelectionState] = useState<SelectionActionsState>("idle");
  const [selectionStatus, setSelectionStatus] = useState("Host fixture: selection is idle.");
  const [diffState, setDiffState] = useState<"idle" | "busy" | "applied" | "error" | "cancelled" | "disabled">("idle");
  const [selectedIds, setSelectedIds] = useState<readonly string[]>(["change-policy", "change-notice"]);
  const [diffStatus, setDiffStatus] = useState("No apply request sent.");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const visibleContext = contextEmpty ? [] : context;
  const diffRows: readonly DiffTableRow[] = useMemo(() => [
    { id: "change-policy", primary: "Extend the access review window", category: "Security", secondary: "Policy §2", change: "remove" },
    { id: "change-notice", primary: "Add an administrator notice", category: "Access", secondary: "Guide §4", change: "add" },
    { id: "change-copy", primary: "Clarify request ID copy", category: "Content", secondary: "Guide §7", change: "add" },
  ], []);

  return <div className="review-shell"><main className="review-main">
    <header className="review-header"><div><div className="review-eyebrow">RESEARCH · COMPONENT REVIEW · OWNER APPROVED · REFERENCE SNAPSHOT</div><h1>Conversation and agent interaction units</h1></div><button type="button" className="rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: "var(--border-default)", background: "var(--bg-card)", color: "var(--text-primary)" }} onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}>Theme: {theme}</button></header>
    <p className="review-note">Each unit below is adapted from its pinned Beautiful UI React primitive, preserving source JSX, SVGs, and component geometry where possible. Data, answer progress, decisions, and backend results come from this host fixture. Timer-driven demo behavior has been removed. The owner approved these four designs on 2026-10-02. This page preserves the reviewed source port; the actual public components are integrated into YunUI.</p>

    <section className="review-section" id="streaming"><header><div><span className="review-eyebrow">P1 · STREAMINGTEXT</span><h2>Answer, citations, sources, actions, follow-ups</h2></div><code>StreamingText.tsx · upstream JSX retained/adapted</code></header>
      <StreamingText content={streamState === "error" || streamState === "cancelled" || streamState === "empty" ? [] : tokens} sources={sources} followUps={["Show the access review steps", "Who can resolve this request?"]} state={streamState} visibleCount={streamState === "streaming" ? visibleCount : undefined} onAction={(action) => setStreamStatus(`Host callback: ${action} requested.`)} onFollowUp={(text) => setStreamStatus(`Host callback: follow-up requested — “${text}”.`)} />
      <div className="review-fixture"><label htmlFor="stream-state">Host answer state</label><select id="stream-state" value={streamState} onChange={(event) => { const state = event.target.value as typeof streamState; setStreamState(state); if (state === "streaming") setVisibleCount(Math.min(12, tokens.length)); }}><option value="streaming">Streaming</option><option value="complete">Complete</option><option value="empty">Empty</option><option value="error">Error</option><option value="cancelled">Cancelled</option></select>{streamState === "streaming" ? <><label htmlFor="stream-count">Visible tokens</label><input id="stream-count" type="range" min="0" max={tokens.length} value={visibleCount} onChange={(event) => setVisibleCount(Number(event.target.value))}/><button type="button" onClick={() => setVisibleCount((value) => Math.min(tokens.length, value + 5))}>Advance host chunk</button></> : null}<span role="status" className="review-status">{streamStatus}</span></div>
    </section>

    <section className="review-section" id="context-cards"><header><div><span className="review-eyebrow">P2 · CONTEXTCARDS</span><h2>Retrieved context cards for this answer</h2></div><code>ContextCards.tsx · upstream article/card geometry retained</code></header>
      <ContextCards chunks={visibleContext} labels={{ header: "Retrieved context" }} onSourceOpen={(chunk) => setContextStatus(`Host source-open callback: ${chunk.source}.`)} onSelectionChange={(chunk) => setContextStatus(`Host context callback: ${chunk.id} selected.`)} />
      <div className="review-fixture"><button type="button" onClick={() => setContextEmpty((value) => !value)}>{contextEmpty ? "Restore host chunks" : "Show empty host state"}</button><span role="status" className="review-status">{contextStatus}</span></div>
    </section>

    <section className="review-section" id="selection-actions"><header><div><span className="review-eyebrow">P2 · SELECTIONACTIONS</span><h2>Actions anchored beneath selected passage</h2></div><code>SelectionActions.tsx · floating anchor/pill geometry retained</code></header>
      <SelectionActions lead="The account access request is being reviewed. " selectedText="Most changes are available within one business day after approval." resultText="After approval, access changes usually appear within one business day." state={selectionState} onAction={(action, instruction) => setSelectionStatus(`Host callback: ${action}${instruction ? ` (${instruction})` : ""} requested; choose a host response state below.`)} onAccept={(result) => setSelectionStatus(`Host accepted result: ${result}`)} onDismiss={() => { setSelectionState("idle"); setSelectionStatus("Host dismissed the edit; original passage remains."); }} />
      <div className="review-fixture"><label htmlFor="selection-state">Host edit response</label><select id="selection-state" value={selectionState} onChange={(event) => setSelectionState(event.target.value as SelectionActionsState)}><option value="idle">Idle</option><option value="busy">Pending</option><option value="result">Result ready</option><option value="error">Error</option><option value="cancelled">Cancelled</option></select><span role="status" className="review-status">{selectionStatus}</span></div>
    </section>

    <section className="review-section" id="diff-review"><header><div><span className="review-eyebrow">P1 · DIFFTABLE</span><h2>Proposed changes with host apply boundary</h2></div><code>DiffTable.tsx · Beautiful UI pinned source</code></header>
      <DiffTable rows={diffRows} selectedIds={selectedIds} state={diffState} onSelectionChange={setSelectedIds} onApply={(ids) => setDiffStatus(`Apply requested for ${ids.length} host changes; awaiting response.`)} onReject={(ids) => setDiffStatus(`Reject requested for ${ids.length} host changes; awaiting response.`)} />
      <div className="review-fixture"><label htmlFor="diff-state">Host apply response</label><select id="diff-state" value={diffState} onChange={(event) => setDiffState(event.target.value as typeof diffState)}><option value="idle">Idle</option><option value="busy">Applying</option><option value="applied">Applied</option><option value="error">Error</option><option value="cancelled">Cancelled</option><option value="disabled">Disabled</option></select><button type="button" onClick={() => { setSelectedIds([]); setDiffStatus("Host fixture cleared selection."); }}>Clear selection</button><button type="button" onClick={() => { setSelectedIds(["change-policy", "change-notice"]); setDiffStatus("Host fixture restored selected changes."); }}>Restore selection</button><span role="status" className="review-status">{diffStatus}</span></div>
    </section>

    <footer className="review-footer"><strong>Source and license</strong><p>Components are copied/adapted from `reference/beautiful-ui/components/primitives/{"StreamingText,ContextCards,SelectionActions,DiffTable"}.tsx` at commit <code>44a274e598395ab61e7c96c26fda2758780253b7</code>. Upstream is MIT; <a href="/licenses/beautiful-ui-MIT.txt">full MIT notice</a> is included in this isolated packet. Source geometry and structure are retained; fake gallery timers, product data, and automatic success are removed. YunUI color and surface tokens provide the small theme bridge. All four designs were approved by the owner on 2026-10-02. Production integration is recorded in research/ai-refactor/production-conversation-units/INTEGRATION.zh-TW.md.</p><p>Host owns retrieval, selected text, generated answer/result, busy/error/cancelled status, change selection, persistence, and apply/reject outcomes.</p></footer>
  </main></div>;
}
