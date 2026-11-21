import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <XCircle className="mx-auto h-14 w-14 text-muted-foreground" />
        <h1 className="mt-4 text-4xl font-semibold">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">No charge was made and your plan hasn’t changed. You can upgrade whenever you’re ready.</p>
        <Button asChild className="mt-6"><Link href="/dashboard/vendor/subscription">Back to subscription</Link></Button>
      </div>
    </div>
  );
}
