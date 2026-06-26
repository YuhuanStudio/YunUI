"use client";

import { useState, useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  IconButton,
  ShinyButton,
  Input,
  Textarea,
  SearchInput,
  PasswordInput,
  NumberInput,
  Kbd,
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Separator,
  Alert,
  Tag,
  StatusIndicator,
  InlineCode,
  Steps,
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
  ModelManagerCard,
  ModelSelect,
  type ModelSelectOption,
  CapabilitySelector,
  CapabilityIcon,
  ProviderIcon,
  ProviderAvatar,
  ModelIcon,
  ModelAvatar,
  ModelTypeIcon,
  ProviderIconImg,
  PROVIDER_ICON_SLUGS,
  getProviderName,
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
  SimplePagination,
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
  NotificationDemo,
  BannerDemo,
  InlineStatusDemo,
  FeatureLockedStateDemo,
  SessionItemDemo,
  MetricBarDemo,
} from "@/components/docs/demos";
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
  Power,
  Pencil,
  Server,
  Cpu,
  CheckCircle2,
  Globe,
  RefreshCw,
  Eye,
  Brain,
  Waves,
  Code,
  AlertTriangle,
  Crown,
  PauseCircle,
  CheckCircle,
  Clock,
  Square,
  FileCode,
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

// Self-contained checkbox so the showcase model cards actually toggle.
function MmcSelect({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
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
  // Show the fallback that `<ErrorBoundary>` renders when a child throws. We
  // render it directly instead of throwing a real error, so Next's dev error
  // overlay doesn't take over the page — the real ErrorBoundary still catches
  // genuine render crashes in your app.
  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3 text-center">
      <Alert variant="error" title={t("caughtTitle")} className="text-left">
        {t("caughtMessage")}
      </Alert>
      <Button variant="secondary" size="sm" onClick={() => setBoom(false)}>
        <RefreshCw size={14} />
        {t("retry")}
      </Button>
    </div>
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
  // Drive the demo with `isOpen` (not `collapsed`) so the sidebar is visible at
  // ALL widths — `collapsed`/`lg:translate-x-0` left it hidden on mobile (the
  // stage showed an empty box). The toggle slides it in/out either way.
  const [open, setOpen] = useState(true);
  return (
    <Stage height={360}>
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#"
        sections={sections}
        currentPath="#overview"
        isOpen={open}
        onClose={() => setOpen(false)}
        onNavigate={() => {}}
      />
      {/* Re-open affordance (lives in the app header normally) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`absolute top-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-all ${open ? "left-[17rem]" : "left-3"}`}
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
      {/* SimplePagination — cursor / has-more lists with no known total */}
      <SimplePagination
        currentPage={page}
        hasNext={page < 12}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
      <p className="text-caption text-center">{t("page")} {page} · {t("category")}: {category ?? t("all")}</p>
    </div>
  );
}

function SearchInputDemo() {
  const [q, setQ] = useState("gpt-4o");
  const [q2, setQ2] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <SearchInput value={q} onChange={setQ} placeholder="Search models…" />
      <SearchInput size="sm" value={q2} onChange={setQ2} placeholder="Compact (size=sm)…" />
    </div>
  );
}

function NewInputsDemo() {
  const [qty, setQty] = useState(8);
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div>
        <Label>Password</Label>
        <PasswordInput placeholder="••••••••" />
      </div>
      <div>
        <Label>Quantity</Label>
        <NumberInput value={qty} onChange={setQty} min={0} max={20} />
      </div>
      <p className="text-sm text-muted-foreground">
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open search.
      </p>
    </div>
  );
}

