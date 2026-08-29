'use client'

import { ArrowLeftIcon, CreditCardIcon, GiftIcon, MoneyIcon, QrCodeIcon } from "@phosphor-icons/react"
import Image from "next/image"
import { LiquidGlassWrapper } from "../LiquidGlassWrapper"
import { useState } from "react"
import Link from "next/link"
import { CardGifts } from "../CardGifts"
import { Modal } from "../Modal"

export function Gifts() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<"none" | "gift" | "money">("none")

    function handleOpenModal() {
        setIsOpen(true);
    }

    function handleCloseModal() {
        setIsOpen(false);
    }
    return (
        <section
            id="gifts"
            className="h-screen w-screen snap-start bg-[url(/AYM_8544-3.jpeg)] bg-cover bg-top bg-no-repeat flex relative flex-col items-center pt-36 px-8 pb-14"
        >
            <div className="w-full h-full absolute z-0 inset-0 bg-linear-to-t from-olive-900/90 to-olive-900/10 to-65%" />
            <div className="z-1 flex w-full flex-col items-center">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">Listas de Presentes</h1>
                </div>
                <h5 className="text-primary-dark text-sm uppercase mt-2 font-lora">A presença de vocês é o nosso maior presente! Se desejarem, reunimos algumas opções com carinho</h5>
            </div>
            <div className="mt-7 w-full h-full flex grow flex-col items-start relative ">
                {selectedOption === "none" ?
                    <div className="w-[40%] h-full grow  flex flex-col gap-6 items-start justify-center p-4">
                        <LiquidGlassWrapper className="bg-black/20 rounded-3xl w-full flex-1 cursor-pointer hover:scale-105 transition-all duration-500">
                            <div className="flex flex-col gap-4 w-full h-full items-center justify-center" onClick={() => setSelectedOption("gift")}>
                                <GiftIcon size={32} className="text-primary-light" />
                                <div className="border-b-2 border-primary pb-1 px-2">
                                    <h1 className="text-base text-primary-light uppercase font-cormorant">Lista de Presentes</h1>
                                </div>
                                <p className="font-lora text-primary-light/70 font-light text-sm">Para o nosso novo lar, com carinho</p>
                            </div>
                        </LiquidGlassWrapper>
                        <LiquidGlassWrapper className="bg-black/20 rounded-3xl w-full flex-1 cursor-pointer hover:scale-105 transition-all duration-500">
                            <div className="flex flex-col gap-4 w-full h-full items-center justify-center" onClick={() => setSelectedOption("money")}>
                                <MoneyIcon size={32} className="text-primary-light" />
                                <div className="border-b-2 border-primary pb-1 px-2">
                                    <h1 className="text-base text-primary-light uppercase font-cormorant">Presentes em Dinheiro</h1>
                                </div>
                                <p className="font-lora text-primary-light/70 font-light text-sm">Para os sonhos que estamos construindo juntos.</p>
                            </div>
                        </LiquidGlassWrapper>
                    </div>
                    : selectedOption === "gift" ?
                        <>
                            <LiquidGlassWrapper className="bg-primary-light/40 rounded-lg relative ml-6">
                                <button className="px-3 py-2 h-full w-full grow flex flex-row items-center justify-center gap-2  cursor-pointer z-10" onClick={() => setSelectedOption("none")}>
                                    <ArrowLeftIcon size={20} className="text-primary-dark" />
                                    <p className="text-primary-dark uppercase font-lora text-sm">Voltar</p>
                                </button>
                            </LiquidGlassWrapper>
                            <div className="w-full h-full grow  flex flex-row gap-6 items-center pb-8 justify-center p-4">
                                <CardGifts
                                    href="https://www.finalfeliz.de/henriqueemari"
                                    imageSrc="/magalu.webp"
                                    imageAlt={"Magalu"}
                                    description={"Eletrodomésticos e itens para o nosso lar."}
                                />
                                <CardGifts
                                    href=""
                                    imageSrc="/Havan_logo.svg"
                                    imageAlt={"Havan"}
                                    description={"Utensílios e detalhes para a nossa casa."}
                                />
                                <CardGifts
                                    href=""
                                    imageSrc="/mmartan-seeklogo.svg"
                                    imageAlt={"Mmartan"}
                                    description={"Conforto e aconchego para o nosso lar."}
                                />
                                <CardGifts
                                    href=""
                                    imageSrc="/sotto_logo.png"
                                    imageAlt={"Sotto Design"}
                                    description={"Móveis e detalhes para o nosso cantinho."}
                                />
                            </div>
                        </>
                        :
                        <>
                            <LiquidGlassWrapper className="bg-primary-light/40 rounded-lg relative ml-6">
                                <button className="px-3 py-2 h-full w-full grow flex flex-row items-center justify-center gap-2  cursor-pointer z-10" onClick={() => setSelectedOption("none")}>
                                    <ArrowLeftIcon size={20} className="text-primary-dark" />
                                    <p className="text-primary-dark uppercase font-lora text-sm">Voltar</p>
                                </button>
                            </LiquidGlassWrapper>
                            <div className="w-full h-full grow  flex flex-row gap-6 items-center pb-8 justify-center p-4">
                                <LiquidGlassWrapper className="bg-black/20 rounded-3xl w-full h-1/2 flex-1 cursor-pointer hover:scale-105 transition-all duration-500">
                                    <div className="flex flex-col gap-4 w-full h-full items-center justify-center" onClick={handleOpenModal}>
                                        <QrCodeIcon size={32} className="text-primary-light" />
                                        <div className="border-b-2 border-primary pb-1 px-2">
                                            <h1 className="text-base text-primary-light uppercase font-cormorant">Pix</h1>
                                        </div>
                                        <p className="font-lora text-primary-light/70 font-light text-sm">Uma contribuição para os nossos próximos passos.</p>
                                    </div>
                                </LiquidGlassWrapper>
                                <LiquidGlassWrapper className="bg-black/20 rounded-3xl w-full h-1/2 flex-1 cursor-pointer hover:scale-105 transition-all duration-500">
                                    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
                                        <CreditCardIcon size={32} className="text-primary-light" />
                                        <div className="border-b-2 border-primary pb-1 px-2">
                                            <h1 className="text-base text-primary-light uppercase font-cormorant">Cartão de Crédito</h1>
                                        </div>
                                        <p className="font-lora text-primary-light/70 font-light text-sm">Uma forma prática de contribuir com carinho.</p>
                                    </div>
                                </LiquidGlassWrapper>
                            </div>
                        </>
                }
            </div>
            <Modal isOpen={isOpen} onClose={handleCloseModal}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">

                </div>
            </Modal>
        </section>
    )
}