"use client";

import type { ComponentType, HTMLAttributes } from "react";
import {
    Brain,
    MessageSquareText,
    RefreshCcw,
    Search,
    ShieldQuestion,
    Wrench,
} from "lucide-react";
import { cn } from "../lib/cn";
import { TextShimmer } from "../primitives/text-shimmer";

export type AgentRunPhase =
    | "thinking"
    | "acting"
    | "observing"
    | "reflecting"
    | "responding"
    | "waiting";

export interface AgentRunStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Runtime-owned summary of the one activity currently in progress. */
    label: string;
    phase?: AgentRunPhase;
    /** Keeps the row layout stable while disabling decorative motion. */
    active?: boolean;
}

const PHASE_ICONS = {
    thinking: Brain,
    acting: Wrench,
    observing: Search,
    reflecting: RefreshCcw,
    responding: MessageSquareText,
    waiting: ShieldQuestion,
} satisfies Record<AgentRunPhase, ComponentType<{ className?: string }>>;

/**
 * A layout-stable live surface for the current agent activity.
 *
 * This is deliberately separate from AgentTimeline: the status stays in one
 * place for the whole run while timeline rows become durable process history.
 * Consumers provide localized runtime text; YunUI owns motion and geometry.
 */
export function AgentRunStatus({
    label,
    phase = "thinking",
    active = phase !== "waiting",
    className,
    ...props
}: AgentRunStatusProps) {
    const Icon = PHASE_ICONS[phase];

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-yunui="agent-run-status"
            data-phase={phase}
            data-active={active || undefined}
            className={cn(
                "relative flex min-h-10 w-fit max-w-full min-w-0 items-center gap-2.5 py-1.5 pl-3 pr-1 text-sm",
                "before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary/70",
                active && "before:motion-safe:animate-pulse",
                className,
            )}
            {...props}
        >
            <span
                data-run-status-motion
                aria-hidden="true"
                className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/55 text-primary ring-1 ring-border/70"
            >
                {active ? (
                    <span className="absolute inset-1 rounded-sm bg-primary/10 motion-safe:animate-ping [animation-duration:2.4s]" />
                ) : null}
                <Icon
                    className={cn(
                        "relative h-4 w-4",
                        active && phase === "reflecting" && "motion-safe:animate-spin [animation-duration:2.8s]",
                        active && phase === "thinking" && "motion-safe:animate-pulse [animation-duration:1.5s]",
                    )}
                />
            </span>

            <TextShimmer
                text={label}
                active={active}
                data-run-status-label
                className="min-w-0 max-w-xl truncate font-medium"
            />

            <span
                data-run-status-pulse
                aria-hidden="true"
                className={cn(
                    "grid h-4 w-4 shrink-0 grid-cols-2 gap-0.5 transition-opacity",
                    active ? "opacity-80" : "opacity-0",
                )}
            >
                {[0, 1, 2, 3].map((index) => (
                    <span
                        key={index}
                        className="h-1.5 w-1.5 rounded-[2px] bg-primary/65 motion-safe:animate-pulse"
                        style={{
                            animationDelay: `${index * 140}ms`,
                            animationDuration: "1.05s",
                        }}
                    />
                ))}
            </span>
        </div>
    );
}
