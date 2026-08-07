"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "../lib/cn";
import { useYunUI } from "../adapters/context";

export interface ProseArticleProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    /**
     * Drop Tailwind Typography's `prose` classes on the inner wrapper.
     * Turn it off when the content already ships its own styles (e.g. YunUI's
     * `MarkdownRenderer`, which would then be styled twice).
     * @defaultValue true
     */
    prose?: boolean;
}

/**
 * The reading column for long-form pages — About, a blog post, a changelog.
 * A 3xl measure, centered, with the page's vertical rhythm.
 *
 * Extracted from Yunxin, where About and the blog post page each hand-rolled
 * the identical wrapper. `prose` is a prop because the two callers differ: MDX
 * bodies want Typography, `MarkdownRenderer` output does not (see the
 * double-styling note in the content docs).
 */
export function ProseArticle({ children, prose = true, className, ...props }: ProseArticleProps) {
    return (
        <article className={cn("mx-auto max-w-3xl px-6 py-16", className)} {...props}>
            {prose ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none">{children}</div>
            ) : (
                children
            )}
        </article>
    );
}

export interface BackLinkProps {
    /** Destination. */
    href: string;
    /** Link text — localize it yourself. */
    children: ReactNode;
    className?: string;
}

/**
 * The muted "‹ back to …" link above a detail page. Routes through the
 * {@link useYunUI} adapter, so it uses the host framework's Link.
 */
export function BackLink({ href, children, className }: BackLinkProps) {
    const { Link } = useYunUI();
    return (
        <Link
            href={href}
            className={cn(
                "mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
                className,
            )}
        >
            <ChevronLeft size={16} aria-hidden />
            {children}
        </Link>
    );
}
