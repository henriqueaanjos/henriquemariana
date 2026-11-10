
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
        relative w-full min-h-svh
        overflow-hidden bg-background
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
          xl:flex-row xl:justify-between
          xl:gap-8 xl:px-16 xl:py-24
          2xl:px-24
        "
      >
        {/* Título */}
        <div className="w-full xl:w-[30%]">
          <h2
            className="
              bg-linear-to-r from-primary-dark to-primary-light
              bg-clip-text
              font-cormorant font-light uppercase
              leading-[0.95] tracking-[-0.04em]
              text-transparent
              text-[clamp(3.5rem,12vw,5rem)]
              sm:text-[clamp(4rem,9vw,6rem)]
              xl:text-[clamp(4rem,6vw,7rem)]
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
            relative grid w-full min-w-0
            grid-cols-1
            gap-12
            sm:grid-cols-3 sm:gap-5
            md:gap-8
            xl:w-[70%] xl:gap-6
          "
        >
          {dates.map((date, index) => (
            <div
              key={date.id}
              className="
                relative flex min-w-0 w-full
                flex-col gap-5
                sm:gap-6
                xl:gap-8
              "
            >
              {/* Imagem */}
              <div
                className="
                  relative mx-auto w-full max-w-64
                  aspect-[3/4]
                  rounded-full
                  sm:max-w-none
                "
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <Image
                    src={date.image}
                    alt={date.title}
                    fill
                    sizes="
                      (max-width: 639px) 256px,
                      (max-width: 1279px) 30vw,
                      22vw
                    "
                    className={`
                      object-cover
                      ${
                        index === 2
                          ? "object-[70%_50%]"
                          : "object-[48%_50%]"
                      }
                      transition-transform duration-700
                      hover:scale-105
                    `}
                  />
                </div>

                {/* Número decorativo */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute bottom-2 right-2 z-10
                    px-2
                    font-bickham-script-pro-regular
                    text-[9rem]/[0.3]
                    text-background
                    mix-blend-difference
                    sm:text-[clamp(7rem,11vw,12rem)]/[0.3]
                    xl:text-[clamp(9rem,12vw,18rem)]/[0.3]
                  "
                >
                  {index + 1}.
                </span>
              </div>

              {/* Informações */}
              <div className="flex w-full min-w-0 flex-col items-center text-center">
                <h3 className="font-lora text-base text-primary sm:text-lg">
                  {date.date}
                </h3>

                <h4
                  className="
                    whitespace-normal
                    font-bickham-script-pro-regular
                    text-4xl text-primary-dark
                    sm:text-3xl
                    md:text-4xl
                    xl:text-4xl
                    2xl:text-5xl
                  "
                >
                  {date.title}
                </h4>

                {/*
                <p
                  className="
                    mt-2 max-w-sm
                    font-lora text-sm leading-relaxed
                    text-primary-dark/80
                    sm:text-base
                  "
                >
                  {date.description}
                </p>
                */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
