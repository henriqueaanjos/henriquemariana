import { Countdown } from "../Countdown";
import { Header } from "../Header";

export function Hero() {
  return (
    <section
      id="hero"
      className="
        relative flex
        min-h-[100svh] w-full
        snap-start
        bg-[url('/AYM_8379_3.jpeg')]
        bg-cover bg-bottom bg-no-repeat
        overflow-hidden
      "
    >
      {/* Gradiente para melhorar a legibilidade */}
      <div
        className="
          absolute inset-0 z-0
          bg-linear-to-t
          from-background/0
          via-background/10 via-42%
          to-background/50 to-57%
        "
      />

      {/* Conteúdo principal */}
      <div
        className="
          relative z-10 grow
          flex flex-col items-center justify-center
          w-full min-w-0
          px-4 py-28
          sm:px-6
          md:px-8
          -mt-12
          sm:-mt-20
          md:-mt-40
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
              text-[clamp(2.8rem,10vw,5rem)]
              leading-tight
              whitespace-nowrap
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
              xl:text-4xl
            "
          >
            09.01.2027
          </h5>
        </div>

        <div className="w-full max-w-full">
          <Countdown />
        </div>
      </div>
    </section>
  );
}