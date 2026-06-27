/**
 * ConfirmCloseDialog - Unsaved Changes Confirmation
 *
 * A specialized dialog for confirming when a user wants to close
 * a modal with unsaved changes.
 *
 * Features:
 * - Higher z-index than regular modals (z-60)
 * - Escape key support
 * - Body scroll lock
 * - SSR compatible
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../index";
import { useEscapeKey, useBodyScrollLock, useFocusTrap } from "../../lib/hooks";
import { cn } from "../../lib/cn";
import { Z_INDEX, ANIMATION_DURATION } from "./constants";
import type { ConfirmCloseDialogProps } from "./types";
import { useYunUI } from "../../adapters/context";

// Unique ID counter for timeout tracking
let closeIdCounter = 0;

export function ConfirmCloseDialog({
    isOpen,
    onDiscard,
    onKeepEditing,
}: ConfirmCloseDialogProps) {
    const t = useYunUI().useT('components.confirmCloseDialog');
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeIdRef = useRef<number>(0);
    const discardButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

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

    const onDiscardRef = useRef(onDiscard);
    onDiscardRef.current = onDiscard;

    const onKeepEditingRef = useRef(onKeepEditing);
    onKeepEditingRef.current = onKeepEditing;

    // Handle discard with animation
    const handleDiscard = useCallback(() => {
        // Prevent double-action using ref
        if (isClosingRef.current) return;

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Generate unique ID for this close operation
        const currentCloseId = ++closeIdCounter;
        closeIdRef.current = currentCloseId;

        setIsClosing(true);
        timeoutRef.current = setTimeout(() => {
            // Only execute if this is still the current close operation
            if (closeIdRef.current === currentCloseId) {
                onDiscardRef.current();
                setIsClosing(false);
                timeoutRef.current = null;
            }
        }, ANIMATION_DURATION);
    }, []); // No dependencies - uses refs

    // Handle keep editing (no animation needed)
    const handleKeepEditing = useCallback(() => {
        onKeepEditingRef.current();
    }, []); // No dependencies - uses refs

    // Handle Escape key (enabled state checked inside useEscapeKey via refs)
    // a11y: trap Tab inside the dialog; the explicit discard-button focus effect
    // below still sets initial focus. `mounted` keeps the effect in sync with the
    // portal so the ref is attached when it runs.
    useFocusTrap(dialogRef, isOpen && !isClosing && mounted);

    useEscapeKey(handleKeepEditing, isOpen);

    // Body scroll lock
    useBodyScrollLock(isOpen);

    // Reset closing state when dialog reopens
    useEffect(() => {
        if (isOpen && isClosing) {
            setIsClosing(false);
        }
    }, [isOpen, isClosing]);

    // Focus discard button on open for accessibility
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                discardButtonRef.current?.focus();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Don't render if not open or not mounted (SSR)
    if (!isOpen || !mounted) return null;

    const dialogContent = (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center p-4 transition-opacity",
                isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ zIndex: Z_INDEX.CONFIRM_DIALOG }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-close-title"
            aria-describedby="confirm-close-description"
        >
            {/* Darker backdrop for emphasis */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
                    isClosing ? "opacity-0" : "opacity-100"
                )}
                aria-hidden="true"
            />

            <div
                ref={dialogRef}
                className={cn(
                    "card w-full max-w-sm p-6 shadow-2xl transition-all",
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                )}
            >
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-warning-soft rounded-lg shrink-0">
                        <AlertTriangle className="text-warning" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 id="confirm-close-title" className="font-semibold mb-1">
                            {t('title')}
                        </h3>
                        <p id="confirm-close-description" className="text-sm text-muted-foreground">
                            {t('message')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={handleKeepEditing}>
                        {t('keepEditing')}
                    </Button>
                    <Button ref={discardButtonRef} variant="red" onClick={handleDiscard}>
                        {t('discardChanges')}
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(dialogContent, document.body);
}
