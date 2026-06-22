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
    /** Whether the sheet is open (controlled). */
    open: boolean;
    /** Called when the sheet should close (backdrop click, escape, close button). */
    onClose: () => void;
    children: React.ReactNode;
    /** Optional header title. */
    title?: string;
}
/** Mobile-only slide-in panel from the right, with a backdrop (hidden on `lg` and up). */
declare function Sheet({ open, onClose, children, title }: SheetProps): React$1.ReactPortal | null;

interface CheckboxProps {
    /** Whether the box is checked (controlled). */
    checked: boolean;
    /** Called with the next checked state when toggled. */
    onCheckedChange: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}
/** Controlled checkbox rendered as an accessible toggle button with a check icon. */
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * `cn("px-4", "px-8")` → `"px-8"`.
 */
declare function cn(...inputs: ClassValue[]): string;

interface ComboboxOption {
    /** The value reported to `onChange` when selected. */
    value: string;
    /** Display text for the option. */
    label: string;
    /** Optional secondary text for the option. */
    description?: string;
    /**
     * Optional resolved icon URL for the option. The host app resolves this
     * (e.g. from a provider id) before passing options in — YunUI stays
     * domain-agnostic.
     */
    iconUrl?: string | null;
}
interface ComboboxProps {
    /** The selectable options. */
    options: ComboboxOption[];
    /** Currently selected value (controlled). */
    value: string;
    /** Called with the chosen (or newly created) value. */
    onChange: (value: string) => void;
    /** Placeholder for the input (falls back to i18n default). */
    placeholder?: string;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Allow entering a value not in `options` (creatable). @defaultValue true */
    allowCustom?: boolean;
    /** Label template for the "create new" row; `{value}` is replaced with the typed text. */
    creatableText?: string;
}
/** Searchable, optionally creatable combobox — type to filter, Enter to pick or create. */
declare function Combobox({ options, value, onChange, placeholder, className, disabled, allowCustom, creatableText, }: ComboboxProps): React$1.JSX.Element;

interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style. Options: `primary`, `secondary`, `ghost`, `accent`, `outline`, `amber`, `red`/`destructive`.
     * @defaultValue "default"
     */
    variant?: /** @deprecated alias of `primary` */ "default" | "primary" | "secondary" | "ghost" | "accent" | "outline" | "amber" | /** @deprecated alias of `destructive` */ "red" | "destructive";
    /** Size: `sm`, `md` (default), `lg`, or `icon` (square 40×40). */
    size?: "sm" | "md" | "lg" | "icon";
    /** Show a spinner before the children and disable the button while busy. */
    loading?: boolean;
    /** Render the single child element with the button styling instead of a <button> (e.g. wrap a <Link>). */
    asChild?: boolean;
}
/** Primary action button with style variants, sizes, a loading spinner, and `asChild` slotting. */
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;
interface InputProps extends React$1.InputHTMLAttributes<HTMLInputElement> {
    /** Leading icon rendered inside the field on the left. */
    icon?: React$1.ReactNode;
    /** Error message shown below the field; also switches the border to a red error style. */
    error?: string;
}
/** Single-line text input with an optional leading icon and inline error message. */
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;
interface TextareaProps extends React$1.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Error message shown below the field; also switches the border to a red error style. */
    error?: string;
}
/** Multi-line text input with an inline error message. */
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;
interface CardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Add a hover lift (border + shadow transition). */
    hover?: boolean;
}
/** Surface container rendering the canonical `.card` style. */
declare const Card: React$1.ForwardRefExoticComponent<CardProps & React$1.RefAttributes<HTMLDivElement>>;
interface BadgeProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    /** Semantic color: `default` (neutral), `success`, `warning`, `error`, or `info`. */
    variant?: "default" | "success" | "warning" | "error" | "info";
}
/** Small inline pill for status/labels, with semantic color variants. */
declare function Badge({ className, variant, ...props }: BadgeProps): React$1.JSX.Element;
/** Radix Dialog root — controls open state for a modal dialog. Compose with Dialog* parts. */
declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
/** Element that opens the dialog when activated. */
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
/** Portals dialog content into the document body. */
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
/** Element that closes the dialog when activated. */
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
/** Dimmed, blurred backdrop behind the dialog content. */
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Centered, animated dialog panel (includes the overlay and a built-in close button). */
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Header layout block for the dialog title/description. */
declare function DialogHeader({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
/** Accessible dialog title (labels the dialog for screen readers). */
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
/** Accessible dialog description (supplementary text under the title). */
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;
/** Footer layout block (right-aligned action buttons) for the dialog. */
declare function DialogFooter({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
/** Radix Select root — a styled native-feeling single-select. Compose with Select* parts. */
declare const Select: React$1.FC<SelectPrimitive.SelectProps>;
/** Renders the selected value (or placeholder) inside the trigger. */
declare const SelectValue: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
/** Groups related SelectItems together. */
declare const SelectGroup: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
/** Button that opens the select dropdown and shows the current value. */
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
/** Portalled, animated dropdown panel holding the SelectItems. */
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** A selectable option in the dropdown (shows a check when selected). */
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Range slider with a track, filled range, and draggable thumb. */
declare const Slider: React$1.ForwardRefExoticComponent<Omit<SliderPrimitive.SliderProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
/** Horizontal progress bar; `value` is the percent complete (0–100). */
declare const Progress: React$1.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    /** Percent complete, 0–100. */
    value?: number;
} & React$1.RefAttributes<HTMLDivElement>>;
/** Radix Tabs root — manages the active tab. Compose with TabsList/TabsTrigger/TabsContent. */
declare const Tabs: React$1.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React$1.RefAttributes<HTMLDivElement>>;
/** Horizontal container holding the TabsTriggers. */
declare const TabsList: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Clickable tab that activates its matching TabsContent. */
declare const TabsTrigger: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
/** Panel shown when its matching TabsTrigger is active. */
declare const TabsContent: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Circular avatar container. Compose with AvatarImage + AvatarFallback. */
declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
/** The avatar's image; falls back to AvatarFallback if it fails to load. */
declare const AvatarImage: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React$1.RefAttributes<HTMLImageElement>, "ref"> & React$1.RefAttributes<HTMLImageElement>>;
/** Placeholder (e.g. initials) shown when the avatar image is missing or loading. */
declare const AvatarFallback: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
/** Wraps tooltips to share open/close timing; place once near the app root. */
declare const TooltipProvider: React$1.FC<TooltipPrimitive.TooltipProviderProps>;
/** Radix Tooltip root — pairs a trigger with its content. */
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
/** Element that shows the tooltip on hover/focus. */
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
/** The floating tooltip bubble. */
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Pulsing placeholder block for loading states; size it via `className`. */
declare function Skeleton({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): React$1.JSX.Element;
interface SpinnerProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Size: `sm` (16px), `md` (24px, default), or `lg` (32px). */
    size?: "sm" | "md" | "lg";
}
/** Animated loading spinner with an accessible "Loading…" label. */
declare function Spinner({ size, className, ...props }: SpinnerProps): React$1.JSX.Element;
interface PageLoaderProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Primary loading message shown under the spinner. */
    title?: string;
    /** Secondary, lighter message under the title. */
    subtitle?: string;
}
/** Full-viewport centered loading screen with a spinner and optional title/subtitle. */
declare function PageLoader({ title, subtitle, className, ...props }: PageLoaderProps): React$1.JSX.Element;
interface EmptyStateProps {
    /** Icon/illustration shown above the title. */
    icon?: React$1.ReactNode;
    /** Heading text. */
    title: string;
    /** Supporting text below the title. */
    description?: string;
    /** Action slot (e.g. a primary button) below the text. */
    action?: React$1.ReactNode;
}
/** Centered "nothing here" placeholder with an icon, title, description, and action. */
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
    /** The icon to render inside the button. */
    icon: React$1.ReactNode;
    /** Accessible label, also shown as the hover tooltip. */
    label: string;
}
/** Icon-only button with a built-in tooltip (uses `label` for both a11y and the tooltip text). */
declare const IconButton: React$1.ForwardRefExoticComponent<IconButtonProps & React$1.RefAttributes<HTMLButtonElement>>;
/** Uppercase, muted form-field label. */
declare function Label({ className, ...props }: React$1.LabelHTMLAttributes<HTMLLabelElement>): React$1.JSX.Element;
/** Radix DropdownMenu root — a contextual actions menu. Compose with DropdownMenu* parts. */
declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
/** Element that opens the dropdown menu. */
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
/** Groups related menu items. */
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
/** Portals menu content into the document body. */
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
/** Wraps a nested submenu (use with DropdownMenuSubTrigger/SubContent). */
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
/** Groups DropdownMenuRadioItems into a single-choice set. */
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
/** Item that opens a nested submenu. `inset` adds left padding to align with checkable items. */
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
/** The panel for a nested submenu. */
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Portalled, animated dropdown menu panel holding the items. */
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** A clickable menu action. `inset` adds left padding to align with checkable items. */
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    /** Indent to align with checkbox/radio items. */
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
/** A toggleable menu item showing a check when `checked`. */
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** A single-choice menu item; use inside a DropdownMenuRadioGroup. */
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Non-interactive section heading inside the menu. `inset` indents it to align with items. */
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    /** Indent to align with checkbox/radio items. */
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
/** Thin divider between groups of menu items. */
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Right-aligned keyboard-shortcut hint shown inside a menu item. */
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): React$1.JSX.Element;
    displayName: string;
};

