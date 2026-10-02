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
import { ConversationUnitsDemo } from "./conversation-units";
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
  SettingsShell,
  StatGrid,
  ArchiveCalendar,
} from "yunui/patterns";
import {
  NumberInput,
  SearchInput, Kbd, Switch, Checkbox, Pagination, NavTabs, Combobox, CustomSelect, SegmentedSelect, Modal, Sheet, ConfirmModal, toast, Button, InlineStatus, FileDropzone, AreaChart, SegmentedBar, Badge, CommandPalette, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "yunui";
import {
  ChatMessage,
  ChatMessageList,
  ChatComposer,
  ChatHeader,
  GenerationStats,
  type ChatComposerCommand,
  type ChatComposerMenuItem,
  type ChatComposerModel,
} from "yunui/chat";
import {
  AgentRunStatus,
  AgentTimeline,
  ApprovalQuestion,
  CapabilitySelector,
  LanguageSwitcher,
  ModelSelect,
  ThinkingBlock,
  type AgentRunState,
  type AgentTimelineEntry,
  type ApprovalQuestionAnswers,
  type ApprovalQuestionData,
  type ModelSelectOption,
  ModelManagerCard,
  CapabilityIcon,
  IDBadge,
  ModelIcon,
  ProviderIcon,
  AccountMenu,
  ModelCard,
  type ThinkingBlockStep,
} from "yunui/ai";
import { MarkdownRenderer, ImageLightbox, ContentImage, CodeBlock as ContentCodeBlock } from "yunui/content";
import { Coins, LayoutGrid, List, Table as TableIcon, ShieldAlert, Image as ImageIcon, PanelLeft, AlertTriangle, Crown, Pencil, Power, Trash2, CheckCircle, MessageSquare, CreditCard, Monitor, Smartphone, Code2, HelpCircle, FileText, Shield, Globe, UploadCloud, Maximize2, Bot, Copy, RefreshCw, Users, KeyRound, Bookmark, LayoutDashboard } from "lucide-react";

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
        <Switch checked={on} onCheckedChange={setOn} label="Notifications" />
        <Switch checked={on} onCheckedChange={setOn} size="md" label="Notifications, larger" />
        <Switch checked={false} onCheckedChange={() => {}} disabled label="Disabled example" />
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={success} onCheckedChange={setSuccess} variant="success" label="Success example" />
        <Switch checked={warning} onCheckedChange={setWarning} variant="warning" label="Warning example" />
        <Switch checked={danger} onCheckedChange={setDanger} variant="danger" label="Danger example" />
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
  // `aria-labelledby`, not a wrapping <label>: Radix renders a
  // `<button role="checkbox">`, and <label> only names form controls — it does
  // nothing for a button, so the wrapped version produced an unnamed checkbox.
  return (
    <div className="flex flex-col gap-3">
      <span className="flex items-center gap-2 text-sm">
        <Checkbox checked={a} onCheckedChange={setA} id="cb-a" aria-labelledby="cb-a-label" />
        <span id="cb-a-label">Subscribe to updates</span>
      </span>
      <span className="flex items-center gap-2 text-sm">
        <Checkbox checked={b} onCheckedChange={setB} id="cb-b" aria-labelledby="cb-b-label" />
        <span id="cb-b-label">Remember this device</span>
      </span>
      <span className="flex items-center gap-2 text-sm opacity-60">
        <Checkbox checked={false} onCheckedChange={() => {}} disabled id="cb-c" aria-labelledby="cb-c-label" />
        <span id="cb-c-label">Disabled option</span>
      </span>
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
        { value: "table", label: "Table", icon: TableIcon },
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
            inactive={s.inactive}
            labels={{ current: "Current", inactive: "Inactive", revoke: "Revoke" }}
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
        empty={items.length === 0}
        labels={{ unread: "unread", empty: "You're all caught up" }}
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
        control={<Switch aria-label="Setting toggle" checked={email} onCheckedChange={setEmail} />}
      />
      <SettingRow
        title="Push notifications"
        description="Get notified on your devices the moment something happens."
        control={<Switch aria-label="Setting toggle" checked={push} onCheckedChange={setPush} />}
      />
      <SettingRow
        title="Weekly digest"
        control={<Switch aria-label="Setting toggle" checked={digest} onCheckedChange={setDigest} />}
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
        selectSlot={<Checkbox aria-label="Select model" checked={selected} onCheckedChange={setSelected} />}
        icon={<ProviderIcon provider="anthropic" size={40} rounded />}
        name="Claude Opus 4.8"
        ids={<IDBadge text="claude-opus-4-8" />}
        actions={
          <>
            <button type="button" aria-label="Edit model" className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"><Pencil size={15} /></button>
            <button type="button" aria-label="Disable model" className="p-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="Disable"><Power size={15} /></button>
            <button type="button" aria-label="Delete model" className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
          </>
        }
        fields={[
          { label: "Provider", value: <span className="text-sm text-muted-foreground">Anthropic</span> },
          { label: "Type", value: <span className="text-sm">Chat</span> },
          { label: "Context", value: <span className="text-sm text-muted-foreground">200K</span> },
          { label: "Max output", value: <span className="text-sm text-muted-foreground">128K</span> },
          { label: "Status", value: <Badge variant="success"><CheckCircle size={12} />Approved</Badge> },
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

/** Interactive host fixture for checking ModelCard activation beside copyable IDs. */
export function ModelCardInteractiveDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="w-full max-w-xs">
      <ModelCard
        name="GPT-4o"
        icon={<ProviderIcon provider="openai" size={32} rounded />}
        ids={["gpt-4o", "gpt-4o-latest"]}
        description="Click the body to select; each model ID remains a separate copy action."
        capabilities={["vision", "streaming", "function_calling"]}
        developer={{ label: "OpenAI" }}
        context="128K"
        price="$2.50/M"
        onClick={() => setSelected((value) => !value)}
      />
      <output aria-live="polite" className="mt-2 block text-xs text-muted-foreground">
        {selected ? "Selected for routing" : "No model selected"}
      </output>
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
      <div className="text-xs text-(--text-secondary) flex flex-wrap items-center gap-1.5">
        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">{m.id}</span>
        {(m.aliases ?? []).map((a) => (
          <span key={a} className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[11px] text-(--text-secondary)">{a}</span>
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

const CONTENT_IMAGE_ORIGINAL = "https://picsum.photos/seed/yunui/640/360";
const CONTENT_IMAGE_REPLACEMENT = "https://picsum.photos/seed/yunui-replacement/640/360";
const CONTENT_IMAGE_SRCSET = "https://picsum.photos/seed/yunui-srcset/640/360 1x, https://picsum.photos/seed/yunui-srcset/1280/720 2x";

export function ContentImageDemo() {
  const [src, setSrc] = useState(CONTENT_IMAGE_ORIGINAL);
  const [srcSet, setSrcSet] = useState<string | undefined>();
  return (
    <div className="flex flex-col items-center gap-3" data-testid="content-image-demo">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Image source controls">
        <button type="button" className="btn btn-secondary" onClick={() => { setSrc("/__yunui_content_image_fixture__/404.svg"); setSrcSet(undefined); }}>
          Fail image load
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => { setSrc(CONTENT_IMAGE_REPLACEMENT); setSrcSet(undefined); }}>
          Load replacement image
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setSrcSet(CONTENT_IMAGE_SRCSET)}>
          Switch srcSet only
        </button>
      </div>
      <ContentImage
        src={src}
        srcSet={srcSet}
        alt="A random placeholder photo"
        className="w-80 rounded-xl"
      />
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

/** Full chat workspace composed from the public chat, AI and content exports. */
export function ChatDemo() {
  type AgentPreviewState = "idle" | "working" | "approval" | "done" | "error";
  const [value, setValue] = useState("");
  const [extraMessages, setExtraMessages] = useState<string[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(["workspace-docs"]);
  const [selectedModelId, setSelectedModelId] = useState("host-reasoning");
  const [previewState, setPreviewState] = useState<AgentPreviewState>("idle");
  const [approvalDecision, setApprovalDecision] = useState<"approved" | "rejected" | null>(null);
  const [errorKind, setErrorKind] = useState<"failed" | "declined">("failed");
  const [hostEvent, setHostEvent] = useState("No host callback has run yet.");
  const [questionVisible, setQuestionVisible] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState("scope");
  const [answers, setAnswers] = useState<ApprovalQuestionAnswers>({});
  const shortCode = 'const route = "/docs/patterns/navbar";\nconst locales = ["en", "zh-CN", "zh-TW"];\nawait verifyRoute(route, locales);';
  const toolCode = Array.from({ length: 12 }, (_, index) => `const result${index + 1} = await checkRoute("/docs/patterns/navbar", "en");`).join("\n");
  const longCode = Array.from({ length: 80 }, (_, index) => `const result${index + 1} = await checkRoute("/docs/patterns/navbar", "en");`).join("\n");
  const handleCodeEdit = ({ code, filename }: { code: string; filename: string }) => setHostEvent(`Host edit received ${filename} (${code.split("\n").length} lines).`);

  const questions: readonly ApprovalQuestionData[] = [
    {
      id: "scope",
      title: "Which sources should I check?",
      message: "Choose the references that are relevant to the review.",
      type: "multiple",
      options: [
        { id: "docs", label: "Workspace docs", detail: "Guides and release notes" },
        { id: "notes", label: "Project notes", detail: "Implementation notes" },
      ],
      other: { id: "other", label: "Another source", placeholder: "Name the source" },
    },
    {
      id: "format",
      title: "How should I format the summary?",
      type: "single",
      options: [
        { id: "short", label: "Short summary" },
        { id: "steps", label: "Step-by-step" },
      ],
    },
  ];

  const stateStatus: Record<AgentPreviewState, { label: string; phase: AgentRunState }> = {
    idle: { label: "Ready", phase: "waiting" },
    working: { label: "Checking the Navbar docs…", phase: "acting" },
    approval: { label: "Approval required", phase: "waiting" },
    done: { label: approvalDecision === "approved" ? "Documentation checks passed" : "Route checks completed", phase: "completed" },
    error: errorKind === "declined"
      ? { label: "Request declined", phase: "cancelled" }
      : { label: "Documentation test failed", phase: "failed" },
  };
  const assistantResponse: Record<AgentPreviewState, string> = {
    idle: "I’ll check the Navbar docs in English, Simplified Chinese and Traditional Chinese before the release.",
    working: "I’m checking the Navbar route in all three locales now.",
    approval: "The route check is ready. Would you like to run the documentation test command?",
    done: approvalDecision === "approved"
      ? "The Navbar docs route rendered in all three locales, and the documentation checks passed."
      : "The Navbar docs route rendered in all three locales.",
    error: errorKind === "declined"
      ? "The Navbar route check is complete. The documentation test request was declined, so it was not run."
      : "The Navbar route check is complete. The documentation test command ran and failed; the route result is still available.",
  };

  const blocksByState: Record<AgentPreviewState, AgentTimelineEntry[]> = {
    idle: [],
    working: [
      { kind: "tool", id: "tool-search", verb: "Render", summary: "/docs/patterns/navbar", status: "running", icon: "globe" },
      { kind: "tool", id: "tool-api", verb: "Read", summary: "ChatComposer API", status: "done", icon: "read", output: "The composer value, menus and send callback are owned by the host." },
      { kind: "tool", id: "tool-code", verb: "Review", summary: "CodeBlock output", status: "done", icon: "file", outputContent: <ContentCodeBlock language="typescript" filename="verification.ts" onEdit={handleCodeEdit}>{toolCode}</ContentCodeBlock> },
      { kind: "tool", id: "tool-tests", verb: "Run", summary: "Documentation tests", status: "running", icon: "terminal", command: "pnpm test", output: "Waiting for the host tool result." },
    ],
    approval: [
      { kind: "approval", id: "approval-command", title: "Run documentation checks", verb: "pnpm test", message: "Review the requested command before it runs.", argsText: "$ pnpm test", allowLabel: "Allow", denyLabel: "Deny" },
    ],
    done: [
      { kind: "task", id: "task-search-done", label: "Check documentation routes", amount: "3 locales", status: "done", details: [{ id: "task-detail-reviewed", label: "Navbar page rendered", meta: "3 / 3" }] },
      ...(approvalDecision === "approved" ? [
        { kind: "approval" as const, id: "approval-command-done", title: "Run documentation checks", verb: "pnpm test", message: "The reviewed action was allowed.", decision: "approved" as const, decidedLabel: "Allowed", allowLabel: "Allow", denyLabel: "Deny" },
        { kind: "tool" as const, id: "tool-test-done", verb: "Run", summary: "pnpm test", status: "done" as const, icon: "terminal" as const, command: "pnpm test", output: "Unit tests passed." },
      ] : []),
    ],
    error: [
      { kind: "reasoning", id: "reason-error", label: errorKind === "declined" ? "Request declined" : "Test command failed", content: errorKind === "declined" ? "The route check completed. The requested command was declined and was not run." : "The route check completed. The approved documentation test command ran and returned an error." },
      { kind: "task", id: "task-search-error", label: "Check documentation routes", amount: "3 locales", status: "done", details: [{ id: "task-detail-route-complete", label: "Navbar page rendered", meta: "3 / 3" }] },
      { kind: "tool", id: "tool-search-error", verb: "Render", summary: "/docs/patterns/navbar", status: "done", icon: "globe", command: "GET /docs/patterns/navbar", output: "200 in English, Simplified Chinese and Traditional Chinese." },
      ...(errorKind === "declined" ? [
        { kind: "approval" as const, id: "approval-command-error", title: "Run documentation checks", verb: "pnpm test", message: "The reviewed action was rejected; the command was not run.", decision: "rejected" as const, decidedLabel: "Rejected", allowLabel: "Allow", denyLabel: "Deny" },
      ] : [
        { kind: "task" as const, id: "task-build-error", label: "Run documentation checks", amount: "1 command", status: "failed" as const, details: [{ id: "task-detail-error", label: "Typecheck failed", meta: "exit 2" }] },
        { kind: "tool" as const, id: "tool-build-error", verb: "Run", summary: "pnpm test", status: "error" as const, icon: "terminal" as const, command: "pnpm test", output: "Typecheck failed in the project configuration." },
      ]),
    ],
  };

  const runStatus = stateStatus[previewState];
  const send = () => {
    const text = value.trim();
    if (!text) return;
    setExtraMessages((current) => [...current, text]);
    setHostEvent(`onSend received “${text}”; no service request was sent.`);
    setValue("");
  };

  const skipQuestion = (questionId: string) => {
    const currentIndex = questions.findIndex((question) => question.id === questionId);
    const next = questions[currentIndex + 1];
    if (next) setActiveQuestionId(next.id);
    setHostEvent("Question skip callback received.");
  };


  return (
    <div data-testid="chat-demo-root" className="w-full max-w-3xl space-y-3 text-left">
      <div data-testid="chat-demo-controls" className="space-y-2 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Agent state fixture">
          {(["idle", "working", "approval", "done", "error"] as const).map((state) => (
            <Button key={state} size="sm" variant={previewState === state ? "primary" : "ghost"} aria-pressed={previewState === state} onClick={() => {
              setPreviewState(state);
              setApprovalDecision(null);
              setErrorKind("failed");
              if (state === "approval") {
                setQuestionVisible(true);
                setActiveQuestionId("scope");
                setAnswers({});
              }
            }}>
              {state[0].toUpperCase() + state.slice(1)}
            </Button>
          ))}
        </div>
        {previewState === "approval" && !questionVisible ? (
          <Button variant="secondary" size="sm" onClick={() => setQuestionVisible(true)}>
            Restore questions
          </Button>
        ) : null}
        <p data-testid="chat-demo-host-event" role="status" className="text-xs text-muted-foreground">{hostEvent}</p>
        <p className="text-xs text-muted-foreground">These controls use local documentation data. Questionnaire answers are separate from tool approval; only Allow or Deny decides the command, and no command is sent or run.</p>
      </div>
      <div className="flex h-[min(820px,85vh)] min-h-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-background">
        <ChatHeader
          className="border-b"
          left={
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium">Release review</span>
                <span className="block text-xs text-(--text-secondary)">Agent Chat · YunUI workspace</span>
              </div>
            </div>
          }
          actions={<Button variant="ghost" size="sm" onClick={() => setExtraMessages([])}>Clear</Button>}
        />

        <ChatMessageList className="px-4 md:px-6" empty={<span className="text-sm text-muted-foreground">Start a conversation.</span>}>
          <ChatMessage role="user" density="compact">
            Can you check the Navbar docs before the release?
          </ChatMessage>
          <ChatMessage
            role="assistant"
            density="compact"
            name="YunUI agent"
            badges={<AgentRunStatus label={runStatus.label} phase={runStatus.phase} />}
          >
            <MarkdownRenderer content={assistantResponse[previewState]} />
            {previewState === "working" ? <ThinkingBlock
              content=""
              isStreaming
              defaultOpen
              steps={[
                { id: "route", label: "Render the Navbar page", meta: "3 locales", status: "done" },
                { id: "composer", label: "Review ChatComposer API", meta: "chat-composer.tsx", status: "running" },
                { id: "timeline", label: "Review AgentTimeline API", meta: "agent-timeline.tsx", status: "pending" },
              ]}
              labels={{ title: "Checking the Navbar docs…", active: "Running", completed: "Done", pending: "Queued" }}
            /> : null}
            {previewState === "done" ? <div className="space-y-3">
              <ContentCodeBlock language="typescript" filename="route-checks.ts" onEdit={handleCodeEdit}>{shortCode}</ContentCodeBlock>
              <ContentCodeBlock language="typescript" filename="all-routes.ts" onEdit={handleCodeEdit}>{longCode}</ContentCodeBlock>
              <ConversationUnitsDemo onHostEvent={setHostEvent} />
            </div> : null}
          <AgentTimeline
            blocks={blocksByState[previewState]}
            onApprove={(id) => { setApprovalDecision("approved"); setPreviewState("done"); setHostEvent(`Approval callback received for ${id}; the local success fixture is shown.`); }}
            onReject={(id) => { setApprovalDecision("rejected"); setErrorKind("declined"); setPreviewState("error"); setHostEvent(`Rejection callback received for ${id}; the command was not run.`); }}
            labels={{ summary: ({ tools }) => `${tools} tool ${tools === 1 ? "call" : "calls"}` }}
          />
          {previewState === "approval" && questionVisible ? (
            <div data-testid="chat-demo-question">
              <ApprovalQuestion
                questions={questions}
                activeQuestionId={activeQuestionId}
                answers={answers}
                onAnswersChange={setAnswers}
                onActiveQuestionChange={setActiveQuestionId}
                onSkip={skipQuestion}
                onDismiss={() => { setQuestionVisible(false); setHostEvent("Question dismissed; the tool decision is still pending."); }}
                onSubmit={() => setHostEvent("Host received the questionnaire answers. No tool decision was made.")}
                labels={{ progress: (current, total) => `Question ${current} of ${total}`, dismiss: "Dismiss questions" }}
              />
            </div>
          ) : null}
          </ChatMessage>
          {extraMessages.map((message, i) => (
            <ChatMessage key={`local-${i}`} role="user" density="compact">{message}</ChatMessage>
          ))}
        </ChatMessageList>

        <div className="p-3">
          <ChatComposer
            value={value}
            onChange={setValue}
            onSend={send}
            onStop={() => { setPreviewState("idle"); setHostEvent("onStop callback received; no service request was sent."); }}
            loading={previewState === "working"}
            placeholder="Type @ for sources or / for commands"
            sourceItems={CHAT_COMPOSER_SOURCES}
            selectedSourceIds={selectedSourceIds}
            onSourceToggle={(id, selected) => setSelectedSourceIds((current) => selected ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id))}
            commandItems={CHAT_COMPOSER_COMMANDS}
            onCommandSelect={(item) => setHostEvent(`Host command callback received: ${item.label}.`)}
            modelItems={CHAT_COMPOSER_MODELS}
            selectedModelId={selectedModelId}
            onModelChange={(id) => { setSelectedModelId(id); setHostEvent(`Host selected model id: ${id}.`); }}
            labels={{ sources: "Sources", commands: "Commands", model: "Select a model", send: "Send", stop: "Stop" }}
          />
        </div>
      </div>
    </div>
  );
}

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

const CHAT_COMPOSER_SOURCES: ChatComposerMenuItem[] = [
  { id: "workspace-docs", label: "Workspace docs", description: "Release notes and API guides", icon: <FileText className="h-4 w-4" /> },
  { id: "web-search", label: "Web search", description: "Public product documentation", icon: <Globe className="h-4 w-4" /> },
  { id: "restricted", label: "Shared drive", description: "Not available in this workspace", disabled: true, icon: <Shield className="h-4 w-4" /> },
];

const CHAT_COMPOSER_COMMANDS: ChatComposerCommand[] = [
  {
    id: "summarize",
    label: "summarize",
    description: "Summarize selected sources",
    insertText: "Summarize the selected context: ",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    id: "review",
    label: "review",
    description: "Review the selected sources",
    icon: <CheckCircle className="h-4 w-4" />,
  },
];

const CHAT_COMPOSER_MODELS: ChatComposerModel[] = [
  { id: "host-reasoning", label: "Reasoning model", description: "Detailed analysis", group: "recommended", groupLabel: "Recommended", icon: <Bot className="h-4 w-4" /> },
  { id: "host-fast", label: "Fast model", description: "Short summaries", group: "recommended", groupLabel: "Recommended", icon: <Bot className="h-4 w-4" /> },
];

/** Real public ChatComposer with host-owned menu fixtures and no backend. */
export function ChatComposerDemo() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(["workspace-docs"]);
  const [selectedModelId, setSelectedModelId] = useState("host-reasoning");
  const [notice, setNotice] = useState("Menus use fixture data supplied by this docs host.");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setNotice(`onSend received: ${text} (no request is sent by this demo).`);
    setValue("");
  };

  return (
    <div data-testid="chat-composer-demo" className="w-full max-w-xl space-y-3 text-left">
      <p role="status" className="text-xs text-muted-foreground">{notice}</p>
      <ChatComposer
        value={value}
        onChange={setValue}
        onSend={send}
        onStop={() => { setLoading(false); setNotice("Host onStop callback received; no request is running in this demo."); }}
        loading={loading}
        placeholder="Type @ for sources or / for commands"
        sourceItems={CHAT_COMPOSER_SOURCES}
        selectedSourceIds={selectedSourceIds}
        onSourceToggle={(id, selected) => setSelectedSourceIds((current) => selected ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id))}
        commandItems={CHAT_COMPOSER_COMMANDS}
        onCommandSelect={(item) => setNotice(`Host command callback received: ${item.label}.`)}
        modelItems={CHAT_COMPOSER_MODELS}
        selectedModelId={selectedModelId}
        onModelChange={(id) => { setSelectedModelId(id); setNotice(`Host selected model id: ${id}.`); }}
        labels={{
          sources: "Sources",
          commands: "Commands",
          model: "Select a model",
          noSources: "No sources configured by this host",
          noCommands: "No commands configured by this host",
          noModels: "No models configured by this host",
          noMatchingSources: "No matching sources",
          noMatchingCommands: "No matching commands",
          removeSource: (label) => `Remove ${label}`,
          send: "Send",
          stop: "Stop",
        }}
      />
      <Button variant="ghost" size="sm" onClick={() => setLoading((current) => !current)}>
        {loading ? "Exit Stop preview" : "Preview Stop state"}
      </Button>
    </div>
  );
}

/** Controlled step disclosure with host-supplied lifecycle rows. */
export function ThinkingBlockDemo() {
  const [open, setOpen] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState("read");
  const steps: ThinkingBlockStep[] = [
    { id: "read", label: "Read workspace guidance", detail: "The host supplied this fixture step.", meta: "2 files", status: "done" },
    { id: "compare", label: "Compare the examples", detail: "Check the public component contracts before answering.", meta: "3 pages", status: "running" },
    { id: "answer", label: "Write the response", detail: "Waiting for the host to finish the preceding step.", status: "pending" },
  ];

  return (
    <div className="w-full max-w-lg space-y-2 text-left">
      <ThinkingBlock
        content="The host owns the partial reasoning text and step events. This component does not advance a trace or contact a model."
        steps={steps}
        selectedStepId={selectedStepId}
        onStepSelect={setSelectedStepId}
        open={open}
        onOpenChange={setOpen}
        labels={{ title: "Agent trace", active: "Running", completed: "Done", pending: "Queued" }}
      />
      <p role="status" className="text-xs text-muted-foreground">Host-selected step: {selectedStepId}</p>
    </div>
  );
}

/** A host-controlled questionnaire; answers are fixture state local to this doc. */
export function ApprovalQuestionDemo() {
  const questions: readonly ApprovalQuestionData[] = [
    {
      id: "scope",
      title: "Which sources should I check?",
      message: "Choose the references relevant to this release review.",
      type: "multiple",
      options: [
        { id: "workspace-docs", label: "Workspace docs", detail: "Guides and release notes" },
        { id: "project-notes", label: "Project notes", detail: "Previous decisions" },
      ],
      other: { id: "other", label: "Another source", placeholder: "Name the source" },
    },
    {
      id: "format",
      title: "How should I format the findings?",
      type: "single",
      options: [
        { id: "summary", label: "Short summary" },
        { id: "steps", label: "Step-by-step" },
      ],
    },
  ];
  const [activeQuestionId, setActiveQuestionId] = useState("scope");
  const [answers, setAnswers] = useState<ApprovalQuestionAnswers>({});
  const [notice, setNotice] = useState("Answers stay in this local preview.");
  const [submitting, setSubmitting] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(true);

  const moveToNext = (questionId: string) => {
    const index = questions.findIndex((question) => question.id === questionId);
    const next = questions[index + 1];
    if (next) setActiveQuestionId(next.id);
  };

  return (
    <div data-testid="approval-question-demo" className="w-full max-w-md space-y-3 text-left">
      <Button variant="ghost" size="sm" onClick={() => setSubmitting((current) => !current)}>
        {submitting ? "Exit submitting preview" : "Preview submitting state"}
      </Button>
      {questionVisible ? (
        <ApprovalQuestion
          questions={questions}
          activeQuestionId={activeQuestionId}
          answers={answers}
          onAnswersChange={setAnswers}
          onActiveQuestionChange={setActiveQuestionId}
          onSkip={(id) => { setNotice("Question skipped in the local preview."); moveToNext(id); }}
          onSubmit={(result) => setNotice(`${Object.keys(result).length} answer(s) collected locally; no tool was approved.`)}
          onDismiss={() => { setQuestionVisible(false); setNotice("Question dismissed. Restore it to continue answering."); }}
          submitting={submitting}
          labels={{ progress: (current, total) => `Question ${current} of ${total}`, submitting: "Saving answers…", dismiss: "Dismiss questions" }}
        />
      ) : (
        <Button variant="secondary" size="sm" onClick={() => { setQuestionVisible(true); setActiveQuestionId("scope"); }}>
          Restore questions
        </Button>
      )}
      <p role="status" className="text-xs text-muted-foreground">{notice}</p>
    </div>
  );
}

export function SettingsShellDemo() {
  const [tab, setTab] = useState("profile");
  const groups = [
    {
      key: "account",
      label: "Account",
      items: [
        { key: "profile", label: "Profile", icon: Shield },
        { key: "billing", label: "Billing", icon: CreditCard },
      ],
    },
    {
      key: "workspace",
      label: "Workspace",
      items: [
        { key: "members", label: "Members", icon: Bot },
        { key: "integrations", label: "Integrations", icon: Globe },
      ],
    },
  ];
  const titles: Record<string, string> = {
    profile: "Profile",
    billing: "Billing",
    members: "Members",
    integrations: "Integrations",
  };
  return (
    <div className="h-[380px] w-full overflow-hidden rounded-2xl border border-border">
      <SettingsShell
        header={<h2 className="text-sm font-semibold text-foreground">Settings</h2>}
        groups={groups}
        value={tab}
        onValueChange={setTab}
      >
        <div className="h-full overflow-y-auto p-6">
          <h3 className="text-base font-semibold text-foreground">{titles[tab]}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The {titles[tab].toLowerCase()} panel. The host owns the active panel and its content;
            YunUI owns the navigation layout and active states.
          </p>
        </div>
      </SettingsShell>
    </div>
  );
}

export function TableSortDemo() {
  const rows = [
    { model: "Claude Opus 4.8", context: 200, cost: 15 },
    { model: "DeepSeek R1", context: 64, cost: 2 },
    { model: "GPT-4o mini", context: 128, cost: 1 },
  ];
  const [sort, setSort] = useState<{ key: "context" | "cost"; dir: "asc" | "desc" }>({
    key: "context",
    dir: "desc",
  });
  const toggle = (key: "context" | "cost") =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  const sorted = [...rows].sort((a, b) => {
    const d = a[sort.key] - b[sort.key];
    return sort.dir === "asc" ? d : -d;
  });
  return (
    <div className="w-full max-w-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead
              align="right"
              onSort={() => toggle("context")}
              sortDirection={sort.key === "context" ? sort.dir : false}
            >
              Context (K)
            </TableHead>
            <TableHead
              align="right"
              onSort={() => toggle("cost")}
              sortDirection={sort.key === "cost" ? sort.dir : false}
            >
              $ / Mtok
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.model}>
              <TableCell>{r.model}</TableCell>
              <TableCell className="text-right tabular-nums">{r.context}</TableCell>
              <TableCell className="text-right tabular-nums">${r.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatGridDemo() {
  return (
    <div className="w-full max-w-2xl">
      <StatGrid columns={2}>
        <StatCard icon={Coins} label="Balance" value="$1,250" />
        <StatCard icon={Users} label="Members" value="48" />
      </StatGrid>
    </div>
  );
}

export function AccountMenuDemo() {
  return (
    <div className="flex h-56 w-full items-start justify-center pt-2">
      <AccountMenu
        signInHref="/login"
        user={{ name: "Yuhuan", email: "you@example.com" }}
        items={[
          { key: "keys", label: "API keys", icon: KeyRound, href: "#" },
          { key: "saved", label: "Saved", icon: Bookmark, href: "#" },
          { key: "admin", label: "Admin", icon: LayoutDashboard, href: "#" },
        ]}
        onSignOut={() => {}}
        labels={{ signOut: "Sign out" }}
      />
    </div>
  );
}

export function ArchiveCalendarDemo() {
  return (
    <div className="w-full max-w-md">
      <ArchiveCalendar
        dates={[
          "2026-08-01", "2026-08-02", "2026-08-03", "2026-08-05", "2026-08-06",
          "2026-08-07", "2026-08-08", "2026-08-09", "2026-08-12", "2026-08-13",
          "2026-07-28", "2026-07-29", "2026-07-30", "2026-07-31",
        ]}
        href={(date) => `#${date}`}
        maxMonths={2}
      />
    </div>
  );
}

export function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // `href` rows render as real anchors, so ⌘-click and "open in new tab" work;
  // `onSelect` rows stay buttons. A palette usually needs both.
  const all = [
    { id: "1", title: "Button", description: "Primitives", group: "Components", href: "/docs/components/button" },
    { id: "2", title: "Marketing Hero", description: "Patterns", group: "Components", href: "/docs/patterns/marketing-hero" },
    { id: "3", title: "Agent Timeline", description: "AI", group: "Components", href: "/docs/ai/agent-timeline" },
    { id: "4", title: "Getting started", description: "Install and wire the adapter", group: "Docs", href: "/docs" },
    { id: "5", title: "Design tokens", description: "Themes and palettes", group: "Docs", href: "/docs/tokens" },
  ];
  const items = query
    ? all.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()))
    : all;
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open palette (⌘K)
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        query={query}
        onQueryChange={setQuery}
        items={items}
        empty="No matches."
        labels={{ placeholder: "Search components and docs…", title: "Search", close: "Close" }}
        footer={
          <>
            <span>{items.length} result{items.length === 1 ? "" : "s"}</span>
            <span className="flex items-center gap-3">
              <span><Kbd>↑</Kbd><Kbd>↓</Kbd> Select</span>
              <span><Kbd>Enter</Kbd> Open</span>
              <span><Kbd>Esc</Kbd> Close</span>
            </span>
          </>
        }
      />
    </>
  );
}

/** NumberInput is fully controlled — `onChange` is a function prop, so the demo
 *  has to live on the client side of the MDX boundary. */
export function NumberInputDemo() {
  const [qty, setQty] = useState(3);
  return (
    <div className="w-full max-w-xs flex flex-col gap-2">
      <NumberInput value={qty} onChange={setQty} min={0} max={10} />
      <p className="text-xs text-muted-foreground">
        Value: {qty} — clamped to 0–10, so the buttons disable at either end.
      </p>
    </div>
  );
}

export function NumberInputErrorDemo() {
  const [seats, setSeats] = useState(0);
  return (
    <div className="w-full max-w-xs">
      <NumberInput
        value={seats}
        onChange={setSeats}
        min={0}
        error={seats < 1 ? "Pick at least one seat." : undefined}
      />
    </div>
  );
}

export function SearchInputDemo() {
  const [q, setQ] = useState("");
  const items = ["Button", "Badge", "Breadcrumb", "Card", "Checkbox", "Combobox", "Dialog"];
  const hits = items.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <SearchInput value={q} onChange={setQ} placeholder="Filter components…" />
      <ul className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
        {hits.length ? hits.map((i) => <li key={i}>{i}</li>) : <li>No matches</li>}
      </ul>
    </div>
  );
}

export function SearchInputSizesDemo() {
  const [a, setA] = useState("");
  const [b, setB] = useState("tokens");
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <SearchInput value={a} onChange={setA} placeholder="Default (md)" />
      <SearchInput value={b} onChange={setB} size="sm" placeholder="Compact (sm)" />
    </div>
  );
}
