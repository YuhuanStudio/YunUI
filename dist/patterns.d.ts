import * as React$1 from 'react';
import React__default, { ReactNode, ElementType } from 'react';
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

declare function LLMCopyButton({ markdownUrl }: {
    markdownUrl: string;
}): React$1.JSX.Element;
declare function ViewOptions({ markdownUrl, githubUrl, }: {
    markdownUrl: string;
    githubUrl?: string;
}): React$1.JSX.Element;

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
}
/** App navigation sidebar: logo, grouped nav sections with active-state matching, a mobile drawer, desktop collapse, and a footer slot. */
declare function Sidebar({ appName, logoSrc, homeHref, sections, currentPath, isOpen, onClose, collapsed, onToggleCollapse, onNavigate, footer, closeLabel, loading, scrollStorageKey, }: SidebarProps): React$1.JSX.Element;

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}
declare function PageHeader({ title, description, actions, className }: PageHeaderProps): React$1.JSX.Element;

interface PageLoadingStateProps {
    /** Optional text shown beside the spinner. */
    message?: string;
}
/** Centered in-page loading state (spinner + optional message). */
declare function PageLoadingState({ message }: PageLoadingStateProps): React$1.JSX.Element;
interface PageErrorStateProps {
    /** Error message to display. */
    message: string;
    /** When provided, shows a retry link that calls this. */
    onRetry?: () => void;
    /** Label for the retry link. @defaultValue "Retry" */
    retryLabel?: string;
}
/** Centered in-page error state with an optional retry link. */
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

/**
 * Canonical dashboard stat card — the single source for every metric tile.
 * Structure is the dashboard overview card; `tone` provides semantic color
 * (amber=pending, red=rejected, …); icon/trend/subtext/delay are all optional
 * so compact colored tiles and rich trend cards share one component.
 */
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

export { AccountLockedCard, type AccountLockedCardProps, ActiveBadge, BackgroundEffects, Banner, type BannerProps, type BannerTone, BlogCard, BlogPagination, BlogPostHeader, CapabilityBadge, CategoryFilter, CodeBlock, CodeDemo, DeprecatedBadge, ErrorBoundary, type ErrorBoundaryLabels, FAQ, type FAQItem, type FAQProps, FellowBadge, FellowsBanner, type FellowsBannerProps, LLMCopyButton, MediaEmptyState, MediaErrorState, MediaLoadingState, MediaPageHeader, NotificationBell, type NotificationBellProps, NotificationItem, type NotificationItemProps, NotificationPanel, type NotificationPanelProps, PageEmptyState, PageErrorState, PageHeader, PageLoadingState, Sidebar, type SidebarNavItem, type SidebarProps, type SidebarSection, SimplePagination, SourceBadge, StatCard, StatusBadge, ViewOptions };
