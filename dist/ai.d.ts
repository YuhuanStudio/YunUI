import * as React from 'react';
import { ReactNode, HTMLAttributes, ElementType } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
export { D as DiscordIcon, F as Footer, a as FooterLink, b as FooterProps, c as FooterSection, d as FooterSocial, G as GithubIcon, I as InstagramIcon, N as NavLink, e as Navbar } from './footer-BCd-S806.js';

/** A host-owned step in an agent reasoning/search/coding trace. */
type ThinkingStepStatus = "pending" | "running" | "done" | "failed" | "cancelled";
interface ThinkingBlockStep {
    id: string;
    label: string;
    detail?: ReactNode;
    meta?: ReactNode;
    status: ThinkingStepStatus;
    mono?: boolean;
}
interface ThinkingBlockLabels {
    title?: string;
    active?: string;
    inProgress?: string;
    completed?: string;
    failed?: string;
    cancelled?: string;
    pending?: string;
}
interface ThinkingBlockProps {
    content: string;
    isStreaming?: boolean;
    defaultOpen?: boolean;
    /** Controlled disclosure state. Without `onOpenChange`, the trigger is read-only. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Host-supplied detail rows (Steps / Search / Coding / Reasoning). */
    steps?: readonly ThinkingBlockStep[];
    selectedStepId?: string;
    onStepSelect?: (id: string) => void;
    labels?: ThinkingBlockLabels;
    /** Render reasoning text (e.g. with a Markdown renderer). Defaults to plain pre-wrapped text. */
    renderContent?: (content: string) => ReactNode;
}
/**
 * Compact, host-fed reasoning disclosure based on Beautiful UI's
 * `components/primitives/ThinkingState.tsx` at commit
 * `44a274e598395ab61e7c96c26fda2758780253b7` (MIT). It adopts the source's
 * sparkle header, plain status row and indented trace geometry, while the host
 * remains the only source of content and step state. It contains no run timer.
 */
declare function ThinkingBlock({ content, isStreaming, defaultOpen, open, onOpenChange, steps, selectedStepId, onStepSelect, labels, renderContent, }: ThinkingBlockProps): React.JSX.Element;

/**
 * AgentTimeline — host-fed activity, tool and task rows. The compact summary,
 * disclosure, inline detail and diff-chip interactions adapt Beautiful UI's
 * `ToolChips.tsx`, `TaskRows.tsx` and `ThinkingState.tsx` from commit
 * 44a274e598395ab61e7c96c26fda2758780253b7 (MIT). YunUI uses its existing
 * tokens, Badge, TextShimmer and Lucide icons. No demo fixtures or timers are
 * embedded; statuses and partial output come from the host.
 */
