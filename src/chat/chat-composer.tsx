"use client";

import * as React from "react";
import { useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "../lib/cn";

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when the user sends (Enter or the send button). */
  onSend: () => void;
  /** Called when the stop button is pressed while `loading`. */
  onStop?: () => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Attachment chips / previews, rendered above the textarea. */
  attachments?: React.ReactNode;
  /** Left-aligned toolbar (attach, mode, feature toggles, …). */
  toolbar?: React.ReactNode;
  /** Force-disable the send button even with text (e.g. invalid state). */
  sendDisabled?: boolean;
  /**
   * Allow sending with empty text — e.g. when attachments alone make a valid
   * message. @defaultValue false
   */
  allowSendEmpty?: boolean;
  /** Max rows before the textarea scrolls. @defaultValue 8 */
  maxRows?: number;
  className?: string;
}

/**
 * Chat input composer: auto-growing textarea, Enter-to-send (Shift+Enter for a
 * newline), a send/stop button, and slots for attachment previews and a left
 * toolbar. Presentational and controlled — the host owns state and side effects.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  loading = false,
  disabled = false,
  placeholder = "Send a message…",
  attachments,
  toolbar,
  sendDisabled = false,
  allowSendEmpty = false,
  maxRows = 8,
  className,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const max = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [maxRows]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const canSend =
    !disabled && !sendDisabled && (allowSendEmpty || value.trim().length > 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (loading) return;
      if (canSend) onSend();
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-(--border-default) bg-(--bg-card) shadow-sm transition-colors",
        "focus-within:border-(--border-strong) focus-within:ring-2 focus-within:ring-(--border-strong)/30",
        disabled && "opacity-60",
        className,
      )}
    >
      {attachments && (
        <div className="flex flex-wrap gap-2 px-3 pt-3">{attachments}</div>
      )}

      <div className="flex items-end gap-2 p-2 pl-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            // 16px on mobile avoids iOS Safari's focus-zoom; compact on desktop.
            "flex-1 resize-none bg-transparent py-2 text-base leading-5 md:text-sm",
            "placeholder:text-(--text-muted) focus:outline-none",
            "max-h-[40vh]",
          )}
        />

        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop"
            className="shrink-0 mb-0.5 h-8 w-8 rounded-full bg-(--text-primary) text-(--bg-base) flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => canSend && onSend()}
            disabled={!canSend}
            aria-label="Send"
            className={cn(
              "shrink-0 mb-0.5 h-8 w-8 rounded-full flex items-center justify-center transition-colors",
              canSend
                ? "bg-(--accent) text-(--bg-base) hover:opacity-90"
                : "bg-(--bg-elevated) text-(--text-muted) cursor-not-allowed",
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {toolbar && (
        <div className="flex items-center gap-1 px-3 pb-2 -mt-1">{toolbar}</div>
      )}
    </div>
  );
}
