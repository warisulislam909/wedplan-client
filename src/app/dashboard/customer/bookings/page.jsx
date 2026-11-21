"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MapPin, CalendarDays } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/parts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { formatDate, formatPrice, PLACEHOLDER_IMG } from "@/lib/utils";

export default function MyBookings() {
  const { data, loading, error, reload } = useApi("/customer/bookings");
  const [view, setView] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  async function doCancel() {
    setBusy(true);
    try { await api(`/customer/bookings/${cancel._id}/cancel`, { method: "PATCH" }); toast.success("Booking request cancelled"); setCancel(null); reload(); }
    catch (e) { toast.error(e.message); setCancel(null); reload(); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="My bookings" subtitle="Cancel a request while it’s still pending." />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.length ? (
        <EmptyState title="No booking requests yet" text="Find a vendor you like and send your first request." action={<Button asChild><Link href="/services">Browse services</Link></Button>} />
      ) : (
        <div className="grid gap-4">
          {data.map((b) => (
            <div key={b._id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.service?.images?.[0] || PLACEHOLDER_IMG} alt="" className="h-28 w-full rounded-md object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold">{b.service?.serviceName || "Service removed"}</h3><StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-muted-foreground">by {b.vendor?.businessName || b.vendor?.name || "Vendor"}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4 text-primary" /> {formatDate(b.eventDate)}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {b.eventLocation}</span>
                  <span className="text-muted-foreground">Requested {formatDate(b.createdAt)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setView(b)}>View details</Button>
                  {b.status === "pending" && <Button size="sm" variant="destructive" onClick={() => setCancel(b)}>Cancel request</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title="Booking details">
        {view && (
          <dl className="space-y-3 text-sm">
            {[["Service", view.service?.serviceName], ["Category", view.service?.category], ["Starting price", view.service?.price ? formatPrice(view.service.price) : "—"], ["Vendor", view.vendor?.businessName || view.vendor?.name], ["Event date", formatDate(view.eventDate)], ["Event location", view.eventLocation], ["Your message", view.message || "—"], ["Requested on", formatDate(view.createdAt)]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
            <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={view.status} /></dd></div>
          </dl>
        )}
      </Modal>
      <ConfirmModal open={!!cancel} onClose={() => setCancel(null)} onConfirm={doCancel} loading={busy} destructive title="Cancel this request?" message={`Your request for ${cancel?.service?.serviceName || "this service"} will be cancelled. This can’t be undone.`} confirmLabel="Cancel request" />
    </>
  );
}
