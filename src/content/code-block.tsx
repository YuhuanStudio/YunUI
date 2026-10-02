"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback, useRef, useId, useLayoutEffect } from "react";
import { Check, Copy, Edit3 } from "lucide-react";
import {
  createHighlighterCore,
  type HighlighterGeneric,
  type ShikiTransformer,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { cn } from "../lib/cn";
import { copyToClipboard } from "../lib/clipboard";
import { useContentT } from "./use-content-t";
import { useContentDarkMode } from "./use-content-dark-mode";
import {
  CODE_BLOCK_FOLD_THRESHOLD,
  captureCodeBlockScroll,
  codeLineCount,
  codeLineCountLabel,
  previewCode,
  restoreCodeBlockScroll,
  scheduleCodeBlockScrollRestore,
  type CodeBlockScrollSnapshot,
} from "../lib/code-block";

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

const NO_HIGHLIGHT_LINES: number[] = [];
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

/*
 * The `-default` variants, not plain `github-dark` / `github-light`. These are
 * the themes GitHub itself moved to, and the older pair has a token colour that
 * fails WCAG AA in each mode — measured against each theme's own background:
 *
 *   github-light   #e36209 (constants/numbers)  3.49:1
 *   github-dark    #6a737d (comments)           3.93:1
 *
 * Both are text, both are below the 4.5:1 floor, and axe flagged the light one
 * on every page with a code sample. The `-default` variants have no failing
 * text token in either mode, and are visually near-identical.
 */
const shikiThemes = {
  "github-dark-default": () => import("shiki/themes/github-dark-default.mjs"),
  "github-light-default": () => import("shiki/themes/github-light-default.mjs"),
} as const;

type ShikiTheme = keyof typeof shikiThemes;
type ContentHighlighter = HighlighterGeneric<ShikiLanguage, ShikiTheme>;

let contentHighlighterPromise: Promise<ContentHighlighter> | undefined;
const languageLoadPromises = new Map<ShikiLanguage, Promise<void>>();
const themeLoadPromises = new Map<ShikiTheme, Promise<void>>();

function getContentHighlighter(): Promise<ContentHighlighter> {
  contentHighlighterPromise ??= createHighlighterCore({
    // The JavaScript regex engine avoids a WASM payload and is sufficient for
    // browser-side highlighting of the curated grammar set above.
    engine: createJavaScriptRegexEngine(),
  }) as Promise<ContentHighlighter>;
  return contentHighlighterPromise;
}

async function ensureLanguage(
  highlighter: ContentHighlighter,
  language: ShikiLanguage | "plaintext",
) {
  if (language === "plaintext" || highlighter.getLoadedLanguages().includes(language)) {
    return;
  }
  let pending = languageLoadPromises.get(language);
  if (!pending) {
    pending = (async () => {
      const registration = (await shikiLanguages[language]()).default;
      await highlighter.loadLanguage(registration);
    })();
    languageLoadPromises.set(language, pending);
  }
  await pending;
}

async function ensureTheme(highlighter: ContentHighlighter, theme: ShikiTheme) {
  if (highlighter.getLoadedThemes().includes(theme)) return;
  let pending = themeLoadPromises.get(theme);
  if (!pending) {
    pending = (async () => {
      const registration = (await shikiThemes[theme]()).default;
      await highlighter.loadTheme(registration);
    })();
    themeLoadPromises.set(theme, pending);
  }
  await pending;
}

async function highlightToHtml(
  code: string,
  options: {
    lang: ShikiLanguage | "plaintext";
    theme: ShikiTheme;
    transformers?: ShikiTransformer[];
  },
) {
  const highlighter = await getContentHighlighter();
  const language = options.lang as ShikiLanguage | "plaintext";
  const theme = options.theme as ShikiTheme;
  await Promise.all([
    ensureLanguage(highlighter, language),
    ensureTheme(highlighter, theme),
  ]);
  return highlighter.codeToHtml(code, options);
}

function resolveShikiLanguage(language: string): ShikiLanguage | "plaintext" {
  const normalized = language.trim().toLowerCase();
  if (!normalized || normalized === "text" || normalized === "plaintext") {
    return "plaintext";
  }
  if (Object.prototype.hasOwnProperty.call(shikiLanguages, normalized)) return normalized as ShikiLanguage;
  return Object.prototype.hasOwnProperty.call(shikiLanguageAliases, normalized)
    ? shikiLanguageAliases[normalized]
    : "plaintext";
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
  highlightLines = NO_HIGHLIGHT_LINES,
  filename,
  className,
  onEdit,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useContentDarkMode();
  const t = useContentT();
  const copyRequestRef = useRef(0);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeSurfaceRef = useRef<HTMLDivElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const disclosureRef = useRef<HTMLButtonElement>(null);
  const restoreExpandedFocus = useRef(false);
  const restoreDisclosureFocus = useRef(false);
  const disclosureScroll = useRef<CodeBlockScrollSnapshot | null>(null);
  const codeBlockId = useId();

  const code = useMemo(
    () => (typeof children === "string" ? children : String(children)),
    [children],
  );
  const previousCopyPayloadRef = useRef(code);
  const lineCount = codeLineCount(code);
  const foldable = lineCount > CODE_BLOCK_FOLD_THRESHOLD;
  const shownCode = foldable && !expanded ? previewCode(code) : code;

  const displayLanguage =
    (Object.prototype.hasOwnProperty.call(languageNames, language.toLowerCase())
      ? languageNames[language.toLowerCase()]
      : language.toUpperCase()) || "CODE";
  const codeRegionLabel = t(
    "codeBlock.scrollRegion",
    `${displayLanguage} code, ${codeLineCountLabel(lineCount)}`,
    { language: displayLanguage, count: lineCount },
  );
  const copyFullLabel = t("codeBlock.copyFull", "Copy full code");
  const editLabel = t("edit", "Edit");
  const copyErrorLabel = t(
    "codeBlock.copyError",
    "Clipboard access was denied. Select the code and copy it manually.",
  );
  const scrollCueLabel = t("codeBlock.scrollHorizontally", "Scroll horizontally");
  const showAllLabel = t(
    "codeBlock.showAll",
    `Show all ${lineCount} lines`,
    { count: lineCount },
  );
  const showLessLabel = t("codeBlock.showLess", "Show less");

  useIsomorphicLayoutEffect(() => {
    if (previousCopyPayloadRef.current === code) return;
    previousCopyPayloadRef.current = code;
    copyRequestRef.current += 1;
    setCopied(false);
    setCopyError(false);
    if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = null;
  }, [code]);

  useEffect(() => () => {
    copyRequestRef.current += 1;
    if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
  }, []);

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
        const theme = isDark ? "github-dark-default" : "github-light-default";
        const lang = resolveShikiLanguage(language || "plaintext");

        const html = await highlightToHtml(shownCode, {
          lang,
          theme,
          transformers: [
            {
              pre(node) {
                node.properties.tabIndex = 0;
                node.properties["aria-label"] = codeRegionLabel;
                node.properties.class = `${node.properties.class || ""} yunui-code-scroll`.trim();
              },
            },
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
            `<pre class="shiki yunui-code-scroll" tabindex="0" aria-label="${escapeHtml(codeRegionLabel)}"><code>${escapeHtml(shownCode)}</code></pre>`,
          );
          setIsLoading(false);
        }
      }
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [shownCode, language, isDark, showLineNumbers, highlightLines, codeRegionLabel]);

  const handleCopy = async () => {
    const requestId = ++copyRequestRef.current;
    const payload = code;
    if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = null;
    setCopied(false);
    setCopyError(false);
    if (!(await copyToClipboard(payload))) {
      if (requestId !== copyRequestRef.current) return;
      setCopied(false);
      setCopyError(true);
      return;
    }
    if (requestId !== copyRequestRef.current) return;
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      if (requestId !== copyRequestRef.current) return;
      setCopied(false);
      copyTimeoutRef.current = null;
    }, 2000);
  };

  const toggleExpanded = () => {
    const nextExpanded = !expanded;
    disclosureScroll.current = captureCodeBlockScroll(disclosureRef.current);
    restoreExpandedFocus.current = nextExpanded;
    restoreDisclosureFocus.current = !nextExpanded;
    setIsLoading(true);
    setExpanded(nextExpanded);
  };

  useIsomorphicLayoutEffect(() => {
    const snapshot = disclosureScroll.current;
    if (!snapshot) return;
    if (!expanded && restoreDisclosureFocus.current) {
      restoreDisclosureFocus.current = false;
      disclosureRef.current?.focus({ preventScroll: true });
    }
    if (expanded && !isLoading && restoreExpandedFocus.current) {
      const codeRegion = codeSurfaceRef.current?.querySelector<HTMLElement>("pre.yunui-code-scroll");
      if (codeRegion) {
        restoreExpandedFocus.current = false;
        codeRegion.focus({ preventScroll: true });
      }
    }
    restoreCodeBlockScroll(snapshot);
    return scheduleCodeBlockScrollRestore(snapshot, () => {
      if (disclosureScroll.current === snapshot && !isLoading) disclosureScroll.current = null;
    });
  }, [expanded, isLoading, highlightedCode]);

  const handleCodeKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    const region = event.target;
    if (!(region instanceof HTMLElement) || region.tagName !== "PRE" || region.tabIndex < 0) return;

    if (foldable && expanded && event.key === "Tab") {
      const nextControl = event.shiftKey ? copyButtonRef.current : disclosureRef.current;
      if (nextControl) {
        event.preventDefault();
        nextControl.focus();
      }
      return;
    }

    const before = region.scrollLeft;
    if (event.key === "ArrowRight" && region.scrollWidth > region.clientWidth) {
      region.scrollLeft += 48;
    } else if (event.key === "ArrowLeft" && region.scrollWidth > region.clientWidth) {
      region.scrollLeft -= 48;
    } else {
      return;
    }

    if (region.scrollLeft !== before) event.preventDefault();
  }, [expanded, foldable]);

  const btnBase =
    "inline-flex min-h-6 shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      className={cn(
        "my-3 w-full min-w-0 overflow-hidden rounded-lg border border-(--border-hairline) bg-(--bg-base)",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-(--border-hairline) bg-(--bg-elevated) px-2 py-1.5">
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-mono text-xs font-medium text-(--text-secondary)",
            filename && "min-w-32",
            !filename && "font-sans",
          )}
          title={filename || displayLanguage}
        >
          {filename || displayLanguage}
        </span>
        {filename && (
          <span className="shrink-0 rounded bg-(--bg-base) px-1.5 py-0.5 text-[10px] text-(--text-tertiary)">
            {displayLanguage}
          </span>
        )}
        <span className="shrink-0 text-[10px] text-(--text-secondary)">
          {t("codeBlock.lineCount", codeLineCountLabel(lineCount), { count: lineCount })}
        </span>
        {code.split("\n").some((line) => line.length > 72) && (
          <span className="shrink-0 text-[10px] text-(--text-secondary)">
            {scrollCueLabel} <span aria-hidden="true">→</span>
          </span>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className={btnBase}
              aria-label={editLabel}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editLabel}
            </button>
          )}
          <button
            ref={copyButtonRef}
            type="button"
            onClick={handleCopy}
            className={btnBase}
            aria-label={copied ? t("codeBlock.copied", t("copied", "Copied")) : copyFullLabel}
          >
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
        ref={codeSurfaceRef}
        id={`${codeBlockId}-code`}
        onKeyDownCapture={handleCodeKeyDown}
        className={cn("min-w-0 px-2 py-2", showLineNumbers && "code-with-line-numbers")}
      >
        {isLoading ? (
          <pre
            className="yunui-code-scroll text-sm font-mono"
            tabIndex={0}
            aria-label={codeRegionLabel}
          >
            <code>{shownCode}</code>
          </pre>
        ) : (
          <div
            className="shiki-wrapper text-sm [&_pre]:bg-transparent! [&_code]:bg-transparent!"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        )}
      </div>
      {copyError && <p role="alert" className="border-t border-(--border-hairline) px-2 py-1 text-xs text-(--text-secondary)">{copyErrorLabel}</p>}
      {foldable && (
        <button
          ref={disclosureRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={`${codeBlockId}-code`}
          onClick={toggleExpanded}
          className="flex min-h-7 w-full items-center border-t border-(--border-hairline) px-2 py-1 text-left text-xs text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {expanded ? showLessLabel : showAllLabel}
        </button>
      )}
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
        "yunui-inline-code px-[3px] py-px rounded-sm text-[0.92em] font-mono",
        "bg-(--accent-subtle) text-(--text-primary)",
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
