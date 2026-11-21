"use client";
import Link from "next/link";
import { Package, CheckCircle2, Clock, CalendarCheck, Crown } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { PageHeader, StatCard, StatGrid, ErrorState } from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";

export default function VendorOverview() {
  const { data: s, loading, error, reload } = useApi("/vendor/stats");
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Vendor overview" subtitle="A snapshot of your services and booking requests." action={<Button asChild><Link href="/dashboard/vendor/add-service">Add service</Link></Button>} />
      <StatGrid>
        <StatCard loading={loading} label="Total services" value={s?.totalServices} icon={Package} />
        <StatCard loading={loading} label="Active services" value={s?.activeServices} icon={CheckCircle2} />
        <StatCard loading={loading} label="Pending booking requests" value={s?.pendingBookings} icon={Clock} />
        <StatCard loading={loading} label="Accepted bookings" value={s?.acceptedBookings} icon={CalendarCheck} />
        <StatCard loading={loading} label="Current plan" value={s ? (s.plan === "premium" ? "Premium" : "Free") : ""} icon={Crown} />
      </StatGrid>
    </>
  );
}
