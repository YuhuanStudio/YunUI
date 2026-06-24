// =====================================================
// YunUI — atomic primitives
// =====================================================

// Core barrel (Button, Input, Card, Badge, Dialog, Select, Slider, Progress,
// Tabs, Avatar, Tooltip, Skeleton, Spinner, PageLoader, EmptyState, Motion,
// IconButton, Label, DropdownMenu, plus re-exports of Modal/Sheet/Checkbox/
// ConfirmModal/Combobox).
export * from "./primitives/index";

// Standalone primitives (imported directly in apps, not via the barrel).
export { CustomSelect, type SelectOption } from "./primitives/custom-select";
export { SegmentedSelect, type SegmentedOption } from "./primitives/segmented-select";
export { NavTabs, type NavTab } from "./primitives/nav-tabs";
export { ShinyButton } from "./primitives/shiny-button";
export { Marquee } from "./primitives/marquee";
export { BentoGrid, BentoCard } from "./primitives/bento-grid";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleContentProps,
  type CollapsibleTriggerProps,
} from "./primitives/collapsible";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "./primitives/popover";
export { ThemeToggle } from "./primitives/theme-toggle";
export { Switch, type SwitchProps } from "./primitives/switch";
export { AnimatedNumber, type AnimatedNumberProps } from "./primitives/animated-number";
export { Toaster, toast } from "./primitives/toast";

// Utilities
export { cn } from "./lib/cn";
export {
  useEscapeKey,
  useBodyScrollLock,
  useModalBehavior,
} from "./lib/hooks";

// Runtime theming (drives the design-token system via data-* attributes)
export {
  applyTheme,
  readTheme,
  useYunUITheme,
  YUNUI_PALETTES,
  type YunUITheme,
  type YunUIPalette,
  type YunUISolid,
  type YunUISurface,
  type YunUIColorScheme,
  type YunUIAccentSource,
} from "./lib/theme";
