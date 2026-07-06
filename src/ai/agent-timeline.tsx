"use client";

import { useState, type ReactNode } from "react";
import {
    Brain, Terminal, Search, Globe, Image as ImageIcon, FileText, Wrench,
    ChevronDown, Check, Loader2, ShieldAlert,
} from "lucide-react";
import { cn } from "../lib/cn";

/**
 * AgentTimeline — an agent turn rendered as an ordered, inline sequence of typed
 * blocks (reasoning / tool call+result / assistant text / approval) in YunUI's
 * neutral .card language. Replaces the result-on-top / steps-panel-below split:
 * the answer is a `text` block among the tool and reasoning blocks, in order.
 * Purely presentational, prop-driven and copy-free — the consumer maps its own
 * records onto {@link AgentTimelineBlock}, localizes every label, and supplies a
 * markdown renderer.
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

function Disclosure({ text, renderContent }: { text: string; renderContent?: (t: string) => ReactNode }) {
    return (
        <div className="mt-1 pl-[34px] pr-1 text-[12.5px] leading-relaxed text-muted-foreground">
            {renderContent ? renderContent(text) : <div className="whitespace-pre-wrap">{text}</div>}
        </div>
    );
}

function ReasoningRow({ block, renderContent }: { block: Extract<AgentTimelineBlock, { kind: "reasoning" }>; renderContent?: (t: string) => ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Brain size={13} strokeWidth={1.5} />
                </span>
                <span className="flex-1 truncate text-[13px] text-muted-foreground">{block.label}</span>
                <ChevronDown size={14} className={cn("shrink-0 text-muted-foreground/50 transition-transform", open && "rotate-180")} />
            </button>
            {open && <Disclosure text={block.content} renderContent={renderContent} />}
        </div>
    );
}

function ToolRow({ block }: { block: Extract<AgentTimelineBlock, { kind: "tool" }> }) {
    const [open, setOpen] = useState(false);
    const Icon = ICONS[block.icon ?? "tool"];
    const error = block.status === "error";
    const expandable = !!block.output || !!block.command;
    return (
        <div>
            <button
                type="button"
                onClick={() => expandable && setOpen(!open)}
                aria-expanded={open}
                className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    expandable && "hover:bg-muted/40",
                )}
            >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    {block.status === "running" ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} strokeWidth={1.5} />}
                </span>
                <span className="shrink-0 text-[13px] font-medium text-foreground">{block.verb}</span>
                {block.summary && <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted-foreground">{block.summary}</span>}
                <span className={cn("flex shrink-0 items-center gap-2", !block.summary && "ml-auto")}>
                    {block.status === "done" && <Check size={14} className="text-emerald-500" />}
                    {error && <span className="font-mono text-[11px] font-semibold text-red-600 dark:text-red-400">error</span>}
                    {expandable && <ChevronDown size={14} className={cn("text-muted-foreground/50 transition-transform", open && "rotate-180")} />}
                </span>
            </button>
            {open && expandable && (
                <div className="mt-1 pl-[34px] pr-1">
                    <div className={cn("overflow-hidden rounded-xl border font-mono text-xs", error ? "border-red-500/20 bg-red-500/5" : "border-border/60 bg-muted/50")}>
                        {block.command && (
                            <div className={cn("border-b px-3 py-1.5 text-muted-foreground", error ? "border-red-500/20" : "border-border/50")}>
                                <span className="mr-1.5 select-none text-muted-foreground/50">$</span>{block.command}
                            </div>
                        )}
                        <div className={cn("max-h-64 overflow-auto whitespace-pre-wrap break-words px-3 py-2 leading-relaxed", error ? "text-red-600 dark:text-red-400" : "text-foreground/85")}>
                            {block.output || "—"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ApprovalCard({ block, onApprove, onReject }: { block: Extract<AgentTimelineBlock, { kind: "approval" }>; onApprove?: (id: string) => void; onReject?: (id: string) => void }) {
    return (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                <ShieldAlert size={15} className="text-amber-500" />
                <span>{block.title}</span>
                <span className="font-mono text-xs text-muted-foreground">{block.verb}</span>
            </div>
            {block.message && <p className="mt-1.5 pl-[23px] text-[12.5px] text-muted-foreground">{block.message}</p>}
            {block.argsText && (
                <pre className="mt-1.5 ml-[23px] max-h-40 overflow-auto rounded-lg border border-border/60 bg-muted/50 px-3 py-2 font-mono text-[11.5px] text-muted-foreground">{block.argsText}</pre>
            )}
            <div className="mt-2 flex items-center gap-2 pl-[23px]">
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
    );
}

export function AgentTimeline({ blocks, renderContent, onApprove, onReject, className }: AgentTimelineProps) {
    if (!blocks.length) return null;
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {blocks.map((b) => {
                switch (b.kind) {
                    case "reasoning":
                        return b.content.trim() ? <ReasoningRow key={b.id} block={b} renderContent={renderContent} /> : null;
                    case "tool":
                        return <ToolRow key={b.id} block={b} />;
                    case "approval":
                        return <ApprovalCard key={b.id} block={b} onApprove={onApprove} onReject={onReject} />;
                    case "text":
                        return (
                            <div key={b.id} className="px-1 text-[13.5px] leading-relaxed text-foreground">
                                {renderContent ? renderContent(b.content) : <div className="whitespace-pre-wrap">{b.content}</div>}
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}
