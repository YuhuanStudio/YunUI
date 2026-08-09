import * as React$1 from 'react';
import React__default, { ReactNode, ElementType, HTMLAttributes } from 'react';
export { F as Footer, a as FooterLink, b as FooterProps, c as FooterSection, d as FooterSocial } from './footer-BoFu7Wqq.js';

declare function BackgroundEffects(): React$1.JSX.Element;

declare function CodeDemo(): React$1.JSX.Element;

interface FAQItem {
    /** The question heading. */
    question: string;
    /** The answer content (revealed when expanded). */
    answer: React.ReactNode;
}
interface FAQProps {
    /** The questions to render. The host app supplies (and translates) these. */
    items: FAQItem[];
    /** Which item starts expanded (default: first). Pass null for all collapsed. */
    defaultOpenIndex?: number | null;
}
/** Accordion list of questions where one item expands at a time. */
declare function FAQ({ items, defaultOpenIndex }: FAQProps): React$1.JSX.Element;

interface Tab {
    /** Unique tab id. */
    id: string;
    /** Tab label shown in the header. */
    label: string;
    /** Code shown when this tab is active. */
    code: string;
    /** Language for this tab's code. */
    language?: string;
}
interface CodeBlockProps {
    /** The code to display (ignored when `tabs` are provided). */
    code: string;
    /** Language label, also used by the lightweight highlighter. @defaultValue "text" */
    language?: string;
    /** Filename shown in the header instead of the language badge. */
    filename?: string;
    /** Show line numbers in the gutter. @defaultValue true */
    showLineNumbers?: boolean;
    /** Show the copy-to-clipboard button. @defaultValue true */
    copyable?: boolean;
    className?: string;
    /** Render multiple switchable code tabs instead of a single `code` block. */
    tabs?: Tab[];
}
/** Styled code block with a window-chrome header, optional tabs, line numbers, basic syntax highlighting, and copy. */
declare function CodeBlock({ code, language, filename, showLineNumbers, copyable, className, tabs, }: CodeBlockProps): React$1.JSX.Element;

interface LLMCopyButtonProps {
    markdownUrl: string;
    /**
     * Every string this renders. The library ships no copy of its own — these
     * defaults exist only so the component is usable untranslated.
     */
    labels?: {
        copy?: string;
        copied?: string;
        title?: string;
    };
}
declare function LLMCopyButton({ markdownUrl, labels }: LLMCopyButtonProps): React$1.JSX.Element;
interface ViewOptionsProps {
    markdownUrl: string;
    githubUrl?: string;
    /** Every string this renders; defaults keep it usable untranslated. */
    labels?: {
        markdown?: string;
        markdownTitle?: string;
        github?: string;
        githubTitle?: string;
    };
}
declare function ViewOptions({ markdownUrl, githubUrl, labels }: ViewOptionsProps): React$1.JSX.Element;

interface BlogCardProps {
    /** Post title. */
    title: string;
    /** Short excerpt/summary. */
    description?: string;
    /** Publish date (ISO string); formatted via `locale`. */
    date?: string;
    /** Post author (name shown in the meta row). */
    author?: {
        name?: string;
        avatar?: string;
        url?: string;
    };
    /** Category label shown as an info badge. */
    category?: string;
    /** Tag list (first 3 rendered as clickable chips). */
    tags?: string[];
    /** Estimated reading time in minutes. */
    readingTime?: number;
    /** Cover image URL; a placeholder icon is shown when absent. */
    coverImage?: string;
    /** Destination the card links to. */
    url: string;
    /** Layout: `default` or `featured` (spans 2 columns on `md`+). */
    variant?: "default" | "featured";
    /** Locale for the date; defaults to a stable "en-US" (SSR-safe). */
    locale?: string;
}
/** Blog post preview card with cover image, category, meta (date/reading time/author), and tags. */
declare function BlogCard({ title, description, date, author, category, tags, readingTime, coverImage, url, variant, locale, }: BlogCardProps): React$1.JSX.Element;

interface BlogPostHeaderProps {
    title: string;
    description?: string;
    date?: string;
    author?: {
        name?: string;
        avatar?: string;
        url?: string;
    };
    category?: string;
    tags?: string[];
    readingTime?: number;
    coverImage?: string;
}
declare function BlogPostHeader({ title, description, date, author, category, tags, readingTime, coverImage, }: BlogPostHeaderProps): React$1.JSX.Element;

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    /** Navigate to a page. The host app owns routing / query-string updates. */
    onPageChange: (page: number) => void;
    /** Localized labels; default to English. */
    labels?: {
        previous?: string;
        next?: string;
    };
}
declare function BlogPagination({ currentPage, totalPages, onPageChange, labels, }: BlogPaginationProps): React$1.JSX.Element | null;

interface ReadingProgressProps {
    /** Scroll distance, in px, before the control appears. */
    threshold?: number;
    /** Draw the circular progress ring around the button. */
    bar?: boolean;
    /** Make the control a back-to-top button (arrow + click-to-top). */
    backToTop?: boolean;
    /** Localized labels; default to English. */
    labels?: {
        backToTop?: string;
    };
    className?: string;
}
/**
 * How far through a long page the reader is, and a way back to the start —
 * as one floating control in the corner, not a mystery hairline across the top.
 *
 * A circular ring fills as you scroll; an up-arrow sits in the middle and
 * returns you to the top on click. Both live in one component because they
 * answer the same question — where am I — and share a single scroll listener.
 * Two components would mean two listeners on the pages least able to afford them.
 *
 * The host app owns nothing here: no data, no routing, no copy beyond an
 * overridable label.
 */
declare function ReadingProgress({ threshold, bar, backToTop, labels, className, }: ReadingProgressProps): React$1.JSX.Element | null;

