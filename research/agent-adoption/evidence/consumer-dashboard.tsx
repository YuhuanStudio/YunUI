import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@yuhuanowo/yunui";
import { PageEmptyState, PageHeader, StatCard } from "@yuhuanowo/yunui/patterns";
import "./index.css";

type Status = "Completed" | "In progress" | "Needs review";
type RecordItem = {
  id: string;
  name: string;
  initials: string;
  owner: string;
  email: string;
  status: Status;
  date: string;
  amount: string;
  description: string;
};

const records: RecordItem[] = [
  { id: "INV-2084", name: "Northstar Studio", initials: "NS", owner: "Maya Chen", email: "maya@northstar.studio", status: "Completed", date: "Oct 01, 2026", amount: "$4,800.00", description: "Brand identity and product design retainer for September." },
  { id: "INV-2083", name: "Fieldwork Co.", initials: "FW", owner: "Theo Park", email: "theo@fieldwork.co", status: "In progress", date: "Sep 30, 2026", amount: "$2,250.00", description: "Research and prototype milestone for the customer portal." },
  { id: "INV-2082", name: "Common Ground", initials: "CG", owner: "Ari Rivera", email: "ari@commonground.org", status: "Needs review", date: "Sep 29, 2026", amount: "$6,100.00", description: "Editorial system delivery awaiting a final client review." },
  { id: "INV-2081", name: "Soft Services", initials: "SS", owner: "Jules Wang", email: "jules@softservices.io", status: "Completed", date: "Sep 27, 2026", amount: "$1,875.00", description: "Monthly product support and accessibility improvements." },
  { id: "INV-2080", name: "Elsewhere Objects", initials: "EO", owner: "Nina Patel", email: "nina@elsewhere.design", status: "In progress", date: "Sep 26, 2026", amount: "$3,420.00", description: "E-commerce refresh, currently in implementation." },
  { id: "INV-2079", name: "Good Measure", initials: "GM", owner: "Sam Lee", email: "sam@goodmeasure.co", status: "Completed", date: "Sep 24, 2026", amount: "$950.00", description: "Analytics dashboard refinements and documentation." },
];

const statusVariant: Record<Status, "success" | "info" | "warning"> = {
  Completed: "success",
  "In progress": "info",
  "Needs review": "warning",
};

function Dashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const visibleRecords = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.id} ${record.name} ${record.owner} ${record.status}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All" || record.status === filter);
  }), [query, filter]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 text-foreground sm:px-8 sm:py-10">
      <div className="mb-10 flex items-center justify-between border-b border-border pb-5">
        <a className="flex items-center gap-2.5 font-semibold tracking-tight" href="#workspace" aria-label="Studio home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-sm text-background">G</span>
          <span>Goodwork<span className="text-muted-foreground"> / Studio</span></span>
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">Tuesday, October 1</span>
          <Avatar aria-label="Profile: Alex Morgan" className="h-9 w-9"><AvatarFallback className="text-xs">AM</AvatarFallback></Avatar>
        </div>
      </div>

      <section className="space-y-7">
        <PageHeader
          title="Workspace"
          description="A clear view of your client work and what needs your attention."
          actions={<Button variant="secondary" size="sm" onClick={() => window.print()}>↓ Export</Button>}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total revenue" value="$19,395" subtext="Across 6 recent invoices" tone="success" />
          <StatCard label="Open projects" value="3" subtext="1 item needs your review" tone="info" />
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold">Recent records</h2>
              <p className="mt-1 text-sm text-muted-foreground">Track invoices and project activity.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-64"><Input aria-label="Search records" placeholder="Search records…" icon={<span aria-hidden="true">⌕</span>} value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <div className="flex flex-wrap gap-1" aria-label="Filter by status">
                {(["All", "In progress", "Needs review", "Completed"] as const).map((status) => (
                  <Button key={status} size="sm" variant={filter === status ? "secondary" : "ghost"} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status}</Button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table scrollLabel="Recent records">
              <Thead><Tr><Th>Record</Th><Th>Owner</Th><Th>Status</Th><Th>Date</Th><Th className="text-right">Amount</Th><Th><span className="sr-only">Actions</span></Th></Tr></Thead>
              <Tbody>
                {visibleRecords.map((record) => (
                  <Tr key={record.id}>
                    <Td><div className="flex min-w-48 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold">{record.initials}</span><span><span className="block font-medium text-foreground">{record.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{record.id}</span></span></div></Td>
                    <Td><span className="whitespace-nowrap">{record.owner}</span></Td>
                    <Td><Badge variant={statusVariant[record.status]}>{record.status}</Badge></Td>
                    <Td><span className="whitespace-nowrap text-muted-foreground">{record.date}</span></Td>
                    <Td className="text-right font-medium tabular-nums">{record.amount}</Td>
                    <Td><Button size="sm" variant="ghost" onClick={() => setSelected(record)}>View ↗</Button></Td>
                  </Tr>
                ))}
                {visibleRecords.length === 0 && <Tr><Td colSpan={6}><PageEmptyState title="No records found" description="Try another search or status filter." action={<Button size="sm" variant="secondary" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters</Button>} /></Td></Tr>}
              </Tbody>
            </Table>
          </div>
          <div className="flex flex-col gap-2 border-t border-border px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Showing {visibleRecords.length} of {records.length} records</span>
            <span>Updated just now</span>
          </div>
        </Card>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          {selected && <>
            <DialogHeader>
              <div className="mb-3"><Badge variant={statusVariant[selected.status]}>{selected.status}</Badge></div>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>{selected.id} · {selected.date}</DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-6 text-muted-foreground">{selected.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/60 p-4 text-sm">
              <div><dt className="text-muted-foreground">Owner</dt><dd className="mt-1 font-medium">{selected.owner}</dd></div>
              <div><dt className="text-muted-foreground">Amount</dt><dd className="mt-1 font-medium">{selected.amount}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Contact</dt><dd className="mt-1 font-medium">{selected.email}</dd></div>
            </dl>
            <DialogFooter><Button variant="secondary" onClick={() => setSelected(null)}>Done</Button></DialogFooter>
          </>}
        </DialogContent>
      </Dialog>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Dashboard /></StrictMode>);
