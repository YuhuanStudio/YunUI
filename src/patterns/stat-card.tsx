"use client";

import { type ElementType, type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Canonical dashboard stat card — the single source for every metric tile.
 * Structure is the dashboard overview card; `tone` provides semantic color
 * (amber=pending, red=rejected, …); icon/trend/subtext/delay are all optional
 * so compact colored tiles and rich trend cards share one component.
 */
const TONES: Record<string, { card: string; value: string }> = {
    amber: { card: "border-amber-500/20 bg-amber-500/5", value: "text-amber-600 dark:text-amber-400" },
    emerald: { card: "border-emerald-500/20 bg-emerald-500/5", value: "text-emerald-600 dark:text-emerald-400" },
    blue: { card: "border-blue-500/20 bg-blue-500/5", value: "text-blue-600 dark:text-blue-400" },
    red: { card: "border-red-500/20 bg-red-500/5", value: "text-red-600 dark:text-red-400" },
    purple: { card: "border-purple-500/20 bg-purple-500/5", value: "text-purple-600 dark:text-purple-400" },
};

export interface StatCardProps {
    /** Optional leading icon component (e.g. a Lucide icon). */
    icon?: ElementType;
    /** Metric name. */
    label: string;
    /** The metric value (string, number, or node). */
    value: ReactNode;
    /** Optional supporting line under the value. */
    subtext?: ReactNode;
    /** Optional trend indicator: percent `value` plus whether it's `positive` (up/green) or down/red. */
    trend?: { value: number; positive: boolean };
    /** Semantic color tint for the card + value (amber/emerald/blue/red/purple). */
    tone?: keyof typeof TONES | string;
    /** Stagger entrance delay in ms. */
    delay?: number;
    /** Compact layout: icon + label on one row, value below (admin insights style). */
    inline?: boolean;
    /** Value-first layout: big number on top, label beneath (analytics / admin stats style). */
    valueFirst?: boolean;
    /** Compact surface: the lighter `card p-4` tile instead of `stat-card p-5`
     *  (matches dense admin stat grids). */
    compact?: boolean;
    className?: string;
}

export function StatCard({ icon: Icon, label, value, subtext, trend, tone, delay = 0, inline = false, valueFirst = false, compact = false, className }: StatCardProps) {
    const toneCfg = tone ? TONES[tone] : undefined;
    const showTopRow = Boolean(Icon || trend);
    const surface = compact ? "card p-4" : "stat-card p-5";

    const topRow = showTopRow ? (
        <div className="flex items-start justify-between mb-4">
            {Icon ? (
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon size={20} strokeWidth={1.5} className="text-muted-foreground" />
                </div>
            ) : (
                <span />
            )}
            {trend && (
                <div className={cn("flex items-center gap-1 text-xs font-medium", trend.positive ? "text-success" : "text-error")}>
                    {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend.value).toFixed(1)}%
                </div>
            )}
        </div>
    ) : null;

    // Compact row layout — icon and label share a line, value underneath.
    if (inline) {
        return (
            <div className={cn("card p-4", toneCfg?.card, className)}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {Icon && <Icon size={18} />}
                    <span>{label}</span>
                </div>
                <div className={cn("text-2xl font-semibold mt-2", toneCfg?.value ?? "text-foreground")}>{value}</div>
            </div>
        );
    }

    // Value-first layout — big number on top, label beneath (analytics / admin stats style).
    if (valueFirst) {
        return (
            <div
                className={cn(surface, "animate-enter", toneCfg?.card, className)}
                style={delay ? { animationDelay: `${delay}ms` } : undefined}
            >
                {topRow}
                <div className={cn("text-2xl font-semibold mb-1", toneCfg?.value)}>{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
                {subtext && <div className="text-xs text-muted-foreground/60 mt-1">{subtext}</div>}
            </div>
        );
    }

    return (
        <div
            className={cn(surface, "animate-enter", toneCfg?.card, className)}
            style={delay ? { animationDelay: `${delay}ms` } : undefined}
        >
            {topRow}
            <div className="text-label mb-1">{label}</div>
            <div className={cn("text-2xl font-semibold tracking-tight", toneCfg?.value)}>{value}</div>
            {subtext && <div className="text-caption mt-1">{subtext}</div>}
        </div>
    );
}
