"use client";

import { useState, useMemo, useRef, useEffect, memo, type ReactNode } from "react";
import { Search, Pin, ChevronDown, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";

// =====================================================
// MODEL SELECT (generic, domain-agnostic)
// The searchable / grouped / filterable / pinnable model-picker MACHINERY,
// extracted so apps don't each re-implement it. The consumer maps its domain
// model to `ModelSelectOption` (supplying the per-row JSX as `icon`/`badges`/
// `detail`/`meta`), and owns pinning + capability filters via props. No i18n,
// no pricing, no app types live here.
// =====================================================

export interface ModelSelectOption {
    /** Stable id used as the value. */
    id: string;
    /** Display name (trigger label + primary search corpus). */
    label: string;
    /** Group key — models are grouped and provider-filtered by this. */
    group: string;
    /** Human label for the group (defaults to `group`). */
    groupLabel?: string;
    /** Extra text folded into search (ids, aliases, owner). */
    searchText?: string;
    /** Leading model icon (trigger + row). */
    icon?: ReactNode;
    /** Group/provider icon (filter chip + group header). */
    groupIcon?: ReactNode;
    /** Inline capability glyphs shown after the name. */
    badges?: ReactNode;
    /** Secondary line under the name (ids/aliases/pricing). */
    detail?: ReactNode;
    /** Right-aligned meta chip(s) (context length / max tokens). */
    meta?: ReactNode;
    disabled?: boolean;
}

/** A capability filter chip; `match` decides whether an option passes it. */
export interface ModelSelectFilter {
    key: string;
    /** Chip content (e.g. a capability badge). */
    node: ReactNode;
    title?: string;
    /** Whether an option satisfies this filter (all active filters must pass). */
    match: (option: ModelSelectOption) => boolean;
}

export interface ModelSelectLabels {
    placeholder?: string;
    search?: string;
    clearSearch?: string;
    clearFilters?: string;
    all?: string;
    pinned?: string;
    noResults?: string;
}

export interface ModelSelectProps {
    options: ModelSelectOption[];
    /** Selected option id. */
    value: string;
    onChange: (id: string) => void;
    className?: string;
    labels?: ModelSelectLabels;
    /** Controlled pinned ids. Pass with `onTogglePin` to show the pin column. */
    pinned?: string[];
    onTogglePin?: (id: string) => void;
    /** Capability filter chips. */
    filters?: ModelSelectFilter[];
    /** Optional footer bar; receives the current (filtered) result count. */
    renderFooter?: (count: number) => ReactNode;
}

/** A generic, searchable model picker: provider grouping + provider/capability
 *  filters + a pinned section + a styled dropdown. Domain-agnostic. */
export function ModelSelect({
    options,
    value,
    onChange,
    className,
    labels,
    pinned,
    onTogglePin,
    filters,
    renderFooter,
}: ModelSelectProps) {
    const L = {
        placeholder: "Select a model",
        search: "Search models…",
        clearSearch: "Clear",
        clearFilters: "Clear filters",
        all: "All",
        pinned: "Pinned",
        noResults: "No models found",
        ...labels,
    };
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const pinnedSet = useMemo(() => new Set(pinned ?? []), [pinned]);

    // Close on outside pointer (mouse + touch).
    useEffect(() => {
        const onDown = (e: MouseEvent | PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown as EventListener);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("touchstart", onDown as EventListener);
        };
    }, []);

    // On open: focus the search and bring the selected row into view.
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            inputRef.current?.focus();
            if (value && listRef.current) {
                const el = listRef.current.querySelector<HTMLElement>(`[data-model-id="${CSS.escape(value)}"]`);
                el?.scrollIntoView({ block: "center" });
            }
        }, 50);
        return () => clearTimeout(t);
    }, [isOpen, value]);

    // Providers (groups) sorted by descending count.
    const groups = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const o of options) counts[o.group] = (counts[o.group] || 0) + 1;
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([g]) => g);
    }, [options]);
    const groupLabel = useMemo(() => {
        const m: Record<string, string> = {};
        for (const o of options) if (o.groupLabel) m[o.group] = o.groupLabel;
        return m;
    }, [options]);
    const groupIcon = useMemo(() => {
        const m: Record<string, ReactNode> = {};
        for (const o of options) if (o.groupIcon && !(o.group in m)) m[o.group] = o.groupIcon;
        return m;
    }, [options]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return options.filter((o) => {
            if (q) {
                const hay = `${o.label} ${o.searchText ?? ""} ${o.group}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (activeGroup && o.group !== activeGroup) return false;
            if (activeFilters.length && filters) {
                const fs = filters.filter((f) => activeFilters.includes(f.key));
                if (!fs.every((f) => f.match(o))) return false;
            }
            return true;
        });
    }, [options, search, activeGroup, activeFilters, filters]);

    const pinnedList = filtered.filter((o) => pinnedSet.has(o.id));
    const grouped = useMemo(() => {
        const acc: Record<string, ModelSelectOption[]> = {};
        for (const o of filtered) {
            if (pinnedSet.has(o.id)) continue;
            (acc[o.group] ??= []).push(o);
        }
        return acc;
    }, [filtered, pinnedSet]);

    const selected = options.find((o) => o.id === value);

    const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const atTop = el.scrollTop <= 1;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) e.preventDefault();
    };

    const select = (id: string) => { onChange(id); setIsOpen(false); };

    // Keyboard navigation (combobox + listbox a11y): the search input keeps DOM
    // focus and drives a highlighted row via aria-activedescendant, so Arrow keys
    // move through results and Enter selects — without tabbing through every row.
    const flatOptions = useMemo(() => {
        const out: ModelSelectOption[] = [...pinnedList];
        for (const opts of Object.values(grouped)) out.push(...opts);
        return out;
    }, [pinnedList, grouped]);
    // -1 = no keyboard highlight yet. The ring only appears once the user
    // actually arrow-keys, so it never sits on the top row by default or fights
    // the mouse hover state.
    const [activeIndex, setActiveIndex] = useState(-1);
    // Reset the highlight whenever the visible set changes or the panel opens.
    useEffect(() => { setActiveIndex(-1); }, [isOpen, search, activeGroup, activeFilters]);
    // Pointer use cedes the highlight back to hover (avoids a stuck ring +
    // hover fill showing at once).
    const clearActiveOnPointer = () => setActiveIndex((i) => (i === -1 ? i : -1));
    // Keep the highlighted row scrolled into view.
    useEffect(() => {
        const id = flatOptions[activeIndex]?.id;
        if (!isOpen || !id || !listRef.current) return;
        listRef.current
            .querySelector<HTMLElement>(`[data-model-id="${CSS.escape(id)}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen, flatOptions]);
    const activeId = flatOptions[activeIndex]?.id;
    const rowDomId = (id: string) => `yunui-ms-opt-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, flatOptions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            // From "no selection" (-1), Up jumps to the last row.
            setActiveIndex((i) => (i < 0 ? flatOptions.length - 1 : Math.max(i - 1, 0)));
        } else if (e.key === "Enter") {
            e.preventDefault();
            // No row highlighted yet → Enter takes the top result (classic combobox).
            const o = flatOptions[activeIndex] ?? flatOptions[0];
            if (o) select(o.id);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        // Fixed-width root so the trigger doesn't grow/shrink as the selected
        // label changes; override the width via `className`.
        <div ref={rootRef} className={cn("relative w-64", className)}>
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 bg-card border rounded-xl text-left group transition-all w-full shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isOpen ? "border-ring/60 ring-2 ring-ring/25" : "border-border hover:border-ring",
                )}
            >
                {selected ? (
                    <>
                        {selected.icon}
                        <span className="flex-1 truncate text-sm font-medium">{selected.label}</span>
                    </>
                ) : (
                    <span className="flex-1 text-sm text-muted-foreground">{L.placeholder}</span>
                )}
                <ChevronDown size={14} className={cn("text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                    <motion.div
                        /* motion.div WITHOUT AnimatePresence: a reliable enter
                           animation on mount, and an immediate unmount on close
                           (no exit delay → close is synchronous). Fixed width so
                           the panel never reflows as you search/filter. */
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        /* w-96 (= 24rem) is a CORE utility — always generated, so the
                           panel can't fall back to a full-bleed width the way an
                           arbitrary `w-[24rem]` did when the consuming app's JIT scan
                           missed it. The small-screen cap is an inline style (not an
                           arbitrary class) so it can't silently fail to generate. */
                        style={{ maxWidth: "calc(100vw - 1rem)" }}
                        className="origin-top absolute z-50 top-full left-0 mt-2 w-96 bg-popover/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Search + capability filters */}
                        <div className="p-2.5 border-b border-border/50">
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <input
                                    ref={inputRef}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={onSearchKeyDown}
                                    placeholder={L.search}
                                    role="combobox"
                                    aria-expanded={isOpen}
                                    aria-controls="yunui-ms-listbox"
                                    aria-activedescendant={activeId ? rowDomId(activeId) : undefined}
                                    className="w-full pl-9 pr-8 py-2 text-sm bg-muted/50 border border-transparent rounded-xl outline-none focus:border-ring focus:bg-background transition-colors"
                                />
                                {search && (
                                    <button type="button" onClick={() => setSearch("")} title={L.clearSearch} aria-label={L.clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                            {filters && filters.length > 0 && (
                                <div className="flex items-center gap-1 mt-2 px-1">
                                    {filters.map((f) => {
                                        const on = activeFilters.includes(f.key);
                                        return (
                                            <button key={f.key} type="button" title={f.title} aria-label={f.title} aria-pressed={on} onClick={() => setActiveFilters((p) => (p.includes(f.key) ? p.filter((k) => k !== f.key) : [...p, f.key]))} className={cn("p-1 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "bg-foreground/10" : "hover:bg-muted")}>
                                                {f.node}
                                            </button>
                                        );
                                    })}
                                    {activeFilters.length > 0 && (
                                        <button type="button" onClick={() => setActiveFilters([])} title={L.clearFilters} aria-label={L.clearFilters} className="p-1 rounded-md text-muted-foreground hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Provider filter */}
                        {groups.length > 1 && (
                            <div className="px-2.5 py-2 border-b border-border/50 overflow-x-auto">
                                <div className="flex gap-1 min-w-max">
                                    <button type="button" onClick={() => setActiveGroup(null)} aria-pressed={!activeGroup} className={cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", !activeGroup ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                                        {L.all} ({options.length})
                                    </button>
                                    {groups.map((g) => (
                                        <button key={g} type="button" onClick={() => setActiveGroup((c) => (c === g ? null : g))} aria-pressed={activeGroup === g} className={cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", activeGroup === g ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                                            {groupIcon[g]}
                                            {groupLabel[g] ?? g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* List */}
                        <div ref={listRef} onWheel={onWheel} onMouseMove={clearActiveOnPointer} id="yunui-ms-listbox" role="listbox" className="max-h-96 overflow-y-auto overscroll-contain">
                            {pinnedList.length > 0 && (
                                <div className="px-1.5 py-1.5 border-b border-border/40">
                                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1 flex items-center gap-1">
                                        <Pin size={9} /> {L.pinned}
                                    </div>
                                    {pinnedList.map((o) => (
                                        <ModelRow key={o.id} domId={rowDomId(o.id)} active={o.id === activeId} option={o} selected={o.id === value} pinned isPinnable={!!onTogglePin} onSelect={() => select(o.id)} onTogglePin={() => onTogglePin?.(o.id)} />
                                    ))}
                                </div>
                            )}
                            <div className="px-1.5 py-1.5">
                                {Object.entries(grouped).map(([g, opts]) => (
                                    <div key={g} className="mb-3 last:mb-0">
                                        {/* Sticky group header styled as a rounded bar that echoes the
                                            model rows (rounded-xl, same gutter) — a deliberate on-brand
                                            label, not a square full-bleed band. A *muted* fill (not
                                            popover-white, so it never reads as a stray white box) + blur
                                            occludes rows scrolling under it. */}
                                        <div className="sticky top-0 z-10 pt-1 pb-1.5">
                                            <div className="flex items-center gap-2 rounded-xl bg-muted/70 backdrop-blur-md px-3 py-2">
                                                {groupIcon[g]}
                                                <span className="text-xs font-semibold">{groupLabel[g] ?? g}</span>
                                                <span className="ml-auto text-[10px] text-muted-foreground bg-background/70 px-2 py-0.5 rounded-full font-medium">{opts.length}</span>
                                            </div>
                                        </div>
                                        {opts.map((o) => (
                                            <ModelRow key={o.id} domId={rowDomId(o.id)} active={o.id === activeId} option={o} selected={o.id === value} pinned={false} isPinnable={!!onTogglePin} onSelect={() => select(o.id)} onTogglePin={() => onTogglePin?.(o.id)} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {filtered.length === 0 && (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Sparkles size={28} className="mx-auto mb-3 opacity-40" />
                                    <p className="text-sm">{L.noResults}</p>
                                </div>
                            )}
                        </div>

                        {renderFooter && filtered.length > 0 && (
                            <div className="border-t border-border/50 px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
                                {renderFooter(filtered.length)}
                            </div>
                        )}
                    </motion.div>
                )}
        </div>
    );
}

const ModelRow = memo(function ModelRow({
    option,
    selected,
    active,
    domId,
    pinned,
    isPinnable,
    onSelect,
    onTogglePin,
}: {
    option: ModelSelectOption;
    selected: boolean;
    /** Keyboard-highlighted row (aria-activedescendant target). */
    active?: boolean;
    domId?: string;
    pinned: boolean;
    isPinnable: boolean;
    onSelect: () => void;
    onTogglePin: () => void;
}) {
    return (
        <div
            id={domId}
            data-model-id={option.id}
            role="option"
            aria-selected={selected}
            onClick={onSelect}
            className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors",
                // A clear gray fill on both states (selected solid, hover lighter)
                // — the bar's opacity then tells selected from merely-hovered.
                selected ? "bg-muted" : "hover:bg-muted",
                // keyboard highlight (arrow-key navigation)
                active && "bg-muted ring-2 ring-ring/40",
            )}
        >
            {/* Left bar — YunUI's selection signature, mirroring the Sidebar nav
                item: a faint full-height bar slides in on hover, and a solid bar
                marks the selected row. */}
            <div
                className={cn(
                    "absolute left-0 top-1/2 w-1 h-6 rounded-full bg-primary transition-all duration-150 -translate-y-1/2",
                    selected
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1.5 group-hover:opacity-50 group-hover:translate-x-0",
                )}
            />
            {option.icon}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="font-medium truncate">{option.label}</span>
                    {option.badges}
                </div>
                {option.detail}
            </div>
            {option.meta && <div className="flex items-center gap-1 shrink-0">{option.meta}</div>}
            {isPinnable && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                    className={cn(
                        "p-1.5 rounded-md transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100",
                        pinned ? "text-foreground opacity-100 hover:bg-muted/50" : "text-muted-foreground/40 opacity-60 hover:text-foreground/70 hover:bg-muted/50",
                    )}
                    aria-label={pinned ? "Unpin" : "Pin"}
                >
                    <Pin size={14} className={pinned ? "fill-current" : ""} />
                </button>
            )}
        </div>
    );
});

export default ModelSelect;
