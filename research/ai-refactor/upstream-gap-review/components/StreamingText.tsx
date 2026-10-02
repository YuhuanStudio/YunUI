"use client";

import { useState } from "react";

/* Adapted from reference/beautiful-ui/components/primitives/StreamingText.tsx
 * MIT, commit 44a274e598395ab61e7c96c26fda2758780253b7.
 * Preserve upstream JSX/geometry; host owns stream state and all callbacks. */
export type StreamingToken = { text: string; cite?: boolean };
export type StreamingSource = { name: string; domain: string; href: string; image?: string };
export type StreamingLabels = { sources: string; followUps: string; error: string; empty: string };
const DEFAULT_LABELS: StreamingLabels = { sources: "Sources", followUps: "Follow-ups", error: "This answer could not be completed.", empty: "No answer was returned." };
const ACTION_ICONS: React.ReactNode[] = [
  <g key="copy"><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></g>,
  <path key="retry" d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />,
  <path key="up" d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />,
  <path key="down" d="M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z" />,
];

export default function StreamingText({ content, sources = [], followUps = [], labels, state = "complete", visibleCount, onAction, onFollowUp }: {
  content: StreamingToken[]; sources?: StreamingSource[]; followUps?: string[]; labels?: Partial<StreamingLabels>;
  state?: "streaming" | "complete" | "error" | "cancelled" | "empty"; visibleCount?: number;
  onAction?: (action: "copy" | "retry" | "positive" | "negative") => void;
  onFollowUp?: (text: string, index: number) => void;
}) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const count = Math.max(0, Math.min(visibleCount ?? content.length, content.length));
  const done = state === "complete";
  const visible = content.slice(0, count);
  return (
    <div className="w-full">
      {state === "error" || state === "cancelled" || state === "empty" ? <p role="status" className="text-[13px] leading-relaxed text-ink-2">{state === "error" ? l.error : state === "cancelled" ? "Generation cancelled." : l.empty}</p> : (
        <p className="text-[13px] leading-relaxed text-ink">{visible.map((token, i) => token.cite ? (
          <a key={i} href={sources[0]?.href ?? "#streaming-source-list"} className="ml-0 mr-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-[5px] bg-inset px-[3px] align-middle font-mono text-[10.5px] text-ink-2 shadow-hairline transition-colors duration-150 hover:bg-hover hover:text-ink">{sources[0]?.image ? <img src={sources[0].image} alt="" className="source-avatar size-3 rounded-[3px]" /> : null}<span>{sources[0]?.domain ?? "source"}</span></a>
        ) : <span key={i} className="inline">{token.text} </span>)}{!done && <span aria-label="Answer is streaming" className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 rounded-full bg-ink" />}</p>
      )}
      <div className="mt-2 flex items-center gap-0.5 transition-opacity duration-400" style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }} aria-hidden={!done}>
        {ACTION_ICONS.map((icon, i) => { const action = (["copy", "retry", "positive", "negative"] as const)[i]; return <button key={i} type="button" aria-label={["Copy answer", "Retry answer", "Helpful", "Not helpful"][i]} onClick={() => onAction?.(action)} disabled={!done} className="flex size-6 items-center justify-center rounded-[6px] text-ink-3 transition-colors duration-100 hover:bg-hover-2 hover:text-ink-2"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg></button>; })}
        <button id="sources-toggle" type="button" aria-expanded={sourcesOpen} aria-controls="streaming-source-list" disabled={!done || sources.length === 0} onClick={() => setSourcesOpen((current) => !current)} className="ml-1.5 flex items-center gap-1.5 rounded-[6px] px-1 py-0.5 text-left transition-colors duration-150 hover:bg-hover disabled:opacity-50">
          <span className="flex -space-x-1">{sources.map((source) => source.image ? <img key={source.domain} src={source.image} alt="" className="source-avatar size-3.5 rounded-full bg-surface shadow-[0_0_0_1.5px_var(--canvas)]" /> : <span key={source.domain} aria-hidden="true" className="source-avatar flex size-3.5 items-center justify-center rounded-full bg-inset text-[7px] text-ink-2">{source.name.slice(0,1)}</span>)}</span>
          <span className="text-[12px] text-ink-2">{labels?.sources ?? `${sources.length} ${l.sources.toLowerCase()}`}</span>
        </button>
      </div>
      <div id="streaming-source-list" className="grid transition-[grid-template-rows,opacity] duration-300" style={{ gridTemplateRows: done && sourcesOpen ? "1fr" : "0fr", opacity: done && sourcesOpen ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }} aria-hidden={!done || !sourcesOpen}>
        <div className="overflow-hidden"><div className="mt-1.5 flex flex-col rounded-[10px] bg-inset p-1 shadow-hairline">{sources.map((source) => <a key={source.domain} href={source.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-[6px] px-1.5 py-1 text-[12px] text-ink-2 transition-colors duration-150 hover:bg-hover hover:text-ink">{source.image ? <img src={source.image} alt="" className="source-avatar size-4 rounded-[4px]" /> : null}<span className="animated-underline">{source.name}</span><span className="ml-auto font-mono text-[10.5px] text-ink-3">{source.domain}</span></a>)}</div></div>
      </div>
      <div className="mt-2.5 transition-opacity duration-400" style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }} aria-hidden={!done}><p className="text-[12px] font-medium text-ink-2">{l.followUps}</p><div className="mt-0.5 flex flex-col">{followUps.map((text, i) => <button key={`${text}-${i}`} type="button" disabled={!done} onClick={() => onFollowUp?.(text, i)} className="-mx-1.5 flex items-center gap-2 rounded-[7px] border-b border-line px-1.5 py-1.5 text-left text-[12.5px] text-ink transition-colors duration-100 hover:bg-hover-2"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>{text}</button>)}</div></div>
    </div>
  );
}
