"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Label,
  Checkbox,
  Switch,
  Card,
  Badge,
  ShinyButton,
  BentoGrid,
  BentoCard,
} from "yunui";
import {
  Search,
  Boxes,
  Palette,
  Puzzle,
  ShieldCheck,
  FlaskConical,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { LogoMark } from "@/components/logo";

// ---- layout helpers -------------------------------------------------------

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 mb-20">
      <h2 className="heading-lg">{title}</h2>
      {description && <p className="text-body mt-1 max-w-2xl">{description}</p>}
      <div className="mt-6 space-y-10">{children}</div>
    </section>
  );
}

// ---- page -----------------------------------------------------------------

export default function Home() {
  const [checked, setChecked] = useState(true);
  const [sw, setSw] = useState(true);

  return (
    <>
      {/* Overview / hero */}
      <section id="overview" className="scroll-mt-20 mb-20">
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="text-foreground"><LogoMark size={28} /></span>
          <span className="badge badge-info">React 19 · Tailwind v4 · MIT</span>
        </div>
        <h1 className="heading-xl text-4xl sm:text-5xl leading-[1.1] max-w-3xl">
          The design system you<br />build once, and ship everywhere.
        </h1>
        <p className="text-body mt-5 max-w-2xl">
          A React 19 + Tailwind v4 component library with tokens, 3 themes, and a framework-agnostic
          adapter layer. Edit once, version, sync every project.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button variant="primary" asChild>
            <Link href="/showcase">Browse all components</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">Read the docs</Link>
          </Button>
          <Button variant="ghost" asChild>
            <a href="https://github.com/YuhuanStudio/YunUI" target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="https://www.npmjs.com/package/@yuhuanowo/yunui" target="_blank" rel="noreferrer noopener">
              npm
            </a>
          </Button>
        </div>
        {/* Provenance badges (shields.io) */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/npm/v/@yuhuanowo/yunui?color=18181b&labelColor=18181b&label=npm"
            alt="npm version"
            height={20}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/npm/l/@yuhuanowo/yunui?color=18181b&labelColor=18181b&label=license"
            alt="MIT license"
            height={20}
          />
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: "Components + patterns", v: "~33" },
            { k: "Themes", v: "3" },
            { k: "Tests", v: "141" },
            { k: "Entry points", v: "5" },
          ].map((s) => (
            <div key={s.k} className="stat-card p-4">
              <div className="stat-number text-2xl font-semibold">{s.v}</div>
              <div className="text-label mt-1">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why YunUI — feature bento (dogfoods BentoGrid/BentoCard) */}
      <Section
        id="why"
        title="Why YunUI"
        description="A component library built to be the single source of truth across every project you ship."
      >
        <BentoGrid className="w-full">
          <BentoCard
            icon={<Boxes className="w-5 h-5" />}
            title="~33 components + patterns"
            description="Primitives, page-level patterns, and AI product components — composed, typed, and ready to ship."
          />
          <BentoCard
            icon={<Palette className="w-5 h-5" />}
            title="3 themes (light / dark / OLED)"
            description="Token-driven theming. Light, zinc-dark, and a true-black OLED theme — swap with one class."
          />
          <BentoCard
            icon={<Puzzle className="w-5 h-5" />}
            title="Framework-agnostic adapters"
            description="Bring your own Link, Image, and i18n. Inject them once; the library stays portable across apps."
          />
          <BentoCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Tokenless OIDC releases"
            description="Published to npm via trusted publishing with provenance — no long-lived tokens in CI."
          />
          <BentoCard
            icon={<FlaskConical className="w-5 h-5" />}
            title="141 tests, typed, JSDoc'd"
            description="Strict TypeScript, JSDoc on the public surface, and a test suite that guards every primitive."
          />
          <BentoCard
            icon={<Rocket className="w-5 h-5" />}
            title="In production at Yunxin"
            description="Battle-tested in production — already powering a real, shipping app end to end."
          />
        </BentoGrid>
      </Section>

      {/* Live theme preview — real components that respond to the ThemeToggle */}
      <Section
        id="live-preview"
        title="Theming, live"
        description="Real YunUI components — flip the theme switch (top-right) to see light, zinc-dark, and true-black update in place."
      >
        <div className="rounded-2xl border border-border bg-(--bg-elevated) p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <ShinyButton>Shiny</ShinyButton>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Pro plan</span>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-caption mb-4">Everything in Basic, plus higher limits and priority support.</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <div>
                <Label>Email</Label>
                <Input placeholder="you@example.com" icon={<Search className="w-4 h-4" />} />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={checked} onCheckedChange={setChecked} />
                  Subscribe
                </label>
                <Switch checked={sw} onCheckedChange={setSw} />
              </div>
              <Button variant="primary" size="sm" className="mt-1">
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {/* Curated highlights — a taste of the gallery, not the whole thing */}
      <Section
        id="highlights"
        title="A taste of the kit"
        description="A handful of flagship pieces — see the full set in the showcase."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="rounded-2xl border border-border p-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px]"
            style={{ backgroundImage: "radial-gradient(var(--border-subtle) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="accent">Accent</Button>
          </div>
          <div
            className="rounded-2xl border border-border p-8 flex flex-wrap items-center justify-center gap-2 min-h-[140px]"
            style={{ backgroundImage: "radial-gradient(var(--border-subtle) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          >
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Pro plan</span>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-caption">A Card primitive — everything in Basic, plus higher limits.</p>
          </Card>
          <div
            className="rounded-2xl border border-border p-8 flex items-center justify-center min-h-[140px]"
            style={{ backgroundImage: "radial-gradient(var(--border-subtle) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          >
            <div className="w-full max-w-xs">
              <Label>Email</Label>
              <Input placeholder="you@example.com" icon={<Search className="w-4 h-4" />} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" asChild>
            <Link href="/showcase">
              Browse all components
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </Section>

      {/* Honest social proof */}
      <section className="mb-20">
        <div className="card p-6 flex flex-wrap items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
          <div className="min-w-0">
            <p className="font-medium">Battle-tested in production</p>
            <p className="text-caption mt-0.5">
              YunUI already powers <span className="font-medium text-foreground">Yunxin</span>, a real shipping
              app — every primitive and pattern here is in daily use, not a demo.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-caption border-t border-border">
        YunUI · edit once, sync everywhere
      </footer>
    </>
  );
}
