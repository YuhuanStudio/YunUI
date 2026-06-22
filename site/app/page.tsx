"use client";

import { useState, type ReactNode } from "react";
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
  Compass,
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
              Preview
            </button>
            <button
              onClick={() => setView("code")}
              className={`px-2.5 py-1 rounded-md transition-colors ${view === "code" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Code
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
  const [boom, setBoom] = useState(false);
  if (!boom) {
    return (
      <div className="text-center">
        <p className="text-caption mb-3">Child renders fine — click to crash it.</p>
        <Button variant="red" size="sm" onClick={() => setBoom(true)}>
          Throw error
        </Button>
      </div>
    );
  }
  return (
    <ErrorBoundary labels={{ title: "Caught by ErrorBoundary", message: "The child threw during render — this is the fallback UI." }}>
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

const DEMO_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: "Overview", href: "#overview", icon: LayoutGrid },
      { label: "Playground", href: "#playground", icon: MessageSquare },
      { label: "Models", href: "#models", icon: Layers },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "API Keys", href: "#api-keys", icon: KeyRound },
      { label: "Analytics", href: "#analytics", icon: Activity },
      { label: "Logs", href: "#logs", icon: Database },
    ],
  },
];

function SidebarCollapseDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stage height={360}>
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#"
        sections={DEMO_SIDEBAR_SECTIONS}
        currentPath="#overview"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNavigate={() => {}}
      />
      {/* Re-open affordance when collapsed (lives in the app header normally) */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`absolute top-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-all ${collapsed ? "left-3" : "left-[17rem]"}`}
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={16} />
      </button>
    </Stage>
  );
}

// Confirm-modal family — each opens a portal-rendered dialog.
function ConfirmModalsDemo() {
  const [confirm, setConfirm] = useState(false);
  const [del, setDel] = useState(false);
  const [regen, setRegen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setConfirm(true)}>Confirm action</Button>
      <Button variant="red" onClick={() => setDel(true)}>Delete…</Button>
      <Button variant="amber" onClick={() => setRegen(true)}>Regenerate…</Button>
      <ConfirmModal
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast.success("Confirmed");
        }}
        title="Publish changes?"
        subtitle="This goes live immediately"
        message="Your draft will be visible to everyone on the next deploy."
        variant="info"
        confirmText="Publish"
        cancelText="Cancel"
      />
      <DeleteConfirmModal
        isOpen={del}
        onClose={() => setDel(false)}
        onConfirm={() => {
          setDel(false);
          toast.error("Deleted");
        }}
        itemName="Production API key"
      />
      <RegenerateConfirmModal
        isOpen={regen}
        onClose={() => setRegen(false)}
        onConfirm={() => {
          setRegen(false);
          toast.warning("Regenerated");
        }}
        itemName="Webhook secret"
      />
    </>
  );
}

// Dropdown with checkbox + radio items (controlled state).
function DropdownChoicesDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [density, setDensity] = useState("comfortable");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          Show grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showLabels} onCheckedChange={setShowLabels}>
          Show labels
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Blog pagination + category filter are controlled — keep their state local.
function BlogControlsDemo() {
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
      <p className="text-caption text-center">Page {page} · category: {category ?? "all"}</p>
    </div>
  );
}

// AccountLockedCard renders a full-screen (min-h-dvh) auth screen — frame it in a
// scaled-down stage so it previews like the others without taking over the page.
function AccountLockedDemo() {
  return (
    <div className="w-full rounded-2xl border border-border overflow-hidden bg-(--bg-elevated)" style={{ height: 380 }}>
      <div className="origin-top-left" style={{ transform: "scale(0.85)", width: "117.6%", height: "117.6%" }}>
        <AccountLockedCard
          appName="YunUI"
          logoSrc="/favicon.ico"
          icon={<Lock className="w-6 h-6 text-error" />}
          title="Account suspended"
          subtitle="Your account has been temporarily locked for review."
          appeal="If you think this is a mistake, you can appeal the decision."
          backLabel="Back to sign in"
          onBack={() => toast.info("Back to sign in")}
        />
      </div>
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

export default function Home() {
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
    <>
      {/* Overview / hero */}
      <section id="overview" className="scroll-mt-20 mb-20">
        <span className="badge badge-info mb-4">v0.1 · extracted from Yunxin</span>
        <h1 className="heading-xl text-4xl sm:text-5xl leading-[1.1] max-w-3xl">
          One design system.<br />Every project in sync.
        </h1>
        <p className="text-body mt-4 max-w-2xl">
          YunUI is the Yunxin design system as a versioned package — tokens, animations, and components
          in one place. Edit a component here and every project on <code className="code-inline">yunui</code>{" "}
          picks it up on the next version bump. Use the theme switch (top-right) to preview
          light / zinc-dark / true-black.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button variant="primary">Get started</Button>
          <Button variant="outline">Browse components</Button>
          <ShinyButton>Star on GitHub</ShinyButton>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: "Primitives", v: "23" },
            { k: "Patterns", v: "20+" },
            { k: "Themes", v: "3" },
            { k: "Entry points", v: "5" },
          ].map((s) => (
            <div key={s.k} className="stat-card p-4">
              <div className="stat-number text-2xl font-semibold">{s.v}</div>
              <div className="text-label mt-1">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Foundations — the design tokens everything is built on */}
      <Section id="foundations" title="Foundations" description="The tokens, type scale, surfaces and motion that define the Yunxin look.">
        <Demo title="Color tokens" description="CSS variables, theme-aware — they re-map under .dark and .true-black.">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full">
            {COLOR_TOKENS.map((t) => (
              <div key={t.varName} className="text-center">
                <div className="h-14 rounded-xl border border-border" style={{ background: `var(${t.varName})` }} />
                <div className="text-caption mt-1.5 font-mono">{t.name}</div>
              </div>
            ))}
          </div>
        </Demo>
        <Demo title="Type scale">
          <div className="space-y-2 w-full">
            <p className="heading-xl">Heading XL</p>
            <p className="heading-lg">Heading LG</p>
            <p className="heading-md">Heading MD</p>
            <p className="text-body">Body — the default paragraph rhythm and color.</p>
            <p className="text-caption">Caption — secondary supporting text.</p>
            <p className="text-label">LABEL · UPPERCASE</p>
            <p className="font-mono text-sm">font-mono · JetBrains Mono 0123456789</p>
          </div>
        </Demo>
        <Demo title="Surfaces" description=".card · .glass-card · .glass-panel · .stat-card">
          <div className="card p-5 w-44"><p className="font-medium mb-1">.card</p><p className="text-caption">Base surface</p></div>
          <div className="glass-card p-5 w-44"><p className="font-medium mb-1">.glass-card</p><p className="text-caption">Frosted</p></div>
          <div className="glass-panel p-5 w-44"><p className="font-medium mb-1">.glass-panel</p><p className="text-caption">Elevated glass</p></div>
          <div className="stat-card p-5 w-44"><p className="text-label">.stat-card</p><p className="stat-number text-xl font-semibold">128K</p></div>
        </Demo>
        <Demo title="Radii & shadows">
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
      <Section id="design" title="Utility Classes" description="Yunxin pages often use these classes directly — the design lives in CSS, components are thin wrappers.">
        <Demo title="Badges (.badge-* + variants)">
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
        <Demo title="Buttons via raw .btn classes">
          <button className="btn btn-primary">.btn-primary</button>
          <button className="btn btn-secondary">.btn-secondary</button>
          <button className="btn btn-ghost">.btn-ghost</button>
          <button className="btn btn-outline">.btn-outline</button>
        </Demo>
        <Demo title="Nav items (.nav-item — sidebar building block)">
          <div className="w-56">
            <div className="nav-section">Section</div>
            <a className="nav-item active"><LayoutGrid size={18} strokeWidth={1.75} /><span>Active item</span></a>
            <a className="nav-item"><Activity size={18} strokeWidth={1.75} /><span>Inactive item</span></a>
            <a className="nav-item"><KeyRound size={18} strokeWidth={1.75} /><span>Another item</span></a>
          </div>
        </Demo>
      </Section>

      {/* Dashboard demo — what a real Yunxin page looks like */}
      <Section id="dashboard" title="Dashboard Demo">
        <PageHeader
          title="Overview"
          description="A page composed from YunUI layout pieces, exactly like Yunxin."
          actions={<Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1.5" />New key</Button>}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Coins} label="Balance" value={<AnimatedNumber value={1250} />} trend={{ value: 4.2, positive: true }} />
          <StatCard icon={Activity} label="Requests" value={<AnimatedNumber value={48213} />} trend={{ value: 12, positive: true }} />
          <StatCard icon={KeyRound} label="API keys" value={<AnimatedNumber value={3} />} />
          <StatCard icon={TrendingUp} label="Spend" value={<AnimatedNumber value={72.4} decimals={2} />} trend={{ value: 3, positive: false }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: MessageSquare, title: "Playground" },
            { icon: Layers, title: "Models" },
            { icon: KeyRound, title: "API Keys" },
            { icon: Activity, title: "Analytics" },
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
            <h3 className="heading-md">Getting started</h3>
          </div>
          <CodeBlock language="bash" code={'curl https://api.yunxin.ai/v1/models \\\n  -H "Authorization: Bearer $KEY"'} />
        </div>
      </Section>

      {/* Layout & chrome — the real app shell pieces */}
      <Section id="layout" title="Layout & Chrome" description="Navbar, Sidebar and Footer — framed previews of the fixed app chrome.">
        <Demo title="Navbar" description="Floating top nav; switcher/toggle are slots, links are props.">
          <Stage height={120}>
            <Navbar
              appName="YunUI"
              logoSrc="/favicon.ico"
              variant="public"
              links={[
                { href: "#nav-models", label: "Models" },
                { href: "#nav-docs", label: "Docs" },
                { href: "#nav-pricing", label: "Pricing" },
              ]}
              labels={{ signIn: "Sign in", signUp: "Sign up" }}
            />
          </Stage>
        </Demo>
        <Demo title="Sidebar — with collapse" description="Click the toggle to collapse / re-open. nav-item active states included.">
          <SidebarCollapseDemo />
        </Demo>
        <Demo title="Footer" description="Sections + social are props; layout and styling are the design system.">
          <Stage height={300}>
            <div className="absolute inset-x-0 bottom-0">
              <Footer
                appName="YunUI"
                logoSrc="/favicon.ico"
                tagline="One design system, every project in sync."
                sections={[
                  { title: "Product", links: [{ label: "Models", href: "#f-models" }, { label: "Docs", href: "#f-docs" }, { label: "Pricing", href: "#f-pricing" }] },
                  { title: "Company", links: [{ label: "About", href: "#f-about" }, { label: "Blog", href: "#f-blog" }] },
                  { title: "Legal", links: [{ label: "Privacy", href: "#f-privacy" }, { label: "Terms", href: "#f-terms" }] },
                ]}
              />
            </div>
          </Stage>
        </Demo>
      </Section>

      {/* Buttons */}
      <Section id="buttons" title="Buttons & Actions">
        <Demo
          title="Variants"
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
        <Demo title="Sizes & states">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Demo>
        <Demo title="Icon button & shiny">
          <IconButton icon={<Heart className="w-4 h-4" />} label="Like" />
          <IconButton icon={<Settings className="w-4 h-4" />} label="Settings" />
          <ShinyButton>Shiny</ShinyButton>
        </Demo>
      </Section>

      {/* Forms */}
      <Section id="forms" title="Form Controls">
        <Demo title="Input & textarea">
          <div className="w-full max-w-sm space-y-3">
            <div>
              <Label>Email</Label>
              <Input placeholder="you@example.com" icon={<Search className="w-4 h-4" />} />
            </div>
            <Textarea placeholder="Write something…" rows={3} />
          </div>
        </Demo>
        <Demo title="Checkbox & switch">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            Subscribe
          </label>
          <Switch checked={sw} onCheckedChange={setSw} />
          <Switch checked={!sw} onCheckedChange={(v) => setSw(!v)} variant="success" />
        </Demo>
        <Demo title="Segmented select">
          <SegmentedSelect
            value={seg}
            onChange={setSeg}
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          />
        </Demo>
        <Demo title="Custom select & combobox">
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
          title="Radix select"
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
              <SelectValue placeholder="Pick a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Provider A</SelectItem>
              <SelectItem value="b">Provider B</SelectItem>
              <SelectItem value="c">Provider C</SelectItem>
            </SelectContent>
          </Select>
        </Demo>
        <Demo title="Slider">
          <div className="w-72">
            <Slider value={slider} onValueChange={setSlider} max={100} step={1} />
            <p className="text-caption mt-2">Value: {slider[0]}</p>
          </div>
        </Demo>
        <Demo title="Capability selector (AI)" description="Multi-select capability chips for AI models.">
          <div className="w-full max-w-md">
            <CapabilitySelector selected={caps} onChange={setCaps} columns={3} />
            <p className="text-caption mt-2">Selected: {caps.join(", ") || "none"}</p>
          </div>
        </Demo>
        <Demo title="Provider select — real provider icons (AI)" description="CustomSelect with the bundled Yunxin provider-icon system; Combobox above also uses it.">
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
      <Section id="overlays" title="Overlays">
        <Demo
          title="Dialog (Radix)"
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
              <Button variant="primary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm change</DialogTitle>
                <DialogDescription>This is a Radix-backed dialog styled by YunUI.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Demo>
        <Demo title="Modal & Sheet (custom)">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open sheet</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="A YunUI modal" subtitle="Portal + scroll lock + escape">
            <p className="text-body">Body content goes here.</p>
          </Modal>
          <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Side sheet">
            <p className="text-body p-1">Slide-in drawer content.</p>
          </Sheet>
        </Demo>
        <Demo title="Popover, tooltip, dropdown">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-56">
              <p className="text-caption">Floating popover content.</p>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Helpful hint</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem><Plus className="w-4 h-4 mr-2" />New</DropdownMenuItem>
              <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>
        <Demo title="Dropdown — checkbox & radio items" description="DropdownMenuCheckboxItem (toggles) and DropdownMenuRadioGroup / DropdownMenuRadioItem (single choice).">
          <DropdownChoicesDemo />
        </Demo>
        <Demo title="Confirm modals" description="ConfirmModal plus the DeleteConfirmModal / RegenerateConfirmModal presets — portal-rendered with scroll lock and escape-to-close.">
          <ConfirmModalsDemo />
        </Demo>
      </Section>

      {/* Data display */}
      <Section id="data-display" title="Data Display">
        <Demo
          title="Cards & badges"
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
              <span className="font-medium">Pro plan</span>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-caption">Everything in Basic, plus higher limits.</p>
          </Card>
          <div className="flex flex-col gap-2">
            <Badge>Default</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </Demo>
        <Demo title="Avatar & progress">
          <Avatar>
            <AvatarImage src="https://github.com/yuhuanowo.png" alt="avatar" />
            <AvatarFallback>YX</AvatarFallback>
          </Avatar>
          <div className="w-60"><Progress value={66} /></div>
        </Demo>
        <Demo title="Animated number" description="Springs from 0 on mount — re-enter the section to replay.">
          <div className="flex flex-wrap gap-8">
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">Requests</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={48213} /></div>
            </div>
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">Uptime</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={99.98} suffix="%" decimals={2} /></div>
            </div>
            <div className="stat-card p-4 w-40">
              <div className="text-label mb-1">Latency</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={142} suffix="ms" /></div>
            </div>
          </div>
        </Demo>
        <Demo title="Tabs">
          <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
              <TabsTrigger value="spam">Spam</TabsTrigger>
            </TabsList>
            <TabsContent value="inbox"><p className="text-body">Inbox content.</p></TabsContent>
            <TabsContent value="archive"><p className="text-body">Archived items.</p></TabsContent>
            <TabsContent value="spam"><p className="text-body">No spam 🎉</p></TabsContent>
          </Tabs>
        </Demo>
        <Demo title="Collapsible">
          <Collapsible className="w-full max-w-md">
            <CollapsibleTrigger asChild>
              <Button variant="outline">Toggle details</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 p-4 rounded-xl border border-border text-caption">Hidden details revealed.</div>
            </CollapsibleContent>
          </Collapsible>
        </Demo>
        <Demo title="Bento grid">
          <BentoGrid className="w-full">
            <BentoCard icon={<Zap className="w-5 h-5" />} title="Fast" description="Sub-second interactions." />
            <BentoCard icon={<Rocket className="w-5 h-5" />} title="Scalable" description="From prototype to prod." />
            <BentoCard icon={<Star className="w-5 h-5" />} title="Polished" description="Designed down to the detail." />
          </BentoGrid>
        </Demo>
        <Demo title="Marquee">
          <Marquee className="w-full [--duration:18s]">
            {["OpenAI", "Anthropic", "DeepSeek", "Mistral", "Google"].map((n) => (
              <span key={n} className="mx-6 text-muted-foreground font-medium">{n}</span>
            ))}
          </Marquee>
        </Demo>
      </Section>

      {/* Feedback */}
      <Section id="feedback" title="Feedback">
        <Demo title="Skeleton & spinner">
          <div className="space-y-2 w-60">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Demo>
        <Demo title="Empty state">
          <EmptyState icon={<Inbox className="w-8 h-8" />} title="No messages" description="When you get messages they'll show up here." action={<Button variant="primary" size="sm">Refresh</Button>} />
        </Demo>
        <Demo title="Page loader" description="Full-screen centered loader for route transitions — framed here in a fixed-height stage.">
          <div className="w-full h-40 rounded-2xl border border-border overflow-hidden">
            <PageLoader title="Loading workspace" subtitle="Fetching your models and keys…" />
          </div>
        </Demo>
        <Demo title="Page states" description="PageLoadingState · PageErrorState · PageEmptyState — the in-content (not full-screen) variants.">
          <div className="grid sm:grid-cols-3 gap-3 w-full">
            <div className="rounded-xl border border-border"><PageLoadingState message="Loading…" /></div>
            <div className="rounded-xl border border-border"><PageErrorState message="Couldn't load models." onRetry={() => toast.info("Retrying…")} /></div>
            <div className="rounded-xl border border-border"><PageEmptyState icon={Inbox} title="No models yet" description="Add a provider to get started." action={<Button size="sm" variant="primary">Add</Button>} /></div>
          </div>
        </Demo>
        <Demo title="Media states" description="MediaLoadingState · MediaErrorState · MediaEmptyState — used across the media generation pages.">
          <div className="grid sm:grid-cols-3 gap-3 w-full">
            <div className="rounded-xl border border-border"><MediaLoadingState message="Generating…" /></div>
            <div className="rounded-xl border border-border"><MediaErrorState message="Generation failed — try again." onRetry={() => toast.info("Retrying…")} /></div>
            <div className="rounded-xl border border-border"><MediaEmptyState icon={ImageIcon} title="No images yet" description="Your generated images will appear here." action={<Button size="sm" variant="primary">Generate</Button>} /></div>
          </div>
        </Demo>
        <Demo title="Thinking block (AI)">
          <div className="w-full max-w-lg">
            <ThinkingBlock content={"Let me reason about this step by step…\n1. Parse the request\n2. Plan the answer"} isStreaming defaultOpen />
          </div>
        </Demo>
        <Demo title="Toast (sonner)" description="Themed toast helpers — success / error / info / warning.">
          <Button variant="primary" size="sm" onClick={() => toast.success("Saved!", "Your changes are live.")}>Success</Button>
          <Button variant="red" size="sm" onClick={() => toast.error("Failed", "Something went wrong.")}>Error</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Heads up", "A new model is available.")}>Info</Button>
          <Button variant="amber" size="sm" onClick={() => toast.warning("Careful", "This action is irreversible.")}>Warning</Button>
        </Demo>
      </Section>

      {/* Navigation */}
      <Section id="navigation" title="Navigation">
        <Demo title="Nav tabs">
          <NavTabs
            activeKey={tab}
            onChange={setTab}
            tabs={[
              { key: "inbox", label: "Inbox" },
              { key: "archive", label: "Archive" },
              { key: "spam", label: "Spam" },
            ]}
          />
        </Demo>
        <Demo title="Language switcher (AI)">
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
      <Section id="patterns" title="Patterns">
        <Demo title="Media page header" description="Title + sync button + error/stats — used across the media generation pages.">
          <div className="w-full max-w-2xl">
            <MediaPageHeader
              title="Images"
              description="Generate and manage your images."
              isSyncing={false}
              syncError={null}
              onSync={() => toast.info("Syncing…")}
              stats={[
                { label: "images", value: 128 },
                { label: "this month", value: 42 },
              ]}
            />
          </div>
        </Demo>
        <Demo title="Model card" description="AI model card — icon is a slot, all fields are props (no API/schema coupling).">
          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <ModelCard
              name="Claude Opus 4.8"
              icon={<ModelIcon provider="anthropic" developer="claude" size={40} rounded />}
              ids={["claude-opus-4-8", "opus-latest"]}
              description="Most capable model for complex reasoning and agentic work."
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
              description="Open reasoning model with strong math and code."
              capabilities={["thinking", "streaming"]}
              developer={{ label: "DeepSeek", iconUrl: getIconPath("deepseek") ?? undefined }}
              context="64K"
              price="$0.55/M"
              nonofficial
            />
          </div>
        </Demo>
        <Demo title="AI avatars & type icons" description="ProviderAvatar / ModelAvatar (rounded, image-backed), ProviderIconImg (short alias) and ModelTypeIcon (capability glyphs).">
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
        <Demo title="Fumadocs button variants" description="buttonVariants — a class-variance-authority recipe for fumadocs-themed buttons; applied to plain elements via className.">
          <button className={buttonVariants({ variant: "primary" })}>Primary</button>
          <button className={buttonVariants({ variant: "secondary" })}>Secondary</button>
          <button className={buttonVariants({ variant: "outline" })}>Outline</button>
          <button className={buttonVariants({ variant: "ghost" })}>Ghost</button>
          <button className={buttonVariants({ color: "primary", size: "sm" })}>Small</button>
          <button className={buttonVariants({ variant: "outline", size: "icon" })} aria-label="Docs"><FileText className="size-5" /></button>
        </Demo>
        <Demo title="Code block">
          <div className="w-full max-w-2xl">
            <CodeBlock
              language="bash"
              code={'curl https://api.yunxin.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $KEY"'}
            />
          </div>
        </Demo>
        <Demo title="FAQ">
          <div className="w-full">
            <FAQ
              items={[
                { question: "What is YunUI?", answer: "A shared design system extracted from Yunxin." },
                { question: "How do projects sync?", answer: "Bump the yunui version; the design follows." },
                { question: "Does it support theming?", answer: "Yes — light, zinc-dark and true-black." },
              ]}
            />
          </div>
        </Demo>
        <Demo title="Blog card">
          <div className="w-80">
            <BlogCard
              title="Introducing YunUI"
              description="One design system, every project in sync."
              category="Engineering"
              date="2026-06-21"
              readingTime={4}
              author={{ name: "yuhuan" }}
              url="#"
            />
          </div>
        </Demo>
        <Demo title="Blog post header" description="Full article header — category, title, author, date and reading time.">
          <div className="w-full max-w-2xl">
            <BlogPostHeader
              title="Building a shared design system"
              description="How we extracted Yunxin's UI into a versioned package every project can sync to."
              category="Engineering"
              date="2026-06-21"
              readingTime={6}
              author={{ name: "yuhuan", url: "#" }}
              tags={["design-system", "react", "monorepo"]}
            />
          </div>
        </Demo>
        <Demo title="Category filter & pagination" description="CategoryFilter + BlogPagination — both controlled; the host owns routing.">
          <BlogControlsDemo />
        </Demo>
        <Demo title="Code demo (tabbed)" description="CodeDemo — a tabbed CodeBlock preset with Python / Node.js / cURL quick-start snippets.">
          <div className="w-full">
            <CodeDemo />
          </div>
        </Demo>
        <Demo title="Docs page actions" description="LLMCopyButton (copy page as Markdown for an LLM) and ViewOptions (raw Markdown / GitHub links) — the fumadocs-styled doc header actions.">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-1">
            <LLMCopyButton markdownUrl="/docs/overview.md" />
            <ViewOptions markdownUrl="/docs/overview.md" githubUrl="https://github.com/yuhuanowo/YunUI" />
          </div>
        </Demo>
        <Demo title="Account locked card" description="Terminal auth screen (banned / suspended) — presentational; the host owns logout/redirect via onBack.">
          <AccountLockedDemo />
        </Demo>
        <Demo title="Fellows banner">
          <div className="w-full max-w-xl">
            <FellowsBanner
              title="Join the Fellows program"
              description="Selective access for builders and researchers."
              ctaText="Apply"
              features={["Pro-level limits", "Priority support", "Early features"]}
              href="#"
            />
          </div>
        </Demo>
        <Demo title="Error boundary (catches a crashing child)">
          <div className="w-full max-w-md">
            <ErrorBoundaryDemo />
          </div>
        </Demo>
        <Demo title="Background effects (decorative)">
          <div className="relative w-full h-40 rounded-2xl border border-border overflow-hidden">
            <BackgroundEffects />
            <div className="relative z-10 h-full flex items-center justify-center text-muted-foreground">Animated backdrop</div>
          </div>
        </Demo>
      </Section>

      <footer className="py-10 text-center text-caption border-t border-border">
        YunUI · edit once, sync everywhere
      </footer>
    </>
  );
}
