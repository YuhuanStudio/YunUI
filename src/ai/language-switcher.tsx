"use client";

import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAnchoredPosition } from "../lib/use-anchored-position";

export interface LanguageOption {
    /** Locale code (e.g. "en", "zh-TW"). */
    value: string;
    /** Display name for the locale. */
    label: string;
}

interface LanguageSwitcherProps {
    /** Available languages. The host app supplies these. */
    locales: LanguageOption[];
    /** Currently active locale value. */
    currentLocale: string;
    /** Called when the user picks a different locale. Host owns cookie/reload. */
    onChange: (locale: string) => void;
    /** Visual variant */
    variant?: "icon" | "pill";
    /** Dropdown alignment */
    align?: "left" | "right";
    /** Accessible label for the trigger. */
    label?: string;
    /** Disables the control while a change is in flight. */
    pending?: boolean;
    /** Additional className */
    className?: string;
}

/** Locale picker dropdown; the host owns the actual locale change (cookie/reload). */
export function LanguageSwitcher({
    locales,
    currentLocale,
    onChange,
    variant = "icon",
    align = "right",
    label = "Language",
    pending = false,
    className = "",
}: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape + restore focus to the trigger. A document-level listener
    // (not a container onKeyDown) because WebKit/Safari on macOS doesn't focus a
    // <button> on click, so focus wouldn't be inside the container to bubble from.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === currentLocale || pending) return;
        setIsOpen(false);
        onChange(newLocale);
    };

    const currentLabel = locales.find((l) => l.value === currentLocale)?.label ?? currentLocale;

    return (
        // inline-flex so the root shrink-wraps the trigger; a block root filled the row and made the
        // right-0 dropdown anchor to the row's far edge instead of the trigger.
        <div ref={containerRef} className={`relative inline-flex ${className}`}>
            {/* Trigger */}
            {variant === "pill" ? (
                <button
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    disabled={pending}
                    aria-label={label}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <Globe size={14} className="shrink-0" />
                    <span className="whitespace-nowrap">{currentLabel}</span>
                </button>
            ) : (
                <button
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    disabled={pending}
                    aria-label={label}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                </button>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={panelRef}
                    style={{ marginLeft: shift, maxHeight }}
                    className={`absolute ${align === "left" ? "left-0" : "right-0"} ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-popover/95 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`}
                >
                    <div className="p-1 flex-1 min-h-0 overflow-y-auto">
                        {locales.map((lang) => (
                            <button
                                key={lang.value}
                                onClick={() => handleLocaleChange(lang.value)}
                                className={`dropdown-item w-full text-left ${
                                    currentLocale === lang.value ? "active" : ""
                                }`}
                            >
                                <span className="flex-1">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;
