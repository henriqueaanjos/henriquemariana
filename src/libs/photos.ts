export const PHOTO_ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/tiff",
    "image/heic",
] as const;

export const PHOTO_ALLOWED_EXTENSIONS =
    "JPG, PNG, WEBP, TIFF, HEIC ou GIF";

export const PHOTO_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const PHOTO_MAX_FILES = 20;
export const PHOTO_STORAGE_PREFIX = "wedding/";

const EXTENSION_BY_TYPE: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/tiff": "tiff",
    "image/heic": "heic",
};

export function getPhotoExtension(type: string): string {
    return EXTENSION_BY_TYPE[type] ?? "jpg";
}

export function getPhotoKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
}