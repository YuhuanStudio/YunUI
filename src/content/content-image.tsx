"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";
import { ImageLightbox } from "./image-lightbox";

export interface ContentImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Open a zoom/rotate/download lightbox on click. @defaultValue true */
  enableLightbox?: boolean;
}

/**
 * Lazy, flicker-free image for rendered content. Defers loading until the image
 * scrolls near the viewport (IntersectionObserver), fades in on load, shows a
 * spinner placeholder, and (by default) opens a full-screen lightbox on click.
 *
 * URLs are used as-is — resolve/rewrite them upstream (e.g. via the markdown
 * renderer's `urlTransform`).
 */
export const ContentImage = React.memo(function ContentImage({
  enableLightbox = true,
  className,
  alt = "",
  src,
  onError,
  onLoad,
  ...rest
}: ContentImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const t = useContentT();

  const srcString = typeof src === "string" ? src : "";
  const valid = srcString && srcString !== "#" && srcString !== "undefined" && srcString !== "null";

  useEffect(() => {
    if (!wrapperRef.current || !valid) return;

    // Root the observer at the nearest scrollable content container, but only
    // if it actually contains this image. A page can have a `data-scroll-container`
    // (e.g. a ChatMessageList) that this image sits *outside* of — rooting to it
    // then means the image never intersects and stays stuck on the spinner.
    // Fall back to the viewport (`null`) in that case.
    const container = document.querySelector('[data-scroll-container="true"]');
    const root = container && container.contains(wrapperRef.current) ? container : null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = srcString;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
        rootMargin: "300px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [srcString, valid]);

  if (!valid) return null;

  if (failed) {
    return (
      <span className="inline-block">
        <span className="bg-error-soft px-3 py-2 rounded-xl border border-error-soft text-center">
          <span className="text-error text-sm">
            🖼️ {t("imageLoadingFailed", "Image failed to load")}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      ref={wrapperRef}
      className="inline-block max-w-full overflow-hidden relative"
      style={{
        minHeight: loaded ? "auto" : "200px",
        minWidth: loaded ? "auto" : "200px",
      }}
    >
      {!loaded && (
        <span className="absolute inset-0 flex items-center justify-center bg-(--bg-elevated) rounded-xl">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        alt={alt}
        className={cn(
          "max-w-full h-auto rounded-xl shadow-sm border border-(--border-hairline) transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          enableLightbox && loaded && "cursor-zoom-in",
          className,
        )}
        style={{ maxHeight: "80vh" }}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setFailed(true);
          onError?.(e);
        }}
        onClick={enableLightbox ? () => setLightboxOpen(true) : undefined}
        {...rest}
      />
      {enableLightbox && (
        <ImageLightbox
          src={srcString}
          alt={alt}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </span>
  );
});
