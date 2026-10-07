"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "../lib/cn";

export type TimeSeriesTone = "accent" | "info" | "success" | "warning" | "error" | "neutral";

export interface TimeSeriesPoint {
  /** Numeric domain value (for example a timestamp in epoch milliseconds). */
  x: number;
  /** Missing, null, undefined, NaN and infinities are gaps, never zeroes. */
  values: Readonly<Record<string, number | null | undefined>>;
}

export interface TimeSeriesDefinition {
  /** Stable key that selects the corresponding value in each point. */
  key: string;
  label: string;
  tone?: TimeSeriesTone;
  /** Explicit CSS color override for this series. */
  color?: string;
  dashed?: boolean;
}

export interface TimeSeriesChartProps {
  data: readonly TimeSeriesPoint[];
  series: readonly TimeSeriesDefinition[];
  ariaLabel: string;
  emptyLabel?: string;
  unavailableLabel?: string;
  hiddenLabel?: string;
  missingValueLabel?: string;
  legendLabel?: string;
  keyboardHint?: string;
  height?: number;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  /** Break a line when adjacent sorted x values differ by more than this value. */
  maxGap?: number;
  /** Controlled selection; without `onActiveXChange`, a supplied value is read-only. */
  activeX?: number | null;
  onActiveXChange?: (value: number | null) => void;
  showLegend?: boolean;
  className?: string;
}

const TONE_COLOR: Record<TimeSeriesTone, string> = {
  accent: "var(--color-accent)",
  info: "var(--info)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  neutral: "var(--color-muted-foreground)",
};

const DEFAULT_HEIGHT = 252;
const DEFAULT_WIDTH = 640;
const MARGIN = { top: 14, right: 14, bottom: 34, left: 54 };
const Y_TICK_COUNT = 5;
const X_TICK_COUNT = 5;

interface IndexedPoint extends TimeSeriesPoint {
  inputIndex: number;
}

interface PlotPoint {
  x: number;
  y: number;
}

interface PlotSegment {
  point?: PlotPoint;
  path?: string;
}

/**
 * Normalize finite x-values in ascending order; equal x-values are coalesced
 * with last-input-wins semantics, so `activeX` identifies a single sample.
 * Non-finite x-values are discarded. Series keys should be unique; duplicate
 * definitions keep the first definition. Values that are null/non-finite are
 * gaps, and `maxGap` splits a line only when `deltaX > maxGap`.
 */
function normalizeData(data: readonly TimeSeriesPoint[]): TimeSeriesPoint[] {
  const sorted: IndexedPoint[] = data
    .map((point, inputIndex) => ({ ...point, inputIndex }))
    .filter((point) => Number.isFinite(point.x))
    .sort((a, b) => a.x - b.x || a.inputIndex - b.inputIndex);
  const byX = new Map<number, TimeSeriesPoint>();
  for (const point of sorted) byX.set(point.x, { x: point.x, values: point.values });
  return [...byX.values()].sort((a, b) => a.x - b.x);
}

function validValue(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function niceStep(span: number): number {
  if (!Number.isFinite(span) || span <= 0) return 1;
  const rough = span / (Y_TICK_COUNT - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / magnitude;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * magnitude;
}

function makeYTicks(min: number, max: number): number[] {
  const span = max - min;
  const step = niceStep(span);
  const first = Math.ceil(min / step) * step;
  const values: number[] = [];
  for (let value = first, guard = 0; value <= max + step * 1e-8 && guard < 12; value += step, guard += 1) {
    values.push(Number(value.toPrecision(12)));
  }
  if (!values.length) values.push(min, max);
  return values;
}

function selectXTickValues(points: readonly TimeSeriesPoint[], min: number, max: number, count: number): number[] {
  if (points.length <= 1) return points.map((point) => point.x);
  if (count <= 1) return [points[Math.floor((points.length - 1) / 2)]!.x];
  const candidates = Array.from({ length: count }, (_, index) => min + (max - min) * index / (count - 1));
  const selected: number[] = [];
  for (const candidate of candidates) {
    let nearest = points[0]!.x;
    let distance = Math.abs(nearest - candidate);
    for (let index = 1; index < points.length; index += 1) {
      const next = points[index]!.x;
      const nextDistance = Math.abs(next - candidate);
      if (nextDistance < distance) {
        nearest = next;
        distance = nextDistance;
      }
    }
    if (selected.at(-1) !== nearest) selected.push(nearest);
  }
  return selected;
}

function pointForX(points: readonly TimeSeriesPoint[], x: number | null | undefined): TimeSeriesPoint | null {
  if (x == null || !points.length) return null;
  let nearest = points[0]!;
  let distance = Math.abs(nearest.x - x);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index]!;
    const nextDistance = Math.abs(point.x - x);
    if (nextDistance < distance) {
      nearest = point;
      distance = nextDistance;
    }
  }
  return nearest;
}

