"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Button } from "../primitives";
import { cn } from "../lib/cn";

/** Host-provided row in a proposed data change. */
export type DiffTableState = "idle" | "busy" | "applied" | "error" | "cancelled" | "disabled";
export type DiffTableChange = "remove" | "add" | "unchanged";
export type DiffTableCategoryTone = "accent" | "muted" | "warning";

export interface DiffTableRow {
  /** Stable host ID used by `selectedIds` and callbacks. */
  id: string;
  /** Primary cell and default accessible name for the row control. */
  primary: string;
  category: ReactNode;
  secondary: ReactNode;
  change: DiffTableChange;
  categoryTone?: DiffTableCategoryTone;
  accessibleLabel?: string;
  /** Keeps a changed row visible as context; it cannot be selected or applied. */
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
  /** Controlled IDs for included additions/removals. */
  selectedIds: readonly string[];
  onSelectionChange?: (selectedIds: readonly string[]) => void;
  /** Host callbacks; the component never marks a request successful itself. */
  onApply?: (selectedIds: readonly string[]) => void;
  onReject?: (selectedIds: readonly string[]) => void;
  state?: DiffTableState;
  /** Optional host-rendered request detail for non-idle states. */
  statusMessage?: ReactNode;
  /** Use when the host clears `selectedIds` after apply but wants to retain result count. */
  resultCount?: number;
  labels?: DiffTableLabels;
  className?: string;
}

const CATEGORY_TONE: Record<DiffTableCategoryTone, string> = {
  accent: "bg-accent",
  muted: "bg-muted-foreground",
  warning: "bg-warning-solid-medium",
};

