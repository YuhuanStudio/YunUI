/**
 * Modal - Unified Modal Component
 *
 * A comprehensive modal component that supports all use cases:
 * - Standard content modals
 * - Modals with unsaved changes tracking
 * - Custom sizes and animations
 *
 * Features:
 * - Escape key to close (with animation)
 * - Body scroll lock when open
 * - Backdrop click to close
 * - ARIA attributes + focus trap (focus moves in on open, Tab cycles inside,
 *   focus returns to the opener on close)
 * - Optional closing animation
 * - Unsaved changes badge
 * - SSR compatible
 *
 * Choosing a dialog (so you never have to guess):
 * - `Dialog` (Radix, from the root barrel): the accessible default — focus trap,
 *   escape, scroll lock, full ARIA. Use it for general/interactive dialogs and
 *   anywhere keyboard focus containment matters.
 * - `Modal` (this): a styled, prop-driven modal (title/subtitle/footer, sizes,
 *   unsaved-changes badge) for the common app case. Manages escape, scroll-lock,
 *   backdrop, and focus-trap itself.
 * - `ConfirmModal` / `DeleteConfirmModal` / `RegenerateConfirmModal`: ready-made
 *   confirmation dialogs built on `Modal`.
 */

"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../index";
import { useEscapeKey, useBodyScrollLock, useFocusTrap } from "../../lib/hooks";
import { cn } from "../../lib/cn";
import { SIZE_CLASSES, Z_INDEX, ANIMATION_DURATION, DEFAULT_MAX_HEIGHT } from "./constants";
import type { ModalProps } from "./types";
import { useYunUI } from "../../adapters/context";

// Unique ID counter for timeout tracking
let closeIdCounter = 0;

export function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = "lg",
    className,
    showCloseButton = true,
    isClosing: externalIsClosing,
    setIsClosing: externalSetIsClosing,
    showUnsavedBadge = false,
    maxHeight = DEFAULT_MAX_HEIGHT,
    onBackdropClick,
}: ModalProps) {
    const t = useYunUI().useT('components.modal');
    const modalRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeIdRef = useRef<number>(0);
    const [internalIsClosing, setInternalIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Use external state if provided, otherwise use internal state
    const isClosing = externalIsClosing ?? internalIsClosing;

    // Track mounted state for SSR
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    // Use refs to avoid stale closure issues
    const isClosingRef = useRef(isClosing);
    isClosingRef.current = isClosing;

    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const externalSetIsClosingRef = useRef(externalSetIsClosing);
    externalSetIsClosingRef.current = externalSetIsClosing;

    // Handle close with animation - no dependencies to avoid recreation
    const handleClose = useCallback(() => {
        // Prevent double-close using ref (always current)
        if (isClosingRef.current) return;

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Generate unique ID for this close operation
        const currentCloseId = ++closeIdCounter;
        closeIdRef.current = currentCloseId;

        const executeClose = () => {
            // Only execute if this is still the current close operation
            if (closeIdRef.current === currentCloseId) {
                onCloseRef.current();
                if (externalSetIsClosingRef.current) {
                    externalSetIsClosingRef.current(false);
                } else {
                    setInternalIsClosing(false);
                }
                timeoutRef.current = null;
            }
        };

        if (externalSetIsClosingRef.current) {
            externalSetIsClosingRef.current(true);
            timeoutRef.current = setTimeout(executeClose, ANIMATION_DURATION);
        } else {
            setInternalIsClosing(true);
            timeoutRef.current = setTimeout(executeClose, ANIMATION_DURATION);
        }
    }, []); // No dependencies - uses refs

    // Handle Escape key (enabled state checked inside useEscapeKey via ref)
    useEscapeKey(handleClose, isOpen);

    // Body scroll lock
    useBodyScrollLock(isOpen);

    // Focus management — move focus into the dialog on open, trap Tab/Shift+Tab
    // inside it, and restore focus to the opener on close (a11y: no focus escape).
    useFocusTrap(modalRef, isOpen);

    // Reset closing state when modal reopens
    useEffect(() => {
        if (isOpen && internalIsClosing) {
            setInternalIsClosing(false);
        }
    }, [isOpen, internalIsClosing]);

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (onBackdropClick) {
                onBackdropClick();
            } else {
                handleClose();
            }
        }
    }, [onBackdropClick, handleClose]);

    // Don't render if not open or not mounted (SSR)
    if (!isOpen || !mounted) return null;

    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;

    const modalContent = (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center p-4 transition-opacity",
                isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ zIndex: Z_INDEX.MODAL }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                    isClosing ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={cn(
                    // Glassy surface (not the solid .card) to match Sheet/Dialog/navbar.
                    "relative w-full rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col transition-all",
                    sizeClass,
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
                    className
                )}
                style={{ maxHeight }}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 id="modal-title" className="text-lg font-semibold truncate">
                                {title}
                            </h2>
                            {showUnsavedBadge && (
                                <span className="badge-warning shrink-0">
                                    {t('unsaved')}
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                        )}
                    </div>
                    {showCloseButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="p-2 shrink-0"
                            aria-label={t('close')}
                        >
                            <X size={20} />
                        </Button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-border bg-muted/20 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
