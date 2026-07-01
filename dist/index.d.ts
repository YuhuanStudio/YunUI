import * as framer_motion from 'framer-motion';
import * as React$1 from 'react';
import { ReactNode, RefObject } from 'react';
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
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

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
    /** Hide on large screens (`lg`+) — for mobile-only drawers (e.g. a sidebar
     *  that's permanent on desktop). @defaultValue false (shows on all sizes). */
    mobileOnly?: boolean;
}
/** Slide-in panel from the right with a backdrop. By default it shows on every
 *  screen size; set `mobileOnly` to hide it on `lg`+ (a mobile-only drawer). */
declare function Sheet({ open, onClose, children, title, mobileOnly }: SheetProps): React$1.ReactPortal | null;

interface CheckboxProps {
    /** Whether the box is checked. `"indeterminate"` shows a dash — for a
     *  select-all that's only partially selected. Defaults to `false`. */
    checked?: boolean | "indeterminate";
    /** Called with the next checked state when toggled (indeterminate → checked).
     *  Optional — omit for a read-only/display checkbox (it won't toggle). */
    onCheckedChange?: (checked: boolean) => void;
    /** Disable interaction and dim the control. */
    disabled?: boolean;
    className?: string;
    /** Element id (e.g. to pair with a `<label htmlFor>`). */
    id?: string;
}
/** Controlled checkbox rendered as an accessible toggle button. Supports an
 *  `indeterminate` state (dash) for partial select-all. */
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
    /** When set, the "create new" row only appears for inputs passing this test. */
    creatableFilter?: (input: string) => boolean;
    /** Glyph shown on the "create new" row (default `+`). */
    creatableIcon?: ReactNode;
}
/** Searchable, optionally creatable combobox — type to filter, Enter to pick or create.
 *  For long lists where users type to narrow; see `Select`'s doc for "which select do I use". */
declare function Combobox({ options, value, onChange, placeholder, className, disabled, allowCustom, creatableText, creatableFilter, creatableIcon, }: ComboboxProps): React$1.JSX.Element;

/**
 * Radix Accordion root — a vertically stacked set of collapsible sections.
 *
 * Set `type="single"` for one-at-a-time panels (optionally `collapsible` so the
 * open one can be closed) or `type="multiple"` to allow several open at once.
 * Full keyboard a11y (arrow keys, Home/End, Enter/Space) comes from Radix.
 */
declare const Accordion: React$1.ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & React$1.RefAttributes<HTMLDivElement>>;
/** A single collapsible section. Give each a unique `value`. */
declare const AccordionItem: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/** Clickable header that toggles its section; shows a chevron that rotates when open. */
declare const AccordionTrigger: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
/**
 * Collapsible panel body. Animates its height open/closed by transitioning the
 * `grid-template-rows` `0fr` → `1fr` track, driven by Radix's
 * `data-state` attribute. Self-contained (no external keyframes required).
 */
declare const AccordionContent: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Radix RadioGroup root — a single-choice set of {@link RadioGroupItem}s.
 *
 * Controlled via `value`/`onValueChange` (or uncontrolled via `defaultValue`).
 * Arrow keys move and select within the group; the whole group is one tab stop.
 */
declare const RadioGroup: React$1.ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/**
 * A single radio option. Pair with a `<label htmlFor>` via `id`.
 * Renders a ring outline that fills with the primary accent and a center dot
 * when selected — matching YunUI's Checkbox/Switch visual language.
 */
declare const RadioGroupItem: React$1.ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupItemProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

/**
 * Supported spacing-scale values (Tailwind's default scale: 1 unit = 0.25rem).
 * A fixed set so the literal classes below are always present for the compiler.
 */
