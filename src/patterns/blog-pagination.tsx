"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../index";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Navigate to a page. The host app owns routing / query-string updates. */
  onPageChange: (page: number) => void;
  /** Localized labels; default to English. */
  labels?: { previous?: string; next?: string };
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
}: BlogPaginationProps) {
  const handlePageChange = onPageChange;
  const previousLabel = labels?.previous ?? "Previous";
  const nextLabel = labels?.next ?? "Next";

  if (totalPages <= 1) return null;

  // Calculate visible page range
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        <span className="ml-1 hidden sm:inline">{previousLabel}</span>
      </Button>

      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(1)} className="min-w-[36px]">
              1
            </Button>
            {start > 2 && <span className="px-2 text-muted-foreground">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => handlePageChange(page)}
            className="min-w-[36px]"
          >
            {page}
          </Button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-muted-foreground">...</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="min-w-[36px]"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="mr-1 hidden sm:inline">{nextLabel}</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
