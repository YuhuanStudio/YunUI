"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

/** Semantic roles used by the distribution charts. */
export type ChartTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";

/** One host-supplied chart value. `null` means unavailable, while `0` is data. */
export interface ChartDatum {
  id: string;
  label: string;
  value: number | null;
  tone?: ChartTone;
  /** Explicit CSS color for this datum, when a semantic tone is insufficient. */
  color?: string;
}

export interface BarChartProps {
  /** Values must be nonnegative; negative and non-finite values are shown as unavailable. */
  data: readonly ChartDatum[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  emptyLabel?: string;
  unavailableLabel?: string;
  height?: number;
  onSelect?: (datum: ChartDatum) => void;
  className?: string;
}

export interface DonutChartProps extends Omit<BarChartProps, "height"> {
  center?: ReactNode;
  size?: number;
}

export interface HeatmapProps {
  rows: readonly string[];
  columns: readonly string[];
  data: readonly (readonly (number | null)[])[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  emptyLabel?: string;
  unavailableLabel?: string;
  tone?: ChartTone;
  onSelect?: (rowIndex: number, columnIndex: number) => void;
  className?: string;
}

const TONE_COLOR: Record<ChartTone, string> = {
  accent: "var(--accent-solid-strong)",
  success: "var(--success-solid-strong)",
  warning: "var(--warning-solid-strong)",
  error: "var(--danger-solid-strong)",
  info: "var(--info-solid-strong)",
  neutral: "var(--neutral-solid-strong)",
};

const TONE_TEXT: Record<ChartTone, string> = {
  accent: "var(--accent-on-solid-strong)",
  success: "var(--success-on-solid-strong)",
  warning: "var(--warning-on-solid-strong)",
  error: "var(--danger-on-solid-strong)",
  info: "var(--info-on-solid-strong)",
  neutral: "var(--neutral-on-solid-strong)",
};

const valueText = (value: number, formatValue?: (value: number) => string) =>
  formatValue ? formatValue(value) : String(value);

/** A vertical, horizontally scrollable comparison of nonnegative values. */
export function BarChart({
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  height = 240,
  onSelect,
  className,
}: BarChartProps) {
  const values = data.map((datum) =>
    typeof datum.value === "number" && Number.isFinite(datum.value) && datum.value >= 0 ? datum.value : null,
  );
  const max = Math.max(0, ...values.filter((value): value is number => value !== null));

  if (data.length === 0) {
    return <div role="img" aria-label={ariaLabel} className={cn("flex items-center justify-center text-sm text-muted-foreground", className)} style={{ height }}>{emptyLabel}</div>;
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn("w-full", className)}>
      <div className="relative min-w-0 overflow-x-auto border-b border-border/60 pb-2" style={{ height }}>
        <span aria-hidden="true" className="absolute left-1 top-1 text-[10px] tabular-nums text-muted-foreground">{valueText(max, formatValue)}</span>
        <span aria-hidden="true" className="absolute bottom-8 left-1 text-[10px] tabular-nums text-muted-foreground">0</span>
        <span aria-hidden="true" className="absolute bottom-8 left-7 top-8 border-l border-border/60" />
        <div className="flex h-full min-w-0 items-end gap-3 px-2 pl-10 pt-5">
        {data.map((datum, index) => {
          const value = values[index];
          const unavailable = value === null;
          const percent = value === null ? 0 : max > 0 ? (value / max) * 100 : 0;
          const color = datum.color ?? TONE_COLOR[datum.tone ?? "accent"];
          const text = unavailable ? unavailableLabel : valueText(value, formatValue);
          const label = `${datum.label}: ${text}`;
          return (
            <div key={`${datum.id}:${index}`} className="group flex h-full min-w-14 flex-1 flex-col items-center justify-end gap-2">
              <span className="max-w-28 truncate text-center text-xs tabular-nums text-muted-foreground">{text}</span>
              <div className="flex h-full w-full min-h-0 items-end justify-center">
                <div
                  role={onSelect ? "button" : "img"}
                  aria-label={label}
                  aria-disabled={onSelect ? unavailable || undefined : undefined}
                  tabIndex={0}
                  onClick={(event) => {
                    if (unavailable) return;
                    event.currentTarget.focus({ preventScroll: true });
                    onSelect?.(datum);
                  }}
                  onKeyDown={(event) => {
                    if (onSelect && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      if (!unavailable) onSelect(datum);
                    }
                  }}
                  className={cn(
                    "relative flex w-full max-w-12 justify-center rounded-t-md outline-none transition-[height,opacity] focus-visible:ring-2 focus-visible:ring-accent-solid-strong focus-visible:ring-offset-2",
                    unavailable ? "min-h-1 border border-dashed border-border bg-muted/50" : value === 0 ? "h-px" : "",
                    onSelect && !unavailable && "cursor-pointer hover:opacity-80",
                    onSelect && unavailable && "cursor-not-allowed",
                  )}
                  style={unavailable ? { height: "5%" } : { height: value === 0 ? "1px" : `${Math.max(percent, 2)}%`, backgroundColor: color }}
                  title={label}
                />
              </div>
              <span className="max-w-28 truncate text-center text-xs text-foreground">{datum.label}</span>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

/** A proportional ring with a textual legend; negative/non-finite values are unavailable. */
export function DonutChart({
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  center,
  size = 208,
  onSelect,
  className,
}: DonutChartProps) {
  const values = data.map((datum) =>
    typeof datum.value === "number" && Number.isFinite(datum.value) && datum.value >= 0 ? datum.value : null,
  );
  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const hasValidValues = values.some((value) => value !== null);
  let cursor = 0;
  const stops = data.flatMap((datum, index) => {
    const value = values[index];
    if (value === null || value <= 0 || total <= 0) return [];
    const start = (cursor / total) * 100;
    cursor += value;
    const end = (cursor / total) * 100;
    return [`${datum.color ?? TONE_COLOR[datum.tone ?? "accent"]} ${start}% ${end}%`];
  });
  const ring = total > 0
    ? `conic-gradient(${stops.join(", ")})`
    : "conic-gradient(var(--border) 0% 100%)";

  return (
    <figure role="group" aria-label={ariaLabel} className={cn("flex min-w-0 flex-wrap items-center justify-center gap-6", className)}>
      <div className="relative shrink-0 rounded-full" style={{ width: `min(${size}px, 100%)`, aspectRatio: "1 / 1", background: ring }} aria-hidden="true">
        <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background px-2 text-center text-sm font-medium tabular-nums">
          {center ?? (hasValidValues ? valueText(total, formatValue) : emptyLabel)}
        </div>
      </div>
      <ul className="m-0 grid min-w-44 flex-1 list-none gap-2 p-0">
        {data.length === 0 ? <li className="text-sm text-muted-foreground">{emptyLabel}</li> : data.map((datum, index) => {
          const value = values[index];
          const available = value !== null;
          const percent = available && total > 0 ? (value / total) * 100 : null;
          const content = <>
            <span className="mt-1 size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: available ? datum.color ?? TONE_COLOR[datum.tone ?? "accent"] : "var(--border)" }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{datum.label}</span>
            <span className="shrink-0 text-muted-foreground tabular-nums">{available ? valueText(value, formatValue) : unavailableLabel}</span>
            <span className="w-12 shrink-0 text-right text-muted-foreground tabular-nums">{percent === null ? "—" : `${percent.toFixed(1)}%`}</span>
          </>;
          return <li key={`${datum.id}:${index}`}>
            {onSelect ? (
              <button type="button" disabled={!available} className="flex w-full items-start gap-2 rounded-md px-2 py-1 text-left text-sm outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-accent-solid-strong disabled:cursor-not-allowed disabled:opacity-60" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); onSelect(datum); }}>
                {content}
              </button>
            ) : <div className="flex items-start gap-2 px-2 py-1 text-sm">{content}</div>}
          </li>;
        })}
      </ul>
    </figure>
  );
}

/** A semantic grid for comparing signed or unsigned values across named rows/columns. */
export function Heatmap({
  rows,
  columns,
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  tone = "accent",
  onSelect,
  className,
}: HeatmapProps) {
  const [active, setActive] = useState({ row: 0, column: 0 });
  const [hovered, setHovered] = useState<{ row: number; column: number } | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const color = TONE_COLOR[tone];
  const values = useMemo(() => rows.flatMap((_, rowIndex) => columns.map((_, columnIndex) => {
    const value = data[rowIndex]?.[columnIndex];
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  })), [rows, columns, data]);
  const maxMagnitude = Math.max(0, ...values.filter((value): value is number => value !== null).map(Math.abs));
  const hasCells = rows.length > 0 && columns.length > 0;
  const rowCount = rows.length;
  const columnCount = columns.length;
  const readout = hovered ?? active;
  const activeRow = Math.min(active.row, Math.max(rowCount - 1, 0));
  const activeColumn = Math.min(active.column, Math.max(columnCount - 1, 0));

  useEffect(() => {
    setActive({ row: 0, column: 0 });
    setHovered(null);
    refs.current = [];
  }, [rowCount, columnCount]);

  const focusCell = (row: number, column: number) => {
    const next = { row: Math.max(0, Math.min(rowCount - 1, row)), column: Math.max(0, Math.min(columnCount - 1, column)) };
    setActive(next);
    refs.current[next.row * columnCount + next.column]?.focus();
  };

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, row: number, column: number) => {
    let nextRow = row;
    let nextColumn = column;
    if (event.key === "ArrowUp") nextRow--;
    else if (event.key === "ArrowDown") nextRow++;
    else if (event.key === "ArrowLeft") nextColumn--;
    else if (event.key === "ArrowRight") nextColumn++;
    else if (event.key === "Home") nextColumn = 0;
    else if (event.key === "End") nextColumn = columnCount - 1;
    else return;
    event.preventDefault();
    focusCell(nextRow, nextColumn);
  };

  if (!hasCells) return <div role="img" aria-label={ariaLabel} className={cn("p-4 text-sm text-muted-foreground", className)}>{emptyLabel}</div>;

  return (
    <div className={cn("min-w-0", className)}>
      <div role="grid" aria-label={ariaLabel} className="max-w-full overflow-x-auto rounded-md border border-border/60">
        <div role="row" className="grid w-max min-w-full border-b border-border/60" style={{ gridTemplateColumns: `minmax(7rem,auto) repeat(${columnCount}, minmax(3.25rem, 1fr))` }}>
          <span role="columnheader" className="sticky left-0 z-10 bg-background p-2 text-xs font-medium text-muted-foreground" />
          {columns.map((column, index) => <span key={`${column}:${index}`} role="columnheader" className="p-2 text-center text-xs font-medium text-muted-foreground">{column}</span>)}
        </div>
        {rows.map((row, rowIndex) => <div key={`${row}:${rowIndex}`} role="row" className="grid w-max min-w-full border-b border-border/40 last:border-0" style={{ gridTemplateColumns: `minmax(7rem,auto) repeat(${columnCount}, minmax(3.25rem, 1fr))` }}>
          <span role="rowheader" className="sticky left-0 z-10 flex items-center bg-background px-2 py-1 text-xs font-medium">{row}</span>
          {columns.map((column, columnIndex) => {
            const index = rowIndex * columnCount + columnIndex;
            const value = values[index];
            const unavailable = value === null;
            const label = `${row}, ${column}: ${unavailable ? unavailableLabel : valueText(value, formatValue)}`;
            const opacity = unavailable || maxMagnitude === 0 ? 0 : Math.max(0.12, Math.abs(value) / maxMagnitude);
            return <div key={`${rowIndex}:${columnIndex}`} className="group relative p-1">
              <button
                ref={(node) => { refs.current[index] = node; }}
                type="button"
                role="gridcell"
                aria-label={label}
                tabIndex={activeRow === rowIndex && activeColumn === columnIndex ? 0 : -1}
                onFocus={() => setActive({ row: rowIndex, column: columnIndex })}
                onMouseEnter={() => setHovered({ row: rowIndex, column: columnIndex })}
                onMouseLeave={() => setHovered(null)}
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setActive({ row: rowIndex, column: columnIndex });
                  onSelect?.(rowIndex, columnIndex);
                }}
                onKeyDown={(event) => moveFocus(event, rowIndex, columnIndex)}
                className={cn("relative flex h-9 w-full min-w-12 items-center justify-center rounded-sm border border-border/50 text-xs tabular-nums outline-none focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-accent-solid-strong", unavailable ? "border-dashed bg-muted/50 text-muted-foreground" : "hover:border-foreground/60")}
                style={unavailable ? undefined : { backgroundColor: `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`, color: opacity >= 0.55 ? TONE_TEXT[tone] : "var(--foreground)" }}
                title={label}
              >
                <span className="max-w-full truncate px-1">{unavailable ? unavailableLabel : valueText(value, formatValue)}</span>
              </button>
            </div>;
          })}
        </div>)}
      </div>
      {(() => {
        const row = rows[readout.row];
        const column = columns[readout.column];
        const value = data[readout.row]?.[readout.column];
        if (row === undefined || column === undefined) return null;
        const available = typeof value === "number" && Number.isFinite(value);
        return <p aria-live="polite" className="mt-2 break-words text-xs text-muted-foreground">{row} · {column}: {available ? valueText(value, formatValue) : unavailableLabel}</p>;
      })()}
    </div>
  );
}
