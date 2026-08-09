"use client";

import { type ReactNode } from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "../lib/cn";

// =====================================================
// BANNER
// A tinted, horizontal banner row for dashboard headers / home: a tone-colored
// gradient card with an icon, a title + optional inline description, optional
// meta (e.g. a timestamp), an actions slot, and an optional dismiss button.
// Covers announcement / release / verification-style banners. Presentation only
// — the host owns fetch / dismiss persistence / copy.
// (For a stacked, solid form-message box use the `Alert` primitive instead.)
// =====================================================

export type BannerTone = "info" | "warning" | "critical" | "success" | "neutral";

const TONES: Record<BannerTone, { bg: string; border: string; text: string; icon: string; dismissHover: string; defaultIcon: ReactNode }> = {
    // Token-driven, matching Alert/Badge: the raw `blue/amber/red/green-500`
    // palette these used to carry is not the same colour as `--info`/`--warning`/
    // `--error`/`--success`, so a Banner and an Alert reading the same severity
    // rendered as two different hues and neither followed a brand theme.
    info: {
        bg: "bg-info-soft",
        border: "border-info-soft",
        text: "text-info",
        icon: "text-info",
        dismissHover: "hover:bg-info-soft",
        defaultIcon: <Info size={16} />,
    },
    warning: {
        bg: "bg-warning-soft",
        border: "border-warning-soft",
        text: "text-warning",
        icon: "text-warning",
        dismissHover: "hover:bg-warning-soft",
        defaultIcon: <AlertTriangle size={16} />,
    },
    critical: {
        bg: "bg-error-soft",
        border: "border-error-soft",
        text: "text-error",
        icon: "text-error",
        dismissHover: "hover:bg-error-soft",
        defaultIcon: <AlertCircle size={16} />,
    },
    success: {
        bg: "bg-success-soft",
        border: "border-success-soft",
        text: "text-success",
        icon: "text-success",
        dismissHover: "hover:bg-success-soft",
        defaultIcon: <CheckCircle2 size={16} />,
    },
    neutral: {
        bg: "bg-muted/40",
        border: "border-border",
        text: "text-foreground",
        icon: "text-muted-foreground",
        dismissHover: "hover:bg-muted",
        defaultIcon: <Info size={16} />,
    },
};

export interface BannerProps {
    /** Tone — drives the gradient, border, text and icon color. */
    tone?: BannerTone;
    /** Leading icon; defaults to a tone-appropriate glyph (pass `null` to omit). */
    icon?: ReactNode;
    /** The banner headline. */
    title: ReactNode;
    /** Secondary text shown inline after the title (hidden on mobile). */
    description?: ReactNode;
    /** Small right-aligned meta (e.g. a relative timestamp). */
    meta?: ReactNode;
    /** Trailing actions — links or buttons. */
    actions?: ReactNode;
    /** Show a dismiss (✕) button. */
    dismissible?: boolean;
    onDismiss?: () => void;
    dismissLabel?: string;
    className?: string;
}

export function Banner({
    tone = "info",
    icon,
    title,
    description,
    meta,
    actions,
    dismissible,
    onDismiss,
    dismissLabel,
    className,
}: BannerProps) {
    const t = TONES[tone];
    const resolvedIcon = icon === undefined ? t.defaultIcon : icon;

    return (
        <div className={cn("card", t.bg, t.border, className)}>
            <div className="flex items-center gap-3 px-4 py-2.5">
                {resolvedIcon != null && <span className={cn("shrink-0", t.icon)} aria-hidden="true">{resolvedIcon}</span>}
                <div className="flex-1 min-w-0">
                    <span className={cn("text-sm font-medium", t.text)}>{title}</span>
                    {description && (
                        <span className={cn("text-sm ml-2 hidden sm:inline opacity-70", t.text)}>{description}</span>
                    )}
                </div>
                {meta != null && <span className="text-[10px] text-muted-foreground shrink-0">{meta}</span>}
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
                {dismissible && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        aria-label={dismissLabel}
                        className={cn("p-1 rounded-lg transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring", t.dismissHover)}
                    >
                        <X size={14} className="text-muted-foreground/70" />
                    </button>
                )}
            </div>
        </div>
    );
}
