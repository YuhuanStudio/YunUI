import { useEffect, useLayoutEffect, useRef, useState } from "react";

// SSR-safe layout effect: useLayoutEffect on the client, no-op on the server
// (effects don't run during SSR, and this avoids React's dev warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface AnchoredPosition {
    /** Horizontal nudge (px) to keep the panel on-screen. Apply as `marginLeft`
     *  — it never collides with `transform` (framer-motion / `animate-in`) or the
     *  panel's left/right anchor. */
    shift: number;
    /** Cap (px) so the panel can't run off the bottom edge; pair with an
     *  internal scroll region (`flex-1 min-h-0` / `overflow-y-auto`). */
    maxHeight?: number;
}

/**
 * Viewport-collision for HAND-ROLLED floating panels (the Radix ones flip/shift
 * on their own). Given the open state and a ref to the absolutely-positioned
 * panel, returns a horizontal `shift` and a `maxHeight` that keep it inside the
 * screen. Measures via untransformed `offset*` against the panel's
 * `offsetParent`, so an in-flight scale/translate animation doesn't skew it.
 */
export function useAnchoredPosition(
    open: boolean,
    panelRef: React.RefObject<HTMLElement | null>,
    opts?: { gutter?: number; minHeight?: number },
): AnchoredPosition {
    const gutter = opts?.gutter ?? 8;
    const minHeight = opts?.minHeight ?? 160;
    const [pos, setPos] = useState<AnchoredPosition>({ shift: 0, maxHeight: undefined });
    // The shift currently baked into the panel's margin — subtract it to recover
    // the natural box on each recompute (otherwise it would drift).
    const shiftRef = useRef(0);

    useIsoLayoutEffect(() => {
        if (!open) {
            shiftRef.current = 0;
            setPos({ shift: 0, maxHeight: undefined });
            return;
        }
        const compute = () => {
            const el = panelRef.current;
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

            const top = parentRect.top + el.offsetTop;
            const space = Math.floor(vh - top - gutter);
            const maxHeight = space < vh ? Math.max(space, minHeight) : undefined;

            shiftRef.current = dx;
            setPos({ shift: dx, maxHeight });
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
