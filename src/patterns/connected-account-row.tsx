"use client";

import { type ReactNode } from "react";
import { Clock, X, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

// =====================================================
// CONNECTED ACCOUNT ROW
// A row in a "connected accounts / integrations" list: a provider avatar (image
// or a glyph in a ring) with a small provider badge overlay, the account name +
// an optional sub-name, a detail line (username / email), a connected-time
// footer, and an unlink button. Presentation only — the host owns the unlink.
// =====================================================

export interface ConnectedAccountRowProps {
    /** Provider glyph, shown in a ring when there's no avatar image. */
    icon?: ReactNode;
    /** Small provider badge overlaid bottom-right. */
    badge?: ReactNode;
    /** Avatar image URL; falls back to `icon` in a ring. */
    avatarUrl?: string;
    name: ReactNode;
    /** A faint "· extra" after the name. */
    subname?: ReactNode;
    /** Detail line — e.g. @username or an email. */
    detail?: ReactNode;
    /** Host-formatted connected time (rendered after a clock glyph). */
    time?: ReactNode;
    onUnlink?: () => void;
    unlinking?: boolean;
    unlinkLabel?: string;
    className?: string;
}

export function ConnectedAccountRow({
    icon,
    badge,
    avatarUrl,
    name,
    subname,
    detail,
    time,
    onUnlink,
    unlinking,
    unlinkLabel,
    className,
}: ConnectedAccountRowProps) {
    return (
        <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-(--bg-elevated) border border-border", className)}>
            <div className="relative shrink-0">
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-border" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">{icon}</div>
                )}
                {badge != null && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-(--bg-elevated) border border-border flex items-center justify-center">
                        {badge}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{name}</span>
                    {subname != null && <span className="text-xs text-(--text-secondary) truncate">· {subname}</span>}
                </div>
                {detail != null && <div className="text-xs text-(--text-tertiary) truncate">{detail}</div>}
                {time != null && (
                    <div className="text-[10px] text-(--text-tertiary) flex items-center gap-1 mt-0.5">
                        <Clock size={8} />
                        {time}
                    </div>
                )}
            </div>
            {onUnlink && (
                <button
                    type="button"
                    onClick={onUnlink}
                    disabled={unlinking}
                    title={unlinkLabel}
                    aria-label={unlinkLabel}
                    className="p-1.5 hover:bg-error-soft rounded text-(--text-tertiary) hover:text-error transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {unlinking ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                </button>
            )}
        </div>
    );
}
