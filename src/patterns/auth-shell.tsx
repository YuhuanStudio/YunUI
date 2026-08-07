import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface AuthShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Brand row above the card — usually a logo + wordmark linking home. */
    brand?: ReactNode;
    /** Card heading, centered. */
    title?: ReactNode;
    /** Optional line under the heading. */
    subtitle?: ReactNode;
    /** The form (or whatever the screen is for). */
    children: ReactNode;
    /** Content under the card — "Don't have an account?", legal links. */
    footer?: ReactNode;
    /**
     * Width of the column. `sm` suits a sign-in form; `md` suits screens with
     * more to say (verification, callbacks). @defaultValue "sm"
     */
    width?: "sm" | "md";
}

/**
 * The centered single-column screen every auth flow uses: sign in, sign up,
 * forgot/reset password, verify email, resend verification, OAuth callback.
 *
 * Yunxin hand-rolled this shell **fifteen times** — each copy re-deriving the
 * viewport centring, the column width, the brand row spacing and the card
 * chrome. Extracted so those screens stop drifting apart.
 *
 * The panel uses the house `.card` rather than the ad-hoc
 * `bg-card border rounded-xl` those copies carried, so an auth screen matches
 * every other surface in the system.
 */
export function AuthShell({
    brand,
    title,
    subtitle,
    children,
    footer,
    width = "sm",
    className,
    ...props
}: AuthShellProps) {
    return (
        <div
            className={cn(
                "flex min-h-dvh items-center justify-center bg-background px-6",
                className,
            )}
            {...props}
        >
            <div className={cn("w-full", width === "sm" ? "max-w-sm" : "max-w-md")}>
                {brand != null && <div className="mb-8 flex justify-center">{brand}</div>}
                <div className="card p-6">
                    {title != null && (
                        <h1 className="mb-2 text-center text-xl font-semibold">{title}</h1>
                    )}
                    {subtitle != null && (
                        <p className="text-caption mb-6 text-center">{subtitle}</p>
                    )}
                    <div className={cn(title != null && subtitle == null && "mt-4")}>{children}</div>
                </div>
                {footer != null && (
                    <div className="text-caption mt-6 text-center">{footer}</div>
                )}
            </div>
        </div>
    );
}