interface SimplePaginationProps {
    /** 1-indexed current page, shown in the centre indicator. */
    currentPage: number;
    /** Whether a previous page exists. Defaults to `currentPage > 1`. */
    hasPrevious?: boolean;
    /** Whether a next page exists — cursor-style, for lists with no known total. */
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    /** Localized labels. `page` renders the centre indicator (default `Page {n}`). */
    labels?: {
        previous?: string;
        next?: string;
        page?: (n: number) => ReactNode;
    };
}
/** Prev / page-indicator / next pager for cursor- or has-more-style lists where
 *  the total page count isn't known (so numbered pages aren't possible). Matches
 *  `BlogPagination`'s ghost-button styling. */
declare function SimplePagination({ currentPage, hasPrevious, hasNext, onPrevious, onNext, labels, }: SimplePaginationProps): React$1.JSX.Element;

interface CategoryFilterProps {
    categories: string[];
    selectedCategory?: string;
    /** Called with the chosen category, or null for "all". Host owns routing. */
    onSelect: (category: string | null) => void;
    /** Localized label for the "all posts" button; defaults to English. */
    allLabel?: string;
}
declare function CategoryFilter({ categories, selectedCategory, onSelect, allLabel, }: CategoryFilterProps): React$1.JSX.Element;

interface SidebarNavItem {
    /** Link text. */
    label: string;
    /** Destination href; also the basis for active-state matching. */
    href: string;
    /** Optional leading icon component. */
    icon?: ElementType;
    /** Extra path prefixes that should also mark this item active. */
    match?: string[];
}
interface SidebarSection {
    /** Optional section heading. */
    title?: string;
    /** Nav items in this section. */
    items: SidebarNavItem[];
}
interface SidebarProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src. @defaultValue "/favicon.ico" */
    logoSrc?: string;
    /** Where the logo links to. @defaultValue "/" */
    homeHref?: string;
    /** Grouped navigation sections. */
    sections: SidebarSection[];
    /** Used to compute the active item. */
    currentPath?: string;
    /** Mobile drawer open state. */
    isOpen?: boolean;
    /** Called to close the mobile drawer. */
    onClose?: () => void;
    /** Desktop collapse state (hides the sidebar off-canvas). */
    collapsed?: boolean;
    /** Called to toggle the desktop collapse state (also renders the collapse button when set). */
    onToggleCollapse?: () => void;
    /**
     * Called when a nav item is clicked. When provided, default link navigation
     * is prevented and the host owns routing (useful in SPAs / demos). When
     * omitted, items navigate via the injected Link adapter.
     */
    onNavigate?: (href: string) => void;
    /** Bottom-pinned slot (balance card, user card, etc.). */
    footer?: ReactNode;
    /** Accessible label for the close/collapse buttons. @defaultValue "Close" */
    closeLabel?: string;
    /** While true, the nav (and footer slot) render shimmer skeletons. */
    loading?: boolean;
    /** sessionStorage key for persisting nav scroll position across navigations. */
    scrollStorageKey?: string;
    /** Fixed application rail or an in-flow shell owned by the host layout. */
    layout?: "fixed" | "inline";
    /** Replaces the built-in logo row while retaining the Sidebar shell. */
    header?: ReactNode;
    /** Replaces generated sections with custom dynamic Sidebar content. */
    children?: ReactNode;
    /** Additional shell classes. */
    className?: string;
    /** Landmark role for custom application layouts. */
    role?: "navigation" | "complementary";
    /** Accessible name for the Sidebar landmark. */
    ariaLabel?: string;
}
/** App navigation sidebar: logo, grouped nav sections with active-state matching, a mobile drawer, desktop collapse, and a footer slot. */
declare function Sidebar({ appName, logoSrc, homeHref, sections, currentPath, isOpen, onClose, collapsed, onToggleCollapse, onNavigate, footer, closeLabel, loading, scrollStorageKey, layout, header, children, className, role, ariaLabel, }: SidebarProps): React$1.JSX.Element;

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}
declare function PageHeader({ title, description, actions, className }: PageHeaderProps): React$1.JSX.Element;

interface PageLayoutProps {
    /** Page content, rendered inside `<main>`. */
    children: ReactNode;
    /** Top navigation slot — typically `<Navbar/>`. Rendered above `<main>`. */
    navbar?: ReactNode;
    /** Bottom slot — typically `<Footer/>`. Hidden when `hideFooter`. */
    footer?: ReactNode;
    /** Drop the footer (e.g. focused/app pages). */
    hideFooter?: boolean;
    /** Skip the default `bg-background` so a page can paint its own backdrop. */
    transparentBg?: boolean;
    /** Override the `<main>` classes — defaults to `flex-1 pt-28` (clears the
     *  fixed navbar). Pass your own offset for a taller/shorter bar. */
    mainClassName?: string;
    /**
     * `id` on the `<main>` element — the target a "skip to main content" link
     * jumps to. Defaults to `"main-content"`, the conventional value, so the
     * skip link in a consumer's root layout actually lands somewhere. Pass
     * `undefined` explicitly if a page must not carry the id (e.g. two shells
     * on one page). @defaultValue "main-content"
     */
    mainId?: string;
    /** Extra classes on the outer wrapper. */
    className?: string;
}
/** Full-height page shell: navbar slot · offset `<main>` · footer slot. */
declare function PageLayout({ children, navbar, footer, hideFooter, transparentBg, mainClassName, mainId, className, }: PageLayoutProps): React$1.JSX.Element;

