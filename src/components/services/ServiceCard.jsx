"use client";
import Link from "next/link";
import { useState } from "react";
import { MapPin, BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, PLACEHOLDER_IMG } from "@/lib/utils";

export default function ServiceCard({ service }) {
  const [src, setSrc] = useState(service.images?.[0] || PLACEHOLDER_IMG);
  const v = service.vendor || {};
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={service.serviceName} loading="lazy" onError={() => setSrc(PLACEHOLDER_IMG)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Badge className="absolute left-3 top-3 bg-card/95">{service.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-xl font-semibold">{service.serviceName}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {service.location}</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Avatar src={v.image} name={v.businessName || v.name || "V"} className="h-6 w-6 text-[10px]" />
          <span className="truncate">{v.businessName || v.name}</span>
          {v.isPremium && <Badge variant="gold" title="Premium vendor"><BadgeCheck className="h-3 w-3" /> Premium</Badge>}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-lg font-semibold text-primary">{formatPrice(service.price)}</p>
          <Button asChild size="sm"><Link href={`/services/${service._id}`}>View Details</Link></Button>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4"><div className="h-5 w-3/4 animate-pulse rounded bg-muted" /><div className="h-4 w-1/2 animate-pulse rounded bg-muted" /><div className="h-8 w-full animate-pulse rounded bg-muted" /></div>
    </div>
  );
}
