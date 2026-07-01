"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

// =====================================================
// SPARKLINE
// A tiny inline line/area chart for a single series of numbers — request
// throughput, GPU utilization, latency over time. Pure SVG, no chart library.
// Presentation only: the host supplies the data window; the component scales it
// to fit. Semantic `tone` picks the stroke color from the design tokens; a raw
// `color` overrides it.
// =====================================================

/** Semantic color role → design-token CSS variable. */
const TONE_VAR: Record<SparklineTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)",
};

export type SparklineTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";

export interface SparklineProps extends Omit<React.SVGProps<SVGSVGElement>, "color"> {
  /** The series to plot, oldest → newest. Fewer than 2 points renders nothing. */
  data: number[];
  /** Intrinsic viewBox width; the SVG still scales to its container. */
  width?: number;
  /** Intrinsic viewBox height. */
  height?: number;
  /** Semantic stroke color. Ignored when `color` is set. */
  tone?: SparklineTone;
  /** Explicit CSS color for the stroke (and area fill), overriding `tone`. */
  color?: string;
  /** Stroke width in viewBox units. */
  strokeWidth?: number;
  /** Fill the area under the line with a vertical gradient of the stroke color. */
  area?: boolean;
  /** Lower bound of the value axis. Defaults to the data minimum. */
  min?: number;
  /** Upper bound of the value axis. Defaults to the data maximum. */
  max?: number;
  className?: string;
}

/**
 * A minimal inline line chart. Give it a rolling window of numbers and it draws
 * a smooth, container-width sparkline; set `area` for a gradient fill.
 */
export function Sparkline({
  data,
  width = 100,
  height = 28,
  tone = "accent",
  color,
  strokeWidth = 1.5,
  area = false,
  min,
  max,
  className,
  ...props
}: SparklineProps) {
  const gradientId = useId();
  const stroke = color ?? TONE_VAR[tone];

  if (!Array.isArray(data) || data.length < 2) {
    return <svg width={width} height={height} className={className} aria-hidden {...props} />;
  }

  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const span = hi - lo || 1;
  const stepX = width / (data.length - 1);
  // Inset by strokeWidth so the line never clips at the top/bottom edge.
  const pad = strokeWidth;
  const usableH = height - pad * 2;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = pad + usableH - ((v - lo) / span) * usableH;
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${line} L${width} ${height} L0 ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
      role="img"
      {...props}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
