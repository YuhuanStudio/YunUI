"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SettingsNavItem {
    key: string;
    label: ReactNode;
    icon?: ElementType;
}

export interface SettingsNavGroup {
    key: string;
    label?: ReactNode;
    items: SettingsNavItem[];
}

export interface SettingsShellProps {
    /** Dialog/page heading. Pass the host's accessible title primitive here. */
    header: ReactNode;
    groups: SettingsNavGroup[];
    value: string;
    onValueChange: (key: string) => void;
    children: ReactNode;
    navigationLabel?: string;
    className?: string;
    sidebarClassName?: string;
    contentClassName?: string;
}

/**
 * Canonical settings layout: grouped desktop navigation, compact mobile
 * navigation and one scroll-safe content lane. The host owns the active panel
 * and dialog lifecycle; YunUI owns all navigation spacing and active states.
 */
export function SettingsShell({
    header,
    groups,
    value,
    onValueChange,
    children,
    navigationLabel = "Settings",
    className,
    sidebarClassName,
    contentClassName,
}: SettingsShellProps) {
    const items = groups.flatMap((group) => group.items);
    return (
        <div className={cn("flex h-full min-h-0", className)}>
            <aside
                className={cn(
                    "hidden w-56 shrink-0 flex-col border-r border-border bg-muted/15 sm:flex",
                    sidebarClassName,
                )}
            >
                <div className="shrink-0 px-6 pb-4 pt-6">{header}</div>
                <nav
                    aria-label={navigationLabel}
                    className="min-h-0 flex-1 overflow-y-auto px-3 pb-5"
                >
                    {groups.map((group, groupIndex) => (
                        <section
                            key={group.key}
                            aria-label={typeof group.label === "string" ? group.label : undefined}
                            className={cn(groupIndex > 0 && "mt-4 border-t border-border/70 pt-4")}
                        >
                            {group.label ? (
                                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                    {group.label}
                                </div>
                            ) : null}
                            <div className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = item.key === value;
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            className={cn(
                                                "flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors",
                                                "hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                active && "bg-muted text-foreground",
                                            )}
                                            aria-current={active ? "page" : undefined}
                                            onClick={() => onValueChange(item.key)}
                                        >
                                            {Icon ? <Icon aria-hidden size={18} strokeWidth={1.75} className="shrink-0" /> : null}
                                            <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-border px-4 pb-3 pt-4 sm:hidden">
                    <div className="mb-3">{header}</div>
                    <nav
                        aria-label={navigationLabel}
                        className="flex gap-1 overflow-x-auto overscroll-x-contain pb-1"
                    >
                        {items.map((item) => {
                            const Icon = item.icon;
                            const active = item.key === value;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => onValueChange(item.key)}
                                    className={cn(
                                        "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors",
                                        "hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        active && "bg-muted text-foreground",
                                    )}
                                >
                                    {Icon ? <Icon aria-hidden size={16} strokeWidth={1.75} /> : null}
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className={cn("min-h-0 flex-1 overflow-hidden", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
}
