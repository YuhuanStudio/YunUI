// =====================================================
// SHARED UI COMPONENTS
// Built with Radix UI, Lucide Icons, Framer Motion
// =====================================================

"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import {
    Check,
    ChevronDown,
    ChevronRight,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Minus,
    Plus,
    Search,
    Info,
    AlertTriangle,
} from "lucide-react";

// Re-export Modal component
export { Modal } from "./modal";
export { Sheet } from "./sheet";
export { Checkbox } from "./checkbox";
export type { CheckboxProps } from "./checkbox";

// Re-export ConfirmModal components
export {
    ConfirmModal,
    DeleteConfirmModal,
    RegenerateConfirmModal,
    type ConfirmModalVariant,
} from "./confirm-modal";

// =====================================================
// UTILITY
// =====================================================

import { cn } from "../lib/cn";
export { cn };

// =====================================================
// BUTTON
// =====================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style. Options: `primary`, `secondary`, `ghost`, `accent`, `outline`, `amber`, `red`/`destructive`.
     * @defaultValue "default"
     */
    variant?:
        | /** @deprecated alias of `primary` */ "default"
        | "primary"
        | "secondary"
        | "ghost"
        | "accent"
        | /** Solid fill from the runtime-themeable brand token (data-brand). */ "brand"
        | "outline"
        | "amber"
        | /** @deprecated alias of `destructive` */ "red"
        | "destructive";
    /** Size: `sm`, `md` (default), `lg`, or `icon` (square 40×40). */
    size?: "sm" | "md" | "lg" | "icon";
    /** Show a spinner before the children and disable the button while busy. */
    loading?: boolean;
    /** Render the single child element with the button styling instead of a <button> (e.g. wrap a <Link>). */
    asChild?: boolean;
}

/** Primary action button with style variants, sizes, a loading spinner, and `asChild` slotting. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", loading, disabled, asChild, children, ...props }, ref) => {
        // Map variant names to CSS classes
        const variantMap: Record<string, string> = {
            default: "btn-primary",
            primary: "btn-primary",
            secondary: "btn-secondary",
            ghost: "btn-ghost",
            accent: "btn-accent",
            brand: "btn-brand",
            outline: "btn-outline",
            amber: "btn-amber",
            red: "btn-red",
            destructive: "btn-red",
        };

        const variantClass = variantMap[variant] || variantMap.default;

        const sizes = {
            sm: "btn-sm",
            md: "",
            lg: "btn-lg",
            icon: "w-10 h-10 p-0",
        };

        const classes = cn("btn", variantClass, sizes[size], className);

        // asChild: merge styling onto the provided child (e.g. a routing <Link>)
        // instead of rendering our own <button>.
        if (asChild && React.isValidElement<{ className?: string }>(children)) {
            return React.cloneElement(children, {
                className: cn(classes, children.props.className),
            });
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={classes}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

// =====================================================
// INPUT
// =====================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Leading icon rendered inside the field on the left. */
    icon?: React.ReactNode;
    /** Error message shown below the field; also switches the border to a red error style. */
    error?: string;
}

/** Single-line text input with an optional leading icon and inline error message. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, id, "aria-describedby": describedBy, ...props }, ref) => {
        const reactId = React.useId();
        const fieldId = id ?? reactId;
        const errorId = error ? `${fieldId}-error` : undefined;
        // Associate the inline error with the field so screen readers announce it.
        const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || undefined;
        return (
            <div className="relative">
                {icon && (
                    <div aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={fieldId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedByIds}
                    className={cn(
                        "w-full h-10 px-4 bg-background border rounded-xl text-sm outline-none transition-colors",
                        "placeholder:text-muted-foreground",
                        "focus:border-ring focus:ring-2 focus:ring-ring/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        icon && "pl-10",
                        error ? "border-(--error) focus:border-(--error)" : "border-border",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle aria-hidden="true" className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// =====================================================
// TEXTAREA
// =====================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Error message shown below the field; also switches the border to a red error style. */
    error?: string;
}

