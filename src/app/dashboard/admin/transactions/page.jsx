"use client";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import Pagination from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

// Read-only: admin কোনো payment record বদলাতে পারে না (UI বা API কোনোটিতেই)
export default function Transactions() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi(`/admin/transactions?page=${page}`);
  return (
    <>
      <PageHeader title="Transactions" subtitle="Subscription payments recorded from verified Stripe events. Read-only." />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.items?.length ? <EmptyState title="No transactions yet" text="Payments appear here after a vendor upgrades to Premium." /> : (
        <>
          <TableWrap>
            <thead><tr><Th>Vendor</Th><Th>Plan</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th></tr></thead>
            <tbody>
              {data.items.map((t) => (
                <tr key={t._id}>
                  <Td><p className="font-medium">{t.vendor?.name || "Deleted user"}</p><p className="text-xs text-muted-foreground">{t.vendor?.email}</p></Td>
                  <Td className="capitalize">{t.plan}</Td>
                  <Td>{formatPrice(t.amount, (t.currency || "usd").toUpperCase())}</Td>
                  <Td><StatusBadge status={t.status} /></Td>
                  <Td>{formatDate(t.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}
