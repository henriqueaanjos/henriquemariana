
"use client";

import { AlbumsCover } from "@/src/components/AlbumsCover";
import { Button } from "@/src/components/Button";
import { NewPhotoModal } from "@/src/components/Modals/NewPhoto";
import { PhotoLightbox } from "@/src/components/PhotoLightbox";

import {
  getImages,
  getStaticPhotos,
  type StaticPhoto,
} from "@/src/services/photos";

import {
  ArrowLeftIcon,
  ImagesIcon,
  PlusIcon,
} from "@phosphor-icons/react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function GalleryPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedAlbum, setSelectedAlbum] =
    useState<StaticPhoto>({} as StaticPhoto);

  const [selectedPhoto, setSelectedPhoto] =
    useState<number | null>(null);

  const router = useRouter();

  function handleBack() {
    if (selectedAlbum.album) {
      setSelectedAlbum({} as StaticPhoto);
      setSelectedPhoto(null);
    } else {
      router.push("/#gallery");
    }
  }

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleSelectAlbum(album: StaticPhoto) {
    setSelectedAlbum(album);
    setSelectedPhoto(null);
  }

  function handleOpenPhoto(index: number) {
    setSelectedPhoto(index);
  }

  function handleClosePhoto() {
    setSelectedPhoto(null);
  }

  const { data: albums = [] } = useQuery({
    queryKey: ["albums"],
    queryFn: getStaticPhotos,
  });

  const {
    data: uploadedPhotos = [],
    isPending: isLoadingPhotos,
  } = useQuery({
    queryKey: ["photos"],
    queryFn: getImages,
  });

  const galleryPhotos = selectedAlbum.photos ?? [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-svh w-full overflow-x-hidden bg-background p-4 pt-5 sm:p-6 sm:pt-7 lg:p-4"
      >
        {/* BACKGROUND */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_45%)] opacity-40"
        />


        {/* HEADER */}
        <header className="relative z-10 mt-4 flex w-full items-center justify-between sm:mt-6 lg:mt-8">
          {/* VOLTAR */}
          <div className="relative z-10 flex w-fit shrink-0">
            <Button
              className="!w-fit !min-w-0 inline-flex shrink-0 flex-row items-center justify-center gap-1.5 px-2 sm:gap-2 sm:px-3"
              onClick={handleBack}
              variant="secondary"
            >
              <ArrowLeftIcon
                size={20}
                className="shrink-0 text-primary-dark sm:size-6"
              />

              <span className="hidden whitespace-nowrap font-lora text-sm font-light uppercase text-primary-dark sm:inline">
                Voltar{selectedAlbum.album ? " para Álbuns" : " para a página"}
              </span>
            </Button>
          </div>

          {/* TÍTULO CENTRALIZADO */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-b-2 border-primary px-2 pb-1">
            <h1 className="whitespace-nowrap text-center font-cormorant text-2xl font-bold uppercase text-primary-dark sm:text-3xl">
              {selectedAlbum.album || "Galeria"}
            </h1>
          </div>

          {/* ADICIONAR FOTOS */}
          <div className="relative z-10 flex w-fit shrink-0 rounded-full sm:rounded-none">
            <Button
              className="!w-fit !min-w-0 inline-flex shrink-0 flex-row items-center justify-center gap-1.5 px-2 sm:gap-2 sm:px-3 "
              onClick={handleOpenModal}
            >
              <PlusIcon
                size={20}
                className="shrink-0 text-background sm:size-6"
              />

              <span className="hidden whitespace-nowrap font-lora text-sm font-light uppercase text-background sm:inline">
                Adicionar fotos
              </span>
            </Button>
          </div>
        </header>


        {/* ÁLBUNS */}
        {!selectedAlbum.album ? (
          <div className="relative z-10 mt-6 grid w-full grid-cols-1 items-start gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:mt-8 lg:grid-cols-4">
            {/* ENVIOS */}
            <button
              type="button"
              onClick={() =>
                handleSelectAlbum({
                  album: "envios",
                  photos: uploadedPhotos.map(
                    (photo) => photo.url,
                  ),
                })
              }
              className="w-full text-left"
            >
              <AlbumsCover
                title="envios"
                photos={uploadedPhotos
                  .map((photo) => photo.url)
                  .slice(0, 3)}
                isLoading={isLoadingPhotos}
                emphasis
              />
            </button>

            {/* ÁLBUNS ESTÁTICOS */}
            {albums.map((album, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleSelectAlbum(album)}
                className="w-full text-left"
              >
                <AlbumsCover
                  title={album.album}
                  photos={album.photos.slice(0, 3)}
                />
              </button>
            ))}
          </div>
        ) : galleryPhotos.length > 0 ? (
          <>
            {/* FOTOS DO ÁLBUM */}
            <div className="relative z-10 mt-6 columns-2 gap-2 sm:mt-7 sm:columns-2 sm:gap-3 lg:columns-3 xl:columns-4">
              {galleryPhotos.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo}-${index}`}
                  onClick={() => handleOpenPhoto(index)}
                  aria-label={`Abrir foto ${index + 1} do álbum ${selectedAlbum.album}`}
                  className="group mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl sm:mb-4 sm:rounded-2xl"
                >
                  <img
                    src={photo}
                    alt={`${selectedAlbum.album} - foto ${index + 1}`}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ÁLBUM VAZIO */
          <div className="relative z-10 flex min-h-[50svh] flex-col items-center justify-center px-4 text-center text-primary-dark/50">
            <ImagesIcon size={48} />

            <p className="mt-4 font-lora text-sm">
              Este álbum ainda não possui fotos.
            </p>
          </div>
        )}

        {/* MODAL UPLOAD */}
        <NewPhotoModal
          isOpen={isOpen}
          onClose={handleCloseModal}
        />

        {/* LIGHTBOX */}
        <PhotoLightbox
          photos={galleryPhotos}
          selectedIndex={selectedPhoto}
          onClose={handleClosePhoto}
          onChange={setSelectedPhoto}
        />
      </motion.div>
    </AnimatePresence>
  );
}
