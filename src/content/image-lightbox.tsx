"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { useContentT } from "./use-content-t";
import { useBodyScrollLock } from "../lib/hooks";

export interface ImageLightboxProps {
  /** Image URL to view. Omit when providing custom `children` (e.g. an SVG). */
  src?: string;
  alt?: string;
  /** Accessible dialog name; defaults to alt or the host's content translation. */
  label?: string;
  isOpen: boolean;
  onClose: () => void;
  /**
   * Custom zoomable content instead of an `<img src>` — e.g. an inline SVG
   * diagram. Download is only offered when `src` is set.
   */
  children?: React.ReactNode;
}

/**
 * Full-screen viewer with zoom, rotate, download and keyboard shortcuts
 * (Esc / +/- / R). Views an image (`src`) or any custom `children` (e.g. an
 * inline SVG diagram). Rendered into a portal on `document.body`.
 */
export function ImageLightbox({ src, alt = "", label, isOpen, onClose, children }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const t = useContentT();
  const opener = useMemo(
    () => isOpen && mounted ? document.activeElement as HTMLElement | null : null,
    [isOpen, mounted],
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

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          // The viewer can open inside another dialog. Handle its Escape before
          // document-level parent listeners so only the top preview closes.
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
      // best-effort download; ignore failures (e.g. cross-origin)
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          role="dialog"
          aria-modal="true"
          aria-label={dialogName}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => { event.preventDefault(); opener?.focus(); }}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onClick={onClose}
        >
          <DialogPrimitive.Title className="sr-only">{dialogName}</DialogPrimitive.Title>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={`${t("zoomOut", "Zoom out")} (-)`}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white text-sm min-w-15 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={`${t("zoomIn", "Zoom in")} (+)`}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={`${t("rotate", "Rotate")} (R)`}
            >
              <RotateCw className="w-5 h-5" />
            </button>
            {src && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={t("download", "Download")}
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); onClose(); }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
              title={`${t("close", "Close")} (Esc)`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {children ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[90vh] overflow-auto transition-transform duration-200 cursor-default"
              style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
            >
              {children}
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 cursor-default"
              style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
            />
          )}

          {alt && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {alt}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
