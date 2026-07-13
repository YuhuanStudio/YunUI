"use client";
import { cn, useAnchoredPosition } from './chunk-J5MNZHQB.js';
import { useYunUI } from './chunk-3RT24MSH.js';
import * as React7 from 'react';
import { forwardRef, useRef, useCallback, useEffect, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Check, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Loader2, AlertCircle, EyeOff, Eye, Plus, Search, X, CheckCircle2, CheckCircle, Info, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

function useEscapeKey(onEscape, enabled = true) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabledRef.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscapeRef.current();
      }
    },
    []
    // No dependencies - uses refs
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);
}
var scrollLockCount = 0;
var originalOverflow = "";
function useBodyScrollLock(locked = true) {
  const hasLockedRef = useRef(false);
  useEffect(() => {
    if (!locked) {
      if (hasLockedRef.current) {
        scrollLockCount--;
        hasLockedRef.current = false;
        if (scrollLockCount === 0) {
          document.body.style.overflow = originalOverflow;
          originalOverflow = "";
        }
      }
      return;
    }
    if (!hasLockedRef.current) {
      if (scrollLockCount === 0) {
        originalOverflow = document.body.style.overflow;
      }
      scrollLockCount++;
      document.body.style.overflow = "hidden";
      hasLockedRef.current = true;
    }
    return () => {
      if (hasLockedRef.current) {
        scrollLockCount--;
        hasLockedRef.current = false;
        if (scrollLockCount === 0) {
          document.body.style.overflow = originalOverflow;
          originalOverflow = "";
        }
      }
    };
  }, [locked]);
}
function useModalBehavior(isOpen, onClose) {
  useEscapeKey(onClose, isOpen);
  useBodyScrollLock(isOpen);
}
var FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
function useFocusTrap(containerRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement;
    const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
    const initial = getFocusable();
    (initial[0] ?? container).focus?.();
    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [enabled, containerRef]);
}

// src/primitives/modal/constants.ts
var Z_INDEX = {
  MODAL: 50,
  CONFIRM_DIALOG: 60};
