import * as React from 'react';

type ChatRole = "user" | "assistant" | "system";
interface ChatMessageProps {
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
/**
 * A single chat message row: avatar, header (name + badges + timestamp), body,
 * optional footer (reasoning/tools/details) and persistent action slots.
 *
 * Fully presentational — no data/model types. Feed the body as children
 * (e.g. `<MarkdownRenderer content={…} />` from `@yuhuanowo/yunui/content`) and
 * pass badges/actions/footer as your app sees fit.
 */
declare function ChatMessage({ role, name, avatar, timestamp, badges, actions, footer, className, children, density, }: ChatMessageProps): React.JSX.Element;

interface ChatMessageListProps {
    /** The message rows (e.g. <ChatMessage/> elements). */
    children?: React.ReactNode;
    /** Shown centered when there are no messages. */
    empty?: React.ReactNode;
    /**
     * Auto-stick to the bottom as content grows — but only while the user is
     * already near the bottom, so scrolling up to read isn't interrupted.
     * @defaultValue true
     */
    autoScroll?: boolean;
    /** Distance (px) from the bottom still considered "at the bottom". @defaultValue 120 */
    stickThreshold?: number;
    className?: string;
}
/**
 * Scrollable message container with smart stick-to-bottom. Marks itself with
 * `data-scroll-container="true"` so lazy content images (from
 * `@yuhuanowo/yunui/content`) use it as their IntersectionObserver root.
 */
declare function ChatMessageList({ children, empty, autoScroll, stickThreshold, className, }: ChatMessageListProps): React.JSX.Element;

/** A host-owned item shown in the Composer's source or model menu. */
interface ChatComposerMenuItem {
    /** Stable host identifier; callbacks return this id rather than the display label. */
    id: string;
    label: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
}
/** A host command. If present, `insertText` is inserted verbatim at the active slash token or caret. */
interface ChatComposerCommand extends ChatComposerMenuItem {
    /** Exact insertion text; whitespace/newlines are not inferred or rewritten. */
    insertText?: string;
}
/** A host-owned model row, optionally grouped with other models. */
interface ChatComposerModel extends ChatComposerMenuItem {
    group?: string;
    groupLabel?: string;
}
interface ChatComposerMenuLabels {
    prompt?: string;
    sources?: string;
    commands?: string;
    model?: string;
    noSources?: string;
    noCommands?: string;
    noModels?: string;
    noMatchingSources?: string;
    noMatchingCommands?: string;
    removeSource?: (label: string) => string;
}
interface ChatComposerLabels extends ChatComposerMenuLabels {
    /** Send button. @defaultValue "Send" */
    send?: string;
    /** Stop-generating button. @defaultValue "Stop" */
    stop?: string;
}
interface ChatComposerProps {
    value: string;
    onChange: (value: string) => void;
    /** Called when the user sends (Enter or the send button). */
    onSend: () => void;
    /** Called when the stop button is pressed while `loading`. */
    onStop?: () => void;
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    /** Attachment chips / previews, rendered above the textarea. The host owns the content and its actions. */
    attachments?: React.ReactNode;
    /** Left-aligned host toolbar (attach, mode, feature toggles, …). */
    toolbar?: React.ReactNode;
    /** Optional host-owned source list. Supplying `[]` renders the localized empty state. */
    sourceItems?: readonly ChatComposerMenuItem[];
    /** Host-owned selected source ids, used for chips and menu selection state. */
    selectedSourceIds?: readonly string[];
    /** Host callback for selecting or removing a source. The second argument is the desired selected state. */
    onSourceToggle?: (id: string, selected: boolean) => void;
    /** Optional host-owned command list. Commands never infer insertion text from an id or label. */
    commandItems?: readonly ChatComposerCommand[];
    /** Host callback for semantic command selection. */
    onCommandSelect?: (item: ChatComposerCommand) => void;
    /** Optional host-owned model list. Supplying `[]` renders the localized empty state. */
    modelItems?: readonly ChatComposerModel[];
    /** Host-owned selected model id. */
    selectedModelId?: string;
    /** Host callback for model selection. Without it, model options are disabled. */
    onModelChange?: (id: string) => void;
    /** Force-disable the send button even with text (e.g. invalid state). */
    sendDisabled?: boolean;
    /** Allow sending with empty text — e.g. when attachments alone make a valid message. @defaultValue false */
    allowSendEmpty?: boolean;
    /** Max rows before the textarea scrolls. @defaultValue 8 */
    maxRows?: number;
    /** @deprecated Use labels.send. Retained for 0.2.17 compatibility. */
    sendLabel?: string;
    /** @deprecated Use labels.stop. Retained for 0.2.17 compatibility. */
    stopLabel?: string;
    /** Accessible names and menu copy. Existing send/stop overrides remain supported. */
    labels?: ChatComposerLabels;
    className?: string;
}
/**
 * Controlled chat input with host-provided attachment, toolbar, source,
 * command, and model slots. No model, source, upload, or execution behavior is
 * bundled into this component.
 */
declare function ChatComposer({ value, onChange, onSend, onStop, loading, disabled, placeholder, attachments, toolbar, sourceItems, selectedSourceIds, onSourceToggle, commandItems, onCommandSelect, modelItems, selectedModelId, onModelChange, sendDisabled, allowSendEmpty, maxRows, labels, sendLabel, stopLabel, className, }: ChatComposerProps): React.JSX.Element;

interface ChatHeaderProps {
    /** Left cluster — sidebar toggle, title, model selector, … */
    left?: React.ReactNode;
    /** Center status cluster — mode indicator, feature chips, … (optional). */
    status?: React.ReactNode;
    /** Right cluster — theme toggle, workspace toggle, actions, … */
    actions?: React.ReactNode;
    className?: string;
    /** Overrides the slot layout entirely when provided. */
    children?: React.ReactNode;
}
/**
 * Chat header shell: a translucent, backdrop-blurred bar with left / status /
 * actions slots. Compose your model selector (e.g. YunUI `ModelSelect`), mode
 * chips and toggles into the slots.
 */
declare function ChatHeader({ left, status, actions, className, children, }: ChatHeaderProps): React.JSX.Element;

interface GenerationStatsProps {
    /** Output token count (e.g. `completion_tokens` from an OpenAI-style usage). */
    tokens?: number;
    /** Throughput in tokens/second. If omitted but `tokens` + `latencyMs` are
     *  given, it's derived as `tokens / (latencyMs / 1000)`. */
    tokensPerSecond?: number;
    /** Total generation latency in milliseconds. */
    latencyMs?: number;
    /** Localized unit labels — components carry no copy of their own. */
    labels?: {
        tokens?: string;
        speed?: string;
        latency?: string;
    };
    className?: string;
}
/**
 * A row of metric chips for an assistant turn — token count, throughput and
 * latency. Each metric is a YunUI `Badge`, so a generation stat reads as a peer
 * of every other chip in the system. Presentational and data-driven; pass unit
 * labels for i18n (defaults are English). Renders nothing when there's no data.
 */
declare function GenerationStats({ tokens, tokensPerSecond, latencyMs, labels, className, }: GenerationStatsProps): React.JSX.Element | null;

type ChatAttachmentStatus = "idle" | "loading" | "error";
interface ChatAttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
    name: React.ReactNode;
    meta?: React.ReactNode;
    icon?: React.ReactNode;
    preview?: React.ReactNode;
    status?: ChatAttachmentStatus;
    progress?: number;
    actions?: React.ReactNode;
}
/**
 * Compact attachment surface shared by composers and sent messages.
 * The host supplies localized labels and actions; YunUI owns the visual
 * hierarchy, progress treatment and status affordances.
 */
