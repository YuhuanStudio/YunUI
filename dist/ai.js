"use client";
import { copyToClipboard } from './chunk-UYYG4XDW.js';
export { DiscordIcon, Footer, GithubIcon, InstagramIcon } from './chunk-UYYG4XDW.js';
import { ThemeToggle } from './chunk-GSPJ5YI6.js';
import { cn, useAnchoredPosition } from './chunk-AV5TGEJS.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import { memo, useState, useRef, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pin, MessageSquare, Waves, Code, Eye, Brain, Pencil, Ban, Fingerprint, Layers, SlidersHorizontal, Mic, Video, Music, Box, Radio, ChevronUp, ChevronDown, Check, Copy, Image, PauseCircle, Search, X, Sparkles, Bot, Globe, Menu, ShieldAlert, Wrench, FileText, Terminal, Loader2, Shield, Shuffle, Volume2, Headphones, Palette, Hash } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { cva } from 'class-variance-authority';

function ThinkingBlock({ content, isStreaming, defaultOpen = false, renderContent }) {
  const t = useYunUI().useT("common.thinking");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: "my-2 rounded-xl border border-border bg-muted/30 overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        "aria-expanded": isOpen,
        className: "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        children: [
          /* @__PURE__ */ jsx("div", { className: cn(
            "flex items-center justify-center w-5 h-5 rounded-md bg-muted text-muted-foreground",
            isStreaming && "animate-pulse"
          ), children: /* @__PURE__ */ jsx(Brain, { size: 11 }) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium whitespace-nowrap", children: t("label") }),
          isStreaming && /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap", children: t("active") }),
          /* @__PURE__ */ jsx("div", { className: "ml-auto", children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 14, className: "text-muted-foreground/70" }) : /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "text-muted-foreground/70" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.2, ease: "easeInOut" },
        children: /* @__PURE__ */ jsx("div", { className: "px-3 pb-2.5 pt-1.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50", children: content ? /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground", children: [
          renderContent ? renderContent(content) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: content }),
          isStreaming && /* @__PURE__ */ jsx(
            motion.span,
            {
              animate: { opacity: [0.4, 1, 0.4] },
              transition: { duration: 1.2, repeat: Infinity },
              className: "inline-block w-1 h-3 bg-muted-foreground/60 ml-0.5 align-middle"
            }
          )
        ] }) : /* @__PURE__ */ jsx("span", { className: "italic opacity-50", children: t("inProgress") }) })
      }
    ) })
  ] });
}
var ICONS = {
  terminal: Terminal,
  search: Search,
  globe: Globe,
  image: Image,
  file: FileText,
  tool: Wrench
};
function Rail({ children, tone = "muted", isLast }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center self-stretch", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "relative z-10 mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-background ring-1 transition-colors",
          tone === "muted" && "text-muted-foreground ring-border",
          tone === "running" && "text-primary ring-primary/40",
          tone === "error" && "text-red-500 ring-red-500/40 dark:text-red-400",
          tone === "warn" && "text-amber-500 ring-amber-500/40"
        ),
        children
      }
    ),
    !isLast && /* @__PURE__ */ jsx("span", { className: "my-1 w-0.5 flex-1 rounded-full bg-border" })
  ] });
}
function Collapse({ open, children }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      ),
      children: /* @__PURE__ */ jsx("div", { className: "min-h-0 overflow-hidden", children })
    }
  );
}
function Chevron({ open }) {
  return /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: cn("shrink-0 text-muted-foreground/50 transition-transform duration-200", open && "rotate-180") });
}
function ReasoningRow({ block, isLast, renderContent }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5", children: [
    /* @__PURE__ */ jsx(Rail, { tone: "muted", isLast, children: /* @__PURE__ */ jsx(Brain, { size: 13, strokeWidth: 1.75 }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 pb-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen(!open),
          "aria-expanded": open,
          className: "flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          children: [
            /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-[13px] text-muted-foreground", children: block.label }),
            /* @__PURE__ */ jsx(Chevron, { open })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Collapse, { open, children: /* @__PURE__ */ jsx("div", { className: "mt-1.5 rounded-md border-l-2 border-border bg-muted/30 px-3 py-2 text-[12.5px] leading-relaxed text-muted-foreground", children: renderContent ? renderContent(block.content) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: block.content }) }) })
    ] })
  ] });
}
function ToolRow({ block, isLast }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[block.icon ?? "tool"];
  const error = block.status === "error";
  const expandable = !!block.output || !!block.command;
  const tone = block.status === "running" ? "running" : error ? "error" : "muted";
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5", children: [
    /* @__PURE__ */ jsx(Rail, { tone, isLast, children: block.status === "running" ? /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin" }) : /* @__PURE__ */ jsx(Icon, { size: 13, strokeWidth: 1.75 }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 pb-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => expandable && setOpen(!open),
          "aria-expanded": open,
          className: cn(
            "flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            expandable ? "hover:bg-muted/50 cursor-pointer" : "cursor-default"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[13px] font-medium text-foreground", children: block.verb }),
            block.summary && /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted-foreground", children: block.summary }),
            /* @__PURE__ */ jsxs("span", { className: cn("flex shrink-0 items-center gap-2", !block.summary && "ml-auto"), children: [
              block.status === "done" && /* @__PURE__ */ jsx(Check, { size: 14, className: "text-emerald-500" }),
              error && /* @__PURE__ */ jsx("span", { className: "rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400", children: "error" }),
              expandable && /* @__PURE__ */ jsx(Chevron, { open })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Collapse, { open, children: /* @__PURE__ */ jsxs("div", { className: cn("mt-1.5 overflow-hidden rounded-lg border font-mono text-xs", error ? "border-red-500/20 bg-red-500/5" : "border-border bg-muted/40"), children: [
        block.command && /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-1.5 border-b px-3 py-1.5 text-muted-foreground", error ? "border-red-500/20" : "border-border/60"), children: [
          /* @__PURE__ */ jsx("span", { className: "select-none text-muted-foreground/40", children: "$" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: block.command })
        ] }),
        /* @__PURE__ */ jsx("div", { className: cn("max-h-72 overflow-auto whitespace-pre-wrap break-words px-3 py-2.5 leading-relaxed", error ? "text-red-600 dark:text-red-400" : "text-foreground/80"), children: block.output || "\u2014" })
      ] }) })
    ] })
  ] });
}
function ApprovalRow({ block, isLast, onApprove, onReject }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5", children: [
    /* @__PURE__ */ jsx(Rail, { tone: "warn", isLast, children: /* @__PURE__ */ jsx(ShieldAlert, { size: 13, strokeWidth: 1.75 }) }),
    /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 pb-2", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[13px] font-medium text-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: block.title }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground", children: block.verb })
      ] }),
      block.message && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-[12.5px] text-muted-foreground", children: block.message }),
      block.argsText && /* @__PURE__ */ jsx("pre", { className: "mt-1.5 max-h-40 overflow-auto rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-[11.5px] text-muted-foreground", children: block.argsText }),
      /* @__PURE__ */ jsx("div", { className: "mt-2.5 flex items-center gap-2", children: block.decision ? /* @__PURE__ */ jsx("span", { className: cn("text-xs font-medium", block.decision === "approved" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"), children: block.decidedLabel }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onApprove?.(block.id), className: "rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring", children: block.allowLabel }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onReject?.(block.id), className: "rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring", children: block.denyLabel })
      ] }) })
    ] }) })
  ] });
}
function AgentTimeline({ blocks, renderContent, onApprove, onReject, className }) {
  const visible = blocks.filter((b) => !(b.kind === "reasoning" && !b.content.trim()));
  if (!visible.length) return null;
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-col", className), children: visible.map((b, i) => {
    const isLast = i === visible.length - 1;
    switch (b.kind) {
      case "reasoning":
        return /* @__PURE__ */ jsx(ReasoningRow, { block: b, isLast, renderContent }, b.id);
      case "tool":
        return /* @__PURE__ */ jsx(ToolRow, { block: b, isLast }, b.id);
      case "approval":
        return /* @__PURE__ */ jsx(ApprovalRow, { block: b, isLast, onApprove, onReject }, b.id);
      default:
        return null;
    }
  }) });
}
function IDBadge({ text, truncate = true }) {
  const [copied, setCopied] = useState(false);
  const t = useYunUI().useT("common.badge");
  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!await copyToClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      className: `group/badge relative inline-flex items-center rounded-md bg-muted border border-border hover:bg-muted/70 cursor-pointer transition-colors duration-200 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring ${truncate ? "max-w-full min-w-0" : ""}`,
      title: t("clickToCopy", { text }),
      "aria-label": t("clickToCopy", { text }),
      children: [
        /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-xs font-mono block ${truncate ? "truncate max-w-full min-w-0" : "whitespace-nowrap"}`, children: text }),
        /* @__PURE__ */ jsx("span", { className: "opacity-0 group-hover/badge:opacity-100 absolute right-0 inset-y-0 w-5 flex items-center justify-center rounded-r-md bg-muted/90 backdrop-blur-sm transition-opacity duration-200", children: copied ? /* @__PURE__ */ jsx(Check, { size: 10 }) : /* @__PURE__ */ jsx(Copy, { size: 10 }) })
      ]
    }
  );
}
var CAPABILITY_ICONS = {
  streaming: { icon: Waves, color: "text-cyan-500" },
  vision: { icon: Eye, color: "text-amber-500" },
  thinking: { icon: Brain, color: "text-pink-500" },
  function_calling: { icon: Code, color: "text-purple-500" },
  image_edit: { icon: Image, color: "text-orange-500" },
  negative_prompt: { icon: Ban, color: "text-red-500" },
  seed_control: { icon: Fingerprint, color: "text-indigo-500" },
  lora: { icon: Layers, color: "text-teal-500" },
  guidance_scale: { icon: SlidersHorizontal, color: "text-yellow-500" },
  strength: { icon: SlidersHorizontal, color: "text-orange-500" },
  batch: { icon: Waves, color: "text-cyan-500" }
};
function ModelCard({
  name,
  icon,
  ids = [],
  description,
  capabilities = [],
  developer,
  context,
  tier,
  price,
  nonofficial,
  suspended,
  labels,
  onClick,
  className = ""
}) {
  const { Image } = useYunUI();
  const shownCaps = capabilities.filter((c) => CAPABILITY_ICONS[c]).slice(0, 4);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onKeyDown: (e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      },
      className: `card card-interactive p-4 text-left w-full group cursor-pointer flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          icon,
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: shownCaps.map((cap) => {
            const { icon: Icon, color } = CAPABILITY_ICONS[cap];
            return /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-muted/50", title: cap, children: /* @__PURE__ */ jsx(Icon, { size: 11, className: color }) }, cap);
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxs("div", { className: "font-medium text-sm group-hover:text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: name }),
          nonofficial && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] px-1.5 py-0.5 rounded badge-warning font-medium whitespace-nowrap", children: labels?.nonofficial ?? "Unofficial" }),
          suspended && /* @__PURE__ */ jsxs("span", { className: "shrink-0 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded badge-warning font-medium whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(PauseCircle, { size: 10 }),
            labels?.suspended ?? "Suspended"
          ] })
        ] }) }),
        ids.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5 mb-3", children: ids.map((id, idx) => /* @__PURE__ */ jsx(IDBadge, { text: id }, idx)) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5em]", children: description || /* @__PURE__ */ jsx("span", { className: "opacity-40", children: labels?.noDescription ?? "No description" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
            developer?.iconUrl && /* @__PURE__ */ jsx("div", { className: "rounded-md overflow-hidden bg-muted", style: { width: 12, height: 12 }, children: /* @__PURE__ */ jsx(Image, { src: developer.iconUrl, alt: developer.label, width: 12, height: 12, className: "object-cover" }) }),
            developer?.label && /* @__PURE__ */ jsx("span", { className: "truncate min-w-0", children: developer.label })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            context && /* @__PURE__ */ jsx("span", { className: "bg-muted px-1.5 py-0.5 rounded-sm font-medium", children: context }),
            tier && tier !== "free" && /* @__PURE__ */ jsx("span", { className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-medium", children: tier }),
            price && /* @__PURE__ */ jsx("span", { className: "font-mono", children: price })
          ] })
        ] })
      ]
    }
  );
}
function ModelSelect({
  options,
  value,
  onChange,
  className,
  labels,
  pinned,
  onTogglePin,
  filters,
  renderFooter
}) {
  const L = {
    placeholder: "Select a model",
    search: "Search models\u2026",
    clearSearch: "Clear",
    clearFilters: "Clear filters",
    all: "All",
    pinned: "Pinned",
    noResults: "No models found",
    ...labels
  };
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const { shift, maxHeight } = useAnchoredPosition(isOpen, panelRef);
  const pinnedSet = useMemo(() => new Set(pinned ?? []), [pinned]);
  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
      if (value && listRef.current) {
        const el = listRef.current.querySelector(`[data-model-id="${CSS.escape(value)}"]`);
        el?.scrollIntoView({ block: "center" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen, value]);
  const groups = useMemo(() => {
    const counts = {};
    for (const o of options) counts[o.group] = (counts[o.group] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([g]) => g);
  }, [options]);
  const groupLabel = useMemo(() => {
    const m = {};
    for (const o of options) if (o.groupLabel) m[o.group] = o.groupLabel;
    return m;
  }, [options]);
  const groupIcon = useMemo(() => {
    const m = {};
    for (const o of options) if (o.groupIcon && !(o.group in m)) m[o.group] = o.groupIcon;
    return m;
  }, [options]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options.filter((o) => {
      if (q) {
        const hay = `${o.label} ${o.searchText ?? ""} ${o.group}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeGroup && o.group !== activeGroup) return false;
      if (activeFilters.length && filters) {
        const fs = filters.filter((f) => activeFilters.includes(f.key));
        if (!fs.every((f) => f.match(o))) return false;
      }
      return true;
    });
  }, [options, search, activeGroup, activeFilters, filters]);
  const pinnedList = filtered.filter((o) => pinnedSet.has(o.id));
  const grouped = useMemo(() => {
    const acc = {};
    for (const o of filtered) {
      if (pinnedSet.has(o.id)) continue;
      (acc[o.group] ??= []).push(o);
    }
    return acc;
  }, [filtered, pinnedSet]);
  const selected = options.find((o) => o.id === value);
  const onWheel = (e) => {
    const el = e.currentTarget;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if (atTop && e.deltaY < 0 || atBottom && e.deltaY > 0) e.preventDefault();
  };
  const select = (id) => {
    onChange(id);
    setIsOpen(false);
  };
  const flatOptions = useMemo(() => {
    const out = [...pinnedList];
    for (const opts of Object.values(grouped)) out.push(...opts);
    return out;
  }, [pinnedList, grouped]);
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    setActiveIndex(-1);
  }, [isOpen, search, activeGroup, activeFilters]);
  const clearActiveOnPointer = () => setActiveIndex((i) => i === -1 ? i : -1);
  useEffect(() => {
    const id = flatOptions[activeIndex]?.id;
    if (!isOpen || !id || !listRef.current) return;
    listRef.current.querySelector(`[data-model-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, flatOptions]);
  const activeId = flatOptions[activeIndex]?.id;
  const rowDomId = (id) => `yunui-ms-opt-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  const onSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => i < 0 ? flatOptions.length - 1 : Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = flatOptions[activeIndex] ?? flatOptions[0];
      if (o) select(o.id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };
  return (
    // Fixed-width root so the trigger doesn't grow/shrink as the selected
    // label changes; override the width via `className`.
    /* @__PURE__ */ jsxs("div", { ref: rootRef, className: cn("relative w-64", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen((o) => !o),
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
          className: cn(
            "flex items-center gap-2 px-3 py-2 bg-card border rounded-xl text-left group transition-all w-full shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isOpen ? "border-ring/60 ring-2 ring-ring/25" : "border-border hover:border-ring"
          ),
          children: [
            selected ? /* @__PURE__ */ jsxs(Fragment, { children: [
              selected.icon,
              /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-sm font-medium", children: selected.label })
            ] }) : /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm text-muted-foreground", children: L.placeholder }),
            /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: cn("text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180") })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxs(
        motion.div,
        {
          ref: panelRef,
          initial: { opacity: 0, y: -8, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.16, ease: "easeOut" },
          style: { maxWidth: "calc(100vw - 1rem)", marginLeft: shift, maxHeight },
          className: "origin-top absolute z-50 top-full left-0 mt-2 w-96 max-w-[calc(100vw-1rem)] flex flex-col bg-background backdrop-blur-2xl border border-border rounded-2xl shadow-lg shadow-black/5 text-popover-foreground overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-2.5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: inputRef,
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    onKeyDown: onSearchKeyDown,
                    placeholder: L.search,
                    "aria-label": L.search,
                    role: "combobox",
                    "aria-expanded": isOpen,
                    "aria-controls": "yunui-ms-listbox",
                    "aria-activedescendant": activeId ? rowDomId(activeId) : void 0,
                    className: "w-full pl-9 pr-8 py-2 text-sm bg-muted/50 border border-transparent rounded-xl outline-none focus:border-ring focus:bg-background transition-colors"
                  }
                ),
                search && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSearch(""), title: L.clearSearch, "aria-label": L.clearSearch, className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { size: 13 }) })
              ] }),
              filters && filters.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 px-1", children: [
                filters.map((f) => {
                  const on = activeFilters.includes(f.key);
                  return /* @__PURE__ */ jsx("button", { type: "button", title: f.title, "aria-label": f.title, "aria-pressed": on, onClick: () => setActiveFilters((p) => p.includes(f.key) ? p.filter((k) => k !== f.key) : [...p, f.key]), className: cn("p-1 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "bg-foreground/10" : "hover:bg-muted"), children: f.node }, f.key);
                }),
                activeFilters.length > 0 && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setActiveFilters([]), title: L.clearFilters, "aria-label": L.clearFilters, className: "p-1 rounded-md text-muted-foreground hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { size: 14 }) })
              ] })
            ] }),
            groups.length > 1 && /* @__PURE__ */ jsx("div", { className: "px-2.5 py-2 border-b border-border/50 overflow-x-auto overflow-y-hidden overscroll-x-contain", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 min-w-max", children: [
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveGroup(null), "aria-pressed": !activeGroup, className: cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", !activeGroup ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"), children: [
                L.all,
                " (",
                options.length,
                ")"
              ] }),
              groups.map((g) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveGroup((c) => c === g ? null : g), "aria-pressed": activeGroup === g, className: cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", activeGroup === g ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"), children: [
                groupIcon[g],
                groupLabel[g] ?? g
              ] }, g))
            ] }) }),
            /* @__PURE__ */ jsxs("div", { ref: listRef, onWheel, onMouseMove: clearActiveOnPointer, id: "yunui-ms-listbox", role: "listbox", className: "flex-1 min-h-0 max-h-96 overflow-y-auto overscroll-contain", children: [
              pinnedList.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-1.5 py-1.5 border-b border-border/40", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Pin, { size: 9 }),
                  " ",
                  L.pinned
                ] }),
                pinnedList.map((o) => /* @__PURE__ */ jsx(ModelRow, { domId: rowDomId(o.id), active: o.id === activeId, option: o, selected: o.id === value, pinned: true, isPinnable: !!onTogglePin, onSelect: () => select(o.id), onTogglePin: () => onTogglePin?.(o.id) }, o.id))
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-1.5 py-1.5", children: Object.entries(grouped).map(([g, opts]) => /* @__PURE__ */ jsxs("div", { className: "mb-3 last:mb-0", children: [
                /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 pt-1 pb-1.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-muted px-3 py-2", children: [
                  groupIcon[g],
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: groupLabel[g] ?? g }),
                  /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 min-w-5 text-center text-[10px] font-semibold tabular-nums text-muted-foreground bg-foreground/10 px-1.5 py-0.5 rounded-md", children: opts.length })
                ] }) }),
                opts.map((o) => /* @__PURE__ */ jsx(ModelRow, { domId: rowDomId(o.id), active: o.id === activeId, option: o, selected: o.id === value, pinned: false, isPinnable: !!onTogglePin, onSelect: () => select(o.id), onTogglePin: () => onTogglePin?.(o.id) }, o.id))
              ] }, g)) }),
              filtered.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-12 text-center text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Sparkles, { size: 28, className: "mx-auto mb-3 opacity-40" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm", children: L.noResults })
              ] })
            ] }),
            renderFooter && filtered.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-border/50 px-3 py-2 bg-muted/30 text-xs text-muted-foreground", children: renderFooter(filtered.length) })
          ]
        }
      )
    ] })
  );
}
var ModelRow = memo(function ModelRow2({
  option,
  selected,
  active,
  domId,
  pinned,
  isPinnable,
  onSelect,
  onTogglePin
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id: domId,
      "data-model-id": option.id,
      role: "option",
      "aria-selected": selected,
      onClick: onSelect,
      className: cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors",
        // A clear gray fill on both states (selected solid, hover lighter)
        // — the bar's opacity then tells selected from merely-hovered.
        selected ? "bg-muted" : "hover:bg-muted",
        // keyboard highlight (arrow-key navigation)
        active && "bg-muted ring-2 ring-ring/40"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: { left: "5px" },
            className: cn(
              "absolute top-1/2 w-1 h-6 rounded-full bg-primary transition-all duration-150 -translate-y-1/2",
              selected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1.5 group-hover:opacity-50 group-hover:translate-x-0"
            )
          }
        ),
        option.icon,
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium truncate", children: option.label }),
            option.badges
          ] }),
          option.detail
        ] }),
        option.meta && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 shrink-0", children: option.meta }),
        isPinnable && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              onTogglePin();
            },
            className: cn(
              "p-1.5 rounded-md transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100",
              pinned ? "text-foreground opacity-100 hover:bg-muted/50" : "text-muted-foreground/40 opacity-60 hover:text-foreground/70 hover:bg-muted/50"
            ),
            "aria-label": pinned ? "Unpin" : "Pin",
            children: /* @__PURE__ */ jsx(Pin, { size: 14, className: pinned ? "fill-current" : "" })
          }
        )
      ]
    }
  );
});
function ModelManagerCard({
  icon,
  name,
  nameBadges,
  ids,
  selectSlot,
  actions,
  fields,
  capabilities,
  selected,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "card p-5 transition-shadow hover:shadow-md",
        selected && "ring-2 ring-primary/40 bg-muted/30",
        className
      ),
      children: [
        selectSlot && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 -mt-2 mb-3 min-h-7", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: selectSlot }),
          actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5 -mr-1.5 text-muted-foreground", children: actions })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          icon && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-2 gap-y-1 flex-wrap min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold leading-tight min-w-0 break-words", children: name }),
                nameBadges
              ] }),
              !selectSlot && actions && /* @__PURE__ */ jsx("div", { className: "shrink-0 -mr-1.5 -mt-1 flex items-center gap-0.5 text-muted-foreground", children: actions })
            ] }),
            ids && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1 mt-1.5", children: ids })
          ] })
        ] }),
        fields && fields.length > 0 && /* @__PURE__ */ jsx("dl", { className: "grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm", children: fields.map((f, i) => /* @__PURE__ */ jsxs("div", { className: cn("min-w-0", f.full && "col-span-2"), children: [
          /* @__PURE__ */ jsx("dt", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: f.label }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1", children: f.value })
        ] }, i)) }),
        capabilities && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          capabilities.label && /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5", children: capabilities.label }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: capabilities.value })
        ] })
      ]
    }
  );
}
var llmCapabilityConfig = [
  { value: "chat", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "streaming", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" },
  { value: "function_calling", icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
  { value: "vision", icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20" },
  { value: "thinking", icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20" }
];
var imageCapabilityConfig = [
  { value: "image_edit", icon: Pencil, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "negative_prompt", icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20" },
  { value: "seed_control", icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" },
  { value: "lora", icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20" },
  { value: "guidance_scale", icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" },
  { value: "strength", icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "batch", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" }
];
var audioCapabilityConfig = [
  { value: "tts", icon: Mic, iconColor: "text-green-500", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20" },
  { value: "stt", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "audio_translation", icon: Waves, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20" }
];
var videoCapabilityConfig = [
  { value: "video_generation", icon: Video, iconColor: "text-red-500", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20" }
];
var musicCapabilityConfig = [
  { value: "music_generation", icon: Music, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20" }
];
var threedCapabilityConfig = [
  { value: "threed_generation", icon: Box, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" }
];
var realtimeCapabilityConfig = [
  { value: "realtime_voice", icon: Radio, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" }
];
function CapabilitySelector({ selected, onChange, disabled = false, size = "md", columns = 4, modelType }) {
  const t = useYunUI().useT("capabilities");
  const toggleCapability = (cap) => {
    if (disabled) return;
    onChange(
      selected.includes(cap) ? selected.filter((c) => c !== cap) : [...selected, cap]
    );
  };
  const buildCapabilities = (config) => {
    return config.map((cap) => ({
      ...cap,
      label: t(cap.value)
    }));
  };
  const getCapabilities = () => {
    switch (modelType) {
      case "image_generation":
        return buildCapabilities(imageCapabilityConfig);
      case "audio":
      case "tts":
      case "stt":
        return buildCapabilities(audioCapabilityConfig);
      case "video":
      case "video_generation":
        return buildCapabilities(videoCapabilityConfig);
      case "music":
      case "music_generation":
        return buildCapabilities(musicCapabilityConfig);
      case "3d":
      case "threed":
      case "threed_generation":
        return buildCapabilities(threedCapabilityConfig);
      case "realtime":
      case "realtime_voice":
        return buildCapabilities(realtimeCapabilityConfig);
      default:
        return buildCapabilities(llmCapabilityConfig);
    }
  };
  const capabilityOptions = getCapabilities();
  const sizeClasses = size === "sm" ? "p-2.5 text-xs gap-1.5" : "p-3 text-sm gap-2";
  const iconSize = size === "sm" ? 14 : 16;
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
  }[columns] || "grid-cols-2 sm:grid-cols-3";
  return /* @__PURE__ */ jsx("div", { className: `grid ${gridColsClass} gap-2`, children: capabilityOptions.map((cap) => {
    const isSelected = selected.includes(cap.value);
    const Icon = cap.icon;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => toggleCapability(cap.value),
        disabled,
        "aria-pressed": isSelected,
        className: `rounded-lg border text-left transition-colors flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring ${sizeClasses} ${isSelected ? cap.color : "bg-background border-border hover:bg-muted/50"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
        children: [
          /* @__PURE__ */ jsx(Icon, { size: iconSize, className: `${isSelected ? "" : cap.iconColor} shrink-0` }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: cap.label })
        ]
      },
      cap.value
    );
  }) });
}
var CAPABILITY_BY_KEY = Object.fromEntries(
  [
    ...llmCapabilityConfig,
    ...imageCapabilityConfig,
    ...audioCapabilityConfig,
    ...videoCapabilityConfig,
    ...musicCapabilityConfig,
    ...threedCapabilityConfig,
    ...realtimeCapabilityConfig
  ].map((c) => [c.value, c])
);
function isKnownCapability(capability) {
  return capability in CAPABILITY_BY_KEY;
}
function CapabilityIcon({
  capability,
  size = 14,
  className
}) {
  const cfg = CAPABILITY_BY_KEY[capability];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsx(Icon, { size, className: cn(cfg.iconColor, "shrink-0", className) });
}

