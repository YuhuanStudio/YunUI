"use client";
import './chunk-Q6DTMV2C.js';
import { capabilityBadgeColor, capabilityIconColor, copyToClipboard } from './chunk-HJ6AUOR7.js';
export { Footer } from './chunk-HJ6AUOR7.js';
import './chunk-VJ4AIGVS.js';
import { ImageLightbox } from './chunk-QEIBYOG2.js';
import { Button, Card, Badge, Avatar, AvatarImage, AvatarFallback, IconButton, Spinner, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './chunk-BLFFI7N3.js';
import { cn } from './chunk-YLY2GQ3R.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AlertCircle, RefreshCw, Check, Copy, Plus, FileText, ExternalLink, Calendar, Clock, User, ChevronLeft, ChevronRight, ArrowUp, PanelLeftClose, X, ArrowUpRight, ArrowDownRight, GraduationCap, ArrowRight, Award, Waves, SlidersHorizontal, Layers, Fingerprint, Ban, Image, Brain, Eye, Code, MessageSquare, XCircle, Zap, CheckCircle, FileCode, EyeOff, Sparkles, Globe, Loader2, LogOut, Pause, Play, Download, Grid, List, Bell, Trash2, Camera, Quote, ChevronDown, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

function BackgroundEffects() {
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 h-full w-full pointer-events-none select-none overflow-hidden bg-(--bg-base)", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "absolute inset-0 h-full w-full",
      style: {
        backgroundImage: `radial-gradient(var(--text-secondary) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        opacity: 0.12,
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
      }
    }
  ) });
}
function tokenizeLine(line) {
  const tokens = [];
  let remaining = line;
  let pos = 0;
  while (pos < line.length) {
    if (/\s/.test(line[pos])) {
      const match = line.slice(pos).match(/^\s+/);
      if (match) {
        tokens.push({ type: "text", value: match[0] });
        pos += match[0].length;
        remaining = line.slice(pos);
        continue;
      }
    }
    const stringMatch = remaining.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
    if (stringMatch) {
      tokens.push({ type: "string", value: stringMatch[0] });
      pos += stringMatch[0].length;
      remaining = line.slice(pos);
      continue;
    }
    const commentMatch = remaining.match(/^(\/\/.*$|#.*$)/);
    if (commentMatch) {
      tokens.push({ type: "comment", value: commentMatch[0] });
      break;
    }
    const keywords = ["import", "from", "const", "let", "var", "return", "print", "def", "class", "function", "if", "else", "for", "while", "async", "await"];
    const keywordMatch = remaining.match(new RegExp(`^\\b(${keywords.join("|")})\\b`));
    if (keywordMatch) {
      tokens.push({ type: "keyword", value: keywordMatch[0] });
      pos += keywordMatch[0].length;
      remaining = line.slice(pos);
      continue;
    }
    const constantMatch = remaining.match(/^\b(True|False|None|null|undefined|TRUE|FALSE)\b/);
    if (constantMatch) {
      tokens.push({ type: "constant", value: constantMatch[0] });
      pos += constantMatch[0].length;
      remaining = line.slice(pos);
      continue;
    }
    const numberMatch = remaining.match(/^\b(\d+\.?\d*)\b/);
    if (numberMatch) {
      tokens.push({ type: "number", value: numberMatch[0] });
      pos += numberMatch[0].length;
      remaining = line.slice(pos);
      continue;
    }
    const funcMatch = remaining.match(/^(\w+)(\s*\()/);
    if (funcMatch) {
      tokens.push({ type: "function", value: funcMatch[1] });
      tokens.push({ type: "text", value: funcMatch[2] });
      pos += funcMatch[0].length;
      remaining = line.slice(pos);
      continue;
    }
    const textMatch = remaining.match(/^[^\s"'`]/);
    if (textMatch) {
      const match = remaining.match(/^[^\s"'`\w]+|\w+/);
      if (match) {
        tokens.push({ type: "text", value: match[0] });
        pos += match[0].length;
        remaining = line.slice(pos);
        continue;
      }
    }
    pos++;
    remaining = line.slice(pos);
  }
  return tokens;
}
function escapeHtml(text) {
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;"
  };
  return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}
function renderLine(line) {
  const tokens = tokenizeLine(line);
  return tokens.map((token) => {
    const escaped = escapeHtml(token.value);
    switch (token.type) {
      case "keyword":
        return `<span class="code-keyword">${escaped}</span>`;
      case "string":
        return `<span class="code-string">${escaped}</span>`;
      case "comment":
        return `<span class="code-comment">${escaped}</span>`;
      case "number":
        return `<span class="code-number">${escaped}</span>`;
      case "function":
        return `<span class="code-function">${escaped}</span>`;
      case "constant":
        return `<span class="code-constant">${escaped}</span>`;
      default:
        return escaped;
    }
  }).join("");
}
function highlightCode(code) {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const rendered = renderLine(line) || "&nbsp;";
    return `<div class="table-row group"><span class="table-cell select-none text-right pr-4 w-8 text-(--text-muted) text-xs opacity-0 group-hover:opacity-50 transition-opacity">${i + 1}</span><span class="table-cell">${rendered}</span></div>`;
  }).join("");
}
function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = true,
  copyable = true,
  className,
  tabs
}) {
  const t = useYunUI().useT("common");
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const currentCode = tabs?.[activeTab]?.code || code;
  const currentLanguage = tabs?.[activeTab]?.language || language;
  useEffect(() => {
    setHighlightedHtml(highlightCode(currentCode));
  }, [currentCode]);
  const handleCopy = async () => {
    if (!await copyToClipboard(currentCode)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("card overflow-hidden max-w-full min-w-0", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-(--border-hairline) bg-(--bg-elevated)", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--error) opacity-80" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--warning) opacity-80" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-(--success) opacity-80" })
        ] }),
        tabs && tabs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: tabs.map((tab, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleTabChange(index),
            className: cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === index ? "bg-(--accent-subtle) text-(--text-primary)" : "text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--accent-subtle)/50"
            ),
            children: tab.label
          },
          tab.id
        )) }) : filename ? /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-(--text-secondary) font-mono", children: filename }) : /* @__PURE__ */ jsx("span", { className: "badge text-xs", children: currentLanguage })
      ] }),
      copyable && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCopy,
          className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-(--accent-subtle) outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-(--success)" }),
            /* @__PURE__ */ jsx("span", { className: "text-(--success)", children: t("copied") })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5 text-(--text-tertiary)" }),
            /* @__PURE__ */ jsx("span", { className: "text-(--text-tertiary)", children: t("copy") })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 bg-(--bg-base)", children: /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-x-auto", tabIndex: 0, children: /* @__PURE__ */ jsx("code", { className: "font-mono", style: { color: "var(--text-primary)" }, children: showLineNumbers ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "table",
        dangerouslySetInnerHTML: {
          __html: highlightedHtml || code.split("\n").map(
            (line, i) => `<div class="table-row group"><span class="table-cell select-none text-right pr-4 w-8 text-(--text-muted) text-xs opacity-0 group-hover:opacity-50 transition-opacity">${i + 1}</span><span class="table-cell">${escapeHtml(line) || "&nbsp;"}</span></div>`
          ).join("")
        }
      }
    ) : code }) }) })
  ] });
}
var codeSnippets = {
  python: `import openai

client = openai.OpenAI(
    base_url="https://api.example.com/v1",
    api_key="your_api_key"
)

response = client.chat.completions.create(
    model="deepseek-r1",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`,
  javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.example.com/v1',
  apiKey: 'your_api_key'
});

const response = await client.chat.completions.create({
  model: 'deepseek-r1',
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(response.choices[0].message.content);`,
  curl: `curl https://api.example.com/v1/chat/completions \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
};
function CodeDemo() {
  const tabs = [
    { id: "python", label: "Python", code: codeSnippets.python, language: "python" },
    { id: "javascript", label: "Node.js", code: codeSnippets.javascript, language: "javascript" },
    { id: "curl", label: "cURL", code: codeSnippets.curl, language: "bash" }
  ];
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(
    CodeBlock,
    {
      code: codeSnippets.python,
      tabs
    }
  ) });
}
function FAQ({ items, defaultOpenIndex = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const faqs = items;
  return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, i) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "glass-card overflow-hidden transition-all duration-300",
        openIndex === i ? "bg-card/60 ring-1 ring-(--accent-muted)" : "hover:bg-card/50"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setOpenIndex(openIndex === i ? null : i),
            "aria-expanded": openIndex === i,
            className: "w-full flex items-center justify-between p-6 text-left gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-[inherit]",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground flex-1 min-w-0", children: faq.question }),
              /* @__PURE__ */ jsx("span", { className: cn("text-muted-foreground transition-transform duration-300 shrink-0", openIndex === i ? "rotate-45" : ""), children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "px-6 text-muted-foreground text-sm leading-relaxed overflow-hidden transition-all duration-300",
              openIndex === i ? "max-h-60 pb-6 opacity-100" : "max-h-0 opacity-0"
            ),
            children: faq.answer
          }
        )
      ]
    },
    i
  )) });
}
var actionClass = cn(
  "inline-flex items-center gap-1.5 px-2 py-1 text-xs",
  "text-muted-foreground hover:text-accent-foreground transition-colors rounded-md hover:bg-accent"
);
function LLMCopyButton({ markdownUrl, labels }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      const res = await fetch(markdownUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      await navigator.clipboard.writeText(window.location.origin + markdownUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  }, [markdownUrl]);
  return /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleCopy, title: labels?.title ?? "Copy as Markdown for LLM", className: actionClass, children: [
    copied ? /* @__PURE__ */ jsx(Check, { className: "size-3" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
    copied ? labels?.copied ?? "Copied" : labels?.copy ?? "Copy"
  ] });
}
function ViewOptions({ markdownUrl, githubUrl, labels }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: markdownUrl,
        target: "_blank",
        rel: "noreferrer noopener",
        className: cn(actionClass, "no-underline"),
        title: labels?.markdownTitle ?? "View as Markdown",
        children: [
          /* @__PURE__ */ jsx(FileText, { className: "size-3" }),
          labels?.markdown ?? "Markdown"
        ]
      }
    ),
    githubUrl && /* @__PURE__ */ jsxs(
      "a",
      {
        href: githubUrl,
        target: "_blank",
        rel: "noreferrer noopener",
        className: cn(actionClass, "no-underline"),
        title: labels?.githubTitle ?? "Edit on GitHub",
        children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" }),
          labels?.github ?? "GitHub"
        ]
      }
    )
  ] });
}

