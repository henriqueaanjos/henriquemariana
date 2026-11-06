import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, getSessionRole } from "./services/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isCerimonialRoute = pathname.startsWith("/cerimonial");
  const isValidatorRoute = pathname.startsWith("/validator");

  if (!isAdminRoute && !isCerimonialRoute && !isValidatorRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const role = getSessionRole(token);

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isCerimonialRoute && role !== "cerimonial") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    isValidatorRoute &&
    role !== "admin" &&
    role !== "cerimonial"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cerimonial/:path*",
    "/validator/:path*",
  ],
};