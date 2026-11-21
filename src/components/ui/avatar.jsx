import { cn } from "@/lib/utils";

export function Avatar({ src, name = "?", className }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} referrerPolicy="no-referrer" className={cn("h-9 w-9 rounded-full object-cover", className)} />
  ) : (
    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground", className)}>{initials}</span>
  );
}