function IncludedMark({ included, tone }: { included: boolean; tone: "error" | "success" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] transition-[background-color,color,transform] duration-150",
        included
          ? tone === "error" ? "bg-(--error) text-[var(--bg-base)]" : "bg-(--success) text-[var(--bg-base)]"
          : "bg-muted text-muted-foreground shadow-[0_0_0_1px_var(--border-default)]",
      )}
      style={{ transform: included ? "scale(1)" : "scale(0.92)" }}
    >
      {included ? <Check aria-hidden="true" className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

function stateText(state: DiffTableState, labels: DiffTableLabels, count: number) {
  if (state === "busy") return labels.busy ?? "Applying changes…";
  if (state === "applied") return labels.applied?.(count) ?? `${count} ${count === 1 ? "edit" : "edits"} applied`;
  if (state === "error") return labels.error ?? "Could not apply changes";
  if (state === "cancelled") return labels.cancelled ?? "Changes cancelled";
  if (state === "disabled") return labels.disabled ?? "Changes unavailable";
  return null;
}

/**
 * Review proposed row changes while keeping selection, apply/reject requests,
 * and request outcomes under host control. Adapted from the pinned MIT source
 * `reference/beautiful-ui/components/primitives/DiffTable.tsx` at
 * `44a274e598395ab61e7c96c26fda2758780253b7`.
 */
export function DiffTable({
  rows,
  selectedIds,
  onSelectionChange,
  onApply,
  onReject,
  state = "idle",
  statusMessage,
  resultCount,
  labels,
  className,
}: DiffTableProps) {
  const selected = new Set(selectedIds);
  const changeRows = rows.filter((row) => row.change !== "unchanged");
  // Disabled rows stay visible as context, but cannot be included in an apply request.
  const selectableRows = changeRows.filter((row) => !row.disabled);
  const validSelected = selectableRows.filter((row) => selected.has(row.id));
  const selectedValues = validSelected.map((row) => row.id);
  const removals = validSelected.filter((row) => row.change === "remove").length;
  const additions = validSelected.filter((row) => row.change === "add").length;
  const changeCount = removals + additions;
  const locked = state !== "idle";
  const requestStatus = stateText(state, labels ?? {}, resultCount ?? changeCount);

  const toggleRow = (row: DiffTableRow) => {
    if (locked || row.disabled || row.change === "unchanged" || !onSelectionChange) return;
    const next = new Set(selectedValues);
    if (next.has(row.id)) next.delete(row.id);
    else next.add(row.id);
    // Keep stable host IDs in table order; ignore stale IDs and unchanged rows.
    onSelectionChange(selectableRows.filter((candidate) => next.has(candidate.id)).map((candidate) => candidate.id));
  };

  const renderRow = (row: DiffTableRow) => {
    const changed = row.change !== "unchanged";
    const included = changed && !row.disabled && selected.has(row.id);
    const removed = row.change === "remove";
    const interactive = changed && !row.disabled && !locked && Boolean(onSelectionChange);
    const tint = included ? (removed ? "bg-error-soft" : "bg-success-soft") : "";
    const cellTone = included ? (removed ? "text-error" : "text-success") : "";
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
        className={cn(
          "border-b border-border transition-[background-color,filter,opacity] duration-150 last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          tint,
          interactive && "cursor-pointer hover:brightness-[0.985]",
        )}
      >
        <td className={cn("px-3 @max-[320px]/diff:px-2 py-2.5 text-[13px] font-medium tabular-nums text-foreground transition-colors duration-200", cellTone)}>
          {row.primary}
        </td>
        <td className="px-3 @max-[320px]/diff:px-2 py-2.5">
          <span className="inline-flex h-5 min-w-0 max-w-full items-center gap-1.5 rounded-full bg-muted px-2 @max-[320px]/diff:px-1.5 text-[11.5px] font-medium shadow-[0_0_0_1px_var(--border-default)]">
            {row.categoryTone ? <span className={cn("size-1.5 shrink-0 rounded-full", CATEGORY_TONE[row.categoryTone])} aria-hidden="true" /> : null}
            <span className="min-w-0 truncate text-[var(--text-secondary)]">{row.category}</span>
          </span>
        </td>
        <td
          className={cn("px-3 @max-[320px]/diff:px-2 py-2.5 text-[12.5px] text-[var(--text-secondary)] transition-colors duration-200", cellTone, included && removed && "line-through")}
          style={included && removed ? { textDecorationColor: "color-mix(in srgb, var(--error) 50%, transparent)" } : undefined}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">{row.secondary}</span>
            {changed ? <IncludedMark included={included} tone={removed ? "error" : "success"} /> : null}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className={cn("@container/diff w-full max-w-[380px]", className)} data-yunui="diff-table" data-diff-state={state}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
          <span className="min-w-0 text-[12.5px] font-medium text-foreground">{labels?.title ?? "Proposed changes"}</span>
          {state === "idle" && changeCount > 0 ? <span className="shrink-0 text-[11px] text-[var(--text-secondary)]">{labels?.hint ?? "Select the changes to apply"}</span> : null}
        </div>

        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[34%] @max-[320px]/diff:w-[40%]" />
            <col className="w-[30%] @max-[320px]/diff:w-[28%]" />
            <col className="w-[36%] @max-[320px]/diff:w-[32%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              {[labels?.primaryColumn ?? "Item", labels?.categoryColumn ?? "Category", labels?.secondaryColumn ?? "Details"].map((heading, index) => (
                <th key={index} scope="col" className="px-3 @max-[320px]/diff:px-2 py-2.5 whitespace-nowrap text-[12px] font-medium text-[var(--text-secondary)]">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows.map(renderRow)}</tbody>
        </table>

        <div className="flex min-h-11 items-center justify-between gap-3 @max-[320px]/diff:flex-wrap border-t border-border px-2.5 py-2">
          {state === "idle" ? (
            <>
              <span className="min-w-0 @max-[320px]/diff:w-full text-[11.5px] tabular-nums text-[var(--text-secondary)]" aria-live="polite">
                {labels?.selectionSummary?.(removals, additions) ?? `${removals} ${removals === 1 ? "removal" : "removals"} · ${additions} ${additions === 1 ? "addition" : "additions"}`}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 @max-[320px]/diff:ml-auto">
                {onReject ? <Button type="button" variant="ghost" size="sm" className="h-7 rounded-full px-2.5 text-[12px]" onClick={() => onReject(selectedValues)}>{labels?.reject ?? "Reject"}</Button> : null}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="h-7 rounded-full px-3 text-[12px]"
                  disabled={!onApply || changeCount === 0}
                  onClick={() => { if (onApply && changeCount > 0) onApply(selectedValues); }}
                >
                  {labels?.apply?.(changeCount) ?? `Apply ${changeCount} ${changeCount === 1 ? "change" : "changes"}`}
                </Button>
              </span>
            </>
          ) : (
            <span role="status" aria-live="polite" className="min-w-0 text-[11.5px] text-[var(--text-secondary)]">
              {statusMessage ?? requestStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiffTable;
