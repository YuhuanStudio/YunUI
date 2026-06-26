"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// SETTING ROW
// One labelled row in a settings / preferences list: a title, an optional
// description, and a trailing control slot (a Switch, Select, button…). Stack
// several — the bottom border divides them and the last one drops it.
// =====================================================

export interface SettingRowProps {
    title: ReactNode;
    description?: ReactNode;
    /** The trailing control (e.g. a `<Switch>`). */
    control?: ReactNode;
    className?: string;
}

export function SettingRow({ title, description, control, className }: SettingRowProps) {
    return (
        <div className={cn("flex items-center justify-between gap-4 py-3 border-b border-border last:border-0", className)}>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{title}</div>
                {description && (
                    <div className="text-xs text-(--text-tertiary) mt-0.5 leading-relaxed whitespace-normal wrap-break-word">
                        {description}
                    </div>
                )}
            </div>
            {control != null && <div className="shrink-0">{control}</div>}
        </div>
    );
}
