"use client";
import { cn, useAnchoredPosition } from './chunk-N4QO7RN5.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import * as React3 from 'react';
import { forwardRef, useState, useEffect, useRef, useId, useMemo } from 'react';
import { ChevronDown, Search, Loader2, X, ArrowRight, AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as Primitive from '@radix-ui/react-collapsible';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { useSpring, useTransform, motion } from 'framer-motion';
import { Toaster as Toaster$1, toast as toast$1 } from 'sonner';

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
  className = "",
  disabled = false,
  onSearch,
  searchDebounceMs = 250,
  loading = false,
  onLoadMore,
  hasMore = false
}) {
  const t = useYunUI().useT("common.select");
  const resolvedPlaceholder = placeholder || t("placeholder");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (i) => `${baseId}-opt-${i}`;
  const remote = typeof onSearch === "function";
  const showSearch = searchable || remote;
  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = !remote && searchQuery ? options.filter(
    (o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()) || o.value.toLowerCase().includes(searchQuery.toLowerCase())
  ) : options;
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;
  const didDebounceMountRef = useRef(false);
  useEffect(() => {
    if (!remote) return;
    if (!didDebounceMountRef.current) {
      didDebounceMountRef.current = true;
      return;
    }
    const id = setTimeout(() => onSearchRef.current?.(searchQuery), searchDebounceMs);
    return () => clearTimeout(id);
  }, [searchQuery, remote, searchDebounceMs]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    if (showSearch && inputRef.current) inputRef.current.focus();
    else triggerRef.current?.focus();
  }, [isOpen, showSearch]);
  useEffect(() => {
    if (isOpen) {
      const sel = filteredOptions.findIndex((o) => o.value === value);
      setHighlighted(sel >= 0 ? sel : 0);
    } else {
      setHighlighted(-1);
    }
  }, [isOpen]);
  useEffect(() => {
    if (highlighted >= filteredOptions.length) setHighlighted(filteredOptions.length - 1);
  }, [filteredOptions.length, highlighted]);
  useEffect(() => {
    if (!isOpen || highlighted < 0 || !listRef.current) return;
    listRef.current.querySelector(`#${CSS.escape(optionId(highlighted))}`)?.scrollIntoView({ block: "nearest" });
  }, [highlighted, isOpen]);
  const open = () => !disabled && setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setSearchQuery("");
    triggerRef.current?.focus();
  };
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
    triggerRef.current?.focus();
  };
  const handleListScroll = () => {
    if (!onLoadMore || !hasMore || loading) return;
    const el = listRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 48) onLoadMore();
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) return open();
        setHighlighted((h) => Math.min(h + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) return open();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Home":
        if (isOpen) {
          e.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (isOpen) {
          e.preventDefault();
          setHighlighted(filteredOptions.length - 1);
        }
        break;
      case "Enter":
        if (isOpen && filteredOptions[highlighted]) {
          e.preventDefault();
          handleSelect(filteredOptions[highlighted].value);
        } else if (!isOpen) {
          e.preventDefault();
          open();
        }
        break;
      case " ":
        if (!isOpen && !showSearch) {
          e.preventDefault();
          open();
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (isOpen) setIsOpen(false);
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, onKeyDown: handleKeyDown, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: () => !disabled && setIsOpen(!isOpen),
        disabled,
        "aria-haspopup": "listbox",
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? listboxId : void 0,
        "aria-activedescendant": isOpen && !searchable && highlighted >= 0 ? optionId(highlighted) : void 0,
        className: `
                    w-full flex items-center justify-between gap-2 px-3 py-2
                    rounded-xl border border-(--border-default) bg-(--bg-elevated)
                    hover:border-(--border-strong) hover:bg-(--bg-hover)
                    transition-all duration-200 text-sm
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${isOpen ? "border-primary ring-2 ring-primary/20" : ""}
                `,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
            selectedOption?.icon && /* @__PURE__ */ jsx("span", { className: "shrink-0", children: selectedOption.icon }),
            /* @__PURE__ */ jsx("span", { className: `truncate ${!selectedOption ? "text-muted-foreground" : ""}`, children: selectedOption ? selectedOption.label : resolvedPlaceholder })
          ] }),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              size: 16,
              className: `shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(
      "div",
      {
        ref: panelRef,
        style: { marginLeft: shift, maxHeight },
        className: `
                    absolute z-50 w-full ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"}
                    rounded-2xl border border-border
                    bg-popover/85 backdrop-blur-2xl text-popover-foreground
                    shadow-lg shadow-black/5
                    max-h-64 overflow-hidden flex flex-col
                    animate-in fade-in-0 zoom-in-95 duration-200
                `,
        children: [
          showSearch && /* @__PURE__ */ jsx("div", { className: "px-2.5 pb-2 pt-1.5 border-b border-(--border-subtle)", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                role: "combobox",
                "aria-expanded": isOpen,
                "aria-controls": listboxId,
                "aria-activedescendant": highlighted >= 0 ? optionId(highlighted) : void 0,
                "aria-autocomplete": "list",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: t("search"),
                "aria-label": t("search"),
                className: "w-full pl-9 pr-8 py-1.5 text-sm rounded-lg\n                                        bg-(--bg-muted) border border-transparent\n                                        focus:border-primary focus:outline-none focus:bg-(--bg-elevated) transition-colors"
              }
            ),
            loading ? /* @__PURE__ */ jsx(
              Loader2,
              {
                size: 14,
                "aria-hidden": true,
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
              }
            ) : searchQuery && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearchQuery(""),
                "aria-label": t("clearSearch"),
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-(--bg-hover)",
                title: t("clearSearch"),
                children: /* @__PURE__ */ jsx(X, { size: 12 })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: listRef,
              role: "listbox",
              id: listboxId,
              onScroll: handleListScroll,
              className: "flex-1 min-h-0 max-h-52 overflow-y-auto overscroll-contain p-1",
              children: [
                filteredOptions.length === 0 ? loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-3 py-3 text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { size: 16, "aria-hidden": true, className: "animate-spin" }) }) : /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground text-center whitespace-nowrap", children: t("noOptions") }) : filteredOptions.map((option, i) => {
                  const isSelected = option.value === value;
                  const isHigh = i === highlighted;
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      id: optionId(i),
                      type: "button",
                      role: "option",
                      "aria-selected": isSelected,
                      "data-highlighted": isHigh ? "" : void 0,
                      onClick: () => handleSelect(option.value),
                      onMouseEnter: () => setHighlighted(i),
                      className: `dropdown-item w-full text-left outline-none ${isSelected ? "active" : ""}`,
                      children: [
                        option.icon && /* @__PURE__ */ jsx("span", { className: "shrink-0 w-5 h-5 flex items-center justify-center", children: option.icon }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsx("div", { className: "truncate", children: option.label }),
                          option.description && /* @__PURE__ */ jsx("div", { className: "text-xs font-normal text-muted-foreground truncate", children: option.description })
                        ] })
                      ]
                    },
                    option.value
                  );
                }),
                loading && filteredOptions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-2 text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { size: 16, "aria-hidden": true, className: "animate-spin" }) })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SegmentedSelect({
  options,
  value,
  onChange,
  className,
  disabled = false
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex gap-1 flex-wrap", className), children: options.map((opt) => {
    const Icon = opt.icon;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => !disabled && onChange(opt.value),
        disabled,
        "aria-pressed": value === opt.value,
        title: opt.desc,
        className: cn(
          "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-lg whitespace-nowrap transition-all duration-150 ease cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          value === opt.value ? "text-foreground border-(--border-strong) bg-accent-subtle hover:bg-accent-muted hover:shadow-xs" : "text-muted-foreground border-(--border-default) bg-muted/50 hover:text-foreground hover:border-(--border-strong) hover:bg-muted",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        ),
        children: [
          Icon && /* @__PURE__ */ jsx(Icon, { size: 14 }),
          opt.label
        ]
      },
      String(opt.value)
    );
  }) });
}
function NavTabs({ tabs, activeKey, onChange, className = "", ariaLabel }) {
  const { Link } = useYunUI();
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain", "aria-label": ariaLabel, children: tabs.map((tab) => {
    const active = tab.key === activeKey;
    const cls = `nav-tab ${active ? "active" : ""}`;
    return tab.href ? /* @__PURE__ */ jsx(Link, { href: tab.href, className: cls, "aria-current": active ? "page" : void 0, children: tab.label }, tab.key) : /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange?.(tab.key),
        className: cls,
        "aria-current": active ? "true" : void 0,
        children: tab.label
      },
      tab.key
    );
  }) }) });
}
function ShinyButton({
  children,
  className,
  href,
  onClick
}) {
  const { Link } = useYunUI();
  const ButtonContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--text-primary) px-8 py-3 font-semibold text-background transition-all hover:ring-2 hover:ring-(--accent) hover:ring-offset-2 hover:ring-offset-background",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-2", children: [
          children,
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 block animate-shimmer bg-linear-to-r from-transparent via-(--text-primary)/10 to-transparent bg-size-[200%_100%]" })
      ]
    }
  );
  const focusCls = "rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  if (href) {
    return /* @__PURE__ */ jsx(Link, { href, onClick, className: focusCls, children: ButtonContent });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, className: focusCls, children: ButtonContent });
}
function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-(--gap)",
        {
          "flex-row": !vertical,
          "flex-col": vertical
        },
        className
      ),
      children: Array(repeat).fill(0).map((_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: cn("flex shrink-0 justify-around gap-(--gap)", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse
          }),
          children
        },
        i
      ))
    }
  );
}
var BentoGrid = ({
  className,
  children
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      ),
      children
    }
  );
};
var BentoCard = ({
  className,
  title,
  description,
  header,
  icon
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "row-span-1 glass-card p-6 flex flex-col justify-between space-y-4 group/bento overflow-hidden",
        className
      ),
      children: [
        header,
        /* @__PURE__ */ jsxs("div", { className: "group-hover/bento:translate-x-2 transition duration-200", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 text-[var(--text-primary)]", children: icon }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-[var(--text-primary)] text-lg mb-2 mt-2", children: title }),
          /* @__PURE__ */ jsx("div", { className: "font-normal text-[var(--text-secondary)] text-sm leading-relaxed", children: description })
        ] })
      ]
    }
  );
};
var Collapsible = Primitive.Root;
var CollapsibleTrigger2 = Primitive.CollapsibleTrigger;
var CollapsibleContent2 = forwardRef(({ children, ...props }, ref) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return /* @__PURE__ */ jsx(
    Primitive.CollapsibleContent,
    {
      ref,
      ...props,
      className: cn(
        "overflow-hidden",
        mounted && "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down",
        props.className
      ),
      children
    }
  );
});
CollapsibleContent2.displayName = Primitive.CollapsibleContent.displayName;
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React3.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    side: "bottom",
    className: cn(
      "z-50 origin-(--radix-popover-content-transform-origin) overflow-y-auto max-h-(--radix-popover-content-available-height) min-w-[240px] max-w-[98vw] rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl p-2 text-sm text-popover-foreground shadow-lg shadow-black/5 focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
var PopoverClose2 = PopoverPrimitive.PopoverClose;
var PopoverAnchor = PopoverPrimitive.Anchor;
var ScrollArea = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React3.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
var sizeClasses = {
  sm: {
    track: "w-8 h-4",
    thumb: "w-2.5 h-2.5",
    thumbTranslate: "translate-x-3.5"
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-4 h-4",
    thumbTranslate: "translate-x-5"
  }
};
var variantClasses = {
  default: {
    checkedTrack: "border-primary bg-primary/10",
    uncheckedTrack: "border-(--border-strong) bg-muted",
    checkedThumb: "bg-primary",
    uncheckedThumb: "bg-(--border-strong)"
  },
  success: {
    checkedTrack: "border-(--success) bg-success-soft",
    uncheckedTrack: "border-(--border-strong) bg-muted",
    checkedThumb: "bg-(--success)",
    uncheckedThumb: "bg-(--border-strong)"
  },
  warning: {
    checkedTrack: "border-(--warning) bg-warning-soft",
    uncheckedTrack: "border-(--border-strong) bg-muted",
    checkedThumb: "bg-(--warning)",
    uncheckedThumb: "bg-(--border-strong)"
  },
  danger: {
    checkedTrack: "border-(--error) bg-error-soft",
    uncheckedTrack: "border-(--border-strong) bg-muted",
    checkedThumb: "bg-(--error)",
    uncheckedThumb: "bg-(--border-strong)"
  }
};
var Switch = forwardRef(
  ({ checked, onCheckedChange, disabled = false, size = "sm", variant = "default", className = "", id, ...props }, ref) => {
    const sizeClass = sizeClasses[size];
    const variantClass = variantClasses[variant];
    return /* @__PURE__ */ jsx(
      "button",
      {
        ...props,
        ref,
        type: "button",
        role: "switch",
        "aria-checked": checked,
        id,
        onClick: () => !disabled && onCheckedChange(!checked),
        disabled,
        className: `
                    ${sizeClass.track} rounded-full border-2 flex items-center px-0.5
                    transition-all duration-200 ease-in-out
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${checked ? variantClass.checkedTrack : variantClass.uncheckedTrack}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `,
        children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `
                        ${sizeClass.thumb} rounded-full transition-all duration-200 ease-in-out
                        ${checked ? variantClass.checkedThumb + " " + sizeClass.thumbTranslate : variantClass.uncheckedThumb + " translate-x-0"}
                        shadow-sm
                    `
          }
        )
      }
    );
  }
);
Switch.displayName = "Switch";
function AnimatedNumber({ value, suffix = "", decimals = 0 }) {
  const animatedValue = useSpring(0, { stiffness: 50, damping: 15 });
  const displayValue = useTransform(animatedValue, (latest) => {
    const numStr = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
    return Number(numStr).toString() + suffix;
  });
  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);
  return /* @__PURE__ */ jsx(motion.span, { children: displayValue });
}
var TONE_VAR = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)"
};
function Sparkline({
  data,
  width = 100,
  height = 28,
  tone = "accent",
  color,
  strokeWidth = 1.5,
  area = false,
  min,
  max,
  className,
  ...props
}) {
  const gradientId = useId();
  const stroke = color ?? TONE_VAR[tone];
  if (!Array.isArray(data) || data.length < 2) {
    return /* @__PURE__ */ jsx("svg", { width, height, className, "aria-hidden": true, ...props });
  }
  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const span = hi - lo || 1;
  const stepX = width / (data.length - 1);
  const pad = strokeWidth;
  const usableH = height - pad * 2;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = pad + usableH - (v - lo) / span * usableH;
    return [x, y];
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${line} L${width} ${height} L0 ${height} Z`;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      preserveAspectRatio: "none",
      className: cn("overflow-visible", className),
      role: "img",
      ...props,
      children: [
        area && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: stroke, stopOpacity: 0.28 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: stroke, stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx("path", { d: areaPath, fill: `url(#${gradientId})`, stroke: "none" })
        ] }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: line,
            fill: "none",
            stroke,
            strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
