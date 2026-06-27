"use client";
import { copyToClipboard } from './chunk-N53PNMPJ.js';
export { DiscordIcon, Footer, GithubIcon, InstagramIcon } from './chunk-N53PNMPJ.js';
import { cn, ThemeToggle } from './chunk-GHO4RCDR.js';
import { useYunUI } from './chunk-U2LNRVMI.js';
import { memo, useState, useRef, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pin, MessageSquare, Waves, Code, Eye, Brain, Pencil, Ban, Fingerprint, Layers, SlidersHorizontal, Mic, Video, Music, Box, Radio, ChevronUp, ChevronDown, Check, Copy, Image, PauseCircle, Search, X, Sparkles, Bot, Globe, Menu, Shield, Shuffle, Volume2, Headphones, Palette, Hash, FileText } from 'lucide-react';
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
            developer?.label && /* @__PURE__ */ jsx("span", { children: developer.label })
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
          initial: { opacity: 0, y: -8, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.16, ease: "easeOut" },
          style: { maxWidth: "calc(100vw - 1rem)" },
          className: "origin-top absolute z-50 top-full left-0 mt-2 w-96 bg-popover/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden",
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
            groups.length > 1 && /* @__PURE__ */ jsx("div", { className: "px-2.5 py-2 border-b border-border/50 overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 min-w-max", children: [
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
            /* @__PURE__ */ jsxs("div", { ref: listRef, onWheel, onMouseMove: clearActiveOnPointer, id: "yunui-ms-listbox", role: "listbox", className: "max-h-96 overflow-y-auto overscroll-contain", children: [
              pinnedList.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-1.5 py-1.5 border-b border-border/40", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Pin, { size: 9 }),
                  " ",
                  L.pinned
                ] }),
                pinnedList.map((o) => /* @__PURE__ */ jsx(ModelRow, { domId: rowDomId(o.id), active: o.id === activeId, option: o, selected: o.id === value, pinned: true, isPinnable: !!onTogglePin, onSelect: () => select(o.id), onTogglePin: () => onTogglePin?.(o.id) }, o.id))
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-1.5 py-1.5", children: Object.entries(grouped).map(([g, opts]) => /* @__PURE__ */ jsxs("div", { className: "mb-3 last:mb-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2 mb-1 sticky top-0 backdrop-blur-md py-1.5 z-10", children: [
                  groupIcon[g],
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: groupLabel[g] ?? g }),
                  /* @__PURE__ */ jsx("span", { className: "ml-auto text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium", children: opts.length })
                ] }),
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
            className: cn(
              "absolute left-0 top-1/2 w-1 h-6 rounded-full bg-primary transition-all duration-150 -translate-y-1/2",
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
        (selectSlot || actions) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 -mt-2 mb-3 min-h-7", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: selectSlot }),
          actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5 -mr-1.5 text-muted-foreground", children: actions })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          icon && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-2 gap-y-1 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold leading-tight min-w-0 break-words", children: name }),
              nameBadges
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

