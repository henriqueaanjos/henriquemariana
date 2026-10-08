"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Trash,
  Warning,
  X,
} from "@phosphor-icons/react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[3px]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 12,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-black/6 bg-[#FCFBF8] p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8D4B42]/8 text-[#8D4B42]">
                  <Warning
                    size={22}
                    weight="duotone"
                  />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A867D] transition hover:bg-black/4"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5">
                <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[#292722]">
                  {title}
                </h2>

                <p className="mt-2 text-[13px] leading-5 text-[#858178]">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-10 rounded-xl px-4 text-[13px] font-medium text-[#77736B] transition hover:bg-black/4"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#8D4B42] px-4 text-[13px] font-medium text-white transition hover:bg-[#793E36] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash size={15} />

                  {isLoading
                    ? "Excluindo..."
                    : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}