/** Kept at the original six icons for compatibility with complete Record maps. */
type AgentTimelineIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";
/** Additional icon names used only by the additive entry API. */
type AgentTimelineEntryIconName = AgentTimelineIconName | "think" | "write" | "run" | "read";
/** Kept unchanged for compatibility with existing exhaustive status switches. */
type AgentTimelineToolStatus = "running" | "done" | "error";
type AgentTimelineTaskStatus = "pending" | "running" | "done" | "failed" | "cancelled";
type AgentTimelineDiffTone = "add" | "del" | "context";
interface AgentTimelineToolDetail {
    id: string;
    text: ReactNode;
    tone?: AgentTimelineDiffTone;
    mono?: boolean;
}
interface AgentTimelineDiffLine {
    id: string;
    text: string;
    tone: AgentTimelineDiffTone;
}
interface AgentTimelineFileChange {
    id: string;
    file: string;
    additions: number;
    deletions?: number;
    lines?: readonly AgentTimelineDiffLine[];
}
interface AgentTimelineTaskDetail {
    id: string;
    label: ReactNode;
    meta?: ReactNode;
}
type AgentTimelineBlock = {
    kind: "reasoning";
    id: string;
    label: string;
    content: string;
    /** Marks the one current reasoning summary in a live turn. */
    active?: boolean;
    /** Opens the disclosure on first render while retaining user control. */
    defaultOpen?: boolean;
    /** Controlled row disclosure; pair with `onToggleRow`. */
    open?: boolean;
} | {
    kind: "tool";
    id: string;
    verb: string;
    summary?: string;
    status: AgentTimelineToolStatus;
    icon?: AgentTimelineIconName;
    command?: string;
    output?: string;
    /** Host-supplied structured detail lines and file diffs. */
    details?: readonly AgentTimelineToolDetail[];
    files?: readonly AgentTimelineFileChange[];
    indent?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
} | {
    /** A host tool-decision request; distinct from the ApprovalQuestion survey component. */
    kind: "approval";
    id: string;
    title: string;
    verb: string;
    message?: string;
    argsText?: string;
    allowLabel: string;
    denyLabel: string;
    decision?: "approved" | "rejected";
    decidedLabel?: string;
    /** Host-controlled in-flight acknowledgement; does not imply a decision. */
    busy?: boolean;
    /** Host may disable the decision controls while retaining the request. */
    disabled?: boolean;
};
/** New task rows are additive; the older AgentTimelineBlock union stays closed. */
interface AgentTimelineTaskBlock {
    kind: "task";
    id: string;
    label: string;
    amount?: ReactNode;
    status: AgentTimelineTaskStatus;
    step?: number;
    details?: readonly AgentTimelineTaskDetail[];
    defaultOpen?: boolean;
    open?: boolean;
}
/** Broader tool row used only in the additive AgentTimelineEntry API. */
type AgentTimelineToolEntryBlock = Omit<Extract<AgentTimelineBlock, {
    kind: "tool";
}>, "icon" | "status" | "output"> & {
    icon?: AgentTimelineEntryIconName;
    status: AgentTimelineToolStatus | "cancelled";
    /** Additive rich host output slot; takes precedence over the legacy text output. */
    output?: string;
    outputContent?: ReactNode;
};
/** Use this additive entry when a tool call is explicitly cancelled. */
type AgentTimelineCancelledToolBlock = Omit<AgentTimelineToolEntryBlock, "status"> & {
    status: "cancelled";
};
type AgentTimelineEntry = AgentTimelineBlock | AgentTimelineTaskBlock | AgentTimelineToolEntryBlock;
interface AgentTimelineSummary {
    steps: number;
    reasoning: number;
    tools: number;
    tasks: number;
    approvals: number;
}
interface AgentTimelineLabels {
    /** Localize the summary from actual block counts; no message count is inferred. */
    summary?: (counts: AgentTimelineSummary) => string;
    stepCount?: (count: number) => string;
    process?: string;
    completed?: string;
    failed?: string;
    cancelled?: string;
    pending?: string;
    running?: string;
    error?: string;
    waitingForHost?: string;
    toolOutput?: (verb: string) => string;
    showDiff?: (file: string) => string;
}
interface AgentTimelineProps {
    blocks: AgentTimelineEntry[];
    /** Render reasoning text (e.g. with a Markdown renderer). Plain text by default. */
    renderContent?: (text: string) => ReactNode;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    labels?: AgentTimelineLabels;
    /** Controlled run summary. Without onOpenChange it is read-only. */
    open?: boolean;
    /** The global summary starts open to retain the previous visible-row default. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onToggleRow?: (id: string, open: boolean) => void;
    onToggleDiff?: (id: string, open: boolean) => void;
    className?: string;
}
declare function AgentTimeline({ blocks, renderContent, onApprove, onReject, labels, open, defaultOpen, onOpenChange, onToggleRow, onToggleDiff, className, }: AgentTimelineProps): React.JSX.Element | null;

/** A stable-id answer choice in a host-owned questionnaire. */
interface ApprovalQuestionOption {
    id: string;
    label: ReactNode;
    detail?: ReactNode;
    disabled?: boolean;
}
interface ApprovalQuestionOtherOption {
    /** Stable ID stored in `optionIds`; do not use the option's array index. */
    id: string;
    label: ReactNode;
    placeholder?: string;
}
/** Data for one question. This collects answers; it does not authorize a tool action. */
interface ApprovalQuestionData {
    id: string;
    title: string;
    message?: ReactNode;
    type: "single" | "multiple";
    options: readonly ApprovalQuestionOption[];
    other?: ApprovalQuestionOtherOption;
    required?: boolean;
}
interface ApprovalQuestionAnswer {
    optionIds: readonly string[];
    otherText?: string;
}
type ApprovalQuestionAnswers = Readonly<Record<string, ApprovalQuestionAnswer>>;
interface ApprovalQuestionLabels {
    dismiss?: string;
    back?: string;
    next?: string;
    skip?: string;
    submit?: string;
    submitting?: string;
    otherPlaceholder?: string;
    progress?: (current: number, total: number) => string;
}
interface ApprovalQuestionProps {
    questions: readonly ApprovalQuestionData[];
    /** The host controls which stable question ID is visible. */
    activeQuestionId: string;
    /** Controlled answers keyed by stable question ID, containing stable option IDs. */
    answers: ApprovalQuestionAnswers;
    onAnswersChange: (answers: ApprovalQuestionAnswers) => void;
    onActiveQuestionChange?: (id: string) => void;
    onSkip?: (questionId: string) => void;
    onSubmit?: (answers: ApprovalQuestionAnswers) => void;
    /** Requests dismissal; the host decides whether to hide or cancel this question. */
    onDismiss?: () => void;
    /** Host-controlled request in flight; choices and navigation are disabled until it changes. */
    submitting?: boolean;
    /** Host-controlled read-only state. */
    disabled?: boolean;
    labels?: ApprovalQuestionLabels;
    className?: string;
}
/** Controlled, explicit-step questionnaire adapted from Beautiful UI ApprovalCard's
 * question/choice interaction (commit 44a274e598395ab61e7c96c26fda2758780253b7,
 * components/primitives/ApprovalCard.tsx, MIT). It deliberately uses stable host
 * IDs rather than array indexes, and a questionnaire submit never approves or
 * executes a tool. Upstream MIT attribution is preserved in
 * `licenses/beautiful-ui-MIT.txt`.
 */
declare function ApprovalQuestion({ questions, activeQuestionId, answers, onAnswersChange, onActiveQuestionChange, onSkip, onSubmit, onDismiss, submitting, disabled, labels, className, }: ApprovalQuestionProps): React.JSX.Element | null;

type AgentRunPhase = "thinking" | "acting" | "observing" | "reflecting" | "responding" | "waiting";
type AgentRunTerminalPhase = "completed" | "failed" | "cancelled";
/** Additive runtime phase type; `AgentRunPhase` remains the legacy activity union. */
type AgentRunState = AgentRunPhase | AgentRunTerminalPhase;
interface AgentRunStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Runtime-owned summary of the one activity currently in progress. */
    label: string;
    phase?: AgentRunState;
    /** Keeps the row layout stable while disabling decorative motion. */
    active?: boolean;
}
/**
 * Single-line activity state based on Beautiful UI's compact status header in
 * `components/primitives/ThinkingState.tsx` at commit
 * `44a274e598395ab61e7c96c26fda2758780253b7` (MIT). This row stays separate
 * from AgentTimeline so the host can show a current activity without adding a
 * second status badge to every durable process row.
 */
