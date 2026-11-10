
import Image from "next/image";
import { Countdown } from "../Countdown";

export function Hero() {
  return (
    <section
      id="hero"
      className="
        relative flex
        min-h-[100svh] w-full
        overflow-hidden
        bg-background
      "
    >
      {/* Imagem de fundo otimizada */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/AYM_8379_8.jpg"
          alt=""
          fill
          priority={false}
          preload
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
          aria-hidden="true"
        />
      </div>

      {/* Gradiente para melhorar a legibilidade */}
      <div
        className="
          absolute inset-0 z-10
          bg-linear-to-t
          from-background/0
          via-background/10 via-42%
          to-background/50 to-57%
        "
      />

      {/* Conteúdo principal */}
      <div
        className="
          relative z-20 grow
          flex flex-col items-center justify-center
          w-full min-w-0
          px-4 py-28
          sm:px-6
          md:px-8
          -mt-12
        "
      >
        <div
          className="
            mb-12
            sm:mb-16
            md:mb-24
            flex w-full flex-col items-center
            text-center
          "
        >
          <h1
            className="
              max-w-full
              font-bickham-script-pro-regular
              text-primary-dark
              text-[4rem]
              leading-tight
              sm:whitespace-nowrap
              md:-mb-12 md:text-[7rem]
              lg:-mb-14 lg:text-[8rem]
              xl:-mb-16 xl:text-[10rem]
            "
          >
            Mariana e Henrique
          </h1>

          <h5
            className="
              font-cormorant
              text-primary-dark
              text-xl
              sm:text-2xl
              lg:text-4xl
            "
          >
            09.01.2027
          </h5>
        </div>

        <div className="w-full max-w-full mt-14 sm:mt-10 md:mt-0 lg:-mt-2 xl:-mt-8">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
