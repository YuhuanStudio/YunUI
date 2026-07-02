"use client";

/**
 * Client demo wrappers for doc pages.
 *
 * MDX pages render as Server Components, so any demo that (a) needs React state
 * or (b) passes a *function* prop to a client component (e.g. a controlled
 * `<Switch onCheckedChange>` or `<StatCard icon={Coins} />`) must live inside a
 * client boundary — a function prop can't cross the server→client boundary.
 * Keep such demos here; they're registered globally in `mdx-components.tsx`, so
 * every .mdx page can use `<SwitchDemo />` etc. without importing them.
 */
import { useState } from "react";
import {
  StatCard,
  AccountLockedCard,
  MediaPageHeader,
  MediaEmptyState,
  BlogPagination,
  SimplePagination,
  CategoryFilter,
  CapabilityBadge,
  Banner,
  FeatureLockedState,
  SessionItem,
  MetricBar,
  NotificationBell,
  NotificationItem,
  NotificationPanel,
  SettingRow,
  LinkRow,
  ConnectedAccountRow,
  AvatarUploader,
  Sidebar,
  type SidebarSection,
  PageLayout,
  AudioPlayer,
  MediaGallery,
  type MediaResult,
} from "yunui/patterns";
import { Switch, Checkbox, Pagination, NavTabs, Combobox, CustomSelect, SegmentedSelect, Modal, Sheet, ConfirmModal, toast, Button, InlineStatus, FileDropzone, AreaChart, SegmentedBar, Badge } from "yunui";
import { ChatMessage, ChatMessageList, ChatComposer, ChatHeader, GenerationStats } from "yunui/chat";
import {
  CapabilitySelector,
  LanguageSwitcher,
  ModelSelect,
  type ModelSelectOption,
  ModelManagerCard,
  CapabilityIcon,
  IDBadge,
  ModelIcon,
  ProviderIcon,
} from "yunui/ai";
import { MarkdownRenderer, ImageLightbox } from "yunui/content";
import { Coins, LayoutGrid, List, Table, ShieldAlert, Image as ImageIcon, PanelLeft, AlertTriangle, Crown, Pencil, Power, Trash2, CheckCircle, MessageSquare, CreditCard, Monitor, Smartphone, Code2, HelpCircle, FileText, Shield, Globe, UploadCloud, Maximize2, Bot, Paperclip, Copy, RefreshCw } from "lucide-react";

export function StatCardDemo() {
  return (
    <div className="w-56">
      <StatCard
        icon={Coins}
        label="Balance"
        value="$1,250"
        trend={{ value: 4.2, positive: true }}
      />
    </div>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [success, setSuccess] = useState(true);
  const [warning, setWarning] = useState(true);
  const [danger, setDanger] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch checked={on} onCheckedChange={setOn} />
        <Switch checked={on} onCheckedChange={setOn} size="md" />
        <Switch checked={false} onCheckedChange={() => {}} disabled />
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={success} onCheckedChange={setSuccess} variant="success" />
        <Switch checked={warning} onCheckedChange={setWarning} variant="warning" />
        <Switch checked={danger} onCheckedChange={setDanger} variant="danger" />
      </div>
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(3);
  return (
    <Pagination page={page} totalPages={10} onPageChange={setPage} />
  );
}

export function NavTabsDemo() {
  const [active, setActive] = useState("overview");
  return (
    <NavTabs
      activeKey={active}
      onChange={setActive}
      ariaLabel="Account sections"
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "analytics", label: "Analytics" },
        { key: "reports", label: "Reports" },
        { key: "settings", label: "Settings" },
      ]}
    />
  );
}

export function CheckboxDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={a} onCheckedChange={setA} id="cb-a" />
        Subscribe to updates
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={b} onCheckedChange={setB} id="cb-b" />
        Remember this device
      </label>
      <label className="flex items-center gap-2 text-sm opacity-60">
        <Checkbox checked={false} onCheckedChange={() => {}} disabled id="cb-c" />
        Disabled option
      </label>
    </div>
  );
}

export function ComboboxDemo() {
  const [value, setValue] = useState("next");
  return (
    <div className="w-full max-w-xs">
      <Combobox
        value={value}
        onChange={setValue}
        placeholder="Pick or type a framework…"
        options={[
          { value: "next", label: "Next.js", description: "React framework" },
          { value: "remix", label: "Remix", description: "Full-stack web" },
          { value: "astro", label: "Astro", description: "Content-first" },
          { value: "svelte", label: "SvelteKit", description: "Compiler-based" },
        ]}
      />
    </div>
  );
}

