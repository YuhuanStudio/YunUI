"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  IconButton,
  ShinyButton,
  Input,
  Textarea,
  Label,
  Checkbox,
  Switch,
  CustomSelect,
  SegmentedSelect,
  Combobox,
  Slider,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Card,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  BentoGrid,
  BentoCard,
  Marquee,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Modal,
  Sheet,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Skeleton,
  Spinner,
  EmptyState,
  PageLoader,
  NavTabs,
  AnimatedNumber,
  ConfirmModal,
  DeleteConfirmModal,
  RegenerateConfirmModal,
  toast,
  useYunUITheme,
  YUNUI_PALETTES,
} from "yunui";
import {
  ThinkingBlock,
  LanguageSwitcher,
  Navbar,
  Footer,
  ModelCard,
  CapabilitySelector,
  ProviderIcon,
  ProviderAvatar,
  ModelIcon,
  ModelAvatar,
  ModelTypeIcon,
  ProviderIconImg,
  IDBadge,
  getIconPath,
  buttonVariants,
} from "yunui/ai";
import {
  CodeBlock,
  CodeDemo,
  FAQ,
  BlogCard,
  BlogPostHeader,
  BlogPagination,
  CategoryFilter,
  BackgroundEffects,
  PageHeader,
  PageLoadingState,
  PageErrorState,
  PageEmptyState,
  StatCard,
  FellowBadge,
  StatusBadge,
  CapabilityBadge,
  SourceBadge,
  ActiveBadge,
  DeprecatedBadge,
  FellowsBanner,
  ErrorBoundary,
  AccountLockedCard,
  Sidebar,
  type SidebarSection,
  MediaPageHeader,
  MediaEmptyState,
  MediaLoadingState,
  MediaErrorState,
  LLMCopyButton,
  ViewOptions,
} from "yunui/patterns";
import {
  Heart,
  Settings,
  Trash2,
  Search,
  Plus,
  Inbox,
  Zap,
  Rocket,
  Star,
  Coins,
  Activity,
  KeyRound,
  TrendingUp,
  MessageSquare,
  Layers,
  LayoutGrid,
  Sparkles,
  PanelLeft,
  Database,
  Image as ImageIcon,
  Lock,
  FileText,
} from "lucide-react";

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

