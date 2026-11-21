"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShieldOff } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import Sidebar from "@/components/dashboard/Sidebar";
import { Spinner } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Server কাছ থেকে verified role/blocked status (client এর session কে একমাত্র বিশ্বাস করা হয় না)
  const { data: me, error } = useApi(session ? "/me" : null);
  const role = me?.role || session?.user?.role;
  const segment = pathname.split("/")[2]; // vendor | customer | admin | undefined

  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    else if (role && segment !== role) router.replace(`/dashboard/${role}`); // অন্য role এর URL এ ঢুকলে নিজের dashboard এ
  }, [isPending, session, role, segment, pathname, router]);

  if (error?.status === 403) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShieldOff className="h-12 w-12 text-destructive" />
        <h1 className="mt-3 text-3xl font-semibold">Account blocked</h1>
        <p className="mt-1 max-w-md text-muted-foreground">Your account has been blocked by an administrator, so dashboard features are unavailable.</p>
        <Button className="mt-5" onClick={async () => { await authClient.signOut(); clearToken(); router.push("/"); router.refresh(); }}>Sign out</Button>
      </div>
    );
  }
  if (isPending || !session || !role || segment !== role) return <Spinner label="Loading your dashboard…" className="min-h-[60vh]" />;

  return (
    <div className="container grid gap-6 py-6 lg:grid-cols-[250px_1fr]">
      <aside className={`${open ? "block" : "hidden"} lg:block`}>
        <div className="rounded-lg border border-border bg-card p-3 lg:sticky lg:top-20">
          <div className="mb-3 flex items-center gap-3 border-b border-border px-2 pb-3">
            <Avatar src={session.user.image} name={session.user.name} className="h-10 w-10" />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{session.user.name}</p><p className="text-xs capitalize text-muted-foreground">{role} dashboard</p></div>
          </div>
          <Sidebar role={role} onNavigate={() => setOpen(false)} />
        </div>
      </aside>
      <div className="min-w-0">
        <button className="mb-4 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open}><Menu className="h-4 w-4" /> Menu</button>
        {children}
      </div>
    </div>
  );
}
