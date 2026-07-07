import * as React from 'react';
import { ReactNode } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
export { D as DiscordIcon, F as Footer, a as FooterLink, b as FooterProps, c as FooterSection, d as FooterSocial, G as GithubIcon, I as InstagramIcon } from './footer-BoFu7Wqq.js';

interface ThinkingBlockProps {
    content: string;
    isStreaming?: boolean;
    defaultOpen?: boolean;
    /**
     * Render the reasoning content (e.g. with a Markdown renderer). Defaults to
     * plain pre-wrapped text so YunUI carries no markdown dependency.
     */
    renderContent?: (content: string) => ReactNode;
}
declare function ThinkingBlock({ content, isStreaming, defaultOpen, renderContent }: ThinkingBlockProps): React.JSX.Element;

/**
 * AgentTimeline — the *process* lane of an agent turn: the reasoning traces,
 * tool call+result, and approval prompts, drawn as a connected vertical timeline
 * (a node per step linked by a rail, with smooth height-animated disclosures).
 * It deliberately does NOT render the assistant's own prose — interim narration
 * and the final answer belong to the *communication* lane and are rendered as
 * plain markdown by the consumer, outside the timeline. Purely presentational,
 * prop-driven and copy-free: the consumer maps its records onto
 * {@link AgentTimelineBlock}, localizes every label, and supplies a renderer.
 */
type AgentTimelineIconName = "terminal" | "search" | "globe" | "image" | "file" | "tool";
type AgentTimelineToolStatus = "running" | "done" | "error";
type AgentTimelineBlock = {
    kind: "reasoning";
    id: string;
    label: string;
    content: string;
} | {
    kind: "tool";
    id: string;
    verb: string;
    summary?: string;
    status: AgentTimelineToolStatus;
    icon?: AgentTimelineIconName;
    command?: string;
    output?: string;
} | {
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
};
interface AgentTimelineProps {
    blocks: AgentTimelineBlock[];
    /** Render reasoning text (e.g. markdown). Plain text by default. */
    renderContent?: (text: string) => ReactNode;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    className?: string;
}
declare function AgentTimeline({ blocks, renderContent, onApprove, onReject, className }: AgentTimelineProps): React.JSX.Element | null;

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
}
/** A generic, searchable model picker: provider grouping + provider/capability
 *  filters + a pinned section + a styled dropdown. Domain-agnostic. */
declare function ModelSelect({ options, value, onChange, className, labels, pinned, onTogglePin, filters, renderFooter, }: ModelSelectProps): React.JSX.Element;

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

/** Click-to-copy mono ID badge (faithful port of Yunxin's IDBadge). */
declare function IDBadge({ text, truncate }: {
    text: string;
    truncate?: boolean;
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
    variant?: "outline" | "primary" | "ghost" | "secondary" | null | undefined;
    color?: "outline" | "primary" | "ghost" | "secondary" | null | undefined;
    size?: "icon" | "sm" | "icon-sm" | "icon-xs" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
/** Variant props for {@link buttonVariants}: `variant`/`color` (primary, outline, ghost, secondary) and `size` (sm, icon, icon-sm, icon-xs). */
type ButtonProps = VariantProps<typeof buttonVariants>;

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

interface NavLink {
    /** Destination href (supports `/#section` anchors for scroll-spy on the home page). */
    href: string;
    /** Link text. */
    label: string;
}
interface NavbarProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src (default: /favicon.ico). */
    logoSrc?: string;
    /** Center navigation links. The host builds these from branding/flags/i18n. */
    links?: NavLink[];
    /** Current route, used for active-link + scroll-spy. @defaultValue "/" */
    currentPath?: string;
    /** `public` (full nav + auth) or `minimal` (no links/auth). @defaultValue "public" */
    variant?: "public" | "minimal";
    /** Localized auth labels. */
    labels?: {
        signIn?: string;
        signUp?: string;
        menu?: string;
    };
    /** Right-side control slots; the host injects the configured switcher. */
    languageSwitcher?: ReactNode;
    /** Defaults to YunUI's ThemeToggle. */
    themeToggle?: ReactNode;
    /** Where the logo links to. @defaultValue "/" */
    homeHref?: string;
    /** Sign-in link destination. @defaultValue "/login" */
    loginHref?: string;
    /** Sign-up link destination. @defaultValue "/signup" */
    signupHref?: string;
}
/** Floating top navigation bar: logo, center links with scroll-spy, theme/language slots, and auth buttons with a mobile menu. */
declare function Navbar({ appName, logoSrc, links, currentPath, variant, labels, languageSwitcher, themeToggle, homeHref, loginHref, signupHref, }: NavbarProps): React.JSX.Element;

export { AgentTimeline, type AgentTimelineBlock, type AgentTimelineIconName, type AgentTimelineProps, type AgentTimelineToolStatus, type ButtonProps, CapabilityIcon, CapabilitySelector, IDBadge, type LanguageOption, LanguageSwitcher, ModelAvatar, ModelCard, type ModelCardProps, ModelIcon, ModelManagerCard, type ModelManagerCardProps, type ModelManagerField, ModelSelect, type ModelSelectFilter, type ModelSelectLabels, type ModelSelectOption, type ModelSelectProps, ModelTypeIcon, type NavLink, Navbar, PROVIDER_ICON_SLUGS, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, ThinkingBlock, buttonVariants, getDeveloperIconPath, getIconPath, getProviderIconOptions, getProviderName, isKnownCapability, normalizeProviderId };
