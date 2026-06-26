"use client";

import { Button } from "../index";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
  /** Called with the chosen category, or null for "all". Host owns routing. */
  onSelect: (category: string | null) => void;
  /** Localized label for the "all posts" button; defaults to English. */
  allLabel?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  allLabel = "All Posts",
}: CategoryFilterProps) {
  const handleCategoryClick = onSelect;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategoryClick(null)}
        aria-pressed={!selectedCategory}
        className={!selectedCategory ? "font-semibold" : ""}
        style={!selectedCategory ? { background: "var(--bg-elevated)", color: "var(--text-primary)" } : undefined}
      >
        {allLabel}
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          size="sm"
          onClick={() => handleCategoryClick(category)}
          aria-pressed={selectedCategory === category}
          className={selectedCategory === category ? "font-semibold" : ""}
          style={selectedCategory === category ? { background: "var(--bg-elevated)", color: "var(--text-primary)" } : undefined}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
