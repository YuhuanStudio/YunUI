import type { HTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface MarketingHeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    /** Pill badge above the title — pass an {@link Eyebrow} or any node. */
    badge?: ReactNode;
    /** Headline. Wrap the part that should fade with {@link HeroAccent}. */
    title: ReactNode;
    /** Supporting paragraph. */
    subtitle?: ReactNode;
    /** Primary/secondary buttons. */
    actions?: ReactNode;
    /** Short reassurance chips under the actions ("Free to apply", "6 weeks"). */
    facts?: ReactNode[];
    /** Anchor the scroll-down chevron links to. Omit to hide the chevron. */
    scrollToId?: string;
    /** Accessible label for the scroll-down chevron. @defaultValue "Scroll down" */
    scrollLabel?: string;
    /** Fill the viewport (`min-h-dvh`). @defaultValue true */
    fullHeight?: boolean;
}

/**
 * The full-bleed landing hero: a soft radial wash, a pill badge, a large
 * two-tone headline, subcopy, the actions, a row of reassurance chips, and a
 * bouncing scroll-down chevron.
 *
 * Extracted from Yunxin, where the landing page and the Fellows page each
 * hand-rolled the identical block. Everything is a slot — YunUI owns the
 * geometry, the wash and the entrance stagger; the host owns every word.
 */
export function MarketingHero({
    badge,
    title,
    subtitle,
    actions,
    facts,
    scrollToId,
    scrollLabel = "Scroll down",
    fullHeight = true,
    className,
    ...props
}: MarketingHeroProps) {
    return (
        <section
            className={cn(
                "relative flex flex-col items-center justify-center px-6 pt-32 pb-28",
                fullHeight && "min-h-dvh",
                className,
            )}
            {...props}
        >
            {/* Ambient wash blooming from just above centre. Inline because the
                ellipse origin is precise; a utility can't express it. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(60% 50% at 50% 30%, var(--accent-subtle), transparent 70%)",
                }}
            />
            <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
                {badge != null && <div className="mb-8 animate-enter">{badge}</div>}
                <h1
                    className="mb-6 animate-enter text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
                    style={{ animationDelay: "100ms" }}
                >
                    {title}
                </h1>
                {subtitle != null && (
                    <p
                        className="mx-auto mb-10 max-w-2xl animate-enter text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl"
                        style={{ animationDelay: "300ms" }}
                    >
                        {subtitle}
                    </p>
                )}
                {actions != null && (
                    <div
                        className="flex animate-enter flex-col items-center justify-center gap-4 sm:flex-row"
                        style={{ animationDelay: "400ms" }}
                    >
                        {actions}
                    </div>
                )}
                {facts && facts.length > 0 && (
                    <div
                        className="mt-8 flex animate-enter flex-wrap items-center justify-center gap-2"
                        style={{ animationDelay: "500ms" }}
                    >
                        {facts.map((fact, i) => (
                            <span
                                key={i}
                                className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
                            >
                                {fact}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {scrollToId && (
                <a
                    href={`#${scrollToId}`}
                    aria-label={scrollLabel}
                    className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                    <ChevronDown className="h-5 w-5" />
                </a>
            )}
        </section>
    );
}

/**
 * The faded tail of a hero headline — wrap the second half of the title so it
 * washes from the foreground colour into the muted tone.
 */
export function HeroAccent({ children }: { children: ReactNode }) {
    return (
        <span className="bg-linear-to-r from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent">
            {children}
        </span>
    );
}
