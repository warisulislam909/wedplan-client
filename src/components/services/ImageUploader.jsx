"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url;
}

/** value: string[] ; onChange(string[]) — ImgBB তে server route দিয়ে upload হয় */
export default function ImageUploader({ value = [], onChange, max = 4, label = "Add image" }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(e) {
    const files = Array.from(e.target.files || []).slice(0, max - value.length);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    const urls = [];
    for (const f of files) {
      try { urls.push(await uploadImage(f)); } catch (err) { toast.error(`${f.name}: ${err.message}`); }
    }
    setBusy(false);
    if (urls.length) { onChange([...value, ...urls]); toast.success(urls.length > 1 ? "Images uploaded" : "Image uploaded"); }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url) => (
        <div key={url} className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Uploaded preview" className="h-full w-full object-cover" />
          <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((u) => u !== url))} className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-white"><X className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      {value.length < max && (
        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-muted disabled:opacity-60">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          {busy ? "Uploading" : label}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" multiple={max > 1} className="hidden" onChange={onFiles} />
    </div>
  );
}
