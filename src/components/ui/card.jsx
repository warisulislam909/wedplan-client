import { cn } from "@/lib/utils";

export const Card = ({ className, ...p }) => <div className={cn("rounded-lg border border-border bg-card", className)} {...p} />;
export const CardHeader = ({ className, ...p }) => <div className={cn("p-5 pb-2", className)} {...p} />;
export const CardTitle = ({ className, ...p }) => <h3 className={cn("text-xl font-semibold", className)} {...p} />;
export const CardContent = ({ className, ...p }) => <div className={cn("p-5", className)} {...p} />;
