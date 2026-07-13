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

/**
 * Viewport-collision for HAND-ROLLED floating panels (the Radix ones flip/shift
 * on their own). Given the open state and a ref to the absolutely-positioned
 * panel, returns a horizontal `shift`, a `maxHeight`, and a `placement` that keep
 * it inside the screen — flipping above the trigger when the space below is too
 * small and there's more room above. Measures via untransformed `offset*` /
 * `getBoundingClientRect` so an in-flight scale/translate animation doesn't skew it.
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
        const compute = () => {
            const el = panelRef.current;
            // offsetParent is the panel's positioned ancestor — the `relative` wrapper that also
            // holds the trigger, so its rect approximates the trigger box (the absolute panel adds
            // no height to it).
            const parent = el?.offsetParent as HTMLElement | null;
            if (!el || !parent) return;
            const parentRect = parent.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Natural (un-shifted) box in viewport coords. offsetLeft includes the
            // applied marginLeft, so remove the current shift first.
            const naturalLeft = parentRect.left + el.offsetLeft - shiftRef.current;
            const naturalRight = naturalLeft + el.offsetWidth;
            let dx = 0;
            if (naturalRight > vw - gutter) dx = vw - gutter - naturalRight;
            if (naturalLeft + dx < gutter) dx = gutter - naturalLeft;
            dx = Math.round(dx);

            // Vertical: prefer opening downward, but flip up when the content can't fit below and
            // there's more room above. Each side's free space caps the panel height (with an
            // internal scroll region taking over past minHeight).
            const belowSpace = Math.floor(vh - parentRect.bottom - gutter);
            const aboveSpace = Math.floor(parentRect.top - gutter);
            const naturalHeight = el.scrollHeight;
            const placement: "top" | "bottom" =
                belowSpace >= naturalHeight || belowSpace >= aboveSpace ? "bottom" : "top";
            const side = placement === "bottom" ? belowSpace : aboveSpace;
            const maxHeight = naturalHeight > side ? Math.max(side, minHeight) : undefined;

            shiftRef.current = dx;
            setPos({ shift: dx, maxHeight, placement });
        };

        compute();
        window.addEventListener("resize", compute);
        window.addEventListener("scroll", compute, true);
        return () => {
            window.removeEventListener("resize", compute);
            window.removeEventListener("scroll", compute, true);
        };
    }, [open, gutter, minHeight, panelRef]);

    return pos;
}