interface PageLoadingStateProps {
    /** Optional text shown beside the spinner. */
    message?: string;
}
/** Centered in-page loading state (spinner + optional message). */
declare function PageLoadingState({ message }: PageLoadingStateProps): React$1.JSX.Element;
interface PageErrorStateProps {
    /** Error message to display. */
    message: string;
    /** When provided, shows a retry button that calls this. */
    onRetry?: () => void;
    /** Label for the retry button. @defaultValue "Retry" */
    retryLabel?: string;
}
/** Centered, compact in-page error state with an optional retry action. */
declare function PageErrorState({ message, onRetry, retryLabel }: PageErrorStateProps): React$1.JSX.Element;
interface PageEmptyStateProps {
    /** Optional icon component shown above the title. */
    icon?: ElementType;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description?: string;
    /** Action slot (e.g. a button) below the text. */
    action?: ReactNode;
}
/** Centered in-page empty state with an icon, title, description, and optional action. */
declare function PageEmptyState({ icon: Icon, title, description, action }: PageEmptyStateProps): React$1.JSX.Element;

declare const TONES: Record<string, {
    card: string;
    value: string;
}>;
interface StatCardProps {
    /** Optional leading icon component (e.g. a Lucide icon). */
    icon?: ElementType;
    /** Metric name. */
    label: string;
    /** The metric value (string, number, or node). */
    value: ReactNode;
    /** Optional supporting line under the value. */
    subtext?: ReactNode;
    /** Optional trend indicator: percent `value` plus whether it's `positive` (up/green) or down/red. */
    trend?: {
        value: number;
        positive: boolean;
    };
    /** Semantic color tint for the card + value (amber/emerald/blue/red/purple). */
    tone?: keyof typeof TONES | string;
    /** Stagger entrance delay in ms. */
    delay?: number;
    /** Compact layout: icon + label on one row, value below (admin insights style). */
    inline?: boolean;
    /** Value-first layout: big number on top, label beneath (analytics / admin stats style). */
    valueFirst?: boolean;
    /** Compact surface: the lighter `card p-4` tile instead of `stat-card p-5`
     *  (matches dense admin stat grids). */
    compact?: boolean;
    className?: string;
}
declare function StatCard({ icon: Icon, label, value, subtext, trend, tone, delay, inline, valueFirst, compact, className }: StatCardProps): React$1.JSX.Element;

interface FellowsBannerProps {
    title: string;
    description: string;
    ctaText: string;
    /** Pre-resolved feature labels, rendered as a "·"-joined list. */
    features?: string[];
    href?: string;
    className?: string;
}
declare function FellowsBanner({ title, description, ctaText, features, href, className, }: FellowsBannerProps): React$1.JSX.Element;

interface ErrorBoundaryLabels {
    title?: string;
    message?: string;
    retry?: string;
}
interface ErrorBoundaryProps {
    children: React__default.ReactNode;
    fallback?: React__default.ReactNode;
    /** Override the default English copy. */
    labels?: ErrorBoundaryLabels;
    /** Notified when an error is caught (e.g. for logging). */
    onError?: (error: Error, info: React__default.ErrorInfo) => void;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
declare class ErrorBoundary extends React__default.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React__default.ErrorInfo): void;
    handleRetry: () => void;
    render(): string | number | bigint | boolean | React__default.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;
}

/**
 * Card for terminal "your account is locked" auth screens (banned / suspended).
 * Presentational only — the host owns the logout/redirect behind `onBack`.
 */
interface AccountLockedCardProps {
    appName: string;
    logoSrc?: string;
    icon: ReactNode;
    title: string;
    subtitle: string;
    appeal: string;
    backLabel: string;
    onBack: () => void;
    /**
     * Run once on mount. Yunxin uses this to drop the (now-useless) session via
     * api.logout() so background auth probes can't bounce the user back into a
     * loop on these terminal screens.
     */
    onMount?: () => void;
    loading?: boolean;
    children?: ReactNode;
}
declare function AccountLockedCard({ appName, logoSrc, icon, title, subtitle, appeal, backLabel, onBack, onMount, loading, children, }: AccountLockedCardProps): React$1.JSX.Element;

interface MediaPageHeaderProps {
    /** Page title. */
    title: string;
    /** Page subtitle/description. */
    description: string;
    /** While true, the sync button spins and is disabled. */
    isSyncing: boolean;
    /** Sync error message; shown in a red banner when non-null. */
    syncError: string | null;
    /** Called when the sync button is clicked. */
    onSync: () => void;
    /** Optional inline stat chips (`label` + `value`) below the header. */
    stats?: {
        label: string;
        value: string | number;
    }[];
}
/** Media library page header with a title, description, sync button, error banner, and optional stats. */
declare function MediaPageHeader({ title, description, isSyncing, syncError, onSync, stats }: MediaPageHeaderProps): React$1.JSX.Element;
interface MediaEmptyStateProps {
    /** Icon component shown above the title. */
    icon: ElementType;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description: string;
    /** Action slot (e.g. a button) below the text. */
    action?: ReactNode;
}
/** Empty state for media pages (icon, title, description, optional action). */
declare function MediaEmptyState({ icon: Icon, title, description, action }: MediaEmptyStateProps): React$1.JSX.Element;
/** Loading state for media pages (spinning sync icon + message, falls back to i18n default). */
declare function MediaLoadingState({ message }: {
    message?: string;
}): React$1.JSX.Element;
/** Error state for media pages with an optional retry button. */
declare function MediaErrorState({ message, onRetry }: {
    message: string;
    onRetry?: () => void;
}): React$1.JSX.Element;

declare function FellowBadge({ variant, className }: {
    variant?: "inline" | "pill";
    className?: string;
}): React$1.JSX.Element;
declare function CapabilityBadge({ capability, short }: {
    capability: string;
    short?: boolean;
}): React$1.JSX.Element | null;
declare function StatusBadge({ status, size }: {
    status: string;
    size?: "sm" | "md";
}): React$1.JSX.Element | null;
declare function SourceBadge({ source, showIcon }: {
    source: string;
    showIcon?: boolean;
}): React$1.JSX.Element | null;
declare function ActiveBadge({ isActive }: {
    isActive: boolean;
}): React$1.JSX.Element;
declare function DeprecatedBadge({ isDeprecated }: {
    isDeprecated: boolean;
}): React$1.JSX.Element | null;

