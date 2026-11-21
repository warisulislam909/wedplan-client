import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Inbox } from "lucide-react";

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-4xl font-semibold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>
    {action}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, loading }) => (
  <Card className="flex items-center gap-4 p-5">
    {Icon && <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>}
    <div>
      {loading ? <Skeleton className="h-8 w-14" /> : <p className="font-display text-3xl font-semibold leading-none">{value ?? 0}</p>}
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  </Card>
);

export const StatGrid = ({ children }) => <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;

export const EmptyState = ({ title, text, action }) => (
  <div className="rounded-lg border border-dashed border-border p-12 text-center">
    <Inbox className="mx-auto h-9 w-9 text-muted-foreground" />
    <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
    {text && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="rounded-lg border border-border bg-card p-10 text-center">
    <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
    <p className="mt-2 font-medium">{error?.message || "Something went wrong"}</p>
    {onRetry && <Button className="mt-4" onClick={onRetry}>Try again</Button>}
  </div>
);

export const TableWrap = ({ children }) => <div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="w-full min-w-[720px] text-left text-sm">{children}</table></div>;
export const Th = ({ children }) => <th className="whitespace-nowrap border-b border-border bg-muted/60 px-4 py-3 text-xs font-semibold text-muted-foreground">{children}</th>;
export const Td = ({ children, className = "" }) => <td className={`border-b border-border px-4 py-3 align-middle last:border-b-0 ${className}`}>{children}</td>;
export const TableSkeleton = ({ rows = 5 }) => <div className="space-y-2">{Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
