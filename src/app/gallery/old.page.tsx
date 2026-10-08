"use client";

import { LiquidGlassWrapper } from "@/src/components/LiquidGlassWrapper";
import { getImages } from "@/src/services/photos";
import { ArrowLeft, Plus, Images } from "@phosphor-icons/react/ssr";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Album = {
    id: string;
    title: string;
    cover: string;
    photos: string[];
    description?: string;
};

const albums: Album[] = [
    {
        id: "story",
        title: "Nossa História",
        cover: "/AYM_8379_3.jpeg",
        photos: [
            "/AYM_8379_3.jpeg",
            "/AYM_8521_5.jpeg",
            "/AYM_8714-5.jpeg",
        ],
        description: "Momentos que marcaram nossa história.",
    },
    {
        id: "pedido",
        title: "O Pedido",
        cover: "/AYM_8521_5.jpeg",
        photos: [
            "/AYM_8521_5.jpeg",
            "/AYM_8398.jpeg",
            "/AYM_8379.jpeg",
        ],
        description: "O dia em que dissemos sim.",
    },
    {
        id: "casamento",
        title: "Casamento",
        cover: "/AYM_8714-5.jpeg",
        photos: [
            "/AYM_8714-5.jpeg",
            "/AYM_8379.jpeg",
            "/AYM_8721.JPG",
        ],
        description: "Nosso grande dia.",
    },
    {
        id: "envios",
        title: "Envios",
        cover: "/AYM_8721.JPG",
        photos: [
            "/AYM_8721.JPG",
            "/AYM_8398.jpeg",
            "/AYM_8379.jpeg",
        ],
        description: "Fotos enviadas pelos nossos convidados.",
    },
];

export default function GaleriaPage() {
    const [selectedAlbum, setSelectedAlbum] =
        useState<Album | null>(null);

    const router = useRouter();

    const {
        data: uploadedPhotos = [],
        isLoading: isLoadingPhotos,
        isError: isPhotosError,
    } = useQuery({
        queryKey: ["photos"],
        queryFn: getImages,
        enabled: selectedAlbum?.id === "envios",
    });

    const photos =
        selectedAlbum?.id === "envios"
            ? uploadedPhotos.map((photo) => photo.url)
            : selectedAlbum?.photos ?? [];

    function handleBack() {
        if (selectedAlbum) {
            setSelectedAlbum(null);
            return;
        }

        router.push("/#gallery");
    }

    return (
        <main className="min-h-svh bg-background px-6 py-6 md:px-10">
            <header className="relative mb-10 flex items-center justify-between">
                {/* Voltar */}
                <button
                    type="button"
                    onClick={handleBack}
                    className="
                        flex
                        items-center
                        gap-2
                        text-primary-dark
                        transition-all
                        duration-300
                        hover:scale-105
                    "
                >
                    <ArrowLeft size={20} />

                    <span className="text-sm uppercase font-lora">
                        Voltar
                    </span>
                </button>

                {/* Título */}
                <div
                    className="
                        absolute
                        left-1/2
                        -translate-x-1/2
                        border-b-2
                        border-primary
                        px-2
                        pb-1
                    "
                >
                    <h1 className="whitespace-nowrap text-3xl font-bold uppercase text-primary-dark font-cormorant">
                        {selectedAlbum
                            ? selectedAlbum.title
                            : "Galeria"}
                    </h1>
                </div>

                {/* Adicionar */}
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
            </header>

            <AnimatePresence mode="wait">
                {!selectedAlbum && (
                    <motion.div
                        key="albums"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                        className="
                            grid
                            grid-cols-1
                            gap-8
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        "
                    >
                        {albums.map((album) => (
                            <button
                                key={album.id}
                                type="button"
                                onClick={() =>
                                    setSelectedAlbum(album)
                                }
                                className="
                                    group
                                    w-full
                                    text-left
                                    transition-transform
                                    duration-300
                                    hover:scale-[1.02]
                                "
                            >
                                <div className="relative mx-auto aspect-[4/3] w-[90%]">
                                    {/* Foto de trás */}
                                    {album.photos[2] && (
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
                                                rotate-6
                                                transition-all
                                                duration-500
                                                group-hover:rotate-8
                                                group-hover:translate-x-2
                                            "
                                        >
                                            <img
                                                src={album.photos[2]}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Foto do meio */}
                                    {album.photos[1] && (
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
                                            "
                                        >
                                            <img
                                                src={album.photos[1]}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Foto principal */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            overflow-hidden
                                            rounded-2xl
                                            bg-white
                                            shadow-xl
                                            transition-transform
                                            duration-500
                                            group-hover:-translate-y-1
                                        "
                                    >
                                        <img
                                            src={album.cover}
                                            alt={album.title}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition-transform
                                                duration-700
                                                group-hover:scale-105
                                            "
                                        />

                                        {/* Gradiente */}
                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-t
                                                from-black/70
                                                via-black/10
                                                to-transparent
                                            "
                                        />

                                        {/* Informações */}
                                        <div
                                            className="
                                                absolute
                                                bottom-0
                                                left-0
                                                p-5
                                                text-white
                                            "
                                        >
                                            <h2 className="text-xl font-bold">
                                                {album.title}
                                            </h2>

                                            {album.description && (
                                                <p className="mt-1 text-sm text-white/80">
                                                    {album.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}

                {selectedAlbum && (
                    <motion.div
                        key={`album-${selectedAlbum.id}`}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                    >
                        {selectedAlbum.description && (
                            <p className="mb-6 text-center text-sm text-primary-dark/60">
                                {selectedAlbum.description}
                            </p>
                        )}

                        <div
                            className="
                                columns-1
                                gap-2
                                sm:columns-2
                                lg:columns-3
                                xl:columns-4
                            "
                        >
                            {photos.map((photo, index) => (
                                <div
                                    key={`${photo}-${index}`}
                                    className="
                                        mb-4
                                        break-inside-avoid
                                        overflow-hidden
                                        rounded-2xl
                                    "
                                >
                                    <img
                                        src={photo}
                                        alt={`${selectedAlbum.title} - foto ${index + 1}`}
                                        className="
                                            block
                                            h-auto
                                            w-full
                                            transition-transform
                                            duration-500
                                            hover:scale-[1.02]
                                        "
                                    />
                                </div>
                            ))}
                        </div>

                        {photos.length === 0 && (
                            <div className="flex min-h-80 flex-col items-center justify-center text-primary-dark/50">
                                <Images size={48} />

                                <p className="mt-4">
                                    Este álbum ainda não possui fotos.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}