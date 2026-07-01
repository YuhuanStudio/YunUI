"use client";

import * as React from "react";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  XOctagon,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";

export type CalloutType =
  | "note"
  | "tip"
  | "important"
  | "warning"
  | "caution"
  | "success";

export interface CalloutBlockProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutStyles: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  note: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
    titleColor: "text-blue-700 dark:text-blue-300",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-500",
    titleColor: "text-green-700 dark:text-green-300",
  },
  important: {
    icon: AlertCircle,
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-500",
    titleColor: "text-purple-700 dark:text-purple-300",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-700 dark:text-yellow-300",
  },
  caution: {
    icon: XOctagon,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500",
    titleColor: "text-red-700 dark:text-red-300",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500",
    titleColor: "text-emerald-700 dark:text-emerald-300",
  },
};

const defaultTitles: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  success: "Success",
};

/**
 * GitHub-style callout box (note / tip / important / warning / caution /
 * success). Renders a colored, left-bordered panel with a semantic icon.
 */
export function CalloutBlock({
  type,
  title,
  children,
  className,
}: CalloutBlockProps) {
  const t = useContentT();
  const config = calloutStyles[type] || calloutStyles.note;
  const Icon = config.icon;
  const displayTitle = title || t(type, defaultTitles[type] || defaultTitles.note);

  return (
    <div
      className={cn(
        "my-4 rounded-lg border-l-4 p-4",
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold text-sm mb-1", config.titleColor)}>
            {displayTitle}
          </p>
          <div className="text-sm text-foreground/80 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Parse a GitHub-style callout marker (`[!NOTE] optional title`) from the first
 * line of a blockquote. Returns `{ type: null }` when the line isn't a callout.
 */
export function parseCalloutType(text: string): {
  type: CalloutType | null;
  title: string | null;
} {
  const match = text.match(
    /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS)\](?:\s+(.+))?$/i,
  );
  if (match) {
    return {
      type: match[1].toLowerCase() as CalloutType,
      title: match[2] || null,
    };
  }
  return { type: null, title: null };
}
