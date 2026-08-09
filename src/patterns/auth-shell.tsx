"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

export interface AuthShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * Brand row above the card — the logo + wordmark. Rendered inside a
     * centered flex row; pass the image and the name as siblings.
     */
    brand?: ReactNode;
    /** When set, the brand row becomes a link to this destination (usually "/"). */
    homeHref?: string;
    /** Card heading. */
    title?: ReactNode;
    /** Optional line under the heading. */
    subtitle?: ReactNode;
    /**
     * A block above the form for a failed submit — rendered in the soft-error
     * box these screens all use. Falsy values render nothing.
     */
    error?: ReactNode;
    /** Optional medallion / spinner above the heading, centered. */
    icon?: ReactNode;
    /** The form (or whatever the screen is for). */
    children: ReactNode;
    /** Content under the card — "Don't have an account?", legal links. */
    footer?: ReactNode;
    /** Centers everything in the card — for confirmation and status screens. */
    centered?: boolean;
    /**
     * Width of the column. `sm` suits a sign-in form; `md` suits the wider
     * error / not-found screens. @defaultValue "sm"
     */
    width?: "sm" | "md";
    /** Extra classes on the card box itself (the wrapper takes `className`). */
    cardClassName?: string;
}

/**
 * The centered single-column screen every auth flow uses: sign in, sign up,
 * forgot/reset password, verify email, resend verification, OAuth callback.
 *
 * Yunxin hand-rolls this shell **nine times** — each copy re-deriving the
 * viewport centring, the column width, the brand row spacing and the card
 * chrome. This is a straight extraction of that markup, class for class:
 * Yunxin is the original and stays the reference, so a screen that adopts
 * `AuthShell` renders identically to the copy it replaces.
 *
 * That is why the panel is `p-6 bg-card border border-border rounded-xl` and
 * NOT the house `.card` class — `.card` is a 20px radius with a shadow and a
 * hover transition, so swapping it in would have quietly restyled all nine
 * screens. Only the parts that are identical in every copy live here; whatever
 * varies (medallions, spinners, per-screen copy) stays in `children`.
 */
export function AuthShell({
    brand,
    homeHref,
    title,
    subtitle,
    error,
    icon,
    children,
    footer,
    centered = false,
    width = "sm",
    className,
    cardClassName,
    ...props
}: AuthShellProps) {
    const { Link } = useYunUI();
    const brandRowClass = "flex items-center justify-center gap-2.5 mb-8";

    return (
        <div
            className={cn(
                "min-h-dvh bg-background flex items-center justify-center px-6",
                className,
            )}
            {...props}
        >
            <div className={cn("w-full", width === "sm" ? "max-w-sm" : "max-w-md")}>
                {brand != null &&
                    (homeHref ? (
                        <Link href={homeHref} className={brandRowClass}>
                            {brand}
                        </Link>
                    ) : (
                        <div className={brandRowClass}>{brand}</div>
                    ))}

                <div
                    className={cn(
                        "p-6 bg-card border border-border rounded-xl",
                        centered && "text-center",
                        cardClassName,
                    )}
                >
                    {icon != null && <div className="flex justify-center mb-4">{icon}</div>}

                    {title != null && (
                        <h1
                            className={cn(
                                "text-xl font-semibold text-center",
                                subtitle != null ? "mb-2" : "mb-6",
                            )}
                        >
                            {title}
                        </h1>
                    )}

                    {subtitle != null && (
                        <p className="text-muted-foreground text-sm text-center mb-6">{subtitle}</p>
                    )}

                    {error ? (
                        <div className="mb-4 p-3 bg-error-soft text-error text-sm rounded-lg border border-error-soft">
                            {error}
                        </div>
                    ) : null}

                    {children}
                </div>

                {footer != null && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
                )}
            </div>
        </div>
    );
}
