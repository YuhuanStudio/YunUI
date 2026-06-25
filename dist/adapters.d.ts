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
    /**
     * Base URL/path under which the AI provider/model icon assets are served.
     * The library resolves icons to `<iconBasePath>/providers/*.png` and
     * `<iconBasePath>/models/*.png`.
     *
     * Defaults to the **bundled** icon set served via jsDelivr
     * (`https://cdn.jsdelivr.net/npm/@yuhuanowo/yunui@0.2/icons`), so provider/
     * model icons work with zero setup. To self-host — and to extend with your own
     * icons — copy the package's `icons/` (or this repo's `site/public/icons`)
     * into your app and point this at it (`/icons`, `/assets/icons`, a CDN, …).
     *
     * next/image consumers: either self-host, or allow `cdn.jsdelivr.net` in
     * `images.remotePatterns`.
     */
    iconBasePath: string;
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