/** Multi-line text input with an inline error message. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, id, "aria-describedby": describedBy, ...props }, ref) => {
        const reactId = React.useId();
        const fieldId = id ?? reactId;
        const errorId = error ? `${fieldId}-error` : undefined;
        const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || undefined;
        return (
            <div>
                <textarea
                    ref={ref}
                    id={fieldId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedByIds}
                    className={cn(
                        "w-full px-4 py-3 bg-background border rounded-xl text-sm outline-none transition-colors resize-none",
                        "placeholder:text-muted-foreground",
                        "focus:border-ring focus:ring-2 focus:ring-ring/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-(--error) focus:border-(--error)" : "border-border",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle aria-hidden="true" className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// =====================================================
// PASSWORD INPUT
// =====================================================

interface PasswordInputProps extends Omit<InputProps, "icon" | "type"> {
    /** Accessible labels for the reveal toggle (English defaults). */
    labels?: { show?: string; hide?: string };
}

/** Password field with a show/hide reveal toggle; same styling + error API as Input. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, error, id, labels, disabled, "aria-describedby": describedBy, ...props }, ref) => {
        const [show, setShow] = React.useState(false);
        const reactId = React.useId();
        const fieldId = id ?? reactId;
        const errorId = error ? `${fieldId}-error` : undefined;
        const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || undefined;
        return (
            <div>
                {/* Flex row (not an absolutely-positioned button) so the reveal
                    toggle is reliably INSIDE the field across browsers (Safari
                    mis-placed the absolute button outside the input). */}
                <div
                    className={cn(
                        "flex items-center h-10 rounded-xl border bg-background transition-colors",
                        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
                        error ? "border-(--error) focus:border-(--error)" : "border-border",
                        disabled && "opacity-50",
                        className
                    )}
                >
                    <input
                        ref={ref}
                        id={fieldId}
                        type={show ? "text" : "password"}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedByIds}
                        disabled={disabled}
                        className="min-w-0 flex-1 h-full bg-transparent rounded-xl px-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? labels?.hide ?? "Hide password" : labels?.show ?? "Show password"}
                        aria-pressed={show}
                        tabIndex={-1}
                        disabled={disabled}
                        className="shrink-0 px-3 text-muted-foreground hover:text-foreground rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle aria-hidden="true" className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

// =====================================================
// NUMBER INPUT
// =====================================================

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
    /** Current value (controlled). */
    value?: number;
    /** Called with the next clamped value. */
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    /** Increment/decrement step. @defaultValue 1 */
    step?: number;
    /** Error message shown below the field; also switches the border to a red error style. */
    error?: string;
    /** Accessible labels for the steppers (English defaults). */
    labels?: { increment?: string; decrement?: string };
}

/** Numeric field with −/+ steppers, min/max clamping, and the Input error API. */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ className, value, onChange, min, max, step = 1, error, disabled, labels, id, "aria-describedby": describedBy, ...props }, ref) => {
        const reactId = React.useId();
        const fieldId = id ?? reactId;
        const errorId = error ? `${fieldId}-error` : undefined;
        const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || undefined;
        const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
        const base = typeof value === "number" && !Number.isNaN(value) ? value : 0;
        const bump = (delta: number) => onChange?.(clamp(base + delta));
        const atMin = min != null && base <= min;
        const atMax = max != null && base >= max;
        const stepBtn =
            "flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
        return (
            <div>
                <div
                    className={cn(
                        "relative flex items-stretch rounded-xl border bg-background transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
                        error ? "border-(--error) focus:border-(--error)" : "border-border",
                        disabled && "opacity-50",
                        className
                    )}
                >
                    <button
                        type="button"
                        onClick={() => bump(-step)}
                        disabled={disabled || atMin}
                        aria-label={labels?.decrement ?? "Decrease"}
                        className={cn(stepBtn, "rounded-l-xl")}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <input
                        ref={ref}
                        id={fieldId}
                        type="number"
                        inputMode="numeric"
                        value={typeof value === "number" ? value : ""}
                        onChange={(e) => onChange?.(e.target.value === "" ? base : clamp(Number(e.target.value)))}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedByIds}
                        className="yunui-number w-full min-w-0 bg-transparent px-1 text-center text-sm outline-none"
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => bump(step)}
                        disabled={disabled || atMax}
                        aria-label={labels?.increment ?? "Increase"}
                        className={cn(stepBtn, "rounded-r-xl")}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle aria-hidden="true" className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
NumberInput.displayName = "NumberInput";

// =====================================================
// KBD
// =====================================================

