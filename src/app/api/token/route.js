import { headers } from "next/headers";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// লগইন করা Better Auth session থেকে Express server এর জন্য ১৫ মিনিটের JWT তৈরি করে
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  if (session.user.isBlocked) return NextResponse.json({ message: "Your account has been blocked" }, { status: 403 });
  const token = await new SignJWT({ email: session.user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return NextResponse.json({ token });
}
