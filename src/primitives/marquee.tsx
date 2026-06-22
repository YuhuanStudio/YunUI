import { cn } from "../lib/cn";

/** Infinitely scrolling row (or column) that repeats its children; supports reverse direction and pause-on-hover. */
export function Marquee({
    className,
    reverse,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: {
    className?: string;
    /** Scroll in the opposite direction. */
    reverse?: boolean;
    /** Pause the animation while hovered. */
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    /** Scroll vertically instead of horizontally. */
    vertical?: boolean;
    /** How many times to repeat the children to fill the loop. @defaultValue 4 */
    repeat?: number;
    [key: string]: unknown;
}) {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-(--gap)",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn("flex shrink-0 justify-around gap-(--gap)", {
                            "animate-marquee flex-row": !vertical,
                            "animate-marquee-vertical flex-col": vertical,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                            "[animation-direction:reverse]": reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
