// yunui/patterns — mid-coupling page-level components.
// Framework deps (routing / i18n / images) are injected via yunui/adapters;
// app data is passed in as props.

// Landing
export { BackgroundEffects } from "./background-effects";
export { CodeDemo } from "./code-demo";
export { FAQ, type FAQItem, type FAQProps } from "./faq";

// Code
export { CodeBlock } from "./code-block";

// Docs
export { LLMCopyButton, ViewOptions } from "./docs-page-actions";

// Blog
export { BlogCard } from "./blog-card";
export { BlogPostHeader } from "./blog-post-header";
export { BlogPagination } from "./blog-pagination";
export { SimplePagination } from "./simple-pagination";
export { CategoryFilter } from "./category-filter";

// Layout / app chrome
export {
  Sidebar,
  type SidebarProps,
  type SidebarSection,
  type SidebarNavItem,
} from "./sidebar";
export { PageHeader } from "./page-header";
// Footer also lives in yunui/ai, but it's a page-level chrome pattern consumers
// reasonably reach for here too — re-export so both import paths resolve.
export { Footer, type FooterProps, type FooterSection, type FooterLink, type FooterSocial } from "../ai/footer";
export { PageLoadingState, PageErrorState, PageEmptyState } from "./page-state";
export { StatCard } from "./stat-card";
export { FellowsBanner, type FellowsBannerProps } from "./fellows-banner";
export { ErrorBoundary, type ErrorBoundaryLabels } from "./error-boundary";
export { AccountLockedCard, type AccountLockedCardProps } from "./account-locked-card";
export {
  MediaPageHeader,
  MediaEmptyState,
  MediaLoadingState,
  MediaErrorState,
} from "./media-page-header";

// Badges
export {
  FellowBadge,
  CapabilityBadge,
  StatusBadge,
  SourceBadge,
  ActiveBadge,
  DeprecatedBadge,
} from "./badges";

// Notifications — presentational bell + row + dropdown panel (host owns data).
export {
  NotificationBell,
  type NotificationBellProps,
  NotificationItem,
  type NotificationItemProps,
  NotificationPanel,
  type NotificationPanelProps,
} from "./notification";
