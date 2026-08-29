'use client';
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";
import { useState } from "react";
import { Modal } from "./Modal";
import Input from "./Input";
import { Dropzone } from "./Dropzone";

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
            <Modal isOpen={isOpen} onClose={handleCloseModal}>
                <div className="w-full h-full cursor-default flex flex-col gap-8 overflow-y">
                    <div className="w-full flex flex-col items-center">
                        <div className="border-b-2 border-primary pb-1 px-2 text-center">
                            <h1 className="text-base text-primary-light uppercase font-cormorant">Envie suas fotos</h1>
                        </div>
                    </div>
                    <div className="w-full h-full grow flex flex-col gap-4">
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome completo"
                        />
                        <Dropzone />
                    </div>
                    <div className="w-full">
                        <LiquidGlassWrapper className="bg-primary-dark/70 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                            <button className="px-3 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10">
                                <p className="text-background uppercase font-lora text-sm">Enviar</p>
                            </button>
                        </LiquidGlassWrapper>
                    </div>
                </div>
            </Modal>
        </div >
    );
}