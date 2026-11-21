import { upload } from "@vercel/blob/client";

import { api } from "../libs/axios";
import {
    getPhotoExtension,
    getPhotoKey,
    PHOTO_MAX_FILES,
} from "@/src/libs/photos";

export type Image = {
    id: string;
    name: string;
    url: string;
    createdAt: string;
};

export type StaticPhoto = {
    album: string;
    photos: string[];
}

export type UploadProgress = {
    percentage: number; // 0 a 100 (geral)
    current: number;    // quantas fotos já terminaram
    total: number;
    byFile: Record<string, number>; // chave -> 0 a 100
};

export async function getImages(): Promise<Image[]> {
    const response = await api.get<Image[]>("/api/photos");

    return response.data;
}

export async function uploadImages(
    name: string,
    files: File[],
    onProgress?: (progress: UploadProgress) => void,
): Promise<Image[]> {
    const selected = files.slice(0, PHOTO_MAX_FILES);
    const byFile: Record<string, number> = {};
    const images: Image[] = [];
    const total = selected.length;

    function emitProgress() {
        const values = selected.map(
            (file) => byFile[getPhotoKey(file)] ?? 0,
        );

        onProgress?.({
            percentage: Math.round(
                values.reduce((sum, value) => sum + value, 0) / total,
            ),
            current: values.filter((value) => value === 100).length,
            total,
            byFile: { ...byFile },
        });
    }

    let nextIndex = 0;

    async function processFile(file: File) {
        const key = getPhotoKey(file);
        const pathname =
            `wedding/${crypto.randomUUID()}.${getPhotoExtension(file.type)}`;

        const blob = await upload(pathname, file, {
            access: "public",
            handleUploadUrl: "/api/photos/upload",
            clientPayload: JSON.stringify({
                name,
                fileName: file.name,
            }),
            contentType: file.type,
            onUploadProgress: ({ percentage }) => {
                byFile[key] = percentage;
                emitProgress();
            },
        });

        byFile[key] = 100;
        emitProgress();

        const { data } = await api.post<Image[]>("/api/photos", {
            name,
            fileName: file.name,
            storageKey: blob.pathname,
        });

        images.push(...data);
    }

    const workers = Array.from(
        { length: Math.min(3, total) },
        async () => {
            while (nextIndex < total) {
                const index = nextIndex++;
                await processFile(selected[index]);
            }
        },
    );

    await Promise.all(workers);

    return images;
}

export async function getStaticPhotos(): Promise<StaticPhoto[]> {
    const response = await api.get<StaticPhoto[]>("/api/staticPhotos");

    console.log("Static photos response:", response.data);

    return response.data;
}