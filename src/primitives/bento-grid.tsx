import { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Responsive bento-style grid container for BentoCard children. */
export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

/** A glass card tile for use inside a BentoGrid, with a header slot, icon, title, and description. */
export const BentoCard = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    /** Card title. */
    title?: string | ReactNode;
    /** Card body text. */
    description?: string | ReactNode;
    /** Top media/visual slot above the icon and text. */
    header?: ReactNode;
    /** Icon shown above the title. */
    icon?: ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 glass-card relative p-6 flex flex-col justify-between space-y-4 group/bento overflow-hidden",
                // The house hover, matching `.card-interactive`: a single-pixel
                // lift and one step up the shadow ramp. Content stays put —
                // sliding or scaling it (the stock bento-grid trick this card
                // used to carry) reads as jitter and matches nothing else here.
                // The richer glow treatment belongs to `FeatureCard`, which is a
                // faithful extraction of Yunxin's marketing tile; keeping it out
                // of here stops the two from competing.
                "transition-all duration-150 hover:-translate-y-px hover:shadow-md",
                className
            )}
        >
            {/* Top hairline — catches the light along the card's upper edge. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
            />
            {header}
            <div className="relative">
                <div className="mb-2 text-[var(--text-primary)]">
                    {icon}
                </div>
                <div className="font-semibold text-[var(--text-primary)] text-lg mb-2 mt-2">
                    {title}
                </div>
                <div className="font-normal text-[var(--text-secondary)] text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
