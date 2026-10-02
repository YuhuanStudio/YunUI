"use client";

import type { HTMLAttributes } from "react";
import { Check, CircleAlert, Clock3, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "../lib/cn";
import { TextShimmer } from "../primitives/text-shimmer";

export type AgentRunPhase =
    | "thinking"
    | "acting"
    | "observing"
    | "reflecting"
    | "responding"
    | "waiting";

export type AgentRunTerminalPhase = "completed" | "failed" | "cancelled";
/** Additive runtime phase type; `AgentRunPhase` remains the legacy activity union. */
export type AgentRunState = AgentRunPhase | AgentRunTerminalPhase;

export interface AgentRunStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Runtime-owned summary of the one activity currently in progress. */
    label: string;
    phase?: AgentRunState;
    /** Keeps the row layout stable while disabling decorative motion. */
    active?: boolean;
}

/**
 * Single-line activity state based on Beautiful UI's compact status header in
 * `components/primitives/ThinkingState.tsx` at commit
 * `44a274e598395ab61e7c96c26fda2758780253b7` (MIT). This row stays separate
 * from AgentTimeline so the host can show a current activity without adding a
 * second status badge to every durable process row.
 */
export function AgentRunStatus({
    label,
    phase = "thinking",
    active = !["waiting", "completed", "failed", "cancelled"].includes(phase),
    className,
    ...props
}: AgentRunStatusProps) {
    const terminal = phase === "completed" || phase === "failed" || phase === "cancelled";
    const Icon = phase === "completed" ? Check
        : phase === "failed" ? CircleAlert
            : phase === "cancelled" ? X
                : phase === "waiting" ? Clock3
                    : phase === "thinking" && active ? Sparkles
                        : active ? Loader2 : Clock3;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-yunui="agent-run-status"
            data-phase={phase}
            data-active={active || undefined}
            className={cn("flex min-h-8 w-fit max-w-full min-w-0 items-center gap-2 py-1 text-[13px] text-muted-foreground", className)}
            {...props}
        >
            <Icon
                data-run-status-indicator
                aria-hidden
                className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    active && !terminal && phase === "thinking" ? "text-primary" : "",
                    active && !terminal && phase !== "thinking" ? "motion-safe:animate-spin text-primary" : "",
                    phase === "completed" ? "text-(--success)" : "",
                    phase === "failed" ? "text-(--error)" : "",
                )}
            />
            <TextShimmer
                text={label}
                active={active && !terminal}
                data-run-status-label
                className="min-w-0 max-w-xl truncate font-medium text-foreground"
            />
        </div>
    );
}

export default AgentRunStatus;
