"use client";

import * as React from "react";
import { Bot, User, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageProps {
  /** Who sent the message. Drives the default avatar and name. */
  role: ChatRole;
  /** Display name in the header. Defaults to a role label. */
  name?: React.ReactNode;
  /** Avatar node. Defaults to a role icon in a themed circle. */
  avatar?: React.ReactNode;
  /** Right-aligned timestamp (or any node) in the header. */
  timestamp?: React.ReactNode;
  /** Inline chips next to the name (model, latency, mode, …). */
  badges?: React.ReactNode;
  /** Actions revealed on hover below the content (copy, regenerate, …). */
  actions?: React.ReactNode;
  /** Extra content below the body — reasoning steps, tool details, JSON, … */
  footer?: React.ReactNode;
  className?: string;
  /** The message body (plain text, or a rendered <MarkdownRenderer/>). */
  children?: React.ReactNode;
}

const roleDefaults: Record<
  ChatRole,
  { label: string; icon: React.ComponentType<{ className?: string }>; wrap: string; icn: string }
> = {
  user: {
    label: "You",
    icon: User,
    wrap: "bg-primary",
    icn: "text-primary-foreground",
  },
  assistant: {
    label: "Assistant",
    icon: Bot,
    wrap: "bg-muted border",
    icn: "text-muted-foreground",
  },
  system: {
    label: "System",
    icon: Sparkles,
    wrap: "bg-muted border",
    icn: "text-muted-foreground",
  },
};

/**
 * A single chat message row: avatar, header (name + badges + timestamp), body,
 * optional footer (reasoning/tools/details) and hover-revealed actions.
 *
 * Fully presentational — no data/model types. Feed the body as children
 * (e.g. `<MarkdownRenderer content={…} />` from `@yuhuanowo/yunui/content`) and
 * pass badges/actions/footer as your app sees fit.
 */
export function ChatMessage({
  role,
  name,
  avatar,
  timestamp,
  badges,
  actions,
  footer,
  className,
  children,
}: ChatMessageProps) {
  const cfg = roleDefaults[role] ?? roleDefaults.assistant;
  const Icon = cfg.icon;

  return (
    <div className={cn("group py-6", className)}>
      <div className="flex gap-4">
        <div className="shrink-0">
          {avatar ?? (
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                cfg.wrap,
              )}
            >
              <Icon className={cn("w-4 h-4", cfg.icn)} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="text-sm font-medium text-foreground">
                {name ?? cfg.label}
              </div>
              {badges && (
                <div className="flex items-center gap-1 text-xs min-w-0">
                  {badges}
                </div>
              )}
            </div>
            {timestamp && (
              <span className="text-xs text-muted-foreground shrink-0">
                {timestamp}
              </span>
            )}
          </div>

          {children && <div className="min-w-0">{children}</div>}

          {footer}

          {actions && (
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity pt-1">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
