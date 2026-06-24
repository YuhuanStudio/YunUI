// =====================================================
// TABLE
// Semantic, presentational table family using design-system tokens.
// =====================================================

import * as React from "react";
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

/** Column header cell (`<th>`): left-aligned, uppercase, muted, small. */
export const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-10 px-4 text-left align-middle text-[11px] font-medium uppercase tracking-wider text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
));
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
