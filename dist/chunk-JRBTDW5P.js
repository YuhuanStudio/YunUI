"use client";
import { cn, useAnchoredPosition, useDismissOnOutside, Spinner } from './chunk-ALP6SDRA.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import * as React3 from 'react';
import { forwardRef, useState, useEffect, useRef, useId, useMemo, useCallback } from 'react';
import { ChevronDown, Search, Loader2, X, ArrowRight, AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as Primitive from '@radix-ui/react-collapsible';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { useSpring, useTransform, motion } from 'framer-motion';
import { Toaster as Toaster$1, toast as toast$1 } from 'sonner';
import { createPortal } from 'react-dom';

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
  useDismissOnOutside(
    isOpen,
    () => {
      setIsOpen(false);
      setSearchQuery("");
    },
    containerRef,
    { escape: false }
  );
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
                className: "w-full pl-9 pr-8 py-1.5 text-base md:text-sm rounded-lg\n                                        bg-(--bg-muted) border border-transparent\n                                        focus:border-primary focus:outline-none focus:bg-(--bg-elevated) transition-colors"
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
          "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-lg whitespace-nowrap transition-all duration-150 ease cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          value === opt.value ? (
            // Same language as .btn-primary: a full-strength foreground outline. The
            // previous accent-subtle fill matched the unselected muted fill in every
            // theme (identical in light), so the current choice was invisible.
            "text-foreground border-foreground bg-foreground/[0.06] shadow-xs hover:bg-foreground/10"
          ) : "text-muted-foreground border-(--border-default) bg-muted/50 hover:text-foreground hover:border-(--border-strong) hover:bg-muted",
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
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 block animate-shimmer bg-linear-to-r from-transparent via-(--text-primary)/10 to-transparent bg-size-[200%_100%]" })
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
        "row-span-1 glass-card relative p-6 flex flex-col justify-between space-y-4 group/bento overflow-hidden",
        // The house hover, matching `.card-interactive`: a single-pixel
        // lift and one step up the shadow ramp. Content stays put —
        // sliding or scaling it (the stock bento-grid trick this card
        // used to carry) reads as jitter and matches nothing else here.
        // The richer glow treatment belongs to `FeatureCard`, which is a
        // faithful extraction of Yunxin's marketing tile; keeping it out
        // of here stops the two from competing.
        "transition-all duration-150 hover:-translate-y-px hover:shadow-md",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"
          }
        ),
        header,
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
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
  ({ checked, onCheckedChange, disabled = false, size = "sm", variant = "default", className = "", id, label, ...props }, ref) => {
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
        ...label ? { "aria-label": label } : {},
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
function format(value, decimals, suffix) {
  const numStr = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return Number(numStr).toString() + suffix;
}
function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  immediate
}) {
  const [autoImmediate, setAutoImmediate] = useState(() => {
    const env = globalThis.process;
    return env?.env?.NODE_ENV === "test";
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoImmediate((was) => was || mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const skip = immediate ?? autoImmediate;
  const animatedValue = useSpring(0, { stiffness: 50, damping: 15 });
  const displayValue = useTransform(
    animatedValue,
    (latest) => format(latest, decimals, suffix)
  );
  useEffect(() => {
    if (skip) animatedValue.jump(value);
    else animatedValue.set(value);
  }, [animatedValue, value, skip]);
  return /* @__PURE__ */ jsx(motion.span, { children: skip ? format(value, decimals, suffix) : displayValue });
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
  label,
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
      role: label ? "img" : void 0,
      "aria-label": label,
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
  ariaLabel,
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
      "aria-label": typeof label === "string" ? label : ariaLabel,
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
  label,
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
        role: label ? "img" : void 0,
        "aria-label": label,
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
var TONE_COLOR = {
  accent: "var(--color-accent)",
  info: "var(--info)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  neutral: "var(--color-muted-foreground)"
};
var DEFAULT_HEIGHT = 252;
var DEFAULT_WIDTH = 640;
var MARGIN = { top: 14, right: 14, bottom: 34, left: 54 };
var Y_TICK_COUNT = 5;
var X_TICK_COUNT = 5;
function normalizeData(data) {
  const sorted = data.map((point, inputIndex) => ({ ...point, inputIndex })).filter((point) => Number.isFinite(point.x)).sort((a, b) => a.x - b.x || a.inputIndex - b.inputIndex);
  const byX = /* @__PURE__ */ new Map();
  for (const point of sorted) byX.set(point.x, { x: point.x, values: point.values });
  return [...byX.values()].sort((a, b) => a.x - b.x);
}
function validValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function niceStep(span) {
  if (!Number.isFinite(span) || span <= 0) return 1;
  const rough = span / (Y_TICK_COUNT - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / magnitude;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * magnitude;
}
function makeYTicks(min, max) {
  const span = max - min;
  const step = niceStep(span);
  const first = Math.ceil(min / step) * step;
  const values = [];
  for (let value = first, guard = 0; value <= max + step * 1e-8 && guard < 12; value += step, guard += 1) {
    values.push(Number(value.toPrecision(12)));
  }
  if (!values.length) values.push(min, max);
  return values;
}
function selectXTickValues(points, min, max, count) {
  if (points.length <= 1) return points.map((point) => point.x);
  if (count <= 1) return [points[Math.floor((points.length - 1) / 2)].x];
  const candidates = Array.from({ length: count }, (_, index) => min + (max - min) * index / (count - 1));
  const selected = [];
  for (const candidate of candidates) {
    let nearest = points[0].x;
    let distance = Math.abs(nearest - candidate);
    for (let index = 1; index < points.length; index += 1) {
      const next = points[index].x;
      const nextDistance = Math.abs(next - candidate);
      if (nextDistance < distance) {
        nearest = next;
        distance = nextDistance;
      }
    }
    if (selected.at(-1) !== nearest) selected.push(nearest);
  }
  return selected;
}
function pointForX(points, x) {
  if (x == null || !points.length) return null;
  let nearest = points[0];
  let distance = Math.abs(nearest.x - x);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const nextDistance = Math.abs(point.x - x);
    if (nextDistance < distance) {
      nearest = point;
      distance = nextDistance;
    }
  }
  return nearest;
}
function formatDefault(value) {
  return new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(value);
}
function segmentsForSeries(points, definition, xScale, yScale, maxGap) {
  const segments = [];
  let current = [];
  let previousX;
  for (const point of points) {
    const value = validValue(point.values[definition.key]);
    const gap = previousX !== void 0 && maxGap !== void 0 && point.x - previousX > maxGap;
    if (value === void 0 || gap) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (value !== void 0) {
      current.push({ x: xScale(point.x), y: yScale(value) });
    }
    previousX = point.x;
  }
  if (current.length) segments.push(current);
  return segments;
}
function closestPointIndex(points, value) {
  let result = 0;
  let distance = Math.abs(points[0].x - value);
  for (let index = 1; index < points.length; index += 1) {
    const nextDistance = Math.abs(points[index].x - value);
    if (nextDistance < distance) {
      result = index;
      distance = nextDistance;
    }
  }
  return result;
}
function TimeSeriesChart({
  data,
  series,
  ariaLabel,
  emptyLabel = "No data",
  unavailableLabel = "No finite values for the visible series",
  hiddenLabel = "All series are hidden",
  missingValueLabel = "\u2014",
  legendLabel = "series",
  keyboardHint = "Use left and right arrow keys, Home or End to inspect sample values.",
  height = DEFAULT_HEIGHT,
  formatX = formatDefault,
  formatY = formatDefault,
  maxGap,
  activeX,
  onActiveXChange,
  showLegend = true,
  className
}) {
  const instanceId = useId();
  const chartRef = useRef(null);
  const pointerSelectionRef = useRef(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [hiddenKeys, setHiddenKeys] = useState(() => /* @__PURE__ */ new Set());
  const [internalActiveX, setInternalActiveX] = useState(null);
  const [keyboardAnnouncement, setKeyboardAnnouncement] = useState("");
  const controlledActiveX = activeX !== void 0;
  const selectedX = controlledActiveX ? activeX != null && Number.isFinite(activeX) ? activeX : null : internalActiveX;
  const canSetActiveX = !controlledActiveX || Boolean(onActiveXChange);
  const points = useMemo(() => normalizeData(data), [data]);
  const definitions = useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    return series.filter((item) => {
      if (!item.key || seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    });
  }, [series]);
  const visibleSeries = useMemo(() => definitions.filter((item) => !hiddenKeys.has(item.key)), [definitions, hiddenKeys]);
  const maxGapValue = maxGap !== void 0 && Number.isFinite(maxGap) && maxGap >= 0 ? maxGap : void 0;
  const plotWidth = Math.max(1, width - MARGIN.left - MARGIN.right);
  const plotHeight = Math.max(1, height - MARGIN.top - MARGIN.bottom);
  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    const measure = () => {
      const next = Math.floor(element.getBoundingClientRect().width);
      if (next > 0) setWidth((current) => current === next ? current : next);
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const finiteValues = useMemo(() => {
    const result = [];
    for (const point of points) for (const definition of visibleSeries) {
      const value = validValue(point.values[definition.key]);
      if (value !== void 0) result.push(value);
    }
    return result;
  }, [points, visibleSeries]);
  const hasPlottableValues = finiteValues.length > 0;
  const rawMinX = points[0]?.x ?? 0;
  const rawMaxX = points.at(-1)?.x ?? 1;
  const xPadding = rawMinX === rawMaxX ? 0.5 : 0;
  const minX = rawMinX - xPadding;
  const maxX = rawMaxX + xPadding;
  const rawMinY = hasPlottableValues ? finiteValues.reduce((min, value) => Math.min(min, value), Infinity) : 0;
  const rawMaxY = hasPlottableValues ? finiteValues.reduce((max, value) => Math.max(max, value), -Infinity) : 1;
  const yPadding = rawMinY === rawMaxY ? Math.max(Math.abs(rawMinY) * 0.05, 1) : 0;
  const minY = rawMinY - yPadding;
  const maxY = rawMaxY + yPadding;
  const yTicks = useMemo(() => hasPlottableValues ? makeYTicks(minY, maxY) : [], [hasPlottableValues, minY, maxY]);
  const widestXLabel = useMemo(() => points.reduce((length, point) => Math.max(length, formatX(point.x).length), 0), [points, formatX]);
  const minXLabelSpacing = Math.max(80, widestXLabel * 6.5 + 16);
  const xTickCount = Math.max(1, Math.min(X_TICK_COUNT, Math.floor(plotWidth / minXLabelSpacing) + 1));
  const xTickValues = useMemo(() => hasPlottableValues ? selectXTickValues(points, minX, maxX, xTickCount) : [], [hasPlottableValues, points, minX, maxX, xTickCount]);
  const { xScale, yScale } = useMemo(() => ({
    xScale: (x) => MARGIN.left + (x - minX) / (maxX - minX || 1) * plotWidth,
    yScale: (y) => MARGIN.top + plotHeight - (y - minY) / (maxY - minY || 1) * plotHeight
  }), [minX, maxX, minY, maxY, plotWidth, plotHeight]);
  const plottedSeries = useMemo(() => visibleSeries.map((definition) => ({
    definition,
    color: definition.color ?? TONE_COLOR[definition.tone ?? "accent"],
    segments: segmentsForSeries(points, definition, xScale, yScale, maxGapValue).map((segment) => segment.length === 1 ? { point: segment[0] } : { path: segment.map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ") })
  })), [visibleSeries, points, xScale, yScale, maxGapValue]);
  const activePoint = pointForX(points, selectedX);
  const readoutPoint = activePoint ?? points.at(-1) ?? null;
  const canNavigate = points.length > 0 && hasPlottableValues && canSetActiveX;
  const xFormatter = formatX;
  const yFormatter = formatY;
  const clipId = `${instanceId}-plot-clip`;
  const chartWidth = Math.max(width, MARGIN.left + MARGIN.right + 1);
  const setActivePoint = (nextX, fromKeyboard) => {
    pointerSelectionRef.current = !fromKeyboard && !controlledActiveX && nextX !== null;
    if (fromKeyboard) {
      const nextPoint = pointForX(points, nextX);
      setKeyboardAnnouncement(nextPoint ? `${xFormatter(nextPoint.x)}. ${definitions.map((definition) => {
        const value = validValue(nextPoint.values[definition.key]);
        return `${definition.label}: ${value === void 0 ? missingValueLabel : yFormatter(value)}`;
      }).join(". ")}` : "");
    } else {
      setKeyboardAnnouncement("");
    }
    if (!canSetActiveX) return;
    if (!controlledActiveX) setInternalActiveX(nextX);
    onActiveXChange?.(nextX);
  };
  const handlePointerMove = (event) => {
    if (!canSetActiveX || !points.length || !hasPlottableValues) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const svgX = (event.clientX - rect.left) / rect.width * chartWidth;
    const domainX = minX + (svgX - MARGIN.left) / plotWidth * (maxX - minX);
    const index = closestPointIndex(points, domainX);
    setActivePoint(points[index].x, false);
  };
  const handleKeyDown = (event) => {
    if (!canNavigate) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setActivePoint(null, true);
      return;
    }
    const currentIndex = activePoint ? closestPointIndex(points, activePoint.x) : -1;
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = currentIndex < 0 ? 0 : Math.min(points.length - 1, currentIndex + 1);
    else if (event.key === "ArrowLeft") nextIndex = currentIndex < 0 ? points.length - 1 : Math.max(0, currentIndex - 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = points.length - 1;
    if (nextIndex === void 0) return;
    event.preventDefault();
    setActivePoint(points[nextIndex].x, true);
  };
  const toggleSeries = (key) => {
    setHiddenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const tooltipX = activePoint ? xScale(activePoint.x) : 0;
  const tooltipMaxWidth = Math.max(0, Math.min(288, chartWidth - 16));
  const tooltipHalf = tooltipMaxWidth / 2;
  const tooltipLeft = activePoint ? Math.max(8 + tooltipHalf, Math.min(chartWidth - 8 - tooltipHalf, tooltipX)) : 0;
  const noDataText = data.length === 0 ? emptyLabel : definitions.length > 0 && visibleSeries.length === 0 ? hiddenLabel : unavailableLabel;
  return /* @__PURE__ */ jsxs("figure", { className: cn("min-w-0", className), "data-yunui": "time-series-chart", "data-active-x": activePoint?.x ?? void 0, children: [
    showLegend && definitions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mb-2 flex flex-wrap items-center gap-1.5", role: "group", "aria-label": `${ariaLabel} ${legendLabel}`, children: definitions.map((definition) => {
      const visible = !hiddenKeys.has(definition.key);
      const color = definition.color ?? TONE_COLOR[definition.tone ?? "accent"];
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          "aria-pressed": visible,
          onClick: () => toggleSeries(definition.key),
          className: cn(
            "btn btn-ghost btn-sm inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px]",
            !visible && "opacity-50"
          ),
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "inline-block w-3 shrink-0 border-t-2",
                style: { borderColor: color, borderStyle: definition.dashed ? "dashed" : "solid" }
              }
            ),
            definition.label
          ]
        },
        definition.key
      );
    }) }) : null,
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: chartRef,
        className: "relative min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        role: "group",
        "aria-label": ariaLabel,
        tabIndex: canNavigate ? 0 : -1,
        onKeyDown: handleKeyDown,
        onPointerLeave: () => {
          if (!controlledActiveX && pointerSelectionRef.current && selectedX !== null) setActivePoint(null, false);
        },
        "data-yunui": "time-series-interaction",
        children: [
          hasPlottableValues ? /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "block w-full overflow-visible",
              width: "100%",
              height,
              viewBox: `0 0 ${chartWidth} ${height}`,
              preserveAspectRatio: "none",
              "aria-hidden": "true",
              onPointerMove: handlePointerMove,
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: clipId, children: /* @__PURE__ */ jsx("rect", { x: MARGIN.left, y: MARGIN.top, width: plotWidth, height: plotHeight }) }) }),
                yTicks.map((tick) => {
                  const y = yScale(tick);
                  return /* @__PURE__ */ jsxs("g", { children: [
                    /* @__PURE__ */ jsx("line", { x1: MARGIN.left, x2: chartWidth - MARGIN.right, y1: y, y2: y, stroke: "var(--border-default)", strokeDasharray: "3 5", strokeOpacity: "0.72" }),
                    /* @__PURE__ */ jsx("text", { "data-axis": "y", x: MARGIN.left - 8, y: y + 3.5, textAnchor: "end", fill: "var(--text-tertiary)", fontSize: "10", fontFamily: "var(--font-mono, ui-monospace, monospace)", children: yFormatter(tick) })
                  ] }, `y-${tick}`);
                }),
                xTickValues.map((tick) => {
                  const x = xScale(tick);
                  const anchor = x < MARGIN.left + 26 ? "start" : x > chartWidth - MARGIN.right - 26 ? "end" : "middle";
                  return /* @__PURE__ */ jsxs("g", { children: [
                    /* @__PURE__ */ jsx("line", { x1: x, x2: x, y1: MARGIN.top, y2: height - MARGIN.bottom, stroke: "var(--border-default)", strokeOpacity: "0.22" }),
                    /* @__PURE__ */ jsx("text", { "data-axis": "x", x, y: height - 9, textAnchor: anchor, fill: "var(--text-tertiary)", fontSize: "10", fontFamily: "var(--font-mono, ui-monospace, monospace)", children: xFormatter(tick) })
                  ] }, `x-${tick}`);
                }),
                /* @__PURE__ */ jsxs("g", { clipPath: `url(#${clipId})`, children: [
                  plottedSeries.map(({ definition, color, segments }) => {
                    return /* @__PURE__ */ jsxs("g", { children: [
                      segments.map((segment, index) => segment.point ? /* @__PURE__ */ jsx("circle", { cx: segment.point.x, cy: segment.point.y, r: "3", fill: color }, `${definition.key}-point-${index}`) : /* @__PURE__ */ jsx("path", { d: segment.path ?? "", fill: "none", stroke: color, strokeWidth: "2", strokeDasharray: definition.dashed ? "5 4" : void 0, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" }, `${definition.key}-segment-${index}`)),
                      activePoint ? (() => {
                        const value = validValue(activePoint.values[definition.key]);
                        return value === void 0 ? null : /* @__PURE__ */ jsx("circle", { cx: xScale(activePoint.x), cy: yScale(value), r: "3.25", fill: "var(--bg-card)", stroke: color, strokeWidth: "2", vectorEffect: "non-scaling-stroke" });
                      })() : null
                    ] }, definition.key);
                  }),
                  activePoint ? /* @__PURE__ */ jsx("line", { x1: xScale(activePoint.x), x2: xScale(activePoint.x), y1: MARGIN.top, y2: height - MARGIN.bottom, stroke: "var(--text-tertiary)", strokeOpacity: "0.65", strokeDasharray: "3 4", vectorEffect: "non-scaling-stroke" }) : null
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsx("div", { role: "status", className: "flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground", children: noDataText }),
          activePoint && hasPlottableValues ? /* @__PURE__ */ jsxs(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute top-1 z-10 max-h-40 overflow-auto rounded-lg border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm",
              style: { left: tooltipLeft, maxWidth: tooltipMaxWidth, transform: "translateX(-50%)" },
              children: [
                /* @__PURE__ */ jsx("p", { className: "mb-1 whitespace-nowrap font-mono text-[10px] text-muted-foreground", children: xFormatter(activePoint.x) }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1", children: definitions.map((definition) => {
                  const value = validValue(activePoint.values[definition.key]);
                  const color = definition.color ?? TONE_COLOR[definition.tone ?? "accent"];
                  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-baseline justify-between gap-4 text-[11px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", style: { color }, children: definition.label }),
                    /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono tabular-nums text-foreground", children: value === void 0 ? missingValueLabel : yFormatter(value) })
                  ] }, definition.key);
                }) })
              ]
            }
          ) : null
        ]
      }
    ),
    readoutPoint ? /* @__PURE__ */ jsxs("div", { className: "mt-2 flex min-h-8 flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md bg-muted/40 px-2.5 py-2 text-[11px]", "aria-live": "off", "data-yunui": "time-series-readout", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-muted-foreground", children: xFormatter(readoutPoint.x) }),
      definitions.map((definition) => {
        const value = validValue(readoutPoint.values[definition.key]);
        const visible = !hiddenKeys.has(definition.key);
        return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-baseline gap-1", !visible && "opacity-50"), children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: definition.label }),
          /* @__PURE__ */ jsx("span", { className: "font-mono tabular-nums text-foreground", children: value === void 0 ? missingValueLabel : yFormatter(value) })
        ] }, definition.key);
      })
    ] }) : null,
    /* @__PURE__ */ jsxs("figcaption", { className: "sr-only", children: [
      ariaLabel,
      ". ",
      keyboardHint
    ] }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", "data-yunui": "time-series-keyboard-announcement", "aria-live": keyboardAnnouncement ? "polite" : "off", "aria-atomic": "true", children: keyboardAnnouncement })
  ] });
}
var TONE_COLOR2 = {
  accent: "var(--accent-solid-strong)",
  success: "var(--success-solid-strong)",
  warning: "var(--warning-solid-strong)",
  error: "var(--danger-solid-strong)",
  info: "var(--info-solid-strong)",
  neutral: "var(--neutral-solid-strong)"
};
var TONE_TEXT = {
  accent: "var(--accent-on-solid-strong)",
  success: "var(--success-on-solid-strong)",
  warning: "var(--warning-on-solid-strong)",
  error: "var(--danger-on-solid-strong)",
  info: "var(--info-on-solid-strong)",
  neutral: "var(--neutral-on-solid-strong)"
};
var valueText = (value, formatValue) => formatValue ? formatValue(value) : String(value);
function BarChart({
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  height = 240,
  onSelect,
  className
}) {
  const values = data.map(
    (datum) => typeof datum.value === "number" && Number.isFinite(datum.value) && datum.value >= 0 ? datum.value : null
  );
  const max = Math.max(0, ...values.filter((value) => value !== null));
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { role: "img", "aria-label": ariaLabel, className: cn("flex items-center justify-center text-sm text-muted-foreground", className), style: { height }, children: emptyLabel });
  }
  return /* @__PURE__ */ jsx("div", { role: "group", "aria-label": ariaLabel, className: cn("w-full", className), children: /* @__PURE__ */ jsxs("div", { className: "relative min-w-0 overflow-x-auto border-b border-border/60 pb-2", style: { height }, children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute left-1 top-1 text-[10px] tabular-nums text-muted-foreground", children: valueText(max, formatValue) }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-8 left-1 text-[10px] tabular-nums text-muted-foreground", children: "0" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-8 left-7 top-8 border-l border-border/60" }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full min-w-0 items-end gap-3 px-2 pl-10 pt-5", children: data.map((datum, index) => {
      const value = values[index];
      const unavailable = value === null;
      const percent = value === null ? 0 : max > 0 ? value / max * 100 : 0;
      const color = datum.color ?? TONE_COLOR2[datum.tone ?? "accent"];
      const text = unavailable ? unavailableLabel : valueText(value, formatValue);
      const label = `${datum.label}: ${text}`;
      return /* @__PURE__ */ jsxs("div", { className: "group flex h-full min-w-14 flex-1 flex-col items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "max-w-28 truncate text-center text-xs tabular-nums text-muted-foreground", children: text }),
        /* @__PURE__ */ jsx("div", { className: "flex h-full w-full min-h-0 items-end justify-center", children: /* @__PURE__ */ jsx(
          "div",
          {
            role: onSelect ? "button" : "img",
            "aria-label": label,
            "aria-disabled": onSelect ? unavailable || void 0 : void 0,
            tabIndex: 0,
            onClick: (event) => {
              if (unavailable) return;
              event.currentTarget.focus({ preventScroll: true });
              onSelect?.(datum);
            },
            onKeyDown: (event) => {
              if (onSelect && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                if (!unavailable) onSelect(datum);
              }
            },
            className: cn(
              "relative flex w-full max-w-12 justify-center rounded-t-md outline-none transition-[height,opacity] focus-visible:ring-2 focus-visible:ring-accent-solid-strong focus-visible:ring-offset-2",
              unavailable ? "min-h-1 border border-dashed border-border bg-muted/50" : value === 0 ? "h-px" : "",
              onSelect && !unavailable && "cursor-pointer hover:opacity-80",
              onSelect && unavailable && "cursor-not-allowed"
            ),
            style: unavailable ? { height: "5%" } : { height: value === 0 ? "1px" : `${Math.max(percent, 2)}%`, backgroundColor: color },
            title: label
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "max-w-28 truncate text-center text-xs text-foreground", children: datum.label })
      ] }, `${datum.id}:${index}`);
    }) })
  ] }) });
}
function DonutChart({
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  center,
  size = 208,
  onSelect,
  className
}) {
  const values = data.map(
    (datum) => typeof datum.value === "number" && Number.isFinite(datum.value) && datum.value >= 0 ? datum.value : null
  );
  const total = values.reduce((sum, value) => sum + (value ?? 0), 0);
  const hasValidValues = values.some((value) => value !== null);
  let cursor = 0;
  const stops = data.flatMap((datum, index) => {
    const value = values[index];
    if (value === null || value <= 0 || total <= 0) return [];
    const start = cursor / total * 100;
    cursor += value;
    const end = cursor / total * 100;
    return [`${datum.color ?? TONE_COLOR2[datum.tone ?? "accent"]} ${start}% ${end}%`];
  });
  const ring = total > 0 ? `conic-gradient(${stops.join(", ")})` : "conic-gradient(var(--border) 0% 100%)";
  return /* @__PURE__ */ jsxs("figure", { role: "group", "aria-label": ariaLabel, className: cn("flex min-w-0 flex-wrap items-center justify-center gap-6", className), children: [
    /* @__PURE__ */ jsx("div", { className: "relative shrink-0 rounded-full", style: { width: `min(${size}px, 100%)`, aspectRatio: "1 / 1", background: ring }, "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background px-2 text-center text-sm font-medium tabular-nums", children: center ?? (hasValidValues ? valueText(total, formatValue) : emptyLabel) }) }),
    /* @__PURE__ */ jsx("ul", { className: "m-0 grid min-w-44 flex-1 list-none gap-2 p-0", children: data.length === 0 ? /* @__PURE__ */ jsx("li", { className: "text-sm text-muted-foreground", children: emptyLabel }) : data.map((datum, index) => {
      const value = values[index];
      const available = value !== null;
      const percent = available && total > 0 ? value / total * 100 : null;
      const content = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1 size-2.5 shrink-0 rounded-sm", style: { backgroundColor: available ? datum.color ?? TONE_COLOR2[datum.tone ?? "accent"] : "var(--border)" }, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: datum.label }),
        /* @__PURE__ */ jsx("span", { className: "shrink-0 text-muted-foreground tabular-nums", children: available ? valueText(value, formatValue) : unavailableLabel }),
        /* @__PURE__ */ jsx("span", { className: "w-12 shrink-0 text-right text-muted-foreground tabular-nums", children: percent === null ? "\u2014" : `${percent.toFixed(1)}%` })
      ] });
      return /* @__PURE__ */ jsx("li", { children: onSelect ? /* @__PURE__ */ jsx("button", { type: "button", disabled: !available, className: "flex w-full items-start gap-2 rounded-md px-2 py-1 text-left text-sm outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-accent-solid-strong disabled:cursor-not-allowed disabled:opacity-60", onClick: (event) => {
        event.currentTarget.focus({ preventScroll: true });
        onSelect(datum);
      }, children: content }) : /* @__PURE__ */ jsx("div", { className: "flex items-start gap-2 px-2 py-1 text-sm", children: content }) }, `${datum.id}:${index}`);
    }) })
  ] });
}
function Heatmap({
  rows,
  columns,
  data,
  ariaLabel,
  formatValue,
  emptyLabel = "No data",
  unavailableLabel = "Unavailable",
  tone = "accent",
  onSelect,
  className
}) {
  const [active, setActive] = useState({ row: 0, column: 0 });
  const [hovered, setHovered] = useState(null);
  const refs = useRef([]);
  const color = TONE_COLOR2[tone];
  const values = useMemo(() => rows.flatMap((_, rowIndex) => columns.map((_2, columnIndex) => {
    const value = data[rowIndex]?.[columnIndex];
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  })), [rows, columns, data]);
  const maxMagnitude = Math.max(0, ...values.filter((value) => value !== null).map(Math.abs));
  const hasCells = rows.length > 0 && columns.length > 0;
  const rowCount = rows.length;
  const columnCount = columns.length;
  const readout = hovered ?? active;
  const activeRow = Math.min(active.row, Math.max(rowCount - 1, 0));
  const activeColumn = Math.min(active.column, Math.max(columnCount - 1, 0));
  useEffect(() => {
    setActive({ row: 0, column: 0 });
    setHovered(null);
    refs.current = [];
  }, [rowCount, columnCount]);
  const focusCell = (row, column) => {
    const next = { row: Math.max(0, Math.min(rowCount - 1, row)), column: Math.max(0, Math.min(columnCount - 1, column)) };
    setActive(next);
    refs.current[next.row * columnCount + next.column]?.focus();
  };
  const moveFocus = (event, row, column) => {
    let nextRow = row;
    let nextColumn = column;
    if (event.key === "ArrowUp") nextRow--;
    else if (event.key === "ArrowDown") nextRow++;
    else if (event.key === "ArrowLeft") nextColumn--;
    else if (event.key === "ArrowRight") nextColumn++;
    else if (event.key === "Home") nextColumn = 0;
    else if (event.key === "End") nextColumn = columnCount - 1;
    else return;
    event.preventDefault();
    focusCell(nextRow, nextColumn);
  };
  if (!hasCells) return /* @__PURE__ */ jsx("div", { role: "img", "aria-label": ariaLabel, className: cn("p-4 text-sm text-muted-foreground", className), children: emptyLabel });
  return /* @__PURE__ */ jsxs("div", { className: cn("min-w-0", className), children: [
    /* @__PURE__ */ jsxs("div", { role: "grid", "aria-label": ariaLabel, className: "max-w-full overflow-x-auto rounded-md border border-border/60", children: [
      /* @__PURE__ */ jsxs("div", { role: "row", className: "grid w-max min-w-full border-b border-border/60", style: { gridTemplateColumns: `minmax(7rem,auto) repeat(${columnCount}, minmax(3.25rem, 1fr))` }, children: [
        /* @__PURE__ */ jsx("span", { role: "columnheader", className: "sticky left-0 z-10 bg-background p-2 text-xs font-medium text-muted-foreground" }),
        columns.map((column, index) => /* @__PURE__ */ jsx("span", { role: "columnheader", className: "p-2 text-center text-xs font-medium text-muted-foreground", children: column }, `${column}:${index}`))
      ] }),
      rows.map((row, rowIndex) => /* @__PURE__ */ jsxs("div", { role: "row", className: "grid w-max min-w-full border-b border-border/40 last:border-0", style: { gridTemplateColumns: `minmax(7rem,auto) repeat(${columnCount}, minmax(3.25rem, 1fr))` }, children: [
        /* @__PURE__ */ jsx("span", { role: "rowheader", className: "sticky left-0 z-10 flex items-center bg-background px-2 py-1 text-xs font-medium", children: row }),
        columns.map((column, columnIndex) => {
          const index = rowIndex * columnCount + columnIndex;
          const value = values[index];
          const unavailable = value === null;
          const label = `${row}, ${column}: ${unavailable ? unavailableLabel : valueText(value, formatValue)}`;
          const opacity = unavailable || maxMagnitude === 0 ? 0 : Math.max(0.12, Math.abs(value) / maxMagnitude);
          return /* @__PURE__ */ jsx("div", { className: "group relative p-1", children: /* @__PURE__ */ jsx(
            "button",
            {
              ref: (node) => {
                refs.current[index] = node;
              },
              type: "button",
              role: "gridcell",
              "aria-label": label,
              tabIndex: activeRow === rowIndex && activeColumn === columnIndex ? 0 : -1,
              onFocus: () => setActive({ row: rowIndex, column: columnIndex }),
              onMouseEnter: () => setHovered({ row: rowIndex, column: columnIndex }),
              onMouseLeave: () => setHovered(null),
              onClick: (event) => {
                event.currentTarget.focus({ preventScroll: true });
                setActive({ row: rowIndex, column: columnIndex });
                onSelect?.(rowIndex, columnIndex);
              },
              onKeyDown: (event) => moveFocus(event, rowIndex, columnIndex),
              className: cn("relative flex h-9 w-full min-w-12 items-center justify-center rounded-sm border border-border/50 text-xs tabular-nums outline-none focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-accent-solid-strong", unavailable ? "border-dashed bg-muted/50 text-muted-foreground" : "hover:border-foreground/60"),
              style: unavailable ? void 0 : { backgroundColor: `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`, color: opacity >= 0.55 ? TONE_TEXT[tone] : "var(--foreground)" },
              title: label,
              children: /* @__PURE__ */ jsx("span", { className: "max-w-full truncate px-1", children: unavailable ? unavailableLabel : valueText(value, formatValue) })
            }
          ) }, `${rowIndex}:${columnIndex}`);
        })
      ] }, `${row}:${rowIndex}`))
    ] }),
    (() => {
      const row = rows[readout.row];
      const column = columns[readout.column];
      const value = data[readout.row]?.[readout.column];
      if (row === void 0 || column === void 0) return null;
      const available = typeof value === "number" && Number.isFinite(value);
      return /* @__PURE__ */ jsxs("p", { "aria-live": "polite", className: "mt-2 break-words text-xs text-muted-foreground", children: [
        row,
        " \xB7 ",
        column,
        ": ",
        available ? valueText(value, formatValue) : unavailableLabel
      ] });
    })()
  ] });
}
var defaultClassNames = {
  toast: "bg-card border border-border rounded-xl shadow-lg p-4",
  title: "text-sm font-medium",
  description: "text-xs text-muted-foreground",
  actionButton: "bg-foreground text-background text-xs px-3 py-1.5 rounded-lg",
  cancelButton: "text-muted-foreground text-xs px-3 py-1.5 rounded-lg hover:bg-muted"
};
function Toaster({
  position = "bottom-right",
  visibleToasts = 1,
  expand = true,
  toastOptions,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      ...props,
      position,
      visibleToasts,
      expand,
      toastOptions: {
        ...toastOptions,
        classNames: {
          ...defaultClassNames,
          ...toastOptions?.classNames
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
function CommandPalette({
  open,
  onClose,
  query,
  onQueryChange,
  items = [],
  loading = false,
  empty,
  initial,
  footer,
  labels,
  className
}) {
  const { Link } = useYunUI();
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const listId = useId();
  useEffect(() => setMounted(true), []);
  useEffect(() => setCursor(0), [items]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const select = useCallback(
    (item) => {
      if (!item) return;
      item.onSelect?.();
      onClose();
    },
    [onClose]
  );
  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (items.length === 0) return;
      setCursor((c) => {
        const next = event.key === "ArrowDown" ? c + 1 : c - 1;
        const wrapped = (next + items.length) % items.length;
        listRef.current?.querySelectorAll("[data-command-item]")[wrapped]?.scrollIntoView({ block: "nearest" });
        return wrapped;
      });
      return;
    }
    if (event.key === "Enter") {
      const item = items[cursor];
      if (item?.href) {
        listRef.current?.querySelectorAll("[data-command-item]")[cursor]?.click();
        return;
      }
      event.preventDefault();
      select(item);
    }
  };
  const grouped = useMemo(() => {
    const out = [];
    for (const item of items) {
      const last = out[out.length - 1];
      if (last && last.group === item.group) last.items.push(item);
      else out.push({ group: item.group, items: [item] });
    }
    return out;
  }, [items]);
  if (!open || !mounted) return null;
  let index = -1;
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": labels?.title ?? "Search",
        className: "fixed inset-0 z-100 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm",
        onMouseDown: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            onKeyDown,
            className: cn(
              "w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-lg shadow-black/5 backdrop-blur-2xl",
              className
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 border-b border-border px-4", children: [
                /* @__PURE__ */ jsx(Search, { "aria-hidden": true, className: "h-4 w-4 shrink-0 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: inputRef,
                    value: query,
                    onChange: (e) => onQueryChange(e.target.value),
                    placeholder: labels?.placeholder ?? "Search\u2026",
                    className: "h-12 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground",
                    autoComplete: "off",
                    spellCheck: false,
                    role: "combobox",
                    "aria-expanded": items.length > 0,
                    "aria-controls": listId,
                    "aria-activedescendant": items.length ? `${listId}-${cursor}` : void 0
                  }
                ),
                loading && /* @__PURE__ */ jsx(Spinner, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    "aria-label": labels?.close ?? "Close",
                    className: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: listRef,
                  id: listId,
                  role: "listbox",
                  "aria-label": labels?.title ?? "Search",
                  className: "max-h-[55vh] overflow-y-auto p-1.5",
                  tabIndex: -1,
                  children: loading && items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "\u2026" }) : items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: query ? empty : initial }) : grouped.map((section, s) => /* @__PURE__ */ jsxs("div", { children: [
                    section.group && /* @__PURE__ */ jsx("div", { className: "px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase", children: section.group }),
                    section.items.map((item) => {
                      index += 1;
                      const active = index === cursor;
                      const myIndex = index;
                      const rowClass = cn(
                        "flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition-colors outline-none",
                        active ? "bg-foreground/5" : "hover:bg-foreground/5"
                      );
                      const body = /* @__PURE__ */ jsxs(Fragment, { children: [
                        item.icon && /* @__PURE__ */ jsx("span", { className: "mt-0.5 shrink-0 text-muted-foreground", children: item.icon }),
                        /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsx("span", { className: "block truncate text-sm", children: item.title }),
                          item.description && /* @__PURE__ */ jsx("span", { className: "text-caption block truncate", children: item.description })
                        ] })
                      ] });
                      const shared = {
                        id: `${listId}-${myIndex}`,
                        role: "option",
                        "aria-selected": active,
                        "data-command-item": true,
                        onMouseEnter: () => setCursor(myIndex),
                        className: rowClass
                      };
                      return item.href ? /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: item.href,
                          ...shared,
                          onClick: () => {
                            item.onSelect?.();
                            onClose();
                          },
                          children: body
                        },
                        item.id
                      ) : /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          ...shared,
                          onClick: () => select(item),
                          children: body
                        },
                        item.id
                      );
                    })
                  ] }, section.group ?? s))
                }
              ),
              footer != null && /* @__PURE__ */ jsx("div", { className: "text-caption flex items-center justify-between gap-3 border-t border-border px-4 py-2.5", children: footer })
            ]
          }
        )
      }
    ),
    document.body
  );
}
function useCommandPaletteShortcut(onOpen) {
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpen]);
}

export { AnimatedNumber, AreaChart, BarChart, BentoCard, BentoGrid, Collapsible, CollapsibleContent2 as CollapsibleContent, CollapsibleTrigger2 as CollapsibleTrigger, CommandPalette, CustomSelect, DonutChart, FileDropzone, Gauge, Heatmap, Marquee, NavTabs, Popover, PopoverAnchor, PopoverClose2 as PopoverClose, PopoverContent, PopoverTrigger, ScrollArea, ScrollBar, SegmentedBar, SegmentedSelect, ShinyButton, Sparkline, Switch, TimeSeriesChart, Toaster, YUNUI_PALETTES, YUNUI_THEME_PRESETS, applyTheme, readTheme, toast, useCommandPaletteShortcut, useYunUITheme };
//# sourceMappingURL=chunk-JRBTDW5P.js.map
//# sourceMappingURL=chunk-JRBTDW5P.js.map