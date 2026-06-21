/**
 * Modal System - Unified Exports
 *
 * This module provides a consistent, accessible modal system for the entire application.
 * All modals should use these components to ensure:
 * - Consistent styling and sizing
 * - Proper z-index layering
 * - Accessibility (ARIA attributes, keyboard navigation)
 * - Body scroll locking
 * - Escape key handling
 */

export * from "./constants";
export * from "./types";
export { Modal } from "./Modal";
export { ConfirmModal, DeleteConfirmModal, RegenerateConfirmModal } from "./ConfirmModal";
export { ConfirmCloseDialog } from "./ConfirmCloseDialog";

// Re-export hooks for convenience
export { useModalBehavior, useEscapeKey, useBodyScrollLock } from "../../lib/hooks";