// src/lib/format-date.ts
var DEFAULT_LOCALE = "en-US";
function toDate(input) {
  return input instanceof Date ? input : new Date(input);
}
function formatDate(input, locale = DEFAULT_LOCALE) {
  return toDate(input).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function formatLongDate(input, locale = DEFAULT_LOCALE) {
  return toDate(input).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function BlogCard({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  coverImage,
  url,
  variant = "default",
  locale
}) {
  const { Link } = useYunUI();
  const formattedDate = date ? formatDate(date, locale) : null;
  const isFeatured = variant === "featured";
  return /* @__PURE__ */ jsxs(Card, { hover: true, className: `group relative overflow-hidden h-full flex flex-col ${isFeatured ? "md:col-span-2" : ""}`, children: [
    /* @__PURE__ */ jsx(Link, { href: url, "aria-label": title, className: "absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[inherit]" }),
    /* @__PURE__ */ jsx("div", { className: "aspect-video w-full overflow-hidden bg-muted flex-shrink-0", children: coverImage ? /* @__PURE__ */ jsx(
      "img",
      {
        src: coverImage,
        alt: title,
        className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground/30", children: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col flex-grow", children: [
      category && /* @__PURE__ */ jsx(Badge, { variant: "info", className: "mb-3 self-start", children: category }),
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-lg mb-2 line-clamp-2", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow", children: description }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-auto", children: [
        formattedDate && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 12 }),
          formattedDate
        ] }),
        readingTime && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Clock, { size: 12 }),
          readingTime,
          " min read"
        ] }),
        author?.name && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(User, { size: 12 }),
          author.name
        ] })
      ] }),
      tags && tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "relative z-10 flex flex-wrap gap-1 mt-3", children: tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: `/blog?tag=${tag}`,
          className: "text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: [
            "#",
            tag
          ]
        },
        tag
      )) })
    ] })
  ] });
}
function BlogPostHeader({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  coverImage
}) {
  const formattedDate = date ? formatLongDate(date) : null;
  return /* @__PURE__ */ jsxs("header", { className: "mb-12", children: [
    category && /* @__PURE__ */ jsx(Badge, { variant: "info", className: "mb-4", children: category }),
    /* @__PURE__ */ jsx("h1", { className: "heading-xl mb-4", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground mb-6", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6", children: [
      author?.name && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
          author.avatar && /* @__PURE__ */ jsx(AvatarImage, { src: author.avatar, alt: author.name }),
          /* @__PURE__ */ jsx(AvatarFallback, { children: author.name[0] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: author.url ? /* @__PURE__ */ jsx("a", { href: author.url, className: "hover:text-foreground font-medium", children: author.name }) : /* @__PURE__ */ jsx("span", { className: "font-medium", children: author.name }) })
      ] }),
      formattedDate && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 14 }),
        formattedDate
      ] }),
      readingTime && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Clock, { size: 14 }),
        readingTime,
        " min read"
      ] })
    ] }),
    coverImage && /* @__PURE__ */ jsx("div", { className: "aspect-video w-full overflow-hidden rounded-xl mb-8 bg-muted", children: /* @__PURE__ */ jsx("img", { src: coverImage, alt: title, className: "w-full h-full object-cover" }) }),
    tags && tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tags.map((tag) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/blog?tag=${tag}`,
        className: "text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors",
        children: [
          "#",
          tag
        ]
      },
      tag
    )) })
  ] });
}
function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  labels
}) {
  const handlePageChange = onPageChange;
  const previousLabel = labels?.previous ?? "Previous";
  const nextLabel = labels?.next ?? "Next";
  if (totalPages <= 1) return null;
  const maxVisible = 3;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 sm:gap-2", children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => handlePageChange(currentPage - 1),
        disabled: currentPage === 1,
        children: [
          /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "ml-1 hidden sm:inline", children: previousLabel })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      start > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handlePageChange(1), className: "w-8 h-8 p-0 justify-center text-sm", children: "1" }),
        start > 2 && /* @__PURE__ */ jsx("span", { className: "px-2 text-muted-foreground", children: "..." })
      ] }),
      pages.map((page) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => handlePageChange(page),
          "aria-current": page === currentPage ? "page" : void 0,
          className: `w-8 h-8 p-0 justify-center text-sm ${page === currentPage ? "font-semibold" : ""}`,
          style: page === currentPage ? { color: "var(--text-primary)" } : void 0,
          children: page
        },
        page
      )),
      end < totalPages && /* @__PURE__ */ jsxs(Fragment, { children: [
        end < totalPages - 1 && /* @__PURE__ */ jsx("span", { className: "px-2 text-muted-foreground", children: "..." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => handlePageChange(totalPages),
            className: "w-8 h-8 p-0 justify-center text-sm",
            children: totalPages
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => handlePageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        children: [
          /* @__PURE__ */ jsx("span", { className: "mr-1 hidden sm:inline", children: nextLabel }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
        ]
      }
    )
  ] });
}
var RING_RADIUS = 21;
var RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
function ReadingProgress({
  threshold = 600,
  bar = true,
  backToTop = true,
  labels,
  className = ""
}) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const backToTopLabel = labels?.backToTop ?? "Back to top";
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const reach = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(reach > 0 ? Math.min(100, scrolled / reach * 100) : 0);
      setShow(scrolled > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);
  if (!bar && !backToTop) return null;
  const interactive = backToTop;
  const Tag = interactive ? "button" : "div";
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ...interactive ? {
        type: "button",
        "aria-label": backToTopLabel,
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
      } : { "aria-hidden": true },
      className: (
        // The canonical YunUI elevated-overlay surface (same recipe as menus &
        // dropdowns): translucent popover + backdrop blur, hairline border, the
        // house shadow and focus ring. House colour classes bridge to the token
        // system through @theme.
        "group fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-border bg-popover/85 backdrop-blur-2xl text-muted-foreground shadow-lg shadow-black/5 transition-all duration-300 ease-out " + (interactive ? "hover:-translate-y-0.5 hover:bg-popover hover:text-foreground hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " : "pointer-events-none ") + (show ? "translate-y-0 scale-100 opacity-100 " : "pointer-events-none translate-y-3 scale-90 opacity-0 ") + className
      ),
      children: [
        bar && /* @__PURE__ */ jsxs(
          "svg",
          {
            viewBox: "0 0 48 48",
            className: "absolute inset-0 h-full w-full -rotate-90",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  cx: "24",
                  cy: "24",
                  r: RING_RADIUS,
                  fill: "none",
                  strokeWidth: "2",
                  style: { stroke: "var(--border)" }
                }
              ),
              /* @__PURE__ */ jsx(
                "circle",
                {
                  cx: "24",
                  cy: "24",
                  r: RING_RADIUS,
                  fill: "none",
                  strokeWidth: "2.5",
                  strokeLinecap: "round",
                  className: "transition-[stroke-dashoffset] duration-150 ease-out",
                  style: { stroke: "var(--accent)" },
                  strokeDasharray: RING_CIRCUMFERENCE,
                  strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress / 100)
                }
              )
            ]
          }
        ),
        backToTop && /* @__PURE__ */ jsx(ArrowUp, { size: 17, strokeWidth: 2, className: "relative transition-transform duration-200 group-hover:-translate-y-0.5" })
      ]
    }
  );
}
function SimplePagination({
  currentPage,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  labels
}) {
  const canPrev = hasPrevious ?? currentPage > 1;
  const previousLabel = labels?.previous ?? "Previous";
  const nextLabel = labels?.next ?? "Next";
  const pageNode = labels?.page ? labels.page(currentPage) : `Page ${currentPage}`;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 sm:gap-2", children: [
    /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: onPrevious, disabled: !canPrev, children: [
      /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
      /* @__PURE__ */ jsx("span", { className: "ml-1 hidden sm:inline", children: previousLabel })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "px-3 text-sm font-medium tabular-nums whitespace-nowrap", children: pageNode }),
    /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: onNext, disabled: !hasNext, children: [
      /* @__PURE__ */ jsx("span", { className: "mr-1 hidden sm:inline", children: nextLabel }),
      /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
    ] })
  ] });
}
function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  allLabel = "All Posts"
}) {
  const handleCategoryClick = onSelect;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-8", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => handleCategoryClick(null),
        "aria-pressed": !selectedCategory,
        className: !selectedCategory ? "font-semibold" : "",
        style: !selectedCategory ? { background: "var(--bg-elevated)", color: "var(--text-primary)" } : void 0,
        children: allLabel
      }
    ),
    categories.map((category) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => handleCategoryClick(category),
        "aria-pressed": selectedCategory === category,
        className: selectedCategory === category ? "font-semibold" : "",
        style: selectedCategory === category ? { background: "var(--bg-elevated)", color: "var(--text-primary)" } : void 0,
        children: category
      },
      category
    ))
  ] });
}
function NavStateIndicator({
  active,
  running,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      "data-active": active || void 0,
      "data-running": running || void 0,
      className: cn("nav-state-indicator", className),
      ...props
    }
  );
}
function isItemActive(item, currentPath, homeHref) {
  if (currentPath === item.href) return true;
  if (item.href !== homeHref && currentPath.startsWith(item.href)) return true;
  return item.match?.some((m) => currentPath.startsWith(m)) ?? false;
}
function Sidebar({
  appName,
  logoSrc = "/favicon.ico",
  homeHref = "/",
  sections,
  currentPath = "",
  isOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  footer,
  closeLabel = "Close",
  loading = false,
  scrollStorageKey = "yunui-sidebar-scroll",
  layout = "fixed",
  header,
  children,
  className,
  role = "navigation",
  ariaLabel = "Main navigation"
}) {
  const { Link, Image } = useYunUI();
  const navRef = useRef(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const saved = sessionStorage.getItem(scrollStorageKey);
    if (saved) nav.scrollTop = parseInt(saved, 10);
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sessionStorage.setItem(scrollStorageKey, String(nav.scrollTop));
      });
    };
    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      nav.removeEventListener("scroll", onScroll);
    };
  }, [scrollStorageKey]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    layout === "fixed" && isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden",
        onClick: onClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        role,
        "aria-label": ariaLabel,
        className: cn(
          "min-w-64 w-64 bg-(--bg-base) border-r border-(--border-hairline) flex flex-col",
          layout === "fixed" ? "fixed inset-y-0 left-0 z-50 h-dvh transition-transform duration-200 ease-in-out" : "relative z-0 h-full min-w-0 w-full",
          layout === "fixed" && (isOpen ? "translate-x-0" : collapsed ? "-translate-x-full" : "-translate-x-full lg:translate-x-0"),
          className
        ),
        children: [
          header !== void 0 ? header : /* @__PURE__ */ jsx("div", { className: "py-3 px-3 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center py-2 pl-0 pr-1 gap-2", children: [
            /* @__PURE__ */ jsxs(Link, { href: homeHref, className: "flex-1 min-w-0 flex items-center gap-2.5 rounded-lg pl-3 pr-3 py-1.5 hover:bg-foreground/5 transition-colors duration-200", children: [
              /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 36, height: 36, className: "shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-[18px] truncate", children: appName })
            ] }),
            onToggleCollapse && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-(--border-hairline) shrink-0" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onToggleCollapse,
                  className: "hidden lg:flex shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  "aria-label": closeLabel,
                  children: /* @__PURE__ */ jsx(PanelLeftClose, { size: 18 })
                }
              )
            ] }),
            onClose && /* @__PURE__ */ jsx(IconButton, { icon: /* @__PURE__ */ jsx(X, { size: 20 }), label: closeLabel, onClick: onClose, className: "lg:hidden" })
          ] }) }),
          children != null ? /* @__PURE__ */ jsx("div", { className: "flex min-h-0 flex-1 flex-col", children }) : /* @__PURE__ */ jsx("nav", { ref: navRef, className: "flex-1 overflow-y-auto py-3 px-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "space-y-2 animate-pulse", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-9 rounded-lg bg-foreground/5" }, i)) }) : sections.map((section, i) => /* @__PURE__ */ jsxs("div", { className: i > 0 ? "mt-4" : "", children: [
            section.title && /* @__PURE__ */ jsx("div", { className: "nav-section", children: section.title }),
            section.items.map((item) => {
              const active = isItemActive(item, currentPath, homeHref);
              const Icon = item.icon;
              const content = /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(NavStateIndicator, { active }),
                Icon && /* @__PURE__ */ jsx(Icon, { size: 18, strokeWidth: 1.75, className: "shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 min-w-0 truncate", children: item.label })
              ] });
              const className2 = `nav-item ${active ? "active" : ""}`;
              return onNavigate ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  onClick: (e) => {
                    e.preventDefault();
                    onNavigate(item.href);
                    onClose?.();
                  },
                  className: className2,
                  children: content
                },
                item.href
              ) : /* @__PURE__ */ jsx(Link, { href: item.href, onClick: () => onClose?.(), className: className2, children: content }, item.href);
            })
          ] }, i)) }),
          footer && /* @__PURE__ */ jsx("div", { className: "p-3 shrink-0", children: footer })
        ]
      }
    )
  ] });
}
function PageHeader({ title, description, actions, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("h1", { className: "heading-xl", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-body mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 shrink-0", children: actions })
  ] });
}
function PageLayout({
  children,
  navbar,
  footer,
  hideFooter = false,
  transparentBg = false,
  mainClassName,
  mainId = "main-content",
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("min-h-dvh flex flex-col relative", !transparentBg && "bg-background", className), children: [
    navbar,
    /* @__PURE__ */ jsx("main", { id: mainId, className: cn("flex-1 pt-28", mainClassName), children }),
    !hideFooter && footer
  ] });
}
function PageLoadingState({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-16", children: [
    /* @__PURE__ */ jsx(Spinner, { size: "lg" }),
    message && /* @__PURE__ */ jsx("span", { className: "ml-3 text-muted-foreground", children: message })
  ] });
}
function PageErrorState({ message, onRetry, retryLabel = "Retry" }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "alert",
      className: "mx-auto flex w-full max-w-sm flex-col items-center justify-center px-4 py-12 text-center",
      children: [
        /* @__PURE__ */ jsx("span", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-error-soft", children: /* @__PURE__ */ jsx(AlertCircle, { size: 20, className: "text-error", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx("div", { className: "max-w-full text-sm font-medium leading-6 text-foreground", children: message }),
        onRetry && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onRetry,
            className: "mt-4 min-w-20",
            children: retryLabel
          }
        )
      ]
    }
  );
}
function PageEmptyState({ icon: Icon, title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    Icon && /* @__PURE__ */ jsx(Icon, { size: 40, className: "text-muted-foreground/40 mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "font-medium mb-1", children: title }),
    description && /* @__PURE__ */ jsx("div", { className: "text-caption", children: description }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-4", children: action })
  ] });
}
var SEMANTIC_TONES = {
  warning: { card: "border-warning-soft bg-warning-soft", value: "text-warning" },
  success: { card: "border-success-soft bg-success-soft", value: "text-success" },
  info: { card: "border-info-soft bg-info-soft", value: "text-info" },
  error: { card: "border-error-soft bg-error-soft", value: "text-error" },
  // No `.text-accent` helper exists (unlike the four status tones), so the
  // value colour reads the token directly rather than a dead utility class.
  accent: { card: "border-accent-soft bg-accent-soft", value: "text-(--accent)" }
};
var TONES = {
  ...SEMANTIC_TONES,
  // Legacy colour-named aliases.
  amber: SEMANTIC_TONES.warning,
  emerald: SEMANTIC_TONES.success,
  blue: SEMANTIC_TONES.info,
  red: SEMANTIC_TONES.error,
  purple: SEMANTIC_TONES.accent
};
function StatCard({ icon: Icon, label, value, subtext, trend, tone, delay = 0, inline = false, valueFirst = false, compact = false, className }) {
  const toneCfg = tone ? TONES[tone] : void 0;
  const showTopRow = Boolean(Icon || trend);
  const surface = compact ? "card p-4" : "stat-card p-5";
  const topRow = showTopRow ? /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
    Icon ? /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { size: 20, strokeWidth: 1.5, className: "text-muted-foreground" }) }) : /* @__PURE__ */ jsx("span", {}),
    trend && /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-1 text-xs font-medium", trend.positive ? "text-success" : "text-error"), children: [
      trend.positive ? /* @__PURE__ */ jsx(ArrowUpRight, { size: 14 }) : /* @__PURE__ */ jsx(ArrowDownRight, { size: 14 }),
      Math.abs(trend.value).toFixed(1),
      "%"
    ] })
  ] }) : null;
  if (inline) {
    return /* @__PURE__ */ jsxs("div", { className: cn("card p-4", toneCfg?.card, className), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        Icon && /* @__PURE__ */ jsx(Icon, { size: 18 }),
        /* @__PURE__ */ jsx("span", { children: label })
      ] }),
      /* @__PURE__ */ jsx("div", { className: cn("text-2xl font-semibold mt-2", toneCfg?.value ?? "text-foreground"), children: value })
    ] });
  }
  if (valueFirst) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(surface, "animate-enter", toneCfg?.card, className),
        style: delay ? { animationDelay: `${delay}ms` } : void 0,
        children: [
          topRow,
          /* @__PURE__ */ jsx("div", { className: cn("text-2xl font-semibold mb-1", toneCfg?.value), children: value }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: label }),
          subtext && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground/60 mt-1", children: subtext })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(surface, "animate-enter", toneCfg?.card, className),
      style: delay ? { animationDelay: `${delay}ms` } : void 0,
      children: [
        topRow,
        /* @__PURE__ */ jsx("div", { className: "text-label mb-1", children: label }),
        /* @__PURE__ */ jsx("div", { className: cn("text-2xl font-semibold tracking-tight", toneCfg?.value), children: value }),
        subtext && /* @__PURE__ */ jsx("div", { className: "text-caption mt-1", children: subtext })
      ]
    }
  );
}
function FellowsBanner({
  title,
  description,
  ctaText,
  features = [],
  href = "/fellows",
  className = ""
}) {
  const { Link } = useYunUI();
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      className: `card p-5 flex flex-col gap-4 sm:flex-row sm:items-center border-2 border-primary/20 bg-linear-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-primary/10 rounded-xl shrink-0", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description }),
            features.length > 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: features.join(" \xB7 ") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary/15 transition-colors", children: [
          ctaText,
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5" })
        ] })
      ]
    }
  );
}
function ErrorFallback({
  error,
  onRetry,
  labels
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-100 p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-error-soft flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { size: 32, className: "text-error" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: labels?.title ?? "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center mb-4 max-w-md", children: error?.message || labels?.message || "An unexpected error occurred." }),
    /* @__PURE__ */ jsxs(Button, { variant: "secondary", onClick: onRetry, className: "whitespace-nowrap", children: [
      /* @__PURE__ */ jsx(RefreshCw, { size: 16 }),
      labels?.retry ?? "Try again"
    ] })
  ] });
}
var ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return /* @__PURE__ */ jsx(ErrorFallback, { error: this.state.error, onRetry: this.handleRetry, labels: this.props.labels });
    }
    return this.props.children;
  }
};
function AccountLockedCard({
  appName,
  logoSrc = "/favicon.ico",
  icon,
  title,
  subtitle,
  appeal,
  backLabel,
  onBack,
  onMount,
  loading = false,
  children
}) {
  const { Image } = useYunUI();
  useEffect(() => {
    onMount?.();
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "min-h-dvh bg-background flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2.5 mb-8", children: [
      /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 32, height: 32 }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-[15px]", children: appName })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-card border border-border rounded-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-soft", children: icon }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold mb-2 text-center", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-5 text-center", children: subtitle }),
      children,
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6 text-center", children: appeal }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          disabled: loading,
          className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          children: backLabel
        }
      )
    ] })
  ] }) });
}
function MediaPageHeader({ title, description, isSyncing, syncError, onSync, stats }) {
  const t = useYunUI().useT("components.mediaPageHeader");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h1", { className: "heading-xl", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-body mt-1", children: description })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: onSync, disabled: isSyncing, className: "text-muted-foreground shrink-0 self-start sm:self-auto", children: [
        /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: isSyncing ? "animate-spin" : "" }),
        /* @__PURE__ */ jsx("span", { className: "ml-2", children: isSyncing ? t("syncing") : t("sync") })
      ] })
    ] }),
    syncError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-error-soft border border-error-soft text-error text-sm", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
      /* @__PURE__ */ jsx("span", { children: syncError })
    ] }),
    stats && stats.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: stats.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: stat.value }),
      /* @__PURE__ */ jsx("span", { children: stat.label })
    ] }, index)) })
  ] });
}
function MediaEmptyState({ icon: Icon, title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "empty-state py-16", children: [
    /* @__PURE__ */ jsx(Icon, { size: 40, className: "text-muted-foreground/40 mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "font-medium mb-1", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-caption", children: description }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-4", children: action })
  ] });
}
function MediaLoadingState({ message }) {
  const t = useYunUI().useT("components.mediaPageHeader");
  const displayMessage = message ?? t("loading");
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-16", children: [
    /* @__PURE__ */ jsx(RefreshCw, { size: 24, className: "animate-spin text-muted-foreground" }),
    /* @__PURE__ */ jsx("span", { className: "ml-3 text-muted-foreground", children: displayMessage })
  ] });
}
function MediaErrorState({ message, onRetry }) {
  const t = useYunUI().useT("components.mediaPageHeader");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsx(AlertCircle, { size: 40, className: "text-error opacity-50 mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "font-medium text-error mb-1", children: t("error") }),
    /* @__PURE__ */ jsx("div", { className: "text-caption mb-4", children: message }),
    onRetry && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: onRetry, children: [
      /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: "mr-2" }),
      t("retry")
    ] })
  ] });
}
function FellowBadge({ variant = "inline", className = "" }) {
  const t = useYunUI().useT("components.badges");
  if (variant === "pill") {
    return /* @__PURE__ */ jsxs("span", { className: `badge inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 ${className}`, children: [
      /* @__PURE__ */ jsx(Award, { size: 11, className: "text-amber-500" }),
      t("fellow")
    ] });
  }
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 ${className}`, children: [
    /* @__PURE__ */ jsx(Award, { size: 10, className: "text-amber-500" }),
    t("fellow")
  ] });
}
function CapabilityBadge({ capability, short = false }) {
  const t = useYunUI().useT("components.badges");
  const configs = {
    chat: { icon: MessageSquare, iconColor: capabilityIconColor("chat"), color: capabilityBadgeColor("chat"), labelKey: "chat" },
    streaming: { icon: Waves, iconColor: capabilityIconColor("streaming"), color: capabilityBadgeColor("streaming"), labelKey: "streaming" },
    function_calling: { icon: Code, iconColor: capabilityIconColor("function_calling"), color: capabilityBadgeColor("function_calling"), labelKey: "functionCalling" },
    vision: { icon: Eye, iconColor: capabilityIconColor("vision"), color: capabilityBadgeColor("vision"), labelKey: "vision" },
    thinking: { icon: Brain, iconColor: capabilityIconColor("thinking"), color: capabilityBadgeColor("thinking"), labelKey: "thinking" },
    image_edit: { icon: Image, iconColor: capabilityIconColor("image_edit"), color: capabilityBadgeColor("image_edit"), labelKey: "imageEdit" },
    negative_prompt: { icon: Ban, iconColor: capabilityIconColor("negative_prompt"), color: capabilityBadgeColor("negative_prompt"), labelKey: "negativePrompt" },
    seed_control: { icon: Fingerprint, iconColor: capabilityIconColor("seed_control"), color: capabilityBadgeColor("seed_control"), labelKey: "seedControl" },
    lora: { icon: Layers, iconColor: capabilityIconColor("lora"), color: capabilityBadgeColor("lora"), labelKey: "loraSupport" },
    guidance_scale: { icon: SlidersHorizontal, iconColor: capabilityIconColor("guidance_scale"), color: capabilityBadgeColor("guidance_scale"), labelKey: "guidanceScale" },
    strength: { icon: SlidersHorizontal, iconColor: capabilityIconColor("strength"), color: capabilityBadgeColor("strength"), labelKey: "strength" },
    batch: { icon: Waves, iconColor: capabilityIconColor("batch"), color: capabilityBadgeColor("batch"), labelKey: "batchGeneration" }
  };
  const config = configs[capability];
  if (!config) return null;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs("span", { className: `badge inline-flex items-center gap-1 text-xs ${config.color}`, children: [
    /* @__PURE__ */ jsx(Icon, { size: 10, className: config.iconColor }),
    t(config.labelKey)
  ] });
}
function StatusBadge({ status, size = "sm" }) {
  const t = useYunUI().useT("components.badges");
  const configs = {
    pending: { icon: Clock, color: "badge-warning", labelKey: "pending" },
    approved: { icon: CheckCircle, color: "badge-success", labelKey: "approved" },
    auto_approved: { icon: Zap, color: "badge-info", labelKey: "autoApproved" },
    rejected: { icon: XCircle, color: "badge-error", labelKey: "rejected" }
  };
  const config = configs[status];
  if (!config) return null;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`, children: [
    /* @__PURE__ */ jsx(Icon, { size: size === "sm" ? 12 : 14 }),
    t(config.labelKey)
  ] });
}
function SourceBadge({ source, showIcon = true }) {
  const t = useYunUI().useT("common.badge");
  const configs = {
    yaml: { icon: FileCode, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", label: t("yaml") },
    api: { icon: FileText, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", label: t("api") }
  };
  const config = configs[source.toLowerCase()];
  if (!config) return null;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs("span", { className: `badge flex items-center gap-1 ${config.color}`, children: [
    showIcon && /* @__PURE__ */ jsx(Icon, { size: 10 }),
    config.label
  ] });
}
function ActiveBadge({ isActive }) {
  const t = useYunUI().useT("components.badges");
  return /* @__PURE__ */ jsxs("span", { className: `badge flex items-center gap-1 ${isActive ? "badge-success" : ""}`, children: [
    isActive ? /* @__PURE__ */ jsx(Eye, { size: 10 }) : /* @__PURE__ */ jsx(EyeOff, { size: 10 }),
    isActive ? t("active") : t("inactive")
  ] });
}
function DeprecatedBadge({ isDeprecated }) {
  const t = useYunUI().useT("components.badges");
  if (!isDeprecated) return null;
  return /* @__PURE__ */ jsx("span", { className: "badge", children: t("deprecated") });
}
function FeatureLockedState({ icon, title, description, noteTitle, noteText, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex items-center justify-center min-h-[60vh]", className), children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md mx-auto p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4", children: icon ?? /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-2", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: description }),
    (noteTitle || noteText) && /* @__PURE__ */ jsx("div", { className: "card p-4 bg-muted/30 border border-dashed border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        noteTitle && /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: noteTitle }),
        noteText && /* @__PURE__ */ jsx("p", { children: noteText })
      ] })
    ] }) })
  ] }) });
}
function SessionItem({
  icon,
  name,
  detail,
  ip,
  time,
  current,
  currentLabel,
  inactive,
  inactiveLabel,
  selected,
  running,
  runningLabel,
  onRevoke,
  revoking,
  revokeLabel,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-selected": selected || void 0,
      "data-running": running || void 0,
      "aria-busy": running || void 0,
      className: cn(
        "relative flex items-start gap-3 overflow-hidden rounded-lg bg-(--bg-elevated) p-2",
        selected && "text-foreground",
        inactive && "opacity-50",
        className
      ),
      children: [
        (selected || running) && /* @__PURE__ */ jsx(
          NavStateIndicator,
          {
            active: true,
            running,
            "data-session-activity-rail": true
          }
        ),
        running && runningLabel != null && /* @__PURE__ */ jsx("span", { className: "sr-only", children: runningLabel }),
        icon != null && /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0", children: icon }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "block min-w-0 flex-1 truncate text-xs font-medium", children: name }),
            current && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full badge-success shrink-0", children: currentLabel }),
            inactive && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full badge-neutral shrink-0", children: inactiveLabel })
          ] }),
          detail && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-(--text-tertiary) mt-0.5 truncate", children: detail }),
          (ip != null || time != null) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-1 text-[10px] text-(--text-tertiary)", children: [
            ip != null && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsx(Globe, { size: 8 }),
              ip
            ] }),
            time != null && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsx(Clock, { size: 8 }),
              time
            ] })
          ] })
        ] }),
        !current && onRevoke && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRevoke,
            disabled: revoking,
            "aria-label": revokeLabel,
            title: revokeLabel,
            className: "p-1.5 hover:bg-error-soft rounded text-(--text-tertiary) hover:text-error transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
            children: revoking ? /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsx(LogOut, { size: 12 })
          }
        )
      ]
    }
  );
}
function MetricBar({ icon, label, value, percentage, color, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-3", className), children: [
    icon != null ? icon : /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full shrink-0", style: { backgroundColor: color } }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1 gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate", children: label }),
        value != null && /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground shrink-0", children: value })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          role: "progressbar",
          "aria-valuenow": Math.max(0, Math.min(100, percentage)),
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          className: "h-full rounded-full transition-all duration-300",
          style: { width: `${Math.max(0, Math.min(100, percentage))}%`, backgroundColor: color }
        }
      ) })
    ] })
  ] });
}
var fmtTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};
function AudioPlayer({ src, title, downloadName, autoPlay = false, labels, className }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);
  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };
  const seek = (e) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
  };
  const pct = duration > 0 ? current / duration * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-2 rounded-xl border border-border bg-card p-3", className), children: [
    title && /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-medium", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: toggle,
          "aria-label": playing ? labels?.pause ?? "Pause" : labels?.play ?? "Play",
          className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90",
          children: playing ? /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 translate-x-px" })
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: duration || 0,
          step: "any",
          value: current,
          onChange: seek,
          "aria-label": labels?.seek ?? "Seek",
          className: "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-accent)]",
          style: {
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-muted) ${pct}%)`
          }
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-xs tabular-nums text-muted-foreground", children: [
        fmtTime(current),
        " / ",
        fmtTime(duration)
      ] }),
      downloadName && /* @__PURE__ */ jsx(
        "a",
        {
          href: src,
          download: downloadName,
          "aria-label": labels?.download ?? "Download audio",
          className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "audio",
      {
        ref: audioRef,
        src,
        autoPlay,
        onPlay: () => setPlaying(true),
        onPause: () => setPlaying(false),
        onTimeUpdate: (e) => setCurrent(e.currentTarget.currentTime),
        onLoadedMetadata: (e) => setDuration(e.currentTarget.duration),
        onEnded: () => setPlaying(false),
        className: "hidden"
      }
    )
  ] });
}
var DEFAULT_LABELS = {
  starting: "Starting\u2026",
  processing: "Processing\u2026",
  failed: "Generation failed",
  expired: "Media expired",
  download: "Download",
  delete: "Delete",
  gridView: "Grid view",
  listView: "List view"
};
function isUrlExpired(url) {
  try {
    const expires = new URL(url).searchParams.get("Expires");
    if (expires) {
      const ts = parseInt(expires, 10);
      return Date.now() / 1e3 > ts - 60;
    }
  } catch {
    return true;
  }
  return false;
}
function MediaBody({
  item,
  labels
}) {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const kind = item.kind ?? "image";
  const status = item.status ?? "completed";
  const isExpired = useMemo(() => {
    if (!item.url || item.url.startsWith("data:") || item.url.startsWith("blob:")) return false;
    return isUrlExpired(item.url);
  }, [item.url]);
  const isProcessing = status === "pending" || status === "processing";
  const showError = isExpired || loadFailed || status === "failed";
  if (isProcessing) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-2 bg-muted", children: [
      /* @__PURE__ */ jsx(Spinner, { size: "lg" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: status === "pending" ? labels.starting : labels.processing }),
      item.progress !== void 0 && item.progress > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted-foreground/20", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-primary transition-all duration-300",
          style: { width: `${Math.min(item.progress, 95)}%` }
        }
      ) })
    ] });
  }
  if (showError) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-1 bg-muted px-3 text-center", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 22, className: "text-error" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-error", children: status === "failed" ? labels.failed : labels.expired }),
      item.error && /* @__PURE__ */ jsx("span", { className: "mt-0.5 max-w-[85%] truncate text-xs text-error", children: item.error })
    ] });
  }
  if (kind === "audio") {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center bg-muted/40 px-3", children: /* @__PURE__ */ jsx(AudioPlayer, { src: item.url, className: "w-full" }) });
  }
  if (kind === "video") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      /* @__PURE__ */ jsx(
        "video",
        {
          src: item.url,
          controls: true,
          className: "h-full w-full bg-black object-contain",
          onLoadedData: () => setLoading(false),
          onError: () => {
            setLoading(false);
            setLoadFailed(true);
          }
        }
      )
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-pulse bg-muted" }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: item.url,
        alt: typeof item.prompt === "string" ? item.prompt : "",
        className: cn("h-full w-full object-cover", loading && "opacity-0"),
        onLoad: () => setLoading(false),
        onError: () => {
          setLoading(false);
          setLoadFailed(true);
        }
      }
    )
  ] });
}
function MediaCard({
  item,
  index,
  view,
  onDownload,
  onDelete,
  onPreview,
  labels
}) {
  const status = item.status ?? "completed";
  const kind = item.kind ?? "image";
  const isProcessing = status === "pending" || status === "processing";
  const isDone = status === "completed";
  const canPreview = Boolean(onPreview) && isDone && kind === "image";
  const modelShort = item.model?.split("/").pop();
  const caption = /* @__PURE__ */ jsxs("div", { className: cn(view === "list" ? "min-w-0 flex-1" : "p-3"), children: [
    item.prompt !== void 0 && /* @__PURE__ */ jsx("div", { className: "line-clamp-2 text-sm", children: item.prompt }),
    (modelShort || item.meta) && /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
      modelShort && /* @__PURE__ */ jsx("span", { className: "truncate", children: modelShort }),
      modelShort && item.meta && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "\u2022" }),
      item.meta
    ] })
  ] });
  const overlayBtn = "flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground shadow-md ring-1 ring-border backdrop-blur transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40";
  const actions = (onDownload || onDelete) && (view === "grid" ? /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex items-center justify-center gap-2.5 bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/30 group-hover:opacity-100", children: [
    onDownload && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: overlayBtn,
        disabled: !isDone,
        "aria-label": labels.download,
        onClick: (e) => {
          e.stopPropagation();
          onDownload(item);
        },
        children: /* @__PURE__ */ jsx(Download, { size: 18 })
      }
    ),
    onDelete && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: cn(overlayBtn, "text-error"),
        "aria-label": labels.delete,
        onClick: (e) => {
          e.stopPropagation();
          onDelete(item);
        },
        children: /* @__PURE__ */ jsx(Trash2, { size: 18 })
      }
    )
  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    onDownload && /* @__PURE__ */ jsx(
      Button,
      {
        size: "icon",
        variant: "ghost",
        disabled: !isDone,
        "aria-label": labels.download,
        onClick: (e) => {
          e.stopPropagation();
          onDownload(item);
        },
        children: /* @__PURE__ */ jsx(Download, { size: 16 })
      }
    ),
    onDelete && /* @__PURE__ */ jsx(
      Button,
      {
        size: "icon",
        variant: "ghost",
        "aria-label": labels.delete,
        onClick: (e) => {
          e.stopPropagation();
          onDelete(item);
        },
        children: /* @__PURE__ */ jsx(Trash2, { size: 16, className: "text-error" })
      }
    )
  ] }));
  if (kind === "audio") {
    const showError = status === "failed";
    return /* @__PURE__ */ jsxs("div", { className: "card space-y-2.5 p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          item.prompt !== void 0 && /* @__PURE__ */ jsx("div", { className: "line-clamp-2 text-sm", children: item.prompt }),
          (modelShort || item.meta) && /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
            modelShort && /* @__PURE__ */ jsx("span", { className: "truncate", children: modelShort }),
            modelShort && item.meta && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "\u2022" }),
            item.meta
          ] })
        ] }),
        (onDownload || onDelete) && /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
          onDownload && /* @__PURE__ */ jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              disabled: !isDone,
              "aria-label": labels.download,
              onClick: () => onDownload(item),
              children: /* @__PURE__ */ jsx(Download, { size: 16 })
            }
          ),
          onDelete && /* @__PURE__ */ jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              "aria-label": labels.delete,
              onClick: () => onDelete(item),
              children: /* @__PURE__ */ jsx(Trash2, { size: 16, className: "text-error" })
            }
          )
        ] })
      ] }),
      isProcessing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Spinner, { size: "sm" }),
        " ",
        status === "pending" ? labels.starting : labels.processing
      ] }) : showError ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 py-2 text-xs text-error", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 14 }),
        " ",
        labels.failed,
        item.error ? `: ${item.error}` : ""
      ] }) : /* @__PURE__ */ jsx(AudioPlayer, { src: item.url, className: "w-full" })
    ] });
  }
  if (view === "list") {
    return /* @__PURE__ */ jsxs("div", { className: "card flex items-center gap-3 p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted", children: /* @__PURE__ */ jsx(MediaBody, { item, labels }) }),
      caption,
      actions
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "card group animate-enter overflow-hidden",
        canPreview && "cursor-pointer"
      ),
      style: { animationDelay: `${Math.min(index, 10) * 50}ms` },
      onClick: () => canPreview && onPreview?.(item),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-square", children: [
          /* @__PURE__ */ jsx(MediaBody, { item, labels }),
          !isProcessing && actions
        ] }),
        caption
      ]
    }
  );
}
function MediaGallery({
  items,
  viewMode,
  onViewModeChange,
  onDownload,
  onDelete,
  onPreview,
  title,
  empty,
  labels,
  className
}) {
  const [internalView, setInternalView] = useState("grid");
  const view = viewMode ?? internalView;
  const setView = onViewModeChange ?? setInternalView;
  const showToggle = Boolean(onViewModeChange) || items.length > 0;
  const l = { ...DEFAULT_LABELS, ...labels };
  const [lightbox, setLightbox] = useState(null);
  const handlePreview = (item) => {
    if (onPreview) onPreview(item);
    else setLightbox(item);
  };
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(
      ImageLightbox,
      {
        src: lightbox?.url,
        alt: typeof lightbox?.prompt === "string" ? lightbox.prompt : "",
        isOpen: lightbox !== null,
        onClose: () => setLightbox(null)
      }
    ),
    (title || showToggle) && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
      title ? /* @__PURE__ */ jsx("h2", { className: "heading-md", children: title }) : /* @__PURE__ */ jsx("span", {}),
      showToggle && /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setView("grid"),
            "aria-label": l.gridView,
            "aria-pressed": view === "grid",
            className: cn(
              "rounded-lg p-2 transition-colors",
              view === "grid" ? "bg-muted" : "hover:bg-muted/50"
            ),
            children: /* @__PURE__ */ jsx(Grid, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setView("list"),
            "aria-label": l.listView,
            "aria-pressed": view === "list",
            className: cn(
              "rounded-lg p-2 transition-colors",
              view === "list" ? "bg-muted" : "hover:bg-muted/50"
            ),
            children: /* @__PURE__ */ jsx(List, { size: 16 })
          }
        )
      ] })
    ] }),
    items.length === 0 ? empty ?? null : view === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", children: items.map((item, i) => /* @__PURE__ */ jsx(
      MediaCard,
      {
        item,
        index: i,
        view: "grid",
        onDownload,
        onDelete,
        onPreview: handlePreview,
        labels: l
      },
      item.id
    )) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: items.map((item, i) => /* @__PURE__ */ jsx(
      MediaCard,
      {
        item,
        index: i,
        view: "list",
        onDownload,
        onDelete,
        onPreview: handlePreview,
        labels: l
      },
      item.id
    )) })
  ] });
}
var TONES2 = {
  // Token-driven, matching Alert/Badge: the raw `blue/amber/red/green-500`
  // palette these used to carry is not the same colour as `--info`/`--warning`/
  // `--error`/`--success`, so a Banner and an Alert reading the same severity
  // rendered as two different hues and neither followed a brand theme.
  info: {
    bg: "bg-info-soft",
    border: "border-info-soft",
    text: "text-info",
    icon: "text-info",
    dismissHover: "hover:bg-info-soft",
    defaultIcon: /* @__PURE__ */ jsx(Info, { size: 16 })
  },
  warning: {
    bg: "bg-warning-soft",
    border: "border-warning-soft",
    text: "text-warning",
    icon: "text-warning",
    dismissHover: "hover:bg-warning-soft",
    defaultIcon: /* @__PURE__ */ jsx(AlertTriangle, { size: 16 })
  },
  critical: {
    bg: "bg-error-soft",
    border: "border-error-soft",
    text: "text-error",
    icon: "text-error",
    dismissHover: "hover:bg-error-soft",
    defaultIcon: /* @__PURE__ */ jsx(AlertCircle, { size: 16 })
  },
  success: {
    bg: "bg-success-soft",
    border: "border-success-soft",
    text: "text-success",
    icon: "text-success",
    dismissHover: "hover:bg-success-soft",
    defaultIcon: /* @__PURE__ */ jsx(CheckCircle2, { size: 16 })
  },
  neutral: {
    bg: "bg-muted/40",
    border: "border-border",
    text: "text-foreground",
    icon: "text-muted-foreground",
    dismissHover: "hover:bg-muted",
    defaultIcon: /* @__PURE__ */ jsx(Info, { size: 16 })
  }
};
function Banner({
  tone = "info",
  icon,
  title,
  description,
  meta,
  actions,
  dismissible,
  onDismiss,
  dismissLabel,
  className
}) {
  const t = TONES2[tone];
  const resolvedIcon = icon === void 0 ? t.defaultIcon : icon;
  return /* @__PURE__ */ jsx("div", { className: cn("card", t.bg, t.border, className), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5", children: [
    resolvedIcon != null && /* @__PURE__ */ jsx("span", { className: cn("shrink-0", t.icon), "aria-hidden": "true", children: resolvedIcon }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("span", { className: cn("text-sm font-medium", t.text), children: title }),
      description && /* @__PURE__ */ jsx("span", { className: cn("text-sm ml-2 hidden sm:inline opacity-70", t.text), children: description })
    ] }),
    meta != null && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground/70 shrink-0", children: meta }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 shrink-0", children: actions }),
    dismissible && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onDismiss,
        "aria-label": dismissLabel,
        className: cn("p-1 rounded-lg transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring", t.dismissHover),
        children: /* @__PURE__ */ jsx(X, { size: 14, className: "text-muted-foreground/70" })
      }
    )
  ] }) });
}
function NotificationBell({ count = 0, max = 99, label, icon, onClick, className }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      "aria-label": label,
      className: cn(
        "relative flex items-center justify-center rounded-lg px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      ),
      children: [
        icon ?? /* @__PURE__ */ jsx(Bell, { size: 18 }),
        count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--error) text-[10px] font-bold text-pure-white px-1", children: count > max ? `${max}+` : count })
      ]
    }
  );
}
function NotificationItem({
  icon,
  iconClassName,
  title,
  body,
  time,
  unread,
  href,
  onSelect,
  dismissible,
  onDismiss,
  dismissLabel,
  className
}) {
  const { Link } = useYunUI();
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    icon != null && /* @__PURE__ */ jsx("div", { className: cn("shrink-0 rounded-lg p-1.5", iconClassName ?? "bg-muted"), children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: cn("text-sm leading-snug truncate", unread ? "font-medium" : "text-muted-foreground"), children: title }),
      body && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-0.5 line-clamp-1", children: body })
    ] }),
    time != null && /* @__PURE__ */ jsx("span", { className: "shrink-0 self-center text-[10px] text-muted-foreground/50", children: time })
  ] });
  const rowClass = cn("flex items-center gap-2.5 px-3 py-2.5", dismissible ? "pr-9" : "pr-3");
  return /* @__PURE__ */ jsxs("div", { className: cn("group/notif relative rounded-xl hover:bg-foreground/5 transition-colors", className), children: [
    href ? /* @__PURE__ */ jsx(Link, { href, onClick: onSelect, className: rowClass, children: inner }) : /* @__PURE__ */ jsx("button", { type: "button", onClick: onSelect, className: cn(rowClass, "w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-xl"), children: inner }),
    dismissible && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-label": dismissLabel,
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
          onDismiss?.();
        },
        className: "absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg opacity-0 group-hover/notif:opacity-100 group-focus-within/notif:opacity-100 hover:bg-muted transition-all outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
        children: /* @__PURE__ */ jsx(Trash2, { size: 12, className: "text-muted-foreground/40 hover:text-error" })
      }
    )
  ] });
}
function NotificationPanel({
  title,
  unreadCount = 0,
  unreadLabel,
  loading,
  loadingLabel,
  empty,
  emptyLabel,
  footer,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "w-80 sm:w-[400px] rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl shadow-lg shadow-black/5",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: title }),
          unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-primary", children: [
            unreadCount,
            unreadLabel ? /* @__PURE__ */ jsxs(Fragment, { children: [
              " ",
              unreadLabel
            ] }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[400px] overflow-y-auto px-2 pb-2 flex flex-col gap-1", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-sm text-muted-foreground", children: loadingLabel }) : empty ? /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
          /* @__PURE__ */ jsx(Bell, { size: 24, className: "mx-auto mb-2 text-muted-foreground/40" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: emptyLabel })
        ] }) : children }),
        footer && /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-muted-foreground hover:text-foreground transition-colors [&>a]:block [&>a]:py-2.5", children: footer })
      ]
    }
  );
}
function SettingRow({ title, description, control, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-between gap-4 py-3 border-b border-border last:border-0", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: title }),
      description && /* @__PURE__ */ jsx("div", { className: "text-xs text-(--text-tertiary) mt-0.5 leading-relaxed whitespace-normal wrap-break-word", children: description })
    ] }),
    control != null && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: control })
  ] });
}
function SettingsShell({
  header,
  groups,
  value,
  onValueChange,
  children,
  navigationLabel = "Settings",
  className,
  sidebarClassName,
  contentClassName
}) {
  const items = groups.flatMap((group) => group.items);
  const activeItem = items.find((item) => item.key === value);
  const ActiveIcon = activeItem?.icon;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex h-full min-h-0", className), children: [
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "hidden w-56 shrink-0 flex-col border-r border-border bg-muted/15 sm:flex",
          sidebarClassName
        ),
        children: [
          /* @__PURE__ */ jsx("div", { className: "shrink-0 px-6 pb-4 pt-6", children: header }),
          /* @__PURE__ */ jsx(
            "nav",
            {
              "aria-label": navigationLabel,
              className: "min-h-0 flex-1 overflow-y-auto px-3 pb-5",
              children: groups.map((group, groupIndex) => /* @__PURE__ */ jsxs(
                "section",
                {
                  "aria-label": typeof group.label === "string" ? group.label : void 0,
                  className: cn(groupIndex > 0 && "mt-4 border-t border-border/70 pt-4"),
                  children: [
                    group.label ? /* @__PURE__ */ jsx("div", { className: "px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: group.label }) : null,
                    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: group.items.map((item) => {
                      const Icon = item.icon;
                      const active = item.key === value;
                      return /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          className: cn(
                            "nav-item w-full text-left",
                            active && "active"
                          ),
                          "aria-current": active ? "page" : void 0,
                          onClick: () => onValueChange(item.key),
                          children: [
                            /* @__PURE__ */ jsx(NavStateIndicator, { active }),
                            Icon ? /* @__PURE__ */ jsx(Icon, { "aria-hidden": true, size: 18, strokeWidth: 1.75, className: "shrink-0" }) : null,
                            /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-left", children: item.label })
                          ]
                        },
                        item.key
                      );
                    }) })
                  ]
                },
                group.key
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 border-b border-border px-4 pb-3 pt-4 sm:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: header }),
        /* @__PURE__ */ jsxs(Select, { value, onValueChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { "aria-label": navigationLabel, className: "h-10 bg-background", children: /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
            ActiveIcon ? /* @__PURE__ */ jsx(ActiveIcon, { "aria-hidden": true, size: 16, strokeWidth: 1.75, className: "shrink-0 text-muted-foreground" }) : null,
            /* @__PURE__ */ jsx(SelectValue, {})
          ] }) }),
          /* @__PURE__ */ jsx(SelectContent, { className: "bg-popover backdrop-blur-none", children: groups.map((group) => /* @__PURE__ */ jsxs("div", { children: [
            group.label ? /* @__PURE__ */ jsx("div", { className: "px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: group.label }) : null,
            group.items.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.key, children: item.label }, item.key))
          ] }, group.key)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: cn("min-h-0 flex-1 overflow-hidden", contentClassName), children })
    ] })
  ] });
}
function LinkRow({ icon, title, description, href, external, className }) {
  const { Link } = useYunUI();
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    icon != null && /* @__PURE__ */ jsx("span", { className: "text-(--text-tertiary) shrink-0", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: title }),
      description && /* @__PURE__ */ jsx("div", { className: "text-xs text-(--text-tertiary) truncate", children: description })
    ] }),
    /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-(--text-muted) shrink-0" })
  ] });
  const cls = cn(
    "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-(--bg-elevated) transition-colors",
    className
  );
  if (external) {
    return /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", className: cls, children: inner });
  }
  return /* @__PURE__ */ jsx(Link, { href, className: cls, children: inner });
}
function ConnectedAccountRow({
  icon,
  badge,
  avatarUrl,
  name,
  subname,
  detail,
  time,
  onUnlink,
  unlinking,
  unlinkLabel,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-3 p-3 rounded-xl bg-(--bg-elevated) border border-border", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
      avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: "", className: "w-9 h-9 rounded-full object-cover ring-2 ring-border" })
      ) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center ring-2 ring-border", children: icon }),
      badge != null && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-5 h-5 rounded-full bg-(--bg-elevated) border border-border flex items-center justify-center", children: badge })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium capitalize", children: name }),
        subname != null && /* @__PURE__ */ jsxs("span", { className: "text-xs text-(--text-secondary) truncate", children: [
          "\xB7 ",
          subname
        ] })
      ] }),
      detail != null && /* @__PURE__ */ jsx("div", { className: "text-xs text-(--text-tertiary) truncate", children: detail }),
      time != null && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-(--text-tertiary) flex items-center gap-1 mt-0.5", children: [
        /* @__PURE__ */ jsx(Clock, { size: 8 }),
        time
      ] })
    ] }),
    onUnlink && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onUnlink,
        disabled: unlinking,
        title: unlinkLabel,
        "aria-label": unlinkLabel,
        className: "p-1.5 hover:bg-error-soft rounded text-(--text-tertiary) hover:text-error transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        children: unlinking ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(X, { size: 14 })
      }
    )
  ] });
}
function AvatarUploader({
  src,
  fallback,
  size = 48,
  uploading,
  onSelectFile,
  label,
  className
}) {
  const inputRef = useRef(null);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => inputRef.current?.click(),
      "aria-label": label,
      className: cn("relative group cursor-pointer shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
      style: { width: size, height: size },
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) onSelectFile?.(file);
              e.target.value = "";
            }
          }
        ),
        src ? (
          // eslint-disable-next-line @next/next/no-img-element
          /* @__PURE__ */ jsx("img", { src, alt: "", className: "w-full h-full rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all" })
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold ring-2 ring-border group-hover:ring-primary transition-all", style: { fontSize: size * 0.36 }, children: fallback }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center", children: uploading ? /* @__PURE__ */ jsx(Loader2, { size: Math.round(size / 3), className: "text-pure-white animate-spin" }) : /* @__PURE__ */ jsx(Camera, { size: Math.round(size / 3), className: "text-pure-white" }) })
      ]
    }
  );
}
function Eyebrow({ icon, children, className, ...props }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "inline-flex items-center gap-2 rounded-full border border-(--accent-muted) bg-(--accent-subtle) px-3 py-1",
        className
      ),
      ...props,
      children: [
        icon,
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children })
      ]
    }
  );
}
function SectionHeading({
  badge,
  icon,
  title,
  subtitle,
  align = "center",
  animate = true,
  className,
  ...props
}) {
  const enter = animate ? "animate-enter" : void 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("mb-16", align === "center" ? "text-center" : "text-left", className),
      ...props,
      children: [
        badge != null && /* @__PURE__ */ jsx(Eyebrow, { icon, className: cn("mb-4", enter), children: badge }),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: cn("heading-xl mb-4 text-balance", enter),
            style: animate ? { animationDelay: "100ms" } : void 0,
            children: title
          }
        ),
        subtitle != null && /* @__PURE__ */ jsx(
          "p",
          {
            className: cn(
              "text-body text-lg text-pretty",
              align === "center" && "mx-auto max-w-2xl",
              enter
            ),
            style: animate ? { animationDelay: "200ms" } : void 0,
            children: subtitle
          }
        )
      ]
    }
  );
}
function FeatureCard({
  icon,
  title,
  description,
  delay,
  children,
  className,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card/50 p-8 shadow-sm backdrop-blur-xl",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        delay != null && "animate-enter",
        className
      ),
      style: delay != null ? { animationDelay: `${delay}ms`, ...style } : style,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-foreground/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          icon && /* @__PURE__ */ jsx("div", { className: "feature-icon mb-5 transition-transform duration-200 group-hover:scale-105", children: icon }),
          /* @__PURE__ */ jsx("h3", { className: "heading-md mb-3", children: title }),
          description != null && /* @__PURE__ */ jsx("p", { className: "text-body leading-relaxed", children: description }),
          children
        ] })
      ]
    }
  );
}
function MembershipCard({
  brand,
  badge,
  watermark,
  label,
  status,
  stats = [],
  chip = true,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative w-full max-w-md mx-auto lg:mx-0 aspect-[1.586/1] min-h-56 rounded-[20px]",
        "bg-foreground/80 backdrop-blur-2xl border border-background/15 text-background",
        "shadow-2xl overflow-hidden select-none animate-enter",
        "transition-transform duration-300 hover:-translate-y-1",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full bg-background/15 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1/3 -right-1/4 w-1/2 h-2/3 rounded-full bg-background/8 blur-3xl" }),
        watermark != null && /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute -right-8 -bottom-9 opacity-[0.06]", children: watermark }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute top-0 -left-1/3 h-full w-1/3 -skew-x-12 bg-background/15 blur-xl translate-x-[-200%] group-hover:translate-x-[450%] transition-transform duration-[900ms] ease-out" }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-full flex flex-col justify-between p-6 sm:p-7", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            brand != null && /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: brand }),
            badge != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/15 text-[11px] font-medium", children: [
              badge.icon,
              badge.label
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              label != null && /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.22em] opacity-50 mb-1.5", children: label }),
              status != null && /* @__PURE__ */ jsx("div", { className: "text-lg font-medium leading-tight", children: status })
            ] }),
            chip && /* @__PURE__ */ jsx("div", { className: "hidden sm:block w-9 h-7 rounded-md bg-background/15 border border-background/10 shrink-0" })
          ] }),
          stats.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-end gap-6", children: stats.map((stat, i) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-base font-semibold tabular-nums leading-none", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] opacity-50 mt-1", children: stat.label })
          ] }, i)) })
        ] })
      ]
    }
  );
}
function CTASection({
  title,
  body,
  actions,
  eyebrow,
  animate = true,
  className,
  ...props
}) {
  const enter = animate ? "animate-enter" : void 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        // `isolate` is load-bearing: the radial wash below is `-z-10`, and `relative`
        // alone is NOT a stacking context — without this the wash escapes to the
        // root and disappears the moment a consumer nests this in an opaque box.
        "relative isolate overflow-hidden rounded-3xl border border-border p-12 text-center md:p-16",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute inset-0 -z-10",
            style: {
              background: "radial-gradient(70% 120% at 50% 0%, var(--accent-subtle), transparent 70%)"
            }
          }
        ),
        eyebrow != null && /* @__PURE__ */ jsx("div", { className: cn("mb-4", enter), children: eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: cn("heading-xl mb-4 text-balance", enter), children: title }),
        body != null && /* @__PURE__ */ jsx(
          "p",
          {
            className: cn("text-body mx-auto mb-8 max-w-xl text-lg text-pretty", enter),
            style: animate ? { animationDelay: "100ms" } : void 0,
            children: body
          }
        ),
        actions != null && /* @__PURE__ */ jsx(
          "div",
          {
            className: cn("flex flex-wrap items-center justify-center gap-3", enter),
            style: animate ? { animationDelay: "200ms" } : void 0,
            children: actions
          }
        )
      ]
    }
  );
}
function PullQuote({
  children,
  cite,
  showIcon = true,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs("figure", { className: cn("mx-auto max-w-4xl text-center", className), ...props, children: [
    showIcon && /* @__PURE__ */ jsx(Quote, { "aria-hidden": true, className: "mx-auto mb-6 h-8 w-8 text-muted-foreground/30" }),
    /* @__PURE__ */ jsx("blockquote", { className: "bg-linear-to-r from-foreground to-muted-foreground/70 bg-clip-text text-2xl leading-snug font-semibold tracking-tight text-balance text-transparent md:text-3xl", children }),
    cite != null && /* @__PURE__ */ jsx("figcaption", { className: "text-caption mt-6", children: cite })
  ] });
}
function MarketingHero({
  badge,
  title,
  subtitle,
  actions,
  facts,
  scrollToId,
  scrollLabel = "Scroll down",
  fullHeight = true,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn(
        // `isolate` is load-bearing: the radial wash below is `-z-10`, and `relative`
        // alone is NOT a stacking context, so the wash would escape to the root
        // and vanish behind any opaque ancestor a consumer wraps this in.
        "relative isolate flex flex-col items-center justify-center px-6 pt-32 pb-28",
        fullHeight && "min-h-dvh",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute inset-0 -z-10",
            style: {
              background: "radial-gradient(60% 50% at 50% 30%, var(--accent-subtle), transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto w-full max-w-6xl text-center", children: [
          badge != null && /* @__PURE__ */ jsx("div", { className: "mb-8 animate-enter", children: badge }),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: "mb-6 animate-enter text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl",
              style: { animationDelay: "100ms" },
              children: title
            }
          ),
          subtitle != null && /* @__PURE__ */ jsx(
            "p",
            {
              className: "mx-auto mb-10 max-w-2xl animate-enter text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl",
              style: { animationDelay: "300ms" },
              children: subtitle
            }
          ),
          actions != null && /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex animate-enter flex-col items-center justify-center gap-4 sm:flex-row",
              style: { animationDelay: "400ms" },
              children: actions
            }
          ),
          facts && facts.length > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              className: "mt-8 flex animate-enter flex-wrap items-center justify-center gap-2",
              style: { animationDelay: "500ms" },
              children: facts.map((fact, i) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm",
                  children: fact
                },
                i
              ))
            }
          )
        ] }),
        scrollToId && /* @__PURE__ */ jsx(
          "a",
          {
            href: `#${scrollToId}`,
            "aria-label": scrollLabel,
            className: "absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-muted-foreground/60 transition-colors hover:text-foreground",
            children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5" })
          }
        )
      ]
    }
  );
}
function HeroAccent({ children }) {
  return /* @__PURE__ */ jsx("span", { className: "bg-linear-to-r from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent", children });
}
function ProseArticle({ children, prose = true, className, ...props }) {
  return /* @__PURE__ */ jsx("article", { className: cn("mx-auto max-w-3xl px-6 py-16", className), ...props, children: prose ? /* @__PURE__ */ jsx("div", { className: "prose prose-neutral dark:prose-invert max-w-none", children }) : children });
}
function BackLink({ href, children, className }) {
  const { Link } = useYunUI();
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      className: cn(
        "mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(ChevronLeft, { size: 16, "aria-hidden": true }),
        children
      ]
    }
  );
}
function AuthShell({
  brand,
  homeHref,
  title,
  subtitle,
  error,
  icon,
  children,
  footer,
  centered = false,
  width = "sm",
  className,
  cardClassName,
  ...props
}) {
  const { Link } = useYunUI();
  const brandRowClass = "flex items-center justify-center gap-2.5 mb-8";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "min-h-dvh bg-background flex items-center justify-center px-6",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxs("div", { className: cn("w-full", width === "sm" ? "max-w-sm" : "max-w-md"), children: [
        brand != null && (homeHref ? /* @__PURE__ */ jsx(Link, { href: homeHref, className: brandRowClass, children: brand }) : /* @__PURE__ */ jsx("div", { className: brandRowClass, children: brand })),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "p-6 bg-card border border-border rounded-xl",
              centered && "text-center",
              cardClassName
            ),
            children: [
              icon != null && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: icon }),
              title != null && /* @__PURE__ */ jsx(
                "h1",
                {
                  className: cn(
                    "text-xl font-semibold text-center",
                    subtitle != null ? "mb-2" : "mb-6"
                  ),
                  children: title
                }
              ),
              subtitle != null && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm text-center mb-6", children: subtitle }),
              error ? /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-error-soft text-error text-sm rounded-lg border border-error-soft", children: error }) : null,
              children
            ]
          }
        ),
        footer != null && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: footer })
      ] })
    }
  );
}
function TableState({
  children,
  loading = false,
  surface = "plain",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground",
        surface === "card" && "card",
        className
      ),
      ...props,
      children: [
        loading && /* @__PURE__ */ jsx(Loader2, { "aria-hidden": true, className: "h-4 w-4 animate-spin" }),
        children
      ]
    }
  );
}
function StatGrid({ children, columns = 4, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid grid-cols-2 gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-4",
        className
      ),
      ...props,
      children
    }
  );
}
function DashboardPage({
  children,
  width = "7xl",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "mx-auto space-y-6",
        width === "5xl" && "max-w-5xl",
        width === "6xl" && "max-w-6xl",
        width === "7xl" && "max-w-7xl",
        className
      ),
      ...props,
      children
    }
  );
}
function SectionRow({ title, action, className, ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("mb-4 flex items-center justify-between gap-3", className), ...props, children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
    action
  ] });
}
function SectionNav({ items, offset = 112, label = "Sections", className }) {
  const [active, setActive] = useState(items[0]?.id ?? null);
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // Shrink the viewport to a band just under the header: without it a
        // section counts as visible while it is still behind the navbar.
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: 0
      }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items, offset]);
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsx("nav", { "aria-label": label, className, children: /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: items.map((item) => {
    const isActive = item.id === active;
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: `#${item.id}`,
        "aria-current": isActive ? "true" : void 0,
        className: cn(
          "group flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
          isActive ? "bg-foreground/5 font-medium text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label }),
          item.count !== void 0 && /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "shrink-0 text-xs tabular-nums",
                isActive ? "text-foreground" : "text-muted-foreground"
              ),
              children: item.count
            }
          )
        ]
      }
    ) }, item.id);
  }) }) });
}
var DEFAULT_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
function parts(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function monthShape(year, month) {
  return {
    days: new Date(Date.UTC(year, month, 0)).getUTCDate(),
    firstDay: new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  };
}
function ArchiveCalendar({
  dates,
  href,
  maxMonths = 24,
  weekdays = DEFAULT_WEEKDAYS,
  formatMonth = (year, month) => `${year}-${String(month).padStart(2, "0")}`,
  formatCount,
  formatDayLabel = (date) => date,
  className = ""
}) {
  const { Link } = useYunUI();
  const have = new Set(dates);
  const sorted = [...dates].sort();
  const newest = parts(sorted.at(-1) ?? "");
  const oldest = parts(sorted[0] ?? "");
  if (!newest || !oldest) return null;
  const span = (newest.y - oldest.y) * 12 + (newest.m - oldest.m) + 1;
  const grid = [];
  for (let back = 0; back < Math.min(span, maxMonths); back++) {
    const month = newest.m - back;
    grid.push({
      year: newest.y + Math.floor((month - 1) / 12),
      month: ((month - 1) % 12 + 12) % 12 + 1
    });
  }
  return /* @__PURE__ */ jsx("div", { className: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`, children: grid.map(({ year, month }) => {
    const { days, firstDay } = monthShape(year, month);
    const cells = [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: days }, (_, i) => i + 1)
    ];
    const filled = cells.filter(
      (day) => day && have.has(`${year}-${pad(month)}-${pad(day)}`)
    ).length;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold tracking-tight tabular-nums", children: formatMonth(year, month) }),
        formatCount && /* @__PURE__ */ jsx("span", { className: "text-caption tabular-nums", children: formatCount(filled) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-1", role: "presentation", children: [
        weekdays.map((label, i) => /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "text-caption grid h-6 place-items-center text-[0.6875rem]",
            children: label
          },
          `${label}-${i}`
        )),
        cells.map((day, i) => {
          if (!day) return /* @__PURE__ */ jsx("div", { "aria-hidden": true }, `pad-${i}`);
          const date = `${year}-${pad(month)}-${pad(day)}`;
          if (!have.has(date)) {
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-muted-foreground grid h-8 place-items-center text-xs tabular-nums",
                children: day
              },
              date
            );
          }
          return /* @__PURE__ */ jsx(
            Link,
            {
              href: href(date),
              className: "border-border hover:border-(--accent) hover:text-(--accent) grid h-8 place-items-center rounded-md border text-xs font-medium tabular-nums transition-colors",
              "aria-label": formatDayLabel(date),
              children: day
            },
            date
          );
        })
      ] })
    ] }, `${year}-${month}`);
  }) });
}

export { AccountLockedCard, ActiveBadge, ArchiveCalendar, AudioPlayer, AuthShell, AvatarUploader, BackLink, BackgroundEffects, Banner, BlogCard, BlogPagination, BlogPostHeader, CTASection, CapabilityBadge, CategoryFilter, CodeBlock, CodeDemo, ConnectedAccountRow, DashboardPage, DeprecatedBadge, ErrorBoundary, Eyebrow, FAQ, FeatureCard, FeatureLockedState, FellowBadge, FellowsBanner, HeroAccent, LLMCopyButton, LinkRow, MarketingHero, MediaEmptyState, MediaErrorState, MediaGallery, MediaLoadingState, MediaPageHeader, MembershipCard, MetricBar, NavStateIndicator, NotificationBell, NotificationItem, NotificationPanel, PageEmptyState, PageErrorState, PageHeader, PageLayout, PageLoadingState, ProseArticle, PullQuote, ReadingProgress, SectionHeading, SectionNav, SectionRow, SessionItem, SettingRow, SettingsShell, Sidebar, SimplePagination, SourceBadge, StatCard, StatGrid, StatusBadge, TableState, ViewOptions };
//# sourceMappingURL=patterns.js.map
//# sourceMappingURL=patterns.js.map