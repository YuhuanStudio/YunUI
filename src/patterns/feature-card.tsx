import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Glyph shown in the tinted icon tile above the title. */
    icon?: ReactNode;
    /** Feature name. */
    title: ReactNode;
    /** Supporting copy. */
    description?: ReactNode;
    /**
     * Stagger the entrance animation by this many milliseconds — pass
     * `index * 100` when mapping a grid. Omit to render without animation.
     */
    delay?: number;
    /** Extra content below the description (a link, a chip row). */
    children?: ReactNode;
}

/**
 * The marketing feature tile: a tinted icon block, a title, a line of copy, and
 * — the part that makes it feel considered — a hover that *glows* rather than
 * moves. A hairline catches the light along the top edge and a soft radial
 * bloom fades in at the corner while the card lifts a single pixel.
 *
 * This is the card that Yunxin's landing and Fellows pages repeat; it was
 * hand-rolled in both. Prefer it for uniform feature grids. {@link BentoCard} is
 * the sibling for asymmetric bento layouts — same hover language, glass surface.
 */
export function FeatureCard({
    icon,
    title,
    description,
    delay,
    children,
    className,
    style,
    ...props
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                "group relative h-full overflow-hidden rounded-2xl border border-border bg-card/50 p-8 shadow-sm backdrop-blur-xl",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                delay != null && "animate-enter",
                className,
            )}
            style={delay != null ? { animationDelay: `${delay}ms`, ...style } : style}
            {...props}
        >
            {/* Top hairline — a light catch along the upper edge. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
            />
            {/* Corner bloom — the "glow" on hover; purely decorative. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-foreground/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative">
                {icon && (
                    <div className="feature-icon mb-5 transition-transform duration-200 group-hover:scale-105">
                        {icon}
                    </div>
                )}
                <h3 className="heading-md mb-3">{title}</h3>
                {description != null && (
                    <p className="text-body leading-relaxed">{description}</p>
                )}
                {children}
            </div>
        </div>
    );
}
