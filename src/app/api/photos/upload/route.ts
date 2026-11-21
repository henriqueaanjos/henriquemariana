import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import {
    PHOTO_ALLOWED_TYPES,
    PHOTO_MAX_FILE_SIZE,
    PHOTO_STORAGE_PREFIX,
} from "@/src/libs/photos";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as HandleUploadBody;

        const response = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                if (
                    !pathname.startsWith(PHOTO_STORAGE_PREFIX) ||
                    !/^wedding\/[0-9a-f-]{36}\.[a-z0-9]+$/.test(pathname)
                ) {
                    throw new Error("Caminho de armazenamento inválido.");
                }

                let payload: { name?: unknown } = {};
                try {
                    payload = JSON.parse(clientPayload ?? "{}");
                } catch {
                    throw new Error("Payload inválido.");
                }

                const name =
                    typeof payload.name === "string"
                        ? payload.name.trim()
                        : "";

                if (name.length < 2 || name.length > 100) {
                    throw new Error("Nome inválido.");
                }

                return {
                    allowedContentTypes: [...PHOTO_ALLOWED_TYPES],
                    maximumSizeInBytes: PHOTO_MAX_FILE_SIZE,
                    validUntil: Date.now() + 5 * 60 * 1000,
                    addRandomSuffix: false,
                    tokenPayload: JSON.stringify({ name }),
                };
            },
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error("Erro ao gerar token de upload:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Não foi possível iniciar o upload.",
            },
            { status: 400 },
        );
    }
}