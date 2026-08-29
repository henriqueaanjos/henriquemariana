'use client';

import Image from "next/image";

const dates = [
    {
        id: "01",
        date: "03 dez 2023",
        title: "O Início da História",
        image: "/AYM_8379_3.jpeg",
        description:
            "Foi aqui que nossa história começou. O primeiro capítulo de tudo o que ainda estava por vir.",
    },
    {
        id: "02",
        date: "03 abr 2026",
        title: 'O "Sim"',
        image: "/AYM_8521_5.jpeg",
        description:
            "Um momento que transformou nossa história e nos trouxe ainda mais perto do próximo capítulo.",
    },
    {
        id: "03",
        date: "09 jan 2027",
        title: "O Próximo Passo",
        image: "/AYM_8714-5.jpeg",
        description:
            "O dia em que diremos sim para uma vida inteira juntos.",
    },
];

export default function Dates() {
    return (
        <section
            id="dates"
            className="
                snap-start
                relative
                min-h-screen
                w-full
                overflow-hidden
                bg-background
                justify-between
            "
        >
            <div className="h-screen w-full px-12 py-20 lg:px-24  flex flex-row items-center justify-between grow pt-36">
                {/* Título */}
                <div className="w-[40%]">
                    <h2
                        className="
                        font-cormorant
                        text-[clamp(4rem,7vw,7rem)]
                        font-light
                        uppercase
                        leading-[0.95]
                        tracking-[-0.04em]
                        text-transparent
                        bg-clip-text
                        bg-linear-to-r from-primary-dark to-primary-light
                    "
                    >
                        Datas
                        <br />
                        Mar
                        <br />
                        Cantes
                    </h2>
                </div>

                <div className="w-[60%] h-full min-h-150 flex flex-row justify-between gap-8 relative">
                    {dates.map((date, index) => (
                        <div
                            key={date.id}
                            className={`relative flex w-64 flex-col gap-10`}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={date.image}
                                    alt={date.title}
                                    fill
                                    sizes="100%"
                                    className="w-64 h-full rounded-t-full rounded-b-full object-cover object-[48%_50%] transition-all "
                                />

                                <h1 className='px-2 font-bickham-script-pro-regular text-[18rem]/[0.3] absolute -bottom-1 right-1 text-background mix-blend-difference  '>{index + 1}.</h1>
                                <h1 className='font-bickham-script-pro-regular text-[18rem]/[0.3] absolute bottom-0 right-0 text-transparent text-clip mix-blend-difference '>{index + 1}.</h1>
                            </div>

                            <div className="w-full flex flex-col items-center">
                                <h1 className="text-primary text-lg font-lora">{date.date}</h1>
                                <h2 className="font-bickham-script-pro-regular text-primary-dark text-5xl whitespace-nowrap">{date.title}</h2>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}