"use client";

import { useState, type ReactNode } from "react";
import {
    Brain, Terminal, Search, Globe, Image as ImageIcon, FileText, Wrench,
    ChevronDown, Check, Loader2, ShieldAlert, Sparkles,
} from "lucide-react";
import { cn } from "../lib/cn";

/**
 * AgentTimeline — an agent turn rendered as an ordered, inline sequence of typed
 * blocks (reasoning / tool call+result / assistant text / approval) drawn as a
 * connected vertical timeline: a node per step, a rail linking them, and smooth
 * height-animated disclosures. Purely presentational, prop-driven and copy-free
 * — the consumer maps its own records onto {@link AgentTimelineBlock}, localizes
 * every label, and supplies a markdown renderer.
 */

export type AgentTimelineIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";
export type AgentTimelineToolStatus = "running" | "done" | "error";

export type AgentTimelineBlock =
    | { kind: "reasoning"; id: string; label: string; content: string }
    | { kind: "text"; id: string; content: string }
    | {
          kind: "tool"; id: string; verb: string; summary?: string
          status: AgentTimelineToolStatus; icon?: AgentTimelineIconName
          command?: string; output?: string
      }
    | {
          kind: "approval"; id: string; title: string; verb: string; message?: string
          argsText?: string; allowLabel: string; denyLabel: string
          decision?: "approved" | "rejected"; decidedLabel?: string
      };

export interface AgentTimelineProps {
    blocks: AgentTimelineBlock[];
    /** Render reasoning/answer text (e.g. markdown). Plain text by default. */
    renderContent?: (text: string) => ReactNode;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    className?: string;
}

const ICONS: Record<AgentTimelineIconName, typeof Terminal> = {
    terminal: Terminal, search: Search, globe: Globe, image: ImageIcon, file: FileText, tool: Wrench,
};

type NodeTone = "muted" | "running" | "error" | "answer" | "warn";

/** A timeline node (the dot on the rail) + the connector line down to the next row. */
function Rail({ children, tone = "muted", isLast }: { children: ReactNode; tone?: NodeTone; isLast: boolean }) {
    return (
        <div className="flex flex-col items-center self-stretch">
            <span
                className={cn(
                    "relative z-10 mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-background ring-1 transition-colors",
                    tone === "muted" && "text-muted-foreground ring-border",
                    tone === "running" && "text-primary ring-primary/40",
                    tone === "error" && "text-red-500 ring-red-500/40 dark:text-red-400",
                    tone === "warn" && "text-amber-500 ring-amber-500/40",
                    tone === "answer" && "bg-primary text-primary-foreground ring-0",
                )}
            >
                {children}
            </span>
            {!isLast && <span className="my-1 w-0.5 flex-1 rounded-full bg-border" />}
        </div>
    );
}

