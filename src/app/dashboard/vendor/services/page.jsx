"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import ServiceForm from "@/components/services/ServiceForm";
import { formatPrice, PLACEHOLDER_IMG } from "@/lib/utils";

export default function MyServices() {
  const { data, loading, error, reload } = useApi("/vendor/services");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save(body) {
    setBusy(true);
    try { await api(`/vendor/services/${edit._id}`, { method: "PUT", body }); toast.success("Service updated"); setEdit(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true);
    try { await api(`/vendor/services/${del._id}`, { method: "DELETE" }); toast.success("Service deleted"); setDel(null); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }
  async function toggle(s) {
    try { await api(`/vendor/services/${s._id}/availability`, { method: "PATCH", body: { isActive: !s.isActive } }); toast.success(s.isActive ? "Service paused" : "Service is available again"); reload(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="My services" subtitle="Only approved and available services appear to customers." action={<Button asChild><Link href="/dashboard/vendor/add-service">Add service</Link></Button>} />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.length ? (
        <EmptyState title="No services yet" text="Publish your first service to start receiving booking requests." action={<Button asChild><Link href="/dashboard/vendor/add-service">Add service</Link></Button>} />
      ) : (
        <TableWrap>
          <thead><tr><Th>Service</Th><Th>Category</Th><Th>Price</Th><Th>Approval</Th><Th>Availability</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {data.map((s) => (
              <tr key={s._id}>
                <Td><div className="flex items-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={s.images?.[0] || PLACEHOLDER_IMG} alt="" className="h-12 w-16 rounded object-cover" /><div><p className="font-medium">{s.serviceName}</p><p className="text-xs text-muted-foreground">{s.location}</p></div></div></Td>
                <Td>{s.category}</Td><Td>{formatPrice(s.price)}</Td>
                <Td><StatusBadge status={s.status} /></Td>
                <Td>{s.status === "rejected" ? <Badge variant="neutral">Hidden</Badge> : <button onClick={() => toggle(s)} className="rounded-full focus-visible:ring-2" aria-label="Toggle availability"><StatusBadge status={s.isActive ? "active" : "inactive"} /></button>}</Td>
                <Td><div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDel(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit service" className="sm:max-w-2xl">
        {edit && <ServiceForm initial={{ serviceName: edit.serviceName, category: edit.category, description: edit.description, price: edit.price, location: edit.location, images: edit.images }} onSubmit={save} submitting={busy} submitLabel="Save changes" />}
      </Modal>
      <ConfirmModal open={!!del} onClose={() => setDel(null)} onConfirm={remove} loading={busy} destructive title="Delete this service?" message={`“${del?.serviceName}” will be permanently removed.`} confirmLabel="Delete" />
    </>
  );
}
