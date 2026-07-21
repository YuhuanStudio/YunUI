"use client";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';

// src/lib/cn.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
var CLIPPING_OVERFLOW = /^(auto|scroll|hidden|clip|overlay)$/;
function getClippingBounds(element) {
  const bounds = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0
  };
  for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor === document.body || ancestor === document.documentElement) continue;
    const style = window.getComputedStyle(ancestor);
    const clipsX = CLIPPING_OVERFLOW.test(style.overflowX || style.overflow);
    const clipsY = CLIPPING_OVERFLOW.test(style.overflowY || style.overflow);
    if (!clipsX && !clipsY) continue;
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
      const bounds = getClippingBounds(el);
      const naturalLeft = parentRect.left + el.offsetLeft - shiftRef.current;
      const naturalRight = naturalLeft + el.offsetWidth;
      let dx = 0;
      if (naturalRight > bounds.right - gutter) dx = bounds.right - gutter - naturalRight;
      if (naturalLeft + dx < bounds.left + gutter) dx = bounds.left + gutter - naturalLeft;
      dx = Math.round(dx);
      const belowSpace = Math.max(0, Math.floor(bounds.bottom - parentRect.bottom - gutter));
      const aboveSpace = Math.max(0, Math.floor(parentRect.top - bounds.top - gutter));
      const naturalHeight = el.scrollHeight;
      const preferredHeight = Math.min(naturalHeight, minHeight);
      const placement = belowSpace >= preferredHeight || belowSpace >= aboveSpace ? "bottom" : "top";
      const side = placement === "bottom" ? belowSpace : aboveSpace;
      const maxHeight = naturalHeight > side ? side : void 0;
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
//# sourceMappingURL=chunk-XTIDJ7F6.js.map
//# sourceMappingURL=chunk-XTIDJ7F6.js.map