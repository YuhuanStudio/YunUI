"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, Copy, Terminal, Edit3 } from "lucide-react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { cn } from "../lib/cn";
import { useContentT } from "./use-content-t";

export interface CodeBlockEditPayload {
  code: string;
  language: string;
  filename: string;
}

export interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
  className?: string;
  /**
   * When provided, an "Edit" button appears in the header and calls this with
   * the code payload (e.g. to open it in an editor/workspace). Hidden if unset.
   */
  onEdit?: (payload: CodeBlockEditPayload) => void;
}

const languageNames: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  py: "Python",
  python: "Python",
  rb: "Ruby",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  cpp: "C++",
  c: "C",
  java: "Java",
  kotlin: "Kotlin",
  kt: "Kotlin",
  swift: "Swift",
  php: "PHP",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
  md: "Markdown",
  markdown: "Markdown",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Zsh",
  powershell: "PowerShell",
  ps1: "PowerShell",
  dockerfile: "Dockerfile",
  docker: "Docker",
  graphql: "GraphQL",
  vue: "Vue",
  svelte: "Svelte",
  diff: "Diff",
  plaintext: "Plain Text",
  text: "Plain Text",
};

const langExtMap: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  bash: "sh",
  shell: "sh",
  markdown: "md",
};

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/**
 * Syntax-highlighted code block powered by Shiki (accurate, VS Code-grade
 * highlighting for 100+ languages). Shiki is loaded on demand the first time a
 * block renders, so it never ships in the initial bundle. Supports line numbers,
 * highlighted lines, a filename header, copy, and an optional edit action.
 */
export function CodeBlock({
  children,
  language = "plaintext",
  showLineNumbers = false,
  highlightLines = [],
  filename,
  className,
  onEdit,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useIsDarkMode();
  const t = useContentT();

  const code = useMemo(
    () => (typeof children === "string" ? children.trim() : String(children).trim()),
    [children],
  );

  const displayLanguage =
    languageNames[language?.toLowerCase()] || language?.toUpperCase() || "CODE";

  const handleEdit = useCallback(() => {
    if (!onEdit) return;
    const ext = langExtMap[language?.toLowerCase()] || language || "txt";
    onEdit({ code, language, filename: filename || `snippet.${ext}` });
  }, [onEdit, code, language, filename]);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      setIsLoading(true);
      try {
        const { codeToHtml } = await import("shiki");
        const theme: BundledTheme = isDark ? "github-dark" : "github-light";
        const lang = (language?.toLowerCase() || "plaintext") as BundledLanguage;

        const html = await codeToHtml(code, {
          lang,
          theme,
          transformers: [
            {
              line(node, line) {
                if (showLineNumbers) node.properties["data-line"] = line;
                if (highlightLines.includes(line)) {
                  node.properties["class"] =
                    `${node.properties["class"] || ""} highlighted-line`;
                }
              },
            },
          ],
        });

        if (!cancelled) {
          setHighlightedCode(html);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHighlightedCode(
            `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
          );
          setIsLoading(false);
        }
      }
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language, isDark, showLineNumbers, highlightLines]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div
      className={cn(
        "group relative my-4 rounded-lg border overflow-hidden",
        "bg-[#f6f8fa] dark:bg-[#161b22]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          {filename ? (
            <span className="text-xs font-medium text-foreground">{filename}</span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              {displayLanguage}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {onEdit && (
            <button
              onClick={handleEdit}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-xs",
                "bg-primary/90 text-primary-foreground hover:bg-primary",
              )}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t("edit", "Edit")}</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs",
              copied
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t("copied", "Copied")}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t("copy", "Copy")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-x-auto overflow-y-auto p-4 max-h-100",
          showLineNumbers && "code-with-line-numbers",
        )}
      >
        {isLoading ? (
          <pre className="text-sm font-mono">
            <code>{code}</code>
          </pre>
        ) : (
          <div
            className="shiki-wrapper text-sm [&_pre]:bg-transparent! [&_code]:bg-transparent!"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        )}
      </div>
    </div>
  );
}

/** Inline code (`` `code` ``) — used by the markdown renderer. */
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 mx-0.5 rounded text-sm font-mono",
        "bg-muted/80 text-foreground border",
        "wrap-break-word",
        className,
      )}
    >
      {children}
    </code>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
