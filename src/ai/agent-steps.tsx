"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    Search,
    Globe,
    Image as ImageIcon,
    FileText,
    Wrench,
    Brain,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { cn } from "../lib/cn";

/**
 * AgentSteps — a Codex-style execution timeline for an agent turn.
 *
 * A thin vertical rail threads the steps; each node's color *is* the status
 * (success / error / warning / running / thinking), so state reads at a glance
 * without heavy chips. Tool steps expand into terminal-style blocks; reasoning
 * folds into a low-weight "thinking" row. Purely presentational and data-driven
 * — it carries NO copy: the consumer localizes every string (verbs, status
 * labels, units) and maps its own step records onto {@link AgentStep}.
 */

export type AgentStepStatus = "success" | "error" | "warning" | "running";
export type AgentStepIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";

/** A terminal-style detail block revealed when a tool step is expanded. */
export interface AgentStepBlock {
    /** Echoed command / query shown as a `$ …` line above the body. */
    command?: string;
    /** The body — tool output, error text, etc. */
    content: string;
    /** Body tone. `error` colors it destructive; `muted` dims it. */
    tone?: "default" | "error" | "muted";
    /** Localized "output truncated" hint shown under the body. */
    truncatedLabel?: string;
}

export interface AgentToolStep {
    kind?: "tool";
    /** Humanized action, e.g. "終端指令" / "網路搜尋" (consumer-localized). */
    verb: string;
    /** One-line argument summary shown after the verb (monospace). */
    summary?: string;
    status: AgentStepStatus;
    /** Small trailing status label, e.g. "401" / "無輸出". */
    statusTag?: string;
    icon?: AgentStepIconName;
    /** Expandable terminal blocks; when empty the row is not expandable. */
    blocks?: AgentStepBlock[];
}

export interface AgentThoughtStep {
    kind: "thought";
    /** Label, e.g. "思考" (consumer-localized). */
    verb: string;
    /** One-line summary shown after the verb. */
    summary?: string;
    /** Reasoning text; empty content shows {@link emptyLabel}. */
    content?: string;
    /** Shown when content is empty (e.g. "此次反思沒有內容"). */
    emptyLabel?: string;
    isStreaming?: boolean;
}

export type AgentStep = AgentToolStep | AgentThoughtStep;

export interface AgentStepsHeader {
    /** e.g. "已完成" / "執行中" (consumer-localized). */
    statusLabel?: string;
    running?: boolean;
    /** Small uppercase eyebrow, e.g. "Agent". */
    eyebrow?: string;
    /** Step count; falls back to `steps.length`. */
    count?: number;
    /** Unit after the count, e.g. "步" / "steps". */
    countLabel?: string;
    /** Elapsed label, e.g. "44s". */
    elapsedLabel?: string;
}

export interface AgentStepsProps {
    steps: AgentStep[];
    /** Optional header strip (status pill + count + elapsed). Omit to hide it. */
    header?: AgentStepsHeader;
    /** Index expanded by default (e.g. the last tool step). */
    defaultOpenIndex?: number | null;
    /** Render reasoning content (e.g. with markdown). Plain text by default. */
    renderContent?: (content: string) => ReactNode;
    className?: string;
}

const ICONS: Record<AgentStepIconName, typeof Terminal> = {
    terminal: Terminal,
    search: Search,
    globe: Globe,
    image: ImageIcon,
    file: FileText,
    tool: Wrench,
};

function isThought(step: AgentStep): step is AgentThoughtStep {
    return step.kind === "thought";
}

/** Solid node color for a status (rail markers cut the line with a bg ring). */
const NODE_BG: Record<AgentStepStatus, string> = {
    success: "bg-[var(--success)]",
    error: "bg-destructive",
    warning: "bg-[var(--warning)]",
    running: "",
};

const TAG_COLOR: Record<AgentStepStatus, string> = {
    success: "text-success",
    error: "text-destructive",
    warning: "text-warning",
    running: "text-muted-foreground",
};

const BLOCK_ACCENT: Record<AgentStepStatus, string> = {
    success: "border-l-[var(--success)]",
    error: "border-l-destructive",
    warning: "border-l-[var(--warning)]",
    running: "border-l-border",
};

function TerminalBlock({ block, status }: { block: AgentStepBlock; status: AgentStepStatus }) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-lg border border-border/60 border-l-2 bg-muted/40 font-mono text-xs",
                BLOCK_ACCENT[status],
            )}
        >
            {block.command != null && (
                <div className="whitespace-pre-wrap break-words border-b border-border/40 px-3 py-2 text-muted-foreground">
                    <span className="mr-1.5 select-none text-muted-foreground/50">$</span>
                    {block.command}
                </div>
            )}
            <div
                className={cn(
                    "overflow-x-auto whitespace-pre px-3 py-2 leading-relaxed",
                    block.tone === "error" && "text-destructive",
                    block.tone === "muted" && "text-muted-foreground/70",
                    (!block.tone || block.tone === "default") && "text-foreground",
                )}
            >
                {block.content}
                {block.truncatedLabel && (
                    <span className="mt-1 block text-[11px] text-muted-foreground/60">{block.truncatedLabel}</span>
                )}
            </div>
        </div>
    );
}

