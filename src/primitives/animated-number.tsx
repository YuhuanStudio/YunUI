"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  /** Decimal places; trailing zeros are stripped (100.00 → 100). */
  decimals?: number;
}

/**
 * A number that springs from 0 up to `value` on mount / when `value` changes.
 * Starts at 0 on both server and client, so it is SSR-hydration safe.
 */
export function AnimatedNumber({ value, suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const animatedValue = useSpring(0, { stiffness: 50, damping: 15 });

  const displayValue = useTransform(animatedValue, (latest) => {
    const numStr = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
    return Number(numStr).toString() + suffix;
  });

  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);

  return <motion.span>{displayValue}</motion.span>;
}
