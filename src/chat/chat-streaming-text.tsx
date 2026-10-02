"use client";

import * as React from "react";
import { useId, useState } from "react";
import { cn } from "../lib/cn";
import { mergeLabels } from "../lib/merge-labels";
import { useYunUI } from "../adapters/context";
import { encodeChatId, getSafeChatHref, getSafeChatImage } from "./chat-context-cards";

/** A host-supplied piece of answer text. Text is rendered verbatim, including whitespace. */
export interface StreamingToken {
  id?: string;
  text: string;
  /** Render a source chip at this position. Resolve it with `sourceId`. */
  cite?: boolean;
  sourceId?: string;
}

/** A host-supplied citation source. `id` is a stable key referenced by citation tokens. */
export interface StreamingSource {
  id: string;
  name: string;
  domain?: string;
  href?: string;
  image?: string;
}

export type StreamingAction = "copy" | "retry" | "positive" | "negative";
export type StreamingTextState = "streaming" | "complete" | "error" | "cancelled" | "empty";

export interface StreamingTextLabels {
  sources?: string;
  followUps?: string;
  actions?: string;
  copyAnswer?: string;
  retryAnswer?: string;
  positiveFeedback?: string;
  negativeFeedback?: string;
  streaming?: string;
  error?: string;
  cancelled?: string;
  empty?: string;
}

export interface StreamingTextProps {
  /** Exact host-provided token sequence. YunUI does not insert or normalize whitespace. */
  content: readonly StreamingToken[];
  sources?: readonly StreamingSource[];
  followUps?: readonly string[];
  state?: StreamingTextState;
  /** Optional host-controlled prefix length while streaming. */
  visibleCount?: number;
  /** Controlled source disclosure. Without `onSourcesOpenChange`, it is read-only. */
  sourcesOpen?: boolean;
  defaultSourcesOpen?: boolean;
  onSourcesOpenChange?: (open: boolean) => void;
  labels?: StreamingTextLabels;
  onAction?: (action: StreamingAction) => void;
  onFollowUp?: (text: string, index: number) => void;
  className?: string;
}

const DEFAULT_LABELS: Required<StreamingTextLabels> = {
  sources: "sources",
  followUps: "Follow-ups",
  actions: "Answer actions",
  copyAnswer: "Copy answer",
  retryAnswer: "Retry answer",
  positiveFeedback: "Helpful",
  negativeFeedback: "Not helpful",
  streaming: "Answer is streaming",
  error: "This answer could not be completed.",
  cancelled: "Generation cancelled.",
  empty: "No answer was returned.",
};

