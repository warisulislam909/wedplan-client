"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cn("max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-card p-6 shadow-xl sm:max-w-lg sm:rounded-xl", className)}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", loading, destructive }) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="sm:max-w-md">
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="h-10 rounded-md border border-border px-4 text-sm hover:bg-muted" onClick={onClose}>Keep it</button>
        <button disabled={loading} onClick={onConfirm} className={cn("h-10 rounded-md px-4 text-sm font-medium text-white disabled:opacity-60", destructive ? "bg-destructive" : "bg-primary")}>
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
