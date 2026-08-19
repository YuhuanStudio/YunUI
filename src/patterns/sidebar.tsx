"use client";

import { type ElementType, type ReactNode, useEffect, useMemo, useRef } from "react";
import { X, PanelLeftClose } from "lucide-react";
import { IconButton } from "../index";
import { useYunUI } from "../adapters/context";
import { NavStateIndicator } from "./nav-state-indicator";
import { cn } from "../lib/cn";

export interface SidebarNavItem {
    /** Link text. */
    label: string;
    /** Destination href; also the basis for active-state matching. */
    href: string;
    /** Optional leading icon component. */
    icon?: ElementType;
    /** Extra path prefixes that should also mark this item active. */
    match?: string[];
}

export interface SidebarSection {
    /** Optional section heading. */
    title?: string;
    /** Nav items in this section. */
    items: SidebarNavItem[];
}

export interface SidebarProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src. @defaultValue "/favicon.ico" */
    logoSrc?: string;
    /** Where the logo links to. @defaultValue "/" */
    homeHref?: string;
    /** Grouped navigation sections. */
    sections: SidebarSection[];
    /** Used to compute the active item. */
    currentPath?: string;
    /** Mobile drawer open state. */
    isOpen?: boolean;
    /** Called to close the mobile drawer. */
    onClose?: () => void;
    /** Desktop collapse state (hides the sidebar off-canvas). */
    collapsed?: boolean;
    /** Called to toggle the desktop collapse state (also renders the collapse button when set). */
    onToggleCollapse?: () => void;
    /**
     * Called when a nav item is clicked. When provided, default link navigation
     * is prevented and the host owns routing (useful in SPAs / demos). When
     * omitted, items navigate via the injected Link adapter.
     */
    onNavigate?: (href: string) => void;
    /** Bottom-pinned slot (balance card, user card, etc.). */
    footer?: ReactNode;
    /** Accessible label for the close/collapse buttons. @defaultValue "Close" */
    closeLabel?: string;
    /** While true, the nav (and footer slot) render shimmer skeletons. */
    loading?: boolean;
    /** sessionStorage key for persisting nav scroll position across navigations. */
    scrollStorageKey?: string;
    /** Fixed application rail or an in-flow shell owned by the host layout. */
    layout?: "fixed" | "inline";
    /** Replaces the built-in logo row while retaining the Sidebar shell. */
    header?: ReactNode;
    /** Replaces generated sections with custom dynamic Sidebar content. */
    children?: ReactNode;
    /** Additional shell classes. */
    className?: string;
    /** Landmark role for custom application layouts. */
    role?: "navigation" | "complementary";
    /** Accessible name for the Sidebar landmark. */
    ariaLabel?: string;
}

/** How strongly an item claims `currentPath`: the length of its longest matching prefix, or
 *  -1 when nothing matches.
 *
 *  A prefix only counts on a path-segment boundary, so `/reports` never claims `/reports-archive`.
 *  The caller compares strengths across the whole nav and lights only the strongest, because a
 *  parent entry is a prefix of every child: on `/dashboard/playground`, plain `startsWith` lit
 *  both "Overview" (`/dashboard`) and "Playground" at once. */
function matchStrength(item: SidebarNavItem, currentPath: string, homeHref: string): number {
    let best = -1;
    for (const prefix of [item.href, ...(item.match ?? [])]) {
        if (currentPath === prefix) best = Math.max(best, prefix.length);
        else if (prefix !== homeHref && currentPath.startsWith(prefix.replace(/\/$/, "") + "/")) {
            best = Math.max(best, prefix.length);
        }
    }
    return best;
}

