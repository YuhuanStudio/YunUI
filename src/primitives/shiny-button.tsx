import { ArrowRight as ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

/** CTA button with an animated shimmer sweep and a trailing arrow; renders a Link when `href` is set. */
export function ShinyButton({
    children,
    className,
    href,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    /** When set, renders as a routing Link to this destination instead of a button. */
    href?: string;
    onClick?: () => void;
}) {
    const { Link } = useYunUI();
    const ButtonContent = (
        <div
            className={cn(
                "group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--text-primary) px-8 py-3 font-semibold text-background transition-all hover:ring-2 hover:ring-(--brand-primary) hover:ring-offset-2 hover:ring-offset-background",
                className
            )}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -z-10 block animate-shimmer bg-linear-to-r from-transparent via-(--text-primary)/10 to-transparent bg-size-[200%_100%]" />
        </div>
    );

    if (href) {
        return <Link href={href} onClick={onClick}>{ButtonContent}</Link>;
    }

    return <button onClick={onClick}>{ButtonContent}</button>;
}
