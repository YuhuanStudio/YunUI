// =====================================================
// BREADCRUMB
// Accessible breadcrumb trail. Links route through the YunUI adapter.
// =====================================================

"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

/** Breadcrumb root: a `<nav>` landmark labelling the trail for screen readers. */
export const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<"nav"> & {
        /** Accessible name for the navigation landmark. @defaultValue "Breadcrumb" */
        "aria-label"?: string;
    }
>(({ "aria-label": ariaLabel = "Breadcrumb", ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel} {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

/** Ordered list (`<ol>`) holding the breadcrumb items. */
export const BreadcrumbList = React.forwardRef<
    HTMLOListElement,
    React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5",
            className
        )}
        {...props}
    />
));
BreadcrumbList.displayName = "BreadcrumbList";

/** A single breadcrumb item (`<li>`); wrap a link, page, or separator. */
export const BreadcrumbItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
    />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

/**
 * A navigable breadcrumb link. Routes through the host app's `Link` adapter
 * (`useYunUI().Link`) so it integrates with the consumer's router; falls back
 * to a plain `<a>` when no provider is present.
 */
export function BreadcrumbLink({
    className,
    href,
    ...props
}: {
    /** Destination URL. */
    href: string;
    children?: React.ReactNode;
    className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
    const { Link } = useYunUI();
    return (
        <Link
            href={href}
            className={cn("transition-colors hover:text-foreground", className)}
            {...props}
        />
    );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

/**
 * The current page in the trail. Non-interactive and marked
 * `aria-current="page"` for assistive tech.
 */
export const BreadcrumbPage = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-medium text-foreground", className)}
        {...props}
    />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

/**
 * Visual separator between items (a chevron by default). Hidden from the
 * accessibility tree since it carries no information for screen readers.
 */
export const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"li">) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5 text-muted-foreground/60", className)}
        {...props}
    >
        {children ?? <ChevronRight />}
    </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/**
 * Ellipsis placeholder for collapsed middle items in a long trail.
 */
export const BreadcrumbEllipsis = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"span">) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <span className="text-base leading-none">…</span>
        <span className="sr-only">More</span>
    </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