declare function AgentRunStatus({ label, phase, active, className, ...props }: AgentRunStatusProps): React.JSX.Element;

/** Host-provided row in a proposed data change. */
type DiffTableState = "idle" | "busy" | "applied" | "error" | "cancelled" | "disabled";
type DiffTableChange = "remove" | "add" | "unchanged";
type DiffTableCategoryTone = "accent" | "muted" | "warning";
interface DiffTableRow {
    /** Stable host ID used by `selectedIds` and callbacks. */
    id: string;
    /** Primary cell and default accessible name for the row control. */
    primary: string;
    category: ReactNode;
    secondary: ReactNode;
    change: DiffTableChange;
    categoryTone?: DiffTableCategoryTone;
    accessibleLabel?: string;
    /** Keeps a changed row visible as context; it cannot be selected or applied. */
    disabled?: boolean;
}
interface DiffTableLabels {
    title?: ReactNode;
    hint?: ReactNode;
    primaryColumn?: ReactNode;
    categoryColumn?: ReactNode;
    secondaryColumn?: ReactNode;
    selectionSummary?: (removals: number, additions: number) => ReactNode;
    apply?: (count: number) => ReactNode;
    reject?: ReactNode;
    applied?: (count: number) => ReactNode;
    busy?: ReactNode;
    error?: ReactNode;
    cancelled?: ReactNode;
    disabled?: ReactNode;
    includeRow?: (label: string) => string;
}
interface DiffTableProps {
    rows: readonly DiffTableRow[];
    /** Controlled IDs for included additions/removals. */
    selectedIds: readonly string[];
    onSelectionChange?: (selectedIds: readonly string[]) => void;
    /** Host callbacks; the component never marks a request successful itself. */
    onApply?: (selectedIds: readonly string[]) => void;
    onReject?: (selectedIds: readonly string[]) => void;
    state?: DiffTableState;
    /** Optional host-rendered request detail for non-idle states. */
    statusMessage?: ReactNode;
    /** Use when the host clears `selectedIds` after apply but wants to retain result count. */
    resultCount?: number;
    labels?: DiffTableLabels;
    className?: string;
}
/**
 * Review proposed row changes while keeping selection, apply/reject requests,
 * and request outcomes under host control. Adapted from the pinned MIT source
 * `reference/beautiful-ui/components/primitives/DiffTable.tsx` at
 * `44a274e598395ab61e7c96c26fda2758780253b7`.
 */
