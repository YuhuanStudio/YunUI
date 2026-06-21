/**
 * Modal System Types
 *
 * Unified type definitions for all modal components
 */

import { ReactNode } from "react";
import { ModalSize } from "./constants";

// Re-export ModalSize for convenience
export type { ModalSize } from "./constants";

/**
 * Base Modal Props
 *
 * Common props shared by all modal types
 */
export interface BaseModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal title (required for accessibility) */
    title: string;
    /** Optional subtitle displayed below title */
    subtitle?: string;
    /** Modal size */
    size?: ModalSize;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Standard Modal Props
 *
 * For general-purpose modals with content and optional footer
 */
export interface ModalProps extends BaseModalProps {
    /** Modal content */
    children: ReactNode;
    /** Optional footer content */
    footer?: ReactNode;
    /** Whether to show the close button */
    showCloseButton?: boolean;
    /** Whether modal is in closing animation state */
    isClosing?: boolean;
    /** Callback to set closing state */
    setIsClosing?: (closing: boolean) => void;
    /** Whether to show unsaved changes badge */
    showUnsavedBadge?: boolean;
    /** Custom max-height override */
    maxHeight?: string;
    /** Called when backdrop is clicked (defaults to onClose) */
    onBackdropClick?: () => void;
}

/**
 * Confirm Modal Variant
 */
export type ConfirmModalVariant = "danger" | "warning" | "info" | "success";

/**
 * Confirm Modal Props
 *
 * For confirmation dialogs with confirm/cancel actions
 */
export interface ConfirmModalProps extends BaseModalProps {
    /** Main message content */
    message: ReactNode;
    /** Variant affects icon and button colors */
    variant?: ConfirmModalVariant;
    /** Text for confirm button */
    confirmText?: string;
    /** Text for cancel button */
    cancelText?: string;
    /** Whether action is in progress */
    isLoading?: boolean;
    /** Called when user confirms */
    onConfirm: () => void;
    /** Custom icon (overrides variant default) */
    icon?: ReactNode;
}

/**
 * Delete Confirm Modal Props
 */
export interface DeleteConfirmModalProps
    extends Omit<ConfirmModalProps, "variant" | "title" | "confirmText" | "message"> {
    /** Name of item to delete */
    itemName: string;
}

/**
 * Regenerate Confirm Modal Props
 */
export interface RegenerateConfirmModalProps
    extends Omit<ConfirmModalProps, "variant" | "title" | "confirmText" | "message"> {
    /** Name of item to regenerate */
    itemName: string;
}

/**
 * Confirm Close Dialog Props
 *
 * For unsaved changes confirmation
 */
export interface ConfirmCloseDialogProps {
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Called when user chooses to discard changes */
    onDiscard: () => void;
    /** Called when user chooses to keep editing */
    onKeepEditing: () => void;
}
