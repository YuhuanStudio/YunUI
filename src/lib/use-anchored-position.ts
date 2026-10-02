"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// SSR-safe layout effect: useLayoutEffect on the client, no-op on the server
// (effects don't run during SSR, and this avoids React's dev warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface AnchoredPosition {
    /** Horizontal nudge (px) to keep the panel on-screen. Apply as `marginLeft`
     *  — it never collides with `transform` (framer-motion / `animate-in`) or the
     *  panel's left/right anchor. */
    shift: number;
    /** Cap (px) so the panel can't run off the edge; pair with an internal scroll
     *  region (`flex-1 min-h-0` / `overflow-y-auto`). */
    maxHeight?: number;
    /** Optional width cap for panels that must fit a narrow clipping ancestor. */
    maxWidth?: number;
    /** Which side of the trigger to render on. `"top"` when there isn't room
     *  below but there is above — the consumer flips `top-full mt-*` to
     *  `bottom-full mb-*`. Defaults to `"bottom"`. */
    placement: "top" | "bottom";
}

interface ClippingBounds {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

const CLIPPING_OVERFLOW = /^(auto|scroll|hidden|clip|overlay)$/;

function getClippingAncestors(element: HTMLElement): HTMLElement[] {
    const ancestors: HTMLElement[] = [];
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor === document.body || ancestor === document.documentElement) continue;
        const style = window.getComputedStyle(ancestor);
        if (
            CLIPPING_OVERFLOW.test(style.overflowX || style.overflow)
            || CLIPPING_OVERFLOW.test(style.overflowY || style.overflow)
        ) {
            ancestors.push(ancestor);
        }
    }
    return ancestors;
}

/** Intersect the viewport with every ancestor that can clip descendants. */
function getClippingBounds(element: HTMLElement): ClippingBounds {
    const bounds: ClippingBounds = {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0,
    };

    for (const ancestor of getClippingAncestors(element)) {
        const style = window.getComputedStyle(ancestor);
        const clipsX = CLIPPING_OVERFLOW.test(style.overflowX || style.overflow);
        const clipsY = CLIPPING_OVERFLOW.test(style.overflowY || style.overflow);

        const rect = ancestor.getBoundingClientRect();
        if (clipsX) {
            bounds.left = Math.max(bounds.left, rect.left);
            bounds.right = Math.min(bounds.right, rect.right);
        }
        if (clipsY) {
            bounds.top = Math.max(bounds.top, rect.top);
            bounds.bottom = Math.min(bounds.bottom, rect.bottom);
        }
    }

    return bounds;
}

/**
 * Viewport-collision for HAND-ROLLED floating panels (the Radix ones flip/shift
 * on their own). Given the open state and a ref to the absolutely-positioned
 * panel, returns a horizontal `shift`, a `maxHeight`, and a `placement` that keep
 * it inside the viewport and any scroll/clipping ancestor — flipping above the
 * trigger when the usable space below is too small and there's more room above.
 * Measures via untransformed `offset*` / `getBoundingClientRect` so an in-flight
 * scale/translate animation doesn't skew it.
 */