declare function ChatAttachment({ name, meta, icon, preview, status, progress, actions, className, ...props }: ChatAttachmentProps): React.JSX.Element;

/** A host-supplied piece of answer text. Text is rendered verbatim, including whitespace. */
interface StreamingToken {
    id?: string;
    text: string;
    /** Render a source chip at this position. Resolve it with `sourceId`. */
    cite?: boolean;
    sourceId?: string;
}
/** A host-supplied citation source. `id` is a stable key referenced by citation tokens. */
interface StreamingSource {
    id: string;
    name: string;
    domain?: string;
    href?: string;
    image?: string;
}
type StreamingAction = "copy" | "retry" | "positive" | "negative";
type StreamingTextState = "streaming" | "complete" | "error" | "cancelled" | "empty";
interface StreamingTextLabels {
    sources?: string;
    followUps?: string;
    actions?: string;
    copyAnswer?: string;
    retryAnswer?: string;
    positiveFeedback?: string;
    negativeFeedback?: string;
    streaming?: string;
    error?: string;
    cancelled?: string;
    empty?: string;
}
interface StreamingTextProps {
    /** Exact host-provided token sequence. YunUI does not insert or normalize whitespace. */
    content: readonly StreamingToken[];
    sources?: readonly StreamingSource[];
    followUps?: readonly string[];
    state?: StreamingTextState;
    /** Optional host-controlled prefix length while streaming. */
    visibleCount?: number;
    /** Controlled source disclosure. Without `onSourcesOpenChange`, it is read-only. */
    sourcesOpen?: boolean;
    defaultSourcesOpen?: boolean;
    onSourcesOpenChange?: (open: boolean) => void;
    labels?: StreamingTextLabels;
    onAction?: (action: StreamingAction) => void;
    onFollowUp?: (text: string, index: number) => void;
    className?: string;
}
/**
 * Host-controlled adaptation of Beautiful UI's `StreamingText` primitive
 * (`reference/beautiful-ui/components/primitives/StreamingText.tsx`, MIT,
 * commit 44a274e598395ab61e7c96c26fda2758780253b7). It retains the source
 * citation, action, source-list and follow-up layout; the host owns content,
 * state, source identities and every action callback. It has no timers.
 */
