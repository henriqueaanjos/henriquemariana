'use client';
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";
import { useState } from "react";
import { Modal } from "./Modal";
import Input from "./Input";
import { Dropzone } from "./Dropzone";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImages } from "../services/photos";
import { NewPhotoModal } from "./Modals/NewPhoto";

export function PhotosGrid() {
    const [isOpen, setIsOpen] = useState(false);

    function handleCloseModal() {
        setIsOpen(false);
    }

    function handleOpenModal() {
        setIsOpen(true);
    }
    return (
        <div className="w-full  h-full grid grid-cols-2 gap-1">
            <div className="w-full h-full  grid grid-cols-2 grid-rows-3 gap-1">
                <div className="w-full h-full  col-span-2 row-span-2 relative">
                    {/* PHOTO 1 */}
                    <Image
                        src="/GALERY/AYM_8437.JPG"
                        alt="Photo 1"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="w-full h-full  col-span-1 row-span-1 relative">
                    {/* PHOTO 2 */}
                    <Image
                        src="/GALERY/AYM_8358.JPG"
                        alt="Photo 2"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="w-full h-full  col-span-1 row-span-1 relative">
                    {/* PHOTO 3 */}
                    <Image
                        src="/GALERY/AYM_8753.JPG"
                        alt="Photo 3"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            </div>
            <div className="w-full h-full  grid grid-cols-2 grid-rows-3 gap-1">
                <div className="w-full h-full col-span-1 row-span-1 relative">
                    {/* PHOTO 4 */}
                    <Image
                        src="/GALERY/AYM_8724.JPG"
                        alt="Photo 1"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="w-full h-full  col-span-1 row-span-2 relative">
                    {/* PHOTO 5 */}
                    <Image
                        src="/GALERY/AYM_9042.JPG"
                        alt="Photo 1"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="w-full h-full  col-span-1 row-span-2 relative">
                    {/* PHOTO 6 */}
                    <Image
                        src="/GALERY/AYM_8485.JPG"
                        alt="Photo 1"
                        fill
                        sizes="100%"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                <LiquidGlassWrapper className="bg-background/20 rounded-xl w-full h-full col-span-1 row-span-1 relative">
                    <button
                        onClick={handleOpenModal}
                        className="h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10"
                    >
                        {/* BUTTON + */}
                        <PlusIcon size={32} className="text-background" />
                        <p className="text-background uppercase text-sm font-lora font-light">Adicionar nova foto</p>
                    </button>
                </LiquidGlassWrapper>
            </div>
            <NewPhotoModal isOpen={isOpen} onClose={handleCloseModal} />
        </div >
    );
}