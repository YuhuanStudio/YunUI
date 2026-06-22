import * as framer_motion from 'framer-motion';
import * as React$1 from 'react';
import { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { LucideIcon } from 'lucide-react';
import * as Primitive from '@radix-ui/react-collapsible';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ClassValue } from 'clsx';

/**
 * Modal Size Classes
 *
 * Consistent across all modal implementations
 */
declare const SIZE_CLASSES: {
    readonly sm: "max-w-sm";
    readonly md: "max-w-md";
    readonly lg: "max-w-lg";
    readonly xl: "max-w-xl";
    readonly "2xl": "max-w-2xl";
    readonly "3xl": "max-w-3xl";
    readonly "4xl": "max-w-4xl";
    readonly "5xl": "max-w-5xl";
    readonly "6xl": "max-w-6xl";
    readonly full: "max-w-[95vw]";
};
type ModalSize = keyof typeof SIZE_CLASSES;

/**
 * Modal System Types
 *
 * Unified type definitions for all modal components
 */

/**
 * Base Modal Props
 *
 * Common props shared by all modal types
 */
interface BaseModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal title (required for accessibility) */
    title: string;
    /** Optional subtitle displayed below title */
    subtitle?: string;
    /** Modal size */
    size?: ModalSize;
    /** Additional CSS classes */
    className?: string;
}
/**
 * Standard Modal Props
 *
 * For general-purpose modals with content and optional footer
 */
interface ModalProps extends BaseModalProps {
    /** Modal content */
    children: ReactNode;
    /** Optional footer content */
    footer?: ReactNode;
    /** Whether to show the close button */
    showCloseButton?: boolean;
    /** Whether modal is in closing animation state */
    isClosing?: boolean;
    /** Callback to set closing state */
    setIsClosing?: (closing: boolean) => void;
    /** Whether to show unsaved changes badge */
    showUnsavedBadge?: boolean;
    /** Custom max-height override */
    maxHeight?: string;
    /** Called when backdrop is clicked (defaults to onClose) */
    onBackdropClick?: () => void;
}
/**
 * Confirm Modal Variant
 */
type ConfirmModalVariant = "danger" | "warning" | "info" | "success";
/**
 * Confirm Modal Props
 *
 * For confirmation dialogs with confirm/cancel actions
 */
interface ConfirmModalProps extends BaseModalProps {
    /** Main message content */
    message: ReactNode;
    /** Variant affects icon and button colors */
    variant?: ConfirmModalVariant;
    /** Text for confirm button */
    confirmText?: string;
    /** Text for cancel button */
    cancelText?: string;
    /** Whether action is in progress */
    isLoading?: boolean;
    /** Called when user confirms */
    onConfirm: () => void;
    /** Custom icon (overrides variant default) */
    icon?: ReactNode;
}
/**
 * Delete Confirm Modal Props
 */
interface DeleteConfirmModalProps extends Omit<ConfirmModalProps, "variant" | "title" | "confirmText" | "message"> {
    /** Name of item to delete */
    itemName: string;
}
/**
 * Regenerate Confirm Modal Props
 */
interface RegenerateConfirmModalProps extends Omit<ConfirmModalProps, "variant" | "title" | "confirmText" | "message"> {
    /** Name of item to regenerate */
    itemName: string;
}

declare function Modal({ isOpen, onClose, title, subtitle, children, footer, size, className, showCloseButton, isClosing: externalIsClosing, setIsClosing: externalSetIsClosing, showUnsavedBadge, maxHeight, onBackdropClick, }: ModalProps): React$1.ReactPortal | null;

declare function ConfirmModal({ isOpen, title, subtitle, message, variant, confirmText, cancelText, isLoading, onConfirm, onClose, className, icon, }: ConfirmModalProps): React$1.ReactPortal | null;
/**
 * Quick confirm dialog for delete actions
 */
declare function DeleteConfirmModal({ itemName, ...props }: DeleteConfirmModalProps): React$1.JSX.Element;
/**
 * Quick confirm dialog for regenerate actions
 */
declare function RegenerateConfirmModal({ itemName, ...props }: RegenerateConfirmModalProps): React$1.JSX.Element;

interface SheetProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}
declare function Sheet({ open, onClose, children, title }: SheetProps): React$1.ReactPortal | null;

interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
}
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * `cn("px-4", "px-8")` → `"px-8"`.
 */
declare function cn(...inputs: ClassValue[]): string;

interface ComboboxOption {
    value: string;
    label: string;
    description?: string;
    /**
     * Optional resolved icon URL for the option. The host app resolves this
     * (e.g. from a provider id) before passing options in — YunUI stays
     * domain-agnostic.
     */
    iconUrl?: string | null;
}
interface ComboboxProps {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    allowCustom?: boolean;
    creatableText?: string;
}
declare function Combobox({ options, value, onChange, placeholder, className, disabled, allowCustom, creatableText, }: ComboboxProps): React$1.JSX.Element;

interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "primary" | "secondary" | "ghost" | "accent" | "outline" | "amber" | "red" | "destructive";
    size?: "sm" | "md" | "lg" | "icon";
    loading?: boolean;
    /** Render the single child element with the button styling instead of a <button> (e.g. wrap a <Link>). */
    asChild?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;
interface InputProps extends React$1.InputHTMLAttributes<HTMLInputElement> {
    icon?: React$1.ReactNode;
    error?: string;
}
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;
interface TextareaProps extends React$1.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;
interface CardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}
declare const Card: React$1.ForwardRefExoticComponent<CardProps & React$1.RefAttributes<HTMLDivElement>>;
interface BadgeProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info";
}
declare function Badge({ className, variant, ...props }: BadgeProps): React$1.JSX.Element;
declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare function DialogHeader({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;
declare function DialogFooter({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
declare const Select: React$1.FC<SelectPrimitive.SelectProps>;
declare const SelectValue: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
declare const SelectGroup: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const Slider: React$1.ForwardRefExoticComponent<Omit<SliderPrimitive.SliderProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const Progress: React$1.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    value?: number;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const Tabs: React$1.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsList: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React$1.RefAttributes<HTMLImageElement>, "ref"> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const TooltipProvider: React$1.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare function Skeleton({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
interface SpinnerProps extends React$1.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}
declare function Spinner({ size, className, ...props }: SpinnerProps): React$1.JSX.Element;
interface PageLoaderProps extends React$1.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
}
declare function PageLoader({ title, subtitle, className, ...props }: PageLoaderProps): React$1.JSX.Element;
interface EmptyStateProps {
    icon?: React$1.ReactNode;
    title: string;
    description?: string;
    action?: React$1.ReactNode;
}
declare function EmptyState({ icon, title, description, action }: EmptyStateProps): React$1.JSX.Element;
declare const MotionDiv: framer_motion.ForwardRefComponent<HTMLDivElement, framer_motion.HTMLMotionProps<"div">>;
declare const MotionSpan: framer_motion.ForwardRefComponent<HTMLSpanElement, framer_motion.HTMLMotionProps<"span">>;
declare const fadeIn: {
    initial: {
        opacity: number;
        y: number;
    };
    animate: {
        opacity: number;
        y: number;
    };
    exit: {
        opacity: number;
        y: number;
    };
    transition: {
        duration: number;
    };
};
declare const staggerContainer: {
    animate: {
        transition: {
            staggerChildren: number;
        };
    };
};
declare const staggerItem: {
    initial: {
        opacity: number;
        y: number;
    };
    animate: {
        opacity: number;
        y: number;
    };
};
interface IconButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React$1.ReactNode;
    label: string;
}
declare const IconButton: React$1.ForwardRefExoticComponent<IconButtonProps & React$1.RefAttributes<HTMLButtonElement>>;
declare function Label({ className, ...props }: React$1.LabelHTMLAttributes<HTMLLabelElement>): React$1.JSX.Element;
declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): React$1.JSX.Element;
    displayName: string;
};

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
}
interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchable?: boolean;
    className?: string;
    disabled?: boolean;
}
declare function CustomSelect({ options, value, onChange, placeholder, searchable, className, disabled, }: CustomSelectProps): React$1.JSX.Element;

interface SegmentedOption<T = string> {
    value: T;
    label: string;
    desc?: string;
    icon?: LucideIcon;
}
interface SegmentedSelectProps<T = string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    disabled?: boolean;
}
declare function SegmentedSelect<T = string>({ options, value, onChange, className, disabled, }: SegmentedSelectProps<T>): React$1.JSX.Element;

interface NavTab {
    key: string;
    label: ReactNode;
    /** When set, the tab renders as a route Link instead of a button. */
    href?: string;
}
interface NavTabsProps {
    tabs: NavTab[];
    activeKey: string;
    /** Called for button-mode (in-page) tabs. Ignored when tabs use `href`. */
    onChange?: (key: string) => void;
    className?: string;
    ariaLabel?: string;
}
/**
 * The canonical horizontal tab bar. Each tab owns its indicator (the `.nav-tab`
 * `::after`), which slides in + fades + grows exactly like the sidebar's
 * per-item active bar, just rotated to the bottom edge and sitting inside the
 * tab's floating hover box. Hovering raises that soft rounded box (懸浮框).
 */
declare function NavTabs({ tabs, activeKey, onChange, className, ariaLabel }: NavTabsProps): React$1.JSX.Element;

declare function ShinyButton({ children, className, href, onClick, }: {
    children: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
}): React$1.JSX.Element;

