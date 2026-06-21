"use client";

import { useState, type ReactNode } from "react";
import { ThemeToggle } from "yunui";
import { LanguageSwitcher, Footer, GithubIcon } from "yunui/ai";
import { Sidebar, type SidebarSection } from "yunui/patterns";
import {
  Menu,
  LayoutGrid,
  MousePointerClick,
  TextCursorInput,
  Layers,
  Database,
  Bell,
  Compass,
  Component,
  Palette,
  Sparkles,
  PanelLeft,
  PanelLeftOpen,
} from "lucide-react";

const SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: "Overview", href: "#overview", icon: LayoutGrid },
      { label: "Foundations", href: "#foundations", icon: Palette },
      { label: "Utility Classes", href: "#design", icon: Component },
      { label: "Dashboard Demo", href: "#dashboard", icon: Sparkles },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Layout & Chrome", href: "#layout", icon: PanelLeft },
      { label: "Buttons & Actions", href: "#buttons", icon: MousePointerClick },
      { label: "Form Controls", href: "#forms", icon: TextCursorInput },
      { label: "Overlays", href: "#overlays", icon: Component },
      { label: "Data Display", href: "#data-display", icon: Layers },
      { label: "Feedback", href: "#feedback", icon: Bell },
      { label: "Navigation", href: "#navigation", icon: Compass },
      { label: "Patterns", href: "#patterns", icon: Database },
    ],
  },
];

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("#overview");

  const handleNavigate = (href: string) => {
    setActive(href);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-dvh flex overflow-x-hidden">
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#overview"
        sections={SECTIONS}
        currentPath={active}
        isOpen={open}
        onClose={() => setOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(true)}
        onNavigate={handleNavigate}
      />

      {/* Content column, offset by the fixed sidebar on desktop. Matches Yunxin:
          animate the margin so the content slides as the sidebar collapses. */}
      <div className={`flex-1 min-w-0 flex flex-col min-h-dvh transition-[margin] duration-200 ease-in-out ${collapsed ? "lg:ml-0" : "lg:ml-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 border-b border-(--border-hairline) bg-background/80 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-foreground/5"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Re-open button — always present, slides in via max-w (Yunxin parity) */}
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className={`hidden lg:flex items-center justify-center shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ease-in-out ${collapsed ? "max-w-12 opacity-100 p-2 -ml-2" : "max-w-0 opacity-0 overflow-hidden p-0 -ml-4 pointer-events-none"}`}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={18} className="shrink-0" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher
              variant="pill"
              currentLocale="en"
              onChange={() => {}}
              locales={[
                { value: "en", label: "English" },
                { value: "zh-TW", label: "繁體中文" },
              ]}
            />
            <ThemeToggle variant="pill" />
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">{children}</main>

        {/* Dogfood: the site's real footer is YunUI's Footer component */}
        <Footer
          appName="YunUI"
          logoSrc="/favicon.ico"
          homeHref="#overview"
          tagline="One design system, every project in sync."
          sections={[
            { title: "Docs", links: [{ label: "Overview", href: "#overview" }, { label: "Foundations", href: "#foundations" }, { label: "Components", href: "#layout" }] },
            { title: "Resources", links: [{ label: "Patterns", href: "#patterns" }, { label: "Utility Classes", href: "#design" }] },
          ]}
          social={[{ icon: <GithubIcon />, href: "https://github.com/yuhuanowo", label: "GitHub" }]}
          copyright="© 2026 YunUI · edit once, sync everywhere"
        />
      </div>
    </div>
  );
}
