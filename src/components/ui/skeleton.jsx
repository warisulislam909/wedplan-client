import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className }) => <div className={cn("animate-pulse rounded-md bg-muted", className)} />;

export const Spinner = ({ label = "Loading…", className }) => (
  <div className={cn("flex items-center justify-center gap-2 py-16 text-muted-foreground", className)} role="status">
    <Loader2 className="h-5 w-5 animate-spin" /> <span className="text-sm">{label}</span>
  </div>
);
