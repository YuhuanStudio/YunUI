"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";
import { ImageLightbox } from "./image-lightbox";

export interface ContentImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Open a zoom/rotate/download lightbox on click or keyboard activation. @defaultValue true */
  enableLightbox?: boolean;
  /** Accessible name for the zoom action. Defaults to a translated label plus the image alt text. */
  zoomLabel?: string;
}

/**
 * Lazy, flicker-free image for rendered content. Defers loading until the image
 * scrolls near the viewport, fades in on load, shows a spinner placeholder, and
 * (by default) opens a full-screen lightbox on click or keyboard activation.
 *
 * URLs are used as-is — resolve/rewrite them upstream (e.g. via the markdown
 * renderer's `urlTransform`).
 */
export const ContentImage = React.memo(function ContentImage({
  enableLightbox = true,
  zoomLabel,
  className,
  style,
  alt = "",
  src,
  srcSet,
  onError,
  onLoad,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  ...rest
}: ContentImageProps) {
  const t = useContentT();
  const srcString = typeof src === "string" ? src : "";
  const srcSetString = typeof srcSet === "string" ? srcSet : undefined;
  const valid = Boolean(srcString && srcString !== "#" && srcString !== "undefined" && srcString !== "null");

  const generationRef = useRef({ src: srcString, srcSet: srcSetString, generation: 0 });
  if (generationRef.current.src !== srcString || generationRef.current.srcSet !== srcSetString) {
    generationRef.current = {
      src: srcString,
      srcSet: srcSetString,
      generation: generationRef.current.generation + 1,
    };
  }
  const generation = generationRef.current.generation;
  const lightboxEpochRef = useRef({ enabled: enableLightbox, epoch: 0 });
  if (lightboxEpochRef.current.enabled !== enableLightbox) {
    lightboxEpochRef.current = {
      enabled: enableLightbox,
      epoch: lightboxEpochRef.current.epoch + 1,
    };
  }
  const lightboxEpoch = lightboxEpochRef.current.epoch;

  const [status, setStatus] = useState<{ generation: number; value: "loaded" | "failed" } | null>(null);
  const [requestedGeneration, setRequestedGeneration] = useState<number | null>(null);
  const [openState, setOpenState] = useState<{ generation: number; lightboxEpoch: number } | null>(null);
  const [insideLink, setInsideLink] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const currentStatus = status?.generation === generation ? status.value : "loading";
  const loaded = currentStatus === "loaded";
  const failed = currentStatus === "failed";
  const canZoom = enableLightbox && loaded && !insideLink;
  const lightboxOpen = enableLightbox && openState?.generation === generation && openState.lightboxEpoch === lightboxEpoch;
  const accessibleZoomLabel = zoomLabel ??
    `${t("zoomImage", "Zoom image")}${alt ? `: ${alt}` : ""}`;

  useEffect(() => {
    setInsideLink(Boolean(imgRef.current?.closest("a")));
    if (!wrapperRef.current || !valid) return;

    // Root at the nearest scrollable content container when it contains this
    // image. Otherwise observe against the viewport.
    const root = wrapperRef.current.closest('[data-scroll-container="true"]');
    const image = imgRef.current;
    if (!image) return;

    // Older browsers, embedded webviews, and test environments may not expose
    // IntersectionObserver. Load eagerly there so the placeholder cannot stick.
    if (typeof IntersectionObserver === "undefined") {
      setRequestedGeneration(generation);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (generationRef.current.generation !== generation || !image.isConnected) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRequestedGeneration(generation);
            observer.unobserve(entry.target);
            break;
          }
        }
      },
      { root, rootMargin: "300px 0px", threshold: 0.01 },
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [srcString, valid, generation]);

  if (!valid) return null;

  const isCurrentImage = (event: React.SyntheticEvent<HTMLImageElement>) =>
    generationRef.current.generation === generation && event.currentTarget === imgRef.current;

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad?.(event);
    if (isCurrentImage(event)) setStatus({ generation, value: "loaded" });
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    onError?.(event);
    if (isCurrentImage(event)) setStatus({ generation, value: "failed" });
  };

  const openPreview = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onClick) onClick(event as React.MouseEvent<HTMLImageElement>);
    if (event.defaultPrevented || !canZoom || imgRef.current?.closest("a")) return;

    // Keep focus on the trigger while Radix opens the portaled dialog; it can
    // then restore focus to the same element when the preview closes.
    event.currentTarget.focus();
    event.stopPropagation();
    setOpenState({ generation, lightboxEpoch });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !canZoom || imgRef.current?.closest("a")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.focus();
      setOpenState({ generation, lightboxEpoch });
    }
  };

  return (
    <span
      ref={wrapperRef}
      className="inline-block max-w-full overflow-hidden relative"
      style={{
        minHeight: loaded || failed ? "auto" : "200px",
        minWidth: loaded || failed ? "auto" : "200px",
      }}
    >
      {!loaded && !failed && (
        <span className="absolute inset-0 flex items-center justify-center bg-(--bg-elevated) rounded-xl" aria-hidden="true">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
        </span>
      )}
      {failed && (
        <span className="inline-flex items-center justify-center bg-error-soft px-3 py-2 rounded-xl border border-error-soft text-center">
          <span className="text-error text-sm">🖼️ {t("imageLoadingFailed", "Image failed to load")}</span>
        </span>
      )}
      {/* Keep the image itself as the trigger: wrapping a Markdown image in a
          button would create invalid nested interactive markup in linked images. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={generation}
        ref={imgRef}
        alt={alt}
        src={requestedGeneration === generation ? srcString : undefined}
        srcSet={requestedGeneration === generation ? srcSetString : undefined}
        className={cn(
          "max-w-full h-auto rounded-xl shadow-sm border border-(--border-hairline) transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          canZoom && "cursor-zoom-in",
          canZoom && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
          failed && "hidden",
          className,
        )}
        style={{ ...style, maxHeight: style?.maxHeight ?? "80vh" }}
        role={loaded && !failed ? (role ?? (canZoom ? "button" : undefined)) : undefined}
        tabIndex={loaded && !failed ? (tabIndex ?? (canZoom ? 0 : undefined)) : undefined}
        aria-label={ariaLabel ?? (canZoom ? accessibleZoomLabel : undefined)}
        onLoad={handleLoad}
        onError={handleError}
        onClick={openPreview}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {enableLightbox && (
        <ImageLightbox
          src={srcString}
          alt={alt}
          label={t("imagePreview", "Image preview") + (alt ? `: ${alt}` : "")}
          isOpen={lightboxOpen}
          onClose={() => setOpenState(null)}
        />
      )}
    </span>
  );
});
