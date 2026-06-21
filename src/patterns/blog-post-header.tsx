"use client";

import { Calendar, Clock, User } from "lucide-react";
import { Badge, Avatar, AvatarImage, AvatarFallback } from "../index";
import { formatDate, formatLongDate } from "../lib/format-date";

interface BlogPostHeaderProps {
  title: string;
  description?: string;
  date?: string;
  author?: {
    name?: string;
    avatar?: string;
    url?: string;
  };
  category?: string;
  tags?: string[];
  readingTime?: number;
  coverImage?: string;
}

export function BlogPostHeader({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  coverImage,
}: BlogPostHeaderProps) {
  const formattedDate = date
    ? formatLongDate(date)
    : null;

  return (
    <header className="mb-12">
      {/* Category */}
      {category && (
        <Badge variant="info" className="mb-4">
          {category}
        </Badge>
      )}

      {/* Title */}
      <h1 className="heading-xl mb-4">{title}</h1>

      {/* Description */}
      {description && <p className="text-xl text-muted-foreground mb-6">{description}</p>}

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
        {/* Author */}
        {author?.name && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {author.avatar && <AvatarImage src={author.avatar} alt={author.name} />}
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              {author.url ? (
                <a href={author.url} className="hover:text-foreground font-medium">
                  {author.name}
                </a>
              ) : (
                <span className="font-medium">{author.name}</span>
              )}
            </div>
          </div>
        )}

        {/* Date */}
        {formattedDate && (
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formattedDate}
          </span>
        )}

        {/* Reading Time */}
        {readingTime && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {readingTime} min read
          </span>
        )}
      </div>

      {/* Cover Image */}
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-muted">
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/blog?tag=${tag}`}
              className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
