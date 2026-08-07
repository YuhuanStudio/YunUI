import type { HTMLAttributes, ReactNode } from "react";
import { Quote } from "lucide-react";
import { cn } from "../lib/cn";

export interface PullQuoteProps extends HTMLAttributes<HTMLElement> {
    /** The quoted line — a manifesto, an ethos, a testimonial. */
    children: ReactNode;
    /** Attribution shown under the quote. */
    cite?: ReactNode;
    /** Show the leading quote glyph. @defaultValue true */
    showIcon?: boolean;
}

/**
 * A centered manifesto/pull-quote: a soft quote glyph over one large line of
 * display text that fades from `--foreground` into the muted tone.
 *
 * Extracted verbatim from Yunxin's Fellows manifesto block. The gradient text
 * is the whole point — a flat colour at this size reads as a heading, not a
 * statement — so it stays a `bg-clip-text` fade rather than a solid fill.
 */
export function PullQuote({
    children,
    cite,
    showIcon = true,
    className,
    ...props
}: PullQuoteProps) {
    return (
        <figure className={cn("mx-auto max-w-4xl text-center", className)} {...props}>
            {showIcon && (
                <Quote aria-hidden className="mx-auto mb-6 h-8 w-8 text-muted-foreground/30" />
            )}
            <blockquote className="bg-linear-to-r from-foreground to-muted-foreground/70 bg-clip-text text-2xl leading-snug font-semibold tracking-tight text-balance text-transparent md:text-3xl">
                {children}
            </blockquote>
            {cite != null && (
                <figcaption className="text-caption mt-6">{cite}</figcaption>
            )}
        </figure>
    );
}
