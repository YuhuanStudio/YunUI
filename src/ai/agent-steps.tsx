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
    ChevronDown,
    Check,
    Loader2,
} from "lucide-react";
import { cn } from "../lib/cn";

/**
 * AgentSteps — an execution log for one agent turn, in YunUI's neutral `.card`
 * language (elevated card surface, refined icon tiles, a `bg-primary` accent
 * bar for the in-flight step, and semantic `red-500/5` tinted blocks for
 * failures). Deliberately monochrome — status is the only color. Purely
 * presentational and data-driven; it carries NO copy: the consumer localizes
 * every string (verbs, status labels, units) and maps its own step records onto
 * {@link AgentStep}.
 */

export type AgentStepStatus = "success" | "error" | "warning" | "running";
export type AgentStepIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";

/** A monospace detail block revealed when a tool step is expanded. */
export interface AgentStepBlock {
    /** Echoed command / query shown as a `$ …` line above the body. */
    command?: string;
    /** The body — tool output, error text, etc. */
    content: string;
    /** Body tone. `error` tints the whole block; `muted` dims the text. */
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
    /** Expandable detail blocks; when empty the row is not expandable. */
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

/** Trailing status-tag color (StatCard's `-600 / dark:-400` tone convention). */
const TAG_COLOR: Record<AgentStepStatus, string> = {
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    running: "text-muted-foreground",
};

function DetailBlock({ block }: { block: AgentStepBlock }) {
    const error = block.tone === "error";
    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border font-mono text-xs",
                error ? "border-red-500/20 bg-red-500/5" : "border-border/60 bg-muted/50",
            )}
        >
            {block.command != null && (
                <div
                    className={cn(
                        "whitespace-pre-wrap break-words border-b px-3 py-1.5 text-muted-foreground",
                        error ? "border-red-500/20" : "border-border/50",
                    )}
                >
                    <span className="mr-1.5 select-none text-muted-foreground/50">$</span>
                    {block.command}
                </div>
            )}
            <div
                className={cn(
                    "overflow-x-auto whitespace-pre-wrap break-words px-3 py-2 leading-relaxed",
                    error && "text-red-600 dark:text-red-400",
                    block.tone === "muted" && "text-muted-foreground/70",
                    (!block.tone || block.tone === "default") && "text-foreground",
                )}
            >
                {block.content}
                {block.truncatedLabel && (
                    <span className="mt-1 block text-[11px] not-italic text-muted-foreground/60">{block.truncatedLabel}</span>
                )}
            </div>
        </div>
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
    const running = !thought && step.status === "running";
    const hasContent = thought ? !!step.content || !!step.emptyLabel : !!step.blocks?.length;
    const expandable = hasContent && !running;
    const Icon = running ? Loader2 : thought ? Brain : ICONS[step.icon ?? "tool"];

    const row = (
        <>
            <span
                className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
                    thought && step.isStreaming && "animate-pulse",
                )}
            >
                <Icon size={15} strokeWidth={1.5} className={cn(running && "animate-spin")} />
            </span>
            <span
                className={cn(
                    "shrink-0 text-[13px] font-medium",
                    thought ? "text-muted-foreground" : "text-foreground",
                )}
            >
                {step.verb}
            </span>
            {step.summary && (
                <span
                    className={cn(
                        "min-w-0 flex-1 truncate text-xs text-muted-foreground",
                        !thought && "font-mono text-[11.5px]",
                    )}
                >
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
            <span className={cn("flex shrink-0 items-center gap-2", !step.summary && "ml-auto")}>
                {!thought && step.status === "success" && !step.statusTag && (
                    <Check size={14} className="text-emerald-500" />
                )}
                {!thought && step.statusTag && (
                    <span className={cn("font-mono text-[11px] font-semibold", TAG_COLOR[step.status])}>
                        {step.statusTag}
                    </span>
                )}
                {expandable && (
                    <ChevronDown
                        size={15}
                        className={cn(
                            "text-muted-foreground/50 transition-transform duration-200",
                            open && "rotate-180",
                        )}
                    />
                )}
            </span>
        </>
    );

    return (
        <div className="relative">
            {running && (
                <span className="absolute left-0 top-[15px] h-5 w-[3px] rounded-full bg-primary" />
            )}
            {expandable ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                    {row}
                </button>
            ) : (
                <div className="flex w-full items-center gap-2.5 px-4 py-2">{row}</div>
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
                        <div className="pb-3 pl-[54px] pr-4 pt-0.5">
                            {thought ? (
                                step.content ? (
                                    <div className="text-[12.5px] leading-relaxed text-muted-foreground">
                                        {renderContent ? renderContent(step.content) : (
                                            <div className="whitespace-pre-wrap">{step.content}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-[12.5px] italic leading-relaxed text-muted-foreground/50">
                                        {step.emptyLabel}
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    {step.blocks?.map((b, i) => (
                                        <DetailBlock key={i} block={b} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function AgentSteps({ steps, header, defaultOpenIndex = null, renderContent, className }: AgentStepsProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-[var(--border-hairline)] bg-card shadow-[var(--shadow-xs)]",
                className,
            )}
        >
            {header && (
                <div className="flex items-center gap-2.5 px-4 py-2.5">
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
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60">
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

            <div className="divide-y divide-[var(--border-hairline)] pb-1">
                {steps.map((step, i) => (
                    <StepRow
                        key={i}
                        step={step}
                        open={openIndex === i}
                        onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        renderContent={renderContent}
                    />
                ))}
            </div>
        </div>
    );
}
