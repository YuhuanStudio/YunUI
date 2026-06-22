"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalBehavior } from "../lib/hooks";

interface SheetProps {
    /** Whether the sheet is open (controlled). */
    open: boolean;
    /** Called when the sheet should close (backdrop click, escape, close button). */
    onClose: () => void;
    children: React.ReactNode;
    /** Optional header title. */
    title?: string;
}

/** Mobile-only slide-in panel from the right, with a backdrop (hidden on `lg` and up). */
export function Sheet({ open, onClose, children, title }: SheetProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useModalBehavior(open, onClose);

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
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
                        style={{ zIndex: 40 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    {/* Panel */}
                    <motion.div
                        key="sheet-panel"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-[85vw] min-w-72 max-w-sm bg-card shadow-xl flex flex-col lg:hidden"
                        style={{ zIndex: 50 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                            {title && (
                                <h2 className="font-semibold text-sm">{title}</h2>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
