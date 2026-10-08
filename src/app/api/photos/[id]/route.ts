import { del } from "@vercel/blob";
import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { NextResponse } from "next/server";
import { Char } from "@prisma/orm-postgres/target/codec-types";

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
                    error: "ID da foto é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        const photo =
            await db.orm.public.Photo.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!photo) {
            return NextResponse.json(
                {
                    error: "Foto não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        if (photo.storageKey) {
            await del(photo.storageKey);
        } else if (photo.url) {
            /*
             * Compatibilidade com fotos antigas,
             * que foram cadastradas antes de
             * começarmos a salvar o storageKey.
             */
            await del(photo.url);
        }

        await db.orm.public.Photo.where((p) =>
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
            "DELETE /api/admin/photos/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível excluir a foto.",
            },
            {
                status: 500,
            },
        );
    }
}
