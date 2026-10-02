"use client";

import * as React from "react";
import { User, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar, AvatarFallback } from "../primitives";

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
  /** Actions in normal flow below the content (copy, regenerate, …). */
  actions?: React.ReactNode;
  /** Extra content below the body — reasoning steps, tool details, JSON, … */
  footer?: React.ReactNode;
  className?: string;
  /** The message body (plain text, or a rendered <MarkdownRenderer/>). */
  children?: React.ReactNode;
  /** Vertical rhythm for dense transcripts and more spacious assistants. */
  density?: "compact" | "comfortable";
}

const roleDefaults: Record<
  ChatRole,
  { label: string; icon: React.ComponentType<{ className?: string }>; wrap: string; icn: string }
> = {
  user: {
    label: "You",
    icon: User,
    wrap: "bg-muted",
    icn: "text-muted-foreground",
  },
  assistant: {
    label: "Assistant",
    icon: Sparkles,
    wrap: "bg-transparent",
    icn: "text-primary",
  },
  system: {
    label: "System",
    icon: Sparkles,
    wrap: "bg-muted",
    icn: "text-muted-foreground",
  },
};

/**
 * A single chat message row: avatar, header (name + badges + timestamp), body,
 * optional footer (reasoning/tools/details) and persistent action slots.
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
  density = "comfortable",
}: ChatMessageProps) {
  const cfg = roleDefaults[role] ?? roleDefaults.assistant;
  const Icon = cfg.icon;
  const isUser = role === "user";

  return (
    <div
      data-yunui="chat-message"
      data-role={role}
      className={cn(
        "group min-w-0",
        isUser
          ? density === "compact" ? "flex justify-end py-1.5" : "flex justify-end py-2.5"
          : density === "compact" ? "mx-auto flex w-full max-w-[820px] gap-2.5 py-3" : "mx-auto flex w-full max-w-[820px] gap-3 py-5",
        className,
      )}
    >
      {isUser ? (
        <>
          <div className="flex min-w-0 max-w-[560px] flex-col items-end gap-1.5">
            <div className="min-w-0 max-w-full rounded-xl bg-muted px-3.5 py-2 text-[13px] leading-[1.5] text-foreground">
              {(name != null || badges || timestamp != null) && (
                <div className="mb-1 flex min-w-0 items-center justify-end gap-2 text-[10.5px] leading-4 text-muted-foreground">
                  {name != null && <span className="truncate font-medium">{name}</span>}
                  {badges && <span className="flex min-w-0 items-center gap-1">{badges}</span>}
                  {timestamp != null && <span className="shrink-0 whitespace-nowrap">{timestamp}</span>}
                </div>
              )}
              {children != null && <div className="min-w-0 [overflow-wrap:anywhere]">{children}</div>}
              {footer}
            </div>
            {actions && <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs text-muted-foreground">{actions}</div>}
          </div>
          {avatar != null && <div className="mt-1 shrink-0">{avatar}</div>}
        </>
      ) : (
        <>
          <div className="mt-0.5 shrink-0">
            {avatar ?? (role === "assistant" ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-foreground text-background shadow-sm">
                <Icon aria-hidden className="h-3.5 w-3.5 text-background" />
              </div>
            ) : (
              <Avatar className="h-7 w-7">
                <AvatarFallback className="border border-border/70 bg-muted/70">
                  <Icon aria-hidden className={cn("h-3.5 w-3.5", cfg.icn)} />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          <div className="min-w-0 flex-1 space-y-2 text-sm leading-relaxed text-foreground">
            <div className="flex min-h-6 items-start justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <div className="text-[13px] font-semibold leading-6 text-foreground">{name ?? cfg.label}</div>
                {badges && <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs">{badges}</div>}
              </div>
              {timestamp != null && <span className="shrink-0 whitespace-nowrap text-[11px] leading-6 text-muted-foreground">{timestamp}</span>}
            </div>

            {children != null && <div className="min-w-0 [overflow-wrap:anywhere]">{children}</div>}
            {footer}
            {actions && <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">{actions}</div>}
          </div>
        </>
      )}
    </div>
  );
}
