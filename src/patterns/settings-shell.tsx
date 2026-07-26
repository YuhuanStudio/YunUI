"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../primitives";
import { NavStateIndicator } from "./nav-state-indicator";

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
    const activeItem = items.find((item) => item.key === value);
    const ActiveIcon = activeItem?.icon;
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
                                                "nav-item w-full text-left",
                                                active && "active",
                                            )}
                                            aria-current={active ? "page" : undefined}
                                            onClick={() => onValueChange(item.key)}
                                        >
                                            <NavStateIndicator active={active} />
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
                    <Select value={value} onValueChange={onValueChange}>
                        <SelectTrigger aria-label={navigationLabel} className="h-10 bg-background">
                            <span className="flex min-w-0 items-center gap-2">
                                {ActiveIcon ? <ActiveIcon aria-hidden size={16} strokeWidth={1.75} className="shrink-0 text-muted-foreground" /> : null}
                                <SelectValue />
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            {groups.map((group) => (
                                <div key={group.key}>
                                    {group.label ? (
                                        <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                            {group.label}
                                        </div>
                                    ) : null}
                                    {group.items.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </div>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className={cn("min-h-0 flex-1 overflow-hidden", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
}