interface SelectOption {
    /** The value reported to `onChange` when selected. */
    value: string;
    /** Display text for the option. */
    label: string;
    /** Optional leading icon shown next to the label. */
    icon?: React.ReactNode;
    /** Optional secondary line shown under the label. */
    description?: string;
}
interface CustomSelectProps {
    /** The selectable options. */
    options: SelectOption[];
    /** Currently selected value (controlled). */
    value: string;
    /** Called with the chosen option's value. */
    onChange: (value: string) => void;
    /** Placeholder shown when nothing is selected (falls back to i18n default). */
    placeholder?: string;
    /** Show an in-dropdown search box that filters options by label/value. */
    searchable?: boolean;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
}
/** Custom dropdown select with optional search, icons, descriptions, and full keyboard support. */
declare function CustomSelect({ options, value, onChange, placeholder, searchable, className, disabled, }: CustomSelectProps): React$1.JSX.Element;

interface SegmentedOption<T = string> {
    /** The value reported to `onChange` when selected. */
    value: T;
    /** Display text for the segment. */
    label: string;
    /** Optional native tooltip (`title`) for the segment. */
    desc?: string;
    /** Optional Lucide icon shown before the label. */
    icon?: LucideIcon;
}
interface SegmentedSelectProps<T = string> {
    /** The selectable segments. */
    options: SegmentedOption<T>[];
    /** Currently selected value (controlled). */
    value: T;
    /** Called with the chosen segment's value. */
    onChange: (value: T) => void;
    className?: string;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
}
/** Inline segmented control — a row of buttons where one option is active at a time. */
declare function SegmentedSelect<T = string>({ options, value, onChange, className, disabled, }: SegmentedSelectProps<T>): React$1.JSX.Element;

interface NavTab {
    /** Unique key; matched against `activeKey` to mark the active tab. */
    key: string;
    /** Tab label content. */
    label: ReactNode;
    /** When set, the tab renders as a route Link instead of a button. */
    href?: string;
}
interface NavTabsProps {
    /** The tabs to render. */
    tabs: NavTab[];
    /** Key of the currently active tab. */
    activeKey: string;
    /** Called for button-mode (in-page) tabs. Ignored when tabs use `href`. */
    onChange?: (key: string) => void;
    className?: string;
    /** Accessible label for the tab `<nav>`. */
    ariaLabel?: string;
}
/**
 * The canonical horizontal tab bar. Each tab owns its indicator (the `.nav-tab`
 * `::after`), which slides in + fades + grows exactly like the sidebar's
 * per-item active bar, just rotated to the bottom edge and sitting inside the
 * tab's floating hover box. Hovering raises that soft rounded box (懸浮框).
 */
declare function NavTabs({ tabs, activeKey, onChange, className, ariaLabel }: NavTabsProps): React$1.JSX.Element;

/** CTA button with an animated shimmer sweep and a trailing arrow; renders a Link when `href` is set. */
declare function ShinyButton({ children, className, href, onClick, }: {
    children: ReactNode;
    className?: string;
    /** When set, renders as a routing Link to this destination instead of a button. */
    href?: string;
    onClick?: () => void;
}): React$1.JSX.Element;

/** Infinitely scrolling row (or column) that repeats its children; supports reverse direction and pause-on-hover. */
declare function Marquee({ className, reverse, pauseOnHover, children, vertical, repeat, ...props }: {
    className?: string;
    /** Scroll in the opposite direction. */
    reverse?: boolean;
    /** Pause the animation while hovered. */
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    /** Scroll vertically instead of horizontally. */
    vertical?: boolean;
    /** How many times to repeat the children to fill the loop. @defaultValue 4 */
    repeat?: number;
    [key: string]: unknown;
}): React$1.JSX.Element;

/** Responsive bento-style grid container for BentoCard children. */
declare const BentoGrid: ({ className, children, }: {
    className?: string;
    children?: ReactNode;
}) => React$1.JSX.Element;
/** A glass card tile for use inside a BentoGrid, with a header slot, icon, title, and description. */
declare const BentoCard: ({ className, title, description, header, icon, }: {
    className?: string;
    /** Card title. */
    title?: string | ReactNode;
    /** Card body text. */
    description?: string | ReactNode;
    /** Top media/visual slot above the icon and text. */
    header?: ReactNode;
    /** Icon shown above the title. */
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
    /** Visual variant: `icon` (default, icon-only) or `pill`. */
    variant?: "icon" | "pill";
    /** Dropdown alignment: `left` or `right` (default). */
    align?: "left" | "right";
    /** Additional className */
    className?: string;
}
/** Theme switcher dropdown (light / dark / true-black / system) backed by next-themes. */
declare function ThemeToggle({ variant, align, className }: ThemeToggleProps): React$1.JSX.Element;

interface SwitchProps {
    /** Whether the switch is on (controlled). */
    checked: boolean;
    /** Called with the next checked state when toggled. */
    onCheckedChange: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    /** Size: `sm` (default) or `md`. */
    size?: "sm" | "md";
    /** Checked-state color: `default`, `success`, `warning`, or `danger`. */
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}
/** Controlled on/off toggle rendered as an accessible switch button. */
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
