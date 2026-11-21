"use client";
import { motion } from "framer-motion";
import { ShieldCheck, MessagesSquare, BadgeCheck, Wallet } from "lucide-react";

const points = [
  { icon: ShieldCheck, title: "Every listing is reviewed", text: "Admins approve each service before it appears, so you only see active vendors." },
  { icon: Wallet, title: "Prices up front", text: "Compare starting prices and locations side by side before you send a request." },
  { icon: MessagesSquare, title: "One request, one answer", text: "Share your date, venue and notes once. The vendor accepts or declines." },
  { icon: BadgeCheck, title: "Premium vendors stand out", text: "Vendors on Premium carry a badge so you can spot established businesses." },
];

export default function WhyChoose() {
  return (
    <section className="mt-24 bg-secondary/60 py-16">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">Why couples plan with WedPlan</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Planning a wedding means dozens of messages and spreadsheets. We keep the vendor search and the booking status in one tidy place.</p>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {points.map(({ icon: Icon, title, text }, i) => (
            <motion.li key={title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="flex gap-5 py-6">
              <Icon className="mt-1 h-7 w-7 shrink-0 text-primary" aria-hidden />
              <div><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-1 text-muted-foreground">{text}</p></div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
