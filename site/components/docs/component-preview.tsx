"use client";

import { useState, type ReactNode } from "react";
import { CodeBlock } from "yunui/patterns";

/**
 * ComponentPreview — a framed live preview with a Preview / Code toggle.
 *
 * Mirrors the marketing showcase's `Demo` look (dotted backdrop, pill toggle)
 * so the docs match the landing page pixel-for-pixel, and renders real YunUI
 * components passed as `children`. Pass `code` to enable the Code tab.
 */
export function ComponentPreview({
  title,
  description,
  code,
  children,
}: {
  title?: string;
  description?: string;
  code?: string;
  children: ReactNode;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const showCode = view === "code" && !!code;

  return (
    <div className="my-6 not-prose">
      {(title || code) && (
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            {title && <p className="text-sm font-medium">{title}</p>}
            {description && <p className="text-caption mt-0.5">{description}</p>}
          </div>
          {code && (
            <div className="flex items-center gap-0.5 rounded-lg bg-(--bg-elevated) p-0.5 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setView("preview")}
                className={`px-2.5 py-1 rounded-md transition-colors ${view === "preview" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setView("code")}
                className={`px-2.5 py-1 rounded-md transition-colors ${view === "code" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                Code
              </button>
            </div>
          )}
        </div>
      )}

      {showCode ? (
        <CodeBlock language="tsx" code={code!} />
      ) : (
        <div
          className="rounded-2xl border border-border p-10 flex flex-wrap items-center justify-center gap-4 min-h-[150px]"
          style={{
            backgroundImage:
              "radial-gradient(var(--border-subtle) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
