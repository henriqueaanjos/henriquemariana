import { LiquidGlassWrapper } from "./LiquidGlassWrapper";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
}



export function Button({ children, variant="primary", ...rest }: ButtonProps) {
    return (
        <LiquidGlassWrapper className={`${variant === "primary" ? "bg-primary/70 hover:bg-primary/60" : "bg-background/40 hover:bg-background/50"} bg-background/20 rounded-xl w-full h-full py-2 px-4 relative`}>
            <button
                className="h-full w-full grow flex flex-col items-center justify-center gap-2  cursor-pointer z-10 hover:scale-105 transition-transform duration-300"
                {...rest}
            >
                {children}
            </button>
        </LiquidGlassWrapper>
    )
}