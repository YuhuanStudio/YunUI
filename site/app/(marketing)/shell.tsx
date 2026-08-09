"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Footer, GithubIcon, LanguageSwitcher, Navbar as YunUINavbar } from "yunui/ai";
import { Logo } from "@/components/logo";
import { LOCALES, LOCALE_NAMES } from "@/i18n/config";
import { useLocale, useSetLocale } from "@/app/locale-provider";

// The site's nav IS YunUI's Navbar now — it used to be a fork, kept only
// because the API had no way to say "a mark-only brand" or "put a GitHub link
// in the right-hand cluster". Those are slots now (`brand`, `actions`,
// `mobileMenuFooter`), so the fork is gone and this file just fills them.
function Navbar({ pathname }: { pathname: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const setLocale = useSetLocale();

  // Center nav links — mirrors Yunxin's public navbar (Showcase + Docs).
  const NAV_LINKS = [
    { label: t("showcase"), href: "/showcase" },
    { label: t("docs"), href: "/docs" },
    { label: t("changelog"), href: "/changelog" },
  ];

  const languageSwitcher = (
    <LanguageSwitcher
      variant="pill"
      locales={LOCALES.map((loc) => ({ value: loc, label: LOCALE_NAMES[loc] }))}
      currentLocale={locale}
      onChange={(l) => setLocale(l as (typeof LOCALES)[number])}
    />
  );

  const github = (
    <a
      href="https://github.com/YuhuanStudio/YunUI"
      target="_blank"
      rel="noreferrer noopener"
      aria-label={t("github")}
      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
    >
      <GithubIcon />
    </a>
  );

  return (
    <YunUINavbar
      appName="YunUI"
      brand={<Logo size={24} />}
      homeHref="/"
      links={NAV_LINKS}
      currentPath={pathname}
      labels={{ menu: t("menu") }}
      languageSwitcher={languageSwitcher}
      actions={github}
      // A marketing site has no sign-in: passing an empty account slot keeps the
      // bar from offering auth buttons this project does not have.
      account={<></>}
      mobileMenuFooter={
        <div className="flex items-center justify-between px-2 py-1">
          {languageSwitcher}
          {github}
        </div>
      }
    />
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tf = useTranslations("footer");

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden bg-background">
      <Navbar pathname={pathname ?? "/"} />

      {/* Full-bleed content — pages own their own max-width containers. Top
          padding clears the floating nav (matches Yunxin's PageLayout pt-28). */}
      <main className="flex-1 pt-28">{children}</main>

      {/* Dogfood: the site's real footer is YunUI's Footer component */}
      <Footer
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="/#overview"
        tagline={tf("tagline")}
        sections={[
          { title: tf("product"), links: [{ label: tf("overview"), href: "/#overview" }, { label: tf("whyYunUI"), href: "/#why" }, { label: tf("showcase"), href: "/showcase" }] },
          { title: tf("resources"), links: [{ label: tf("docs"), href: "/docs" }, { label: tf("patterns"), href: "/showcase#patterns" }, { label: tf("utilityClasses"), href: "/showcase#design" }] },
          { title: tf("ecosystem"), links: [{ label: tf("yunxin"), href: "https://api.yuhuanstudio.com" }, { label: tf("yunshu"), href: "https://github.com/YuhuanStudio/Yunshu" }] },
        ]}
        social={[{ icon: <GithubIcon />, href: "https://github.com/YuhuanStudio/YunUI", label: "GitHub" }]}
        copyright={tf("copyright")}
      />
    </div>
  );
}