declare function DiffTable({ rows, selectedIds, onSelectionChange, onApply, onReject, state, statusMessage, resultCount, labels, className, }: DiffTableProps): React.JSX.Element;

/** One host-owned action in the contextual selection bar. */
interface SelectionAction {
    /** Stable host action identifier; callbacks receive `action ?? id`. */
    id: string;
    /** Optional localized visible label; defaults to the stable ID. */
    label?: ReactNode;
    icon?: ReactNode;
    /** Value reported to the host callback; defaults to `id`. */
    action?: string;
    /** Host-provided activity label for this action while the host reports busy. */
    busyLabel?: string;
}
type SelectionActionsState = "idle" | "busy" | "result" | "error" | "cancelled";
interface SelectionActionsLabels {
    keep?: string;
    discard?: string;
    placeholder?: string;
    submitInstruction?: string;
    customAction?: string;
    working?: string;
    error?: string;
    cancelled?: string;
    retry?: string;
    showMoreActions?: string;
    showFewerActions?: string;
    result?: string;
}
interface SelectionActionsProps {
    /** Optional prose immediately before the selected passage. */
    lead?: ReactNode;
    selectedText: string;
    /** Host-provided rewrite. It is never generated by this component. */
    resultText?: string;
    /** Host owns all request state; no internal request timer or optimistic result. */
    state?: SelectionActionsState;
    /** Host-owned actions. Omitting this uses the general-purpose default action set. */
    actions?: readonly SelectionAction[];
    /** Current host activity label; used only while `state="busy"`. */
    busyLabel?: ReactNode;
    labels?: SelectionActionsLabels;
    disabled?: boolean;
    onAction?: (action: string, instruction?: string) => void;
    onAccept?: (result: string) => void;
    onDismiss?: () => void;
    onRetry?: () => void;
    className?: string;
}
/**
 * Contextual actions anchored below host-selected text. The host supplies the
 * passage, generated result, request lifecycle, and callbacks. Adapted from the
 * pinned MIT source `reference/beautiful-ui/components/primitives/SelectionActions.tsx`
 * at `44a274e598395ab61e7c96c26fda2758780253b7`.
 */
declare function SelectionActions({ lead, selectedText, resultText, state, actions, busyLabel, labels, disabled, onAction, onAccept, onDismiss, onRetry, className, }: SelectionActionsProps): React.JSX.Element;

