"use client";

import type { HTMLAttributes } from "react";
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
    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-yunui="agent-run-status"
            data-phase={phase}
            data-active={active || undefined}
            className={cn(
                "flex min-h-9 w-fit max-w-full min-w-0 items-center gap-2 py-1 text-[13.5px] text-muted-foreground",
                className,
            )}
            {...props}
        >
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
                    "flex shrink-0 items-center gap-0.5 transition-opacity",
                    active ? "opacity-80" : "opacity-0",
                )}
            >
                {[0, 1, 2].map((index) => (
                    <span
                        key={index}
                        className="h-1 w-1 rounded-full bg-primary/60 motion-safe:animate-pulse"
                        style={{
                            animationDelay: `${index * 180}ms`,
                            animationDuration: "1.1s",
                        }}
                    />
                ))}
            </span>
        </div>
    );
}