/** Inline keyboard-key / shortcut display, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <kbd
            className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}

// =====================================================
// SEARCH INPUT
// =====================================================

interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "size"> {
    /** Current query (controlled). */
    value?: string;
    /** Called with the new query string — also called with `""` when cleared. */
    onChange?: (value: string) => void;
    /** Show a clear (×) button while there's a value. @defaultValue true */
    clearable?: boolean;
    /** Accessible label for the clear button (English default). */
    clearLabel?: string;
    /** Field size — `sm` for toolbars/dropdowns, `md` standalone. @defaultValue "md" */
    size?: "sm" | "md";
}

/**
 * Canonical search field: a leading magnifier with the right padding so typed
 * text never sits under the icon, plus an optional clear (×) button. `onChange`
 * receives the string directly (ergonomic for filtering), and the clear button
 * fires `onChange("")`. Use this instead of hand-rolling `<input> + absolute icon`.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onChange, clearable = true, clearLabel, disabled, size = "md", ...props }, ref) => {
        // Internal ref so the clear button can restore focus, while still
        // forwarding the node to a caller-provided ref.
        const innerRef = React.useRef<HTMLInputElement>(null);
        const setRef = React.useCallback(
            (node: HTMLInputElement | null) => {
                innerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            },
            [ref]
        );
        const showClear = clearable && !!value && !disabled;
        const handleClear = () => {
            onChange?.("");
            innerRef.current?.focus();
        };
        const sm = size === "sm";
        return (
            <div className="relative">
                <Search
                    aria-hidden="true"
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
                        sm ? "left-2.5" : "left-3"
                    )}
                />
                {/* type="text" + role="searchbox" deliberately: type="search" adds a
                    native clear (×) decoration that would collide with our own button. */}
                <input
                    ref={setRef}
                    type="text"
                    role="searchbox"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-full bg-background border border-border text-sm outline-none transition-colors",
                        "placeholder:text-muted-foreground",
                        "focus:border-ring focus:ring-2 focus:ring-ring/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        sm ? "h-8 rounded-lg pl-8" : "h-10 rounded-xl pl-10",
                        sm ? (showClear ? "pr-8" : "pr-3") : showClear ? "pr-10" : "pr-4",
                        className
                    )}
                    {...props}
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label={clearLabel ?? "Clear search"}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            sm ? "right-1.5" : "right-2.5"
                        )}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);
SearchInput.displayName = "SearchInput";

// =====================================================
// CARD
// =====================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Add a hover lift (border + shadow transition). */
    hover?: boolean;
}

/** Surface container rendering the canonical `.card` style. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Renders the canonical `.card` class so <Card> matches the
                    // ~226 raw `className="card"` usages across the app (single look).
                    "card",
                    hover && "hover:border-ring hover:shadow-lg hover:shadow-foreground/5 transition-all duration-200",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

// =====================================================
// BADGE
// =====================================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Semantic color: `default` (neutral), `success`, `warning`, `error`, or `info`. */
    variant?: "default" | "success" | "warning" | "error" | "info";
}

/** Small inline pill for status/labels, with semantic color variants. */
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    // Token-driven semantic tints (see .bg-*-soft / .text-* helpers in yunui.css)
    // so a Badge, an Alert and a status dot all read the same red/green/amber.
    const variants = {
        default: "bg-muted text-foreground/80",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        error: "bg-error-soft text-error",
        info: "bg-info-soft text-info",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

// =====================================================
// SEPARATOR
// =====================================================

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    /** Purely decorative — no semantic role announced to assistive tech. */
    decorative?: boolean;
}

/** A thin divider line. Horizontal by default; set `orientation="vertical"` inside a flex row. */
export function Separator({
    className,
    orientation = "horizontal",
    decorative = false,
    ...props
}: SeparatorProps) {
    return (
        <div
            role={decorative ? "none" : "separator"}
            aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
            {...props}
        />
    );
}

// =====================================================
// ALERT
// =====================================================

interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: "info" | "success" | "warning" | "error";
    /** Optional bold title above the body. */
    title?: React.ReactNode;
    /** Leading icon. Defaults to a variant-appropriate icon; pass `null` to hide. */
    icon?: React.ReactNode;
}