// src/ai/provider-glyphs.generated.ts
var PROVIDER_GLYPHS = {
  "openai": {
    "vb": "0 0 24 24",
    "body": '<path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"></path>'
  },
  "anthropic": {
    "vb": "0 0 24 24",
    "body": '<path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"></path>'
  },
  "claude": {
    "vb": "0 0 24 24",
    "body": '<path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"></path>'
  },
  "google": {
    "vb": "0 0 24 24",
    "body": '<path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z"></path><path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z"></path><path d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z"></path><path d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z"></path>'
  },
  "gemini": {
    "vb": "0 0 24 24",
    "body": '<path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"></path>'
  },
  "gemma": {
    "vb": "0 0 24 24",
    "body": '<path d="M12.34 5.953a8.233 8.233 0 01-.247-1.125V3.72a8.25 8.25 0 015.562 2.232H12.34zm-.69 0c.113-.373.199-.755.257-1.145V3.72a8.25 8.25 0 00-5.562 2.232h5.304zm-5.433.187h5.373a7.98 7.98 0 01-.267.696 8.41 8.41 0 01-1.76 2.65L6.216 6.14zm-.264-.187H2.977v.187h2.915a8.436 8.436 0 00-2.357 5.767H0v.186h3.535a8.436 8.436 0 002.357 5.767H2.977v.186h2.976v2.977h.187v-2.915a8.436 8.436 0 005.767 2.357V24h.186v-3.535a8.436 8.436 0 005.767-2.357v2.915h.186v-2.977h2.977v-.186h-2.915a8.436 8.436 0 002.357-5.767H24v-.186h-3.535a8.436 8.436 0 00-2.357-5.767h2.915v-.187h-2.977V2.977h-.186v2.915a8.436 8.436 0 00-5.767-2.357V0h-.186v3.535A8.436 8.436 0 006.14 5.892V2.977h-.187v2.976zm6.14 14.326a8.25 8.25 0 005.562-2.233H12.34c-.108.367-.19.743-.247 1.126v1.107zm-.186-1.087a8.015 8.015 0 00-.258-1.146H6.345a8.25 8.25 0 005.562 2.233v-1.087zm-8.186-7.285h1.107a8.23 8.23 0 001.125-.247V6.345a8.25 8.25 0 00-2.232 5.562zm1.087.186H3.72a8.25 8.25 0 002.232 5.562v-5.304a8.012 8.012 0 00-1.145-.258zm15.47-.186a8.25 8.25 0 00-2.232-5.562v5.315c.367.108.743.19 1.126.247h1.107zm-1.086.186c-.39.058-.772.144-1.146.258v5.304a8.25 8.25 0 002.233-5.562h-1.087zm-1.332 5.69V12.41a7.97 7.97 0 00-.696.267 8.409 8.409 0 00-2.65 1.76l3.346 3.346zm0-6.18v-5.45l-.012-.013h-5.451c.076.235.162.468.26.696a8.698 8.698 0 001.819 2.688 8.698 8.698 0 002.688 1.82c.228.097.46.183.696.259zM6.14 17.848V12.41c.235.078.468.167.696.267a8.403 8.403 0 012.688 1.799 8.404 8.404 0 011.799 2.688c.1.228.19.46.267.696H6.152l-.012-.012zm0-6.245V6.326l3.29 3.29a8.716 8.716 0 01-2.594 1.728 8.14 8.14 0 01-.696.259zm6.257 6.257h5.277l-3.29-3.29a8.716 8.716 0 00-1.728 2.594 8.135 8.135 0 00-.259.696zm-2.347-7.81a9.435 9.435 0 01-2.88 1.96 9.14 9.14 0 012.88 1.94 9.14 9.14 0 011.94 2.88 9.435 9.435 0 011.96-2.88 9.14 9.14 0 012.88-1.94 9.435 9.435 0 01-2.88-1.96 9.434 9.434 0 01-1.96-2.88 9.14 9.14 0 01-1.94 2.88z"></path>'
  },
  "deepseek": {
    "vb": "0 0 24 24",
    "body": '<path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"></path>'
  },
  "qwen": {
    "vb": "0 0 24 24",
    "body": '<path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z"></path>'
  },
  "alibaba": {
    "vb": "0 0 24 24",
    "body": '<path d="M24 14.014c-2.8 1.512-5.62 2.896-8.759 3.524-.7.139-1.476.139-2.187.043-.678-.085-1.017-.682-.776-1.31.23-.585.536-1.181.93-1.671.852-1.065 1.814-2.034 2.678-3.088a15.75 15.75 0 001.422-2.054c.306-.511.164-1.129-.372-1.384-.897-.437-1.859-.745-2.81-1.075-.11-.043-.274.074-.492.149.273.244.47.425.743.67-2.821.48-5.49 1.16-8.08 2.098-.012.053-.033.095-.023.117.383.585.208 1.032-.35 1.394a2.365 2.365 0 00-.568.522c1.706.5 3.226.213 4.68-.735-.087-.127-.175-.244-.262-.372.546.096.874.394.918.862.011.107-.054.213-.087.32-.077-.086-.175-.17-.24-.267-.045-.064-.056-.138-.088-.245-1.728 1.15-3.587 1.438-5.632.842 0 .404-.022.745.011 1.075.022.287-.098.415-.36.564-.591.362-1.204.735-1.696 1.214-.59.585-.371 1.299.427 1.597.907.34 1.859.35 2.81.234 1.126-.139 2.23-.32 3.456-.49-1.433.67-2.844 1.14-4.33 1.33-1.04.14-2.078.214-3.106-.084-1.476-.415-2.133-1.501-1.75-2.96.361-1.363 1.236-2.449 2.176-3.45 3.139-3.332 7.108-5.024 11.7-5.365 1.072-.074 2.155.064 3.16.511 1.411.639 2.002 1.99 1.313 3.354-.448.905-1.072 1.735-1.695 2.555-.612.809-1.301 1.554-1.946 2.331-.186.234-.361.48-.503.745-.274.5-.088.83.492.778 1.213-.118 2.45-.213 3.62-.511 1.716-.437 3.389-1.054 5.084-1.597.175-.043.339-.107.492-.17z"></path>'
  },
  "mistral": {
    "vb": "0 0 24 24",
    "body": '<path clip-rule="evenodd" d="M3.428 3.4h3.429v3.428h3.429v3.429h-.002 3.431V6.828h3.427V3.4h3.43v13.714H24v3.429H13.714v-3.428h-3.428v-3.429h-3.43v3.428h3.43v3.429H0v-3.429h3.428V3.4zm10.286 13.715h3.428v-3.429h-3.427v3.429z"></path>'
  },
  "meta": {
    "vb": "0 0 24 24",
    "body": '<path d="M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z"></path>'
  },
  "grok": {
    "vb": "0 0 24 24",
    "body": '<path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path>'
  },
  "xai": {
    "vb": "0 0 24 24",
    "body": '<path d="M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"></path>'
  },
  "cohere": {
    "vb": "0 0 24 24",
    "body": '<path clip-rule="evenodd" d="M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z"></path><path clip-rule="evenodd" d="M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z"></path><path d="M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z"></path>'
  },
  "moonshot": {
    "vb": "0 0 24 24",
    "body": '<path d="M1.052 16.916l9.539 2.552a21.007 21.007 0 00.06 2.033l5.956 1.593a11.997 11.997 0 01-5.586.865l-.18-.016-.044-.004-.084-.009-.094-.01a11.605 11.605 0 01-.157-.02l-.107-.014-.11-.016a11.962 11.962 0 01-.32-.051l-.042-.008-.075-.013-.107-.02-.07-.015-.093-.019-.075-.016-.095-.02-.097-.023-.094-.022-.068-.017-.088-.022-.09-.024-.095-.025-.082-.023-.109-.03-.062-.02-.084-.025-.093-.028-.105-.034-.058-.019-.08-.026-.09-.031-.066-.024a6.293 6.293 0 01-.044-.015l-.068-.025-.101-.037-.057-.022-.08-.03-.087-.035-.088-.035-.079-.032-.095-.04-.063-.028-.063-.027a5.655 5.655 0 01-.041-.018l-.066-.03-.103-.047-.052-.024-.096-.046-.062-.03-.084-.04-.086-.044-.093-.047-.052-.027-.103-.055-.057-.03-.058-.032a6.49 6.49 0 01-.046-.026l-.094-.053-.06-.034-.051-.03-.072-.041-.082-.05-.093-.056-.052-.032-.084-.053-.061-.039-.079-.05-.07-.047-.053-.035a7.785 7.785 0 01-.054-.036l-.044-.03-.044-.03a6.066 6.066 0 01-.04-.028l-.057-.04-.076-.054-.069-.05-.074-.054-.056-.042-.076-.057-.076-.059-.086-.067-.045-.035-.064-.052-.074-.06-.089-.073-.046-.039-.046-.039a7.516 7.516 0 01-.043-.037l-.045-.04-.061-.053-.07-.062-.068-.06-.062-.058-.067-.062-.053-.05-.088-.084a13.28 13.28 0 01-.099-.097l-.029-.028-.041-.042-.069-.07-.05-.051-.05-.053a6.457 6.457 0 01-.168-.179l-.08-.088-.062-.07-.071-.08-.042-.049-.053-.062-.058-.068-.046-.056a7.175 7.175 0 01-.027-.033l-.045-.055-.066-.082-.041-.052-.05-.064-.02-.025a11.99 11.99 0 01-1.44-2.402zm-1.02-5.794l11.353 3.037a20.468 20.468 0 00-.469 2.011l10.817 2.894a12.076 12.076 0 01-1.845 2.005L.657 15.923l-.016-.046-.035-.104a11.965 11.965 0 01-.05-.153l-.007-.023a11.896 11.896 0 01-.207-.741l-.03-.126-.018-.08-.021-.097-.018-.081-.018-.09-.017-.084-.018-.094c-.026-.141-.05-.283-.071-.426l-.017-.118-.011-.083-.013-.102a12.01 12.01 0 01-.019-.161l-.005-.047a12.12 12.12 0 01-.034-2.145zm1.593-5.15l11.948 3.196c-.368.605-.705 1.231-1.01 1.875l11.295 3.022c-.142.82-.368 1.612-.668 2.365l-11.55-3.09L.124 10.26l.015-.1.008-.049.01-.067.015-.087.018-.098c.026-.148.056-.295.088-.442l.028-.124.02-.085.024-.097c.022-.09.045-.18.07-.268l.028-.102.023-.083.03-.1.025-.082.03-.096.026-.082.031-.095a11.896 11.896 0 011.01-2.232zm4.442-4.4L17.352 4.59a20.77 20.77 0 00-1.688 1.721l7.823 2.093c.267.852.442 1.744.513 2.665L2.106 5.213l.045-.065.027-.04.04-.055.046-.065.055-.076.054-.072.064-.086.05-.065.057-.073.055-.07.06-.074.055-.069.065-.077.054-.066.066-.077.053-.06.072-.082.053-.06.067-.074.054-.058.073-.078.058-.06.063-.067.168-.17.1-.098.059-.056.076-.071a12.084 12.084 0 012.272-1.677zM12.017 0h.097l.082.001.069.001.054.002.068.002.046.001.076.003.047.002.06.003.054.002.087.005.105.007.144.011.088.007.044.004.077.008.082.008.047.005.102.012.05.006.108.014.081.01.042.006.065.01.207.032.07.012.065.011.14.026.092.018.11.022.046.01.075.016.041.01L14.7.3l.042.01.065.015.049.012.071.017.096.024.112.03.113.03.113.032.05.015.07.02.078.024.073.023.05.016.05.016.076.025.099.033.102.036.048.017.064.023.093.034.11.041.116.045.1.04.047.02.06.024.041.018.063.026.04.018.057.025.11.048.1.046.074.035.075.036.06.028.092.046.091.045.102.052.053.028.049.026.046.024.06.033.041.022.052.029.088.05.106.06.087.051.057.034.053.032.096.059.088.055.098.062.036.024.064.041.084.056.04.027.062.042.062.043.023.017c.054.037.108.075.161.114l.083.06.065.048.056.043.086.065.082.064.04.03.05.041.086.069.079.065.085.071c.712.6 1.353 1.283 1.909 2.031L7.222.994l.062-.027.065-.028.081-.034.086-.035c.113-.045.227-.09.341-.131l.096-.035.093-.033.084-.03.096-.031c.087-.03.176-.058.264-.085l.091-.027.086-.025.102-.03.085-.023.1-.026L9.04.37l.09-.023.091-.022.095-.022.09-.02.098-.021.091-.02.095-.018.092-.018.1-.018.091-.016.098-.017.092-.014.097-.015.092-.013.102-.013.091-.012.105-.012.09-.01.105-.01c.093-.01.186-.018.28-.024l.106-.008.09-.005.11-.006.093-.004.1-.004.097-.002.099-.002.197-.002z"></path>'
  },
  "kimi": {
    "vb": "0 0 24 24",
    "body": '<path d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z"></path><path d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z"></path>'
  },
  "zhipu": {
    "vb": "0 0 24 24",
    "body": '<path d="M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zm-2.626-.684c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z"></path>'
  },
  "chatglm": {
    "vb": "0 0 24 24",
    "body": '<path d="M9.917 2c4.906 0 10.178 3.947 8.93 10.58-.014.07-.037.14-.057.21l-.003-.277c-.083-3-1.534-8.934-8.87-8.934-3.393 0-8.137 3.054-7.93 8.158-.04 4.778 3.555 8.4 7.95 8.332l.073-.001c1.2-.033 2.763-.429 3.1-1.657.063-.031.26.534.268.598.048.256.112.369.192.34.981-.348 2.286-1.222 1.952-2.38-.176-.61-1.775-.147-1.921-.347.418-.979 2.234-.926 3.153-.716.443.102.657.38 1.012.442.29.052.981-.2.96.242C17.226 19.632 13.833 22 9.918 22 3.654 22 0 16.574 0 11.737 0 5.947 4.959 2 9.917 2zM9.9 5.3c.484 0 1.125.225 1.38.585 3.669.145 4.313 2.686 4.694 5.444.255 1.838.315 2.3.182 1.387l.083.59c.068.448.554.737.982.516.144-.075.254-.231.328-.47a.2.2 0 01.258-.13l.625.22a.2.2 0 01.124.238 2.172 2.172 0 01-.51.92c-.878.917-2.757.664-3.08-.62-.14-.554-.055-.626-.345-1.242-.292-.621-1.238-.709-1.69-.295-.345.315-.407.805-.406 1.282L12.6 15.9a.9.9 0 01-.9.9h-1.4a.9.9 0 01-.9-.9v-.65a1.15 1.15 0 10-2.3 0v.65a.9.9 0 01-.9.9H4.8a.9.9 0 01-.9-.9l.035-3.239c.012-1.884.356-3.658 2.47-4.134.2-.045.252.13.29.342.025.154.043.252.053.294.701 3.058 1.75 4.299 3.144 3.722l.66-.331.254-.13c.158-.082.25-.131.276-.15.012-.01-.165-.206-.407-.464l-1.012-1.067a8.925 8.925 0 01-.199-.216c-.047-.034-.116.068-.208.306-.074.157-.251.252-.272.326-.013.058.108.298.362.72.164.288.22.508-.31.343-1.04-.8-1.518-2.273-1.684-3.725-.004-.035-.162-1.913-.162-1.913a1.2 1.2 0 011.113-1.281L9.9 5.3zm12.994 8.68c.037.697-.403.704-1.213.591l-1.783-.276c-.265-.053-.385-.099-.313-.147.47-.315 3.268-.93 3.31-.168zm-.915-.083l-.926.042c-.85.077-1.452.24.338.336l.103.003c.815.012 1.264-.359.485-.381zm1.667-3.601h.01c.79.398.067 1.03-.65 1.393-.14.07-.491.176-1.052.315-.241.04-.457.092-.333.16l.01.005c1.952.958-3.123 1.534-2.495 1.285l.38-.148c.68-.266 1.614-.682 1.666-1.337.038-.48 1.253-.442 1.493-.968.048-.106 0-.236-.144-.389-.05-.047-.094-.094-.107-.148-.073-.305.7-.431 1.222-.168zm-2.568-.474c-.135 1.198-2.479 4.192-1.949 2.863l.017-.042c.298-.717.376-2.221 1.337-3.221.25-.26.636.035.595.4zm-7.976-.253c.02-.694 1.002-.968 1.346-.347.01-1.274-1.941-.768-1.346.347z"></path>'
  },
  "minimax": {
    "vb": "0 0 24 24",
    "body": '<path d="M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z"></path>'
  },
  "microsoft": {
    "vb": "0 0 24 24",
    "body": '<path d="M11.49 2H2v9.492h9.492V2h-.002z"></path><path d="M22 2h-9.492v9.492H22V2z"></path><path d="M11.49 12.508H2V22h9.492v-9.492h-.002z"></path><path d="M22 12.508h-9.492V22H22v-9.492z"></path>'
  },
  "azure": {
    "vb": "0 0 24 24",
    "body": '<path d="M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z" fill-opacity=".75"></path><path d="M8.295.857c-.477 0-.9.304-1.053.756L.495 21.605a1.11 1.11 0 001.052 1.466h5.43c.477 0 .9-.304 1.053-.755l1.341-3.975-2.318-2.163a.51.51 0 01.347-.882h3L15.271.857H8.295z" fill-opacity=".5"></path><path d="M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z"></path>'
  },
  "perplexity": {
    "vb": "0 0 24 24",
    "body": '<path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z"></path>'
  },
  "groq": {
    "vb": "0 0 24 24",
    "body": '<path d="M12.036 2c-3.853-.035-7 3-7.036 6.781-.035 3.782 3.055 6.872 6.908 6.907h2.42v-2.566h-2.292c-2.407.028-4.38-1.866-4.408-4.23-.029-2.362 1.901-4.298 4.308-4.326h.1c2.407 0 4.358 1.915 4.365 4.278v6.305c0 2.342-1.944 4.25-4.323 4.279a4.375 4.375 0 01-3.033-1.252l-1.851 1.818A7 7 0 0012.029 22h.092c3.803-.056 6.858-3.083 6.879-6.816v-6.5C18.907 4.963 15.817 2 12.036 2z"></path>'
  },
  "together": {
    "vb": "0 0 24 24",
    "body": '<path d="M23.197 4.503A6 6 0 0015 2.307a5.973 5.973 0 00-2.995 4.933l5.996.008v.515h-5.996c.039.937.298 1.87.8 2.74a6 6 0 1010.39-6z"></path><path d="M.805 4.5A6 6 0 003 12.697a5.972 5.972 0 005.77.127L5.779 7.627l.446-.257 2.997 5.192A6 6 0 10.804 4.5z"></path><path d="M12 23.894a6 6 0 005.999-6c0-2.13-1.1-3.996-2.775-5.06l-3.005 5.189-.444-.258 2.997-5.192A6 6 0 1012 23.894z"></path>'
  },
  "openrouter": {
    "vb": "0 0 24 24",
    "body": '<path d="M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z"></path>'
  },
  "ollama": {
    "vb": "0 0 24 24",
    "body": '<path d="M7.905 1.09c.216.085.411.225.588.41.295.306.544.744.734 1.263.191.522.315 1.1.362 1.68a5.054 5.054 0 012.049-.636l.051-.004c.87-.07 1.73.087 2.48.474.101.053.2.11.297.17.05-.569.172-1.134.36-1.644.19-.52.439-.957.733-1.264a1.67 1.67 0 01.589-.41c.257-.1.53-.118.796-.042.401.114.745.368 1.016.737.248.337.434.769.561 1.287.23.934.27 2.163.115 3.645l.053.04.026.019c.757.576 1.284 1.397 1.563 2.35.435 1.487.216 3.155-.534 4.088l-.018.021.002.003c.417.762.67 1.567.724 2.4l.002.03c.064 1.065-.2 2.137-.814 3.19l-.007.01.01.024c.472 1.157.62 2.322.438 3.486l-.006.039a.651.651 0 01-.747.536.648.648 0 01-.54-.742c.167-1.033.01-2.069-.48-3.123a.643.643 0 01.04-.617l.004-.006c.604-.924.854-1.83.8-2.72-.046-.779-.325-1.544-.8-2.273a.644.644 0 01.18-.886l.009-.006c.243-.159.467-.565.58-1.12a4.229 4.229 0 00-.095-1.974c-.205-.7-.58-1.284-1.105-1.683-.595-.454-1.383-.673-2.38-.61a.653.653 0 01-.632-.371c-.314-.665-.772-1.141-1.343-1.436a3.288 3.288 0 00-1.772-.332c-1.245.099-2.343.801-2.67 1.686a.652.652 0 01-.61.425c-1.067.002-1.893.252-2.497.703-.522.39-.878.935-1.066 1.588a4.07 4.07 0 00-.068 1.886c.112.558.331 1.02.582 1.269l.008.007c.212.207.257.53.109.785-.36.622-.629 1.549-.673 2.44-.05 1.018.186 1.902.719 2.536l.016.019a.643.643 0 01.095.69c-.576 1.236-.753 2.252-.562 3.052a.652.652 0 01-1.269.298c-.243-1.018-.078-2.184.473-3.498l.014-.035-.008-.012a4.339 4.339 0 01-.598-1.309l-.005-.019a5.764 5.764 0 01-.177-1.785c.044-.91.278-1.842.622-2.59l.012-.026-.002-.002c-.293-.418-.51-.953-.63-1.545l-.005-.024a5.352 5.352 0 01.093-2.49c.262-.915.777-1.701 1.536-2.269.06-.045.123-.09.186-.132-.159-1.493-.119-2.73.112-3.67.127-.518.314-.95.562-1.287.27-.368.614-.622 1.015-.737.266-.076.54-.059.797.042zm4.116 9.09c.936 0 1.8.313 2.446.855.63.527 1.005 1.235 1.005 1.94 0 .888-.406 1.58-1.133 2.022-.62.375-1.451.557-2.403.557-1.009 0-1.871-.259-2.493-.734-.617-.47-.963-1.13-.963-1.845 0-.707.398-1.417 1.056-1.946.668-.537 1.55-.849 2.485-.849zm0 .896a3.07 3.07 0 00-1.916.65c-.461.37-.722.835-.722 1.25 0 .428.21.829.61 1.134.455.347 1.124.548 1.943.548.799 0 1.473-.147 1.932-.426.463-.28.7-.686.7-1.257 0-.423-.246-.89-.683-1.256-.484-.405-1.14-.643-1.864-.643zm.662 1.21l.004.004c.12.151.095.37-.056.49l-.292.23v.446a.375.375 0 01-.376.373.375.375 0 01-.376-.373v-.46l-.271-.218a.347.347 0 01-.052-.49.353.353 0 01.494-.051l.215.172.22-.174a.353.353 0 01.49.051zm-5.04-1.919c.478 0 .867.39.867.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zm8.706 0c.48 0 .868.39.868.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zM7.44 2.3l-.003.002a.659.659 0 00-.285.238l-.005.006c-.138.189-.258.467-.348.832-.17.692-.216 1.631-.124 2.782.43-.128.899-.208 1.404-.237l.01-.001.019-.034c.046-.082.095-.161.148-.239.123-.771.022-1.692-.253-2.444-.134-.364-.297-.65-.453-.813a.628.628 0 00-.107-.09L7.44 2.3zm9.174.04l-.002.001a.628.628 0 00-.107.09c-.156.163-.32.45-.453.814-.29.794-.387 1.776-.23 2.572l.058.097.008.014h.03a5.184 5.184 0 011.466.212c.086-1.124.038-2.043-.128-2.722-.09-.365-.21-.643-.349-.832l-.004-.006a.659.659 0 00-.285-.239h-.004z"></path>'
  },
  "stepfun": {
    "vb": "0 0 24 24",
    "body": '<path d="M22.012 0h1.032v.927H24v.968h-.956V3.78h-1.032V1.896h-1.878v-.97h1.878V0zM2.6 12.371V1.87h.969v10.502h-.97zm10.423.66h10.95v.918h-6.208v9.579h-4.742V13.03zM5.629 3.333v12.356H0v4.51h10.386V8L20.859 8l-.003-4.668-15.227.001z"></path>'
  },
  "baidu": {
    "vb": "0 0 24 24",
    "body": '<path d="M8.859 11.735c1.017-1.71 4.059-3.083 6.202.286 1.579 2.284 4.284 4.397 4.284 4.397s2.027 1.601.73 4.684c-1.24 2.956-5.64 1.607-6.005 1.49l-.024-.009s-1.746-.568-3.776-.112c-2.026.458-3.773.286-3.773.286l-.045-.001c-.328-.01-2.38-.187-3.001-2.968-.675-3.028 2.365-4.687 2.592-4.968.226-.288 1.802-1.37 2.816-3.085zm.986 1.738v2.032h-1.64s-1.64.138-2.213 2.014c-.2 1.252.177 1.99.242 2.148.067.157.596 1.073 1.927 1.342h3.078v-7.514l-1.394-.022zm3.588 2.191l-1.44.024v3.956s.064.985 1.44 1.344h3.541v-5.3h-1.528v3.979h-1.46s-.466-.068-.553-.447v-3.556zM9.82 16.715v3.06H8.58s-.863-.045-1.126-1.049c-.136-.445.02-.959.088-1.16.063-.203.353-.671.951-.85H9.82zm9.525-9.036c2.086 0 2.646 2.06 2.646 2.742 0 .688.284 3.597-2.309 3.655-2.595.057-2.704-1.77-2.704-3.08 0-1.374.277-3.317 2.367-3.317zM4.24 6.08c1.523-.135 2.645 1.55 2.762 2.513.07.625.393 3.486-1.975 4-2.364.515-3.244-2.249-2.984-3.544 0 0 .28-2.797 2.197-2.969zm8.847-1.483c.14-1.31 1.69-3.316 2.931-3.028 1.236.285 2.367 1.944 2.137 3.37-.224 1.428-1.345 3.313-3.095 3.082-1.748-.226-2.143-1.823-1.973-3.424zM9.425 1c1.307 0 2.364 1.519 2.364 3.398 0 1.879-1.057 3.4-2.364 3.4s-2.367-1.521-2.367-3.4C7.058 2.518 8.118 1 9.425 1z"></path>'
  },
  "wenxin": {
    "vb": "0 0 24 24",
    "body": '<path d="M11.32 1.176a1.4 1.4 0 011.36 0l8.64 4.843c.421.234.68.67.68 1.141v9.68c0 .472-.259.908-.68 1.143l-8.64 4.84a1.4 1.4 0 01-1.36 0l-8.64-4.84A1.31 1.31 0 012 16.84V7.159c0-.471.259-.907.68-1.142l8.64-4.84zm7.42 13.839V8.227L12.002 12 12 19.551l6.059-3.394a1.31 1.31 0 00.68-1.142zM12.68 4.833a1.393 1.393 0 00-1.36 0L5.944 7.846c-.421.235-.68.67-.68 1.142v6.027c0 .47.259.905.68 1.142l2.795 1.566V11.09a1.546 1.546 0 00.221.79 1.527 1.527 0 01-.216-.834l.004-.094.02-.15.018-.084.017-.062.039-.117.062-.142.035-.065.081-.13.094-.122.084-.091.08-.075.125-.1.071-.048.134-.076 5.87-3.29-2.796-1.566z"></path>'
  },
  "tencent": {
    "vb": "0 0 24 24",
    "body": '<path d="M9.976 1L24 9.8l-10.587.015L10.723 23H5.489L8.18 9.8H3.244L1 5.4h8.077L9.976 1z"></path>'
  },
  "hunyuan": {
    "vb": "0 0 24 24",
    "body": '<path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm1.652 1.123l-.01-.001c.533.097 1.023.233 1.41.404 6.084 2.683 7.396 9.214 1.601 14.338a3.781 3.781 0 01-5.337-.328 3.654 3.654 0 01-.884-3.044c-1.934.6-3.295 2.305-3.524 4.45-.204 1.912.324 4.044 2.056 5.634l.245.067C10.1 22.876 11.036 23 12 23c6.075 0 11-4.925 11-11 0-5.513-4.056-10.08-9.348-10.877zM2.748 6.21c-.178.269-.348.536-.51.803l-.235.394.078-.167A10.957 10.957 0 001 12c0 4.919 3.228 9.083 7.682 10.49l.214.065C3.523 18.528 2.84 14.149 6.47 8.68A2.234 2.234 0 102.748 6.21zm10.157-5.172c4.408 1.33 3.61 5.41 2.447 6.924-.86 1.117-2.922 1.46-3.708 2.238-.666.657-1.077 1.462-1.212 2.291A5.303 5.303 0 0112 12.258a5.672 5.672 0 001.404-11.169 10.51 10.51 0 00-.5-.052z"></path>'
  },
  "bytedance": {
    "vb": "0 0 24 24",
    "body": '<path d="M14.944 18.587l-1.704-.445V10.01l1.824-.462c1-.254 1.84-.461 1.88-.453.032 0 .056 2.235.056 4.972v4.973l-.176-.008c-.104 0-.952-.207-1.88-.446z"></path><path d="M7 16.542c0-2.736.024-4.98.064-4.98.032-.008.872.2 1.88.454l1.816.461-.016 4.05-.024 4.049-1.632.422c-.896.23-1.736.445-1.856.469L7 21.523v-4.98z"></path><path d="M19.24 12.477c0-9.03.008-9.515.144-9.475.072.024.784.207 1.576.406.792.207 1.576.405 1.744.445l.296.08-.016 8.56-.024 8.568-1.624.414c-.888.23-1.728.437-1.856.47l-.24.055v-9.523z"></path><path d="M1 12.509c0-4.678.024-8.505.064-8.505.032 0 .872.207 1.872.454l1.824.461v7.582c0 4.16-.016 7.574-.032 7.574-.024 0-.872.215-1.88.47L1 21.013v-8.505z"></path>'
  },
  "doubao": {
    "vb": "0 0 24 24",
    "body": '<path d="M5.31 15.756c.172-3.75 1.883-5.999 2.549-6.739-3.26 2.058-5.425 5.658-6.358 8.308v1.12C1.501 21.513 4.226 24 7.59 24a6.59 6.59 0 002.2-.375c.353-.12.7-.248 1.039-.378.913-.899 1.65-1.91 2.243-2.992-4.877 2.431-7.974.072-7.763-4.5l.002.001z" fill-opacity=".5"></path><path d="M22.57 10.283c-1.212-.901-4.109-2.404-7.397-2.8.295 3.792.093 8.766-2.1 12.773a12.782 12.782 0 01-2.244 2.992c3.764-1.448 6.746-3.457 8.596-5.219 2.82-2.683 3.353-5.178 3.361-6.66a2.737 2.737 0 00-.216-1.084v-.002zM14.303 1.867C12.955.7 11.248 0 9.39 0 7.532 0 5.883.677 4.545 1.807 2.791 3.29 1.627 5.557 1.5 8.125v9.201c.932-2.65 3.097-6.25 6.357-8.307.5-.318 1.025-.595 1.569-.829 1.883-.801 3.878-.932 5.746-.706-.222-2.83-.718-5.002-.87-5.617h.001z"></path><path d="M17.305 4.961a199.47 199.47 0 01-1.08-1.094c-.202-.213-.398-.419-.586-.622l-1.333-1.378c.151.615.648 2.786.869 5.617 3.288.395 6.185 1.898 7.396 2.8-1.306-1.275-3.475-3.487-5.266-5.323z" fill-opacity=".5"></path>'
  },
  "yi": {
    "vb": "0 0 24 24",
    "body": '<path d="M18.62 13.927c.611 0 1.107.505 1.107 1.128v5.817c0 .623-.496 1.128-1.108 1.128a1.118 1.118 0 01-1.108-1.128v-5.817c0-.623.496-1.128 1.108-1.128zM16.59 3.052a1.094 1.094 0 011.562-.129c.466.404.522 1.116.126 1.59l-5.938 7.111v9.147c0 .624-.496 1.129-1.108 1.129a1.118 1.118 0 01-1.108-1.129v-9.477l.003-.088.01-.087c.015-.232.102-.462.261-.654l6.192-7.413zM2.906 2.256a1.094 1.094 0 011.559.157l4.387 5.45a1.142 1.142 0 01-.155 1.587 1.094 1.094 0 01-1.559-.157l-4.387-5.45a1.144 1.144 0 01.06-1.498l.095-.09z"></path><ellipse cx="20.146" cy="10.692" rx="1.354" ry="1.379"></ellipse>'
  },
  "nvidia": {
    "vb": "0 0 24 24",
    "body": '<path d="M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z"></path>'
  },
  "huggingface": {
    "vb": "0 0 24 24",
    "body": '<path d="M16.781 3.277c2.997 1.704 4.844 4.851 4.844 8.258 0 .995-.155 1.955-.443 2.857a1.332 1.332 0 011.125.4 1.41 1.41 0 01.2 1.723c.204.165.352.385.428.632l.017.062c.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.255.57-.893 1.018-2.128 1.5l-.202.078-.131.048c-.478.173-.89.295-1.061.345l-.086.024c-.89.243-1.808.375-2.732.394-1.32 0-2.3-.36-2.923-1.067a9.852 9.852 0 01-3.18.018C9.778 21.647 8.802 22 7.494 22a11.249 11.249 0 01-2.541-.343l-.221-.06-.273-.08a16.574 16.574 0 01-1.175-.405c-1.237-.483-1.875-.93-2.13-1.501-.186-.4-.151-.867.093-1.236a1.42 1.42 0 01-.2-1.166c.069-.273.226-.516.447-.694a1.41 1.41 0 01.2-1.722c.233-.248.557-.391.917-.407l.078-.001a9.385 9.385 0 01-.44-2.85c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0zM4.188 14.758c.125.687 2.357 2.35 2.14 2.707-.19.315-.796-.239-.948-.386l-.041-.04-.168-.147c-.561-.479-2.304-1.9-2.74-1.432-.43.46.119.859 1.055 1.42l.784.467.136.083c1.045.643 1.12.84.95 1.113-.188.295-3.07-2.1-3.34-1.083-.27 1.011 2.942 1.304 2.744 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725l.16.04.175.042c1.227.284 3.565.65 4.435-.604.673-.973.64-1.709-.248-2.61l-.057-.057c-.945-.928-1.495-2.288-1.495-2.288l-.017-.058-.025-.072c-.082-.22-.284-.639-.63-.584-.46.073-.798 1.21.12 1.933l.05.038c.977.721-.195 1.21-.573.534l-.058-.104-.143-.25c-.463-.799-1.282-2.111-1.739-2.397-.532-.332-.907-.148-.782.541zm14.842-.541c-.533.335-1.563 2.074-1.94 2.751a.613.613 0 01-.687.302.436.436 0 01-.176-.098.303.303 0 01-.049-.06l-.014-.028-.008-.02-.007-.019-.003-.013-.003-.017a.289.289 0 01-.004-.048c0-.12.071-.266.25-.427.026-.024.054-.047.084-.07l.047-.036c.022-.016.043-.032.063-.049.883-.71.573-1.81.131-1.917l-.031-.006-.056-.004a.368.368 0 00-.062.006l-.028.005-.042.014-.039.017-.028.015-.028.019-.036.027-.023.02c-.173.158-.273.428-.31.542l-.016.054s-.53 1.309-1.439 2.234l-.054.054c-.365.358-.596.69-.702 1.018-.143.437-.066.868.21 1.353.055.097.117.195.187.296.882 1.275 3.282.876 4.494.59l.286-.07.25-.074c.276-.084.736-.233 1.2-.42l.188-.077.065-.028.064-.028.124-.056.081-.038c.529-.252.964-.543.994-.827l.001-.036a.299.299 0 00-.037-.139c-.094-.176-.271-.212-.491-.168l-.045.01c-.044.01-.09.024-.136.04l-.097.035-.054.022c-.559.23-1.238.705-1.607.745h.006a.452.452 0 01-.05.003h-.024l-.024-.003-.023-.005c-.068-.016-.116-.06-.14-.142a.22.22 0 01-.005-.1c.062-.345.958-.595 1.713-.91l.066-.028c.528-.224.97-.483.985-.832v-.04a.47.47 0 00-.016-.098c-.048-.18-.175-.251-.36-.251-.785 0-2.55 1.36-2.92 1.36-.025 0-.048-.007-.058-.024a.6.6 0 01-.046-.088c-.1-.238.068-.462 1.06-1.066l.209-.126c.538-.32 1.01-.588 1.341-.831.29-.212.475-.406.503-.6l.003-.028c.008-.113-.038-.227-.147-.344a.266.266 0 00-.07-.054l-.034-.015-.013-.005a.403.403 0 00-.13-.02c-.162 0-.369.07-.595.18-.637.313-1.431.952-1.826 1.285l-.249.215-.033.033c-.08.078-.288.27-.493.386l-.071.037-.041.019a.535.535 0 01-.122.036h.005a.346.346 0 01-.031.003l.01-.001-.013.001c-.079.005-.145-.021-.19-.095a.113.113 0 01-.014-.065c.027-.465 2.034-1.991 2.152-2.642l.009-.048c.1-.65-.271-.817-.791-.493zM11.938 2.984c-4.798 0-8.688 3.829-8.688 8.55 0 .692.083 1.364.24 2.008l.008-.009c.252-.298.612-.46 1.017-.46.355.008.699.117.993.312.22.14.465.384.715.694.261-.372.69-.598 1.15-.605.852 0 1.367.728 1.562 1.383l.047.105.06.127c.192.396.595 1.139 1.143 1.68 1.06 1.04 1.324 2.115.8 3.266a8.865 8.865 0 002.024-.014c-.505-1.12-.26-2.17.74-3.186l.066-.066c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694a1.87 1.87 0 01.99-.312c.357 0 .682.126.925.36.14-.61.215-1.245.215-1.898 0-4.722-3.89-8.55-8.687-8.55zm1.857 8.926l.439-.212c.553-.264.89-.383.89.152 0 1.093-.771 3.208-3.155 3.262h-.184c-2.325-.052-3.116-2.06-3.156-3.175l-.001-.087c0-1.107 1.452.586 3.25.586.716 0 1.379-.272 1.917-.526zm4.017-3.143c.45 0 .813.358.813.8 0 .441-.364.8-.813.8a.806.806 0 01-.812-.8c0-.442.364-.8.812-.8zm-11.624 0c.448 0 .812.358.812.8 0 .441-.364.8-.812.8a.806.806 0 01-.813-.8c0-.442.364-.8.813-.8zm7.79-.841c.32-.384.846-.54 1.33-.394.483.146.83.564.878 1.06.048.495-.212.97-.659 1.203-.322.168-.447-.477-.767-.585l.002-.003c-.287-.098-.772.362-.925.079a1.215 1.215 0 01.14-1.36zm-4.323 0c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003c-.108.036-.194.134-.273.24l-.118.165c-.11.15-.22.262-.377.18a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394z"></path>'
  },
  "lmstudio": {
    "vb": "0 0 24 24",
    "body": '<path d="M2.84 2a1.273 1.273 0 100 2.547h14.107a1.273 1.273 0 100-2.547H2.84zM7.935 5.33a1.273 1.273 0 000 2.548H22.04a1.274 1.274 0 000-2.547H7.935zM3.624 9.935c0-.704.57-1.274 1.274-1.274h14.106a1.274 1.274 0 010 2.547H4.898c-.703 0-1.274-.57-1.274-1.273zM1.273 12.188a1.273 1.273 0 100 2.547H15.38a1.274 1.274 0 000-2.547H1.273zM3.624 16.792c0-.704.57-1.274 1.274-1.274h14.106a1.273 1.273 0 110 2.547H4.898c-.703 0-1.274-.57-1.274-1.273zM13.029 18.849a1.273 1.273 0 100 2.547h9.698a1.273 1.273 0 100-2.547h-9.698z" fill-opacity=".3"></path><path d="M2.84 2a1.273 1.273 0 100 2.547h10.287a1.274 1.274 0 000-2.547H2.84zM7.935 5.33a1.273 1.273 0 000 2.548H18.22a1.274 1.274 0 000-2.547H7.935zM3.624 9.935c0-.704.57-1.274 1.274-1.274h10.286a1.273 1.273 0 010 2.547H4.898c-.703 0-1.274-.57-1.274-1.273zM1.273 12.188a1.273 1.273 0 100 2.547H11.56a1.274 1.274 0 000-2.547H1.273zM3.624 16.792c0-.704.57-1.274 1.274-1.274h10.286a1.273 1.273 0 110 2.547H4.898c-.703 0-1.274-.57-1.274-1.273zM13.029 18.849a1.273 1.273 0 100 2.547h5.78a1.273 1.273 0 100-2.547h-5.78z"></path>'
  },
  "fireworks": {
    "vb": "0 0 24 24",
    "body": '<path clip-rule="evenodd" d="M14.8 5l-2.801 6.795L9.195 5H7.397l3.072 7.428a1.64 1.64 0 003.038.002L16.598 5H14.8zm1.196 10.352l5.124-5.244-.699-1.669-5.596 5.739a1.664 1.664 0 00-.343 1.807 1.642 1.642 0 001.516 1.012L16 17l8-.02-.699-1.669-7.303.041h-.002zM2.88 10.104l.699-1.669 5.596 5.739c.468.479.603 1.189.343 1.807a1.643 1.643 0 01-1.516 1.012l-8-.018-.002.002.699-1.669 7.303.042-5.122-5.246z"></path>'
  },
  "siliconcloud": {
    "vb": "0 0 24 24",
    "body": '<path clip-rule="evenodd" d="M22.956 6.521H12.522c-.577 0-1.044.468-1.044 1.044v3.13c0 .577-.466 1.044-1.043 1.044H1.044c-.577 0-1.044.467-1.044 1.044v4.174C0 17.533.467 18 1.044 18h10.434c.577 0 1.044-.467 1.044-1.043v-3.13c0-.578.466-1.044 1.043-1.044h9.391c.577 0 1.044-.467 1.044-1.044V7.565c0-.576-.467-1.044-1.044-1.044z"></path>'
  },
  "volcengine": {
    "vb": "0 0 24 24",
    "body": '<path d="M7.29 5.36L3.148 21.737a.215.215 0 00.203.261h8.29a.214.214 0 00.215-.261L7.7 5.359a.214.214 0 00-.41 0z" fill-opacity=".5"></path><path clip-rule="evenodd" d="M4.553 16.18l-1.406 5.558a.214.214 0 00.203.261h2.42-4.551a.214.214 0 01-.214-.26l2.275-8.961a.214.214 0 01.409 0l.864 3.402z"></path><path d="M14.44.15a.214.214 0 00-.41 0L8.366 21.739a.214.214 0 00.214.261H19.9a.214.214 0 00.215-.261L14.44.151z" fill-opacity=".5"></path><path clip-rule="evenodd" d="M16.694 22h3.207a.215.215 0 00.214-.262l-1.839-6.993 1.164-4.592a.214.214 0 01.411 0l2.951 11.586a.214.214 0 01-.214.261h-5.894z"></path><path d="M10.278 7.741L6.685 21.736a.214.214 0 00.214.264h7.17a.216.216 0 00.214-.166.216.216 0 000-.098L10.687 7.742a.214.214 0 00-.409 0z"></path>'
  },
  "ai21": {
    "vb": "0 0 24 24",
    "body": '<path d="M6.47 17l-.367-1.189H2.718L2.35 17H0l3.398-9.789h2.026L8.864 17H6.47zm-2.052-6.993l-1.17 4.028H5.56l-1.142-4.028zm4.707-2.796h2.23V17h-2.23V7.211zM11.955 15c.1-.483.277-.946.524-1.37.214-.359.482-.68.795-.951.32-.273.658-.52 1.013-.741.28-.168.54-.33.781-.483.222-.14.433-.296.632-.468.172-.148.317-.325.428-.525.107-.199.16-.423.157-.65 0-.392-.104-.674-.313-.846a1.176 1.176 0 00-.775-.259 1.207 1.207 0 00-.863.329c-.231.219-.347.585-.347 1.098H11.8a3.387 3.387 0 01.224-1.245c.146-.377.371-.716.66-.993.306-.29.667-.514 1.06-.657A4.04 4.04 0 0115.183 7c.42-.002.84.057 1.244.175.376.107.73.287 1.04.531.305.246.55.562.714.923.185.419.275.875.265 1.335.005.39-.084.774-.259 1.12-.167.328-.38.63-.632.894-.246.259-.517.49-.808.693-.29.2-.554.37-.789.51-.326.224-.596.417-.809.58a3.872 3.872 0 00-.51.455 1.229 1.229 0 00-.265.434 1.633 1.633 0 00-.074.517h4.078V17h-6.606a9.24 9.24 0 01.183-2zM18.8 8.93a5.05 5.05 0 001.135-.105c.25-.049.484-.156.686-.314.163-.139.28-.324.34-.532.068-.25.1-.51.095-.77H23V17h-2.243v-6.475H18.8V8.93z"></path>'
  },
  "stability": {
    "vb": "0 0 24 24",
    "body": '<path d="M7.223 21c4.252 0 7.018-2.22 7.018-5.56 0-2.59-1.682-4.236-4.69-4.918l-1.93-.571c-1.694-.375-2.683-.825-2.45-1.975.194-.957.773-1.497 2.122-1.497 4.285 0 5.873 1.497 5.873 1.497v-3.6S11.62 3 7.293 3C3.213 3 1 5.07 1 8.273c0 2.59 1.534 4.097 4.645 4.812l.334.083c.473.144 1.112.335 1.916.572 1.59.375 1.999.773 1.999 1.966 0 1.09-1.15 1.71-2.67 1.71C2.841 17.416 1 15.231 1 15.231v3.989S2.152 21 7.223 21z"></path><path d="M20.374 20.73c1.505 0 2.626-1.073 2.626-2.526 0-1.484-1.089-2.526-2.626-2.526-1.505 0-2.594 1.042-2.594 2.526 0 1.484 1.089 2.526 2.594 2.526z"></path>'
  },
  "midjourney": {
    "vb": "0 0 24 24",
    "body": '<path d="M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z"></path>'
  },
  "flux": {
    "vb": "0 0 24 24",
    "body": '<path d="M0 20.683L12.01 2.5 24 20.683h-2.233L12.009 5.878 3.471 18.806h12.122l1.239 1.877H0z"></path><path d="M8.069 16.724l2.073-3.115 2.074 3.115H8.069zM18.24 20.683l-5.668-8.707h2.177l5.686 8.707h-2.196zM19.74 11.676l2.13-3.19 2.13 3.19h-4.26z"></path>'
  },
  "suno": {
    "vb": "0 0 24 24",
    "body": '<path d="M16.5 0C20.642 0 24 5.373 24 12h-9c0 6.627-3.358 12-7.5 12C3.358 24 0 18.627 0 12h9c0-6.627 3.358-12 7.5-12z"></path>'
  }
};
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
var GLYPH_ALIASES = {
  gpt: "openai",
  chatgpt: "openai",
  o1: "openai",
  o3: "openai",
  o4: "openai",
  dalle: "openai",
  llama: "meta",
  facebook: "meta",
  glm: "chatglm",
  ernie: "wenxin",
  dashscope: "qwen",
  "01ai": "yi",
  zeroone: "yi"
};
function resolveGlyphSlug(id) {
  const n = normalizeProviderId(id);
  if (!n) return null;
  if (PROVIDER_GLYPHS[n]) return n;
  const alias = GLYPH_ALIASES[n];
  if (alias && PROVIDER_GLYPHS[alias]) return alias;
  let best = null;
  for (const k of Object.keys(PROVIDER_GLYPHS)) {
    if (k.length >= 3 && n.includes(k) && (!best || k.length > best.length)) best = k;
  }
  return best;
}
function GlyphTile({ slug, size, radiusClass, className = "" }) {
  const g = PROVIDER_GLYPHS[slug];
  const inner = Math.round(size * 0.62);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${radiusClass} bg-muted flex items-center justify-center text-foreground/85 ${className}`,
      style: { width: size, height: size },
      children: /* @__PURE__ */ jsx("svg", { viewBox: g.vb, width: inner, height: inner, fill: "currentColor", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: g.body } })
    }
  );
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
  const glyphSlug = resolveGlyphSlug(provider);
  if (glyphSlug) {
    if (rounded) {
      return /* @__PURE__ */ jsx(GlyphTile, { slug: glyphSlug, size, radiusClass: getRadiusClass(), className });
    }
    const g = PROVIDER_GLYPHS[glyphSlug];
    return /* @__PURE__ */ jsx("svg", { viewBox: g.vb, width: size, height: size, fill: "currentColor", "aria-label": provider, role: "img", className, dangerouslySetInnerHTML: { __html: g.body } });
  }
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
  if (failedPriority < 2) {
    const glyphSlug = resolveGlyphSlug(developer || provider);
    if (glyphSlug) {
      if (rounded) {
        return /* @__PURE__ */ jsx(GlyphTile, { slug: glyphSlug, size, radiusClass: getRadiusClass(), className });
      }
      const g = PROVIDER_GLYPHS[glyphSlug];
      return /* @__PURE__ */ jsx("svg", { viewBox: g.vb, width: size, height: size, fill: "currentColor", "aria-label": developer || provider, role: "img", className, dangerouslySetInnerHTML: { __html: g.body } });
    }
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
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
        onClick: () => setIsOpen(!isOpen),
        className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled: pending,
        "aria-label": label,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        children: /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" })
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: `absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 rounded-2xl border border-border bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`, children: /* @__PURE__ */ jsx("div", { className: "p-1", children: locales.map((lang) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleLocaleChange(lang.value),
        className: `dropdown-item w-full text-left ${currentLocale === lang.value ? "active" : ""}`,
        children: /* @__PURE__ */ jsx("span", { className: "flex-1", children: lang.label })
      },
      lang.value
    )) }) })
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
  return /* @__PURE__ */ jsxs("nav", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 max-w-6xl w-[calc(100%-48px)] bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-md flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs(Link, { href: homeHref, className: "flex items-center gap-2 rounded-lg px-2 py-1 -mx-2 hover:bg-foreground/5 transition-colors duration-200", children: [
      /* @__PURE__ */ jsx(Image, { src: logoSrc, alt: appName, width: 28, height: 28, className: "w-7 h-7" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm tracking-tight", children: appName })
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
      /* @__PURE__ */ jsx("div", { className: "md:hidden fixed inset-0 -z-10", onClick: () => setMenuOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "md:hidden absolute top-full left-0 right-0 mt-3 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg flex flex-col gap-0.5", children: [
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
  ] });
}

export { CapabilityIcon, CapabilitySelector, IDBadge, LanguageSwitcher, ModelAvatar, ModelCard, ModelIcon, ModelManagerCard, ModelSelect, ModelTypeIcon, Navbar, PROVIDER_ICON_SLUGS, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, ThinkingBlock, buttonVariants, getDeveloperIconPath, getIconPath, getProviderIconOptions, getProviderName, isKnownCapability, normalizeProviderId };
//# sourceMappingURL=ai.js.map
//# sourceMappingURL=ai.js.map