interface FeatureLockedStateProps {
    /** Glyph inside the top medallion (defaults to a sparkles icon). */
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /** Heading of the dashed note card; the card shows when this or `noteText` is set. */
    noteTitle?: ReactNode;
    /** Body of the dashed note card. */
    noteText?: ReactNode;
    className?: string;
}
declare function FeatureLockedState({ icon, title, description, noteTitle, noteText, className }: FeatureLockedStateProps): React$1.JSX.Element;

interface SessionItemProps {
    /** Device glyph (host maps the device type to an icon). */
    icon?: ReactNode;
    /** Device name / label. */
    name: ReactNode;
    /** Secondary detail line, e.g. "Chrome on macOS". */
    detail?: ReactNode;
    /** IP address (rendered after a globe glyph). */
    ip?: ReactNode;
    /** Host-formatted relative time (rendered after a clock glyph). */
    time?: ReactNode;
    /** Marks the current session — shows a badge and hides the revoke button. */
    current?: boolean;
    currentLabel?: ReactNode;
    /** Dims the row and shows an "inactive" badge. */
    inactive?: boolean;
    inactiveLabel?: ReactNode;
    /** Marks the row selected without adding a badge. */
    selected?: boolean;
    /** Shows a pulsing leading activity rail and exposes aria-busy. */
    running?: boolean;
    /** Screen-reader label announced while the row is running. */
    runningLabel?: ReactNode;
    /** Revoke handler — when set (and not current), shows the revoke button. */
    onRevoke?: () => void;
    revoking?: boolean;
    revokeLabel?: string;
    className?: string;
}
declare function SessionItem({ icon, name, detail, ip, time, current, currentLabel, inactive, inactiveLabel, selected, running, runningLabel, onRevoke, revoking, revokeLabel, className, }: SessionItemProps): React$1.JSX.Element;

interface NavStateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    /** Shows the indicator in its selected state. */
    active?: boolean;
    /** Animates the same indicator without changing its geometry. */
    running?: boolean;
}
/** The single active/running indicator shared by YunUI navigation surfaces. */
declare function NavStateIndicator({ active, running, className, ...props }: NavStateIndicatorProps): React$1.JSX.Element;

interface MetricBarProps {
    /** Leading icon; when omitted a small color dot (using `color`) is shown. */
    icon?: ReactNode;
    label: ReactNode;
    /** Right-aligned value (e.g. "120 credits"). */
    value?: ReactNode;
    /** Bar fill, 0–100. */
    percentage: number;
    /** CSS color for the bar fill (and the dot when there's no icon). */
    color?: string;
    className?: string;
}
declare function MetricBar({ icon, label, value, percentage, color, className }: MetricBarProps): React$1.JSX.Element;

/** Localized accessible labels for the audio controls. */
interface AudioPlayerLabels {
    play?: string;
    pause?: string;
    seek?: string;
    download?: string;
}
interface AudioPlayerProps {
    /** Audio source URL or object URL. */
    src: string;
    /** Optional title shown above the controls. */
    title?: string;
    /** Show a download button linking to `src`; the value is the download filename. */
    downloadName?: string;
    /** Begin playing as soon as the source is ready. */
    autoPlay?: boolean;
    /** Localized `aria-label`s for the controls (defaults are English). */
    labels?: AudioPlayerLabels;
    className?: string;
}
/**
 * A styled wrapper over `<audio>`: play/pause, a seekable progress bar, time
 * readout, and an optional download button. Presentation only — no fetching.
 */
declare function AudioPlayer({ src, title, downloadName, autoPlay, labels, className }: AudioPlayerProps): React$1.JSX.Element;

type MediaStatus = "pending" | "processing" | "completed" | "failed";
interface MediaResult {
    /** Stable id (used as React key and passed back to callbacks). */
    id: string;
    /** Source URL of the finished media (may be a signed URL that can expire). */
    url: string;
    /** How to render the media. Defaults to `"image"`. */
    kind?: "image" | "video" | "audio";
    /** Prompt / caption shown under the media (clamped to 2 lines). */
    prompt?: ReactNode;
    /** Model id — the last path segment is shown in the meta row. */
    model?: string;
    /** Extra meta node appended to the caption row (e.g. size, duration, seed). */
    meta?: ReactNode;
    /** Generation lifecycle. Absent is treated as `"completed"`. */
    status?: MediaStatus;
    /** 0–100 progress while `pending`/`processing`. */
    progress?: number;
    /** Failure message shown in the error state. */
    error?: string;
}
/** Copy overrides so hosts can localize the built-in status/aria strings. */
interface MediaGalleryLabels {
    starting?: string;
    processing?: string;
    failed?: string;
    expired?: string;
    download?: string;
    delete?: string;
    gridView?: string;
    listView?: string;
}
interface MediaGalleryProps {
    /** The results to display, newest-first is conventional. */
    items: MediaResult[];
    /** Controlled view mode. Omit for uncontrolled (defaults to grid). */
    viewMode?: "grid" | "list";
    /** Called when the built-in grid/list toggle is used (renders the toggle). */
    onViewModeChange?: (mode: "grid" | "list") => void;
    /** Show a download control per completed item. */
    onDownload?: (item: MediaResult) => void;
    /** Show a delete control per item. */
    onDelete?: (item: MediaResult) => void;
    /** Make completed items clickable (e.g. open a lightbox). */
    onPreview?: (item: MediaResult) => void;
    /** Optional heading rendered above the gallery. */
    title?: ReactNode;
    /** Rendered in place of the grid when `items` is empty. */
    empty?: ReactNode;
    /** Localized copy for status/aria strings. */
    labels?: MediaGalleryLabels;
    className?: string;
}
/**
 * A unified grid/list of generated media results (image · video · audio) with
 * status, progress, expiry handling, and download/delete/preview controls.
 * Shared across generation pages so every modality renders results identically.
 */
