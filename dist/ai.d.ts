import * as React from 'react';
import { ReactNode } from 'react';

interface ThinkingBlockProps {
    content: string;
    isStreaming?: boolean;
    defaultOpen?: boolean;
    /**
     * Render the reasoning content (e.g. with a Markdown renderer). Defaults to
     * plain pre-wrapped text so YunUI carries no markdown dependency.
     */
    renderContent?: (content: string) => ReactNode;
}
declare function ThinkingBlock({ content, isStreaming, defaultOpen, renderContent }: ThinkingBlockProps): React.JSX.Element;

interface ModelCardProps {
    name: string;
    /** Avatar slot — host renders the provider/model icon. */
    icon?: ReactNode;
    /** Primary id + aliases, shown as mono badges. */
    ids?: string[];
    description?: ReactNode;
    /** Capability keys (e.g. "vision", "thinking") → coloured icons. */
    capabilities?: string[];
    developer?: {
        label: string;
        iconUrl?: string;
    };
    /** e.g. "128K" or "1024×1024". */
    context?: string;
    /** Optional tier chip (e.g. "pro"). */
    tier?: string;
    /** Formatted price node, e.g. "$0.50/M". */
    price?: ReactNode;
    nonofficial?: boolean;
    suspended?: boolean;
    labels?: {
        nonofficial?: string;
        suspended?: string;
        noDescription?: string;
    };
    onClick?: () => void;
    className?: string;
}
declare function ModelCard({ name, icon, ids, description, capabilities, developer, context, tier, price, nonofficial, suspended, labels, onClick, className, }: ModelCardProps): React.JSX.Element;

/** Click-to-copy mono ID badge (faithful port of Yunxin's IDBadge). */
declare function IDBadge({ text, truncate }: {
    text: string;
    truncate?: boolean;
}): React.JSX.Element;

interface CapabilitySelectorProps {
    selected: string[];
    onChange: (capabilities: string[]) => void;
    disabled?: boolean;
    size?: "sm" | "md";
    columns?: 2 | 3 | 4;
    modelType?: string;
}
declare function CapabilitySelector({ selected, onChange, disabled, size, columns, modelType }: CapabilitySelectorProps): React.JSX.Element;

declare function getDeveloperIconPath(developer: string | null | undefined): string | null;
declare function getProviderIconOptions(): {
    value: string;
    label: string;
}[];
declare function normalizeProviderId(id: string): string;
declare function getIconPath(providerId: string): string | null;
interface ProviderIconProps {
    provider: string;
    className?: string;
    size?: number;
    rounded?: boolean;
    iconUrl?: string | null;
}
declare function ProviderIcon({ provider, className, size, rounded, iconUrl, }: ProviderIconProps): React.JSX.Element;
declare function ProviderAvatar({ provider, size, className, }: {
    provider: string;
    size?: number;
    className?: string;
}): React.JSX.Element;
declare const ProviderNames: Record<string, string>;
declare function getProviderName(providerId: string): string;
interface ModelIconProps {
    iconUrl?: string | null;
    developer?: string | null;
    provider: string;
    className?: string;
    size?: number;
    rounded?: boolean;
}
/**
 * ModelIcon component with priority system:
 * 1. Model's own icon_url (custom URL or path to /icons/models/)
 * 2. Developer's icon (from developerIconMap)
 * 3. Provider's icon (fallback)
 *
 * Uses state to track failures so React re-renders and falls through
 * to the next priority level when an image can't be loaded.
 */
declare function ModelIcon({ iconUrl, developer, provider, className, size, rounded, }: ModelIconProps): React.JSX.Element;
declare function ModelAvatar({ iconUrl, developer, provider, size, className, }: {
    iconUrl?: string | null;
    developer?: string | null;
    provider: string;
    size?: number;
    className?: string;
}): React.JSX.Element;

interface LanguageOption {
    value: string;
    label: string;
}
interface LanguageSwitcherProps {
    /** Available languages. The host app supplies these. */
    locales: LanguageOption[];
    /** Currently active locale value. */
    currentLocale: string;
    /** Called when the user picks a different locale. Host owns cookie/reload. */
    onChange: (locale: string) => void;
    /** Visual variant */
    variant?: "icon" | "pill";
    /** Dropdown alignment */
    align?: "left" | "right";
    /** Accessible label for the trigger. */
    label?: string;
    /** Disables the control while a change is in flight. */
    pending?: boolean;
    /** Additional className */
    className?: string;
}
declare function LanguageSwitcher({ locales, currentLocale, onChange, variant, align, label, pending, className, }: LanguageSwitcherProps): React.JSX.Element;

interface NavLink {
    href: string;
    label: string;
}
interface NavbarProps {
    /** Brand name shown next to the logo. */
    appName: string;
    /** Logo image src (default: /favicon.ico). */
    logoSrc?: string;
    /** Center navigation links. The host builds these from branding/flags/i18n. */
    links?: NavLink[];
    currentPath?: string;
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
    homeHref?: string;
    loginHref?: string;
    signupHref?: string;
}
declare function Navbar({ appName, logoSrc, links, currentPath, variant, labels, languageSwitcher, themeToggle, homeHref, loginHref, signupHref, }: NavbarProps): React.JSX.Element;

declare const GithubIcon: () => React.JSX.Element;
declare const InstagramIcon: () => React.JSX.Element;
declare const DiscordIcon: () => React.JSX.Element;
interface FooterLink {
    label: string;
    href: string;
}
interface FooterSection {
    title: string;
    links: FooterLink[];
}
interface FooterSocial {
    icon: ReactNode;
    href: string;
    label: string;
}
interface FooterProps {
    appName: string;
    logoSrc?: string;
    homeHref?: string;
    tagline?: string;
    sections?: FooterSection[];
    social?: FooterSocial[];
    /** Defaults to `© <year> <appName>. All rights reserved.` */
    copyright?: string;
}
declare function Footer({ appName, logoSrc, homeHref, tagline, sections, social, copyright, }: FooterProps): React.JSX.Element;

export { CapabilitySelector, DiscordIcon, Footer, type FooterLink, type FooterProps, type FooterSection, type FooterSocial, GithubIcon, IDBadge, InstagramIcon, type LanguageOption, LanguageSwitcher, ModelAvatar, ModelCard, type ModelCardProps, ModelIcon, type NavLink, Navbar, ProviderAvatar, ProviderIcon, ProviderNames, ThinkingBlock, getDeveloperIconPath, getIconPath, getProviderIconOptions, getProviderName, normalizeProviderId };