export function CustomSelectDemo() {
  const [value, setValue] = useState("medium");
  return (
    <div className="w-full max-w-xs">
      <CustomSelect
        value={value}
        onChange={setValue}
        searchable
        placeholder="Select a model size"
        options={[
          { value: "small", label: "Small", description: "Fast, lower cost" },
          { value: "medium", label: "Medium", description: "Balanced" },
          { value: "large", label: "Large", description: "Highest quality" },
          { value: "xl", label: "Extra Large", description: "Maximum capacity" },
        ]}
      />
    </div>
  );
}

export function SegmentedSelectDemo() {
  const [value, setValue] = useState("grid");
  return (
    <SegmentedSelect
      value={value}
      onChange={setValue}
      options={[
        { value: "grid", label: "Grid", icon: LayoutGrid },
        { value: "list", label: "List", icon: List },
        { value: "table", label: "Table", icon: Table },
      ]}
    />
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Invite your team"
        subtitle="They'll get an email with a join link."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send invites</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          Enter the email addresses of the people you want to invite.
        </p>
      </Modal>
    </>
  );
}

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav className="flex flex-col p-2">
          <a className="px-3 py-2 rounded-lg hover:bg-muted text-sm" href="#">Dashboard</a>
          <a className="px-3 py-2 rounded-lg hover:bg-muted text-sm" href="#">Projects</a>
          <a className="px-3 py-2 rounded-lg hover:bg-muted text-sm" href="#">Settings</a>
        </nav>
      </Sheet>
    </>
  );
}

export function ConfirmModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="red" onClick={() => setOpen(true)}>Delete project</Button>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        variant="danger"
        title="Delete project?"
        message="This permanently removes the project and all of its data. This action cannot be undone."
        confirmText="Delete"
      />
    </>
  );
}

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.success("Saved", "Your changes are live.")}>Success</Button>
      <Button variant="red" onClick={() => toast.error("Failed", "Could not reach the server.")}>Error</Button>
      <Button variant="outline" onClick={() => toast.info("Heads up", "A new version is available.")}>Info</Button>
      <Button variant="amber" onClick={() => toast.warning("Careful", "This will overwrite your draft.")}>Warning</Button>
    </div>
  );
}

export function StatCardVariantsDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
      <StatCard inline icon={Coins} label="Pending" value="12" tone="amber" />
      <StatCard valueFirst label="Approved" value="248" tone="emerald" />
      <StatCard label="Rejected" value="3" subtext="Last 24h" tone="red" />
    </div>
  );
}