declare function MediaGallery({ items, viewMode, onViewModeChange, onDownload, onDelete, onPreview, title, empty, labels, className, }: MediaGalleryProps): React$1.JSX.Element;

type BannerTone = "info" | "warning" | "critical" | "success" | "neutral";
interface BannerProps {
    /** Tone — drives the gradient, border, text and icon color. */
    tone?: BannerTone;
    /** Leading icon; defaults to a tone-appropriate glyph (pass `null` to omit). */
    icon?: ReactNode;
    /** The banner headline. */
    title: ReactNode;
    /** Secondary text shown inline after the title (hidden on mobile). */
    description?: ReactNode;
    /** Small right-aligned meta (e.g. a relative timestamp). */
    meta?: ReactNode;
    /** Trailing actions — links or buttons. */
    actions?: ReactNode;
    /** Show a dismiss (✕) button. */
    dismissible?: boolean;
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}
declare function Banner({ tone, icon, title, description, meta, actions, dismissible, onDismiss, dismissLabel, className, }: BannerProps): React$1.JSX.Element;

/** An icon trigger (the bell) carrying an unread-count badge. */
interface NotificationBellProps {
    /** Unread count; the badge is hidden when 0 / undefined. */
    count?: number;
    /** Cap the displayed number — above it shows `{max}+`. */
    max?: number;
    /** Accessible label for the trigger. */
    label?: string;
    /** Override the bell glyph. */
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}
declare function NotificationBell({ count, max, label, icon, onClick, className }: NotificationBellProps): React$1.JSX.Element;
/** A single notification row: type glyph · title + body · time, optionally a
 *  link (adapter Link) and a hover dismiss button. */
interface NotificationItemProps {
    /** Type glyph — the host renders it (e.g. an icon for the notification type). */
    icon?: ReactNode;
    /** Tint classes for the icon square (bg + text color). */
    iconClassName?: string;
    title: ReactNode;
    body?: ReactNode;
    /** Host-formatted relative time (e.g. "2h"). */
    time?: ReactNode;
    /** Unread rows read bolder; read rows are muted. */
    unread?: boolean;
    /** Optional target — when set the row is an adapter `<Link>`. */
    href?: string;
    /** Fires on row activation (also use to close the panel). */
    onSelect?: () => void;
    /** Show a hover dismiss (trash) button. */
    dismissible?: boolean;
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}
declare function NotificationItem({ icon, iconClassName, title, body, time, unread, href, onSelect, dismissible, onDismiss, dismissLabel, className, }: NotificationItemProps): React$1.JSX.Element;
/** The dropdown panel chrome: header (title + unread count), a scrollable list
 *  with loading / empty states, and a footer slot (e.g. a "view all" link).
 *  Render `<NotificationItem>`s as children. */
interface NotificationPanelProps {
    title: ReactNode;
    /** Unread count shown in the header; hidden when 0. */
    unreadCount?: number;
    /** Word rendered after the count (e.g. "unread"). */
    unreadLabel?: ReactNode;
    loading?: boolean;
    loadingLabel?: ReactNode;
    /** When true (and not loading) the empty state replaces the children. */
    empty?: boolean;
    emptyLabel?: ReactNode;
    /** Footer slot — typically a centered "view all" adapter Link. */
    footer?: ReactNode;
    /** The notification rows. */
    children?: ReactNode;
    className?: string;
}
declare function NotificationPanel({ title, unreadCount, unreadLabel, loading, loadingLabel, empty, emptyLabel, footer, children, className, }: NotificationPanelProps): React$1.JSX.Element;

interface SettingRowProps {
    title: ReactNode;
    description?: ReactNode;
    /** The trailing control (e.g. a `<Switch>`). */
    control?: ReactNode;
    className?: string;
}
declare function SettingRow({ title, description, control, className }: SettingRowProps): React$1.JSX.Element;

interface SettingsNavItem {
    key: string;
    label: ReactNode;
    icon?: ElementType;
}
interface SettingsNavGroup {
    key: string;
    label?: ReactNode;
    items: SettingsNavItem[];
}
interface SettingsShellProps {
    /** Dialog/page heading. Pass the host's accessible title primitive here. */
    header: ReactNode;
    groups: SettingsNavGroup[];
    value: string;
    onValueChange: (key: string) => void;
    children: ReactNode;
    navigationLabel?: string;
    className?: string;
    sidebarClassName?: string;
    contentClassName?: string;
}
/**
 * Canonical settings layout: grouped desktop navigation, compact mobile
 * navigation and one scroll-safe content lane. The host owns the active panel
 * and dialog lifecycle; YunUI owns all navigation spacing and active states.
 */
declare function SettingsShell({ header, groups, value, onValueChange, children, navigationLabel, className, sidebarClassName, contentClassName, }: SettingsShellProps): React$1.JSX.Element;

interface LinkRowProps {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /** Destination. */
    href: string;
    /** Open in a new tab via a plain anchor (default false → adapter Link). */
    external?: boolean;
    className?: string;
}
declare function LinkRow({ icon, title, description, href, external, className }: LinkRowProps): React$1.JSX.Element;

interface ConnectedAccountRowProps {
    /** Provider glyph, shown in a ring when there's no avatar image. */
    icon?: ReactNode;
    /** Small provider badge overlaid bottom-right. */
    badge?: ReactNode;
    /** Avatar image URL; falls back to `icon` in a ring. */
    avatarUrl?: string;
    name: ReactNode;
    /** A faint "· extra" after the name. */
    subname?: ReactNode;
    /** Detail line — e.g. @username or an email. */
    detail?: ReactNode;
    /** Host-formatted connected time (rendered after a clock glyph). */
    time?: ReactNode;
    onUnlink?: () => void;
    unlinking?: boolean;
    unlinkLabel?: string;
    className?: string;
}
declare function ConnectedAccountRow({ icon, badge, avatarUrl, name, subname, detail, time, onUnlink, unlinking, unlinkLabel, className, }: ConnectedAccountRowProps): React$1.JSX.Element;

