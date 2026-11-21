"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/skeleton";

// Role অনুযায়ী redirect
export default function DashboardIndex() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (isPending) return;
    router.replace(session ? `/dashboard/${session.user.role || "customer"}` : "/signin?redirect=/dashboard");
  }, [session, isPending, router]);
  return <Spinner label="Taking you to your dashboard…" className="min-h-[60vh]" />;
}
