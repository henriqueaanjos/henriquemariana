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

        const songs =
            await db.orm.public.Songs
                .orderBy(
                    (song) =>
                        song.createdAt.desc(),
                )
                .all();

        return NextResponse.json(
            [...songs],
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "GET /api/admin/songs error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível buscar as músicas.",
            },
            {
                status: 500,
            },
        );
    }
}