"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

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

  const [direction, setDirection] = useState(1);

  function handlePrevious() {
    if (selectedIndex === null || photos.length === 0) {
      return;
    }

    setDirection(-1);

    const previousIndex =
      selectedIndex === 0
        ? photos.length - 1
        : selectedIndex - 1;

    onChange(previousIndex);
  }

  function handleNext() {
    if (selectedIndex === null || photos.length === 0) {
      return;
    }

    setDirection(1);

    const nextIndex =
      selectedIndex === photos.length - 1
        ? 0
        : selectedIndex + 1;

    onChange(nextIndex);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowLeft":
          handlePrevious();
          break;

        case "ArrowRight":
          handleNext();
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow = "";
    };
  }, [
    isOpen,
    selectedIndex,
    photos.length,
  ]);

  return (
    <AnimatePresence>
      {isOpen && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          {/* CONTADOR */}

          <div className="absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md">
            <p className="font-lora text-[11px] tracking-[0.12em] text-white/70">
              {String(selectedIndex + 1).padStart(2, "0")}
              {" / "}
              {String(photos.length).padStart(2, "0")}
            </p>
          </div>

          {/* FECHAR */}

          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            <XIcon size={20} />
          </button>

          {/* FOTO */}

          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
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
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={photos[selectedIndex]}
                  alt={`Foto ${selectedIndex + 1}`}
                  draggable={false}
                  className="max-h-[85vh] max-w-[92vw] select-none object-contain"
                  onClick={(event) => event.stopPropagation()}
                />
              </motion.div>
            </AnimatePresence>

            {/* ANTERIOR */}

            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white sm:left-5"
              >
                <ArrowLeftIcon size={21} />
              </button>
            )}

            {/* PRÓXIMA */}

            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={handleNext}
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white sm:right-5"
              >
                <ArrowRightIcon size={21} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}