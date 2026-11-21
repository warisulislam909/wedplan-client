"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { useApi } from "@/hooks/useApi";

export default function Categories() {
  const { data } = useApi("/categories", { auth: false });
  const counts = Object.fromEntries((data || []).map((c) => [c.name, c.count]));
  return (
    <section className="container mt-12 md:mt-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-4xl font-semibold">Start with what you need first</h2>
        <p className="mt-2 text-muted-foreground">Pick a category to see approved vendors and compare prices.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ name, icon: Icon, blurb }, i) => (
          <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.05 }}>
            <Link href={`/services?category=${encodeURIComponent(name)}`} className="arch group flex h-full flex-col items-center border border-border bg-card px-3 pb-6 pt-10 text-center transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <Icon className="h-8 w-8 text-primary group-hover:text-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold leading-tight">{name}</h3>
              <p className="mt-1 text-xs text-muted-foreground group-hover:text-primary-foreground/80">{blurb}</p>
              {data && <p className="mt-3 text-xs font-medium">{counts[name] || 0} services</p>}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
