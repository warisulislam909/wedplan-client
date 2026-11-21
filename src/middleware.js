import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// দ্রুত প্রথম গার্ড: session cookie না থাকলে Sign In এ পাঠায়। আসল role যাচাই হয় Express server এ।
export function middleware(req) {
  if (!getSessionCookie(req)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/services/:id", "/payment/:path*"] };