interface ModelCardProps {
    /** Model display name. */
    name: string;
    /** Avatar slot — host renders the provider/model icon. */
    icon?: ReactNode;
    /** Primary id + aliases, shown as mono badges. */
    ids?: string[];
    /** Short description (falls back to a "No description" label). */
    description?: ReactNode;
    /** Capability keys (e.g. "vision", "thinking") → coloured icons (first 4 shown). */
    capabilities?: string[];
    /** Developer/maker shown in the footer, with an optional icon. */
    developer?: {
        label: string;
        iconUrl?: string;
    };
    /** e.g. "128K" or "1024×1024". */
    context?: string;
    /** Optional tier chip (e.g. "pro"); a `"free"` tier is hidden. */
    tier?: string;
    /** Formatted price node, e.g. "$0.50/M". */
    price?: ReactNode;
    /** Mark the model as unofficial (shows a warning badge). */
    nonofficial?: boolean;
    /** Mark the model as suspended (shows a paused badge). */
    suspended?: boolean;
    /** Localized strings for the unofficial/suspended badges and the empty-description fallback. */
    labels?: {
        nonofficial?: string;
        suspended?: string;
        noDescription?: string;
    };
    /** Makes the whole card a clickable button (keyboard-activatable). */
    onClick?: () => void;
    className?: string;
}
/** Card summarizing an AI model: icon, name, capability chips, id badges, description, and a developer/context/tier/price footer. */
declare function ModelCard({ name, icon, ids, description, capabilities, developer, context, tier, price, nonofficial, suspended, labels, onClick, className, }: ModelCardProps): React.JSX.Element;

interface ModelSelectOption {
    /** Stable id used as the value. */
    id: string;
    /** Display name (trigger label + primary search corpus). */
    label: string;
    /** Group key — models are grouped and provider-filtered by this. */
    group: string;
    /** Human label for the group (defaults to `group`). */
    groupLabel?: string;
    /** Extra text folded into search (ids, aliases, owner). */
    searchText?: string;
    /** Leading model icon (trigger + row). */
    icon?: ReactNode;
    /** Group/provider icon (filter chip + group header). */
    groupIcon?: ReactNode;
    /** Inline capability glyphs shown after the name. */
    badges?: ReactNode;
    /** Secondary line under the name (ids/aliases/pricing). */
    detail?: ReactNode;
    /** Right-aligned meta chip(s) (context length / max tokens). */
    meta?: ReactNode;
    disabled?: boolean;
}
/** A capability filter chip; `match` decides whether an option passes it. */
interface ModelSelectFilter {
    key: string;
    /** Chip content (e.g. a capability badge). */
    node: ReactNode;
    title?: string;
    /** Whether an option satisfies this filter (all active filters must pass). */
    match: (option: ModelSelectOption) => boolean;
}
interface ModelSelectLabels {
    placeholder?: string;
    search?: string;
    clearSearch?: string;
    clearFilters?: string;
    all?: string;
    pinned?: string;
    noResults?: string;
    pin?: string;
    unpin?: string;
}
interface ModelSelectProps {
    options: ModelSelectOption[];
    /** Selected option id. */
    value: string;
    onChange: (id: string) => void;
    className?: string;
    labels?: ModelSelectLabels;
    /** Controlled pinned ids. Pass with `onTogglePin` to show the pin column. */
    pinned?: string[];
    onTogglePin?: (id: string) => void;
    /** Capability filter chips. */
    filters?: ModelSelectFilter[];
    /** Optional footer bar; receives the current (filtered) result count. */
    renderFooter?: (count: number) => ReactNode;
    /** Rendered at the very TOP of the open panel, above the search box — and always visible, even
     *  when the list is empty (unlike renderFooter, which hides on an empty result set). Use it for
     *  a domain toolbar that must stay reachable, e.g. a browse-mode switch above the picker. */
    renderHeader?: () => ReactNode;
    /** Bump this to imperatively clear the internal search + provider/capability filters WITHOUT
     *  remounting the panel (so it stays open and doesn't lose scroll/focus). Use it when the option
     *  set is swapped out from under the filters — e.g. toggling a browse mode — where a carried-over
     *  filter would otherwise empty the new list. */
    filterResetKey?: string | number;
}
/** A generic, searchable model picker: provider grouping + provider/capability
 *  filters + a pinned section + a styled dropdown. Domain-agnostic. */
declare function ModelSelect({ options, value, onChange, className, labels, pinned, onTogglePin, filters, renderFooter, renderHeader, filterResetKey, }: ModelSelectProps): React.JSX.Element;

