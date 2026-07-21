"use client";

import { useState, useRef, useEffect, useId, type ReactNode } from "react";
import { X, ChevronDown } from "lucide-react";
import { useYunUI } from "../adapters/context";
import { useAnchoredPosition } from "../lib/use-anchored-position";

export interface ComboboxOption {
    /** The value reported to `onChange` when selected. */
    value: string;
    /** Display text for the option. */
    label: string;
    /** Optional secondary text for the option. */
    description?: string;
    /**
     * Optional resolved icon URL for the option. The host app resolves this
     * (e.g. from a provider id) before passing options in — YunUI stays
     * domain-agnostic.
     */
    iconUrl?: string | null;
}

interface ComboboxProps {
    /** The selectable options. */
    options: ComboboxOption[];
    /** Currently selected value (controlled). */
    value: string;
    /** Called with the chosen (or newly created) value. */
    onChange: (value: string) => void;
    /** Placeholder for the input (falls back to i18n default). */
    placeholder?: string;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Allow entering a value not in `options` (creatable). @defaultValue true */
    allowCustom?: boolean;
    /** Label template for the "create new" row; `{value}` is replaced with the typed text. */
    creatableText?: string;
    /** When set, the "create new" row only appears for inputs passing this test. */
    creatableFilter?: (input: string) => boolean;
    /** Glyph shown on the "create new" row (default `+`). */
    creatableIcon?: ReactNode;
}

/** Searchable, optionally creatable combobox — type to filter, Enter to pick or create.
 *  For long lists where users type to narrow; see `Select`'s doc for "which select do I use". */
