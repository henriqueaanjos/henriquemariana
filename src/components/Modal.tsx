'use client'

import { X } from "@phosphor-icons/react/ssr"
import { LiquidGlassWrapper } from "./LiquidGlassWrapper"
import { useEffect } from "react"
import { motion, AnimatePresence} from "motion/react"

type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
}

export function Modal({ isOpen, children, onClose }: ModalProps) {

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
        {isOpen && (
        <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={`absolute inset-0  bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <LiquidGlassWrapper className="bg-black/80 rounded-3xl p-8 relative w-full max-w-xl z-10 shadow-lg">
                <div className="flex flex-col gap-4">
                    <button
                        className="self-end text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={onClose}
                    >
                        <X size={24} className="text-background" />
                    </button>
                    {children}
                </div>
            </LiquidGlassWrapper>
        </motion.div>
    )}
</AnimatePresence>
)
}