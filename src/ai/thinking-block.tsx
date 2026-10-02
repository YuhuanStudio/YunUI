"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, ChevronDown, CircleAlert, Clock3, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";
import { TextShimmer } from "../primitives/text-shimmer";

/** A host-owned step in an agent reasoning/search/coding trace. */
export type ThinkingStepStatus = "pending" | "running" | "done" | "failed" | "cancelled";

export interface ThinkingBlockStep {
    id: string;
    label: string;
    detail?: ReactNode;
    meta?: ReactNode;
    status: ThinkingStepStatus;
    mono?: boolean;
}

export interface ThinkingBlockLabels {
    title?: string;
    active?: string;
    inProgress?: string;
    completed?: string;
    failed?: string;
    cancelled?: string;
    pending?: string;
}

export interface ThinkingBlockProps {
    content: string;
    isStreaming?: boolean;
    defaultOpen?: boolean;
    /** Controlled disclosure state. Without `onOpenChange`, the trigger is read-only. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Host-supplied detail rows (Steps / Search / Coding / Reasoning). */
    steps?: readonly ThinkingBlockStep[];
    selectedStepId?: string;
    onStepSelect?: (id: string) => void;
    labels?: ThinkingBlockLabels;
    /** Render reasoning text (e.g. with a Markdown renderer). Defaults to plain pre-wrapped text. */
    renderContent?: (content: string) => ReactNode;
}

/**
 * Compact, host-fed reasoning disclosure based on Beautiful UI's
 * `components/primitives/ThinkingState.tsx` at commit
 * `44a274e598395ab61e7c96c26fda2758780253b7` (MIT). It adopts the source's
 * sparkle header, plain status row and indented trace geometry, while the host
 * remains the only source of content and step state. It contains no run timer.
 */
export function ThinkingBlock({
    content,
    isStreaming = false,
    defaultOpen = false,
    open,
    onOpenChange,
    steps = [],
    selectedStepId,
    onStepSelect,
    labels,
    renderContent,
}: ThinkingBlockProps) {
    const translate = useYunUI().useT("common.thinking");
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const contentId = `${useId()}-thinking-content`;
    const controlled = open !== undefined;
    const isOpen = controlled ? open : internalOpen;
    const canToggle = !controlled || Boolean(onOpenChange);

    const fallback = (key: string, value: string) => {
        try {
            const translated = translate(key);
            return translated && translated !== key && !translated.endsWith(`.${key}`) ? translated : value;
        } catch {
            return value;
        }
    };
    const copy = {
        title: labels?.title ?? fallback("label", "Thinking"),
        active: labels?.active ?? fallback("active", "Thinking"),
        inProgress: labels?.inProgress ?? fallback("inProgress", "In progress"),
        completed: labels?.completed ?? fallback("completed", "Completed"),
        failed: labels?.failed ?? fallback("failed", "Failed"),
        cancelled: labels?.cancelled ?? fallback("cancelled", "Cancelled"),
        pending: labels?.pending ?? fallback("pending", "Pending"),
    };

    const requestOpen = () => {
        if (!canToggle) return;
        const next = !isOpen;
        if (!controlled) setInternalOpen(next);
        onOpenChange?.(next);
    };
    const statusLabel = (status: ThinkingStepStatus) => ({
        pending: copy.pending,
        running: copy.active,
        done: copy.completed,
        failed: copy.failed,
        cancelled: copy.cancelled,
    })[status];
    const statusIcon = (status: ThinkingStepStatus) => {
        const common = "h-3.5 w-3.5 shrink-0";
        switch (status) {
            case "running": return <Loader2 aria-hidden className={cn(common, "motion-safe:animate-spin text-primary")} />;
            case "done": return <Check aria-hidden className={cn(common, "text-(--success)")} />;
            case "failed": return <CircleAlert aria-hidden className={cn(common, "text-(--error)")} />;
            case "cancelled": return <X aria-hidden className={cn(common, "text-muted-foreground")} />;
            default: return <Clock3 aria-hidden className={cn(common, "text-muted-foreground/60")} />;
        }
    };

    return (
        <section className="@container/think my-2 w-full min-w-0" data-yunui="thinking-block">
            <button
                type="button"
                onClick={requestOpen}
                disabled={!canToggle}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="group flex min-h-8 w-fit max-w-full items-center gap-2 rounded-md px-1.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default"
            >
                <Sparkles aria-hidden className={cn("h-3.5 w-3.5 shrink-0", isStreaming ? "text-primary" : "text-muted-foreground")} />
                {isStreaming ? (
                    <TextShimmer text={copy.title} role="status" className="min-w-0 truncate font-medium text-foreground" />
                ) : (
                    <span className="min-w-0 truncate font-medium text-foreground">{copy.title}</span>
                )}
                {isStreaming ? <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary motion-safe:animate-pulse" /> : null}
                <ChevronDown aria-hidden className={cn("h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none", isOpen && "rotate-180")} />
            </button>

            <div
                id={contentId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={cn(
                    "grid min-w-0 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    {steps.length ? (
                        <ol aria-label={copy.title} className="ml-2 mt-1 flex min-w-0 flex-col gap-0.5 border-l border-border/70 py-1 pl-3">
                            {steps.map((step) => {
                                const contentNode = (
                                    <>
                                        {statusIcon(step.status)}
                                        <span className={cn("min-w-0 text-left text-[12.5px] text-foreground", step.mono && "font-mono text-xs")}>
                                            {step.label}
                                        </span>
                                        {step.meta != null ? <span data-yunui="thinking-block-step-meta" className="col-start-2 min-w-0 break-words text-[11px] tabular-nums text-muted-foreground @min-[360px]/think:col-start-3 @min-[360px]/think:max-w-[10rem] @min-[360px]/think:text-right">{step.meta}</span> : null}
                                        <span className="sr-only">{statusLabel(step.status)}</span>
                                    </>
                                );
                                return (
                                    <li key={step.id} data-yunui="thinking-block-step" className="min-w-0">
                                        {onStepSelect ? (
                                            <button
                                                type="button"
                                                aria-pressed={selectedStepId === step.id}
                                                onClick={() => onStepSelect(step.id)}
                                                className={cn("grid min-h-8 w-full min-w-0 grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 rounded-sm px-1.5 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring @min-[360px]/think:grid-cols-[0.875rem_minmax(0,1fr)_auto]", selectedStepId === step.id && "bg-muted/60")}
                                            >
                                                {contentNode}
                                            </button>
                                        ) : (
                                            <div className="grid min-h-8 min-w-0 grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 px-1.5 @min-[360px]/think:grid-cols-[0.875rem_minmax(0,1fr)_auto]">{contentNode}</div>
                                        )}
                                        {step.detail != null ? <div data-yunui="thinking-block-step-detail" className="ml-5 border-l border-border/70 py-1 pl-2.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</div> : null}
                                    </li>
                                );
                            })}
                        </ol>
                    ) : content ? (
                        <div className="ml-2 mt-1 border-l border-border/70 py-1 pl-3 pr-2 text-[13px] leading-relaxed text-muted-foreground">
                            {renderContent ? renderContent(content) : <div className="whitespace-pre-wrap">{content}</div>}
                            {isStreaming ? <span aria-hidden className="ml-1 inline-block h-3 w-1 animate-pulse bg-muted-foreground/70 align-middle motion-reduce:animate-none" /> : null}
                        </div>
                    ) : isStreaming ? (
                        <p className="ml-2 mt-1 border-l border-border/70 py-1 pl-3 text-[12px] text-muted-foreground">{copy.inProgress}</p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default ThinkingBlock;
