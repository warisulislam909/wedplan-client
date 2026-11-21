"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default function VendorBookings() {
  const { data, loading, error, reload } = useApi("/vendor/bookings");
  const [busy, setBusy] = useState(null);

  async function respond(b, action) {
    setBusy(b._id + action);
    try { await api(`/vendor/bookings/${b._id}`, { method: "PATCH", body: { action } }); toast.success(action === "accept" ? "Booking accepted" : "Booking rejected"); }
    catch (e) { toast.error(e.message); } finally { setBusy(null); reload(); }
  }

  return (
    <>
      <PageHeader title="Booking requests" subtitle="Accept or reject pending requests. A decision can’t be changed afterwards." />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.length ? (
        <EmptyState title="No booking requests yet" text="When customers request your services, they’ll show up here." />
      ) : (
        <TableWrap>
          <thead><tr><Th>Customer</Th><Th>Service</Th><Th>Event</Th><Th>Message</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {data.map((b) => (
              <tr key={b._id}>
                <Td><div className="flex items-center gap-2"><Avatar src={b.customer?.image} name={b.customer?.name} className="h-8 w-8 text-[10px]" /><div><p className="font-medium">{b.customer?.name}</p><p className="text-xs text-muted-foreground">{b.customer?.email}</p></div></div></Td>
                <Td>{b.service?.serviceName}</Td>
                <Td><p>{formatDate(b.eventDate)}</p><p className="text-xs text-muted-foreground">{b.eventLocation}</p></Td>
                <Td className="max-w-[220px]"><p className="line-clamp-2 text-muted-foreground">{b.message || "—"}</p></Td>
                <Td><StatusBadge status={b.status} /></Td>
                <Td>{b.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" loading={busy === b._id + "accept"} disabled={!!busy} onClick={() => respond(b, "accept")}><Check className="h-3.5 w-3.5" /> Accept</Button>
                    <Button size="sm" variant="outline" loading={busy === b._id + "reject"} disabled={!!busy} onClick={() => respond(b, "reject")}><X className="h-3.5 w-3.5" /> Reject</Button>
                  </div>
                ) : <span className="text-xs text-muted-foreground">Closed</span>}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