// once-ui-style documented example: framed live preview (dotted backdrop) with
// an optional Preview / Code tab toggle.
function Demo({ title, description, code, children }: { title: string; description?: string; code?: string; children: ReactNode }) {
  const t = useTranslations("showcase");
  const [view, setView] = useState<"preview" | "code">("preview");
  const showCode = view === "code" && !!code;
  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="text-caption mt-0.5">{description}</p>}
        </div>
        {code && (
          <div className="flex items-center gap-0.5 rounded-lg bg-(--bg-elevated) p-0.5 text-xs shrink-0">
            <button
              onClick={() => setView("preview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${view === "preview" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("toggle.preview")}
            </button>
            <button
              onClick={() => setView("code")}
              className={`px-2.5 py-1 rounded-md transition-colors ${view === "code" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("toggle.code")}
            </button>
          </div>
        )}
      </div>
      {showCode ? (
        <CodeBlock language="tsx" code={code!} />
      ) : (
        <div
          className="rounded-2xl border border-border p-10 flex flex-wrap items-center justify-center gap-4 min-h-[150px]"
          style={{ backgroundImage: "radial-gradient(var(--border-subtle) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// A child that crashes on render, to demo ErrorBoundary catching it.
function Bomb(): never {
  throw new Error("Demo: this child crashed on render.");
}

function ErrorBoundaryDemo() {
  const t = useTranslations("showcase.demos.errorBoundary");
  const [boom, setBoom] = useState(false);
  if (!boom) {
    return (
      <div className="text-center">
        <p className="text-caption mb-3">{t("childFine")}</p>
        <Button variant="red" size="sm" onClick={() => setBoom(true)}>
          {t("throw")}
        </Button>
      </div>
    );
  }
  return (
    <ErrorBoundary labels={{ title: t("caughtTitle"), message: t("caughtMessage") }}>
      <Bomb />
    </ErrorBoundary>
  );
}

// A framed stage that contains `position: fixed` children (Navbar/Sidebar/
// Footer). A `transform` on the wrapper makes fixed descendants resolve against
// it instead of the viewport — the standard trick for previewing app chrome.
function Stage({ height = 180, children }: { height?: number; children: ReactNode }) {
  return (
    <div
      className="relative w-full rounded-2xl border border-border overflow-hidden bg-(--bg-elevated)"
      style={{ height, transform: "translateZ(0)" }}
    >
      {children}
    </div>
  );
}

function SidebarCollapseDemo() {
  const t = useTranslations("showcase.demos.sidebar");
  const sections: SidebarSection[] = [
    {
      items: [
        { label: t("navOverview"), href: "#overview", icon: LayoutGrid },
        { label: t("navPlayground"), href: "#playground", icon: MessageSquare },
        { label: t("navModels"), href: "#models", icon: Layers },
      ],
    },
    {
      title: t("navAccount"),
      items: [
        { label: t("navApiKeys"), href: "#api-keys", icon: KeyRound },
        { label: t("navAnalytics"), href: "#analytics", icon: Activity },
        { label: t("navLogs"), href: "#logs", icon: Database },
      ],
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stage height={360}>
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#"
        sections={sections}
        currentPath="#overview"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNavigate={() => {}}
      />
      {/* Re-open affordance when collapsed (lives in the app header normally) */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`absolute top-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-all ${collapsed ? "left-3" : "left-[17rem]"}`}
        aria-label={t("toggleSidebar")}
      >
        <PanelLeft size={16} />
      </button>
    </Stage>
  );
}

// Confirm-modal family — each opens a portal-rendered dialog.
function ConfirmModalsDemo() {
  const t = useTranslations("showcase.demos.confirmModals");
  const [confirm, setConfirm] = useState(false);
  const [del, setDel] = useState(false);
  const [regen, setRegen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setConfirm(true)}>{t("confirmAction")}</Button>
      <Button variant="red" onClick={() => setDel(true)}>{t("delete")}</Button>
      <Button variant="amber" onClick={() => setRegen(true)}>{t("regenerate")}</Button>
      <ConfirmModal
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast.success(t("confirmedToast"));
        }}
        title={t("publishTitle")}
        subtitle={t("publishSubtitle")}
        message={t("publishMessage")}
        variant="info"
        confirmText={t("publishConfirm")}
        cancelText={t("cancel")}
      />
      <DeleteConfirmModal
        isOpen={del}
        onClose={() => setDel(false)}
        onConfirm={() => {
          setDel(false);
          toast.error(t("deletedToast"));
        }}
        itemName={t("deleteItem")}
      />
      <RegenerateConfirmModal
        isOpen={regen}
        onClose={() => setRegen(false)}
        onConfirm={() => {
          setRegen(false);
          toast.warning(t("regeneratedToast"));
        }}
        itemName={t("regenItem")}
      />
    </>
  );
}

// Dropdown with checkbox + radio items (controlled state).
function DropdownChoicesDemo() {
  const t = useTranslations("showcase.demos.dropdownChoices");
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [density, setDensity] = useState("comfortable");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t("viewOptions")}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>{t("display")}</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          {t("showGrid")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showLabels} onCheckedChange={setShowLabels}>
          {t("showLabels")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("density")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">{t("compact")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">{t("comfortable")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">{t("spacious")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Blog pagination + category filter are controlled — keep their state local.
function BlogControlsDemo() {
  const t = useTranslations("showcase.demos.blogControls");
  const [page, setPage] = useState(3);
  const [category, setCategory] = useState<string | null>("Engineering");
  return (
    <div className="w-full max-w-2xl space-y-6">
      <CategoryFilter
        categories={["Engineering", "Design", "Product", "Research"]}
        selectedCategory={category ?? undefined}
        onSelect={setCategory}
      />
      <BlogPagination currentPage={page} totalPages={12} onPageChange={setPage} />
      <p className="text-caption text-center">{t("page")} {page} · {t("category")}: {category ?? t("all")}</p>
    </div>
  );
}

// AccountLockedCard renders a full-screen (min-h-dvh) auth screen — frame it in a
// scaled-down stage so it previews like the others without taking over the page.
function AccountLockedDemo() {
  const t = useTranslations("showcase.demos.accountLocked");
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border [&>*]:min-h-full!" style={{ height: 440 }}>
      <AccountLockedCard
        appName="YunUI"
        logoSrc="/favicon.ico"
        icon={<Lock className="w-6 h-6 text-error" />}
        title={t("lockedTitle")}
        subtitle={t("lockedSubtitle")}
        appeal={t("lockedAppeal")}
        backLabel={t("backLabel")}
        onBack={() => toast.info(t("backToast"))}
      />
    </div>
  );
}

// Live brand-theming switcher — dogfoods YunUI's runtime theming API
// (useYunUITheme). Flips data-accent-source/data-brand on <html> so the whole
// page (accent utilities + primary/accent buttons) re-themes with no rebuild.
function ThemeControls() {
  const [theme, setTheme] = useYunUITheme({ accentSource: "mono", brand: "blue" });
  const brandOn = theme.accentSource === "brand";
  const active = theme.brand ?? "blue";
  return (
    <div className="mt-6 rounded-2xl border border-border bg-(--bg-elevated) p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-medium">Live brand theming</p>
          <p className="text-caption">
            Flip the accent to a brand palette — the whole page re-themes, no
            rebuild. Sets <code className="text-xs">data-accent-source</code> +{" "}
            <code className="text-xs">data-brand</code> on{" "}
            <code className="text-xs">&lt;html&gt;</code> via{" "}
            <code className="text-xs">useYunUITheme()</code>.
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg bg-card p-0.5 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setTheme({ accentSource: "mono" })}
            className={`px-2.5 py-1 rounded-md transition-colors ${!brandOn ? "bg-(--bg-elevated) shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Mono
          </button>
          <button
            type="button"
            onClick={() => setTheme({ accentSource: "brand", brand: active })}
            className={`px-2.5 py-1 rounded-md transition-colors ${brandOn ? "bg-(--bg-elevated) shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Brand
          </button>
        </div>
      </div>
      {brandOn && (
        <div className="mt-3 flex flex-wrap gap-2">
          {YUNUI_PALETTES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setTheme({ brand: p })}
              title={p}
              aria-label={p}
              aria-pressed={active === p}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${active === p ? "border-foreground scale-110" : "border-border"}`}
              style={{ background: `var(--scheme-${p}-600)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- page -----------------------------------------------------------------

const COLOR_TOKENS: { name: string; varName: string }[] = [
  { name: "bg-base", varName: "--bg-base" },
  { name: "bg-elevated", varName: "--bg-elevated" },
  { name: "bg-card", varName: "--bg-card" },
  { name: "border-subtle", varName: "--border-subtle" },
  { name: "border-default", varName: "--border-default" },
  { name: "accent", varName: "--accent" },
  { name: "success", varName: "--success" },
  { name: "warning", varName: "--warning" },
  { name: "error", varName: "--error" },
];

export default function Showcase() {
  const t = useTranslations("showcase");
  const CATEGORY_NAV: { label: string; href: string }[] = [
    { label: t("nav.foundations"), href: "#foundations" },
    { label: t("nav.design"), href: "#design" },
    { label: t("nav.dashboard"), href: "#dashboard" },
    { label: t("nav.layout"), href: "#layout" },
    { label: t("nav.buttons"), href: "#buttons" },
    { label: t("nav.forms"), href: "#forms" },
    { label: t("nav.overlays"), href: "#overlays" },
    { label: t("nav.dataDisplay"), href: "#data-display" },
    { label: t("nav.feedback"), href: "#feedback" },
    { label: t("nav.navigation"), href: "#navigation" },
    { label: t("nav.patterns"), href: "#patterns" },
  ];
  const [checked, setChecked] = useState(true);
  const [sw, setSw] = useState(true);
  const [seg, setSeg] = useState("week");
  const [sel, setSel] = useState("");
  const [combo, setCombo] = useState("");
  const [slider, setSlider] = useState([40]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tab, setTab] = useState("inbox");
  const [caps, setCaps] = useState<string[]>(["vision", "thinking"]);
  const [prov, setProv] = useState("openai");

  return (
    // The old Shell wrapped content in max-w-5xl; now the page owns its own
    // readable, centered container (the floating navbar is full-bleed above).
    <div className="max-w-6xl w-[calc(100%-48px)] mx-auto pb-8">
      {/* Header / intro */}
      <section id="overview" className="scroll-mt-20 mb-12">
        <span className="badge badge-info mb-4 inline-block">{t("badge")}</span>
        <h1 className="heading-xl text-3xl sm:text-4xl leading-[1.1] max-w-3xl">
          {t("title")}
        </h1>
        <p className="text-body mt-4 max-w-2xl">
          {t("intro")}
        </p>
        {/* In-page category nav (anchor links) */}
        <nav className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_NAV.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-(--bg-elevated) text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              {c.label}
            </a>
          ))}
        </nav>
        <ThemeControls />
      </section>

      {/* Foundations — the design tokens everything is built on */}
      <Section id="foundations" title={t("foundations.title")} description={t("foundations.description")}>
        <Demo title={t("demos.colorTokens.title")} description={t("demos.colorTokens.description")}>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full">
            {COLOR_TOKENS.map((tk) => (
              <div key={tk.varName} className="text-center">
                <div className="h-14 rounded-xl border border-border" style={{ background: `var(${tk.varName})` }} />
                <div className="text-caption mt-1.5 font-mono">{tk.name}</div>
              </div>
            ))}
          </div>
        </Demo>
        <Demo title={t("demos.typeScale.title")}>
          <div className="space-y-2 w-full">
            <p className="heading-xl">Heading XL</p>
            <p className="heading-lg">Heading LG</p>
            <p className="heading-md">Heading MD</p>
            <p className="text-body">{t("demos.typeScale.body")}</p>
            <p className="text-caption">{t("demos.typeScale.caption")}</p>
            <p className="text-label">LABEL · UPPERCASE</p>
            <p className="font-mono text-sm">font-mono · JetBrains Mono 0123456789</p>
          </div>
        </Demo>
        <Demo title={t("demos.surfaces.title")} description=".card · .glass-card · .glass-panel · .stat-card">
          <div className="card p-5 w-44"><p className="font-medium mb-1">.card</p><p className="text-caption">{t("demos.surfaces.baseSurface")}</p></div>
          <div className="glass-card p-5 w-44"><p className="font-medium mb-1">.glass-card</p><p className="text-caption">{t("demos.surfaces.frosted")}</p></div>
          <div className="glass-panel p-5 w-44"><p className="font-medium mb-1">.glass-panel</p><p className="text-caption">{t("demos.surfaces.elevatedGlass")}</p></div>
          <div className="stat-card p-5 w-44"><p className="text-label">.stat-card</p><p className="stat-number text-xl font-semibold">128K</p></div>
        </Demo>
        <Demo title={t("demos.radiiShadows.title")}>
          <div className="flex flex-wrap gap-4">
            {([["xs", "--shadow-xs"], ["sm", "--shadow-sm"], ["md", "--shadow-md"], ["lg", "--shadow-lg"]] as const).map(([n, v]) => (
              <div key={n} className="h-16 w-28 rounded-2xl bg-card border border-border flex items-center justify-center text-caption" style={{ boxShadow: `var(${v})` }}>
                shadow-{n}
              </div>
            ))}
          </div>
        </Demo>
      </Section>

      {/* Utility classes — the raw Yunxin classes components are built on */}
      <Section id="design" title={t("design.title")} description={t("design.description")}>
        <Demo title={t("demos.badges.title")}>
          <span className="badge badge-success">success</span>
          <span className="badge badge-warning">warning</span>
          <span className="badge badge-error">error</span>
          <span className="badge badge-info">info</span>
          <FellowBadge variant="pill" />
          <StatusBadge status="approved" />
          <StatusBadge status="pending" />
          <CapabilityBadge capability="vision" />
          <CapabilityBadge capability="thinking" />
          <SourceBadge source="yaml" />
          <SourceBadge source="api" />
          <ActiveBadge isActive />
          <ActiveBadge isActive={false} />
          <DeprecatedBadge isDeprecated />
          <IDBadge text="claude-opus-4-8" />
        </Demo>
        <Demo title={t("demos.rawButtons.title")}>
          <button className="btn btn-primary">.btn-primary</button>
          <button className="btn btn-secondary">.btn-secondary</button>
          <button className="btn btn-ghost">.btn-ghost</button>
          <button className="btn btn-outline">.btn-outline</button>
        </Demo>
        <Demo title={t("demos.navItems.title")}>
          <div className="w-56">
            <div className="nav-section">{t("demos.navItems.section")}</div>
            <a className="nav-item active"><LayoutGrid size={18} strokeWidth={1.75} /><span>{t("demos.navItems.active")}</span></a>
            <a className="nav-item"><Activity size={18} strokeWidth={1.75} /><span>{t("demos.navItems.inactive")}</span></a>
            <a className="nav-item"><KeyRound size={18} strokeWidth={1.75} /><span>{t("demos.navItems.another")}</span></a>
          </div>
        </Demo>
      </Section>

      {/* Dashboard demo — what a real Yunxin page looks like */}
      <Section id="dashboard" title={t("dashboard.title")}>
        <PageHeader
          title={t("demos.dashboard.pageTitle")}
          description={t("demos.dashboard.pageDescription")}
          actions={<Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1.5" />{t("demos.dashboard.newKey")}</Button>}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Coins} label={t("demos.dashboard.statBalance")} value={<AnimatedNumber value={1250} />} trend={{ value: 4.2, positive: true }} />
          <StatCard icon={Activity} label={t("demos.dashboard.statRequests")} value={<AnimatedNumber value={48213} />} trend={{ value: 12, positive: true }} />
          <StatCard icon={KeyRound} label={t("demos.dashboard.statApiKeys")} value={<AnimatedNumber value={3} />} />
          <StatCard icon={TrendingUp} label={t("demos.dashboard.statSpend")} value={<AnimatedNumber value={72.4} decimals={2} />} trend={{ value: 3, positive: false }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: MessageSquare, title: t("demos.dashboard.quickPlayground") },
            { icon: Layers, title: t("demos.dashboard.quickModels") },
            { icon: KeyRound, title: t("demos.dashboard.quickApiKeys") },
            { icon: Activity, title: t("demos.dashboard.quickAnalytics") },
          ].map((q) => (
            <button key={q.title} className="card-interactive card p-4 flex items-center gap-3 text-left">
              <q.icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm">{q.title}</span>
            </button>
          ))}
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <h3 className="heading-md">{t("demos.dashboard.gettingStarted")}</h3>
          </div>
          <CodeBlock language="bash" code={'curl https://api.example.com/v1/models \\\n  -H "Authorization: Bearer $KEY"'} />
        </div>
      </Section>

      {/* Layout & chrome — the real app shell pieces */}
      <Section id="layout" title={t("layout.title")} description={t("layout.description")}>
        <Demo title={t("demos.navbar.title")} description={t("demos.navbar.description")}>
          <Stage height={120}>
            <Navbar
              appName="YunUI"
              logoSrc="/favicon.ico"
              variant="public"
              links={[
                { href: "#nav-models", label: t("demos.navbar.linkModels") },
                { href: "#nav-docs", label: t("demos.navbar.linkDocs") },
                { href: "#nav-pricing", label: t("demos.navbar.linkPricing") },
              ]}
              labels={{ signIn: t("demos.navbar.signIn"), signUp: t("demos.navbar.signUp") }}
            />
          </Stage>
        </Demo>
        <Demo title={t("demos.sidebar.title")} description={t("demos.sidebar.description")}>
          <SidebarCollapseDemo />
        </Demo>
        <Demo title={t("demos.footer.title")} description={t("demos.footer.description")}>
          <Stage height={300}>
            <div className="absolute inset-x-0 bottom-0">
              <Footer
                appName="YunUI"
                logoSrc="/favicon.ico"
                tagline={t("demos.footer.tagline")}
                sections={[
                  { title: t("demos.footer.secProduct"), links: [{ label: t("demos.footer.linkModels"), href: "#f-models" }, { label: t("demos.footer.linkDocs"), href: "#f-docs" }, { label: t("demos.footer.linkPricing"), href: "#f-pricing" }] },
                  { title: t("demos.footer.secCompany"), links: [{ label: t("demos.footer.linkAbout"), href: "#f-about" }, { label: t("demos.footer.linkBlog"), href: "#f-blog" }] },
                  { title: t("demos.footer.secLegal"), links: [{ label: t("demos.footer.linkPrivacy"), href: "#f-privacy" }, { label: t("demos.footer.linkTerms"), href: "#f-terms" }] },
                ]}
              />
            </div>
          </Stage>
        </Demo>
      </Section>

      {/* Buttons */}
      <Section id="buttons" title={t("buttons.title")}>
        <Demo
          title={t("demos.buttonVariants.title")}
          code={`import { Button } from "yunui";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="accent">Accent</Button>`}
        >
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="amber">Amber</Button>
          <Button variant="red">Red</Button>
        </Demo>
        <Demo title={t("demos.buttonSizes.title")}>
          <Button size="sm">{t("demos.buttonSizes.small")}</Button>
          <Button size="md">{t("demos.buttonSizes.medium")}</Button>
          <Button size="lg">{t("demos.buttonSizes.large")}</Button>
          <Button loading>{t("demos.buttonSizes.loading")}</Button>
          <Button disabled>{t("demos.buttonSizes.disabled")}</Button>
        </Demo>
        <Demo title={t("demos.iconButton.title")}>
          <IconButton icon={<Heart className="w-4 h-4" />} label={t("demos.iconButton.like")} />
          <IconButton icon={<Settings className="w-4 h-4" />} label={t("demos.iconButton.settings")} />
          <ShinyButton>{t("demos.iconButton.shiny")}</ShinyButton>
        </Demo>
      </Section>

      {/* Forms */}
      <Section id="forms" title={t("forms.title")}>
        <Demo title={t("demos.inputTextarea.title")}>
          <div className="w-full max-w-sm space-y-3">
            <div>
              <Label>{t("demos.inputTextarea.email")}</Label>
              <Input placeholder="you@example.com" icon={<Search className="w-4 h-4" />} />
            </div>
            <Textarea placeholder={t("demos.inputTextarea.writePlaceholder")} rows={3} />
          </div>
        </Demo>
        <Demo title={t("demos.checkboxSwitch.title")}>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            {t("demos.checkboxSwitch.subscribe")}
          </label>
          <Switch checked={sw} onCheckedChange={setSw} />
          <Switch checked={!sw} onCheckedChange={(v) => setSw(!v)} variant="success" />
        </Demo>
        <Demo title={t("demos.segmentedSelect.title")}>
          <SegmentedSelect
            value={seg}
            onChange={setSeg}
            options={[
              { value: "day", label: t("demos.segmentedSelect.day") },
              { value: "week", label: t("demos.segmentedSelect.week") },
              { value: "month", label: t("demos.segmentedSelect.month") },
            ]}
          />
        </Demo>
        <Demo title={t("demos.customSelect.title")}>
          <div className="w-56">
            <CustomSelect
              value={sel}
              onChange={setSel}
              searchable
              options={[
                { value: "gpt", label: "GPT-4o" },
                { value: "claude", label: "Claude Opus" },
                { value: "deepseek", label: "DeepSeek R1" },
              ]}
            />
          </div>
          <div className="w-56">
            <Combobox
              value={combo}
              onChange={setCombo}
              options={[
                { value: "openai", label: "OpenAI", iconUrl: getIconPath("openai") },
                { value: "anthropic", label: "Anthropic", iconUrl: getIconPath("anthropic") },
                { value: "deepseek", label: "DeepSeek", iconUrl: getIconPath("deepseek") },
                { value: "mistral", label: "Mistral", iconUrl: getIconPath("mistral") },
              ]}
            />
          </div>
        </Demo>
        <Demo
          title={t("demos.radixSelect.title")}
          code={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "yunui";

<Select>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Pick a provider" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Provider A</SelectItem>
    <SelectItem value="b">Provider B</SelectItem>
  </SelectContent>
</Select>`}
        >
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder={t("demos.radixSelect.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Provider A</SelectItem>
              <SelectItem value="b">Provider B</SelectItem>
              <SelectItem value="c">Provider C</SelectItem>
            </SelectContent>
          </Select>
        </Demo>
        <Demo title={t("demos.slider.title")}>
          <div className="w-72">
            <Slider value={slider} onValueChange={setSlider} max={100} step={1} />
            <p className="text-caption mt-2">{t("demos.slider.value")}: {slider[0]}</p>
          </div>
        </Demo>
        <Demo title={t("demos.capabilitySelector.title")} description={t("demos.capabilitySelector.description")}>
          <div className="w-full max-w-md">
            <CapabilitySelector selected={caps} onChange={setCaps} columns={3} />
            <p className="text-caption mt-2">{t("demos.capabilitySelector.selected")}: {caps.join(", ") || t("demos.capabilitySelector.none")}</p>
          </div>
        </Demo>
        <Demo title={t("demos.providerSelect.title")} description={t("demos.providerSelect.description")}>
          <div className="w-64">
            <CustomSelect
              value={prov}
              onChange={setProv}
              searchable
              options={[
                { value: "openai", label: "OpenAI", icon: <ProviderIcon provider="openai" size={18} rounded /> },
                { value: "anthropic", label: "Anthropic", icon: <ProviderIcon provider="anthropic" size={18} rounded /> },
                { value: "deepseek", label: "DeepSeek", icon: <ProviderIcon provider="deepseek" size={18} rounded /> },
                { value: "google", label: "Google", icon: <ProviderIcon provider="google" size={18} rounded /> },
                { value: "mistral", label: "Mistral", icon: <ProviderIcon provider="mistral" size={18} rounded /> },
                { value: "qwen", label: "Qwen", icon: <ProviderIcon provider="qwen" size={18} rounded /> },
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            {["openai", "anthropic", "deepseek", "google", "mistral", "qwen", "groq", "cohere"].map((p) => (
              <ProviderIcon key={p} provider={p} size={28} rounded />
            ))}
          </div>
        </Demo>
      </Section>

      {/* Overlays */}
      <Section id="overlays" title={t("overlays.title")}>
        <Demo
          title={t("demos.dialog.title")}
          code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "yunui";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm change</DialogTitle>
      <DialogDescription>Radix-backed, styled by YunUI.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">{t("demos.dialog.open")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("demos.dialog.confirmTitle")}</DialogTitle>
                <DialogDescription>{t("demos.dialog.confirmDescription")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">{t("demos.dialog.cancel")}</Button>
                <Button variant="primary">{t("demos.dialog.confirm")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Demo>
        <Demo title={t("demos.modalSheet.title")}>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>{t("demos.modalSheet.openModal")}</Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>{t("demos.modalSheet.openSheet")}</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t("demos.modalSheet.modalTitle")} subtitle={t("demos.modalSheet.modalSubtitle")}>
            <p className="text-body">{t("demos.modalSheet.modalBody")}</p>
          </Modal>
          <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t("demos.modalSheet.sheetTitle")}>
            <p className="text-body p-1">{t("demos.modalSheet.sheetBody")}</p>
          </Sheet>
        </Demo>
        <Demo title={t("demos.popoverTooltipDropdown.title")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{t("demos.popoverTooltipDropdown.popover")}</Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-56">
              <p className="text-caption">{t("demos.popoverTooltipDropdown.popoverContent")}</p>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">{t("demos.popoverTooltipDropdown.hoverMe")}</Button>
              </TooltipTrigger>
              <TooltipContent>{t("demos.popoverTooltipDropdown.hint")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{t("demos.popoverTooltipDropdown.menu")}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t("demos.popoverTooltipDropdown.actions")}</DropdownMenuLabel>
              <DropdownMenuItem><Plus className="w-4 h-4 mr-2" />{t("demos.popoverTooltipDropdown.new")}</DropdownMenuItem>
              <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />{t("demos.popoverTooltipDropdown.settings")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Trash2 className="w-4 h-4 mr-2" />{t("demos.popoverTooltipDropdown.delete")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>
        <Demo title={t("demos.dropdownChoices.title")} description={t("demos.dropdownChoices.description")}>
          <DropdownChoicesDemo />
        </Demo>
        <Demo title={t("demos.confirmModals.title")} description={t("demos.confirmModals.description")}>
          <ConfirmModalsDemo />
        </Demo>
      </Section>

      {/* Data display */}
      <Section id="data-display" title={t("dataDisplay.title")}>
        <Demo
          title={t("demos.cardsBadges.title")}
          code={`import { Card, Badge } from "yunui";

<Card hover className="p-5 w-60">
  <div className="flex items-center justify-between mb-2">
    <span className="font-medium">Pro plan</span>
    <Badge variant="success">Active</Badge>
  </div>
  <p className="text-caption">Everything in Basic, plus higher limits.</p>
</Card>`}
        >
          <Card hover className="p-5 w-60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{t("demos.cardsBadges.proPlan")}</span>
              <Badge variant="success">{t("demos.cardsBadges.active")}</Badge>
            </div>
            <p className="text-caption">{t("demos.cardsBadges.proDesc")}</p>
          </Card>
          <div className="flex flex-col gap-2">
            <Badge>{t("demos.cardsBadges.default")}</Badge>
            <Badge variant="info">{t("demos.cardsBadges.info")}</Badge>
            <Badge variant="warning">{t("demos.cardsBadges.warning")}</Badge>
            <Badge variant="error">{t("demos.cardsBadges.error")}</Badge>
          </div>
        </Demo>
        <Demo title={t("demos.avatarProgress.title")}>
          <Avatar>
            <AvatarImage src="https://github.com/yuhuanowo.png" alt="avatar" />
            <AvatarFallback>YX</AvatarFallback>
          </Avatar>
          <div className="w-60"><Progress value={66} /></div>
        </Demo>
        <Demo title={t("demos.animatedNumber.title")} description={t("demos.animatedNumber.description")}>
          <div className="flex flex-wrap gap-8">
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">{t("demos.animatedNumber.requests")}</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={48213} /></div>
            </div>
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">{t("demos.animatedNumber.uptime")}</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={99.98} suffix="%" decimals={2} /></div>
            </div>
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">{t("demos.animatedNumber.latency")}</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={142} suffix="ms" /></div>
            </div>
          </div>
        </Demo>
        <Demo title={t("demos.tabs.title")}>
          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="inbox">{t("demos.tabs.inbox")}</TabsTrigger>
              <TabsTrigger value="archive">{t("demos.tabs.archive")}</TabsTrigger>
              <TabsTrigger value="spam">{t("demos.tabs.spam")}</TabsTrigger>
            </TabsList>
            <TabsContent value="inbox"><p className="text-body">{t("demos.tabs.inboxContent")}</p></TabsContent>
            <TabsContent value="archive"><p className="text-body">{t("demos.tabs.archiveContent")}</p></TabsContent>
            <TabsContent value="spam"><p className="text-body">{t("demos.tabs.spamContent")}</p></TabsContent>
          </Tabs>
        </Demo>
        <Demo title={t("demos.collapsible.title")}>
          <Collapsible className="w-full max-w-md">
            <CollapsibleTrigger asChild>
              <Button variant="outline">{t("demos.collapsible.toggle")}</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 p-4 rounded-xl border border-border text-caption">{t("demos.collapsible.hidden")}</div>
            </CollapsibleContent>
          </Collapsible>
        </Demo>
        <Demo title={t("demos.bento.title")}>
          <BentoGrid className="w-full">
            <BentoCard icon={<Zap className="w-5 h-5" />} title={t("demos.bento.fastTitle")} description={t("demos.bento.fastDesc")} />
            <BentoCard icon={<Rocket className="w-5 h-5" />} title={t("demos.bento.scalableTitle")} description={t("demos.bento.scalableDesc")} />
            <BentoCard icon={<Star className="w-5 h-5" />} title={t("demos.bento.polishedTitle")} description={t("demos.bento.polishedDesc")} />
          </BentoGrid>
        </Demo>
        <Demo title={t("demos.marquee.title")}>
          <Marquee className="w-full [--duration:18s]">
            {["OpenAI", "Anthropic", "DeepSeek", "Mistral", "Google"].map((n) => (
              <span key={n} className="mx-6 text-muted-foreground font-medium">{n}</span>
            ))}
          </Marquee>
        </Demo>
      </Section>

      {/* Feedback */}
      <Section id="feedback" title={t("feedback.title")}>
        <Demo title={t("demos.skeletonSpinner.title")}>
          <div className="space-y-2 w-60">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Demo>
        <Demo title={t("demos.emptyState.title")}>
          <EmptyState icon={<Inbox className="w-8 h-8" />} title={t("demos.emptyState.noMessages")} description={t("demos.emptyState.noMessagesDesc")} action={<Button variant="primary" size="sm">{t("demos.emptyState.refresh")}</Button>} />
        </Demo>
        <Demo title={t("demos.pageLoader.title")} description={t("demos.pageLoader.description")}>
          <div className="w-full h-44 rounded-2xl border border-border overflow-hidden [&>*]:min-h-full!">
            <PageLoader title={t("demos.pageLoader.loadingTitle")} subtitle={t("demos.pageLoader.loadingSubtitle")} />
          </div>
        </Demo>
        <Demo title={t("demos.pageStates.title")} description={t("demos.pageStates.description")}>
          <div className="grid sm:grid-cols-3 gap-3 w-full">
            <div className="rounded-xl border border-border"><PageLoadingState message={t("demos.pageStates.loading")} /></div>
            <div className="rounded-xl border border-border"><PageErrorState message={t("demos.pageStates.errorMsg")} onRetry={() => toast.info(t("demos.pageStates.retrying"))} /></div>
            <div className="rounded-xl border border-border"><PageEmptyState icon={Inbox} title={t("demos.pageStates.emptyTitle")} description={t("demos.pageStates.emptyDesc")} action={<Button size="sm" variant="primary">{t("demos.pageStates.add")}</Button>} /></div>
          </div>
        </Demo>
        <Demo title={t("demos.mediaStates.title")} description={t("demos.mediaStates.description")}>
          <div className="grid sm:grid-cols-3 gap-3 w-full">
            <div className="rounded-xl border border-border"><MediaLoadingState message={t("demos.mediaStates.generating")} /></div>
            <div className="rounded-xl border border-border"><MediaErrorState message={t("demos.mediaStates.errorMsg")} onRetry={() => toast.info(t("demos.mediaStates.retrying"))} /></div>
            <div className="rounded-xl border border-border"><MediaEmptyState icon={ImageIcon} title={t("demos.mediaStates.emptyTitle")} description={t("demos.mediaStates.emptyDesc")} action={<Button size="sm" variant="primary">{t("demos.mediaStates.generate")}</Button>} /></div>
          </div>
        </Demo>
        <Demo title={t("demos.thinkingBlock.title")}>
          <div className="w-full max-w-lg">
            <ThinkingBlock content={"Let me reason about this step by step…\n1. Parse the request\n2. Plan the answer"} isStreaming defaultOpen />
          </div>
        </Demo>
        <Demo title={t("demos.toast.title")} description={t("demos.toast.description")}>
          <Button variant="primary" size="sm" onClick={() => toast.success(t("demos.toast.successTitle"), t("demos.toast.successBody"))}>{t("demos.toast.success")}</Button>
          <Button variant="red" size="sm" onClick={() => toast.error(t("demos.toast.errorTitle"), t("demos.toast.errorBody"))}>{t("demos.toast.error")}</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info(t("demos.toast.infoTitle"), t("demos.toast.infoBody"))}>{t("demos.toast.info")}</Button>
          <Button variant="amber" size="sm" onClick={() => toast.warning(t("demos.toast.warningTitle"), t("demos.toast.warningBody"))}>{t("demos.toast.warning")}</Button>
        </Demo>
      </Section>

      {/* Navigation */}
      <Section id="navigation" title={t("navigation.title")}>
        <Demo title={t("demos.navTabs.title")}>
          <NavTabs
            activeKey={tab}
            onChange={setTab}
            tabs={[
              { key: "inbox", label: t("demos.navTabs.inbox") },
              { key: "archive", label: t("demos.navTabs.archive") },
              { key: "spam", label: t("demos.navTabs.spam") },
            ]}
          />
        </Demo>
        <Demo title={t("demos.languageSwitcher.title")}>
          <LanguageSwitcher
            variant="pill"
            currentLocale="en"
            onChange={() => {}}
            locales={[
              { value: "en", label: "English" },
              { value: "zh-TW", label: "繁體中文" },
              { value: "ja", label: "日本語" },
            ]}
          />
        </Demo>
      </Section>

      {/* Patterns */}
      <Section id="patterns" title={t("patterns.title")}>
        <Demo title={t("demos.mediaPageHeader.title")} description={t("demos.mediaPageHeader.description")}>
          <div className="w-full max-w-2xl">
            <MediaPageHeader
              title={t("demos.mediaPageHeader.headerTitle")}
              description={t("demos.mediaPageHeader.headerDescription")}
              isSyncing={false}
              syncError={null}
              onSync={() => toast.info(t("demos.mediaPageHeader.syncing"))}
              stats={[
                { label: t("demos.mediaPageHeader.statImages"), value: 128 },
                { label: t("demos.mediaPageHeader.statThisMonth"), value: 42 },
              ]}
            />
          </div>
        </Demo>
        <Demo title={t("demos.modelCard.title")} description={t("demos.modelCard.description")}>
          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <ModelCard
              name="Claude Opus 4.8"
              icon={<ModelIcon provider="anthropic" developer="claude" size={40} rounded />}
              ids={["claude-opus-4-8", "opus-latest"]}
              description={t("demos.modelCard.opusDesc")}
              capabilities={["vision", "thinking", "function_calling", "streaming"]}
              developer={{ label: "Anthropic", iconUrl: getIconPath("anthropic") ?? undefined }}
              context="200K"
              tier="pro"
              price="$15/M"
            />
            <ModelCard
              name="DeepSeek R1"
              icon={<ModelIcon provider="deepseek" developer="deepseek" size={40} rounded />}
              ids={["deepseek-r1"]}
              description={t("demos.modelCard.deepseekDesc")}
              capabilities={["thinking", "streaming"]}
              developer={{ label: "DeepSeek", iconUrl: getIconPath("deepseek") ?? undefined }}
              context="64K"
              price="$0.55/M"
              nonofficial
            />
          </div>
        </Demo>
        <Demo title={t("demos.aiAvatars.title")} description={t("demos.aiAvatars.description")}>
          <div className="space-y-5 w-full max-w-2xl">
            <div>
              <p className="text-label mb-2">ProviderAvatar</p>
              <div className="flex items-center gap-2">
                {["openai", "anthropic", "google", "deepseek", "mistral", "groq", "cohere"].map((p) => (
                  <ProviderAvatar key={p} provider={p} size={36} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-label mb-2">ModelAvatar (developer-resolved, with iconUrl fallback)</p>
              <div className="flex items-center gap-2">
                <ModelAvatar provider="anthropic" developer="claude" size={36} />
                <ModelAvatar provider="openai" developer="openai" iconUrl="/icons/models/gpt-5.png" size={36} />
                <ModelAvatar provider="deepseek" developer="deepseek" size={36} />
                <ModelAvatar provider="meta" developer="llama" size={36} />
                <ModelAvatar provider="qwen" developer="qwen" size={36} />
              </div>
            </div>
            <div>
              <p className="text-label mb-2">ProviderIconImg (rounded alias)</p>
              <div className="flex items-center gap-2">
                {["openai", "anthropic", "google", "mistral", "perplexity"].map((p) => (
                  <ProviderIconImg key={p} provider={p} size={28} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-label mb-2">ModelTypeIcon</p>
              <div className="flex flex-wrap items-center gap-3">
                {["chat", "embedding", "image_generation", "tts", "stt", "video", "rerank", "moderation"].map((tp) => (
                  <span key={tp} className="inline-flex items-center gap-1.5 text-caption">
                    <ModelTypeIcon type={tp} />
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Demo>
        <Demo title={t("demos.fumadocsButtons.title")} description={t("demos.fumadocsButtons.description")}>
          <button className={buttonVariants({ variant: "primary" })}>Primary</button>
          <button className={buttonVariants({ variant: "secondary" })}>Secondary</button>
          <button className={buttonVariants({ variant: "outline" })}>Outline</button>
          <button className={buttonVariants({ variant: "ghost" })}>Ghost</button>
          <button className={buttonVariants({ color: "primary", size: "sm" })}>{t("demos.buttonSizes.small")}</button>
          <button className={buttonVariants({ variant: "outline", size: "icon" })} aria-label="Docs"><FileText className="size-5" /></button>
        </Demo>
        <Demo title={t("demos.codeBlock.title")}>
          <div className="w-full max-w-2xl">
            <CodeBlock
              language="bash"
              code={'curl https://api.example.com/v1/chat/completions \\\n  -H "Authorization: Bearer $KEY"'}
            />
          </div>
        </Demo>
        <Demo title={t("demos.faq.title")}>
          <div className="w-full">
            <FAQ
              items={[
                { question: t("demos.faq.q1"), answer: t("demos.faq.a1") },
                { question: t("demos.faq.q2"), answer: t("demos.faq.a2") },
                { question: t("demos.faq.q3"), answer: t("demos.faq.a3") },
              ]}
            />
          </div>
        </Demo>
        <Demo title={t("demos.blogCard.title")}>
          <div className="w-80">
            <BlogCard
              title={t("demos.blogCard.postTitle")}
              description={t("demos.blogCard.postDescription")}
              category="Engineering"
              date="2026-06-21"
              readingTime={4}
              author={{ name: "yuhuan" }}
              url="#"
            />
          </div>
        </Demo>
        <Demo title={t("demos.blogPostHeader.title")} description={t("demos.blogPostHeader.description")}>
          <div className="w-full max-w-2xl">
            <BlogPostHeader
              title={t("demos.blogPostHeader.postTitle")}
              description={t("demos.blogPostHeader.postDescription")}
              category="Engineering"
              date="2026-06-21"
              readingTime={6}
              author={{ name: "yuhuan", url: "#" }}
              tags={["design-system", "react", "monorepo"]}
            />
          </div>
        </Demo>
        <Demo title={t("demos.blogControls.title")} description={t("demos.blogControls.description")}>
          <BlogControlsDemo />
        </Demo>
        <Demo title={t("demos.codeDemo.title")} description={t("demos.codeDemo.description")}>
          <div className="w-full">
            <CodeDemo />
          </div>
        </Demo>
        <Demo title={t("demos.docsActions.title")} description={t("demos.docsActions.description")}>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-1">
            <LLMCopyButton markdownUrl="/docs/overview.md" />
            <ViewOptions markdownUrl="/docs/overview.md" githubUrl="https://github.com/YuhuanStudio/YunUI" />
          </div>
        </Demo>
        <Demo title={t("demos.accountLocked.title")} description={t("demos.accountLocked.description")}>
          <AccountLockedDemo />
        </Demo>
        <Demo title={t("demos.fellowsBanner.title")}>
          <div className="w-full max-w-xl">
            <FellowsBanner
              title={t("demos.fellowsBanner.bannerTitle")}
              description={t("demos.fellowsBanner.bannerDescription")}
              ctaText={t("demos.fellowsBanner.cta")}
              features={[t("demos.fellowsBanner.feature1"), t("demos.fellowsBanner.feature2"), t("demos.fellowsBanner.feature3")]}
              href="#"
            />
          </div>
        </Demo>
        <Demo title={t("demos.errorBoundary.title")}>
          <div className="w-full max-w-md">
            <ErrorBoundaryDemo />
          </div>
        </Demo>
        <Demo title={t("demos.backgroundEffects.title")} description={t("demos.backgroundEffects.description")}>
          <div className="relative isolate w-full h-48 rounded-2xl border border-border overflow-hidden flex items-center justify-center">
            <BackgroundEffects />
            <div className="text-center">
              <p className="font-semibold">{t("demos.backgroundEffects.yourContent")}</p>
              <p className="text-caption mt-1">{t("demos.backgroundEffects.behindIt")}</p>
            </div>
          </div>
        </Demo>
      </Section>
    </div>
  );
}
