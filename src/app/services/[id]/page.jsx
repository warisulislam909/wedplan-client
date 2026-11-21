"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BadgeCheck, MapPin, ShieldAlert, FileQuestion } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import BookingForm from "@/components/services/BookingForm";
import { formatPrice, PLACEHOLDER_IMG, cn } from "@/lib/utils";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { data: s, loading, error } = useApi(session ? `/services/${id}` : null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (isPending || (session && loading)) return <Spinner label="Loading service…" />;
  if (!session) { router.replace(`/signin?redirect=/services/${id}`); return <Spinner label="Redirecting to sign in…" />; }
  if (error) {
    const missing = error.status === 400 || error.status === 404;
    const Icon = missing ? FileQuestion : ShieldAlert;
    return (
      <div className="container flex min-h-[55vh] flex-col items-center justify-center text-center">
        <Icon className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-3 text-3xl font-semibold">{missing ? "Service not found" : "Can’t show this service"}</h1>
        <p className="mt-1 text-muted-foreground">{missing ? "This service doesn’t exist or is no longer available." : error.message}</p>
        <Button asChild className="mt-5"><Link href="/services">Back to services</Link></Button>
      </div>
    );
  }

  const user = session.user;
  const images = s.images?.length ? s.images : [PLACEHOLDER_IMG];
  const isOwner = String(s.vendor?.id) === String(user.id);
  const note = !s.bookable ? "This service is not currently available for booking."
    : user.role === "admin" ? "Admin accounts can’t submit booking requests."
    : isOwner ? "You can’t book your own service."
    : user.role === "vendor" ? "Vendor accounts can’t submit booking requests. Sign in with a customer account to book."
    : null;

  return (
    <div className="container py-10">
      <Link href="/services" className="text-sm text-primary hover:underline">← All services</Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[active]} alt={`${s.serviceName} photo ${active + 1}`} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((src, i) => (
                <button key={src} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} className={cn("h-20 w-24 shrink-0 overflow-hidden rounded-md border-2", i === active ? "border-primary" : "border-transparent opacity-70")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Badge>{s.category}</Badge>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{s.serviceName}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {s.location}</p>
          <p className="mt-5 text-3xl font-semibold text-primary">{formatPrice(s.price)} <span className="text-sm font-normal text-muted-foreground">starting price</span></p>
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <Avatar src={s.vendor?.image} name={s.vendor?.businessName || s.vendor?.name} className="h-11 w-11" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold">{s.vendor?.businessName || s.vendor?.name}{s.vendor?.isPremium && <Badge variant="gold"><BadgeCheck className="h-3 w-3" /> Premium</Badge>}</p>
              <p className="text-sm text-muted-foreground">Vendor</p>
            </div>
          </div>
          <div className="mt-6">
            {note ? <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{note}</p> : <Button size="lg" className="w-full" onClick={() => setOpen(true)}>Book this service</Button>}
          </div>
        </div>
      </div>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-3xl font-semibold">About this service</h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/85">{s.description}</p>
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="Request a booking">
        <BookingForm serviceId={s._id} onDone={() => { setOpen(false); router.push("/dashboard/customer/bookings"); }} />
      </Modal>
    </div>
  );
}
