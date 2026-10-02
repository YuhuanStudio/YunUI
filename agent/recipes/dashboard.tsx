"use client";

import { useState } from "react";
import { Button, Card, Dialog, DialogContent, DialogDescription, DialogTitle, EmptyState, Input, Table, Tbody, Td, Th, Thead, Tr } from "@yuhuanowo/yunui";
import { PageHeader, StatCard } from "@yuhuanowo/yunui/patterns";

export interface DashboardRecord { id: string; name: string; status: string }

/** Host-owned filtering and state, with library-owned controls and surfaces. */
export function YunUIDashboard({ records }: { records: DashboardRecord[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DashboardRecord | null>(null);
  const visible = records.filter(record => record.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <PageHeader title="Workspace" description="Your records and current activity." />
      <StatCard label="Records" value={records.length} />
      <Input aria-label="Filter records" placeholder="Search records" value={query} onChange={event => setQuery(event.target.value)} />
      <Card className="p-4">
        <Table scrollLabel="Records table">
          <Thead><Tr><Th>Name</Th><Th>Status</Th><Th>Details</Th></Tr></Thead>
          <Tbody>{visible.map(record => (
            <Tr key={record.id}>
              <Td>{record.name}</Td><Td>{record.status}</Td>
              <Td><Button size="sm" variant="secondary" onClick={() => setSelected(record)}>View</Button></Td>
            </Tr>
          ))}{visible.length === 0 && <Tr><Td colSpan={3}><EmptyState title="No records" description="Try a different search." /></Td></Tr>}</Tbody>
        </Table>
      </Card>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogTitle>{selected?.name ?? "Record details"}</DialogTitle>
          <DialogDescription>{selected?.status}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
