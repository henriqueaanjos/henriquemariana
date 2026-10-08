import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
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

        const family =
            await db.orm.public.Family.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!family) {
            return NextResponse.json(
                {
                    error:
                        "Família não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        const members =
            await db.orm.public.FamilyMember
                .where(
                    (member) =>
                        member.familyId.eq(
                            id as Char<36>,
                        )
                )
                .orderBy(
                    (member) =>
                        member.createdAt.asc(),
                )
                .all();

        return NextResponse.json({
            ...family,
            members: [...members],
        });
    } catch (error) {
        console.error(
            "GET /api/admin/families/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível buscar a família.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function PATCH(
    request: Request,
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

        const body = await request.json();

        if (
            typeof body.name !== "string" ||
            !body.name.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        "O nome da família é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        const family =
            await db.orm.public.Family.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!family) {
            return NextResponse.json(
                {
                    error:
                        "Família não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        const updated =
            await db.orm.public.Family.where((p) =>
                p.id.eq(id as Char<36>)
            ).update({
                name: body.name.trim(),
            });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(
            "PATCH /api/admin/families/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível atualizar a família.",
            },
            {
                status: 500,
            },
        );
    }
}

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

        const family =
            await db.orm.public.Family.where((p) =>
                p.id.eq(id as Char<36>)
            ).first();

        if (!family) {
            return NextResponse.json(
                {
                    error:
                        "Família não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        await db.orm.public.Family.where((p) =>
            p.id.eq(id as Char<36>)
        ).delete();

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/admin/families/[id] error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível excluir a família.",
            },
            {
                status: 500,
            },
        );
    }
}
