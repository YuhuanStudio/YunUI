"use client";

import * as React from "react";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "../lib/cn";

export interface ChatMessageListProps {
  /** The message rows (e.g. <ChatMessage/> elements). */
  children?: React.ReactNode;
  /** Shown centered when there are no messages. */
  empty?: React.ReactNode;
  /**
   * Auto-stick to the bottom as content grows — but only while the user is
   * already near the bottom, so scrolling up to read isn't interrupted.
   * @defaultValue true
   */
  autoScroll?: boolean;
  /** Distance (px) from the bottom still considered "at the bottom". @defaultValue 120 */
  stickThreshold?: number;
  className?: string;
}

/**
 * Scrollable message container with smart stick-to-bottom. Marks itself with
 * `data-scroll-container="true"` so lazy content images (from
 * `@yuhuanowo/yunui/content`) use it as their IntersectionObserver root.
 */
export function ChatMessageList({
  children,
  empty,
  autoScroll = true,
  stickThreshold = 120,
  className,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);

  const atBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= stickThreshold;
  }, [stickThreshold]);

  const handleScroll = useCallback(() => {
    stickRef.current = atBottom();
  }, [atBottom]);

  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (!el) return;

    // Pin the list's OWN scroll container to the bottom. Never use
    // `scrollIntoView` here: it scrolls every scrollable ancestor including the
    // document, so on a long page (e.g. the showcase) the whole window jumps
    // down to this chat instead of only the chat scrolling internally.
    const scrollToEnd = () => {
      if (stickRef.current && el) el.scrollTop = el.scrollHeight;
    };

    scrollToEnd();
    const observer = new ResizeObserver(scrollToEnd);
    if (el) observer.observe(el);
    // Observe the growing inner content too.
    const inner = el.firstElementChild;
    if (inner) observer.observe(inner);
    return () => observer.disconnect();
  }, [autoScroll, children]);

  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      ref={scrollRef}
      data-scroll-container="true"
      onScroll={handleScroll}
      className={cn("relative flex-1 overflow-y-auto", className)}
    >
      {hasChildren ? (
        <div>{children}</div>
      ) : (
        empty && (
          <div className="h-full flex items-center justify-center">{empty}</div>
        )
      )}
    </div>
  );
}
