'use client'

import { AlbumsCover } from "@/src/components/AlbumsCover"
import { Button } from "@/src/components/Button"
import { NewPhotoModal } from "@/src/components/Modals/NewPhoto"
import { getImages, getStaticPhotos, StaticPhoto } from "@/src/services/photos"
import { ArrowLeftIcon, ImagesIcon, PlusIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function GalleryPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState<StaticPhoto>({} as StaticPhoto)

    const router = useRouter()

    function handleBack() {
        if (selectedAlbum.album)
            setSelectedAlbum({} as StaticPhoto)
        else
            router.push('/#gallery')
    }

    function handleOpenModal() {
        setIsOpen(true)
    }

    function handleCloseModal() {
        setIsOpen(false)
    }

    function handleSelectAlbum(album: StaticPhoto) {
        setSelectedAlbum(album)
    }

    const { data: albums = [] } = useQuery({
        queryKey: ["albums"],
        queryFn: getStaticPhotos,
    });

    const {
        data: uploadedPhotos = [],
        isPending: isLoadingPhotos,
        isError: isPhotosError,
    } = useQuery({
        queryKey: ["photos"],
        queryFn: getImages,
    });


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className='h-svh w-full bg-background p-4'
            >
                <div
                    className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-40
                    bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_45%)]
                "
                />
                <div className="z-1 flex w-full mt-8 flex-row items-center justify-between ">
                    <div className="flex flex-col">
                        <Button
                            className="flex flex-row items-center gap-2"
                            onClick={handleBack}
                            variant="secondary"
                        >
                            <ArrowLeftIcon size={24} className="text-primary-dark" />
                            <h5 className="text-primary-dark uppercase text-sm font-lora font-light">Voltar {selectedAlbum.album ? "para Albuns" : "para a página"}</h5>
                        </Button>
                    </div>
                    <div className="border-b-2 border-primary pb-1 px-2">
                        <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">{selectedAlbum.album ? selectedAlbum.album : "Galeria"}</h1>
                    </div>
                    <div className="flex flex-col">
                        <Button className="flex flex-row items-center gap-2" onClick={handleOpenModal}>
                            <PlusIcon size={24} className="text-background" />
                            <h5 className="text-background uppercase text-sm font-lora font-light">Adicionar fotos</h5>
                        </Button>
                    </div>
                </div>
                {!selectedAlbum.album ?
                    <div className="mt-8 w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                        <button onClick={() => handleSelectAlbum(
                            {
                                album: "envios",
                                photos: uploadedPhotos.map(photo => photo.url)
                            }
                        )}>
                            <AlbumsCover 
                                title='envios' 
                                photos={uploadedPhotos.map(photo => photo.url).slice(0, 3)}
                                isLoading={isLoadingPhotos}
                                emphasis
                            />
                        </button>
                        {
                            albums?.map((album, index) => (
                                <button key={index} onClick={() => handleSelectAlbum(album)}>
                                    <AlbumsCover title={album.album} photos={album.photos.slice(0, 3)} />
                                </button>
                            ))
                        }
                    </div>
                    :
                    selectedAlbum.photos.length > 0 ?
                        <div
                            className="
                                mt-7
                                columns-1
                                gap-2
                                sm:columns-2
                                lg:columns-3
                                xl:columns-4
                            "
                        >
                            {selectedAlbum.photos.map((photo, index) => (
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
                                        alt={`${selectedAlbum.album} - foto ${index + 1}`}
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
                        :
                        <div className="flex min-h-80 flex-col items-center justify-center text-primary-dark/50">
                            <ImagesIcon size={48} />

                            <p className="mt-4">
                                Este álbum ainda não possui fotos.
                            </p>
                        </div>
                }
                <NewPhotoModal isOpen={isOpen} onClose={handleCloseModal} />
            </motion.div>
        </AnimatePresence>
    )
}