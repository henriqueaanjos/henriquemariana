"use client";

import { CheckCircle, DownloadSimple, Trash, UploadSimple, Warning } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

import {
    getPhotoKey,
    PHOTO_ALLOWED_EXTENSIONS,
    PHOTO_ALLOWED_TYPES,
    PHOTO_MAX_FILE_SIZE,
    PHOTO_MAX_FILES,
} from "@/src/libs/photos";

type DropzoneProps = {
    onFilesChange: (files: File[]) => void;
    disabled?: boolean;
    progressByFile?: Record<string, number>;
};

export function Dropzone({ onFilesChange, disabled = false, progressByFile }: DropzoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previews = useMemo(() => {
        return files.map((file) => ({
            file,
            key: getPhotoKey(file),
            url: URL.createObjectURL(file),
        }));
    }, [files]);

    useEffect(() => {
        return () => {
            previews.forEach(({ url }) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    function handleFiles(selectedFiles: FileList | null) {
        if (!selectedFiles || disabled) return;

        const newFiles = Array.from(selectedFiles);
        const messages: string[] = [];

        const invalidType = newFiles.filter(
            (file) =>
                !(PHOTO_ALLOWED_TYPES as readonly string[]).includes(
                    file.type,
                ),
        );

        if (invalidType.length > 0) {
            messages.push(
                invalidType.length === 1
                    ? "Esse arquivo não é um formato permitido."
                    : `${invalidType.length} arquivos não são formatos permitidos.`,
            );
        }

        const tooLarge = newFiles.filter(
            (file) => file.size > PHOTO_MAX_FILE_SIZE,
        );

        if (tooLarge.length > 0) {
            messages.push(
                `${tooLarge.length} ${
                    tooLarge.length === 1
                        ? "foto excede"
                        : "fotos excedem"
                } o limite de 10 MB.`,
            );
        }

        const validFiles = newFiles.filter(
            (file) =>
                (PHOTO_ALLOWED_TYPES as readonly string[]).includes(
                    file.type,
                ) && file.size <= PHOTO_MAX_FILE_SIZE,
        );

        if (messages.length > 0) {
            setError(messages.join(" "));
            setTimeout(() => setError(null), 5000);
        }

        if (validFiles.length === 0) return;

        const merged = new Map(
            files.map((file) => [getPhotoKey(file), file]),
        );

        validFiles.forEach((file) => {
            merged.set(getPhotoKey(file), file);
        });

        const next = [...merged.values()];

        if (next.length > PHOTO_MAX_FILES) {
            setError(`Máximo de ${PHOTO_MAX_FILES} fotos por envio.`);
            return;
        }

        setFiles(next);
        onFilesChange(next);
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
        const next = files.filter(
            (_, fileIndex) => fileIndex !== index,
        );

        setFiles(next);
        onFilesChange(next);
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
                    ${disabled ? "pointer-events-none opacity-60" : ""}
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
                        {PHOTO_ALLOWED_EXTENSIONS})
                    </p>

                    <input
                        type="file"
                        accept={PHOTO_ALLOWED_TYPES.join(",")}
                        multiple
                        disabled={disabled}
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
                            ({ file, url, key }, index) => (
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

                                     {progressByFile?.[key] !== undefined &&
                                    progressByFile[key] < 100 ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60">
                                            <svg
                                                viewBox="0 0 36 36"
                                                className="h-8 w-8 -rotate-90"
                                            >
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-white/25"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeDasharray={
                                                        2 * Math.PI * 15
                                                    }
                                                    strokeDashoffset={
                                                        2 * Math.PI * 15 *
                                                        (1 -
                                                            progressByFile[key] /
                                                                100)
                                                    }
                                                    className="text-primary-light transition-[stroke-dashoffset] duration-200"
                                                />
                                            </svg>
                                            <span className="text-[9px] text-white">
                                                {Math.round(
                                                    progressByFile[key],
                                                )}
                                                %
                                            </span>
                                        </div>
                                    ) : progressByFile?.[key] === 100 ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <CheckCircle
                                                size={26}
                                                weight="fill"
                                                className="text-green-300"
                                            />
                                        </div>
                                    ) : (
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
                                                disabled={disabled}
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
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}