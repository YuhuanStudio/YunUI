"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// METRIC BAR
// A labelled row with a thin horizontal proportion bar — for "top N" breakdowns
// like spend-by-provider, usage-by-category, or storage-by-bucket. A leading
// icon (or a color dot), a label, a right-aligned value, and a colored bar.
// The host supplies the color (and any icon); presentation only.
// =====================================================

export interface MetricBarProps {
    /** Leading icon; when omitted a small color dot (using `color`) is shown. */
    icon?: ReactNode;
    label: ReactNode;
    /** Right-aligned value (e.g. "120 credits"). */
    value?: ReactNode;
    /** Bar fill, 0–100. */
    percentage: number;
    /** CSS color for the bar fill (and the dot when there's no icon). */
    color?: string;
    className?: string;
}

export function MetricBar({ icon, label, value, percentage, color, className }: MetricBarProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {icon != null ? (
                icon
            ) : (
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-sm font-medium truncate">{label}</span>
                    {value != null && <span className="text-sm text-muted-foreground shrink-0">{value}</span>}
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        role="progressbar"
                        aria-valuenow={Math.max(0, Math.min(100, percentage))}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%`, backgroundColor: color }}
                    />
                </div>
            </div>
        </div>
    );
}
