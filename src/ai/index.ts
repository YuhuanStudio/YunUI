// yunui/ai — APP-DOMAIN layer (AI-gateway product components), NOT general-purpose
// primitives. This is the deliberate split that keeps the core a clean design
// system instead of "one app in a box":
//   • core primitives  -> "@yuhuanowo/yunui"          (Button, Input, Dialog, …)
//   • page patterns     -> "@yuhuanowo/yunui/patterns" (StatCard, PageHeader, …)
//   • app domain (here) -> "@yuhuanowo/yunui/ai"       (ModelCard, ProviderIcon, …)
// Import these only if you're building an LLM/AI-gateway-shaped product; a
// generic app should stay on the core + patterns entries.
// Generic Navbar/Footer are also available from /patterns; their legacy /ai
// exports remain compatible and do not imply AI-specific runtime behavior.
//
// All are prop-driven with framework deps injected via yunui/adapters; none
// import app contexts, the API client, or localStorage directly.
//
// NOTE: only `./_deferred/ai-search` stays un-exported — it is a full docs
// AI-search FEATURE bound to @ai-sdk/react + the chat stack (not a reusable UI
// primitive), so shipping it would force ai-sdk peer deps onto the library.
// Intentionally kept out of the package.

export {
    ThinkingBlock,
    type ThinkingBlockProps,
    type ThinkingBlockLabels,
    type ThinkingBlockStep,
    type ThinkingStepStatus,
} from "./thinking-block";
export {
    AgentTimeline,
    type AgentTimelineProps,
    type AgentTimelineBlock,
    type AgentTimelineEntry,
    type AgentTimelineTaskBlock,
    type AgentTimelineCancelledToolBlock,
    type AgentTimelineIconName,
    type AgentTimelineEntryIconName,
    type AgentTimelineToolStatus,
    type AgentTimelineToolEntryBlock,
    type AgentTimelineTaskStatus,
    type AgentTimelineToolDetail,
    type AgentTimelineTaskDetail,
    type AgentTimelineFileChange,
    type AgentTimelineDiffLine,
    type AgentTimelineDiffTone,
    type AgentTimelineLabels,
    type AgentTimelineSummary,
} from "./agent-timeline";
export {
    ApprovalQuestion,
    type ApprovalQuestionProps,
    type ApprovalQuestionData,
    type ApprovalQuestionOption,
    type ApprovalQuestionOtherOption,
    type ApprovalQuestionAnswer,
    type ApprovalQuestionAnswers,
    type ApprovalQuestionLabels,
} from "./approval-question";
export {
    AgentRunStatus,
    type AgentRunStatusProps,
    type AgentRunPhase,
    type AgentRunTerminalPhase,
    type AgentRunState,
} from "./agent-run-status";
export {
    DiffTable,
    type DiffTableProps,
    type DiffTableRow,
    type DiffTableChange,
    type DiffTableState,
    type DiffTableCategoryTone,
    type DiffTableLabels,
} from "./diff-table";
export {
    SelectionActions,
    type SelectionActionsProps,
    type SelectionActionsState,
    type SelectionActionsLabels,
    type SelectionAction,
} from "./selection-actions";
export { ModelCard, type ModelCardProps } from "./model-card";
export {
    ModelSelect,
    type ModelSelectProps,
    type ModelSelectOption,
    type ModelSelectFilter,
    type ModelSelectLabels,
} from "./model-select";
export { ModelManagerCard, type ModelManagerCardProps, type ModelManagerField } from "./model-manager-card";
export { IDBadge } from "./id-badge";
export { CapabilitySelector } from "./capability-selector";
export { CapabilityIcon, isKnownCapability } from "./capability-badge";
export { ModelTypeIcon, ProviderIconImg } from "./model-icons";
export { buttonVariants, type ButtonProps } from "./fumadocs-button";
export {
  ProviderIcon,
  ProviderAvatar,
  ModelIcon,
  ModelAvatar,
  getProviderName,
  getIconPath,
  getDeveloperIconPath,
  getModelDeveloperId,
  getProviderIconOptions,
  normalizeProviderId,
  ProviderNames,
} from "./provider-icons";
// The full set of brand slugs with a bundled icon (lobe avatar set) — map over it
// to render a complete icon gallery.
export { PROVIDER_ICON_SLUGS } from "./icon-slugs.generated";
export { LanguageSwitcher, type LanguageOption } from "./language-switcher";
export { Navbar, type NavLink } from "./navbar";
export {
  Footer,
  GithubIcon,
  InstagramIcon,
  DiscordIcon,
  type FooterLink,
  type FooterSection,
  type FooterSocial,
  type FooterProps,
} from "./footer";

// Navbar account control — avatar + menu when signed in (upstreamed from YunNEWS).
export {
    AccountMenu,
    type AccountMenuProps,
    type AccountMenuUser,
    type AccountMenuItem,
} from "./account-menu";
