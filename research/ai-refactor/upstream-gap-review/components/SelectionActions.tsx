"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Check, ChevronRight, CircleHelp, Scissors, Sparkles, ThumbsUp, X, RefreshCw, Type } from "lucide-react";
import { Button } from "./Button";

/* Adapted from reference/beautiful-ui/components/primitives/SelectionActions.tsx
 * MIT, commit 44a274e598395ab61e7c96c26fda2758780253b7.
 * Retains passage anchor and floating pill geometry. The host supplies the
 * selection/result/phase; timers and demo rewrite state are intentionally removed. */
export type SelectionAction = { id: string; icon: ReactNode; action: string; busyLabel?: string };
export type SelectionActionsState = "idle" | "busy" | "result" | "error" | "cancelled";
export type SelectionActionsLabels = { keep: string; discard: string; placeholder: string; error: string; cancelled: string };
const DEFAULT_LABELS: SelectionActionsLabels = { keep: "Keep", discard: "Discard", placeholder: "Describe edits", error: "The edit request failed. Original text is unchanged.", cancelled: "Edit request cancelled. Original text is unchanged." };
const iconProps = { size: 14, strokeWidth: 1.8, "aria-hidden": true as const };
const DEFAULT_ACTIONS: SelectionAction[] = [
  { id: "Explain", icon: <CircleHelp {...iconProps}/>, action: "Explain" },
  { id: "Improve", icon: <Sparkles {...iconProps}/>, action: "Improve", busyLabel: "Improving" },
  { id: "Shorten", icon: <Scissors {...iconProps}/>, action: "Shorten", busyLabel: "Shortening" },
  { id: "Tone", icon: <ThumbsUp {...iconProps}/>, action: "Change tone", busyLabel: "Changing tone" },
  { id: "Grammar", icon: <Type {...iconProps}/>, action: "Fix grammar" },
];
const primary = "inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 text-[12.5px] font-normal text-canvas shadow-hairline transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.96]";