/** Inline callout for info / success / warning / error messages. */
export function Alert({ className, variant = "info", title, icon, children, ...props }: AlertProps) {
    // Token-driven semantic tints (.bg-*-soft / .text-* / .border-*-soft helpers
    // in yunui.css) so Alert matches Badge and the status dots across all themes.
    const styles = {
        info: "bg-info-soft text-info border-info-soft",
        success: "bg-success-soft text-success border-success-soft",
        warning: "bg-warning-soft text-warning border-warning-soft",
        error: "bg-error-soft text-error border-error-soft",
    };
    const defaultIcon = {
        info: <Info className="h-4 w-4" />,
        success: <CheckCircle2 className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />,
    };
    const resolvedIcon = icon === undefined ? defaultIcon[variant] : icon;
    // Urgent variants assert; info/success are polite status messages.
    const role = variant === "error" || variant === "warning" ? "alert" : "status";
    return (
        <div
            role={role}
            className={cn("flex gap-3 rounded-xl border p-3 text-sm", styles[variant], className)}
            {...props}
        >
            {resolvedIcon && (
                <span aria-hidden="true" className="mt-0.5 shrink-0">
                    {resolvedIcon}
                </span>
            )}
            <div className="min-w-0 flex-1">
                {title && <p className="font-medium">{title}</p>}
                {children && <div className={cn(title && "mt-0.5", "opacity-90")}>{children}</div>}
            </div>
        </div>
    );
}

// =====================================================
// TAG
// =====================================================

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Show a remove (×) button and call this when it's pressed. */
    onRemove?: () => void;
    /** Accessible label for the remove button (English default). */
    removeLabel?: string;
}

/** A small label, optionally removable. Use `Badge` for non-interactive status text. */
export function Tag({ className, children, onRemove, removeLabel, ...props }: TagProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80",
                className
            )}
            {...props}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={removeLabel ?? "Remove"}
                    className="-mr-0.5 rounded-sm p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
}

// =====================================================
// STATUS INDICATOR
// =====================================================

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    status?: "online" | "offline" | "busy" | "away" | "neutral";
    /** Add a pulsing halo to signal "live". */
    pulse?: boolean;
}

/** A small colored status dot with an optional label (e.g. provider online/offline). */
export function StatusIndicator({
    status = "neutral",
    pulse = false,
    className,
    children,
    ...props
}: StatusIndicatorProps) {
    const color = {
        online: "bg-(--success)",
        offline: "bg-zinc-400",
        busy: "bg-(--error)",
        away: "bg-(--warning)",
        neutral: "bg-muted-foreground",
    }[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-sm", className)} {...props}>
            <span className="relative flex h-2 w-2 shrink-0">
                {pulse && (
                    <span
                        aria-hidden="true"
                        className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color)}
                    />
                )}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
            </span>
            {children}
        </span>
    );
}

// =====================================================
// INLINE STATUS
// =====================================================

export type InlineStatusKind = "pending" | "processing" | "completed" | "failed";

interface InlineStatusProps {
    /** Job phase — drives the icon, color and whether it spins. */
    status: InlineStatusKind;
    /** The label for this status (host-supplied; no bundled copy). */
    label?: React.ReactNode;
    /** When in-progress and > 0, the percent replaces the label. */
    progress?: number;
    /** Icon size in px. */
    size?: number;
    className?: string;
}

const inlineStatusConfig: Record<InlineStatusKind, { icon: typeof Loader2; className: string }> = {
    pending: { icon: Loader2, className: "text-warning" },
    processing: { icon: Loader2, className: "text-warning" },
    completed: { icon: CheckCircle2, className: "text-success" },
    failed: { icon: AlertCircle, className: "text-error" },
};

/** A compact inline async-job status: a (spinning) icon plus a label or percent.
 *  For a presence dot use `StatusIndicator`; for an approval pill, `StatusBadge`. */
export function InlineStatus({ status, label, progress, size = 12, className }: InlineStatusProps) {
    const config = inlineStatusConfig[status];
    const Icon = config.icon;
    const isProcessing = status === "processing" || status === "pending";
    return (
        <span className={cn("inline-flex items-center gap-1", config.className, className)}>
            <Icon size={size} className={cn(isProcessing && "animate-spin")} />
            <span>{isProcessing && progress !== undefined && progress > 0 ? `${progress}%` : label}</span>
        </span>
    );
}

// =====================================================
// INLINE CODE
// =====================================================

/** Inline `<code>` styling for code spans in prose or chat. Use `Kbd` for keys. */
export function InlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <code
            className={cn(
                "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground/90",
                className
            )}
            {...props}
        />
    );
}

// =====================================================
// STEPS
// =====================================================

interface Step {
    title: React.ReactNode;
    description?: React.ReactNode;
}

interface StepsProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
    steps: Step[];
    /** Zero-based index of the active step; earlier steps render as completed. */
    current?: number;
}

