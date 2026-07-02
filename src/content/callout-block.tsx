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
import { Alert } from "../primitives";
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

// Each callout tone maps onto a YunUI Alert variant + a tone-specific icon, so a
// callout IS an Alert — same soft-tint box, border, icon and title treatment —
// rather than a look-alike. "important" uses the accent tone.
const config: Record<
  CalloutType,
  {
    variant: "info" | "success" | "warning" | "error" | "accent";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  note: { variant: "info", icon: Info },
  tip: { variant: "success", icon: Lightbulb },
  important: { variant: "accent", icon: AlertCircle },
  warning: { variant: "warning", icon: AlertTriangle },
  caution: { variant: "error", icon: XOctagon },
  success: { variant: "success", icon: CheckCircle2 },
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
 * Callout box (note / tip / important / warning / caution / success). Composes
 * YunUI's `Alert` primitive, so it shares the exact soft-tint panel, all-side
 * soft border, leading semantic icon and title of every other Alert in the
 * system — the callout is literally an Alert, not a re-implementation.
 */
export function CalloutBlock({
  type,
  title,
  children,
  className,
}: CalloutBlockProps) {
  const t = useContentT();
  const c = config[type] || config.note;
  const Icon = c.icon;
  const displayTitle = title || t(type, defaultTitles[type] || defaultTitles.note);

  return (
    <Alert
      variant={c.variant}
      title={displayTitle}
      icon={<Icon className="h-4 w-4" />}
      // `not-prose` so the host MarkdownRenderer's prose styles don't inject
      // margins into the Alert's title/body paragraphs (which shoved the title
      // away from the icon). The callout owns its own spacing.
      className={cn("my-4 not-prose", className)}
    >
      <div className="[&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </Alert>
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
