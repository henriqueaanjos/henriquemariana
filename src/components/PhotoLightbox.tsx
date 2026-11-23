"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

interface PhotoLightboxProps {
  photos: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
  }),
};

export function PhotoLightbox({
  photos,
  selectedIndex,
  onClose,
  onChange,
}: PhotoLightboxProps) {
  const isOpen = selectedIndex !== null;
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setImageStatus("loading");
  }, [selectedIndex === null ? null : photos[selectedIndex]]);

  function handlePrevious() {
    if (selectedIndex === null || photos.length === 0) return;

    setDirection(-1);

    const previousIndex =
      selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;

    onChange(previousIndex);
  }

  function handleNext() {
    if (selectedIndex === null || photos.length === 0) return;

    setDirection(1);

    const nextIndex =
      selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;

    onChange(nextIndex);
  }

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, selectedIndex, photos.length, onClose, onChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && selectedIndex !== null && photos[selectedIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="
            fixed inset-0 z-[9999]
            flex h-[100dvh] w-screen
            items-center justify-center
            overflow-hidden bg-black/85
            p-4 backdrop-blur-md
          "
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização de fotos"
        >
          {/* Contador de fotos */}
          <div
            className="
              absolute left-1/2 top-5 z-30
              -translate-x-1/2 rounded-full
              border border-white/20 bg-black/40
              px-4 py-2 font-lora text-sm
              text-white backdrop-blur-md
            "
          >
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Botão fechar */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="
              absolute right-4 top-4 z-40
              flex size-11 items-center justify-center
              rounded-full border border-white/20
              bg-black/40 text-white
              transition hover:bg-white/20
              sm:right-6 sm:top-6
            "
            aria-label="Fechar galeria"
          >
            <XIcon size={24} weight="bold" />
          </button>

          {/* Área da foto */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="wait"
            >
              <motion.div
                key={photos[selectedIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: 0.2 },
                  x: { duration: 0.25 },
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {imageStatus === "loading" && (
                  <div className="absolute aspect-video w-full max-w-3xl animate-pulse rounded-xl bg-white/10" />
                )}

                {imageStatus === "error" ? (
                  <div className="flex flex-col items-center gap-2 text-white/60">
                    <WarningCircleIcon size={32} />
                    <p className="font-lora text-xs">
                      Não foi possível carregar esta foto.
                    </p>
                  </div>
                ) : (
                  <img
                    src={photos[selectedIndex]}
                    alt={`Foto ${selectedIndex + 1} de ${photos.length}`}
                    onLoad={() => setImageStatus("loaded")}
                    onError={() => setImageStatus("error")}
                    className={`max-h-full max-w-full select-none object-contain transition-opacity duration-300 ${
                      imageStatus === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                    draggable={false}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Foto anterior */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePrevious();
                }}
                className="
                  absolute left-0 top-1/2 z-30
                  flex size-11 -translate-y-1/2
                  items-center justify-center
                  rounded-full border border-white/20
                  bg-black/40 text-white
                  transition hover:bg-white/20
                  sm:left-2 sm:size-12
                "
                aria-label="Foto anterior"
              >
                <ArrowLeftIcon size={24} weight="bold" />
              </button>
            )}

            {/* Próxima foto */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNext();
                }}
                className="
                  absolute right-0 top-1/2 z-30
                  flex size-11 -translate-y-1/2
                  items-center justify-center
                  rounded-full border border-white/20
                  bg-black/40 text-white
                  transition hover:bg-white/20
                  sm:right-2 sm:size-12
                "
                aria-label="Próxima foto"
              >
                <ArrowRightIcon size={24} weight="bold" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}