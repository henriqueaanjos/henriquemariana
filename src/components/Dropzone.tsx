"use client";

import { DownloadSimple, Trash, UploadSimple, Warning } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/tiff",
    "image/heic",
];

const ALLOWED_EXTENSIONS = "JPG, PNG, WEBP, TIFF, HEIC ou GIF";

type DropzoneProps = {
    onFilesChange: (files: File[]) => void;
};

export function Dropzone({ onFilesChange }: DropzoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previews = useMemo(() => {
        return files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
    }, [files]);

    function handleFiles(selectedFiles: FileList | null) {
        if (!selectedFiles) return;

        const newFiles = Array.from(selectedFiles);

        const validFiles = newFiles.filter((file) =>
            ALLOWED_TYPES.includes(file.type)
        );

        const invalidFiles = newFiles.filter(
            (file) => !ALLOWED_TYPES.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setError(
                invalidFiles.length === 1
                    ? "Esse arquivo não é um formato permitido."
                    : `${invalidFiles.length} arquivos não são formatos permitidos.`
            );

            setTimeout(() => {
                setError(null);
            }, 4000);
        }

        if (validFiles.length === 0) return;

        setFiles((current) => [
            ...current,
            ...validFiles,
        ]);

        onFilesChange([...files, ...validFiles]);
    }

    function handleDrop(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        setIsDragging(false);

        handleFiles(event.dataTransfer.files);
    }

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        handleFiles(event.target.files);

        event.target.value = "";
    }

    function removeFile(index: number) {
        setFiles((current) =>
            current.filter(
                (_, fileIndex) => fileIndex !== index
            )
        );
    }

    return (
        <div>
            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                    flex min-h-50 cursor-pointer
                    items-center justify-center
                    rounded-xl border-2 border-dashed
                    transition
                    font-lora
                    ${isDragging
                        ? "border-primary bg-primary-light"
                        : "border-primary"
                    }
                `}
            >

                <label
                    className={`
                        cursor-pointer text-center flex flex-col items-center
                        ${isDragging
                            ? "text-primary-dark"
                            : "text-background"
                        }
                    `}
                >

                    {isDragging ? (
                        <>
                            <DownloadSimple size={38} className={`mb-4 text-primary`} />
                            <p className="text-primary-dark">
                                Solte suas fotos aqui
                            </p>
                        </>
                    ) : (
                        <>
                            <UploadSimple size={38} className={`mb-4 text-primary`} />
                            <p className="text-background">
                                Arraste suas fotos aqui
                            </p>
                        </>
                    )}

                    <p
                        className={`
                            text-sm
                            ${isDragging
                                ? "text-primary"
                                : "text-primary-light"
                            }
                        `}
                    >
                        ou clique para selecionar
                    </p>

                    <p
                        className={`
                            mt-2 text-xs
                            ${isDragging
                                ? "text-primary-dark/60"
                                : "text-background/60"
                            }
                        `}
                    >
                        (Formatos permitidos:{" "}
                        {ALLOWED_EXTENSIONS})
                    </p>

                    <input
                        type="file"
                        accept={ALLOWED_TYPES.join(",")}
                        multiple
                        className="hidden"
                        onChange={handleChange}
                    />
                </label>
            </div>

            {error && (
                <p
                    className="
                mt-2
                text-center
                text-xs
                text-red-300/80
                flex flex-row items-center justify-center gap-2
            "
                >
                    <Warning /> {error}
                </p>
            )}

            {previews.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 text-xs text-primary-light/70">
                        {previews.length}{" "}
                        {previews.length === 1
                            ? "foto selecionada"
                            : "fotos selecionadas"}
                    </p>

                    <div className="flex w-full flex-row flex-wrap gap-2">
                        {previews.map(
                            ({ file, url }, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="
                                        group relative
                                        aspect-square h-16
                                        overflow-hidden
                                        rounded-md
                                    "
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="
                                            h-full w-full
                                            object-cover
                                            transition-transform
                                            duration-300
                                            group-hover:scale-105
                                        "
                                    />

                                    <div
                                        className="
                                            absolute inset-0
                                            flex items-center
                                            justify-center
                                            bg-black/50
                                            opacity-0
                                            transition-opacity
                                            duration-200
                                            group-hover:opacity-100
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFile(index)
                                            }
                                            className="
                                                flex h-8 w-8
                                                cursor-pointer
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-black/60
                                                text-white
                                                transition-all
                                                duration-200
                                                hover:scale-110
                                                hover:bg-red-500
                                            "
                                            aria-label={`Remover ${file.name}`}
                                        >
                                            <Trash
                                                size={18}
                                                weight="bold"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}