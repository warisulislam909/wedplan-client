"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, PlusCircle, CalendarCheck, Crown, UserCog, Users, ListChecks, Receipt, CalendarHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = {
  vendor: [
    ["", "Overview", LayoutDashboard], ["/services", "My Services", Package], ["/add-service", "Add Service", PlusCircle],
    ["/bookings", "Booking Requests", CalendarCheck], ["/subscription", "Subscription", Crown], ["/profile", "Profile Settings", UserCog],
  ],
  customer: [["", "Overview", LayoutDashboard], ["/bookings", "My Bookings", CalendarHeart], ["/profile", "Profile Settings", UserCog]],
    admin: [["", "Overview", LayoutDashboard], ["/users", "Manage Users", Users], ["/services", "Manage Services", ListChecks], ["/bookings", "Manage Bookings", CalendarCheck], ["/transactions", "Transactions", Receipt]],
};

export default function Sidebar({ role, onNavigate }) {
  const pathname = usePathname();
  const base = `/dashboard/${role}`;
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {(NAV[role] || []).map(([path, label, Icon]) => {
        const href = base + path;
        const active = path === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted")}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
