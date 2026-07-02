"use client";

import { cn } from "../lib/cn";
import { Badge } from "../primitives";

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

/**
 * A row of metric chips for an assistant turn — token count, throughput and
 * latency. Each metric is a YunUI `Badge`, so a generation stat reads as a peer
 * of every other chip in the system. Presentational and data-driven; pass unit
 * labels for i18n (defaults are English). Renders nothing when there's no data.
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
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {tokens != null && (
        <Badge>
          {compact(tokens)} {labels?.tokens ?? "tokens"}
        </Badge>
      )}
      {speed != null && (
        <Badge>
          {speed.toFixed(1)} {labels?.speed ?? "tok/s"}
        </Badge>
      )}
      {latencyMs != null && (
        <Badge>
          {latencyMs} {labels?.latency ?? "ms"}
        </Badge>
      )}
    </div>
  );
}