var SIZE_CLASSES = {
  sm: "max-w-sm",
  // 384px
  md: "max-w-md",
  // 448px
  lg: "max-w-lg",
  // 512px
  xl: "max-w-xl",
  // 576px
  "2xl": "max-w-2xl",
  // 672px
  "3xl": "max-w-3xl",
  // 768px
  "4xl": "max-w-4xl",
  // 896px
  "5xl": "max-w-5xl",
  // 1024px
  "6xl": "max-w-6xl",
  // 1152px
  full: "max-w-[95vw]"
  // 95% viewport width
};
var ANIMATION_DURATION = 150;
var DEFAULT_MAX_HEIGHT = "85vh";
var closeIdCounter = 0;
var variantConfig = {
  danger: {
    iconBg: "bg-error-soft",
    iconColor: "text-error",
    buttonVariant: "red",
    Icon: Trash2
  },
  warning: {
    iconBg: "bg-warning-soft",
    iconColor: "text-warning",
    buttonVariant: "amber",
    Icon: RefreshCw
  },
  info: {
    iconBg: "bg-info-soft",
    iconColor: "text-info",
    buttonVariant: "default",
    Icon: Info
  },
  success: {
    iconBg: "bg-success-soft",
    iconColor: "text-success",
    buttonVariant: "default",
    Icon: CheckCircle
  }
};
function ConfirmModal({
  isOpen,
  title,
  subtitle,
  message,
  variant = "warning",
  confirmText,
  cancelText,
  isLoading = false,
  onConfirm,
  onClose,
  className,
  icon
}) {
  const t = useYunUI().useT("components.confirmModal");
  const confirmButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const timeoutRef = useRef(null);
  const closeIdRef = useRef(0);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const config = variantConfig[variant];
  useFocusTrap(dialogRef, isOpen && !isClosing && mounted);
  const _confirmText = confirmText ?? t("confirm");
  const _cancelText = cancelText ?? t("cancel");
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  const isClosingRef = useRef(isClosing);
  isClosingRef.current = isClosing;
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const handleClose = useCallback(() => {
    if (isClosingRef.current || isLoadingRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const currentCloseId = ++closeIdCounter;
    closeIdRef.current = currentCloseId;
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      if (closeIdRef.current === currentCloseId) {
        onCloseRef.current();
        setIsClosing(false);
        timeoutRef.current = null;
      }
    }, ANIMATION_DURATION);
  }, []);
  useEscapeKey(handleClose, isOpen);
  useBodyScrollLock(isOpen);
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && isClosing) {
      setIsClosing(false);
    }
  }, [isOpen, isClosing]);
  if (!isOpen || !mounted) return null;
  const Icon2 = config.Icon;
  const modalContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "fixed inset-0 flex items-center justify-center p-4 transition-opacity",
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      ),
      style: { zIndex: Z_INDEX.CONFIRM_DIALOG },
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "confirm-modal-title",
      "aria-describedby": "confirm-modal-description",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
              isClosing ? "opacity-0" : "opacity-100"
            ),
            onClick: handleClose,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: dialogRef,
            className: cn(
              "card relative w-full max-w-sm shadow-2xl transition-all",
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
              className
            ),
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      config.iconBg
                    ),
                    children: icon || /* @__PURE__ */ jsx(Icon2, { size: 20, className: config.iconColor })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { id: "confirm-modal-title", className: "font-semibold truncate", children: title }),
                  subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: subtitle })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  id: "confirm-modal-description",
                  className: "text-sm text-muted-foreground mb-4",
                  children: message
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleClose,
                    disabled: isLoading,
                    variant: "secondary",
                    className: "flex-1",
                    children: _cancelText
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    ref: confirmButtonRef,
                    onClick: onConfirm,
                    disabled: isLoading,
                    variant: config.buttonVariant,
                    className: "flex-1",
                    children: isLoading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
                      t("processing")
                    ] }) : _confirmText
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
  return createPortal(modalContent, document.body);
}
function DeleteConfirmModal({
  itemName,
  ...props
}) {
  const t = useYunUI().useT("components.confirmModal");
  return /* @__PURE__ */ jsx(
    ConfirmModal,
    {
      variant: "danger",
      title: t("deleteQuestion"),
      confirmText: t("delete"),
      message: /* @__PURE__ */ jsx(Fragment, { children: t("deleteMessage", { item: itemName }) }),
      ...props
    }
  );
}
function RegenerateConfirmModal({
  itemName,
  ...props
}) {
  const t = useYunUI().useT("components.confirmModal");
  return /* @__PURE__ */ jsx(
    ConfirmModal,
    {
      variant: "warning",
      title: t("regenerateQuestion"),
      subtitle: t("actionCannotBeUndone"),
      confirmText: t("regenerate"),
      message: /* @__PURE__ */ jsx(Fragment, { children: t("regenerateMessage", { item: itemName }) }),
      ...props
    }
  );
}
function Sheet({ open, onClose, children, title, mobileOnly = false }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  useModalBehavior(open, onClose);
  useFocusTrap(panelRef, open && mounted);
  if (!mounted) return null;
  return createPortal(
    /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 },
          className: cn("fixed inset-0 bg-black/20 backdrop-blur-sm", mobileOnly && "lg:hidden"),
          style: { zIndex: 40 },
          onClick: onClose,
          "aria-hidden": "true"
        },
        "sheet-backdrop"
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          ref: panelRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title ? titleId : void 0,
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { type: "spring", damping: 30, stiffness: 300 },
          className: cn("fixed inset-y-3 right-3 w-[85vw] min-w-72 max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden rounded-2xl border border-border", mobileOnly && "lg:hidden"),
          style: { zIndex: 50 },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0", children: [
              title && /* @__PURE__ */ jsx("h2", { id: titleId, className: "font-semibold text-sm tracking-tight", children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "-mr-1.5 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children })
          ]
        },
        "sheet-panel"
      )
    ] }) }),
    document.body
  );
}
var Checkbox = forwardRef(
  ({ checked = false, onCheckedChange, disabled = false, className = "", id }, ref) => {
    const filled = checked === true || checked === "indeterminate";
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type: "button",
        role: "checkbox",
        "aria-checked": checked === "indeterminate" ? "mixed" : checked,
        id,
        onClick: () => !disabled && onCheckedChange?.(checked !== true),
        disabled,
        className: `
                    w-4 h-4 rounded border-2 flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${filled ? "bg-primary border-primary text-primary-foreground" : "border-(--border-strong) bg-transparent hover:border-primary/50"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `,
        children: checked === "indeterminate" ? /* @__PURE__ */ jsx(Minus, { size: 12, strokeWidth: 3 }) : checked && /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 })
      }
    );
  }
);
Checkbox.displayName = "Checkbox";
function Combobox({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  allowCustom = true,
  creatableText,
  creatableFilter,
  creatableIcon
}) {
  const { Image: Image2, useT } = useYunUI();
  const t = useT("common.combobox");
  const resolvedPlaceholder = placeholder || t("placeholder");
  const resolvedCreatableText = creatableText || t("creatableText", { value: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const { shift, maxHeight, placement } = useAnchoredPosition(isOpen, panelRef);
  const listboxId = useId();
  const optionId = (i) => `${listboxId}-opt-${i}`;
  useEffect(() => {
    const selectedOption2 = options.find((o) => o.value === value);
    setInputValue(selectedOption2?.label || value || "");
  }, [value, options]);
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
    setHighlighted(-1);
  }, [inputValue, isOpen]);
  const filteredOptions = inputValue ? options.filter(
    (o) => o.label.toLowerCase().includes(inputValue.toLowerCase()) || o.value.toLowerCase().includes(inputValue.toLowerCase())
  ) : options;
  const canCreateNew = allowCustom && !!inputValue && !options.some(
    (o) => o.value.toLowerCase() === inputValue.toLowerCase() || o.label.toLowerCase() === inputValue.toLowerCase()
  ) && (!creatableFilter || creatableFilter(inputValue));
  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) return setIsOpen(true);
        setHighlighted((h) => Math.min(h + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) return setIsOpen(true);
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
        e.preventDefault();
        if (isOpen && highlighted >= 0 && filteredOptions[highlighted]) {
          handleSelect(filteredOptions[highlighted].value);
        } else if (canCreateNew) {
          handleSelect(inputValue);
        } else if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setInputValue(value || "");
        break;
    }
  };
  const clearValue = () => {
    onChange("");
    setInputValue("");
    inputRef.current?.focus();
  };
  const selectedOption = options.find((o) => o.value === value);
  const selectedIconPath = selectedOption?.iconUrl ?? null;
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      selectedIconPath && selectedOption && /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5", style: { width: 16, height: 16 }, children: /* @__PURE__ */ jsx(
        Image2,
        {
          src: selectedIconPath,
          alt: selectedOption.label,
          width: 16,
          height: 16,
          className: "object-cover",
          unoptimized: true
        }
      ) }) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          value: inputValue,
          onChange: handleInputChange,
          onFocus: () => !disabled && setIsOpen(true),
          onKeyDown: handleKeyDown,
          placeholder: resolvedPlaceholder,
          "aria-label": resolvedPlaceholder,
          role: "combobox",
          "aria-expanded": isOpen,
          "aria-controls": listboxId,
          "aria-autocomplete": "list",
          "aria-activedescendant": isOpen && highlighted >= 0 ? optionId(highlighted) : void 0,
          disabled,
          className: `
                        w-full py-2
                        rounded-xl border border-(--border-default) bg-(--bg-elevated)
                        hover:border-(--border-strong) hover:bg-(--bg-hover)
                        focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
                        transition-all duration-200 text-sm
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        ${selectedIconPath ? "pl-10 pr-20" : "px-3 pr-20"}
                    `
        }
      ),
      inputValue && !disabled && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: clearValue,
          "aria-label": "Clear",
          className: "absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: /* @__PURE__ */ jsx(X, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => !disabled && setIsOpen(!isOpen),
          disabled,
          "aria-label": "Toggle options",
          className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: isOpen ? "rotate-180 transition-transform" : "" })
        }
      )
    ] }),
    isOpen && !disabled && /* @__PURE__ */ jsx(
      "div",
      {
        ref: panelRef,
        style: { marginLeft: shift, maxHeight },
        className: `absolute z-50 w-full ${placement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"} p-1 rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-200`,
        children: /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 max-h-60 overflow-y-auto", role: "listbox", id: listboxId, children: filteredOptions.length === 0 && !canCreateNew ? /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: t("noResults") }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          filteredOptions.map((option, i) => {
            const isSelected = option.value === value;
            const isHigh = i === highlighted;
            const optionIconPath = option.iconUrl ?? null;
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
                className: `dropdown-item w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "active" : ""}`,
                children: [
                  optionIconPath && /* @__PURE__ */ jsx("div", { className: "rounded-md overflow-hidden bg-linear-to-br from-black/2 to-black/5 shrink-0", style: { width: 16, height: 16 }, children: /* @__PURE__ */ jsx(
                    Image2,
                    {
                      src: optionIconPath,
                      alt: option.label,
                      width: 16,
                      height: 16,
                      className: "object-cover",
                      unoptimized: true
                    }
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: option.label })
                ]
              },
              option.value
            );
          }),
          canCreateNew && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleSelect(inputValue),
              className: "dropdown-item w-full text-left text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", children: creatableIcon ?? "+" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: resolvedCreatableText.replace("{value}", inputValue) })
              ]
            }
          )
        ] }) })
      }
    )
  ] });
}
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn(
      "rounded-xl border border-(--border-default) bg-(--bg-elevated) overflow-hidden",
      "data-[state=open]:border-(--border-strong) transition-colors",
      className
    ),
    ...props
  }
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;
var AccordionTrigger = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-left",
      "transition-colors hover:bg-(--bg-hover)",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: cn(
      "grid text-sm text-muted-foreground",
      "transition-[grid-template-rows] duration-200 ease-out",
      "data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "px-4 pb-3 pt-0", children }) })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
var RadioGroup = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  RadioGroupPrimitive.Root,
  {
    ref,
    className: cn("grid gap-2", className),
    ...props
  }
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  RadioGroupPrimitive.Item,
  {
    ref,
    className: cn(
      "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
      "border-(--border-strong) bg-transparent",
      "transition-all duration-200 ease-in-out",
      "hover:border-primary/50",
      "data-[state=checked]:border-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-primary" }) })
  }
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
var gapMap = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12"
};
var paddingMap = {
  0: "p-0",
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  8: "p-8",
  10: "p-10",
  12: "p-12"
};
var pxMap = {
  0: "px-0",
  1: "px-1",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  5: "px-5",
  6: "px-6",
  8: "px-8",
  10: "px-10",
  12: "px-12"
};
var pyMap = {
  0: "py-0",
  1: "py-1",
  2: "py-2",
  3: "py-3",
  4: "py-4",
  5: "py-5",
  6: "py-6",
  8: "py-8",
  10: "py-10",
  12: "py-12"
};
var directionMap = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse"
};
var alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
};
var justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
};
var colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12"
};
var responsiveColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  7: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-7",
  8: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-8",
  9: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-9",
  10: "grid-cols-3 sm:grid-cols-5 lg:grid-cols-10",
  11: "grid-cols-3 sm:grid-cols-5 lg:grid-cols-11",
  12: "grid-cols-3 sm:grid-cols-6 lg:grid-cols-12"
};
var rowsMap = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  7: "grid-rows-7",
  8: "grid-rows-8",
  9: "grid-rows-9",
  10: "grid-rows-10",
  11: "grid-rows-11",
  12: "grid-rows-12"
};
var Flex = React7.forwardRef(
  ({
    as,
    direction = "row",
    align,
    justify,
    gap,
    wrap,
    padding,
    px,
    py,
    className,
    children,
    ...props
  }, ref) => {
    const Comp = as ?? "div";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        className: cn(
          "flex",
          directionMap[direction],
          align && alignMap[align],
          justify && justifyMap[justify],
          gap !== void 0 && gapMap[gap],
          wrap && "flex-wrap",
          padding !== void 0 && paddingMap[padding],
          px !== void 0 && pxMap[px],
          py !== void 0 && pyMap[py],
          className
        ),
        ...props,
        children
      }
    );
  }
);
Flex.displayName = "Flex";
var Grid = React7.forwardRef(
  ({ as, columns, rows, gap, align, padding, responsive = true, className, children, ...props }, ref) => {
    const Comp = as ?? "div";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        className: cn(
          "grid",
          columns !== void 0 && (responsive ? responsiveColsMap[columns] : colsMap[columns]),
          rows !== void 0 && rowsMap[rows],
          gap !== void 0 && gapMap[gap],
          align && alignMap[align],
          padding !== void 0 && paddingMap[padding],
          className
        ),
        ...props,
        children
      }
    );
  }
);
Grid.displayName = "Grid";
var Column = React7.forwardRef(
  (props, ref) => /* @__PURE__ */ jsx(Flex, { ref, direction: "col", ...props })
);
Column.displayName = "Column";
var Row = React7.forwardRef(
  (props, ref) => /* @__PURE__ */ jsx(Flex, { ref, direction: "row", ...props })
);
Row.displayName = "Row";
var Stack = React7.forwardRef(
  ({ gap = 4, ...props }, ref) => /* @__PURE__ */ jsx(Flex, { ref, direction: "col", gap, ...props })
);
Stack.displayName = "Stack";
var Table = React7.forwardRef(({ className, containerClassName, responsive, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("relative w-full overflow-x-auto", containerClassName), children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn(
      "w-full caption-bottom border-collapse text-sm",
      responsive && "yunui-table-responsive",
      className
    ),
    ...props
  }
) }));
Table.displayName = "Table";
var TableHeader = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "thead",
  {
    ref,
    className: cn("[&_tr]:border-b [&_tr]:border-(--border-default)", className),
    ...props
  }
));
TableHeader.displayName = "TableHeader";
var TableBody = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableFooter = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t border-(--border-default) bg-muted/30 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
var TableRow = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b border-(--border-default) transition-colors hover:bg-(--bg-hover) data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableHead = React7.forwardRef(({ className, onSort, sortDirection, align = "left", children, ...props }, ref) => {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  const head = cn(
    // whitespace-nowrap: header labels are short and must never wrap — CJK labels in
    // particular would otherwise break mid-word (能力 → 能/力) in narrow columns / WebKit.
    "h-10 whitespace-nowrap px-4 align-middle text-[11px] font-medium uppercase tracking-wider text-muted-foreground [&:has([role=checkbox])]:pr-0",
    alignClass,
    className
  );
  if (!onSort) {
    return /* @__PURE__ */ jsx("th", { ref, className: head, ...props, children });
  }
  const Icon2 = sortDirection === "asc" ? ChevronUp : sortDirection === "desc" ? ChevronDown : ChevronsUpDown;
  const justify = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  return /* @__PURE__ */ jsx(
    "th",
    {
      ref,
      "aria-sort": sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none",
      className: head,
      ...props,
      children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onSort,
          className: cn(
            "inline-flex w-full items-center gap-1 uppercase tracking-wider transition-colors hover:text-foreground",
            justify
          ),
          children: [
            children,
            /* @__PURE__ */ jsx(
              Icon2,
              {
                size: 12,
                "aria-hidden": true,
                className: cn("shrink-0", sortDirection ? "text-primary" : "opacity-40")
              }
            )
          ]
        }
      )
    }
  );
});
TableHead.displayName = "TableHead";
var TableCell = React7.forwardRef(({ className, label, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    "data-label": label,
    className: cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableCaption = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
var Breadcrumb = React7.forwardRef(({ "aria-label": ariaLabel = "Breadcrumb", ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": ariaLabel, ...props }));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
function BreadcrumbLink({
  className,
  href,
  ...props
}) {
  const { Link } = useYunUI();
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    "aria-current": "page",
    className: cn("font-medium text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:size-3.5 text-muted-foreground/60", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "text-base leading-none", children: "\u2026" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More" })
    ]
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
function getPageRange(page, totalPages, siblingCount) {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;
  const tokens = [1];
  if (showLeftEllipsis) {
    tokens.push("ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i++) tokens.push(i);
  }
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) tokens.push(i);
  }
  if (showRightEllipsis) {
    tokens.push("ellipsis");
  } else {
    for (let i = rightSibling + 1; i < totalPages; i++) tokens.push(i);
  }
  if (totalPages > 1) tokens.push(totalPages);
  return tokens;
}
var navButton = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-xl border border-(--border-default) bg-(--bg-elevated) px-2 text-sm transition-all duration-200 hover:border-(--border-strong) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50";
var Pagination = React7.forwardRef(
  ({
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    previousLabel = "Go to previous page",
    nextLabel = "Go to next page",
    ariaLabel = "Pagination",
    className,
    ...props
  }, ref) => {
    if (totalPages <= 1) return null;
    const tokens = getPageRange(page, totalPages, siblingCount);
    const isFirst = page <= 1;
    const isLast = page >= totalPages;
    return /* @__PURE__ */ jsxs(
      "nav",
      {
        ref,
        "aria-label": ariaLabel,
        className: cn("flex items-center justify-center gap-1.5", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": previousLabel,
              disabled: isFirst,
              onClick: () => !isFirst && onPageChange(page - 1),
              className: navButton,
              children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 })
            }
          ),
          tokens.map(
            (token, i) => token === "ellipsis" ? /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "flex h-9 min-w-9 items-center justify-center text-muted-foreground",
                children: "\u2026"
              },
              `ellipsis-${i}`
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": `Go to page ${token}`,
                "aria-current": token === page ? "page" : void 0,
                onClick: () => onPageChange(token),
                className: cn(
                  navButton,
                  token === page && "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary"
                ),
                children: token
              },
              token
            )
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": nextLabel,
              disabled: isLast,
              onClick: () => !isLast && onPageChange(page + 1),
              className: navButton,
              children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
            }
          )
        ]
      }
    );
  }
);
Pagination.displayName = "Pagination";
var Button = React7.forwardRef(
  ({ className, variant = "default", size = "md", loading, disabled, asChild, children, ...props }, ref) => {
    const variantMap = {
      default: "btn-primary",
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      accent: "btn-accent",
      brand: "btn-brand",
      outline: "btn-outline",
      amber: "btn-amber",
      red: "btn-red",
      destructive: "btn-red"
    };
    const variantClass = variantMap[variant] || variantMap.default;
    const sizes = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
      icon: "w-10 h-10 p-0"
    };
    const classes = cn("btn", variantClass, sizes[size], className);
    if (asChild && React7.isValidElement(children)) {
      return React7.cloneElement(children, {
        className: cn(classes, children.props.className)
      });
    }
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        disabled: disabled || loading,
        className: classes,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";
var Input = React7.forwardRef(
  ({ className, icon, error, id, "aria-describedby": describedBy, ...props }, ref) => {
    const reactId = React7.useId();
    const fieldId = id ?? reactId;
    const errorId = error ? `${fieldId}-error` : void 0;
    const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      icon && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: icon }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref,
          id: fieldId,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": describedByIds,
          className: cn(
            "w-full h-10 px-4 bg-background border border-border rounded-xl text-sm outline-none transition-colors",
            "placeholder:text-muted-foreground",
            "focus:border-ring focus:ring-2 focus:ring-ring/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon && "pl-10",
            error ? "border-(--error) focus:border-(--error)" : "border-border",
            className
          ),
          ...props
        }
      ),
      error && /* @__PURE__ */ jsxs("p", { id: errorId, className: "mt-1.5 text-xs text-error flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(AlertCircle, { "aria-hidden": "true", className: "w-3 h-3" }),
        error
      ] })
    ] });
  }
);
Input.displayName = "Input";
var Textarea = React7.forwardRef(
  ({ className, error, id, "aria-describedby": describedBy, ...props }, ref) => {
    const reactId = React7.useId();
    const fieldId = id ?? reactId;
    const errorId = error ? `${fieldId}-error` : void 0;
    const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref,
          id: fieldId,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": describedByIds,
          className: cn(
            "w-full px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none transition-colors resize-none",
            "placeholder:text-muted-foreground",
            "focus:border-ring focus:ring-2 focus:ring-ring/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-(--error) focus:border-(--error)" : "border-border",
            className
          ),
          ...props
        }
      ),
      error && /* @__PURE__ */ jsxs("p", { id: errorId, className: "mt-1.5 text-xs text-error flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(AlertCircle, { "aria-hidden": "true", className: "w-3 h-3" }),
        error
      ] })
    ] });
  }
);
Textarea.displayName = "Textarea";
var PasswordInput = React7.forwardRef(
  ({ className, error, id, labels, disabled, "aria-describedby": describedBy, ...props }, ref) => {
    const [show, setShow] = React7.useState(false);
    const reactId = React7.useId();
    const fieldId = id ?? reactId;
    const errorId = error ? `${fieldId}-error` : void 0;
    const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "flex items-center h-10 rounded-xl border border-border bg-background transition-colors",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
            error ? "border-(--error) focus:border-(--error)" : "border-border",
            disabled && "opacity-50",
            className
          ),
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref,
                id: fieldId,
                type: show ? "text" : "password",
                "aria-invalid": error ? true : void 0,
                "aria-describedby": describedByIds,
                disabled,
                className: "min-w-0 flex-1 h-full bg-transparent rounded-xl px-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
                ...props
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShow((s) => !s),
                "aria-label": show ? labels?.hide ?? "Hide password" : labels?.show ?? "Show password",
                "aria-pressed": show,
                tabIndex: -1,
                disabled,
                className: "shrink-0 px-3 text-muted-foreground hover:text-foreground rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
              }
            )
          ]
        }
      ),
      error && /* @__PURE__ */ jsxs("p", { id: errorId, className: "mt-1.5 text-xs text-error flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(AlertCircle, { "aria-hidden": "true", className: "w-3 h-3" }),
        error
      ] })
    ] });
  }
);
PasswordInput.displayName = "PasswordInput";
var NumberInput = React7.forwardRef(
  ({ className, value, onChange, min, max, step = 1, error, disabled, labels, id, "aria-describedby": describedBy, ...props }, ref) => {
    const reactId = React7.useId();
    const fieldId = id ?? reactId;
    const errorId = error ? `${fieldId}-error` : void 0;
    const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || void 0;
    const clamp = (n) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    const base = typeof value === "number" && !Number.isNaN(value) ? value : 0;
    const bump = (delta) => onChange?.(clamp(base + delta));
    const atMin = min != null && base <= min;
    const atMax = max != null && base >= max;
    const stepBtn = "flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "relative flex items-stretch rounded-xl border border-border bg-background transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
            error ? "border-(--error) focus:border-(--error)" : "border-border",
            disabled && "opacity-50",
            className
          ),
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => bump(-step),
                disabled: disabled || atMin,
                "aria-label": labels?.decrement ?? "Decrease",
                className: cn(stepBtn, "rounded-l-xl"),
                children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref,
                id: fieldId,
                type: "number",
                inputMode: "numeric",
                value: typeof value === "number" ? value : "",
                onChange: (e) => onChange?.(e.target.value === "" ? base : clamp(Number(e.target.value))),
                min,
                max,
                step,
                disabled,
                "aria-invalid": error ? true : void 0,
                "aria-describedby": describedByIds,
                className: "yunui-number w-full min-w-0 bg-transparent px-1 text-center text-sm outline-none",
                ...props
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => bump(step),
                disabled: disabled || atMax,
                "aria-label": labels?.increment ?? "Increase",
                className: cn(stepBtn, "rounded-r-xl"),
                children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
              }
            )
          ]
        }
      ),
      error && /* @__PURE__ */ jsxs("p", { id: errorId, className: "mt-1.5 text-xs text-error flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(AlertCircle, { "aria-hidden": "true", className: "w-3 h-3" }),
        error
      ] })
    ] });
  }
);
NumberInput.displayName = "NumberInput";
function Kbd({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      className: cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
var SearchInput = React7.forwardRef(
  ({ className, value, onChange, clearable = true, clearLabel, disabled, size = "md", ...props }, ref) => {
    const innerRef = React7.useRef(null);
    const setRef = React7.useCallback(
      (node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    const showClear = clearable && !!value && !disabled;
    const handleClear = () => {
      onChange?.("");
      innerRef.current?.focus();
    };
    const sm = size === "sm";
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Search,
        {
          "aria-hidden": "true",
          className: cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
            sm ? "left-2.5" : "left-3"
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: setRef,
          type: "text",
          role: "searchbox",
          "aria-label": props.placeholder,
          value,
          onChange: (e) => onChange?.(e.target.value),
          disabled,
          className: cn(
            "w-full bg-background border border-border text-sm outline-none transition-colors",
            "placeholder:text-muted-foreground",
            "focus:border-ring focus:ring-2 focus:ring-ring/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sm ? "h-8 rounded-lg pl-8" : "h-10 rounded-xl pl-10",
            sm ? showClear ? "pr-8" : "pr-3" : showClear ? "pr-10" : "pr-4",
            className
          ),
          ...props
        }
      ),
      showClear && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          "aria-label": clearLabel ?? "Clear search",
          className: cn(
            "absolute top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            sm ? "right-1.5" : "right-2.5"
          ),
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] });
  }
);
SearchInput.displayName = "SearchInput";
var Card = React7.forwardRef(
  ({ className, hover, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          // Renders the canonical `.card` class so <Card> matches the
          // ~226 raw `className="card"` usages across the app (single look).
          "card",
          hover && "hover:border-ring hover:shadow-lg hover:shadow-foreground/5 transition-all duration-200",
          className
        ),
        ...props
      }
    );
  }
);
Card.displayName = "Card";
var CardHeader = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props }));
CardHeader.displayName = "CardHeader";
var CardTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("h3", { ref, className: cn("text-lg font-semibold leading-none tracking-tight", className), ...props }));
CardTitle.displayName = "CardTitle";
var CardDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
var CardContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props }));
CardFooter.displayName = "CardFooter";
function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-muted text-foreground/80",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    error: "bg-error-soft text-error",
    info: "bg-info-soft text-info",
    // Structural (shadcn-compatible) variants:
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    destructive: "bg-error-soft text-error"
  };
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className
      ),
      ...props
    }
  );
}
function Separator3({
  className,
  orientation = "horizontal",
  decorative = false,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: decorative ? "none" : "separator",
      "aria-orientation": !decorative && orientation === "vertical" ? "vertical" : void 0,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      ),
      ...props
    }
  );
}
function Alert({ className, variant = "info", title, icon, children, ...props }) {
  const styles = {
    info: "bg-info-soft text-info border-info-soft",
    success: "bg-success-soft text-success border-success-soft",
    warning: "bg-warning-soft text-warning border-warning-soft",
    error: "bg-error-soft text-error border-error-soft",
    accent: "bg-accent-soft text-accent border-accent-soft"
  };
  const defaultIcon = {
    info: /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
    success: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
    warning: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
    error: /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
    accent: /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" })
  };
  const resolvedIcon = icon === void 0 ? defaultIcon[variant] : icon;
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role,
      className: cn("flex gap-3 rounded-xl border border-border p-3 text-sm", styles[variant], className),
      ...props,
      children: [
        resolvedIcon && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mt-0.5 shrink-0", children: resolvedIcon }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          title && /* @__PURE__ */ jsx("p", { className: "font-medium", children: title }),
          children && /* @__PURE__ */ jsx("div", { className: cn(title && "mt-0.5", "opacity-90"), children })
        ] })
      ]
    }
  );
}
function Tag({ className, children, onRemove, removeLabel, ...props }) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80",
        className
      ),
      ...props,
      children: [
        children,
        onRemove && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            "aria-label": removeLabel ?? "Remove",
            className: "-mr-0.5 rounded-sm p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
          }
        )
      ]
    }
  );
}
function StatusIndicator({
  status = "neutral",
  pulse = false,
  className,
  children,
  ...props
}) {
  const color = {
    online: "bg-(--success)",
    offline: "bg-zinc-400",
    busy: "bg-(--error)",
    away: "bg-(--warning)",
    neutral: "bg-muted-foreground"
  }[status];
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1.5 text-sm", className), ...props, children: [
    /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2 shrink-0", children: [
      pulse && /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": "true",
          className: cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color)
        }
      ),
      /* @__PURE__ */ jsx("span", { className: cn("relative inline-flex h-2 w-2 rounded-full", color) })
    ] }),
    children
  ] });
}
var inlineStatusConfig = {
  pending: { icon: Loader2, className: "text-warning" },
  processing: { icon: Loader2, className: "text-warning" },
  completed: { icon: CheckCircle2, className: "text-success" },
  failed: { icon: AlertCircle, className: "text-error" }
};
function InlineStatus({ status, label, progress, size = 12, className }) {
  const config = inlineStatusConfig[status];
  const Icon2 = config.icon;
  const isProcessing = status === "processing" || status === "pending";
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1", config.className, className), children: [
    /* @__PURE__ */ jsx(Icon2, { size, className: cn(isProcessing && "animate-spin") }),
    /* @__PURE__ */ jsx("span", { children: isProcessing && progress !== void 0 && progress > 0 ? `${progress}%` : label })
  ] });
}
function InlineCode({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "code",
    {
      className: cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground/90",
        className
      ),
      ...props
    }
  );
}
function Steps({ steps, current = 0, className, ...props }) {
  return /* @__PURE__ */ jsx("ol", { className: cn("flex flex-col", className), ...props, children: steps.map((step, i) => {
    const state = i < current ? "done" : i === current ? "active" : "upcoming";
    const isLast = i === steps.length - 1;
    return /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium",
              state === "done" && "border-transparent bg-primary text-primary-foreground",
              state === "active" && "border-primary text-primary",
              state === "upcoming" && "border-border text-muted-foreground"
            ),
            children: state === "done" ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : i + 1
          }
        ),
        !isLast && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: cn("w-px flex-1 my-1", i < current ? "bg-primary" : "bg-border")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("pb-6", isLast && "pb-0"), children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: cn(
              "text-sm font-medium leading-6",
              state === "upcoming" ? "text-muted-foreground" : "text-foreground"
            ),
            "aria-current": state === "active" ? "step" : void 0,
            children: step.title
          }
        ),
        step.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: step.description })
      ] })
    ] }, i);
  }) });
}
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%]",
        // Glassy surface to match Sheet/navbar/popover (unified overlay language).
        "bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("mb-4", className), ...props });
}
var DialogTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground mt-1", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex items-center justify-end gap-3 mt-6", className), ...props });
}
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectGroup = SelectPrimitive.Group;
var SelectTrigger = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-xl border border-border bg-card px-3 text-sm",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectContent = React7.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  SelectPrimitive.Content,
  {
    ref,
    position,
    className: cn(
      "relative z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      SelectPrimitive.Viewport,
      {
        className: cn(
          "p-1",
          position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
        ),
        children
      }
    )
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectItem = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      // Shares the LanguageSwitcher row look: the left accent bar (via
      // data-state=checked) marks the selection — no separate checkmark.
      "dropdown-item w-full cursor-pointer select-none outline-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectLabel = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectSeparator = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-border", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
var SelectScrollUpButton = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var Slider = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center px-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-border", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-foreground yunui-accent-bg" }) }),
      /* @__PURE__ */ jsx(
        SliderPrimitive.Thumb,
        {
          className: "block h-5 w-5 rounded-full border-2 border-foreground bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 yunui-accent-border"
        }
      )
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
var Progress = React7.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-foreground transition-all duration-300 yunui-accent-bg",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
var Tabs = TabsPrimitive.Root;
var TabsList = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      // max-w-full: inline-flex sizes to content, so without it a long tab
      // strip grows past its parent and drags the page sideways on narrow
      // screens instead of engaging its own overflow-x-auto.
      "inline-flex h-11 max-w-full items-center justify-center rounded-xl bg-muted p-1 flex-nowrap overflow-x-auto overflow-y-hidden overscroll-x-contain",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-card data-[state=active]:shadow-sm",
      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
      "yunui-tab-trigger",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn("mt-4 focus-visible:outline-none", className),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
