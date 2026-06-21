"use client";

import { Check, Copy, ExternalLink, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "../lib/cn";

const actionClass = cn(
  "inline-flex items-center gap-1.5 px-2 py-1 text-xs",
  "text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors rounded-md hover:bg-fd-accent"
);

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const res = await fetch(markdownUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(window.location.origin + markdownUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdownUrl]);

  return (
    <button type="button" onClick={handleCopy} title="Copy as Markdown for LLM" className={actionClass}>
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ViewOptions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl?: string;
}) {
  return (
    <>
      <a
        href={markdownUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(actionClass, "no-underline")}
        title="View as Markdown"
      >
        <FileText className="size-3" />
        Markdown
      </a>
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(actionClass, "no-underline")}
          title="Edit on GitHub"
        >
          <ExternalLink className="size-3" />
          GitHub
        </a>
      )}
    </>
  );
}
