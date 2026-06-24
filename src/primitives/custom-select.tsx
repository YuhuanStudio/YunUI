"use client";

import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { useYunUI } from "../adapters/context";

export interface SelectOption {
    /** The value reported to `onChange` when selected. */
    value: string;
    /** Display text for the option. */
    label: string;
    /** Optional leading icon shown next to the label. */
    icon?: React.ReactNode;
    /** Optional secondary line shown under the label. */
    description?: string;
}

interface CustomSelectProps {
    /** The selectable options. */
    options: SelectOption[];
    /** Currently selected value (controlled). */
    value: string;
    /** Called with the chosen option's value. */
    onChange: (value: string) => void;
    /** Placeholder shown when nothing is selected (falls back to i18n default). */
    placeholder?: string;
    /** Show an in-dropdown search box that filters options by label/value. */
    searchable?: boolean;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
}

/** Custom dropdown select with optional search, icons, descriptions, and full keyboard support.
 *  Data-driven alternative to `Select`; see `Select`'s doc for "which select do I use". */
export function CustomSelect({
    options,
    value,
    onChange,
    placeholder,
    searchable = false,
    className = "",
    disabled = false,
}: CustomSelectProps) {
    const t = useYunUI().useT("common.select");
    const resolvedPlaceholder = placeholder || t("placeholder");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlighted, setHighlighted] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const optionId = (i: number) => `${baseId}-opt-${i}`;

    const selectedOption = options.find((o) => o.value === value);

    const filteredOptions = searchQuery
        ? options.filter(
              (o) =>
                  o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.value.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : options;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && inputRef.current) inputRef.current.focus();
    }, [isOpen, searchable]);

    // On open, highlight the selected option (or the first); reset on close.
    useEffect(() => {
        if (isOpen) {
            const sel = filteredOptions.findIndex((o) => o.value === value);
            setHighlighted(sel >= 0 ? sel : 0);
        } else {
            setHighlighted(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Keep the highlight valid as the filtered list changes, and scroll into view.
    useEffect(() => {
        if (highlighted >= filteredOptions.length) setHighlighted(filteredOptions.length - 1);
    }, [filteredOptions.length, highlighted]);

    useEffect(() => {
        if (!isOpen || highlighted < 0 || !listRef.current) return;
        listRef.current.querySelector(`#${CSS.escape(optionId(highlighted))}`)?.scrollIntoView({ block: "nearest" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlighted, isOpen]);

    const open = () => !disabled && setIsOpen(true);
    const close = () => {
        setIsOpen(false);
        setSearchQuery("");
        triggerRef.current?.focus();
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!isOpen) return open();
                setHighlighted((h) => Math.min(h + 1, filteredOptions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!isOpen) return open();
                setHighlighted((h) => Math.max(h - 1, 0));
                break;
            case "Home":
                if (isOpen) { e.preventDefault(); setHighlighted(0); }
                break;
            case "End":
                if (isOpen) { e.preventDefault(); setHighlighted(filteredOptions.length - 1); }
                break;
            case "Enter":
                if (isOpen && filteredOptions[highlighted]) {
                    e.preventDefault();
                    handleSelect(filteredOptions[highlighted].value);
                } else if (!isOpen) {
                    e.preventDefault();
                    open();
                }
                break;
            case " ":
                if (!isOpen && !searchable) { e.preventDefault(); open(); }
                break;
            case "Escape":
                if (isOpen) { e.preventDefault(); close(); }
                break;
            case "Tab":
                if (isOpen) setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={isOpen && !searchable && highlighted >= 0 ? optionId(highlighted) : undefined}
                className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2
                    rounded-xl border border-(--border-default) bg-(--bg-elevated)
                    hover:border-(--border-strong) hover:bg-(--bg-hover)
                    transition-all duration-200 text-sm
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${isOpen ? "border-primary ring-2 ring-primary/20" : ""}
                `}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
                    <span className={`truncate ${!selectedOption ? "text-muted-foreground" : ""}`}>
                        {selectedOption ? selectedOption.label : resolvedPlaceholder}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="
                    absolute z-50 w-full mt-1 py-1
                    rounded-xl border border-(--border-default)
                    bg-(--bg-elevated) shadow-lg
                    max-h-64 overflow-hidden
                    animate-in fade-in-0 zoom-in-95 duration-200
                ">
                    {/* Search */}
                    {searchable && (
                        <div className="px-2.5 pb-2 pt-1.5 border-b border-(--border-subtle)">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    role="combobox"
                                    aria-expanded={isOpen}
                                    aria-controls={listboxId}
                                    aria-activedescendant={highlighted >= 0 ? optionId(highlighted) : undefined}
                                    aria-autocomplete="list"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t("search")}
                                    className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg
                                        bg-(--bg-muted) border border-transparent
                                        focus:border-primary focus:outline-none focus:bg-(--bg-elevated) transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label={t("clearSearch")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-(--bg-hover)"
                                        title={t("clearSearch")}
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    <div
                        ref={listRef}
                        role="listbox"
                        id={listboxId}
                        className="max-h-52 overflow-y-auto overscroll-contain"
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center whitespace-nowrap">
                                {t("noOptions")}
                            </div>
                        ) : (
                            filteredOptions.map((option, i) => {
                                const isSelected = option.value === value;
                                const isHigh = i === highlighted;
                                return (
                                    <button
                                        key={option.value}
                                        id={optionId(i)}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelect(option.value)}
                                        onMouseEnter={() => setHighlighted(i)}
                                        className={`
                                            w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                                            ${isHigh ? "bg-(--bg-hover)" : ""}
                                            ${isSelected ? "bg-primary/10 text-primary" : ""}
                                        `}
                                    >
                                        {option.icon && (
                                            <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                                                {option.icon}
                                            </span>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="truncate">{option.label}</div>
                                            {option.description && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && <Check size={14} className="shrink-0 text-primary" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