declare function StreamingText({ content, sources, followUps, state, visibleCount, sourcesOpen, defaultSourcesOpen, onSourcesOpenChange, labels, onAction, onFollowUp, className, }: StreamingTextProps): React.JSX.Element;

/** One host-owned retrieval chunk shown beneath an answer or beside a conversation. */
interface ContextChunk {
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
interface ContextCardsLabels {
    header?: React.ReactNode;
    count?: React.ReactNode;
    empty?: React.ReactNode;
    include?: string;
    exclude?: string;
    openSource?: (source: string) => string;
}
interface ContextCardsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    chunks: readonly ContextChunk[];
    labels?: ContextCardsLabels;
    onSourceOpen?: (chunk: ContextChunk) => void;
    /** The host supplies the next selected value. Without this callback no Include/Exclude control is shown. */
    onSelectionChange?: (id: string, selected: boolean) => void;
}
/**
 * Host-data adaptation of Beautiful UI's `ContextCards` primitive
 * (`reference/beautiful-ui/components/primitives/ContextCards.tsx`, MIT,
 * commit 44a274e598395ab61e7c96c26fda2758780253b7). It keeps the source
 * multi-card hierarchy while using YunUI semantic tokens and caller-owned data.
 */
declare function ContextCards({ chunks, labels, className, onSourceOpen, onSelectionChange, ...props }: ContextCardsProps): React.JSX.Element;

export { ChatAttachment, type ChatAttachmentProps, type ChatAttachmentStatus, ChatComposer, type ChatComposerCommand, type ChatComposerLabels, type ChatComposerMenuItem, type ChatComposerMenuLabels, type ChatComposerModel, type ChatComposerProps, ChatHeader, type ChatHeaderProps, ChatMessage, ChatMessageList, type ChatMessageListProps, type ChatMessageProps, type ChatRole, ContextCards, type ContextCardsLabels, type ContextCardsProps, type ContextChunk, GenerationStats, type GenerationStatsProps, type StreamingAction, type StreamingSource, StreamingText, type StreamingTextLabels, type StreamingTextProps, type StreamingTextState, type StreamingToken };
