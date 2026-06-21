"use client";

import { useState, type ReactNode } from "react";
import { ThemeToggle } from "yunui";
import { LanguageSwitcher } from "yunui/ai";
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
  Star,
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
  const [active, setActive] = useState("#overview");

  const handleNavigate = (href: string) => {
    setActive(href);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-dvh">
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#overview"
        sections={SECTIONS}
        currentPath={active}
        isOpen={open}
        onClose={() => setOpen(false)}
        onNavigate={handleNavigate}
        footer={
          <>
            <div className="mb-3 card px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-(--text-secondary)">Balance</span>
              </div>
              <div className="text-base font-semibold">1.25K Credits</div>
            </div>
            <div className="w-full card px-3 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                Y
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">yuhuan</div>
                <div className="text-xs text-(--text-tertiary) truncate">demo@yunui.dev</div>
              </div>
            </div>
          </>
        }
      />

      {/* Content column, offset by the fixed sidebar on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-dvh">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-(--border-hairline) bg-background/80 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/5"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
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
      </div>
    </div>
  );
}
