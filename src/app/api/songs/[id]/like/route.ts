import { db } from "@/src/prisma/db";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

interface LikeRequestBody {
    liked: boolean;
}

export async function POST(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "ID da música é obrigatório.",
                },
                {
                    status: 400,
                }
            );
        }

        const body: LikeRequestBody = await request.json();

        if (typeof body.liked !== "boolean") {
            return NextResponse.json(
                {
                    error: "O campo liked deve ser boolean.",
                },
                {
                    status: 400,
                }
            );
        }

        const songExists = await db.orm.public.Songs
            .where((p) =>
                p.id.eq(id as Char<36>)
            )
            .first();

        if (!songExists) {
            return NextResponse.json(
                {
                    error: "Música não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        const newLikes = body.liked
            ? songExists.likes + 1
            : Math.max(0, songExists.likes - 1);

        const song = await db.orm.public.Songs
            .where((p) =>
                p.id.eq(id as Char<36>)
            )
            .update({
                likes: newLikes,
            });

        return NextResponse.json({
            song,
        });
    } catch (error) {
        console.error(
            "POST /api/songs/[id]/like error:",
            error
        );

        return NextResponse.json(
            {
                error: "Não foi possível atualizar a curtida.",
            },
            {
                status: 500,
            }
        );
    }
}