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

// Callout tones map onto YunUI's semantic token vocabulary (`.bg-*-soft` /
// `.text-*` / `.border-*-soft` are real shipped classes, so they re-theme with
// the design system instead of hard-coding raw palette colors). "important" has
// no direct semantic role, so it borrows the accent tokens.
const calloutStyles: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    surface: string;
    accent: string;
    /** For tones with no utility class (accent) — inline token styles. */
    surfaceStyle?: React.CSSProperties;
    accentStyle?: React.CSSProperties;
  }
> = {
  note: {
    icon: Info,
    surface: "bg-info-soft border-info-soft",
    accent: "text-info",
  },
  tip: {
    icon: Lightbulb,
    surface: "bg-success-soft border-success-soft",
    accent: "text-success",
  },
  important: {
    icon: AlertCircle,
    surface: "",
    accent: "",
    surfaceStyle: {
      background: "var(--accent-subtle)",
      borderColor: "var(--accent)",
    },
    accentStyle: { color: "var(--accent)" },
  },
  warning: {
    icon: AlertTriangle,
    surface: "bg-warning-soft border-warning-soft",
    accent: "text-warning",
  },
  caution: {
    icon: XOctagon,
    surface: "bg-error-soft border-error-soft",
    accent: "text-error",
  },
  success: {
    icon: CheckCircle2,
    surface: "bg-success-soft border-success-soft",
    accent: "text-success",
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
      className={cn("my-4 rounded-lg border-l-4 p-4", config.surface, className)}
      style={config.surfaceStyle}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("w-5 h-5 mt-0.5 shrink-0", config.accent)}
          style={config.accentStyle}
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn("font-semibold text-sm mb-1", config.accent)}
            style={config.accentStyle}
          >
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
