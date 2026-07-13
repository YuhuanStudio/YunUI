"use client";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';

// src/lib/cn.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
function useAnchoredPosition(open, panelRef, opts) {
  const gutter = opts?.gutter ?? 8;
  const minHeight = opts?.minHeight ?? 160;
  const [pos, setPos] = useState({ shift: 0, maxHeight: void 0, placement: "bottom" });
  const shiftRef = useRef(0);
  useIsoLayoutEffect(() => {
    if (!open) {
      shiftRef.current = 0;
      setPos({ shift: 0, maxHeight: void 0, placement: "bottom" });
      return;
    }
    const compute = () => {
      const el = panelRef.current;
      const parent = el?.offsetParent;
      if (!el || !parent) return;
      const parentRect = parent.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const naturalLeft = parentRect.left + el.offsetLeft - shiftRef.current;
      const naturalRight = naturalLeft + el.offsetWidth;
      let dx = 0;
      if (naturalRight > vw - gutter) dx = vw - gutter - naturalRight;
      if (naturalLeft + dx < gutter) dx = gutter - naturalLeft;
      dx = Math.round(dx);
      const belowSpace = Math.floor(vh - parentRect.bottom - gutter);
      const aboveSpace = Math.floor(parentRect.top - gutter);
      const naturalHeight = el.scrollHeight;
      const placement = belowSpace >= naturalHeight || belowSpace >= aboveSpace ? "bottom" : "top";
      const side = placement === "bottom" ? belowSpace : aboveSpace;
      const maxHeight = naturalHeight > side ? Math.max(side, minHeight) : void 0;
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

export { cn, useAnchoredPosition };
//# sourceMappingURL=chunk-J5MNZHQB.js.map
//# sourceMappingURL=chunk-J5MNZHQB.js.map