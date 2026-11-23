"use client";

import { CameraSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Loading } from "./Loading";

type AlbumCoverProps = {
    title: string;
    photos: string[];
    emphasis?: boolean;
    isLoading?: boolean;
}

function CoverImage({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className: string;
}) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <>
            {status === "loading" && (
                <div className="absolute inset-0 animate-pulse bg-primary-light" />
            )}

            {status === "error" ? (
                <div className="absolute inset-0 flex items-center justify-center text-primary-dark/40">
                    <CameraSlashIcon size={32} />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    className={`${className} transition-all duration-700 ${
                        status === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                />
            )}
        </>
    );
}

export function AlbumsCover({ title, photos, emphasis = false, isLoading = false }: AlbumCoverProps) {
    return (
        <div className="relative mx-auto aspect-4/3 w-[90%] group hover:scale-105 transition-all duration-300">
            {/* Foto de trás */}
            {photos.length > 2 && photos[2] && (
                <div
                    className="
                        absolute
                        inset-x-4
                        top-2
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-lg
                        group-hover:rotate-12
                        rotate-6
                        transition-all
                        duration-500
                        group-hover:translate-x-2
                    "
                >
                    <CoverImage
                        key={photos[2]}
                        src={photos[2]}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Foto do meio */}
            {photos.length > 1 && photos[1] && (
                <div
                    className="
                        absolute
                        inset-x-2
                        top-1
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-lg
                        -rotate-3
                        transition-all
                        duration-500
                        group-hover:-translate-x-1
                        group-hover:-rotate-6
                    "
                >
                    <CoverImage
                        key={photos[1]}
                        src={photos[1]}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Foto principal */}
            <div
                className={`
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-2xl
                    bg-primary-light
                    shadow-xl
                    transition-transform
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:rotate-2
                    group-hover:scale-105
                    ${emphasis ? "border-2 border-primary shadow-primary" : ""}
                `}
            >
                {photos.length > 0 ? (
                    <CoverImage
                        key={photos[0]}
                        src={photos[0]}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                ) : isLoading ? (
                    <Loading />
                ) : (
                    <CameraSlashIcon size={48} className="absolute top-1/2 left-1/2 -translate-1/2 opacity-40 text-primary-dark" />
                )}

                {/* Gradiente */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                        group-hover:from-black/90
                        group-hover:via-black/40
                        transition-all
                        duration-300
                    "
                />

                {/* Informações */}
                <div className="absolute bottom-0 left-0 p-5 text-white">
                    <h2 className="text-xl font-bold capitalize font-lora text-primary-light">
                        {title}
                    </h2>
                </div>
            </div>
        </div>
    )
}