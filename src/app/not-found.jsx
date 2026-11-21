import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page isn’t on the guest list</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The link may be broken or the page may have moved. Head back to browse wedding services.</p>
      <Button asChild className="mt-6"><Link href="/services">Browse services</Link></Button>
    </div>
  );
}