// src/ai/icon-slugs.generated.ts
var PROVIDER_ICON_SLUGS = /* @__PURE__ */ new Set([
  "ace",
  "adobe",
  "adobefirefly",
  "agentvoice",
  "agui",
  "ai2",
  "ai21",
  "ai302",
  "ai360",
  "aihubmix",
  "aimass",
  "aionlabs",
  "airjelly",
  "aistudio",
  "akashchat",
  "alephalpha",
  "alibaba",
  "alibabacloud",
  "amp",
  "antgroup",
  "anthropic",
  "antigravity",
  "anyscale",
  "apertis",
  "apple",
  "arcee",
  "askverdict",
  "assemblyai",
  "atlascloud",
  "automatic",
  "aws",
  "aya",
  "azure",
  "azureai",
  "baai",
  "baichuan",
  "baidu",
  "baiducloud",
  "bailian",
  "baseten",
  "bedrock",
  "bfl",
  "bilibili",
  "bilibiliindex",
  "bing",
  "briaai",
  "burncloud",
  "bytedance",
  "capcut",
  "centml",
  "cerebras",
  "chatglm",
  "cherrystudio",
  "civitai",
  "claude",
  "claudecode",
  "cline",
  "clipdrop",
  "cloudflare",
  "codebuddy",
  "codeflicker",
  "codegeex",
  "codex",
  "cogvideo",
  "cogview",
  "cohere",
  "colab",
  "cometapi",
  "comfyui",
  "commanda",
  "copilot",
  "copilotkit",
  "coqui",
  "coze",
  "crewai",
  "crusoe",
  "cursor",
  "cybercut",
  "dalle",
  "dbrx",
  "deepai",
  "deepcogito",
  "deepinfra",
  "deepl",
  "deepmind",
  "deepseek",
  "devin",
  "dify",
  "doc2x",
  "docsearch",
  "dolphin",
  "doubao",
  "dreammachine",
  "elevenlabs",
  "elevenx",
  "essentialai",
  "exa",
  "fal",
  "fastgpt",
  "featherless",
  "figma",
  "fireworks",
  "fishaudio",
  "flora",
  "flowith",
  "flux",
  "friendli",
  "gemini",
  "geminicli",
  "gemma",
  "giteeai",
  "github",
  "githubcopilot",
  "glama",
  "glif",
  "glmv",
  "google",
  "googlecloud",
  "goose",
  "gradio",
  "greptile",
  "grok",
  "groq",
  "hailuo",
  "haiper",
  "hedra",
  "hermesagent",
  "higress",
  "huawei",
  "huaweicloud",
  "huggingface",
  "hunyuan",
  "hyperbolic",
  "ibm",
  "ideogram",
  "iflytekcloud",
  "inception",
  "inference",
  "infermatic",
  "infinigence",
  "inflection",
  "internlm",
  "jimeng",
  "jina",
  "junie",
  "kilocode",
  "kimi",
  "kiro",
  "kling",
  "kluster",
  "kolors",
  "krea",
  "kwaikat",
  "kwaipilot",
  "lambda",
  "langchain",
  "langfuse",
  "langgraph",
  "langsmith",
  "leptonai",
  "lg",
  "lightricks",
  "liquid",
  "livekit",
  "llamaindex",
  "llava",
  "llmapi",
  "lmstudio",
  "lobehub",
  "longcat",
  "lovable",
  "lovart",
  "luma",
  "magic",
  "make",
  "manus",
  "mastra",
  "mcp",
  "mcpso",
  "menlo",
  "meshy",
  "meta",
  "metaai",
  "metagpt",
  "microsoft",
  "midjourney",
  "minimax",
  "mistral",
  "modelscope",
  "monica",
  "moonshot",
  "morph",
  "moxt",
  "myshell",
  "n8n",
  "nanobanana",
  "nebius",
  "newapi",
  "notebooklm",
  "notion",
  "nousresearch",
  "nova",
  "novelai",
  "novita",
  "nplcloud",
  "nvidia",
  "obsidian",
  "ollama",
  "openai",
  "openchat",
  "openclaw",
  "opencode",
  "openhands",
  "openhuman",
  "openrouter",
  "openwebui",
  "palm",
  "parasail",
  "perplexity",
  "phidata",
  "phind",
  "pika",
  "pixverse",
  "player2",
  "poe",
  "pollinations",
  "ppio",
  "prunaai",
  "pydanticai",
  "qingyan",
  "qiniu",
  "qoder",
  "qwen",
  "railway",
  "recraft",
  "relace",
  "replicate",
  "replit",
  "reve",
  "roocode",
  "rsshub",
  "runway",
  "rwkv",
  "sambanova",
  "search1api",
  "searchapi",
  "sensenova",
  "siliconcloud",
  "sillytavern",
  "skywork",
  "slock",
  "smithery",
  "snowflake",
  "sophnet",
  "sora",
  "spark",
  "speedai",
  "stability",
  "statecloud",
  "stepfun",
  "straico",
  "streamlake",
  "submodel",
  "suno",
  "sync",
  "targon",
  "tavily",
  "tencent",
  "tencentcloud",
  "tiangong",
  "tii",
  "together",
  "topazlabs",
  "trae",
  "tripo",
  "turix",
  "udio",
  "unstructured",
  "upstage",
  "v0",
  "vectorizerai",
  "venice",
  "vercel",
  "vertexai",
  "vidu",
  "viggle",
  "vllm",
  "volcengine",
  "voyage",
  "wenxin",
  "windsurf",
  "workersai",
  "worldrouter",
  "xai",
  "xiaomimimo",
  "xinference",
  "xpay",
  "xuanyuan",
  "yandex",
  "yi",
  "youmind",
  "yuanbao",
  "zai",
  "zapier",
  "zeabur",
  "zencoder",
  "zenmux",
  "zeroone",
  "zhipu"
]);
var developerIconMap = {
  // Major AI companies
  openai: "openai.webp",
  anthropic: "anthropic.webp",
  google: "google.webp",
  gemini: "gemini.webp",
  gemma: "gemma.webp",
  "deepseek": "deepseek.webp",
  qwen: "qwen.webp",
  mistral: "mistral.webp",
  "01.ai": "zero-one.webp",
  "zero-one": "zero-one.webp",
  xai: "grok.webp",
  // Chinese companies
  zhipu: "zhipu.webp",
  moonshot: "moonshot.webp",
  baichuan: "baichuan.webp",
  alibaba: "dashscope.png",
  minimax: "minimax.webp",
  volcengine: "volcengine.webp",
  bytedance: "byte_dance.webp",
  baidu: "wenxin.webp",
  // baidu-cloud.svg only exists under /icons/providers/; ERNIE/Wenxin icon lives in /icons/models/
  tencent: "dianxin.png",
  doubao: "doubao.webp",
  hunyuan: "hunyuan.webp",
  sparkdesk: "sparkdesk.webp",
  wenxin: "wenxin.webp",
  stepfun: "step.webp",
  // Research organizations
  ai21: "ai21.webp",
  adept: "adept.png",
  aisingapore: "aisingapore.png",
  bigcode: "bigcode.webp",
  codegeex: "codegeex.webp",
  cohere: "cohere.webp",
  dbrx: "dbrx.webp",
  gryphe: "gryphe.png",
  hailuo: "hailuo.webp",
  internlm: "internlm.webp",
  jina: "jina.webp",
  nvidia: "nvidia.webp",
  rakutenai: "rakutenai.png",
  upstage: "upstage.webp",
  voyageai: "voyageai.webp",
  xirang: "xirang.png",
  yi: "zero-one.webp",
  zai: "zai.webp",
  // Image/Audio/Video models
  chatgpt: "chatgpt.jpeg",
  dalle: "dalle.webp",
  flux: "flux.webp",
  ideogram: "ideogram.webp",
  keling: "keling.png",
  luma: "luma.webp",
  midjourney: "midjourney.webp",
  stability: "stability.webp",
  suno: "suno.webp",
  vidu: "vidu.webp",
  tokenflux: "tokenflux.png",
  // Other
  huggingface: "huggingface.webp",
  meta: "llama.png",
  facebook: "llama.png",
  // no meta.png under /icons/models/; Meta/Facebook family uses the Llama icon
  microsoft: "microsoft.webp",
  ibm: "ibm.webp",
  github: "copilot.webp",
  tele: "tele.png",
  ling: "ling.png",
  mimo: "mimo.svg",
  pangu: "pangu.svg",
  xiaomi: "xiaomi.png",
  // Model-family icons with dedicated art under /icons/models/
  claude: "claude.webp",
  codestral: "codestral.png",
  mixtral: "mixtral.png",
  pixtral: "pixtral.png",
  llava: "llava.webp",
  palm: "palm.webp",
  chatglm: "chatglm.webp",
  internvl: "internvl.png",
  minicpm: "minicpm.webp",
  nousresearch: "nousresearch.webp"
};
function getDeveloperIconPath(developer) {
  if (!developer) return null;
  const file = getDeveloperIconFile(developer);
  return file ? `/icons/models/${file}` : null;
}
function getDeveloperIconFile(developer) {
  if (!developer) return null;
  const normalized = developer.toLowerCase().replace(/[-_\s]/g, "");
  if (developerIconMap[normalized]) {
    return developerIconMap[normalized];
  }
  let best = null;
  for (const [key, file] of Object.entries(developerIconMap)) {
    if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
      best = { key, file };
    }
  }
  if (best) return best.file;
  return null;
}
var providerIconMap = {
  // Major providers
  openai: "openai.webp",
  anthropic: "anthropic.webp",
  google: "google.webp",
  gemini: "gemini.webp",
  deepseek: "deepseek.webp",
  mistral: "mistral.webp",
  groq: "groq.webp",
  grok: "grok.webp",
  xai: "grok.webp",
  // Cloud providers
  azure: "azure.webp",
  "azure-openai": "azure.webp",
  aws: "aws.webp",
  bedrock: "bedrock.webp",
  // Chinese providers
  zhipu: "zhipu.webp",
  moonshot: "moonshot.webp",
  baichuan: "baichuan.webp",
  alibaba: "dashscope.png",
  qwen: "dashscope.png",
  dashscope: "dashscope.png",
  minimax: "minimax.webp",
  volcengine: "volcengine.webp",
  doubao: "doubao.webp",
  bytedance: "bytedance.webp",
  baidu: "baidu-cloud.webp",
  // Other providers
  nvidia: "nvidia.webp",
  huggingface: "huggingface.webp",
  ollama: "ollama.webp",
  lmstudio: "lmstudio.webp",
  openrouter: "openrouter.webp",
  tokenrouter: "tokenrouter.png",
  together: "together.webp",
  cohere: "cohere.webp",
  perplexity: "perplexity.webp",
  fireworks: "fireworks.webp",
  github: "github.webp",
  jina: "jina.webp",
  modelscope: "modelscope.webp",
  siliconflow: "silicon.webp",
  silicon: "silicon.webp",
  cerebras: "cerebras.webp",
  hyperbolic: "hyperbolic.webp",
  lepton: "lepton.png",
  cloudflare: "cloudflare.webp",
  vllm: "vllm.webp",
  zai: "zai.webp",
  // Image/special
  step: "step.webp",
  "zero-one": "zero-one.webp",
  yi: "zero-one.webp",
  infini: "infini.webp",
  // Additional providers / gateways with icons under /icons/providers/.
  // Keys are normalized (lowercase, separators stripped) to match getIconPath().
  xiaomi: "Xiaomi.png",
  intel: "intel.png",
  nomic: "nomic.png",
  mixedbread: "mixedbread.png",
  lanyun: "lanyun.png",
  newapi: "newapi.webp",
  ocoolai: "ocoolai.png",
  ph8: "ph8.png",
  ppio: "ppio.webp",
  vertexai: "vertexai.webp",
  gcp: "vertexai.webp",
  "302ai": "302ai.webp",
  aihubmix: "aihubmix.webp",
  dmxapi: "DMXAPI.png",
  bailian: "bailian.webp",
  bigmodel: "bigModel.webp",
  burncloud: "burncloud.webp",
  cherryin: "cherryin.png",
  giteeai: "gitee-ai.webp",
  qiniu: "qiniu.webp",
  sophnet: "sophnet.webp",
  longcat: "longcat.webp",
  alayanew: "alayanew.webp",
  cephalon: "cephalon.jpeg",
  mcprouter: "mcprouter.webp",
  gpustack: "gpustack.svg",
  kwaipilot: "Kwaipilot.webp",
  tencentcloudti: "tencent-cloud-ti.webp",
  neteaseyoudao: "netease-youdao.svg",
  aionly: "aiOnly.webp"
};
function getProviderIconOptions() {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const [key, file] of Object.entries(providerIconMap)) {
    if (seen.has(file)) continue;
    seen.add(file);
    out.push({ value: `/icons/providers/${file}`, label: key });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
function normalizeProviderId(id) {
  return (id ?? "").toLowerCase().replace(/[-_\s]/g, "");
}
function getIconPath(providerId) {
  const normalized = normalizeProviderId(providerId);
  if (!normalized) return null;
  if (providerIconMap[normalized]) {
    return `/icons/providers/${providerIconMap[normalized]}`;
  }
  if (PROVIDER_ICON_SLUGS.has(normalized)) {
    return `/icons/providers/${normalized}.webp`;
  }
  let best = null;
  for (const [key, file] of Object.entries(providerIconMap)) {
    if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
      best = { key, file };
    }
  }
  if (best) return `/icons/providers/${best.file}`;
  return null;
}
function applyIconBase(path, base) {
  if (!path || base === "/icons") return path;
  return path.startsWith("/icons/") ? base + path.slice(6) : path;
}
function ProviderIcon({
  provider,
  className = "",
  size = 20,
  rounded = false,
  iconUrl
}) {
  const { Image, iconBasePath } = useYunUI();
  const [customError, setCustomError] = useState(false);
  const [pathError, setPathError] = useState(false);
  const effectiveIconUrl = iconUrl;
  if (effectiveIconUrl && !customError) {
    if (rounded) {
      const getRadius = () => size <= 14 ? "rounded-sm" : size <= 20 ? "rounded-md" : "rounded-lg";
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadius()} overflow-hidden bg-muted flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx("img", { src: effectiveIconUrl, alt: provider, width: size, height: size, className: "object-cover", onError: () => setCustomError(true) })
        }
      );
    }
    return /* @__PURE__ */ jsx("img", { src: effectiveIconUrl, alt: provider, width: size, height: size, className: `object-contain ${className}`, onError: () => setCustomError(true) });
  }
  const iconPath = applyIconBase(getIconPath(provider), iconBasePath);
  const getRadiusClass = () => {
    if (size <= 14) return "rounded-sm";
    if (size <= 20) return "rounded-md";
    return "rounded-lg";
  };
  if (iconPath && !pathError) {
    if (rounded) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadiusClass()} overflow-hidden bg-muted flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src: iconPath,
              alt: provider,
              width: size,
              height: size,
              className: "object-cover",
              unoptimized: true,
              onError: () => setPathError(true)
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Image,
      {
        src: iconPath,
        alt: provider,
        width: size,
        height: size,
        className: `object-contain ${className}`,
        unoptimized: true,
        onError: () => setPathError(true)
      }
    );
  }
  if (rounded) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `${getRadiusClass()} bg-muted flex items-center justify-center ${className}`,
        style: { width: size, height: size },
        children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: (provider || "?").charAt(0).toUpperCase() })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
      ]
    }
  );
}
function ProviderAvatar({
  provider,
  size = 32,
  className = ""
}) {
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded: true, className });
}
var ProviderNames = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  xai: "xAI",
  grok: "Grok",
  groq: "Groq",
  azure: "Azure",
  "azure-openai": "Azure OpenAI",
  aws: "AWS",
  bedrock: "Bedrock",
  nvidia: "NVIDIA",
  zhipu: "Zhipu",
  moonshot: "Moonshot",
  alibaba: "Alibaba",
  qwen: "Qwen",
  dashscope: "DashScope",
  minimax: "MiniMax",
  volcengine: "Volcengine",
  doubao: "Doubao",
  bytedance: "ByteDance",
  baidu: "Baidu",
  baichuan: "Baichuan",
  yi: "Yi",
  openrouter: "OpenRouter",
  tokenrouter: "TokenRouter",
  huggingface: "HuggingFace",
  ollama: "Ollama",
  lmstudio: "LM Studio",
  together: "Together",
  cohere: "Cohere",
  perplexity: "Perplexity",
  fireworks: "Fireworks",
  github: "GitHub Models",
  jina: "Jina",
  modelscope: "ModelScope",
  siliconflow: "SiliconFlow",
  silicon: "SiliconFlow",
  cerebras: "Cerebras",
  hyperbolic: "Hyperbolic",
  lepton: "Lepton",
  step: "Step",
  infini: "Infini",
  cloudflare: "Cloudflare",
  vllm: "vLLM",
  zai: "Z.ai",
  // Additional providers / gateways
  xiaomi: "Xiaomi",
  intel: "Intel",
  nomic: "Nomic",
  mixedbread: "Mixedbread",
  lanyun: "Lanyun",
  newapi: "New API",
  ocoolai: "OCoolAI",
  ph8: "PH8",
  ppio: "PPIO",
  vertexai: "Vertex AI",
  gcp: "Vertex AI",
  "302ai": "302.AI",
  aihubmix: "AiHubMix",
  dmxapi: "DMXAPI",
  bailian: "Bailian",
  bigmodel: "BigModel",
  burncloud: "BurnCloud",
  cherryin: "CherryIN",
  giteeai: "Gitee AI",
  qiniu: "Qiniu",
  sophnet: "SophNet",
  longcat: "LongCat",
  alayanew: "AlayaNew",
  cephalon: "Cephalon",
  mcprouter: "MCP Router",
  gpustack: "GPUStack",
  kwaipilot: "Kwaipilot",
  tencentcloudti: "Tencent Cloud TI",
  neteaseyoudao: "NetEase Youdao",
  aionly: "AiOnly"
};
function getProviderName(providerId) {
  if (!providerId) return "";
  const normalized = providerId.toLowerCase().replace(/[-_\s]/g, "");
  if (ProviderNames[normalized]) return ProviderNames[normalized];
  let best = null;
  for (const [key, name] of Object.entries(ProviderNames)) {
    if (key.length >= 3 && normalized.includes(key) && (!best || key.length > best.key.length)) {
      best = { key, name };
    }
  }
  if (best) return best.name;
  return providerId.charAt(0).toUpperCase() + providerId.slice(1);
}
function getProxiedImageUrl(url) {
  return url;
}
function ModelIcon({
  iconUrl,
  developer,
  provider,
  className = "",
  size = 20,
  rounded = false
}) {
  const { Image, iconBasePath } = useYunUI();
  const [failedPriority, setFailedPriority] = useState(0);
  const getRadiusClass = () => {
    if (size <= 14) return "rounded-sm";
    if (size <= 20) return "rounded-md";
    return "rounded-lg";
  };
  if (failedPriority < 1 && iconUrl && iconUrl.trim()) {
    const src = iconUrl.startsWith("http") ? getProxiedImageUrl(iconUrl) : iconUrl.startsWith("/") ? iconUrl : `${iconBasePath}/models/${iconUrl}`;
    const handleError = () => setFailedPriority(1);
    if (rounded) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `${getRadiusClass()} overflow-hidden bg-muted flex items-center justify-center ${className}`,
          style: { width: size, height: size },
          children: /* @__PURE__ */ jsx(
            Image,
            {
              src,
              alt: provider,
              width: size,
              height: size,
              className: "object-cover",
              unoptimized: true,
              onError: handleError
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Image,
      {
        src,
        alt: provider,
        width: size,
        height: size,
        className: `object-contain ${className}`,
        unoptimized: true,
        onError: handleError
      }
    );
  }
  if (failedPriority < 2 && developer) {
    const developerIconFile = getDeveloperIconFile(developer);
    if (developerIconFile) {
      const src = `${iconBasePath}/models/${developerIconFile}`;
      const handleError = () => setFailedPriority(2);
      if (rounded) {
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `${getRadiusClass()} overflow-hidden bg-muted flex items-center justify-center ${className}`,
            style: { width: size, height: size },
            children: /* @__PURE__ */ jsx(
              Image,
              {
                src,
                alt: developer,
                width: size,
                height: size,
                className: "object-cover",
                unoptimized: true,
                onError: handleError
              }
            )
          }
        );
      }
      return /* @__PURE__ */ jsx(
        Image,
        {
          src,
          alt: developer,
          width: size,
          height: size,
          className: `object-contain ${className}`,
          unoptimized: true,
          onError: handleError
        }
      );
    }
  }
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded, className });
}
function ModelAvatar({
  iconUrl,
  developer,
  provider,
  size = 32,
  className = ""
}) {
  return /* @__PURE__ */ jsx(ModelIcon, { iconUrl, developer, provider, size, rounded: true, className });
}
function ProviderIconImg({ provider, size = 16 }) {
  return /* @__PURE__ */ jsx(ProviderIcon, { provider, size, rounded: true });
}
var MODEL_TYPE_ICONS = {
  chat: /* @__PURE__ */ jsx(MessageSquare, { size: 16, className: "text-blue-500" }),
  completion: /* @__PURE__ */ jsx(FileText, { size: 16, className: "text-gray-500" }),
  embedding: /* @__PURE__ */ jsx(Hash, { size: 16, className: "text-purple-500" }),
  image_generation: /* @__PURE__ */ jsx(Palette, { size: 16, className: "text-pink-500" }),
  audio: /* @__PURE__ */ jsx(Headphones, { size: 16, className: "text-orange-500" }),
  tts: /* @__PURE__ */ jsx(Volume2, { size: 16, className: "text-green-500" }),
  stt: /* @__PURE__ */ jsx(Mic, { size: 16, className: "text-red-500" }),
  video: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-500" }),
  video_generation: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-400" }),
  music_generation: /* @__PURE__ */ jsx(Music, { size: 16, className: "text-orange-400" }),
  rerank: /* @__PURE__ */ jsx(Shuffle, { size: 16, className: "text-indigo-500" }),
  moderation: /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-yellow-500" }),
  "3d": /* @__PURE__ */ jsx(Box, { size: 16, className: "text-amber-500" }),
  realtime: /* @__PURE__ */ jsx(Radio, { size: 16, className: "text-yellow-400" })
};
function ModelTypeIcon({ type, size = 16 }) {
  const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
  if (icon) {
    return /* @__PURE__ */ jsx("span", { className: "inline-flex", style: { transform: size !== 16 ? `scale(${size / 16})` : void 0 }, children: icon });
  }
  return /* @__PURE__ */ jsx(Bot, { size, className: "text-muted-foreground" });
}
var variants = {
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80 disabled:bg-fd-secondary disabled:text-fd-secondary-foreground",
  outline: "border hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  secondary: "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
};
var buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring",
  {
    variants: {
      variant: variants,
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        sm: "gap-1 px-2 py-1.5 text-xs",
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
        "icon-xs": "p-1 [&_svg]:size-4"
      }
    }
  }
);
function LanguageSwitcher({
  locales,
  currentLocale,
  onChange,
  variant = "icon",
  align = "right",
  label = "Language",
  pending = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const { shift, maxHeight } = useAnchoredPosition(isOpen, panelRef);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);
  const handleLocaleChange = (newLocale) => {
    if (newLocale === currentLocale || pending) return;
    setIsOpen(false);
    onChange(newLocale);
  };
  const currentLabel = locales.find((l) => l.value === currentLocale)?.label ?? currentLocale;
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    variant === "pill" ? /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled: pending,
        "aria-label": label,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        children: [
          /* @__PURE__ */ jsx(Globe, { size: 14, className: "shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentLabel })
        ]
      }
    ) : /* @__PURE__ */ jsx(
      "button",
      {
        ref: triggerRef,
        onClick: () => setIsOpen(!isOpen),
        className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled: pending,
        "aria-label": label,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        children: /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        ref: panelRef,
        style: { marginLeft: shift, maxHeight },
        className: `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`,
        children: /* @__PURE__ */ jsx("div", { className: "p-1 flex-1 min-h-0 overflow-y-auto", children: locales.map((lang) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleLocaleChange(lang.value),
            className: `dropdown-item w-full text-left ${currentLocale === lang.value ? "active" : ""}`,
            children: /* @__PURE__ */ jsx("span", { className: "flex-1", children: lang.label })
          },
          lang.value
        )) })
      }
    )
  ] });
}
function Navbar({
  appName,
  logoSrc = "/favicon.ico",
  links = [],
  currentPath = "/",
  variant = "public",
  labels,
  languageSwitcher,
  themeToggle,
  homeHref = "/",
  loginHref = "/login",
  signupHref = "/signup"
}) {
  const { Link, Image } = useYunUI();
  const [scrollSection, setScrollSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const signIn = labels?.signIn ?? "Sign In";
  const signUp = labels?.signUp ?? "Sign Up";
  const menuLabel = labels?.menu ?? "Menu";
  const activeSection = useMemo(() => {
    return currentPath === "/" ? scrollSection : "";
  }, [currentPath, scrollSection]);
  useEffect(() => {
    if (currentPath !== "/") return;
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = `#${section.id}`;
        }
      });
      setScrollSection(currentSection);
    };
    handleScroll();
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentPath]);
  const isActive = (path) => {
    if (currentPath === path) return true;
    if (path.startsWith("/#")) {
      return currentPath === "/" && activeSection === path.slice(1);
    }
    return false;
  };
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      style: { top: "max(1.5rem, env(safe-area-inset-top))" },
      className: "fixed left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 max-w-6xl w-[calc(100%-48px)] bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-md flex items-center justify-between",
      children: [
        /* @__PURE__ */ jsxs(Link, { href: homeHref, className: "flex items-center gap-2 min-w-0 rounded-lg px-2 py-1 -mx-2 hover:bg-foreground/5 transition-colors duration-200", children: [
          /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 28, height: 28, className: "w-7 h-7 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm tracking-tight truncate", children: appName })
        ] }),
        variant === "public" && /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2", children: links.map((link) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: link.href,
            className: "group relative px-2 lg:px-3 py-2 whitespace-nowrap min-w-15 text-center",
            children: [
              /* @__PURE__ */ jsx("span", { className: `text-sm relative z-10 ${isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"}`, children: link.label }),
              /* @__PURE__ */ jsx("span", { className: `absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-foreground rounded-full transition-all duration-200 yunui-accent-bg ${isActive(link.href) ? "w-8" : "w-0 group-hover:w-8"}` })
            ]
          },
          link.href
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: "hidden md:flex items-center gap-1.5", children: languageSwitcher }),
          themeToggle ?? /* @__PURE__ */ jsx(ThemeToggle, { variant: "pill" }),
          variant !== "minimal" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: loginHref,
                className: "hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 whitespace-nowrap min-w-15 text-center",
                children: signIn
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: signupHref,
                className: "hidden md:inline-block px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 hover:shadow-md transition-all duration-200 whitespace-nowrap min-w-20 text-center yunui-accent-bg yunui-accent-on",
                children: signUp
              }
            )
          ] }),
          variant === "public" && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setMenuOpen((o) => !o),
              className: "md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors",
              "aria-label": menuLabel,
              "aria-expanded": menuOpen,
              children: menuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
            }
          )
        ] }),
        variant === "public" && menuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "md:hidden fixed inset-0 -z-10", "aria-hidden": "true", onClick: () => setMenuOpen(false) }),
          /* @__PURE__ */ jsxs("div", { className: "md:hidden absolute top-full left-0 right-0 mt-3 p-2 bg-background/60 backdrop-blur-2xl border border-border rounded-2xl shadow-lg shadow-black/5 flex flex-col gap-0.5", children: [
            links.map((link) => /* @__PURE__ */ jsx(
              Link,
              {
                href: link.href,
                onClick: () => setMenuOpen(false),
                className: `px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-foreground/5 ${isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"}`,
                children: link.label
              },
              link.href
            )),
            /* @__PURE__ */ jsx("div", { className: "my-1 border-t border-border" }),
            languageSwitcher && /* @__PURE__ */ jsx("div", { className: "px-2 py-1.5", children: languageSwitcher }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: loginHref,
                onClick: () => setMenuOpen(false),
                className: "px-4 py-2.5 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-foreground/5",
                children: signIn
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: signupHref,
                onClick: () => setMenuOpen(false),
                className: "mt-0.5 px-4 py-2.5 rounded-xl text-sm font-medium text-center bg-foreground text-background hover:bg-foreground/90 transition-colors yunui-accent-bg yunui-accent-on",
                children: signUp
              }
            )
          ] })
        ] })
      ]
    }
  );
}

export { AgentTimeline, CapabilityIcon, CapabilitySelector, IDBadge, LanguageSwitcher, ModelAvatar, ModelCard, ModelIcon, ModelManagerCard, ModelSelect, ModelTypeIcon, Navbar, PROVIDER_ICON_SLUGS, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, ThinkingBlock, buttonVariants, getDeveloperIconPath, getIconPath, getProviderIconOptions, getProviderName, isKnownCapability, normalizeProviderId };
//# sourceMappingURL=ai.js.map
//# sourceMappingURL=ai.js.map