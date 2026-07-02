// =====================================================
// YunUI — chat pattern
// =====================================================
// Presentational, slot-based building blocks for AI chat UIs. No data/model
// types and no i18n — feed content as children (pair with
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
} from "./chat-composer";

export {
  ChatHeader,
  type ChatHeaderProps,
} from "./chat-header";

export {
  GenerationStats,
  type GenerationStatsProps,
} from "./generation-stats";
