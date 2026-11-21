import { NextResponse } from "next/server";

export const runtime = "nodejs";
const hits = new Map(); // simple per-IP rate limit (10 uploads/min)

// ImgBB API key শুধু এই server route এ থাকে — browser এ যায় না
export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= 10) return NextResponse.json({ message: "Too many uploads. Try again in a minute." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ message: "No file received" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Image must be smaller than 5 MB" }, { status: 400 });
  if (!process.env.IMGBB_API_KEY) return NextResponse.json({ message: "Image hosting is not configured" }, { status: 500 });

  const body = new FormData();
  body.append("image", Buffer.from(await file.arrayBuffer()).toString("base64"));
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data?.url) return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
  return NextResponse.json({ url: json.data.url });
}