type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
declare const directionMap: {
    readonly row: "flex-row";
    readonly col: "flex-col";
    readonly "row-reverse": "flex-row-reverse";
    readonly "col-reverse": "flex-col-reverse";
};
type FlexDirection = keyof typeof directionMap;
declare const alignMap: {
    readonly start: "items-start";
    readonly center: "items-center";
    readonly end: "items-end";
    readonly stretch: "items-stretch";
    readonly baseline: "items-baseline";
};
type Align = keyof typeof alignMap;
declare const justifyMap: {
    readonly start: "justify-start";
    readonly center: "justify-center";
    readonly end: "justify-end";
    readonly between: "justify-between";
    readonly around: "justify-around";
    readonly evenly: "justify-evenly";
};
type Justify = keyof typeof justifyMap;
/** Supported fixed column/row counts (1–12), mapped to literal grid classes. */
type GridCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
interface FlexProps extends React$1.HTMLAttributes<HTMLElement> {
    /** Main axis direction. @defaultValue "row" */
    direction?: FlexDirection;
    /** Cross-axis alignment (`align-items`). */
    align?: Align;
    /** Main-axis distribution (`justify-content`). */
    justify?: Justify;
    /** Gap between children, on the spacing scale. */
    gap?: SpacingScale;
    /** Allow children to wrap onto multiple lines. */
    wrap?: boolean;
    /** Padding on all sides, on the spacing scale. */
    padding?: SpacingScale;
    /** Horizontal padding (`px`), on the spacing scale. */
    px?: SpacingScale;
    /** Vertical padding (`py`), on the spacing scale. */
    py?: SpacingScale;
    /** Element/tag to render as. @defaultValue "div" */
    as?: React$1.ElementType;
}
/**
 * Flexbox layout primitive. Maps `direction`/`align`/`justify`/`gap`/`wrap`/
 * padding props to literal Tailwind classes via static maps. Purely
 * presentational — extra props are spread onto the rendered element.
 */
declare const Flex: React$1.ForwardRefExoticComponent<FlexProps & React$1.RefAttributes<HTMLElement>>;
interface GridProps extends React$1.HTMLAttributes<HTMLElement> {
    /** Number of equal columns (1–12). */
    columns?: GridCount;
    /** Number of explicit rows (1–12). */
    rows?: GridCount;
    /** Gap between cells, on the spacing scale. */
    gap?: SpacingScale;
    /** Cross-axis alignment of items within their cells (`align-items`). */
    align?: Align;
    /** Padding on all sides, on the spacing scale. */
    padding?: SpacingScale;
    /** Stack into fewer columns on small screens (mobile-first ramp) instead of
     *  a literal `grid-cols-N` at every width. @defaultValue true */
    responsive?: boolean;
    /** Element/tag to render as. @defaultValue "div" */
    as?: React$1.ElementType;
}
/**
 * CSS-grid layout primitive. Maps `columns`/`rows`/`gap`/`align`/`padding`
 * to literal Tailwind classes via static maps. Purely presentational.
 */
declare const Grid: React$1.ForwardRefExoticComponent<GridProps & React$1.RefAttributes<HTMLElement>>;
/** Thin wrapper around {@link Flex} fixed to `direction="col"`. */
declare const Column: React$1.ForwardRefExoticComponent<Omit<FlexProps, "direction"> & React$1.RefAttributes<HTMLElement>>;
/** Thin wrapper around {@link Flex} fixed to `direction="row"`. */
declare const Row: React$1.ForwardRefExoticComponent<Omit<FlexProps, "direction"> & React$1.RefAttributes<HTMLElement>>;
/**
 * Vertical {@link Flex} (`direction="col"`) with a sensible default `gap`.
 * Alias of {@link Column} optimised for stacking content; override `gap` freely.
 */
declare const Stack: React$1.ForwardRefExoticComponent<Omit<FlexProps, "direction"> & React$1.RefAttributes<HTMLElement>>;

/**
 * Table root — wraps a `<table>` in an overflow container so wide tables scroll
 * horizontally instead of breaking the layout. `className` is applied to the
 * inner `<table>`; pass `containerClassName` to style the scroll wrapper.
 */
declare const Table: React$1.ForwardRefExoticComponent<React$1.TableHTMLAttributes<HTMLTableElement> & {
    /** Class applied to the outer scroll/overflow wrapper. */
    containerClassName?: string;
    /**
     * Stack each row into a labelled card below the `md` breakpoint, so dense
     * many-column tables stay readable on narrow screens instead of forcing a
     * horizontal scroll. Pair with `<TableCell label="…">` to label each value.
     */
    responsive?: boolean;
} & React$1.RefAttributes<HTMLTableElement>>;
/** Table header group (`<thead>`); contains the column-header row(s). */
declare const TableHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
/** Table body group (`<tbody>`); rows are divided by subtle borders. */
declare const TableBody: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
/** Table footer group (`<tfoot>`); a muted summary row band. */
declare const TableFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
/** Table row (`<tr>`) with a divider and hover highlight. */
declare const TableRow: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableRowElement> & React$1.RefAttributes<HTMLTableRowElement>>;
/** Column header cell (`<th>`): left-aligned, uppercase, muted, small. */
declare const TableHead: React$1.ForwardRefExoticComponent<React$1.ThHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
/** Standard data cell (`<td>`). */
declare const TableCell: React$1.ForwardRefExoticComponent<React$1.TdHTMLAttributes<HTMLTableCellElement> & {
    /** Column label shown beside the value when the parent `<Table responsive>`
     *  stacks rows into cards on narrow screens. */
    label?: string;
} & React$1.RefAttributes<HTMLTableCellElement>>;
/** Caption (`<caption>`) rendered below the table; muted helper text. */
declare const TableCaption: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableCaptionElement> & React$1.RefAttributes<HTMLTableCaptionElement>>;

