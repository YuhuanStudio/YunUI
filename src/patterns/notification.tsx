"use client";

import { type ReactNode } from "react";
import { Bell, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

// =====================================================
// NOTIFICATION
// Presentational notification primitives — a bell trigger with an unread badge,
// a single notification row, and the dropdown panel chrome. The HOST owns data
// fetching, auth, polling, mark-as-read and the open/close state; these just
// render. Copy is passed in (no bundled i18n); routing uses the adapter Link.
// =====================================================

/** An icon trigger (the bell) carrying an unread-count badge. */
export interface NotificationBellProps {
    /** Unread count; the badge is hidden when 0 / undefined. */
    count?: number;
    /** Cap the displayed number — above it shows `{max}+`. */
    max?: number;
    /** Accessible label for the trigger. */
    label?: string;
    /** Override the bell glyph. */
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function NotificationBell({ count = 0, max = 99, label, icon, onClick, className }: NotificationBellProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
                "relative flex items-center justify-center rounded-lg px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
            )}
        >
            {icon ?? <Bell size={18} />}
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--error) text-[10px] font-bold text-pure-white px-1">
                    {count > max ? `${max}+` : count}
                </span>
            )}
        </button>
    );
}

/** A single notification row: type glyph · title + body · time, optionally a
 *  link (adapter Link) and a hover dismiss button. */
export interface NotificationItemProps {
    /** Type glyph — the host renders it (e.g. an icon for the notification type). */
    icon?: ReactNode;
    /** Tint classes for the icon square (bg + text color). */
    iconClassName?: string;
    title: ReactNode;
    body?: ReactNode;
    /** Host-formatted relative time (e.g. "2h"). */
    time?: ReactNode;
    /** Unread rows read bolder; read rows are muted. */
    unread?: boolean;
    /** Optional target — when set the row is an adapter `<Link>`. */
    href?: string;
    /** Fires on row activation (also use to close the panel). */
    onSelect?: () => void;
    /** Show a hover dismiss (trash) button. */
    dismissible?: boolean;
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}

export function NotificationItem({
    icon,
    iconClassName,
    title,
    body,
    time,
    unread,
    href,
    onSelect,
    dismissible,
    onDismiss,
    dismissLabel,
    className,
}: NotificationItemProps) {
    const { Link } = useYunUI();

    const inner = (
        <>
            {icon != null && (
                <div className={cn("shrink-0 rounded-lg p-1.5", iconClassName ?? "bg-muted")}>{icon}</div>
            )}
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm leading-snug truncate", unread ? "font-medium" : "text-muted-foreground")}>
                    {title}
                </p>
                {body && <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">{body}</p>}
            </div>
            {time != null && <span className="shrink-0 self-center text-[10px] text-muted-foreground/50">{time}</span>}
        </>
    );

    const rowClass = cn("flex items-center gap-2.5 px-3 py-2.5", dismissible ? "pr-9" : "pr-3");

    return (
        <div className={cn("group/notif relative rounded-xl hover:bg-foreground/5 transition-colors", className)}>
            {href ? (
                <Link href={href} onClick={onSelect} className={rowClass}>
                    {inner}
                </Link>
            ) : (
                <button type="button" onClick={onSelect} className={cn(rowClass, "w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-xl")}>
                    {inner}
                </button>
            )}
            {dismissible && (
                <button
                    type="button"
                    aria-label={dismissLabel}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDismiss?.();
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg opacity-0 group-hover/notif:opacity-100 group-focus-within/notif:opacity-100 hover:bg-muted transition-all outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Trash2 size={12} className="text-muted-foreground/40 hover:text-error" />
                </button>
            )}
        </div>
    );
}

/** The dropdown panel chrome: header (title + unread count), a scrollable list
 *  with loading / empty states, and a footer slot (e.g. a "view all" link).
 *  Render `<NotificationItem>`s as children. */
export interface NotificationPanelProps {
    title: ReactNode;
    /** Unread count shown in the header; hidden when 0. */
    unreadCount?: number;
    /** Word rendered after the count (e.g. "unread"). */
    unreadLabel?: ReactNode;
    loading?: boolean;
    loadingLabel?: ReactNode;
    /** When true (and not loading) the empty state replaces the children. */
    empty?: boolean;
    emptyLabel?: ReactNode;
    /** Footer slot — typically a centered "view all" adapter Link. */
    footer?: ReactNode;
    /** The notification rows. */
    children?: ReactNode;
    className?: string;
}

export function NotificationPanel({
    title,
    unreadCount = 0,
    unreadLabel,
    loading,
    loadingLabel,
    empty,
    emptyLabel,
    footer,
    children,
    className,
}: NotificationPanelProps) {
    return (
        <div
            className={cn(
                "w-80 sm:w-[400px] rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl shadow-lg shadow-black/5",
                className,
            )}
        >
            <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-sm font-semibold">{title}</h3>
                {unreadCount > 0 && (
                    <span className="text-[10px] font-medium text-primary">
                        {unreadCount}
                        {unreadLabel ? <> {unreadLabel}</> : null}
                    </span>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto px-2 pb-2 flex flex-col gap-1">
                {loading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">{loadingLabel}</div>
                ) : empty ? (
                    <div className="p-6 text-center">
                        <Bell size={24} className="mx-auto mb-2 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
                    </div>
                ) : (
                    children
                )}
            </div>

            {footer && (
                <div className="text-center text-xs text-muted-foreground hover:text-foreground transition-colors [&>a]:block [&>a]:py-2.5">
                    {footer}
                </div>
            )}
        </div>
    );
}
