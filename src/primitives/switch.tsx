"use client";

import { forwardRef } from "react";

export interface SwitchProps {
    /** Whether the switch is on (controlled). */
    checked: boolean;
    /** Called with the next checked state when toggled. */
    onCheckedChange: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Size: `sm` (default) or `md`. */
    size?: "sm" | "md";
    /** Checked-state color: `default`, `success`, `warning`, or `danger`. */
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}

const sizeClasses = {
    sm: {
        track: "w-8 h-4",
        thumb: "w-2.5 h-2.5",
        thumbTranslate: "translate-x-3.5",
    },
    md: {
        track: "w-11 h-6",
        thumb: "w-4 h-4",
        thumbTranslate: "translate-x-5",
    },
};

const variantClasses = {
    default: {
        checkedTrack: "border-primary bg-primary/10",
        uncheckedTrack: "border-(--border-strong) bg-muted",
        checkedThumb: "bg-primary",
        uncheckedThumb: "bg-(--border-strong)",
    },
    success: {
        checkedTrack: "border-(--success) bg-success-soft",
        uncheckedTrack: "border-(--border-strong) bg-muted",
        checkedThumb: "bg-(--success)",
        uncheckedThumb: "bg-(--border-strong)",
    },
    warning: {
        checkedTrack: "border-(--warning) bg-warning-soft",
        uncheckedTrack: "border-(--border-strong) bg-muted",
        checkedThumb: "bg-(--warning)",
        uncheckedThumb: "bg-(--border-strong)",
    },
    danger: {
        checkedTrack: "border-(--error) bg-error-soft",
        uncheckedTrack: "border-(--border-strong) bg-muted",
        checkedThumb: "bg-(--error)",
        uncheckedThumb: "bg-(--border-strong)",
    },
};

/** Controlled on/off toggle rendered as an accessible switch button. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked, onCheckedChange, disabled = false, size = "sm", variant = "default", className = "", id }, ref) => {
        const sizeClass = sizeClasses[size];
        const variantClass = variantClasses[variant];

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={checked}
                id={id}
                onClick={() => !disabled && onCheckedChange(!checked)}
                disabled={disabled}
                className={`
                    ${sizeClass.track} rounded-full border-2 flex items-center px-0.5
                    transition-all duration-200 ease-in-out
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${checked ? variantClass.checkedTrack : variantClass.uncheckedTrack}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `}
            >
                <span
                    className={`
                        ${sizeClass.thumb} rounded-full transition-all duration-200 ease-in-out
                        ${checked ? variantClass.checkedThumb + " " + sizeClass.thumbTranslate : variantClass.uncheckedThumb + " translate-x-0"}
                        shadow-sm
                    `}
                />
            </button>
        );
    }
);

Switch.displayName = "Switch";
