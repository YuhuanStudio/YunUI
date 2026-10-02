"use client";
import { capabilityIconColor } from './chunk-7HKJHDJL.js';
export { DiscordIcon, Footer, GithubIcon, InstagramIcon, Navbar } from './chunk-7HKJHDJL.js';
import { TextShimmer } from './chunk-QA5K76X3.js';
import { copyToClipboard } from './chunk-P6LU2FWV.js';
import { mergeLabels } from './chunk-GRUB2GXF.js';
import { cn, Button, RadioGroup, RadioGroupItem, Checkbox, useAnchoredPosition, useDismissOnOutside, Badge } from './chunk-ALP6SDRA.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import { memo, useState, useId, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import { Pin, MessageSquare, Waves, Code, Eye, Brain, Pencil, Ban, Fingerprint, Layers, SlidersHorizontal, Mic, Video, Music, Box, Radio, Sparkles, ChevronDown, X, ArrowRight, Check, CircleAlert, Clock3, Loader2, RefreshCw, ArrowUp, ChevronRight, Copy, Image, PauseCircle, Search, Bot, Globe, CircleUserRound, LogOut, FileText, Terminal, Wrench, CircleHelp, Scissors, ThumbsUp, Type, Shield, Shuffle, Volume2, Headphones, Palette, Hash } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';