/** One labelled spec shown in the card's spec grid. */
interface ModelManagerField {
    label: ReactNode;
    value: ReactNode;
    /** Span both grid columns (e.g. a long price line). */
    full?: boolean;
}
interface ModelManagerCardProps {
    /** Leading model icon. */
    icon?: ReactNode;
    /** Model display name (the card title). */
    name: ReactNode;
    /** Inline status badges next to the name (YAML, deprecated, inactive, suspended…). */
    nameBadges?: ReactNode;
    /** Id / alias chips rendered under the name. */
    ids?: ReactNode;
    /** Row-select control (a checkbox). Sits at the left of the top control bar. */
    selectSlot?: ReactNode;
    /** Row actions (edit / enable / inspect / delete …) — sit at the right of the
     *  top control bar (no footer rule). */
    actions?: ReactNode;
    /** Labelled specs — provider, developer, type, status, context/resolution,
     *  max output, price, … — laid out in a 2-column grid. */
    fields?: ModelManagerField[];
    /** Capability badges + an optional label. */
    capabilities?: {
        label?: ReactNode;
        value: ReactNode;
    };
    /** Mark the row selected (a ring + tint). */
    selected?: boolean;
    className?: string;
}
/** A model-management row as a card (all admin columns, top-to-bottom). */
declare function ModelManagerCard({ icon, name, nameBadges, ids, selectSlot, actions, fields, capabilities, selected, className, }: ModelManagerCardProps): React.JSX.Element;

/** Click-to-copy mono ID badge (faithful port of Yunxin's IDBadge).
 *  Defaults to subtitle scale (`sm`: 11px, muted, tighter); pass `size="default"`
 *  for the larger 12px variant. */
declare function IDBadge({ text, truncate, size, }: {
    text: string;
    truncate?: boolean;
    size?: "default" | "sm";
}): React.JSX.Element;

interface CapabilitySelectorProps {
    /** Currently selected capability keys (controlled). */
    selected: string[];
    /** Called with the next selection when a capability is toggled. */
    onChange: (capabilities: string[]) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Button size: `sm` or `md` (default). */
    size?: "sm" | "md";
    /** Grid column count. @defaultValue 4 */
    columns?: 2 | 3 | 4;
    /** Filters which capability set is shown (e.g. "image_generation", "audio", "video"). Defaults to the LLM set. */
    modelType?: string;
}
/** Multi-select grid of toggleable model capabilities; the option set adapts to `modelType`. */
declare function CapabilitySelector({ selected, onChange, disabled, size, columns, modelType }: CapabilitySelectorProps): React.JSX.Element;

/** Whether a capability key has a known icon/color in the design system. */
declare function isKnownCapability(capability: string): boolean;
/** Just the colored capability glyph — e.g. the inline icons shown after a model
 *  name. Renders nothing for an unknown capability. */
declare function CapabilityIcon({ capability, size, className, }: {
    capability: string;
    size?: number;
    className?: string;
}): React.JSX.Element | null;

/**
 * Rounded provider icon — a thin alias over the canonical {@link ProviderIcon}
 * (rounded avatar style). Kept for call sites that prefer the short name.
 */
declare function ProviderIconImg({ provider, size }: {
    provider: string;
    size?: number;
}): React.JSX.Element;
/** Capability/type icon for a model (chat, embedding, tts, …). */
declare function ModelTypeIcon({ type, size }: {
    type: string;
    size?: number;
}): React.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "ghost" | "outline" | null | undefined;
    color?: "primary" | "secondary" | "ghost" | "outline" | null | undefined;
    size?: "sm" | "icon" | "icon-sm" | "icon-xs" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
/** Variant props for {@link buttonVariants}: `variant`/`color` (primary, outline, ghost, secondary) and `size` (sm, icon, icon-sm, icon-xs). */
type ButtonProps = VariantProps<typeof buttonVariants>;

/**
 * Resolve a model family to the developer id understood by ModelIcon.
 * Accepts any provider-qualified ids, display names, or owner fields so host
 * apps do not need to maintain parallel model-family regex tables.
 */
