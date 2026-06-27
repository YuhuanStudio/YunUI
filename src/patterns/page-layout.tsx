import { type ReactNode } from "react";
import { cn } from "../lib/cn";

// =====================================================
// PAGE LAYOUT
// The standard full-height marketing/page shell: a top navbar, a flex-1 main
// area offset to clear the fixed navbar, and a bottom footer. Navbar and footer
// are passed as slots (typically YunUI's <Navbar/> and <Footer/>), so the shell
// stays decoupled from their specific props. The `pt-28` default on <main>
// clears YunUI's fixed Navbar; override via `mainClassName` for a different bar.
// =====================================================

export interface PageLayoutProps {
    /** Page content, rendered inside `<main>`. */
    children: ReactNode;
    /** Top navigation slot — typically `<Navbar/>`. Rendered above `<main>`. */
    navbar?: ReactNode;
    /** Bottom slot — typically `<Footer/>`. Hidden when `hideFooter`. */
    footer?: ReactNode;
    /** Drop the footer (e.g. focused/app pages). */
    hideFooter?: boolean;
    /** Skip the default `bg-background` so a page can paint its own backdrop. */
    transparentBg?: boolean;
    /** Override the `<main>` classes — defaults to `flex-1 pt-28` (clears the
     *  fixed navbar). Pass your own offset for a taller/shorter bar. */
    mainClassName?: string;
    /** Extra classes on the outer wrapper. */
    className?: string;
}

/** Full-height page shell: navbar slot · offset `<main>` · footer slot. */
export function PageLayout({
    children,
    navbar,
    footer,
    hideFooter = false,
    transparentBg = false,
    mainClassName,
    className,
}: PageLayoutProps) {
    return (
        <div className={cn("min-h-dvh flex flex-col relative", !transparentBg && "bg-background", className)}>
            {navbar}
            <main className={cn("flex-1 pt-28", mainClassName)}>{children}</main>
            {!hideFooter && footer}
        </div>
    );
}
