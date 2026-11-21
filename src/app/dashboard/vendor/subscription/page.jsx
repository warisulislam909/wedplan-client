"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, ErrorState } from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/skeleton";
import { formatDate, cn } from "@/lib/utils";

const FREE = ["Maximum 3 active services", "Basic vendor dashboard", "Booking request management"];
const PREMIUM = ["Unlimited active services", "Premium Vendor badge", "All Free plan features"];

function Plan({ title, price, features, current, children, highlight }) {
  return (
    <div className={cn("flex flex-col rounded-lg border bg-card p-6", highlight ? "border-primary ring-1 ring-primary" : "border-border")}>
      <div className="flex items-center justify-between"><h2 className="text-3xl font-semibold">{title}</h2>{current && <Badge variant="success">Current plan</Badge>}</div>
      <p className="mt-2 font-display text-4xl font-semibold text-primary">{price}</p>
      <ul className="mt-5 space-y-2 text-sm">{features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 translate-y-0.5 text-emerald-600" /> {f}</li>)}</ul>
      <div className="mt-auto pt-6">{children}</div>
    </div>
  );
}

export default function Subscription() {
  const { data: me, loading, error, reload } = useApi("/me");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const premium = me.subscriptionPlan === "premium";

  async function upgrade() {
    setBusy(true);
    try { const { url } = await api("/payments/checkout", { method: "POST" }); window.location.href = url; }
    catch (e) { toast.error(e.message); setBusy(false); }
  }
  async function cancel() {
    setBusy(true);
    try { const r = await api("/payments/cancel", { method: "POST" }); toast.success(r.message); setConfirm(false); reload(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Subscription" subtitle={premium ? `Premium is active until ${formatDate(me.subscriptionExpiresAt)}${me.cancelAtPeriodEnd ? " and will not renew." : "."}` : "Upgrade to publish unlimited services."} />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Plan title="Free" price="$0" features={FREE} current={!premium}>
          {!premium && <p className="text-sm text-muted-foreground">You’re on the Free plan.</p>}
        </Plan>
        <Plan title="Premium" price={<>$9.99<span className="text-base font-normal text-muted-foreground"> / month</span></>} features={PREMIUM} current={premium} highlight>
          {premium ? (
            me.cancelAtPeriodEnd ? <p className="text-sm text-muted-foreground">Cancellation scheduled. Premium stays until {formatDate(me.subscriptionExpiresAt)}.</p>
              : <Button variant="outline" onClick={() => setConfirm(true)}>Cancel subscription</Button>
          ) : <Button variant="gold" className="w-full" loading={busy} onClick={upgrade}><Crown className="h-4 w-4" /> Upgrade to Premium</Button>}
        </Plan>
      </div>
      <p className="mt-4 max-w-4xl text-xs text-muted-foreground">Payments run in Stripe test mode. Premium turns on only after Stripe confirms the payment to our server.</p>
      <ConfirmModal open={confirm} onClose={() => setConfirm(false)} onConfirm={cancel} loading={busy} destructive title="Cancel Premium?" message="You’ll keep Premium until the end of the current billing period, then return to the Free plan." confirmLabel="Cancel subscription" />
    </>
  );
}
