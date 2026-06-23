// =====================================================
// PAGINATION
// Controlled page navigator with ellipsis truncation.
// Presentational: the host owns page state + routing.
// =====================================================

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

/** Sentinel inserted into the visible-page list to render an ellipsis gap. */
type PageToken = number | "ellipsis";

interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
    /** The active page (1-based). */
    page: number;
    /** Total number of pages. */
    totalPages: number;
    /** Called with the requested page when a control is activated. */
    onPageChange: (page: number) => void;
    /**
     * How many page buttons to show on each side of the current page before
     * collapsing into an ellipsis.
     * @defaultValue 1
     */
    siblingCount?: number;
    /** Accessible label for the previous-page button. @defaultValue "Go to previous page" */
    previousLabel?: string;
    /** Accessible label for the next-page button. @defaultValue "Go to next page" */
    nextLabel?: string;
    /** Accessible name for the wrapping nav landmark. @defaultValue "Pagination" */
    ariaLabel?: string;
}

/**
 * Build the truncated list of page tokens to render. Always keeps the first and
 * last page visible, shows `siblingCount` neighbours around the current page,
 * and fills the gaps with `"ellipsis"`.
 */
function getPageRange(page: number, totalPages: number, siblingCount: number): PageToken[] {
    // Pages we always want rendered as real buttons.
    const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 ellipses budget

    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const tokens: PageToken[] = [1];

    if (showLeftEllipsis) {
        tokens.push("ellipsis");
    } else {
        // Fill the small gap between page 1 and the left sibling with numbers.
        for (let i = 2; i < leftSibling; i++) tokens.push(i);
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
        if (i !== 1 && i !== totalPages) tokens.push(i);
    }

    if (showRightEllipsis) {
        tokens.push("ellipsis");
    } else {
        for (let i = rightSibling + 1; i < totalPages; i++) tokens.push(i);
    }

    if (totalPages > 1) tokens.push(totalPages);

    return tokens;
}

const navButton =
    "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-xl border border-(--border-default) bg-(--bg-elevated) px-2 text-sm transition-all duration-200 hover:border-(--border-strong) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50";

/**
 * Controlled pagination control. Renders previous/next arrows plus numbered
 * page buttons with ellipsis truncation. The current page is highlighted with
 * the primary accent and exposes `aria-current="page"`; prev/next are disabled
 * at the bounds.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
    (
        {
            page,
            totalPages,
            onPageChange,
            siblingCount = 1,
            previousLabel = "Go to previous page",
            nextLabel = "Go to next page",
            ariaLabel = "Pagination",
            className,
            ...props
        },
        ref
    ) => {
        if (totalPages <= 1) return null;

        const tokens = getPageRange(page, totalPages, siblingCount);
        const isFirst = page <= 1;
        const isLast = page >= totalPages;

        return (
            <nav
                ref={ref}
                aria-label={ariaLabel}
                className={cn("flex items-center justify-center gap-1.5", className)}
                {...props}
            >
                <button
                    type="button"
                    aria-label={previousLabel}
                    disabled={isFirst}
                    onClick={() => !isFirst && onPageChange(page - 1)}
                    className={navButton}
                >
                    <ChevronLeft size={16} />
                </button>

                {tokens.map((token, i) =>
                    token === "ellipsis" ? (
                        <span
                            key={`ellipsis-${i}`}
                            aria-hidden="true"
                            className="flex h-9 min-w-9 items-center justify-center text-muted-foreground"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={token}
                            type="button"
                            aria-label={`Go to page ${token}`}
                            aria-current={token === page ? "page" : undefined}
                            onClick={() => onPageChange(token)}
                            className={cn(
                                navButton,
                                token === page &&
                                    "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary"
                            )}
                        >
                            {token}
                        </button>
                    )
                )}

                <button
                    type="button"
                    aria-label={nextLabel}
                    disabled={isLast}
                    onClick={() => !isLast && onPageChange(page + 1)}
                    className={navButton}
                >
                    <ChevronRight size={16} />
                </button>
            </nav>
        );
    }
);
Pagination.displayName = "Pagination";

export type { PaginationProps };
