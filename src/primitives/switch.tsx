"use client";

import { forwardRef } from "react";

export interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md";
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
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
        uncheckedTrack: "border-slate-300 dark:border-slate-600 bg-transparent",
        checkedThumb: "bg-primary",
        uncheckedThumb: "bg-slate-300 dark:bg-slate-600",
    },
    success: {
        checkedTrack: "border-emerald-500 bg-emerald-500/10",
        uncheckedTrack: "border-slate-300 dark:border-slate-600 bg-transparent",
        checkedThumb: "bg-emerald-500",
        uncheckedThumb: "bg-slate-300 dark:bg-slate-600",
    },
    warning: {
        checkedTrack: "border-amber-500 bg-amber-500/10",
        uncheckedTrack: "border-slate-300 dark:border-slate-600 bg-transparent",
        checkedThumb: "bg-amber-500",
        uncheckedThumb: "bg-slate-300 dark:bg-slate-600",
    },
    danger: {
        checkedTrack: "border-red-500 bg-red-500/10",
        uncheckedTrack: "border-slate-300 dark:border-slate-600 bg-transparent",
        checkedThumb: "bg-red-500",
        uncheckedThumb: "bg-slate-300 dark:bg-slate-600",
    },
};

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
