import { NextResponse } from "next/server";

import {
    SESSION_COOKIE,
} from "@/src/services/admin-auth";

export async function POST() {
    const response =
        NextResponse.json({
            success: true,
        });

    response.cookies.set({
        name: SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure:
            process.env.NODE_ENV ===
            "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return response;
}