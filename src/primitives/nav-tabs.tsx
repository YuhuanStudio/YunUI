"use client";

import type { ReactNode } from "react";
import { useYunUI } from "../adapters/context";

export interface NavTab {
    key: string;
    label: ReactNode;
    /** When set, the tab renders as a route Link instead of a button. */
    href?: string;
}

interface NavTabsProps {
    tabs: NavTab[];
    activeKey: string;
    /** Called for button-mode (in-page) tabs. Ignored when tabs use `href`. */
    onChange?: (key: string) => void;
    className?: string;
    ariaLabel?: string;
}

/**
 * The canonical horizontal tab bar. Each tab owns its indicator (the `.nav-tab`
 * `::after`), which slides in + fades + grows exactly like the sidebar's
 * per-item active bar, just rotated to the bottom edge and sitting inside the
 * tab's floating hover box. Hovering raises that soft rounded box (懸浮框).
 */
export function NavTabs({ tabs, activeKey, onChange, className = "", ariaLabel }: NavTabsProps) {
    const { Link } = useYunUI();
    return (
        <div className={className}>
            <nav className="flex items-center gap-1 overflow-x-auto" aria-label={ariaLabel}>
                {tabs.map((tab) => {
                    const active = tab.key === activeKey;
                    const cls = `nav-tab ${active ? "active" : ""}`;
                    return tab.href ? (
                        <Link key={tab.key} href={tab.href} className={cls} aria-current={active ? "page" : undefined}>
                            {tab.label}
                        </Link>
                    ) : (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange?.(tab.key)}
                            className={cls}
                            aria-current={active ? "true" : undefined}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