/** Breadcrumb root: a `<nav>` landmark labelling the trail for screen readers. */
declare const Breadcrumb: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    /** Accessible name for the navigation landmark. @defaultValue "Breadcrumb" */
    "aria-label"?: string;
} & React$1.RefAttributes<HTMLElement>>;
/** Ordered list (`<ol>`) holding the breadcrumb items. */
declare const BreadcrumbList: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> & React$1.RefAttributes<HTMLOListElement>>;
/** A single breadcrumb item (`<li>`); wrap a link, page, or separator. */
declare const BreadcrumbItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
/**
 * A navigable breadcrumb link. Routes through the host app's `Link` adapter
 * (`useYunUI().Link`) so it integrates with the consumer's router; falls back
 * to a plain `<a>` when no provider is present.
 */
declare function BreadcrumbLink({ className, href, ...props }: {
    /** Destination URL. */
    href: string;
    children?: React$1.ReactNode;
    className?: string;
} & Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "href">): React$1.JSX.Element;
declare namespace BreadcrumbLink {
    var displayName: string;
}
/**
 * The current page in the trail. Non-interactive and marked
 * `aria-current="page"` for assistive tech.
 */
declare const BreadcrumbPage: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
/**
 * Visual separator between items (a chevron by default). Hidden from the
 * accessibility tree since it carries no information for screen readers.
 */
declare const BreadcrumbSeparator: {
    ({ children, className, ...props }: React$1.ComponentPropsWithoutRef<"li">): React$1.JSX.Element;
    displayName: string;
};
/**
 * Ellipsis placeholder for collapsed middle items in a long trail.
 */
declare const BreadcrumbEllipsis: {
    ({ className, ...props }: React$1.ComponentPropsWithoutRef<"span">): React$1.JSX.Element;
    displayName: string;
};

interface PaginationProps extends Omit<React$1.HTMLAttributes<HTMLElement>, "onChange"> {
    /** The active page (1-based). */
    page: number;
    /** Total number of pages. */
    totalPages: number;
    /** Called with the requested page when a control is activated. */
    onPageChange: (page: number) => void;
    /**
     * How many page buttons to show on each side of the current page before
     * collapsing into an ellipsis.
     * @defaultValue 1
     */
    siblingCount?: number;
    /** Accessible label for the previous-page button. @defaultValue "Go to previous page" */
    previousLabel?: string;
    /** Accessible label for the next-page button. @defaultValue "Go to next page" */
    nextLabel?: string;
    /** Accessible name for the wrapping nav landmark. @defaultValue "Pagination" */
    ariaLabel?: string;
}
/**
 * Controlled pagination control. Renders previous/next arrows plus numbered
 * page buttons with ellipsis truncation. The current page is highlighted with
 * the primary accent and exposes `aria-current="page"`; prev/next are disabled
 * at the bounds.
 */
declare const Pagination: React$1.ForwardRefExoticComponent<PaginationProps & React$1.RefAttributes<HTMLElement>>;

interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style. Options: `primary`, `secondary`, `ghost`, `accent`, `outline`, `amber`, `red`/`destructive`.
     * @defaultValue "default"
     */
    variant?: /** @deprecated alias of `primary` */ "default" | "primary" | "secondary" | "ghost" | "accent" | /** Solid fill from the runtime-themeable brand token (data-brand). */ "brand" | "outline" | "amber" | /** @deprecated alias of `destructive` */ "red" | "destructive";
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
interface PasswordInputProps extends Omit<InputProps, "icon" | "type"> {
    /** Accessible labels for the reveal toggle (English defaults). */
    labels?: {
        show?: string;
        hide?: string;
    };
}
/** Password field with a show/hide reveal toggle; same styling + error API as Input. */
declare const PasswordInput: React$1.ForwardRefExoticComponent<PasswordInputProps & React$1.RefAttributes<HTMLInputElement>>;
interface NumberInputProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
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
    labels?: {
        increment?: string;
        decrement?: string;
    };
}
/** Numeric field with −/+ steppers, min/max clamping, and the Input error API. */
declare const NumberInput: React$1.ForwardRefExoticComponent<NumberInputProps & React$1.RefAttributes<HTMLInputElement>>;
/** Inline keyboard-key / shortcut display, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
declare function Kbd({ className, ...props }: React$1.HTMLAttributes<HTMLElement>): React$1.JSX.Element;
interface SearchInputProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "size"> {
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
declare const SearchInput: React$1.ForwardRefExoticComponent<SearchInputProps & React$1.RefAttributes<HTMLInputElement>>;
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
interface SeparatorProps extends React$1.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    /** Purely decorative — no semantic role announced to assistive tech. */
    decorative?: boolean;
}
/** A thin divider line. Horizontal by default; set `orientation="vertical"` inside a flex row. */
declare function Separator({ className, orientation, decorative, ...props }: SeparatorProps): React$1.JSX.Element;
interface AlertProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: "info" | "success" | "warning" | "error";
    /** Optional bold title above the body. */
    title?: React$1.ReactNode;
    /** Leading icon. Defaults to a variant-appropriate icon; pass `null` to hide. */
    icon?: React$1.ReactNode;
}
/** Inline callout for info / success / warning / error messages. */
declare function Alert({ className, variant, title, icon, children, ...props }: AlertProps): React$1.JSX.Element;
interface TagProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    /** Show a remove (×) button and call this when it's pressed. */
    onRemove?: () => void;
    /** Accessible label for the remove button (English default). */
    removeLabel?: string;
}
/** A small label, optionally removable. Use `Badge` for non-interactive status text. */
declare function Tag({ className, children, onRemove, removeLabel, ...props }: TagProps): React$1.JSX.Element;
interface StatusIndicatorProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    status?: "online" | "offline" | "busy" | "away" | "neutral";
    /** Add a pulsing halo to signal "live". */
    pulse?: boolean;
}
/** A small colored status dot with an optional label (e.g. provider online/offline). */
declare function StatusIndicator({ status, pulse, className, children, ...props }: StatusIndicatorProps): React$1.JSX.Element;
type InlineStatusKind = "pending" | "processing" | "completed" | "failed";
interface InlineStatusProps {
    /** Job phase — drives the icon, color and whether it spins. */
    status: InlineStatusKind;
    /** The label for this status (host-supplied; no bundled copy). */
    label?: React$1.ReactNode;
    /** When in-progress and > 0, the percent replaces the label. */
    progress?: number;
    /** Icon size in px. */
    size?: number;
    className?: string;
}
/** A compact inline async-job status: a (spinning) icon plus a label or percent.
 *  For a presence dot use `StatusIndicator`; for an approval pill, `StatusBadge`. */
declare function InlineStatus({ status, label, progress, size, className }: InlineStatusProps): React$1.JSX.Element;
/** Inline `<code>` styling for code spans in prose or chat. Use `Kbd` for keys. */
declare function InlineCode({ className, ...props }: React$1.HTMLAttributes<HTMLElement>): React$1.JSX.Element;
interface Step {
    title: React$1.ReactNode;
    description?: React$1.ReactNode;
}
interface StepsProps extends Omit<React$1.HTMLAttributes<HTMLOListElement>, "children"> {
    steps: Step[];
    /** Zero-based index of the active step; earlier steps render as completed. */
    current?: number;
}
/** Vertical progress stepper: completed / active / upcoming states with a connector. */
declare function Steps({ steps, current, className, ...props }: StepsProps): React$1.JSX.Element;
/**
 * Radix Dialog root — controls open state for a modal dialog. Compose with Dialog* parts.
 *
 * The accessible default for dialogs (focus trap, escape, scroll lock, full ARIA).
 * For the prop-driven styled modal use `Modal`; for confirmations use
 * `ConfirmModal`/`DeleteConfirmModal`/`RegenerateConfirmModal` — see Modal's doc
 * for the full "which dialog do I use" guidance.
 */
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
interface AvatarGroupProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Cap how many avatars render; the remainder collapse into a "+N" chip. */
    max?: number;
}
/** Overlapping row of `Avatar`s with an optional "+N" overflow chip. */
declare function AvatarGroup({ className, max, children, ...props }: AvatarGroupProps): React$1.JSX.Element;
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
/** Custom dropdown select with optional search, icons, descriptions, and full keyboard support.
 *  Data-driven alternative to `Select`; see `Select`'s doc for "which select do I use". */
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
/** Inline segmented control — a row of buttons where one option is active at a time.
 *  For 2-5 always-visible choices (not a dropdown); see `Select`'s doc for "which select do I use". */
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
 *
 * `NavTabs` is a controlled nav bar (active key + onChange) — use it for page/
 * section navigation. For tab panels that show/hide content, use `Tabs` (Radix,
 * with `TabsList`/`TabsTrigger`/`TabsContent`).
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

type SparklineTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";
interface SparklineProps extends Omit<React.SVGProps<SVGSVGElement>, "color"> {
    /** The series to plot, oldest → newest. Fewer than 2 points renders nothing. */
    data: number[];
    /** Intrinsic viewBox width; the SVG still scales to its container. */
    width?: number;
    /** Intrinsic viewBox height. */
    height?: number;
    /** Semantic stroke color. Ignored when `color` is set. */
    tone?: SparklineTone;
    /** Explicit CSS color for the stroke (and area fill), overriding `tone`. */
    color?: string;
    /** Stroke width in viewBox units. */
    strokeWidth?: number;
    /** Fill the area under the line with a vertical gradient of the stroke color. */
    area?: boolean;
    /** Lower bound of the value axis. Defaults to the data minimum. */
    min?: number;
    /** Upper bound of the value axis. Defaults to the data maximum. */
    max?: number;
    className?: string;
}
/**
 * A minimal inline line chart. Give it a rolling window of numbers and it draws
 * a smooth, container-width sparkline; set `area` for a gradient fill.
 */
declare function Sparkline({ data, width, height, tone, color, strokeWidth, area, min, max, className, ...props }: SparklineProps): React$1.JSX.Element;

type GaugeTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";
interface GaugeProps {
    /** Progress, 0–100 (clamped). */
    value: number;
    /** Diameter in px. */
    size?: number;
    /** Ring thickness in px. */
    thickness?: number;
    /** Semantic arc color. Ignored when `color` is set. */
    tone?: GaugeTone;
    /** Explicit CSS color for the arc, overriding `tone`. */
    color?: string;
    /** Center content. Defaults to the rounded percentage; pass `null` to hide. */
    label?: ReactNode;
    /** Start the arc from the top and sweep clockwise (default) or counter-clockwise. */
    counterClockwise?: boolean;
    className?: string;
}
/**
 * A circular percentage gauge. Feed it a `value` (0–100) and it fills the ring
 * proportionally; the center renders the value unless you pass a custom `label`.
 */
declare function Gauge({ value, size, thickness, tone, color, label, counterClockwise, className, }: GaugeProps): React$1.JSX.Element;

type SegmentTone = "accent" | "success" | "warning" | "error" | "info" | "neutral";
interface BarSegment {
    /** Segment magnitude, in the same unit as `total`. */
    value: number;
    /** Semantic color. Ignored when `color` is set. */
    tone?: SegmentTone;
    /** Explicit CSS color, overriding `tone`. */
    color?: string;
    /** Legend label and segment title (tooltip). */
    label?: ReactNode;
}
interface SegmentedBarProps {
    /** The segments, drawn left → right. */
    segments: BarSegment[];
    /** Axis total. Defaults to the sum of segment values; the remainder shows as track. */
    total?: number;
    /** Bar thickness in px. */
    height?: number;
    /** Show a legend of segments with their values below the bar. */
    legend?: boolean;
    /** Format a segment value for the legend (e.g. bytes → "1.2 GB"). */
    formatValue?: (value: number) => ReactNode;
    className?: string;
}
/**
 * A proportional multi-segment bar. Give it segments and (optionally) a `total`;
 * each segment takes a slice of the width, with any leftover shown as track.
 */
declare function SegmentedBar({ segments, total, height, legend, formatValue, className, }: SegmentedBarProps): React$1.JSX.Element;

