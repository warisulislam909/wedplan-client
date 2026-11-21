"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="rounded-full">{trigger}</button>
      {open && (
        <div role="menu" onClick={() => setOpen(false)} className={cn("absolute top-full z-50 mt-2 w-60 rounded-lg border border-border bg-card p-1.5 shadow-lg", align === "right" ? "right-0" : "left-0", className)}>
          {children}
        </div>
      )}
    </div>
  );
}

export const menuItem = "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted";
