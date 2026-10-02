"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface ChatHeaderProps {
  /** Left cluster — sidebar toggle, title, model selector, … */
  left?: React.ReactNode;
  /** Center status cluster — mode indicator, feature chips, … (optional). */
  status?: React.ReactNode;
  /** Right cluster — theme toggle, workspace toggle, actions, … */
  actions?: React.ReactNode;
  className?: string;
  /** Overrides the slot layout entirely when provided. */
  children?: React.ReactNode;
}

/**
 * Chat header shell: a translucent, backdrop-blurred bar with left / status /
 * actions slots. Compose your model selector (e.g. YunUI `ModelSelect`), mode
 * chips and toggles into the slots.
 */
export function ChatHeader({
  left,
  status,
  actions,
  className,
  children,
}: ChatHeaderProps) {
  return (
    <div
      data-yunui="chat-header"
      className={cn(
        "flex min-h-[54px] shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-background px-3 py-2.5 text-sm sm:h-[62px] sm:flex-nowrap sm:px-6 sm:py-0",
        className,
      )}
    >
      {children ?? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-3">{left}</div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {status}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {actions}
          </div>
        </>
      )}
    </div>
  );
}
