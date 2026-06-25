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
  CategoryFilter,
  Sidebar,
  type SidebarSection,
} from "yunui/patterns";
import { Switch, Checkbox, Pagination, NavTabs, Combobox, CustomSelect, SegmentedSelect, Modal, Sheet, ConfirmModal, toast, Button } from "yunui";
import { CapabilitySelector, LanguageSwitcher } from "yunui/ai";
import { Coins, LayoutGrid, List, Table, ShieldAlert, Image as ImageIcon, PanelLeft } from "lucide-react";

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
  // Drive with isOpen (not collapsed/lg:translate-x-0) so the sidebar is visible
  // at all widths — collapsed left the preview empty on mobile.
  const [open, setOpen] = useState(true);
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
      className="relative w-full rounded-2xl border border-border overflow-hidden bg-(--bg-elevated)"
      style={{ height: 360, transform: "translateZ(0)" }}
    >
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
      <button
        onClick={() => setOpen((o) => !o)}
        className={`absolute top-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-all ${open ? "left-[17rem]" : "left-3"}`}
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={16} />
      </button>
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
