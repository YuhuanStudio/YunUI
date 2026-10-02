"use client";

import * as React from "react";
import { useId } from "react";
import { cn } from "../lib/cn";
import { mergeLabels } from "../lib/merge-labels";
import { useYunUI } from "../adapters/context";

/** One host-owned retrieval chunk shown beneath an answer or beside a conversation. */
export interface ContextChunk {
  id: string;
  title: string;
  body: React.ReactNode;
  source: string;
  badge: string;
  chars?: React.ReactNode;
  href?: string;
  badgeTone?: "neutral" | "info" | "success" | "warning" | "destructive";
  selected?: boolean;
}

export interface ContextCardsLabels {
  header?: React.ReactNode;
  count?: React.ReactNode;
  empty?: React.ReactNode;
  include?: string;
  exclude?: string;
  openSource?: (source: string) => string;
}

export interface ContextCardsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  chunks: readonly ContextChunk[];
  labels?: ContextCardsLabels;
  onSourceOpen?: (chunk: ContextChunk) => void;
  /** The host supplies the next selected value. Without this callback no Include/Exclude control is shown. */
  onSelectionChange?: (id: string, selected: boolean) => void;
}

const DEFAULT_LABELS: Required<Omit<ContextCardsLabels, "count" | "header">> & Pick<ContextCardsLabels, "header" | "count"> = {
  header: "Retrieved context",
  empty: "No retrieved context was supplied.",
  include: "Include",
  exclude: "Exclude",
  openSource: (source) => `Open ${source}`,
};

const BADGE_TONE: Record<NonNullable<ContextChunk["badgeTone"]>, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  destructive: "bg-error-soft text-error",
};

const SAFE_CHAT_BASE = "https://yunui.invalid";

/** Injective code-point encoding for host IDs used in DOM IDs. */
export function encodeChatId(value: string): string {
  const points = Array.from(value, (character) => character.codePointAt(0)!.toString(16));
  return points.length ? points.join("-") : "empty";
}

/** Shared, conservative URL validation for chat source links and preview images. */
export function getSafeChatHref(value?: string): { href: string; external: boolean } | undefined {
  if (!value || /[\u0000-\u001f\u007f]/.test(value) || !value.trim()) return undefined;
  const href = value.trim();
  try {
    const parsed = new URL(href, SAFE_CHAT_BASE);
    if (!["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) return undefined;
    const external = (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.origin !== SAFE_CHAT_BASE;
    return { href, external };
  } catch {
    return undefined;
  }
}

/** Images use the same parser but only permit web and same-origin relative URLs. */
export function getSafeChatImage(value?: string): string | undefined {
  if (!value || /[\u0000-\u001f\u007f]/.test(value) || !value.trim()) return undefined;
  const image = value.trim();
  try {
    const parsed = new URL(image, SAFE_CHAT_BASE);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? image : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Host-data adaptation of Beautiful UI's `ContextCards` primitive
 * (`reference/beautiful-ui/components/primitives/ContextCards.tsx`, MIT,
 * commit 44a274e598395ab61e7c96c26fda2758780253b7). It keeps the source
 * multi-card hierarchy while using YunUI semantic tokens and caller-owned data.
 */
export function ContextCards({
  chunks,
  labels,
  className,
  onSourceOpen,
  onSelectionChange,
  ...props
}: ContextCardsProps) {
  const baseId = useId();
  const { Link } = useYunUI();
  const copy = mergeLabels(DEFAULT_LABELS, labels);
  const count = labels?.count ?? `${chunks.length} ${chunks.length === 1 ? "source" : "sources"}`;

  return (
    <div data-yunui="context-cards" className={cn("flex w-full max-w-[380px] flex-col gap-2", className)} {...props}>
      <div className="flex items-center gap-2 px-0.5">
        <h3 className="text-[13px] font-semibold text-foreground">{copy.header}</h3>
        <span className="inline-flex min-h-5 items-center rounded-md bg-muted px-1.5 text-[11.5px] font-medium text-muted-foreground shadow-sm tabular-nums">{count}</span>
      </div>

      {chunks.length === 0 ? (
        <p className="rounded-xl bg-muted/60 px-3 py-2 text-[12px] text-muted-foreground">{copy.empty}</p>
      ) : chunks.map((chunk) => {
        const titleId = `${baseId}-chunk-${encodeChatId(chunk.id)}`;
        const safeHref = getSafeChatHref(chunk.href);
        const badgeTone = BADGE_TONE[chunk.badgeTone ?? "neutral"];
        const sourceContent = <><span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-[12px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80")}><span aria-hidden="true" className={cn("inline-flex h-3.5 min-w-3.5 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] px-0.5 text-[7px] font-bold", badgeTone)}>{chunk.badge}</span><span className="max-w-[220px] truncate">{chunk.source}</span><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg></span></>;

        return (
          <article key={chunk.id} aria-labelledby={titleId} data-selected={chunk.selected ? "true" : undefined} className={cn("overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm", chunk.selected && "ring-1 ring-ring")}>
            <div className="flex min-h-10 items-center gap-2.5 border-b border-border px-3 py-2">
              <span aria-hidden="true" className="shrink-0 text-muted-foreground"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg></span>
              <span id={titleId} className="min-w-0 truncate text-[13px] font-medium text-foreground">{chunk.title}</span>
              {chunk.chars != null ? <span className="ml-auto shrink-0 text-[12px] text-muted-foreground tabular-nums">{chunk.chars}</span> : null}
            </div>
            <div className="px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-muted-foreground">{chunk.body}</div>
            <div className="flex min-w-0 items-center gap-2 px-3 pb-3">
              {safeHref ? (
                <Link href={safeHref.href} target={safeHref.external ? "_blank" : undefined} rel={safeHref.external ? "noopener noreferrer" : undefined} onClick={() => onSourceOpen?.(chunk)} aria-label={copy.openSource(chunk.source)} className="inline-flex min-w-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{sourceContent}</Link>
              ) : onSourceOpen ? (
                <button type="button" aria-label={copy.openSource(chunk.source)} onClick={() => onSourceOpen(chunk)} className="inline-flex min-w-0 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{sourceContent}</button>
              ) : (
                <span className="inline-flex min-w-0">{sourceContent}</span>
              )}
              {onSelectionChange ? (
                <button type="button" aria-pressed={Boolean(chunk.selected)} aria-label={`${chunk.selected ? copy.exclude : copy.include} ${chunk.source}`} onClick={() => onSelectionChange(chunk.id, !chunk.selected)} className="ml-auto min-h-7 shrink-0 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{chunk.selected ? copy.exclude : copy.include}</button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
