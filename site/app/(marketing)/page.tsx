"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
  TestTube2,
  Plug,
  Code2,
  Check,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "yunui/ai";
import { LogoMark } from "@/components/logo";

// Shown in the hero provenance badges. Bump on each npm release (kept manual
// because the package's package.json isn't exported for a runtime import).
const PKG_VERSION = "0.2.14";

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
// Code tabs — install / usage / theming, fed to the CodeBlock pattern. The
// tab labels are localized at render; the code samples stay language-neutral.
// ---------------------------------------------------------------------------
const CODE_TABS = [
  {
    id: "install",
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
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const [checked, setChecked] = useState(true);
  const [sw, setSw] = useState(true);
  const t = useTranslations("landing");

  // Stats strip — AnimatedNumber tiles. Real counts: 41+ components + patterns,
  // 141 test cases, 3 themes, 5 subpath entry points. Labels are localized.
  const STATS: { value: number; suffix?: string; label: string; icon: ReactNode }[] = [
    { value: 41, suffix: "+", label: t("stats.components"), icon: <Boxes className="w-6 h-6" /> },
    { value: 141, label: t("stats.tests"), icon: <TestTube2 className="w-6 h-6" /> },
    { value: 3, label: t("stats.themes"), icon: <Palette className="w-6 h-6" /> },
    { value: 5, label: t("stats.entryPoints"), icon: <Package className="w-6 h-6" /> },
  ];

  const CODE_TAB_LABELS: Record<string, string> = {
    install: t("quickStart.installLabel"),
    usage: t("quickStart.usageLabel"),
    theming: t("quickStart.themingLabel"),
  };
  const codeTabs = CODE_TABS.map((tab) => ({ ...tab, label: CODE_TAB_LABELS[tab.id] }));

  const FAQ_ITEMS = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
  ];

  const BULLETS = [t("bullets.react"), t("bullets.tailwind"), t("bullets.license"), t("bullets.agnostic")];

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
          <span className="text-sm font-medium">{t("heroBadge")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Gradient headline */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-enter max-w-4xl"
          style={{ animationDelay: "100ms" }}
        >
          {t("heroTitleLead")}{" "}
          <span className="bg-linear-to-r from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent">
            {t("heroTitleAccent")}
          </span>
        </h1>

        {/* Subcopy */}
        <p
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-enter"
          style={{ animationDelay: "300ms" }}
        >
          {t("heroSubtitle")}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-enter"
          style={{ animationDelay: "400ms" }}
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/showcase" className="group whitespace-nowrap">
              {t("browseComponents")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/docs" className="group whitespace-nowrap">
              <BookOpen className="w-4 h-4 mr-2" />
              {t("readDocs")}
            </Link>
          </Button>
        </div>

        {/* Checkmark feature bullets */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground animate-enter"
          style={{ animationDelay: "500ms" }}
        >
          {BULLETS.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Provenance — dogfooding our own Badge instead of external shields. */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-enter"
          style={{ animationDelay: "600ms" }}
        >
          <Badge className="gap-1.5 font-mono">
            <span className="text-muted-foreground">npm</span> v{PKG_VERSION}
          </Badge>
          <Badge className="gap-1.5 font-mono">
            <span className="text-muted-foreground">license</span> Apache-2.0
          </Badge>
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
      <div className="max-w-6xl w-[calc(100%-48px)] mx-auto">

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
          badge={t("quickStart.badge")}
          icon={<Terminal className="w-4 h-4" />}
          title={t("quickStart.title")}
          subtitle={t("quickStart.subtitle")}
        />
        <CodeBlock tabs={codeTabs} code="" showLineNumbers className="shadow-2xl" />
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Why YunUI — BentoGrid                                             */}
      {/* ----------------------------------------------------------------- */}
      <section id="why" className="scroll-mt-20 py-16">
        <SectionHeading
          badge={t("why.badge")}
          icon={<Sparkles className="w-4 h-4" />}
          title={t("why.title")}
          subtitle={t("why.subtitle")}
        />
        <BentoGrid className="w-full">
          <BentoCard
            icon={<Boxes className="w-5 h-5" />}
            title={t("why.componentsTitle")}
            description={t("why.componentsDesc")}
          />
          <BentoCard
            icon={<Palette className="w-5 h-5" />}
            title={t("why.themesTitle")}
            description={t("why.themesDesc")}
          />
          <BentoCard
            icon={<Puzzle className="w-5 h-5" />}
            title={t("why.adaptersTitle")}
            description={t("why.adaptersDesc")}
          />
          <BentoCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title={t("why.releasesTitle")}
            description={t("why.releasesDesc")}
          />
          <BentoCard
            icon={<FlaskConical className="w-5 h-5" />}
            title={t("why.testsTitle")}
            description={t("why.testsDesc")}
          />
          <BentoCard
            icon={<Rocket className="w-5 h-5" />}
            title={t("why.productionTitle")}
            description={t("why.productionDesc")}
          />
        </BentoGrid>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Live theme preview                                                */}
      {/* ----------------------------------------------------------------- */}
      <section id="live-preview" className="scroll-mt-20 py-16">
        <SectionHeading
          badge={t("livePreview.badge")}
          icon={<Palette className="w-4 h-4" />}
          title={t("livePreview.title")}
          subtitle={t("livePreview.subtitle")}
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
                <span className="font-medium">{t("livePreview.proPlan")}</span>
                <Badge variant="success">{t("livePreview.active")}</Badge>
              </div>
              <p className="text-caption mb-4">{t("livePreview.proPlanDesc")}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <div>
                <Label>{t("livePreview.email")}</Label>
                <Input placeholder="you@example.com" icon={<Search className="w-4 h-4" />} />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={checked} onCheckedChange={setChecked} />
                  {t("livePreview.subscribe")}
                </label>
                <Switch checked={sw} onCheckedChange={setSw} />
              </div>
              <Button variant="primary" size="sm" className="mt-1">
                {t("livePreview.continue")}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FAQ — the FAQ pattern component                                   */}
      {/* ----------------------------------------------------------------- */}
      <section id="faq" className="scroll-mt-20 py-16">
        <SectionHeading
          badge={t("faq.badge")}
          icon={<Plug className="w-4 h-4" />}
          title={t("faq.title")}
          subtitle={t("faq.subtitle")}
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
            <span className="text-xs font-medium">{t("cta.badge")}</span>
          </div>
          <h2 className="heading-xl mb-4 animate-enter" style={{ animationDelay: "200ms" }}>
            {t("cta.title")}
          </h2>
          <p
            className="text-body text-lg mb-8 max-w-2xl mx-auto animate-enter"
            style={{ animationDelay: "300ms" }}
          >
            {t("cta.subtitle")}
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-enter"
            style={{ animationDelay: "400ms" }}
          >
            <Button variant="primary" size="lg" asChild>
              <Link href="/showcase" className="group whitespace-nowrap">
                {t("cta.browseComponents")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/docs" className="group whitespace-nowrap">
                <Code2 className="w-4 h-4 mr-2" />
                {t("cta.readDocs")}
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
                {t("cta.github")}
              </a>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
