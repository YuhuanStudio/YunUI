"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../primitives/theme-toggle";
import { useYunUI } from "../adapters/context";

export interface NavLink {
    /** Destination href (supports `/#section` anchors for scroll-spy on the home page). */
    href: string;
    /** Link text. */
    label: string;
}

interface NavbarProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src (default: /favicon.ico). */
    logoSrc?: string;
    /** Center navigation links. The host builds these from branding/flags/i18n. */
    links?: NavLink[];
    /** Current route, used for active-link + scroll-spy. @defaultValue "/" */
    currentPath?: string;
    /** `public` (full nav + auth) or `minimal` (no links/auth). @defaultValue "public" */
    variant?: "public" | "minimal";
    /** Localized auth labels. */
    labels?: { signIn?: string; signUp?: string; menu?: string };
    /** Right-side control slots; the host injects the configured switcher. */
    languageSwitcher?: ReactNode;
    /** Defaults to YunUI's ThemeToggle. */
    themeToggle?: ReactNode;
    /** Where the logo links to. @defaultValue "/" */
    homeHref?: string;
    /** Sign-in link destination. @defaultValue "/login" */
    loginHref?: string;
    /** Sign-up link destination. @defaultValue "/signup" */
    signupHref?: string;
}

/** Floating top navigation bar: logo, center links with scroll-spy, theme/language slots, and auth buttons with a mobile menu. */
export function Navbar({
    appName,
    logoSrc = "/favicon.ico",
    links = [],
    currentPath = "/",
    variant = "public",
    labels,
    languageSwitcher,
    themeToggle,
    homeHref = "/",
    loginHref = "/login",
    signupHref = "/signup",
}: NavbarProps) {
    const { Link, Image } = useYunUI();
    const [scrollSection, setScrollSection] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState(false);

    const signIn = labels?.signIn ?? "Sign In";
    const signUp = labels?.signUp ?? "Sign Up";
    const menuLabel = labels?.menu ?? "Menu";

    // Clear scroll tracking when not on home page
    const activeSection = useMemo(() => {
        return currentPath === "/" ? scrollSection : "";
    }, [currentPath, scrollSection]);

    // Set up scroll tracking only on home page
    useEffect(() => {
        if (currentPath !== "/") return;

        const sections = document.querySelectorAll("section[id]");
        if (sections.length === 0) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150; // Offset for fixed navbar

            let currentSection = "";
            sections.forEach((section) => {
                const sectionTop = (section as HTMLElement).offsetTop;
                const sectionHeight = (section as HTMLElement).offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = `#${section.id}`;
                }
            });

            setScrollSection(currentSection);
        };

        handleScroll();

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [currentPath]);

    const isActive = (path: string) => {
        if (currentPath === path) return true;
        if (path.startsWith("/#")) {
            return currentPath === "/" && activeSection === path.slice(1);
        }
        return false;
    };

    return (
        <nav
            style={{ top: "max(1.5rem, env(safe-area-inset-top))" }}
            className="fixed left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 max-w-6xl w-[calc(100%-48px)] bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-md flex items-center justify-between"
        >
            {/* Logo */}
            <Link href={homeHref} className="flex items-center gap-2 min-w-0 rounded-lg px-2 py-1 -mx-2 hover:bg-foreground/5 transition-colors duration-200">
                <Image src={logoSrc} alt={appName} width={28} height={28} className="w-7 h-7 shrink-0" />
                <span className="font-semibold text-sm tracking-tight truncate">{appName}</span>
            </Link>

            {/* Nav Links */}
            {variant === "public" && (
                <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group relative px-2 lg:px-3 py-2 whitespace-nowrap min-w-15 text-center"
                        >
                            <span className={`text-sm relative z-10 ${isActive(link.href)
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                                }`}>
                                {link.label}
                            </span>
                            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-foreground rounded-full transition-all duration-200 yunui-accent-bg ${isActive(link.href) ? "w-8" : "w-0 group-hover:w-8"}`}></span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Right Side. On mobile the bar keeps only theme + hamburger; the
                language switcher and auth buttons move into the menu so the bar
                never overflows / truncates the brand on a phone. */}
            <div className="flex items-center gap-1.5 shrink-0">
                <span className="hidden md:flex items-center gap-1.5">{languageSwitcher}</span>
                {themeToggle ?? <ThemeToggle variant="pill" />}

                {/* Auth Buttons (desktop) */}
                {variant !== "minimal" && (
                    <>
                        <Link
                            href={loginHref}
                            className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 whitespace-nowrap min-w-15 text-center"
                        >
                            {signIn}
                        </Link>
                        <Link
                            href={signupHref}
                            className="hidden md:inline-block px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 hover:shadow-md transition-all duration-200 whitespace-nowrap min-w-20 text-center yunui-accent-bg yunui-accent-on"
                        >
                            {signUp}
                        </Link>
                    </>
                )}

                {/* Mobile menu toggle */}
                {variant === "public" && (
                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                        aria-label={menuLabel}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {/* Mobile menu */}
            {variant === "public" && menuOpen && (
                <>
                    <div className="md:hidden fixed inset-0 -z-10" aria-hidden="true" onClick={() => setMenuOpen(false)} />
                    <div className="md:hidden absolute top-full left-0 right-0 mt-3 p-2 bg-background/60 backdrop-blur-2xl border border-border rounded-2xl shadow-lg shadow-black/5 flex flex-col gap-0.5">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-foreground/5 ${isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="my-1 border-t border-border" />
                        {languageSwitcher && (
                            <div className="px-2 py-1.5">{languageSwitcher}</div>
                        )}
                        <Link
                            href={loginHref}
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-foreground/5"
                        >
                            {signIn}
                        </Link>
                        <Link
                            href={signupHref}
                            onClick={() => setMenuOpen(false)}
                            className="mt-0.5 px-4 py-2.5 rounded-xl text-sm font-medium text-center bg-foreground text-background hover:bg-foreground/90 transition-colors yunui-accent-bg yunui-accent-on"
                        >
                            {signUp}
                        </Link>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;
