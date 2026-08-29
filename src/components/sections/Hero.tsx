import { Countdown } from "../Countdown";
import { Header } from "../Header";

export function Hero() {
    return (
        <section
            id="hero"
            className="h-screen w-screen snap-start bg-[url(/AYM_8379_3.jpeg)] bg-cover bg-bottom bg-no-repeat flex relative"
        >
            <div className="w-full h-full absolute z-0 bg-linear-to-t from-background/0 to-background/50 to-57% via-background/10 via-42%" />
            <div className="z-1 p-8 flex flex-col items-center justify-center -mt-40 relative grow">
                <div className="w-full flex flex-col items-center mb-24">
                    <h1 className="font-bickham-script-pro-regular text-primary-dark 
                        md:-mb-12 md:text-[7rem]
                        lg:-mb-14 lg:text-[8rem]
                        xl:-mb-16 xl:text-[10rem]
                    ">
                        Mariana e Henrique
                    </h1>
                    <h5 className="text-primary-dark 
                        md:text-2xl
                        xl:text-4xl
                        font-cormorant
                    ">
                        09.01.2027
                    </h5>
                </div>
                <Countdown />
            </div>
        </section>
    )
}