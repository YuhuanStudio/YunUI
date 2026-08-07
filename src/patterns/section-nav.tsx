"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export interface SectionNavItem {
  /** Element id to scroll to; also the observed target. */
  id: string;
  label: string;
  /** Shown right-aligned — how many things are in the section. */
  count?: number;
}

export interface SectionNavProps {
  items: SectionNavItem[];
  /** Offset in px for a fixed header, used when scrolling and when spying. */
  offset?: number;
  /** Accessible name for the nav landmark — localize it. @defaultValue "Sections" */
  label?: string;
  className?: string;
}

/**
 * In-page section navigator with scroll spy.
 *
 * Written because a digest can run to forty entries across nine sections, and
 * without this the only way to reach 產業動態 is to scroll past everything
 * before it. Distinct from `Sidebar`, which is site navigation (brand, logo, routes):
 * this covers "navigate within one long page". Upstreamed from YunNEWS, where
 * it was written to library standards from the start.
 *
 * IntersectionObserver rather than a scroll handler: a scroll listener fires on
 * every frame and has to measure each section's box, which is the same work the
 * browser has already done.
 */
export function SectionNav({ items, offset = 112, label = "Sections", className }: SectionNavProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost section currently intersecting wins. Taking the first
        // *entry* instead would follow whichever one happened to change state,
        // so scrolling up would highlight the section being left.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // Shrink the viewport to a band just under the header: without it a
        // section counts as visible while it is still behind the navbar.
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items, offset]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-foreground/5 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <span className="truncate">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    // No opacity modifier. --text-tertiary passes AA on its own; the
                    // same colour at 60% is 2.31:1, which does not. Selected vs not is
                    // carried by weight and the rail, which cost no contrast.
                    className={cn(
                      "shrink-0 text-xs tabular-nums",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
