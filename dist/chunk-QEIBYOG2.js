"use client";
import { useYunUI } from './chunk-3RT24MSH.js';
import { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomOut, ZoomIn, RotateCw, Download, X } from 'lucide-react';
import { jsxs, jsx } from 'react/jsx-runtime';

function useContentT() {
  const t = useYunUI().useT("content");
  return useCallback(
    (key, fallback) => {
      try {
        const value = t(key);
        if (!value || value === key || value.endsWith(`.${key}`)) return fallback;
        return value;
      } catch {
        return fallback;
      }
    },
    [t]
  );
}
function ImageLightbox({ src, alt = "", isOpen, onClose, children }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = useContentT();
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          setScale((s) => Math.min(s + 0.25, 3));
          break;
        case "-":
          setScale((s) => Math.max(s - 0.25, 0.5));
          break;
        case "r":
        case "R":
          setRotation((r) => (r + 90) % 360);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleDownload = async () => {
    if (!src) return;
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
    }
  };
  if (!mounted || !isOpen) return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        onClick: onClose,
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/90 backdrop-blur-sm" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2 z-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleZoomOut();
                },
                className: "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors",
                title: `${t("zoomOut", "Zoom out")} (-)`,
                children: /* @__PURE__ */ jsx(ZoomOut, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-white text-sm min-w-15 text-center", children: [
              Math.round(scale * 100),
              "%"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleZoomIn();
                },
                className: "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors",
                title: `${t("zoomIn", "Zoom in")} (+)`,
                children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleRotate();
                },
                className: "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors",
                title: `${t("rotate", "Rotate")} (R)`,
                children: /* @__PURE__ */ jsx(RotateCw, { className: "w-5 h-5" })
              }
            ),
            src && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleDownload();
                },
                className: "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors",
                title: t("download", "Download"),
                children: /* @__PURE__ */ jsx(Download, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2",
                title: `${t("close", "Close")} (Esc)`,
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          children ? /* @__PURE__ */ jsx(
            "div",
            {
              onClick: (e) => e.stopPropagation(),
              className: "max-w-[92vw] max-h-[90vh] overflow-auto transition-transform duration-200 cursor-default",
              style: { transform: `scale(${scale}) rotate(${rotation}deg)` },
              children
            }
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            /* @__PURE__ */ jsx(
              "img",
              {
                src,
                alt,
                onClick: (e) => e.stopPropagation(),
                className: "max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 cursor-default",
                style: { transform: `scale(${scale}) rotate(${rotation}deg)` }
              }
            )
          ),
          alt && /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm", children: alt })
        ]
      }
    ),
    document.body
  );
}

export { ImageLightbox, useContentT };
//# sourceMappingURL=chunk-QEIBYOG2.js.map
//# sourceMappingURL=chunk-QEIBYOG2.js.map