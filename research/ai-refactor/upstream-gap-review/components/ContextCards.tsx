"use client";

/* Adapted from reference/beautiful-ui/components/primitives/ContextCards.tsx
 * MIT, commit 44a274e598395ab61e7c96c26fda2758780253b7.
 * Upstream card/header/source-pill markup and geometry retained; data is host-owned. */
export type ContextChunk = {
  id: string; title: string; chars?: string; body: string; source: string;
  badge: string; tone?: string; href?: string; selected?: boolean;
};
export type ContextCardsLabels = { header: string; count?: string };
const DEFAULT_LABELS: ContextCardsLabels = { header: "Retrieved context" };

export default function ContextCards({ chunks, labels, className, onSourceOpen, onSelectionChange }: {
  chunks: readonly ContextChunk[];
  labels?: Partial<ContextCardsLabels>;
  className?: string;
  onSourceOpen?: (chunk: ContextChunk) => void;
  onSelectionChange?: (chunk: ContextChunk) => void;
}) {
  const copy = { ...DEFAULT_LABELS, ...labels };
  const count = labels?.count ?? `${chunks.length} ${chunks.length === 1 ? "source" : "sources"}`;
  return (
    <div className={`flex w-full max-w-95 flex-col gap-2${className ? ` ${className}` : ""}`}>
      <div className="flex items-center gap-2 px-0.5">
        <span className="text-[13px] font-semibold text-ink">{copy.header}</span>
        <span className="inline-flex h-5 items-center rounded-md bg-inset px-1.5 text-[11.5px] font-medium text-ink-2 shadow-hairline tabular-nums">{count}</span>
      </div>
      {chunks.length === 0 ? <p className="rounded-card bg-inset px-3 py-2 text-[12px] text-ink-3">No retrieved context was supplied.</p> : chunks.map((chunk) => (
        <article key={chunk.id} aria-current={chunk.selected || undefined} className={`overflow-hidden rounded-card bg-surface shadow-card ${chunk.selected ? "ring-1 ring-accent" : ""}`}>
          <div className="primitive-card-bar flex items-center gap-2.5 border-b border-line">
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" /></svg><span className="truncate">{chunk.title}</span></span>
            {chunk.chars ? <span className="ml-auto shrink-0 text-[12px] text-ink-3 tabular-nums">{chunk.chars}</span> : null}
          </div>
          <p className="px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-ink-2">{chunk.body}</p>
          <div className="flex items-center gap-2 px-3 pb-3">
            <a href={chunk.href ?? "#context"} onClick={(event) => { if (!chunk.href) event.preventDefault(); onSourceOpen?.(chunk); }} className="inline-flex h-6 items-center gap-1.5 rounded-full bg-inset px-2 text-[12px] font-medium text-ink-2 shadow-btn transition-colors duration-300 hover:bg-hover">
              <span className={`flex size-3.5 items-center justify-center rounded-[4px] ${chunk.tone ?? "bg-accent"} text-[7px] font-bold text-[var(--bg-base)]`}>{chunk.badge}</span>{chunk.source}<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </a>
            {onSelectionChange ? <button type="button" aria-pressed={chunk.selected ?? false} onClick={() => onSelectionChange(chunk)} className="ml-auto rounded-[6px] px-2 py-1 text-[11px] text-ink-2 hover:bg-hover">{chunk.selected ? "Included" : "Include"}</button> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
