// yunui/ai — Yunxin AI product-domain components.
// All are prop-driven with framework deps injected via yunui/adapters; none
// import app contexts, the API client, or localStorage directly.
//
// NOTE: a further set of components is staged under ./_deferred/ (provider-icons,
// model-icons, model-selector, model-form, OAuthButtons, ai-search). They depend
// on bundled icon assets, the Yunxin model schema, or the chat/ai-sdk stack and
// need asset-bundling / deeper domain decoupling before they can ship. Tracked
// for a future release; not exported yet.

export { ThinkingBlock } from "./thinking-block";
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
