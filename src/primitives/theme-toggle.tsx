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
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef)

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

    // Close on Escape + restore focus to the trigger. Document-level (not a
    // container onKeyDown): WebKit/Safari on macOS doesn't focus a <button> on
    // click, so focus wouldn't be inside the container to bubble an Escape from.
    React.useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false)
                triggerRef.current?.focus()
            }
        }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [isOpen])

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
                    /* Must match the mounted trigger's footprint (h-9, px-3 + one
                       14px icon ≈ w-10) — a wider skeleton reads as a stray blank
                       pill strip before hydration. */
                    <div className="h-9 w-10 rounded-full bg-(--bg-elevated) border border-(--border-hairline)" />
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
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={t("toggle")}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    {/* Stack both icons in one 14px slot. With the Sun in-flow and
                        the Moon absolutely positioned against the button, dark mode
                        showed the Moon off-center next to the invisible Sun's empty
                        layout slot — a lopsided pill with a blank stretch. */}
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <Sun size={14} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon size={14} className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </span>
                </button>
            ) : (
                <button
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={t("toggle")}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
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
                    className={`absolute ${align === "left" ? "left-0" : "right-0"} ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`}
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
