"use client";
import { useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// src/lib/hooks.ts
function useEscapeKey(onEscape, enabled = true) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabledRef.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscapeRef.current();
      }
    },
    []
    // No dependencies - uses refs
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);
}
var scrollLockCount = 0;
var originalOverflow = "";
function useBodyScrollLock(locked = true) {
  const hasLockedRef = useRef(false);
  useEffect(() => {
    if (!locked) {
      if (hasLockedRef.current) {
        scrollLockCount--;
        hasLockedRef.current = false;
        if (scrollLockCount === 0) {
          document.body.style.overflow = originalOverflow;
          originalOverflow = "";
        }
      }
      return;
    }
    if (!hasLockedRef.current) {
      if (scrollLockCount === 0) {
        originalOverflow = document.body.style.overflow;
      }
      scrollLockCount++;
      document.body.style.overflow = "hidden";
      hasLockedRef.current = true;
    }
    return () => {
      if (hasLockedRef.current) {
        scrollLockCount--;
        hasLockedRef.current = false;
        if (scrollLockCount === 0) {
          document.body.style.overflow = originalOverflow;
          originalOverflow = "";
        }
      }
    };
  }, [locked]);
}
function useModalBehavior(isOpen, onClose) {
  useEscapeKey(onClose, isOpen);
  useBodyScrollLock(isOpen);
}
var FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
function useFocusTrap(containerRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
    const initial = getFocusable();
    (initial[0] ?? container).focus?.();
    const onKeyDown = (event) => {
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
      previouslyFocused?.focus?.();
    };
  }, [enabled, containerRef]);
}
function useDismissOnOutside(open, onDismiss, ref, options) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const escape = options?.escape ?? true;
  const extraRefs = options?.extraRefs;
  useEffect(() => {
    if (!open) return;
    const isInside = (target) => ref.current?.contains(target) || extraRefs?.some((r) => r.current?.contains(target));
    const onDown = (event) => {
      const target = event.target;
      if (target && !isInside(target)) onDismissRef.current();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onDismissRef.current();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    if (escape) document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      if (escape) document.removeEventListener("keydown", onKey);
    };
  }, [open, escape, ref, extraRefs]);
}
function useScrollableTabStop(ref, axis = "x") {
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const over = axis === "x" ? el.scrollWidth - el.clientWidth > 1 : el.scrollHeight - el.clientHeight > 1;
      setOverflowing(over);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [ref, axis]);
  return overflowing ? 0 : void 0;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
var CLIPPING_OVERFLOW = /^(auto|scroll|hidden|clip|overlay)$/;
function getClippingAncestors(element) {
  const ancestors = [];
  for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor === document.body || ancestor === document.documentElement) continue;
    const style = window.getComputedStyle(ancestor);
    if (CLIPPING_OVERFLOW.test(style.overflowX || style.overflow) || CLIPPING_OVERFLOW.test(style.overflowY || style.overflow)) {
      ancestors.push(ancestor);
    }
  }
  return ancestors;
}
function getClippingBounds(element) {
  const bounds = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0
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
    const el = panelRef.current;
    const parent = el?.offsetParent;
    if (!el || !parent) return;
    const compute = () => {
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
      setPos((current) => current.shift === dx && current.maxHeight === maxHeight && current.placement === placement ? current : { shift: dx, maxHeight, placement });
    };
    let frame = 0;
    const scheduleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        compute();
      });
    };
    compute();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(compute) : null;
    if (resizeObserver) {
      const observed = /* @__PURE__ */ new Set([el, parent, ...getClippingAncestors(el)]);
      observed.forEach((element) => resizeObserver.observe(element));
    }
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", scheduleScroll, { capture: true, passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", scheduleScroll, true);
    };
  }, [open, gutter, minHeight, panelRef]);
  return pos;
}

export { cn, useAnchoredPosition, useBodyScrollLock, useDismissOnOutside, useEscapeKey, useFocusTrap, useModalBehavior, useScrollableTabStop };
//# sourceMappingURL=chunk-YLY2GQ3R.js.map
//# sourceMappingURL=chunk-YLY2GQ3R.js.map