const ACTIONS: ReadonlyArray<{ action: StreamingAction; label: keyof StreamingTextLabels; path: React.ReactNode }> = [
  { action: "copy", label: "copyAnswer", path: <><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></> },
  { action: "retry", label: "retryAnswer", path: <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/> },
  { action: "positive", label: "positiveFeedback", path: <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z"/> },
  { action: "negative", label: "negativeFeedback", path: <path d="M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z"/> },
];

/**
 * Host-controlled adaptation of Beautiful UI's `StreamingText` primitive
 * (`reference/beautiful-ui/components/primitives/StreamingText.tsx`, MIT,
 * commit 44a274e598395ab61e7c96c26fda2758780253b7). It retains the source
 * citation, action, source-list and follow-up layout; the host owns content,
 * state, source identities and every action callback. It has no timers.
 */
export function StreamingText({
  content,
  sources = [],
  followUps = [],
  state = "complete",
  visibleCount,
  sourcesOpen,
  defaultSourcesOpen = false,
  onSourcesOpenChange,
  labels,
  onAction,
  onFollowUp,
  className,
}: StreamingTextProps) {
  const baseId = useId();
  const sourceToggleId = `${baseId}-sources-toggle`;
  const { Image, Link } = useYunUI();
  const sourceListId = `${baseId}-sources`;
  const [internalSourcesOpen, setInternalSourcesOpen] = useState(defaultSourcesOpen);
  const sourceUnit = labels?.sources ?? (sources.length === 1 ? "source" : "sources");
  const label = mergeLabels(DEFAULT_LABELS, { ...labels, sources: sourceUnit });
  const controlledOpen = sourcesOpen !== undefined;
  const isSourcesOpen = controlledOpen ? sourcesOpen : internalSourcesOpen;
  const canChangeSourcesOpen = !controlledOpen || Boolean(onSourcesOpenChange);
  const isComplete = state === "complete";
  const count = state === "error" || state === "cancelled"
    ? content.length
    : Math.max(0, Math.min(Number.isFinite(visibleCount) ? Math.floor(visibleCount!) : content.length, content.length));
  const visibleContent = content.slice(0, count);
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const hasSourceDisclosure = isComplete && sources.length > 0;
  const showSourceList = hasSourceDisclosure && isSourcesOpen;

  const setSourcesOpen = (next: boolean) => {
    if (!canChangeSourcesOpen) return;
    if (!controlledOpen) setInternalSourcesOpen(next);
    onSourcesOpenChange?.(next);
  };

  const stateMessage = state === "error" ? label.error : state === "cancelled" ? label.cancelled : undefined;
  const isEmpty = state === "empty" && visibleContent.length === 0;

  return (
    <div data-yunui="streaming-text" data-state={state} className={cn("w-full", className)}>
      {isEmpty ? <p role="status" className="text-[13px] leading-relaxed text-muted-foreground">{label.empty}</p> : (
        <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
          {visibleContent.map((token, index) => {
            if (token.cite || token.sourceId) {
              const source = token.sourceId ? sourceById.get(token.sourceId) : undefined;
              const tokenKey = token.id ? `${baseId}-token-id-${encodeChatId(token.id)}` : `${baseId}-token-index-${index}`;
              if (!source) return token.text ? <span key={tokenKey}>{token.text}</span> : null;
              const safeHref = getSafeChatHref(source.href);
              const sourceLabel = source.domain || source.name;
              const chip = <><SourceImage Image={Image} source={source}/><span>{sourceLabel}</span></>;
              const citationContent = <>{token.text ? <span>{token.text}</span> : null}{chip}</>;
              return safeHref ? (
                <Link key={tokenKey} href={safeHref.href} target={safeHref.external ? "_blank" : undefined} rel={safeHref.external ? "noopener noreferrer" : undefined} aria-label={`${source.name} (${sourceLabel})`} className="mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-border bg-muted/60 px-1 align-middle font-mono text-[10.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{citationContent}</Link>
              ) : (
                <span key={tokenKey} className="mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-border bg-muted/60 px-1 align-middle font-mono text-[10.5px] text-muted-foreground">{token.text ? <span>{token.text}</span> : null}<SourceImage Image={Image} source={source}/><span className="sr-only">{source.name}</span><span>{sourceLabel}</span></span>
              );
            }
            return <React.Fragment key={token.id ? `${baseId}-token-id-${encodeChatId(token.id)}` : `${baseId}-token-index-${index}`}>{token.text}</React.Fragment>;
          })}
          {state === "streaming" ? <span role="status" className="sr-only">{label.streaming}</span> : null}
          {state === "streaming" ? <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 rounded-full bg-foreground motion-safe:animate-pulse motion-reduce:animate-none" /> : null}
        </p>
      )}
      {stateMessage ? <p role="status" className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{stateMessage}</p> : null}

      {isComplete ? (
        <>
          <div className="mt-2 flex items-center gap-0.5" role="group" aria-label={label.actions}>
            {ACTIONS.map(({ action, label: labelKey, path }) => (
              <button key={action} type="button" aria-label={label[labelKey] as string} disabled={!onAction} onClick={() => onAction?.(action)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
              </button>
            ))}
            {hasSourceDisclosure ? (
              <button id={sourceToggleId} type="button" aria-expanded={isSourcesOpen} aria-controls={sourceListId} aria-label={`${sources.length} ${label.sources}`} disabled={!canChangeSourcesOpen} onClick={() => setSourcesOpen(!isSourcesOpen)} className="ml-1 flex min-h-7 items-center gap-1.5 rounded-md px-1.5 text-left text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <span className="flex -space-x-1">{sources.map((source) => <SourceImage key={source.id} Image={Image} source={source} compact/>)}</span>
                <span>{sources.length} {label.sources}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("transition-transform", isSourcesOpen && "rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
              </button>
            ) : null}
          </div>

          {hasSourceDisclosure ? (
            <div id={sourceListId} role="region" aria-labelledby={sourceToggleId} aria-hidden={!showSourceList} inert={!showSourceList} className="grid transition-[grid-template-rows,opacity] duration-300" style={{ gridTemplateRows: showSourceList ? "1fr" : "0fr", opacity: showSourceList ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}>
              <div className="overflow-hidden"><div className="mt-1.5 flex flex-col rounded-lg border border-border bg-muted/40 p-1">
                {sources.map((source) => {
                  const safeHref = getSafeChatHref(source.href);
                  const row = <><SourceImage Image={Image} source={source}/><span className="min-w-0 truncate">{source.name}</span><span className="ml-auto min-w-0 truncate font-mono text-[10.5px] text-muted-foreground">{source.domain}</span></>;
                  return safeHref ? <Link key={source.id} href={safeHref.href} target={safeHref.external ? "_blank" : undefined} rel={safeHref.external ? "noopener noreferrer" : undefined} className="flex min-h-8 items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{row}</Link> : <div key={source.id} className="flex min-h-8 items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground">{row}</div>;
                })}
              </div></div>
            </div>
          ) : null}

          {followUps.length > 0 ? (
            <div className="mt-2.5">
              <p className="text-[12px] font-medium text-muted-foreground">{label.followUps}</p>
              <div className="mt-0.5 flex flex-col">
                {followUps.map((text, index) => <button key={`${baseId}-follow-up-${index}`} type="button" disabled={!onFollowUp} onClick={() => onFollowUp?.(text, index)} className="-mx-1.5 flex min-h-8 items-center gap-2 rounded-md border-b border-border px-1.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground" aria-hidden="true"><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>{text}</button>)}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function SourceImage({ Image, source, compact = false }: { Image: ReturnType<typeof useYunUI>["Image"]; source: StreamingSource; compact?: boolean }) {
  const [failedImage, setFailedImage] = useState<string>();
  const image = getSafeChatImage(source.image);
  const className = cn("shrink-0 rounded-[4px] bg-muted", compact ? "size-4 rounded-full" : "size-4");
  const size = compact ? 14 : 16;
  return image && failedImage !== image ? <Image src={image} alt="" width={size} height={size} className={cn("source-avatar", className)} onError={() => setFailedImage(image)} /> : <span aria-hidden="true" className={cn("inline-flex items-center justify-center font-medium text-muted-foreground", className, compact ? "text-[7px]" : "text-[9px]")}>{(Array.from(source.name.trim())[0] ?? "").toUpperCase()}</span>;
}
