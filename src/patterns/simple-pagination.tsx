"use client";

import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../index";

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
  labels?: { previous?: string; next?: string; page?: (n: number) => ReactNode };
}

/** Prev / page-indicator / next pager for cursor- or has-more-style lists where
 *  the total page count isn't known (so numbered pages aren't possible). Matches
 *  `BlogPagination`'s ghost-button styling. */
export function SimplePagination({
  currentPage,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  labels,
}: SimplePaginationProps) {
  const canPrev = hasPrevious ?? currentPage > 1;
  const previousLabel = labels?.previous ?? "Previous";
  const nextLabel = labels?.next ?? "Next";
  const pageNode = labels?.page ? labels.page(currentPage) : `Page ${currentPage}`;

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <Button variant="ghost" size="sm" onClick={onPrevious} disabled={!canPrev}>
        <ChevronLeft size={16} />
        <span className="ml-1 hidden sm:inline">{previousLabel}</span>
      </Button>

      <span className="px-3 text-sm font-medium tabular-nums whitespace-nowrap">{pageNode}</span>

      <Button variant="ghost" size="sm" onClick={onNext} disabled={!hasNext}>
        <span className="mr-1 hidden sm:inline">{nextLabel}</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
