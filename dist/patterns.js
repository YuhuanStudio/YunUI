"use client";
import { Button, Card, Badge, Avatar, AvatarImage, AvatarFallback, IconButton, Spinner } from './chunk-ROYADOSY.js';
import { copyToClipboard } from './chunk-N53PNMPJ.js';
export { Footer } from './chunk-N53PNMPJ.js';
import { cn } from './chunk-TFZKMJGF.js';
import { useYunUI } from './chunk-U2LNRVMI.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, RefreshCw, Check, Copy, Plus, FileText, ExternalLink, Calendar, Clock, User, ChevronLeft, ChevronRight, PanelLeftClose, X, ArrowUpRight, ArrowDownRight, GraduationCap, ArrowRight, Award, Waves, SlidersHorizontal, Layers, Fingerprint, Ban, Image, Brain, Eye, Code, MessageSquare, XCircle, Zap, CheckCircle, FileCode, EyeOff } from 'lucide-react';

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
              "px-3 py-1 rounded-md text-xs font-medium transition-all",
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
          className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all hover:bg-(--accent-subtle)",
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
    /* @__PURE__ */ jsx("div", { className: "p-4 bg-(--bg-base)", children: /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-x-auto", children: /* @__PURE__ */ jsx("code", { className: "font-mono", style: { color: "var(--text-primary)" }, children: showLineNumbers ? /* @__PURE__ */ jsx(
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
        openIndex === i ? "bg-card/60 ring-1 ring-accent-muted" : "hover:bg-card/50"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setOpenIndex(openIndex === i ? null : i),
            className: "w-full flex items-center justify-between p-6 text-left gap-4",
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
  "text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors rounded-md hover:bg-fd-accent"
);
function LLMCopyButton({ markdownUrl }) {
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
  return /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleCopy, title: "Copy as Markdown for LLM", className: actionClass, children: [
    copied ? /* @__PURE__ */ jsx(Check, { className: "size-3" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
    copied ? "Copied" : "Copy"
  ] });
}
function ViewOptions({
  markdownUrl,
  githubUrl
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: markdownUrl,
        target: "_blank",
        rel: "noreferrer noopener",
        className: cn(actionClass, "no-underline"),
        title: "View as Markdown",
        children: [
          /* @__PURE__ */ jsx(FileText, { className: "size-3" }),
          "Markdown"
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
        title: "Edit on GitHub",
        children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" }),
          "GitHub"
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
  return /* @__PURE__ */ jsx(Link, { href: url, className: "block h-full", children: /* @__PURE__ */ jsxs(Card, { hover: true, className: `overflow-hidden h-full flex flex-col ${isFeatured ? "md:col-span-2" : ""}`, children: [
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
      tags && tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-3", children: tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/blog?tag=${tag}`;
          },
          className: "text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/80 transition-colors cursor-pointer",
          children: [
            "#",
            tag
          ]
        },
        tag
      )) })
    ] })
  ] }) });
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
        className: selectedCategory === category ? "font-semibold" : "",
        style: selectedCategory === category ? { background: "var(--bg-elevated)", color: "var(--text-primary)" } : void 0,
        children: category
      },
      category
    ))
  ] });
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
  scrollStorageKey = "yunui-sidebar-scroll"
}) {
  const { Link, Image } = useYunUI();
  const navRef = useRef(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const saved = sessionStorage.getItem(scrollStorageKey);
    if (saved) nav.scrollTop = parseInt(saved, 10);
    const onScroll = () => sessionStorage.setItem(scrollStorageKey, String(nav.scrollTop));
    nav.addEventListener("scroll", onScroll);
    return () => nav.removeEventListener("scroll", onScroll);
  }, [scrollStorageKey]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isOpen && /* @__PURE__ */ jsx(
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
        role: "navigation",
        "aria-label": "Main navigation",
        className: `
                fixed inset-y-0 left-0 z-50
                min-w-64 w-64 bg-(--bg-base) border-r border-(--border-hairline)
                flex flex-col h-dvh
                transition-transform duration-200 ease-in-out
                ${isOpen ? "translate-x-0" : collapsed ? "-translate-x-full" : "-translate-x-full lg:translate-x-0"}
            `,
        children: [
          /* @__PURE__ */ jsx("div", { className: "py-3 px-3 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center py-2 pl-0 pr-1 gap-2", children: [
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
          /* @__PURE__ */ jsx("nav", { ref: navRef, className: "flex-1 overflow-y-auto py-3 px-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "space-y-2 animate-pulse", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-9 rounded-lg bg-foreground/5" }, i)) }) : sections.map((section, i) => /* @__PURE__ */ jsxs("div", { className: i > 0 ? "mt-4" : "", children: [
            section.title && /* @__PURE__ */ jsx("div", { className: "nav-section", children: section.title }),
            section.items.map((item) => {
              const active = isItemActive(item, currentPath, homeHref);
              const Icon = item.icon;
              const content = /* @__PURE__ */ jsxs(Fragment, { children: [
                Icon && /* @__PURE__ */ jsx(Icon, { size: 18, strokeWidth: 1.75, className: "shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 min-w-0 truncate", children: item.label })
              ] });
              const className = `nav-item ${active ? "active" : ""}`;
              return onNavigate ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  onClick: (e) => {
                    e.preventDefault();
                    onNavigate(item.href);
                    onClose?.();
                  },
                  className,
                  children: content
                },
                item.href
              ) : /* @__PURE__ */ jsx(Link, { href: item.href, onClick: () => onClose?.(), className, children: content }, item.href);
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
function PageLoadingState({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-16", children: [
    /* @__PURE__ */ jsx(Spinner, { size: "lg" }),
    message && /* @__PURE__ */ jsx("span", { className: "ml-3 text-muted-foreground", children: message })
  ] });
}
function PageErrorState({ message, onRetry, retryLabel = "Retry" }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-red-600 dark:text-red-400 font-medium mb-2", children: message }),
    onRetry && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onRetry,
        className: "text-sm text-muted-foreground hover:text-foreground transition-colors underline",
        children: retryLabel
      }
    )
  ] });
}
function PageEmptyState({ icon: Icon, title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    Icon && /* @__PURE__ */ jsx(Icon, { size: 40, className: "text-muted-foreground/40 mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "font-medium mb-1", children: title }),
    description && /* @__PURE__ */ jsx("div", { className: "text-caption", children: description }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-4", children: action })
  ] });
}
var TONES = {
  amber: { card: "border-amber-500/20 bg-amber-500/5", value: "text-amber-600 dark:text-amber-400" },
  emerald: { card: "border-emerald-500/20 bg-emerald-500/5", value: "text-emerald-600 dark:text-emerald-400" },
  blue: { card: "border-blue-500/20 bg-blue-500/5", value: "text-blue-600 dark:text-blue-400" },
  red: { card: "border-red-500/20 bg-red-500/5", value: "text-red-600 dark:text-red-400" },
  purple: { card: "border-purple-500/20 bg-purple-500/5", value: "text-purple-600 dark:text-purple-400" }
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
      className: `card p-5 flex flex-col gap-4 sm:flex-row sm:items-center border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all group ${className}`,
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
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { size: 32, className: "text-red-500" }) }),
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
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10", children: icon }),
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
          className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60",
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
    syncError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm", children: [
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
    /* @__PURE__ */ jsx(AlertCircle, { size: 40, className: "text-red-500/50 mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "font-medium text-red-600 dark:text-red-400 mb-1", children: t("error") }),
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
    chat: { icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", labelKey: "chat" },
    streaming: { icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", labelKey: "streaming" },
    function_calling: { icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", labelKey: "functionCalling" },
    vision: { icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", labelKey: "vision" },
    thinking: { icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20", labelKey: "thinking" },
    image_edit: { icon: Image, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", labelKey: "imageEdit" },
    negative_prompt: { icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", labelKey: "negativePrompt" },
    seed_control: { icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", labelKey: "seedControl" },
    lora: { icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20", labelKey: "loraSupport" },
    guidance_scale: { icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", labelKey: "guidanceScale" },
    strength: { icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", labelKey: "strength" },
    batch: { icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", labelKey: "batchGeneration" }
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

export { AccountLockedCard, ActiveBadge, BackgroundEffects, BlogCard, BlogPagination, BlogPostHeader, CapabilityBadge, CategoryFilter, CodeBlock, CodeDemo, DeprecatedBadge, ErrorBoundary, FAQ, FellowBadge, FellowsBanner, LLMCopyButton, MediaEmptyState, MediaErrorState, MediaLoadingState, MediaPageHeader, PageEmptyState, PageErrorState, PageHeader, PageLoadingState, Sidebar, SimplePagination, SourceBadge, StatCard, StatusBadge, ViewOptions };
//# sourceMappingURL=patterns.js.map
//# sourceMappingURL=patterns.js.map