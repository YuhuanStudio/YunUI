"use client";

/**
 * useEscapeKey - Hook for handling Escape key press
 *
 * Used by modals, dialogs, and other overlays to close on Escape key.
 */

import { useEffect, useCallback, useRef, useState, type RefObject } from "react";

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

/**
 * Trap keyboard focus inside `containerRef` while `enabled`.
 *
 * On enable: remembers the previously-focused element and moves focus into the
 * container (first focusable, else the container itself). While enabled, Tab /
 * Shift+Tab cycle within the container's focusable elements. On disable/unmount:
 * restores focus to the previously-focused element.
 *
 * @example
 * ```tsx
 * const panelRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(panelRef, isOpen);
 * ```
 */
const FOCUSABLE_SELECTOR =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    enabled: boolean = true
): void {
    useEffect(() => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;

        const getFocusable = () =>
            Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

        // Move focus into the dialog so keyboard + screen-reader users start inside.
        const initial = getFocusable();
        (initial[0] ?? container).focus?.();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Tab") return;
            const items = getFocusable();
            if (items.length === 0) {
                event.preventDefault();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (event.shiftKey) {
                if (active === first || !container.contains(active)) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (active === last || !container.contains(active)) {
                event.preventDefault();
                first.focus();
            }
        };

        container.addEventListener("keydown", onKeyDown);
        return () => {
            container.removeEventListener("keydown", onKeyDown);
            // Restore focus to where it was before the trap opened.
            previouslyFocused?.focus?.();
        };
    }, [enabled, containerRef]);
}

/**
 * Dismiss a floating panel when the pointer goes down outside it.
 *
 * Six components in this library hand-rolled this, and no two agreed:
 * `CustomSelect`, `Combobox`, `ThemeToggle` and `LanguageSwitcher` registered
 * the listener permanently (it ran on every click in the app, open or not) and
 * listened for `mousedown` only — so on a touch device, tapping away did not
 * reliably close them. `ModelSelect` added `touchstart` but still never
 * unregistered while closed. `AccountMenu` gated on open and handled Escape.
 *
 * This is the union of the correct halves: the listeners exist only while
 * `open`, cover both mouse and touch, and optionally close on Escape.
 *
 * @param open        Whether the panel is currently showing.
 * @param onDismiss   Called on an outside press (and on Escape, if enabled).
 * @param ref         The panel's outermost element — a press inside it is ignored.
 * @param options.escape  Also dismiss on Escape. @defaultValue true
 * @param options.extraRefs  Further elements to treat as "inside" — for a panel
 *   rendered through a portal, whose DOM is not a descendant of the trigger.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const [open, setOpen] = useState(false);
 * useDismissOnOutside(open, () => setOpen(false), ref);
 * ```
 */
export function useDismissOnOutside(
    open: boolean,
    onDismiss: () => void,
    ref: RefObject<HTMLElement | null>,
    options?: { escape?: boolean; extraRefs?: RefObject<HTMLElement | null>[] }
): void {
    const onDismissRef = useRef(onDismiss);
    onDismissRef.current = onDismiss;

    const escape = options?.escape ?? true;
    const extraRefs = options?.extraRefs;

    useEffect(() => {
        if (!open) return;

        const isInside = (target: Node) =>
            ref.current?.contains(target) ||
            extraRefs?.some((r) => r.current?.contains(target));

        const onDown = (event: Event) => {
            const target = event.target as Node | null;
            if (target && !isInside(target)) onDismissRef.current();
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onDismissRef.current();
        };

        // `mousedown` alone leaves touch devices holding the panel open until a
        // synthesised mouse event arrives — which never happens for a scroll.
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown);
        if (escape) document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("touchstart", onDown);
            if (escape) document.removeEventListener("keydown", onKey);
        };
        // `extraRefs` is a caller-owned array; depend on its identity, not contents.
    }, [open, escape, ref, extraRefs]);
}

/**
 * Make a scroll container keyboard-reachable, but only while it actually
 * scrolls.
 *
 * Chrome quietly makes overflowing scroll containers focusable; Safari and
 * Firefox do not. So a wide `<table>` of plain cells — no links, no buttons —
 * has *no* keyboard route to the columns past the right edge in those engines:
 * the content is simply unreachable. The usual fix is a permanent
 * `tabIndex={0}`, which then adds a dead tab stop to every table that fits.
 *
 * This measures instead. It returns `0` while the element overflows and
 * `undefined` when it does not, re-checking on resize and on content changes.
 *
 * @param ref The scrolling element.
 * @param axis Which overflow to watch. @defaultValue "x"
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const tabIndex = useScrollableTabStop(ref);
 * return <div ref={ref} tabIndex={tabIndex} className="overflow-x-auto">…</div>;
 * ```
 */
export function useScrollableTabStop(
    ref: RefObject<HTMLElement | null>,
    axis: "x" | "y" = "x"
): 0 | undefined {
    const [overflowing, setOverflowing] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof ResizeObserver === "undefined") return;

        const measure = () => {
            // 1px of slack: sub-pixel layout rounding otherwise reports a
            // permanent overflow on tables that visually fit exactly.
            const over =
                axis === "x"
                    ? el.scrollWidth - el.clientWidth > 1
                    : el.scrollHeight - el.clientHeight > 1;
            setOverflowing(over);
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        // The children are what overflow — watching only the box misses a row
        // being added to an already-sized table.
        for (const child of Array.from(el.children)) ro.observe(child);
        return () => ro.disconnect();
    }, [ref, axis]);

    return overflowing ? 0 : undefined;
}
