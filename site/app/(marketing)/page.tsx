"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  AnimatedNumber,
} from "yunui";
import { BackgroundEffects, CodeBlock, FAQ } from "yunui/patterns";
import {
  Search,
  Boxes,
  Palette,
  Puzzle,
  ShieldCheck,
  FlaskConical,
  Rocket,
  ArrowRight,
  Sparkles,
  Terminal,
  Package,
  Layers,
  TestTube2,
  Plug,
  Code2,
  Check,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "yunui/ai";
import { LogoMark } from "@/components/logo";

// ---------------------------------------------------------------------------
// Section header — the centered pill-badge + gradient title + subcopy rhythm
// that Yunxin's landing repeats above every band.
// ---------------------------------------------------------------------------
function SectionHeading({
  badge,
  icon,
  title,
  subtitle,
}: {
  badge: string;
  icon: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--accent-subtle) border border-(--accent-muted) mb-4 animate-enter">
        {icon}
        <span className="text-xs font-medium">{badge}</span>
      </div>
      <h2 className="heading-xl mb-4 animate-enter" style={{ animationDelay: "100ms" }}>
        {title}
      </h2>
      <p className="text-body text-lg max-w-2xl mx-auto animate-enter" style={{ animationDelay: "200ms" }}>
        {subtitle}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats strip — AnimatedNumber tiles (dogfoods the primitive). Real counts:
// 23 primitives + 18 patterns, 141 test cases, 3 themes.
// ---------------------------------------------------------------------------
const STATS: { value: number; suffix?: string; label: string; icon: ReactNode }[] = [
  { value: 41, suffix: "+", label: "Components + patterns", icon: <Boxes className="w-6 h-6" /> },
  { value: 141, label: "Tests, all green", icon: <TestTube2 className="w-6 h-6" /> },
  { value: 3, label: "Built-in themes", icon: <Palette className="w-6 h-6" /> },
  { value: 0, label: "Forced runtime deps", icon: <Package className="w-6 h-6" /> },
];

// ---------------------------------------------------------------------------
// Code tabs — install / usage / theming, fed to the CodeBlock pattern.
// ---------------------------------------------------------------------------
const CODE_TABS = [
  {
    id: "install",
    label: "Install",
    language: "Bash",
    code: `# 1. Add the package
npm i @yuhuanowo/yunui

# 2. Pull in the tokens + utilities (Tailwind v4)
# styles/globals.css
@import "tailwindcss";
@import "@yuhuanowo/yunui/css";
@source "../node_modules/@yuhuanowo/yunui/dist";`,
  },
  {
    id: "usage",
    label: "Usage",
    language: "TypeScript",
    code: `import { Button, Card, Badge } from "yunui";

export function Plan() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Pro plan</span>
        <Badge variant="success">Active</Badge>
      </div>
      <Button variant="primary">Upgrade</Button>
    </Card>
  );
}`,
  },
  {
    id: "theming",
    label: "Theming",
    language: "TypeScript",
    code: `// Tokens drive everything — flip a class, the whole UI follows.
import { ThemeProvider } from "next-themes";

<ThemeProvider
  attribute="class"
  themes={["light", "dark", "true-black"]}
  defaultTheme="light"
>
  <App />
</ThemeProvider>;

// Override a token anywhere:
// :root { --accent: oklch(0.62 0.19 255); }`,
  },
];

// ---------------------------------------------------------------------------
// FAQ content (fed to the FAQ pattern component).
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "How do I theme it?",
    answer:
      "Everything is driven by CSS custom-property tokens. Import the stylesheet, then toggle a theme class (light / dark / true-black) on <html>. Override any token in your own CSS and every component follows — no prop drilling, no theme objects to thread through the tree.",
  },
  {
    question: "Does it need a specific framework?",
    answer:
      "No. The core primitives are framework-agnostic. Routing, image, and i18n concerns are injected through a thin adapter layer (YunUIProvider) — wire in Next's Link/Image or your own, and the library stays portable across apps.",
  },
  {
    question: "How are updates shipped?",
    answer:
      "Edit once in the library, version it, and sync every consuming project via npm. Releases are published with provenance through tokenless OIDC trusted publishing — no long-lived secrets in CI.",
  },
  {
    question: "Is it accessible?",
    answer:
      "Interactive primitives build on Radix-style behaviors with keyboard navigation, focus management, and ARIA wired in. Components ship typed and JSDoc'd, and a 141-case test suite guards the public surface.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const [checked, setChecked] = useState(true);
  const [sw, setSw] = useState(true);

  return (
    <div className="relative">
      {/* Animated dotted background behind everything (dogfoods the pattern).
          Full-bleed — it spans the whole viewport like Yunxin's landing. */}
      <BackgroundEffects />

      {/* ----------------------------------------------------------------- */}
      {/* Hero — full-bleed; inner content is self-centering                */}
      {/* ----------------------------------------------------------------- */}
      <section
        id="overview"
        className="relative scroll-mt-20 min-h-[88vh] flex flex-col items-center justify-center text-center py-16 px-6"
      >
        {/* Pill badge */}
        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--accent-subtle)/80 backdrop-blur-sm border border-(--accent-muted) mb-8 animate-enter hover:bg-(--accent-subtle) transition-colors"
        >
          <span className="text-foreground"><LogoMark size={16} /></span>
          <span className="text-sm font-medium">New: Flex · Grid · Table · v0.1.8 on npm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Gradient headline */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-enter max-w-4xl"
          style={{ animationDelay: "100ms" }}
        >
          Build once.{" "}
          <span className="bg-linear-to-r from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent">
            Ship everywhere.
          </span>
        </h1>

        {/* Subcopy */}
        <p
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-enter"
          style={{ animationDelay: "300ms" }}
        >
          A React 19 + Tailwind v4 design system: token-driven, three themes, a framework-agnostic
          adapter layer. Edit once, version it, and sync every project you ship.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-enter"
          style={{ animationDelay: "400ms" }}
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/showcase" className="group whitespace-nowrap">
              Browse components
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/docs" className="group whitespace-nowrap">
              <BookOpen className="w-4 h-4 mr-2" />
              Read the docs
            </Link>
          </Button>
        </div>

        {/* Checkmark feature bullets */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground animate-enter"
          style={{ animationDelay: "500ms" }}
        >
          {["React 19", "Tailwind v4", "MIT licensed", "Framework-agnostic"].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Provenance shields (kept from the prior landing) */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-enter"
          style={{ animationDelay: "600ms" }}
        >
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

        {/* Bouncing scroll-down chevron */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Everything below the hero sits in a centered, readable column     */}
      {/* (the old Shell used to constrain width; now pages own it).        */}
      {/* ----------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-6">

      {/* ----------------------------------------------------------------- */}
      {/* Stats strip — AnimatedNumber primitives                           */}
      {/* ----------------------------------------------------------------- */}
      <section className="scroll-mt-20 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="card p-6 text-center animate-enter"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="feature-icon mx-auto mb-4">{stat.icon}</div>
              <div className="heading-lg mb-1 min-h-10 flex items-center justify-center overflow-hidden">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-caption">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* See it in code — tabbed CodeBlock                                 */}
      {/* ----------------------------------------------------------------- */}
      <section id="install" className="scroll-mt-20 py-16">
        <SectionHeading
          badge="Quick start"
          icon={<Terminal className="w-4 h-4" />}
          title="See it in code"
          subtitle="Install the package, import a component, theme it with tokens. The same CodeBlock you see here is a YunUI pattern."
        />
        <CodeBlock tabs={CODE_TABS} code="" showLineNumbers className="shadow-2xl max-w-3xl mx-auto" />
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Why YunUI — BentoGrid                                             */}
      {/* ----------------------------------------------------------------- */}
      <section id="why" className="scroll-mt-20 py-16">
        <SectionHeading
          badge="Why YunUI"
          icon={<Sparkles className="w-4 h-4" />}
          title="One source of truth"
          subtitle="A component library built to be the single source of truth across every project you ship."
        />
        <BentoGrid className="w-full">
          <BentoCard
            icon={<Boxes className="w-5 h-5" />}
            title="41+ components + patterns"
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
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Live theme preview                                                */}
      {/* ----------------------------------------------------------------- */}
      <section id="live-preview" className="scroll-mt-20 py-16">
        <SectionHeading
          badge="Theming, live"
          icon={<Palette className="w-4 h-4" />}
          title="Theming, live"
          subtitle="Real YunUI components — flip the theme switch (top-right) to see light, zinc-dark, and true-black update in place."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border border-border bg-(--bg-elevated) p-6 sm:p-8 space-y-6"
        >
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
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* A taste of the kit                                                */}
      {/* ----------------------------------------------------------------- */}
      <section id="highlights" className="scroll-mt-20 py-16">
        <SectionHeading
          badge="Highlights"
          icon={<Layers className="w-4 h-4" />}
          title="A taste of the kit"
          subtitle="A handful of flagship pieces — see the full set in the showcase."
        />
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
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FAQ — the FAQ pattern component                                   */}
      {/* ----------------------------------------------------------------- */}
      <section id="faq" className="scroll-mt-20 py-16">
        <SectionHeading
          badge="FAQ"
          icon={<Plug className="w-4 h-4" />}
          title="Questions, answered"
          subtitle="The things people ask before adopting YunUI in a real project."
        />
        <FAQ items={FAQ_ITEMS} />
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Closing CTA band                                                  */}
      {/* ----------------------------------------------------------------- */}
      <section className="scroll-mt-20 py-16">
        <div className="card p-12 md:p-16 text-center animate-enter">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--accent-subtle) border border-(--accent-muted) mb-6 animate-enter"
            style={{ animationDelay: "100ms" }}
          >
            <Rocket className="w-4 h-4" />
            <span className="text-xs font-medium">Get started</span>
          </div>
          <h2 className="heading-xl mb-4 animate-enter" style={{ animationDelay: "200ms" }}>
            One design system, every project in sync.
          </h2>
          <p
            className="text-body text-lg mb-8 max-w-xl mx-auto animate-enter"
            style={{ animationDelay: "300ms" }}
          >
            Browse the gallery, read the docs, or jump straight into the source on GitHub.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-enter"
            style={{ animationDelay: "400ms" }}
          >
            <Button variant="primary" size="lg" asChild>
              <Link href="/showcase" className="group whitespace-nowrap">
                Browse components
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/docs" className="group whitespace-nowrap">
                <Code2 className="w-4 h-4 mr-2" />
                Read the docs
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a
                href="https://github.com/YuhuanStudio/YunUI"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <GithubIcon />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
