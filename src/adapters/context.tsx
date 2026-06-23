"use client";

import * as React from "react";

/**
 * Adapter layer — lets framework-coupled primitives (routing, images, i18n)
 * run in any host app. Consumers inject their framework's implementations via
 * <YunUIProvider>; without it, zero-dependency defaults are used.
 */

export interface YunUILinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: React.ReactNode;
}

export interface YunUIImageProps {
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

export interface YunUIRouter {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
}

export type TranslateFn = (key: string, vars?: Record<string, unknown>) => string;
export type TranslateFactory = (namespace?: string) => TranslateFn;

export interface YunUIAdapters {
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

// ---- defaults -------------------------------------------------------------

const DefaultLink: React.FC<YunUILinkProps> = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

const DefaultImage: React.FC<YunUIImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  onError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unoptimized: _unoptimized,
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    style={style}
    onError={onError}
  />
);

function defaultUseRouter(): YunUIRouter {
  return {
    push: (href) => {
      if (typeof window !== "undefined") window.location.href = href;
    },
    replace: (href) => {
      if (typeof window !== "undefined") window.location.replace(href);
    },
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
  };
}

/** Identity translator: returns the key. Consumers inject real i18n. */
const defaultUseT: TranslateFactory = () => (key) => key;

export const DEFAULT_ADAPTERS: YunUIAdapters = {
  Link: DefaultLink,
  Image: DefaultImage,
  useRouter: defaultUseRouter,
  useT: defaultUseT,
  // Bundled icons via jsDelivr — zero-setup default. Override to self-host/extend.
  // Pinned to the 0.2.x line (jsDelivr resolves @0.2 to the latest 0.2.x); bump
  // this when the major/minor moves (see CLAUDE.md versioning policy).
  iconBasePath: "https://cdn.jsdelivr.net/npm/@yuhuanowo/yunui@0.2/icons",
};

// ---- context --------------------------------------------------------------

export const YunUIContext = React.createContext<YunUIAdapters>(DEFAULT_ADAPTERS);

export interface YunUIProviderProps {
  /** Partial overrides; unspecified adapters fall back to defaults. */
  adapters?: Partial<YunUIAdapters>;
  children: React.ReactNode;
}

export function YunUIProvider({ adapters, children }: YunUIProviderProps) {
  const value = React.useMemo<YunUIAdapters>(
    () => ({ ...DEFAULT_ADAPTERS, ...adapters }),
    [adapters]
  );
  return <YunUIContext.Provider value={value}>{children}</YunUIContext.Provider>;
}

export function useYunUI(): YunUIAdapters {
  return React.useContext(YunUIContext);
}
