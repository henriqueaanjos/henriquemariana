'use client'

import { Controller, useForm } from "react-hook-form";
import { Dropzone } from "../Dropzone";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { Modal } from "../Modal";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImages } from "@/src/services/photos";
import Input from "../Input";

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
        }) => uploadImages(name, files),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["images"],
            });

            reset();
            setFiles([]);
            onClose();
        },
    });

    async function handleUpload(data: PhotosFormData) {
        if (files.length === 0) {
            return;
        }

        try {
            await mutateUploadImages({
                name: data.name,
                files,
            });
        } catch (error) {
            console.error("Erro ao enviar fotos:", error);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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
                    />
                </div>
                <div className="w-full">
                    <LiquidGlassWrapper className="bg-primary-dark/70 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                        <button
                            type="button"
                            onClick={handleSubmit(handleUpload)}
                            disabled={isPending || files.length === 0}
                            className="px-3 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10"
                        >
                            <p className="text-background uppercase font-lora text-sm">
                                {isPending ? "Enviando..." : "Enviar"}
                            </p>
                        </button>
                    </LiquidGlassWrapper>
                </div>
            </div>
        </Modal>
    )
}