// =====================================================
// YunUI — chat pattern
// =====================================================
// Presentational, slot-based building blocks for AI chat UIs. Choice schemas
// describe host-owned UI data; no SDK/runtime binding or i18n library. Feed content as children (pair with
// `@yuhuanowo/yunui/content` for markdown) and inject app specifics via slots.

export {
  ChatMessage,
  type ChatMessageProps,
  type ChatRole,
} from "./chat-message";

export {
  ChatMessageList,
  type ChatMessageListProps,
} from "./chat-message-list";

export {
  ChatComposer,
  type ChatComposerProps,
  type ChatComposerLabels,
  type ChatComposerMenuLabels,
  type ChatComposerMenuItem,
  type ChatComposerCommand,
  type ChatComposerModel,
} from "./chat-composer";

export {
  ChatHeader,
  type ChatHeaderProps,
} from "./chat-header";

export {
  GenerationStats,
  type GenerationStatsProps,
} from "./generation-stats";

export {
  ChatAttachment,
  type ChatAttachmentProps,
  type ChatAttachmentStatus,
} from "./chat-attachment";

export {
  StreamingText,
  type StreamingTextProps,
  type StreamingTextLabels,
  type StreamingTextState,
  type StreamingToken,
  type StreamingSource,
  type StreamingAction,
} from "./chat-streaming-text";

export {
  ContextCards,
  type ContextCardsProps,
  type ContextCardsLabels,
  type ContextChunk,
} from "./chat-context-cards";
