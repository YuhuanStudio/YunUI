import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLDivElement> {
    /** Small leading glyph, e.g. a lucide icon at `w-4 h-4`. */
    icon?: ReactNode;
    /** The label text. */
    children: ReactNode;
}

/**
 * The pill badge that sits above a marketing section title — a tinted, hairline
 * capsule holding an icon and a short label ("Why YunUI", "功能特性").
 *
 * Pulled out on its own because it appears far away from any heading too:
 * above a hero title, inside a CTA band, as a "trusted by" chip.
 */
export function Eyebrow({ icon, children, className, ...props }: EyebrowProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full border border-(--accent-muted) bg-(--accent-subtle) px-3 py-1",
                className,
            )}
            {...props}
        >
            {icon}
            <span className="text-xs font-medium">{children}</span>
        </div>
    );
}

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Eyebrow label above the title. Omit for a bare heading. */
    badge?: ReactNode;
    /** Glyph inside the eyebrow pill. */
    icon?: ReactNode;
    /** The section title. */
    title: ReactNode;
    /** Supporting line under the title. */
    subtitle?: ReactNode;
    /** Horizontal alignment. @defaultValue "center" */
    align?: "center" | "left";
    /**
     * Play the entrance animation, staggering badge → title → subtitle.
     * Turn it off for headings that are already visible on load.
     * @defaultValue true
     */
    animate?: boolean;
}

/**
 * The centered pill-badge → title → subcopy rhythm that sits above every
 * marketing band (landing page, Fellows, docs index).
 *
 * This exact block was hand-rolled in Yunxin's landing, Yunxin's Fellows page
 * AND YunUI's own showcase site — three copies of the same eight lines, each
 * re-deriving the stagger delays. It lives here now so every surface inherits
 * the same rhythm instead of drifting apart.
 */
export function SectionHeading({
    badge,
    icon,
    title,
    subtitle,
    align = "center",
    animate = true,
    className,
    ...props
}: SectionHeadingProps) {
    // The stagger is the detail that makes the block feel considered; keeping it
    // here is the whole point of extracting the component.
    const enter = animate ? "animate-enter" : undefined;
    return (
        <div
            className={cn("mb-16", align === "center" ? "text-center" : "text-left", className)}
            {...props}
        >
            {badge != null && (
                <Eyebrow icon={icon} className={cn("mb-4", enter)}>
                    {badge}
                </Eyebrow>
            )}
            {/* text-balance / text-pretty: the typographic detail that keeps a
                two-line title from stranding one word, and the subcopy from
                leaving a widow. Carried over from Yunxin verbatim. */}
            <h2
                className={cn("heading-xl mb-4 text-balance", enter)}
                style={animate ? { animationDelay: "100ms" } : undefined}
            >
                {title}
            </h2>
            {subtitle != null && (
                <p
                    className={cn(
                        "text-body text-lg text-pretty",
                        align === "center" && "mx-auto max-w-2xl",
                        enter,
                    )}
                    style={animate ? { animationDelay: "200ms" } : undefined}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
