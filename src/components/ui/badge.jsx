import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-muted text-foreground",
      pending: "bg-amber-100 text-amber-900",
      success: "bg-emerald-100 text-emerald-900",
      danger: "bg-red-100 text-red-900",
      neutral: "bg-stone-200 text-stone-700",
      gold: "bg-accent/30 text-accent-foreground ring-1 ring-accent",
    },
  },
  defaultVariants: { variant: "default" },
});

export const Badge = ({ className, variant, ...p }) => <span className={cn(badge({ variant }), className)} {...p} />;

const MAP = {
  pending: "pending", approved: "success", accepted: "success", paid: "success", active: "success",
  rejected: "danger", failed: "danger", blocked: "danger", cancelled: "neutral", expired: "neutral", inactive: "neutral",
};
export const StatusBadge = ({ status }) => <Badge variant={MAP[status] || "default"} className="capitalize">{status}</Badge>;
