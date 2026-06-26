"use client";

import { Card, Badge } from "../index";
import { Calendar, Clock, User } from "lucide-react";
import { formatDate } from "../lib/format-date";
import { useYunUI } from "../adapters/context";

interface BlogCardProps {
  /** Post title. */
  title: string;
  /** Short excerpt/summary. */
  description?: string;
  /** Publish date (ISO string); formatted via `locale`. */
  date?: string;
  /** Post author (name shown in the meta row). */
  author?: {
    name?: string;
    avatar?: string;
    url?: string;
  };
  /** Category label shown as an info badge. */
  category?: string;
  /** Tag list (first 3 rendered as clickable chips). */
  tags?: string[];
  /** Estimated reading time in minutes. */
  readingTime?: number;
  /** Cover image URL; a placeholder icon is shown when absent. */
  coverImage?: string;
  /** Destination the card links to. */
  url: string;
  /** Layout: `default` or `featured` (spans 2 columns on `md`+). */
  variant?: "default" | "featured";
  /** Locale for the date; defaults to a stable "en-US" (SSR-safe). */
  locale?: string;
}

/** Blog post preview card with cover image, category, meta (date/reading time/author), and tags. */
export function BlogCard({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  coverImage,
  url,
  variant = "default",
  locale,
}: BlogCardProps) {
  const { Link } = useYunUI();
  const formattedDate = date
    ? formatDate(date, locale)
    : null;

  const isFeatured = variant === "featured";

  return (
    <Link href={url} className="block h-full">
      <Card hover className={`group overflow-hidden h-full flex flex-col ${isFeatured ? "md:col-span-2" : ""}`}>
        {/* Cover Image - always render with fixed aspect ratio */}
        <div className="aspect-video w-full overflow-hidden bg-muted flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Category */}
          {category && (
            <Badge variant="info" className="mb-3 self-start">
              {category}
            </Badge>
          )}

          {/* Title */}
          <h2 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h2>

          {/* Description */}
          {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{description}</p>}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-auto">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
            )}

            {readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readingTime} min read
              </span>
            )}

            {author?.name && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {author.name}
              </span>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/blog?tag=${tag}`;
                  }}
                  className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
