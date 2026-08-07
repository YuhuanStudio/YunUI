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
                // The house hover: a quiet lift and a deeper shadow. Content stays
                // put — sliding the text sideways (the stock bento-grid trick) reads
                // as jitter and is not YunUI's language.
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                className
            )}
        >
            {/* Top hairline — catches the light along the card's upper edge. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
            />
            {/* Corner glow — fades in on hover; the "發亮" the design leans on. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-foreground/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100"
            />
            {header}
            <div className="relative">
                <div className="mb-2 text-[var(--text-primary)] transition-transform duration-200 group-hover/bento:scale-105 origin-left w-fit">
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
