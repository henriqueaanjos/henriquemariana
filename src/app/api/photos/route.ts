import { head, BlobNotFoundError } from "@vercel/blob";
import { db } from "@/src/prisma/db";
import { NextResponse } from "next/server";

import {
    PHOTO_ALLOWED_TYPES,
    PHOTO_MAX_FILE_SIZE,
    PHOTO_STORAGE_PREFIX,
} from "@/src/libs/photos";

type RegisterPhotoBody = {
    name?: unknown;
    fileName?: unknown;
    storageKey?: unknown;
};

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

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterPhotoBody;

        const name =
            typeof body.name === "string" ? body.name.trim() : "";
        const fileName =
            typeof body.fileName === "string"
                ? body.fileName.trim()
                : "";
        const storageKey =
            typeof body.storageKey === "string"
                ? body.storageKey
                : "";

        if (name.length < 2 || name.length > 100) {
            return NextResponse.json(
                { error: "O nome é obrigatório." },
                { status: 400 },
            );
        }

        if (
            !storageKey.startsWith(PHOTO_STORAGE_PREFIX) ||
            !/^wedding\/[0-9a-f-]{36}\.[a-z0-9]+$/.test(storageKey)
        ) {
            return NextResponse.json(
                { error: "Chave de armazenamento inválida." },
                { status: 400 },
            );
        }

        if (!fileName) {
            return NextResponse.json(
                { error: "Nome do arquivo inválido." },
                { status: 400 },
            );
        }

        /*
         * Confere no Blob que o arquivo existe e respeita as regras.
         * A URL salva é a devolvida pelo head(), nunca a do cliente.
         */
        const blob = await head(storageKey);

        if (
            blob.size > PHOTO_MAX_FILE_SIZE ||
            !(PHOTO_ALLOWED_TYPES as readonly string[]).includes(
                blob.contentType,
            )
        ) {
            return NextResponse.json(
                { error: "Upload inválido." },
                { status: 400 },
            );
        }

        const image = await db.orm.public.Photo.create({
            userName: name,
            name: fileName,
            url: blob.url,
            storageKey: blob.pathname,
        });

        return NextResponse.json([image], { status: 201 });
    } catch (error) {
        if (error instanceof BlobNotFoundError) {
            return NextResponse.json(
                { error: "Arquivo não encontrado no armazenamento." },
                { status: 400 },
            );
        }

        console.error("Erro ao registrar imagem:", error);

        return NextResponse.json(
            { error: "Não foi possível registrar a imagem." },
            { status: 500 },
        );
    }
}