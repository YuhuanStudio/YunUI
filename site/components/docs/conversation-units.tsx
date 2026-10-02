"use client";

import { useState } from "react";
import { Button } from "yunui";
import { StreamingText, ContextCards, type StreamingTextProps } from "yunui/chat";
import { SelectionActions, DiffTable, type SelectionActionsState, type DiffTableState } from "yunui/ai";

const sources = [{ id: "guide", name: "Release guide", domain: "YunUI docs", href: "/docs/chat" }, { id: "api", name: "Public API", domain: "YunUI docs", href: "/docs/ai/agent-timeline" }];
const content = [{ id: "body", text: "The conversation components now use the public YunUI API. " }, { id: "citation", text: "", sourceId: "guide" }, { id: "end", text: " Review the proposed changes before applying them." }];
const chunks = [{ id: "guide", title: "Conversation integration", body: "The host supplies messages, retrieval context and execution state. YunUI provides the reusable interaction surfaces.", source: "Release guide.md", badge: "MD", href: "/docs/chat" }];
const rows = [{ id: "replace", primary: "Replace duplicate controls", category: "Chat", secondary: "Conversation view", change: "remove" as const }, { id: "reuse", primary: "Use public components", category: "Library", secondary: "Public imports", change: "add" as const }];

export function StreamingTextDemo() {
  const [state, setState] = useState<NonNullable<StreamingTextProps["state"]>>("complete");
  const [event, setEvent] = useState("No request sent.");
  return <div className="w-full space-y-3" data-testid="streaming-text-demo"><StreamingText content={content} sources={sources} state={state} visibleCount={state === "streaming" ? 1 : undefined} followUps={["Show the integration guide", "Review the API changes"]} onAction={action => setEvent(`Host action requested: ${action}`)} onFollowUp={text => setEvent(`Host follow-up requested: ${text}`)} /><label className="flex items-center gap-2 text-xs">Host answer state<select aria-label="Host answer state" value={state} onChange={e => setState(e.target.value as typeof state)} className="rounded-md border border-border bg-background p-1">{["complete", "streaming", "empty", "error", "cancelled"].map(value => <option key={value}>{value}</option>)}</select></label><p role="status" className="text-xs text-muted-foreground">{event}</p></div>;
}

export function ContextCardsDemo() {
  const [selected, setSelected] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [event, setEvent] = useState("Context is supplied by the host.");
  return <div className="w-full space-y-3" data-testid="context-cards-demo"><ContextCards chunks={empty ? [] : chunks.map(chunk => ({ ...chunk, selected }))} onSelectionChange={(_, next) => setSelected(next)} onSourceOpen={chunk => setEvent(`Host opened ${chunk.source}`)} /><Button variant="ghost" size="sm" onClick={() => setEmpty(value => !value)}>{empty ? "Restore context" : "Show empty context"}</Button><p role="status" className="text-xs text-muted-foreground">{event}</p></div>;
}

export function SelectionActionsDemo() {
  const [state, setState] = useState<SelectionActionsState>("idle");
  const [emptyResult, setEmptyResult] = useState(false);
  const [event, setEvent] = useState("The original passage remains until the host accepts a result.");
  return <div className="w-full space-y-3" data-testid="selection-actions-demo"><SelectionActions lead="Integration note: " selectedText="Use the library controls directly rather than rebuilding each control." resultText={emptyResult ? "" : "Import and compose YunUI's public components."} state={state} onAction={(action, instruction) => setEvent(`Host request: ${action}${instruction ? ` — ${instruction}` : ""}`)} onAccept={result => setEvent(`Host accepted: ${result}`)} onDismiss={() => { setState("idle"); setEvent("Host dismissed the edit; original text retained."); }} /><label className="flex items-center gap-2 text-xs">Host edit state<select aria-label="Host edit state" value={state} onChange={e => { setEmptyResult(false); setState(e.target.value as SelectionActionsState); }} className="rounded-md border border-border bg-background p-1">{["idle", "busy", "result", "error", "cancelled"].map(value => <option key={value}>{value}</option>)}</select></label><Button variant="ghost" size="sm" onClick={() => { setEmptyResult(true); setState("result"); }}>Preview deletion</Button><p role="status" className="text-xs text-muted-foreground">{event}</p></div>;
}

export function DiffTableDemo() {
  const [selected, setSelected] = useState<readonly string[]>(["replace", "reuse"]);
  const [state, setState] = useState<DiffTableState>("idle");
  const [event, setEvent] = useState("No changes have been applied.");
  return <div className="w-full space-y-3" data-testid="diff-table-demo"><DiffTable rows={rows} selectedIds={selected} onSelectionChange={setSelected} state={state} onApply={ids => setEvent(`Host apply requested: ${ids.join(", ")}; waiting for a real result.`)} onReject={ids => setEvent(`Host rejection requested: ${ids.join(", ")}`)} /><label className="flex items-center gap-2 text-xs">Host apply state<select aria-label="Host apply state" value={state} onChange={e => setState(e.target.value as DiffTableState)} className="rounded-md border border-border bg-background p-1">{["idle", "busy", "applied", "error", "cancelled", "disabled"].map(value => <option key={value}>{value}</option>)}</select></label><p role="status" className="text-xs text-muted-foreground">{event}</p></div>;
}

/** Real public units inside the answer; diagnostics stay outside the message. */
export function ConversationUnitsDemo({ onHostEvent }: { onHostEvent?: (message: string) => void }) {
  const [included, setIncluded] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>(["replace", "reuse"]);
  const [editState, setEditState] = useState<SelectionActionsState>("idle");
  const [applyState, setApplyState] = useState<DiffTableState>("idle");

  return (
    <div className="space-y-5" data-testid="conversation-units-demo">
      <StreamingText
        content={content}
        sources={sources}
        followUps={["Show the integration guide", "Review the API changes"]}
        onAction={action => onHostEvent?.(`Host answer action requested: ${action}.`)}
        onFollowUp={text => onHostEvent?.(`Host follow-up requested: ${text}.`)}
      />
      <ContextCards
        chunks={chunks.map(chunk => ({ ...chunk, selected: included }))}
        onSelectionChange={(_, next) => setIncluded(next)}
        onSourceOpen={chunk => onHostEvent?.(`Host source-open request: ${chunk.source}.`)}
      />
      <SelectionActions
        lead="Integration note: "
        selectedText="Use the library controls directly rather than rebuilding each control."
        state={editState}
        onAction={(action, instruction) => {
          setEditState("busy");
          onHostEvent?.(`Host edit requested: ${action}${instruction ? ` — ${instruction}` : ""}. No generated result was supplied.`);
        }}
        onDismiss={() => setEditState("idle")}
      />
      <DiffTable
        rows={rows}
        selectedIds={selected}
        onSelectionChange={setSelected}
        state={applyState}
        onApply={ids => {
          setApplyState("busy");
          onHostEvent?.(`Host apply requested: ${ids.join(", ")}. No changes have been persisted.`);
        }}
        onReject={ids => {
          setApplyState("cancelled");
          onHostEvent?.(`Host rejected proposed changes: ${ids.join(", ")}.`);
        }}
      />
    </div>
  );
}
