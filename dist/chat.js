"use client";
import { cn } from './chunk-VSS7ASN2.js';
import { Sparkles, Bot, User, Square, ArrowUp } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useRef, useCallback, useEffect } from 'react';

var roleDefaults = {
  user: {
    label: "You",
    icon: User,
    wrap: "bg-primary",
    icn: "text-primary-foreground"
  },
  assistant: {
    label: "Assistant",
    icon: Bot,
    wrap: "bg-muted border border-border",
    icn: "text-muted-foreground"
  },
  system: {
    label: "System",
    icon: Sparkles,
    wrap: "bg-muted border border-border",
    icn: "text-muted-foreground"
  }
};
function ChatMessage({
  role,
  name,
  avatar,
  timestamp,
  badges,
  actions,
  footer,
  className,
  children
}) {
  const cfg = roleDefaults[role] ?? roleDefaults.assistant;
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsx("div", { className: cn("group py-6", className), children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "shrink-0", children: avatar ?? /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          cfg.wrap
        ),
        children: /* @__PURE__ */ jsx(Icon, { className: cn("w-4 h-4", cfg.icn) })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: name ?? cfg.label }),
          badges && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-xs min-w-0", children: badges })
        ] }),
        timestamp && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: timestamp })
      ] }),
      children && /* @__PURE__ */ jsx("div", { className: "min-w-0", children }),
      footer,
      actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity pt-1", children: actions })
    ] })
  ] }) });
}
function ChatMessageList({
  children,
  empty,
  autoScroll = true,
  stickThreshold = 120,
  className
}) {
  const scrollRef = useRef(null);
  const endRef = useRef(null);
  const stickRef = useRef(true);
  const atBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= stickThreshold;
  }, [stickThreshold]);
  const handleScroll = useCallback(() => {
    stickRef.current = atBottom();
  }, [atBottom]);
  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    const scrollToEnd = () => {
      if (stickRef.current) endRef.current?.scrollIntoView({ block: "end" });
    };
    scrollToEnd();
    const observer = new ResizeObserver(scrollToEnd);
    if (el) observer.observe(el);
    const inner = el.firstElementChild;
    if (inner) observer.observe(inner);
    return () => observer.disconnect();
  }, [autoScroll, children]);
  const hasChildren = React.Children.count(children) > 0;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: scrollRef,
      "data-scroll-container": "true",
      onScroll: handleScroll,
      className: cn("relative flex-1 overflow-y-auto", className),
      children: hasChildren ? /* @__PURE__ */ jsxs("div", { children: [
        children,
        /* @__PURE__ */ jsx("div", { ref: endRef })
      ] }) : empty && /* @__PURE__ */ jsx("div", { className: "h-full flex items-center justify-center", children: empty })
    }
  );
}
function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  loading = false,
  disabled = false,
  placeholder = "Send a message\u2026",
  attachments,
  toolbar,
  sendDisabled = false,
  allowSendEmpty = false,
  maxRows = 8,
  className
}) {
  const textareaRef = useRef(null);
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const max = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [maxRows]);
  useEffect(() => {
    resize();
  }, [value, resize]);
  const canSend = !disabled && !sendDisabled && (allowSendEmpty || value.trim().length > 0);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (loading) return;
      if (canSend) onSend();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "rounded-2xl border border-border bg-background shadow-sm transition-colors",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
        disabled && "opacity-60",
        className
      ),
      children: [
        attachments && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 px-3 pt-3", children: attachments }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 p-2 pl-3", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: textareaRef,
              value,
              onChange: (e) => onChange(e.target.value),
              onKeyDown: handleKeyDown,
              rows: 1,
              disabled,
              placeholder,
              className: cn(
                // 16px on mobile avoids iOS Safari's focus-zoom; compact on desktop.
                "flex-1 resize-none bg-transparent py-2 text-base leading-5 md:text-sm",
                "placeholder:text-muted-foreground focus:outline-none",
                "max-h-[40vh]"
              )
            }
          ),
          loading ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onStop,
              "aria-label": "Stop",
              className: "shrink-0 mb-0.5 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity",
              children: /* @__PURE__ */ jsx(Square, { className: "w-3.5 h-3.5 fill-current" })
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => canSend && onSend(),
              disabled: !canSend,
              "aria-label": "Send",
              className: cn(
                "shrink-0 mb-0.5 h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                canSend ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
              ),
              children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-4 h-4" })
            }
          )
        ] }),
        toolbar && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 px-3 pb-2 -mt-1", children: toolbar })
      ]
    }
  );
}
function ChatHeader({
  left,
  status,
  actions,
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "h-14 flex items-center justify-between gap-3 px-4 border-b border-border",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      ),
      children: children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 min-w-0", children: left }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
          status,
          actions
        ] })
      ] })
    }
  );
}

export { ChatComposer, ChatHeader, ChatMessage, ChatMessageList };
//# sourceMappingURL=chat.js.map
//# sourceMappingURL=chat.js.map