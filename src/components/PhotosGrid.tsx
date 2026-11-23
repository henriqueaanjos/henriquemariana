"use client";

import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { LiquidGlassWrapper } from "./LiquidGlassWrapper";
import { NewPhotoModal } from "./Modals/NewPhoto";
import { PhotoLightbox } from "./PhotoLightbox";
import { getImages } from "@/src/services/photos";

const STATIC_PHOTOS = [
  "/Gallery_1.jpg",
  "/Gallery_2.JPG",
  "/Gallery_3.JPG",
  "/Gallery_4.JPG",
  "/Gallery_5.JPG",
  "/Gallery_6.JPG",
];

function HomePhoto({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className: string;
  onClick: () => void;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <button type="button" onClick={onClick} className={className}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-primary-light/40" />
      )}

      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light/30 text-background/60">
          <span className="font-lora text-[10px] uppercase">Indisponível</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 hover:scale-[1.02] ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </button>
  );
}

export function PhotosGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const { data: uploadedPhotos = [] } = useQuery({
    queryKey: ["photos"],
    queryFn: getImages,
  });

  const photos = useMemo(() => {
    const latest = [...uploadedPhotos]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 6)
      .map((photo) => photo.url);

    return [...latest, ...STATIC_PHOTOS].slice(0, 6);
  }, [uploadedPhotos]);

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleOpenPhoto(index: number) {
    setSelectedPhoto(index);
  }

  function handleClosePhoto() {
    setSelectedPhoto(null);
  }

  const photoClassName =
    "relative h-full w-full min-h-0 min-w-0 cursor-pointer overflow-hidden";

  return (
    <>
      <div
        className="
          grid w-full grid-cols-1 gap-2
          sm:gap-3
          lg:h-full lg:min-h-0 lg:grid-cols-2 lg:gap-1
        "
      >
        {/* GRUPO ESQUERDO */}
        <div
          className="
            grid h-64 min-h-0 w-full grid-cols-2 grid-rows-2 gap-1
            sm:h-80
            lg:h-full lg:grid-rows-3
          "
        >
          <HomePhoto
            key={photos[0]}
            src={photos[0]}
            alt="Foto 1 da galeria"
            className={`${photoClassName} col-span-2 row-span-1 lg:row-span-2`}
            onClick={() => handleOpenPhoto(0)}
          />

          <HomePhoto
            key={photos[1]}
            src={photos[1]}
            alt="Foto 2 da galeria"
            className={`${photoClassName} col-span-1 row-span-1`}
            onClick={() => handleOpenPhoto(1)}
          />

          <HomePhoto
            key={photos[2]}
            src={photos[2]}
            alt="Foto 3 da galeria"
            className={`${photoClassName} col-span-1 row-span-1`}
            onClick={() => handleOpenPhoto(2)}
          />
        </div>

        {/* GRUPO DIREITO */}
        <div
          className="
            grid h-64 min-h-0 w-full grid-cols-2 grid-rows-2 gap-1
            sm:h-80
            lg:h-full lg:grid-rows-3
          "
        >
          <HomePhoto
            key={photos[3]}
            src={photos[3]}
            alt="Foto 4 da galeria"
            className={`${photoClassName} col-span-1 row-span-1`}
            onClick={() => handleOpenPhoto(3)}
          />

          <HomePhoto
            key={photos[4]}
            src={photos[4]}
            alt="Foto 5 da galeria"
            className={`${photoClassName} col-span-1 row-span-1 lg:row-span-2`}
            onClick={() => handleOpenPhoto(4)}
          />

          <HomePhoto
            key={photos[5]}
            src={photos[5]}
            alt="Foto 6 da galeria"
            className={`${photoClassName} col-span-1 row-span-1 lg:row-span-2`}
            onClick={() => handleOpenPhoto(5)}
          />

          {/* ADD PHOTO */}
          <LiquidGlassWrapper className="relative col-span-1 row-span-1 h-full w-full rounded-xl bg-background/20">
            <button
              type="button"
              onClick={handleOpenModal}
              className="z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-2"
            >
              <PlusIcon
                size={32}
                className="shrink-0 text-background"
              />

              <p className="text-center font-lora text-[10px] font-light uppercase text-background sm:text-xs lg:text-sm">
                Adicionar nova foto
              </p>
            </button>
          </LiquidGlassWrapper>
        </div>
      </div>

      {/* MODAL DE NOVA FOTO */}
      <NewPhotoModal
        isOpen={isOpen}
        onClose={handleCloseModal}
      />

      {/* LIGHTBOX */}
      <PhotoLightbox
        photos={photos}
        selectedIndex={selectedPhoto}
        onClose={handleClosePhoto}
        onChange={setSelectedPhoto}
      />
    </>
  );
}