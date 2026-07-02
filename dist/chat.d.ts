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
    /** Actions revealed on hover below the content (copy, regenerate, …). */
    actions?: React.ReactNode;
    /** Extra content below the body — reasoning steps, tool details, JSON, … */
    footer?: React.ReactNode;
    className?: string;
    /** The message body (plain text, or a rendered <MarkdownRenderer/>). */
    children?: React.ReactNode;
}
/**
 * A single chat message row: avatar, header (name + badges + timestamp), body,
 * optional footer (reasoning/tools/details) and hover-revealed actions.
 *
 * Fully presentational — no data/model types. Feed the body as children
 * (e.g. `<MarkdownRenderer content={…} />` from `@yuhuanowo/yunui/content`) and
 * pass badges/actions/footer as your app sees fit.
 */
declare function ChatMessage({ role, name, avatar, timestamp, badges, actions, footer, className, children, }: ChatMessageProps): React.JSX.Element;

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
    /** Attachment chips / previews, rendered above the textarea. */
    attachments?: React.ReactNode;
    /** Left-aligned toolbar (attach, mode, feature toggles, …). */
    toolbar?: React.ReactNode;
    /** Force-disable the send button even with text (e.g. invalid state). */
    sendDisabled?: boolean;
    /**
     * Allow sending with empty text — e.g. when attachments alone make a valid
     * message. @defaultValue false
     */
    allowSendEmpty?: boolean;
    /** Max rows before the textarea scrolls. @defaultValue 8 */
    maxRows?: number;
    className?: string;
}
/**
 * Chat input composer: auto-growing textarea, Enter-to-send (Shift+Enter for a
 * newline), a send/stop button, and slots for attachment previews and a left
 * toolbar. Presentational and controlled — the host owns state and side effects.
 */
declare function ChatComposer({ value, onChange, onSend, onStop, loading, disabled, placeholder, attachments, toolbar, sendDisabled, allowSendEmpty, maxRows, className, }: ChatComposerProps): React.JSX.Element;

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

export { ChatComposer, type ChatComposerProps, ChatHeader, type ChatHeaderProps, ChatMessage, ChatMessageList, type ChatMessageListProps, type ChatMessageProps, type ChatRole, GenerationStats, type GenerationStatsProps };
