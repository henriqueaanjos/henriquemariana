'use client'

import { Controller, useForm } from "react-hook-form";
import { Dropzone } from "../Dropzone";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { Modal } from "../Modal";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImages, type UploadProgress } from "@/src/services/photos";
import Input from "../Input";
import { CircularProgress } from "../CircularProgress";

type NewPhotoModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export const photosSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "O nome precisa de pelo menos 2 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export type PhotosFormData = z.infer<typeof photosSchema>;

export function NewPhotoModal({ isOpen, onClose }: NewPhotoModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<PhotosFormData>({
        resolver: zodResolver(photosSchema),
        defaultValues: {
            name: "",
        },
    });

    const queryClient = useQueryClient();

    const {
        mutateAsync: mutateUploadImages,
        isPending,
    } = useMutation({
        mutationFn: ({
            name,
            files,
        }: {
            name: string;
            files: File[];
        }) =>
            uploadImages(name, files, (value) => setProgress(value)),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["images"],
            });

            reset();
            setFiles([]);
            setProgress(null);
            setUploadError(null);
            onClose();
        },
        onError(error: unknown) {
            const message =
                (
                    error as {
                        response?: { data?: { error?: string } };
                    }
                )?.response?.data?.error ??
                "Não foi possível enviar as fotos. Tente novamente.";

            setUploadError(message);
        },
    });

    async function handleUpload(data: PhotosFormData) {
        if (files.length === 0) return;

        setUploadError(null);
        setProgress({
            percentage: 0,
            current: 0,
            total: files.length,
            byFile: {},
        });

        try {
            await mutateUploadImages({
                name: data.name,
                files,
            });
        } catch {
            /* erro tratado no onError da mutation */
        }
    }

    return (
         <Modal isOpen={isOpen} onClose={() => { if (!isPending) onClose(); }}>
            <div className="w-full h-full cursor-default flex flex-col gap-8 overflow-y">
                <div className="w-full flex flex-col items-center">
                    <div className="border-b-2 border-primary pb-1 px-2 text-center">
                        <h1 className="text-base text-primary-light uppercase font-cormorant">Envie suas fotos</h1>
                    </div>
                </div>
                <div className="w-full h-full grow flex flex-col gap-4">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Input
                                label="Nome"
                                placeholder="Digite seu nome completo"
                                error={fieldState.error?.message}
                                {...field}
                            />
                        )}
                    />
                    <Dropzone
                        onFilesChange={setFiles}
                        disabled={isPending}
                        progressByFile={progress?.byFile}
                    />

                    {uploadError && (
                        <p className="text-center font-lora text-xs text-red-300/90">
                            {uploadError}
                        </p>
                    )}
                </div>
                <div className="w-full flex flex-col items-center gap-3">
                    {isPending && progress && (
                        <>
                            <CircularProgress
                                value={progress.percentage}
                                label={`${progress.current}/${progress.total}`}
                            />

                            <p className="text-center font-lora text-xs text-background/80">
                                Enviando foto{" "}
                                {Math.min(
                                    progress.current + 1,
                                    progress.total,
                                )}{" "}
                                de {progress.total}
                            </p>
                        </>
                    )}

                    {!uploadError ? (
                        <LiquidGlassWrapper className="bg-primary-dark/70 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                            <button
                                type="button"
                                onClick={handleSubmit(handleUpload)}
                                disabled={isPending || files.length === 0}
                                className="px-3 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2 cursor-pointer z-10 disabled:opacity-60"
                            >
                                <p className="text-background uppercase font-lora text-sm">
                                    {isPending ? "Enviando..." : "Enviar"}
                                </p>
                            </button>
                        </LiquidGlassWrapper>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit(handleUpload)}
                            className="w-full rounded-lg border border-red-300/40 px-3 py-2 font-lora text-sm text-red-200 cursor-pointer"
                        >
                            Tentar novamente
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    )
}