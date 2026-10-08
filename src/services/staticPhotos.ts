import fs from "fs";
import path from "path";
import { api } from "../libs/axios";

const PHOTOS_PATH = path.join(process.cwd(), "public", "Photos");



const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|avif)$/i;

export function getAlbums() {
    if (!fs.existsSync(PHOTOS_PATH)) {
        return [];
    }

    const albums = fs
        .readdirSync(PHOTOS_PATH, { withFileTypes: true })
        .filter((entry) => entry.isDirectory());

    return albums.map((album) => {
        const albumPath = path.join(PHOTOS_PATH, album.name);

        const photos = fs
            .readdirSync(albumPath)
            .filter((file) => IMAGE_EXTENSIONS.test(file))
            .map(
                (file) =>
                    `/Photos/${album.name}/${file}`
            );

        return {
            album: album.name,
            photos,
        };
    });
}