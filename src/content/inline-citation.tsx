"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives";
import { cn } from "../lib/cn";

export interface InlineCitationProps {
  /** Compact label shown beside the supported claim. */
  label: string;
  /** Full source title shown in the evidence preview. */
  title: string;
  /** Exact source location, for example a hostname or PDF page. */
  meta?: string;
  /** Bounded source excerpt that substantiates the adjacent claim. */
  description?: string;
  /** Optional source icon or favicon. */
  icon?: React.ReactNode;
  /** Open a document location or external URL. */
  onOpen?: () => void;
  className?: string;
}

/**
 * Claim-adjacent evidence marker for grounded AI content.
 *
 * The compact trigger stays in the reading flow. Hover/focus previews the
 * concrete source and clicking delegates navigation to the host application.
 */
export function InlineCitation({
  label,
  title,
  meta,
  description,
  icon,
  onOpen,
  className,
}: InlineCitationProps) {
  return (
    <TooltipProvider delayDuration={180}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-inline-citation
            onClick={onOpen}
            className={cn(
              "mx-1 inline-flex h-6 max-w-40 translate-y-[1px] items-center gap-1 rounded-full",
              "border border-border/60 bg-muted/55 px-2 text-[11px] font-medium leading-none",
              "text-(--text-secondary) transition-colors hover:border-border hover:bg-muted hover:text-(--text-primary)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              className,
            )}
            aria-label={`${label}: ${title}${meta ? `, ${meta}` : ""}`}
          >
            {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
            <span className="truncate">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          sideOffset={8}
          className={cn(
            "w-[min(340px,calc(100vw-24px))] rounded-2xl border border-border",
            // shadow-lg shadow-black/5 is the house overlay drop; shadow-xl was
            // heavier than every other popover in the system.
            "bg-popover p-3 text-popover-foreground shadow-lg shadow-black/5",
          )}
        >
          <div className="flex min-w-0 items-start gap-2.5">
            {icon ? (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <span className="min-w-0 flex-1 text-xs font-semibold leading-snug">{title}</span>
                {onOpen ? <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0 text-(--text-tertiary)" /> : null}
              </div>
              {meta ? <div className="mt-0.5 text-[10px] text-(--text-tertiary)">{meta}</div> : null}
              {description ? (
                <p className="mt-2 line-clamp-4 text-[11px] font-normal leading-relaxed text-(--text-secondary)">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
