import * as React from 'react';
import { ReactNode } from 'react';

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

export { DiscordIcon as D, Footer as F, GithubIcon as G, InstagramIcon as I, type FooterLink as a, type FooterProps as b, type FooterSection as c, type FooterSocial as d };
