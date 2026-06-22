"use client";

import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === currentLocale || pending) return;
        setIsOpen(false);
        onChange(newLocale);
    };

    const currentLabel = locales.find((l) => l.value === currentLocale)?.label ?? currentLocale;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            {variant === "pill" ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50"
                    disabled={pending}
                    aria-label={label}
                >
                    <Globe size={14} />
                    <span>{currentLabel}</span>
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50"
                    disabled={pending}
                    aria-label={label}
                >
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                </button>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className={`absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 rounded-2xl border border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`}>
                    <div className="p-1">
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