var TONE_VAR2 = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)"
};
function Gauge({
  value,
  size = 72,
  thickness = 6,
  tone = "accent",
  color,
  label,
  counterClockwise = false,
  className
}) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const stroke = color ?? TONE_VAR2[tone];
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = pct / 100 * c;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("relative inline-flex items-center justify-center", className),
      style: { width: size, height: size },
      role: "progressbar",
      "aria-valuenow": Math.round(pct),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: [
        /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r,
              fill: "none",
              stroke: "var(--color-border)",
              strokeWidth: thickness
            }
          ),
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r,
              fill: "none",
              stroke,
              strokeWidth: thickness,
              strokeLinecap: "round",
              strokeDasharray: `${dash} ${c}`,
              className: "transition-[stroke-dasharray] duration-500 ease-out",
              transform: counterClockwise ? `scale(1,-1) translate(0,${-size})` : void 0
            }
          )
        ] }),
        label !== null && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums", children: label ?? `${Math.round(pct)}%` })
      ]
    }
  );
}
var TONE_VAR3 = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)"
};
var segColor = (s) => s.color ?? TONE_VAR3[s.tone ?? "accent"];
function SegmentedBar({
  segments,
  total,
  height = 8,
  legend = false,
  formatValue,
  className
}) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  const axis = total ?? (sum || 1);
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex w-full overflow-hidden rounded-full bg-muted",
        style: { height },
        role: "img",
        children: segments.map((s, i) => {
          const w = Math.max(0, s.value) / axis * 100;
          if (w <= 0) return null;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full transition-[width] duration-300 first:rounded-l-full last:rounded-r-full",
              style: { width: `${w}%`, backgroundColor: segColor(s) },
              title: typeof s.label === "string" ? s.label : void 0
            },
            i
          );
        })
      }
    ),
    legend && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-1", children: segments.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "h-2 w-2 shrink-0 rounded-full",
          style: { backgroundColor: segColor(s) }
        }
      ),
      s.label != null && /* @__PURE__ */ jsx("span", { children: s.label }),
      /* @__PURE__ */ jsx("span", { className: "font-medium tabular-nums text-foreground/80", children: formatValue ? formatValue(s.value) : s.value })
    ] }, i)) })
  ] });
}
function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  icon,
  label = "Drop a file here, or click to browse",
  hint,
  children,
  className
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const emit = (list) => {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    emit(e.dataTransfer.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: () => !disabled && inputRef.current?.click(),
      onDrop,
      onDragOver,
      onDragLeave: () => setDragging(false),
      role: "button",
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled,
      onKeyDown: (e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      },
      className: cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        disabled ? "cursor-not-allowed opacity-50 border-border" : "cursor-pointer border-border hover:border-accent hover:bg-muted/40",
        dragging && !disabled && "border-accent bg-accent/10",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept,
            multiple,
            disabled,
            className: "hidden",
            onChange: (e) => {
              emit(e.target.files);
              e.target.value = "";
            }
          }
        ),
        children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
          icon && /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: icon }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: label }),
          hint && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: hint })
        ] })
      ]
    }
  );
}
var TONE_VAR4 = {
  accent: "var(--color-accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
  neutral: "var(--color-muted-foreground)"
};
var VIEW_H = 140;
function normalize(data) {
  return data.map((d) => typeof d === "number" ? { value: d } : d);
}
function AreaChart({
  data,
  tone = "accent",
  color,
  height = VIEW_H,
  formatValue,
  showGrid = true,
  showTooltip = true,
  showXAxis = false,
  strokeWidth = 2,
  ariaLabel = "Area chart",
  noDataLabel = "No data",
  className
}) {
  const gradientId = useId();
  const stroke = color ?? TONE_VAR4[tone];
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState(null);
  const points = useMemo(() => normalize(data), [data]);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  const values = points.map((p) => Number.isFinite(p.value) ? p.value : 0);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const span = maxVal - minVal || 1;
  const chartWidth = width || 600;
  const getPoint = (i) => {
    const x = i / Math.max(points.length - 1, 1) * chartWidth;
    const normalized = (values[i] - minVal) / span;
    const y = VIEW_H - normalized * VIEW_H * 0.85 - VIEW_H * 0.05;
    return { x, y };
  };
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    const start = getPoint(0);
    let path = `M ${start.x},${start.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = getPoint(i);
      const next = getPoint(i + 1);
      const cpx = (curr.x + next.x) / 2;
      path += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
    }
    return path;
  }, [points, values, maxVal, minVal, chartWidth]);
  const areaPath = linePath ? `${linePath} L ${chartWidth},${VIEW_H} L 0,${VIEW_H} Z` : "";
  const hoveredCoords = hovered !== null ? getPoint(hovered) : null;
  const fmt = formatValue ?? ((v) => String(v));
  const xLabels = points.filter((p) => p.label != null);
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col", className), children: [
    /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative w-full", style: { height }, children: [
      points.length < 2 ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: noDataLabel }) : /* @__PURE__ */ jsxs(
        "svg",
        {
          viewBox: `0 0 ${chartWidth} ${VIEW_H}`,
          preserveAspectRatio: "none",
          className: "h-full w-full overflow-visible",
          role: "img",
          "aria-label": ariaLabel,
          onMouseMove: (e) => {
            if (!showTooltip) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const idx = Math.min(
              Math.max(0, Math.round(mouseX / rect.width * (points.length - 1))),
              points.length - 1
            );
            setHovered(idx);
          },
          onMouseLeave: () => setHovered(null),
          children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: stroke, stopOpacity: 0.32 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: stroke, stopOpacity: 0 })
            ] }) }),
            showGrid && [0, 0.25, 0.5, 0.75, 1].map((tick) => /* @__PURE__ */ jsx(
              "line",
              {
                x1: 0,
                y1: VIEW_H * tick,
                x2: chartWidth,
                y2: VIEW_H * tick,
                stroke: "currentColor",
                strokeOpacity: 0.1,
                strokeDasharray: "4 4",
                className: "text-muted-foreground"
              },
              tick
            )),
            /* @__PURE__ */ jsx("path", { d: areaPath, fill: `url(#${gradientId})` }),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: linePath,
                fill: "none",
                stroke,
                strokeWidth,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            hoveredCoords && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "line",
                {
                  x1: hoveredCoords.x,
                  y1: 0,
                  x2: hoveredCoords.x,
                  y2: VIEW_H,
                  stroke,
                  strokeOpacity: 0.4,
                  strokeDasharray: "4 4"
                }
              ),
              /* @__PURE__ */ jsx(
                "circle",
                {
                  cx: hoveredCoords.x,
                  cy: hoveredCoords.y,
                  r: 4,
                  fill: stroke,
                  stroke: "var(--color-background)",
                  strokeWidth: 2,
                  vectorEffect: "non-scaling-stroke"
                }
              )
            ] })
          ]
        }
      ),
      showTooltip && hovered !== null && points[hovered] && chartWidth > 0 && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover/95 p-2 text-xs shadow-lg backdrop-blur-sm",
          style: {
            left: `${Math.min(Math.max(getPoint(hovered).x / chartWidth * 100, 8), 92)}%`,
            top: Math.max(getPoint(hovered).y / VIEW_H * height - 8, 0)
          },
          children: [
            points[hovered].label != null && /* @__PURE__ */ jsx("div", { className: "mb-0.5 font-medium", children: points[hovered].label }),
            /* @__PURE__ */ jsx("div", { className: "tabular-nums text-muted-foreground", children: fmt(values[hovered]) })
          ]
        }
      )
    ] }),
    showXAxis && xLabels.length > 1 && /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex justify-between px-1 text-xs text-muted-foreground", children: points.filter((p, i) => p.label != null && i % Math.ceil(points.length / 6) === 0).map((p, i) => /* @__PURE__ */ jsx("span", { className: "truncate", children: p.label }, i)) })
  ] });
}
function Toaster() {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      position: "bottom-right",
      toastOptions: {
        classNames: {
          toast: "bg-card border border-border rounded-xl shadow-lg p-4",
          title: "text-sm font-medium",
          description: "text-xs text-muted-foreground",
          actionButton: "bg-foreground text-background text-xs px-3 py-1.5 rounded-lg",
          cancelButton: "text-muted-foreground text-xs px-3 py-1.5 rounded-lg hover:bg-muted"
        }
      }
    }
  );
}
var toast = {
  success: (message, description) => {
    toast$1.success(message, {
      description,
      icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-success" })
    });
  },
  error: (message, description) => {
    toast$1.error(message, {
      description,
      icon: /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-error" })
    });
  },
  info: (message, description) => {
    toast$1.info(message, {
      description,
      icon: /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-info" })
    });
  },
  warning: (message, description) => {
    toast$1.warning(message, {
      description,
      icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-warning" })
    });
  },
  loading: (message) => {
    return toast$1.loading(message, {
      icon: /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" })
    });
  },
  dismiss: (id) => {
    toast$1.dismiss(id);
  },
  promise: (promise, messages) => {
    return toast$1.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error
    });
  }
};
var YUNUI_PALETTES = [
  "gray",
  "sand",
  "slate",
  "mint",
  "rose",
  "dusk",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "moss",
  "green",
  "emerald",
  "teal",
  "aqua",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "plum",
  "magenta",
  "fuchsia",
  "pink"
];
var YUNUI_THEME_PRESETS = {
  aurora: { label: "Aurora", brand: "blue", accent: "violet", neutral: "slate" },
  sunset: { label: "Sunset", brand: "orange", accent: "pink", neutral: "sand" },
  forest: { label: "Forest", brand: "green", accent: "lime", neutral: "gray" },
  ocean: { label: "Ocean", brand: "cyan", accent: "teal", neutral: "slate" },
  grape: { label: "Grape", brand: "violet", accent: "magenta", neutral: "dusk" },
  ember: { label: "Ember", brand: "red", accent: "amber", neutral: "sand" },
  lagoon: { label: "Lagoon", brand: "teal", accent: "emerald", neutral: "mint" },
  blossom: { label: "Blossom", brand: "pink", accent: "fuchsia", neutral: "rose" },
  royal: { label: "Royal", brand: "indigo", accent: "blue", neutral: "slate" },
  citrus: { label: "Citrus", brand: "lime", accent: "yellow", neutral: "sand" },
  orchid: { label: "Orchid", brand: "plum", accent: "violet", neutral: "dusk" },
  mono: { label: "Mono", brand: "gray", accent: "gray", neutral: "gray" }
};
var ATTR = {
  brand: "data-brand",
  accent: "data-accent",
  neutral: "data-neutral",
  solid: "data-solid",
  surface: "data-surface",
  theme: "data-theme",
  accentSource: "data-accent-source"
};
function resolveTarget(el) {
  if (el) return el;
  return typeof document !== "undefined" ? document.documentElement : null;
}
function applyTheme(theme, el) {
  const target = resolveTarget(el);
  if (!target) return;
  for (const key of Object.keys(theme)) {
    const value = theme[key];
    const attr = ATTR[key];
    if (!attr) continue;
    if (value == null) target.removeAttribute(attr);
    else target.setAttribute(attr, value);
  }
}
function readTheme(el) {
  const target = resolveTarget(el);
  const out = {};
  if (!target) return out;
  for (const key of Object.keys(ATTR)) {
    const v = target.getAttribute(ATTR[key]);
    if (v != null) out[key] = v;
  }
  return out;
}
var STORAGE_KEY = "yunui-theme";
function useYunUITheme(defaults = {}) {
  const [theme, setTheme] = React3.useState(defaults);
  React3.useEffect(() => {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
    }
    const merged = { ...defaults, ...stored };
    setTheme(merged);
    applyTheme(merged);
  }, []);
  const update = React3.useCallback((patch) => {
    setTheme((prev) => {
      const next = { ...prev, ...patch };
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  }, []);
  return [theme, update];
}

export { AnimatedNumber, AreaChart, BentoCard, BentoGrid, Collapsible, CollapsibleContent2 as CollapsibleContent, CollapsibleTrigger2 as CollapsibleTrigger, CustomSelect, FileDropzone, Gauge, Marquee, NavTabs, Popover, PopoverAnchor, PopoverClose2 as PopoverClose, PopoverContent, PopoverTrigger, ScrollArea, ScrollBar, SegmentedBar, SegmentedSelect, ShinyButton, Sparkline, Switch, Toaster, YUNUI_PALETTES, YUNUI_THEME_PRESETS, applyTheme, readTheme, toast, useYunUITheme };
//# sourceMappingURL=chunk-RBXDVCI3.js.map
//# sourceMappingURL=chunk-RBXDVCI3.js.map