function formatDefault(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function segmentsForSeries(
  points: readonly TimeSeriesPoint[],
  definition: TimeSeriesDefinition,
  xScale: (x: number) => number,
  yScale: (y: number) => number,
  maxGap: number | undefined,
): PlotPoint[][] {
  const segments: PlotPoint[][] = [];
  let current: PlotPoint[] = [];
  let previousX: number | undefined;
  for (const point of points) {
    const value = validValue(point.values[definition.key]);
    const gap = previousX !== undefined && maxGap !== undefined && point.x - previousX > maxGap;
    if (value === undefined || gap) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (value !== undefined) {
      current.push({ x: xScale(point.x), y: yScale(value) });
    }
    previousX = point.x;
  }
  if (current.length) segments.push(current);
  return segments;
}

function closestPointIndex(points: readonly TimeSeriesPoint[], value: number): number {
  let result = 0;
  let distance = Math.abs(points[0]!.x - value);
  for (let index = 1; index < points.length; index += 1) {
    const nextDistance = Math.abs(points[index]!.x - value);
    if (nextDistance < distance) {
      result = index;
      distance = nextDistance;
    }
  }
  return result;
}

/** Responsive, dependency-free multi-series time chart for arbitrary numeric x data. */
export function TimeSeriesChart({
  data,
  series,
  ariaLabel,
  emptyLabel = "No data",
  unavailableLabel = "No finite values for the visible series",
  hiddenLabel = "All series are hidden",
  missingValueLabel = "—",
  legendLabel = "series",
  keyboardHint = "Use left and right arrow keys, Home or End to inspect sample values.",
  height = DEFAULT_HEIGHT,
  formatX = formatDefault,
  formatY = formatDefault,
  maxGap,
  activeX,
  onActiveXChange,
  showLegend = true,
  className,
}: TimeSeriesChartProps) {
  const instanceId = useId();
  const chartRef = useRef<HTMLDivElement>(null);
  const pointerSelectionRef = useRef(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [internalActiveX, setInternalActiveX] = useState<number | null>(null);
  const [keyboardAnnouncement, setKeyboardAnnouncement] = useState("");
  const controlledActiveX = activeX !== undefined;
  const selectedX = controlledActiveX ? (activeX != null && Number.isFinite(activeX) ? activeX : null) : internalActiveX;
  const canSetActiveX = !controlledActiveX || Boolean(onActiveXChange);
  const points = useMemo(() => normalizeData(data), [data]);
  const definitions = useMemo(() => {
    const seen = new Set<string>();
    return series.filter((item) => {
      if (!item.key || seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    });
  }, [series]);
  const visibleSeries = useMemo(() => definitions.filter((item) => !hiddenKeys.has(item.key)), [definitions, hiddenKeys]);
  const maxGapValue = maxGap !== undefined && Number.isFinite(maxGap) && maxGap >= 0 ? maxGap : undefined;
  const plotWidth = Math.max(1, width - MARGIN.left - MARGIN.right);
  const plotHeight = Math.max(1, height - MARGIN.top - MARGIN.bottom);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    const measure = () => {
      const next = Math.floor(element.getBoundingClientRect().width);
      if (next > 0) setWidth((current) => current === next ? current : next);
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const finiteValues = useMemo(() => {
    const result: number[] = [];
    for (const point of points) for (const definition of visibleSeries) {
      const value = validValue(point.values[definition.key]);
      if (value !== undefined) result.push(value);
    }
    return result;
  }, [points, visibleSeries]);
  const hasPlottableValues = finiteValues.length > 0;
  const rawMinX = points[0]?.x ?? 0;
  const rawMaxX = points.at(-1)?.x ?? 1;
  const xPadding = rawMinX === rawMaxX ? 0.5 : 0;
  const minX = rawMinX - xPadding;
  const maxX = rawMaxX + xPadding;
  const rawMinY = hasPlottableValues ? finiteValues.reduce((min, value) => Math.min(min, value), Infinity) : 0;
  const rawMaxY = hasPlottableValues ? finiteValues.reduce((max, value) => Math.max(max, value), -Infinity) : 1;
  const yPadding = rawMinY === rawMaxY ? Math.max(Math.abs(rawMinY) * 0.05, 1) : 0;
  const minY = rawMinY - yPadding;
  const maxY = rawMaxY + yPadding;
  const yTicks = useMemo(() => hasPlottableValues ? makeYTicks(minY, maxY) : [], [hasPlottableValues, minY, maxY]);
  const widestXLabel = useMemo(() => points.reduce((length, point) => Math.max(length, formatX(point.x).length), 0), [points, formatX]);
  const minXLabelSpacing = Math.max(80, widestXLabel * 6.5 + 16);
  const xTickCount = Math.max(1, Math.min(X_TICK_COUNT, Math.floor(plotWidth / minXLabelSpacing) + 1));
  const xTickValues = useMemo(() => hasPlottableValues ? selectXTickValues(points, minX, maxX, xTickCount) : [], [hasPlottableValues, points, minX, maxX, xTickCount]);
  const { xScale, yScale } = useMemo(() => ({
    xScale: (x: number) => MARGIN.left + ((x - minX) / (maxX - minX || 1)) * plotWidth,
    yScale: (y: number) => MARGIN.top + plotHeight - ((y - minY) / (maxY - minY || 1)) * plotHeight,
  }), [minX, maxX, minY, maxY, plotWidth, plotHeight]);
  const plottedSeries = useMemo(() => visibleSeries.map((definition) => ({
    definition,
    color: definition.color ?? TONE_COLOR[definition.tone ?? "accent"],
    segments: segmentsForSeries(points, definition, xScale, yScale, maxGapValue).map((segment): PlotSegment => segment.length === 1
      ? { point: segment[0] }
      : { path: segment.map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ") }),
  })), [visibleSeries, points, xScale, yScale, maxGapValue]);
  const activePoint = pointForX(points, selectedX);
  const readoutPoint = activePoint ?? points.at(-1) ?? null;
  const canNavigate = points.length > 0 && hasPlottableValues && canSetActiveX;
  const xFormatter = formatX;
  const yFormatter = formatY;
  const clipId = `${instanceId}-plot-clip`;
  const chartWidth = Math.max(width, MARGIN.left + MARGIN.right + 1);

  const setActivePoint = (nextX: number | null, fromKeyboard: boolean) => {
    pointerSelectionRef.current = !fromKeyboard && !controlledActiveX && nextX !== null;
    if (fromKeyboard) {
      const nextPoint = pointForX(points, nextX);
      setKeyboardAnnouncement(nextPoint ? `${xFormatter(nextPoint.x)}. ${definitions.map((definition) => {
        const value = validValue(nextPoint.values[definition.key]);
        return `${definition.label}: ${value === undefined ? missingValueLabel : yFormatter(value)}`;
      }).join(". ")}` : "");
    } else {
      setKeyboardAnnouncement("");
    }
    if (!canSetActiveX) return;
    if (!controlledActiveX) setInternalActiveX(nextX);
    onActiveXChange?.(nextX);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!canSetActiveX || !points.length || !hasPlottableValues) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const svgX = ((event.clientX - rect.left) / rect.width) * chartWidth;
    const domainX = minX + ((svgX - MARGIN.left) / plotWidth) * (maxX - minX);
    const index = closestPointIndex(points, domainX);
    setActivePoint(points[index]!.x, false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canNavigate) return;
    if (event.key === "Escape") { event.preventDefault(); setActivePoint(null, true); return; }
    const currentIndex = activePoint ? closestPointIndex(points, activePoint.x) : -1;
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = currentIndex < 0 ? 0 : Math.min(points.length - 1, currentIndex + 1);
    else if (event.key === "ArrowLeft") nextIndex = currentIndex < 0 ? points.length - 1 : Math.max(0, currentIndex - 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = points.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    setActivePoint(points[nextIndex]!.x, true);
  };

  const toggleSeries = (key: string) => {
    setHiddenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tooltipX = activePoint ? xScale(activePoint.x) : 0;
  const tooltipMaxWidth = Math.max(0, Math.min(288, chartWidth - 16));
  const tooltipHalf = tooltipMaxWidth / 2;
  const tooltipLeft = activePoint
    ? Math.max(8 + tooltipHalf, Math.min(chartWidth - 8 - tooltipHalf, tooltipX))
    : 0;
  const noDataText = data.length === 0 ? emptyLabel : definitions.length > 0 && visibleSeries.length === 0 ? hiddenLabel : unavailableLabel;

  return (
    <figure className={cn("min-w-0", className)} data-yunui="time-series-chart" data-active-x={activePoint?.x ?? undefined}>
      {showLegend && definitions.length > 0 ? (
        <div className="mb-2 flex flex-wrap items-center gap-1.5" role="group" aria-label={`${ariaLabel} ${legendLabel}`}>
          {definitions.map((definition) => {
            const visible = !hiddenKeys.has(definition.key);
            const color = definition.color ?? TONE_COLOR[definition.tone ?? "accent"];
            return (
              <button
                key={definition.key}
                type="button"
                aria-pressed={visible}
                onClick={() => toggleSeries(definition.key)}
                className={cn(
                  "btn btn-ghost btn-sm inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px]",
                  !visible && "opacity-50",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-3 shrink-0 border-t-2"
                  style={{ borderColor: color, borderStyle: definition.dashed ? "dashed" : "solid" }}
                />
                {definition.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        ref={chartRef}
        className="relative min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        role="group"
        aria-label={ariaLabel}
        tabIndex={canNavigate ? 0 : -1}
        onKeyDown={handleKeyDown}
        onPointerLeave={() => {
          // Controlled selection belongs to the host. Uncontrolled keyboard
          // selection should also persist; only pointer-hover state is transient.
          if (!controlledActiveX && pointerSelectionRef.current && selectedX !== null) setActivePoint(null, false);
        }}
        data-yunui="time-series-interaction"
      >
        {hasPlottableValues ? (
          <svg
            className="block w-full overflow-visible"
            width="100%"
            height={height}
            viewBox={`0 0 ${chartWidth} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            onPointerMove={handlePointerMove}
          >
            <defs>
              <clipPath id={clipId}><rect x={MARGIN.left} y={MARGIN.top} width={plotWidth} height={plotHeight} /></clipPath>
            </defs>
            {yTicks.map((tick) => {
              const y = yScale(tick);
              return (
                <g key={`y-${tick}`}>
                  <line x1={MARGIN.left} x2={chartWidth - MARGIN.right} y1={y} y2={y} stroke="var(--border-default)" strokeDasharray="3 5" strokeOpacity="0.72" />
                  <text data-axis="y" x={MARGIN.left - 8} y={y + 3.5} textAnchor="end" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono, ui-monospace, monospace)">{yFormatter(tick)}</text>
                </g>
              );
            })}
            {xTickValues.map((tick) => {
              const x = xScale(tick);
              const anchor = x < MARGIN.left + 26 ? "start" : x > chartWidth - MARGIN.right - 26 ? "end" : "middle";
              return (
                <g key={`x-${tick}`}>
                  <line x1={x} x2={x} y1={MARGIN.top} y2={height - MARGIN.bottom} stroke="var(--border-default)" strokeOpacity="0.22" />
                  <text data-axis="x" x={x} y={height - 9} textAnchor={anchor} fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono, ui-monospace, monospace)">{xFormatter(tick)}</text>
                </g>
              );
            })}
            <g clipPath={`url(#${clipId})`}>
              {plottedSeries.map(({ definition, color, segments }) => {
                return (
                  <g key={definition.key}>
                    {segments.map((segment, index) => segment.point
                      ? <circle key={`${definition.key}-point-${index}`} cx={segment.point.x} cy={segment.point.y} r="3" fill={color} />
                      : <path key={`${definition.key}-segment-${index}`} d={segment.path ?? ""} fill="none" stroke={color} strokeWidth="2" strokeDasharray={definition.dashed ? "5 4" : undefined} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
                    {activePoint ? (() => {
                      const value = validValue(activePoint.values[definition.key]);
                      return value === undefined ? null : <circle cx={xScale(activePoint.x)} cy={yScale(value)} r="3.25" fill="var(--bg-card)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />;
                    })() : null}
                  </g>
                );
              })}
              {activePoint ? <line x1={xScale(activePoint.x)} x2={xScale(activePoint.x)} y1={MARGIN.top} y2={height - MARGIN.bottom} stroke="var(--text-tertiary)" strokeOpacity="0.65" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" /> : null}
            </g>
          </svg>
        ) : (
          <div role="status" className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">{noDataText}</div>
        )}

        {activePoint && hasPlottableValues ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 z-10 max-h-40 overflow-auto rounded-lg border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm"
            style={{ left: tooltipLeft, maxWidth: tooltipMaxWidth, transform: "translateX(-50%)" }}
          >
            <p className="mb-1 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{xFormatter(activePoint.x)}</p>
            <div className="space-y-1">
              {definitions.map((definition) => {
                const value = validValue(activePoint.values[definition.key]);
                const color = definition.color ?? TONE_COLOR[definition.tone ?? "accent"];
                return <div key={definition.key} className="flex min-w-0 items-baseline justify-between gap-4 text-[11px]"><span className="min-w-0 truncate" style={{ color }}>{definition.label}</span><span className="shrink-0 font-mono tabular-nums text-foreground">{value === undefined ? missingValueLabel : yFormatter(value)}</span></div>;
              })}
            </div>
          </div>
        ) : null}
      </div>

      {readoutPoint ? (
        <div className="mt-2 flex min-h-8 flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md bg-muted/40 px-2.5 py-2 text-[11px]" aria-live="off" data-yunui="time-series-readout">
          <span className="font-mono text-muted-foreground">{xFormatter(readoutPoint.x)}</span>
          {definitions.map((definition) => {
            const value = validValue(readoutPoint.values[definition.key]);
            const visible = !hiddenKeys.has(definition.key);
            return <span key={definition.key} className={cn("inline-flex items-baseline gap-1", !visible && "opacity-50")}><span className="text-muted-foreground">{definition.label}</span><span className="font-mono tabular-nums text-foreground">{value === undefined ? missingValueLabel : yFormatter(value)}</span></span>;
          })}
        </div>
      ) : null}
      <figcaption className="sr-only">{ariaLabel}. {keyboardHint}</figcaption>
      <span className="sr-only" data-yunui="time-series-keyboard-announcement" aria-live={keyboardAnnouncement ? "polite" : "off"} aria-atomic="true">{keyboardAnnouncement}</span>
    </figure>
  );
}

export default TimeSeriesChart;