/** Vertical progress stepper: completed / active / upcoming states with a connector. */
export function Steps({ steps, current = 0, className, ...props }: StepsProps) {
    return (
        <ol className={cn("flex flex-col", className)} {...props}>
            {steps.map((step, i) => {
                const state = i < current ? "done" : i === current ? "active" : "upcoming";
                const isLast = i === steps.length - 1;
                return (
                    <li key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                                    state === "done" && "border-transparent bg-primary text-primary-foreground",
                                    state === "active" && "border-primary text-primary",
                                    state === "upcoming" && "border-border text-muted-foreground"
                                )}
                            >
                                {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
                            </span>
                            {!isLast && (
                                <span
                                    aria-hidden="true"
                                    className={cn("w-px flex-1 my-1", i < current ? "bg-primary" : "bg-border")}
                                />
                            )}
                        </div>
                        <div className={cn("pb-6", isLast && "pb-0")}>
                            <p
                                className={cn(
                                    "text-sm font-medium leading-6",
                                    state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                                )}
                                aria-current={state === "active" ? "step" : undefined}
                            >
                                {step.title}
                            </p>
                            {step.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

// =====================================================
// DIALOG
// =====================================================

/**
 * Radix Dialog root — controls open state for a modal dialog. Compose with Dialog* parts.
 *
 * The accessible default for dialogs (focus trap, escape, scroll lock, full ARIA).
 * For the prop-driven styled modal use `Modal`; for confirmations use
 * `ConfirmModal`/`DeleteConfirmModal`/`RegenerateConfirmModal` — see Modal's doc
 * for the full "which dialog do I use" guidance.
 */
export const Dialog = DialogPrimitive.Root;
/** Element that opens the dialog when activated. */
export const DialogTrigger = DialogPrimitive.Trigger;
/** Portals dialog content into the document body. */
export const DialogPortal = DialogPrimitive.Portal;
/** Element that closes the dialog when activated. */
export const DialogClose = DialogPrimitive.Close;

/** Dimmed, blurred backdrop behind the dialog content. */
export const DialogOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/** Centered, animated dialog panel (includes the overlay and a built-in close button). */
export const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%]",
                // Glassy surface to match Sheet/navbar/popover (unified overlay language).
                "bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X className="h-4 w-4" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/** Header layout block for the dialog title/description. */
export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mb-4", className)} {...props} />;
}

/** Accessible dialog title (labels the dialog for screen readers). */
export const DialogTitle = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/** Accessible dialog description (supplementary text under the title). */
export const DialogDescription = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground mt-1", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/** Footer layout block (right-aligned action buttons) for the dialog. */
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center justify-end gap-3 mt-6", className)} {...props} />;
}

// =====================================================
// SELECT
// =====================================================

/**
 * Radix Select root — a styled native-feeling single-select. Compose with Select* parts.
 *
 * Choosing a select (so you never have to guess):
 * - `Select` (this, Radix): the accessible default for a fixed, smallish list of
 *   options authored as JSX (`<SelectItem>`). Best a11y/keyboard support.
 * - `CustomSelect`: data-driven (`options` array) with optional search/icons —
 *   reach for it when options come from data or you need a searchable list.
 * - `Combobox`: data-driven select with a filterable text input (type-ahead),
 *   for longer lists where the user types to narrow.
 * - `SegmentedSelect`: a small inline segmented control (2-5 visible choices),
 *   not a dropdown.
 */
export const Select = SelectPrimitive.Root;
/** Renders the selected value (or placeholder) inside the trigger. */
export const SelectValue = SelectPrimitive.Value;
/** Groups related SelectItems together. */
export const SelectGroup = SelectPrimitive.Group;

/** Button that opens the select dropdown and shows the current value. */
export const SelectTrigger = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-border bg-card px-3 text-sm",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/** Portalled, animated dropdown panel holding the SelectItems. */
export const SelectContent = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            position={position}
            className={cn(
                "relative z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-2xl text-popover-foreground shadow-lg shadow-black/5",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
                className
            )}
            {...props}
        >
            <SelectPrimitive.Viewport
                className={cn(
                    "p-1",
                    position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

/** A selectable option in the dropdown (shows a check when selected). */
export const SelectItem = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            // Shares the LanguageSwitcher row look: the left accent bar (via
            // data-state=checked) marks the selection — no separate checkmark.
            "dropdown-item w-full cursor-pointer select-none outline-none data-disabled:pointer-events-none data-disabled:opacity-50",
            className
        )}
        {...props}
    >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// =====================================================
// SLIDER
// =====================================================

/** Range slider with a track, filled range, and draggable thumb. */
export const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-foreground yunui-accent-bg" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            className="block h-5 w-5 rounded-full border-2 border-foreground bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 yunui-accent-border"
        />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

// =====================================================
// PROGRESS
// =====================================================

/** Horizontal progress bar; `value` is the percent complete (0–100). */
export const Progress = React.forwardRef<
    React.ComponentRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
        /** Percent complete, 0–100. */
        value?: number;
    }
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-foreground transition-all duration-300 yunui-accent-bg"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// =====================================================
// TABS
// =====================================================

/** Radix Tabs root — manages the active tab. Compose with TabsList/TabsTrigger/TabsContent. */
export const Tabs = TabsPrimitive.Root;

/** Horizontal container holding the TabsTriggers. */
export const TabsList = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-11 items-center justify-center rounded-xl bg-muted p-1 flex-nowrap overflow-x-auto overflow-y-hidden overscroll-x-contain",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/** Clickable tab that activates its matching TabsContent. */
export const TabsTrigger = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[state=active]:bg-card data-[state=active]:shadow-sm",
            "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
            "yunui-tab-trigger",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/** Panel shown when its matching TabsTrigger is active. */
export const TabsContent = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn("mt-4 focus-visible:outline-none", className)}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// =====================================================
// AVATAR
// =====================================================

/** Circular avatar container. Compose with AvatarImage + AvatarFallback. */
export const Avatar = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/** The avatar's image; falls back to AvatarFallback if it fails to load. */
export const AvatarImage = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/** Placeholder (e.g. initials) shown when the avatar image is missing or loading. */
export const AvatarFallback = React.forwardRef<
    React.ComponentRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// =====================================================
// AVATAR GROUP
// =====================================================

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Cap how many avatars render; the remainder collapse into a "+N" chip. */
    max?: number;
}

