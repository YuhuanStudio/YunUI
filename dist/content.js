"use client";
import { useContentT, ImageLightbox, codeLineCount, previewCode, codeLineCountLabel, restoreCodeBlockScroll, scheduleCodeBlockScrollRestore, CODE_BLOCK_FOLD_THRESHOLD, captureCodeBlockScroll } from './chunk-7ODIO7IG.js';
export { ImageLightbox } from './chunk-7ODIO7IG.js';
import { copyToClipboard } from './chunk-P6LU2FWV.js';
import { cn, Alert, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './chunk-ALP6SDRA.js';
import './chunk-3RT24MSH.js';
import * as React2 from 'react';
import { useRef, useState, useEffect, useId, useMemo, useCallback, useLayoutEffect } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { Edit3, Check, Copy, CheckCircle2, XOctagon, AlertTriangle, AlertCircle, Lightbulb, Info, ExternalLink, Link2 } from 'lucide-react';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import katex from 'katex';

function useContentDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      const theme = root.getAttribute("data-theme");
      setDark(root.classList.contains("dark") || root.classList.contains("true-black") || theme === "dark" || theme === "true-black");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}
var NO_HIGHLIGHT_LINES = [];
var useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
var languageNames = {
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
  text: "Plain Text"
};
var langExtMap = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  bash: "sh",
  shell: "sh",
  markdown: "md"
};
var shikiLanguages = {
  bash: () => import('shiki/langs/bash.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  dockerfile: () => import('shiki/langs/dockerfile.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  powershell: () => import('shiki/langs/powershell.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  sass: () => import('shiki/langs/sass.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  svelte: () => import('shiki/langs/svelte.mjs'),
  swift: () => import('shiki/langs/swift.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  xml: () => import('shiki/langs/xml.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs')
};
var shikiLanguageAliases = {
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
  zsh: "bash"
};
var shikiThemes = {
  "github-dark-default": () => import('shiki/themes/github-dark-default.mjs'),
  "github-light-default": () => import('shiki/themes/github-light-default.mjs')
};
var contentHighlighterPromise;
var languageLoadPromises = /* @__PURE__ */ new Map();
var themeLoadPromises = /* @__PURE__ */ new Map();
function getContentHighlighter() {
  contentHighlighterPromise ??= createHighlighterCore({
    // The JavaScript regex engine avoids a WASM payload and is sufficient for
    // browser-side highlighting of the curated grammar set above.
    engine: createJavaScriptRegexEngine()
  });
  return contentHighlighterPromise;
}
async function ensureLanguage(highlighter, language) {
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
async function ensureTheme(highlighter, theme) {
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
async function highlightToHtml(code, options) {
  const highlighter = await getContentHighlighter();
  const language = options.lang;
  const theme = options.theme;
  await Promise.all([
    ensureLanguage(highlighter, language),
    ensureTheme(highlighter, theme)
  ]);
  return highlighter.codeToHtml(code, options);
}
function resolveShikiLanguage(language) {
  const normalized = language.trim().toLowerCase();
  if (!normalized || normalized === "text" || normalized === "plaintext") {
    return "plaintext";
  }
  if (Object.prototype.hasOwnProperty.call(shikiLanguages, normalized)) return normalized;
  return Object.prototype.hasOwnProperty.call(shikiLanguageAliases, normalized) ? shikiLanguageAliases[normalized] : "plaintext";
}
function CodeBlock({
  children,
  language = "plaintext",
  showLineNumbers = false,
  highlightLines = NO_HIGHLIGHT_LINES,
  filename,
  className,
  onEdit
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useContentDarkMode();
  const t = useContentT();
  const copyRequestRef = useRef(0);
  const copyTimeoutRef = useRef(null);
  const codeSurfaceRef = useRef(null);
  const copyButtonRef = useRef(null);
  const disclosureRef = useRef(null);
  const restoreExpandedFocus = useRef(false);
  const restoreDisclosureFocus = useRef(false);
  const disclosureScroll = useRef(null);
  const codeBlockId = useId();
  const code = useMemo(
    () => typeof children === "string" ? children : String(children),
    [children]
  );
  const previousCopyPayloadRef = useRef(code);
  const lineCount = codeLineCount(code);
  const foldable = lineCount > CODE_BLOCK_FOLD_THRESHOLD;
  const shownCode = foldable && !expanded ? previewCode(code) : code;
  const displayLanguage = (Object.prototype.hasOwnProperty.call(languageNames, language.toLowerCase()) ? languageNames[language.toLowerCase()] : language.toUpperCase()) || "CODE";
  const codeRegionLabel = t(
    "codeBlock.scrollRegion",
    `${displayLanguage} code, ${codeLineCountLabel(lineCount)}`,
    { language: displayLanguage, count: lineCount }
  );
  const copyFullLabel = t("codeBlock.copyFull", "Copy full code");
  const editLabel = t("edit", "Edit");
  const copyErrorLabel = t(
    "codeBlock.copyError",
    "Clipboard access was denied. Select the code and copy it manually."
  );
  const scrollCueLabel = t("codeBlock.scrollHorizontally", "Scroll horizontally");
  const showAllLabel = t(
    "codeBlock.showAll",
    `Show all ${lineCount} lines`,
    { count: lineCount }
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
              }
            },
            {
              line(node, line) {
                if (showLineNumbers) node.properties["data-line"] = line;
                if (highlightLines.includes(line)) {
                  node.properties["class"] = `${node.properties["class"] || ""} highlighted-line`;
                }
              }
            }
          ]
        });
        if (!cancelled) {
          setHighlightedCode(html);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHighlightedCode(
            `<pre class="shiki yunui-code-scroll" tabindex="0" aria-label="${escapeHtml(codeRegionLabel)}"><code>${escapeHtml(shownCode)}</code></pre>`
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
    if (!await copyToClipboard(payload)) {
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
    }, 2e3);
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
      const codeRegion = codeSurfaceRef.current?.querySelector("pre.yunui-code-scroll");
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
  const handleCodeKeyDown = useCallback((event) => {
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
  const btnBase = "inline-flex min-h-6 shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "my-3 w-full min-w-0 overflow-hidden rounded-lg border border-(--border-hairline) bg-(--bg-base)",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-(--border-hairline) bg-(--bg-elevated) px-2 py-1.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "min-w-0 flex-1 truncate font-mono text-xs font-medium text-(--text-secondary)",
                filename && "min-w-32",
                !filename && "font-sans"
              ),
              title: filename || displayLanguage,
              children: filename || displayLanguage
            }
          ),
          filename && /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded bg-(--bg-base) px-1.5 py-0.5 text-[10px] text-(--text-tertiary)", children: displayLanguage }),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] text-(--text-secondary)", children: t("codeBlock.lineCount", codeLineCountLabel(lineCount), { count: lineCount }) }),
          code.split("\n").some((line) => line.length > 72) && /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-[10px] text-(--text-secondary)", children: [
            scrollCueLabel,
            " ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2192" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-1", children: [
            onEdit && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleEdit,
                className: btnBase,
                "aria-label": editLabel,
                children: [
                  /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
                  editLabel
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                ref: copyButtonRef,
                type: "button",
                onClick: handleCopy,
                className: btnBase,
                "aria-label": copied ? t("codeBlock.copied", t("copied", "Copied")) : copyFullLabel,
                children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-(--success)" }),
                  /* @__PURE__ */ jsx("span", { className: "text-(--success)", children: t("copied", "Copied") })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5 text-(--text-secondary)" }),
                  /* @__PURE__ */ jsx("span", { className: "text-(--text-secondary)", children: t("copy", "Copy") })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: codeSurfaceRef,
            id: `${codeBlockId}-code`,
            onKeyDownCapture: handleCodeKeyDown,
            className: cn("min-w-0 px-2 py-2", showLineNumbers && "code-with-line-numbers"),
            children: isLoading ? /* @__PURE__ */ jsx(
              "pre",
              {
                className: "yunui-code-scroll text-sm font-mono",
                tabIndex: 0,
                "aria-label": codeRegionLabel,
                children: /* @__PURE__ */ jsx("code", { children: shownCode })
              }
            ) : /* @__PURE__ */ jsx(
              "div",
              {
                className: "shiki-wrapper text-sm [&_pre]:bg-transparent! [&_code]:bg-transparent!",
                dangerouslySetInnerHTML: { __html: highlightedCode }
              }
            )
          }
        ),
        copyError && /* @__PURE__ */ jsx("p", { role: "alert", className: "border-t border-(--border-hairline) px-2 py-1 text-xs text-(--text-secondary)", children: copyErrorLabel }),
        foldable && /* @__PURE__ */ jsx(
          "button",
          {
            ref: disclosureRef,
            type: "button",
            "aria-expanded": expanded,
            "aria-controls": `${codeBlockId}-code`,
            onClick: toggleExpanded,
            className: "flex min-h-7 w-full items-center border-t border-(--border-hairline) px-2 py-1 text-left text-xs text-(--text-secondary) transition-colors hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            children: expanded ? showLessLabel : showAllLabel
          }
        )
      ]
    }
  );
}
function InlineCode({
  children,
  className
}) {
  return /* @__PURE__ */ jsx(
    "code",
    {
      className: cn(
        "yunui-inline-code px-[3px] py-px rounded-sm text-[0.92em] font-mono",
        "bg-(--accent-subtle) text-(--text-primary)",
        "wrap-break-word",
        className
      ),
      children
    }
  );
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var mermaidSeq = 0;
var NEEDS_MANUAL_ROUGHENING = /* @__PURE__ */ new Set([
  "sequenceDiagram",
  "gantt",
  "pie",
  "journey",
  "gitGraph",
  "timeline",
  "mindmap",
  "quadrantChart",
  "xychart-beta",
  "sankey-beta",
  "packet-beta"
]);
function diagramType(chart) {
  const lines = chart.trim().split("\n");
  let i = 0;
  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") i++;
    i++;
  }
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith("%%")) continue;
    return l.split(/[\s:({]/)[0];
  }
  return "";
}
function needsManualRoughening(chart) {
  return NEEDS_MANUAL_ROUGHENING.has(diagramType(chart));
}
function roughenSvg(svg, id) {
  const vb = svg.match(/viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/);
  if (!vb) return svg;
  const [, mx, my, w, h] = vb.map(Number);
  const pad = 12;
  const fid = `${id}-rough`;
  const defs = `<defs><filter id="${fid}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="${mx - pad}" y="${my - pad}" width="${w + pad * 2}" height="${h + pad * 2}"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter></defs><style>#${id} path,#${id} rect,#${id} circle,#${id} ellipse,#${id} line,#${id} polygon,#${id} polyline{filter:url(#${fid})}#${id} text,#${id} tspan{filter:none}</style>`;
  return svg.replace(/(<svg\b[^>]*>)/, `$1${defs}`);
}
function MermaidDiagram({
  chart,
  className,
  enableZoom = true
}) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useContentDarkMode();
  const [zoomOpen, setZoomOpen] = useState(false);
  const t = useContentT();
  useEffect(() => {
    let cancelled = false;
    async function renderDiagram() {
      setIsLoading(true);
      setError("");
      const diagramId = `yunui-mermaid-${mermaidSeq += 1}`;
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          // Native rough.js hand-drawn look — clean output for the types it
          // supports (flowchart, state, class, ER, requirement, C4, block…).
          look: "handDrawn",
          handDrawnSeed: 1,
          // "strict" (not "loose"): diagram source here is untrusted LLM/chat output.
          // "loose" enables HTML labels + relaxes Mermaid's internal DOMPurify, so a
          // label like <img src=x onerror=...> executes when the SVG is injected via
          // dangerouslySetInnerHTML. "strict" sanitizes labels and disables htmlLabels.
          securityLevel: "strict",
          fontFamily: '"Comic Sans MS", "Segoe Print", ui-rounded, system-ui, sans-serif',
          flowchart: { curve: "basis", padding: 20 },
          sequence: { diagramMarginX: 20, diagramMarginY: 20 },
          gantt: { barHeight: 20, barGap: 4 }
        });
        const { svg: renderedSvg } = await mermaid.render(diagramId, chart.trim());
        if (!cancelled) {
          setSvg(
            needsManualRoughening(chart) ? roughenSvg(renderedSvg, diagramId) : renderedSvg
          );
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t("diagramRenderFailed", "Failed to render diagram")
          );
          setIsLoading(false);
        }
      }
    }
    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart, isDark]);
  if (error) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "my-4 p-4 rounded-xl border bg-error-soft border-error-soft",
          className
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-error", children: "\u26A0\uFE0F" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-error", children: t("mermaidError", "Diagram error") }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-(--text-tertiary) mt-1", children: error }),
            /* @__PURE__ */ jsxs("details", { className: "mt-2", children: [
              /* @__PURE__ */ jsx("summary", { className: "text-xs text-(--text-tertiary) cursor-pointer hover:text-(--text-primary)", children: t("viewSource", "View source") }),
              /* @__PURE__ */ jsx("pre", { className: "mt-2 p-2 bg-(--bg-elevated) rounded text-xs overflow-auto", tabIndex: 0, children: chart })
            ] })
          ] })
        ] })
      }
    );
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "card my-4 p-8 flex items-center justify-center",
          className
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-(--text-tertiary)", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("renderingDiagram", "Rendering diagram\u2026") })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        onClick: enableZoom ? () => setZoomOpen(true) : void 0,
        onKeyDown: enableZoom ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setZoomOpen(true);
          }
        } : void 0,
        role: enableZoom ? "button" : void 0,
        "aria-label": enableZoom ? t("zoomDiagram", "Zoom diagram") : void 0,
        tabIndex: 0,
        className: cn(
          "mermaid-container card my-4 p-4 overflow-x-auto",
          "flex items-center justify-center",
          "[&_svg]:max-w-full [&_svg]:h-auto",
          enableZoom && "cursor-zoom-in",
          className
        ),
        dangerouslySetInnerHTML: { __html: svg }
      }
    ),
    enableZoom && /* @__PURE__ */ jsx(ImageLightbox, { isOpen: zoomOpen, onClose: () => setZoomOpen(false), children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-(--bg-card) rounded-2xl p-6 shadow-2xl border border-white/10 w-[86vw] max-w-[1100px] [&_svg]:!max-w-none [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[80vh]",
        dangerouslySetInnerHTML: { __html: svg }
      }
    ) })
  ] });
}
var config = {
  note: { variant: "info", icon: Info },
  tip: { variant: "success", icon: Lightbulb },
  important: { variant: "accent", icon: AlertCircle },
  warning: { variant: "warning", icon: AlertTriangle },
  caution: { variant: "error", icon: XOctagon },
  success: { variant: "success", icon: CheckCircle2 }
};
var defaultTitles = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  success: "Success"
};
function CalloutBlock({
  type,
  title,
  children,
  className
}) {
  const t = useContentT();
  const c = config[type] || config.note;
  const Icon = c.icon;
  const displayTitle = title || t(type, defaultTitles[type] || defaultTitles.note);
  return /* @__PURE__ */ jsx(
    Alert,
    {
      variant: c.variant,
      title: displayTitle,
      icon: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
      className: cn("my-4 not-prose", className),
      children: /* @__PURE__ */ jsx("div", { className: "[&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0", children })
    }
  );
}
function parseCalloutType(text) {
  const match = text.match(
    /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS)\](?:\s+(.+))?$/i
  );
  if (match) {
    return {
      type: match[1].toLowerCase(),
      title: match[2] || null
    };
  }
  return { type: null, title: null };
}
var ContentImage = React2.memo(function ContentImage2({
  enableLightbox = true,
  zoomLabel,
  className,
  style,
  alt = "",
  src,
  srcSet,
  onError,
  onLoad,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  ...rest
}) {
  const t = useContentT();
  const srcString = typeof src === "string" ? src : "";
  const srcSetString = typeof srcSet === "string" ? srcSet : void 0;
  const valid = Boolean(srcString && srcString !== "#" && srcString !== "undefined" && srcString !== "null");
  const generationRef = useRef({ src: srcString, srcSet: srcSetString, generation: 0 });
  if (generationRef.current.src !== srcString || generationRef.current.srcSet !== srcSetString) {
    generationRef.current = {
      src: srcString,
      srcSet: srcSetString,
      generation: generationRef.current.generation + 1
    };
  }
  const generation = generationRef.current.generation;
  const lightboxEpochRef = useRef({ enabled: enableLightbox, epoch: 0 });
  if (lightboxEpochRef.current.enabled !== enableLightbox) {
    lightboxEpochRef.current = {
      enabled: enableLightbox,
      epoch: lightboxEpochRef.current.epoch + 1
    };
  }
  const lightboxEpoch = lightboxEpochRef.current.epoch;
  const [status, setStatus] = useState(null);
  const [requestedGeneration, setRequestedGeneration] = useState(null);
  const [openState, setOpenState] = useState(null);
  const [insideLink, setInsideLink] = useState(false);
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);
  const currentStatus = status?.generation === generation ? status.value : "loading";
  const loaded = currentStatus === "loaded";
  const failed = currentStatus === "failed";
  const canZoom = enableLightbox && loaded && !insideLink;
  const lightboxOpen = enableLightbox && openState?.generation === generation && openState.lightboxEpoch === lightboxEpoch;
  const accessibleZoomLabel = zoomLabel ?? `${t("zoomImage", "Zoom image")}${alt ? `: ${alt}` : ""}`;
  useEffect(() => {
    setInsideLink(Boolean(imgRef.current?.closest("a")));
    if (!wrapperRef.current || !valid) return;
    const root = wrapperRef.current.closest('[data-scroll-container="true"]');
    const image = imgRef.current;
    if (!image) return;
    if (typeof IntersectionObserver === "undefined") {
      setRequestedGeneration(generation);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (generationRef.current.generation !== generation || !image.isConnected) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRequestedGeneration(generation);
            observer.unobserve(entry.target);
            break;
          }
        }
      },
      { root, rootMargin: "300px 0px", threshold: 0.01 }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [srcString, valid, generation]);
  if (!valid) return null;
  const isCurrentImage = (event) => generationRef.current.generation === generation && event.currentTarget === imgRef.current;
  const handleLoad = (event) => {
    onLoad?.(event);
    if (isCurrentImage(event)) setStatus({ generation, value: "loaded" });
  };
  const handleError = (event) => {
    onError?.(event);
    if (isCurrentImage(event)) setStatus({ generation, value: "failed" });
  };
  const openPreview = (event) => {
    if (onClick) onClick(event);
    if (event.defaultPrevented || !canZoom || imgRef.current?.closest("a")) return;
    event.currentTarget.focus();
    event.stopPropagation();
    setOpenState({ generation, lightboxEpoch });
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !canZoom || imgRef.current?.closest("a")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.focus();
      setOpenState({ generation, lightboxEpoch });
    }
  };
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: wrapperRef,
      className: "inline-block max-w-full overflow-hidden relative",
      style: {
        minHeight: loaded || failed ? "auto" : "200px",
        minWidth: loaded || failed ? "auto" : "200px"
      },
      children: [
        !loaded && !failed && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 flex items-center justify-center bg-(--bg-elevated) rounded-xl", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" }) }),
        failed && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center bg-error-soft px-3 py-2 rounded-xl border border-error-soft text-center", children: /* @__PURE__ */ jsxs("span", { className: "text-error text-sm", children: [
          "\u{1F5BC}\uFE0F ",
          t("imageLoadingFailed", "Image failed to load")
        ] }) }),
        /* @__PURE__ */ jsx(
          "img",
          {
            ref: imgRef,
            alt,
            src: requestedGeneration === generation ? srcString : void 0,
            srcSet: requestedGeneration === generation ? srcSetString : void 0,
            className: cn(
              "max-w-full h-auto rounded-xl shadow-sm border border-(--border-hairline) transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
              canZoom && "cursor-zoom-in",
              canZoom && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
              failed && "hidden",
              className
            ),
            style: { ...style, maxHeight: style?.maxHeight ?? "80vh" },
            role: loaded && !failed ? role ?? (canZoom ? "button" : void 0) : void 0,
            tabIndex: loaded && !failed ? tabIndex ?? (canZoom ? 0 : void 0) : void 0,
            "aria-label": ariaLabel ?? (canZoom ? accessibleZoomLabel : void 0),
            onLoad: handleLoad,
            onError: handleError,
            onClick: openPreview,
            onKeyDown: handleKeyDown,
            ...rest
          },
          generation
        ),
        enableLightbox && /* @__PURE__ */ jsx(
          ImageLightbox,
          {
            src: srcString,
            alt,
            label: t("imagePreview", "Image preview") + (alt ? `: ${alt}` : ""),
            isOpen: lightboxOpen,
            onClose: () => setOpenState(null)
          }
        )
      ]
    }
  );
});
var schema = {
  ...defaultSchema,
  clobberPrefix: "user-content-",
  tagNames: [...defaultSchema.tagNames ?? [], "mark", "abbr"],
  strip: [...defaultSchema.strip ?? [], "style", "iframe", "object", "embed", "svg", "math", "template", "form"],
  attributes: {
    ...defaultSchema.attributes,
    "*": (defaultSchema.attributes?.["*"] ?? []).filter((attribute) => attribute !== "tabIndex" && attribute !== "accessKey"),
    code: [[
      "className",
      /^language-[\w+-]+$/,
      "math-inline",
      "math-display",
      "showLineNumbers",
      /^\{[\d,-]+\}$/,
      /^filename-[A-Za-z0-9._~%\-]{1,1152}$/
    ]]
  }
};
function visit(node, callback) {
  callback(node);
  if ("children" in node) for (const child of node.children) visit(child, callback);
}
function rehypeSanitizeMarkdown() {
  const sanitize = rehypeSanitize(schema);
  return (tree) => {
    const ids = /* @__PURE__ */ new Set();
    visit(tree, (node) => {
      if (node.type === "element") {
        for (const key of ["id", "name"]) {
          const value = node.properties[key];
          if (typeof value === "string") ids.add(value);
        }
      }
    });
    const clean = sanitize(tree);
    const cleanIds = /* @__PURE__ */ new Set();
    visit(clean, (node) => {
      if (node.type !== "element") return;
      for (const key of ["id", "name"]) {
        const value = node.properties[key];
        if (typeof value === "string") cleanIds.add(value);
      }
    });
    visit(clean, (node) => {
      if (node.type !== "element") return;
      const href = node.properties.href;
      if (typeof href !== "string" || !href.startsWith("#")) return;
      let target;
      try {
        target = decodeURIComponent(href.slice(1));
      } catch {
        return;
      }
      const prefixed = `${schema.clobberPrefix}${target}`;
      if (ids.has(target) && cleanIds.has(prefixed)) node.properties.href = `#${encodeURIComponent(prefixed)}`;
    });
    return clean;
  };
}