export function Combobox({
    options,
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    allowCustom = true,
    creatableText,
    creatableFilter,
    creatableIcon,
}: ComboboxProps) {
    const { Image, useT } = useYunUI();
    const t = useT("common.combobox");
    const resolvedPlaceholder = placeholder || t("placeholder");
    const resolvedCreatableText = creatableText || t("creatableText", { value: "" });
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [highlighted, setHighlighted] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);
    const listboxId = useId();
    const optionId = (i: number) => `${listboxId}-opt-${i}`;
    const selectedOption = options.find(o => o.value === value);
    const selectedDisplayValue = selectedOption?.label || value || "";

    // 當 value 從外部變化時更新輸入值
    useEffect(() => {
        setInputValue(selectedDisplayValue);
    }, [selectedDisplayValue]);

    // 點擊外部關閉
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setInputValue(selectedDisplayValue);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedDisplayValue]);

    // Reset the keyboard highlight when the list changes or the panel closes —
    // start at "no highlight" (-1) so the ring only appears after an arrow press.
    useEffect(() => {
        setHighlighted(-1);
    }, [inputValue, isOpen]);

    // 過濾選項
    const filteredOptions = inputValue
        ? options.filter(o =>
            o.label.toLowerCase().includes(inputValue.toLowerCase()) ||
            o.value.toLowerCase().includes(inputValue.toLowerCase())
        )
        : options;

    // 檢查是否可以創建新選項
    const canCreateNew = allowCustom && !!inputValue &&
        !options.some(o =>
            o.value.toLowerCase() === inputValue.toLowerCase() ||
            o.label.toLowerCase() === inputValue.toLowerCase()
        ) &&
        (!creatableFilter || creatableFilter(inputValue));

    const handleSelect = (selectedValue: string) => {
        const option = options.find(o => o.value === selectedValue);
        setInputValue(option?.label || selectedValue);
        onChange(selectedValue);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!isOpen) return setIsOpen(true);
                setHighlighted((h) => Math.min(h + 1, filteredOptions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!isOpen) return setIsOpen(true);
                setHighlighted((h) => Math.max(h - 1, 0));
                break;
            case "Home":
                if (isOpen) { e.preventDefault(); setHighlighted(0); }
                break;
            case "End":
                if (isOpen) { e.preventDefault(); setHighlighted(filteredOptions.length - 1); }
                break;
            case "Enter":
                e.preventDefault();
                if (isOpen && highlighted >= 0 && filteredOptions[highlighted]) {
                    handleSelect(filteredOptions[highlighted].value);
                } else if (canCreateNew) {
                    handleSelect(inputValue);
                } else if (filteredOptions.length > 0) {
                    handleSelect(filteredOptions[0].value);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setInputValue(selectedDisplayValue);
                break;
        }
    };

    const clearValue = () => {
        onChange("");
        setInputValue("");
        inputRef.current?.focus();
    };

    // Only show the committed selection's icon while its label is displayed.
    // Keeping that icon during free-text filtering falsely associates the typed
    // query (and its matching options) with the previously selected item.
    const selectedIconPath = inputValue === selectedDisplayValue
        ? selectedOption?.iconUrl ?? null
        : null;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="relative">
                {/* Icon display when selected */}
                {selectedIconPath && selectedOption && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5" style={{ width: 16, height: 16 }}>
                            <Image
                                src={selectedIconPath}
                                alt=""
                                aria-hidden="true"
                                width={16}
                                height={16}
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={resolvedPlaceholder}
                    aria-label={resolvedPlaceholder}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    aria-activedescendant={isOpen && highlighted >= 0 ? optionId(highlighted) : undefined}
                    disabled={disabled}
                    className={`
                        w-full py-2
                        rounded-xl border border-(--border-default) bg-(--bg-elevated)
                        hover:border-(--border-strong) hover:bg-(--bg-hover)
                        focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
                        transition-all duration-200 text-sm
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        ${selectedIconPath ? "pl-10 pr-20" : "px-3 pr-20"}
                    `}
                />
                {/* Clear button */}
                {inputValue && !disabled && (
                    <button
                        type="button"
                        onClick={clearValue}
                        aria-label="Clear"
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X size={14} />
                    </button>
                )}
                {/* Dropdown arrow */}
                <button
                    type="button"
                    onClick={() => {
                        if (disabled) return;
                        if (isOpen) setInputValue(selectedDisplayValue);
                        setIsOpen(!isOpen);
                    }}
                    disabled={disabled}
                    aria-label="Toggle options"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ChevronDown size={14} className={isOpen ? "rotate-180 transition-transform" : ""} />
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div
                    ref={panelRef}
                    style={{ marginLeft: shift, maxHeight }}
                    className={`absolute z-50 w-full ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} p-1 rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg shadow-black/5 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-200`}
                >
                    <div className="flex-1 min-h-0 max-h-60 overflow-y-auto" role="listbox" id={listboxId}>
                        {filteredOptions.length === 0 && !canCreateNew ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                {t("noResults")}
                            </div>
                        ) : (
                            <>
                                {filteredOptions.map((option, i) => {
                                    const isSelected = option.value === value;
                                    const isHigh = i === highlighted;
                                    const optionIconPath = option.iconUrl ?? null;
                                    return (
                                        <button
                                            key={option.value}
                                            id={optionId(i)}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            data-highlighted={isHigh ? "" : undefined}
                                            onClick={() => handleSelect(option.value)}
                                            onMouseEnter={() => setHighlighted(i)}
                                            className={`dropdown-item w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "active" : ""}`}
                                        >
                                            {optionIconPath && (
                                                <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5 shrink-0" style={{ width: 16, height: 16 }}>
                                                    <Image
                                                        src={optionIconPath}
                                                        alt=""
                                                        aria-hidden="true"
                                                        width={16}
                                                        height={16}
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <span className="flex-1 truncate">{option.label}</span>
                                        </button>
                                    );
                                })}
                                {canCreateNew && (
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(inputValue)}
                                        className="dropdown-item w-full text-left text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <span className="text-lg leading-none">{creatableIcon ?? "+"}</span>
                                        <span className="flex-1 truncate">{resolvedCreatableText.replace('{value}', inputValue)}</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
