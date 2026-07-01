"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import katex from "katex";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";

export interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Render a LaTeX expression with KaTeX. Requires `katex/dist/katex.min.css` to
 * be imported by the host app.
 */
export function MathRenderer({ math, block = false, className }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [error, setError] = useState<string>("");
  const t = useContentT();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      katex.render(math, containerRef.current, {
        displayMode: block,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: false,
        trust: true,
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}",
        },
      });
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("formulaRenderFailed", "Formula render failed"),
      );
    }
  }, [math, block, t]);

  if (error) {
    return (
      <span
        className={cn(
          "text-destructive bg-destructive/10 px-1 rounded",
          block ? "block my-2 p-2 text-center" : "inline",
          className,
        )}
      >
        <span className="text-xs">⚠️ {error}</span>
      </span>
    );
  }

  if (block) {
    return (
      <div
        className={cn(
          "my-4 py-4 overflow-x-auto text-center",
          "[&_.katex]:text-lg",
          className,
        )}
      >
        <span ref={containerRef} />
      </div>
    );
  }

  return (
    <span ref={containerRef} className={cn("inline-block align-middle", className)} />
  );
}

/** Inline math (`$…$`) — used by the markdown renderer's math plugin. */
export function InlineMath({ value }: { value: string }) {
  return <MathRenderer math={value} block={false} />;
}

/** Block/display math (`$$…$$`) — used by the markdown renderer's math plugin. */
export function BlockMath({ value }: { value: string }) {
  return <MathRenderer math={value} block />;
}