/** Smoothly height-animated disclosure (grid-rows 0fr→1fr; no JS measurement). */
function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
    return (
        <div
            className={cn(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
        >
            <div className="min-h-0 overflow-hidden">{children}</div>
        </div>
    );
}

function Chevron({ open }: { open: boolean }) {
    return <ChevronDown size={14} className={cn("shrink-0 text-muted-foreground/50 transition-transform duration-200", open && "rotate-180")} />;
}

function ReasoningRow({ block, isLast, renderContent }: { block: Extract<AgentTimelineBlock, { kind: "reasoning" }>; isLast: boolean; renderContent?: (t: string) => ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex gap-2.5">
            <Rail tone="muted" isLast={isLast}><Brain size={13} strokeWidth={1.75} /></Rail>
            <div className="min-w-0 flex-1 pb-2">
                <button
                    type="button" onClick={() => setOpen(!open)} aria-expanded={open}
                    className="flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                    <span className="flex-1 truncate text-[13px] text-muted-foreground">{block.label}</span>
                    <Chevron open={open} />
                </button>
                <Collapse open={open}>
                    <div className="mt-1.5 rounded-lg border-l-2 border-primary/30 bg-muted/40 px-3 py-2 text-[12.5px] leading-relaxed text-muted-foreground">
                        {renderContent ? renderContent(block.content) : <div className="whitespace-pre-wrap">{block.content}</div>}
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

function ToolRow({ block, isLast }: { block: Extract<AgentTimelineBlock, { kind: "tool" }>; isLast: boolean }) {
    const [open, setOpen] = useState(false);
    const Icon = ICONS[block.icon ?? "tool"];
    const error = block.status === "error";
    const expandable = !!block.output || !!block.command;
    const tone: NodeTone = block.status === "running" ? "running" : error ? "error" : "muted";
    return (
        <div className="flex gap-2.5">
            <Rail tone={tone} isLast={isLast}>
                {block.status === "running" ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} strokeWidth={1.75} />}
            </Rail>
            <div className="min-w-0 flex-1 pb-2">
                <button
                    type="button" onClick={() => expandable && setOpen(!open)} aria-expanded={open}
                    className={cn(
                        "flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                        expandable ? "hover:bg-muted/50 cursor-pointer" : "cursor-default",
                    )}
                >
                    <span className="shrink-0 text-[13px] font-medium text-foreground">{block.verb}</span>
                    {block.summary && <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted-foreground">{block.summary}</span>}
                    <span className={cn("flex shrink-0 items-center gap-2", !block.summary && "ml-auto")}>
                        {block.status === "done" && <Check size={14} className="text-emerald-500" />}
                        {error && <span className="rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">error</span>}
                        {expandable && <Chevron open={open} />}
                    </span>
                </button>
                <Collapse open={open}>
                    <div className={cn("mt-1.5 overflow-hidden rounded-xl border font-mono text-xs shadow-sm", error ? "border-red-500/20 bg-red-500/5" : "border-border/60 bg-muted/40")}>
                        {block.command && (
                            <div className={cn("flex items-center gap-1.5 border-b px-3 py-1.5 text-muted-foreground", error ? "border-red-500/20" : "border-border/50")}>
                                <span className="select-none text-muted-foreground/40">$</span>
                                <span className="truncate">{block.command}</span>
                            </div>
                        )}
                        <div className={cn("max-h-72 overflow-auto whitespace-pre-wrap break-words px-3 py-2.5 leading-relaxed", error ? "text-red-600 dark:text-red-400" : "text-foreground/85")}>
                            {block.output || "—"}
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

function ApprovalRow({ block, isLast, onApprove, onReject }: { block: Extract<AgentTimelineBlock, { kind: "approval" }>; isLast: boolean; onApprove?: (id: string) => void; onReject?: (id: string) => void }) {
    return (
        <div className="flex gap-2.5">
            <Rail tone="warn" isLast={isLast}><ShieldAlert size={13} strokeWidth={1.75} /></Rail>
            <div className="min-w-0 flex-1 pb-2">
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                        <span>{block.title}</span>
                        <span className="font-mono text-xs text-muted-foreground">{block.verb}</span>
                    </div>
                    {block.message && <p className="mt-1.5 text-[12.5px] text-muted-foreground">{block.message}</p>}
                    {block.argsText && (
                        <pre className="mt-1.5 max-h-40 overflow-auto rounded-lg border border-border/60 bg-muted/50 px-3 py-2 font-mono text-[11.5px] text-muted-foreground">{block.argsText}</pre>
                    )}
                    <div className="mt-2.5 flex items-center gap-2">
                        {block.decision ? (
                            <span className={cn("text-xs font-medium", block.decision === "approved" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                {block.decidedLabel}
                            </span>
                        ) : (
                            <>
                                <button type="button" onClick={() => onApprove?.(block.id)} className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                                    {block.allowLabel}
                                </button>
                                <button type="button" onClick={() => onReject?.(block.id)} className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                                    {block.denyLabel}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TextRow({ block, isLast, renderContent }: { block: Extract<AgentTimelineBlock, { kind: "text" }>; isLast: boolean; renderContent?: (t: string) => ReactNode }) {
    return (
        <div className="flex gap-2.5">
            <Rail tone="answer" isLast={isLast}><Sparkles size={13} strokeWidth={2} /></Rail>
            <div className="min-w-0 flex-1 pb-1 pt-0.5 text-[13.5px] leading-relaxed text-foreground">
                {renderContent ? renderContent(block.content) : <div className="whitespace-pre-wrap">{block.content}</div>}
            </div>
        </div>
    );
}

export function AgentTimeline({ blocks, renderContent, onApprove, onReject, className }: AgentTimelineProps) {
    // Drop empty reasoning up front so rail connectors (isLast) are accurate.
    const visible = blocks.filter((b) => !(b.kind === "reasoning" && !b.content.trim()));
    if (!visible.length) return null;
    return (
        <div className={cn("flex flex-col", className)}>
            {visible.map((b, i) => {
                const isLast = i === visible.length - 1;
                switch (b.kind) {
                    case "reasoning":
                        return <ReasoningRow key={b.id} block={b} isLast={isLast} renderContent={renderContent} />;
                    case "tool":
                        return <ToolRow key={b.id} block={b} isLast={isLast} />;
                    case "approval":
                        return <ApprovalRow key={b.id} block={b} isLast={isLast} onApprove={onApprove} onReject={onReject} />;
                    case "text":
                        return <TextRow key={b.id} block={b} isLast={isLast} renderContent={renderContent} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
