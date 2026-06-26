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
                "row-span-1 glass-card p-6 flex flex-col justify-between space-y-4 group/bento overflow-hidden",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
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
