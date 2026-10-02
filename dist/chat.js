"use client";
import { mergeLabels } from './chunk-GRUB2GXF.js';
import { Avatar, AvatarFallback, cn, useAnchoredPosition, Badge } from './chunk-ALP6SDRA.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import { Sparkles, User, X, AtSign, Command, ChevronDown, Square, ArrowUp, Check, FileText, Loader2, AlertCircle } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useRef, useCallback, useEffect, useId, useState, useLayoutEffect, useMemo } from 'react';

var roleDefaults = {
  user: {
    label: "You",
    icon: User,
    wrap: "bg-muted",
    icn: "text-muted-foreground"
  },
  assistant: {
    label: "Assistant",
    icon: Sparkles,
    wrap: "bg-transparent",
    icn: "text-primary"
  },
  system: {
    label: "System",
    icon: Sparkles,
    wrap: "bg-muted",
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
  children,
  density = "comfortable"
}) {
  const cfg = roleDefaults[role] ?? roleDefaults.assistant;
  const Icon = cfg.icon;
  const isUser = role === "user";
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-yunui": "chat-message",
      "data-role": role,
      className: cn(
        "group min-w-0",
        isUser ? density === "compact" ? "flex justify-end py-1.5" : "flex justify-end py-2.5" : density === "compact" ? "mx-auto flex w-full max-w-[820px] gap-2.5 py-3" : "mx-auto flex w-full max-w-[820px] gap-3 py-5",
        className
      ),
      children: isUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 max-w-[560px] flex-col items-end gap-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 max-w-full rounded-xl bg-muted px-3.5 py-2 text-[13px] leading-[1.5] text-foreground", children: [
            (name != null || badges || timestamp != null) && /* @__PURE__ */ jsxs("div", { className: "mb-1 flex min-w-0 items-center justify-end gap-2 text-[10.5px] leading-4 text-muted-foreground", children: [
              name != null && /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: name }),
              badges && /* @__PURE__ */ jsx("span", { className: "flex min-w-0 items-center gap-1", children: badges }),
              timestamp != null && /* @__PURE__ */ jsx("span", { className: "shrink-0 whitespace-nowrap", children: timestamp })
            ] }),
            children != null && /* @__PURE__ */ jsx("div", { className: "min-w-0 [overflow-wrap:anywhere]", children }),
            footer
          ] }),
          actions && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-end gap-1.5 text-xs text-muted-foreground", children: actions })
        ] }),
        avatar != null && /* @__PURE__ */ jsx("div", { className: "mt-1 shrink-0", children: avatar })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "mt-0.5 shrink-0", children: avatar ?? (role === "assistant" ? /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-[9px] bg-foreground text-background shadow-sm", children: /* @__PURE__ */ jsx(Icon, { "aria-hidden": true, className: "h-3.5 w-3.5 text-background" }) }) : /* @__PURE__ */ jsx(Avatar, { className: "h-7 w-7", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "border border-border/70 bg-muted/70", children: /* @__PURE__ */ jsx(Icon, { "aria-hidden": true, className: cn("h-3.5 w-3.5", cfg.icn) }) }) })) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-2 text-sm leading-relaxed text-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-6 items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold leading-6 text-foreground", children: name ?? cfg.label }),
              badges && /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-wrap items-center gap-1 text-xs", children: badges })
            ] }),
            timestamp != null && /* @__PURE__ */ jsx("span", { className: "shrink-0 whitespace-nowrap text-[11px] leading-6 text-muted-foreground", children: timestamp })
          ] }),
          children != null && /* @__PURE__ */ jsx("div", { className: "min-w-0 [overflow-wrap:anywhere]", children }),
          footer,
          actions && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground", children: actions })
        ] })
      ] })
    }
  );
}
function ChatMessageList({
  children,
  empty,
  autoScroll = true,
  stickThreshold = 120,
  className
}) {
  const scrollRef = useRef(null);
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
      if (stickRef.current && el) el.scrollTop = el.scrollHeight;
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
      children: hasChildren ? /* @__PURE__ */ jsx("div", { children }) : empty && /* @__PURE__ */ jsx("div", { className: "h-full flex items-center justify-center", children: empty })
    }
  );
}
function safeId(value) {
  const points = Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0");
  return `id-${points.join("-") || "empty"}`;
}
function parseToken(value, caret) {
  const match = /(^|[\s(])([@/])([^\s,;!?()[\]{}]*)$/.exec(value.slice(0, caret));
  if (!match) return null;
  return {
    kind: match[2] === "@" ? "sources" : "commands",
    start: match.index + match[1].length,
    query: match[3].toLowerCase()
  };
}
function tokenEnd(value, start, caret) {
  let end = caret;
  while (end < value.length && /[\p{L}\p{N}._-]/u.test(value[end])) end += 1;
  return Math.max(start + 1, end);
}
function matchingItems(items, query, kind) {
  const q = query.toLowerCase();
  return items.filter((item) => {
    const label = kind === "commands" ? item.label.replace(/^\/+/, "") : item.label;
    return !q || label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });
}
var DEFAULT_MENU_LABELS = {
  prompt: "Message prompt",
  sources: "Sources",
  commands: "Commands",
  model: "Select a model",
  noSources: "No sources available",
  noCommands: "No commands available",
  noModels: "No models available",
  noMatchingSources: "No matching sources",
  noMatchingCommands: "No matching commands",
  removeSource: (label) => `Remove ${label}`
};
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
  sourceItems,
  selectedSourceIds = [],
  onSourceToggle,
  commandItems,
  onCommandSelect,
  modelItems,
  selectedModelId,
  onModelChange,
  sendDisabled = false,
  allowSendEmpty = false,
  maxRows = 8,
  labels,
  sendLabel,
  stopLabel,
  className
}) {
  const textareaRef = useRef(null);
  const rootRef = useRef(null);
  const modelTriggerRef = useRef(null);
  const modelMenuRef = useRef(null);
  const modelOptionRefs = useRef({});
  const pendingSelectionRef = useRef(null);
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sourceListId = `${idBase}-source-listbox`;
  const commandListId = `${idBase}-command-listbox`;
  const modelListId = `${idBase}-model-listbox`;
  const [explicitMenu, setExplicitMenu] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selection, setSelection] = useState(() => ({ start: value.length, end: value.length }));
  useLayoutEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending) return;
    if (value === pending.value) {
      textareaRef.current?.setSelectionRange(pending.start, pending.end);
      pendingSelectionRef.current = null;
    } else if (value !== pending.previousValue) {
      pendingSelectionRef.current = null;
    }
  }, [value]);
  const token = parseToken(value, selection.start);
  const tokenMenu = dismissed ? null : token?.kind ?? null;
  const requestedMenu = explicitMenu ?? tokenMenu;
  const hasMenuData = requestedMenu === "sources" ? sourceItems !== void 0 : requestedMenu === "commands" ? commandItems !== void 0 : requestedMenu === "models" ? modelItems !== void 0 : false;
  const menu = disabled || !hasMenuData ? null : requestedMenu;
  const query = menu && token && token.kind === menu && !explicitMenu ? token.query : "";
  const sourceItemsResolved = sourceItems ?? [];
  const commandItemsResolved = commandItems ?? [];
  const modelItemsResolved = modelItems ?? [];
  const enabledModels = modelItemsResolved.filter((item) => !item.disabled && !!onModelChange && !disabled);
  const groupedModels = useMemo(() => {
    const groups = /* @__PURE__ */ new Map();
    for (const item of modelItemsResolved) {
      const key = item.group ?? "";
      const label = item.groupLabel ?? item.group ?? "";
      const group = groups.get(key) ?? { key, label, items: [] };
      group.items.push(item);
      groups.set(key, group);
    }
    return Array.from(groups.values());
  }, [modelItemsResolved]);
  const [activeModelId, setActiveModelId] = useState(null);
  const { shift: modelMenuShift, maxHeight: modelMenuMaxHeight, maxWidth: modelMenuMaxWidth, placement: modelMenuPlacement } = useAnchoredPosition(menu === "models", modelMenuRef, { gutter: 8, minHeight: 160, maxWidth: 256 });
  const menuLabels = {
    prompt: labels?.prompt ?? DEFAULT_MENU_LABELS.prompt,
    sources: labels?.sources ?? DEFAULT_MENU_LABELS.sources,
    commands: labels?.commands ?? DEFAULT_MENU_LABELS.commands,
    model: labels?.model ?? DEFAULT_MENU_LABELS.model,
    noSources: labels?.noSources ?? DEFAULT_MENU_LABELS.noSources,
    noCommands: labels?.noCommands ?? DEFAULT_MENU_LABELS.noCommands,
    noModels: labels?.noModels ?? DEFAULT_MENU_LABELS.noModels,
    noMatchingSources: labels?.noMatchingSources ?? DEFAULT_MENU_LABELS.noMatchingSources,
    noMatchingCommands: labels?.noMatchingCommands ?? DEFAULT_MENU_LABELS.noMatchingCommands,
    removeSource: labels?.removeSource ?? DEFAULT_MENU_LABELS.removeSource
  };
  const menuItems = useMemo(() => {
    if (menu === "sources") return matchingItems(sourceItemsResolved, query, "sources");
    if (menu === "commands") return matchingItems(commandItemsResolved, query, "commands");
    return [];
  }, [menu, query, sourceItemsResolved, commandItemsResolved]);
  const selectableItems = useMemo(() => menuItems.filter((item) => {
    if (item.disabled) return false;
    if (menu === "sources") return !!onSourceToggle;
    if (menu === "commands") {
      const command = item;
      return !!onCommandSelect || command.insertText !== void 0;
    }
    return false;
  }), [menuItems, menu, onSourceToggle, onCommandSelect]);
  const activeItem = selectableItems[activeIndex];
  const textListId = menu === "sources" ? sourceListId : commandListId;
  const activeTextOptionId = (menu === "sources" || menu === "commands") && activeItem ? `${textListId}-option-${safeId(activeItem.id)}` : void 0;
  const selectedModels = modelItemsResolved.find((item) => item.id === selectedModelId);
  const canSend = !disabled && !sendDisabled && (allowSendEmpty || value.trim().length > 0);
  const sendButtonLabel = labels?.send ?? sendLabel ?? "Send";
  const stopButtonLabel = labels?.stop ?? stopLabel ?? "Stop";
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
  useEffect(() => {
    setSelection((current) => ({
      start: Math.min(current.start, value.length),
      end: Math.min(current.end, value.length)
    }));
  }, [value]);
  useEffect(() => {
    setActiveIndex(-1);
  }, [menu, query]);
  useEffect(() => {
    if (menu !== "models") setActiveModelId(null);
  }, [menu]);
  useEffect(() => {
    if (!disabled) return;
    setExplicitMenu(null);
    setDismissed(true);
  }, [disabled]);
  useEffect(() => {
    if (!menu) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setExplicitMenu(null);
        setDismissed(true);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menu]);
  const insertAtToken = (kind, insertion, addSourceSpacing = kind === "sources") => {
    const activeToken = token && token.kind === kind ? token : null;
    const before = activeToken ? value.slice(0, activeToken.start) : value.slice(0, selection.start);
    const after = activeToken ? value.slice(tokenEnd(value, activeToken.start, selection.start)) : value.slice(selection.end);
    const separator = addSourceSpacing && !activeToken && before && !/\s$/.test(before) ? " " : "";
    const inserted = addSourceSpacing && insertion && !insertion.endsWith(" ") ? `${insertion} ` : insertion;
    const suffix = addSourceSpacing && inserted.endsWith(" ") && after.startsWith(" ") ? after.slice(1) : after;
    const nextValue = `${before}${separator}${inserted}${suffix}`;
    const caret = before.length + separator.length + inserted.length;
    setSelection({ start: caret, end: caret });
    pendingSelectionRef.current = { value: nextValue, previousValue: value, start: caret, end: caret };
    onChange(nextValue);
    if (nextValue === value) {
      textareaRef.current?.setSelectionRange(caret, caret);
      pendingSelectionRef.current = null;
    }
  };
  const chooseTextItem = (item) => {
    if (item.disabled) return;
    if (menu === "sources") {
      if (!onSourceToggle) return;
      const selected = selectedSourceIds.includes(item.id);
      onSourceToggle(item.id, !selected);
      insertAtToken("sources", `@${item.label}`);
    } else if (menu === "commands") {
      const command = item;
      if (onCommandSelect) onCommandSelect(command);
      if (command.insertText !== void 0) insertAtToken("commands", command.insertText, false);
      if (!onCommandSelect && command.insertText === void 0) return;
    }
    setExplicitMenu(null);
    setDismissed(true);
    setActiveIndex(-1);
    textareaRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    if (menu === "sources" || menu === "commands") {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && selectableItems.length) {
        e.preventDefault();
        setActiveIndex((current) => e.key === "ArrowDown" ? (current + 1) % selectableItems.length : current < 0 ? selectableItems.length - 1 : (current + selectableItems.length - 1) % selectableItems.length);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (activeItem) {
          chooseTextItem(activeItem);
          return;
        }
        if (selectableItems.length === 1) {
          chooseTextItem(selectableItems[0]);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setExplicitMenu(null);
        setDismissed(true);
        setActiveIndex(-1);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && canSend) onSend();
    }
  };
  const openMenu = (kind) => {
    if (menu === kind) {
      if (kind === "models") closeModelMenu();
      else {
        setExplicitMenu(null);
        setDismissed(true);
      }
      return;
    }
    const input = textareaRef.current;
    if (input) setSelection({ start: input.selectionStart, end: input.selectionEnd });
    setDismissed(false);
    setExplicitMenu(kind);
    setActiveIndex(-1);
    if (kind !== "models") requestAnimationFrame(() => textareaRef.current?.focus());
    else requestAnimationFrame(() => focusModelIndex(0));
  };
  const closeModelMenu = () => {
    setExplicitMenu(null);
    setDismissed(true);
    setActiveIndex(-1);
    requestAnimationFrame(() => modelTriggerRef.current?.focus());
  };
  const focusModelIndex = (index) => {
    const item = enabledModels[index];
    if (!item) return;
    setActiveModelId(item.id);
    requestAnimationFrame(() => modelOptionRefs.current[item.id]?.focus());
  };
  const moveModelFocus = (currentId, direction) => {
    if (!enabledModels.length) return;
    const currentIndex = enabledModels.findIndex((item) => item.id === currentId);
    const nextIndex = currentIndex < 0 ? direction === 1 ? 0 : enabledModels.length - 1 : (currentIndex + direction + enabledModels.length) % enabledModels.length;
    focusModelIndex(nextIndex);
  };
  const onModelTriggerKeyDown = (event) => {
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && menu !== "models") {
      event.preventDefault();
      openMenu("models");
      if (event.key === "ArrowUp") requestAnimationFrame(() => focusModelIndex(enabledModels.length - 1));
    } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && menu === "models") {
      event.preventDefault();
      moveModelFocus(activeModelId, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Escape" && menu === "models") {
      event.preventDefault();
      closeModelMenu();
    }
  };
  const onModelMenuKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModelMenu();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveModelFocus(activeModelId, event.key === "ArrowDown" ? 1 : -1);
    }
  };
  const renderModelOption = (item) => {
    const unavailable = item.disabled || !onModelChange;
    const optionId = `${modelListId}-option-${safeId(item.id)}`;
    const descriptionId = item.description != null ? `${modelListId}-description-${safeId(item.id)}` : void 0;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: (element) => {
          modelOptionRefs.current[item.id] = element;
        },
        id: optionId,
        type: "button",
        role: "option",
        "aria-label": item.label,
        "aria-describedby": descriptionId,
        tabIndex: unavailable ? -1 : activeModelId === item.id || activeModelId === null && item.id === selectedModelId ? 0 : -1,
        "aria-selected": item.id === selectedModelId,
        "aria-disabled": unavailable || void 0,
        disabled: unavailable || disabled,
        onFocus: () => setActiveModelId(item.id),
        onClick: () => {
          if (unavailable || disabled) return;
          onModelChange?.(item.id);
          closeModelMenu();
        },
        className: cn("relative z-10 flex min-h-8 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", item.id === selectedModelId && "bg-muted/70"),
        children: [
          item.icon,
          /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("span", { className: "block truncate", children: item.label }),
            item.description != null && /* @__PURE__ */ jsx("span", { id: descriptionId, className: "block truncate text-xs text-(--text-secondary)", children: item.description })
          ] }),
          item.id === selectedModelId && /* @__PURE__ */ jsx(Check, { size: 14 })
        ]
      },
      item.id
    );
  };
  return /* @__PURE__ */ jsxs("div", { "data-yunui": "chat-composer", "data-promptbar": true, ref: rootRef, className: cn("relative isolate flex w-full min-w-0 flex-col overflow-visible rounded-[22px] border border-border bg-card p-2.5 shadow-sm transition-colors focus-within:border-border-strong sm:p-3.5", disabled && "opacity-60", className), children: [
    (selectedSourceIds.length > 0 || attachments) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 px-0.5 pt-0.5", children: [
      selectedSourceIds.map((id) => {
        const item = sourceItemsResolved.find((source) => source.id === id);
        if (!item) return null;
        return /* @__PURE__ */ jsxs("span", { className: "inline-flex h-6.5 max-w-full items-center gap-1.5 rounded-md bg-muted px-1.5 py-1 text-[11.5px] text-muted-foreground", children: [
          item.icon,
          /* @__PURE__ */ jsx("span", { className: "max-w-48 truncate", children: item.label }),
          /* @__PURE__ */ jsx("button", { type: "button", disabled: disabled || !onSourceToggle, "aria-label": menuLabels.removeSource(item.label), onClick: () => onSourceToggle?.(id, false), className: "-my-1 flex size-5 items-center justify-center rounded-sm hover:bg-muted-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }, id);
      }),
      attachments
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-w-0 px-0.5 pt-1", children: /* @__PURE__ */ jsx(
      "textarea",
      {
        ref: textareaRef,
        value,
        onChange: (event) => {
          if (pendingSelectionRef.current && event.currentTarget.value !== pendingSelectionRef.current.value) {
            pendingSelectionRef.current = null;
          }
          setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd });
          onChange(event.target.value);
          setDismissed(false);
          setExplicitMenu(null);
        },
        onSelect: (event) => setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd }),
        onKeyDown: handleKeyDown,
        rows: 1,
        disabled,
        placeholder,
        "aria-label": menuLabels.prompt,
        "aria-autocomplete": menu === "sources" || menu === "commands" ? "list" : void 0,
        "aria-controls": menu === "sources" || menu === "commands" ? textListId : void 0,
        "aria-activedescendant": activeTextOptionId,
        className: cn("block min-h-[68px] w-full max-h-[40vh] resize-none bg-transparent px-0 py-1 text-base leading-5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none md:text-sm", disabled && "cursor-not-allowed")
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-0.5 pt-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-1", children: [
        toolbar,
        sourceItems !== void 0 && /* @__PURE__ */ jsxs("button", { type: "button", disabled, "aria-expanded": menu === "sources", "aria-label": menuLabels.sources, onClick: () => openMenu("sources"), className: cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "sources" && "bg-muted text-foreground"), children: [
          /* @__PURE__ */ jsx(AtSign, { size: 14 }),
          menuLabels.sources
        ] }),
        commandItems !== void 0 && /* @__PURE__ */ jsxs("button", { type: "button", disabled, "aria-expanded": menu === "commands", "aria-label": menuLabels.commands, onClick: () => openMenu("commands"), className: cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "commands" && "bg-muted text-foreground"), children: [
          /* @__PURE__ */ jsx(Command, { size: 14 }),
          menuLabels.commands
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
        modelItems !== void 0 && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("button", { ref: modelTriggerRef, "data-model-trigger": true, type: "button", disabled, "aria-expanded": menu === "models", "aria-controls": menu === "models" ? modelListId : void 0, "aria-haspopup": modelItems.length ? "listbox" : void 0, "aria-label": menuLabels.model, onClick: () => openMenu("models"), onKeyDown: onModelTriggerKeyDown, className: cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "models" && "bg-muted text-foreground"), children: [
            selectedModels?.label ?? menuLabels.model,
            /* @__PURE__ */ jsx(ChevronDown, { size: 12 })
          ] }),
          menu === "models" && /* @__PURE__ */ jsx("div", { ref: modelMenuRef, id: modelListId, role: modelItems.length ? "listbox" : "status", "aria-label": menuLabels.model, onKeyDown: onModelMenuKeyDown, onBlurCapture: (event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setExplicitMenu(null);
              setDismissed(true);
            }
          }, style: { marginLeft: modelMenuShift, maxHeight: Math.min(modelMenuMaxHeight ?? 288, 288), maxWidth: modelMenuMaxWidth }, className: cn("absolute left-0 z-50 w-64 max-w-[calc(100vw-1rem)] overflow-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg", modelMenuPlacement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"), children: modelItems.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs text-muted-foreground", children: menuLabels.noModels }) : groupedModels.map((group) => /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": group.label || menuLabels.model, children: [
            group.label && /* @__PURE__ */ jsx("div", { className: "px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: group.label }),
            group.items.map(renderModelOption)
          ] }, group.key || "ungrouped")) })
        ] }),
        loading ? /* @__PURE__ */ jsx("button", { type: "button", disabled: !onStop || disabled, onClick: onStop, "aria-label": stopButtonLabel, className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50", children: /* @__PURE__ */ jsx(Square, { className: "h-3.5 w-3.5 fill-current" }) }) : /* @__PURE__ */ jsx("button", { type: "button", onClick: () => canSend && onSend(), disabled: !canSend, "aria-label": sendButtonLabel, className: cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors", canSend ? "bg-foreground text-background hover:opacity-90" : "cursor-not-allowed bg-muted text-muted-foreground"), children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-4 w-4" }) })
      ] })
    ] }),
    (menu === "sources" || menu === "commands") && /* @__PURE__ */ jsx("div", { id: textListId, "data-yunui": menu === "sources" ? "chat-composer-source-menu" : "chat-composer-command-menu", role: menuItems.length ? "listbox" : "status", "aria-label": menu === "sources" ? menuLabels.sources : menuLabels.commands, className: "absolute bottom-full left-1 z-50 mb-2 max-h-72 w-[min(28rem,calc(100%-0.5rem))] overflow-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg", children: menuItems.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs text-(--text-secondary)", children: menu === "sources" ? query ? menuLabels.noMatchingSources : menuLabels.noSources : query ? menuLabels.noMatchingCommands : menuLabels.noCommands }) : menuItems.map((item) => {
      const selected = menu === "sources" && selectedSourceIds.includes(item.id);
      const selectable = !item.disabled && (menu === "sources" ? !!onSourceToggle : !!onCommandSelect || item.insertText !== void 0);
      const active = activeItem?.id === item.id;
      const descriptionId = item.description != null ? `${textListId}-description-${safeId(item.id)}` : void 0;
      return /* @__PURE__ */ jsxs("button", { id: `${textListId}-option-${safeId(item.id)}`, type: "button", role: "option", "aria-label": item.label, "aria-describedby": descriptionId, tabIndex: -1, "aria-selected": selected, "aria-disabled": !selectable || void 0, "data-active": active || void 0, disabled: !selectable || disabled, onClick: () => chooseTextItem(item), onMouseEnter: () => {
        const index = selectableItems.findIndex((entry) => entry.id === item.id);
        if (index >= 0) setActiveIndex(index);
      }, className: cn("relative z-10 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50", active && "bg-muted/70"), children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground", children: item.icon }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate font-medium", children: item.label }),
        item.description != null && /* @__PURE__ */ jsx("span", { id: descriptionId, className: "max-w-[45%] truncate text-xs text-muted-foreground", children: item.description }),
        selected && /* @__PURE__ */ jsx(Check, { size: 14, className: "shrink-0 text-primary" })
      ] }, item.id);
    }) })
  ] });
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
      "data-yunui": "chat-header",
      className: cn(
        "flex min-h-[54px] shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-background px-3 py-2.5 text-sm sm:h-[62px] sm:flex-nowrap sm:px-6 sm:py-0",
        className
      ),
      children: children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: left }),
        /* @__PURE__ */ jsx("div", { className: "flex min-w-0 items-center gap-2 sm:gap-3", children: status }),
        /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-1.5", children: actions })
      ] })
    }
  );
}
function compact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return `${n}`;
}
function GenerationStats({
  tokens,
  tokensPerSecond,
  latencyMs,
  labels,
  className
}) {
  const speed = tokensPerSecond ?? (tokens && latencyMs && latencyMs > 0 ? tokens / latencyMs * 1e3 : void 0);
  if (tokens == null && speed == null && latencyMs == null) return null;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-wrap items-center gap-1.5", className), children: [
    tokens != null && /* @__PURE__ */ jsxs(Badge, { children: [
      compact(tokens),
      " ",
      labels?.tokens ?? "tokens"
    ] }),
    speed != null && /* @__PURE__ */ jsxs(Badge, { children: [
      speed.toFixed(1),
      " ",
      labels?.speed ?? "tok/s"
    ] }),
    latencyMs != null && /* @__PURE__ */ jsxs(Badge, { children: [
      latencyMs,
      " ",
      labels?.latency ?? "ms"
    ] })
  ] });
}
function ChatAttachment({
  name,
  meta,
  icon,
  preview,
  status = "idle",
  progress,
  actions,
  className,
  ...props
}) {
  const boundedProgress = typeof progress === "number" && Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : void 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-muted/50 px-2 py-1.5 text-foreground",
        "transition-colors hover:bg-muted/70",
        // Was a bare `error` colour name with an alpha modifier, which emits
        // nothing: `error` is a CSS custom property, not a registered Tailwind
        // palette colour, so the tint was invisible. The `-soft` helpers are real.
        status === "error" && "border-error-soft bg-error-soft",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md text-muted-foreground", children: preview ?? icon ?? /* @__PURE__ */ jsx(FileText, { "aria-hidden": true, className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate text-[11.5px] font-medium leading-4 text-foreground", children: name }),
          meta != null ? /* @__PURE__ */ jsx("div", { className: cn("truncate text-[10.5px] leading-4 text-muted-foreground", status === "error" && "text-error"), children: meta }) : null,
          status === "loading" && boundedProgress !== void 0 ? /* @__PURE__ */ jsx(
            "div",
            {
              className: "mt-1.5 h-0.5 overflow-hidden rounded-full bg-border",
              role: "progressbar",
              "aria-label": typeof name === "string" ? name : void 0,
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": boundedProgress,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full rounded-full bg-primary transition-[width] duration-150",
                  style: { width: `${boundedProgress}%` }
                }
              )
            }
          ) : null
        ] }),
        status === "loading" ? /* @__PURE__ */ jsx(Loader2, { "aria-hidden": true, className: "h-4 w-4 shrink-0 animate-spin text-muted-foreground" }) : null,
        status === "error" ? /* @__PURE__ */ jsx(AlertCircle, { "aria-hidden": true, className: "h-4 w-4 shrink-0 text-error" }) : null,
        actions ? /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-1", children: actions }) : null
      ]
    }
  );
}
var DEFAULT_LABELS = {
  header: "Retrieved context",
  empty: "No retrieved context was supplied.",
  include: "Include",
  exclude: "Exclude",
  openSource: (source) => `Open ${source}`
};
var BADGE_TONE = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  destructive: "bg-error-soft text-error"
};
var SAFE_CHAT_BASE = "https://yunui.invalid";
function encodeChatId(value) {
  const points = Array.from(value, (character) => character.codePointAt(0).toString(16));
  return points.length ? points.join("-") : "empty";
}
function getSafeChatHref(value) {
  if (!value || /[\u0000-\u001f\u007f]/.test(value) || !value.trim()) return void 0;
  const href = value.trim();
  try {
    const parsed = new URL(href, SAFE_CHAT_BASE);
    if (!["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) return void 0;
    const external = (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.origin !== SAFE_CHAT_BASE;
    return { href, external };
  } catch {
    return void 0;
  }
}
function getSafeChatImage(value) {
  if (!value || /[\u0000-\u001f\u007f]/.test(value) || !value.trim()) return void 0;
  const image = value.trim();
  try {
    const parsed = new URL(image, SAFE_CHAT_BASE);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? image : void 0;
  } catch {
    return void 0;
  }
}
function ContextCards({
  chunks,
  labels,
  className,
  onSourceOpen,
  onSelectionChange,
  ...props
}) {
  const baseId = useId();
  const { Link } = useYunUI();
  const copy = mergeLabels(DEFAULT_LABELS, labels);
  const count = labels?.count ?? `${chunks.length} ${chunks.length === 1 ? "source" : "sources"}`;
  return /* @__PURE__ */ jsxs("div", { "data-yunui": "context-cards", className: cn("flex w-full max-w-[380px] flex-col gap-2", className), ...props, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-0.5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[13px] font-semibold text-foreground", children: copy.header }),
      /* @__PURE__ */ jsx("span", { className: "inline-flex min-h-5 items-center rounded-md bg-muted px-1.5 text-[11.5px] font-medium text-muted-foreground shadow-sm tabular-nums", children: count })
    ] }),
    chunks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-xl bg-muted/60 px-3 py-2 text-[12px] text-muted-foreground", children: copy.empty }) : chunks.map((chunk) => {
      const titleId = `${baseId}-chunk-${encodeChatId(chunk.id)}`;
      const safeHref = getSafeChatHref(chunk.href);
      const badgeTone = BADGE_TONE[chunk.badgeTone ?? "neutral"];
      const sourceContent = /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("span", { className: cn("inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-[12px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80"), children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: cn("inline-flex h-3.5 min-w-3.5 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] px-0.5 text-[7px] font-bold", badgeTone), children: chunk.badge }),
        /* @__PURE__ */ jsx("span", { className: "max-w-[220px] truncate", children: chunk.source }),
        /* @__PURE__ */ jsx("svg", { width: "9", height: "9", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M7 17L17 7M7 7h10v10" }) })
      ] }) });
      return /* @__PURE__ */ jsxs("article", { "aria-labelledby": titleId, "data-selected": chunk.selected ? "true" : void 0, className: cn("overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm", chunk.selected && "ring-1 ring-ring"), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-h-10 items-center gap-2.5 border-b border-border px-3 py-2", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "shrink-0 text-muted-foreground", children: /* @__PURE__ */ jsx("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M4 6h16M4 12h16M4 18h10" }) }) }),
          /* @__PURE__ */ jsx("span", { id: titleId, className: "min-w-0 truncate text-[13px] font-medium text-foreground", children: chunk.title }),
          chunk.chars != null ? /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 text-[12px] text-muted-foreground tabular-nums", children: chunk.chars }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-muted-foreground", children: chunk.body }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2 px-3 pb-3", children: [
          safeHref ? /* @__PURE__ */ jsx(Link, { href: safeHref.href, target: safeHref.external ? "_blank" : void 0, rel: safeHref.external ? "noopener noreferrer" : void 0, onClick: () => onSourceOpen?.(chunk), "aria-label": copy.openSource(chunk.source), className: "inline-flex min-w-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", children: sourceContent }) : onSourceOpen ? /* @__PURE__ */ jsx("button", { type: "button", "aria-label": copy.openSource(chunk.source), onClick: () => onSourceOpen(chunk), className: "inline-flex min-w-0 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", children: sourceContent }) : /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-0", children: sourceContent }),
          onSelectionChange ? /* @__PURE__ */ jsx("button", { type: "button", "aria-pressed": Boolean(chunk.selected), "aria-label": `${chunk.selected ? copy.exclude : copy.include} ${chunk.source}`, onClick: () => onSelectionChange(chunk.id, !chunk.selected), className: "ml-auto min-h-7 shrink-0 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: chunk.selected ? copy.exclude : copy.include }) : null
        ] })
      ] }, chunk.id);
    })
  ] });
}
var DEFAULT_LABELS2 = {
  sources: "sources",
  followUps: "Follow-ups",
  actions: "Answer actions",
  copyAnswer: "Copy answer",
  retryAnswer: "Retry answer",
  positiveFeedback: "Helpful",
  negativeFeedback: "Not helpful",
  streaming: "Answer is streaming",
  error: "This answer could not be completed.",
  cancelled: "Generation cancelled.",
  empty: "No answer was returned."
};
var ACTIONS = [
  { action: "copy", label: "copyAnswer", path: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "12", height: "12", rx: "2.5" }),
    /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] }) },
  { action: "retry", label: "retryAnswer", path: /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" }) },
  { action: "positive", label: "positiveFeedback", path: /* @__PURE__ */ jsx("path", { d: "M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" }) },
  { action: "negative", label: "negativeFeedback", path: /* @__PURE__ */ jsx("path", { d: "M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z" }) }
];
function StreamingText({
  content,
  sources = [],
  followUps = [],
  state = "complete",
  visibleCount,
  sourcesOpen,
  defaultSourcesOpen = false,
  onSourcesOpenChange,
  labels,
  onAction,
  onFollowUp,
  className
}) {
  const baseId = useId();
  const sourceToggleId = `${baseId}-sources-toggle`;
  const { Image, Link } = useYunUI();
  const sourceListId = `${baseId}-sources`;
  const [internalSourcesOpen, setInternalSourcesOpen] = useState(defaultSourcesOpen);
  const sourceUnit = labels?.sources ?? (sources.length === 1 ? "source" : "sources");
  const label = mergeLabels(DEFAULT_LABELS2, { ...labels, sources: sourceUnit });
  const controlledOpen = sourcesOpen !== void 0;
  const isSourcesOpen = controlledOpen ? sourcesOpen : internalSourcesOpen;
  const canChangeSourcesOpen = !controlledOpen || Boolean(onSourcesOpenChange);
  const isComplete = state === "complete";
  const count = state === "error" || state === "cancelled" ? content.length : Math.max(0, Math.min(Number.isFinite(visibleCount) ? Math.floor(visibleCount) : content.length, content.length));
  const visibleContent = content.slice(0, count);
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const hasSourceDisclosure = isComplete && sources.length > 0;
  const showSourceList = hasSourceDisclosure && isSourcesOpen;
  const setSourcesOpen = (next) => {
    if (!canChangeSourcesOpen) return;
    if (!controlledOpen) setInternalSourcesOpen(next);
    onSourcesOpenChange?.(next);
  };
  const stateMessage = state === "error" ? label.error : state === "cancelled" ? label.cancelled : void 0;
  const isEmpty = state === "empty" && visibleContent.length === 0;
  return /* @__PURE__ */ jsxs("div", { "data-yunui": "streaming-text", "data-state": state, className: cn("w-full", className), children: [
    isEmpty ? /* @__PURE__ */ jsx("p", { role: "status", className: "text-[13px] leading-relaxed text-muted-foreground", children: label.empty }) : /* @__PURE__ */ jsxs("p", { className: "whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground", children: [
      visibleContent.map((token, index) => {
        if (token.cite || token.sourceId) {
          const source = token.sourceId ? sourceById.get(token.sourceId) : void 0;
          const tokenKey = token.id ? `${baseId}-token-id-${encodeChatId(token.id)}` : `${baseId}-token-index-${index}`;
          if (!source) return token.text ? /* @__PURE__ */ jsx("span", { children: token.text }, tokenKey) : null;
          const safeHref = getSafeChatHref(source.href);
          const sourceLabel = source.domain || source.name;
          const chip = /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SourceImage, { Image, source }),
            /* @__PURE__ */ jsx("span", { children: sourceLabel })
          ] });
          const citationContent = /* @__PURE__ */ jsxs(Fragment, { children: [
            token.text ? /* @__PURE__ */ jsx("span", { children: token.text }) : null,
            chip
          ] });
          return safeHref ? /* @__PURE__ */ jsx(Link, { href: safeHref.href, target: safeHref.external ? "_blank" : void 0, rel: safeHref.external ? "noopener noreferrer" : void 0, "aria-label": `${source.name} (${sourceLabel})`, className: "mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-border bg-muted/60 px-1 align-middle font-mono text-[10.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", children: citationContent }, tokenKey) : /* @__PURE__ */ jsxs("span", { className: "mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-border bg-muted/60 px-1 align-middle font-mono text-[10.5px] text-muted-foreground", children: [
            token.text ? /* @__PURE__ */ jsx("span", { children: token.text }) : null,
            /* @__PURE__ */ jsx(SourceImage, { Image, source }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: source.name }),
            /* @__PURE__ */ jsx("span", { children: sourceLabel })
          ] }, tokenKey);
        }
        return /* @__PURE__ */ jsx(React.Fragment, { children: token.text }, token.id ? `${baseId}-token-id-${encodeChatId(token.id)}` : `${baseId}-token-index-${index}`);
      }),
      state === "streaming" ? /* @__PURE__ */ jsx("span", { role: "status", className: "sr-only", children: label.streaming }) : null,
      state === "streaming" ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 rounded-full bg-foreground motion-safe:animate-pulse motion-reduce:animate-none" }) : null
    ] }),
    stateMessage ? /* @__PURE__ */ jsx("p", { role: "status", className: "mt-1 text-[12px] leading-relaxed text-muted-foreground", children: stateMessage }) : null,
    isComplete ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-0.5", role: "group", "aria-label": label.actions, children: [
        ACTIONS.map(({ action, label: labelKey, path }) => /* @__PURE__ */ jsx("button", { type: "button", "aria-label": label[labelKey], disabled: !onAction, onClick: () => onAction?.(action), className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", children: /* @__PURE__ */ jsx("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: path }) }, action)),
        hasSourceDisclosure ? /* @__PURE__ */ jsxs("button", { id: sourceToggleId, type: "button", "aria-expanded": isSourcesOpen, "aria-controls": sourceListId, "aria-label": `${sources.length} ${label.sources}`, disabled: !canChangeSourcesOpen, onClick: () => setSourcesOpen(!isSourcesOpen), className: "ml-1 flex min-h-7 items-center gap-1.5 rounded-md px-1.5 text-left text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsx("span", { className: "flex -space-x-1", children: sources.map((source) => /* @__PURE__ */ jsx(SourceImage, { Image, source, compact: true }, source.id)) }),
          /* @__PURE__ */ jsxs("span", { children: [
            sources.length,
            " ",
            label.sources
          ] }),
          /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: cn("transition-transform", isSourcesOpen && "rotate-180"), children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) })
        ] }) : null
      ] }),
      hasSourceDisclosure ? /* @__PURE__ */ jsx("div", { id: sourceListId, role: "region", "aria-labelledby": sourceToggleId, "aria-hidden": !showSourceList, inert: !showSourceList, className: "grid transition-[grid-template-rows,opacity] duration-300", style: { gridTemplateRows: showSourceList ? "1fr" : "0fr", opacity: showSourceList ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }, children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex flex-col rounded-lg border border-border bg-muted/40 p-1", children: sources.map((source) => {
        const safeHref = getSafeChatHref(source.href);
        const row = /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(SourceImage, { Image, source }),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", children: source.name }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto min-w-0 truncate font-mono text-[10.5px] text-muted-foreground", children: source.domain })
        ] });
        return safeHref ? /* @__PURE__ */ jsx(Link, { href: safeHref.href, target: safeHref.external ? "_blank" : void 0, rel: safeHref.external ? "noopener noreferrer" : void 0, className: "flex min-h-8 items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", children: row }, source.id) : /* @__PURE__ */ jsx("div", { className: "flex min-h-8 items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground", children: row }, source.id);
      }) }) }) }) : null,
      followUps.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[12px] font-medium text-muted-foreground", children: label.followUps }),
        /* @__PURE__ */ jsx("div", { className: "mt-0.5 flex flex-col", children: followUps.map((text, index) => /* @__PURE__ */ jsxs("button", { type: "button", disabled: !onFollowUp, onClick: () => onFollowUp?.(text, index), className: "-mx-1.5 flex min-h-8 items-center gap-2 rounded-md border-b border-border px-1.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsxs("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "shrink-0 text-muted-foreground", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("path", { d: "M9 10l-5 5 5 5" }),
            /* @__PURE__ */ jsx("path", { d: "M20 4v7a4 4 0 0 1-4 4H4" })
          ] }),
          text
        ] }, `${baseId}-follow-up-${index}`)) })
      ] }) : null
    ] }) : null
  ] });
}
function SourceImage({ Image, source, compact: compact2 = false }) {
  const [failedImage, setFailedImage] = useState();
  const image = getSafeChatImage(source.image);
  const className = cn("shrink-0 rounded-[4px] bg-muted", compact2 ? "size-4 rounded-full" : "size-4");
  const size = compact2 ? 14 : 16;
  return image && failedImage !== image ? /* @__PURE__ */ jsx(Image, { src: image, alt: "", width: size, height: size, className: cn("source-avatar", className), onError: () => setFailedImage(image) }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: cn("inline-flex items-center justify-center font-medium text-muted-foreground", className, compact2 ? "text-[7px]" : "text-[9px]"), children: (Array.from(source.name.trim())[0] ?? "").toUpperCase() });
}

export { ChatAttachment, ChatComposer, ChatHeader, ChatMessage, ChatMessageList, ContextCards, GenerationStats, StreamingText };
//# sourceMappingURL=chat.js.map
//# sourceMappingURL=chat.js.map