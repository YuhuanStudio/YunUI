"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
    extends Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        "checked" | "onChange" | "type" | "role" | "disabled" | "id" | "className"
    > {
    /** Whether the box is checked. `"indeterminate"` shows a dash — for a
     *  select-all that's only partially selected. Defaults to `false`. */
    checked?: boolean | "indeterminate";
    /** Called with the next checked state when toggled (indeterminate → checked).
     *  Optional — omit for a read-only/display checkbox (it won't toggle). */
    onCheckedChange?: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    className?: string;
    /**
     * Element id.
     *
     * NOTE: this renders a `<button role="checkbox">`, and `<label>` — whether
     * wrapping or via `htmlFor` — only names real form controls. It does
     * nothing for a button. Name it with `aria-label`, or point
     * `aria-labelledby` at the text beside it.
     */
    id?: string;
}

/** Controlled checkbox rendered as an accessible toggle button. Supports an
 *  `indeterminate` state (dash) for partial select-all. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ checked = false, onCheckedChange, disabled = false, className = "", id, ...props }, ref) => {
        const filled = checked === true || checked === "indeterminate";
        return (
            <button
                // Spread FIRST so the explicit props below still win, but the
                // caller's aria-label / aria-labelledby / data-* actually reach
                // the DOM. They did not before: this component dropped every
                // prop it did not name, so a YunUI checkbox could not be given
                // an accessible name at all — `<label>` does not work on a
                // button, and aria-label was silently discarded.
                {...props}
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
