// yunui/ai — Yunxin AI product-domain components.
// All are prop-driven with framework deps injected via yunui/adapters; none
// import app contexts, the API client, or localStorage directly.
//
// NOTE: only `./_deferred/ai-search` stays un-exported — it is a full docs
// AI-search FEATURE bound to @ai-sdk/react + the chat stack (not a reusable UI
// primitive), so shipping it would force ai-sdk peer deps onto the library.
// Intentionally kept out of the package.

export { ThinkingBlock } from "./thinking-block";
export { ModelCard, type ModelCardProps } from "./model-card";
export { IDBadge } from "./id-badge";
export { CapabilitySelector } from "./capability-selector";
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
  getProviderIconOptions,
  normalizeProviderId,
  ProviderNames,
} from "./provider-icons";
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
