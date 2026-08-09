"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// SEGMENTED BAR
// A single horizontal bar split into proportional colored segments — memory
// allocation (active / cache / free), disk usage by bucket, a request mix.
// Unlike MetricBar (one fill), this stacks many segments to `total`. An
// optional legend lists each segment with its value. Presentation only.
// =====================================================

/** Semantic color role → design-token CSS variable. */
const TONE_VAR: Record<SegmentTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)",
};

export type SegmentTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";

export interface BarSegment {
  /** Segment magnitude, in the same unit as `total`. */
  value: number;
  /** Semantic color. Ignored when `color` is set. */
  tone?: SegmentTone;
  /** Explicit CSS color, overriding `tone`. */
  color?: string;
  /** Legend label and segment title (tooltip). */
  label?: ReactNode;
}

export interface SegmentedBarProps {
  /** The segments, drawn left → right. */
  segments: BarSegment[];
  /** Axis total. Defaults to the sum of segment values; the remainder shows as track. */
  total?: number;
  /** Bar thickness in px. */
  height?: number;
  /** Show a legend of segments with their values below the bar. */
  legend?: boolean;
  /** Format a segment value for the legend (e.g. bytes → "1.2 GB"). */
  formatValue?: (value: number) => ReactNode;
  /**
   * Accessible name for the whole graphic, e.g. "Storage used: 62%".
   * Without it the element is treated as decoration rather than being
   * announced as an anonymous image — an unnamed `role="img"` tells a screen
   * reader there is a picture here and nothing about it.
   */
  label?: string;
  className?: string;
}

const segColor = (s: BarSegment) => s.color ?? TONE_VAR[s.tone ?? "accent"];

/**
 * A proportional multi-segment bar. Give it segments and (optionally) a `total`;
 * each segment takes a slice of the width, with any leftover shown as track.
 */
export function SegmentedBar({
  segments,
  total,
  height = 8,
  legend = false,
  formatValue,
  label,
  className,
}: SegmentedBarProps) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  const axis = total ?? (sum || 1);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="flex w-full overflow-hidden rounded-full bg-muted"
        style={{ height }}
        // Only claim the img role when there is a name for it: an unnamed
        // `role="img"` is announced as an anonymous image, which is worse than
        // leaving the bar as decorative markup.
        role={label ? "img" : undefined}
        aria-label={label}
      >
        {segments.map((s, i) => {
          const w = (Math.max(0, s.value) / axis) * 100;
          if (w <= 0) return null;
          return (
            <div
              key={i}
              className="h-full transition-[width] duration-300 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${w}%`, backgroundColor: segColor(s) }}
              title={typeof s.label === "string" ? s.label : undefined}
            />
          );
        })}
      </div>
      {legend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: segColor(s) }}
              />
              {s.label != null && <span>{s.label}</span>}
              <span className="font-medium tabular-nums text-foreground/80">
                {formatValue ? formatValue(s.value) : s.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
