"use client";
import { useContentT, ImageLightbox } from './chunk-QEIBYOG2.js';
export { ImageLightbox } from './chunk-QEIBYOG2.js';
import { Alert } from './chunk-JPSTGXNM.js';
import { cn } from './chunk-AV5TGEJS.js';
import './chunk-3RT24MSH.js';
import * as React2 from 'react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { Edit3, Check, Copy, CheckCircle2, XOctagon, AlertTriangle, AlertCircle, Lightbulb, Info, ExternalLink, Link2 } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import katex from 'katex';

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
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}
function CodeBlock({
  children,
  language = "plaintext",
  showLineNumbers = false,
  highlightLines = [],
  filename,
  className,
  onEdit
}) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useIsDarkMode();
  const t = useContentT();
  const code = useMemo(
    () => typeof children === "string" ? children.trim() : String(children).trim(),
    [children]
  );
  const displayLanguage = languageNames[language?.toLowerCase()] || language?.toUpperCase() || "CODE";
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
        const { codeToHtml } = await import('shiki');
        const theme = isDark ? "github-dark" : "github-light";
        const lang = language?.toLowerCase() || "plaintext";
        const html = await codeToHtml(code, {
          lang,
          theme,
          transformers: [
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
            `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
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
      setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
  };
  const btnBase = "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "card group my-4 overflow-hidden max-w-full min-w-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-(--border-hairline) bg-(--bg-elevated)", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--error) opacity-80" }),
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--warning) opacity-80" }),
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--success) opacity-80" })
            ] }),
            filename ? /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-(--text-secondary) font-mono", children: filename }) : /* @__PURE__ */ jsx("span", { className: "badge text-xs", children: displayLanguage })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            onEdit && /* @__PURE__ */ jsxs("button", { onClick: handleEdit, className: cn(btnBase, "text-(--text-tertiary)"), children: [
              /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
              t("edit", "Edit")
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: handleCopy, className: btnBase, children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-(--success)" }),
              /* @__PURE__ */ jsx("span", { className: "text-(--success)", children: t("copied", "Copied") })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5 text-(--text-tertiary)" }),
              /* @__PURE__ */ jsx("span", { className: "text-(--text-tertiary)", children: t("copy", "Copy") })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "overflow-x-auto overflow-y-auto p-4 max-h-100 bg-(--bg-base)",
              showLineNumbers && "code-with-line-numbers"
            ),
            children: isLoading ? /* @__PURE__ */ jsx("pre", { className: "text-sm font-mono", children: /* @__PURE__ */ jsx("code", { children: code }) }) : /* @__PURE__ */ jsx(
              "div",
              {
                className: "shiki-wrapper text-sm [&_pre]:bg-transparent! [&_code]:bg-transparent!",
                dangerouslySetInnerHTML: { __html: highlightedCode }
              }
            )
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
        "px-1.5 py-0.5 mx-0.5 rounded text-sm font-mono",
        "bg-(--accent-subtle) text-(--text-primary) border border-(--border-hairline)",
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
  const [themeTick, setThemeTick] = useState(0);
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
        const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
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
  }, [chart, themeTick]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => setThemeTick((n) => n + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);
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
              /* @__PURE__ */ jsx("pre", { className: "mt-2 p-2 bg-(--bg-elevated) rounded text-xs overflow-auto", children: chart })
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
        role: enableZoom ? "button" : void 0,
        "aria-label": enableZoom ? t("zoomDiagram", "Zoom diagram") : void 0,
        className: cn(
          "card my-4 p-4 overflow-x-auto",
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
  className,
  alt = "",
  src,
  onError,
  onLoad,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);
  const t = useContentT();
  const srcString = typeof src === "string" ? src : "";
  const valid = srcString && srcString !== "#" && srcString !== "undefined" && srcString !== "null";
  useEffect(() => {
    if (!wrapperRef.current || !valid) return;
    const container = document.querySelector('[data-scroll-container="true"]');
    const root = container && container.contains(wrapperRef.current) ? container : null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = srcString;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
        rootMargin: "300px 0px",
        threshold: 0.01
      }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [srcString, valid]);
  if (!valid) return null;
  if (failed) {
    return /* @__PURE__ */ jsx("span", { className: "inline-block", children: /* @__PURE__ */ jsx("span", { className: "bg-error-soft px-3 py-2 rounded-xl border border-error-soft text-center", children: /* @__PURE__ */ jsxs("span", { className: "text-error text-sm", children: [
      "\u{1F5BC}\uFE0F ",
      t("imageLoadingFailed", "Image failed to load")
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: wrapperRef,
      className: "inline-block max-w-full overflow-hidden relative",
      style: {
        minHeight: loaded ? "auto" : "200px",
        minWidth: loaded ? "auto" : "200px"
      },
      children: [
        !loaded && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 flex items-center justify-center bg-(--bg-elevated) rounded-xl", children: /* @__PURE__ */ jsx("span", { className: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin block" }) }),
        /* @__PURE__ */ jsx(
          "img",
          {
            ref: imgRef,
            alt,
            className: cn(
              "max-w-full h-auto rounded-xl shadow-sm border border-(--border-hairline) transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
              enableLightbox && loaded && "cursor-zoom-in",
              className
            ),
            style: { maxHeight: "80vh" },
            onLoad: (e) => {
              setLoaded(true);
              onLoad?.(e);
            },
            onError: (e) => {
              setFailed(true);
              onError?.(e);
            },
            onClick: enableLightbox ? () => setLightboxOpen(true) : void 0,
            ...rest
          }
        ),
        enableLightbox && /* @__PURE__ */ jsx(
          ImageLightbox,
          {
            src: srcString,
            alt,
            isOpen: lightboxOpen,
            onClose: () => setLightboxOpen(false)
          }
        )
      ]
    }
  );
});
function MarkdownRenderer({
  content,
  className,
  urlTransform,
  onCodeEdit
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
      h2: ({ children, id }) => /* @__PURE__ */ jsxs(
        "h2",
        {
          id,
          className: "group flex items-center gap-2 text-xl font-bold mt-6 mb-3 scroll-mt-20",
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
        const codeString = String(children).replace(/\n$/, "");
        if (language === "mermaid") {
          return /* @__PURE__ */ jsx(MermaidDiagram, { chart: codeString });
        }
        if (codeClass || codeString.includes("\n")) {
          const showLineNumbers = codeClass?.includes("showLineNumbers");
          const highlightMatch = codeClass?.match(/\{([^}]+)\}/);
          const highlightLines = highlightMatch ? parseLineHighlights(highlightMatch[1]) : [];
          return /* @__PURE__ */ jsx(
            CodeBlock,
            {
              language,
              showLineNumbers,
              highlightLines,
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
      a: ({ href, children, ...props }) => {
        const host = typeof window !== "undefined" ? window.location.host : "";
        const isExternal = href?.startsWith("http") && !href?.includes(host);
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
      table: ({ children }) => /* @__PURE__ */ jsx("div", { className: "card my-4 overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "min-w-full divide-y divide-(--border-hairline)", children }) }),
      thead: ({ children }) => /* @__PURE__ */ jsx("thead", { className: "bg-(--bg-elevated)", children }),
      th: ({ children }) => /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-sm font-semibold text-(--text-primary)", children }),
      td: ({ children }) => /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-sm border-t border-(--border-hairline)", children }),
      ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "my-3 ml-6 list-disc space-y-1 [&>li]:pl-1", children }),
      ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "my-3 ml-6 list-decimal space-y-1 [&>li]:pl-1", children }),
      li: ({ children, className: liClass }) => {
        const isTaskItem = liClass?.includes("task-list-item");
        return /* @__PURE__ */ jsx(
          "li",
          {
            className: cn(
              "leading-relaxed",
              isTaskItem && "list-none -ml-6 flex items-start gap-2"
            ),
            children
          }
        );
      },
      input: ({ type, checked, ...props }) => {
        if (type === "checkbox") {
          return /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked,
              readOnly: true,
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
    [onCodeEdit]
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
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeRaw, rehypeKatex, rehypeSlug],
          urlTransform,
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
        "opacity-0 group-hover:opacity-100 transition-opacity",
        "text-(--text-tertiary) hover:text-(--text-primary)",
        copied && "text-success"
      ),
      "aria-label": t("linkToHeading", "Copy link to this heading"),
      children: /* @__PURE__ */ jsx(Link2, { className: "w-4 h-4" })
    }
  );
}
function parseLineHighlights(input) {
  const lines = [];
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
        errorColor: "#cc0000",
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

export { BlockMath, CalloutBlock, CodeBlock, ContentImage, InlineCode, InlineMath, MarkdownRenderer, MathRenderer, MermaidDiagram, parseCalloutType };
//# sourceMappingURL=content.js.map
//# sourceMappingURL=content.js.map