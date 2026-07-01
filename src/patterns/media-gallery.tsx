"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Download,
  Grid,
  List as ListIcon,
  Trash2,
} from "lucide-react";
import { cn } from "../lib/cn";
import { Button, Spinner } from "../primitives";
import { AudioPlayer } from "./audio-player";

// =====================================================
// MEDIA GALLERY
// A unified grid/list of generated media results (images, video, audio) with
// per-item status handling (pending / processing / completed / failed), a
// progress bar, signed-URL expiry detection, and hover download/delete/preview
// affordances. One canonical result surface shared across every generation page
// (image, video, audio) instead of a hand-rolled gallery per modality.
//
// Presentation only: the host owns the data and the download/delete/preview
// side effects. Wire the callbacks; leave a callback undefined to hide its
// control.
// =====================================================

export type MediaStatus = "pending" | "processing" | "completed" | "failed";

export interface MediaResult {
  /** Stable id (used as React key and passed back to callbacks). */
  id: string;
  /** Source URL of the finished media (may be a signed URL that can expire). */
  url: string;
  /** How to render the media. Defaults to `"image"`. */
  kind?: "image" | "video" | "audio";
  /** Prompt / caption shown under the media (clamped to 2 lines). */
  prompt?: ReactNode;
  /** Model id — the last path segment is shown in the meta row. */
  model?: string;
  /** Extra meta node appended to the caption row (e.g. size, duration, seed). */
  meta?: ReactNode;
  /** Generation lifecycle. Absent is treated as `"completed"`. */
  status?: MediaStatus;
  /** 0–100 progress while `pending`/`processing`. */
  progress?: number;
  /** Failure message shown in the error state. */
  error?: string;
}

/** Copy overrides so hosts can localize the built-in status/aria strings. */
export interface MediaGalleryLabels {
  starting?: string;
  processing?: string;
  failed?: string;
  expired?: string;
  download?: string;
  delete?: string;
  gridView?: string;
  listView?: string;
}

export interface MediaGalleryProps {
  /** The results to display, newest-first is conventional. */
  items: MediaResult[];
  /** Controlled view mode. Omit for uncontrolled (defaults to grid). */
  viewMode?: "grid" | "list";
  /** Called when the built-in grid/list toggle is used (renders the toggle). */
  onViewModeChange?: (mode: "grid" | "list") => void;
  /** Show a download control per completed item. */
  onDownload?: (item: MediaResult) => void;
  /** Show a delete control per item. */
  onDelete?: (item: MediaResult) => void;
  /** Make completed items clickable (e.g. open a lightbox). */
  onPreview?: (item: MediaResult) => void;
  /** Optional heading rendered above the gallery. */
  title?: ReactNode;
  /** Rendered in place of the grid when `items` is empty. */
  empty?: ReactNode;
  /** Localized copy for status/aria strings. */
  labels?: MediaGalleryLabels;
  className?: string;
}

const DEFAULT_LABELS: Required<MediaGalleryLabels> = {
  starting: "Starting…",
  processing: "Processing…",
  failed: "Generation failed",
  expired: "Media expired",
  download: "Download",
  delete: "Delete",
  gridView: "Grid view",
  listView: "List view",
};

/** True when a signed URL's `Expires` query param is in the past (60s skew). */
function isUrlExpired(url: string): boolean {
  try {
    const expires = new URL(url).searchParams.get("Expires");
    if (expires) {
      const ts = parseInt(expires, 10);
      // `Date.now` is fine at runtime (client-only "use client" component).
      return Date.now() / 1000 > ts - 60;
    }
  } catch {
    return true;
  }
  return false;
}

function MediaBody({
  item,
  labels,
}: {
  item: MediaResult;
  labels: Required<MediaGalleryLabels>;
}) {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const kind = item.kind ?? "image";
  const status = item.status ?? "completed";

  const isExpired = useMemo(() => {
    if (!item.url || item.url.startsWith("data:") || item.url.startsWith("blob:")) return false;
    return isUrlExpired(item.url);
  }, [item.url]);

  const isProcessing = status === "pending" || status === "processing";
  const showError = isExpired || loadFailed || status === "failed";

  if (isProcessing) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted">
        <Spinner size="lg" />
        <span className="text-xs text-muted-foreground">
          {status === "pending" ? labels.starting : labels.processing}
        </span>
        {item.progress !== undefined && item.progress > 0 && (
          <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted-foreground/20">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(item.progress, 95)}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  if (showError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-muted px-3 text-center">
        <AlertCircle size={22} className="text-error" />
        <span className="text-xs text-error">
          {status === "failed" ? labels.failed : labels.expired}
        </span>
        {item.error && (
          <span className="mt-0.5 max-w-[85%] truncate text-xs text-error/70">{item.error}</span>
        )}
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div className="flex h-full w-full items-center bg-muted/40 px-3">
        <AudioPlayer src={item.url} className="w-full" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={item.url}
        controls
        className="h-full w-full bg-black object-contain"
        onLoadedData={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setLoadFailed(true);
        }}
      />
    );
  }

  return (
    <>
      {loading && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={typeof item.prompt === "string" ? item.prompt : ""}
        className={cn("h-full w-full object-cover", loading && "opacity-0")}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setLoadFailed(true);
        }}
      />
    </>
  );
}

