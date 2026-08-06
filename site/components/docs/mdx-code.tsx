"use client";

import { isValidElement, type ReactNode } from "react";
import { CodeBlock } from "yunui/patterns";

/**
 * Renders fenced code blocks in MDX prose with YunUI's own CodeBlock — the same
 * styled, highlighted surface the `<ComponentPreview>` Code tab uses — instead
 * of fumadocs' plain `<pre>`. The MDX pipeline emits no rehype highlighting, so
 * a ```lang block arrives as `<pre><code class="language-lang">…</code></pre>`;
 * we pull the raw string + language back out and hand them to CodeBlock.
 */
export function MdxPre({ children }: { children?: ReactNode }) {
  if (isValidElement(children)) {
    const props = children.props as { className?: string; children?: unknown };
    const language = props.className?.replace(/^language-/, "") ?? "text";
    const raw = typeof props.children === "string" ? props.children.replace(/\n$/, "") : "";
    // `not-prose`: YunUI's CodeBlock ships its own frame. Without this, Tailwind
    // Typography (`.prose`) paints its own `pre` box under ours (a double frame)
    // and adds ``code::before/after`` backtick pseudo-elements (stray pills).
    if (raw)
      return (
        <div className="not-prose my-6">
          <CodeBlock language={language} code={raw} />
        </div>
      );
  }
  return <pre>{children}</pre>;
}
