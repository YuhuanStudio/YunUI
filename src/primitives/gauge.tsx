"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// GAUGE
// A circular progress ring for a single 0–100 percentage — GPU utilization,
// cache hit rate, disk usage. Pure SVG. The center shows the value (or a custom
// `label`). Semantic `tone` colors the arc from the design tokens; a raw
// `color` overrides it.
// =====================================================

/** Semantic color role → design-token CSS variable. */
const TONE_VAR: Record<GaugeTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)",
};

export type GaugeTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";

export interface GaugeProps {
  /** Progress, 0–100 (clamped). */
  value: number;
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  /** Semantic arc color. Ignored when `color` is set. */
  tone?: GaugeTone;
  /** Explicit CSS color for the arc, overriding `tone`. */
  color?: string;
  /** Center content. Defaults to the rounded percentage; pass `null` to hide. */
  label?: ReactNode;
  /** Start the arc from the top and sweep clockwise (default) or counter-clockwise. */
  counterClockwise?: boolean;
  className?: string;
}

/**
 * A circular percentage gauge. Feed it a `value` (0–100) and it fills the ring
 * proportionally; the center renders the value unless you pass a custom `label`.
 */
export function Gauge({
  value,
  size = 72,
  thickness = 6,
  tone = "accent",
  color,
  label,
  counterClockwise = false,
  className,
}: GaugeProps) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const stroke = color ?? TONE_VAR[tone];
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="transition-[stroke-dasharray] duration-500 ease-out"
          transform={counterClockwise ? `scale(1,-1) translate(0,${-size})` : undefined}
        />
      </svg>
      {label !== null && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
          {label ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}