export function useAnchoredPosition(
    open: boolean,
    panelRef: React.RefObject<HTMLElement | null>,
    opts?: { gutter?: number; minHeight?: number; maxWidth?: number },
): AnchoredPosition {
    const gutter = opts?.gutter ?? 8;
    const minHeight = opts?.minHeight ?? 160;
    const [pos, setPos] = useState<AnchoredPosition>({ shift: 0, maxHeight: undefined, maxWidth: undefined, placement: "bottom" });
    useIsoLayoutEffect(() => {
        if (!open) {
            setPos({ shift: 0, maxHeight: undefined, maxWidth: undefined, placement: "bottom" });
            return;
        }
        const el = panelRef.current;
        // offsetParent is the panel's positioned ancestor — the `relative` wrapper that also
        // holds the trigger, so its rect approximates the trigger box (the absolute panel adds
        // no height to it).
        const parent = el?.offsetParent as HTMLElement | null;
        if (!el || !parent) return;

        const compute = () => {
            const parentRect = parent.getBoundingClientRect();
            const bounds = getClippingBounds(el);
            const availableWidth = Math.max(0, bounds.right - bounds.left - gutter * 2);
            const maxWidth = opts?.maxWidth === undefined
                ? undefined
                : Math.min(opts.maxWidth, availableWidth);
            const naturalWidth = maxWidth === undefined
                ? el.offsetWidth
                : Math.min(el.offsetWidth, maxWidth);

            // Natural (un-shifted) box in viewport coords. offsetLeft includes the
            // horizontal margin currently applied to the DOM. Read the committed
            // inline margins instead of a ref to the next React state: ResizeObserver
            // or scroll can fire between measuring and React committing a new shift.
            // margin-left moves the box right; margin-right moves it left. offsetLeft
            // stays untransformed, which matters for animated panels.
            const appliedShift = (Number.parseFloat(el.style.marginLeft) || 0)
                - (Number.parseFloat(el.style.marginRight) || 0);
            const naturalLeft = parentRect.left + el.offsetLeft - appliedShift;
            const naturalRight = naturalLeft + naturalWidth;
            let dx = 0;
            if (naturalRight > bounds.right - gutter) dx = bounds.right - gutter - naturalRight;
            if (naturalLeft + dx < bounds.left + gutter) dx = bounds.left + gutter - naturalLeft;
            dx = Math.round(dx);

            // Vertical: prefer opening downward, but flip up when the content can't fit below and
            // there's more room above. Each side's free space caps the panel height (with an
            // internal scroll region taking over past minHeight).
            const belowSpace = Math.max(0, Math.floor(bounds.bottom - parentRect.bottom - gutter));
            const aboveSpace = Math.max(0, Math.floor(parentRect.top - bounds.top - gutter));
            const naturalHeight = el.scrollHeight;
            const preferredHeight = Math.min(naturalHeight, minHeight);
            const placement: "top" | "bottom" =
                belowSpace >= preferredHeight || belowSpace >= aboveSpace ? "bottom" : "top";
            const side = placement === "bottom" ? belowSpace : aboveSpace;
            // A cap must never exceed the actual clipping boundary. Containment
            // wins over the preferred minimum on genuinely small containers.
            const maxHeight = naturalHeight > side ? side : undefined;

            setPos((current) => (
                current.shift === dx
                && current.maxHeight === maxHeight
                && current.maxWidth === maxWidth
                && current.placement === placement
                    ? current
                    : { shift: dx, maxHeight, maxWidth, placement }
            ));
        };

        // Coalesce scroll and ResizeObserver measurements into one frame. A resize
        // observer may run before the browser has laid out a just-committed margin
        // correction; measuring synchronously there can apply that correction twice.
        // The initial open measurement and window resize remain synchronous, while
        // this frame reads the committed, untransformed offsets after layout.
        let frame = 0;
        const scheduleMeasure = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                compute();
            });
        };

        compute();
        // The viewport is not the only thing that can change while a panel is
        // open. Filtering a combobox, loading options asynchronously, changing
        // fonts, or resizing a dialog can alter the panel/anchor/clipping boxes
        // without emitting a window resize event. Observe every box that feeds
        // the calculation so placement and height stay current.
        const resizeObserver = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(scheduleMeasure)
            : null;
        if (resizeObserver) {
            const observed = new Set<HTMLElement>([el, parent, ...getClippingAncestors(el)]);
            observed.forEach((element) => resizeObserver.observe(element));
        }
        window.addEventListener("resize", compute);
        window.addEventListener("scroll", scheduleMeasure, { capture: true, passive: true });
        return () => {
            if (frame) cancelAnimationFrame(frame);
            resizeObserver?.disconnect();
            window.removeEventListener("resize", compute);
            window.removeEventListener("scroll", scheduleMeasure, true);
        };
    }, [open, gutter, minHeight, opts?.maxWidth, panelRef]);

    return pos;
}
