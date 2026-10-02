import * as React from 'react';
import { ReactNode } from 'react';

interface NavLink {
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
    labels?: {
        signIn?: string;
        signUp?: string;
        menu?: string;
    };
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
    /**
     * Signed-in account control — pass an `AccountMenu`. When present it
     * REPLACES the sign in / sign up buttons (desktop and mobile), so a reader
     * who is already signed in sees their avatar rather than an invitation to
     * sign in again.
     */
    account?: ReactNode;
    /**
     * Replaces the logo + wordmark block entirely. Pass a mark-only logo, a
     * custom lockup, anything — it is still wrapped in the link to `homeHref`.
     * Without this, a brand that is a single glyph had to be faked through
     * `logoSrc`/`appName`, which is why YunUI's own site and YunNEWS each kept
     * a private copy of this bar.
     */
    brand?: ReactNode;
    /**
     * Extra controls in the right-hand cluster, before the language/theme
     * pills — a GitHub link, a search button. Desktop only, matching the rest
     * of that cluster; put the mobile equivalent in `mobileMenuHeader`.
     */
    actions?: ReactNode;
    /** Rendered at the TOP of the mobile menu, above the links. */
    mobileMenuHeader?: ReactNode;
    /**
     * The bottom region of the mobile menu, under the divider. Passing this
     * REPLACES the automatic `languageSwitcher` row there — so a host that
     * wants the language pill alongside something else (a GitHub link, a
     * status chip) lays that row out itself instead of getting two rows.
     * Leave it off and the language row appears on its own, as before.
     */
    mobileMenuFooter?: ReactNode;
    /**
     * Accessible name for the `<nav>` landmark. A page with more than one nav
     * needs each one named, or a screen reader offers several identical
     * "navigation" regions.
     */
    label?: string;
    /** Extra classes on the `<nav>` element. */
    className?: string;
}
/** Floating top navigation bar: logo, center links with scroll-spy, theme/language slots, and auth buttons with a mobile menu. */
declare function Navbar({ appName, logoSrc, links, currentPath, variant, labels, languageSwitcher, themeToggle, homeHref, loginHref, signupHref, account, brand, actions, mobileMenuHeader, mobileMenuFooter, label, className, }: NavbarProps): React.JSX.Element;

declare const GithubIcon: () => React.JSX.Element;
declare const InstagramIcon: () => React.JSX.Element;
declare const DiscordIcon: () => React.JSX.Element;
interface FooterLink {
    /** Link text. */
    label: string;
    /** Destination href. */
    href: string;
}
interface FooterSection {
    /** Column heading. */
    title: string;
    /** Links in this column. */
    links: FooterLink[];
}
interface FooterSocial {
    /** Icon to render (e.g. {@link GithubIcon}). */
    icon: ReactNode;
    /** Destination href (external links open in a new tab). */
    href: string;
    /** Accessible label for the link. */
    label: string;
}
interface FooterProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src. @defaultValue "/favicon.ico" */
    logoSrc?: string;
    /** Where the logo links to. @defaultValue "/" */
    homeHref?: string;
    /** Short brand tagline under the logo. */
    tagline?: string;
    /** Link columns. */
    sections?: FooterSection[];
    /** Social/icon links shown in the bottom bar. */
    social?: FooterSocial[];
    /** Defaults to `© <year> <appName>. All rights reserved.` */
    copyright?: string;
}
/** Site footer: brand block, link columns, copyright line, and social icons. */
declare function Footer({ appName, logoSrc, homeHref, tagline, sections, social, copyright, }: FooterProps): React.JSX.Element;

export { DiscordIcon as D, Footer as F, GithubIcon as G, InstagramIcon as I, type NavLink as N, type FooterLink as a, type FooterProps as b, type FooterSection as c, type FooterSocial as d, Navbar as e };
