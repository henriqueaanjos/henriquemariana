"use client";

import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";

import { LiquidGlassWrapper } from "./LiquidGlassWrapper";
import { NewPhotoModal } from "./Modals/NewPhoto";
import { PhotoLightbox } from "./PhotoLightbox";

const galleryPhotos = [
  "/GALERY/AYM_8437.JPG",
  "/GALERY/AYM_8358.JPG",
  "/GALERY/AYM_8753.JPG",
  "/GALERY/AYM_8724.JPG",
  "/GALERY/AYM_9042.JPG",
  "/GALERY/AYM_8485.JPG",
];

export function PhotosGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

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

  const imageClassName =
    "h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]";

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
          {/* PHOTO 1 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(0)}
            className={`${photoClassName} col-span-2 row-span-1 lg:row-span-2`}
          >
            <Image
              src={galleryPhotos[0]}
              alt="Photo 1"
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 50vw"
              className={imageClassName}
            />
          </button>

          {/* PHOTO 2 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(1)}
            className={`${photoClassName} col-span-1 row-span-1`}
          >
            <Image
              src={galleryPhotos[1]}
              alt="Photo 2"
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
              className={imageClassName}
            />
          </button>

          {/* PHOTO 3 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(2)}
            className={`${photoClassName} col-span-1 row-span-1`}
          >
            <Image
              src={galleryPhotos[2]}
              alt="Photo 3"
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
              className={imageClassName}
            />
          </button>
        </div>

        {/* GRUPO DIREITO */}
        <div
          className="
            grid h-64 min-h-0 w-full grid-cols-2 grid-rows-2 gap-1
            sm:h-80
            lg:h-full lg:grid-rows-3
          "
        >
          {/* PHOTO 4 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(3)}
            className={`${photoClassName} col-span-1 row-span-1`}
          >
            <Image
              src={galleryPhotos[3]}
              alt="Photo 4"
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
              className={imageClassName}
            />
          </button>

          {/* PHOTO 5 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(4)}
            className={`${photoClassName} col-span-1 row-span-1 lg:row-span-2`}
          >
            <Image
              src={galleryPhotos[4]}
              alt="Photo 5"
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
              className={imageClassName}
            />
          </button>

          {/* PHOTO 6 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(5)}
            className={`${photoClassName} col-span-1 row-span-1 lg:row-span-2`}
          >
            <Image
              src={galleryPhotos[5]}
              alt="Photo 6"
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
              className={imageClassName}
            />
          </button>

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
        photos={galleryPhotos}
        selectedIndex={selectedPhoto}
        onClose={handleClosePhoto}
        onChange={setSelectedPhoto}
      />
    </>
  );
}