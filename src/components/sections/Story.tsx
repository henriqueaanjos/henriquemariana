import { Header } from "../Header";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function Story() {
    return (
        <section
            id="story"
            className="snap-start snap-always h-svh w-screen bg-[url(/AYM_8714-5.jpeg)] bg-cover bg-bottom bg-no-repeat flex relative"
        >
            <div className="w-full h-full absolute z-0 bg-linear-to-l from-black/70 via-black/15 via-40% to-black/0 to-85% " />
            <div className="z-1 flex w-full flex-col items-center mt-36 ">
                <div className="border-b-2 border-primary pb-1 px-2">
                    <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">Nossa História</h1>
                </div>

                <div className="flex flex-col grow w-full items-end justify-end p-8">
                    {/* <div className="max-w-xl p-8 bg-black/5 backdrop-blur-[1px] backdrop-saturate-150 rounded-3xl "
                        style={{
                            filter: "url(#glass-distortion)",
                        }}> */}
                        <LiquidGlassWrapper className="max-w-xl p-8 rounded-4xl">
                            <p className="text-primary-light text-sm 2xl:text-lg font-lora font-thin leading-snug">
                                Éramos apenas dois adolescentes, mas um de nós já tinha bem claro o que queria para a vida!
                                <br /><br />
                                O Henrique, por alguns anos era apaixonado pela Mariana, mas em todas as oportunidades que ele tentava, a porta do coração dela estava fechada!
                                <br /><br />
                                Mas, como diz o ditado: ”Água mole, pedra dura, tanto bate até que fura!”. A perseverança dele foi recompensada! Em 03.12.2023, nós começamos a nossa história juntos.
                                <br /><br />
                                Passamos por muitos momentos felizes, de aprendizado e de muito companheirismo um com o outro nesse período!
                                <br /><br />
                                A admiração, o carinho, o respeito e principalmente o nosso amor foi aumentando tanto, que estávamos certos de que queríamos dividir nossa vida um com o outro!
                                <br /><br />
                                Então no dia 03.04.2026, o Henrique recebeu o ’Sim’, que ele mais queria ouvir naquele momento!
                                <br /><br />
                                Agora estamos nos preparando para um dos dias mais especiais de nossas vidas, e gostaríamos muito de dividir isso com vocês!</p>
                        </LiquidGlassWrapper>
                    {/* </div> */}
                    <p className="text-primary-light mt-8 font-cormorant">Com muito amor,</p>
                    <h3 className="text-primary-light font-bold text-5xl font-bickham-script-pro-regular">Mariana e Henrique</h3>
                </div>
            </div>
        </section>
    )
}