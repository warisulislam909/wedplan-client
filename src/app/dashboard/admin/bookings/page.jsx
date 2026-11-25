"use client";
import { useState } from "react";
import { qs } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import Pagination from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

export default function ManageBookings() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(`/admin/bookings${qs({ status, page })}`);

  return (
    <>
      <PageHeader title="Manage bookings" subtitle="View every booking request across the platform." />
      <div className="mb-4 max-w-xs">
        <Select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading && !data ? <TableSkeleton /> : !data?.items?.length ? <EmptyState title="No bookings found" text="Nothing matches this filter." /> : (
        <>
          <TableWrap>
            <thead><tr><Th>Customer</Th><Th>Vendor</Th><Th>Service</Th><Th>Event date</Th><Th>Amount</Th><Th>Status</Th><Th>Created</Th></tr></thead>
            
              <tbody>
  {data.items.map((b) => {
    const amount = b.amount ?? b.price;
    return (
      <tr key={b._id}>
        <Td><p>{b.customer?.name || "—"}</p><p className="text-xs text-muted-foreground">{b.customer?.email}</p></Td>
        <Td><p>{b.vendor?.businessName || b.vendor?.name || "—"}</p><p className="text-xs text-muted-foreground">{b.vendor?.email}</p></Td>
        <Td>{b.serviceName || "—"}</Td>
        <Td>{fmtDate(b.eventDate || b.date)}</Td>
        <Td>{amount != null ? formatPrice(amount) : "—"}</Td>
        <Td><StatusBadge status={b.status} /></Td>
        <Td>{fmtDate(b.createdAt)}</Td>
      </tr>
    );
  })}
</tbody>
            
          </TableWrap>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}