export function SidebarDemo() {
  // Drive a single `collapsed` state and feed isOpen={!collapsed} so the sidebar
  // genuinely slides in/out at ALL widths: isOpen=true forces translate-x-0
  // (visible), and collapsed=true forces -translate-x-full (off-canvas). This
  // sidesteps the lg: breakpoint, which keys off the viewport — not this bounded
  // demo box — and previously left the desktop preview unable to collapse.
  const [collapsed, setCollapsed] = useState(false);
  const sections: SidebarSection[] = [
    {
      items: [
        { label: "Overview", href: "#overview" },
        { label: "Playground", href: "#playground" },
        { label: "Models", href: "#models" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "API Keys", href: "#api-keys" },
        { label: "Analytics", href: "#analytics" },
        { label: "Logs", href: "#logs" },
      ],
    },
  ];
  return (
    <div
      className="relative w-full rounded-2xl border border-border overflow-hidden bg-(--bg-base)"
      style={{ height: 360, transform: "translateZ(0)" }}
    >
      <Sidebar
        appName="YunUI"
        logoSrc="/favicon.ico"
        homeHref="#"
        sections={sections}
        currentPath="#overview"
        isOpen={!collapsed}
        collapsed={collapsed}
        onClose={() => setCollapsed(true)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNavigate={() => {}}
      />
      {/* Content area — offset by the sidebar width, and reflowing to full width
          when collapsed, so the toggle has a visible purpose (more room) instead
          of leaving an empty box. Inline margin (not an `lg:ml-*` utility): the lg
          breakpoint keys off the viewport, not this bounded demo box. */}
      <div
        className="h-full flex flex-col transition-[margin] duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? 0 : 256 }}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
          {/* Re-open button: lives in the header and slides in once collapsed (the
              in-sidebar collapse button went off-canvas with the panel). */}
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all overflow-hidden"
            style={{
              width: collapsed ? 36 : 0,
              opacity: collapsed ? 1 : 0,
              marginRight: collapsed ? 0 : -12,
              pointerEvents: collapsed ? "auto" : "none",
            }}
          >
            <PanelLeft size={16} className="shrink-0" />
          </button>
          <div className="h-3.5 w-36 rounded-md bg-muted" />
          <div className="ml-auto w-8 h-8 rounded-full bg-muted shrink-0" />
        </div>
        <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted/60 border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AccountLockedCardDemo() {
  return (
    <div className="w-full">
      <AccountLockedCard
        appName="YunUI"
        logoSrc="/yuhuanstudio-logo.png"
        icon={<ShieldAlert className="w-6 h-6 text-error" />}
        title="Account suspended"
        subtitle="Your account has been temporarily locked."
        appeal="If you think this is a mistake, contact support."
        backLabel="Back to sign in"
        onBack={() => {}}
        onMount={() => {}}
      />
    </div>
  );
}

export function MediaPageHeaderDemo() {
  return (
    <div className="w-full">
      <MediaPageHeader
        title="Media library"
        description="All your synced images and videos."
        isSyncing={false}
        syncError={null}
        onSync={() => {}}
        stats={[
          { label: "items", value: 128 },
          { label: "albums", value: 6 },
        ]}
      />
    </div>
  );
}

export function MediaEmptyStateDemo() {
  return (
    <div className="w-full">
      <MediaEmptyState
        icon={ImageIcon}
        title="No media yet"
        description="Sync a source to start filling your library."
      />
    </div>
  );
}

export function BlogPaginationDemo() {
  const [page, setPage] = useState(1);
  return <BlogPagination currentPage={page} totalPages={8} onPageChange={setPage} />;
}

const NOTIF_SEED = [
  { id: "1", icon: MessageSquare, tint: "bg-blue-500/10 text-blue-500", title: "New reply from Alex", body: "Thanks — that fixed it!", time: "2m", unread: true },
  { id: "2", icon: CreditCard, tint: "bg-emerald-500/10 text-emerald-500", title: "Payment received", body: "$20.00 added to your balance.", time: "1h", unread: true },
  { id: "3", icon: ShieldAlert, tint: "bg-amber-500/10 text-amber-500", title: "New sign-in", body: "Chrome on macOS · Taipei", time: "3h", unread: false },
];

export function SessionItemDemo() {
  const [sessions, setSessions] = useState([
    { id: 1, icon: Monitor, name: "MacBook Pro", detail: "Chrome on macOS", ip: "203.0.113.7", time: "Active now", current: true },
    { id: 2, icon: Smartphone, name: "iPhone 15", detail: "Safari on iOS", ip: "198.51.100.22", time: "3h ago" },
    { id: 3, icon: Monitor, name: "Windows PC", detail: "Edge on Windows", ip: "192.0.2.44", time: "2d ago", inactive: true },
  ]);
  return (
    <div className="w-full max-w-md space-y-2">
      {sessions.map((s) => {
        const Icon = s.icon;
        return (
          <SessionItem
            key={s.id}
            icon={<Icon size={16} />}
            name={s.name}
            detail={s.detail}
            ip={s.ip}
            time={s.time}
            current={s.current}
            currentLabel="Current"
            inactive={s.inactive}
            inactiveLabel="Inactive"
            revokeLabel="Revoke"
            onRevoke={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}
          />
        );
      })}
    </div>
  );
}

export function MetricBarDemo() {
  const rows = [
    { label: "OpenAI", value: "4,820 credits", percentage: 100, color: "#10a37f" },
    { label: "Anthropic", value: "3,140 credits", percentage: 65, color: "#d97757" },
    { label: "Google", value: "1,090 credits", percentage: 22, color: "#4285f4" },
    { label: "Mistral", value: "410 credits", percentage: 9, color: "#fa520f" },
  ];
  return (
    <div className="w-full max-w-md space-y-3">
      {rows.map((r) => (
        <MetricBar key={r.label} label={r.label} value={r.value} percentage={r.percentage} color={r.color} />
      ))}
    </div>
  );
}

export function InlineStatusDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm">
      <InlineStatus status="pending" label="Starting" />
      <InlineStatus status="processing" label="Processing" progress={62} />
      <InlineStatus status="completed" label="Done" />
      <InlineStatus status="failed" label="Failed" />
    </div>
  );
}

export function FeatureLockedStateDemo() {
  return (
    <div className="w-full">
      <FeatureLockedState
        title="Coming soon"
        description={<><strong className="whitespace-nowrap">Video generation</strong> isn't on your plan yet.</>}
        noteTitle="Access restricted"
        noteText="This feature is limited to higher tiers — contact your admin to enable it."
        className="min-h-0"
      />
    </div>
  );
}

export function BannerDemo() {
  const [shown, setShown] = useState(["info", "warning", "success", "critical"]);
  const seed: { tone: "info" | "warning" | "success" | "critical"; title: string; description: string; meta?: string }[] = [
    { tone: "info", title: "Scheduled maintenance", description: "Sunday 02:00–03:00 UTC.", meta: "2h ago" },
    { tone: "success", title: "v1.4.0 shipped", description: "Faster exports and a new dark theme.", meta: "1d ago" },
    { tone: "warning", title: "Verify your email", description: "Some features stay locked until you do." },
    { tone: "critical", title: "Payment failed", description: "Update your card to avoid interruption." },
  ];
  return (
    <div className="w-full max-w-2xl space-y-2">
      {seed.filter((b) => shown.includes(b.tone)).map((b) => (
        <Banner
          key={b.tone}
          tone={b.tone}
          title={b.title}
          description={b.description}
          meta={b.meta}
          actions={<a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity">View</a>}
          dismissible
          dismissLabel="Dismiss"
          onDismiss={() => setShown((p) => p.filter((x) => x !== b.tone))}
        />
      ))}
      {shown.length === 0 && (
        <button onClick={() => setShown(["info", "warning", "success", "critical"])} className="text-xs text-muted-foreground hover:text-foreground">Reset banners</button>
      )}
    </div>
  );
}

export function NotificationDemo() {
  const [items, setItems] = useState(NOTIF_SEED);
  const unread = items.filter((n) => n.unread).length;
  return (
    <div className="flex flex-col items-center gap-5">
      <NotificationBell count={unread} label="Notifications" />
      <NotificationPanel
        title="Notifications"
        unreadCount={unread}
        unreadLabel="unread"
        empty={items.length === 0}
        emptyLabel="You're all caught up"
        footer={<a href="#" onClick={(e) => e.preventDefault()}>View all</a>}
      >
        {items.map((n) => {
          const Icon = n.icon;
          return (
            <NotificationItem
              key={n.id}
              icon={<Icon size={14} />}
              iconClassName={n.tint}
              title={n.title}
              body={n.body}
              time={n.time}
              unread={n.unread}
              dismissible
              dismissLabel="Dismiss"
              onDismiss={() => setItems((prev) => prev.filter((x) => x.id !== n.id))}
            />
          );
        })}
      </NotificationPanel>
    </div>
  );
}

export function SettingRowDemo() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [digest, setDigest] = useState(true);
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card px-4">
      <SettingRow
        title="Email notifications"
        description="Receive a summary of account activity in your inbox."
        control={<Switch checked={email} onCheckedChange={setEmail} />}
      />
      <SettingRow
        title="Push notifications"
        description="Get notified on your devices the moment something happens."
        control={<Switch checked={push} onCheckedChange={setPush} />}
      />
      <SettingRow
        title="Weekly digest"
        control={<Switch checked={digest} onCheckedChange={setDigest} />}
      />
    </div>
  );
}

export function LinkRowDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <LinkRow icon={<HelpCircle size={18} />} title="Help center" description="Guides, FAQs and troubleshooting" href="#" external />
      <LinkRow icon={<FileText size={18} />} title="Documentation" description="API reference and integration guides" href="#" external />
      <LinkRow icon={<Shield size={18} />} title="Privacy policy" description="How we handle your data" href="#" external />
    </div>
  );
}

