"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

export interface SegmentedOption<T = string> {
    value: T;
    label: string;
    desc?: string;
    icon?: LucideIcon;
}

interface SegmentedSelectProps<T = string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    disabled?: boolean;
}

export function SegmentedSelect<T = string>({
    options,
    value,
    onChange,
    className,
    disabled = false,
}: SegmentedSelectProps<T>) {
    return (
        <div className={cn("flex gap-1 flex-wrap", className)}>
            {options.map((opt) => {
                const Icon = opt.icon;
                return (
                    <button
                        key={String(opt.value)}
                        onClick={() => !disabled && onChange(opt.value)}
                        disabled={disabled}
                        title={opt.desc}
                        className={cn(
                            "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-lg whitespace-nowrap transition-all duration-150 ease cursor-pointer outline-none",
                            value === opt.value
                                ? "text-foreground border-border-strong bg-accent-subtle hover:bg-accent-muted hover:shadow-xs"
                                : "text-muted-foreground border-border-default bg-muted/50 hover:text-foreground hover:border-border-strong hover:bg-muted",
                            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        {Icon && <Icon size={14} />}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
