/**
 * ConfirmModal - Re-exports from unified modal system
 *
 * Use "@/components/ui/confirm-modal" or "@/components/ui/modal" — both resolve
 * to the same canonical implementation in ./modal/ConfirmModal.tsx
 */

export {
    ConfirmModal,
    DeleteConfirmModal,
    RegenerateConfirmModal,
} from "./modal/ConfirmModal";

export type { ConfirmModalVariant } from "./modal/types";
