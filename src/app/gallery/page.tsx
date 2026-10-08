"use client";

import { AlbumsCover } from "@/src/components/AlbumsCover";
import { Button } from "@/src/components/Button";
import { NewPhotoModal } from "@/src/components/Modals/NewPhoto";
import { PhotoLightbox } from "@/src/components/PhotoLightbox";

import {
  getImages,
  getStaticPhotos,
  StaticPhoto,
} from "@/src/services/photos";

import {
  ArrowLeftIcon,
  ImagesIcon,
  PlusIcon,
} from "@phosphor-icons/react";

import { useQuery } from "@tanstack/react-query";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        className="min-h-svh w-full bg-background p-4"
      >
        {/* BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_45%)]
            opacity-40
          "
        />

        {/* ============================================================
            HEADER
            ============================================================ */}

        <div className="z-1 mt-8 flex w-full flex-row items-center justify-between">
          <div className="flex flex-col">
            <Button
              className="flex flex-row items-center gap-2"
              onClick={handleBack}
              variant="secondary"
            >
              <ArrowLeftIcon
                size={24}
                className="text-primary-dark"
              />

              <h5 className="font-lora text-sm font-light uppercase text-primary-dark">
                Voltar{" "}
                {selectedAlbum.album
                  ? "para Albuns"
                  : "para a página"}
              </h5>
            </Button>
          </div>

          <div className="border-b-2 border-primary px-2 pb-1">
            <h1 className="font-cormorant text-3xl font-bold uppercase text-primary-dark">
              {selectedAlbum.album ||
                "Galeria"}
            </h1>
          </div>

          <div className="flex flex-col">
            <Button
              className="flex flex-row items-center gap-2"
              onClick={handleOpenModal}
            >
              <PlusIcon
                size={24}
                className="text-background"
              />

              <h5 className="font-lora text-sm font-light uppercase text-background">
                Adicionar fotos
              </h5>
            </Button>
          </div>
        </div>

        {/* ============================================================
            ÁLBUNS
            ============================================================ */}

        {!selectedAlbum.album ? (
          <div className="mt-8 grid h-full w-full grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                onClick={() =>
                  handleSelectAlbum(album)
                }
              >
                <AlbumsCover
                  title={album.album}
                  photos={album.photos.slice(
                    0,
                    3,
                  )}
                />
              </button>
            ))}
          </div>
        ) : galleryPhotos.length > 0 ? (
          /* ==========================================================
             FOTOS DO ÁLBUM
             ========================================================== */

          <div className="mt-7 columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
            {galleryPhotos.map(
              (photo, index) => (
                <button
                  type="button"
                  key={`${photo}-${index}`}
                  onClick={() =>
                    handleOpenPhoto(index)
                  }
                  className="
                    group
                    mb-4
                    block
                    w-full
                    break-inside-avoid
                    overflow-hidden
                    rounded-2xl
                  "
                >
                  <img
                    src={photo}
                    alt={`${selectedAlbum.album} - foto ${
                      index + 1
                    }`}
                    className="
                      block
                      h-auto
                      w-full
                      transition-transform
                      duration-700
                      group-hover:scale-[1.02]
                    "
                  />
                </button>
              ),
            )}
          </div>
        ) : (
          /* ==========================================================
             ÁLBUM VAZIO
             ========================================================== */

          <div className="flex min-h-80 flex-col items-center justify-center text-primary-dark/50">
            <ImagesIcon size={48} />

            <p className="mt-4">
              Este álbum ainda não possui fotos.
            </p>
          </div>
        )}

        {/* ============================================================
            MODAL UPLOAD
            ============================================================ */}

        <NewPhotoModal
          isOpen={isOpen}
          onClose={handleCloseModal}
        />

        {/* ============================================================
            LIGHTBOX
            ============================================================ */}

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