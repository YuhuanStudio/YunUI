"use client";

import { useId, useState, type ReactNode } from "react";
import {
    Check, ChevronDown, CircleAlert, Clock3, FileText, Globe,
    Image as ImageIcon, Loader2, Pencil, Search, Sparkles, Terminal, Wrench, X,
} from "lucide-react";
import { Badge, Button } from "../primitives";
import { cn } from "../lib/cn";
import { TextShimmer } from "../primitives/text-shimmer";

/**
 * AgentTimeline — host-fed activity, tool and task rows. The compact summary,
 * disclosure, inline detail and diff-chip interactions adapt Beautiful UI's
 * `ToolChips.tsx`, `TaskRows.tsx` and `ThinkingState.tsx` from commit
 * 44a274e598395ab61e7c96c26fda2758780253b7 (MIT). YunUI uses its existing
 * tokens, Badge, TextShimmer and Lucide icons. No demo fixtures or timers are
 * embedded; statuses and partial output come from the host.
 */

/** Kept at the original six icons for compatibility with complete Record maps. */
export type AgentTimelineIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";
/** Additional icon names used only by the additive entry API. */
export type AgentTimelineEntryIconName = AgentTimelineIconName | "think" | "write" | "run" | "read";
/** Kept unchanged for compatibility with existing exhaustive status switches. */
export type AgentTimelineToolStatus = "running" | "done" | "error";
export type AgentTimelineTaskStatus = "pending" | "running" | "done" | "failed" | "cancelled";
export type AgentTimelineDiffTone = "add" | "del" | "context";

export interface AgentTimelineToolDetail {
    id: string;
    text: ReactNode;
    tone?: AgentTimelineDiffTone;
    mono?: boolean;
}

export interface AgentTimelineDiffLine {
    id: string;
    text: string;
    tone: AgentTimelineDiffTone;
}

export interface AgentTimelineFileChange {
    id: string;
    file: string;
    additions: number;
    deletions?: number;
    lines?: readonly AgentTimelineDiffLine[];
}

export interface AgentTimelineTaskDetail {
    id: string;
    label: ReactNode;
    meta?: ReactNode;
}

export type AgentTimelineBlock =
    | {
          kind: "reasoning"; id: string; label: string; content: string
          /** Marks the one current reasoning summary in a live turn. */
          active?: boolean
          /** Opens the disclosure on first render while retaining user control. */
          defaultOpen?: boolean
          /** Controlled row disclosure; pair with `onToggleRow`. */
          open?: boolean
      }
    | {
          kind: "tool"; id: string; verb: string; summary?: string
          status: AgentTimelineToolStatus; icon?: AgentTimelineIconName
          command?: string; output?: string
          /** Host-supplied structured detail lines and file diffs. */
          details?: readonly AgentTimelineToolDetail[]
          files?: readonly AgentTimelineFileChange[]
          indent?: boolean
          defaultOpen?: boolean
          open?: boolean
      }
    | {
          /** A host tool-decision request; distinct from the ApprovalQuestion survey component. */
          kind: "approval"; id: string; title: string; verb: string; message?: string
          argsText?: string; allowLabel: string; denyLabel: string
          decision?: "approved" | "rejected"; decidedLabel?: string
          /** Host-controlled in-flight acknowledgement; does not imply a decision. */
          busy?: boolean
          /** Host may disable the decision controls while retaining the request. */
          disabled?: boolean
      };

/** New task rows are additive; the older AgentTimelineBlock union stays closed. */
export interface AgentTimelineTaskBlock {
    kind: "task";
    id: string;
    label: string;
    amount?: ReactNode;
    status: AgentTimelineTaskStatus;
    step?: number;
    details?: readonly AgentTimelineTaskDetail[];
    defaultOpen?: boolean;
    open?: boolean;
}

/** Broader tool row used only in the additive AgentTimelineEntry API. */
export type AgentTimelineToolEntryBlock = Omit<Extract<AgentTimelineBlock, { kind: "tool" }>, "icon" | "status" | "output"> & {
    icon?: AgentTimelineEntryIconName;
    status: AgentTimelineToolStatus | "cancelled";
    /** Additive rich host output slot; takes precedence over the legacy text output. */
    output?: string;
    outputContent?: ReactNode;
};

