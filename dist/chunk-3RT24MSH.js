"use client";
import * as React from 'react';
import { jsx } from 'react/jsx-runtime';

// src/adapters/context.tsx
var DefaultLink = ({ href, children, ...rest }) => /* @__PURE__ */ jsx("a", { href, ...rest, children });
var DefaultImage = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  onError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unoptimized: _unoptimized
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      width,
      height,
      className,
      style,
      onError
    }
  )
);
function defaultUseRouter() {
  return {
    push: (href) => {
      if (typeof window !== "undefined") window.location.href = href;
    },
    replace: (href) => {
      if (typeof window !== "undefined") window.location.replace(href);
    },
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    }
  };
}
var identityTranslate = (key) => key;
var defaultUseT = () => identityTranslate;
var DEFAULT_ADAPTERS = {
  Link: DefaultLink,
  Image: DefaultImage,
  useRouter: defaultUseRouter,
  useT: defaultUseT,
  // Bundled icons via jsDelivr — zero-setup default. Override to self-host/extend.
  // Pinned to the 0.2.x line (jsDelivr resolves @0.2 to the latest 0.2.x); bump
  // this when the major/minor moves (see CLAUDE.md versioning policy).
  iconBasePath: "https://cdn.jsdelivr.net/npm/@yuhuanowo/yunui@0.2/icons"
};
var YunUIContext = React.createContext(DEFAULT_ADAPTERS);
function YunUIProvider({ adapters, children }) {
  const value = React.useMemo(
    () => ({ ...DEFAULT_ADAPTERS, ...adapters }),
    [adapters]
  );
  return /* @__PURE__ */ jsx(YunUIContext.Provider, { value, children });
}
function useYunUI() {
  return React.useContext(YunUIContext);
}

export { YunUIContext, YunUIProvider, useYunUI };
//# sourceMappingURL=chunk-3RT24MSH.js.map
//# sourceMappingURL=chunk-3RT24MSH.js.map