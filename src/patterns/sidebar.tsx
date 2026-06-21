"use client";

import { type ElementType, type ReactNode } from "react";
import { X, PanelLeftClose } from "lucide-react";
import { IconButton } from "../index";
import { useYunUI } from "../adapters/context";

export interface SidebarNavItem {
    label: string;
    href: string;
    icon?: ElementType;
    /** Extra path prefixes that should also mark this item active. */
    match?: string[];
}

export interface SidebarSection {
    title?: string;
    items: SidebarNavItem[];
}

export interface SidebarProps {
    appName: string;
    logoSrc?: string;
    homeHref?: string;
    sections: SidebarSection[];
    /** Used to compute the active item. */
    currentPath?: string;
    /** Mobile drawer open state. */
    isOpen?: boolean;
    onClose?: () => void;
    /** Desktop collapse state (hides the sidebar off-canvas). */
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    /**
     * Called when a nav item is clicked. When provided, default link navigation
     * is prevented and the host owns routing (useful in SPAs / demos). When
     * omitted, items navigate via the injected Link adapter.
     */
    onNavigate?: (href: string) => void;
    /** Bottom-pinned slot (balance card, user card, etc.). */
    footer?: ReactNode;
    closeLabel?: string;
}

function isItemActive(item: SidebarNavItem, currentPath: string, homeHref: string): boolean {
    if (currentPath === item.href) return true;
    if (item.href !== homeHref && currentPath.startsWith(item.href)) return true;
    return item.match?.some((m) => currentPath.startsWith(m)) ?? false;
}

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
}: SidebarProps) {
    const { Link, Image } = useYunUI();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                role="navigation"
                aria-label="Main navigation"
                className={`
                fixed inset-y-0 left-0 z-50
                min-w-64 w-64 bg-(--bg-base) border-r border-(--border-hairline)
                flex flex-col h-dvh
                transition-transform duration-200 ease-in-out
                ${isOpen ? "translate-x-0" : collapsed ? "-translate-x-full" : "-translate-x-full lg:translate-x-0"}
            `}
            >
                {/* Logo */}
                <div className="py-3 px-3 shrink-0">
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
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-3">
                    {sections.map((section, i) => (
                        <div key={i} className={i > 0 ? "mt-4" : ""}>
                            {section.title && <div className="nav-section">{section.title}</div>}
                            {section.items.map((item) => {
                                const active = isItemActive(item, currentPath, homeHref);
                                const Icon = item.icon;
                                const content = (
                                    <>
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
                    ))}
                </nav>

                {/* Footer slot */}
                {footer && <div className="p-3 shrink-0">{footer}</div>}
            </aside>
        </>
    );
}
