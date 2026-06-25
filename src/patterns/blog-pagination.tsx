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

  // Calculate visible page range. Keep the window small so a MIDDLE page (which
  // also shows first + last + two ellipses) doesn't widen the row past a phone.
  const maxVisible = 3;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
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
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(1)} className="w-8 h-8 p-0 justify-center text-sm">
              1
            </Button>
            {start > 2 && <span className="px-2 text-muted-foreground">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            // Current page: just bold + full-strength text (no fill / no box) —
            // inline color because .btn-ghost's muted color would otherwise win.
            className={`w-8 h-8 p-0 justify-center text-sm ${page === currentPage ? "font-semibold" : ""}`}
            style={page === currentPage ? { color: "var(--text-primary)" } : undefined}
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
              className="w-8 h-8 p-0 justify-center text-sm"
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
