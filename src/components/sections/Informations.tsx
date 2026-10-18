import {
    Clock,
    MapPin,
    Camera,
    DeviceMobile,
    Dress,
    Wine,
} from "@phosphor-icons/react/ssr";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { Lora } from "next/font/google";



export function Information() {
    return (
        <section
            id="info"
            className="
                snap-start
                snap-always
                h-screen
                w-screen
                relative
                overflow-hidden
                bg-background
                flex
                flex-col
                items-center
                justify-center
                px-6
                pt-14
                bg-[url(/AYM_8791-2.jpeg)] bg-cover bg-center bg-no-repeat
            "
        >
             <div className="w-full h-full absolute inset-0 z-0 bg-linear-to-t from-olive-900/90 to-olive-900/10 to-65%" />
            {/* Decoração de fundo */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-40
                    bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_45%)]
                "
            />

            {/* Conteúdo */}
            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    w-full
                    max-w-6xl
                    flex-col
                    items-center
                    justify-center
                    gap-6
                "
            >
                {/* Título */}
                <div className="z-1 flex w-full flex-col items-center ">
                    <div className="border-b-2 border-primary pb-1 px-2">
                        <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">Informações</h1>
                    </div>
                    <h5 className="text-primary-dark text-sm  uppercase font-lora mt-2">
                        {/* ADICIONE SUAS FOTOS CONOSCO, E AS FOTOS QUE TIRAR DO GRANDE DIA! */}
                        Para que possamos aproveitar esse dia tão especial juntos,
                        separamos algumas informações importantes para vocês.
                    </h5>
                </div>

                {/* Local e horários */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Cerimônia */}
                    <LiquidGlassWrapper
                        className="rounded-3xl p-5 bg-black/30"
                    >
                        <div className="flex flex-col items-center text-center">
                            <MapPin
                                size={28}
                                weight="duotone"
                                className="mb-2 text-primary"
                            />

                            <h3 className="text-xl font-bold uppercase text-primary-light font-cormorant">
                                Cerimônia
                            </h3>

                            <p className="mt-2 text-sm text-primary-light/70 font-lora">
                                09 de janeiro de 2027
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm font-light text-primary-light/70 font-lora">
                                <Clock size={16} />
                                <span>15h45</span>
                            </div>

                            <p className="mt-2 text-sm text-primary-light/70 font-lora">
                                Ondara Garden
                            </p>

                            <p className="text-xs text-primary-light/50 font-lora">
                                R. Mario Gonçalves, 129 - Chacára Cachoeira, Campo Grande - MS
                            </p>
                        </div>
                    </LiquidGlassWrapper>

                    {/* Festa */}
                    <LiquidGlassWrapper
                        className="rounded-3xl p-5 bg-black/30"
                        isGlassEffect={true}
                    >
                        <div className="flex flex-col items-center text-center">
                            <MapPin
                                size={28}
                                weight="duotone"
                                className="mb-2 text-primary"
                            />

                            <h3 className="text-xl font-bold uppercase text-primary-light font-cormorant">
                                Recepção & Festa
                            </h3>

                            <p className="mt-2 text-sm font text-primary-light/70 font-lora">
                                Após a cerimônia
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm font-light text-primary-light/70 font-lora">
                                <Clock size={16} />
                                <span>17:00</span>
                            </div>

                            <p className="mt-2 text-sm text-primary-light/70 font-lora">
                                Ondara Buffet Executive
                            </p>

                            <p className="text-xs text-primary-light/50 font-lora">
                                R. Mario Gonçalves, 129 - Chacára Cachoeira, Campo Grande - MS
                            </p>
                        </div>
                    </LiquidGlassWrapper>
                </div>

                {/* Lembretes */}
                <div className="w-full">
                    <h3 className="mb-3 text-center text-sm font-bold uppercase text-primary-light tracking-widest  font-cormorant">
                        Alguns lembretes
                    </h3>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                        {/* Dress code */}
                        <LiquidGlassWrapper
                            className="rounded-3xl p-5 bg-black/30"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Dress
                                    size={28}
                                    weight="duotone"
                                    className="mb-1 text-primary"
                                />

                                <p className="text-base font-bold uppercase text-primary-light font-cormorant">
                                    Traje Social
                                </p>

                                <p className="mt-1 text-sm leading-tight text-primary-light/60 font-lora">
                                    Evitem jeans, macacões ou trajes casuais.
                                </p>
                            </div>
                        </LiquidGlassWrapper>

                        {/* Celular */}
                        <LiquidGlassWrapper
                            className="rounded-3xl p-5 bg-black/30"
                        >
                            <div className="flex flex-col items-center text-center">
                                <DeviceMobile
                                    size={28}
                                    weight="duotone"
                                    className="mb-1 text-primary"
                                />

                                <p className="text-base font-bold uppercase text-primary-light font-cormorant">
                                    Entrada da noiva
                                </p>

                                <p className="mt-1 text-sm leading-tight text-primary-light/60 font-lora">
                                    Pedimos, com carinho, que guardem os celulares
                                    nesse momento.
                                </p>
                            </div>
                        </LiquidGlassWrapper>

                        {/* Branco */}
                        <LiquidGlassWrapper
                            className="rounded-3xl p-5 bg-black/30"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Dress
                                    size={28}
                                    weight="duotone"
                                    className="mb-1 text-primary"
                                />

                                <p className="text-base font-bold uppercase text-primary-light font-cormorant">
                                    Cores
                                </p>

                                <p className="mt-1 text-sm leading-tight text-primary-light/60 font-lora">
                                    Branco, off-white, marfim e tons muito claros
                                    ficam reservados para a noiva.
                                </p>
                            </div>
                        </LiquidGlassWrapper>

                        {/* Fotógrafo */}
                        <LiquidGlassWrapper
                            className="rounded-3xl p-5 bg-black/30"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Camera
                                    size={28}
                                    weight="duotone"
                                    className="mb-1 text-primary"
                                />

                                <p className="text-base font-bold uppercase text-primary-light font-cormorant">
                                    Fotografia
                                </p>

                                <p className="mt-1 text-sm leading-tight text-primary-light/60 font-lora">
                                    Deixem o fotógrafo oficial registrar cada
                                    momento sem interferências.
                                </p>
                            </div>
                        </LiquidGlassWrapper>
                        {/* Alimentos */}
                        <LiquidGlassWrapper
                            className="rounded-3xl p-5 bg-black/30"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Wine
                                    size={28}
                                    weight="duotone"
                                    className="mb-1 text-primary"
                                />

                                <p className="text-base font-bold uppercase text-primary-light font-cormorant">
                                    Alimentos & bebidas
                                </p>

                                <p className="mt-1 text-sm leading-tight text-primary-light/60 font-lora">
                                    Para manter o espaço organizado, pedimos gentilmente que não levem alimentos ou bebidas.
                                </p>
                            </div>
                        </LiquidGlassWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
}