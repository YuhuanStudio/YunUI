import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
    opts?: { gutter?: number; minHeight?: number },
): AnchoredPosition {
    const gutter = opts?.gutter ?? 8;
    const minHeight = opts?.minHeight ?? 160;
    const [pos, setPos] = useState<AnchoredPosition>({ shift: 0, maxHeight: undefined, placement: "bottom" });
    // The shift currently baked into the panel's margin — subtract it to recover
    // the natural box on each recompute (otherwise it would drift).
    const shiftRef = useRef(0);

    useIsoLayoutEffect(() => {
        if (!open) {
            shiftRef.current = 0;
            setPos({ shift: 0, maxHeight: undefined, placement: "bottom" });
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

            // Natural (un-shifted) box in viewport coords. offsetLeft includes the
            // applied marginLeft, so remove the current shift first.
            const naturalLeft = parentRect.left + el.offsetLeft - shiftRef.current;
            const naturalRight = naturalLeft + el.offsetWidth;
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

            shiftRef.current = dx;
            setPos((current) => (
                current.shift === dx
                && current.maxHeight === maxHeight
                && current.placement === placement
                    ? current
                    : { shift: dx, maxHeight, placement }
            ));
        };

        compute();
        // The viewport is not the only thing that can change while a panel is
        // open. Filtering a combobox, loading options asynchronously, changing
        // fonts, or resizing a dialog can alter the panel/anchor/clipping boxes
        // without emitting a window resize event. Observe every box that feeds
        // the calculation so placement and height stay current.
        const resizeObserver = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(compute)
            : null;
        if (resizeObserver) {
            const observed = new Set<HTMLElement>([el, parent, ...getClippingAncestors(el)]);
            observed.forEach((element) => resizeObserver.observe(element));
        }
        window.addEventListener("resize", compute);
        window.addEventListener("scroll", compute, true);
        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", compute);
            window.removeEventListener("scroll", compute, true);
        };
    }, [open, gutter, minHeight, panelRef]);

    return pos;
}
