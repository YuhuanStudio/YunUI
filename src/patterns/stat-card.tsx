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
// Tones are semantic, so they resolve through the design tokens rather than the
// raw Tailwind palette — a `red` tile and an `error` Alert are now the same
// colour, and every tone follows the active theme.
//
// The colour-named keys are kept as aliases because they are already part of the
// public API; prefer the semantic names in new code.
const SEMANTIC_TONES = {
    warning: { card: "border-warning-soft bg-warning-soft", value: "text-warning" },
    success: { card: "border-success-soft bg-success-soft", value: "text-success" },
    info: { card: "border-info-soft bg-info-soft", value: "text-info" },
    error: { card: "border-error-soft bg-error-soft", value: "text-error" },
    // No `.text-accent` helper exists (unlike the four status tones), so the
    // value colour reads the token directly rather than a dead utility class.
    accent: { card: "border-accent-soft bg-accent-soft", value: "text-(--accent)" },
} as const;

const TONES: Record<string, { card: string; value: string }> = {
    ...SEMANTIC_TONES,
    // Legacy colour-named aliases.
    amber: SEMANTIC_TONES.warning,
    emerald: SEMANTIC_TONES.success,
    blue: SEMANTIC_TONES.info,
    red: SEMANTIC_TONES.error,
    purple: SEMANTIC_TONES.accent,
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

    // On a tinted card the muted ink loses contrast against the raised
    // background — measured 4.45:1 on the error tone, just under the 4.5:1 AA
    // floor. Toned cards get a slightly stronger ink; untinted ones are
    // unchanged, so the default look does not move.
    const mutedInk = toneCfg ? "text-foreground/75" : "text-muted-foreground";

    // Compact row layout — icon and label share a line, value underneath.
    if (inline) {
        return (
            <div className={cn("card p-4", toneCfg?.card, className)}>
                <div className={cn("flex items-center gap-2 text-sm", mutedInk)}>
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
                <div className={cn("text-sm", mutedInk)}>{label}</div>
                {/* No /60 on the muted ink: `text-muted-foreground` is already the
                    faintest step in the ramp, and knocking it to 60% put this
                    12px line at 2.42:1 on a white card — measured on Yunxin's
                    analytics stat grid. */}
                {subtext && <div className={cn("text-xs mt-1", toneCfg ? "text-foreground/75" : "text-muted-foreground")}>{subtext}</div>}
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
