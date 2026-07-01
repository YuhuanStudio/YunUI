"use client";

import { useRef, useState, type ReactNode, type DragEvent } from "react";
import { cn } from "../lib/cn";

// =====================================================
// FILE DROPZONE
// A drag-and-drop (and click-to-browse) upload target. Wraps a hidden
// <input type="file">, adds drag-over affordance, and reports selected files via
// `onFiles`. Presentation + interaction only — the host decides what to do with
// the files. Pass `children` to fully customize the inner content.
// =====================================================

export interface FileDropzoneProps {
  /** Called with the selected/dropped files (already filtered to a File[]). */
  onFiles: (files: File[]) => void;
  /** `accept` attribute forwarded to the input (e.g. "image/*,.wav"). */
  accept?: string;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  /** Disable interaction and dim the zone. */
  disabled?: boolean;
  /** Leading icon shown above the label (ignored when `children` is set). */
  icon?: ReactNode;
  /** Primary call-to-action text (ignored when `children` is set). */
  label?: ReactNode;
  /** Secondary hint under the label (e.g. "PNG, JPG up to 10MB"). */
  hint?: ReactNode;
  /** Replace the entire inner content. */
  children?: ReactNode;
  className?: string;
}

/**
 * A dashed drop target that accepts files by drag-and-drop or click. Reports
 * selections through `onFiles`; style it via `className` or replace its body
 * with `children`.
 */
export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  icon,
  label = "Drop a file here, or click to browse",
  hint,
  children,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    emit(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragging(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50 border-border"
          : "cursor-pointer border-border hover:border-accent hover:bg-muted/40",
        dragging && !disabled && "border-accent bg-accent/10",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          emit(e.target.files);
          e.target.value = "";
        }}
      />
      {children ?? (
        <>
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div className="text-sm font-medium">{label}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </>
      )}
    </div>
  );
}
