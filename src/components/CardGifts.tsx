import Link from "next/link";
import Image from "next/image";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";

type CardGiftsProps = {
    href: string;
    imageSrc: string;
    imageAlt: string;
    description: string;
    active?: boolean;
};

export function CardGifts({ href, imageSrc, imageAlt, description, active = true }: CardGiftsProps) {
    const isActive = active && href !== "";
    return (
        <LiquidGlassWrapper
            className={`bg-black/20 rounded-3xl w-full flex-1  hover:scale-105 transition-all duration-500 p-6
                ${!isActive ? "opacity-70 pointer-events-none" : "opacity-100 cursor-pointer"}    
            `}
        >
            {isActive ? (
                <Link
                    href={href}
                    className="flex flex-col w-full h-full items-center"
                    target="_blank"
                >
                    <div className="w-full h-32 flex items-center justify-center px-8">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={500}
                            height={200}
                            sizes="100vw"
                            className="w-full h-auto max-h-full object-contain invert"
                        />
                    </div>

                    <p className="font-lora text-primary-light/70 font-light text-sm text-center px-4 pb-5">
                        {description}
                    </p>
                </Link>
            ) :

                <div
                    className="flex flex-col w-full h-full items-center"
                >
                    <h3 className="text-primary absolute font-lora uppercase z-50">Em breve</h3>
                    <div className="w-full h-32 flex items-center justify-center px-8">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={500}
                            height={200}
                            sizes="100vw"
                            className="w-full h-auto max-h-full object-contain invert"
                        />
                    </div>

                    <p className="font-lora text-primary-light/70 font-light text-sm text-center px-4 pb-5">
                        {description}
                    </p>
                </div>

            }
        </LiquidGlassWrapper>
    )
}