interface AvatarUploaderProps {
    /** Current avatar image URL; when absent, `fallback` is shown. */
    src?: string;
    /** Fallback content (e.g. the user's initials). */
    fallback?: ReactNode;
    /** Diameter in px. */
    size?: number;
    /** True while an upload is in flight — shows a spinner. */
    uploading?: boolean;
    /** Called with the picked file. */
    onSelectFile?: (file: File) => void;
    /** Accessible label for the control. */
    label?: string;
    className?: string;
}
declare function AvatarUploader({ src, fallback, size, uploading, onSelectFile, label, className, }: AvatarUploaderProps): React$1.JSX.Element;

interface EyebrowProps extends HTMLAttributes<HTMLDivElement> {
    /** Small leading glyph, e.g. a lucide icon at `w-4 h-4`. */
    icon?: ReactNode;
    /** The label text. */
    children: ReactNode;
}
/**
 * The pill badge that sits above a marketing section title — a tinted, hairline
 * capsule holding an icon and a short label ("Why YunUI", "功能特性").
 *
 * Pulled out on its own because it appears far away from any heading too:
 * above a hero title, inside a CTA band, as a "trusted by" chip.
 */
declare function Eyebrow({ icon, children, className, ...props }: EyebrowProps): React$1.JSX.Element;
interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Eyebrow label above the title. Omit for a bare heading. */
    badge?: ReactNode;
    /** Glyph inside the eyebrow pill. */
    icon?: ReactNode;
    /** The section title. */
    title: ReactNode;
    /** Supporting line under the title. */
    subtitle?: ReactNode;
    /** Horizontal alignment. @defaultValue "center" */
    align?: "center" | "left";
    /**
     * Play the entrance animation, staggering badge → title → subtitle.
     * Turn it off for headings that are already visible on load.
     * @defaultValue true
     */
    animate?: boolean;
}
/**
 * The centered pill-badge → title → subcopy rhythm that sits above every
 * marketing band (landing page, Fellows, docs index).
 *
 * This exact block was hand-rolled in Yunxin's landing, Yunxin's Fellows page
 * AND YunUI's own showcase site — three copies of the same eight lines, each
 * re-deriving the stagger delays. It lives here now so every surface inherits
 * the same rhythm instead of drifting apart.
 */
declare function SectionHeading({ badge, icon, title, subtitle, align, animate, className, ...props }: SectionHeadingProps): React$1.JSX.Element;

interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Glyph shown in the tinted icon tile above the title. */
    icon?: ReactNode;
    /** Feature name. */
    title: ReactNode;
    /** Supporting copy. */
    description?: ReactNode;
    /**
     * Stagger the entrance animation by this many milliseconds — pass
     * `index * 100` when mapping a grid. Omit to render without animation.
     */
    delay?: number;
    /** Extra content below the description (a link, a chip row). */
    children?: ReactNode;
}
/**
 * The marketing feature tile: a tinted icon block, a title, a line of copy, and
 * — the part that makes it feel considered — a hover that *glows* rather than
 * moves. A hairline catches the light along the top edge and a soft radial
 * bloom fades in at the corner while the card lifts a single pixel.
 *
 * This is the card that Yunxin's landing and Fellows pages repeat; it was
 * hand-rolled in both. Prefer it for uniform feature grids. {@link BentoCard} is
 * the sibling for asymmetric bento layouts — same hover language, glass surface.
 */
declare function FeatureCard({ icon, title, description, delay, children, className, style, ...props }: FeatureCardProps): React$1.JSX.Element;

interface CTASectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Headline. */
    title: ReactNode;
    /** Supporting line under the headline. */
    body?: ReactNode;
    /** The call to action — a Button, or a pair of them. */
    actions?: ReactNode;
    /** Small label above the headline (an {@link Eyebrow}, a badge). */
    eyebrow?: ReactNode;
    /** Play the staggered entrance animation. @defaultValue true */
    animate?: boolean;
}
/**
 * The closing call-to-action band: a large rounded panel with a soft radial
 * wash blooming from its top edge, a headline, a line of copy and the action.
 *
 * Extracted from Yunxin, where the same panel closes both the landing page and
 * the Fellows page. The wash is an inline `radial-gradient` on `--accent-subtle`
 * rather than a utility class because it needs a precise ellipse origin.
 */
declare function CTASection({ title, body, actions, eyebrow, animate, className, ...props }: CTASectionProps): React$1.JSX.Element;

interface PullQuoteProps extends HTMLAttributes<HTMLElement> {
    /** The quoted line — a manifesto, an ethos, a testimonial. */
    children: ReactNode;
    /** Attribution shown under the quote. */
    cite?: ReactNode;
    /** Show the leading quote glyph. @defaultValue true */
    showIcon?: boolean;
}
/**
 * A centered manifesto/pull-quote: a soft quote glyph over one large line of
 * display text that fades from `--foreground` into the muted tone.
 *
 * Extracted verbatim from Yunxin's Fellows manifesto block. The gradient text
 * is the whole point — a flat colour at this size reads as a heading, not a
 * statement — so it stays a `bg-clip-text` fade rather than a solid fill.
 */
declare function PullQuote({ children, cite, showIcon, className, ...props }: PullQuoteProps): React$1.JSX.Element;

