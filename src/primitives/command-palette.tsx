"use client";

import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";
import { Spinner } from "./index";

export interface CommandPaletteItem {
    id: string;
    /** Primary line. */
    title: ReactNode;
    /** Secondary line under the title. */
    description?: ReactNode;
    /** Leading glyph. */
    icon?: ReactNode;
    /** Group heading this item sits under. */
    group?: string;
    /** Run on select. */
    onSelect?: () => void;
    /**
     * Navigate here on select. When set, the row renders as a real anchor
     * (through the adapter's `Link`) rather than a button — so ⌘-click,
     * middle-click and "open in new tab" work, and the destination shows in the
     * status bar. A search result is a link; a command is a button.
     */
    href?: string;
}

export interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    /** Current query — controlled, so the host can drive a remote search. */
    query: string;
    onQueryChange: (query: string) => void;
    /** Results to show. */
    items?: CommandPaletteItem[];
    /** Show a spinner in place of the list. */
    loading?: boolean;
    /** Rendered when there is a query but no results. */
    empty?: ReactNode;
    /** Rendered before anything is typed — recents, shortcuts, tips. */
    initial?: ReactNode;
    /**
     * A hint bar under the list — result counts, keyboard legends. Omit it and
     * the bar is not rendered at all.
     */
    footer?: ReactNode;
    /** Every string this renders. */
    labels?: { placeholder?: string; title?: string; close?: string };
    className?: string;
}

/**
 * The ⌘K command palette: a centered overlay with one input, a keyboard-driven
 * result list, and Escape to leave.
 *
 * Controlled on purpose — `query` and `items` live with the host, so the same
 * component covers a local fuzzy filter and a debounced server search without
 * knowing which it is. Pair it with {@link useCommandPaletteShortcut}.
 *
 * Arrow keys move the cursor and Enter selects, so the list is reachable
 * without touching the mouse; the cursor resets whenever the results change so
 * it never points at a row that has scrolled out from under it.
 */
export function CommandPalette({
    open,
    onClose,
    query,
    onQueryChange,
    items = [],
    loading = false,
    empty,
    initial,
    footer,
    labels,
    className,
}: CommandPaletteProps) {
    const { Link } = useYunUI();
    const [cursor, setCursor] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const listId = useId();

    useEffect(() => setMounted(true), []);

    // A new result set invalidates the old cursor — keeping it would leave the
    // highlight on a row that is no longer there.
    useEffect(() => setCursor(0), [items]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // The page behind must not scroll while the palette owns the screen.
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    const select = useCallback(
        (item: CommandPaletteItem | undefined) => {
            if (!item) return;
            item.onSelect?.();
            onClose();
        },
        [onClose],
    );

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            onClose();
            return;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (items.length === 0) return;
            setCursor((c) => {
                const next = event.key === "ArrowDown" ? c + 1 : c - 1;
                // Wrap, so holding one arrow key still reaches every row.
                const wrapped = (next + items.length) % items.length;
                listRef.current
                    ?.querySelectorAll("[data-command-item]")
                    [wrapped]?.scrollIntoView({ block: "nearest" });
                return wrapped;
            });
            return;
        }
        if (event.key === "Enter") {
            const item = items[cursor];
            // An href row is an anchor: let the browser follow it (which also
            // keeps ⌘-Enter opening a new tab) and just close behind it.
            if (item?.href) {
                listRef.current
                    ?.querySelectorAll<HTMLElement>("[data-command-item]")
                    [cursor]?.click();
                return;
            }
            event.preventDefault();
            select(item);
        }
    };

    // Group headings are derived, so the host just tags items.
    const grouped = useMemo(() => {
        const out: { group?: string; items: CommandPaletteItem[] }[] = [];
        for (const item of items) {
            const last = out[out.length - 1];
            if (last && last.group === item.group) last.items.push(item);
            else out.push({ group: item.group, items: [item] });
        }
        return out;
    }, [items]);

    if (!open || !mounted) return null;

    let index = -1;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={labels?.title ?? "Search"}
            className="fixed inset-0 z-100 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                onKeyDown={onKeyDown}
                className={cn(
                    "w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-lg shadow-black/5 backdrop-blur-2xl",
                    className,
                )}
            >
                <div className="flex items-center gap-2.5 border-b border-border px-4">
                    <Search aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={labels?.placeholder ?? "Search…"}
                        // 16px: anything smaller and iOS Safari zooms the page in
                        // when the field takes focus.
                        className="h-12 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
                        autoComplete="off"
                        spellCheck={false}
                        role="combobox"
                        aria-expanded={items.length > 0}
                        aria-controls={listId}
                        aria-activedescendant={items.length ? `${listId}-${cursor}` : undefined}
                    />
                    {loading && <Spinner className="h-4 w-4 shrink-0" />}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={labels?.close ?? "Close"}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-label={labels?.title ?? "Search"}
                    className="max-h-[55vh] overflow-y-auto p-1.5"
                    tabIndex={-1}
                >
                    {loading && items.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">…</div>
                    ) : items.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            {query ? empty : initial}
                        </div>
                    ) : (
                        grouped.map((section, s) => (
                            <div key={section.group ?? s}>
                                {section.group && (
                                    <div className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                        {section.group}
                                    </div>
                                )}
                                {section.items.map((item) => {
                                    index += 1;
                                    const active = index === cursor;
                                    const myIndex = index;
                                    const rowClass = cn(
                                        "flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition-colors outline-none",
                                        active ? "bg-foreground/5" : "hover:bg-foreground/5",
                                    );
                                    const body = (
                                        <>
                                            {item.icon && (
                                                <span className="mt-0.5 shrink-0 text-muted-foreground">
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm">{item.title}</span>
                                                {item.description && (
                                                    <span className="text-caption block truncate">
                                                        {item.description}
                                                    </span>
                                                )}
                                            </span>
                                        </>
                                    );
                                    const shared = {
                                        id: `${listId}-${myIndex}`,
                                        role: "option" as const,
                                        "aria-selected": active,
                                        "data-command-item": true,
                                        onMouseEnter: () => setCursor(myIndex),
                                        className: rowClass,
                                    };
                                    return item.href ? (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            {...shared}
                                            onClick={() => {
                                                item.onSelect?.();
                                                onClose();
                                            }}
                                        >
                                            {body}
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.id}
                                            type="button"
                                            {...shared}
                                            onClick={() => select(item)}
                                        >
                                            {body}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {footer != null && (
                    <div className="text-caption flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}

/**
 * Opens the palette on ⌘K / Ctrl-K. Kept separate so a host that already owns a
 * shortcut layer can skip it.
 */
export function useCommandPaletteShortcut(onOpen: () => void) {
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                onOpen();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onOpen]);
}
