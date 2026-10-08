import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const isAdmin =
            await requireAdminSession();

        if (!isAdmin) {
            return NextResponse.json(
                {
                    error: "Não autorizado.",
                },
                {
                    status: 401,
                },
            );
        }

        const messages =
            await db.orm.public.Message
                .orderBy(
                    (message) =>
                        message.createdAt.desc(),
                )
                .all();

        return NextResponse.json(
            [...messages],
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "GET /api/admin/messages error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível buscar os recados.",
            },
            {
                status: 500,
            },
        );
    }
}