var Avatar = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function AvatarGroup({ className, max, children, ...props }) {
  const items = React7.Children.toArray(children);
  const shown = max != null ? items.slice(0, max) : items;
  const overflow = items.length - shown.length;
  const ring = { boxShadow: "0 0 0 2px var(--color-background)" };
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center -space-x-2", className), ...props, children: [
    shown.map((child, i) => /* @__PURE__ */ jsx("div", { className: "rounded-full", style: ring, children: child }, i)),
    overflow > 0 && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground",
        style: ring,
        children: [
          "+",
          overflow
        ]
      }
    )
  ] });
}
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React7.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-lg bg-foreground px-3 py-1.5 text-xs text-background shadow-lg",
      "animate-in fade-in-0 zoom-in-95",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-lg bg-muted", className),
      ...props
    }
  );
}
var spinnerSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};
function Spinner({ size = "md", className, ...props }) {
  return /* @__PURE__ */ jsxs("div", { role: "status", className: cn("inline-flex", className), ...props, children: [
    /* @__PURE__ */ jsx(Loader2, { className: cn("animate-spin text-muted-foreground", spinnerSizes[size]) }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading..." })
  ] });
}
function PageLoader({ title, subtitle, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex items-center justify-center min-h-dvh w-full", className),
      ...props,
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsx(Spinner, { size: "lg" }),
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
          title && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/60 text-xs", children: subtitle })
        ] })
      ] })
    }
  );
}
function EmptyState({ icon, title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
    icon && /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: icon }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-1", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: description }),
    action
  ] });
}
var MotionDiv = motion.div;
var MotionSpan = motion.span;
var fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};
var staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};
var staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
var IconButton = React7.forwardRef(
  ({ className, icon, label, ...props }, ref) => {
    return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 300, children: /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        "button",
        {
          ref,
          type: props.type ?? "button",
          "aria-label": label,
          className: cn(
            "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          ),
          ...props,
          children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: icon })
        }
      ) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: label })
    ] }) });
  }
);
IconButton.displayName = "IconButton";
function Label3({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "label",
    {
      className: cn(
        "text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2",
        className
      ),
      ...props
    }
  );
}
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React7.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-muted focus:text-foreground data-[state=open]:bg-muted",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl p-1 text-popover-foreground shadow-lg shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React7.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-popover/85 backdrop-blur-2xl p-1 text-popover-foreground shadow-lg shadow-black/5",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React7.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuItemInternal,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuItemInternal = DropdownMenuPrimitive.Item;
var DropdownMenuCheckboxItem = React7.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React7.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var closeIdCounter2 = 0;
function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "lg",
  className,
  showCloseButton = true,
  isClosing: externalIsClosing,
  setIsClosing: externalSetIsClosing,
  showUnsavedBadge = false,
  maxHeight = DEFAULT_MAX_HEIGHT,
  onBackdropClick
}) {
  const t = useYunUI().useT("components.modal");
  const modalRef = useRef(null);
  const timeoutRef = useRef(null);
  const closeIdRef = useRef(0);
  const [internalIsClosing, setInternalIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isClosing = externalIsClosing ?? internalIsClosing;
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  const isClosingRef = useRef(isClosing);
  isClosingRef.current = isClosing;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const externalSetIsClosingRef = useRef(externalSetIsClosing);
  externalSetIsClosingRef.current = externalSetIsClosing;
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const currentCloseId = ++closeIdCounter2;
    closeIdRef.current = currentCloseId;
    const executeClose = () => {
      if (closeIdRef.current === currentCloseId) {
        onCloseRef.current();
        if (externalSetIsClosingRef.current) {
          externalSetIsClosingRef.current(false);
        } else {
          setInternalIsClosing(false);
        }
        timeoutRef.current = null;
      }
    };
    if (externalSetIsClosingRef.current) {
      externalSetIsClosingRef.current(true);
      timeoutRef.current = setTimeout(executeClose, ANIMATION_DURATION);
    } else {
      setInternalIsClosing(true);
      timeoutRef.current = setTimeout(executeClose, ANIMATION_DURATION);
    }
  }, []);
  useEscapeKey(handleClose, isOpen);
  useBodyScrollLock(isOpen);
  useFocusTrap(modalRef, isOpen);
  useEffect(() => {
    if (isOpen && internalIsClosing) {
      setInternalIsClosing(false);
    }
  }, [isOpen, internalIsClosing]);
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      if (onBackdropClick) {
        onBackdropClick();
      } else {
        handleClose();
      }
    }
  }, [onBackdropClick, handleClose]);
  if (!isOpen || !mounted) return null;
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;
  const modalContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "fixed inset-0 flex items-center justify-center p-4 transition-opacity",
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      ),
      style: { zIndex: Z_INDEX.MODAL },
      onClick: handleBackdropClick,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
              isClosing ? "opacity-0" : "opacity-100"
            ),
            onClick: handleClose,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: modalRef,
            className: cn(
              // Glassy surface (not the solid .card) to match Sheet/Dialog/navbar.
              "relative w-full rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col transition-all",
              sizeClass,
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
              className
            ),
            style: { maxHeight },
            onClick: (e) => e.stopPropagation(),
            tabIndex: -1,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("h2", { id: "modal-title", className: "text-lg font-semibold truncate", children: title }),
                    showUnsavedBadge && /* @__PURE__ */ jsx("span", { className: "badge-warning shrink-0", children: t("unsaved") })
                  ] }),
                  subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate", children: subtitle })
                ] }),
                showCloseButton && /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: handleClose,
                    className: "p-2 shrink-0",
                    "aria-label": t("close"),
                    children: /* @__PURE__ */ jsx(X, { size: 20 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children }),
              footer && /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-border bg-muted/20 shrink-0", children: footer })
            ]
          }
        )
      ]
    }
  );
  return createPortal(modalContent, document.body);
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, Avatar, AvatarFallback, AvatarGroup, AvatarImage, Badge, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Column, Combobox, ConfirmModal, DeleteConfirmModal, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, Flex, Grid, IconButton, InlineCode, InlineStatus, Input, Kbd, Label3 as Label, Modal, MotionDiv, MotionSpan, NumberInput, PageLoader, Pagination, PasswordInput, Progress, RadioGroup, RadioGroupItem, RegenerateConfirmModal, Row, SearchInput, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator3 as Separator, Sheet, Skeleton, Slider, Spinner, Stack, StatusIndicator, Steps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Tag, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, fadeIn, staggerContainer, staggerItem, useBodyScrollLock, useEscapeKey, useFocusTrap, useModalBehavior };
//# sourceMappingURL=chunk-XKUHGS7G.js.map
//# sourceMappingURL=chunk-XKUHGS7G.js.map