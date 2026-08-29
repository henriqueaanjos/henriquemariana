import Input from "../Input";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import Textarea from "../Textarea";

export function Recado() {
    return (
        <section
            id="message"
            className=" min-h-screen max-h-screen w-screen snap-start bg-[url(/AYM_8721.JPG)] bg-cover bg-top bg-no-repeat flex relative flex-col items-center pt-36 px-8 pb-14"
        >
            <div className="z-1 flex w-full flex-col items-center">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-light uppercase font-cormorant">Recado</h1>
                </div>
                <h5 className="text-primary-light text-sm uppercase mt-2 font-lora">DEIXE SUA MENSAGEM DE CARINHO PARA OS NOIVOS</h5>
            </div>
            <div className="mt-7 w-full flex-1 min-h-0 pb-6 flex flex-row-reverse">
                <div className="w-full flex flex-row justify-center gap-4">
                    <LiquidGlassWrapper className="w-[30%] bg-black/40 rounded-3xl ">
                        <div className="w-full h-full flex flex-col items-center gap-8 p-4">
                            <div className="border-b-2 border-primary pb-1 px-2">
                                <h1 className="text-base text-primary-light uppercase font-cormorant">Deixe o seu recado</h1>
                            </div>
                            <div className="w-full h-full grow flex flex-col gap-4">
                                <Input
                                    label="Nome"
                                    placeholder="Digite seu nome completo"
                                />
                                <Textarea
                                    label="Mensagem"
                                    placeholder="Digite sua mensagem"
                                />
                            </div>
                            <div className="w-full">
                                <LiquidGlassWrapper className="bg-primary-dark/70 rounded-lg w-full h-full col-span-1 row-span-1 relative">
                                    <button className="px-3 py-2 h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10">
                                        <p className="text-background uppercase font-lora text-sm">Enviar</p>
                                    </button>
                                </LiquidGlassWrapper>
                            </div>
                        </div>
                    </LiquidGlassWrapper>
                    <LiquidGlassWrapper className="w-[50%] bg-black/40 rounded-3xl ">
                        <div className="w-full h-full flex flex-col items-center gap-8 p-4">
                            <div className="border-b-2 border-primary pb-1 px-2">
                                <h1 className="text-base text-primary-light uppercase font-cormorant">Recados Recebidos</h1>
                            </div>
                            <div className="w-full h-full flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto rounded-3xl">
                                {Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).map((_, index) => (
                                    <LiquidGlassWrapper className="bg-black/30 rounded-3xl w-full shrink-0">
                                        <div className="flex flex-row gap-4 px-5 py-3 ">
                                            <img src="https://ui-avatars.com/api/?background=random&name=John+Doe" className="min-w-10 max-w-10 aspect-square rounded-full" />
                                            <div className="flex flex-col gap-4 pt-2 justify-center">
                                                <p className="text-primary-light uppercase text-xs font-bold font-cormorant">John Doe</p>
                                                <p className="text-primary-light text-wrap text-sm font-lora">
                                                    ESTAMOS MUITO FELIZES DE PODER DIVIDIR ESSE MOMENTO COM VOCÊS! SAIBAM QUE SÃO MUITO ESPECIAIS PARA A GENTE!
                                                    AMAMOS MUITO VOCÊS!</p>
                                            </div>
                                        </div>
                                    </LiquidGlassWrapper>
                                ))}

                            </div>
                        </div>
                    </LiquidGlassWrapper>
                </div>
            </div>
        </section>
    )
}