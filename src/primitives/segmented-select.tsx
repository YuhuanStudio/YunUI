"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

export interface SegmentedOption<T = string> {
    /** The value reported to `onChange` when selected. */
    value: T;
    /** Display text for the segment. */
    label: string;
    /** Optional native tooltip (`title`) for the segment. */
    desc?: string;
    /** Optional Lucide icon shown before the label. */
    icon?: LucideIcon;
}

interface SegmentedSelectProps<T = string> {
    /** The selectable segments. */
    options: SegmentedOption<T>[];
    /** Currently selected value (controlled). */
    value: T;
    /** Called with the chosen segment's value. */
    onChange: (value: T) => void;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
}

/** Inline segmented control — a row of buttons where one option is active at a time. */
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
                        type="button"
                        onClick={() => !disabled && onChange(opt.value)}
                        disabled={disabled}
                        aria-pressed={value === opt.value}
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
