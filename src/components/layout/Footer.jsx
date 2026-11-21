import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Navbar";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">Find trusted photographers, venues, florists, caterers and more — and book them in a few clicks.</p>
          <div className="mt-5 flex gap-3">
            {[[Facebook, "Facebook"], [Instagram, "Instagram"], [Youtube, "YouTube"]].map(([Icon, label]) => (
              <a key={label} href="#" aria-label={label} className="rounded-full border border-white/20 p-2 hover:bg-white/10"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white">Become a Vendor</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => <li key={c.name}><Link href={`/services?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 translate-y-0.5" /> House 12, Road 5, Khulna, Bangladesh</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 translate-y-0.5" /> +8801601111162</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 translate-y-0.5" />mdwarisulislam88@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} WedPlan. All rights reserved.</div>
    </footer>
  );
}
