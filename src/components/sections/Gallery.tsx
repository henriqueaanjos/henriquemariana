import Link from "next/link";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { PhotosGrid } from "../PhotosGrid";

export function Gallery() {
    return (
        <section
            id="gallery"
            className="h-screen w-screen snap-start bg-[url(/AYM_8721.JPG)] bg-cover bg-top bg-no-repeat flex relative flex-col items-center pt-36 px-8 pb-14"
        >
            <div className="z-1 flex w-full flex-col items-center">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-light uppercase font-cormorant">Galeria</h1>
                </div>
                <h5 className="text-primary-light text-sm  uppercase font-lora mt-2">
                    {/* ADICIONE SUAS FOTOS CONOSCO, E AS FOTOS QUE TIRAR DO GRANDE DIA! */}
                    Adicione suas fotos conosco, e as fotos que tirar do grande dia!
                </h5>
            </div>
            <div className="mt-7 w-full h-full ">
                <PhotosGrid />
            </div>
            <div className="flex items-center mt-11">
                <LiquidGlassWrapper className="bg-primary/40 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                    <Link href="/gallery" className="px-4 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10">
                        <p className="text-background uppercase font-lora text-sm font-light">Ver galeria completa</p>
                    </Link>
                </LiquidGlassWrapper>
            </div>
        </section>
    )
}