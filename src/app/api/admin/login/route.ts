import { NextResponse } from "next/server";

import {
    createAdminSession,
    SESSION_COOKIE,
    verifyPassword,
} from "@/src/services/admin-auth";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();

        if (
            typeof body.password !== "string"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Senha obrigatória.",
                },
                {
                    status: 400,
                }
            );
        }

        const isValid =
            verifyPassword(body.password);

        if (!isValid) {
            return NextResponse.json(
                {
                    error:
                        "Senha incorreta.",
                },
                {
                    status: 401,
                }
            );
        }

        const session =
            createAdminSession();

        const response =
            NextResponse.json({
                success: true,
            });

        response.cookies.set({
            name: SESSION_COOKIE,
            value: session,
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (error) {
        console.error(
            "POST /api/admin/login error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível realizar o login.",
            },
            {
                status: 500,
            }
        );
    }
}