declare function getModelDeveloperId(...identifiers: Array<string | null | undefined>): string;
declare function getDeveloperIconPath(developer: string | null | undefined): string | null;
declare function getProviderIconOptions(): {
    value: string;
    label: string;
}[];
declare function normalizeProviderId(id: string | null | undefined): string;
declare function getIconPath(providerId: string | null | undefined): string | null;
interface ProviderIconProps {
    /** Provider id; resolved to a built-in icon by name (e.g. "openai", "anthropic"). */
    provider: string;
    className?: string;
    /** Icon size in pixels. @defaultValue 20 */
    size?: number;
    /** Render as a rounded avatar tile with a subtle background. */
    rounded?: boolean;
    /** Custom icon URL that overrides the built-in lookup (falls back on load error). */
    iconUrl?: string | null;
}
/** Provider logo resolved by id (or a custom `iconUrl`), with a letter/SVG fallback for unknown providers. */
declare function ProviderIcon({ provider, className, size, rounded, iconUrl, }: ProviderIconProps): React.JSX.Element;
/** {@link ProviderIcon} preset that is always rounded with a background (avatar style). */
declare function ProviderAvatar({ provider, size, className, }: {
    /** Provider id (resolved by name). */
    provider: string;
    /** Icon size in pixels. @defaultValue 32 */
    size?: number;
    className?: string;
}): React.JSX.Element;
declare const ProviderNames: Record<string, string>;
declare function getProviderName(providerId: string | null | undefined): string;
interface ModelIconProps {
    /** Model's own icon URL or `/icons/models/` filename (highest priority). */
    iconUrl?: string | null;
    /** Developer/maker id, used to resolve a developer icon (second priority). */
    developer?: string | null;
    /** Provider id, used as the final fallback icon. */
    provider: string;
    className?: string;
    /** Icon size in pixels. @defaultValue 20 */
    size?: number;
    /** Render as a rounded avatar tile with a subtle background. */
    rounded?: boolean;
}
/**
 * ModelIcon component with priority system:
 * 1. Model's own icon_url (custom URL or path to /icons/models/)
 * 2. Developer's icon (from developerIconMap)
 * 3. Provider's icon (fallback)
 *
 * Uses state to track failures so React re-renders and falls through
 * to the next priority level when an image can't be loaded.
 */
declare function ModelIcon({ iconUrl, developer, provider, className, size, rounded, }: ModelIconProps): React.JSX.Element;
/** {@link ModelIcon} preset that is always rounded with a background (avatar style). */
declare function ModelAvatar({ iconUrl, developer, provider, size, className, }: {
    /** Model's own icon URL or filename (highest priority). */
    iconUrl?: string | null;
    /** Developer id (second priority). */
    developer?: string | null;
    /** Provider id (fallback). */
    provider: string;
    /** Icon size in pixels. @defaultValue 32 */
    size?: number;
    className?: string;
}): React.JSX.Element;

declare const PROVIDER_ICON_SLUGS: ReadonlySet<string>;

interface LanguageOption {
    /** Locale code (e.g. "en", "zh-TW"). */
    value: string;
    /** Display name for the locale. */
    label: string;
}
interface LanguageSwitcherProps {
    /** Available languages. The host app supplies these. */
    locales: LanguageOption[];
    /** Currently active locale value. */
    currentLocale: string;
    /** Called when the user picks a different locale. Host owns cookie/reload. */
    onChange: (locale: string) => void;
    /** Visual variant */
    variant?: "icon" | "pill";
    /** Dropdown alignment */
    align?: "left" | "right";
    /** Accessible label for the trigger. */
    label?: string;
    /** Disables the control while a change is in flight. */
    pending?: boolean;
    /** Additional className */
    className?: string;
}
/** Locale picker dropdown; the host owns the actual locale change (cookie/reload). */
declare function LanguageSwitcher({ locales, currentLocale, onChange, variant, align, label, pending, className, }: LanguageSwitcherProps): React.JSX.Element;

