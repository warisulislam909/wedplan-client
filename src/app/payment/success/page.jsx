"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

function Success() {
  const sessionId = useSearchParams().get("session_id");
  const [tx, setTx] = useState({ status: sessionId ? "processing" : "missing" });

  // Premium এখানে activate হয় না — webhook DB আপডেট করার পর এই পেজ শুধু status পড়ে
  useEffect(() => {
    if (!sessionId) return;
    let tries = 0, timer;
    const poll = async () => {
      try {
        const r = await api(`/payments/session/${sessionId}`);
        if (r.status !== "processing" || ++tries > 15) return setTx(r.status === "processing" ? { status: "delayed" } : r);
        setTx(r);
      } catch { if (++tries > 3) return setTx({ status: "delayed" }); }
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [sessionId]);

  const paid = tx.status === "paid";
  const waiting = tx.status === "processing";
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        {paid ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /> : waiting ? <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" /> : <XCircle className="mx-auto h-14 w-14 text-amber-600" />}
        <h1 className="mt-4 text-4xl font-semibold">{paid ? "Payment confirmed" : waiting ? "Confirming your payment" : tx.status === "delayed" ? "Still confirming" : "Payment not confirmed"}</h1>
        <p className="mt-2 text-muted-foreground">
          {paid ? `Your Premium plan is active. ${formatPrice(tx.amount, (tx.currency || "usd").toUpperCase())} received.`
            : waiting ? "Stripe is confirming the payment. This usually takes a few seconds."
            : tx.status === "delayed" ? "Your payment is taking longer than usual. Premium turns on automatically once Stripe confirms it. Check your Subscription page shortly."
            : "We couldn’t verify a payment for this session."}
        </p>
        <Button asChild className="mt-6"><Link href="/dashboard/vendor/subscription">Go to subscription</Link></Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense><Success /></Suspense>;
}
