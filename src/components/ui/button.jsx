import * as React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-card hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        gold: "bg-accent text-accent-foreground hover:bg-accent/85",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-xs", lg: "h-12 px-7 text-base", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export const Button = React.forwardRef(({ className, variant, size, loading, children, disabled, asChild, ...props }, ref) => {
  const cls = cn(buttonVariants({ variant, size }), className);
  // asChild: একটি মাত্র child (যেমন <Link>) এর উপর button style প্রয়োগ করে
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: cn(cls, children.props.className), ref });
  }
  return (
    <button ref={ref} className={cls} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
Button.displayName = "Button";
