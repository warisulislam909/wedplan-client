"use client";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import ServiceCard, { ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";

export default function FeaturedServices() {
  const { data, loading, error, reload } = useApi("/services/featured", { auth: false });
  return (
    <section className="container mt-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-4xl font-semibold">Featured wedding services</h2><p className="mt-2 text-muted-foreground">Newly approved vendors, ready to take bookings.</p></div>
        <Button asChild variant="outline"><Link href="/services">See all services</Link></Button>
      </div>
      {error ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center"><p className="text-muted-foreground">{error.message}</p><Button className="mt-4" onClick={reload}>Retry</Button></div>
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}</div>
      ) : data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((s) => <ServiceCard key={s._id} service={s} />)}</div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">No approved services yet. Check back soon.</div>
      )}
    </section>
  );
}