// src/content/remark-code-meta.ts
var MAX_META_LENGTH = 1024;
var MAX_FILENAME_LENGTH = 128;
var MAX_HIGHLIGHT_RANGES = 32;
var filenameClassPattern = /^filename-[A-Za-z0-9._~%\-]{1,1152}$/;
var languagePattern = /^[A-Za-z0-9_+-]{1,32}$/;
var highlightPattern = /^\{((?:\d{1,16}(?:-\d{1,16})?)(?:,\d{1,16}(?:-\d{1,16})?)*)\}$/;
var controlCharacterPattern = /[\u0000-\u001f\u007f]/;
function tokenizeMeta(meta) {
  if (meta.length > MAX_META_LENGTH) return [];
  const tokens = [];
  let token = "";
  let quote;
  let tokenStarted = false;
  const finishToken = () => {
    if (tokenStarted) tokens.push(token);
    token = "";
    tokenStarted = false;
  };
  for (let index = 0; index < meta.length; index += 1) {
    const character = meta[index];
    if (quote) {
      if (character === "\\" && index + 1 < meta.length) {
        const next = meta[index + 1];
        if (next === quote || next === "\\") {
          token += next;
          index += 1;
        } else {
          token += character;
        }
      } else if (character === quote) {
        quote = void 0;
      } else {
        token += character;
      }
      tokenStarted = true;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      tokenStarted = true;
    } else if (/\s/.test(character)) {
      finishToken();
    } else {
      token += character;
      tokenStarted = true;
    }
  }
  if (!quote) finishToken();
  return tokens;
}
function isHighlightRange(value) {
  const match = highlightPattern.exec(value);
  return Boolean(match && match[1].split(",").length <= MAX_HIGHLIGHT_RANGES);
}
function encodeFilename(value) {
  if (!value || value.length > MAX_FILENAME_LENGTH || controlCharacterPattern.test(value)) return void 0;
  try {
    const encoded = encodeURIComponent(value).replace(
      /[!'()*]/g,
      (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
    );
    return encoded.length <= MAX_FILENAME_LENGTH * 9 ? encoded : void 0;
  } catch {
    return void 0;
  }
}
function decodeCodeFilenameClass(value) {
  if (!filenameClassPattern.test(value)) return void 0;
  try {
    const filename = decodeURIComponent(value.slice("filename-".length));
    if (!filename || filename.length > MAX_FILENAME_LENGTH || controlCharacterPattern.test(filename)) return void 0;
    return filename;
  } catch {
    return void 0;
  }
}
function parseFenceOptions(meta) {
  const options = { showLineNumbers: false };
  for (const token of tokenizeMeta(meta)) {
    if (token === "showLineNumbers") {
      options.showLineNumbers = true;
    } else if (!options.highlightRange && isHighlightRange(token)) {
      options.highlightRange = token;
    } else if (!options.filename && token.startsWith("filename=")) {
      const encoded = encodeFilename(token.slice("filename=".length));
      if (encoded) options.filename = encoded;
    }
  }
  return options;
}
function visit2(node, callback) {
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit2(child, callback);
  }
}
function remarkCodeMeta() {
  return (tree) => {
    visit2(tree, (node) => {
      if (node.type !== "code" || typeof node.meta !== "string") return;
      const options = parseFenceOptions(node.meta);
      if (!options.showLineNumbers && !options.highlightRange && !options.filename) return;
      const className = [];
      if (typeof node.lang === "string") {
        const language = node.lang.trim().split(/\s+/)[0];
        if (languagePattern.test(language)) className.push(`language-${language}`);
      }
      if (options.showLineNumbers) className.push("showLineNumbers");
      if (options.highlightRange) className.push(options.highlightRange);
      if (options.filename) className.push(`filename-${options.filename}`);
      const existing = node.data && typeof node.data === "object" ? node.data : {};
      node.data = {
        ...existing,
        hProperties: { className }
      };
    });
  };
}
function MarkdownRenderer({
  content,
  className,
  urlTransform,
  linkOrigin,
  onCodeEdit,
  renderLink
}) {
  const components = useMemo(
    () => ({
      p: ({ children }) => /* @__PURE__ */ jsx("div", { className: "mb-4 last:mb-0 leading-relaxed", children }),
      h1: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h1",
        {
          id,
          className: "group flex items-center gap-2 text-2xl font-bold mt-8 mb-4 first:mt-0 scroll-mt-20",
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      h2: ({ children, id, className: headingClass }) => /* @__PURE__ */ jsxs(
        "h2",
        {
          id,
          className: cn("group flex items-center gap-2 text-xl font-bold mt-6 mb-3 scroll-mt-20", headingClass),
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      h3: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h3",
        {
          id,
          className: "group flex items-center gap-2 text-lg font-semibold mt-5 mb-2 scroll-mt-20",
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      h4: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h4",
        {
          id,
          className: "group flex items-center gap-2 text-base font-semibold mt-4 mb-2 scroll-mt-20",
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      h5: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h5",
        {
          id,
          className: "group flex items-center gap-2 text-sm font-semibold mt-3 mb-1 scroll-mt-20",
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      h6: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h6",
        {
          id,
          className: "group flex items-center gap-2 text-sm font-medium mt-3 mb-1 scroll-mt-20",
          children: [
            children,
            id && /* @__PURE__ */ jsx(HeadingAnchor, { id })
          ]
        }
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: ({ children, className: codeClass }) => {
        const match = /language-(\w+)/.exec(codeClass || "");
        const language = match ? match[1] : "";
        const filenameClass = typeof codeClass === "string" ? codeClass.split(/\s+/).find((token) => token.startsWith("filename-")) : void 0;
        const filename = filenameClass ? decodeCodeFilenameClass(filenameClass) : void 0;
        const codeString = String(children).replace(/\n$/, "");
        if (language === "mermaid") {
          return /* @__PURE__ */ jsx(MermaidDiagram, { chart: codeString });
        }
        if (codeClass || codeString.includes("\n")) {
          const showLineNumbers = codeClass?.includes("showLineNumbers");
          const highlightMatch = codeClass?.match(/\{([^}]+)\}/);
          const highlightLines = highlightMatch ? parseLineHighlights(highlightMatch[1], codeString.split("\n").length) : [];
          return /* @__PURE__ */ jsx(
            CodeBlock,
            {
              language,
              showLineNumbers,
              highlightLines,
              filename,
              onEdit: onCodeEdit,
              children: codeString
            }
          );
        }
        return /* @__PURE__ */ jsx(InlineCode, { children });
      },
      pre: ({ children }) => /* @__PURE__ */ jsx(Fragment, { children }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      img: ({ node, ...props }) => /* @__PURE__ */ jsx(ContentImage, { ...props }),
      a: ({ href, children, node: _node, ...props }) => {
        let isExternal = Boolean(href && /^(https?:)?\/\//i.test(href));
        if (isExternal && linkOrigin) {
          try {
            isExternal = new URL(href, linkOrigin).origin !== new URL(linkOrigin).origin;
          } catch {
          }
        }
        const override = renderLink?.({ href, children, isExternal: Boolean(isExternal) });
        if (override !== void 0) return override;
        return /* @__PURE__ */ jsxs(
          "a",
          {
            href,
            target: isExternal ? "_blank" : void 0,
            rel: isExternal ? "noopener noreferrer" : void 0,
            className: "text-(--text-primary) underline decoration-(--border-default) underline-offset-2 hover:decoration-(--text-primary) inline-flex items-center gap-0.5",
            ...props,
            children: [
              children,
              isExternal && /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 inline-block ml-0.5" })
            ]
          }
        );
      },
      blockquote: ({ children }) => {
        const childArray = React2.Children.toArray(children);
        const firstEl = childArray.find((c) => React2.isValidElement(c));
        if (React2.isValidElement(firstEl)) {
          const paraKids = React2.Children.toArray(firstEl.props.children);
          const leadStr = typeof paraKids[0] === "string" ? paraKids[0] : "";
          const { type: calloutType, title } = parseCalloutType(
            leadStr.split("\n")[0].trim()
          );
          if (calloutType) {
            const rest = leadStr.includes("\n") ? leadStr.slice(leadStr.indexOf("\n") + 1) : "";
            const body = [rest, ...paraKids.slice(1)];
            const hasFirstPara = rest !== "" || paraKids.length > 1;
            const otherBlocks = childArray.filter(
              (c) => c !== firstEl && React2.isValidElement(c)
            );
            return /* @__PURE__ */ jsxs(CalloutBlock, { type: calloutType, title: title || void 0, children: [
              hasFirstPara && /* @__PURE__ */ jsx("p", { children: body }),
              otherBlocks
            ] });
          }
        }
        return /* @__PURE__ */ jsx("blockquote", { className: "border-l-4 border-(--border-default) pl-4 my-4 italic text-(--text-secondary)", children });
      },
      table: ({ children }) => /* @__PURE__ */ jsx("div", { className: "card my-4 overflow-x-auto", tabIndex: 0, children: /* @__PURE__ */ jsx("table", { className: "min-w-full divide-y divide-(--border-hairline)", children }) }),
      thead: ({ children }) => /* @__PURE__ */ jsx("thead", { className: "bg-(--bg-elevated)", children }),
      th: ({ children }) => /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-sm font-semibold text-(--text-primary)", children }),
      td: ({ children }) => /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-sm border-t border-(--border-hairline)", children }),
      ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "my-3 ml-6 list-disc space-y-1 [&>li]:pl-1", children }),
      ol: ({ children, start }) => /* @__PURE__ */ jsx("ol", { start, className: "my-3 ml-6 list-decimal space-y-1 [&>li]:pl-1", children }),
      li: ({ children, className: liClass, id }) => {
        const isTaskItem = liClass?.includes("task-list-item");
        return /* @__PURE__ */ jsx(
          "li",
          {
            id,
            className: cn(
              "leading-relaxed",
              isTaskItem && "list-none -ml-6 flex items-start gap-2"
            ),
            children
          }
        );
      },
      input: ({ node: _node, type, checked, ...props }) => {
        if (type === "checkbox") {
          return /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked,
              readOnly: true,
              "aria-hidden": "true",
              tabIndex: -1,
              className: "mt-1 h-4 w-4 rounded border-(--border-hairline) accent-(--accent) focus:ring-ring",
              ...props
            }
          );
        }
        return /* @__PURE__ */ jsx("input", { type, ...props });
      },
      hr: () => /* @__PURE__ */ jsx("hr", { className: "my-6 border-t border-(--border-hairline)" }),
      kbd: ({ children }) => /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 text-xs font-mono bg-(--bg-elevated) border border-(--border-default) rounded shadow-sm", children }),
      mark: ({ children }) => /* @__PURE__ */ jsx("mark", { className: "bg-warning-soft text-(--text-primary) px-0.5 rounded", children }),
      details: ({ children }) => /* @__PURE__ */ jsx("details", { className: "card my-4 overflow-hidden group", children }),
      summary: ({ children }) => /* @__PURE__ */ jsx("summary", { className: "px-4 py-3 cursor-pointer select-none font-medium hover:bg-(--accent-subtle) transition-colors", children }),
      abbr: ({ children, title }) => /* @__PURE__ */ jsx(
        "abbr",
        {
          title,
          className: "border-b border-dotted border-(--text-tertiary) cursor-help",
          children
        }
      ),
      sub: ({ children }) => /* @__PURE__ */ jsx("sub", { className: "text-xs", children }),
      sup: ({ children }) => /* @__PURE__ */ jsx("sup", { className: "text-xs", children }),
      del: ({ children }) => /* @__PURE__ */ jsx("del", { className: "text-(--text-tertiary) line-through", children })
    }),
    [onCodeEdit, renderLink, linkOrigin]
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        // NOT prose. This renderer styles every element itself via the component
        // map below, so Tailwind Typography would double-style everything — the
        // table got a second frame + 28px dead-space margin, callout titles got
        // shoved off their icon, and code blocks looked different inside prose vs
        // out. `not-prose` makes our mappings the single source of truth, even
        // when a host app wraps the output in `.prose`.
        "not-prose text-sm leading-relaxed text-(--text-primary)",
        className
      ),
      children: /* @__PURE__ */ jsx(
        ReactMarkdown,
        {
          remarkPlugins: [remarkGfm, remarkMath, remarkCodeMeta],
          rehypePlugins: [rehypeRaw, rehypeSlug, rehypeSanitizeMarkdown, rehypeKatex],
          urlTransform: (url) => defaultUrlTransform(urlTransform ? urlTransform(url) : url),
          components,
          children: content
        }
      )
    }
  );
}
function HeadingAnchor({ id }) {
  const [copied, setCopied] = useState(false);
  const t = useContentT();
  const handleClick = async (e) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      window.location.hash = id;
    }
  };
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: `#${id}`,
      onClick: handleClick,
      className: cn(
        "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity rounded outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "text-(--text-tertiary) hover:text-(--text-primary)",
        copied && "text-success"
      ),
      "aria-label": t("linkToHeading", "Copy link to this heading"),
      children: /* @__PURE__ */ jsx(Link2, { className: "w-4 h-4" })
    }
  );
}
function parseLineHighlights(input, lineCount) {
  const lines = /* @__PURE__ */ new Set();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map((n) => Number(n.trim()));
      if (Number.isSafeInteger(start) && Number.isSafeInteger(end) && start > 0 && end >= start) {
        for (let i = start; i <= Math.min(end, lineCount); i++) lines.add(i);
      }
    } else {
      const num = Number(trimmed);
      if (Number.isSafeInteger(num) && num > 0 && num <= lineCount) lines.add(num);
    }
  }
  return [...lines];
}
function MathRenderer({ math, block = false, className }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const t = useContentT();
  useEffect(() => {
    if (!containerRef.current) return;
    try {
      katex.render(math, containerRef.current, {
        displayMode: block,
        throwOnError: false,
        // KaTeX writes this straight into inline styles, so it cannot be a
        // class. Read the live token instead of hardcoding a red that matches
        // neither theme; fall back only if the stylesheet has not loaded.
        errorColor: typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--error").trim() || "#cc0000",
        strict: false,
        // trust:false — untrusted math must not enable \href{javascript:...},
        // \includegraphics, \htmlData etc. (KaTeX XSS surface).
        trust: false,
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}"
        }
      });
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("formulaRenderFailed", "Formula render failed")
      );
    }
  }, [math, block]);
  if (error) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "text-error bg-error-soft px-1 rounded",
          block ? "block my-2 p-2 text-center" : "inline",
          className
        ),
        children: /* @__PURE__ */ jsxs("span", { className: "text-xs", children: [
          "\u26A0\uFE0F ",
          error
        ] })
      }
    );
  }
  if (block) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        tabIndex: 0,
        className: cn(
          "my-4 py-4 overflow-x-auto text-center",
          "[&_.katex]:text-lg",
          className
        ),
        children: /* @__PURE__ */ jsx("span", { ref: containerRef })
      }
    );
  }
  return /* @__PURE__ */ jsx("span", { ref: containerRef, className: cn("inline-block align-middle", className) });
}
function InlineMath({ value }) {
  return /* @__PURE__ */ jsx(MathRenderer, { math: value, block: false });
}
function BlockMath({ value }) {
  return /* @__PURE__ */ jsx(MathRenderer, { math: value, block: true });
}
function InlineCitation({
  label,
  title,
  meta,
  description,
  icon,
  onOpen,
  className
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 180, children: /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "data-inline-citation": true,
        onClick: onOpen,
        className: cn(
          "mx-1 inline-flex h-6 max-w-40 translate-y-[1px] items-center gap-1 rounded-full",
          "border border-border/60 bg-muted/55 px-2 text-[11px] font-medium leading-none",
          "text-(--text-secondary) transition-colors hover:border-border hover:bg-muted hover:text-(--text-primary)",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className
        ),
        "aria-label": `${label}: ${title}${meta ? `, ${meta}` : ""}`,
        children: [
          icon ? /* @__PURE__ */ jsx("span", { className: "flex shrink-0 items-center", children: icon }) : null,
          /* @__PURE__ */ jsx("span", { className: "truncate", children: label })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "top",
        align: "start",
        sideOffset: 8,
        className: cn(
          "w-[min(340px,calc(100vw-24px))] rounded-2xl border border-border",
          // shadow-lg shadow-black/5 is the house overlay drop; shadow-xl was
          // heavier than every other popover in the system.
          "bg-popover p-3 text-popover-foreground shadow-lg shadow-black/5"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-2.5", children: [
          icon ? /* @__PURE__ */ jsx("span", { className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted", children: icon }) : null,
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 text-xs font-semibold leading-snug", children: title }),
              onOpen ? /* @__PURE__ */ jsx(ExternalLink, { "aria-hidden": true, className: "mt-0.5 h-3 w-3 shrink-0 text-(--text-tertiary)" }) : null
            ] }),
            meta ? /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[10px] text-(--text-tertiary)", children: meta }) : null,
            description ? /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-4 text-[11px] font-normal leading-relaxed text-(--text-secondary)", children: description }) : null
          ] })
        ] })
      }
    )
  ] }) });
}

export { BlockMath, CalloutBlock, CodeBlock, ContentImage, InlineCitation, InlineCode, InlineMath, MarkdownRenderer, MathRenderer, MermaidDiagram, parseCalloutType };
//# sourceMappingURL=content.js.map
//# sourceMappingURL=content.js.map