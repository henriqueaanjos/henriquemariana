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
                        "ID do recado é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        const message =
            await db.orm.public.Message.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!message) {
            return NextResponse.json(
                {
                    error:
                        "Recado não encontrado.",
                },
                {
                    status: 404,
                },
            );
        }

        await db.orm.public.Message.where((p) =>
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
            "DELETE /api/admin/messages/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível excluir o recado.",
            },
            {
                status: 500,
            },
        );
    }
}
