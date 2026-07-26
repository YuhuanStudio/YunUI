import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface NavStateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    /** Shows the indicator in its selected state. */
    active?: boolean;
    /** Animates the same indicator without changing its geometry. */
    running?: boolean;
}

/** The single active/running indicator shared by YunUI navigation surfaces. */
export function NavStateIndicator({
    active,
    running,
    className,
    ...props
}: NavStateIndicatorProps) {
    return (
        <span
            aria-hidden="true"
            data-active={active || undefined}
            data-running={running || undefined}
            className={cn("nav-state-indicator", className)}
            {...props}
        />
    );
}
