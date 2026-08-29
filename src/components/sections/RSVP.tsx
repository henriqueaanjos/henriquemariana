import Input from "../Input";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function RSVP() {
    return (
        <section
            id="rsvp"
            className="h-screen w-screen snap-start bg-[url(/AYM_8521_5.jpeg)] bg-cover bg-top bg-no-repeat flex relative flex-col items-center pt-36 px-8 pb-14"
        >
            <div className="z-1 flex w-full flex-col items-center">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">RSVP</h1>
                </div>
                <h5 className="text-primary-dark text-sm uppercase mt-2 font-lora">CONFIRME A SUA PRESENÇA AGORA!</h5>
            </div>
            <div className="mt-7 w-full h-full flex flex-row-reverse">
                <div className="w-1/2  flex justify-start items-center">
                    <LiquidGlassWrapper className="w-[50%] bg-black/40 rounded-3xl ">
                        <div className="w-full h-full flex flex-col items-center gap-20 p-4">
                            <div className="border-b-2 border-primary pb-1 px-2">
                                <h1 className="text-base text-primary-light uppercase font-cormorant">Confirme a presença</h1>
                            </div>
                            <Input
                                label="Código de Confirmação"
                                placeholder="Digite o código"
                            />
                            <LiquidGlassWrapper className="bg-primary-dark/70 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                                <button className="px-3 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10">
                                    <p className="text-background uppercase font-lora text-sm">Validar</p>
                                </button>
                            </LiquidGlassWrapper>
                        </div>
                    </LiquidGlassWrapper>
                </div>
            </div>
        </section>
    )
}