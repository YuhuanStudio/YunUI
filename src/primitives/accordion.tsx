"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Radix Accordion root — a vertically stacked set of collapsible sections.
 *
 * Set `type="single"` for one-at-a-time panels (optionally `collapsible` so the
 * open one can be closed) or `type="multiple"` to allow several open at once.
 * Full keyboard a11y (arrow keys, Home/End, Enter/Space) comes from Radix.
 */
export const Accordion = AccordionPrimitive.Root;

/** A single collapsible section. Give each a unique `value`. */
export const AccordionItem = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn(
            "rounded-xl border border-(--border-default) bg-(--bg-elevated) overflow-hidden",
            "data-[state=open]:border-(--border-strong) transition-colors",
            className
        )}
        {...props}
    />
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

/** Clickable header that toggles its section; shows a chevron that rotates when open. */
export const AccordionTrigger = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-left",
                "transition-colors hover:bg-(--bg-hover)",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "[&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * Collapsible panel body. Animates its height open/closed by transitioning the
 * `grid-template-rows` `0fr` → `1fr` track, driven by Radix's
 * `data-state` attribute. Self-contained (no external keyframes required).
 */
export const AccordionContent = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "grid text-sm text-muted-foreground",
            "transition-[grid-template-rows] duration-200 ease-out",
            "data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
            className
        )}
        {...props}
    >
        <div className="overflow-hidden">
            <div className="px-4 pb-3 pt-0">{children}</div>
        </div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
