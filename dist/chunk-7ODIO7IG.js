"use client";
import { useBodyScrollLock } from './chunk-ALP6SDRA.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import { useCallback, useState, useMemo, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ZoomOut, ZoomIn, RotateCw, Download, X } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

function useContentT() {
  const t = useYunUI().useT("content");
  return useCallback(
    (key, fallback, vars) => {
      try {
        const value = t(key, vars);
        if (!value || value === key || value.endsWith(`.${key}`)) return fallback;
        return value;
      } catch {
        return fallback;
      }
    },
    [t]
  );
}
function ImageLightbox({ src, alt = "", label, isOpen, onClose, children }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = useContentT();
  const opener = useMemo(
    () => isOpen && mounted ? document.activeElement : null,
    [isOpen, mounted]
  );
  const dialogName = label ?? (alt || t("imagePreview", "Image preview"));
  useBodyScrollLock(isOpen && mounted);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
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
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
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
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { open: isOpen, onOpenChange: (open) => {
    if (!open) onClose();
  }, children: /* @__PURE__ */ jsx(DialogPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": dialogName,
      "aria-describedby": void 0,
      onCloseAutoFocus: (event) => {
        event.preventDefault();
        opener?.focus();
      },
      tabIndex: -1,
      className: "fixed inset-0 z-50 flex items-center justify-center outline-none",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx(DialogPrimitive.Title, { className: "sr-only", children: dialogName }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/90 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2 z-10", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
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
              type: "button",
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
              type: "button",
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
              type: "button",
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
              type: "button",
              onClick: (event) => {
                event.stopPropagation();
                onClose();
              },
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
  ) }) });
}

// src/lib/code-block.ts
var CODE_BLOCK_FOLD_THRESHOLD = 16;
var CODE_BLOCK_PREVIEW_LINES = 8;
function codeLineCount(code) {
  return code.split("\n").length;
}
function codeLineCountLabel(count) {
  return count === 1 ? "1 line" : `${count} lines`;
}
function previewCode(code) {
  return code.split("\n").slice(0, CODE_BLOCK_PREVIEW_LINES).join("\n");
}
function translateCodeBlockLabel(translate, key, fallback, vars) {
  const translationKey = `codeBlock.${key}`;
  try {
    const value = translate(translationKey, vars);
    if (!value || value === translationKey || value.endsWith(`.${translationKey}`)) {
      return fallback;
    }
    return value;
  } catch {
    return fallback;
  }
}
function captureCodeBlockScroll(anchor) {
  const elements = [];
  for (let element = anchor?.parentElement ?? null; element; element = element.parentElement) {
    if (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1) {
      elements.push({ element, top: element.scrollTop, left: element.scrollLeft });
    }
  }
  return {
    elements,
    windowX: typeof window === "undefined" ? 0 : window.scrollX,
    windowY: typeof window === "undefined" ? 0 : window.scrollY
  };
}
function restoreCodeBlockScroll(snapshot) {
  for (const { element, top, left } of snapshot.elements) {
    if (!element.isConnected) continue;
    if (element.scrollTop !== top) element.scrollTop = top;
    if (element.scrollLeft !== left) element.scrollLeft = left;
  }
  if (typeof window !== "undefined" && (window.scrollX !== snapshot.windowX || window.scrollY !== snapshot.windowY)) {
    window.scrollTo(snapshot.windowX, snapshot.windowY);
  }
}
function scheduleCodeBlockScrollRestore(snapshot, onRestored) {
  if (typeof window === "undefined") return () => {
  };
  const frames = [];
  frames.push(window.requestAnimationFrame(() => {
    frames.push(window.requestAnimationFrame(() => {
      restoreCodeBlockScroll(snapshot);
      onRestored?.();
    }));
  }));
  return () => frames.forEach((frame) => window.cancelAnimationFrame(frame));
}

export { CODE_BLOCK_FOLD_THRESHOLD, ImageLightbox, captureCodeBlockScroll, codeLineCount, codeLineCountLabel, previewCode, restoreCodeBlockScroll, scheduleCodeBlockScrollRestore, translateCodeBlockLabel, useContentT };
//# sourceMappingURL=chunk-7ODIO7IG.js.map
//# sourceMappingURL=chunk-7ODIO7IG.js.map