function MediaCard({
  item,
  index,
  view,
  onDownload,
  onDelete,
  onPreview,
  labels,
}: {
  item: MediaResult;
  index: number;
  view: "grid" | "list";
  onDownload?: (item: MediaResult) => void;
  onDelete?: (item: MediaResult) => void;
  onPreview?: (item: MediaResult) => void;
  labels: Required<MediaGalleryLabels>;
}) {
  const status = item.status ?? "completed";
  const kind = item.kind ?? "image";
  const isProcessing = status === "pending" || status === "processing";
  const isDone = status === "completed";
  // Audio/video have their own transport controls, so a click-to-preview
  // overlay only makes sense for images.
  const canPreview = Boolean(onPreview) && isDone && kind === "image";
  const modelShort = item.model?.split("/").pop();

  const caption = (
    <div className={cn(view === "list" ? "min-w-0 flex-1" : "p-3")}>
      {item.prompt !== undefined && (
        <div className="line-clamp-2 text-sm">{item.prompt}</div>
      )}
      {(modelShort || item.meta) && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {modelShort && <span className="truncate">{modelShort}</span>}
          {modelShort && item.meta && <span className="text-muted-foreground/40">&bull;</span>}
          {item.meta}
        </div>
      )}
    </div>
  );

  const actions = (onDownload || onDelete) && (
    <div
      className={cn(
        view === "grid"
          ? "absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100"
          : "flex items-center gap-1.5",
      )}
    >
      {onDownload && (
        <Button
          size="icon"
          variant={view === "grid" ? "primary" : "ghost"}
          disabled={!isDone}
          aria-label={labels.download}
          onClick={(e) => {
            e.stopPropagation();
            onDownload(item);
          }}
        >
          <Download size={16} />
        </Button>
      )}
      {onDelete && (
        <Button
          size="icon"
          variant={view === "grid" ? "destructive" : "ghost"}
          aria-label={labels.delete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 size={16} className={view === "list" ? "text-error" : undefined} />
        </Button>
      )}
    </div>
  );

  if (view === "list") {
    return (
      <div className="card flex items-center gap-3 p-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
          <MediaBody item={item} labels={labels} />
        </div>
        {caption}
        {actions}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "card group animate-enter overflow-hidden",
        canPreview && "cursor-pointer",
      )}
      style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
      onClick={() => canPreview && onPreview?.(item)}
    >
      <div className={cn("relative", kind === "audio" ? "h-24" : "aspect-square")}>
        <MediaBody item={item} labels={labels} />
        {!isProcessing && actions}
      </div>
      {caption}
    </div>
  );
}

/**
 * A unified grid/list of generated media results (image · video · audio) with
 * status, progress, expiry handling, and download/delete/preview controls.
 * Shared across generation pages so every modality renders results identically.
 */
export function MediaGallery({
  items,
  viewMode,
  onViewModeChange,
  onDownload,
  onDelete,
  onPreview,
  title,
  empty,
  labels,
  className,
}: MediaGalleryProps) {
  const [internalView, setInternalView] = useState<"grid" | "list">("grid");
  const view = viewMode ?? internalView;
  const setView = onViewModeChange ?? setInternalView;
  const showToggle = Boolean(onViewModeChange) || items.length > 0;
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className={className}>
      {(title || showToggle) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="heading-md">{title}</h2> : <span />}
          {showToggle && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label={l.gridView}
                aria-pressed={view === "grid"}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  view === "grid" ? "bg-muted" : "hover:bg-muted/50",
                )}
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label={l.listView}
                aria-pressed={view === "list"}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  view === "list" ? "bg-muted" : "hover:bg-muted/50",
                )}
              >
                <ListIcon size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {items.length === 0
        ? empty ?? null
        : view === "grid"
          ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, i) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  index={i}
                  view="grid"
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onPreview={onPreview}
                  labels={l}
                />
              ))}
            </div>
          )
          : (
            <div className="space-y-2">
              {items.map((item, i) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  index={i}
                  view="list"
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onPreview={onPreview}
                  labels={l}
                />
              ))}
            </div>
          )}
    </div>
  );
}

export default MediaGallery;
