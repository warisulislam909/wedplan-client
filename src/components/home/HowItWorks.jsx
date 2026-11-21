"use client";
import { motion } from "framer-motion";

const steps = [
  { title: "Browse and filter", text: "Search by name, category and location. Sort by price to fit your budget." },
  { title: "Send a booking request", text: "Pick your event date, add the venue and a short message for the vendor." },
  { title: "Track the response", text: "See pending, accepted or rejected from your dashboard. Cancel while it’s pending." },
];

export default function HowItWorks() {
  return (
    <section className="container mt-24">
      <h2 className="max-w-xl text-4xl font-semibold">How WedPlan works</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }} className="relative border-t-2 border-primary pt-5">
            <span className="font-display text-5xl text-accent">{i + 1}</span>
            <h3 className="mt-2 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
