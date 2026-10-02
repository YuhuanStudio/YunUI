"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "./utils";

/*
 * Host-controlled adaptation of reference/beautiful-ui/components/primitives/DiffTable.tsx
 * at slev12397/beautiful-ui@44a274e598395ab61e7c96c26fda2758780253b7 (MIT).
 * Preserve its card, fixed three-column table, inclusion marks, tinting and row
 * interaction geometry. Demo records, stage timers, selection, and completion
 * are supplied/owned by the host.
 */

export type DiffTableState = "idle" | "busy" | "applied" | "error" | "cancelled" | "disabled";
export type DiffTableChange = "remove" | "add" | "unchanged";
export type DiffTableCategoryTone = "accent" | "muted" | "warning";

export interface DiffTableRow {
  /** Stable key used for React identity and the controlled selectedIds contract. */
  id: string;
  /** Primary cell text and default accessible name. */
  primary: string;
  category: ReactNode;
  secondary: ReactNode;
  /** Whether this row is a proposed removal, addition, or unchanged context row. */
  change: DiffTableChange;
  categoryTone?: DiffTableCategoryTone;
  /** Optional host-localized or more descriptive accessible name for row selection. */
  accessibleLabel?: string;
  /** Leaves the row visible as context but prevents it from changing selection. */
  disabled?: boolean;
}

export interface DiffTableLabels {
  title?: ReactNode;
  hint?: ReactNode;
  primaryColumn?: ReactNode;
  categoryColumn?: ReactNode;
  secondaryColumn?: ReactNode;
  selectionSummary?: (removals: number, additions: number) => ReactNode;
  apply?: (count: number) => ReactNode;
  reject?: ReactNode;
  applied?: (count: number) => ReactNode;
  busy?: ReactNode;
  error?: ReactNode;
  cancelled?: ReactNode;
  disabled?: ReactNode;
  includeRow?: (label: string) => string;
}

export interface DiffTableProps {
  rows: readonly DiffTableRow[];
  /** Controlled IDs of proposed additions/removals the host currently includes. */
  selectedIds: readonly string[];
  onSelectionChange?: (selectedIds: readonly string[]) => void;
  /** Host-owned requests. The table never optimistically declares either complete. */
  onApply?: (selectedIds: readonly string[]) => void;
  onReject?: (selectedIds: readonly string[]) => void;
  /** Host-owned lifecycle. Action controls are enabled only in `idle`. */
  state?: DiffTableState;
  /** Optional host-rendered detail for busy/error/cancelled states. */
  statusMessage?: ReactNode;
  labels?: DiffTableLabels;
  className?: string;
}

const CATEGORY_TONE: Record<DiffTableCategoryTone, string> = {
  accent: "bg-accent",
  muted: "bg-ink-3",
  warning: "bg-orange",
};

