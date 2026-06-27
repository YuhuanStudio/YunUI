"use client";

import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

// =====================================================
// LINK ROW
// A tappable row that links somewhere: a leading icon, a title + description,
// and a trailing chevron. Used for support links, settings navigation, "manage
// X" entries. External links open in a new tab; internal ones use the adapter
// Link. Presentation only.
// =====================================================

export interface LinkRowProps {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /** Destination. */
    href: string;
    /** Open in a new tab via a plain anchor (default false → adapter Link). */
    external?: boolean;
    className?: string;
}

export function LinkRow({ icon, title, description, href, external, className }: LinkRowProps) {
    const { Link } = useYunUI();

    const inner = (
        <>
            {icon != null && <span className="text-(--text-tertiary) shrink-0">{icon}</span>}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{title}</div>
                {description && <div className="text-xs text-(--text-tertiary) truncate">{description}</div>}
            </div>
            <ChevronRight size={16} className="text-(--text-muted) shrink-0" />
        </>
    );

    const cls = cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-(--bg-elevated) transition-colors",
        className,
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
            </a>
        );
    }
    return (
        <Link href={href} className={cls}>
            {inner}
        </Link>
    );
}
