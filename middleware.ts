import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard")) return NextResponse.next();

  const hasSupabaseCookie = req.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.value.length > 0);

  if (!hasSupabaseCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
