"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { useYunUI } from "../adapters/context";

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchable?: boolean;
    className?: string;
    disabled?: boolean;
}

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
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const selectedOption = options.find(o => o.value === value);

    const filteredOptions = searchQuery
        ? options.filter(o =>
            o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = target;

        const isAtTop = scrollTop <= 1;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
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
                    {selectedOption?.icon && (
                        <span className="shrink-0">{selectedOption.icon}</span>
                    )}
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t("search")}
                                    className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg
                                        bg-(--bg-muted) border border-transparent
                                        focus:border-primary focus:outline-none focus:bg-(--bg-elevated) transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
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
                        onWheel={handleWheel}
                        className="max-h-52 overflow-y-auto overscroll-contain"
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center whitespace-nowrap">
                                {t("noOptions")}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                                        hover:bg-(--bg-hover) transition-colors
                                        ${option.value === value ? "bg-primary/10 text-primary" : ""}
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
                                    {option.value === value && (
                                        <Check size={14} className="shrink-0 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