interface FileDropzoneProps {
    /** Called with the selected/dropped files (already filtered to a File[]). */
    onFiles: (files: File[]) => void;
    /** `accept` attribute forwarded to the input (e.g. "image/*,.wav"). */
    accept?: string;
    /** Allow selecting more than one file. */
    multiple?: boolean;
    /** Disable interaction and dim the zone. */
    disabled?: boolean;
    /** Leading icon shown above the label (ignored when `children` is set). */
    icon?: ReactNode;
    /** Primary call-to-action text (ignored when `children` is set). */
    label?: ReactNode;
    /** Secondary hint under the label (e.g. "PNG, JPG up to 10MB"). */
    hint?: ReactNode;
    /** Replace the entire inner content. */
    children?: ReactNode;
    className?: string;
}
/**
 * A dashed drop target that accepts files by drag-and-drop or click. Reports
 * selections through `onFiles`; style it via `className` or replace its body
 * with `children`.
 */
declare function FileDropzone({ onFiles, accept, multiple, disabled, icon, label, hint, children, className, }: FileDropzoneProps): React$1.JSX.Element;

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
declare function useFocusTrap(containerRef: RefObject<HTMLElement | null>, enabled?: boolean): void;

/**
 * Runtime theming for YunUI's token system.
 *
 * The design tokens (styles/tokens.css) are driven by data-* attributes on a
 * root element. Switching a role's palette is a single attribute change — no
 * rebuild, instant, and it cascades to every component/utility that consumes the
 * semantic tokens (e.g. the `bg-brand-solid-strong` / `text-accent-on-background-*`
 * utilities). Light/dark itself is still owned by your theme manager (e.g.
 * next-themes via the `.dark` class); this layer governs brand/accent/neutral
 * palette + solid/surface style.
 *
 *   import { applyTheme, useYunUITheme, YUNUI_PALETTES } from "@yuhuanowo/yunui";
 *   applyTheme({ brand: "emerald", accent: "violet" });   // imperative
 *   const [theme, setTheme] = useYunUITheme({ brand: "blue" }); // React, persisted
 */
type YunUIPalette = "gray" | "sand" | "slate" | "mint" | "rose" | "dusk" | "red" | "orange" | "amber" | "yellow" | "lime" | "moss" | "green" | "emerald" | "teal" | "aqua" | "cyan" | "blue" | "indigo" | "violet" | "plum" | "magenta" | "fuchsia" | "pink";
/** How solid (filled) surfaces derive their color. */
type YunUISolid = "color" | "contrast" | "inverse";
/** Whether elevated surfaces are opaque or frosted. */
type YunUISurface = "filled" | "translucent";
/** Color scheme — usually managed by your theme manager, exposed here for completeness. */
type YunUIColorScheme = "light" | "dark";
interface YunUITheme {
    /** Primary brand palette. */
    brand?: YunUIPalette;
    /** Secondary accent palette. */
    accent?: YunUIPalette;
    /** Neutral/gray palette (typically gray, sand, or slate). */
    neutral?: YunUIPalette;
    solid?: YunUISolid;
    surface?: YunUISurface;
    theme?: YunUIColorScheme;
    /**
     * Opt the legacy monochrome accent into the brand palette: `"brand"` makes
     * accent-driven components follow `brand`; `"mono"` (default) keeps the
     * original monochrome accent. Pairs with the `data-accent-source` CSS hook.
     */
    accentSource?: YunUIAccentSource;
}
/** Source for the accent color: the brand palette, or the default monochrome. */
type YunUIAccentSource = "brand" | "mono";
/** All palettes available to the brand/accent/neutral roles (for building pickers). */
declare const YUNUI_PALETTES: YunUIPalette[];
/**
 * Curated multi-color theme presets — beautiful {brand, accent, neutral}
 * combinations. Apply one with `applyTheme(YUNUI_THEME_PRESETS.aurora)` or feed
 * them into a theme picker. Each pairs a brand with a complementary accent and a
 * neutral tuned to the same temperature.
 */
