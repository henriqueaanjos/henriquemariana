import { ReactNode } from "react";

interface LiquidGlassWrapperProps {
    children: ReactNode;
    isGlassEffect?: boolean;
    className?: string;
}

export function LiquidGlassWrapper({ children, className, isGlassEffect = true }: LiquidGlassWrapperProps) {
    const roundedClass = className?.split(" ").find((className) => className.startsWith("rounded-"));
    return (
        <div className={`${className} relative flex font-semibold overflow-hidden text-black cursor-pointer ${roundedClass ?? "rounded-4xl"} ${isGlassEffect ? "shadow-lg" : "shadow-none"} transition-all duration-400 ease-in-out `}>
            {/* <svg style={{ display: "none" }}>
                <filter
                    id="glass-distortion"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    filterUnits="objectBoundingBox"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.01"
                        numOctaves="1"
                        seed="5"
                        result="turbulence"
                    />

                    <feComponentTransfer in="turbulence" result="mapped">
                        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
                    </feComponentTransfer>

                    <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

                    <feSpecularLighting
                        in="softMap"
                        surfaceScale="5"
                        specularConstant="1"
                        specularExponent="100"
                        lightingColor="white"
                        result="specLight"
                    >
                        <fePointLight x="-200" y="-200" z="300" />
                    </feSpecularLighting>

                    <feComposite
                        in="specLight"
                        operator="arithmetic"
                        k1="0"
                        k2="1"
                        k3="1"
                        k4="0"
                        result="litImage"
                    />

                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="softMap"
                        scale="150"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg> */}
            <div
                className={`w-full h-full absolute z-0 inset-0 ${isGlassEffect && "backdrop-blur-xs"}  transition-all duration-500 overflow-hidden isolate `}
                style={{
                    filter: isGlassEffect ? "url(#glass-distortion)" : "none",
                }}></div>
            <div className={`w-full h-full z-1 absolute inset-0 ${isGlassEffect ? "bg-black/10" : "bg-black/0"}`}></div>
            <div className={`w-full h-full absolute inset-0 z-2 overflow-hidden ${roundedClass ?? "rounded-4xl"} ${isGlassEffect ? "shadow-[inset_2px_2px_1px_0_rgba(125,125,125,0.5),inset_-1px_-1px_1px_1px_rgba(125,125,125,0.5)]" : ""} transition-shadow duration-300`}></div>
            <div className="z-3 w-full h-full">
                {children}
            </div>
        </div>
    );
}