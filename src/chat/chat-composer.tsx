"use client";

import * as React from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AtSign, ArrowUp, Check, ChevronDown, Command as CommandIcon, Square, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useAnchoredPosition } from "../lib/use-anchored-position";

/** A host-owned item shown in the Composer's source or model menu. */
export interface ChatComposerMenuItem {
  /** Stable host identifier; callbacks return this id rather than the display label. */
  id: string;
  label: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/** A host command. If present, `insertText` is inserted verbatim at the active slash token or caret. */
export interface ChatComposerCommand extends ChatComposerMenuItem {
  /** Exact insertion text; whitespace/newlines are not inferred or rewritten. */
  insertText?: string;
}

/** A host-owned model row, optionally grouped with other models. */
export interface ChatComposerModel extends ChatComposerMenuItem {
  group?: string;
  groupLabel?: string;
}

export interface ChatComposerMenuLabels {
  prompt?: string;
  sources?: string;
  commands?: string;
  model?: string;
  noSources?: string;
  noCommands?: string;
  noModels?: string;
  noMatchingSources?: string;
  noMatchingCommands?: string;
  removeSource?: (label: string) => string;
}

export interface ChatComposerLabels extends ChatComposerMenuLabels {
  /** Send button. @defaultValue "Send" */
  send?: string;
  /** Stop-generating button. @defaultValue "Stop" */
  stop?: string;
}

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when the user sends (Enter or the send button). */
  onSend: () => void;
  /** Called when the stop button is pressed while `loading`. */
  onStop?: () => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Attachment chips / previews, rendered above the textarea. The host owns the content and its actions. */
  attachments?: React.ReactNode;
  /** Left-aligned host toolbar (attach, mode, feature toggles, …). */
  toolbar?: React.ReactNode;
  /** Optional host-owned source list. Supplying `[]` renders the localized empty state. */
  sourceItems?: readonly ChatComposerMenuItem[];
  /** Host-owned selected source ids, used for chips and menu selection state. */
  selectedSourceIds?: readonly string[];
  /** Host callback for selecting or removing a source. The second argument is the desired selected state. */
  onSourceToggle?: (id: string, selected: boolean) => void;
  /** Optional host-owned command list. Commands never infer insertion text from an id or label. */
  commandItems?: readonly ChatComposerCommand[];
  /** Host callback for semantic command selection. */
  onCommandSelect?: (item: ChatComposerCommand) => void;
  /** Optional host-owned model list. Supplying `[]` renders the localized empty state. */
  modelItems?: readonly ChatComposerModel[];
  /** Host-owned selected model id. */
  selectedModelId?: string;
  /** Host callback for model selection. Without it, model options are disabled. */
  onModelChange?: (id: string) => void;
  /** Force-disable the send button even with text (e.g. invalid state). */
  sendDisabled?: boolean;
  /** Allow sending with empty text — e.g. when attachments alone make a valid message. @defaultValue false */
  allowSendEmpty?: boolean;
  /** Max rows before the textarea scrolls. @defaultValue 8 */
  maxRows?: number;
  /** @deprecated Use labels.send. Retained for 0.2.17 compatibility. */
  sendLabel?: string;
  /** @deprecated Use labels.stop. Retained for 0.2.17 compatibility. */
  stopLabel?: string;
  /** Accessible names and menu copy. Existing send/stop overrides remain supported. */
  labels?: ChatComposerLabels;
  className?: string;
}

type MenuKind = "sources" | "commands" | "models";
type TextMenuItem = ChatComposerMenuItem | ChatComposerCommand;
type Selection = { start: number; end: number };
type Token = { kind: "sources" | "commands"; start: number; query: string };

function safeId(value: string) {
  const points = Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0");
  return `id-${points.join("-") || "empty"}`;
}

