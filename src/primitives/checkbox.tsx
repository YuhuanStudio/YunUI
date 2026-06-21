"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
}

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
