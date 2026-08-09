"use client";

import { type ReactNode } from "react";
import { Globe, Clock, LogOut, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { NavStateIndicator } from "./nav-state-indicator";

// =====================================================
// SESSION ITEM
// One row in an "active sessions / signed-in devices" list: a device glyph,
// the device name with current / inactive badges, a browser·OS detail line, an
// IP + last-seen footer, and a revoke button. Presentation only — the host maps
// the device type to an icon, formats the time, and owns the revoke action.
// =====================================================

export interface SessionItemProps {
    /** Device glyph (host maps the device type to an icon). */
    icon?: ReactNode;
    /** Device name / label. */
    name: ReactNode;
    /** Secondary detail line, e.g. "Chrome on macOS". */
    detail?: ReactNode;
    /** IP address (rendered after a globe glyph). */
    ip?: ReactNode;
    /** Host-formatted relative time (rendered after a clock glyph). */
    time?: ReactNode;
    /** Marks the current session — shows a badge and hides the revoke button. */
    current?: boolean;
    /** Dims the row and shows an "inactive" badge. */
    inactive?: boolean;
    /** Marks the row selected without adding a badge. */
    selected?: boolean;
    /** Shows a pulsing leading activity rail and exposes aria-busy. */
    running?: boolean;
    /** Revoke handler — when set (and not current), shows the revoke button. */
    onRevoke?: () => void;
    revoking?: boolean;
    /** Every string this row renders. See CONTRIBUTING.md — a component
     *  needing more than one auxiliary string groups them here. */
    labels?: {
        /** Badge on the current session. */
        current?: ReactNode;
        /** Badge on a dimmed / inactive session. */
        inactive?: ReactNode;
        /** Announced to screen readers while `running`. */
        running?: ReactNode;
        /** Accessible name of the revoke button. */
        revoke?: string;
    };
    className?: string;
}

export function SessionItem({
    icon,
    name,
    detail,
    ip,
    time,
    current,
    inactive,
    selected,
    running,
    onRevoke,
    revoking,
    labels,
    className,
}: SessionItemProps) {
    return (
        <div
            data-selected={selected || undefined}
            data-running={running || undefined}
            aria-busy={running || undefined}
            className={cn(
                "relative flex items-start gap-3 overflow-hidden rounded-lg bg-(--bg-elevated) p-2",
                selected && "text-foreground",
                inactive && "opacity-50",
                className,
            )}
        >
            {(selected || running) && (
                <NavStateIndicator
                    active
                    running={running}
                    data-session-activity-rail
                />
            )}
            {running && labels?.running != null && <span className="sr-only">{labels?.running}</span>}
            {icon != null && <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">{icon}</div>}
            <div className="flex-1 min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="block min-w-0 flex-1 truncate text-xs font-medium">{name}</span>
                    {current && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full badge-success shrink-0">
                            {labels?.current}
                        </span>
                    )}
                    {inactive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full badge-neutral shrink-0">
                            {labels?.inactive}
                        </span>
                    )}
                </div>
                {detail && <div className="text-[10px] text-(--text-tertiary) mt-0.5 truncate">{detail}</div>}
                {(ip != null || time != null) && (
                    <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-(--text-tertiary)">
                        {ip != null && (
                            <span className="flex items-center gap-0.5">
                                <Globe size={8} />
                                {ip}
                            </span>
                        )}
                        {time != null && (
                            <span className="flex items-center gap-0.5">
                                <Clock size={8} />
                                {time}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {!current && onRevoke && (
                <button
                    type="button"
                    onClick={onRevoke}
                    disabled={revoking}
                    aria-label={labels?.revoke}
                    title={labels?.revoke}
                    className="p-1.5 hover:bg-error-soft rounded text-(--text-tertiary) hover:text-error transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {revoking ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                </button>
            )}
        </div>
    );
}
