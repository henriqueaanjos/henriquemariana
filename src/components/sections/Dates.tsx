"use client";

import Image from "next/image";

const dates = [
  {
    id: "01",
    date: "03 dez 2023",
    title: "O Início da História",
    image: "/AYM_8333_5.jpg",
    description:
      "Foi aqui que nossa história começou. O primeiro capítulo de tudo o que ainda estava por vir.",
  },
  {
    id: "02",
    date: "03 abr 2026",
    title: 'O "Sim"',
    image: "/AYM_8993_2.jpg",
    description:
      "Um momento que transformou nossa história e nos trouxe ainda mais perto do próximo capítulo.",
  },
  {
    id: "03",
    date: "09 jan 2027",
    title: "O Próximo Passo",
    image: "/AYM_8724_1.jpg",
    description:
      "O dia em que diremos sim para uma vida inteira juntos.",
  },
];

export default function Dates() {
  return (
    <section
      id="dates"
      className="
        relative w-full
        min-h-svh
        overflow-hidden
        bg-background
      "
    >
      <div
        className="
          flex min-h-svh w-full flex-col
          items-center justify-center
          gap-10
          px-5 py-28
          sm:px-8 sm:py-32
          md:px-12
          lg:h-screen lg:min-h-0
          lg:flex-row lg:justify-between
          lg:gap-8 lg:px-24 lg:py-20 lg:pt-36
        "
      >
        {/* Título */}
        <div className="w-full lg:w-[40%]">
          <h2
            className="
              bg-linear-to-r from-primary-dark to-primary-light
              bg-clip-text
              font-cormorant font-light uppercase
              leading-[0.95] tracking-[-0.04em]
              text-transparent
              text-[clamp(3.5rem,12vw,5rem)]
              sm:text-[clamp(4rem,9vw,6rem)]
              lg:text-[clamp(4rem,7vw,7rem)]
            "
          >
            Datas
            <br />
            Mar
            <br />
            Cantes
          </h2>
        </div>

        {/* Linha do tempo */}
        <div
          className="
            relative flex w-full flex-col
            gap-12
            sm:gap-14
            md:gap-16
            lg:h-full lg:min-h-150
            lg:w-[60%] lg:flex-row
            lg:justify-between lg:gap-8
          "
        >
          {dates.map((date, index) => (
            <div
              key={date.id}
              className="
                relative flex w-full
                flex-col gap-5
                sm:gap-6
                lg:w-64 lg:shrink-0 lg:gap-10
              "
            >
              {/* Imagem */}
              <div
                className="
                  relative mx-auto
                  aspect-[3/4] w-full max-w-64
                  rounded-t-full rounded-b-full
                  sm:max-w-72
                  lg:mx-0 lg:h-full lg:max-w-none lg:aspect-auto
                "
              >
                <Image
                  src={date.image}
                  alt={date.title}
                  fill
                  sizes="(max-width: 639px) 256px, (max-width: 1023px) 288px, 256px"
                  className={`
                    rounded-t-full rounded-b-full
                    object-cover 
                    ${index === 2 ? "object-[70%_50%]" : "object-[48%_50%]"}
                    transition-transform duration-700
                    hover:scale-105
                  `}
                />

                {/* Número decorativo */}
                <h1
                  aria-hidden="true"
                  className="
                    absolute bottom-2 right-2
                    px-2
                    z-100
                    font-bickham-script-pro-regular
                    text-[9rem]/[0.3]
                    text-background
                    mix-blend-difference
                    sm:text-[12rem]/[0.3]
                    lg:-bottom-1 lg:right-1
                    lg:text-[18rem]/[0.3]
                  "
                >
                  {index + 1}.
                </h1>

                <h1
                  aria-hidden="true"
                  className="
                    absolute z-9999 bottom-3 right-1
                    font-bickham-script-pro-regular
                    text-[9rem]/[0.3]
                    text-transparent
                    mix-blend-difference
                    sm:text-[12rem]/[0.3]
                    lg:bottom-0 lg:right-0
                    lg:text-[18rem]/[0.3]
                  "
                >
                  {index + 1}.
                </h1>
              </div>

              {/* Informações */}
              <div className="flex w-full flex-col items-center text-center">
                <h1 className="font-lora text-base text-primary sm:text-lg">
                  {date.date}
                </h1>

                <h2
                  className="
                    whitespace-normal
                    font-bickham-script-pro-regular
                    text-4xl text-primary-dark
                    sm:text-5xl
                    lg:whitespace-nowrap
                  "
                >
                  {date.title}
                </h2>

                {/* <p
                  className="
                    mt-2 max-w-sm
                    font-lora text-sm leading-relaxed
                    text-primary-dark/80
                    sm:text-base
                    lg:hidden
                  "
                >
                  {date.description}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}