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
var defaultUseT = () => (key) => key;
var DEFAULT_ADAPTERS = {
  Link: DefaultLink,
  Image: DefaultImage,
  useRouter: defaultUseRouter,
  useT: defaultUseT,
  iconBasePath: "/icons"
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
//# sourceMappingURL=chunk-T37N6OZA.js.map
//# sourceMappingURL=chunk-T37N6OZA.js.map