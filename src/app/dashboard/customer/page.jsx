"use client";
import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { PageHeader, StatCard, StatGrid, ErrorState } from "@/components/dashboard/parts";

export default function CustomerOverview() {
  const { data: s, loading, error, reload } = useApi("/customer/stats");
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Your bookings at a glance" subtitle="Track every request you’ve sent to vendors." />
      <StatGrid>
        <StatCard loading={loading} label="Total booking requests" value={s?.total} icon={ClipboardList} />
        <StatCard loading={loading} label="Pending" value={s?.pending} icon={Clock} />
        <StatCard loading={loading} label="Accepted" value={s?.accepted} icon={CheckCircle2} />
        <StatCard loading={loading} label="Rejected" value={s?.rejected} icon={XCircle} />
      </StatGrid>
    </>
  );
}
