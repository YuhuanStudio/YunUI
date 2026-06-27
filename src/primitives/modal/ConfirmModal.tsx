/**
 * ConfirmModal - Unified Confirmation Dialog
 *
 * Provides a consistent, accessible confirmation dialog for:
 * - Delete confirmations
 * - Regenerate confirmations
 * - Any action requiring user confirmation
 *
 * Features:
 * - Variant-based styling (danger, warning, info, success)
 * - Escape key to close (with animation)
 * - Body scroll lock
 * - Backdrop click to close
 * - Accessible focus management
 * - Loading state support
 * - SSR compatible
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, RefreshCw, Trash2, Info, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "../index";
import { useEscapeKey, useBodyScrollLock, useFocusTrap } from "../../lib/hooks";
import { cn } from "../../lib/cn";
import { Z_INDEX, ANIMATION_DURATION } from "./constants";
import type { ConfirmModalProps, ConfirmModalVariant, DeleteConfirmModalProps, RegenerateConfirmModalProps } from "./types";
import { useYunUI } from "../../adapters/context";

// Unique ID counter for timeout tracking
let closeIdCounter = 0;

const variantConfig: Record<ConfirmModalVariant, {
    iconBg: string;
    iconColor: string;
    buttonVariant: "default" | "red" | "amber";
    Icon: typeof Trash2;
}> = {
    danger: {
        iconBg: "bg-error-soft",
        iconColor: "text-error",
        buttonVariant: "red",
        Icon: Trash2,
    },
    warning: {
        iconBg: "bg-warning-soft",
        iconColor: "text-warning",
        buttonVariant: "amber",
        Icon: RefreshCw,
    },
    info: {
        iconBg: "bg-info-soft",
        iconColor: "text-info",
        buttonVariant: "default",
        Icon: Info,
    },
    success: {
        iconBg: "bg-success-soft",
        iconColor: "text-success",
        buttonVariant: "default",
        Icon: CheckCircle,
    },
};

export function ConfirmModal({
    isOpen,
    title,
    subtitle,
    message,
    variant = "warning",
    confirmText,
    cancelText,
    isLoading = false,
    onConfirm,
    onClose,
    className,
    icon,
}: ConfirmModalProps) {
    const t = useYunUI().useT('components.confirmModal');
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeIdRef = useRef<number>(0);
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const config = variantConfig[variant];

    // a11y: keep Tab inside the dialog and restore focus to the opener on close.
    // Declared before the explicit confirm-button focus effect below so that
    // effect still wins the *initial* focus; this only adds Tab containment.
    // `mounted` is in the flag so the effect runs once the portal/ref exists.
    useFocusTrap(dialogRef, isOpen && !isClosing && mounted);

    // Default values with translations
    const _confirmText = confirmText ?? t('confirm');
    const _cancelText = cancelText ?? t('cancel');

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

    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;

    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // Handle close with animation - no dependencies to avoid recreation
    const handleClose = useCallback(() => {
        // Prevent double-close or close during loading using refs
        if (isClosingRef.current || isLoadingRef.current) return;

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
                onCloseRef.current();
                setIsClosing(false);
                timeoutRef.current = null;
            }
        }, ANIMATION_DURATION);
    }, []); // No dependencies - uses refs

    // Handle Escape key (enabled state checked inside useEscapeKey via refs)
    useEscapeKey(handleClose, isOpen);

    // Body scroll lock
    useBodyScrollLock(isOpen);

    // Focus confirm button on open
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Reset closing state when modal reopens
    useEffect(() => {
        if (isOpen && isClosing) {
            setIsClosing(false);
        }
    }, [isOpen, isClosing]);

    // Don't render if not open or not mounted (SSR)
    if (!isOpen || !mounted) return null;

    const Icon = config.Icon;

    const modalContent = (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center p-4 transition-opacity",
                isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ zIndex: Z_INDEX.CONFIRM_DIALOG }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
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

            {/* Modal Card */}
            <div
                ref={dialogRef}
                className={cn(
                    "card relative w-full max-w-sm shadow-2xl transition-all",
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5">
                    {/* Header with icon */}
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                config.iconBg
                            )}
                        >
                            {icon || <Icon size={20} className={config.iconColor} />}
                        </div>
                        <div className="min-w-0">
                            <h3 id="confirm-modal-title" className="font-semibold truncate">
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div
                        id="confirm-modal-description"
                        className="text-sm text-muted-foreground mb-4"
                    >
                        {message}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleClose}
                            disabled={isLoading}
                            variant="secondary"
                            className="flex-1"
                        >
                            {_cancelText}
                        </Button>
                        <Button
                            ref={confirmButtonRef}
                            onClick={onConfirm}
                            disabled={isLoading}
                            variant={config.buttonVariant}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t('processing')}
                                </span>
                            ) : (
                                _confirmText
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

/**
 * Quick confirm dialog for delete actions
 */
export function DeleteConfirmModal({
    itemName,
    ...props
}: DeleteConfirmModalProps) {
    const t = useYunUI().useT('components.confirmModal');

    return (
        <ConfirmModal
            variant="danger"
            title={t('deleteQuestion')}
            confirmText={t('delete')}
            message={
                <>
                    {t('deleteMessage', { item: itemName })}
                </>
            }
            {...props}
        />
    );
}

/**
 * Quick confirm dialog for regenerate actions
 */
export function RegenerateConfirmModal({
    itemName,
    ...props
}: RegenerateConfirmModalProps) {
    const t = useYunUI().useT('components.confirmModal');

    return (
        <ConfirmModal
            variant="warning"
            title={t('regenerateQuestion')}
            subtitle={t('actionCannotBeUndone')}
            confirmText={t('regenerate')}
            message={
                <>
                    {t('regenerateMessage', { item: itemName })}
                </>
            }
            {...props}
        />
    );
}