/** App navigation sidebar: logo, grouped nav sections with active-state matching, a mobile drawer, desktop collapse, and a footer slot. */
export function Sidebar({
    appName,
    logoSrc = "/favicon.ico",
    homeHref = "/",
    sections,
    currentPath = "",
    isOpen = false,
    onClose,
    collapsed = false,
    onToggleCollapse,
    onNavigate,
    footer,
    closeLabel = "Close",
    loading = false,
    scrollStorageKey = "yunui-sidebar-scroll",
    layout = "fixed",
    header,
    children,
    className,
    role = "navigation",
    ariaLabel = "Main navigation",
}: SidebarProps) {
    const { Link, Image } = useYunUI();
    const navRef = useRef<HTMLElement>(null);

    // The whole nav decides together: only the item with the longest matching prefix lights up,
    // so a section root does not stay highlighted alongside the child page you are actually on.
    const strongestMatch = useMemo(
        () =>
            sections.reduce(
                (best, section) =>
                    section.items.reduce((inner, item) => Math.max(inner, matchStrength(item, currentPath, homeHref)), best),
                -1,
            ),
        [sections, currentPath, homeHref],
    );

    // Persist + restore the nav scroll position across navigations (Yunxin parity).
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        const saved = sessionStorage.getItem(scrollStorageKey);
        if (saved) nav.scrollTop = parseInt(saved, 10);
        // Persist at most once per frame: a synchronous sessionStorage write on
        // every scroll event is wasteful on a list that scrolls fast.
        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                sessionStorage.setItem(scrollStorageKey, String(nav.scrollTop));
            });
        };
        nav.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (frame) cancelAnimationFrame(frame);
            nav.removeEventListener("scroll", onScroll);
        };
    }, [scrollStorageKey]);

    return (
        <>
            {/* Mobile overlay */}
            {layout === "fixed" && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                role={role}
                aria-label={ariaLabel}
                className={cn(
                    "min-w-64 w-64 bg-(--bg-base) border-r border-(--border-hairline) flex flex-col",
                    layout === "fixed"
                        ? "fixed inset-y-0 left-0 z-50 h-dvh transition-transform duration-200 ease-in-out"
                        : "relative z-0 h-full min-w-0 w-full",
                    layout === "fixed" && (
                        isOpen
                            ? "translate-x-0"
                            : collapsed
                                ? "-translate-x-full"
                                : "-translate-x-full lg:translate-x-0"
                    ),
                    className,
                )}
            >
                {/* Logo */}
                {header !== undefined ? header : <div className="py-3 px-3 shrink-0">
                    <div className="flex items-center py-2 pl-0 pr-1 gap-2">
                        <Link href={homeHref} className="flex-1 min-w-0 flex items-center gap-2.5 rounded-lg pl-3 pr-3 py-1.5 hover:bg-foreground/5 transition-colors duration-200">
                            <Image src={logoSrc} alt={appName} width={36} height={36} className="shrink-0" />
                            <span className="font-semibold text-[18px] truncate">{appName}</span>
                        </Link>
                        {onToggleCollapse && (
                            <>
                                <div className="h-4 w-px bg-(--border-hairline) shrink-0" />
                                <button
                                    onClick={onToggleCollapse}
                                    className="hidden lg:flex shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    aria-label={closeLabel}
                                >
                                    <PanelLeftClose size={18} />
                                </button>
                            </>
                        )}
                        {onClose && (
                            <IconButton icon={<X size={20} />} label={closeLabel} onClick={onClose} className="lg:hidden" />
                        )}
                    </div>
                </div>}

                {/* Navigation */}
                {children != null ? (
                    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
                ) : <nav ref={navRef} className="flex-1 overflow-y-auto py-3 px-3">
                    {loading ? (
                        <div className="space-y-2 animate-pulse">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-9 rounded-lg bg-foreground/5" />
                            ))}
                        </div>
                    ) : (
                    sections.map((section, i) => (
                        <div key={i} className={i > 0 ? "mt-4" : ""}>
                            {section.title && <div className="nav-section">{section.title}</div>}
                            {section.items.map((item) => {
                                const active =
                                    strongestMatch >= 0 &&
                                    matchStrength(item, currentPath, homeHref) === strongestMatch;
                                const Icon = item.icon;
                                const content = (
                                    <>
                                        <NavStateIndicator active={active} />
                                        {Icon && <Icon size={18} strokeWidth={1.75} className="shrink-0" />}
                                        <span className="flex-1 min-w-0 truncate">{item.label}</span>
                                    </>
                                );
                                const className = `nav-item ${active ? "active" : ""}`;
                                return onNavigate ? (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate(item.href);
                                            onClose?.();
                                        }}
                                        className={className}
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <Link key={item.href} href={item.href} onClick={() => onClose?.()} className={className}>
                                        {content}
                                    </Link>
                                );
                            })}
                        </div>
                    )))}
                </nav>}

                {/* Footer slot */}
                {footer && <div className="p-3 shrink-0">{footer}</div>}
            </aside>
        </>
    );
}
