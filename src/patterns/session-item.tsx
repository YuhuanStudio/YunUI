"use client";

import { type ReactNode } from "react";
import { Globe, Clock, LogOut, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

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
    currentLabel?: ReactNode;
    /** Dims the row and shows an "inactive" badge. */
    inactive?: boolean;
    inactiveLabel?: ReactNode;
    /** Revoke handler — when set (and not current), shows the revoke button. */
    onRevoke?: () => void;
    revoking?: boolean;
    revokeLabel?: string;
    className?: string;
}

export function SessionItem({
    icon,
    name,
    detail,
    ip,
    time,
    current,
    currentLabel,
    inactive,
    inactiveLabel,
    onRevoke,
    revoking,
    revokeLabel,
    className,
}: SessionItemProps) {
    return (
        <div className={cn("flex items-start gap-3 p-2 rounded-lg bg-(--bg-elevated) relative", inactive && "opacity-50", className)}>
            {icon != null && <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">{icon}</div>}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate">{name}</span>
                    {current && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shrink-0">
                            {currentLabel}
                        </span>
                    )}
                    {inactive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                            {inactiveLabel}
                        </span>
                    )}
                </div>
                {detail && <div className="text-[10px] text-(--text-tertiary) mt-0.5">{detail}</div>}
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
                    aria-label={revokeLabel}
                    title={revokeLabel}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-(--text-tertiary) hover:text-red-500 transition-colors shrink-0"
                >
                    {revoking ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                </button>
            )}
        </div>
    );
}
