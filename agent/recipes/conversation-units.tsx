"use client";

import { StreamingText, ContextCards, type StreamingTextProps, type ContextCardsProps } from "@yuhuanowo/yunui/chat";
import { SelectionActions, DiffTable, type SelectionActionsProps, type DiffTableProps } from "@yuhuanowo/yunui/ai";

export interface YunUIAnswerReviewProps {
  /** Host stream content/state, sources and follow-up callbacks. */
  answer: StreamingTextProps;
  /** Host retrieval chunks and controlled inclusion callbacks. */
  context?: ContextCardsProps;
  /** Host-selected text and edit lifecycle. No generated result lives here. */
  selection?: SelectionActionsProps;
  /** Host proposals, selected IDs and apply/reject lifecycle. */
  changes?: DiffTableProps;
}

/** Compose actual public YunUI units inside an assistant ChatMessage.
 * The host supplies every payload and handles retrieval, generation and writes.
 * These controls request work; they never optimistically declare it successful.
 */
export function YunUIAnswerReview({ answer, context, selection, changes }: YunUIAnswerReviewProps) {
  return <div className="space-y-4">
    <StreamingText {...answer} />
    {context ? <ContextCards {...context} /> : null}
    {selection ? <SelectionActions {...selection} /> : null}
    {changes ? <DiffTable {...changes} /> : null}
  </div>;
}