interface AccountMenuUser {
    /** Display name. Falls back to `fallbackName` when absent. */
    name?: string | null;
    /** Shown under the name in the menu header. */
    email?: string | null;
    /** Avatar image URL; a glyph is shown when absent. */
    avatarUrl?: string | null;
}
interface AccountMenuItem {
    key: string;
    label: ReactNode;
    icon?: ElementType;
    /** Navigate on select. */
    href?: string;
    /** Or run something on select (takes precedence over `href`). */
    onSelect?: () => void;
}
interface AccountMenuProps {
    /**
     * The signed-in user, `null` when signed out, or `undefined` while the
     * answer is still unknown.
     *
     * The three-state shape is the point: a session cookie is usually
     * `httpOnly`, so the page cannot read it and only the server can answer.
     * While it is `undefined` this renders a fixed-size placeholder rather than
     * guessing — showing "sign in" first and swapping to an avatar makes every
     * page load look like it signed the reader out.
     */
    user: AccountMenuUser | null | undefined;
    /** Menu entries above the sign-out row. */
    items?: AccountMenuItem[];
    /** Where the signed-out button links. */
    signInHref: string;
    /** Called when the sign-out row is chosen. Omit to hide the row. */
    onSignOut?: () => void;
    /** Every string this renders — localize them yourself. */
    labels?: {
        signIn?: string;
        signOut?: string;
        /** Accessible name for the trigger, e.g. "{name} menu". */
        menu?: string;
        /** Shown when the user has no name. */
        fallbackName?: string;
    };
    className?: string;
}
/**
 * The navbar account control: a sign-in glyph when signed out, the reader's
 * avatar when signed in, and a menu with their identity, your links and a
 * sign-out row.
 *
 * Extracted from YunNEWS, which handles the signed-in swap better than the
 * other apps — hence upstreaming it so they all get it. Purely presentational:
 * the host fetches the session, supplies every label and owns each action.
 */
declare function AccountMenu({ user, items, signInHref, onSignOut, labels, className, }: AccountMenuProps): React.JSX.Element;

export { AccountMenu, type AccountMenuItem, type AccountMenuProps, type AccountMenuUser, type AgentRunPhase, type AgentRunState, AgentRunStatus, type AgentRunStatusProps, type AgentRunTerminalPhase, AgentTimeline, type AgentTimelineBlock, type AgentTimelineCancelledToolBlock, type AgentTimelineDiffLine, type AgentTimelineDiffTone, type AgentTimelineEntry, type AgentTimelineEntryIconName, type AgentTimelineFileChange, type AgentTimelineIconName, type AgentTimelineLabels, type AgentTimelineProps, type AgentTimelineSummary, type AgentTimelineTaskBlock, type AgentTimelineTaskDetail, type AgentTimelineTaskStatus, type AgentTimelineToolDetail, type AgentTimelineToolEntryBlock, type AgentTimelineToolStatus, ApprovalQuestion, type ApprovalQuestionAnswer, type ApprovalQuestionAnswers, type ApprovalQuestionData, type ApprovalQuestionLabels, type ApprovalQuestionOption, type ApprovalQuestionOtherOption, type ApprovalQuestionProps, type ButtonProps, CapabilityIcon, CapabilitySelector, DiffTable, type DiffTableCategoryTone, type DiffTableChange, type DiffTableLabels, type DiffTableProps, type DiffTableRow, type DiffTableState, IDBadge, type LanguageOption, LanguageSwitcher, ModelAvatar, ModelCard, type ModelCardProps, ModelIcon, ModelManagerCard, type ModelManagerCardProps, type ModelManagerField, ModelSelect, type ModelSelectFilter, type ModelSelectLabels, type ModelSelectOption, type ModelSelectProps, ModelTypeIcon, PROVIDER_ICON_SLUGS, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, type SelectionAction, SelectionActions, type SelectionActionsLabels, type SelectionActionsProps, type SelectionActionsState, ThinkingBlock, type ThinkingBlockLabels, type ThinkingBlockProps, type ThinkingBlockStep, type ThinkingStepStatus, buttonVariants, getDeveloperIconPath, getIconPath, getModelDeveloperId, getProviderIconOptions, getProviderName, isKnownCapability, normalizeProviderId };
