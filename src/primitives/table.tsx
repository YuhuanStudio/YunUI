// =====================================================
// TABLE
// Semantic, presentational table family using design-system tokens.
// =====================================================

import * as React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Table root — wraps a `<table>` in an overflow container so wide tables scroll
 * horizontally instead of breaking the layout. `className` is applied to the
 * inner `<table>`; pass `containerClassName` to style the scroll wrapper.
 */
export const Table = React.forwardRef<
    HTMLTableElement,
    React.TableHTMLAttributes<HTMLTableElement> & {
        /** Class applied to the outer scroll/overflow wrapper. */
        containerClassName?: string;
        /**
         * Stack each row into a labelled card below the `md` breakpoint, so dense
         * many-column tables stay readable on narrow screens instead of forcing a
         * horizontal scroll. Pair with `<TableCell label="…">` to label each value.
         */
        responsive?: boolean;
    }
>(({ className, containerClassName, responsive, ...props }, ref) => (
    <div className={cn("relative w-full overflow-x-auto", containerClassName)}>
        <table
            ref={ref}
            className={cn(
                "w-full caption-bottom border-collapse text-sm",
                responsive && "yunui-table-responsive",
                className
            )}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

/** Table header group (`<thead>`); contains the column-header row(s). */
export const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn("[&_tr]:border-b [&_tr]:border-(--border-default)", className)}
        {...props}
    />
));
TableHeader.displayName = "TableHeader";

/** Table body group (`<tbody>`); rows are divided by subtle borders. */
export const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

/** Table footer group (`<tfoot>`); a muted summary row band. */
export const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t border-(--border-default) bg-muted/30 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

/** Table row (`<tr>`) with a divider and hover highlight. */
export const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-(--border-default) transition-colors hover:bg-(--bg-hover) data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

/**
 * Column header cell (`<th>`): uppercase, muted, small.
 *
 * Pass `onSort` to make it a sort control — the content renders as a button with an
 * asc/desc/unsorted chevron and the `<th>` gets `aria-sort`; `sortDirection` is the column's
 * current state (`"asc"`/`"desc"`, or `false`/omitted when it isn't the active sort column).
 * `align` also aligns the sort control (use `"right"` for numeric columns).
 */
export const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement> & {
        onSort?: () => void;
        sortDirection?: "asc" | "desc" | false;
        align?: "left" | "right" | "center";
    }
>(({ className, onSort, sortDirection, align = "left", children, ...props }, ref) => {
    const alignClass =
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
    const head = cn(
        // whitespace-nowrap: header labels are short and must never wrap — CJK labels in
        // particular would otherwise break mid-word (能力 → 能/力) in narrow columns / WebKit.
        "h-10 whitespace-nowrap px-4 align-middle text-[11px] font-medium uppercase tracking-wider text-muted-foreground [&:has([role=checkbox])]:pr-0",
        alignClass,
        className
    );

    if (!onSort) {
        return (
            <th ref={ref} className={head} {...props}>
                {children}
            </th>
        );
    }

    const Icon =
        sortDirection === "asc" ? ChevronUp : sortDirection === "desc" ? ChevronDown : ChevronsUpDown;
    const justify =
        align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
    return (
        <th
            ref={ref}
            aria-sort={sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none"}
            className={head}
            {...props}
        >
            <button
                type="button"
                onClick={onSort}
                className={cn(
                    "inline-flex w-full items-center gap-1 uppercase tracking-wider transition-colors hover:text-foreground",
                    justify
                )}
            >
                {children}
                <Icon
                    size={12}
                    aria-hidden
                    className={cn("shrink-0", sortDirection ? "text-primary" : "opacity-40")}
                />
            </button>
        </th>
    );
});
TableHead.displayName = "TableHead";

/** Standard data cell (`<td>`). */
export const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement> & {
        /** Column label shown beside the value when the parent `<Table responsive>`
         *  stacks rows into cards on narrow screens. */
        label?: string;
    }
>(({ className, label, ...props }, ref) => (
    <td
        ref={ref}
        data-label={label}
        className={cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
));
TableCell.displayName = "TableCell";

/** Caption (`<caption>`) rendered below the table; muted helper text. */
export const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";

// ---- short aliases --------------------------------------------------------

export {
    TableHeader as Thead,
    TableBody as Tbody,
    TableFooter as Tfoot,
    TableRow as Tr,
    TableHead as Th,
    TableCell as Td,
};
