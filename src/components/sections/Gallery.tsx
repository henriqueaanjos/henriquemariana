import Link from "next/link";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { PhotosGrid } from "../PhotosGrid";

export function Gallery() {
    return (
        <section
            id="gallery"
            className="
        relative flex min-h-svh w-full flex-col
        items-center overflow-hidden
        bg-[url('/AYM_8721.JPG')] bg-cover bg-top bg-no-repeat
        px-4 pt-28 pb-8
        sm:px-6 sm:pt-32 sm:pb-10
        lg:h-screen lg:min-h-0 lg:px-8 lg:pt-36 lg:pb-14
      "
        >
            {/* CABEÇALHO */}
            <div className="relative z-10 flex w-full shrink-0 flex-col items-center text-center">
                <div className="border-b-2 border-primary px-2 pb-1">
                    <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-light sm:text-3xl">
                        Galeria
                    </h1>
                </div>

                <h5 className="mt-2 max-w-3xl font-lora text-xs uppercase leading-relaxed text-primary-light sm:text-sm">
                    Adicione suas fotos conosco, e as fotos que tirar do grande dia!
                </h5>
            </div>

            {/* GALERIA */}
            <div
                className="
          relative z-10 mt-6 w-full
          sm:mt-7
          lg:mt-7 lg:min-h-0 lg:flex-1
        "
            >
                <PhotosGrid />
            </div>

            {/* BOTÃO DA GALERIA COMPLETA */}
            <div className="relative z-10 mt-6 flex shrink-0 items-center justify-center sm:mt-8 lg:mt-11">
                <LiquidGlassWrapper className="relative h-full w-full rounded-lg bg-primary/40">
                    <Link
                        href="/gallery"
                        className="z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 px-4 py-2"
                    >
                        <p className="whitespace-nowrap font-lora text-xs font-light uppercase text-background sm:text-sm">
                            Ver galeria completa
                        </p>
                    </Link>
                </LiquidGlassWrapper>
            </div>
        </section>
    );
}