interface YunUIThemePreset {
    /** Display name. */
    label: string;
    brand: YunUIPalette;
    accent: YunUIPalette;
    neutral: YunUIPalette;
}
declare const YUNUI_THEME_PRESETS: {
    aurora: {
        label: string;
        brand: "blue";
        accent: "violet";
        neutral: "slate";
    };
    sunset: {
        label: string;
        brand: "orange";
        accent: "pink";
        neutral: "sand";
    };
    forest: {
        label: string;
        brand: "green";
        accent: "lime";
        neutral: "gray";
    };
    ocean: {
        label: string;
        brand: "cyan";
        accent: "teal";
        neutral: "slate";
    };
    grape: {
        label: string;
        brand: "violet";
        accent: "magenta";
        neutral: "dusk";
    };
    ember: {
        label: string;
        brand: "red";
        accent: "amber";
        neutral: "sand";
    };
    lagoon: {
        label: string;
        brand: "teal";
        accent: "emerald";
        neutral: "mint";
    };
    blossom: {
        label: string;
        brand: "pink";
        accent: "fuchsia";
        neutral: "rose";
    };
    royal: {
        label: string;
        brand: "indigo";
        accent: "blue";
        neutral: "slate";
    };
    citrus: {
        label: string;
        brand: "lime";
        accent: "yellow";
        neutral: "sand";
    };
    orchid: {
        label: string;
        brand: "plum";
        accent: "violet";
        neutral: "dusk";
    };
    mono: {
        label: string;
        brand: "gray";
        accent: "gray";
        neutral: "gray";
    };
};
/** Preset keys, e.g. for iterating in a picker. */
type YunUIThemePresetName = keyof typeof YUNUI_THEME_PRESETS;
/**
 * Apply theme attributes to an element (defaults to <html>). Only the keys you
 * pass are written; pass `null` for a key to clear it. Safe to call on the
 * server (no-ops when there is no document and no explicit element).
 */
declare function applyTheme(theme: Partial<Record<keyof YunUITheme, string | null>>, el?: HTMLElement | null): void;
/** Read the current theme attributes back off an element (defaults to <html>). */
declare function readTheme(el?: HTMLElement | null): YunUITheme;
/**
 * React hook for runtime theming. Returns the current theme and a setter that
 * merges a patch, applies it to <html>, and persists to localStorage. On mount
 * it hydrates from localStorage (falling back to `defaults`) and applies it.
 */
declare function useYunUITheme(defaults?: YunUITheme): [YunUITheme, (patch: YunUITheme) => void];

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, AnimatedNumber, type AnimatedNumberProps, Avatar, AvatarFallback, AvatarGroup, AvatarImage, Badge, type BarSegment, BentoCard, BentoGrid, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Card, Checkbox, type CheckboxProps, Collapsible, CollapsibleContent, type CollapsibleContentProps, type CollapsibleProps, CollapsibleTrigger, type CollapsibleTriggerProps, Column, Combobox, type ComboboxOption, ConfirmModal, type ConfirmModalVariant, CustomSelect, DeleteConfirmModal, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, FileDropzone, type FileDropzoneProps, Flex, type FlexProps, Gauge, type GaugeProps, type GaugeTone, Grid, type GridCount, type GridProps, IconButton, InlineCode, InlineStatus, type InlineStatusKind, Input, Kbd, Label, Marquee, Modal, MotionDiv, MotionSpan, type NavTab, NavTabs, NumberInput, PageLoader, Pagination, type PaginationProps, PasswordInput, Popover, PopoverClose, PopoverContent, PopoverTrigger, Progress, RadioGroup, RadioGroupItem, RegenerateConfirmModal, Row, SearchInput, type SegmentTone, SegmentedBar, type SegmentedBarProps, type SegmentedOption, SegmentedSelect, Select, SelectContent, SelectGroup, SelectItem, type SelectOption, SelectTrigger, SelectValue, Separator, Sheet, ShinyButton, Skeleton, Slider, type SpacingScale, Sparkline, type SparklineProps, type SparklineTone, Spinner, Stack, StatusIndicator, Steps, Switch, type SwitchProps, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Tag, TableBody as Tbody, TableCell as Td, Textarea, TableFooter as Tfoot, TableHead as Th, TableHeader as Thead, ThemeToggle, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TableRow as Tr, YUNUI_PALETTES, YUNUI_THEME_PRESETS, type YunUIAccentSource, type YunUIColorScheme, type YunUIPalette, type YunUISolid, type YunUISurface, type YunUITheme, type YunUIThemePreset, type YunUIThemePresetName, applyTheme, cn, fadeIn, readTheme, staggerContainer, staggerItem, toast, useBodyScrollLock, useEscapeKey, useFocusTrap, useModalBehavior, useYunUITheme };
