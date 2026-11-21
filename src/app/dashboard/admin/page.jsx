"use client";
import { Users, Store, Heart, ListChecks, Clock, Receipt } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { PageHeader, StatCard, StatGrid, ErrorState } from "@/components/dashboard/parts";
import { formatPrice } from "@/lib/utils";

export default function AdminOverview() {
  const { data: s, loading, error, reload } = useApi("/admin/stats");
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Platform overview" subtitle={s ? `Revenue from paid subscriptions: ${formatPrice(s.revenue)}` : " "} />
      <StatGrid>
        <StatCard loading={loading} label="Registered users" value={s?.totalUsers} icon={Users} />
        <StatCard loading={loading} label="Vendors" value={s?.totalVendors} icon={Store} />
        <StatCard loading={loading} label="Customers" value={s?.totalCustomers} icon={Heart} />
        <StatCard loading={loading} label="Services" value={s?.totalServices} icon={ListChecks} />
        <StatCard loading={loading} label="Pending services" value={s?.pendingServices} icon={Clock} />
        <StatCard loading={loading} label="Transactions" value={s?.totalTransactions} icon={Receipt} />
      </StatGrid>
    </>
  );
}