function ThinkingBlock({
  content,
  isStreaming = false,
  defaultOpen = false,
  open,
  onOpenChange,
  steps = [],
  selectedStepId,
  onStepSelect,
  labels,
  renderContent
}) {
  const translate = useYunUI().useT("common.thinking");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const contentId = `${useId()}-thinking-content`;
  const controlled = open !== void 0;
  const isOpen = controlled ? open : internalOpen;
  const canToggle = !controlled || Boolean(onOpenChange);
  const fallback = (key, value) => {
    try {
      const translated = translate(key);
      return translated && translated !== key && !translated.endsWith(`.${key}`) ? translated : value;
    } catch {
      return value;
    }
  };
  const copy = {
    title: labels?.title ?? fallback("label", "Thinking"),
    active: labels?.active ?? fallback("active", "Thinking"),
    inProgress: labels?.inProgress ?? fallback("inProgress", "In progress"),
    completed: labels?.completed ?? fallback("completed", "Completed"),
    failed: labels?.failed ?? fallback("failed", "Failed"),
    cancelled: labels?.cancelled ?? fallback("cancelled", "Cancelled"),
    pending: labels?.pending ?? fallback("pending", "Pending")
  };
  const requestOpen = () => {
    if (!canToggle) return;
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const statusLabel = (status) => ({
    pending: copy.pending,
    running: copy.active,
    done: copy.completed,
    failed: copy.failed,
    cancelled: copy.cancelled
  })[status];
  const statusIcon2 = (status) => {
    const common = "h-3.5 w-3.5 shrink-0";
    switch (status) {
      case "running":
        return /* @__PURE__ */ jsx(Loader2, { "aria-hidden": true, className: cn(common, "motion-safe:animate-spin text-primary") });
      case "done":
        return /* @__PURE__ */ jsx(Check, { "aria-hidden": true, className: cn(common, "text-(--success)") });
      case "failed":
        return /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, className: cn(common, "text-(--error)") });
      case "cancelled":
        return /* @__PURE__ */ jsx(X, { "aria-hidden": true, className: cn(common, "text-muted-foreground") });
      default:
        return /* @__PURE__ */ jsx(Clock3, { "aria-hidden": true, className: cn(common, "text-muted-foreground/60") });
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "@container/think my-2 w-full min-w-0", "data-yunui": "thinking-block", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: requestOpen,
        disabled: !canToggle,
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        className: "group flex min-h-8 w-fit max-w-full items-center gap-2 rounded-md px-1.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
        children: [
          /* @__PURE__ */ jsx(Sparkles, { "aria-hidden": true, className: cn("h-3.5 w-3.5 shrink-0", isStreaming ? "text-primary" : "text-muted-foreground") }),
          isStreaming ? /* @__PURE__ */ jsx(TextShimmer, { text: copy.title, role: "status", className: "min-w-0 truncate font-medium text-foreground" }) : /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate font-medium text-foreground", children: copy.title }),
          isStreaming ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary motion-safe:animate-pulse" }) : null,
          /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": true, className: cn("h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none", isOpen && "rotate-180") })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: contentId,
        "aria-hidden": !isOpen,
        inert: !isOpen,
        className: cn(
          "grid min-w-0 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ),
        children: /* @__PURE__ */ jsx("div", { className: "min-h-0 overflow-hidden", children: steps.length ? /* @__PURE__ */ jsx("ol", { "aria-label": copy.title, className: "ml-2 mt-1 flex min-w-0 flex-col gap-0.5 border-l border-border/70 py-1 pl-3", children: steps.map((step) => {
          const contentNode = /* @__PURE__ */ jsxs(Fragment, { children: [
            statusIcon2(step.status),
            /* @__PURE__ */ jsx("span", { className: cn("min-w-0 text-left text-[12.5px] text-foreground", step.mono && "font-mono text-xs"), children: step.label }),
            step.meta != null ? /* @__PURE__ */ jsx("span", { "data-yunui": "thinking-block-step-meta", className: "col-start-2 min-w-0 break-words text-[11px] tabular-nums text-muted-foreground @min-[360px]/think:col-start-3 @min-[360px]/think:max-w-[10rem] @min-[360px]/think:text-right", children: step.meta }) : null,
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: statusLabel(step.status) })
          ] });
          return /* @__PURE__ */ jsxs("li", { "data-yunui": "thinking-block-step", className: "min-w-0", children: [
            onStepSelect ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-pressed": selectedStepId === step.id,
                onClick: () => onStepSelect(step.id),
                className: cn("grid min-h-8 w-full min-w-0 grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 rounded-sm px-1.5 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring @min-[360px]/think:grid-cols-[0.875rem_minmax(0,1fr)_auto]", selectedStepId === step.id && "bg-muted/60"),
                children: contentNode
              }
            ) : /* @__PURE__ */ jsx("div", { className: "grid min-h-8 min-w-0 grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 px-1.5 @min-[360px]/think:grid-cols-[0.875rem_minmax(0,1fr)_auto]", children: contentNode }),
            step.detail != null ? /* @__PURE__ */ jsx("div", { "data-yunui": "thinking-block-step-detail", className: "ml-5 border-l border-border/70 py-1 pl-2.5 text-xs leading-relaxed text-muted-foreground", children: step.detail }) : null
          ] }, step.id);
        }) }) : content ? /* @__PURE__ */ jsxs("div", { className: "ml-2 mt-1 border-l border-border/70 py-1 pl-3 pr-2 text-[13px] leading-relaxed text-muted-foreground", children: [
          renderContent ? renderContent(content) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: content }),
          isStreaming ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "ml-1 inline-block h-3 w-1 animate-pulse bg-muted-foreground/70 align-middle motion-reduce:animate-none" }) : null
        ] }) : isStreaming ? /* @__PURE__ */ jsx("p", { className: "ml-2 mt-1 border-l border-border/70 py-1 pl-3 text-[12px] text-muted-foreground", children: copy.inProgress }) : null })
      }
    )
  ] });
}
function domIdPart(value) {
  return Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0").join("-") || "empty";
}
var ICONS = {
  terminal: Terminal,
  search: Search,
  globe: Globe,
  image: Image,
  file: FileText,
  tool: Wrench,
  think: Sparkles,
  write: Pencil,
  run: Terminal,
  read: FileText
};
function useDisclosure({ id, open: controlledOpen, defaultOpen = false, onToggleRow }) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = controlledOpen !== void 0;
  const open = controlled ? controlledOpen : internalOpen;
  const canToggle = !controlled || Boolean(onToggleRow);
  const toggle = () => {
    if (!canToggle) return;
    const next = !open;
    if (!controlled) setInternalOpen(next);
    onToggleRow?.(id, next);
  };
  return { open, canToggle, toggle };
}
function Collapse({ open, children, id }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      id,
      "aria-hidden": !open,
      inert: !open,
      className: cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      ),
      children: /* @__PURE__ */ jsx("div", { className: "min-h-0 overflow-hidden", children })
    }
  );
}
function statusIcon(status) {
  if (status === "running") return /* @__PURE__ */ jsx(Loader2, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 motion-safe:animate-spin text-primary" });
  if (status === "done") return /* @__PURE__ */ jsx(Check, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 text-(--success)" });
  if (status === "error" || status === "failed") return /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 text-(--error)" });
  if (status === "cancelled") return /* @__PURE__ */ jsx(X, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" });
  return /* @__PURE__ */ jsx(Clock3, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 text-muted-foreground/60" });
}
function statusText(status, labels) {
  if (status === "done") return labels.completed ?? "Completed";
  if (status === "failed") return labels.failed ?? "Failed";
  if (status === "cancelled") return labels.cancelled ?? "Cancelled";
  if (status === "error") return labels.error ?? "Error";
  if (status === "pending") return labels.pending ?? "Pending";
  return labels.running ?? "Running";
}
function toneClass(tone) {
  if (tone === "add") return "text-(--success)";
  if (tone === "del") return "text-(--error)";
  return "text-muted-foreground";
}
function ReasoningRow({ block, labels, onToggleRow, renderContent }) {
  const instanceId = useId();
  const expandable = Boolean(block.content.trim());
  const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
  const title = `${instanceId}-reasoning-${domIdPart(block.id)}`;
  return /* @__PURE__ */ jsxs("div", { "data-yunui": "agent-timeline-reasoning-disclosure", className: "min-w-0 py-1", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: !expandable || !disclosure.canToggle,
        "aria-expanded": expandable ? disclosure.open : void 0,
        "aria-controls": expandable ? title : void 0,
        onClick: disclosure.toggle,
        className: "flex min-h-8 w-full items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
        children: [
          /* @__PURE__ */ jsx(Sparkles, { "aria-hidden": true, size: 14, className: cn("shrink-0", block.active ? "text-primary" : "text-muted-foreground") }),
          block.active ? /* @__PURE__ */ jsx(TextShimmer, { text: block.label, active: true, "data-agent-timeline-active": "true", className: "min-w-0 flex-1 truncate text-[13px]" }) : /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-[13px] text-foreground", children: block.label }),
          block.active ? /* @__PURE__ */ jsx("span", { className: "sr-only", children: labels.running ?? "Running" }) : null,
          expandable ? /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": true, size: 14, className: cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180") }) : null
        ]
      }
    ),
    expandable ? /* @__PURE__ */ jsx(Collapse, { id: title, open: disclosure.open, children: /* @__PURE__ */ jsx("div", { "data-yunui": "agent-timeline-reasoning-content", className: "ml-8 border-l border-border pl-3 pr-2 py-2 text-sm leading-relaxed text-muted-foreground", children: renderContent ? renderContent(block.content) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: block.content }) }) }) : null
  ] });
}
function ToolRow({ block, labels, onToggleRow, onToggleDiff }) {
  const instanceId = useId();
  const expandable = Boolean(block.command || block.output || block.outputContent != null || block.details?.length || block.files?.length);
  const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
  const [openDiff, setOpenDiff] = useState(null);
  const Icon = ICONS[block.icon ?? "tool"];
  const detailId = `${instanceId}-tool-${domIdPart(block.id)}`;
  return /* @__PURE__ */ jsxs("div", { className: cn("min-w-0", block.indent && "ml-5"), "data-yunui": "agent-tool-row", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: !expandable || !disclosure.canToggle,
        "aria-expanded": expandable ? disclosure.open : void 0,
        "aria-controls": expandable ? detailId : void 0,
        onClick: disclosure.toggle,
        className: "group flex min-h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
        children: [
          /* @__PURE__ */ jsx(Icon, { "aria-hidden": true, size: 14, className: "shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[13px] font-medium text-foreground", children: block.verb }),
          block.summary || block.command ? /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-muted-foreground", children: block.summary ?? block.command }) : /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1" }),
          statusIcon(block.status),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: statusText(block.status, labels) }),
          expandable ? /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": true, size: 14, className: cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180") }) : null
        ]
      }
    ),
    expandable ? /* @__PURE__ */ jsx(Collapse, { id: detailId, open: disclosure.open, children: /* @__PURE__ */ jsxs("div", { className: "ml-6 mr-2 mt-0.5 border-l border-border/70 py-1.5 pl-3", children: [
      block.command ? /* @__PURE__ */ jsxs("div", { className: "mb-1.5 font-mono text-xs text-foreground/80", children: [
        "$ ",
        block.command
      ] }) : null,
      block.outputContent != null ? /* @__PURE__ */ jsx("div", { role: "region", "aria-label": labels.toolOutput?.(block.verb) ?? `${block.verb} output`, className: "min-w-0", children: block.outputContent }) : block.output ? /* @__PURE__ */ jsx("pre", { role: "region", "aria-label": labels.toolOutput?.(block.verb) ?? `${block.verb} output`, tabIndex: 0, className: "max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-muted/30 px-2 py-1.5 font-mono text-xs text-foreground/80", children: block.output }) : null,
      block.details?.length ? /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-col gap-1", children: block.details.map((detail) => /* @__PURE__ */ jsx("div", { className: cn("flex items-baseline justify-between gap-3 text-xs", toneClass(detail.tone ?? "context"), detail.mono && "font-mono"), children: /* @__PURE__ */ jsx("span", { className: "min-w-0 whitespace-pre-wrap", children: detail.text }) }, detail.id)) }) : null,
      block.files?.length ? /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: block.files.map((file, fileIndex) => {
        const fileOpen = openDiff === file.id;
        const canShowLines = Boolean(file.lines?.length || onToggleDiff);
        const diffId = `${instanceId}-diff-${fileIndex}-${domIdPart(file.id)}`;
        const chip = /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", children: file.file }),
          /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-(--success) tabular-nums", children: [
            "+",
            file.additions
          ] }),
          file.deletions ? /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-(--error) tabular-nums", children: [
            "\u2212",
            file.deletions
          ] }) : null
        ] });
        return /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
          canShowLines ? /* @__PURE__ */ jsx("button", { type: "button", "aria-expanded": fileOpen, "aria-controls": file.lines?.length ? diffId : void 0, "aria-label": labels.showDiff?.(file.file) ?? `Show diff for ${file.file}`, onClick: () => {
            const next = fileOpen ? null : file.id;
            setOpenDiff(next);
            onToggleDiff?.(file.id, next !== null);
          }, className: "inline-flex max-w-full items-center gap-2 rounded-full bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: chip }) : /* @__PURE__ */ jsx("span", { className: "inline-flex max-w-full items-center gap-2 rounded-full bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground", children: chip }),
          file.lines?.length ? /* @__PURE__ */ jsx(Collapse, { open: fileOpen, id: diffId, children: /* @__PURE__ */ jsx("pre", { className: "mt-1 max-h-48 overflow-auto rounded-sm bg-muted/30 p-2 font-mono text-[11px]", children: file.lines.map((line) => /* @__PURE__ */ jsxs("span", { className: cn("block whitespace-pre-wrap", toneClass(line.tone)), children: [
            line.text,
            "\n"
          ] }, line.id)) }) }) : null
        ] }, file.id);
      }) }) : null
    ] }) }) : null
  ] });
}
function TaskRow({ block, labels, onToggleRow }) {
  const instanceId = useId();
  const expandable = Boolean(block.details?.length);
  const disclosure = useDisclosure({ id: block.id, open: block.open, defaultOpen: block.defaultOpen, onToggleRow });
  const detailId = `${instanceId}-task-${domIdPart(block.id)}`;
  return /* @__PURE__ */ jsxs("div", { "data-yunui": "agent-task-row", className: "min-w-0", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: !expandable || !disclosure.canToggle,
        "aria-expanded": expandable ? disclosure.open : void 0,
        "aria-controls": expandable ? detailId : void 0,
        onClick: disclosure.toggle,
        className: "flex min-h-10 w-full min-w-0 items-center gap-2.5 rounded-sm px-2.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
        children: [
          statusIcon(block.status),
          block.status === "done" || block.status === "failed" || block.status === "cancelled" ? /* @__PURE__ */ jsx("span", { className: cn("shrink-0 text-[11px] font-medium", block.status === "done" ? "text-(--success)" : block.status === "failed" ? "text-(--error)" : "text-muted-foreground"), children: statusText(block.status, labels) }) : /* @__PURE__ */ jsx("span", { className: "sr-only", children: statusText(block.status, labels) }),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-[13px] font-medium text-foreground", children: block.label }),
          block.amount != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs tabular-nums text-muted-foreground", children: block.amount }) : null,
          block.step !== void 0 && block.status === "running" ? /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground", children: block.step }) : null,
          expandable ? /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": true, size: 14, className: cn("shrink-0 text-muted-foreground transition-transform", disclosure.open && "rotate-180") }) : null
        ]
      }
    ),
    expandable ? /* @__PURE__ */ jsx(Collapse, { id: detailId, open: disclosure.open, children: /* @__PURE__ */ jsx("div", { className: "ml-5 border-l border-border/70 py-1.5 pl-3 pr-2", children: block.details?.map((detail) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 py-1 text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "min-w-0 text-muted-foreground", children: detail.label }),
      detail.meta != null ? /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono tabular-nums text-muted-foreground/80", children: detail.meta }) : null
    ] }, detail.id)) }) }) : null
  ] });
}
function ApprovalRow({ block, isLast, onApprove, onReject, labels }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 py-1.5", "data-yunui": "agent-approval-row", "data-last": isLast || void 0, "aria-busy": block.busy || void 0, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
      /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, size: 14, className: "shrink-0 text-muted-foreground" }),
      /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate text-[13px] font-medium text-foreground", children: block.title }),
      /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono text-[11px] text-muted-foreground", children: block.verb }),
      block.decision ? /* @__PURE__ */ jsx(Badge, { variant: block.decision === "approved" ? "success" : "error", children: block.decidedLabel ?? block.decision }) : null
    ] }),
    block.message != null ? /* @__PURE__ */ jsx("p", { className: "ml-6 mt-1 text-[12.5px] text-muted-foreground", children: block.message }) : null,
    block.argsText ? /* @__PURE__ */ jsx("pre", { tabIndex: 0, role: "region", "aria-label": `${block.title}: ${block.verb}`, className: "ml-6 mt-1 max-h-40 overflow-auto whitespace-pre-wrap bg-muted/30 px-2 py-1.5 font-mono text-[11.5px] text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring", children: block.argsText }) : null,
    !block.decision ? /* @__PURE__ */ jsxs("div", { className: "ml-6 mt-2 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "primary", disabled: block.disabled || block.busy || !onApprove, onClick: () => {
        if (!block.disabled && !block.busy) onApprove?.(block.id);
      }, children: block.allowLabel }),
      /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: block.disabled || block.busy || !onReject, onClick: () => {
        if (!block.disabled && !block.busy) onReject?.(block.id);
      }, children: block.denyLabel }),
      block.busy ? /* @__PURE__ */ jsx("span", { role: "status", className: "text-xs text-muted-foreground", children: labels?.waitingForHost ?? "Waiting for host\u2026" }) : null
    ] }) : null
  ] });
}
function AgentTimeline({
  blocks,
  renderContent,
  onApprove,
  onReject,
  labels,
  open,
  defaultOpen = true,
  onOpenChange,
  onToggleRow,
  onToggleDiff,
  className
}) {
  const contentId = `${useId()}-timeline-content`;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = open !== void 0;
  const isOpen = controlled ? open : internalOpen;
  const canToggle = !controlled || Boolean(onOpenChange);
  const visible = blocks.filter((block) => !(block.kind === "reasoning" && !block.content.trim() && !block.active));
  if (!visible.length) return null;
  const counts = {
    steps: visible.length,
    reasoning: visible.filter((block) => block.kind === "reasoning").length,
    tools: visible.filter((block) => block.kind === "tool").length,
    tasks: visible.filter((block) => block.kind === "task").length,
    approvals: visible.filter((block) => block.kind === "approval").length
  };
  const summary = labels?.summary?.(counts) ?? labels?.stepCount?.(counts.steps) ?? (counts.steps ? `${counts.steps} ${counts.steps === 1 ? "step" : "steps"}` : labels?.process ?? "Process");
  const requestOpen = () => {
    if (!canToggle) return;
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("flex min-w-0 flex-col", className), "data-yunui": "agent-timeline", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: !canToggle,
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        onClick: requestOpen,
        className: "flex min-h-8 w-fit max-w-full items-center gap-2 rounded-sm px-1.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default",
        children: [
          /* @__PURE__ */ jsx(Sparkles, { "aria-hidden": true, className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: summary }),
          /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": true, size: 14, className: cn("shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180") })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Collapse, { open: isOpen, id: contentId, children: /* @__PURE__ */ jsx("div", { className: "mt-1 flex min-w-0 flex-col gap-0.5", children: visible.map((block, index) => {
      if (block.kind === "reasoning") return /* @__PURE__ */ jsx(ReasoningRow, { block, labels: labels ?? {}, onToggleRow, renderContent }, block.id);
      if (block.kind === "tool") return /* @__PURE__ */ jsx(ToolRow, { block, labels: labels ?? {}, onToggleRow, onToggleDiff }, block.id);
      if (block.kind === "task") return /* @__PURE__ */ jsx(TaskRow, { block, labels: labels ?? {}, onToggleRow }, block.id);
      return /* @__PURE__ */ jsx(ApprovalRow, { block, isLast: index === visible.length - 1, onApprove, onReject, labels }, block.id);
    }) }) })
  ] });
}
var DEFAULT_LABELS = {
  dismiss: "Dismiss questions",
  back: "Back",
  next: "Next",
  skip: "Skip",
  submit: "Submit answers",
  submitting: "Submitting\u2026",
  otherPlaceholder: "Something else\u2026"
};
function domPart(value) {
  return Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? "0").join("-") || "empty";
}
function ApprovalQuestion({
  questions,
  activeQuestionId,
  answers,
  onAnswersChange,
  onActiveQuestionChange,
  onSkip,
  onSubmit,
  onDismiss,
  submitting = false,
  disabled = false,
  labels,
  className
}) {
  const generatedId = useId();
  const questionIndex = questions.findIndex((question2) => question2.id === activeQuestionId);
  const question = questions[questionIndex];
  if (!question) return null;
  const copy = {
    dismiss: labels?.dismiss ?? DEFAULT_LABELS.dismiss,
    back: labels?.back ?? DEFAULT_LABELS.back,
    next: labels?.next ?? DEFAULT_LABELS.next,
    skip: labels?.skip ?? DEFAULT_LABELS.skip,
    submit: labels?.submit ?? DEFAULT_LABELS.submit,
    submitting: labels?.submitting ?? DEFAULT_LABELS.submitting,
    otherPlaceholder: labels?.otherPlaceholder ?? DEFAULT_LABELS.otherPlaceholder
  };
  const answer = answers[question.id] ?? { optionIds: [] };
  const hasSelection = answer.optionIds.some(
    (id) => question.options.some((option) => option.id === id && !option.disabled)
  );
  const hasOtherText = Boolean(question.other && answer.optionIds.includes(question.other.id) && answer.otherText?.trim());
  const canContinue = question.required === false || hasSelection || hasOtherText;
  const isLast = questionIndex === questions.length - 1;
  const updateAnswer = (next) => {
    onAnswersChange({ ...answers, [question.id]: next });
  };
  const toggleOption = (optionId) => {
    const option = question.options.find((item) => item.id === optionId);
    const isOtherOption = question.other?.id === optionId;
    if (!option && !isOtherOption || option?.disabled) return;
    const current = answer.optionIds;
    const selected = current.includes(optionId);
    const optionIds = question.type === "single" ? [optionId] : selected ? current.filter((id) => id !== optionId) : [...current, optionId];
    updateAnswer({
      ...answer,
      optionIds,
      ...question.type === "single" && question.other && optionId !== question.other.id ? { otherText: "" } : {}
    });
  };
  const continueQuestion = () => {
    if (!canContinue) return;
    if (isLast) {
      onSubmit?.(answers);
      return;
    }
    if (onActiveQuestionChange) onActiveQuestionChange(questions[questionIndex + 1].id);
  };
  return /* @__PURE__ */ jsxs("section", { "data-yunui": "approval-question", className: cn("w-full max-w-md rounded-xl border border-border/70 bg-card p-3.5 shadow-none", className), "aria-labelledby": `${generatedId}-title`, "aria-busy": submitting || void 0, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2.5 flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { "aria-live": "polite", "aria-atomic": "true", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs text-muted-foreground", children: labels?.progress?.(questionIndex + 1, questions.length) ?? `Question ${questionIndex + 1} of ${questions.length}` }),
          /* @__PURE__ */ jsx("h3", { id: `${generatedId}-title`, className: "text-sm font-semibold text-foreground", children: question.title })
        ] }),
        question.message != null ? /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: question.message }) : null
      ] }),
      onDismiss ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "h-6 w-6 shrink-0 text-muted-foreground", disabled: disabled || submitting, onClick: onDismiss, "aria-label": copy.dismiss, children: /* @__PURE__ */ jsx(X, { "aria-hidden": true, className: "h-3.5 w-3.5" }) }) : null
    ] }),
    /* @__PURE__ */ jsxs("fieldset", { className: "min-w-0", "aria-labelledby": `${generatedId}-title`, children: [
      /* @__PURE__ */ jsx("legend", { className: "sr-only", children: question.title }),
      question.type === "single" ? /* @__PURE__ */ jsxs(
        RadioGroup,
        {
          value: answer.optionIds.find((id) => id === question.other?.id || question.options.some((option) => option.id === id)) ?? "",
          onValueChange: toggleOption,
          disabled: disabled || submitting,
          orientation: "vertical",
          className: "gap-0",
          children: [
            question.options.map((option) => {
              const checked = answer.optionIds.includes(option.id);
              const inputId = `${generatedId}-${domPart(question.id)}-${domPart(option.id)}`;
              const labelId = `${inputId}-label`;
              return /* @__PURE__ */ jsx("div", { className: cn("transition-colors", checked && "bg-muted/50", !option.disabled && !disabled && !submitting && "hover:bg-muted/50"), children: /* @__PURE__ */ jsxs("label", { htmlFor: inputId, className: cn("flex min-h-9 cursor-pointer items-start gap-2.5 px-2 py-1.5", (option.disabled || disabled || submitting) && "cursor-not-allowed opacity-50"), children: [
                /* @__PURE__ */ jsx(RadioGroupItem, { id: inputId, value: option.id, disabled: disabled || submitting || option.disabled, "aria-labelledby": labelId, className: "mt-0.5" }),
                /* @__PURE__ */ jsxs("span", { id: labelId, className: "min-w-0 flex-1 text-sm text-foreground", children: [
                  /* @__PURE__ */ jsx("span", { className: "block", children: option.label }),
                  option.detail != null ? /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: option.detail }) : null
                ] })
              ] }) }, option.id);
            }),
            question.other ? (() => {
              const otherSelected = answer.optionIds.includes(question.other.id);
              const otherId = `${generatedId}-${domPart(question.id)}-${domPart(question.other.id)}`;
              const otherLabelId = `${otherId}-label`;
              return /* @__PURE__ */ jsxs("div", { className: cn("transition-colors", otherSelected && "bg-muted/50", !disabled && !submitting && "hover:bg-muted/50"), children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: otherId, className: cn("flex min-h-9 cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm text-foreground", (disabled || submitting) && "cursor-not-allowed opacity-50"), children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { id: otherId, value: question.other.id, disabled: disabled || submitting, "aria-labelledby": otherLabelId }),
                  /* @__PURE__ */ jsx("span", { id: otherLabelId, children: question.other.label })
                ] }),
                otherSelected ? /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: answer.otherText ?? "",
                    disabled: disabled || submitting,
                    onChange: (event) => updateAnswer({ ...answer, otherText: event.target.value }),
                    placeholder: question.other.placeholder ?? copy.otherPlaceholder,
                    "aria-label": question.other.placeholder ?? copy.otherPlaceholder,
                    className: "mb-2 ml-9 w-[calc(100%-2.75rem)] rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  }
                ) : null
              ] }, question.other.id);
            })() : null
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0", children: [
        question.options.map((option) => {
          const checked = answer.optionIds.includes(option.id);
          const inputId = `${generatedId}-${domPart(question.id)}-${domPart(option.id)}`;
          const labelId = `${inputId}-label`;
          return /* @__PURE__ */ jsxs("label", { htmlFor: inputId, className: cn("flex min-h-9 cursor-pointer items-start gap-2.5 px-2 py-1.5 transition-colors", checked && "bg-muted/50", !option.disabled && !disabled && !submitting && "hover:bg-muted/50", (option.disabled || disabled || submitting) && "cursor-not-allowed opacity-50"), children: [
            /* @__PURE__ */ jsx(Checkbox, { id: inputId, checked, disabled: disabled || submitting || option.disabled, onCheckedChange: () => toggleOption(option.id), "aria-labelledby": labelId, className: "mt-0.5" }),
            /* @__PURE__ */ jsxs("span", { id: labelId, className: "min-w-0 flex-1 text-sm text-foreground", children: [
              /* @__PURE__ */ jsx("span", { className: "block", children: option.label }),
              option.detail != null ? /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: option.detail }) : null
            ] })
          ] }, option.id);
        }),
        question.other ? (() => {
          const otherSelected = answer.optionIds.includes(question.other.id);
          const otherId = `${generatedId}-${domPart(question.id)}-${domPart(question.other.id)}`;
          const otherLabelId = `${otherId}-label`;
          return /* @__PURE__ */ jsxs("div", { className: cn("transition-colors", otherSelected && "bg-muted/50"), children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: otherId, className: cn("flex min-h-9 cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm text-foreground transition-colors", !disabled && !submitting && "hover:bg-muted/50", (disabled || submitting) && "cursor-not-allowed opacity-50"), children: [
              /* @__PURE__ */ jsx(Checkbox, { id: otherId, checked: otherSelected, disabled: disabled || submitting, onCheckedChange: () => toggleOption(question.other.id), "aria-labelledby": otherLabelId }),
              /* @__PURE__ */ jsx("span", { id: otherLabelId, children: question.other.label })
            ] }),
            otherSelected ? /* @__PURE__ */ jsx(
              "input",
              {
                value: answer.otherText ?? "",
                disabled: disabled || submitting,
                onChange: (event) => updateAnswer({ ...answer, otherText: event.target.value }),
                placeholder: question.other.placeholder ?? copy.otherPlaceholder,
                "aria-label": question.other.placeholder ?? copy.otherPlaceholder,
                className: "mb-2 ml-9 w-[calc(100%-2.75rem)] rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              }
            ) : null
          ] });
        })() : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", disabled: disabled || submitting || questionIndex === 0 || !onActiveQuestionChange, onClick: () => onActiveQuestionChange?.(questions[questionIndex - 1].id), children: copy.back }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", disabled: disabled || submitting || !onSkip, onClick: () => onSkip?.(question.id), children: copy.skip }),
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "primary", size: "sm", disabled: disabled || submitting || !canContinue || (isLast ? !onSubmit : !onActiveQuestionChange), onClick: continueQuestion, children: [
          isLast ? submitting ? copy.submitting : copy.submit : copy.next,
          !isLast ? /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true, className: "ml-1 h-3.5 w-3.5" }) : null
        ] })
      ] })
    ] })
  ] });
}
function AgentRunStatus({
  label,
  phase = "thinking",
  active = !["waiting", "completed", "failed", "cancelled"].includes(phase),
  className,
  ...props
}) {
  const terminal = phase === "completed" || phase === "failed" || phase === "cancelled";
  const Icon = phase === "completed" ? Check : phase === "failed" ? CircleAlert : phase === "cancelled" ? X : phase === "waiting" ? Clock3 : phase === "thinking" && active ? Sparkles : active ? Loader2 : Clock3;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
      "data-yunui": "agent-run-status",
      "data-phase": phase,
      "data-active": active || void 0,
      className: cn("flex min-h-8 w-fit max-w-full min-w-0 items-center gap-2 py-1 text-[13px] text-muted-foreground", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          Icon,
          {
            "data-run-status-indicator": true,
            "aria-hidden": true,
            className: cn(
              "h-3.5 w-3.5 shrink-0",
              active && !terminal && phase === "thinking" ? "text-primary" : "",
              active && !terminal && phase !== "thinking" ? "motion-safe:animate-spin text-primary" : "",
              phase === "completed" ? "text-(--success)" : "",
              phase === "failed" ? "text-(--error)" : ""
            )
          }
        ),
        /* @__PURE__ */ jsx(
          TextShimmer,
          {
            text: label,
            active: active && !terminal,
            "data-run-status-label": true,
            className: "min-w-0 max-w-xl truncate font-medium text-foreground"
          }
        )
      ]
    }
  );
}
var CATEGORY_TONE = {
  accent: "bg-accent",
  muted: "bg-muted-foreground",
  warning: "bg-warning-solid-medium"
};
function IncludedMark({ included, tone }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      className: cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] transition-[background-color,color,transform] duration-150",
        included ? tone === "error" ? "bg-(--error) text-[var(--bg-base)]" : "bg-(--success) text-[var(--bg-base)]" : "bg-muted text-muted-foreground shadow-[0_0_0_1px_var(--border-default)]"
      ),
      style: { transform: included ? "scale(1)" : "scale(0.92)" },
      children: included ? /* @__PURE__ */ jsx(Check, { "aria-hidden": "true", className: "size-3", strokeWidth: 3 }) : null
    }
  );
}
function stateText(state, labels, count) {
  if (state === "busy") return labels.busy ?? "Applying changes\u2026";
  if (state === "applied") return labels.applied?.(count) ?? `${count} ${count === 1 ? "edit" : "edits"} applied`;
  if (state === "error") return labels.error ?? "Could not apply changes";
  if (state === "cancelled") return labels.cancelled ?? "Changes cancelled";
  if (state === "disabled") return labels.disabled ?? "Changes unavailable";
  return null;
}
function DiffTable({
  rows,
  selectedIds,
  onSelectionChange,
  onApply,
  onReject,
  state = "idle",
  statusMessage,
  resultCount,
  labels,
  className
}) {
  const selected = new Set(selectedIds);
  const changeRows = rows.filter((row) => row.change !== "unchanged");
  const selectableRows = changeRows.filter((row) => !row.disabled);
  const validSelected = selectableRows.filter((row) => selected.has(row.id));
  const selectedValues = validSelected.map((row) => row.id);
  const removals = validSelected.filter((row) => row.change === "remove").length;
  const additions = validSelected.filter((row) => row.change === "add").length;
  const changeCount = removals + additions;
  const locked = state !== "idle";
  const requestStatus = stateText(state, labels ?? {}, resultCount ?? changeCount);
  const toggleRow = (row) => {
    if (locked || row.disabled || row.change === "unchanged" || !onSelectionChange) return;
    const next = new Set(selectedValues);
    if (next.has(row.id)) next.delete(row.id);
    else next.add(row.id);
    onSelectionChange(selectableRows.filter((candidate) => next.has(candidate.id)).map((candidate) => candidate.id));
  };
  const renderRow = (row) => {
    const changed = row.change !== "unchanged";
    const included = changed && !row.disabled && selected.has(row.id);
    const removed = row.change === "remove";
    const interactive = changed && !row.disabled && !locked && Boolean(onSelectionChange);
    const tint = included ? removed ? "bg-error-soft" : "bg-success-soft" : "";
    const cellTone = included ? removed ? "text-error" : "text-success" : "";
    const accessibleLabel = row.accessibleLabel ?? row.primary;
    return /* @__PURE__ */ jsxs(
      "tr",
      {
        tabIndex: interactive ? 0 : void 0,
        "aria-label": changed ? labels?.includeRow?.(accessibleLabel) ?? `Include change: ${accessibleLabel}` : void 0,
        "aria-selected": changed ? included : void 0,
        "aria-disabled": changed && !interactive ? true : void 0,
        onClick: interactive ? () => toggleRow(row) : void 0,
        onKeyDown: interactive ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleRow(row);
          }
        } : void 0,
        className: cn(
          "border-b border-border transition-[background-color,filter,opacity] duration-150 last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          tint,
          interactive && "cursor-pointer hover:brightness-[0.985]"
        ),
        children: [
          /* @__PURE__ */ jsx("td", { className: cn("px-3 @max-[320px]/diff:px-2 py-2.5 text-[13px] font-medium tabular-nums text-foreground transition-colors duration-200", cellTone), children: row.primary }),
          /* @__PURE__ */ jsx("td", { className: "px-3 @max-[320px]/diff:px-2 py-2.5", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex h-5 min-w-0 max-w-full items-center gap-1.5 rounded-full bg-muted px-2 @max-[320px]/diff:px-1.5 text-[11.5px] font-medium shadow-[0_0_0_1px_var(--border-default)]", children: [
            row.categoryTone ? /* @__PURE__ */ jsx("span", { className: cn("size-1.5 shrink-0 rounded-full", CATEGORY_TONE[row.categoryTone]), "aria-hidden": "true" }) : null,
            /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate text-[var(--text-secondary)]", children: row.category })
          ] }) }),
          /* @__PURE__ */ jsx(
            "td",
            {
              className: cn("px-3 @max-[320px]/diff:px-2 py-2.5 text-[12.5px] text-[var(--text-secondary)] transition-colors duration-200", cellTone, included && removed && "line-through"),
              style: included && removed ? { textDecorationColor: "color-mix(in srgb, var(--error) 50%, transparent)" } : void 0,
              children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", children: row.secondary }),
                changed ? /* @__PURE__ */ jsx(IncludedMark, { included, tone: removed ? "error" : "success" }) : null
              ] })
            }
          )
        ]
      },
      row.id
    );
  };
  return /* @__PURE__ */ jsx("div", { className: cn("@container/diff w-full max-w-[380px]", className), "data-yunui": "diff-table", "data-diff-state": state, children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl border border-border bg-card shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border px-3 py-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "min-w-0 text-[12.5px] font-medium text-foreground", children: labels?.title ?? "Proposed changes" }),
      state === "idle" && changeCount > 0 ? /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[11px] text-[var(--text-secondary)]", children: labels?.hint ?? "Select the changes to apply" }) : null
    ] }),
    /* @__PURE__ */ jsxs("table", { className: "w-full table-fixed border-collapse text-left", children: [
      /* @__PURE__ */ jsxs("colgroup", { children: [
        /* @__PURE__ */ jsx("col", { className: "w-[34%] @max-[320px]/diff:w-[40%]" }),
        /* @__PURE__ */ jsx("col", { className: "w-[30%] @max-[320px]/diff:w-[28%]" }),
        /* @__PURE__ */ jsx("col", { className: "w-[36%] @max-[320px]/diff:w-[32%]" })
      ] }),
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: [labels?.primaryColumn ?? "Item", labels?.categoryColumn ?? "Category", labels?.secondaryColumn ?? "Details"].map((heading, index) => /* @__PURE__ */ jsx("th", { scope: "col", className: "px-3 @max-[320px]/diff:px-2 py-2.5 whitespace-nowrap text-[12px] font-medium text-[var(--text-secondary)]", children: heading }, index)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: rows.map(renderRow) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex min-h-11 items-center justify-between gap-3 @max-[320px]/diff:flex-wrap border-t border-border px-2.5 py-2", children: state === "idle" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "min-w-0 @max-[320px]/diff:w-full text-[11.5px] tabular-nums text-[var(--text-secondary)]", "aria-live": "polite", children: labels?.selectionSummary?.(removals, additions) ?? `${removals} ${removals === 1 ? "removal" : "removals"} \xB7 ${additions} ${additions === 1 ? "addition" : "additions"}` }),
      /* @__PURE__ */ jsxs("span", { className: "flex shrink-0 items-center gap-1.5 @max-[320px]/diff:ml-auto", children: [
        onReject ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "h-7 rounded-full px-2.5 text-[12px]", onClick: () => onReject(selectedValues), children: labels?.reject ?? "Reject" }) : null,
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "primary",
            size: "sm",
            className: "h-7 rounded-full px-3 text-[12px]",
            disabled: !onApply || changeCount === 0,
            onClick: () => {
              if (onApply && changeCount > 0) onApply(selectedValues);
            },
            children: labels?.apply?.(changeCount) ?? `Apply ${changeCount} ${changeCount === 1 ? "change" : "changes"}`
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "min-w-0 text-[11.5px] text-[var(--text-secondary)]", children: statusMessage ?? requestStatus }) })
  ] }) });
}
var DEFAULT_LABELS2 = {
  keep: "Keep",
  discard: "Discard",
  placeholder: "Describe edits",
  submitInstruction: "Submit custom instruction",
  customAction: "Custom instruction",
  working: "Working",
  error: "The edit request failed. Original text is unchanged.",
  cancelled: "Edit request cancelled. Original text is unchanged.",
  retry: "Try again",
  showMoreActions: "Show more actions",
  showFewerActions: "Show fewer actions",
  result: "Suggested edit"
};
var iconProps = { size: 14, strokeWidth: 1.8, "aria-hidden": true };
var DEFAULT_ACTIONS = [
  { id: "Explain", action: "Explain", icon: /* @__PURE__ */ jsx(CircleHelp, { ...iconProps }) },
  { id: "Improve", action: "Improve", busyLabel: "Improving", icon: /* @__PURE__ */ jsx(Sparkles, { ...iconProps }) },
  { id: "Shorten", action: "Shorten", busyLabel: "Shortening", icon: /* @__PURE__ */ jsx(Scissors, { ...iconProps }) },
  { id: "Tone", action: "Change tone", busyLabel: "Changing tone", icon: /* @__PURE__ */ jsx(ThumbsUp, { ...iconProps }) },
  { id: "Grammar", action: "Fix grammar", icon: /* @__PURE__ */ jsx(Type, { ...iconProps }) }
];
var useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function SelectionActions({
  lead = "",
  selectedText,
  resultText,
  state = "idle",
  actions = DEFAULT_ACTIONS,
  busyLabel,
  labels,
  disabled = false,
  onAction,
  onAccept,
  onDismiss,
  onRetry,
  className
}) {
  const copy = mergeLabels(DEFAULT_LABELS2, labels);
  const [prompt, setPrompt] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [positioned, setPositioned] = useState(false);
  const [maxBarWidth, setMaxBarWidth] = useState(0);
  const hostRef = useRef(null);
  const selectionRef = useRef(null);
  const barRef = useRef(null);
  const frameRef = useRef(null);
  const previousSelectionRef = useRef(selectedText);
  const place = useCallback(() => {
    if (typeof window === "undefined") return;
    if (frameRef.current) {
      if (frameRef.current.kind === "raf") window.cancelAnimationFrame(frameRef.current.id);
      else window.clearTimeout(frameRef.current.id);
    }
    const measure = () => {
      frameRef.current = null;
      const host = hostRef.current;
      const selected = selectionRef.current;
      if (!host || !selected) return;
      const bounds = selected.getBoundingClientRect();
      const lines = Array.from(selected.getClientRects());
      const lastLine = lines.at(-1);
      const hostBounds = host.getBoundingClientRect();
      if (!lastLine || bounds.width === 0 || bounds.height === 0 || hostBounds.width === 0) {
        setPositioned(false);
        return;
      }
      const availableWidth = Math.max(0, Math.min(hostBounds.width - 16, window.innerWidth - 48));
      setMaxBarWidth((current) => Math.abs(current - availableWidth) < 1 ? current : availableWidth);
      const barWidth = barRef.current?.getBoundingClientRect().width ?? 0;
      const hostPadding = Math.min(8, hostBounds.width / 2);
      const halfBar = Math.min(barWidth / 2, Math.max(0, hostBounds.width / 2 - hostPadding));
      const minX = hostPadding + halfBar;
      const maxX = Math.max(minX, hostBounds.width - hostPadding - halfBar);
      const next = {
        x: Math.round(Math.min(maxX, Math.max(minX, bounds.left - hostBounds.left + bounds.width / 2))),
        y: Math.round(lastLine.bottom - hostBounds.top + 8)
      };
      setAnchor((current) => current.x === next.x && current.y === next.y ? current : next);
      setPositioned(true);
    };
    frameRef.current = typeof window.requestAnimationFrame === "function" ? { id: window.requestAnimationFrame(measure), kind: "raf" } : { id: window.setTimeout(measure, 0), kind: "timeout" };
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (previousSelectionRef.current !== selectedText) {
      previousSelectionRef.current = selectedText;
      setPrompt("");
      setExpanded(false);
    }
    place();
  }, [place, selectedText, resultText, state, lead]);
  useEffect(() => {
    const host = hostRef.current;
    const selected = selectionRef.current;
    if (!host) return;
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => place()) : null;
    if (resizeObserver) {
      resizeObserver.observe(host);
      if (selected) resizeObserver.observe(selected);
      if (barRef.current) resizeObserver.observe(barRef.current);
    }
    window.addEventListener("resize", place);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", place);
      if (frameRef.current) {
        if (frameRef.current.kind === "raf") window.cancelAnimationFrame(frameRef.current.id);
        else window.clearTimeout(frameRef.current.id);
        frameRef.current = null;
      }
    };
  }, [place]);
  const busy = state === "busy";
  const hasResult = state === "result" && typeof resultText === "string";
  const locked = busy || disabled;
  const visibleText = hasResult ? resultText : selectedText;
  const activity = busyLabel ?? labels?.working ?? DEFAULT_LABELS2.working;
  const run = (action, instruction) => {
    if (locked || !onAction) return;
    setExpanded(false);
    onAction(action, instruction);
  };
  const submitPrompt = (event) => {
    event.preventDefault();
    const instruction = prompt.trim();
    if (!instruction) return;
    run(labels?.customAction ?? DEFAULT_LABELS2.customAction, instruction);
  };
  return /* @__PURE__ */ jsx("div", { className: cn("@container/selection w-full max-w-[460px]", className), "data-yunui": "selection-actions", "data-selection-state": state, children: /* @__PURE__ */ jsxs("div", { ref: hostRef, "data-yunui": "selection-actions-host", className: "relative pb-12", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-[13px] leading-relaxed text-foreground", children: [
      lead,
      /* @__PURE__ */ jsxs("span", { ref: selectionRef, "data-yunui": "selection-actions-selected", style: hasResult && resultText === "" ? { display: "inline-block", minWidth: 1, minHeight: "1em" } : void 0, className: "box-decoration-clone rounded-[3px] bg-accent-subtle text-foreground", children: [
        hasResult ? /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
          copy.result,
          ": "
        ] }) : null,
        visibleText
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-yunui": "selection-actions-anchor",
        className: "absolute left-0 top-0 z-10",
        style: {
          transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
          transition: "transform 320ms cubic-bezier(0.77,0,0.175,1), opacity 180ms ease-out",
          opacity: positioned ? 1 : 0,
          pointerEvents: positioned ? "auto" : "none",
          willChange: "transform"
        },
        "aria-hidden": !positioned,
        inert: !positioned,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: barRef,
            className: cn(
              "flex w-fit max-w-[calc(100vw-48px)] items-center justify-center gap-0.5 rounded-full border border-border bg-card p-1 font-sans text-foreground shadow-lg",
              state === "error" || state === "cancelled" || busy ? "min-h-9" : "h-9 overflow-hidden"
            ),
            style: maxBarWidth > 0 ? { maxWidth: maxBarWidth } : void 0,
            children: [
              busy ? /* @__PURE__ */ jsxs("span", { role: "status", className: "inline-flex min-w-0 max-w-full items-center gap-1.5 whitespace-normal break-words px-2.5 py-1 text-[12.5px] text-[var(--text-secondary)]", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "size-3 shrink-0 rounded-full border-[1.5px] border-border border-t-foreground motion-safe:animate-spin" }),
                activity,
                "\u2026"
              ] }) : null,
              hasResult ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(Button, { type: "button", variant: "primary", size: "sm", className: "h-7 shrink-0 rounded-full px-2.5 text-[12.5px]", disabled: disabled || !onAccept, onClick: () => {
                  if (resultText !== void 0) onAccept?.(resultText);
                }, children: [
                  /* @__PURE__ */ jsx(Check, { "aria-hidden": "true", size: 14 }),
                  copy.keep
                ] }),
                onDismiss ? /* @__PURE__ */ jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "h-7 shrink-0 rounded-full px-2.5 text-[12.5px]", disabled, onClick: onDismiss, children: [
                  /* @__PURE__ */ jsx(X, { "aria-hidden": "true", size: 14 }),
                  copy.discard
                ] }) : null,
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mx-0.5 h-4 w-px shrink-0 bg-border" }),
                onRetry ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-7 shrink-0 rounded-full p-0", disabled, "aria-label": copy.retry, onClick: onRetry, children: /* @__PURE__ */ jsx(RefreshCw, { "aria-hidden": "true", size: 14 }) }) : null
              ] }) : null,
              state === "error" || state === "cancelled" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { role: "status", className: "min-w-0 max-w-[min(18rem,calc(100vw-8rem))] whitespace-normal break-words px-2 py-1 text-[11px] leading-snug text-[var(--text-secondary)]", children: state === "error" ? labels?.error ?? DEFAULT_LABELS2.error : labels?.cancelled ?? DEFAULT_LABELS2.cancelled }),
                onDismiss ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "h-7 shrink-0 rounded-full px-2.5 text-[12.5px]", disabled, onClick: onDismiss, children: copy.discard }) : null,
                onRetry ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-7 shrink-0 rounded-full p-0", disabled, "aria-label": copy.retry, onClick: onRetry, children: /* @__PURE__ */ jsx(RefreshCw, { "aria-hidden": "true", size: 14 }) }) : null
              ] }) : null,
              state === "idle" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-300",
                    "aria-hidden": expanded,
                    inert: expanded,
                    style: { maxWidth: expanded ? 0 : 145, opacity: expanded ? 0 : 1, transform: expanded ? "translateX(-8px)" : "translateX(0)", transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" },
                    children: /* @__PURE__ */ jsxs("form", { className: "flex h-7 w-[145px] min-w-0 shrink-0 items-center max-[420px]:w-[94px] @max-[360px]/selection:w-[94px]", onSubmit: submitPrompt, children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: prompt,
                          onChange: (event) => setPrompt(event.target.value),
                          "aria-label": copy.placeholder,
                          placeholder: copy.placeholder,
                          disabled: disabled || !onAction,
                          className: "h-7 w-full min-w-0 bg-transparent py-0 pr-2.5 pl-3 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none max-[420px]:pr-0 max-[420px]:pl-2 @max-[360px]/selection:pr-0 @max-[360px]/selection:pl-2"
                        }
                      ),
                      /* @__PURE__ */ jsx("button", { type: "submit", "aria-label": copy.submitInstruction, disabled: disabled || !onAction || !prompt.trim(), className: "mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-40", children: /* @__PURE__ */ jsx(ArrowUp, { "aria-hidden": "true", size: 13 }) })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mx-1 h-4 w-px shrink-0 bg-border" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-yunui": "selection-actions-scroll",
                    className: "flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none]",
                    children: (expanded ? actions : actions.slice(0, 2)).map((item) => /* @__PURE__ */ jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 shrink-0 rounded-full px-2.5 text-[12px]",
                        disabled: disabled || !onAction,
                        onClick: () => run(item.action ?? item.id),
                        children: [
                          item.icon,
                          item.label ?? item.id
                        ]
                      },
                      item.id
                    ))
                  }
                ),
                actions.length > 2 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mx-0.5 h-4 w-px shrink-0 bg-border" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": expanded ? copy.showFewerActions : copy.showMoreActions,
                      "aria-expanded": expanded,
                      disabled,
                      onClick: () => setExpanded((value) => !value),
                      className: "flex size-7 shrink-0 items-center justify-center rounded-full text-foreground transition-[background-color,transform] hover:bg-muted active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      children: /* @__PURE__ */ jsx(ChevronRight, { "aria-hidden": "true", size: 14, style: { transform: expanded ? "rotate(180deg)" : void 0 } })
                    }
                  )
                ] }) : null
              ] }) : null
            ]
          }
        )
      }
    )
  ] }) });
}
function IDBadge({
  text,
  truncate = true,
  size = "sm"
}) {
  const [copied, setCopied] = useState(false);
  const t = useYunUI().useT("common.badge");
  const sm = size === "sm";
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
        /* @__PURE__ */ jsx("span", { className: `font-mono block ${sm ? "px-1.5 py-0 text-[11px] leading-5 text-muted-foreground" : "px-2 py-0.5 text-xs"} ${truncate ? "truncate max-w-full min-w-0" : "whitespace-nowrap"}`, children: text }),
        /* @__PURE__ */ jsx("span", { className: `opacity-0 group-hover/badge:opacity-100 absolute right-0 inset-y-0 flex items-center justify-center rounded-r-md bg-muted/90 backdrop-blur-sm transition-opacity duration-200 ${sm ? "w-4" : "w-5"}`, children: copied ? /* @__PURE__ */ jsx(Check, { size: sm ? 9 : 10 }) : /* @__PURE__ */ jsx(Copy, { size: sm ? 9 : 10 }) })
      ]
    }
  );
}
var CAPABILITY_ICONS = {
  streaming: { color: capabilityIconColor("streaming"), icon: Waves },
  vision: { color: capabilityIconColor("vision"), icon: Eye },
  thinking: { color: capabilityIconColor("thinking"), icon: Brain },
  function_calling: { color: capabilityIconColor("function_calling"), icon: Code },
  image_edit: { color: capabilityIconColor("image_edit"), icon: Image },
  negative_prompt: { color: capabilityIconColor("negative_prompt"), icon: Ban },
  seed_control: { color: capabilityIconColor("seed_control"), icon: Fingerprint },
  lora: { color: capabilityIconColor("lora"), icon: Layers },
  guidance_scale: { color: capabilityIconColor("guidance_scale"), icon: SlidersHorizontal },
  strength: { color: capabilityIconColor("strength"), icon: SlidersHorizontal },
  batch: { color: capabilityIconColor("batch"), icon: Waves }
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
  const cardRef = useRef(null);
  const selectionOnPointerDown = useRef(null);
  const shownCaps = capabilities.filter((c) => CAPABILITY_ICONS[c]).slice(0, 4);
  const handleCardPointerDown = () => {
    selectionOnPointerDown.current = window.getSelection()?.toString() ?? "";
  };
  const handleCardClick = (event) => {
    if (!onClick) return;
    const target = event.target;
    if (target instanceof Element && target.closest("button, a, input, select, textarea, label, summary, [contenteditable='true'], [tabindex]:not([tabindex='-1']), [role='button'], [role='link'], [role='menuitem'], [role='checkbox'], [role='radio'], [role='switch'], [role='combobox'], [role='textbox'], [role='slider'], [role='option'], [role='tab'], [role='treeitem'], [data-model-card-interactive]")) return;
    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    const previousSelection = selectionOnPointerDown.current;
    selectionOnPointerDown.current = null;
    if (selectedText && previousSelection !== null && selectedText !== previousSelection && selection?.anchorNode && cardRef.current?.contains(selection.anchorNode)) return;
    if (selectedText && previousSelection === null && selection?.anchorNode && cardRef.current?.contains(selection.anchorNode)) return;
    onClick();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      onPointerDown: handleCardPointerDown,
      onClick: handleCardClick,
      className: `card card-interactive p-4 text-left w-full group cursor-pointer flex flex-col relative ${className}`,
      children: [
        onClick && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": name,
            "data-model-card-action": true,
            onClick: (event) => {
              event.stopPropagation();
              onClick();
            },
            className: "absolute inset-0 z-0 rounded-[inherit] border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: onClick ? "relative z-[1] flex flex-1 flex-col" : void 0, children: [
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
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5em]", children: description ?? /* @__PURE__ */ jsx("span", { className: "opacity-40", children: labels?.noDescription ?? "No description" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
              developer?.iconUrl && /* @__PURE__ */ jsx("div", { className: "rounded-md overflow-hidden bg-muted", style: { width: 12, height: 12 }, children: /* @__PURE__ */ jsx(Image, { src: developer.iconUrl, alt: developer.label, width: 12, height: 12, className: "object-cover" }) }),
              developer?.label && /* @__PURE__ */ jsx("span", { className: "truncate min-w-0", children: developer.label })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              context && /* @__PURE__ */ jsx("span", { className: "bg-muted px-1.5 py-0.5 rounded-sm font-medium", children: context }),
              tier && tier !== "free" && /* @__PURE__ */ jsx("span", { className: "bg-warning-soft text-warning px-1.5 py-0.5 rounded-sm font-medium", children: tier }),
              price != null && /* @__PURE__ */ jsx("span", { className: "font-mono", children: price })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function HScrollRow({ children, className }) {
  const scrollRef = useRef(null);
  const [thumb, setThumb] = useState({ w: 0, x: 0, show: false });
  const sync = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    const overflow = scrollWidth - clientWidth;
    if (overflow <= 1) {
      setThumb((t) => t.show ? { w: 0, x: 0, show: false } : t);
      return;
    }
    const w = Math.max(clientWidth / scrollWidth * clientWidth, 28);
    const x = scrollLeft / overflow * (clientWidth - w);
    setThumb({ w, x, show: true });
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", sync);
      ro?.disconnect();
    };
  }, []);
  const onThumbDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    const move = (ev) => {
      const { scrollWidth, clientWidth } = el;
      const w = Math.max(clientWidth / scrollWidth * clientWidth, 28);
      const travel = clientWidth - w;
      if (travel <= 0) return;
      el.scrollLeft = startScroll + (ev.clientX - startX) / travel * (scrollWidth - clientWidth);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollRef,
        className: cn(
          "overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className
        ),
        children
      }
    ),
    thumb.show && /* @__PURE__ */ jsx(
      "div",
      {
        onPointerDown: onThumbDown,
        role: "scrollbar",
        "aria-orientation": "horizontal",
        "aria-hidden": true,
        className: "absolute bottom-0 left-0 h-1.5 rounded-full bg-muted-foreground/40 hover:bg-muted-foreground/60 active:bg-muted-foreground/70 cursor-grab active:cursor-grabbing touch-none transition-colors",
        style: { width: `${thumb.w}px`, transform: `translateX(${thumb.x}px)` }
      }
    )
  ] });
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
  renderFooter,
  renderHeader,
  filterResetKey
}) {
  const L = {
    placeholder: "Select a model",
    search: "Search models\u2026",
    clearSearch: "Clear",
    clearFilters: "Clear filters",
    all: "All",
    pinned: "Pinned",
    noResults: "No models found",
    pin: "Pin",
    unpin: "Unpin",
    ...labels
  };
  const [isOpen, setIsOpen] = useState(false);
  const instanceId = useId();
  const listboxId = `yunui-ms-${instanceId}-listbox`;
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  useEffect(() => {
    setSearch("");
    setActiveFilters([]);
    setActiveGroup(null);
  }, [filterResetKey]);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
    document.addEventListener("keydown", onEscape, true);
    return () => document.removeEventListener("keydown", onEscape, true);
  }, [isOpen]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const pinFocusRef = useRef(null);
  useEffect(() => {
    const request = pinFocusRef.current;
    if (!request) return;
    if (!isOpen) {
      pinFocusRef.current = null;
      return;
    }
    if (request.source.isConnected) return;
    pinFocusRef.current = null;
    if (document.activeElement === document.body) {
      listRef.current?.querySelector(`button[data-pin-id="${rowDomId(request.id)}"]`)?.focus();
    }
  }, [pinned, isOpen]);
  const togglePin = (id, source) => {
    pinFocusRef.current = document.activeElement === source ? { id, source } : null;
    onTogglePin?.(id);
  };
  const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);
  const pinnedSet = useMemo(() => new Set(pinned ?? []), [pinned]);
  useDismissOnOutside(isOpen, () => setIsOpen(false), rootRef, { escape: false });
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
      if (value && listRef.current) {
        const el = listRef.current.querySelector(`[data-model-id="${CSS.escape(value)}"]`);
        el?.scrollIntoView({ block: "nearest" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen, value]);
  const groups = useMemo(() => {
    const counts = /* @__PURE__ */ Object.create(null);
    for (const o of options) counts[o.group] = (counts[o.group] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([g]) => g);
  }, [options]);
  const groupLabel = useMemo(() => {
    const m = /* @__PURE__ */ Object.create(null);
    for (const o of options) if (o.groupLabel) m[o.group] = o.groupLabel;
    return m;
  }, [options]);
  const groupIcon = useMemo(() => {
    const m = /* @__PURE__ */ Object.create(null);
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
  const pinnedList = useMemo(() => filtered.filter((o) => pinnedSet.has(o.id)), [filtered, pinnedSet]);
  const grouped = useMemo(() => {
    const acc = /* @__PURE__ */ Object.create(null);
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
  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const panelMaxHeight = maxHeight == null ? "min(32rem, calc(100dvh - 7rem))" : `min(${maxHeight}px, 32rem, calc(100dvh - 7rem))`;
  const flatOptions = useMemo(() => {
    const out = [...pinnedList];
    for (const opts of Object.values(grouped)) out.push(...opts);
    return out;
  }, [pinnedList, grouped]);
  const enabledOptions = useMemo(() => flatOptions.filter((option) => !option.disabled), [flatOptions]);
  const select = (id) => {
    const option = options.find((item) => item.id === id);
    if (!option || option.disabled) return;
    onChange(id);
    closeAndRestoreFocus();
  };
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    setActiveIndex(-1);
  }, [isOpen, search, activeGroup, activeFilters, enabledOptions]);
  const clearActiveOnPointer = () => setActiveIndex((i) => i === -1 ? i : -1);
  useEffect(() => {
    const id = enabledOptions[activeIndex]?.id;
    if (!isOpen || !id || !listRef.current) return;
    listRef.current.querySelector(`[data-model-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, enabledOptions]);
  const activeId = enabledOptions[activeIndex]?.id;
  const rowDomId = (id) => `yunui-ms-${instanceId}-opt-${Array.from(id, (char) => char.codePointAt(0).toString(16)).join("-")}`;
  const onSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, enabledOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => i < 0 ? enabledOptions.length - 1 : Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = enabledOptions[activeIndex] ?? enabledOptions[0];
      if (o) select(o.id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeAndRestoreFocus();
    }
  };
  return (
    // Fixed-width root so the trigger doesn't grow/shrink as the selected
    // label changes; override the width via `className`.
    /* @__PURE__ */ jsxs("div", { ref: rootRef, className: cn("relative w-64", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          type: "button",
          onClick: () => setIsOpen((o) => !o),
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
          "aria-controls": isOpen ? listboxId : void 0,
          className: cn(
            "flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-left group transition-all w-full shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
          "data-yunui": "model-select-panel",
          style: { maxWidth: "calc(100vw - 1rem)", marginLeft: shift, maxHeight: panelMaxHeight },
          className: `absolute z-50 left-0 ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} w-96 max-w-[calc(100vw-1rem)] flex flex-col bg-popover border border-border rounded-2xl shadow-lg shadow-black/5 text-popover-foreground overflow-hidden`,
          children: [
            renderHeader && /* @__PURE__ */ jsx("div", { className: "p-2.5 border-b border-border/50", children: renderHeader() }),
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
                    "aria-controls": listboxId,
                    "aria-activedescendant": activeId != null ? rowDomId(activeId) : void 0,
                    className: "w-full pl-9 pr-8 py-2 text-base md:text-sm bg-muted/50 border border-transparent rounded-xl outline-none focus:border-ring focus:bg-background transition-colors"
                  }
                ),
                search && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSearch(""), title: L.clearSearch, "aria-label": L.clearSearch, className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 min-w-6 min-h-6 inline-flex items-center justify-center rounded-md hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { size: 13 }) })
              ] }),
              filters && filters.length > 0 && /* @__PURE__ */ jsx(HScrollRow, { className: "mt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-2.5 pb-2 w-max", children: [
                filters.map((f) => {
                  const on = activeFilters.includes(f.key);
                  return /* @__PURE__ */ jsx("button", { type: "button", title: f.title, "aria-label": f.title, "aria-pressed": on, onClick: () => setActiveFilters((p) => p.includes(f.key) ? p.filter((k) => k !== f.key) : [...p, f.key]), className: cn("shrink-0 p-1 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "bg-foreground/10" : "hover:bg-muted"), children: f.node }, f.key);
                }),
                activeFilters.length > 0 && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setActiveFilters([]), title: L.clearFilters, "aria-label": L.clearFilters, className: "shrink-0 p-1 min-w-6 min-h-6 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { size: 14 }) })
              ] }) })
            ] }),
            groups.length > 1 && /* @__PURE__ */ jsx("div", { className: "border-b border-border/50", children: /* @__PURE__ */ jsx(HScrollRow, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 px-2.5 pt-2 pb-2.5 w-max", children: [
              /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveGroup(null), "aria-pressed": !activeGroup, className: cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", !activeGroup ? "bg-foreground text-background" : "bg-muted text-(--text-secondary) hover:bg-muted/80"), children: [
                L.all,
                " (",
                options.length,
                ")"
              ] }),
              groups.map((g) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveGroup((c) => c === g ? null : g), "aria-pressed": activeGroup === g, className: cn("px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring", activeGroup === g ? "bg-foreground text-background" : "bg-muted text-(--text-secondary) hover:bg-muted/80"), children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "inline-flex", children: groupIcon[g] }),
                groupLabel[g] ?? g
              ] }, g))
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { ref: listRef, onWheel, onMouseMove: clearActiveOnPointer, className: "flex-1 min-h-0 max-h-96 overflow-y-auto overscroll-contain", children: [
              /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", "aria-label": L.placeholder, "aria-owns": flatOptions.length ? flatOptions.map((option) => rowDomId(option.id)).join(" ") : `${listboxId}-empty` }),
              pinnedList.length > 0 && /* @__PURE__ */ jsxs("div", { role: "presentation", className: "px-1.5 py-1.5 border-b border-border/40", children: [
                /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "text-[10px] font-medium text-(--text-secondary) uppercase tracking-wide px-2 mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Pin, { size: 9 }),
                  " ",
                  L.pinned
                ] }),
                pinnedList.map((o) => /* @__PURE__ */ jsx(ModelRow, { domId: rowDomId(o.id), active: o.id === activeId, option: o, selected: o.id === value, pinned: true, isPinnable: !!onTogglePin, pinLabel: L.pin, unpinLabel: L.unpin, pinnedLabel: L.pinned, onSelect: () => select(o.id), onTogglePin: (source) => togglePin(o.id, source) }, o.id))
              ] }),
              /* @__PURE__ */ jsx("div", { role: "presentation", className: "px-1.5 py-1.5", children: Object.entries(grouped).map(([g, opts]) => /* @__PURE__ */ jsxs("div", { role: "presentation", className: "mb-3 last:mb-0", children: [
                /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "sticky top-0 z-10 pt-1 pb-1.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-muted px-3 py-2", children: [
                  groupIcon[g],
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-(--text-secondary)", children: groupLabel[g] ?? g }),
                  /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 min-w-5 text-center text-[10px] font-semibold tabular-nums text-(--text-secondary) bg-foreground/10 px-1.5 py-0.5 rounded-md", children: opts.length })
                ] }) }),
                opts.map((o) => /* @__PURE__ */ jsx(ModelRow, { domId: rowDomId(o.id), active: o.id === activeId, option: o, selected: o.id === value, pinned: false, isPinnable: !!onTogglePin, pinLabel: L.pin, unpinLabel: L.unpin, pinnedLabel: L.pinned, onSelect: () => select(o.id), onTogglePin: (source) => togglePin(o.id, source) }, o.id))
              ] }, g)) }),
              filtered.length === 0 && /* @__PURE__ */ jsxs("div", { id: `${listboxId}-empty`, role: "option", "aria-disabled": "true", "aria-selected": "false", className: "py-12 text-center text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Sparkles, { size: 28, className: "mx-auto mb-3 opacity-40" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm", children: L.noResults })
              ] })
            ] }),
            renderFooter && filtered.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-border/50 px-3 py-2 bg-muted/30 text-xs text-(--text-secondary)", children: renderFooter(filtered.length) })
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
  onTogglePin,
  pinLabel,
  unpinLabel,
  pinnedLabel
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-model-id": option.id,
      role: "presentation",
      onClick: option.disabled ? void 0 : onSelect,
      className: cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors",
        // A clear gray fill on both states (selected solid, hover lighter)
        // — the bar's opacity then tells selected from merely-hovered.
        selected ? "bg-muted" : "hover:bg-muted",
        // keyboard highlight (arrow-key navigation)
        active && "bg-muted ring-2 ring-ring/40"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            id: domId,
            role: "option",
            "aria-selected": selected,
            "aria-description": `${pinned ? `${pinnedLabel}, ` : ""}${option.groupLabel ?? option.group}`,
            "aria-disabled": option.disabled || void 0,
            className: "flex flex-1 min-w-0 items-center gap-3 self-stretch",
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
              option.meta && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 shrink-0", children: option.meta })
            ]
          }
        ),
        isPinnable && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-pin-id": domId,
            "aria-pressed": pinned,
            "aria-describedby": domId,
            onClick: (e) => {
              e.stopPropagation();
              onTogglePin(e.currentTarget);
            },
            className: cn(
              "p-1.5 rounded-md transition-all shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pinned ? "text-foreground opacity-100 hover:bg-muted/50" : "text-(--text-secondary) hover:text-foreground hover:bg-muted/50"
            ),
            "aria-label": pinned ? unpinLabel : pinLabel,
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
  { value: "chat", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "streaming", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" },
  { value: "function_calling", icon: Code, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
  { value: "vision", icon: Eye, iconColor: "text-amber-500", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20" },
  { value: "thinking", icon: Brain, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20" }
];
var imageCapabilityConfig = [
  { value: "image_edit", icon: Pencil, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "negative_prompt", icon: Ban, iconColor: "text-red-500", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20" },
  { value: "seed_control", icon: Fingerprint, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" },
  { value: "lora", icon: Layers, iconColor: "text-teal-500", color: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20" },
  { value: "guidance_scale", icon: SlidersHorizontal, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" },
  { value: "strength", icon: SlidersHorizontal, iconColor: "text-orange-500", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
  { value: "batch", icon: Waves, iconColor: "text-cyan-500", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" }
];
var audioCapabilityConfig = [
  { value: "tts", icon: Mic, iconColor: "text-green-500", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20" },
  { value: "stt", icon: MessageSquare, iconColor: "text-blue-500", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  { value: "audio_translation", icon: Waves, iconColor: "text-purple-500", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20" }
];
var videoCapabilityConfig = [
  { value: "video_generation", icon: Video, iconColor: "text-red-500", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20" }
];
var musicCapabilityConfig = [
  { value: "music_generation", icon: Music, iconColor: "text-pink-500", color: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20" }
];
var threedCapabilityConfig = [
  { value: "threed_generation", icon: Box, iconColor: "text-indigo-500", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" }
];
var realtimeCapabilityConfig = [
  { value: "realtime_voice", icon: Radio, iconColor: "text-yellow-500", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" }
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
var modelDeveloperPatterns = [
  [/claude|anthropic/, "claude"],
  [/gemini/, "gemini"],
  [/gemma/, "gemma"],
  [/palm|bison/, "palm"],
  [/gpt|openai|davinci|chatgpt|text-embedding|dall-?e|whisper|codex|o[134]-/, "openai"],
  [/glm|chatglm|zhipu|z\.?ai/, "zai"],
  [/minimax|hailuo|abab/, "minimax"],
  [/qwen|qwq|dashscope|alibaba|tongyi/, "qwen"],
  [/deepseek/, "deepseek"],
  [/llama|meta-/, "meta"],
  [/mistral|mixtral|codestral|pixtral|magistral|ministral/, "mistral"],
  [/grok|x-?ai/, "xai"],
  [/moonshot|kimi/, "moonshot"],
  [/doubao/, "doubao"],
  [/hunyuan/, "hunyuan"],
  [/ernie|wenxin|baidu/, "wenxin"],
  [/step-|stepfun/, "stepfun"],
  [/yi-|zero-one|01-ai/, "yi"],
  [/command|cohere/, "cohere"],
  [/phi-\d|microsoft/, "microsoft"],
  [/nemotron|nvidia/, "nvidia"],
  [/internlm|internvl/, "internlm"],
  [/flux/, "flux"]
];
function getModelDeveloperId(...identifiers) {
  const haystack = identifiers.filter(Boolean).join(" ").toLowerCase();
  for (const [pattern, developer] of modelDeveloperPatterns) {
    if (pattern.test(haystack)) return developer;
  }
  const first = identifiers.find((value) => Boolean(value));
  if (!first) return "";
  const parts = first.split("/").filter(Boolean);
  return parts.at(-1) || first;
}
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
  gmi: "gmi.svg",
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
  const { iconBasePath } = useYunUI();
  const sourceKey = JSON.stringify([provider ?? "", iconUrl ?? null, iconBasePath]);
  return /* @__PURE__ */ jsx(
    ProviderIconStateful,
    {
      provider,
      className,
      size,
      rounded,
      iconUrl,
      iconBasePath
    },
    sourceKey
  );
}
function ProviderIconStateful({
  provider,
  className = "",
  size = 20,
  rounded = false,
  iconUrl,
  iconBasePath
}) {
  const { Image } = useYunUI();
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
  gmi: "GMI Cloud",
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
  const { iconBasePath } = useYunUI();
  const sourceKey = JSON.stringify([iconUrl ?? null, developer ?? null, provider ?? "", iconBasePath]);
  return /* @__PURE__ */ jsx(
    ModelIconStateful,
    {
      iconUrl,
      developer,
      provider,
      className,
      size,
      rounded,
      iconBasePath
    },
    sourceKey
  );
}
function ModelIconStateful({
  iconUrl,
  developer,
  provider,
  className = "",
  size = 20,
  rounded = false,
  iconBasePath
}) {
  const { Image } = useYunUI();
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
  chat: /* @__PURE__ */ jsx(MessageSquare, { size: 16, className: "text-blue-600" }),
  completion: /* @__PURE__ */ jsx(FileText, { size: 16, className: "text-gray-600" }),
  embedding: /* @__PURE__ */ jsx(Hash, { size: 16, className: "text-purple-600" }),
  image_generation: /* @__PURE__ */ jsx(Palette, { size: 16, className: "text-pink-600" }),
  audio: /* @__PURE__ */ jsx(Headphones, { size: 16, className: "text-orange-600" }),
  tts: /* @__PURE__ */ jsx(Volume2, { size: 16, className: "text-green-600" }),
  stt: /* @__PURE__ */ jsx(Mic, { size: 16, className: "text-red-600" }),
  video: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-600" }),
  video_generation: /* @__PURE__ */ jsx(Video, { size: 16, className: "text-cyan-600" }),
  music_generation: /* @__PURE__ */ jsx(Music, { size: 16, className: "text-orange-600" }),
  rerank: /* @__PURE__ */ jsx(Shuffle, { size: 16, className: "text-indigo-600" }),
  moderation: /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-yellow-600" }),
  "3d": /* @__PURE__ */ jsx(Box, { size: 16, className: "text-amber-600" }),
  realtime: /* @__PURE__ */ jsx(Radio, { size: 16, className: "text-yellow-600" })
};
function ModelTypeIcon({ type, size = 16 }) {
  const icon = MODEL_TYPE_ICONS[type.toLowerCase()];
  if (icon) {
    return /* @__PURE__ */ jsx("span", { className: "inline-flex", style: { transform: size !== 16 ? `scale(${size / 16})` : void 0 }, children: icon });
  }
  return /* @__PURE__ */ jsx(Bot, { size, className: "text-muted-foreground" });
}
var variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80 disabled:bg-secondary disabled:text-secondary-foreground",
  outline: "border border-border hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  secondary: "border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
};
var buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
  const id = useId();
  const panelId = `${id}-language-options`;
  const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);
  useDismissOnOutside(isOpen, () => setIsOpen(false), containerRef, { escape: false });
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [isOpen]);
  const handleLocaleChange = (newLocale) => {
    if (pending) return;
    setIsOpen(false);
    if (newLocale === currentLocale) return;
    onChange(newLocale);
  };
  const currentLabel = locales.find((l) => l.value === currentLocale)?.label ?? currentLocale;
  return (
    // inline-flex so the root shrink-wraps the trigger; a block root filled the row and made the
    // right-0 dropdown anchor to the row's far edge instead of the trigger.
    /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative inline-flex ${className}`, children: [
      variant === "pill" ? /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          type: "button",
          onClick: () => setIsOpen(!isOpen),
          className: "flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full text-sm font-medium transition-all bg-(--bg-elevated) hover:bg-(--bg-elevated)/80 border border-(--border-hairline) text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled: pending,
          "aria-label": `${label}: ${currentLabel}`,
          "aria-expanded": isOpen,
          "aria-controls": isOpen ? panelId : void 0,
          children: [
            /* @__PURE__ */ jsx(Globe, { size: 14, className: "shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: currentLabel })
          ]
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          ref: triggerRef,
          type: "button",
          onClick: () => setIsOpen(!isOpen),
          className: "w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled: pending,
          "aria-label": `${label}: ${currentLabel}`,
          "aria-expanded": isOpen,
          "aria-controls": isOpen ? panelId : void 0,
          children: /* @__PURE__ */ jsx(Globe, { className: "h-[1.2rem] w-[1.2rem]" })
        }
      ),
      isOpen && /* @__PURE__ */ jsx(
        "div",
        {
          ref: panelRef,
          id: panelId,
          role: "group",
          "aria-label": label,
          "aria-busy": pending || void 0,
          style: { ...align === "left" ? { marginLeft: shift } : { marginRight: -shift }, maxHeight },
          className: `absolute ${align === "left" ? "left-0" : "right-0"} ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-popover/95 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 animate-in fade-in-0 zoom-in-95 duration-200`,
          children: /* @__PURE__ */ jsx("div", { className: "p-1 flex-1 min-h-0 overflow-y-auto", children: locales.map((lang) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: pending,
              "aria-pressed": currentLocale === lang.value,
              onClick: () => handleLocaleChange(lang.value),
              className: `dropdown-item w-full text-left !text-[var(--text-secondary)] ${currentLocale === lang.value ? "active" : ""}`,
              style: currentLocale === lang.value ? { color: "var(--text-primary)" } : void 0,
              children: /* @__PURE__ */ jsx("span", { className: "flex-1", children: lang.label })
            },
            lang.value
          )) })
        }
      )
    ] })
  );
}
function AccountMenu({
  user,
  items = [],
  signInHref,
  onSignOut,
  labels,
  className
}) {
  const { Link } = useYunUI();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const { shift, maxHeight, placement } = useAnchoredPosition(open, menuRef);
  const menuId = `${useId()}-account-menu`;
  const signInLabel = labels?.signIn ?? "Sign in";
  const signOutLabel = labels?.signOut ?? "Sign out";
  const fallbackName = labels?.fallbackName ?? "Account";
  useDismissOnOutside(open, () => setOpen(false), ref, { escape: false });
  const identityKey = user == null ? String(user) : JSON.stringify([user.name ?? "", user.email ?? "", user.avatarUrl ?? ""]);
  useEffect(() => setOpen(false), [identityKey]);
  useEffect(() => {
    if (!open) return;
    const focusableItems = () => Array.from(
      menuRef.current?.querySelectorAll("[role='menuitem']:not([aria-disabled='true'])") ?? []
    );
    const focusFirstItem = () => focusableItems()[0]?.focus();
    const frame = requestAnimationFrame(focusFirstItem);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key === "Tab") {
        setOpen(false);
        return;
      }
      const items2 = focusableItems();
      if (!items2.length) return;
      const currentIndex = items2.indexOf(document.activeElement);
      let nextIndex;
      if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items2.length;
      else if (event.key === "ArrowUp") nextIndex = currentIndex < 0 ? items2.length - 1 : (currentIndex - 1 + items2.length) % items2.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = items2.length - 1;
      if (nextIndex !== void 0) {
        event.preventDefault();
        event.stopPropagation();
        items2[nextIndex]?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);
  if (user === void 0) {
    return /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn("block h-9 w-9", className) });
  }
  if (user === null) {
    return /* @__PURE__ */ jsx(
      Link,
      {
        href: signInHref,
        "aria-label": signInLabel,
        className: cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground",
          className
        ),
        children: /* @__PURE__ */ jsx(CircleUserRound, { className: "h-4 w-4" })
      }
    );
  }
  const name = user.name || fallbackName;
  return /* @__PURE__ */ jsxs("div", { ref, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: () => setOpen((v) => !v),
        "aria-haspopup": "menu",
        "aria-controls": open ? menuId : void 0,
        "aria-expanded": open,
        "aria-label": labels?.menu ?? name,
        className: "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-foreground/5 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        children: user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          /* @__PURE__ */ jsx("img", { src: user.avatarUrl, alt: "", width: 28, height: 28, className: "h-7 w-7 rounded-full" })
        ) : /* @__PURE__ */ jsx(CircleUserRound, { className: "h-4 w-4 text-muted-foreground" })
      }
    ),
    open && /* @__PURE__ */ jsxs(
      "div",
      {
        id: menuId,
        ref: menuRef,
        role: "menu",
        style: { marginRight: -shift, maxHeight },
        className: `absolute right-0 ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"} z-50 w-56 overflow-y-auto rounded-2xl border border-border bg-popover/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-2xl`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-border px-3 py-2.5", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium", children: name }),
            user.email && /* @__PURE__ */ jsx("p", { className: "text-caption truncate", children: user.email })
          ] }),
          items.map((item) => {
            const Icon = item.icon;
            const body = /* @__PURE__ */ jsxs(Fragment, { children: [
              Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }),
              item.label
            ] });
            const rowClass = "mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
            return item.onSelect ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                role: "menuitem",
                onClick: () => {
                  item.onSelect?.();
                  setOpen(false);
                },
                className: rowClass,
                children: body
              },
              item.key
            ) : /* @__PURE__ */ jsx(
              Link,
              {
                href: item.href ?? "#",
                role: "menuitem",
                onClick: () => setOpen(false),
                className: rowClass,
                children: body
              },
              item.key
            );
          }),
          onSignOut && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "menuitem",
              onClick: () => {
                onSignOut();
                setOpen(false);
              },
              className: "mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4", "aria-hidden": true }),
                signOutLabel
              ]
            }
          )
        ]
      }
    )
  ] });
}

export { AccountMenu, AgentRunStatus, AgentTimeline, ApprovalQuestion, CapabilityIcon, CapabilitySelector, DiffTable, IDBadge, LanguageSwitcher, ModelAvatar, ModelCard, ModelIcon, ModelManagerCard, ModelSelect, ModelTypeIcon, PROVIDER_ICON_SLUGS, ProviderAvatar, ProviderIcon, ProviderIconImg, ProviderNames, SelectionActions, ThinkingBlock, buttonVariants, getDeveloperIconPath, getIconPath, getModelDeveloperId, getProviderIconOptions, getProviderName, isKnownCapability, normalizeProviderId };
//# sourceMappingURL=ai.js.map
//# sourceMappingURL=ai.js.map