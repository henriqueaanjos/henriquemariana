import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyAdminSession } from "./services/admin-auth";


export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    const session = request.cookies.get(
        SESSION_COOKIE
    )?.value;

    if (!verifyAdminSession(session)) {
        const loginUrl = new URL(
            "/login",
            request.url
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};