/**
 * Modal System Constants
 *
 * Unified z-index layers and size definitions for all modals
 */

/**
 * Z-Index Layers
 *
 * z-50: Base modal layer
 * z-60: Confirmation dialogs (on top of modals)
 * z-70: Toast/notification layer (highest)
 */
export const Z_INDEX = {
    MODAL: 50,
    CONFIRM_DIALOG: 60,
    TOAST: 70,
} as const;

/**
 * Modal Size Classes
 *
 * Consistent across all modal implementations
 */
export const SIZE_CLASSES = {
    sm: "max-w-sm",      // 384px
    md: "max-w-md",      // 448px
    lg: "max-w-lg",      // 512px
    xl: "max-w-xl",      // 576px
    "2xl": "max-w-2xl",  // 672px
    "3xl": "max-w-3xl",  // 768px
    "4xl": "max-w-4xl",  // 896px
    "5xl": "max-w-5xl",  // 1024px
    "6xl": "max-w-6xl",  // 1152px
    full: "max-w-[95vw]", // 95% viewport width
} as const;

export type ModalSize = keyof typeof SIZE_CLASSES;

/**
 * Animation duration in milliseconds
 */
export const ANIMATION_DURATION = 150;

/**
 * Default max height for modals
 */
export const DEFAULT_MAX_HEIGHT = "85vh";
