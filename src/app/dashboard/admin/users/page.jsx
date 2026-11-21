"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { api, qs } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { PageHeader, EmptyState, ErrorState, TableWrap, Th, Td, TableSkeleton } from "@/components/dashboard/parts";
import Pagination from "@/components/dashboard/Pagination";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";

export default function ManageUsers() {
  const [q, setQ] = useState(""), [dq, setDq] = useState(""), [role, setRole] = useState("all"), [page, setPage] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useApi(`/admin/users${qs({ q: dq, role, page })}`);
  const [details, setDetails] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function openDetails(u) {
    try { setDetails(await api(`/admin/users/${u._id}`)); } catch (e) { toast.error(e.message); }
  }
  async function toggleBlock() {
    setBusy(true);
    try { await api(`/admin/users/${target._id}/block`, { method: "PATCH", body: { isBlocked: !target.isBlocked } }); toast.success(target.isBlocked ? "User unblocked" : "User blocked"); setTarget(null); reload(); }
    catch (e) { toast.error(e.message); setTarget(null); } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Manage users" subtitle="Search, review and block or unblock accounts." />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search by name or email" aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select className="w-44" aria-label="Filter by role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="all">All roles</option><option value="customer">Customers</option><option value="vendor">Vendors</option><option value="admin">Admins</option>
        </Select>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <TableSkeleton /> : !data?.items?.length ? <EmptyState title="No users found" text="Try a different search or role filter." /> : (
        <>
          <TableWrap>
            <thead><tr><Th>User</Th><Th>Role</Th><Th>Status</Th><Th>Joined</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u._id}>
                  <Td><div className="flex items-center gap-3"><Avatar src={u.image} name={u.name} className="h-9 w-9 text-xs" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></Td>
                  <Td><Badge className="capitalize">{u.role}</Badge></Td>
                  <Td><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                  <Td><div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetails(u)}>Details</Button>
                    {u.role !== "admin" && <Button size="sm" variant={u.isBlocked ? "secondary" : "destructive"} onClick={() => setTarget(u)}>{u.isBlocked ? "Unblock" : "Block"}</Button>}
                  </div></Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
      <Modal open={!!details} onClose={() => setDetails(null)} title="User details">
        {details && (
          <dl className="space-y-2 text-sm">
            {[["Name", details.name], ["Email", details.email], ["Role", details.role], ["Phone", details.phone || "—"], ["Business", details.businessName || "—"], ["Plan", details.role === "vendor" ? details.subscriptionPlan || "free" : "—"], [details.role === "vendor" ? "Services" : "Bookings", details.role === "vendor" ? details.servicesCount : details.bookingsCount], ["Joined", formatDate(details.createdAt)], ["Account", details.isBlocked ? "Blocked" : "Active"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium capitalize">{String(v)}</dd></div>
            ))}
          </dl>
        )}
      </Modal>
      <ConfirmModal open={!!target} onClose={() => setTarget(null)} onConfirm={toggleBlock} loading={busy} destructive={!target?.isBlocked} title={target?.isBlocked ? "Unblock this user?" : "Block this user?"} message={target?.isBlocked ? `${target?.name} will regain access to protected features.` : `${target?.name} will be signed out and blocked from protected features.`} confirmLabel={target?.isBlocked ? "Unblock" : "Block"} />
    </>
  );
}
