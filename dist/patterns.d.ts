import * as React$1 from 'react';
import React__default, { ElementType, ReactNode } from 'react';

declare function BackgroundEffects(): React$1.JSX.Element;

declare function CodeDemo(): React$1.JSX.Element;

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}
interface FAQProps {
    /** The questions to render. The host app supplies (and translates) these. */
    items: FAQItem[];
    /** Which item starts expanded (default: first). Pass null for all collapsed. */
    defaultOpenIndex?: number | null;
}
declare function FAQ({ items, defaultOpenIndex }: FAQProps): React$1.JSX.Element;

interface Tab {
    id: string;
    label: string;
    code: string;
    language?: string;
}
interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    copyable?: boolean;
    className?: string;
    tabs?: Tab[];
}
declare function CodeBlock({ code, language, filename, showLineNumbers, copyable, className, tabs, }: CodeBlockProps): React$1.JSX.Element;

declare function LLMCopyButton({ markdownUrl }: {
    markdownUrl: string;
}): React$1.JSX.Element;
declare function ViewOptions({ markdownUrl, githubUrl, }: {
    markdownUrl: string;
    githubUrl?: string;
}): React$1.JSX.Element;

interface BlogCardProps {
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
    url: string;
    variant?: "default" | "featured";
    /** Locale for the date; defaults to a stable "en-US" (SSR-safe). */
    locale?: string;
}
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
    label: string;
    href: string;
    icon?: ElementType;
    /** Extra path prefixes that should also mark this item active. */
    match?: string[];
}
interface SidebarSection {
    title?: string;
    items: SidebarNavItem[];
}
interface SidebarProps {
    appName: string;
    logoSrc?: string;
    homeHref?: string;
    sections: SidebarSection[];
    /** Used to compute the active item. */
    currentPath?: string;
    /** Mobile drawer open state. */
    isOpen?: boolean;
    onClose?: () => void;
    /** Desktop collapse state (hides the sidebar off-canvas). */
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    /**
     * Called when a nav item is clicked. When provided, default link navigation
     * is prevented and the host owns routing (useful in SPAs / demos). When
     * omitted, items navigate via the injected Link adapter.
     */
    onNavigate?: (href: string) => void;
    /** Bottom-pinned slot (balance card, user card, etc.). */
    footer?: ReactNode;
    closeLabel?: string;
    /** While true, the nav (and footer slot) render shimmer skeletons. */
    loading?: boolean;
    /** sessionStorage key for persisting nav scroll position across navigations. */
    scrollStorageKey?: string;
}
declare function Sidebar({ appName, logoSrc, homeHref, sections, currentPath, isOpen, onClose, collapsed, onToggleCollapse, onNavigate, footer, closeLabel, loading, scrollStorageKey, }: SidebarProps): React$1.JSX.Element;

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}
declare function PageHeader({ title, description, actions, className }: PageHeaderProps): React$1.JSX.Element;

interface PageLoadingStateProps {
    message?: string;
}
declare function PageLoadingState({ message }: PageLoadingStateProps): React$1.JSX.Element;
interface PageErrorStateProps {
    message: string;
    onRetry?: () => void;
    retryLabel?: string;
}
declare function PageErrorState({ message, onRetry, retryLabel }: PageErrorStateProps): React$1.JSX.Element;
interface PageEmptyStateProps {
    icon?: ElementType;
    title: string;
    description?: string;
    action?: ReactNode;
}
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
    icon?: ElementType;
    label: string;
    value: ReactNode;
    subtext?: ReactNode;
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
    className?: string;
}
declare function StatCard({ icon: Icon, label, value, subtext, trend, tone, delay, inline, valueFirst, className }: StatCardProps): React$1.JSX.Element;

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
    title: string;
    description: string;
    isSyncing: boolean;
    syncError: string | null;
    onSync: () => void;
    stats?: {
        label: string;
        value: string | number;
    }[];
}
declare function MediaPageHeader({ title, description, isSyncing, syncError, onSync, stats }: MediaPageHeaderProps): React$1.JSX.Element;
interface MediaEmptyStateProps {
    icon: ElementType;
    title: string;
    description: string;
    action?: ReactNode;
}
declare function MediaEmptyState({ icon: Icon, title, description, action }: MediaEmptyStateProps): React$1.JSX.Element;
declare function MediaLoadingState({ message }: {
    message?: string;
}): React$1.JSX.Element;
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

export { AccountLockedCard, type AccountLockedCardProps, ActiveBadge, BackgroundEffects, BlogCard, BlogPagination, BlogPostHeader, CapabilityBadge, CategoryFilter, CodeBlock, CodeDemo, DeprecatedBadge, ErrorBoundary, type ErrorBoundaryLabels, FAQ, type FAQItem, type FAQProps, FellowBadge, FellowsBanner, type FellowsBannerProps, LLMCopyButton, MediaEmptyState, MediaErrorState, MediaLoadingState, MediaPageHeader, PageEmptyState, PageErrorState, PageHeader, PageLoadingState, Sidebar, type SidebarNavItem, type SidebarProps, type SidebarSection, SourceBadge, StatCard, StatusBadge, ViewOptions };
