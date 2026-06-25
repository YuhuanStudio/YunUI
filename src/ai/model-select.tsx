"use client";

import { useState, useMemo, useRef, useEffect, memo, type ReactNode } from "react";
import { Search, Pin, ChevronDown, X } from "lucide-react";
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

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    }, [isOpen]);

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

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:border-ring transition-all min-w-0 sm:min-w-45 text-left group shadow-sm"
            >
                {selected ? (
                    <>
                        {selected.icon}
                        <span className="flex-1 truncate text-sm font-medium">{selected.label}</span>
                    </>
                ) : (
                    <span className="flex-1 text-sm text-muted-foreground">{L.placeholder}</span>
                )}
                <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-full sm:w-auto sm:min-w-80 max-w-[calc(100vw-2rem)] sm:max-w-lg bg-popover/90 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden">
                    {/* Search + capability filters */}
                    <div className="p-2.5 border-b border-border">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <input
                                ref={inputRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={L.search}
                                className="w-full pl-9 pr-8 py-2 text-sm bg-muted/50 border border-transparent rounded-lg outline-none focus:border-ring focus:bg-background transition-colors"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch("")} title={L.clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                        {filters && filters.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 px-1">
                                {filters.map((f) => {
                                    const on = activeFilters.includes(f.key);
                                    return (
                                        <button key={f.key} type="button" title={f.title} onClick={() => setActiveFilters((p) => (p.includes(f.key) ? p.filter((k) => k !== f.key) : [...p, f.key]))} className={cn("p-1 rounded-md transition-colors", on ? "bg-foreground/10" : "hover:bg-muted")}>
                                            {f.node}
                                        </button>
                                    );
                                })}
                                {activeFilters.length > 0 && (
                                    <button type="button" onClick={() => setActiveFilters([])} title={L.clearFilters} className="p-1 rounded-md text-muted-foreground hover:bg-muted">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Provider filter */}
                    {groups.length > 1 && (
                        <div className="px-2.5 py-2 border-b border-border overflow-x-auto">
                            <div className="flex gap-1 min-w-max">
                                <button type="button" onClick={() => setActiveGroup(null)} className={cn("px-2 py-1 text-[11px] rounded-md font-medium transition-colors whitespace-nowrap", !activeGroup ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                                    {L.all} ({options.length})
                                </button>
                                {groups.map((g) => (
                                    <button key={g} type="button" onClick={() => setActiveGroup((c) => (c === g ? null : g))} className={cn("px-2 py-1 text-[11px] rounded-md font-medium transition-colors flex items-center gap-1 whitespace-nowrap", activeGroup === g ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                                        {groupIcon[g]}
                                        {groupLabel[g] ?? g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* List */}
                    <div onWheel={onWheel} className="max-h-80 overflow-y-auto overscroll-contain">
                        {pinnedList.length > 0 && (
                            <div className="px-1.5 py-1.5">
                                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1 flex items-center gap-1">
                                    <Pin size={9} /> {L.pinned}
                                </div>
                                {pinnedList.map((o) => (
                                    <ModelRow key={o.id} option={o} selected={o.id === value} pinned isPinnable={!!onTogglePin} onSelect={() => { onChange(o.id); setIsOpen(false); }} onTogglePin={() => onTogglePin?.(o.id)} />
                                ))}
                            </div>
                        )}
                        <div className="px-1.5 py-1.5">
                            {Object.entries(grouped).map(([g, opts]) => (
                                <div key={g} className="mb-3 last:mb-0">
                                    <div className="flex items-center gap-2 px-2 mb-1 sticky top-0 bg-popover py-1">
                                        {groupIcon[g]}
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{groupLabel[g] ?? g}</span>
                                        <span className="text-[10px] text-muted-foreground/60">({opts.length})</span>
                                    </div>
                                    {opts.map((o) => (
                                        <ModelRow key={o.id} option={o} selected={o.id === value} pinned={false} isPinnable={!!onTogglePin} onSelect={() => { onChange(o.id); setIsOpen(false); }} onTogglePin={() => onTogglePin?.(o.id)} />
                                    ))}
                                </div>
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className="py-8 text-center text-sm text-muted-foreground">{L.noResults}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const ModelRow = memo(function ModelRow({
    option,
    selected,
    pinned,
    isPinnable,
    onSelect,
    onTogglePin,
}: {
    option: ModelSelectOption;
    selected: boolean;
    pinned: boolean;
    isPinnable: boolean;
    onSelect: () => void;
    onTogglePin: () => void;
}) {
    return (
        <div onClick={onSelect} className={cn("relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all", selected ? "bg-muted" : "hover:bg-muted/50")}>
            {selected && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />}
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
                <button type="button" onClick={(e) => { e.stopPropagation(); onTogglePin(); }} className={cn("p-1.5 rounded-md transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100", pinned ? "text-foreground opacity-100" : "text-muted-foreground/40 opacity-60 hover:text-foreground/70")}>
                    <Pin size={14} className={pinned ? "fill-current" : ""} />
                </button>
            )}
        </div>
    );
});

export default ModelSelect;
