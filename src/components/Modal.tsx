'use client'

import { X } from "@phosphor-icons/react/ssr"
import { LiquidGlassWrapper } from "./LiquidGlassWrapper"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { createPortal } from "react-dom"

type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
}

export function Modal({ isOpen, children, onClose }: ModalProps) {
    const [mounted, setMounted] = useState(false)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Janela de diálogo"
                >
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <LiquidGlassWrapper className="relative z-10 flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-black/80 p-5 shadow-lg sm:p-8">
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Fechar"
                            className="self-end flex size-11 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-200"
                        >
                            <X size={24} className="text-background" />
                        </button>

                        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
                            {children}
                        </div>
                    </LiquidGlassWrapper>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}