export function ConnectedAccountRowDemo() {
  const [linked, setLinked] = useState(["github", "google"]);
  return (
    <div className="w-full max-w-md space-y-2">
      {linked.includes("github") && (
        <ConnectedAccountRow
          icon={<Code2 size={18} />}
          badge={<Code2 size={11} />}
          name="GitHub"
          subname="primary"
          detail="@octocat"
          time="Connected 3 months ago"
          unlinkLabel="Unlink"
          onUnlink={() => setLinked((p) => p.filter((x) => x !== "github"))}
        />
      )}
      {linked.includes("google") && (
        <ConnectedAccountRow
          icon={<Globe size={18} />}
          badge={<Globe size={11} />}
          name="Google"
          detail="octocat@gmail.com"
          time="Connected 1 year ago"
          unlinkLabel="Unlink"
          onUnlink={() => setLinked((p) => p.filter((x) => x !== "google"))}
        />
      )}
      {linked.length === 0 && (
        <button onClick={() => setLinked(["github", "google"])} className="text-xs text-muted-foreground hover:text-foreground">Reset accounts</button>
      )}
    </div>
  );
}

export function AvatarUploaderDemo() {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex items-center gap-6">
      <AvatarUploader
        fallback="YH"
        uploading={uploading}
        label="Change avatar"
        onSelectFile={() => {
          setUploading(true);
          setTimeout(() => setUploading(false), 1500);
        }}
      />
      <AvatarUploader
        size={72}
        src="https://avatars.githubusercontent.com/u/9919?v=4"
        label="Change avatar"
        onSelectFile={() => {}}
      />
    </div>
  );
}

