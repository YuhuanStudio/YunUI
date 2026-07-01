"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { Link2, ExternalLink } from "lucide-react";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";
import { CodeBlock, InlineCode, type CodeBlockEditPayload } from "./code-block";
import { MermaidDiagram } from "./mermaid-diagram";
import { CalloutBlock, parseCalloutType } from "./callout-block";
import { ContentImage } from "./content-image";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  /**
   * Rewrite image/link URLs before rendering (e.g. prefix a backend host or
   * proxy). Defaults to identity.
   */
  urlTransform?: (url: string) => string;
  /**
   * When provided, code blocks show an "Edit" button that calls this with the
   * code payload (e.g. open it in an editor). Hidden if unset.
   */
  onCodeEdit?: (payload: CodeBlockEditPayload) => void;
}

/**
 * Full markdown renderer: GFM (tables, task lists, strikethrough), math (KaTeX),
 * Shiki code blocks, Mermaid diagrams, GitHub-style callouts, heading anchors,
 * and lazy, zoomable images. Requires `katex/dist/katex.min.css` and the YunUI
 * content styles to be imported by the host app.
 */
export function MarkdownRenderer({
  content,
  className,
  urlTransform,
  onCodeEdit,
}: MarkdownRendererProps) {
  const components: Components = useMemo(
    () => ({
      p: ({ children }) => (
        <div className="mb-4 last:mb-0 leading-relaxed">{children}</div>
      ),

      h1: ({ children, id }) => (
        <h1
          id={id}
          className="group flex items-center gap-2 text-2xl font-bold mt-8 mb-4 first:mt-0 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h1>
      ),
      h2: ({ children, id }) => (
        <h2
          id={id}
          className="group flex items-center gap-2 text-xl font-bold mt-6 mb-3 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h2>
      ),
      h3: ({ children, id }) => (
        <h3
          id={id}
          className="group flex items-center gap-2 text-lg font-semibold mt-5 mb-2 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h3>
      ),
      h4: ({ children, id }) => (
        <h4
          id={id}
          className="group flex items-center gap-2 text-base font-semibold mt-4 mb-2 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h4>
      ),
      h5: ({ children, id }) => (
        <h5
          id={id}
          className="group flex items-center gap-2 text-sm font-semibold mt-3 mb-1 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h5>
      ),
      h6: ({ children, id }) => (
        <h6
          id={id}
          className="group flex items-center gap-2 text-sm font-medium mt-3 mb-1 scroll-mt-20"
        >
          {children}
          {id && <HeadingAnchor id={id} />}
        </h6>
      ),

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: ({ children, className: codeClass }: any) => {
        const match = /language-(\w+)/.exec(codeClass || "");
        const language = match ? match[1] : "";
        const codeString = String(children).replace(/\n$/, "");

        if (language === "mermaid") {
          return <MermaidDiagram chart={codeString} />;
        }

        if (codeClass || codeString.includes("\n")) {
          const showLineNumbers = codeClass?.includes("showLineNumbers");
          const highlightMatch = codeClass?.match(/\{([^}]+)\}/);
          const highlightLines = highlightMatch
            ? parseLineHighlights(highlightMatch[1])
            : [];

          return (
            <CodeBlock
              language={language}
              showLineNumbers={showLineNumbers}
              highlightLines={highlightLines}
              onEdit={onCodeEdit}
            >
              {codeString}
            </CodeBlock>
          );
        }

        return <InlineCode>{children}</InlineCode>;
      },

      pre: ({ children }) => <>{children}</>,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      img: ({ node, ...props }: any) => <ContentImage {...props} />,

      a: ({ href, children, ...props }) => {
        const host =
          typeof window !== "undefined" ? window.location.host : "";
        const isExternal = href?.startsWith("http") && !href?.includes(host);

        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-primary hover:underline inline-flex items-center gap-0.5"
            {...props}
          >
            {children}
            {isExternal && (
              <ExternalLink className="w-3 h-3 inline-block ml-0.5" />
            )}
          </a>
        );
      },

      blockquote: ({ children }) => {
        const childArray = React.Children.toArray(children);
        const firstChild = childArray[0];

        if (React.isValidElement(firstChild)) {
          const firstChildProps = firstChild.props as {
            children?: React.ReactNode;
          };
          const firstChildContent = firstChildProps?.children;
          if (
            typeof firstChildContent === "string" ||
            Array.isArray(firstChildContent)
          ) {
            const textContent = Array.isArray(firstChildContent)
              ? firstChildContent.find((c) => typeof c === "string")
              : firstChildContent;

            if (typeof textContent === "string") {
              const { type: calloutType, title } = parseCalloutType(
                textContent.trim().split("\n")[0],
              );

              if (calloutType) {
                const remainingContent = textContent.replace(
                  /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS)\](?:\s+[^\n]*)?\n?/i,
                  "",
                );
                const otherChildren = childArray.slice(1);

                return (
                  <CalloutBlock type={calloutType} title={title || undefined}>
                    {remainingContent && <p>{remainingContent}</p>}
                    {otherChildren}
                  </CalloutBlock>
                );
              }
            }
          }
        }

        return (
          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-4 italic text-muted-foreground">
            {children}
          </blockquote>
        );
      },

      table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-border">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
      th: ({ children }) => (
        <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-2 text-sm border-t">{children}</td>
      ),

      ul: ({ children }) => (
        <ul className="my-3 ml-6 list-disc space-y-1 [&>li]:pl-1">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="my-3 ml-6 list-decimal space-y-1 [&>li]:pl-1">
          {children}
        </ol>
      ),
      li: ({ children, className: liClass }) => {
        const isTaskItem = liClass?.includes("task-list-item");
        return (
          <li
            className={cn(
              "leading-relaxed",
              isTaskItem && "list-none -ml-6 flex items-start gap-2",
            )}
          >
            {children}
          </li>
        );
      },

      input: ({ type, checked, ...props }) => {
        if (type === "checkbox") {
          return (
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...props}
            />
          );
        }
        return <input type={type} {...props} />;
      },

      hr: () => <hr className="my-6 border-t border-border" />,

      kbd: ({ children }) => (
        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted border border-b-2 border-muted-foreground/20 rounded shadow-sm">
          {children}
        </kbd>
      ),

      mark: ({ children }) => (
        <mark className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">
          {children}
        </mark>
      ),

      details: ({ children }) => (
        <details className="my-4 rounded-lg border bg-card overflow-hidden group">
          {children}
        </details>
      ),
      summary: ({ children }) => (
        <summary className="px-4 py-3 cursor-pointer select-none font-medium hover:bg-muted/50 transition-colors">
          {children}
        </summary>
      ),

      abbr: ({ children, title }) => (
        <abbr
          title={title}
          className="border-b border-dotted border-muted-foreground cursor-help"
        >
          {children}
        </abbr>
      ),

      sub: ({ children }) => <sub className="text-xs">{children}</sub>,
      sup: ({ children }) => <sup className="text-xs">{children}</sup>,

      del: ({ children }) => (
        <del className="text-muted-foreground line-through">{children}</del>
      ),
    }),
    [onCodeEdit],
  );

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold",
        "prose-p:leading-relaxed",
        "prose-li:my-0.5",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
        urlTransform={urlTransform}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function HeadingAnchor({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const t = useContentT();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.hash = id;
    }
  };

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      className={cn(
        "opacity-0 group-hover:opacity-100 transition-opacity",
        "text-muted-foreground hover:text-foreground",
        copied && "text-green-500",
      )}
      aria-label={t("linkToHeading", "Copy link to this heading")}
    >
      <Link2 className="w-4 h-4" />
    </a>
  );
}

function parseLineHighlights(input: string): number[] {
  const lines: number[] = [];
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) lines.push(i);
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) lines.push(num);
    }
  }
  return lines;
}