/** Overlapping row of `Avatar`s with an optional "+N" overflow chip. */
export function AvatarGroup({ className, max, children, ...props }: AvatarGroupProps) {
    const items = React.Children.toArray(children);
    const shown = max != null ? items.slice(0, max) : items;
    const overflow = items.length - shown.length;
    // The separating ring is an inline box-shadow (not a `ring-*`/`border-*`
    // utility) so it renders in any consumer without depending on those classes
    // being generated, and without changing the avatar's box size.
    const ring = { boxShadow: "0 0 0 2px var(--color-background)" };
    return (
        <div className={cn("flex items-center -space-x-2", className)} {...props}>
            {shown.map((child, i) => (
                <div key={i} className="rounded-full" style={ring}>
                    {child}
                </div>
            ))}
            {overflow > 0 && (
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    style={ring}
                >
                    +{overflow}
                </div>
            )}
        </div>
    );
}

// =====================================================
// TOOLTIP
// =====================================================

/** Wraps tooltips to share open/close timing; place once near the app root. */
export const TooltipProvider = TooltipPrimitive.Provider;
/** Radix Tooltip root — pairs a trigger with its content. */
export const Tooltip = TooltipPrimitive.Root;
/** Element that shows the tooltip on hover/focus. */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/** The floating tooltip bubble. */
export const TooltipContent = React.forwardRef<
    React.ComponentRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-lg bg-foreground px-3 py-1.5 text-xs text-background shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// =====================================================
// SKELETON
// =====================================================

/** Pulsing placeholder block for loading states; size it via `className`. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-lg bg-muted", className)}
            {...props}
        />
    );
}

// =====================================================
// SPINNER
// =====================================================

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Size: `sm` (16px), `md` (24px, default), or `lg` (32px). */
    size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
};

/** Animated loading spinner with an accessible "Loading…" label. */
export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
    return (
        <div role="status" className={cn("inline-flex", className)} {...props}>
            <Loader2 className={cn("animate-spin text-muted-foreground", spinnerSizes[size])} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// =====================================================
// PAGE LOADER
// =====================================================

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Primary loading message shown under the spinner. */
    title?: string;
    /** Secondary, lighter message under the title. */
    subtitle?: string;
}

