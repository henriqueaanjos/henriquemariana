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

  return (
    <>
      <div className="w-full h-full grid grid-cols-2 gap-1">
        <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-1">
          {/* PHOTO 1 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(0)}
            className="w-full h-full col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[0]}
              alt="Photo 1"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>

          {/* PHOTO 2 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(1)}
            className="w-full h-full col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[1]}
              alt="Photo 2"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>

          {/* PHOTO 3 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(2)}
            className="w-full h-full col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[2]}
              alt="Photo 3"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>
        </div>

        <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-1">
          {/* PHOTO 4 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(3)}
            className="w-full h-full col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[3]}
              alt="Photo 4"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>

          {/* PHOTO 5 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(4)}
            className="w-full h-full col-span-1 row-span-2 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[4]}
              alt="Photo 5"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>

          {/* PHOTO 6 */}
          <button
            type="button"
            onClick={() => handleOpenPhoto(5)}
            className="w-full h-full col-span-1 row-span-2 relative cursor-pointer overflow-hidden"
          >
            <Image
              src={galleryPhotos[5]}
              alt="Photo 6"
              fill
              sizes="100%"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>

          {/* ADD PHOTO */}
          <LiquidGlassWrapper className="bg-background/20 rounded-xl w-full h-full col-span-1 row-span-1 relative">
            <button
              type="button"
              onClick={handleOpenModal}
              className="h-full w-full grow flex flex-col items-center justify-center gap-2 cursor-pointer z-10"
            >
              <PlusIcon size={32} className="text-background" />

              <p className="text-background uppercase text-sm font-lora font-light">
                Adicionar nova foto
              </p>
            </button>
          </LiquidGlassWrapper>
        </div>
      </div>

      <NewPhotoModal
        isOpen={isOpen}
        onClose={handleCloseModal}
      />

      <PhotoLightbox
        photos={galleryPhotos}
        selectedIndex={selectedPhoto}
        onClose={handleClosePhoto}
        onChange={setSelectedPhoto}
      />
    </>
  );
}