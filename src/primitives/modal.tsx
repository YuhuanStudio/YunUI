/**
 * Modal Component - Re-exports from unified modal system
 *
 * This file provides backward compatibility for imports from @/components/ui/modal
 */

// Import directly from the modal folder components
export { Modal } from "./modal/Modal";
export { ConfirmModal, DeleteConfirmModal, RegenerateConfirmModal } from "./modal/ConfirmModal";
export { ConfirmCloseDialog } from "./modal/ConfirmCloseDialog";
export { Z_INDEX, SIZE_CLASSES, ANIMATION_DURATION, DEFAULT_MAX_HEIGHT } from "./modal/constants";
export type {
    ModalProps,
    ConfirmModalProps,
    ConfirmCloseDialogProps,
    ModalSize,
    ConfirmModalVariant,
} from "./modal/types";
