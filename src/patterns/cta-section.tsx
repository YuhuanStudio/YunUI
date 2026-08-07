import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface CTASectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Headline. */
    title: ReactNode;
    /** Supporting line under the headline. */
    body?: ReactNode;
    /** The call to action — a Button, or a pair of them. */
    actions?: ReactNode;
    /** Small label above the headline (an {@link Eyebrow}, a badge). */
    eyebrow?: ReactNode;
    /** Play the staggered entrance animation. @defaultValue true */
    animate?: boolean;
}

/**
 * The closing call-to-action band: a large rounded panel with a soft radial
 * wash blooming from its top edge, a headline, a line of copy and the action.
 *
 * Extracted from Yunxin, where the same panel closes both the landing page and
 * the Fellows page. The wash is an inline `radial-gradient` on `--accent-subtle`
 * rather than a utility class because it needs a precise ellipse origin.
 */
export function CTASection({
    title,
    body,
    actions,
    eyebrow,
    animate = true,
    className,
    ...props
}: CTASectionProps) {
    const enter = animate ? "animate-enter" : undefined;
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-border p-12 text-center md:p-16",
                className,
            )}
            {...props}
        >
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(70% 120% at 50% 0%, var(--accent-subtle), transparent 70%)",
                }}
            />
            {eyebrow != null && <div className={cn("mb-4", enter)}>{eyebrow}</div>}
            <h2 className={cn("heading-xl mb-4 text-balance", enter)}>{title}</h2>
            {body != null && (
                <p
                    className={cn("text-body mx-auto mb-8 max-w-xl text-lg text-pretty", enter)}
                    style={animate ? { animationDelay: "100ms" } : undefined}
                >
                    {body}
                </p>
            )}
            {actions != null && (
                <div
                    className={cn("flex flex-wrap items-center justify-center gap-3", enter)}
                    style={animate ? { animationDelay: "200ms" } : undefined}
                >
                    {actions}
                </div>
            )}
        </div>
    );
}
