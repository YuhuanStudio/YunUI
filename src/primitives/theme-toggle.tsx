"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Droplet } from "lucide-react"
import { useTheme } from "next-themes"
import { useYunUI } from "../adapters/context"
import { useAnchoredPosition } from "../lib/use-anchored-position"

interface ThemeToggleProps {
    /** Visual variant: `icon` (default, icon-only) or `pill`. */
    variant?: "icon" | "pill";
    /** Dropdown alignment: `left` or `right` (default). */
    align?: "left" | "right";
    /** Additional className */
    className?: string;
}

/** Theme switcher dropdown (light / dark / true-black / system) backed by next-themes. */
export function ThemeToggle({ variant = "icon", align = "right", className = "" }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme()
    const t = useYunUI().useT("common.theme")
    const [mounted, setMounted] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const { shift, maxHeight } = useAnchoredPosition(isOpen, panelRef)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Close on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const themes = [
        { value: "light", label: t("light"), icon: <Sun size={14} /> },
        { value: "dark", label: t("zincDark"), icon: <Moon size={14} /> },
        { value: "true-black", label: t("trueBlack"), icon: <Droplet size={14} fill="currentColor" /> },
        { value: "system", label: t("system"), icon: <Monitor size={14} /> },
    ]

    if (!mounted) {
        return (
            <div className={className}>
                {variant === "pill" ? (
                    <div className="h-8 w-16 rounded-full bg-(--bg-elevated) border border-(--border-hairline)" />
                ) : (
                    <div className="w-9 h-9 rounded-lg" />
                )}
            </div>
        )
    }

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            {variant === "pill" ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={t("toggle")}
                >
                    <Sun size={14} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon size={14} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={t("toggle")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t("toggle")}</span>
                </button>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={panelRef}
                    style={{ marginLeft: shift, maxHeight }}
                    className={`absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`}
                >
                    <div className="p-1 flex-1 min-h-0 overflow-y-auto">
                        {themes.map((themeItem) => (
                            <button
                                key={themeItem.value}
                                onClick={() => {
                                    setTheme(themeItem.value)
                                    setIsOpen(false)
                                }}
                                className={`dropdown-item w-full text-left ${
                                    theme === themeItem.value ? "active" : ""
                                }`}
                            >
                                {themeItem.icon}
                                <span className="flex-1">{themeItem.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
