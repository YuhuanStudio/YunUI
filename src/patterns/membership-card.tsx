"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MembershipCardStat {
    /** The number, rendered in tabular figures so a row of them lines up. */
    value: ReactNode;
    /** Short caption under the number. */
    label: ReactNode;
}

export interface MembershipCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Programme name, top-left — e.g. "Yunxin Fellows". */
    brand?: ReactNode;
    /** Tier pill, top-right. */
    badge?: { label: ReactNode; icon?: ReactNode };
    /**
     * A large glyph bled off the bottom-right corner at 6% opacity. Pass a
     * lucide icon sized `w-48 h-48`; the component positions it.
     */
    watermark?: ReactNode;
    /** Small uppercase caption above the status line. */
    label?: ReactNode;
    /** The membership's headline state — "Active", "Renews in 12 days". */
    status?: ReactNode;
    /** Up to three figures along the bottom. */
    stats?: MembershipCardStat[];
    /** The little contactless-chip rectangle beside the status. @defaultValue true */
    chip?: boolean;
}

/**
 * A physical-feeling membership card: an inverted, lit surface with ambient
 * glows, a bled-off watermark, a light sweep on hover, and a row of figures.
 *
 * Extracted class for class from Yunxin's Fellows landing page, where it is the
 * tangible centrepiece of the pitch. **Yunxin is the original and stays the
 * reference** — a page that adopts this renders exactly what its local copy did.
 *
 * It is theme-adaptive rather than a fixed dark card: the surface is
 * `bg-foreground/80` with `text-background`, so it inverts with the theme and
 * stays striking in light *and* dark, matching the system's solid buttons.
 *
 * The outer element is `block` with `mx-auto`, not a flex child, so the
 * `aspect-[1.586/1]` box (the real credit-card ratio) cannot be stretched or
 * collapsed by a flex parent.
 */
export function MembershipCard({
    brand,
    badge,
    watermark,
    label,
    status,
    stats = [],
    chip = true,
    className,
    ...props
}: MembershipCardProps) {
    return (
        <div
            className={cn(
                "group relative w-full max-w-md mx-auto lg:mx-0 aspect-[1.586/1] min-h-56 rounded-[20px]",
                "bg-foreground/80 backdrop-blur-2xl border border-background/15 text-background",
                "shadow-2xl overflow-hidden select-none animate-enter",
                "transition-transform duration-300 hover:-translate-y-1",
                className,
            )}
            {...props}
        >
            {/* Soft ambient glows — a lit, dimensional surface rather than a
                panel with lines drawn on it. */}
            <div className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full bg-background/15 blur-3xl" />
            <div className="absolute -bottom-1/3 -right-1/4 w-1/2 h-2/3 rounded-full bg-background/8 blur-3xl" />

            {watermark != null && (
                <div aria-hidden className="absolute -right-8 -bottom-9 opacity-[0.06]">
                    {watermark}
                </div>
            )}

            {/* Light sweep on hover. */}
            <div className="pointer-events-none absolute top-0 -left-1/3 h-full w-1/3 -skew-x-12 bg-background/15 blur-xl translate-x-[-200%] group-hover:translate-x-[450%] transition-transform duration-[900ms] ease-out" />

            <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
                <div className="flex items-center justify-between">
                    {brand != null && (
                        <span className="text-sm font-semibold tracking-tight">{brand}</span>
                    )}
                    {badge != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/15 text-[11px] font-medium">
                            {badge.icon}
                            {badge.label}
                        </span>
                    )}
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div>
                        {label != null && (
                            <div className="text-[10px] uppercase tracking-[0.22em] opacity-50 mb-1.5">
                                {label}
                            </div>
                        )}
                        {status != null && (
                            <div className="text-lg font-medium leading-tight">{status}</div>
                        )}
                    </div>
                    {chip && (
                        <div className="hidden sm:block w-9 h-7 rounded-md bg-background/15 border border-background/10 shrink-0" />
                    )}
                </div>

                {stats.length > 0 && (
                    <div className="flex items-end gap-6">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div className="text-base font-semibold tabular-nums leading-none">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] opacity-50 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