function StepNode({ step }: { step: AgentStep }) {
    if (isThought(step)) {
        return (
            <span className="absolute left-[5px] top-3 h-[9px] w-[9px] rounded-full border border-border bg-background ring-[3px] ring-background" />
        );
    }
    if (step.status === "running") {
        return (
            <span className="absolute left-[3px] top-[9px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-background ring-[3px] ring-background">
                <Loader2 size={13} className="animate-spin text-[var(--warning)]" />
            </span>
        );
    }
    return (
        <span
            className={cn(
                "absolute left-[3px] top-3 h-[11px] w-[11px] rounded-full ring-[3px] ring-background",
                NODE_BG[step.status],
            )}
        />
    );
}

function StepRow({
    step,
    open,
    onToggle,
    renderContent,
}: {
    step: AgentStep;
    open: boolean;
    onToggle: () => void;
    renderContent?: (content: string) => ReactNode;
}) {
    const thought = isThought(step);
    const expandable = thought ? true : !!step.blocks?.length;
    const Icon = thought ? Brain : ICONS[step.icon ?? "tool"];

    const row = (
        <>
            <Icon size={15} className="shrink-0 text-muted-foreground/70" />
            <span
                className={cn(
                    "shrink-0 text-[13px] font-medium tracking-[-0.005em]",
                    thought ? "text-muted-foreground" : "text-foreground",
                )}
            >
                {step.verb}
            </span>
            {step.summary && (
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                    {step.summary}
                    {thought && step.isStreaming && (
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="ml-1 inline-block h-2.5 w-0.5 bg-muted-foreground/50 align-middle"
                        />
                    )}
                </span>
            )}
            {!thought && step.statusTag && (
                <span className={cn("shrink-0 font-mono text-[11px] font-semibold", TAG_COLOR[step.status])}>
                    {step.statusTag}
                </span>
            )}
            {expandable && (
                <ChevronRight
                    size={14}
                    className={cn(
                        "shrink-0 text-muted-foreground/50 transition-transform duration-200",
                        open && "rotate-90",
                    )}
                />
            )}
        </>
    );

    return (
        <>
            {expandable ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                    {row}
                </button>
            ) : (
                <div className="flex w-full items-center gap-2 rounded-md px-2 py-2">{row}</div>
            )}

            <AnimatePresence initial={false}>
                {open && expandable && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {thought ? (
                            <div className="pb-2.5 pr-2 pt-0.5">
                                {step.content ? (
                                    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
                                        {renderContent ? renderContent(step.content) : (
                                            <div className="whitespace-pre-wrap">{step.content}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-[12.5px] italic leading-relaxed text-muted-foreground/60">
                                        {step.emptyLabel}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5 pb-2.5 pr-2 pt-0.5">
                                {step.blocks?.map((b, i) => (
                                    <TerminalBlock key={i} block={b} status={step.status} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export function AgentSteps({ steps, header, defaultOpenIndex = null, renderContent, className }: AgentStepsProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <div className={cn("overflow-hidden rounded-xl border border-border bg-background", className)}>
            {header && (
                <div className="flex items-center gap-2.5 px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1 pl-2 pr-2.5 text-xs font-medium text-foreground">
                        <span
                            className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                header.running ? "animate-pulse bg-[var(--warning)]" : "bg-[var(--success)]",
                            )}
                        />
                        {header.statusLabel}
                    </span>
                    {header.eyebrow && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            {header.eyebrow}
                        </span>
                    )}
                    <div className="ml-auto flex items-center gap-3 text-xs tabular-nums text-muted-foreground">
                        <span>
                            <b className="font-semibold text-foreground">{header.count ?? steps.length}</b>
                            {header.countLabel ? ` ${header.countLabel}` : null}
                        </span>
                        {header.elapsedLabel && <span>{header.elapsedLabel}</span>}
                    </div>
                </div>
            )}

            <div className="relative px-4 pb-2.5 pt-0.5 before:absolute before:bottom-3.5 before:left-[26px] before:top-1.5 before:w-px before:bg-border before:content-['']">
                {steps.map((step, i) => (
                    <div key={i} className="relative pl-6">
                        <StepNode step={step} />
                        <StepRow
                            step={step}
                            open={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                            renderContent={renderContent}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
