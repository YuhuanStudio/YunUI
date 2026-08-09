"use client";

import * as React from "react";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

export type ChatAttachmentStatus = "idle" | "loading" | "error";

export interface ChatAttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  preview?: React.ReactNode;
  status?: ChatAttachmentStatus;
  progress?: number;
  actions?: React.ReactNode;
}

/**
 * Compact attachment surface shared by composers and sent messages.
 * The host supplies localized labels and actions; YunUI owns the visual
 * hierarchy, progress treatment and status affordances.
 */
export function ChatAttachment({
  name,
  meta,
  icon,
  preview,
  status = "idle",
  progress,
  actions,
  className,
  ...props
}: ChatAttachmentProps) {
  const boundedProgress =
    typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : undefined;

  return (
    <div
      className={cn(
        "group relative flex min-w-0 items-center gap-2.5 rounded-xl border border-border/70 bg-muted/35 px-2.5 py-2",
        "transition-colors hover:bg-muted/60",
        // Was a bare `error` colour name with an alpha modifier, which emits
        // nothing: `error` is a CSS custom property, not a registered Tailwind
        // palette colour, so the tint was invisible. The `-soft` helpers are real.
        status === "error" && "border-error-soft bg-error-soft",
        className,
      )}
      {...props}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
        {preview ?? icon ?? <FileText aria-hidden className="h-4 w-4" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-foreground">{name}</div>
        {meta ? (
          <div className={cn("truncate text-[11px] text-muted-foreground", status === "error" && "text-error")}>
            {meta}
          </div>
        ) : null}
        {status === "loading" && boundedProgress !== undefined ? (
          <div
            className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-label={typeof name === "string" ? name : undefined}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={boundedProgress}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${boundedProgress}%` }}
            />
          </div>
        ) : null}
      </div>

      {status === "loading" ? (
        <Loader2 aria-hidden className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
      ) : null}
      {status === "error" ? (
        <AlertCircle aria-hidden className="h-4 w-4 shrink-0 text-error" />
      ) : null}
      {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
    </div>
  );
}
