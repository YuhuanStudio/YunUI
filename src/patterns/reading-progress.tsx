"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ReadingProgressProps {
  /** Scroll distance, in px, before the back-to-top button appears. */
  threshold?: number;
  /** Show the progress bar. Off leaves only the button. */
  bar?: boolean;
  /** Show the back-to-top button. Off leaves only the bar. */
  backToTop?: boolean;
  /** Localized labels; default to English. */
  labels?: { backToTop?: string };
  className?: string;
}

/**
 * How far through a long page the reader is, and a way back to the start.
 *
 * Both in one component because they answer the same question — where am I —
 * and because they share a scroll listener. Two components would mean two
 * listeners on the pages least able to afford them.
 *
 * The host app owns nothing here: no data, no routing, no copy beyond an
 * overridable label.
 */
export function ReadingProgress({
  threshold = 600,
  bar = true,
  backToTop = true,
  labels,
  className = "",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const backToTopLabel = labels?.backToTop ?? "Back to top";

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const reach = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(reach > 0 ? Math.min(100, (scrolled / reach) * 100) : 0);
      setShow(scrolled > threshold);
    };
    // Coalesced into a frame: scroll fires far more often than the screen
    // repaints, and setting state on every event is how a long page starts to
    // feel heavy — on exactly the pages this exists to help.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return (
    <>
      {bar && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 ${className}`}
        >
          {/* scaleX rather than width: it animates on the compositor and never
              triggers layout, which matters on a page long enough to need this. */}
          <div
            className="h-full origin-left bg-[var(--accent)] transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      )}

      {backToTop && (
        <button
          type="button"
          aria-label={backToTopLabel}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={
            "fixed bottom-5 right-5 z-50 rounded-full border border-[var(--border-hairline)] " +
            "bg-[var(--bg-elevated)] p-2.5 text-[var(--text-secondary)] shadow-sm backdrop-blur " +
            "transition-all duration-200 hover:text-[var(--text-primary)] " +
            (show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0")
          }
        >
          <ArrowUp size={16} />
        </button>
      )}
    </>
  );
}
