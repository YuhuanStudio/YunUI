"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// AREA CHART
// An interactive line/area chart for a single time series — traffic, cost,
// tokens, latency over time. Smooth bezier curve, gradient area fill, dashed
// grid, and a hover guide with a value tooltip. Container-width (ResizeObserver),
// pure SVG, no chart library. Presentation only: the host supplies the series
// and (optionally) x-axis labels + a value formatter.
//
// This is the "full" chart; for a tiny at-a-glance trend with no axes/tooltip
// use `Sparkline` instead.
// =====================================================

/** Semantic color role → design-token CSS variable. */
const TONE_VAR: Record<AreaChartTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)",
};

export type AreaChartTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";

export interface AreaChartPoint {
  /** The plotted value. */
  value: number;
  /** X-axis + tooltip label for this point (e.g. a formatted time). */
  label?: ReactNode;
}

export interface AreaChartProps {
  /** The series, oldest → newest. Accepts plain numbers or `{ value, label }`. */
  data: Array<AreaChartPoint | number>;
  /** Semantic stroke/fill color. Ignored when `color` is set. */
  tone?: AreaChartTone;
  /** Explicit CSS color, overriding `tone`. */
  color?: string;
  /** Chart height in px (the width fills the container). */
  height?: number;
  /** Format a value for the tooltip (e.g. `(v) => "$" + v.toFixed(2)`). */
  formatValue?: (value: number) => ReactNode;
  /** Draw the dashed horizontal grid. */
  showGrid?: boolean;
  /** Enable the hover guide line + value tooltip. */
  showTooltip?: boolean;
  /** Render the x-axis labels below the chart (needs point `label`s). */
  showXAxis?: boolean;
  /** Line thickness. */
  strokeWidth?: number;
  /** Accessible name for the chart. */
  ariaLabel?: string;
  className?: string;
}

const VIEW_H = 140;

function normalize(data: Array<AreaChartPoint | number>): AreaChartPoint[] {
  return data.map((d) => (typeof d === "number" ? { value: d } : d));
}

/**
 * A container-width interactive area chart. Hover to reveal a guide line and a
 * tooltip with the point's label + formatted value.
 */
export function AreaChart({
  data,
  tone = "accent",
  color,
  height = VIEW_H,
  formatValue,
  showGrid = true,
  showTooltip = true,
  showXAxis = false,
  strokeWidth = 2,
  ariaLabel = "Area chart",
  className,
}: AreaChartProps) {
  const gradientId = useId();
  const stroke = color ?? TONE_VAR[tone];
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const points = useMemo(() => normalize(data), [data]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const values = points.map((p) => (Number.isFinite(p.value) ? p.value : 0));
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const span = maxVal - minVal || 1;
  const chartWidth = width || 600;

  const getPoint = (i: number) => {
    const x = (i / Math.max(points.length - 1, 1)) * chartWidth;
    const normalized = (values[i] - minVal) / span;
    const y = VIEW_H - normalized * VIEW_H * 0.85 - VIEW_H * 0.05;
    return { x, y };
  };

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    const start = getPoint(0);
    let path = `M ${start.x},${start.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = getPoint(i);
      const next = getPoint(i + 1);
      const cpx = (curr.x + next.x) / 2;
      path += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
    }
    return path;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, values, maxVal, minVal, chartWidth]);

  const areaPath = linePath ? `${linePath} L ${chartWidth},${VIEW_H} L 0,${VIEW_H} Z` : "";
  const hoveredCoords = hovered !== null ? getPoint(hovered) : null;
  const fmt = formatValue ?? ((v: number) => String(v));

  const xLabels = points.filter((p) => p.label != null);

  return (
    <div className={cn("flex flex-col", className)}>
      <div ref={containerRef} className="relative w-full" style={{ height }}>
        {points.length < 2 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
        ) : (
          <svg
            viewBox={`0 0 ${chartWidth} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
            role="img"
            aria-label={ariaLabel}
            onMouseMove={(e) => {
              if (!showTooltip) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const idx = Math.min(
                Math.max(0, Math.round((mouseX / rect.width) * (points.length - 1))),
                points.length - 1,
              );
              setHovered(idx);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            {showGrid &&
              [0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <line
                  key={tick}
                  x1={0}
                  y1={VIEW_H * tick}
                  x2={chartWidth}
                  y2={VIEW_H * tick}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeDasharray="4 4"
                  className="text-muted-foreground"
                />
              ))}
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {hoveredCoords && (
              <>
                <line
                  x1={hoveredCoords.x}
                  y1={0}
                  x2={hoveredCoords.x}
                  y2={VIEW_H}
                  stroke={stroke}
                  strokeOpacity={0.4}
                  strokeDasharray="4 4"
                />
                <circle
                  cx={hoveredCoords.x}
                  cy={hoveredCoords.y}
                  r={4}
                  fill={stroke}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>
        )}

        {/* Tooltip — absolutely positioned within the container (no portal). */}
        {showTooltip && hovered !== null && points[hovered] && chartWidth > 0 && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover/95 p-2 text-xs shadow-lg backdrop-blur-sm"
            style={{
              left: `${Math.min(Math.max((getPoint(hovered).x / chartWidth) * 100, 8), 92)}%`,
              top: Math.max((getPoint(hovered).y / VIEW_H) * height - 8, 0),
            }}
          >
            {points[hovered].label != null && (
              <div className="mb-0.5 font-medium">{points[hovered].label}</div>
            )}
            <div className="tabular-nums text-muted-foreground">{fmt(values[hovered])}</div>
          </div>
        )}
      </div>

      {showXAxis && xLabels.length > 1 && (
        <div className="mt-1.5 flex justify-between px-1 text-xs text-muted-foreground">
          {points
            .filter((p, i) => p.label != null && i % Math.ceil(points.length / 6) === 0)
            .map((p, i) => (
              <span key={i} className="truncate">
                {p.label}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