function IncludedMark({ included, tone }: { included: boolean; tone: "red" | "green" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-4.5 shrink-0 items-center justify-center rounded-[5px] transition-[background-color,color,transform] duration-150 ${
        included
          ? tone === "red" ? "bg-red text-[var(--bg-base)]" : "bg-green text-[var(--bg-base)]"
          : "bg-inset text-ink-3 shadow-hairline"
      }`}
      style={{ transform: included ? "scale(1)" : "scale(0.92)" }}
    >
      {included ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : null}
    </span>
  );
}

function describeState(state: DiffTableState, labels: DiffTableLabels, count: number) {
  if (state === "busy") return labels.busy ?? "Applying changes…";
  if (state === "applied") return labels.applied?.(count) ?? `${count} ${count === 1 ? "edit" : "edits"} applied`;
  if (state === "error") return labels.error ?? "Could not apply changes";
  if (state === "cancelled") return labels.cancelled ?? "Changes cancelled";
  if (state === "disabled") return labels.disabled ?? "Changes unavailable";
  return null;
}

export default function DiffTable({
  rows,
  selectedIds,
  onSelectionChange,
  onApply,
  onReject,
  state = "idle",
  statusMessage,
  labels,
  className,
}: DiffTableProps) {
  const selected = new Set(selectedIds);
  const eligibleRows = rows.filter((row) => row.change !== "unchanged" && !row.disabled);
  const validSelected = eligibleRows.filter((row) => selected.has(row.id));
  const selectedValues = validSelected.map((row) => row.id);
  const removals = validSelected.filter((row) => row.change === "remove").length;
  const additions = validSelected.filter((row) => row.change === "add").length;
  const changeCount = removals + additions;
  const locked = state !== "idle";
  const statusText = describeState(state, labels ?? {}, changeCount);

  const toggleRow = (row: DiffTableRow) => {
    if (locked || row.disabled || row.change === "unchanged" || !onSelectionChange) return;
    const next = new Set(selectedValues);
    if (next.has(row.id)) next.delete(row.id);
    else next.add(row.id);
    // Emit deterministic table order and exclude stale/unchangeable host IDs.
    onSelectionChange(eligibleRows.filter((candidate) => next.has(candidate.id)).map((candidate) => candidate.id));
  };

  const rowInteractive = (row: DiffTableRow) =>
    !locked && !row.disabled && row.change !== "unchanged" && Boolean(onSelectionChange);
  const renderRow = (row: DiffTableRow) => {
    const included = selected.has(row.id);
    const changed = row.change !== "unchanged";
    const interactive = rowInteractive(row);
    const removed = row.change === "remove";
    const tinted = changed && included;
    const accessibleLabel = row.accessibleLabel ?? row.primary;

    return (
      <tr
        key={row.id}
        tabIndex={interactive ? 0 : undefined}
        aria-label={changed ? (labels?.includeRow?.(accessibleLabel) ?? `Include change: ${accessibleLabel}`) : undefined}
        aria-selected={changed ? included : undefined}
        aria-disabled={changed && !interactive ? true : undefined}
        onClick={interactive ? () => toggleRow(row) : undefined}
        onKeyDown={interactive ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleRow(row);
          }
        } : undefined}
        className={`border-b border-line transition-[background-color,filter,opacity] duration-150 last:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent ${
          interactive ? "cursor-pointer hover:brightness-[0.985]" : ""
        }`}
        style={{ background: tinted ? removed ? "var(--red-tint)" : "var(--green-tint)" : undefined }}
      >
        <td
          className="primitive-table-cell text-[13px] font-medium tabular-nums transition-colors duration-200"
          style={{ color: tinted ? removed ? "var(--red)" : "var(--green)" : "var(--ink)" }}
        >
          {row.primary}
        </td>
        <td className="primitive-table-cell">
          <span
            className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-inset px-2 text-[11.5px] font-medium shadow-hairline transition-opacity duration-200"
            style={{ opacity: tinted ? 0.55 : 1 }}
          >
            {row.categoryTone ? <span className={`size-1.5 rounded-full ${CATEGORY_TONE[row.categoryTone]}`} /> : null}
            <span className="text-ink-2">{row.category}</span>
          </span>
        </td>
        <td
          className="primitive-table-cell text-[12.5px] whitespace-nowrap transition-colors duration-200"
          style={{
            color: tinted ? removed ? "var(--red)" : "var(--green)" : "var(--ink-2)",
            textDecorationLine: tinted && removed ? "line-through" : "none",
            textDecorationColor: "color-mix(in srgb, var(--red) 50%, transparent)",
          }}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">{row.secondary}</span>
            {changed && <IncludedMark included={included} tone={removed ? "red" : "green"} />}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className={cn("w-full max-w-95", className)} data-upstream-component="diff-table" data-diff-state={state}>
      <div className="relative overflow-hidden rounded-card bg-surface shadow-card">
        <div className="primitive-card-bar flex items-center justify-between border-b border-line gap-3">
          <span className="text-[12.5px] font-medium text-ink">{labels?.title ?? "Proposed changes"}</span>
          {state === "idle" && changeCount > 0 ? <span className="text-[11px] text-ink-3">{labels?.hint ?? "Select the changes to apply"}</span> : null}
        </div>

        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[30%]" />
            <col className="w-[36%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line">
              {[labels?.primaryColumn ?? "Item", labels?.categoryColumn ?? "Category", labels?.secondaryColumn ?? "Details"].map((heading, index) => (
                <th key={index} scope="col" className="primitive-table-cell text-[12px] font-medium text-ink-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows.map(renderRow)}</tbody>
        </table>

        <div className="primitive-card-footer flex min-h-11 items-center justify-between gap-3 border-t border-line">
          {state === "idle" ? (
            <>
              <span className="text-[11.5px] tabular-nums text-ink-3" aria-live="polite">
                {labels?.selectionSummary?.(removals, additions) ?? `${removals} ${removals === 1 ? "removal" : "removals"} · ${additions} ${additions === 1 ? "addition" : "additions"}`}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                {onReject ? (
                  <Button type="button" variant="quiet" size="xs" onClick={() => onReject(selectedValues)}>
                    {labels?.reject ?? "Reject"}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="accent"
                  size="xs"
                  disabled={!onApply || changeCount === 0}
                  className="text-[var(--bg-base)]"
                  onClick={() => { if (onApply && changeCount > 0) onApply(selectedValues); }}
                >
                  {labels?.apply?.(changeCount) ?? `Apply ${changeCount} ${changeCount === 1 ? "change" : "changes"}`}
                </Button>
              </span>
            </>
          ) : (
            <span role="status" aria-live="polite" className="min-w-0 text-[11.5px] text-ink-2">
              {statusMessage ?? statusText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
