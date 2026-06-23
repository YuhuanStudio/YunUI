"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps {
    /** Whether the box is checked (controlled). */
    checked: boolean;
    /** Called with the next checked state when toggled. */
    onCheckedChange: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}

/** Controlled checkbox rendered as an accessible toggle button with a check icon. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ checked, onCheckedChange, disabled = false, className = "", id }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                role="checkbox"
                aria-checked={checked}
                id={id}
                onClick={() => !disabled && onCheckedChange(!checked)}
                disabled={disabled}
                className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${checked
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-slate-300 dark:border-slate-600 bg-transparent hover:border-primary/50"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `}
            >
                {checked && <Check size={12} strokeWidth={3} />}
            </button>
        );
    }
);

Checkbox.displayName = "Checkbox";