interface MarketingHeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    /** Pill badge above the title — pass an {@link Eyebrow} or any node. */
    badge?: ReactNode;
    /** Headline. Wrap the part that should fade with {@link HeroAccent}. */
    title: ReactNode;
    /** Supporting paragraph. */
    subtitle?: ReactNode;
    /** Primary/secondary buttons. */
    actions?: ReactNode;
    /** Short reassurance chips under the actions ("Free to apply", "6 weeks"). */
    facts?: ReactNode[];
    /** Anchor the scroll-down chevron links to. Omit to hide the chevron. */
    scrollToId?: string;
    /** Accessible label for the scroll-down chevron. @defaultValue "Scroll down" */
    scrollLabel?: string;
    /** Fill the viewport (`min-h-dvh`). @defaultValue true */
    fullHeight?: boolean;
}
/**
 * The full-bleed landing hero: a soft radial wash, a pill badge, a large
 * two-tone headline, subcopy, the actions, a row of reassurance chips, and a
 * bouncing scroll-down chevron.
 *
 * Extracted from Yunxin, where the landing page and the Fellows page each
 * hand-rolled the identical block. Everything is a slot — YunUI owns the
 * geometry, the wash and the entrance stagger; the host owns every word.
 */
declare function MarketingHero({ badge, title, subtitle, actions, facts, scrollToId, scrollLabel, fullHeight, className, ...props }: MarketingHeroProps): React$1.JSX.Element;
/**
 * The faded tail of a hero headline — wrap the second half of the title so it
 * washes from the foreground colour into the muted tone.
 */
declare function HeroAccent({ children }: {
    children: ReactNode;
}): React$1.JSX.Element;

interface ProseArticleProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    /**
     * Drop Tailwind Typography's `prose` classes on the inner wrapper.
     * Turn it off when the content already ships its own styles (e.g. YunUI's
     * `MarkdownRenderer`, which would then be styled twice).
     * @defaultValue true
     */
    prose?: boolean;
}
/**
 * The reading column for long-form pages — About, a blog post, a changelog.
 * A 3xl measure, centered, with the page's vertical rhythm.
 *
 * Extracted from Yunxin, where About and the blog post page each hand-rolled
 * the identical wrapper. `prose` is a prop because the two callers differ: MDX
 * bodies want Typography, `MarkdownRenderer` output does not (see the
 * double-styling note in the content docs).
 */
declare function ProseArticle({ children, prose, className, ...props }: ProseArticleProps): React$1.JSX.Element;
interface BackLinkProps {
    /** Destination. */
    href: string;
    /** Link text — localize it yourself. */
    children: ReactNode;
    className?: string;
}
/**
 * The muted "‹ back to …" link above a detail page. Routes through the
 * {@link useYunUI} adapter, so it uses the host framework's Link.
 */
declare function BackLink({ href, children, className }: BackLinkProps): React$1.JSX.Element;

interface AuthShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * Brand row above the card — the logo + wordmark. Rendered inside a
     * centered flex row; pass the image and the name as siblings.
     */
    brand?: ReactNode;
    /** When set, the brand row becomes a link to this destination (usually "/"). */
    homeHref?: string;
    /** Card heading. */
    title?: ReactNode;
    /** Optional line under the heading. */
    subtitle?: ReactNode;
    /**
     * A block above the form for a failed submit — rendered in the soft-error
     * box these screens all use. Falsy values render nothing.
     */
    error?: ReactNode;
    /** Optional medallion / spinner above the heading, centered. */
    icon?: ReactNode;
    /** The form (or whatever the screen is for). */
    children: ReactNode;
    /** Content under the card — "Don't have an account?", legal links. */
    footer?: ReactNode;
    /** Centers everything in the card — for confirmation and status screens. */
    centered?: boolean;
    /**
     * Width of the column. `sm` suits a sign-in form; `md` suits the wider
     * error / not-found screens. @defaultValue "sm"
     */
    width?: "sm" | "md";
    /** Extra classes on the card box itself (the wrapper takes `className`). */
    cardClassName?: string;
}
/**
 * The centered single-column screen every auth flow uses: sign in, sign up,
 * forgot/reset password, verify email, resend verification, OAuth callback.
 *
 * Yunxin hand-rolls this shell **nine times** — each copy re-deriving the
 * viewport centring, the column width, the brand row spacing and the card
 * chrome. This is a straight extraction of that markup, class for class:
 * Yunxin is the original and stays the reference, so a screen that adopts
 * `AuthShell` renders identically to the copy it replaces.
 *
 * That is why the panel is `p-6 bg-card border border-border rounded-xl` and
 * NOT the house `.card` class — `.card` is a 20px radius with a shadow and a
 * hover transition, so swapping it in would have quietly restyled all nine
 * screens. Only the parts that are identical in every copy live here; whatever
 * varies (medallions, spinners, per-screen copy) stays in `children`.
 */
declare function AuthShell({ brand, homeHref, title, subtitle, error, icon, children, footer, centered, width, className, cardClassName, ...props }: AuthShellProps): React$1.JSX.Element;

interface TableStateProps extends HTMLAttributes<HTMLDivElement> {
    /** The message — "No results", "Nothing to review". */
    children: ReactNode;
    /** Show a spinner before the message. @defaultValue false */
    loading?: boolean;
    /** Vertical padding. `card` also draws the card surface. @defaultValue "plain" */
    surface?: "plain" | "card";
}
/**
 * The single muted line an empty or loading table/panel shows in place of rows.
 *
 * Yunxin repeats this shape **39 times** across its dashboard and admin pages —
 * as `card p-8 text-center text-muted-foreground`, as `p-8 …`, and as `py-8 …`,
 * i.e. three spellings of one idea. This is deliberately *not*
 * {@link EmptyState}: that is the big icon + title + description + action block
 * for a whole screen; this is the one-line cell inside a table.
 */
declare function TableState({ children, loading, surface, className, ...props }: TableStateProps): React$1.JSX.Element;
interface StatGridProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    /** Columns at the widest breakpoint. @defaultValue 4 */
    columns?: 2 | 3 | 4;
}
/**
 * The responsive tile row that carries {@link StatCard}s at the top of a
 * dashboard page — two up on phones, `columns` up from `sm`/`lg`.
 *
 * Extracted because Yunxin hand-rolls the same grid on ~12 admin pages, and the
 * copies had already drifted between `sm:grid-cols-4` and `lg:grid-cols-4`.
 */
