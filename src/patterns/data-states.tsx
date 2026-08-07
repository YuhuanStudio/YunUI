import type { HTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface TableStateProps extends HTMLAttributes<HTMLDivElement> {
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
export function TableState({
    children,
    loading = false,
    surface = "plain",
    className,
    ...props
}: TableStateProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground",
                surface === "card" && "card",
                className,
            )}
            {...props}
        >
            {loading && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
            {children}
        </div>
    );
}

export interface StatGridProps extends HTMLAttributes<HTMLDivElement> {
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
export function StatGrid({ children, columns = 4, className, ...props }: StatGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-4",
                columns === 2 && "sm:grid-cols-2",
                columns === 3 && "sm:grid-cols-3",
                columns === 4 && "sm:grid-cols-4",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export interface DashboardPageProps extends HTMLAttributes<HTMLDivElement> {
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
export function DashboardPage({
    children,
    width = "7xl",
    className,
    ...props
}: DashboardPageProps) {
    return (
        <div
            className={cn(
                "mx-auto space-y-6",
                width === "5xl" && "max-w-5xl",
                width === "6xl" && "max-w-6xl",
                width === "7xl" && "max-w-7xl",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export interface SectionRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
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
export function SectionRow({ title, action, className, ...props }: SectionRowProps) {
    return (
        <div className={cn("mb-4 flex items-center justify-between gap-3", className)} {...props}>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {action}
        </div>
    );
}
