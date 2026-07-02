"use client";

import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalBehavior, useFocusTrap } from "../lib/hooks";
import { cn } from "../lib/cn";

interface SheetProps {
    /** Whether the sheet is open (controlled). */
    open: boolean;
    /** Called when the sheet should close (backdrop click, escape, close button). */
    onClose: () => void;
    children: React.ReactNode;
    /** Optional header title. */
    title?: string;
    /** Hide on large screens (`lg`+) — for mobile-only drawers (e.g. a sidebar
     *  that's permanent on desktop). @defaultValue false (shows on all sizes). */
    mobileOnly?: boolean;
}

/** Slide-in panel from the right with a backdrop. By default it shows on every
 *  screen size; set `mobileOnly` to hide it on `lg`+ (a mobile-only drawer). */
export function Sheet({ open, onClose, children, title, mobileOnly = false }: SheetProps) {
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useModalBehavior(open, onClose);
    // a11y: trap Tab inside the drawer and restore focus to the opener on close.
    // `mounted` is part of the flag so the effect (re-)runs after the portal
    // renders and the panel ref is actually attached.
    useFocusTrap(panelRef, open && mounted);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="sheet-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn("fixed inset-0 bg-black/20 backdrop-blur-sm", mobileOnly && "lg:hidden")}
                        style={{ zIndex: 40 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    {/* Panel */}
                    <motion.div
                        key="sheet-panel"
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        /* A floating, glassy, fully-rounded drawer (inset from the
                           edges) — matches YunUI's navbar/modal surface treatment
                           instead of a flat edge-to-edge white slab. */
                        className={cn("fixed inset-y-3 right-3 w-[85vw] min-w-72 max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden rounded-2xl border border-border", mobileOnly && "lg:hidden")}
                        style={{ zIndex: 50 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
                            {title && (
                                <h2 id={titleId} className="font-semibold text-sm tracking-tight">{title}</h2>
                            )}
                            <button
                                onClick={onClose}
                                className="-mr-1.5 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {/* Body — px-5 matches the header. Without default padding
                            every consumer's content sat flush against the panel
                            edges (e.g. settings drawers). */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
