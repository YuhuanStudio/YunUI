"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface GenerationStatsProps {
  /** Output token count (e.g. `completion_tokens` from an OpenAI-style usage). */
  tokens?: number;
  /** Throughput in tokens/second. If omitted but `tokens` + `latencyMs` are
   *  given, it's derived as `tokens / (latencyMs / 1000)`. */
  tokensPerSecond?: number;
  /** Total generation latency in milliseconds. */
  latencyMs?: number;
  /** Localized unit labels — components carry no copy of their own. */
  labels?: { tokens?: string; speed?: string; latency?: string };
  className?: string;
}

/** 2570 → "2.57K", 1_200_000 → "1.2M". */
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return `${n}`;
}

const pill =
  "inline-flex items-center whitespace-nowrap rounded-full bg-muted px-2 py-0.5";

/**
 * A row of small metric pills for an assistant turn — token count, throughput
 * and latency. Presentational and data-driven; pass unit labels for i18n
 * (defaults are English). Render nothing when there's no data.
 */
export function GenerationStats({
  tokens,
  tokensPerSecond,
  latencyMs,
  labels,
  className,
}: GenerationStatsProps) {
  const speed =
    tokensPerSecond ??
    (tokens && latencyMs && latencyMs > 0
      ? (tokens / latencyMs) * 1000
      : undefined);

  if (tokens == null && speed == null && latencyMs == null) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {tokens != null && (
        <span className={pill}>
          {compact(tokens)} {labels?.tokens ?? "tokens"}
        </span>
      )}
      {speed != null && (
        <span className={pill}>
          {speed.toFixed(1)} {labels?.speed ?? "tok/s"}
        </span>
      )}
      {latencyMs != null && (
        <span className={pill}>
          {latencyMs} {labels?.latency ?? "ms"}
        </span>
      )}
    </div>
  );
}
