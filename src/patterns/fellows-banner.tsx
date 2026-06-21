"use client";

import { GraduationCap } from "lucide-react";
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
      className={`card p-5 flex items-center gap-4 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all group ${className}`}
    >
      <div className="p-3 bg-primary/10 rounded-xl">
        <GraduationCap className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {features.length > 0 && (
          <p className="text-xs text-muted-foreground/70 mt-1">{features.join(" · ")}</p>
        )}
      </div>
      <span className="text-sm font-medium text-primary group-hover:underline whitespace-nowrap">
        {ctaText} →
      </span>
    </Link>
  );
}
