"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { X, ChevronDown } from "lucide-react";
import { useYunUI } from "../adapters/context";

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
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 當 value 從外部變化時更新輸入值
    useEffect(() => {
        const selectedOption = options.find(o => o.value === value);
        setInputValue(selectedOption?.label || value || "");
    }, [value, options]);

    // 點擊外部關閉
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        onChange(selectedValue);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (canCreateNew) {
                handleSelect(inputValue);
            } else if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0].value);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setInputValue(value || "");
        }
    };

    const clearValue = () => {
        onChange("");
        setInputValue("");
        inputRef.current?.focus();
    };

    // Get the selected option to display its icon
    const selectedOption = options.find(o => o.value === value);
    const selectedIconPath = selectedOption?.iconUrl ?? null;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="relative">
                {/* Icon display when selected */}
                {selectedIconPath && selectedOption && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5" style={{ width: 16, height: 16 }}>
                            <Image
                                src={selectedIconPath}
                                alt={selectedOption.label}
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
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    aria-label="Toggle options"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ChevronDown size={14} className={isOpen ? "rotate-180 transition-transform" : ""} />
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 p-1 rounded-2xl border border-border bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 && !canCreateNew ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                {t("noResults")}
                            </div>
                        ) : (
                            <>
                                {filteredOptions.map((option) => {
                                    const isSelected = option.value === value;
                                    const optionIconPath = option.iconUrl ?? null;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`dropdown-item w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "active" : ""}`}
                                        >
                                            {optionIconPath && (
                                                <div className="rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5 shrink-0" style={{ width: 16, height: 16 }}>
                                                    <Image
                                                        src={optionIconPath}
                                                        alt={option.label}
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