export function SimplePaginationDemo() {
  // Cursor-style: no known total, so "next" is gated on hasNext (here: 5 pages).
  const [page, setPage] = useState(1);
  return (
    <SimplePagination
      currentPage={page}
      hasNext={page < 5}
      onPrevious={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => p + 1)}
      labels={{ previous: "Previous", next: "Next", page: (n) => `Page ${n}` }}
    />
  );
}

export function ModelManagerCardDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="w-full max-w-sm">
      <ModelManagerCard
        selected={selected}
        selectSlot={<Checkbox checked={selected} onCheckedChange={setSelected} />}
        icon={<ProviderIcon provider="anthropic" size={40} rounded />}
        name="Claude Opus 4.8"
        ids={<IDBadge text="claude-opus-4-8" />}
        actions={
          <>
            <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"><Pencil size={15} /></button>
            <button className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="Disable"><Power size={15} /></button>
            <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
          </>
        }
        fields={[
          { label: "Provider", value: <span className="text-sm text-muted-foreground">Anthropic</span> },
          { label: "Type", value: <span className="text-sm">Chat</span> },
          { label: "Context", value: <span className="text-sm text-muted-foreground">200K</span> },
          { label: "Max output", value: <span className="text-sm text-muted-foreground">128K</span> },
          { label: "Status", value: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle size={12} />Approved</span> },
          { label: "Price (in / out)", value: <span className="font-mono text-sm text-muted-foreground">$5 / $25 per M</span>, full: true },
        ]}
        capabilities={{
          label: "Capabilities",
          value: ["chat", "function_calling", "streaming", "thinking"].map((c) => <CapabilityBadge key={c} capability={c} />),
        }}
      />
    </div>
  );
}

export function CategoryFilterDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <CategoryFilter
      categories={["Engineering", "Design", "Product"]}
      selectedCategory={selected ?? undefined}
      onSelect={setSelected}
    />
  );
}

export function CapabilitySelectorDemo() {
  const [selected, setSelected] = useState<string[]>(["chat", "vision"]);
  return <CapabilitySelector selected={selected} onChange={setSelected} columns={3} />;
}

