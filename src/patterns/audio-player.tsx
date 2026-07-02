"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { cn } from "../lib/cn";

// =====================================================
// AUDIO PLAYER
// A compact controls bar around an HTML5 <audio> element: play/pause, a
// seekable progress track, elapsed/total time, and an optional download button.
// Give it a `src` (a URL or object URL); the host owns the blob lifecycle.
// =====================================================

/** Localized accessible labels for the audio controls. */
export interface AudioPlayerLabels {
  play?: string;
  pause?: string;
  seek?: string;
  download?: string;
}

export interface AudioPlayerProps {
  /** Audio source URL or object URL. */
  src: string;
  /** Optional title shown above the controls. */
  title?: string;
  /** Show a download button linking to `src`; the value is the download filename. */
  downloadName?: string;
  /** Begin playing as soon as the source is ready. */
  autoPlay?: boolean;
  /** Localized `aria-label`s for the controls (defaults are English). */
  labels?: AudioPlayerLabels;
  className?: string;
}

const fmtTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/**
 * A styled wrapper over `<audio>`: play/pause, a seekable progress bar, time
 * readout, and an optional download button. Presentation only — no fetching.
 */
export function AudioPlayer({ src, title, downloadName, autoPlay = false, labels, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset transport state whenever the source changes.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-border bg-card p-3", className)}>
      {title && <div className="truncate text-sm font-medium">{title}</div>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? (labels?.pause ?? "Pause") : (labels?.play ?? "Play")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={current}
          onChange={seek}
          aria-label={labels?.seek ?? "Seek"}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-accent)]"
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-muted) ${pct}%)`,
          }}
        />

        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {fmtTime(current)} / {fmtTime(duration)}
        </span>

        {downloadName && (
          <a
            href={src}
            download={downloadName}
            aria-label={labels?.download ?? "Download audio"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>

      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
