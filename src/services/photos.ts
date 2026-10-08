import { api } from "../libs/axios";


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

export async function getImages(): Promise<Image[]> {
    const response = await api.get<Image[]>("/api/photos");

    return response.data;
}

export async function uploadImages(
    name: string,
    files: File[],
): Promise<Image[]> {
    const formData = new FormData();

    formData.append("name", name);

    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await api.post<Image[]>(
        "/api/photos",
        formData,
    );

    return response.data;
}

export async function getStaticPhotos(): Promise<StaticPhoto[]> {
    const response = await api.get<StaticPhoto[]>("/api/staticPhotos");

    console.log("Static photos response:", response.data);

    return response.data;
}