export default function SelectionActions({
  lead = "The selected passage reads: ", selectedText, resultText, state = "idle", actions = DEFAULT_ACTIONS, labels,
  onAction, onAccept, onDismiss,
}: {
  lead?: string; selectedText: string; resultText?: string; state?: SelectionActionsState;
  actions?: SelectionAction[]; labels?: Partial<SelectionActionsLabels>;
  onAction?: (action: string, instruction?: string) => void; onAccept?: (result: string) => void; onDismiss?: () => void;
}) {
  const copy = { ...DEFAULT_LABELS, ...labels };
  const [prompt, setPrompt] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [positioned, setPositioned] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const place = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const host = hostRef.current; const selection = selectionRef.current;
      if (!host || !selection) return;
      const bounds = selection.getBoundingClientRect();
      const lines = Array.from(selection.getClientRects()); const lastLine = lines.at(-1);
      if (!lastLine) return;
      const hostBounds = host.getBoundingClientRect();
      const next = { x: Math.round(bounds.left - hostBounds.left + bounds.width / 2), y: Math.round(lastLine.bottom - hostBounds.top + 8) };
      setAnchor((current) => current.x === next.x && current.y === next.y ? current : next);
      setPositioned(true);
    });
  }, []);
  useLayoutEffect(() => { place(); }, [place, selectedText, resultText, state]);
  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const observer = new ResizeObserver(place); observer.observe(host); window.addEventListener("resize", place);
    return () => { observer.disconnect(); window.removeEventListener("resize", place); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); };
  }, [place]);
  const busy = state === "busy";
  const hasResult = state === "result" && typeof resultText === "string";
  const run = (action: string, instruction?: string) => { setActiveAction(action); setExpanded(false); onAction?.(action, instruction); };
  const visibleText = hasResult ? resultText! : selectedText;
  const busyLabel = actions.find((item) => item.action === activeAction)?.busyLabel ?? "Editing";
  return <div className="w-full max-w-[460px]">
    <div ref={hostRef} className="relative pb-12">
      <p className="text-[13px] leading-relaxed text-ink">{lead}<span ref={selectionRef} className="box-decoration-clone rounded-[3px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-ink dark:bg-accent-subtle">{visibleText}</span></p>
      <div className="absolute top-0 left-0 z-10" style={{ transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`, transition: "transform 320ms cubic-bezier(0.77,0,0.175,1), opacity 180ms ease-out", opacity: positioned ? 1 : 0, pointerEvents: positioned ? "auto" : "none", willChange: "transform" }}>
        <div className="flex h-9 w-fit max-w-[calc(100vw-48px)] items-center justify-center gap-0.5 overflow-hidden rounded-full bg-surface p-1 font-sans font-normal text-ink shadow-overlay">
          {busy && <span role="status" className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-normal text-ink-2"><span aria-hidden="true" className="size-3 shrink-0 rounded-full border-[1.5px] border-line-strong border-t-ink-2 motion-safe:animate-spin"/>{busyLabel}…</span>}
          {hasResult && <><button type="button" disabled={!onAccept} onClick={() => onAccept?.(resultText!)} className={primary}><Check {...iconProps}/>{copy.keep}</button><Button type="button" variant="quiet" size="xs" className="shrink-0" disabled={!onDismiss} onClick={onDismiss}><X {...iconProps}/>{copy.discard}</Button><span className="mx-0.5 h-4 w-px shrink-0 bg-line"/><button type="button" aria-label="Try again" onClick={() => run("Retry")} disabled={!onAction} className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-hover-2 hover:text-ink-2"><RefreshCw {...iconProps}/></button></>}
          {(state === "error" || state === "cancelled") && <><span role="status" className="max-w-44 px-2 text-[11px] text-ink-2">{state === "error" ? copy.error : copy.cancelled}</span><Button type="button" variant="quiet" size="xs" disabled={!onDismiss} onClick={onDismiss}>{copy.discard}</Button></>}
          {state === "idle" && <>
            <div className="flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-400" style={{ maxWidth: expanded ? 0 : 145, opacity: expanded ? 0 : 1, transform: expanded ? "translateX(-8px)" : "translateX(0)", transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}>
              <form className="selection-edit-prompt flex h-7 w-[145px] min-w-0 shrink-0 items-center max-[420px]:w-[94px]" onSubmit={(event) => { event.preventDefault(); run("Custom instruction", prompt.trim()); }}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label={copy.placeholder} placeholder={copy.placeholder} className="h-7 w-full min-w-0 bg-transparent pr-2.5 pl-3 text-[12.5px] text-ink placeholder:text-ink-3 max-[420px]:pr-0 max-[420px]:pl-2"/><button type="submit" aria-label="Submit custom instruction" disabled={!prompt.trim() || !onAction} className="mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-ink hover:bg-hover disabled:opacity-40"><ArrowUp size={13}/></button></form>
            </div>
            <div className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,transform] duration-400" style={{ maxWidth: expanded ? 400 : 224, transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}>
              <span className="mx-1 h-4 w-px shrink-0 bg-line-strong"/>{actions.slice(0,2).map((item) => <Button key={item.id} type="button" variant="quiet" size="xs" className="shrink-0" disabled={!onAction} onClick={() => run(item.action)}>{item.icon}{item.id}</Button>)}
              <div aria-hidden={!expanded} className={`${expanded ? "flex" : "hidden"} min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,margin] duration-400`} style={{ maxWidth: expanded ? 262 : 0, opacity: expanded ? 1 : 0, marginLeft: expanded ? 2 : 0 }}>{actions.slice(2).map((item) => <Button key={item.id} type="button" variant="quiet" size="xs" className="shrink-0" tabIndex={expanded ? 0 : -1} disabled={!onAction} onClick={() => run(item.action)}>{item.icon}{item.id}</Button>)}</div>
              <span className="mx-0.5 h-4 w-px shrink-0 bg-line"/><button type="button" aria-label={expanded ? "Show fewer actions" : "Show more actions"} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink transition-[background-color,transform] duration-200 hover:bg-hover"><ChevronRight size={14} style={{ transform: expanded ? "rotate(180deg)" : undefined }}/></button>
            </div>
          </>}
        </div>
      </div>
    </div>
  </div>;
}
