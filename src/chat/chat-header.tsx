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
      className={cn(
        "h-14 flex items-center justify-between gap-3 px-4 border-b border-border",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      {children ?? (
        <>
          <div className="flex items-center gap-3 min-w-0">{left}</div>
          <div className="flex items-center gap-3 shrink-0">
            {status}
            {actions}
          </div>
        </>
      )}
    </div>
  );
}
