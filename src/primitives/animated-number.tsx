"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  /** Decimal places; trailing zeros are stripped (100.00 → 100). */
  decimals?: number;
  /**
   * Skip the animation and print `value` immediately.
   *
   * Left undefined, this turns itself on in the two cases where a spring is
   * wrong rather than merely unwanted: when the reader has asked for reduced
   * motion, and under a test runner. In jsdom nothing drives the animation
   * frame, so a spring never leaves 0 — a component that counted up would
   * assert as `"0"` forever, which is why Yunxin's copy of this carried its own
   * `NODE_ENV === "test"` escape hatch. Pass an explicit boolean to override.
   */
  immediate?: boolean;
}

/** Format once, the same way the live transform does. */
function format(value: number, decimals: number, suffix: string) {
  const numStr = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return Number(numStr).toString() + suffix;
}

/**
 * A number that springs from 0 up to `value` on mount / when `value` changes.
 * Starts at 0 on both server and client, so it is SSR-hydration safe.
 */
export function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  immediate,
}: AnimatedNumberProps) {
  // Resolved after mount so the server and the first client render agree.
  // `process` is not declared in this DOM-only tsconfig, and the library must
  // not pull in @types/node just to read one env var — hence the guarded cast.
  const [autoImmediate, setAutoImmediate] = useState(() => {
    const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
    return env?.env?.NODE_ENV === "test";
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoImmediate((was) => was || mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const skip = immediate ?? autoImmediate;

  const animatedValue = useSpring(0, { stiffness: 50, damping: 15 });

  const displayValue = useTransform(animatedValue, (latest) =>
    format(latest, decimals, suffix),
  );

  useEffect(() => {
    if (skip) animatedValue.jump(value);
    else animatedValue.set(value);
  }, [animatedValue, value, skip]);

  return <motion.span>{skip ? format(value, decimals, suffix) : displayValue}</motion.span>;
}
