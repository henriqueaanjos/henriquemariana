import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";

function generateFamilyCode(length = 8) {
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const randomValues =
        crypto.getRandomValues(
            new Uint8Array(length),
        );

    return Array.from(randomValues)
        .map(
            (value) =>
                characters[
                    value % characters.length
                ],
        )
        .join("");
}

async function generateUniqueFamilyCode() {
    for (let attempt = 0; attempt < 10; attempt++) {
        const code = generateFamilyCode();

        const existing =
            await db.orm.public.Family.where((p) => p.code.eq(code as Char<36>)).first();

        if (!existing) {
            return code;
        }
    }

    throw new Error(
        "Não foi possível gerar um código único para a família.",
    );
}

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

        const families =
            await db.orm.public.Family
                .orderBy(
                    (family) =>
                        family.createdAt.desc(),
                )
                .all();

        return NextResponse.json(
            [...families],
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "GET /api/admin/families error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível buscar as famílias.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(request: Request) {
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

        const name = body.name.trim();

        const code =
            await generateUniqueFamilyCode();

        const family =
            await db.orm.public.Family.create({
                name,
                code,
            });

        return NextResponse.json(
            family,
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "POST /api/admin/families error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível criar a família.",
            },
            {
                status: 500,
            },
        );
    }
}
