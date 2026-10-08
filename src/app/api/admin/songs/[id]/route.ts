import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(
    _request: Request,
    context: RouteContext,
) {
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

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "ID da música é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        const song =
            await db.orm.public.Songs.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!song) {
            return NextResponse.json(
                {
                    error:
                        "Música não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        await db.orm.public.Songs.where((p) =>
                p.id.eq(id as Char<36>)
            ).delete();

        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "DELETE /api/admin/songs/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível excluir a música.",
            },
            {
                status: 500,
            },
        );
    }
}
