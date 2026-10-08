import { put } from "@vercel/blob";
import { db } from "@/src/prisma/db";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function GET() {
    try {
        const images = await db.orm.public.Photo
            .orderBy((p) => p.createdAt.desc())
            .all();

        return NextResponse.json([...images], {
            status: 200,
        });
    } catch (error) {
        console.error("Erro ao buscar imagens:", error);

        return NextResponse.json(
            {
                error: "Não foi possível buscar as imagens.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const username = formData.get("name");
        const files = formData.getAll("files");

        if (
            typeof username !== "string" ||
            !username.trim()
        ) {
            return NextResponse.json(
                {
                    error: "O nome é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        const imageFiles = files.filter(
            (file): file is File =>
                file instanceof File,
        );

        if (imageFiles.length === 0) {
            return NextResponse.json(
                {
                    error: "Selecione pelo menos uma foto.",
                },
                {
                    status: 400,
                },
            );
        }

        for (const file of imageFiles) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json(
                    {
                        error: `O arquivo "${file.name}" possui um formato inválido.`,
                    },
                    {
                        status: 400,
                    },
                );
            }

            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    {
                        error: `O arquivo "${file.name}" excede o limite de 10 MB.`,
                    },
                    {
                        status: 400,
                    },
                );
            }
        }

        const images = await Promise.all(
            imageFiles.map(async (file) => {
                const extension =
                    file.name
                        .split(".")
                        .pop()
                        ?.toLowerCase() ?? "jpg";

                const storageKey =
                    `wedding/${crypto.randomUUID()}.${extension}`;

                const blob = await put(
                    storageKey,
                    file,
                    {
                        access: "public",
                        addRandomSuffix: false,
                    },
                );

                const image =
                    await db.orm.public.Photo.create({
                        userName: username.trim(),
                        name: file.name,
                        url: blob.url,
                        storageKey,
                    });

                return image;
            }),
        );

        return NextResponse.json(images, {
            status: 201,
        });
    } catch (error) {
        console.error(
            "Erro ao fazer upload das imagens:",
            error,
        );

        return NextResponse.json(
            {
                error: "Não foi possível enviar as imagens.",
            },
            {
                status: 500,
            },
        );
    }
}