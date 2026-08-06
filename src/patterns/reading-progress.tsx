"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ReadingProgressProps {
  /** Scroll distance, in px, before the control appears. */
  threshold?: number;
  /** Draw the circular progress ring around the button. */
  bar?: boolean;
  /** Make the control a back-to-top button (arrow + click-to-top). */
  backToTop?: boolean;
  /** Localized labels; default to English. */
  labels?: { backToTop?: string };
  className?: string;
}

// Ring geometry for a 48×48 viewBox. Kept as module constants so the arc math
// isn't recomputed per render.
const RING_RADIUS = 21;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * How far through a long page the reader is, and a way back to the start —
 * as one floating control in the corner, not a mystery hairline across the top.
 *
 * A circular ring fills as you scroll; an up-arrow sits in the middle and
 * returns you to the top on click. Both live in one component because they
 * answer the same question — where am I — and share a single scroll listener.
 * Two components would mean two listeners on the pages least able to afford them.
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

  if (!bar && !backToTop) return null;

  const interactive = backToTop;
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      {...(interactive
        ? {
            type: "button" as const,
            "aria-label": backToTopLabel,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
          }
        : { "aria-hidden": true })}
      className={
        // The canonical YunUI elevated-overlay surface (same recipe as menus &
        // dropdowns): translucent popover + backdrop blur, hairline border, the
        // house shadow and focus ring. House colour classes bridge to the token
        // system through @theme.
        "group fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full " +
        "border border-border bg-popover/85 backdrop-blur-2xl text-muted-foreground " +
        "shadow-lg shadow-black/5 transition-all duration-300 ease-out " +
        (interactive
          ? "hover:-translate-y-0.5 hover:bg-popover hover:text-foreground hover:shadow-xl " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background "
          : "pointer-events-none ") +
        (show ? "translate-y-0 scale-100 opacity-100 " : "pointer-events-none translate-y-3 scale-90 opacity-0 ") +
        className
      }
    >
      {bar && (
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          {/* Track — a faint hairline the progress arc rides over. Inline stroke
              via the design token so it resolves regardless of the consumer's
              JIT scan (a Tailwind stroke-* utility can be missed). */}
          <circle
            cx="24"
            cy="24"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="2"
            style={{ stroke: "var(--border)" }}
          />
          {/* Progress arc, in the accent token — scaleX/width would jump; a dash
              offset animates the stroke smoothly and is cheap on a 48px ring. */}
          <circle
            cx="24"
            cy="24"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
            style={{ stroke: "var(--accent)" }}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress / 100)}
          />
        </svg>
      )}
      {backToTop && (
        <ArrowUp size={17} strokeWidth={2} className="relative transition-transform duration-200 group-hover:-translate-y-0.5" />
      )}
    </Tag>
  );
}
