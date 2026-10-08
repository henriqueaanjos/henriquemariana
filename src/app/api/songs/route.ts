import { db } from "@/src/prisma/db";
import { NextRequest, NextResponse } from "next/server";

// Importe aqui o seu client do Prisma 8
// import { prisma } from "@/src/libs/prisma";

export async function GET() {
    try {
        /*
         * Prisma:
         *
         * const songs = await prisma.suggestedSong.findMany({
         *     orderBy: [
         *         {
         *             likes: "desc",
         *         },
         *         {
         *             createdAt: "desc",
         *         },
         *     ],
         * });
         *
         * return NextResponse.json({
         *     songs,
         * });
         */

        const songs = await db.orm.public.Songs.orderBy([p => p.likes.desc(), p => p.createdAt.desc()]).all();

        return NextResponse.json({
            songs,
        });
    } catch (error) {
        console.error("GET /api/songs error:", error);

        return NextResponse.json(
            {
                error: "Não foi possível buscar as músicas sugeridas.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            trackId,
            title,
            artist,
            album,
            artworkUrl,
            previewUrl,
            itunesUrl,
        } = body;

        if (!trackId || !title || !artist) {
            return NextResponse.json(
                {
                    error:
                        "trackId, title e artist são obrigatórios.",
                },
                {
                    status: 400,
                }
            );
        }


        const existingSong = await db.orm.public.Songs.first(p => p.trackId.eq(trackId));

        if (existingSong) {
            return NextResponse.json({
                song: existingSong,
                alreadyExists: true,
            });
        }

        const song = await db.orm.public.Songs.create({
            trackId: String(trackId),
            title,
            artist,
            album: album ?? null,
            artworkUrl: artworkUrl ?? null,
            previewUrl: previewUrl ?? null,
            itunesUrl: itunesUrl ?? null,
        });
        
        return NextResponse.json(
            {
                song,
                alreadyExists: false,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST /api/songs error:", error);

        return NextResponse.json(
            {
                error: "Não foi possível adicionar a música.",
            },
            {
                status: 500,
            }
        );
    }
}