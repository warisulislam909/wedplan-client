"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/parts";
import { Card, CardContent } from "@/components/ui/card";
import ServiceForm from "@/components/services/ServiceForm";

export default function AddService() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(false);

  async function create(data) {
    setBusy(true);
    try {
      await api("/vendor/services", { method: "POST", body: data });
      toast.success("Service submitted for admin review");
      router.push("/dashboard/vendor/services");
    } catch (e) {
      if (e.code === "PLAN_LIMIT") setLimit(true);
      toast.error(e.message);
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Add a service" subtitle="New services start as Pending until an admin approves them." />
      {limit && <div className="mb-4 max-w-2xl rounded-lg border border-accent bg-accent/15 p-4 text-sm">You’ve reached the Free plan limit of 3 active services. <Link href="/dashboard/vendor/subscription" className="font-semibold text-primary underline">Upgrade to Premium</Link> to publish unlimited services.</div>}
      <Card className="max-w-2xl"><CardContent><ServiceForm onSubmit={create} submitting={busy} submitLabel="Submit service" /></CardContent></Card>
    </>
  );
}