declare function StatGrid({ children, columns, className, ...props }: StatGridProps): React$1.JSX.Element;
interface DashboardPageProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    /** Max content width. @defaultValue "7xl" */
    width?: "5xl" | "6xl" | "7xl";
}
/**
 * The content column for a dashboard/admin page: a capped, centered width with
 * the house vertical rhythm between sections.
 *
 * Distinct from {@link PageLayout}, which is the marketing shell (navbar +
 * footer). Yunxin repeats `space-y-6 max-w-7xl mx-auto` on 11 admin pages.
 */
declare function DashboardPage({ children, width, className, ...props }: DashboardPageProps): React$1.JSX.Element;
interface SectionRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Section title. */
    title: ReactNode;
    /** Trailing control — a button, a filter, a link. */
    action?: ReactNode;
}
/**
 * A section title with a trailing action on the same baseline — the header that
 * sits above a table or a card list inside a page (not the page header itself;
 * that is {@link PageHeader}). Repeated 13 times across Yunxin's dashboard.
 */
declare function SectionRow({ title, action, className, ...props }: SectionRowProps): React$1.JSX.Element;

interface SectionNavItem {
    /** Element id to scroll to; also the observed target. */
    id: string;
    label: string;
    /** Shown right-aligned — how many things are in the section. */
    count?: number;
}
interface SectionNavProps {
    items: SectionNavItem[];
    /** Offset in px for a fixed header, used when scrolling and when spying. */
    offset?: number;
    /** Accessible name for the nav landmark — localize it. @defaultValue "Sections" */
    label?: string;
    className?: string;
}
/**
 * In-page section navigator with scroll spy.
 *
 * Written because a digest can run to forty entries across nine sections, and
 * without this the only way to reach 產業動態 is to scroll past everything
 * before it. Distinct from `Sidebar`, which is site navigation (brand, logo, routes):
 * this covers "navigate within one long page". Upstreamed from YunNEWS, where
 * it was written to library standards from the start.
 *
 * IntersectionObserver rather than a scroll handler: a scroll listener fires on
 * every frame and has to measure each section's box, which is the same work the
 * browser has already done.
 */
declare function SectionNav({ items, offset, label, className }: SectionNavProps): React$1.JSX.Element | null;

interface ArchiveCalendarProps {
    /** Dates that have an issue, as YYYY-MM-DD. Order does not matter. */
    dates: string[];
    /** Where a date links to. */
    href: (date: string) => string;
    /**
     * Most months to draw. A ceiling, not a count: the range comes from the data,
     * so an archive three weeks old draws one month rather than six, five of them
     * empty.
     */
    maxMonths?: number;
    /** Weekday initials, Sunday first. @defaultValue ["S","M","T","W","T","F","S"] */
    weekdays?: readonly string[];
    /** Format a month heading. @defaultValue `${year}-${month}` */
    formatMonth?: (year: number, month: number) => string;
    /** Label the per-month count, e.g. `(n) => `${n} issues``. Omit to hide it. */
    formatCount?: (count: number) => string;
    /** Accessible label for a filled day. @defaultValue the ISO date */
    formatDayLabel?: (date: string) => string;
    className?: string;
}
declare function ArchiveCalendar({ dates, href, maxMonths, weekdays, formatMonth, formatCount, formatDayLabel, className, }: ArchiveCalendarProps): React$1.JSX.Element | null;

export { AccountLockedCard, type AccountLockedCardProps, ActiveBadge, ArchiveCalendar, type ArchiveCalendarProps, AudioPlayer, type AudioPlayerProps, AuthShell, type AuthShellProps, AvatarUploader, type AvatarUploaderProps, BackLink, type BackLinkProps, BackgroundEffects, Banner, type BannerProps, type BannerTone, BlogCard, BlogPagination, BlogPostHeader, CTASection, type CTASectionProps, CapabilityBadge, CategoryFilter, CodeBlock, CodeDemo, ConnectedAccountRow, type ConnectedAccountRowProps, DashboardPage, type DashboardPageProps, DeprecatedBadge, ErrorBoundary, type ErrorBoundaryLabels, Eyebrow, type EyebrowProps, FAQ, type FAQItem, type FAQProps, FeatureCard, type FeatureCardProps, FeatureLockedState, type FeatureLockedStateProps, FellowBadge, FellowsBanner, type FellowsBannerProps, HeroAccent, LLMCopyButton, LinkRow, type LinkRowProps, MarketingHero, type MarketingHeroProps, MediaEmptyState, MediaErrorState, MediaGallery, type MediaGalleryLabels, type MediaGalleryProps, MediaLoadingState, MediaPageHeader, type MediaResult, type MediaStatus, MetricBar, type MetricBarProps, NavStateIndicator, type NavStateIndicatorProps, NotificationBell, type NotificationBellProps, NotificationItem, type NotificationItemProps, NotificationPanel, type NotificationPanelProps, PageEmptyState, PageErrorState, PageHeader, PageLayout, type PageLayoutProps, PageLoadingState, ProseArticle, type ProseArticleProps, PullQuote, type PullQuoteProps, ReadingProgress, SectionHeading, type SectionHeadingProps, SectionNav, type SectionNavItem, type SectionNavProps, SectionRow, type SectionRowProps, SessionItem, type SessionItemProps, SettingRow, type SettingRowProps, type SettingsNavGroup, type SettingsNavItem, SettingsShell, type SettingsShellProps, Sidebar, type SidebarNavItem, type SidebarProps, type SidebarSection, SimplePagination, SourceBadge, StatCard, StatGrid, type StatGridProps, StatusBadge, TableState, type TableStateProps, ViewOptions };