declare function Marquee({ className, reverse, pauseOnHover, children, vertical, repeat, ...props }: {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    vertical?: boolean;
    repeat?: number;
    [key: string]: unknown;
}): React$1.JSX.Element;

declare const BentoGrid: ({ className, children, }: {
    className?: string;
    children?: ReactNode;
}) => React$1.JSX.Element;
declare const BentoCard: ({ className, title, description, header, icon, }: {
    className?: string;
    title?: string | ReactNode;
    description?: string | ReactNode;
    header?: ReactNode;
    icon?: ReactNode;
}) => React$1.JSX.Element;

declare const Collapsible: React$1.ForwardRefExoticComponent<Primitive.CollapsibleProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CollapsibleTrigger: React$1.ForwardRefExoticComponent<Primitive.CollapsibleTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const CollapsibleContent: React$1.ForwardRefExoticComponent<Omit<Primitive.CollapsibleContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type CollapsibleProps = Primitive.CollapsibleProps;
type CollapsibleContentProps = Primitive.CollapsibleContentProps;
type CollapsibleTriggerProps = Primitive.CollapsibleTriggerProps;

declare const Popover: React$1.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const PopoverClose: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverCloseProps & React$1.RefAttributes<HTMLButtonElement>>;

interface ThemeToggleProps {
    /** Visual variant */
    variant?: "icon" | "pill";
    /** Dropdown alignment */
    align?: "left" | "right";
    /** Additional className */
    className?: string;
}
declare function ThemeToggle({ variant, align, className }: ThemeToggleProps): React$1.JSX.Element;

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md";
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
    id?: string;
}
declare const Switch: React$1.ForwardRefExoticComponent<SwitchProps & React$1.RefAttributes<HTMLButtonElement>>;

interface AnimatedNumberProps {
    value: number;
    suffix?: string;
    /** Decimal places; trailing zeros are stripped (100.00 → 100). */
    decimals?: number;
}
/**
 * A number that springs from 0 up to `value` on mount / when `value` changes.
 * Starts at 0 on both server and client, so it is SSR-hydration safe.
 */
declare function AnimatedNumber({ value, suffix, decimals }: AnimatedNumberProps): React$1.JSX.Element;

declare function Toaster(): React$1.JSX.Element;
declare const toast: {
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
    warning: (message: string, description?: string) => void;
    loading: (message: string) => string | number;
    dismiss: (id?: string | number) => void;
    promise: <T>(promise: Promise<T>, messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
    }) => (string & {
        unwrap: () => Promise<T>;
    }) | (number & {
        unwrap: () => Promise<T>;
    }) | {
        unwrap: () => Promise<T>;
    };
};

/**
 * useEscapeKey - Hook for handling Escape key press
 *
 * Used by modals, dialogs, and other overlays to close on Escape key.
 */
/**
 * Hook that calls the callback when Escape key is pressed
 *
 * @param onEscape - Callback function to call when Escape is pressed
 * @param enabled - Whether the hook is active (default: true)
 *
 * @example
 * ```tsx
 * function MyModal({ onClose }) {
 *   useEscapeKey(onClose);
 *   return <div>Modal content</div>;
 * }
 * ```
 */
declare function useEscapeKey(onEscape: () => void, enabled?: boolean): void;
declare function useBodyScrollLock(locked?: boolean): void;
/**
 * Combined hook for modal behavior: Escape key + body scroll lock
 *
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   useModalBehavior(isOpen, onClose);
 *   if (!isOpen) return null;
 *   return <div>Modal content</div>;
 * }
 * ```
 */
declare function useModalBehavior(isOpen: boolean, onClose: () => void): void;

export { AnimatedNumber, type AnimatedNumberProps, Avatar, AvatarFallback, AvatarImage, Badge, BentoCard, BentoGrid, Button, Card, Checkbox, type CheckboxProps, Collapsible, CollapsibleContent, type CollapsibleContentProps, type CollapsibleProps, CollapsibleTrigger, type CollapsibleTriggerProps, Combobox, type ComboboxOption, ConfirmModal, type ConfirmModalVariant, CustomSelect, DeleteConfirmModal, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, IconButton, Input, Label, Marquee, Modal, MotionDiv, MotionSpan, type NavTab, NavTabs, PageLoader, Popover, PopoverClose, PopoverContent, PopoverTrigger, Progress, RegenerateConfirmModal, type SegmentedOption, SegmentedSelect, Select, SelectContent, SelectGroup, SelectItem, type SelectOption, SelectTrigger, SelectValue, Sheet, ShinyButton, Skeleton, Slider, Spinner, Switch, type SwitchProps, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, ThemeToggle, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn, fadeIn, staggerContainer, staggerItem, toast, useBodyScrollLock, useEscapeKey, useModalBehavior };