/** Full-viewport centered loading screen with a spinner and optional title/subtitle. */
export function PageLoader({ title, subtitle, className, ...props }: PageLoaderProps) {
    return (
        <div
            className={cn("flex items-center justify-center min-h-dvh w-full", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                {(title || subtitle) && (
                    <div className="flex flex-col items-center gap-1">
                        {title && (
                            <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        )}
                        {subtitle && (
                            <p className="text-muted-foreground/60 text-xs">{subtitle}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// =====================================================
// EMPTY STATE
// =====================================================

interface EmptyStateProps {
    /** Icon/illustration shown above the title. */
    icon?: React.ReactNode;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description?: string;
    /** Action slot (e.g. a primary button) below the text. */
    action?: React.ReactNode;
}

/** Centered "nothing here" placeholder with an icon, title, description, and action. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="text-4xl mb-4">{icon}</div>}
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
            {action}
        </div>
    );
}

// =====================================================
// MOTION COMPONENTS
// =====================================================

export const MotionDiv = motion.div;
export const MotionSpan = motion.span;

export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
};

export const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.05 },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// =====================================================
// ICON BUTTON
// =====================================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** The icon to render inside the button. */
    icon: React.ReactNode;
    /** Accessible label, also shown as the hover tooltip. */
    label: string;
}

/** Icon-only button with a built-in tooltip (uses `label` for both a11y and the tooltip text). */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon, label, ...props }, ref) => {
        return (
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            ref={ref}
                            type={props.type ?? "button"}
                            aria-label={label}
                            className={cn(
                                "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                className
                            )}
                            {...props}
                        >
                            <span aria-hidden="true">{icon}</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
);
IconButton.displayName = "IconButton";

// =====================================================
// LABEL
// =====================================================

/** Uppercase, muted form-field label. */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2",
                className
            )}
            {...props}
        />
    );
}

// =====================================================
// DROPDOWN MENU
// =====================================================

/** Radix DropdownMenu root — a contextual actions menu. Compose with DropdownMenu* parts. */
export const DropdownMenu = DropdownMenuPrimitive.Root;
/** Element that opens the dropdown menu. */
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
/** Groups related menu items. */
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
/** Portals menu content into the document body. */
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
/** Wraps a nested submenu (use with DropdownMenuSubTrigger/SubContent). */
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
/** Groups DropdownMenuRadioItems into a single-choice set. */
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/** Item that opens a nested submenu. `inset` adds left padding to align with checkable items. */
export const DropdownMenuSubTrigger = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-muted focus:text-foreground data-[state=open]:bg-muted",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

/** The panel for a nested submenu. */
export const DropdownMenuSubContent = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            "z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-2xl p-1 text-popover-foreground shadow-lg shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

/** Portalled, animated dropdown menu panel holding the items. */
export const DropdownMenuContent = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-32 overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-2xl p-1 text-popover-foreground shadow-lg shadow-black/5",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/** A clickable menu action. `inset` adds left padding to align with checkable items. */
export const DropdownMenuItem = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        /** Indent to align with checkbox/radio items. */
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuItemInternal
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuItemInternal = DropdownMenuPrimitive.Item;

/** A toggleable menu item showing a check when `checked`. */
export const DropdownMenuCheckboxItem = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

/** A single-choice menu item; use inside a DropdownMenuRadioGroup. */
export const DropdownMenuRadioItem = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <CheckCircle2 className="h-2 w-2 fill-current" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

/** Non-interactive section heading inside the menu. `inset` indents it to align with items. */
export const DropdownMenuLabel = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        /** Indent to align with checkbox/radio items. */
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/** Thin divider between groups of menu items. */
export const DropdownMenuSeparator = React.forwardRef<
    React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

/** Right-aligned keyboard-shortcut hint shown inside a menu item. */
export const DropdownMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// =====================================================
// RE-EXPORT COMBOBOX
// =====================================================

export { Combobox } from "./combobox";
export type { ComboboxOption } from "./combobox";

// =====================================================
// RE-EXPORT NEW PRIMITIVES (accordion, radio-group, layout, table, breadcrumb, pagination)
// =====================================================

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { RadioGroup, RadioGroupItem } from "./radio-group";
export { Flex, Grid, Column, Row, Stack } from "./layout";
export type { FlexProps, GridProps, SpacingScale, GridCount } from "./layout";
export {
    Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption,
    Thead, Tbody, Tfoot, Tr, Th, Td,
} from "./table";
export {
    Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbSeparator, BreadcrumbPage, BreadcrumbEllipsis,
} from "./breadcrumb";
export { Pagination, type PaginationProps } from "./pagination";