// PromptBar interaction adapted from Beautiful UI (MIT), pinned at
// slev12397/beautiful-ui@44a274e598395ab61e7c96c26fda2758780253b7.
// This port is controlled: all data and side effects stay with the host.
function parseToken(value: string, caret: number): Token | null {
  const match = /(^|[\s(])([@/])([^\s,;!?()[\]{}]*)$/.exec(value.slice(0, caret));
  if (!match) return null;
  return {
    kind: match[2] === "@" ? "sources" : "commands",
    start: match.index + match[1].length,
    query: match[3].toLowerCase(),
  };
}

function tokenEnd(value: string, start: number, caret: number) {
  let end = caret;
  while (end < value.length && /[\p{L}\p{N}._-]/u.test(value[end])) end += 1;
  return Math.max(start + 1, end);
}

function matchingItems(items: readonly TextMenuItem[], query: string, kind: "sources" | "commands") {
  const q = query.toLowerCase();
  return items.filter((item) => {
    const label = kind === "commands" ? item.label.replace(/^\/+/, "") : item.label;
    return !q || label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });
}

const DEFAULT_MENU_LABELS: Required<ChatComposerMenuLabels> = {
  prompt: "Message prompt",
  sources: "Sources",
  commands: "Commands",
  model: "Select a model",
  noSources: "No sources available",
  noCommands: "No commands available",
  noModels: "No models available",
  noMatchingSources: "No matching sources",
  noMatchingCommands: "No matching commands",
  removeSource: (label) => `Remove ${label}`,
};

/**
 * Controlled chat input with host-provided attachment, toolbar, source,
 * command, and model slots. No model, source, upload, or execution behavior is
 * bundled into this component.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  loading = false,
  disabled = false,
  placeholder = "Send a message…",
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
  className,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const modelOptionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingSelectionRef = useRef<{ value: string; previousValue: string; start: number; end: number } | null>(null);
  const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sourceListId = `${idBase}-source-listbox`;
  const commandListId = `${idBase}-command-listbox`;
  const modelListId = `${idBase}-model-listbox`;
  const [explicitMenu, setExplicitMenu] = useState<MenuKind | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selection, setSelection] = useState<Selection>(() => ({ start: value.length, end: value.length }));
  useLayoutEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending) return;
    if (value === pending.value) {
      textareaRef.current?.setSelectionRange(pending.start, pending.end);
      pendingSelectionRef.current = null;
    } else if (value !== pending.previousValue) {
      // A newer controlled value superseded the completion before it committed.
      pendingSelectionRef.current = null;
    }
  }, [value]);
  const token = parseToken(value, selection.start);
  const tokenMenu = dismissed ? null : token?.kind ?? null;
  const requestedMenu = explicitMenu ?? tokenMenu;
  const hasMenuData = requestedMenu === "sources" ? sourceItems !== undefined
    : requestedMenu === "commands" ? commandItems !== undefined
      : requestedMenu === "models" ? modelItems !== undefined
        : false;
  const menu = disabled || !hasMenuData ? null : requestedMenu;
  const query = menu && token && token.kind === menu && !explicitMenu ? token.query : "";

  const sourceItemsResolved: readonly ChatComposerMenuItem[] = sourceItems ?? [];
  const commandItemsResolved: readonly ChatComposerCommand[] = commandItems ?? [];
  const modelItemsResolved: readonly ChatComposerModel[] = modelItems ?? [];
  const enabledModels = modelItemsResolved.filter((item) => !item.disabled && !!onModelChange && !disabled);
  const groupedModels = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; items: ChatComposerModel[] }>();
    for (const item of modelItemsResolved) {
      const key = item.group ?? "";
      const label = item.groupLabel ?? item.group ?? "";
      const group = groups.get(key) ?? { key, label, items: [] };
      group.items.push(item);
      groups.set(key, group);
    }
    return Array.from(groups.values());
  }, [modelItemsResolved]);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const { shift: modelMenuShift, maxHeight: modelMenuMaxHeight, maxWidth: modelMenuMaxWidth, placement: modelMenuPlacement } =
    useAnchoredPosition(menu === "models", modelMenuRef, { gutter: 8, minHeight: 160, maxWidth: 256 });
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
    removeSource: labels?.removeSource ?? DEFAULT_MENU_LABELS.removeSource,
  };
  const menuItems = useMemo<TextMenuItem[]>(() => {
    if (menu === "sources") return matchingItems(sourceItemsResolved, query, "sources");
    if (menu === "commands") return matchingItems(commandItemsResolved, query, "commands");
    return [];
  }, [menu, query, sourceItemsResolved, commandItemsResolved]);
  const selectableItems = useMemo(() => menuItems.filter((item) => {
    if (item.disabled) return false;
    if (menu === "sources") return !!onSourceToggle;
    if (menu === "commands") {
      const command = item as ChatComposerCommand;
      return !!onCommandSelect || command.insertText !== undefined;
    }
    return false;
  }), [menuItems, menu, onSourceToggle, onCommandSelect]);
  const activeItem = selectableItems[activeIndex];
  const textListId = menu === "sources" ? sourceListId : commandListId;
  const activeTextOptionId = (menu === "sources" || menu === "commands") && activeItem
    ? `${textListId}-option-${safeId(activeItem.id)}`
    : undefined;
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

  useEffect(() => { resize(); }, [value, resize]);
  useEffect(() => {
    setSelection((current) => ({
      start: Math.min(current.start, value.length),
      end: Math.min(current.end, value.length),
    }));
  }, [value]);
  useEffect(() => { setActiveIndex(-1); }, [menu, query]);
  useEffect(() => { if (menu !== "models") setActiveModelId(null); }, [menu]);
  useEffect(() => {
    if (!disabled) return;
    setExplicitMenu(null);
    setDismissed(true);
  }, [disabled]);
  useEffect(() => {
    if (!menu) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setExplicitMenu(null);
        setDismissed(true);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menu]);

  const insertAtToken = (kind: "sources" | "commands", insertion: string, addSourceSpacing = kind === "sources") => {
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

  const chooseTextItem = (item: TextMenuItem) => {
    if (item.disabled) return;
    if (menu === "sources") {
      if (!onSourceToggle) return;
      const selected = selectedSourceIds.includes(item.id);
      onSourceToggle(item.id, !selected);
      insertAtToken("sources", `@${item.label}`);
    } else if (menu === "commands") {
      const command = item as ChatComposerCommand;
      if (onCommandSelect) onCommandSelect(command);
      if (command.insertText !== undefined) insertAtToken("commands", command.insertText, false);
      if (!onCommandSelect && command.insertText === undefined) return;
    }
    setExplicitMenu(null);
    setDismissed(true);
    setActiveIndex(-1);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Some IMEs emit their committed Enter with isComposing=false and keyCode 229.
    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    if (menu === "sources" || menu === "commands") {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && selectableItems.length) {
        e.preventDefault();
        setActiveIndex((current) => e.key === "ArrowDown"
          ? (current + 1) % selectableItems.length
          : (current < 0 ? selectableItems.length - 1 : (current + selectableItems.length - 1) % selectableItems.length));
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
        // An open empty/all-disabled menu must never fall through to send.
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

  const openMenu = (kind: MenuKind) => {
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

  const focusModelIndex = (index: number) => {
    const item = enabledModels[index];
    if (!item) return;
    setActiveModelId(item.id);
    requestAnimationFrame(() => modelOptionRefs.current[item.id]?.focus());
  };

  const moveModelFocus = (currentId: string | null, direction: 1 | -1) => {
    if (!enabledModels.length) return;
    const currentIndex = enabledModels.findIndex((item) => item.id === currentId);
    const nextIndex = currentIndex < 0
      ? (direction === 1 ? 0 : enabledModels.length - 1)
      : (currentIndex + direction + enabledModels.length) % enabledModels.length;
    focusModelIndex(nextIndex);
  };

  const onModelTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
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
  const onModelMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModelMenu();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveModelFocus(activeModelId, event.key === "ArrowDown" ? 1 : -1);
    }
  };
  const renderModelOption = (item: ChatComposerModel) => {
    const unavailable = item.disabled || !onModelChange;
    const optionId = `${modelListId}-option-${safeId(item.id)}`;
    const descriptionId = item.description != null ? `${modelListId}-description-${safeId(item.id)}` : undefined;
    return (
      <button
        ref={(element) => { modelOptionRefs.current[item.id] = element; }}
        id={optionId}
        key={item.id}
        type="button"
        role="option"
        aria-label={item.label}
        aria-describedby={descriptionId}
        tabIndex={unavailable ? -1 : (activeModelId === item.id || (activeModelId === null && item.id === selectedModelId) ? 0 : -1)}
        aria-selected={item.id === selectedModelId}
        aria-disabled={unavailable || undefined}
        disabled={unavailable || disabled}
        onFocus={() => setActiveModelId(item.id)}
        onClick={() => { if (unavailable || disabled) return; onModelChange?.(item.id); closeModelMenu(); }}
        className={cn("relative z-10 flex min-h-8 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", item.id === selectedModelId && "bg-muted/70")}
      >
        {item.icon}
        <span className="min-w-0 flex-1">
          <span className="block truncate">{item.label}</span>
          {item.description != null && <span id={descriptionId} className="block truncate text-xs text-(--text-secondary)">{item.description}</span>}
        </span>
        {item.id === selectedModelId && <Check size={14} />}
      </button>
    );
  };

  return (
    <div data-yunui="chat-composer" data-promptbar ref={rootRef} className={cn("relative isolate flex w-full min-w-0 flex-col overflow-visible rounded-[22px] border border-border bg-card p-2.5 shadow-sm transition-colors focus-within:border-border-strong sm:p-3.5", disabled && "opacity-60", className)}>
      {(selectedSourceIds.length > 0 || attachments) && (
        <div className="flex flex-wrap gap-1.5 px-0.5 pt-0.5">
          {selectedSourceIds.map((id) => {
            const item = sourceItemsResolved.find((source) => source.id === id);
            if (!item) return null;
            return (
              <span key={id} className="inline-flex h-6.5 max-w-full items-center gap-1.5 rounded-md bg-muted px-1.5 py-1 text-[11.5px] text-muted-foreground">
                {item.icon}<span className="max-w-48 truncate">{item.label}</span>
                <button type="button" disabled={disabled || !onSourceToggle} aria-label={menuLabels.removeSource(item.label)} onClick={() => onSourceToggle?.(id, false)} className="-my-1 flex size-5 items-center justify-center rounded-sm hover:bg-muted-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X size={12}/></button>
              </span>
            );
          })}
          {attachments}
        </div>
      )}

      <div className="min-w-0 px-0.5 pt-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            if (pendingSelectionRef.current && event.currentTarget.value !== pendingSelectionRef.current.value) {
              pendingSelectionRef.current = null;
            }
            setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd });
            onChange(event.target.value);
            setDismissed(false);
            setExplicitMenu(null);
          }}
          onSelect={(event) => setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd })}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={menuLabels.prompt}
          aria-autocomplete={menu === "sources" || menu === "commands" ? "list" : undefined}
          aria-controls={menu === "sources" || menu === "commands" ? textListId : undefined}
          aria-activedescendant={activeTextOptionId}
          className={cn("block min-h-[68px] w-full max-h-[40vh] resize-none bg-transparent px-0 py-1 text-base leading-5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none md:text-sm", disabled && "cursor-not-allowed")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-0.5 pt-1">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {toolbar}
          {sourceItems !== undefined && (
            <button type="button" disabled={disabled} aria-expanded={menu === "sources"} aria-label={menuLabels.sources} onClick={() => openMenu("sources")} className={cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "sources" && "bg-muted text-foreground")}>
              <AtSign size={14}/>{menuLabels.sources}
            </button>
          )}
          {commandItems !== undefined && (
            <button type="button" disabled={disabled} aria-expanded={menu === "commands"} aria-label={menuLabels.commands} onClick={() => openMenu("commands")} className={cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "commands" && "bg-muted text-foreground")}>
              <CommandIcon size={14}/>{menuLabels.commands}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {modelItems !== undefined && (
            <div className="relative">
              <button ref={modelTriggerRef} data-model-trigger type="button" disabled={disabled} aria-expanded={menu === "models"} aria-controls={menu === "models" ? modelListId : undefined} aria-haspopup={modelItems.length ? "listbox" : undefined} aria-label={menuLabels.model} onClick={() => openMenu("models")} onKeyDown={onModelTriggerKeyDown} className={cn("inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", menu === "models" && "bg-muted text-foreground")}>
                {selectedModels?.label ?? menuLabels.model}<ChevronDown size={12}/>
              </button>
              {menu === "models" && (
                <div ref={modelMenuRef} id={modelListId} role={modelItems.length ? "listbox" : "status"} aria-label={menuLabels.model} onKeyDown={onModelMenuKeyDown} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { setExplicitMenu(null); setDismissed(true); } }} style={{ marginLeft: modelMenuShift, maxHeight: Math.min(modelMenuMaxHeight ?? 288, 288), maxWidth: modelMenuMaxWidth }} className={cn("absolute left-0 z-50 w-64 max-w-[calc(100vw-1rem)] overflow-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg", modelMenuPlacement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top")}>
                  {modelItems.length === 0 ? <div className="px-3 py-2 text-xs text-muted-foreground">{menuLabels.noModels}</div> : groupedModels.map((group) => (
                    <div key={group.key || "ungrouped"} role="group" aria-label={group.label || menuLabels.model}>
                      {group.label && <div className="px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{group.label}</div>}
                      {group.items.map(renderModelOption)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {loading ? (
            <button type="button" disabled={!onStop || disabled} onClick={onStop} aria-label={stopButtonLabel} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button type="button" onClick={() => canSend && onSend()} disabled={!canSend} aria-label={sendButtonLabel} className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors", canSend ? "bg-foreground text-background hover:opacity-90" : "cursor-not-allowed bg-muted text-muted-foreground")}>
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {(menu === "sources" || menu === "commands") && (
        <div id={textListId} data-yunui={menu === "sources" ? "chat-composer-source-menu" : "chat-composer-command-menu"} role={menuItems.length ? "listbox" : "status"} aria-label={menu === "sources" ? menuLabels.sources : menuLabels.commands} className="absolute bottom-full left-1 z-50 mb-2 max-h-72 w-[min(28rem,calc(100%-0.5rem))] overflow-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg">
          {menuItems.length === 0 ? <div className="px-3 py-2 text-xs text-(--text-secondary)">{menu === "sources" ? (query ? menuLabels.noMatchingSources : menuLabels.noSources) : (query ? menuLabels.noMatchingCommands : menuLabels.noCommands)}</div> : menuItems.map((item) => {
            const selected = menu === "sources" && selectedSourceIds.includes(item.id);
            const selectable = !item.disabled && (menu === "sources" ? !!onSourceToggle : (!!onCommandSelect || (item as ChatComposerCommand).insertText !== undefined));
            const active = activeItem?.id === item.id;
            const descriptionId = item.description != null ? `${textListId}-description-${safeId(item.id)}` : undefined;
            return (
              <button id={`${textListId}-option-${safeId(item.id)}`} key={item.id} type="button" role="option" aria-label={item.label} aria-describedby={descriptionId} tabIndex={-1} aria-selected={selected} aria-disabled={!selectable || undefined} data-active={active || undefined} disabled={!selectable || disabled} onClick={() => chooseTextItem(item)} onMouseEnter={() => { const index=selectableItems.findIndex((entry)=>entry.id===item.id); if(index>=0)setActiveIndex(index); }} className={cn("relative z-10 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-[12.5px] text-foreground transition-colors hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50", active && "bg-muted/70")}>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">{item.icon}</span><span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>{item.description != null && <span id={descriptionId} className="max-w-[45%] truncate text-xs text-muted-foreground">{item.description}</span>}{selected && <Check size={14} className="shrink-0 text-primary"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
