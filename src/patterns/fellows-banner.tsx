"use client";

import { GraduationCap, ArrowRight } from "lucide-react";
import { useYunUI } from "../adapters/context";

export interface FellowsBannerProps {
  title: string;
  description: string;
  ctaText: string;
  /** Pre-resolved feature labels, rendered as a "·"-joined list. */
  features?: string[];
  href?: string;
  className?: string;
}

export function FellowsBanner({
  title,
  description,
  ctaText,
  features = [],
  href = "/fellows",
  className = "",
}: FellowsBannerProps) {
  const { Link } = useYunUI();
  return (
    <Link
      href={href}
      className={`card p-5 flex flex-col gap-4 sm:flex-row sm:items-center border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all group ${className}`}
    >
      {/* icon + text stay together; the CTA drops below them on mobile instead of
          squeezing the title into a narrow 3-line column beside it. */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="p-3 bg-primary/10 rounded-xl shrink-0">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {features.length > 0 && (
            <p className="text-xs text-muted-foreground/70 mt-1">{features.join(" · ")}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary/15 transition-colors">
        {ctaText}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
