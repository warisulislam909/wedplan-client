import * as React from "react";
import { cn } from "@/lib/utils";

const base = "w-full rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground disabled:opacity-60";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, "h-10", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, "min-h-[96px] py-2", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(base, "h-10 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23777%22 stroke-width=%223%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat pr-8", className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

export const Label = ({ className, ...props }) => <label className={cn("mb-1.5 block text-sm font-medium", className)} {...props} />;

export function Field({ label, error, children, hint }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive" role="alert">{error}</p>}
    </div>
  );
}
