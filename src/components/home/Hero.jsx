"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const reduce = useReducedMotion();
  const item = (i) => reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.12 * i, ease: "easeOut" } };
  return (
    <section className="relative overflow-hidden">
      <div className="container grid items-end gap-10 pt-12 md:grid-cols-[1.15fr_1fr] md:pt-16">
        <div className="pb-10 md:pb-20">
          <motion.h1 {...item(0)} className="text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            Every vendor your wedding needs, in one place.
          </motion.h1>
          <motion.p {...item(1)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Compare photographers, venues, florists, caterers and stylists, then send a booking request for your date. Vendors reply directly, and you track every request from your dashboard.
          </motion.p>
          <motion.div {...item(2)} className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg"><Link href="/services">Explore Wedding Services</Link></Button>
            <Link href="/signup" className="text-sm font-medium text-primary underline-offset-4 hover:underline">I’m a vendor — list my services</Link>
          </motion.div>
        </div>
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.9, ease: "easeOut" } })} className="relative mx-auto w-full max-w-md">
          <div className="arch aspect-[3/4] w-full bg-secondary bg-cover bg-center ring-8 ring-accent/40"
            style={{ backgroundImage: "linear-gradient(180deg, transparent 55%, hsl(300 28% 12% / .45)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80')" }}
            role="img" aria-label="A couple at their wedding ceremony" />
          <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg sm:-left-10">
            <CalendarCheck className="h-6 w-6 text-primary" />
            <div><p className="text-sm font-semibold">Request accepted</p><p className="text-xs text-muted-foreground">Garden venue · 14 Feb</p></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
