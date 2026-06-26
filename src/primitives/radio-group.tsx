"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";

/**
 * Radix RadioGroup root — a single-choice set of {@link RadioGroupItem}s.
 *
 * Controlled via `value`/`onValueChange` (or uncontrolled via `defaultValue`).
 * Arrow keys move and select within the group; the whole group is one tab stop.
 */
export const RadioGroup = React.forwardRef<
    React.ComponentRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root
        ref={ref}
        className={cn("grid gap-2", className)}
        {...props}
    />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * A single radio option. Pair with a `<label htmlFor>` via `id`.
 * Renders a ring outline that fills with the primary accent and a center dot
 * when selected — matching YunUI's Checkbox/Switch visual language.
 */
export const RadioGroupItem = React.forwardRef<
    React.ComponentRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
            "border-(--border-strong) bg-transparent",
            "transition-all duration-200 ease-in-out",
            "hover:border-primary/50",
            "data-[state=checked]:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-primary" />
        </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
