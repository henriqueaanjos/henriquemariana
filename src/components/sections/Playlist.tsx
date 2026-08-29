import Input from "../Input";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function Playlist() {
    return (
        <section
            id="playlist"
            className="h-screen w-screen snap-start bg-[url(/AYM_9074_1.jpeg)] bg-cover bg-top bg-no-repeat flex relative flex-col items-center pt-36 px-8 pb-14"
        >
            <div className="z-1 flex w-full flex-col items-center">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-light uppercase font-cormorant">Playlist</h1>
                </div>
                <h5 className="text-primary-light text-sm uppercase mt-2 font-lora">ESCOLHA E SUGIRA MÚSICAS PARA O NOSSO GRANDE DIA!</h5>
            </div>
            <div className="mt-7 w-full h-full flex flex-row-reverse ">
                <div className="w-[50%] h-full ">
                    <LiquidGlassWrapper className="bg-background/20 rounded-3xl h-full">
                        <div className="h-full flex flex-col items-center p-4">
                            <div className="border-b-2 border-primary pb-1 px-2">
                                <h1 className="text-base text-primary-light uppercase font-cormorant">Selecione a Música</h1>
                            </div>
                            <div className="w-full h-full grow flex flex-col gap-4">
                                <Input 
                                    label="Pesquisa"
                                    placeholder="Digite o nome da música"
                                />
                                <LiquidGlassWrapper className="grow bg-background/20 h-full rounded-3xl">
                                    <h1>Ranking</h1>
                                </LiquidGlassWrapper>
                            </div>
                        </div>
                    </LiquidGlassWrapper>
                </div>
            </div>
        </section>
    )
}