// A few mock models mapped to ModelSelectOption, mirroring the showcase demo:
// ModelIcon/ProviderIcon fill the icon slots and CapabilityIcon renders the
// capability glyphs, so the docs and showcase share one source of truth.
type ModelSelectDemoCap = "streaming" | "vision" | "thinking" | "functions";
type ModelSelectDemoModel = {
  id: string;
  name: string;
  provider: string;
  providerLabel: string;
  caps: ModelSelectDemoCap[];
  context: string;
  aliases?: string[];
  tier?: "pro";
  deprecated?: boolean;
};
const MODEL_SELECT_DEMO_MODELS: ModelSelectDemoModel[] = [
  { id: "claude-opus-4-8", name: "Claude Opus 4.8", provider: "anthropic", providerLabel: "Anthropic", caps: ["streaming", "vision", "thinking", "functions"], context: "200K", aliases: ["opus-latest"], tier: "pro" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "anthropic", providerLabel: "Anthropic", caps: ["streaming", "vision", "functions"], context: "200K" },
  { id: "gpt-5", name: "GPT-5", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision", "thinking", "functions"], context: "256K", tier: "pro" },
  { id: "gpt-5-mini", name: "GPT-5 mini", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision", "functions"], context: "128K" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", providerLabel: "OpenAI", caps: ["streaming", "vision"], context: "128K", deprecated: true },
  { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", provider: "google", providerLabel: "Google", caps: ["streaming", "vision", "thinking", "functions"], context: "1M" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "deepseek", providerLabel: "DeepSeek", caps: ["streaming", "thinking"], context: "64K" },
];

export function ModelSelectDemo() {
  const [value, setValue] = useState("claude-opus-4-8");
  const [pinned, setPinned] = useState<string[]>(["gpt-5"]);
  const options: ModelSelectOption[] = MODEL_SELECT_DEMO_MODELS.map((m) => ({
    id: m.id,
    label: m.name,
    group: m.provider,
    groupLabel: m.providerLabel,
    searchText: `${m.id} ${(m.aliases ?? []).join(" ")}`,
    icon: <ModelIcon provider={m.provider} developer={m.provider} size={24} rounded className="shrink-0" />,
    groupIcon: <ProviderIcon provider={m.provider} size={16} rounded />,
    badges: (
      <>
        {m.caps.includes("streaming") && <CapabilityIcon capability="streaming" />}
        {m.caps.includes("vision") && <CapabilityIcon capability="vision" />}
        {m.caps.includes("thinking") && <CapabilityIcon capability="thinking" />}
        {m.caps.includes("functions") && <CapabilityIcon capability="function_calling" />}
        {m.deprecated && <span title="Deprecated"><AlertTriangle size={14} className="text-orange-500 shrink-0" /></span>}
        {m.tier === "pro" && <span title="Pro tier"><Crown size={14} className="text-amber-500 shrink-0" /></span>}
      </>
    ),
    detail: (
      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">{m.id}</span>
        {(m.aliases ?? []).map((a) => (
          <span key={a} className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[11px] text-muted-foreground/70">{a}</span>
        ))}
        <span className="bg-muted px-1.5 py-0.5 rounded-sm font-medium" title="Context window">{m.context}</span>
      </div>
    ),
  }));
  const has = (id: string, cap: ModelSelectDemoCap) =>
    MODEL_SELECT_DEMO_MODELS.find((m) => m.id === id)?.caps.includes(cap) ?? false;
  return (
    <div className="w-full max-w-md">
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
    </div>
  );
}

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");
  return (
    <LanguageSwitcher
      currentLocale={locale}
      onChange={setLocale}
      variant="pill"
      locales={[
        { value: "en", label: "English" },
        { value: "zh-CN", label: "简体中文" },
        { value: "zh-TW", label: "繁體中文" },
      ]}
    />
  );
}

export function PageLayoutDemo() {
  // PageLayout is min-h-dvh by design; cap it to the frame for the docs preview
  // via `!min-h-0 h-full` and a bounded, transform-contained box.
  return (
    <div
      className="w-full rounded-2xl border border-border overflow-hidden bg-(--bg-base)"
      style={{ height: 260, transform: "translateZ(0)" }}
    >
      <PageLayout
        className="!min-h-0 h-full"
        transparentBg
        mainClassName="flex-1 p-4 overflow-auto"
        navbar={
          <div className="h-12 shrink-0 border-b border-border flex items-center gap-2 px-4">
            <div className="w-5 h-5 rounded-md bg-muted" />
            <span className="text-sm font-semibold">navbar slot</span>
            <div className="ml-auto h-3.5 w-24 rounded-md bg-muted" />
          </div>
        }
        footer={
          <div className="h-10 shrink-0 border-t border-border flex items-center px-4 text-xs text-muted-foreground">
            footer slot
          </div>
        }
      >
        <div className="h-full min-h-32 rounded-xl bg-muted/50 border border-border grid place-items-center text-sm text-muted-foreground">
          main content
        </div>
      </PageLayout>
    </div>
  );
}

export function FileDropzoneDemo() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="w-80 space-y-3">
      <FileDropzone
        accept="image/*"
        multiple
        icon={<UploadCloud className="h-7 w-7" />}
        label="Drop images here, or click to browse"
        hint="PNG, JPG · up to 10MB"
        onFiles={(f) => setFiles(f.map((x) => x.name))}
      />
      {files.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Selected: <span className="text-foreground">{files.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

/**
 * A deterministic ~0.6s 440Hz sine WAV as a data URI — a real, playable source
 * for the AudioPlayer demo with no bundled asset and no network request.
 */
function toneWavDataUri(): string {
  const sampleRate = 8000;
  const seconds = 0.6;
  const n = Math.floor(sampleRate * seconds);
  const bytes = new Uint8Array(44 + n * 2);
  const view = new DataView(bytes.buffer);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + n * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    // fade out to avoid a click at the end
    const env = 1 - i / n;
    const sample = Math.sin(2 * Math.PI * 440 * t) * 0.3 * env;
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return "data:audio/wav;base64," + btoa(bin);
}

const SAMPLE_AUDIO = toneWavDataUri();

export function AudioPlayerDemo() {
  return (
    <div className="w-80">
      <AudioPlayer src={SAMPLE_AUDIO} title="sample-tone.wav" downloadName="sample-tone.wav" />
    </div>
  );
}

const MEDIA_GALLERY_ITEMS: MediaResult[] = [
  {
    id: "m1",
    url: "https://picsum.photos/seed/yunui-a/400",
    kind: "image",
    prompt: "A misty pine forest at dawn, volumetric light",
    model: "black-forest-labs/flux-schnell",
    meta: "1024×1024",
    status: "completed",
  },
  {
    id: "m2",
    url: "https://picsum.photos/seed/yunui-b/400",
    kind: "image",
    prompt: "Retro-futuristic city skyline, neon reflections",
    model: "black-forest-labs/flux-schnell",
    meta: "1024×1024",
    status: "completed",
  },
  {
    id: "m3",
    url: "",
    kind: "image",
    prompt: "Isometric cozy reading nook, soft afternoon light",
    model: "black-forest-labs/flux-schnell",
    meta: "1024×1024",
    status: "processing",
    progress: 60,
  },
  {
    id: "m4",
    url: "",
    kind: "image",
    prompt: "Abstract fluid gradient wallpaper",
    model: "black-forest-labs/flux-schnell",
    meta: "1024×1024",
    status: "failed",
    error: "Content policy violation",
  },
];

export function MediaGalleryDemo() {
  return (
    <MediaGallery
      items={MEDIA_GALLERY_ITEMS}
      onDownload={(item) => console.log("download", item.id)}
      onDelete={(item) => console.log("delete", item.id)}
    />
  );
}

const AREA_SERIES = [12, 19, 15, 24, 22, 30, 26, 34, 29, 38, 33, 41].map((value, i) => ({
  value,
  label: `${8 + i}:00`,
}));

export function AreaChartDemo() {
  return (
    <div className="w-full max-w-xl">
      <AreaChart
        data={AREA_SERIES}
        tone="accent"
        height={160}
        showXAxis
        formatValue={(v) => `$${v.toFixed(2)}`}
        ariaLabel="Hourly cost"
      />
    </div>
  );
}

// Client wrapper: the `formatValue` function prop can't be passed from the
// (server-rendered) MDX directly, so the demo lives here.
export function SegmentedBarLegendDemo() {
  return (
    <SegmentedBar
      className="w-72"
      total={64}
      legend
      formatValue={(v) => v + " GB"}
      segments={[
        { value: 22, tone: "accent", label: "Active" },
        { value: 12, tone: "info", label: "Cache" },
      ]}
    />
  );
}

// ---- Content-rendering stack (yunui/content) ------------------------------

const SAMPLE_MARKDOWN = `# Markdown renderer

Full **GFM** with _emphasis_, ~~strikethrough~~, [links](https://github.com/YuhuanStudio/YunUI) and \`inline code\`.

> [!NOTE]
> Callouts use GitHub's \`> [!TYPE]\` blockquote syntax — note, tip, important, warning, caution.

## Table

| Feature   | Supported | Notes                    |
| --------- | :-------: | ------------------------ |
| Tables    |     ✅     | GitHub-flavored          |
| Task list |     ✅     | Interactive checkboxes   |
| Math      |     ✅     | KaTeX inline & block     |

## Task list

- [x] Render headings, tables and lists
- [x] Highlight code with Shiki
- [ ] Ship to production

## Code

\`\`\`ts
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Math

The Gaussian integral is $\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}$, and in block form:

$$
E = mc^2
$$

## Diagram

\`\`\`mermaid
graph LR
  A[Markdown] --> B{Renderer}
  B --> C[HTML]
  B --> D[Code]
  B --> E[Math]
  B --> F[Diagram]
\`\`\`
`;

export function MarkdownRendererDemo() {
  return (
    <div className="w-full max-w-2xl text-left">
      <MarkdownRenderer content={SAMPLE_MARKDOWN} />
    </div>
  );
}

export function ImageLightboxDemo() {
  const [open, setOpen] = useState(false);
  const src = "https://picsum.photos/seed/yunui-lightbox/1280/720";
  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={() => setOpen(true)} className="group">
        <img src={src} alt="Preview" className="w-64 rounded-xl transition-opacity group-hover:opacity-90" />
      </button>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Maximize2 className="w-4 h-4" />
        Open lightbox
      </Button>
      <ImageLightbox src={src} alt="Preview" isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

// ---- Chat pattern (yunui/chat) --------------------------------------------

const CHAT_ASSISTANT_MD = `Here's a quick plan:

1. **Install** \`@yuhuanowo/yunui\` and wrap your app in \`YunUIProvider\`.
2. Compose \`ChatMessage\` rows inside a \`ChatMessageList\`.
3. Render markdown bodies with \`MarkdownRenderer\` from the content subpath.

\`\`\`tsx
<ChatMessageList>
  <ChatMessage role="user">Hi!</ChatMessage>
</ChatMessageList>
\`\`\`

Ready when you are.`;

const chatActions = (
  <>
    <button type="button" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <Copy className="w-3.5 h-3.5" /> Copy
    </button>
    <button type="button" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <RefreshCw className="w-3.5 h-3.5" /> Regenerate
    </button>
  </>
);

/** Realistic mini chat: header + smart-scroll list + stateful composer. */
export function ChatDemo() {
  const [value, setValue] = useState("");
  const [extra, setExtra] = useState<string[]>([]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setExtra((e) => [...e, text]);
    setValue("");
  };

  return (
    <div
      className="w-full max-w-2xl flex flex-col rounded-2xl border bg-card overflow-hidden"
      style={{ height: 480 }}
    >
      <ChatHeader
        className="border-b"
        left={
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-muted border flex items-center justify-center">
              <Bot className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium truncate">Assistant</span>
          </div>
        }
        status={
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        }
        actions={
          <Button variant="ghost" size="sm" onClick={() => setExtra([])}>
            Clear
          </Button>
        }
      />

      <ChatMessageList className="px-4">
        <ChatMessage role="user" name="You" timestamp="9:41 AM">
          How do I compose a chat UI with YunUI?
        </ChatMessage>
        <ChatMessage
          role="assistant"
          name="Assistant"
          timestamp="9:41 AM"
          badges={
            <>
              <Badge>gpt-4o</Badge>
              <GenerationStats tokens={2570} latencyMs={51611} />
            </>
          }
          actions={chatActions}
        >
          <MarkdownRenderer content={CHAT_ASSISTANT_MD} />
        </ChatMessage>
        {extra.map((m, i) => (
          <ChatMessage key={i} role="user" name="You" timestamp="now">
            {m}
          </ChatMessage>
        ))}
      </ChatMessageList>

      <div className="p-3 border-t">
        <ChatComposer
          value={value}
          onChange={setValue}
          onSend={send}
          placeholder="Send a message…"
          toolbar={
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
              Attach
            </Button>
          }
        />
      </div>
    </div>
  );
}

/** Standalone controlled composer with a send log and a stop/loading cycle. */
export function GenerationStatsDemo() {
  return (
    <div className="w-full max-w-xl space-y-4 text-left">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-foreground">Assistant</div>
        <span className="rounded bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
          zai/glm-5.2
        </span>
        <GenerationStats tokens={2570} latencyMs={51611} />
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-foreground">Assistant</div>
        <GenerationStats
          tokens={840}
          tokensPerSecond={62.4}
          latencyMs={13500}
          labels={{ tokens: "Token", speed: "Token/秒", latency: "毫秒" }}
        />
      </div>
    </div>
  );
}

export function ChatComposerDemo() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setLog((l) => [...l, text]);
    setValue("");
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="w-full max-w-xl space-y-3 text-left">
      {log.length > 0 && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {log.map((m, i) => (
            <div key={i} className="truncate">
              Sent: {m}
            </div>
          ))}
        </div>
      )}
      <ChatComposer
        value={value}
        onChange={setValue}
        onSend={send}
        onStop={() => setLoading(false)}
        loading={loading}
        placeholder="Send a message… (Enter to send, Shift+Enter for a newline)"
        toolbar={
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
            Attach
          </Button>
        }
      />
    </div>
  );
}
