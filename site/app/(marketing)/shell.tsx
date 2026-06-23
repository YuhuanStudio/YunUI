"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "yunui";
import { Footer, GithubIcon } from "yunui/ai";
import { Logo } from "@/components/logo";

// Center nav links — mirrors Yunxin's public navbar (Showcase + Docs).
const NAV_LINKS: { href: string; label: string }[] = [
  { label: "Showcase", href: "/showcase" },
  { label: "Docs", href: "/docs" },
];

// Floating pill Navbar — styled exactly like Yunxin's public Navbar
// (yunui/ai Navbar), but the right side carries a GitHub link + ThemeToggle
// instead of auth buttons (this is a marketing site, not an app).
function Navbar({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 max-w-6xl w-[calc(100%-48px)] bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-md flex items-center justify-between">
      {/* Logo — mark + wordmark, links home */}
      <Link
        href="/"
        aria-label="YunUI home"
        className="flex items-center rounded-lg px-2 py-1 -mx-2 hover:bg-foreground/5 transition-colors duration-200"
      >
        <Logo size={24} />
      </Link>

      {/* Center links with the animated underline + active state */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative px-2 lg:px-3 py-2 whitespace-nowrap min-w-15 text-center"
          >
            <span
              className={`text-sm relative z-10 ${
                isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </span>
            <span
              className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-foreground rounded-full transition-all duration-200 ${
                isActive(link.href) ? "w-8" : "w-0 group-hover:w-8"
              }`}
            />
          </Link>
        ))}
      </div>

      {/* Right side — GitHub link + theme toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href="https://github.com/YuhuanStudio/YunUI"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <GithubIcon />
        </a>
        <ThemeToggle variant="pill" />

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <>
          <div className="md:hidden fixed inset-0 -z-10" onClick={() => setMenuOpen(false)} />
          <div className="md:hidden absolute top-full left-0 right-0 mt-3 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-foreground/5 ${
                  isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden">
      <Navbar pathname={pathname ?? "/"} />

      {/* Full-bleed content — pages own their own max-width containers. Top
          padding clears the floating nav (matches Yunxin's PageLayout pt-28). */}
      <main className="flex-1 pt-28">{children}</main>

      {/* Dogfood: the site's real footer is YunUI's Footer component */}
      <Footer
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="/#overview"
        tagline="One design system, every project in sync."
        sections={[
          { title: "Product", links: [{ label: "Overview", href: "/#overview" }, { label: "Why YunUI", href: "/#why" }, { label: "Showcase", href: "/showcase" }] },
          { title: "Resources", links: [{ label: "Docs", href: "/docs" }, { label: "Patterns", href: "/showcase#patterns" }, { label: "Utility Classes", href: "/showcase#design" }] },
        ]}
        social={[{ icon: <GithubIcon />, href: "https://github.com/yuhuanowo", label: "GitHub" }]}
        copyright="© 2026 YunUI · edit once, sync everywhere"
      />
    </div>
  );
}
