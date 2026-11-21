"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserCog, X, Heart } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, menuItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [{ href: "/", label: "Home" }, { href: "/services", label: "Browse Services" }];

export function Logo({ light }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-display text-2xl font-semibold", light ? "text-white" : "text-primary")}>
      <Heart className="h-5 w-5 fill-accent text-accent" aria-hidden /> WedPlan
    </Link>
  );
}

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = session?.user;
  const dash = user ? `/dashboard/${user.role || "customer"}` : "/signin";

  async function logout() {
    await authClient.signOut();
    clearToken();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  }

  const linkCls = (href) => cn("rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary", pathname === href ? "text-primary" : "text-foreground/75");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? <div className="h-9 w-24 animate-pulse rounded-md bg-muted" /> : user ? (
            <Dropdown trigger={<Avatar src={user.image} name={user.name} />}>
              <div className="flex items-center gap-3 border-b border-border px-3 pb-3 pt-2">
                <Avatar src={user.image} name={user.name} className="h-10 w-10" />
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p></div>
              </div>
              <Link href={dash} className={menuItem}><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
              <Link href={user.role === "admin" ? dash : `${dash}/profile`} className={menuItem}><UserCog className="h-4 w-4" /> Profile Settings</Link>
              <button onClick={logout} className={cn(menuItem, "text-destructive")}><LogOut className="h-4 w-4" /> Logout</button>
            </Dropdown>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/signin">Sign In</Link></Button>
              <Button asChild><Link href="/signup">Sign Up</Link></Button>
            </>
          )}
        </div>
        <button className="rounded-md p-2 md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden" onClick={() => setOpen(false)}>
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>)}
            {user ? (
              <>
                <Link href={dash} className="rounded-md px-3 py-2 text-sm font-medium">Dashboard</Link>
                <Link href={user.role === "admin" ? dash : `${dash}/profile`} className="rounded-md px-3 py-2 text-sm font-medium">Profile Settings</Link>
                <button onClick={logout} className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive">Logout</button>
              </>
            ) : (
              <><Link href="/signin" className="rounded-md px-3 py-2 text-sm font-medium">Sign In</Link><Link href="/signup" className="rounded-md px-3 py-2 text-sm font-medium text-primary">Sign Up</Link></>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
