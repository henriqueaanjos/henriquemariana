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

        const photos =
            await db.orm.public.Photo
                .orderBy(
                    (photo) =>
                        photo.createdAt.desc(),
                )
                .all();

        return NextResponse.json(
            [...photos],
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "GET /api/admin/photos error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível buscar as fotos.",
            },
            {
                status: 500,
            },
        );
    }
}
