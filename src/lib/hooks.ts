/**
 * useEscapeKey - Hook for handling Escape key press
 *
 * Used by modals, dialogs, and other overlays to close on Escape key.
 */

import { useEffect, useCallback, useRef } from "react";

/**
 * Hook that calls the callback when Escape key is pressed
 *
 * @param onEscape - Callback function to call when Escape is pressed
 * @param enabled - Whether the hook is active (default: true)
 *
 * @example
 * ```tsx
 * function MyModal({ onClose }) {
 *   useEscapeKey(onClose);
 *   return <div>Modal content</div>;
 * }
 * ```
 */
export function useEscapeKey(
    onEscape: () => void,
    enabled: boolean = true
): void {
    // Use ref to avoid recreating callback when onEscape changes
    const onEscapeRef = useRef(onEscape);
    onEscapeRef.current = onEscape;

    // Use ref for enabled state to avoid effect re-runs
    const enabledRef = useRef(enabled);
    enabledRef.current = enabled;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check enabled state from ref (always current)
            if (!enabledRef.current) return;

            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                onEscapeRef.current();
            }
        },
        [] // No dependencies - uses refs
    );

    // Always register the listener, handle enabled state inside
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, true); // Use capture phase
        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [handleKeyDown]);
}

/**
 * Hook that locks body scroll when active
 *
 * Uses a counter to handle nested modals correctly.
 * Stores original overflow to restore properly when all modals are closed.
 *
 * @param locked - Whether to lock body scroll (default: true)
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen }) {
 *   useBodyScrollLock(isOpen);
 *   return isOpen ? <div>Modal content</div> : null;
 * }
 * ```
 */

// Module-level counter for nested modal support
let scrollLockCount = 0;
let originalOverflow = "";

export function useBodyScrollLock(locked: boolean = true): void {
    // Use ref to track if this specific instance has contributed to the lock
    const hasLockedRef = useRef(false);

    useEffect(() => {
        if (!locked) {
            // If this instance had locked and now unlocks, decrement counter
            if (hasLockedRef.current) {
                scrollLockCount--;
                hasLockedRef.current = false;

                // Only restore when ALL locks are released
                if (scrollLockCount === 0) {
                    document.body.style.overflow = originalOverflow;
                    originalOverflow = "";
                }
            }
            return;
        }

        // Only increment if this instance hasn't already locked
        if (!hasLockedRef.current) {
            // Store original overflow only on first lock
            if (scrollLockCount === 0) {
                originalOverflow = document.body.style.overflow;
            }
            scrollLockCount++;
            document.body.style.overflow = "hidden";
            hasLockedRef.current = true;
        }

        return () => {
            // Only decrement if this instance had locked
            if (hasLockedRef.current) {
                scrollLockCount--;
                hasLockedRef.current = false;

                // Only restore when ALL locks are released
                if (scrollLockCount === 0) {
                    document.body.style.overflow = originalOverflow;
                    originalOverflow = "";
                }
            }
        };
    }, [locked]);
}

/**
 * Combined hook for modal behavior: Escape key + body scroll lock
 *
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   useModalBehavior(isOpen, onClose);
 *   if (!isOpen) return null;
 *   return <div>Modal content</div>;
 * }
 * ```
 */
export function useModalBehavior(isOpen: boolean, onClose: () => void): void {
    useEscapeKey(onClose, isOpen);
    useBodyScrollLock(isOpen);
}