/** Use this additive entry when a tool call is explicitly cancelled. */
export type AgentTimelineCancelledToolBlock = Omit<AgentTimelineToolEntryBlock, "status"> & { status: "cancelled" };
export type AgentTimelineEntry = AgentTimelineBlock | AgentTimelineTaskBlock | AgentTimelineToolEntryBlock;

export interface AgentTimelineSummary {
    steps: number;
    reasoning: number;
    tools: number;
    tasks: number;
    approvals: number;
}

export interface AgentTimelineLabels {
    /** Localize the summary from actual block counts; no message count is inferred. */
    summary?: (counts: AgentTimelineSummary) => string;
    stepCount?: (count: number) => string;
    process?: string;
    completed?: string;
    failed?: string;
    cancelled?: string;
    pending?: string;
    running?: string;
    error?: string;
    waitingForHost?: string;
    toolOutput?: (verb: string) => string;
    showDiff?: (file: string) => string;
}

export interface AgentTimelineProps {
    blocks: AgentTimelineEntry[];
    /** Render reasoning text (e.g. with a Markdown renderer). Plain text by default. */
    renderContent?: (text: string) => ReactNode;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    labels?: AgentTimelineLabels;
    /** Controlled run summary. Without onOpenChange it is read-only. */
    open?: boolean;
    /** The global summary starts open to retain the previous visible-row default. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onToggleRow?: (id: string, open: boolean) => void;
    onToggleDiff?: (id: string, open: boolean) => void;
    className?: string;
}

/** Injective, selector-safe encoding: punctuation/Unicode IDs must not alias. */
function domIdPart(value: string) {
    return Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0").join("-") || "empty";
}

const ICONS: Record<AgentTimelineEntryIconName, typeof Terminal> = {
    terminal: Terminal,
    search: Search,
    globe: Globe,
    image: ImageIcon,
    file: FileText,
    tool: Wrench,
    think: Sparkles,
    write: Pencil,
    run: Terminal,
    read: FileText,
};

type OpenProps = {
    id: string;
    open?: boolean;
    defaultOpen?: boolean;
    onToggleRow?: (id: string, open: boolean) => void;
};

function useDisclosure({ id, open: controlledOpen, defaultOpen = false, onToggleRow }: OpenProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const controlled = controlledOpen !== undefined;
    const open = controlled ? controlledOpen : internalOpen;
    const canToggle = !controlled || Boolean(onToggleRow);
    const toggle = () => {
        if (!canToggle) return;
        const next = !open;
        if (!controlled) setInternalOpen(next);
        onToggleRow?.(id, next);
    };
    return { open, canToggle, toggle };
}

/** Grid-based height animation keeps the D4 disclosure geometry and excludes closed content from AT/Tab. */
function Collapse({ open, children, id }: { open: boolean; children: ReactNode; id?: string }) {
    return (
        <div
            id={id}
            aria-hidden={!open}
            inert={!open}
            className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
        >
            <div className="min-h-0 overflow-hidden">{children}</div>
        </div>
    );
}

function statusIcon(status: AgentTimelineToolStatus | AgentTimelineTaskStatus | "cancelled") {
    if (status === "running") return <Loader2 aria-hidden className="h-3.5 w-3.5 shrink-0 motion-safe:animate-spin text-primary" />;
    if (status === "done") return <Check aria-hidden className="h-3.5 w-3.5 shrink-0 text-(--success)" />;
    if (status === "error" || status === "failed") return <CircleAlert aria-hidden className="h-3.5 w-3.5 shrink-0 text-(--error)" />;
    if (status === "cancelled") return <X aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
    return <Clock3 aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />;
}

function statusText(status: AgentTimelineToolStatus | AgentTimelineTaskStatus | "cancelled", labels: AgentTimelineLabels) {
    if (status === "done") return labels.completed ?? "Completed";
    if (status === "failed") return labels.failed ?? "Failed";
    if (status === "cancelled") return labels.cancelled ?? "Cancelled";
    if (status === "error") return labels.error ?? "Error";
    if (status === "pending") return labels.pending ?? "Pending";
    return labels.running ?? "Running";
}

function toneClass(tone: AgentTimelineDiffTone) {
    if (tone === "add") return "text-(--success)";
    if (tone === "del") return "text-(--error)";
    return "text-muted-foreground";
}

function ReasoningRow({ block, labels, onToggleRow, renderContent }: {
    block: Extract<AgentTimelineBlock, { kind: "reasoning" }>;
    labels: AgentTimelineLabels;
    onToggleRow?: (id: string, open: boolean) => void;
    renderContent?: (text: string) => ReactNode;
}) {
    const instanceId = useId();
    const expandable = Boolean(block.content.trim());
    const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
    const title = `${instanceId}-reasoning-${domIdPart(block.id)}`;
    return (
        <div data-yunui="agent-timeline-reasoning-disclosure" className="min-w-0 py-1">
            <button
                type="button"
                disabled={!expandable || !disclosure.canToggle}
                aria-expanded={expandable ? disclosure.open : undefined}
                aria-controls={expandable ? title : undefined}
                onClick={disclosure.toggle}
                className="flex min-h-8 w-full items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default"
            >
                <Sparkles aria-hidden size={14} className={cn("shrink-0", block.active ? "text-primary" : "text-muted-foreground")} />
                {block.active ? <TextShimmer text={block.label} active data-agent-timeline-active="true" className="min-w-0 flex-1 truncate text-[13px]" /> : <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{block.label}</span>}
                {block.active ? <span className="sr-only">{labels.running ?? "Running"}</span> : null}
                {expandable ? <ChevronDown aria-hidden size={14} className={cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180")} /> : null}
            </button>
            {expandable ? (
                <Collapse id={title} open={disclosure.open}>
                    <div data-yunui="agent-timeline-reasoning-content" className="ml-8 border-l border-border pl-3 pr-2 py-2 text-sm leading-relaxed text-muted-foreground">
                        {renderContent ? renderContent(block.content) : <div className="whitespace-pre-wrap">{block.content}</div>}
                    </div>
                </Collapse>
            ) : null}
        </div>
    );
}

function ToolRow({ block, labels, onToggleRow, onToggleDiff }: {
    block: AgentTimelineToolEntryBlock;
    labels: AgentTimelineLabels;
    onToggleRow?: (id: string, open: boolean) => void;
    onToggleDiff?: (id: string, open: boolean) => void;
}) {
    const instanceId = useId();
    const expandable = Boolean(block.command || block.output || block.outputContent != null || block.details?.length || block.files?.length);
    const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
    const [openDiff, setOpenDiff] = useState<string | null>(null);
    const Icon = ICONS[block.icon ?? "tool"];
    const detailId = `${instanceId}-tool-${domIdPart(block.id)}`;
    return (
        <div className={cn("min-w-0", block.indent && "ml-5")} data-yunui="agent-tool-row">
            <button
                type="button"
                disabled={!expandable || !disclosure.canToggle}
                aria-expanded={expandable ? disclosure.open : undefined}
                aria-controls={expandable ? detailId : undefined}
                onClick={disclosure.toggle}
                className="group flex min-h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default"
            >
                <Icon aria-hidden size={14} className="shrink-0 text-muted-foreground" />
                <span className="shrink-0 text-[13px] font-medium text-foreground">{block.verb}</span>
                {block.summary || block.command ? (
                    <span className="min-w-0 flex-1 truncate rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-muted-foreground">
                        {block.summary ?? block.command}
                    </span>
                ) : <span className="min-w-0 flex-1" />}
                {statusIcon(block.status)}
                <span className="sr-only">{statusText(block.status, labels)}</span>
                {expandable ? <ChevronDown aria-hidden size={14} className={cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180")} /> : null}
            </button>
            {expandable ? (
                <Collapse id={detailId} open={disclosure.open}>
                    <div className="ml-6 mr-2 mt-0.5 border-l border-border/70 py-1.5 pl-3">
                        {block.command ? <div className="mb-1.5 font-mono text-xs text-foreground/80">$ {block.command}</div> : null}
                        {block.outputContent != null ? (
                            <div role="region" aria-label={labels.toolOutput?.(block.verb) ?? `${block.verb} output`} className="min-w-0">{block.outputContent}</div>
                        ) : block.output ? (
                            <pre role="region" aria-label={labels.toolOutput?.(block.verb) ?? `${block.verb} output`} tabIndex={0} className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-muted/30 px-2 py-1.5 font-mono text-xs text-foreground/80">{block.output}</pre>
                        ) : null}
                        {block.details?.length ? (
                            <div className="mt-2 flex flex-col gap-1">
                                {block.details.map((detail) => <div key={detail.id} className={cn("flex items-baseline justify-between gap-3 text-xs", toneClass(detail.tone ?? "context"), detail.mono && "font-mono")}><span className="min-w-0 whitespace-pre-wrap">{detail.text}</span></div>)}
                            </div>
                        ) : null}
                        {block.files?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {block.files.map((file, fileIndex) => {
                                    const fileOpen = openDiff === file.id;
                                    const canShowLines = Boolean(file.lines?.length || onToggleDiff);
                                    const diffId = `${instanceId}-diff-${fileIndex}-${domIdPart(file.id)}`;
                                    const chip = (
                                        <>
                                            <span className="min-w-0 truncate">{file.file}</span>
                                            <span className="shrink-0 text-(--success) tabular-nums">+{file.additions}</span>
                                            {file.deletions ? <span className="shrink-0 text-(--error) tabular-nums">−{file.deletions}</span> : null}
                                        </>
                                    );
                                    return (
                                        <span key={file.id} className="min-w-0">
                                            {canShowLines ? (
                                                <button type="button" aria-expanded={fileOpen} aria-controls={file.lines?.length ? diffId : undefined} aria-label={labels.showDiff?.(file.file) ?? `Show diff for ${file.file}`} onClick={() => { const next = fileOpen ? null : file.id; setOpenDiff(next); onToggleDiff?.(file.id, next !== null); }} className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{chip}</button>
                                            ) : <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground">{chip}</span>}
                                            {file.lines?.length ? (
                                                <Collapse open={fileOpen} id={diffId}>
                                                    <pre className="mt-1 max-h-48 overflow-auto rounded-sm bg-muted/30 p-2 font-mono text-[11px]">
                                                        {file.lines.map((line) => <span key={line.id} className={cn("block whitespace-pre-wrap", toneClass(line.tone))}>{line.text}{"\n"}</span>)}
                                                    </pre>
                                                </Collapse>
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </Collapse>
            ) : null}
        </div>
    );
}

function TaskRow({ block, labels, onToggleRow }: {
    block: AgentTimelineTaskBlock;
    labels: AgentTimelineLabels;
    onToggleRow?: (id: string, open: boolean) => void;
}) {
    const instanceId = useId();
    const expandable = Boolean(block.details?.length);
    const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
    const detailId = `${instanceId}-task-${domIdPart(block.id)}`;
    return (
        <div data-yunui="agent-task-row" className="min-w-0">
            <button
                type="button"
                disabled={!expandable || !disclosure.canToggle}
                aria-expanded={expandable ? disclosure.open : undefined}
                aria-controls={expandable ? detailId : undefined}
                onClick={disclosure.toggle}
                className="flex min-h-10 w-full min-w-0 items-center gap-2.5 rounded-sm px-2.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default"
            >
                {statusIcon(block.status)}
                {block.status === "done" || block.status === "failed" || block.status === "cancelled" ? (
                    <span className={cn("shrink-0 text-[11px] font-medium", block.status === "done" ? "text-(--success)" : block.status === "failed" ? "text-(--error)" : "text-muted-foreground")}>{statusText(block.status, labels)}</span>
                ) : <span className="sr-only">{statusText(block.status, labels)}</span>}
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{block.label}</span>
                {block.amount != null ? <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{block.amount}</span> : null}
                {block.step !== undefined && block.status === "running" ? <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{block.step}</span> : null}
                {expandable ? <ChevronDown aria-hidden size={14} className={cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180")} /> : null}
            </button>
            {expandable ? (
                <Collapse id={detailId} open={disclosure.open}>
                    <div className="ml-5 border-l border-border/70 py-1.5 pl-3 pr-2">
                        {block.details?.map((detail) => <div key={detail.id} className="flex items-center justify-between gap-3 py-1 text-xs"><span className="min-w-0 text-muted-foreground">{detail.label}</span>{detail.meta != null ? <span className="shrink-0 font-mono tabular-nums text-muted-foreground/80">{detail.meta}</span> : null}</div>)}
                    </div>
                </Collapse>
            ) : null}
        </div>
    );
}

function ApprovalRow({ block, isLast, onApprove, onReject, labels }: { block: Extract<AgentTimelineBlock, { kind: "approval" }>; isLast: boolean; onApprove?: (id: string) => void; onReject?: (id: string) => void; labels?: AgentTimelineLabels }) {
    return (
        <div className="min-w-0 py-1.5" data-yunui="agent-approval-row" data-last={isLast || undefined} aria-busy={block.busy || undefined}>
            <div className="flex min-w-0 items-center gap-2">
                <CircleAlert aria-hidden size={14} className="shrink-0 text-muted-foreground" />
                <span className="min-w-0 truncate text-[13px] font-medium text-foreground">{block.title}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{block.verb}</span>
                {block.decision ? (
                    <Badge variant={block.decision === "approved" ? "success" : "error"}>{block.decidedLabel ?? block.decision}</Badge>
                ) : null}
            </div>
            {block.message != null ? <p className="ml-6 mt-1 text-[12.5px] text-muted-foreground">{block.message}</p> : null}
            {block.argsText ? <pre tabIndex={0} role="region" aria-label={`${block.title}: ${block.verb}`} className="ml-6 mt-1 max-h-40 overflow-auto whitespace-pre-wrap bg-muted/30 px-2 py-1.5 font-mono text-[11.5px] text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">{block.argsText}</pre> : null}
            {!block.decision ? (
                <div className="ml-6 mt-2 flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" variant="primary" disabled={block.disabled || block.busy || !onApprove} onClick={() => { if (!block.disabled && !block.busy) onApprove?.(block.id); }}>{block.allowLabel}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={block.disabled || block.busy || !onReject} onClick={() => { if (!block.disabled && !block.busy) onReject?.(block.id); }}>{block.denyLabel}</Button>
                    {block.busy ? <span role="status" className="text-xs text-muted-foreground">{labels?.waitingForHost ?? "Waiting for host…"}</span> : null}
                </div>
            ) : null}
        </div>
    );
}

export function AgentTimeline({
    blocks,
    renderContent,
    onApprove,
    onReject,
    labels,
    open,
    defaultOpen = true,
    onOpenChange,
    onToggleRow,
    onToggleDiff,
    className,
}: AgentTimelineProps) {
    const contentId = `${useId()}-timeline-content`;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const controlled = open !== undefined;
    const isOpen = controlled ? open : internalOpen;
    const canToggle = !controlled || Boolean(onOpenChange);
    const visible = blocks.filter((block) => !(block.kind === "reasoning" && !block.content.trim() && !block.active));
    if (!visible.length) return null;

    const counts: AgentTimelineSummary = {
        steps: visible.length,
        reasoning: visible.filter((block) => block.kind === "reasoning").length,
        tools: visible.filter((block) => block.kind === "tool").length,
        tasks: visible.filter((block) => block.kind === "task").length,
        approvals: visible.filter((block) => block.kind === "approval").length,
    };
    const summary = labels?.summary?.(counts) ?? labels?.stepCount?.(counts.steps) ??
        (counts.steps ? `${counts.steps} ${counts.steps === 1 ? "step" : "steps"}` : labels?.process ?? "Process");
    const requestOpen = () => {
        if (!canToggle) return;
        const next = !isOpen;
        if (!controlled) setInternalOpen(next);
        onOpenChange?.(next);
    };

    return (
        <div className={cn("flex min-w-0 flex-col", className)} data-yunui="agent-timeline">
            <button
                type="button"
                disabled={!canToggle}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={requestOpen}
                className="flex min-h-8 w-fit max-w-full items-center gap-2 rounded-sm px-1.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default"
            >
                <Sparkles aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{summary}</span>
                <ChevronDown aria-hidden size={14} className={cn("shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>
            <Collapse open={isOpen} id={contentId}>
                <div className="mt-1 flex min-w-0 flex-col gap-0.5">
                    {visible.map((block, index) => {
                        if (block.kind === "reasoning") return <ReasoningRow key={block.id} block={block} labels={labels ?? {}} onToggleRow={onToggleRow} renderContent={renderContent} />;
                        if (block.kind === "tool") return <ToolRow key={block.id} block={block} labels={labels ?? {}} onToggleRow={onToggleRow} onToggleDiff={onToggleDiff} />;
                        if (block.kind === "task") return <TaskRow key={block.id} block={block} labels={labels ?? {}} onToggleRow={onToggleRow} />;
                        return <ApprovalRow key={block.id} block={block} isLast={index === visible.length - 1} onApprove={onApprove} onReject={onReject} labels={labels} />;
                    })}
                </div>
            </Collapse>
        </div>
    );
}
