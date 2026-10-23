import {
  Clock,
  MapPin,
  Camera,
  DeviceMobile,
  Dress,
  Wine,
} from "@phosphor-icons/react/ssr";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function Information() {
  return (
    <section
      id="info"
      className="
        relative flex min-h-svh w-full flex-col
        items-center justify-center
        snap-start snap-always
        overflow-hidden
        bg-background
        bg-[url('/AYM_8791-2.jpeg')]
        bg-cover bg-center bg-no-repeat
        px-4 py-28
        sm:px-6 sm:py-32
        lg:h-screen lg:min-h-0 lg:px-6 lg:py-14
      "
    >
      {/* Sobreposição para melhorar a leitura */}
      <div className="absolute inset-0 z-0 bg-linear-to-t from-olive-900/90 to-olive-900/10 to-65%" />

      {/* Decoração de fundo */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_45%)]
          opacity-40
        "
      />

      {/* Conteúdo */}
      <div
        className="
          relative z-10 flex w-full max-w-6xl flex-col
          items-center justify-center gap-6
          lg:h-full
        "
      >
        {/* Título */}
        <div className="flex w-full flex-col items-center text-center">
          <div className="border-b-2 border-primary px-2 pb-1 mt-2 sm:mt-8">
            <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-dark sm:text-3xl">
              Informações
            </h1>
          </div>

          <h5
            className="
              mt-3 max-w-3xl
              font-lora text-xs uppercase leading-relaxed
              text-primary-dark
              sm:text-sm
              lg:text-sm
            "
          >
            Para que possamos aproveitar esse dia tão especial juntos,
            separamos algumas informações importantes para vocês.
          </h5>
        </div>

        {/* Local e horários */}
        <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {/* Cerimônia */}
          <LiquidGlassWrapper className="rounded-3xl bg-black/70 p-4 sm:p-5">
            <div className="flex flex-col items-center text-center">
              <MapPin
                size={28}
                weight="duotone"
                className="mb-2 text-primary"
              />

              <h3 className="font-cormorant text-xl font-bold uppercase text-primary-light">
                Cerimônia
              </h3>

              <p className="mt-2 font-lora text-sm text-primary-light/70">
                09 de janeiro de 2027
              </p>

              <div className="mt-2 flex items-center gap-2 font-lora text-sm font-light text-primary-light/70">
                <Clock size={16} />
                <span>15h45</span>
              </div>

              <p className="mt-2 font-lora text-sm text-primary-light/70">
                Ondara Garden
              </p>

              <p className="mt-1 max-w-sm font-lora text-xs leading-relaxed text-primary-light/50">
                R. Mario Gonçalves, 129 - Chácara Cachoeira, Campo Grande - MS
              </p>
            </div>
          </LiquidGlassWrapper>

          {/* Recepção e festa */}
          <LiquidGlassWrapper
            className="rounded-3xl bg-black/70 p-4 sm:p-5"
            isGlassEffect={true}
          >
            <div className="flex flex-col items-center text-center">
              <MapPin
                size={28}
                weight="duotone"
                className="mb-2 text-primary"
              />

              <h3 className="font-cormorant text-xl font-bold uppercase text-primary-light">
                Recepção & Festa
              </h3>

              <p className="mt-2 font-lora text-sm text-primary-light/70">
                Após a cerimônia
              </p>

              <div className="mt-2 flex items-center gap-2 font-lora text-sm font-light text-primary-light/70">
                <Clock size={16} />
                <span>17:00</span>
              </div>

              <p className="mt-2 font-lora text-sm text-primary-light/70">
                Ondara Buffet Executive
              </p>

              <p className="mt-1 max-w-sm font-lora text-xs leading-relaxed text-primary-light/50">
                R. Mario Gonçalves, 129 - Chácara Cachoeira, Campo Grande - MS
              </p>
            </div>
          </LiquidGlassWrapper>
        </div>

        {/* Lembretes */}
        <div className="w-full">
          <h3 className="mb-3 text-center font-cormorant text-sm font-bold uppercase tracking-widest text-primary-light sm:text-base">
            Alguns lembretes
          </h3>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
            {/* Traje social */}
            <LiquidGlassWrapper className="rounded-2xl bg-black/70 p-3 sm:rounded-3xl sm:p-4 lg:p-5">
              <div className="flex h-full flex-col items-center text-center">
                <Dress
                  size={28}
                  weight="duotone"
                  className="mb-1 shrink-0 text-primary"
                />

                <p className="font-cormorant text-sm font-bold uppercase text-primary-light sm:text-base">
                  Traje Social
                </p>

                <p className="mt-1 font-lora text-xs leading-relaxed text-primary-light/60 sm:text-sm">
                  Evitem jeans, macacões ou trajes casuais.
                </p>
              </div>
            </LiquidGlassWrapper>

            {/* Entrada da noiva */}
            <LiquidGlassWrapper className="rounded-2xl bg-black/70 p-3 sm:rounded-3xl sm:p-4 lg:p-5">
              <div className="flex h-full flex-col items-center text-center">
                <DeviceMobile
                  size={28}
                  weight="duotone"
                  className="mb-1 shrink-0 text-primary"
                />

                <p className="font-cormorant text-sm font-bold uppercase text-primary-light sm:text-base">
                  Entrada da noiva
                </p>

                <p className="mt-1 font-lora text-xs leading-relaxed text-primary-light/60 sm:text-sm">
                  Pedimos, com carinho, que guardem os celulares nesse momento.
                </p>
              </div>
            </LiquidGlassWrapper>

            {/* Cores */}
            <LiquidGlassWrapper className="rounded-2xl bg-black/70 p-3 sm:rounded-3xl sm:p-4 lg:p-5">
              <div className="flex h-full flex-col items-center text-center">
                <Dress
                  size={28}
                  weight="duotone"
                  className="mb-1 shrink-0 text-primary"
                />

                <p className="font-cormorant text-sm font-bold uppercase text-primary-light sm:text-base">
                  Cores
                </p>

                <p className="mt-1 font-lora text-xs leading-relaxed text-primary-light/60 sm:text-sm">
                  Branco, off-white, marfim e tons muito claros ficam
                  reservados para a noiva.
                </p>
              </div>
            </LiquidGlassWrapper>

            {/* Fotografia */}
            <LiquidGlassWrapper className="rounded-2xl bg-black/70 p-3 sm:rounded-3xl sm:p-4 lg:p-5">
              <div className="flex h-full flex-col items-center text-center">
                <Camera
                  size={28}
                  weight="duotone"
                  className="mb-1 shrink-0 text-primary"
                />

                <p className="font-cormorant text-sm font-bold uppercase text-primary-light sm:text-base">
                  Fotografia
                </p>

                <p className="mt-1 font-lora text-xs leading-relaxed text-primary-light/60 sm:text-sm">
                  Deixem o fotógrafo oficial registrar cada momento sem
                  interferências.
                </p>
              </div>
            </LiquidGlassWrapper>

            {/* Alimentos e bebidas */}
            <LiquidGlassWrapper className="col-span-2 rounded-2xl bg-black/70 p-3 sm:col-span-1 sm:rounded-3xl sm:p-4 lg:p-5">
              <div className="flex h-full flex-col items-center text-center">
                <Wine
                  size={28}
                  weight="duotone"
                  className="mb-1 shrink-0 text-primary"
                />

                <p className="font-cormorant text-sm font-bold uppercase text-primary-light sm:text-base">
                  Alimentos & bebidas
                </p>

                <p className="mt-1 font-lora text-xs leading-relaxed text-primary-light/60 sm:text-sm">
                  Para manter o espaço organizado, pedimos gentilmente que não
                  levem alimentos ou bebidas.
                </p>
              </div>
            </LiquidGlassWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}