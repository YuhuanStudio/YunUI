"use client";

import { type ElementType, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface StatCardProps {
    icon?: ElementType;
    label: string;
    value: ReactNode;
    /** Optional trend chip, e.g. "+12%". */
    trend?: { value: string; direction?: "up" | "down" | "neutral" };
    className?: string;
}

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
    const dir = trend?.direction ?? "neutral";
    return (
        <div className={cn("stat-card p-4", className)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-label">{label}</span>
                {Icon && <Icon size={16} className="text-muted-foreground" />}
            </div>
            <div className="flex items-end justify-between gap-2">
                <div className="stat-number text-2xl font-semibold tracking-tight">{value}</div>
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            dir === "up" && "text-emerald-600 dark:text-emerald-400",
                            dir === "down" && "text-red-600 dark:text-red-400",
                            dir === "neutral" && "text-muted-foreground"
                        )}
                    >
                        {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}
