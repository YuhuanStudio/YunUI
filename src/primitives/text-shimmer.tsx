"use client";

import * as React from "react";

import { cn } from "../lib/cn";

export interface TextShimmerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The single accessible label and visible text. */
  text: string;
  /** Pause the sweep while preserving the same layout and text treatment. */
  active?: boolean;
}

/**
 * A restrained text sweep for transient work states such as “Thinking…” or
 * “Checking results”. The label is exposed exactly once to assistive
 * technology; duplicated paint layers stay presentational.
 */
export const TextShimmer = React.forwardRef<HTMLSpanElement, TextShimmerProps>(
  ({ text, active = true, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={text}
      data-active={active ? "true" : "false"}
      data-yunui="text-shimmer"
      className={cn("yunui-text-shimmer", className)}
      {...props}
    >
      <span className="yunui-text-shimmer__paint" aria-hidden="true">
        <span className="yunui-text-shimmer__base">{text}</span>
        <span className="yunui-text-shimmer__sweep">{text}</span>
      </span>
    </span>
  ),
);
TextShimmer.displayName = "TextShimmer";
