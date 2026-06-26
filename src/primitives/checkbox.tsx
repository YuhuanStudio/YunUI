"use client";

import { forwardRef } from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps {
    /** Whether the box is checked. `"indeterminate"` shows a dash — for a
     *  select-all that's only partially selected. Defaults to `false`. */
    checked?: boolean | "indeterminate";
    /** Called with the next checked state when toggled (indeterminate → checked).
     *  Optional — omit for a read-only/display checkbox (it won't toggle). */
    onCheckedChange?: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}

/** Controlled checkbox rendered as an accessible toggle button. Supports an
 *  `indeterminate` state (dash) for partial select-all. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ checked = false, onCheckedChange, disabled = false, className = "", id }, ref) => {
        const filled = checked === true || checked === "indeterminate";
        return (
            <button
                ref={ref}
                type="button"
                role="checkbox"
                aria-checked={checked === "indeterminate" ? "mixed" : checked}
                id={id}
                onClick={() => !disabled && onCheckedChange?.(checked !== true)}
                disabled={disabled}
                className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${filled
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-(--border-strong) bg-transparent hover:border-primary/50"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `}
            >
                {checked === "indeterminate"
                    ? <Minus size={12} strokeWidth={3} />
                    : checked && <Check size={12} strokeWidth={3} />}
            </button>
        );
    }
);

Checkbox.displayName = "Checkbox";
