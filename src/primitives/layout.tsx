// =====================================================
// LAYOUT PRIMITIVES
// Token-aware, presentational Flex / Grid / Column / Row / Stack.
// Numeric/scale props are mapped to LITERAL Tailwind classes via static
// lookup maps so Tailwind's compiler can see and generate them — never
// build class names dynamically (e.g. `gap-${n}`), those won't be emitted.
// =====================================================

import * as React from "react";
import { cn } from "../lib/cn";

// =====================================================
// SCALE MAPS
// =====================================================

/**
 * Supported spacing-scale values (Tailwind's default scale: 1 unit = 0.25rem).
 * A fixed set so the literal classes below are always present for the compiler.
 */
export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

const gapMap: Record<SpacingScale, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
};

const paddingMap: Record<SpacingScale, string> = {
    0: "p-0",
    1: "p-1",
    2: "p-2",
    3: "p-3",
    4: "p-4",
    5: "p-5",
    6: "p-6",
    8: "p-8",
    10: "p-10",
    12: "p-12",
};

const pxMap: Record<SpacingScale, string> = {
    0: "px-0",
    1: "px-1",
    2: "px-2",
    3: "px-3",
    4: "px-4",
    5: "px-5",
    6: "px-6",
    8: "px-8",
    10: "px-10",
    12: "px-12",
};

const pyMap: Record<SpacingScale, string> = {
    0: "py-0",
    1: "py-1",
    2: "py-2",
    3: "py-3",
    4: "py-4",
    5: "py-5",
    6: "py-6",
    8: "py-8",
    10: "py-10",
    12: "py-12",
};

// =====================================================
// FLEX MAPS
// =====================================================

const directionMap = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
} as const;

type FlexDirection = keyof typeof directionMap;

const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
} as const;

type Align = keyof typeof alignMap;

const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
} as const;

type Justify = keyof typeof justifyMap;

// =====================================================
// GRID MAPS
// =====================================================

/** Supported fixed column/row counts (1–12), mapped to literal grid classes. */
export type GridCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const colsMap: Record<GridCount, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
};

const rowsMap: Record<GridCount, string> = {
    1: "grid-rows-1",
    2: "grid-rows-2",
    3: "grid-rows-3",
    4: "grid-rows-4",
    5: "grid-rows-5",
    6: "grid-rows-6",
    7: "grid-rows-7",
    8: "grid-rows-8",
    9: "grid-rows-9",
    10: "grid-rows-10",
    11: "grid-rows-11",
    12: "grid-rows-12",
};

// =====================================================
// FLEX
// =====================================================

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
    /** Main axis direction. @defaultValue "row" */
    direction?: FlexDirection;
    /** Cross-axis alignment (`align-items`). */
    align?: Align;
    /** Main-axis distribution (`justify-content`). */
    justify?: Justify;
    /** Gap between children, on the spacing scale. */
    gap?: SpacingScale;
    /** Allow children to wrap onto multiple lines. */
    wrap?: boolean;
    /** Padding on all sides, on the spacing scale. */
    padding?: SpacingScale;
    /** Horizontal padding (`px`), on the spacing scale. */
    px?: SpacingScale;
    /** Vertical padding (`py`), on the spacing scale. */
    py?: SpacingScale;
    /** Element/tag to render as. @defaultValue "div" */
    as?: React.ElementType;
}

/**
 * Flexbox layout primitive. Maps `direction`/`align`/`justify`/`gap`/`wrap`/
 * padding props to literal Tailwind classes via static maps. Purely
 * presentational — extra props are spread onto the rendered element.
 */
export const Flex = React.forwardRef<HTMLElement, FlexProps>(
    (
        {
            as,
            direction = "row",
            align,
            justify,
            gap,
            wrap,
            padding,
            px,
            py,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = (as ?? "div") as React.ElementType;
        return (
            <Comp
                ref={ref}
                className={cn(
                    "flex",
                    directionMap[direction],
                    align && alignMap[align],
                    justify && justifyMap[justify],
                    gap !== undefined && gapMap[gap],
                    wrap && "flex-wrap",
                    padding !== undefined && paddingMap[padding],
                    px !== undefined && pxMap[px],
                    py !== undefined && pyMap[py],
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);
Flex.displayName = "Flex";

// =====================================================
// GRID
// =====================================================

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
    /** Number of equal columns (1–12). */
    columns?: GridCount;
    /** Number of explicit rows (1–12). */
    rows?: GridCount;
    /** Gap between cells, on the spacing scale. */
    gap?: SpacingScale;
    /** Cross-axis alignment of items within their cells (`align-items`). */
    align?: Align;
    /** Padding on all sides, on the spacing scale. */
    padding?: SpacingScale;
    /** Element/tag to render as. @defaultValue "div" */
    as?: React.ElementType;
}

/**
 * CSS-grid layout primitive. Maps `columns`/`rows`/`gap`/`align`/`padding`
 * to literal Tailwind classes via static maps. Purely presentational.
 */
export const Grid = React.forwardRef<HTMLElement, GridProps>(
    (
        { as, columns, rows, gap, align, padding, className, children, ...props },
        ref
    ) => {
        const Comp = (as ?? "div") as React.ElementType;
        return (
            <Comp
                ref={ref}
                className={cn(
                    "grid",
                    columns !== undefined && colsMap[columns],
                    rows !== undefined && rowsMap[rows],
                    gap !== undefined && gapMap[gap],
                    align && alignMap[align],
                    padding !== undefined && paddingMap[padding],
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);
Grid.displayName = "Grid";

// =====================================================
// COLUMN / ROW / STACK
// =====================================================

/** Thin wrapper around {@link Flex} fixed to `direction="col"`. */
export const Column = React.forwardRef<HTMLElement, Omit<FlexProps, "direction">>(
    (props, ref) => <Flex ref={ref} direction="col" {...props} />
);
Column.displayName = "Column";

/** Thin wrapper around {@link Flex} fixed to `direction="row"`. */
export const Row = React.forwardRef<HTMLElement, Omit<FlexProps, "direction">>(
    (props, ref) => <Flex ref={ref} direction="row" {...props} />
);
Row.displayName = "Row";

/**
 * Vertical {@link Flex} (`direction="col"`) with a sensible default `gap`.
 * Alias of {@link Column} optimised for stacking content; override `gap` freely.
 */
export const Stack = React.forwardRef<HTMLElement, Omit<FlexProps, "direction">>(
    ({ gap = 4, ...props }, ref) => (
        <Flex ref={ref} direction="col" gap={gap} {...props} />
    )
);
Stack.displayName = "Stack";
