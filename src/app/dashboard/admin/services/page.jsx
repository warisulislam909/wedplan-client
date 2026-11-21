"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Check, X, Trash2 } from "lucide-react";
import { api, qs } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { CATEGORY_NAMES } from "@/lib/constants";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import Pagination from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ConfirmModal } from "@/components/ui/modal";
import { formatPrice, PLACEHOLDER_IMG } from "@/lib/utils";

export default function ManageServices() {
  const [q, setQ] = useState(""), [dq, setDq] = useState(""), [status, setStatus] = useState("all"), [category, setCategory] = useState("all"), [page, setPage] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useApi(`/admin/services${qs({ q: dq, status, category, page })}`);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  async function setState(s, status) {
    try { await api(`/admin/services/${s._id}/status`, { method: "PATCH", body: { status } }); toast.success(`Service ${status}`); reload(); }
    catch (e) { toast.error(e.message); }
  }
  async function remove() {
    setBusy(true);
    try { await api(`/admin/services/${del._id}`, { method: "DELETE" }); toast.success("Service deleted"); setDel(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Manage services" subtitle="Review pending services and moderate published ones." />
      <div className="mb-4 grid gap-3 sm:grid-cols-[2fr_1fr_1.4fr]">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search by service name" aria-label="Search services" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></Select>
        <Select aria-label="Category" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}><option value="all">All categories</option>{CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}</Select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.items?.length ? <EmptyState title="No services found" text="Nothing matches these filters." /> : (
        <>
          <TableWrap>
            <thead><tr><Th>Service</Th><Th>Vendor</Th><Th>Price</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s._id}>
                  <Td><div className="flex items-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={s.images?.[0] || PLACEHOLDER_IMG} alt="" className="h-12 w-16 rounded object-cover" /><div><p className="font-medium">{s.serviceName}</p><p className="text-xs text-muted-foreground">{s.category} · {s.location}</p></div></div></Td>
                  <Td><p>{s.vendor?.businessName || s.vendor?.name}</p><p className="text-xs text-muted-foreground">{s.vendor?.email}</p></Td>
                  <Td>{formatPrice(s.price)}</Td>
                  <Td><StatusBadge status={s.status} /></Td>
                  <Td><div className="flex flex-wrap gap-1.5">
                    {s.status !== "approved" && <Button size="sm" onClick={() => setState(s, "approved")}><Check className="h-3.5 w-3.5" /> Approve</Button>}
                    {s.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setState(s, "rejected")}><X className="h-3.5 w-3.5" /> Reject</Button>}
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDel(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div></Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} loading={busy} destructive title="Delete this service?" message={`“${del?.serviceName}” will be permanently removed from the platform.`} confirmLabel="Delete" />
    </>
  );
}