function ProviderCardGridDemo() {
  const CardBadge = ({ children, color }: { children: ReactNode; color: string }) => (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${color}`}>{children}</span>
  );
  const Card = ({
    provider, name, latency, latencyClass, models, badges,
  }: { provider: string; name: string; latency: string; latencyClass: string; models: number; badges: ReactNode }) => (
    <div className="card card-col p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <ProviderIcon provider={provider} size={40} rounded />
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={12} />Healthy</span>
              <span className={`flex items-center gap-1 ${latencyClass}`}><Zap size={11} />{latency}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          <Activity size={16} />
          <Pencil size={16} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{badges}</div>
      <div className="card-footer flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{models} models</span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 bg-green-500/10">
          <Power size={14} />Enabled
        </span>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
      <Card
        provider="anthropic" name="Claude Code" latency="50ms" latencyClass="text-green-500" models={10}
        badges={
          <>
            <CardBadge color="bg-blue-500/10 text-blue-600 dark:text-blue-400"><Server size={12} />Local Provider</CardBadge>
            <CardBadge color="bg-slate-500/10 text-slate-600 dark:text-slate-400"><Cpu size={12} />Built-in adapter</CardBadge>
          </>
        }
      />
      <Card
        provider="cloudflare" name="Cloudflare Worker" latency="1588ms" latencyClass="text-red-500" models={95}
        badges={
          <>
            <CardBadge color="bg-green-500/10 text-green-600 dark:text-green-400"><KeyRound size={12} />Key Configured</CardBadge>
            <CardBadge color="bg-muted text-muted-foreground max-w-44"><Globe size={12} /><span className="truncate">https://api.cloudflare.com/…</span></CardBadge>
            <CardBadge color="bg-slate-500/10 text-slate-600 dark:text-slate-400"><Cpu size={12} />Built-in adapter</CardBadge>
          </>
        }
      />
    </div>
  );
}

// Well-known brands lead the icon displays (a plain A–Z sort would bury OpenAI
// under "ace"/"adobe"). Featured first in this order, then everything else A–Z.
const FEATURED_BRANDS = [
  "openai", "anthropic", "claude", "claudecode", "google", "gemini", "gemma",
  "deepseek", "meta", "llama", "mistral", "qwen", "grok", "xai", "groq", "ollama",
  "perplexity", "cohere", "microsoft", "azure", "aws", "bedrock", "huggingface",
  "nvidia", "cloudflare", "openrouter", "together", "fireworks", "replicate",
  "stability", "midjourney", "zhipu", "moonshot", "minimax", "baidu", "alibaba",
  "alibabacloud", "bytedance", "tencent", "github", "vercel", "google cloud",
  "googlecloud", "deepmind", "x", "doubao", "yi", "siliconcloud", "modelscope",
  "opencode", "zai",
];
function brandsFeaturedFirst(slugs: string[]): string[] {
  const rank = new Map(FEATURED_BRANDS.map((s, i) => [s, i]));
  return [...slugs].sort((a, b) => {
    const ra = rank.has(a) ? rank.get(a)! : Infinity;
    const rb = rank.has(b) ? rank.get(b)! : Infinity;
    return ra !== rb ? ra - rb : a.localeCompare(b);
  });
}

// Dogfoods the generic ModelSelect: maps a small mock catalog to ModelSelectOption
// (icon/badges/meta supplied by the consumer), with controlled pinning + a couple
// of capability filters. Mirrors how an app would adapt its own model type.
type DemoCap = "streaming" | "vision" | "thinking" | "functions";
type DemoModel = {
  id: string; name: string; provider: string; providerLabel: string;
  caps: DemoCap[]; context: string; maxOut?: string; aliases?: string[];
  price?: { in: number; out: number }; tier?: "pro"; deprecated?: boolean;
};
const DEMO_MODELS: DemoModel[] = [
  { id: "claude-opus-4-8", name: "Claude Opus 4.8", provider: "anthropic", providerLabel: "Anthropic", caps: ["streaming", "vision", "thinking", "functions"], context: "200K", maxOut: "64K", aliases: ["opus-latest"], price: { in: 15, out: 75 }, tier: "pro" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "anthropic", providerLabel: "Anthropic", caps: ["streaming", "vision", "functions"], context: "200K", maxOut: "64K", price: { in: 3, out: 15 } },
  { id: "gpt-5", name: "GPT-5", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision", "thinking", "functions"], context: "256K", maxOut: "100K", price: { in: 10, out: 30 }, tier: "pro" },
  { id: "gpt-5-mini", name: "GPT-5 mini", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision", "functions"], context: "128K", maxOut: "64K", price: { in: 0.25, out: 2 } },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision"], context: "128K", price: { in: 2.5, out: 10 }, deprecated: true },
  { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", provider: "google", providerLabel: "Google", caps: ["streaming", "vision", "thinking", "functions"], context: "1M", maxOut: "64K", price: { in: 1.25, out: 10 } },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "deepseek", providerLabel: "DeepSeek", caps: ["streaming", "thinking"], context: "64K", maxOut: "8K", price: { in: 0.55, out: 2.19 } },
];

function ModelSelectDemo() {
  const [value, setValue] = useState("claude-opus-4-8");
  const [pinned, setPinned] = useState<string[]>(["gpt-5"]);
  const [showPricing, setShowPricing] = useState(false);
  const options: ModelSelectOption[] = DEMO_MODELS.map((m) => ({
    id: m.id,
    label: m.name,
    group: m.provider,
    groupLabel: m.providerLabel,
    searchText: `${m.id} ${(m.aliases ?? []).join(" ")}`,
    icon: <ModelIcon provider={m.provider} developer={m.provider} size={24} rounded className="shrink-0" />,
    groupIcon: <ProviderIcon provider={m.provider} size={16} rounded />,
    badges: (
      <>
        {/* Capability glyphs come from YunUI's shared capability config, so the
            showcase and Yunxin can't drift on icon/color. */}
        {m.caps.includes("streaming") && <CapabilityIcon capability="streaming" />}
        {m.caps.includes("vision") && <CapabilityIcon capability="vision" />}
        {m.caps.includes("thinking") && <CapabilityIcon capability="thinking" />}
        {m.caps.includes("functions") && <CapabilityIcon capability="function_calling" />}
        {m.deprecated && <span title="Deprecated"><AlertTriangle size={14} className="text-orange-500 shrink-0" /></span>}
        {m.tier === "pro" && <span title="Pro tier"><Crown size={14} className="text-amber-500 shrink-0" /></span>}
      </>
    ),
    detail: (
      <>
        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
          <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">{m.id}</span>
          {(m.aliases ?? []).map((a) => (
            <span key={a} className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[11px] text-muted-foreground/70">{a}</span>
          ))}
        </div>
        {/* Specs line: context window first, then pricing when toggled on. */}
        <div className="text-[10px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2">
          <span className="bg-muted px-1.5 py-0.5 rounded-sm font-medium" title="Context window">{m.context}</span>
          {showPricing && m.price && (
            <>
              <span>In: ${m.price.in}/M</span>
              <span>Out: ${m.price.out}/M</span>
            </>
          )}
        </div>
      </>
    ),
  }));
  const has = (id: string, cap: DemoCap) => DEMO_MODELS.find((m) => m.id === id)?.caps.includes(cap) ?? false;
  return (
    <div className="w-full max-w-md space-y-3">
      <ModelSelect
        options={options}
        value={value}
        onChange={setValue}
        pinned={pinned}
        onTogglePin={(id) => setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
        filters={[
          { key: "streaming", title: "Streaming", node: <CapabilityIcon capability="streaming" />, match: (o) => has(o.id, "streaming") },
          { key: "vision", title: "Vision", node: <CapabilityIcon capability="vision" />, match: (o) => has(o.id, "vision") },
          { key: "thinking", title: "Thinking", node: <CapabilityIcon capability="thinking" />, match: (o) => has(o.id, "thinking") },
          { key: "functions", title: "Function calling", node: <CapabilityIcon capability="function_calling" />, match: (o) => has(o.id, "functions") },
        ]}
        renderFooter={(count) => <span>{count} models</span>}
      />
      <div className="flex items-center gap-2 text-caption">
        <Checkbox checked={showPricing} onCheckedChange={(v) => setShowPricing(v === true)} aria-label="Show pricing in rows" />
        <span className="cursor-pointer select-none" onClick={() => setShowPricing((p) => !p)}>Show pricing in rows</span>
      </div>
    </div>
  );
}

// A searchable gallery of every bundled brand icon, mapped straight from the
// exported PROVIDER_ICON_SLUGS set — so the showcase always reflects the full set.
function IconGalleryDemo() {
  const [q, setQ] = useState("");
  const all = useMemo(() => brandsFeaturedFirst([...PROVIDER_ICON_SLUGS]), []);
  const shown = q.trim() ? all.filter((s) => s.includes(q.trim().toLowerCase())) : all;
  return (
    <div className="w-full">
      <div className="mb-4 max-w-xs">
        <SearchInput value={q} onChange={setQ} placeholder={`Filter ${all.length} icons…`} />
      </div>
      {/* Inline gridTemplateColumns (not a Tailwind arbitrary grid-cols-[…]
          class) — Safari mis-parsed the escaped repeat()/minmax() class and
          collapsed the grid to a single centered column. */}
      <div className="grid gap-3 max-h-96 overflow-y-auto pr-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(74px, 1fr))" }}>
        {shown.map((slug) => (
          <div key={slug} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-(--bg-hover) transition-colors">
            {/* Subtle inset ring so dark brand tiles (openai/github) keep a visible
                edge against a dark background instead of blending in. */}
            <div className="rounded-lg ring-1 ring-inset ring-foreground/10">
              <ProviderAvatar provider={slug} size={40} />
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-full" title={slug}>{slug}</span>
          </div>
        ))}
        {shown.length === 0 && <p className="text-sm text-muted-foreground col-span-full py-6 text-center">No icon matches “{q}”.</p>}
      </div>
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
          <CapabilityBadge capability="function_calling" />
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
        {/* compact value-first tiles (the StatCard `compact` variant) — the dense
            admin-grid style with semantic tones. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard valueFirst compact label={t("demos.dashboard.statBalance")} value="1,284" />
          <StatCard valueFirst compact tone="emerald" label={t("demos.dashboard.statRequests")} value="952" />
          <StatCard valueFirst compact tone="amber" label={t("demos.dashboard.statApiKeys")} value="18" />
          <StatCard valueFirst compact tone="red" label={t("demos.dashboard.statSpend")} value="3" />
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
          {/* Footer isn't position:fixed, so it doesn't need a fixed-height Stage —
              render it full-width and let it size to content (a fixed Stage clipped
              the brand block on mobile, where the footer is taller). */}
          <div className="w-full">
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
        </Demo>
      </Section>

      {/* Buttons */}
      <Section id="buttons" title={t("buttons.title")}>
        <Demo
          title={t("demos.buttonVariants.title")}
          code={`import { Button } from "@yuhuanowo/yunui";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="accent">Accent</Button>
<Button variant="amber">Amber</Button>
<Button variant="red">Red</Button>`}
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
            <SearchInputDemo />
          </div>
        </Demo>
        <Demo title="Password, number & keys">
          <NewInputsDemo />
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
                { value: "gpt", label: "GPT-4o", icon: <ModelIcon provider="openai" size={18} rounded /> },
                { value: "claude", label: "Claude Opus", icon: <ModelIcon provider="anthropic" developer="claude" size={18} rounded /> },
                { value: "deepseek", label: "DeepSeek R1", icon: <ModelIcon provider="deepseek" developer="deepseek" size={18} rounded /> },
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
          code={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, ProviderIcon } from "@yuhuanowo/yunui";

<Select>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Pick a provider" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="openai">
      <span className="flex items-center gap-2"><ProviderIcon provider="openai" size={16} rounded />OpenAI</span>
    </SelectItem>
    <SelectItem value="anthropic">
      <span className="flex items-center gap-2"><ProviderIcon provider="anthropic" size={16} rounded />Anthropic</span>
    </SelectItem>
    <SelectItem value="google">
      <span className="flex items-center gap-2"><ProviderIcon provider="google" size={16} rounded />Google</span>
    </SelectItem>
  </SelectContent>
</Select>`}
        >
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder={t("demos.radixSelect.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {["openai", "anthropic", "google"].map((p) => (
                <SelectItem key={p} value={p}>
                  <span className="flex items-center gap-2"><ProviderIcon provider={p} size={16} rounded />{getProviderName(p)}</span>
                </SelectItem>
              ))}
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
              // Label by the icon slug itself — getProviderName collapses many
              // distinct brands to one name (aws/azure/bedrock/github → "GitHub
              // Models"), which produced duplicate-looking rows. The slug is the
              // unique id you'd pass to ProviderIcon.
              options={brandsFeaturedFirst([...PROVIDER_ICON_SLUGS]).map((p) => ({
                value: p,
                label: p,
                icon: <ProviderIcon provider={p} size={18} rounded />,
              }))}
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
          code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "@yuhuanowo/yunui";

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
          code={`import { Card, Badge } from "@yuhuanowo/yunui";

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
        <Demo title="Table" description="The Table primitive carrying a dense, many-column admin model row (icons, id chips, badge groups, multi-line price, row actions). Scrolls horizontally when the columns outgrow the viewport.">
          <Table containerClassName="rounded-xl border border-border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"><Square size={18} className="text-muted-foreground" /></TableHead>
                <TableHead>名稱</TableHead>
                <TableHead>供應商</TableHead>
                <TableHead>開發者</TableHead>
                <TableHead>類型</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>上下文 / 解析度</TableHead>
                <TableHead>最大輸出 TOKEN</TableHead>
                <TableHead>價格（輸入/輸出）</TableHead>
                <TableHead>能力</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "Claude Opus (Agent)", dev: "anthropic", devName: "Anthropic", prov: "claude", provName: "Claude Code", ids: ["claude/opus-agent"], type: "chat" as const, typeLabel: "Chat", ctx: "200.00K", maxOut: "128.00K", price: "5.00K / 25.00K", caps: ["chat", "function_calling", "streaming", "thinking"] },
                { name: "GPT-5.1", dev: "openai", devName: "OpenAI", prov: "openai", provName: "OpenAI", ids: ["openai/gpt-5.1", "gpt-5.1-latest"], type: "chat" as const, typeLabel: "Chat", ctx: "400.00K", maxOut: "128.00K", price: "1.25K / 10.00K", caps: ["chat", "vision", "function_calling", "streaming"] },
              ].map((r) => (
                <TableRow key={r.name} className="group">
                  <TableCell>
                    <button className="p-1 hover:bg-muted rounded-sm transition-colors"><Square size={18} className="text-muted-foreground" /></button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0"><ModelIcon developer={r.dev} provider={r.prov} size={40} rounded /></div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="font-medium">{r.name}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {r.ids.map((id) => <IDBadge key={id} text={id} />)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProviderIconImg provider={r.prov} size={18} />
                      <span className="text-sm text-muted-foreground">{r.provName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ProviderIcon provider={r.dev} size={18} rounded />
                      <span className="text-sm">{r.devName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2"><ModelTypeIcon type={r.type} size={16} /><span className="text-sm capitalize">{r.typeLabel}</span></div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle size={12} />Approved</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground"><span className="text-sm">{r.ctx}</span></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground"><span className="text-sm">{r.maxOut}</span></TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm"><div className="font-mono text-muted-foreground">{r.price}</div></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">{r.caps.map((c) => <CapabilityBadge key={c} capability={c} />)}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="編輯"><Pencil size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="停用"><Power size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="標記棄用"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="暫停"><PauseCircle size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" title="刪除"><Trash2 size={14} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>
        <Demo title="Model manager card" description="A dense admin model row as a card — EVERY column present (name + ids, provider, developer, type, status, context / resolution, max output, price in/out, capabilities, actions). Starting point for discussing the model-management layout.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Faithful to Yunxin admin/models/components/table-row.tsx — the real
                "Claude Opus (Agent)" row (provider Claude Code, developer Anthropic). */}
            <ModelManagerCard
              selectSlot={<MmcSelect />}
              icon={<ProviderIcon provider="anthropic" size={40} rounded />}
              name="Claude Opus (Agent)"
              ids={<>
                <IDBadge text="claude/opus-agent" />
                <IDBadge text="claude-opus-agent" />
              </>}
              actions={<>
                <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="編輯"><Pencil size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="停用"><Power size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors" title="標記棄用"><Eye size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="暫停"><PauseCircle size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" title="刪除"><Trash2 size={15} /></button>
              </>}
              fields={[
                { label: "供應商 / Provider", value: <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ProviderIcon provider="claude" size={18} rounded />Claude Code</span> },
                { label: "開發者 / Developer", value: <span className="inline-flex items-center gap-2 text-sm"><ProviderIcon provider="anthropic" size={18} rounded />Anthropic</span> },
                { label: "類型 / Type", value: <span className="inline-flex items-center gap-2 text-sm"><ModelTypeIcon type="chat" size={16} />Chat</span> },
                { label: "狀態 / Status", value: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle size={12} />Approved</span> },
                { label: "上下文 / 解析度", value: <span className="text-sm text-muted-foreground">200.00K</span> },
                { label: "最大輸出 TOKEN", value: <span className="text-sm text-muted-foreground">128.00K</span> },
                { label: "價格（輸入/輸出）", value: <span className="font-mono text-sm text-muted-foreground">5.00K / 25.00K</span>, full: true },
              ]}
              capabilities={{ label: "能力 / Capabilities", value: ["chat", "function_calling", "streaming", "thinking"].map((c) => <CapabilityBadge key={c} capability={c} />) }}
            />
            {/* Image model + the name-badge modifiers (YAML / suspended) the real row supports */}
            <ModelManagerCard
              selectSlot={<MmcSelect defaultChecked />}
              icon={<ProviderIcon provider="flux" size={40} rounded />}
              name="FLUX.1 Kontext"
              nameBadges={<>
                <span className="badge flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"><FileCode size={10} />YAML</span>
                <span className="badge bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 flex items-center gap-1"><PauseCircle size={10} />Suspended</span>
              </>}
              ids={<IDBadge text="fal/flux-kontext" />}
              actions={<>
                <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="編輯"><Pencil size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="停用"><Power size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors" title="標記棄用"><Eye size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="暫停"><PauseCircle size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" title="刪除"><Trash2 size={15} /></button>
              </>}
              fields={[
                { label: "供應商 / Provider", value: <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ProviderIcon provider="fal" size={18} rounded />fal.ai</span> },
                { label: "開發者 / Developer", value: <span className="inline-flex items-center gap-2 text-sm"><ProviderIcon provider="flux" size={18} rounded />Black Forest</span> },
                { label: "類型 / Type", value: <span className="inline-flex items-center gap-2 text-sm"><ModelTypeIcon type="image_generation" size={16} />Image generation</span> },
                { label: "狀態 / Status", value: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400"><Clock size={12} />Pending</span> },
                { label: "上下文 / 解析度", value: <span className="text-sm text-muted-foreground">256–2048 × 256–2048</span> },
                { label: "最大輸出 TOKEN", value: <span className="text-sm text-muted-foreground">—</span> },
                { label: "價格（輸入/輸出）", value: <span className="font-mono text-sm text-muted-foreground">25.00 /req</span>, full: true },
              ]}
              capabilities={{ label: "能力 / Capabilities", value: ["image_edit", "negative_prompt", "seed_control", "lora"].map((c) => <CapabilityBadge key={c} capability={c} />) }}
            />
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
            <div className="stat-card p-4 min-w-40">
              <div className="text-label mb-1">{t("demos.animatedNumber.requests")}</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={48213} /></div>
            </div>
            <div className="stat-card p-4 min-w-40">
              <div className="text-label mb-1">{t("demos.animatedNumber.uptime")}</div>
              <div className="stat-number text-3xl font-semibold"><AnimatedNumber value={99.98} suffix="%" decimals={2} /></div>
            </div>
            <div className="stat-card p-4 min-w-40">
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
        <Demo title="Alert">
          <div className="w-full max-w-lg flex flex-col gap-2">
            <Alert variant="info" title="Heads up">Your trial ends in 3 days.</Alert>
            <Alert variant="success" title="Saved">Your changes have been saved.</Alert>
            <Alert variant="warning">Usage is approaching your monthly limit.</Alert>
            <Alert variant="error" title="Payment failed">Update your billing details to continue.</Alert>
          </div>
        </Demo>
        <Demo title="Tags, avatars & separator">
          <div className="w-full max-w-lg flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Tag>vision</Tag>
              <Tag>streaming</Tag>
              <Tag onRemove={() => {}}>function-calling</Tag>
            </div>
            <Separator />
            <AvatarGroup max={3}>
              <Avatar><AvatarFallback>YH</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>UI</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>ML</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>GP</AvatarFallback></Avatar>
            </AvatarGroup>
          </div>
        </Demo>
        <Demo title="Status, inline code & steps">
          <div className="w-full max-w-lg flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <StatusIndicator status="online">Online</StatusIndicator>
              <StatusIndicator status="busy">Busy</StatusIndicator>
              <StatusIndicator status="away">Away</StatusIndicator>
              <StatusIndicator status="offline">Offline</StatusIndicator>
            </div>
            <p className="text-sm">Install with <InlineCode>pnpm add @yuhuanowo/yunui</InlineCode></p>
            <Separator />
            <Steps
              current={1}
              steps={[
                { title: "Create account", description: "Sign up with email or OAuth." },
                { title: "Add an API key", description: "Generate a key in the dashboard." },
                { title: "Make a request", description: "Call the gateway from your app." },
              ]}
            />
          </div>
        </Demo>
        <Demo title="Provider card — footer alignment in a grid" description="A real provider-card layout: card-col + card-footer pin the model count + toggle to the bottom, so cards with different badge rows still line up across the grid.">
          <ProviderCardGridDemo />
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
        <Demo title="Model select" description="A generic, searchable model picker — provider grouping + capability filters + a pinned section. Domain-agnostic: map your models to options.">
          <ModelSelectDemo />
        </Demo>
        <Demo title="Full icon set" description={`Every bundled brand icon (${PROVIDER_ICON_SLUGS.size} brands, lobe avatar tiles). Resolved by id from /icons — search to filter.`}>
          <IconGalleryDemo />
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
        <Demo title="Banner" description="Tinted announcement / release / verification rows (info · warning · critical · success). Dismissible; icon, meta and actions are slots.">
          <BannerDemo />
        </Demo>
        <Demo title="Notification" description="Presentational notification center — a bell with an unread badge, the dropdown panel chrome, and rows with type icons, time and a hover dismiss. The host owns data.">
          <NotificationDemo />
        </Demo>
        <Demo title="Inline status" description="A compact async-job status: a (spinning) icon plus a label, or a percentage while running.">
          <InlineStatusDemo />
        </Demo>
        <Demo title="Session item" description="A row in an active-sessions / signed-in-devices list — device glyph, name with current/inactive badges, browser·OS, IP + last-seen, revoke.">
          <SessionItemDemo />
        </Demo>
        <Demo title="Metric bar" description="A labelled row with a thin proportion bar for 'top N' breakdowns — spend by provider, usage by category, storage by bucket.">
          <MetricBarDemo />
        </Demo>
        <Demo title="Feature locked state" description="The centered 'feature unavailable' screen — icon medallion, title, description and an optional dashed restricted-note card.">
          <FeatureLockedStateDemo />
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
