import * as React from 'react';

/**
 * Adapter layer — lets framework-coupled primitives (routing, images, i18n)
 * run in any host app. Consumers inject their framework's implementations via
 * <YunUIProvider>; without it, zero-dependency defaults are used.
 */
interface YunUILinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: string;
    children?: React.ReactNode;
}
interface YunUIImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    /** Honored by next/image; ignored by the default <img>. */
    unoptimized?: boolean;
    /** Fired when the image fails to load (used for icon fallbacks). */
    onError?: () => void;
}
interface YunUIRouter {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
}
type TranslateFn = (key: string, vars?: Record<string, unknown>) => string;
type TranslateFactory = (namespace?: string) => TranslateFn;
interface YunUIAdapters {
    Link: React.ComponentType<YunUILinkProps>;
    Image: React.ComponentType<YunUIImageProps>;
    useRouter: () => YunUIRouter;
    useT: TranslateFactory;
}
declare const YunUIContext: React.Context<YunUIAdapters>;
interface YunUIProviderProps {
    /** Partial overrides; unspecified adapters fall back to defaults. */
    adapters?: Partial<YunUIAdapters>;
    children: React.ReactNode;
}
declare function YunUIProvider({ adapters, children }: YunUIProviderProps): React.JSX.Element;
declare function useYunUI(): YunUIAdapters;

export { type TranslateFactory, type TranslateFn, type YunUIAdapters, YunUIContext, type YunUIImageProps, type YunUILinkProps, YunUIProvider, type YunUIRouter, useYunUI };
