"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, Copy, Edit3 } from "lucide-react";
import {
  createSingletonShorthands,
  createdBundledHighlighter,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
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

// Do not import Shiki's top-level bundle here. That entry registers every
// grammar and theme, so application bundlers emit hundreds of language chunks
// even when a page only contains a JavaScript snippet. Keep the common LLM/code
// output languages explicit and lazy; an unknown fence still renders safely as
// plaintext instead of turning the entire language catalogue into app weight.
const shikiLanguages = {
  bash: () => import("shiki/langs/bash.mjs"),
  c: () => import("shiki/langs/c.mjs"),
  cpp: () => import("shiki/langs/cpp.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  dockerfile: () => import("shiki/langs/dockerfile.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  graphql: () => import("shiki/langs/graphql.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  kotlin: () => import("shiki/langs/kotlin.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  php: () => import("shiki/langs/php.mjs"),
  powershell: () => import("shiki/langs/powershell.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  ruby: () => import("shiki/langs/ruby.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  sass: () => import("shiki/langs/sass.mjs"),
  scss: () => import("shiki/langs/scss.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  svelte: () => import("shiki/langs/svelte.mjs"),
  swift: () => import("shiki/langs/swift.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  vue: () => import("shiki/langs/vue.mjs"),
  xml: () => import("shiki/langs/xml.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
} as const;

type ShikiLanguage = keyof typeof shikiLanguages;

const shikiLanguageAliases: Record<string, ShikiLanguage> = {
  cxx: "cpp",
  docker: "dockerfile",
  js: "javascript",
  kt: "kotlin",
  md: "markdown",
  py: "python",
  rb: "ruby",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
};

const shikiThemes = {
  "github-dark": () => import("shiki/themes/github-dark.mjs"),
  "github-light": () => import("shiki/themes/github-light.mjs"),
} as const;

const createContentHighlighter = createdBundledHighlighter({
  langs: shikiLanguages,
  themes: shikiThemes,
  // The JavaScript regex engine avoids a WASM payload and is sufficient for
  // browser-side highlighting of the curated grammar set above.
  engine: () => createJavaScriptRegexEngine(),
});

const { codeToHtml: highlightToHtml } = createSingletonShorthands(
  createContentHighlighter,
);

function resolveShikiLanguage(language: string): ShikiLanguage | "plaintext" {
  const normalized = language.trim().toLowerCase();
  if (!normalized || normalized === "text" || normalized === "plaintext") {
    return "plaintext";
  }
  if (normalized in shikiLanguages) return normalized as ShikiLanguage;
  return shikiLanguageAliases[normalized] ?? "plaintext";
}

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
 * highlighting for common application and LLM output languages). Shiki core,
 * the selected grammar, and the selected theme load on demand. Supports line
 * numbers, highlighted lines, a filename header, copy, and an optional edit
 * action. Unknown fence labels degrade to escaped plaintext.
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
        const theme = isDark ? "github-dark" : "github-light";
        const lang = resolveShikiLanguage(language || "plaintext");

        const html = await highlightToHtml(code, {
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

  const btnBase =
    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      className={cn(
        "card group my-4 overflow-hidden max-w-full min-w-0",
        className,
      )}
    >
      {/* Window-chrome header — matches YunUI's original patterns/CodeBlock:
          traffic-light dots + a language `.badge` (or filename) + copy/edit. */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-(--border-hairline) bg-(--bg-elevated)">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-(--error) opacity-80" />
            <div className="w-2 h-2 rounded-full bg-(--warning) opacity-80" />
            <div className="w-2 h-2 rounded-full bg-(--success) opacity-80" />
          </div>
          {filename ? (
            <span className="text-xs font-medium text-(--text-secondary) font-mono">
              {filename}
            </span>
          ) : (
            <span className="badge text-xs">{displayLanguage}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button onClick={handleEdit} className={cn(btnBase, "text-(--text-secondary)")}>
              <Edit3 className="w-3.5 h-3.5" />
              {t("edit", "Edit")}
            </button>
          )}
          <button onClick={handleCopy} className={btnBase}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-(--success)" />
                <span className="text-(--success)">{t("copied", "Copied")}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-(--text-secondary)" />
                <span className="text-(--text-secondary)">{t("copy", "Copy")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-x-auto overflow-y-auto p-4 max-h-100 bg-(--bg-base)",
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
        "bg-(--accent-subtle) text-(--text-primary) border border-(--border-hairline)",
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
